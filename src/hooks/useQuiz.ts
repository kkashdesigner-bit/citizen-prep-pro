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
}

/**
 * Mode-specific question limits:
 * - demo: 10 (free tier)
 * - exam: 20 (standard/premium)
 * - training: 50 per batch
 * - study: 20 per category (premium)
 */
function getQuestionLimit(mode: QuizMode, isMiniQuiz: boolean): number {
  if (isMiniQuiz) return 5;
  switch (mode) {
    case 'demo': return 10;
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

      // Helper: try fetching with a level filter, fallback to no level filter
      const fetchWithLevelFallback = async (
        baseQuery: () => ReturnType<ReturnType<typeof supabase.from>['select']>,
        levelVal: string,
        limit: number
      ) => {
        const { data, error: err } = await baseQuery().eq('level', levelVal).limit(limit);
        if (err) throw err;
        if (data && data.length > 0) return data as Question[];
        // Fallback: fetch without level filter
        const { data: fallback, error: err2 } = await baseQuery().limit(limit);
        if (err2) throw err2;
        return (fallback || []) as Question[];
      };

      try {
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
          // Single category or unfiltered fetch (demo, training, study)
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
  }, [language, category, user, resolvedLevel, mode, isMiniQuiz, questionLimit]);

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
