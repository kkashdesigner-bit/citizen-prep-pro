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
  /** Exam level filter */
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
  /** Specific question IDs to load (for "Refaire l'examen") */
  retakeIds?: number[] | null;
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
  level,
  mode = 'exam',
  isMiniQuiz = false,
  questionLimit,
  retryKey = 0,
  classId,
  retakeIds,
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
          const classLimit = (typeof questionLimit === 'number' && questionLimit > 0) ? questionLimit : 5;

          if (qLinks && qLinks.length > 0) {
            const questionIds = qLinks.map((q: any) => q.question_id);
            const { data: rawQuestions } = await supabase
              .from('questions')
              .select('*')
              .in('id', questionIds);
            classQuestions = shuffle((rawQuestions || []) as Question[]).slice(0, classLimit);
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

            const poolSize = Math.min(classLimit * 6, 120);
            const { data: poolQuestions, error: poolErr } = await supabase
              .from('questions')
              .select('*')
              .eq('category', moduleCategory)
              .eq('language', 'fr')
              .limit(poolSize);
            if (poolErr) throw poolErr;
            classQuestions = shuffle((poolQuestions || []) as Question[]).slice(0, classLimit);
          }

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

        // Resolve the levels to fetch based on hierarchy
        const resolveLevelsToFetch = (targetLevel: ExamLevel): ExamLevel[] => {
          if (targetLevel === 'Naturalisation') return ['Naturalisation', 'CR', 'CSP'];
          if (targetLevel === 'CR') return ['CR', 'CSP'];
          return ['CSP']; // targetLevel === 'CSP'
        };

        // Helper: try fetching with a level filter, fallback to no level filter
        const fetchWithLevelFallback = async (
          baseQuery: () => ReturnType<ReturnType<typeof supabase.from>['select']>,
          levelVal: string,
          limit: number
        ) => {
          const allowedLevels = resolveLevelsToFetch(levelVal as ExamLevel);
          const { data, error: err } = await baseQuery().in('level', allowedLevels).limit(limit);
          if (err) throw err;
          if (data && data.length > 0) return data as Question[];

          // Fallback: fetch without level filter
          const { data: fallback, error: err2 } = await baseQuery().limit(limit);
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
          allQuestions = shuffle(results.flat());
        } else {
          // Single category or unfiltered fetch (training, study)
          const fetchSize = Math.min(resolvedLimit * 4, 500);
          const baseQ = () => {
            let q = supabase.from('questions').select('*').eq('language', dbLang);
            if (category) q = q.eq('category', category);
            return q;
          };
          const data = await fetchWithLevelFallback(baseQ, resolvedLevel, fetchSize);
          allQuestions = shuffle(data).slice(0, resolvedLimit);
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
  }, [category, user, resolvedLevel, mode, isMiniQuiz, questionLimit, retryKey, classId, retakeIds?.join(',')]);

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
