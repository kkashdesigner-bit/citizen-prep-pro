import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface FlashQuestion {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string | null;
  category: string;
}

export function useFlashQuiz() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<FlashQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { selected: string; correct: boolean }>>({});
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);

  const startQuiz = useCallback(async (category?: string) => {
    if (!user) return;
    setLoading(true);
    setFinished(false);
    setCurrentIndex(0);
    setAnswers({});

    // Try to fetch 5 questions user hasn't answered yet
    let query = (supabase as any)
      .from('questions')
      .select('id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, category');

    if (category) {
      query = query.eq('category', category);
    }

    // Get random questions — Supabase doesn't support anti-join easily,
    // so we fetch a pool and pick 5 random
    const { data } = await query.limit(50);

    if (data && data.length > 0) {
      // Shuffle and pick 5
      const shuffled = [...data].sort(() => Math.random() - 0.5);
      setQuestions(shuffled.slice(0, 5));
    }

    setLoading(false);
  }, [user]);

  const submitAnswer = useCallback(async (questionId: number, selectedAnswer: string) => {
    if (!user) return;

    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    const correct = question.correct_answer;
    const isCorrect =
      selectedAnswer.toLowerCase() === correct.toLowerCase() ||
      selectedAnswer === `option_${correct.toLowerCase()}`;

    setAnswers(prev => ({ ...prev, [questionId]: { selected: selectedAnswer, correct: isCorrect } }));

    // Save to user_answers
    await (supabase as any)
      .from('user_answers')
      .insert({
        user_id: user.id,
        question_id: questionId,
        selected_answer: selectedAnswer,
        is_correct: isCorrect,
        category: question.category,
      });

    // Auto-advance or finish
    if (currentIndex >= questions.length - 1) {
      setFinished(true);
    } else {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 1200);
    }
  }, [user, questions, currentIndex]);

  const score = Object.values(answers).filter(a => a.correct).length;
  const total = questions.length;

  return {
    questions,
    currentIndex,
    currentQuestion: questions[currentIndex] || null,
    answers,
    loading,
    finished,
    score,
    total,
    startQuiz,
    submitAnswer,
    reset: () => { setQuestions([]); setFinished(false); setCurrentIndex(0); setAnswers({}); },
  };
}
