import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuiz, QuizMode } from '@/hooks/useQuiz';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ExamLevel, getCorrectAnswerText } from '@/lib/types';
import Header from '@/components/Header';
import QuizQuestion from '@/components/QuizQuestion';
import QuizTimer from '@/components/QuizTimer';
import QuizProgress from '@/components/QuizProgress';
import SubscriptionGate from '@/components/SubscriptionGate';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Flag } from 'lucide-react';

const QUIZ_TIME = 45 * 60;

export default function Quiz() {
  const [searchParams] = useSearchParams();
  const rawMode = (searchParams.get('mode') as QuizMode) || 'exam';
  const categoryParam = searchParams.get('category');
  const levelParam = (searchParams.get('level') as ExamLevel) || 'CSP';
  const isMiniQuiz = searchParams.get('mini') === '1';
  const limitParam = searchParams.get('limit');
  const questionLimit = limitParam && Number.isFinite(Number(limitParam)) && Number(limitParam) > 0
    ? Number(limitParam)
    : undefined;

  const navigate = useNavigate();
  const { t } = useLanguage();
  const { tier, isStandardOrAbove, isPremium, loading: tierLoading } = useSubscription();

  const isFreeUser = tier === 'free';
  const { user } = useAuth();
  const [examsTakenToday, setExamsTakenToday] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      setExamsTakenToday(0);
      return;
    }
    const fetchExams = async () => {
      const { data } = await supabase.from('profiles').select('exam_history').eq('id', user.id).maybeSingle();
      if (data?.exam_history) {
        const history = data.exam_history as any[];
        const today = new Date().toISOString().split('T')[0];
        const count = history.filter(e => e.date?.startsWith(today)).length;
        setExamsTakenToday(count);
      } else {
        setExamsTakenToday(0);
      }
    };
    fetchExams();
  }, [user]);

  // --- Tier-based access gate ---
  const [showGate, setShowGate] = useState(false);
  const [gateTier, setGateTier] = useState<'standard' | 'premium'>('standard');

  useEffect(() => {
    if (tierLoading || examsTakenToday === null) return;

    if (isFreeUser && rawMode !== 'demo') {
      // Free users are allowed 1 exam per day
      if (rawMode === 'exam' && examsTakenToday < 1) {
        // Let them pass
      } else {
        setGateTier('standard');
        setShowGate(true);
      }
    } else if (isStandardOrAbove && !isPremium && rawMode === 'study') {
      setGateTier('premium');
      setShowGate(true);
    }
  }, [tierLoading, isFreeUser, isStandardOrAbove, isPremium, rawMode, examsTakenToday]);

  // Free users are downgraded to demo mode
  const effectiveMode: QuizMode = isFreeUser ? 'demo' : rawMode;

  const { questions, loading, saveAnswer } = useQuiz({
    category: categoryParam || undefined,
    level: levelParam,
    isMiniQuiz,
    mode: effectiveMode,
    questionLimit,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(QUIZ_TIME);
  const [startTime] = useState(Date.now());
  const [warpState, setWarpState] = useState<'idle' | 'exit' | 'enter'>('idle');
  const pendingIndex = useRef<number | null>(null);

  // Timer for exam mode
  useEffect(() => {
    if (effectiveMode !== 'exam' || isMiniQuiz) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveMode, isMiniQuiz]);

  const handleAnswer = (answer: string) => {
    const question = questions[currentIndex];
    if (!question) return;
    if (answers[question.id] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [question.id]: answer }));
    saveAnswer(question, answer);
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
      correct: answers[q.id] === getCorrectAnswerText(q),
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
  const showFeedback = effectiveMode === 'study' || effectiveMode === 'training';
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

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
          {effectiveMode === 'exam' && !isMiniQuiz && <QuizTimer timeRemaining={timeRemaining} />}
          <ModeBadge mode={effectiveMode} category={categoryParam} />
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
            showTranslateButton={isPremium}
          />
        </div>

        <div className="mx-auto mt-8 max-w-2xl space-y-4">
          {/* Progress bar + segment markers */}
          <div className="space-y-1.5">
            <Progress value={progressPercent} className="h-2" />
            <div className="hidden sm:flex items-center gap-0.5 justify-center flex-wrap">
              {Array.from({ length: Math.ceil(questions.length / 5) }, (_, seg) => {
                const start = seg * 5;
                const end = Math.min(start + 5, questions.length);
                const segQuestions = questions.slice(start, end);
                const answeredInSeg = segQuestions.filter((q) => answers[q.id] !== undefined).length;
                const currentInSeg = currentIndex >= start && currentIndex < end;

                return (
                  <button
                    key={seg}
                    onClick={() => warpTo(start)}
                    className={`h-5 rounded px-1.5 text-[10px] font-medium transition-all ${currentInSeg
                        ? 'bg-primary text-primary-foreground shadow-[0_0_8px_hsl(var(--primary)/0.4)]'
                        : answeredInSeg === segQuestions.length
                          ? 'bg-primary/30 text-primary'
                          : answeredInSeg > 0
                            ? 'bg-primary/15 text-muted-foreground'
                            : 'bg-muted text-muted-foreground'
                      }`}
                  >
                    {start + 1}–{end}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => warpTo(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="gap-2 glow-hover"
            >
              <ChevronLeft className="h-4 w-4" />
              {t('quiz.prev')}
            </Button>

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
        </div>
      </main>

      <SubscriptionGate
        open={showGate}
        onOpenChange={(open) => {
          setShowGate(open);
          if (!open) navigate(-1);
        }}
        requiredTier={gateTier}
      />
    </div>
  );
}

function ModeBadge({ mode, category }: { mode: QuizMode; category?: string | null }) {
  const label =
    mode === 'training' && category
      ? `Entraînement — ${category}`
      : mode === 'exam'
        ? 'Examen'
        : mode === 'demo'
          ? 'Démo'
          : mode === 'study'
            ? 'Étude par catégorie'
            : 'Entraînement';

  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase ${mode === 'exam'
          ? 'bg-destructive/20 text-destructive'
          : mode === 'demo'
            ? 'bg-secondary text-secondary-foreground'
            : 'bg-primary/10 text-primary'
        }`}
    >
      {label}
    </span>
  );
}
