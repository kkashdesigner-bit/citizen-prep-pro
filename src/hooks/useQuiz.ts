import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserProfile, GOAL_TO_LEVEL } from '@/hooks/useUserProfile';
import { Question, ExamLevel, LANGUAGE_TO_DB, DB_CATEGORIES, getCorrectAnswerText } from '@/lib/types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export type QuizMode = 'exam' | 'study' | 'training' | 'demo';

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

/** Map UI language codes to XLSX filenames in /public/ */
const LANG_TO_XLSX: Record<string, string> = {
  ar: '/demo_questions%20ar.xlsx',
  en: '/demo_questions%20en-US.xlsx',
  es: '/demo_questions%20es-ES.xlsx',
  pt: '/demo_questions%20pt-PT.xlsx',
  tr: '/demo_questions%20tr.xlsx',
  zh: '/demo_questions%20zh-Hans.xlsx',
};

/** Map a row array (from CSV or XLSX) to a Question object */
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

/** Parse a language-specific XLSX file into Question objects (dynamic import for SSG safety) */
async function parseDemoXLSX(url: string): Promise<Question[]> {
  const XLSX = await import('xlsx');
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 });
  return (rows as string[][]).slice(1).map((row, idx) => rowToQuestion(row.map(String), idx));
}

/**
 * Load demo questions for the given UI language.
 * French → CSV; all others → matching XLSX with CSV fallback.
 */
async function fetchDemoQuestionsFromCSV(lang = 'fr'): Promise<Question[]> {
  // Normalize: LANGUAGE_TO_DB returns 'fr','ar','en','es','pt','tr','zh' etc.
  const xlsxUrl = LANG_TO_XLSX[lang];
  if (!xlsxUrl) return parseDemoCSV();

  try {
    const questions = await parseDemoXLSX(xlsxUrl);
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

        // ─── DEMO MODE: load from bundled CSV/XLSX (no Supabase needed) ───
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

          const hardIds = (diffData || []).map((r: any) => r.question_id).filter(Boolean);

          if (hardIds.length > 0) {
            let q = supabase.from('questions').select('*').in('id', hardIds);
            if (freshOnly && answeredIds.length > 0) {
              // answered IDs will be fetched below — skip for hard mode since we fetch first
            }
            const { data: hardQs } = await q;
            setQuestions(shuffle((hardQs || []) as Question[]).slice(0, resolvedLimit));
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

        // Fetch already-answered question IDs for freshOnly mode
        let answeredIds: number[] = [];
        if (freshOnly && user) {
          const { data: answeredData } = await supabase
            .from('user_answers' as any)
            .select('question_id')
            .eq('user_id', user.id);
          answeredIds = [...new Set((answeredData || []).map((r: any) => r.question_id).filter(Boolean))];
        }

        // Helper: apply freshOnly exclusion to a query
        const applyFreshFilter = (q: any) => {
          if (!freshOnly || answeredIds.length === 0) return q;
          // Supabase .not('id', 'in', `(${ids})`) syntax
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

        let allQuestions: Question[] = [];

        if (mode === 'exam' && !category) {
          // Balanced exam: distribute questions evenly across categories
          const cats = [...DB_CATEGORIES];
          const perCat = Math.floor(resolvedLimit / cats.length);
          let remainder = resolvedLimit - perCat * cats.length;

          const fetches = cats.map(async (cat) => {
            const count = perCat + (remainder-- > 0 ? 1 : 0);
            const pool = Math.min(count * 4, 100);
            const baseQ = () => supabase.from('questions').select('*').eq('language', dbLang).eq('category', cat);
            const data = await fetchWithLevelFallback(baseQ, resolvedLevel, pool);
            return shuffle(data).slice(0, count);
          });

          const results = await Promise.all(fetches);
          // Deduplicate by question ID (can occur across category overlaps)
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

  /** Save a single answer to user_answers table (skipped in demo mode) */
  const saveAnswer = useCallback(
    async (question: Question, selectedAnswer: string) => {
      if (!user || !shouldSaveAnswers) return;
      const correctText = getCorrectAnswerText(question);
      const isCorrect = selectedAnswer === correctText;
      await supabase.from('user_answers' as any).insert({
        user_id: user.id,
        question_id: question.id,
        selected_answer: selectedAnswer,
        is_correct: isCorrect,
        category: question.category,
      });
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
