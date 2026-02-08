import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Question } from '@/lib/types';
import Header from '@/components/Header';
import QuizQuestion from '@/components/QuizQuestion';
import QuizTimer from '@/components/QuizTimer';
import QuizProgress from '@/components/QuizProgress';
import { ChevronLeft, ChevronRight, Flag } from 'lucide-react';

const QUIZ_TIME = 45 * 60; // 45 minutes in seconds

export default function Quiz() {
  const [searchParams] = useSearchParams();
  const mode = (searchParams.get('mode') as 'exam' | 'study') || 'study';
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(QUIZ_TIME);
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(Date.now());

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*');

      if (error) {
        console.error('Error fetching questions:', error);
        return;
      }

      // Shuffle and take up to 40 questions (or all if less)
      const shuffled = (data || [])
        .map((q) => ({ ...q, options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options }))
        .sort(() => Math.random() - 0.5)
        .slice(0, 40);

      setQuestions(shuffled as Question[]);
      setLoading(false);
    };

    fetchQuestions();
  }, []);

  // Timer
  useEffect(() => {
    if (mode !== 'exam') return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [mode]);

  const handleAnswer = (answer: string) => {
    const questionId = questions[currentIndex]?.id;
    if (!questionId) return;
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleFinish = useCallback(() => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const results = questions.map((q) => ({
      questionId: q.id,
      category: q.category,
      correct: answers[q.id] === q.correct_answer,
      selectedAnswer: answers[q.id],
      correctAnswer: q.correct_answer,
    }));

    const score = results.filter((r) => r.correct).length;
    const categoryBreakdown: Record<string, { correct: number; total: number }> = {};
    results.forEach((r) => {
      if (!categoryBreakdown[r.category]) {
        categoryBreakdown[r.category] = { correct: 0, total: 0 };
      }
      categoryBreakdown[r.category].total++;
      if (r.correct) categoryBreakdown[r.category].correct++;
    });

    const resultData = {
      score,
      totalQuestions: questions.length,
      passed: score / questions.length >= 0.8,
      timeSpent,
      categoryBreakdown,
    };

    // Store in sessionStorage for results page
    sessionStorage.setItem('quizResults', JSON.stringify(resultData));
    navigate('/results');
  }, [answers, questions, startTime, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Chargement des questions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container flex items-center justify-center py-20">
          <p className="text-muted-foreground">Aucune question disponible.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const showFeedback = mode === 'study';

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Quiz header bar */}
      <div className="sticky top-16 z-40 border-b border-border bg-card py-3">
        <div className="container flex items-center justify-between gap-4">
          <QuizProgress
            current={currentIndex + 1}
            total={questions.length}
            answeredCount={answeredCount}
          />
          {mode === 'exam' && <QuizTimer timeRemaining={timeRemaining} />}
          <Badge mode={mode} />
        </div>
      </div>

      {/* Question */}
      <main className="container py-8">
        <QuizQuestion
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          selectedAnswer={answers[currentQuestion.id]}
          onAnswer={handleAnswer}
          showFeedback={showFeedback}
        />

        {/* Navigation */}
        <div className="mx-auto mt-8 flex max-w-2xl items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            {t('quiz.prev')}
          </Button>

          <div className="flex gap-2">
            {/* Question navigator dots */}
            <div className="hidden items-center gap-1 sm:flex">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-3 w-3 rounded-full transition-all ${
                    i === currentIndex
                      ? 'bg-primary scale-125'
                      : answers[q.id]
                      ? 'bg-primary/40'
                      : 'bg-border'
                  }`}
                />
              ))}
            </div>
          </div>

          {currentIndex === questions.length - 1 ? (
            <Button
              onClick={handleFinish}
              className="gap-2"
            >
              <Flag className="h-4 w-4" />
              {t('quiz.finish')}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              className="gap-2"
            >
              {t('quiz.next')}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

function Badge({ mode }: { mode: 'exam' | 'study' }) {
  const { t } = useLanguage();
  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase ${
        mode === 'exam'
          ? 'bg-accent text-accent-foreground'
          : 'bg-primary/10 text-primary'
      }`}
    >
      {mode === 'exam' ? t('quiz.exam') : t('quiz.study')}
    </span>
  );
}
