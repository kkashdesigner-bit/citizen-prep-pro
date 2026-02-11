import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Question, LANGUAGE_TO_DB } from '@/lib/types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface UseQuizOptions {
  category?: string | null;
  limit?: number;
}

export function useQuiz({ category, limit }: UseQuizOptions = {}) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);

      // Determine language: use user's preferred_language from profile, fallback to context language
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

      let query = supabase
        .from('questions')
        .select('*')
        .eq('language', dbLang);

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching questions:', fetchError);
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      let parsed = (data || []) as Question[];
      parsed = shuffle(parsed);

      if (limit && limit > 0) {
        parsed = parsed.slice(0, limit);
      }

      setQuestions(parsed);
      setLoading(false);
    };

    fetchQuestions();
  }, [language, category, user, limit]);

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

  return { questions, loading, error, saveAnswer };
}
