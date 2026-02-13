import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Question, ExamLevel, LANGUAGE_TO_DB, DB_CATEGORIES } from '@/lib/types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Build a default balanced distribution of `total` questions across all categories */
function defaultDistribution(total: number): Record<string, number> {
  const cats = [...DB_CATEGORIES];
  const perCat = Math.floor(total / cats.length);
  let remainder = total - perCat * cats.length;
  const dist: Record<string, number> = {};
  for (const cat of cats) {
    dist[cat] = perCat + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder--;
  }
  return dist;
}

export interface UseQuizOptions {
  /** Single category for training mode */
  category?: string | null;
  /** Exam level filter */
  level?: ExamLevel;
  /** Total question limit (ignored when distribution is provided) */
  limit?: number;
  /** Custom distribution: category → count */
  distribution?: Record<string, number>;
  /** Mini-quiz mode: 5 questions, no timing */
  isMiniQuiz?: boolean;
  /** Quiz mode hint — used to auto-compute distribution for exams */
  mode?: 'exam' | 'study' | 'training';
}

export function useQuiz({
  category,
  level = 'CSP',
  limit,
  distribution,
  isMiniQuiz,
  mode,
}: UseQuizOptions = {}) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);

      // Resolve language
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

      // Determine effective question count
      const effectiveLimit = isMiniQuiz ? 5 : limit;

      // Determine distribution
      let dist: Record<string, number> | null = null;

      if (distribution) {
        dist = distribution;
      } else if (mode === 'exam' && !category) {
        // Balanced exam: 40 questions spread across categories
        dist = defaultDistribution(effectiveLimit ?? 40);
      }

      try {
        let allQuestions: Question[] = [];

        if (dist) {
          // Fetch per-category batches in parallel
          const fetches = Object.entries(dist).map(async ([cat, count]) => {
            let q = supabase
              .from('questions')
              .select('*')
              .eq('language', dbLang)
              .eq('category', cat);

            if (level) {
              q = q.eq('level', level);
            }

            // Supabase doesn't support random() ordering directly,
            // so we fetch more than needed and shuffle client-side
            q = q.limit(Math.min(count * 3, 100));

            const { data, error: fetchErr } = await q;
            if (fetchErr) throw fetchErr;

            const shuffled = shuffle((data || []) as Question[]);
            return shuffled.slice(0, count);
          });

          const results = await Promise.all(fetches);
          allQuestions = shuffle(results.flat());
        } else {
          // Single category or unfiltered fetch
          let q = supabase
            .from('questions')
            .select('*')
            .eq('language', dbLang);

          if (category) {
            q = q.eq('category', category);
          }

          if (level) {
            q = q.eq('level', level);
          }

          const { data, error: fetchErr } = await q;
          if (fetchErr) throw fetchErr;

          allQuestions = shuffle((data || []) as Question[]);

          if (effectiveLimit && effectiveLimit > 0) {
            allQuestions = allQuestions.slice(0, effectiveLimit);
          }
        }

        setQuestions(allQuestions);
      } catch (e: any) {
        console.error('Error fetching questions:', e);
        setError(e.message || 'Failed to load questions');
      }

      setLoading(false);
    };

    fetchQuestions();
  }, [language, category, user, limit, level, distribution, isMiniQuiz, mode]);

  /** Save a single answer to user_answers table */
  const saveAnswer = useCallback(
    async (question: Question, selectedAnswer: string) => {
      if (!user) return;
      const isCorrect = selectedAnswer === question.correct_answer;
      await supabase.from('user_answers' as any).insert({
        user_id: user.id,
        question_id: question.id,
        selected_answer: selectedAnswer,
        is_correct: isCorrect,
        category: question.category,
      });
    },
    [user],
  );

  return { questions, loading, error, saveAnswer, isMiniQuiz: !!isMiniQuiz };
}
