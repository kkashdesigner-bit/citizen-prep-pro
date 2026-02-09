import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Question, Category, ExamLevel } from '@/lib/types';
import { selectQuestionsByDistribution } from '@/lib/quizDistribution';
import Header from '@/components/Header';
import QuizQuestion from '@/components/QuizQuestion';
import QuizTimer from '@/components/QuizTimer';
import QuizProgress from '@/components/QuizProgress';
import SubscriptionGate from '@/components/SubscriptionGate';
import { ChevronLeft, ChevronRight, Flag } from 'lucide-react';

const QUIZ_TIME = 45 * 60;

type QuizMode = 'exam' | 'study' | 'training';

export default function Quiz() {
  const [searchParams] = useSearchParams();
  const mode = (searchParams.get('mode') as QuizMode) || 'exam';
  const categoryParam = searchParams.get('category') as Category | null;
  const levelParam = (searchParams.get('level') as ExamLevel) || undefined;
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(QUIZ_TIME);
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(Date.now());
  const [showGate, setShowGate] = useState(false);
  const [warpState, setWarpState] = useState<'idle' | 'exit' | 'enter'>('idle');
  const pendingIndex = useRef<number | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*');

      if (error) {
        console.error('Error fetching questions:', error);
        return;
      }

      const parsed = (data || []).map((q) => ({
        ...q,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
      })) as Question[];

      const selected = selectQuestionsByDistribution(parsed, [], {
        level: levelParam,
        category: categoryParam || undefined,
      });
      setQuestions(selected);
      setLoading(false);
    };

    fetchQuestions();
  }, [levelParam, categoryParam]);

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

  const warpTo = (newIndex: number) => {
    if (newIndex === currentIndex || warpState !== 'idle') return;
    pendingIndex.current = newIndex;
    setWarpState('exit');
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setWarpState('enter');
      setTimeout(() => setWarpState('idle'), 250);
    }, 200);
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

    sessionStorage.setItem('quizResults', JSON.stringify(resultData));

    const demoTaken = sessionStorage.getItem('demoTaken');
    if (demoTaken) {
      setShowGate(true);
    } else {
      sessionStorage.setItem('demoTaken', 'true');
    }

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
  const showFeedback = mode === 'study' || mode === 'training';
  const hideTranslation = false;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="sticky top-16 z-40 border-b border-border/50 bg-background/60 backdrop-blur-xl py-3">
        <div className="container flex items-center justify-between gap-4">
          <QuizProgress
            current={currentIndex + 1}
            total={questions.length}
            answeredCount={answeredCount}
          />
          {mode === 'exam' && <QuizTimer timeRemaining={timeRemaining} />}
          <ModeBadge mode={mode} category={categoryParam} />
        </div>
      </div>

      <main className="container py-8">
        <div
          className={
            warpState === 'exit'
              ? 'warp-exit'
              : warpState === 'enter'
              ? 'warp-enter'
              : ''
          }
        >
          <QuizQuestion
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            selectedAnswer={answers[currentQuestion.id]}
            onAnswer={handleAnswer}
            showFeedback={showFeedback}
            hideTranslation={hideTranslation}
          />
        </div>

        <div className="mx-auto mt-8 flex max-w-2xl items-center justify-between">
          <Button
            variant="outline"
            onClick={() => warpTo(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="gap-2 glow-hover"
          >
            <ChevronLeft className="h-4 w-4" />
            {t('quiz.prev')}
          </Button>

          <div className="hidden items-center gap-1 sm:flex">
            {questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => warpTo(i)}
                className={`h-3 w-3 rounded-full transition-all ${
                  i === currentIndex
                    ? 'bg-primary scale-125 shadow-[0_0_8px_hsl(var(--primary)/0.5)]'
                    : answers[q.id]
                    ? 'bg-primary/40'
                    : 'bg-border'
                }`}
              />
            ))}
          </div>

          {currentIndex === questions.length - 1 ? (
            <Button onClick={handleFinish} className="gap-2 btn-glow">
              <Flag className="h-4 w-4" />
              {t('quiz.finish')}
            </Button>
          ) : (
            <Button
              onClick={() => warpTo(Math.min(questions.length - 1, currentIndex + 1))}
              className="gap-2 btn-glow"
            >
              {t('quiz.next')}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </main>

      <SubscriptionGate open={showGate} onOpenChange={setShowGate} />
    </div>
  );
}

function ModeBadge({ mode, category }: { mode: QuizMode; category?: string | null }) {
  const label =
    mode === 'training' && category
      ? `Entraînement — ${category}`
      : mode === 'exam'
      ? 'Examen'
      : 'Étude';

  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase ${
        mode === 'exam'
          ? 'bg-destructive/20 text-destructive'
          : mode === 'training'
          ? 'bg-secondary text-secondary-foreground'
          : 'bg-primary/10 text-primary'
      }`}
    >
      {label}
    </span>
  );
}
