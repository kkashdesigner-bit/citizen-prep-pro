import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserProfile, GOAL_TO_LEVEL } from '@/hooks/useUserProfile';
import { Question, ExamLevel, LANGUAGE_TO_DB, DB_CATEGORIES, getCorrectAnswerText } from '@/lib/types';
import { calculateNextReview, getQualityFromResult, type SRSCard } from '@/lib/spaced-repetition';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export type QuizMode = 'exam' | 'study' | 'training' | 'demo' | 'revision';

export interface UseQuizOptions {
  /** Single category for category training */
  category?: string | null;
  /** Subcategory filter (granular drill — Premium) */
  subcategory?: string | null;
  /** Exam level filter — uses exam_category field */
  level?: ExamLevel;
  /** Quiz mode — determines question count, saving, feedback */
  mode?: QuizMode;
  /** Mini-quiz mode: 5 questions, no timing */
  isMiniQuiz?: boolean;
  /** Optional explicit question cap from route/query params */
  questionLimit?: number;
  /** Retry counter — incrementing triggers a re-fetch of fresh questions */
  retryKey?: number;
  /** Parcours class ID — fetch class-specific questions */
  classId?: string | null;
  /** Specific question IDs to load (for "Refaire l'examen" / "Révision des erreurs") */
  retakeIds?: number[] | null;
  /** Only show questions the user has never answered before */
  freshOnly?: boolean;
  /** Hard mode — serve statistically hardest questions (lowest global correct rate) */
  hardMode?: boolean;
  /** Adaptive mode — interleave hard questions proportionally to session accuracy */
  adaptive?: boolean;
}

const DEMO_QUESTIONS_PER_EXAM = 20;

/** Map UI language codes to TSV filenames in /public/ (converted from XLSX;
 * the 'xlsx' package was removed — high-severity vulnerability, no fix available) */
const LANG_TO_TSV: Record<string, string> = {
  ar: '/demo_questions%20ar.tsv',
  en: '/demo_questions%20en-US.tsv',
  es: '/demo_questions%20es-ES.tsv',
  pt: '/demo_questions%20pt-PT.tsv',
  tr: '/demo_questions%20tr.tsv',
  zh: '/demo_questions%20zh-Hans.tsv',
};

/** Map a row array (from CSV or TSV) to a Question object */
function rowToQuestion(cols: string[], idx: number): Question {
  return {
    id: idx + 9000,
    question_text: cols[0]?.trim() || '',
    option_a: cols[1]?.trim() || '',
    option_b: cols[2]?.trim() || '',
    option_c: cols[3]?.trim() || '',
    option_d: cols[4]?.trim() || '',
    correct_answer: cols[5]?.trim() || '',
    explanation: cols[6]?.trim() || '',
    language: cols[7]?.trim() || 'fr',
    category: cols[8]?.trim() || 'Principles and values of the Republic',
    subcategory: null,
    level: 'CSP' as ExamLevel,
    question_translated: null,
    option_a_translated: null,
    option_b_translated: null,
    option_c_translated: null,
    option_d_translated: null,
  } satisfies Question;
}

/** Parse the semicolon-delimited demo_questions.csv into Question objects */
async function parseDemoCSV(): Promise<Question[]> {
  const res = await fetch('/demo_questions.csv');
  const text = await res.text();
  const lines = text.trim().split('\n');
  return lines.slice(1).map((line, idx) => rowToQuestion(line.split(';'), idx));
}

/** Parse a language-specific tab-separated file into Question objects */
async function parseDemoTSV(url: string): Promise<Question[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TSV fetch failed: ${res.status}`);
  const text = await res.text();
  const lines = text.trim().split('\n');
  return lines.slice(1).map((line, idx) => rowToQuestion(line.split('\t'), idx));
}

/**
 * Load demo questions for the given UI language.
 * French → CSV; all others → matching TSV with CSV fallback.
 */
async function fetchDemoQuestionsFromCSV(lang = 'fr'): Promise<Question[]> {
  // Normalize: LANGUAGE_TO_DB returns 'fr','ar','en','es','pt','tr','zh' etc.
  const tsvUrl = LANG_TO_TSV[lang];
  if (!tsvUrl) return parseDemoCSV();

  try {
    const questions = await parseDemoTSV(tsvUrl);
    if (questions.length > 0) return questions;
  } catch {
    // fall through to CSV
  }
  return parseDemoCSV();
}

/**
 * Mode-specific question limits:
 * - demo: 20 (from CSV, no repeats)
 * - exam: 20 (standard/premium)
 * - training: 50 per batch
 * - study: 20 per category (premium)
 */
function getQuestionLimit(mode: QuizMode, isMiniQuiz: boolean): number {
  if (isMiniQuiz) return 5;
  switch (mode) {
    case 'demo': return DEMO_QUESTIONS_PER_EXAM;
    case 'exam': return 40;
    case 'training': return 50;
    case 'study': return 20;
    default: return 20;
  }
}

export function useQuiz({
  category,
  subcategory,
  level,
  mode = 'exam',
  isMiniQuiz = false,
  questionLimit,
  retryKey = 0,
  classId,
  retakeIds,
  freshOnly = false,
  hardMode = false,
  adaptive = false,
}: UseQuizOptions = {}) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { profile: userProfile } = useUserProfile();

  // Resolve level: explicit param > persona goal > default CSP
  const resolvedLevel: ExamLevel = level
    || (userProfile?.goal_type
      ? (GOAL_TO_LEVEL[userProfile.goal_type as keyof typeof GOAL_TO_LEVEL] as ExamLevel)
      : 'CSP');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Whether this mode saves answers to the database
  const shouldSaveAnswers = mode !== 'demo';

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);

      try {
        // ─── RETAKE MODE: reload same questions by ID ───
        if (retakeIds && retakeIds.length > 0) {
          // Demo questions (IDs >= 9000) came from CSV — re-fetch CSV and filter
          const csvIds = retakeIds.filter(id => id >= 9000);
          const dbIds = retakeIds.filter(id => id < 9000);

          let retakeQuestions: Question[] = [];

          if (csvIds.length > 0) {
            const allDemo = await fetchDemoQuestionsFromCSV('fr');
            const csvMatches = allDemo.filter(q => csvIds.includes(q.id));
            retakeQuestions = [...retakeQuestions, ...csvMatches];
          }

          if (dbIds.length > 0) {
            const { data: dbRows } = await supabase
              .from('questions')
              .select('*')
              .in('id', dbIds);
            retakeQuestions = [...retakeQuestions, ...(dbRows || []) as Question[]];
          }

          // Preserve original order
          const idOrder = retakeIds;
          retakeQuestions.sort((a, b) => idOrder.indexOf(a.id) - idOrder.indexOf(b.id));
          setQuestions(retakeQuestions);
          setLoading(false);
          return;
        }

        // ─── CLASS MODE: fetch class-specific questions ───
        if (classId) {
          // Check for manually mapped questions first
          const { data: qLinks } = await (supabase as any)
            .from('class_questions')
            .select('question_id')
            .eq('class_id', classId);

          let classQuestions: Question[] = [];
          // No cap when classId is provided — load all mapped questions (or questionLimit if explicitly set)
          const classLimit = (typeof questionLimit === 'number' && questionLimit > 0) ? questionLimit : 9999;

          if (qLinks && qLinks.length > 0) {
            const questionIds = qLinks.map((q: any) => q.question_id);
            const { data: rawQuestions } = await supabase
              .from('questions')
              .select('*')
              .in('id', questionIds);
            classQuestions = (rawQuestions || []) as Question[];
          } else {
            // Dynamic: infer category from class_number for official question mapping
            const { data: classInfo } = await (supabase as any)
              .from('classes')
              .select('class_number')
              .eq('id', classId)
              .maybeSingle();

            const classNum: number = classInfo?.class_number ?? 0;

            // Map class_number range to official DB category
            const getModuleCategory = (n: number): string => {
              if (n <= 20) return 'Principles and values of the Republic';
              if (n <= 40) return 'Institutional and political system';
              if (n <= 60) return 'Rights and duties';
              if (n <= 80) return 'History, geography and culture';
              return 'Living in French society';
            };
            const moduleCategory = getModuleCategory(classNum);

            const { data: poolQuestions, error: poolErr } = await supabase
              .from('questions')
              .select('*')
              .eq('category', moduleCategory)
              .eq('language', 'fr')
              .limit(classLimit);
            if (poolErr) throw poolErr;
            classQuestions = (poolQuestions || []) as Question[];
          }

          // Deduplicate by question_text — keep one random variant per unique question
          const seenTexts = new Set<string>();
          classQuestions = shuffle(classQuestions).filter(q => {
            if (seenTexts.has(q.question_text)) return false;
            seenTexts.add(q.question_text);
            return true;
          }).slice(0, classLimit);

          setQuestions(classQuestions);
          setLoading(false);
          return;
        }

        // ─── REVISION MODE: replay the user's actual mistakes ───
        // Primary source = questions answered incorrectly and never since answered
        // correctly (this matches the "X questions à corriger" count on the dashboard).
        // Falls back to SM-2 spaced-repetition due cards only when there are no mistakes.
        if (mode === 'revision' && user) {
          let ansQuery = supabase
            .from('user_answers' as any)
            .select('question_id, is_correct')
            .eq('user_id', user.id);
          // Scope to a single theme when revising by category.
          if (category) ansQuery = ansQuery.eq('category', category);
          const { data: ansData } = await ansQuery;

          const correctIds = new Set(
            (ansData || []).filter((a: any) => a.is_correct).map((a: any) => a.question_id).filter(Boolean)
          );
          let reviseIds: number[] = [...new Set(
            (ansData || [])
              .filter((a: any) => !a.is_correct && a.question_id != null && !correctIds.has(a.question_id))
              .map((a: any) => a.question_id as number)
          )].filter((id) => id < 9000); // demo/CSV questions (id >= 9000) don't live in the questions table

          // Fallback: spaced-repetition cards that are due (only for all-category revision).
          if (reviseIds.length === 0 && !category) {
            const now = new Date().toISOString();
            const { data: dueReviews } = await supabase
              .from('question_reviews' as any)
              .select('question_id')
              .eq('user_id', user.id)
              .lte('next_review_date', now)
              .order('next_review_date', { ascending: true })
              .limit(50);
            reviseIds = [...new Set((dueReviews || []).map((r: any) => r.question_id).filter(Boolean))]
              .filter((id) => id < 9000);
          }

          if (reviseIds.length > 0) {
            const picked = shuffle(reviseIds).slice(0, 30);
            const { data: revQuestions } = await supabase
              .from('questions')
              .select('*')
              .in('id', picked);
            setQuestions(shuffle((revQuestions || []) as Question[]));
          } else {
            setQuestions([]);
          }
          setLoading(false);
          return;
        }

        // ─── DEMO MODE: load from bundled CSV/TSV (no Supabase needed) ───
        if (mode === 'demo') {
          const dbLang = LANGUAGE_TO_DB[language] || 'fr';
          const allDemo = await fetchDemoQuestionsFromCSV(dbLang);
          const picked = shuffle(allDemo).slice(0, DEMO_QUESTIONS_PER_EXAM);
          setQuestions(picked);
          setLoading(false);
          return;
        }

        // ─── HARD MODE: fetch from question_difficulty table ───
        if (hardMode) {
          const modeLimit = getQuestionLimit(mode, isMiniQuiz);
          const resolvedLimit = typeof questionLimit === 'number' && questionLimit > 0 ? questionLimit : modeLimit;

          // Get IDs of hardest questions (lowest correct_pct, min 3 attempts)
          const { data: diffData } = await (supabase as any)
            .from('question_difficulty')
            .select('question_id')
            .order('correct_pct', { ascending: true })
            .limit(300);

          let hardIds: number[] = (diffData || []).map((r: any) => r.question_id).filter(Boolean);

          // In freshOnly mode, drop questions the user has already answered.
          // Source of truth is user_answers (not the empty profiles.used_questions).
          if (freshOnly && user && hardIds.length > 0) {
            const { data: answeredData } = await supabase
              .from('user_answers' as any)
              .select('question_id')
              .eq('user_id', user.id);
            const answered = new Set(
              (answeredData || []).map((r: any) => r.question_id).filter(Boolean)
            );
            hardIds = hardIds.filter((id) => !answered.has(id));
          }

          if (hardIds.length > 0) {
            const { data: hardQs } = await supabase.from('questions').select('*').in('id', hardIds);
            setQuestions(shuffle((hardQs || []) as Question[]).slice(0, resolvedLimit));
          } else {
            setQuestions([]);
          }
          setLoading(false);
          return;
        }

        // ─── NON-DEMO MODES: fetch from Supabase ───
        // Resolve language from profile, fallback to context language
        let dbLang = LANGUAGE_TO_DB[language] || 'fr';
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('preferred_language')
            .eq('id', user.id)
            .maybeSingle();
          if (profile?.preferred_language) {
            dbLang = profile.preferred_language;
          }
        }

        // Language safety net: the question bank is almost entirely French. If
        // the resolved language has too few questions, fall back to 'fr' so the
        // quiz is never empty just because the user's language isn't translated.
        if (dbLang !== 'fr') {
          const { count } = await supabase
            .from('questions')
            .select('id', { count: 'exact', head: true })
            .eq('language', dbLang);
          if (!count || count < 40) dbLang = 'fr';
        }

        // Resolve the final question limit
        const modeLimit = getQuestionLimit(mode, isMiniQuiz);
        const resolvedLimit =
          typeof questionLimit === 'number' && Number.isFinite(questionLimit) && questionLimit > 0
            ? questionLimit
            : modeLimit;

        // Resolve the exam_category levels to fetch based on hierarchy
        const resolveLevelsToFetch = (targetLevel: ExamLevel): ExamLevel[] => {
          if (targetLevel === 'Naturalisation') return ['Naturalisation', 'CR', 'CSP'];
          if (targetLevel === 'CR') return ['CR', 'CSP'];
          return ['CSP'];
        };

        // Fetch already-answered question IDs
        let answeredIds: number[] = [];
        if (user) {
          const { data: answeredData } = await supabase
            .from('user_answers' as any)
            .select('question_id')
            .eq('user_id', user.id);
          answeredIds = [...new Set((answeredData || []).map((r: any) => r.question_id).filter(Boolean))];
        }

        // Fetch cooldown question IDs (answered in last 24h) for mock exams
        let cooldownIds: number[] = [];
        if (user && mode === 'exam' && !retakeIds) {
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
          const { data: cooldownData } = await supabase
            .from('user_answers' as any)
            .select('question_id')
            .eq('user_id', user.id)
            .gte('answered_at', oneDayAgo);
          cooldownIds = [...new Set((cooldownData || []).map((r: any) => r.question_id).filter(Boolean))];
        }

        // Helper: apply freshOnly exclusion to a query
        const applyFreshFilter = (q: any) => {
          if (!freshOnly || answeredIds.length === 0) return q;
          return q.not('id', 'in', `(${answeredIds.slice(0, 1500).join(',')})`);
        };

        // Helper: try fetching with exam_category filter, fallback to no level filter
        const fetchWithLevelFallback = async (
          baseQuery: () => ReturnType<ReturnType<typeof supabase.from>['select']>,
          levelVal: string,
          limit: number
        ) => {
          const allowedLevels = resolveLevelsToFetch(levelVal as ExamLevel);
          const { data, error: err } = await applyFreshFilter(
            baseQuery().in('exam_category', allowedLevels)
          ).limit(limit);
          if (err) throw err;
          if (data && data.length > 0) return data as Question[];

          // Fallback: fetch without level filter (still respect freshOnly)
          const { data: fallback, error: err2 } = await applyFreshFilter(baseQuery()).limit(limit);
          if (err2) throw err2;
          return (fallback || []) as Question[];
        };

        // Helper for mock exam with progressive relaxation of filters
        const fetchCategoryQuestions = async (
          cat: string,
          count: number
        ): Promise<Question[]> => {
          const allowedLevels = resolveLevelsToFetch(resolvedLevel);

          const runQuery = async (useLevels: boolean, excludeAnswered: boolean, excludeCooldown: boolean) => {
            let query = supabase.from('questions').select('*').eq('language', dbLang).eq('category', cat);
            
            if (useLevels) {
              query = query.in('exam_category', allowedLevels);
            }

            const excludeIds = new Set<number>();
            if (excludeAnswered && freshOnly) {
              answeredIds.forEach(id => excludeIds.add(id));
            }
            if (excludeCooldown) {
              cooldownIds.forEach(id => excludeIds.add(id));
            }

            if (excludeIds.size > 0) {
              const idStr = `(${Array.from(excludeIds).slice(0, 1000).join(',')})`;
              query = query.not('id', 'in', idStr);
            }

            const limit = Math.max(count * 4, 100);
            const { data, error } = await query.limit(limit);
            if (error) throw error;
            return (data || []) as Question[];
          };

          // Progressive relaxation steps:
          // 1. Strict: Target Level, Fresh (if requested), Cooldown Exclusions
          let pool = await runQuery(true, true, true);
          if (pool.length >= count) return shuffle(pool).slice(0, count);

          // 2. Relax cooldown: Target Level, Fresh (if requested), NO Cooldown
          pool = await runQuery(true, true, false);
          if (pool.length >= count) return shuffle(pool).slice(0, count);

          // 3. Relax fresh: Target Level, NO Fresh, NO Cooldown
          pool = await runQuery(true, false, false);
          if (pool.length >= count) return shuffle(pool).slice(0, count);

          // 4. Relax levels: Any Level, Fresh (if requested), Cooldown Exclusions
          pool = await runQuery(false, true, true);
          if (pool.length >= count) return shuffle(pool).slice(0, count);

          // 5. Relax levels and cooldown: Any Level, Fresh (if requested), NO Cooldown
          pool = await runQuery(false, true, false);
          if (pool.length >= count) return shuffle(pool).slice(0, count);

          // 6. Absolute Fallback: Any Level, NO Fresh, NO Cooldown
          pool = await runQuery(false, false, false);
          return shuffle(pool).slice(0, count);
        };

        let allQuestions: Question[] = [];

        if (mode === 'exam' && !category) {
          // Balanced exam: distribute questions across categories based on weaknesses
          const cats = [...DB_CATEGORIES];
          let catDistribution: Record<string, number> = {};

          if (user) {
            // Fetch user's recent answers to calculate category weakness
            const { data: recentAnswers } = await supabase
              .from('user_answers' as any)
              .select('category, is_correct')
              .eq('user_id', user.id)
              .order('answered_at', { ascending: false })
              .limit(150);

            const catStats: Record<string, { correct: number; total: number }> = {};
            cats.forEach(c => { catStats[c] = { correct: 0, total: 0 }; });

            if (recentAnswers && recentAnswers.length > 0) {
              recentAnswers.forEach((ans: any) => {
                if (ans.category && catStats[ans.category]) {
                  catStats[ans.category].total += 1;
                  if (ans.is_correct) {
                    catStats[ans.category].correct += 1;
                  }
                }
              });
            }

            const weaknesses: Record<string, number> = {};
            cats.forEach(c => {
              const stats = catStats[c];
              if (stats.total >= 5) {
                const accuracy = stats.correct / stats.total;
                weaknesses[c] = Math.max(0, 1.0 - accuracy);
              } else {
                weaknesses[c] = 0.20; // Default weakness (20%)
              }
            });

            const baseQuestions = Math.max(2, Math.floor(resolvedLimit * 0.1)); // 4 questions base for resolvedLimit = 40
            const remainingQuestions = resolvedLimit - baseQuestions * cats.length; // 20 questions for resolvedLimit = 40

            let sumWeakness = 0;
            cats.forEach(c => { sumWeakness += weaknesses[c]; });
            const divisor = sumWeakness > 0 ? sumWeakness : 1;

            let allocated = 0;
            cats.forEach(c => {
              const extra = (weaknesses[c] / divisor) * remainingQuestions;
              catDistribution[c] = baseQuestions + Math.floor(extra);
              allocated += catDistribution[c];
            });

            let remainder = resolvedLimit - allocated;
            const fractionalParts = cats.map(c => {
              const extra = (weaknesses[c] / divisor) * remainingQuestions;
              return { category: c, fract: extra - Math.floor(extra) };
            }).sort((a, b) => b.fract - a.fract);

            for (let i = 0; i < remainder; i++) {
              const catName = fractionalParts[i % cats.length].category;
              catDistribution[catName] += 1;
            }
          } else {
            // Flat distribution for guest users
            const perCat = Math.floor(resolvedLimit / cats.length);
            let remainder = resolvedLimit - perCat * cats.length;
            cats.forEach(c => {
              catDistribution[c] = perCat + (remainder-- > 0 ? 1 : 0);
            });
          }

          const fetches = cats.map(async (cat) => {
            const count = catDistribution[cat] || 0;
            if (count <= 0) return [];
            return fetchCategoryQuestions(cat, count);
          });

          const results = await Promise.all(fetches);
          const seen = new Set<number>();
          allQuestions = shuffle(results.flat()).filter(q => {
            if (seen.has(q.id)) return false;
            seen.add(q.id);
            return true;
          });
        } else {
          // Single category / subcategory / unfiltered fetch (training, study)
          const fetchSize = Math.min(resolvedLimit * 4, 500);
          const baseQ = () => {
            let q = supabase.from('questions').select('*').eq('language', dbLang);
            if (category) q = q.eq('category', category);
            if (subcategory) q = q.eq('subcategory', subcategory);
            return q;
          };
          const data = await fetchWithLevelFallback(baseQ, resolvedLevel, fetchSize);
          allQuestions = shuffle(data).slice(0, resolvedLimit);
        }

        // ─── ADAPTIVE: interleave 30% hard questions ───
        if (adaptive && allQuestions.length > 0) {
          const { data: diffData } = await (supabase as any)
            .from('question_difficulty')
            .select('question_id')
            .lt('correct_pct', 50)
            .order('correct_pct', { ascending: true })
            .limit(100);

          const hardIds = new Set((diffData || []).map((r: any) => r.question_id));
          const hardQ = allQuestions.filter(q => hardIds.has(q.id));
          const normalQ = allQuestions.filter(q => !hardIds.has(q.id));

          // Interleave: every 3rd question is a hard question
          const finalQ: Question[] = [];
          let hi = 0, ni = 0;
          for (let i = 0; i < allQuestions.length; i++) {
            if ((i + 1) % 3 === 0 && hi < hardQ.length) {
              finalQ.push(hardQ[hi++]);
            } else if (ni < normalQ.length) {
              finalQ.push(normalQ[ni++]);
            } else if (hi < hardQ.length) {
              finalQ.push(hardQ[hi++]);
            }
          }
          allQuestions = finalQ;
        }

        setQuestions(allQuestions);
      } catch (e: any) {
        console.error('Error fetching questions:', e);
        setError(e.message || 'Failed to load questions');
      }

      setLoading(false);
    };

    fetchQuestions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, subcategory, user, resolvedLevel, mode, isMiniQuiz, questionLimit, retryKey, classId, retakeIds?.join(','), freshOnly, hardMode, adaptive]);

  /** Save a single answer to user_answers table and update SM-2 review schedule (skipped in demo mode) */
  const saveAnswer = useCallback(
    async (question: Question, selectedAnswer: string, timeSpentMs?: number) => {
      if (!user || !shouldSaveAnswers) return;
      const correctText = getCorrectAnswerText(question);
      const isCorrect = selectedAnswer === correctText;

      // Save to user_answers
      await supabase.from('user_answers' as any).insert({
        user_id: user.id,
        question_id: question.id,
        selected_answer: selectedAnswer,
        is_correct: isCorrect,
        category: question.category,
      });

      // Update Bayesian Elo ratings in real-time
      try {
        await supabase.rpc('update_elo_rating', {
          p_question_id: question.id,
          p_is_correct: isCorrect,
        });
      } catch (eloErr) {
        console.error('Failed to update Elo ratings:', eloErr);
      }

      // Update SM-2 spaced repetition schedule in question_reviews
      if (typeof timeSpentMs === 'number') {
        try {
          const quality = getQualityFromResult(isCorrect, timeSpentMs);

          // Fetch existing review card or create a new one
          const { data: existing } = await supabase
            .from('question_reviews' as any)
            .select('*')
            .eq('user_id', user.id)
            .eq('question_id', question.id)
            .maybeSingle();

          const card: SRSCard = existing ? {
            questionId: String(question.id),
            repetitions: existing.repetitions ?? 0,
            easeFactor: existing.ease_factor ?? 2.5,
            intervalDays: existing.interval_days ?? 0,
            nextReviewDate: new Date(existing.next_review_date ?? Date.now()),
          } : {
            questionId: String(question.id),
            repetitions: 0,
            easeFactor: 2.5,
            intervalDays: 0,
            nextReviewDate: new Date(),
          };

          const updated = calculateNextReview(card, quality);

          await supabase.from('question_reviews' as any).upsert({
            user_id: user.id,
            question_id: question.id,
            repetitions: updated.repetitions,
            ease_factor: updated.easeFactor,
            interval_days: updated.intervalDays,
            next_review_date: updated.nextReviewDate.toISOString(),
            last_quality: quality,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id,question_id' });
        } catch (e) {
          console.error('SM-2 update failed:', e);
        }
      }
    },
    [user, shouldSaveAnswers],
  );

  return {
    questions,
    loading,
    error,
    saveAnswer,
    isMiniQuiz: !!isMiniQuiz,
    mode,
    shouldSaveAnswers,
  };
}
