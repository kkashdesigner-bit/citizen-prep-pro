import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface DailyQuestion {
  id: string;
  question_id: number;
  active_date: string;
  category: string;
  question: {
    id: number;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: string;
    explanation: string | null;
    category: string;
  } | null;
}

export function useDailyQuestion() {
  const { user } = useAuth();
  const [dailyQuestion, setDailyQuestion] = useState<DailyQuestion | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const fetch = async () => {
      // Get today's daily question
      const today = new Date().toISOString().split('T')[0];
      const { data: dq } = await (supabase as any)
        .from('daily_questions')
        .select('*')
        .eq('active_date', today)
        .maybeSingle();

      if (!dq) { setLoading(false); return; }

      // Fetch the full question
      const { data: question } = await (supabase as any)
        .from('questions')
        .select('id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, category')
        .eq('id', dq.question_id)
        .maybeSingle();

      setDailyQuestion({ ...dq, question });

      // Check if user already answered
      const { data: answer } = await (supabase as any)
        .from('daily_question_answers')
        .select('*')
        .eq('user_id', user.id)
        .eq('daily_question_id', dq.id)
        .maybeSingle();

      if (answer) {
        setHasAnswered(true);
        setUserAnswer(answer.selected_answer);
        setIsCorrect(answer.is_correct);
      }

      setLoading(false);
    };

    fetch();
  }, [user]);

  const submitAnswer = useCallback(async (selectedAnswer: string) => {
    if (!user || !dailyQuestion?.question) return;

    const correct = dailyQuestion.question.correct_answer;
    const answeredCorrectly =
      selectedAnswer.toLowerCase() === correct.toLowerCase() ||
      selectedAnswer === `option_${correct.toLowerCase()}`;

    // Insert into daily_question_answers
    await (supabase as any)
      .from('daily_question_answers')
      .insert({
        user_id: user.id,
        daily_question_id: dailyQuestion.id,
        selected_answer: selectedAnswer,
        is_correct: answeredCorrectly,
      });

    // Also save to user_answers for stats/daily goal
    await (supabase as any)
      .from('user_answers')
      .insert({
        user_id: user.id,
        question_id: dailyQuestion.question.id,
        selected_answer: selectedAnswer,
        is_correct: answeredCorrectly,
        category: dailyQuestion.question.category,
      });

    setHasAnswered(true);
    setUserAnswer(selectedAnswer);
    setIsCorrect(answeredCorrectly);
  }, [user, dailyQuestion]);

  return { dailyQuestion, hasAnswered, userAnswer, isCorrect, loading, submitAnswer };
}
