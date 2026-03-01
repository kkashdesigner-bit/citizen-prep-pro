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
import ExamNavigator from '@/components/ExamNavigator';
import SubscriptionGate from '@/components/SubscriptionGate';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Flag, CheckCircle, SkipForward, BookmarkCheck } from 'lucide-react';
import Logo from '@/components/Logo';

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
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
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
    setAnswers((prev) => ({ ...prev, [question.id]: answer }));
    saveAnswer(question, answer);
  };

  const toggleFlag = () => {
    const qId = questions[currentIndex]?.id;
    if (qId === undefined) return;
    setFlagged(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
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

    // Save detailed errors for the "Review errors" feature
    const errors = results
      .filter(r => !r.correct)
      .map(r => {
        const q = questions.find(qq => qq.id === r.questionId)!;
        return {
          questionText: q.question_text,
          options: [q.option_a, q.option_b, q.option_c, q.option_d],
          selectedAnswer: r.selectedAnswer || '—',
          correctAnswer: getCorrectAnswerText(q),
          category: r.category,
          explanation: q.explanation || '',
        };
      });
    sessionStorage.setItem('quizErrors', JSON.stringify(errors));

    navigate('/results');
  }, [answers, questions, startTime, navigate]);

  // ─── Loading State ───
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
        <div className="container flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-muted-foreground">Aucune question disponible.</p>
          <Button variant="outline" onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const showFeedback = effectiveMode === 'study' || effectiveMode === 'training';
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  const completedPercent = Math.round((answeredCount / questions.length) * 100);

  const timerMinutes = Math.floor(timeRemaining / 60);
  const timerSeconds = timeRemaining % 60;

  const modeLabel = effectiveMode === 'exam' ? 'Exam Mode'
    : effectiveMode === 'demo' ? 'Demo Mode'
      : effectiveMode === 'study' ? 'Study Mode'
        : 'Training Mode';

  const isFlaggedCurrent = flagged.has(currentQuestion.id);

  const flaggedCount = flagged.size;
  const remainingCount = questions.length - answeredCount;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ─── Exam Header ─── */}
      <div className="sticky top-0 z-50 bg-primary text-white shadow-lg">
        <div className="flex items-center justify-between py-2.5 px-3 sm:py-3 sm:px-4 md:px-6 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Logo size="sm" />
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-white/80 truncate">GoCivique Exam</p>
              <p className="text-[10px] sm:text-xs text-white/50 truncate">{modeLabel}</p>
            </div>
          </div>

          {/* Timer — hidden on very small screens in demo mode, always visible in exam mode */}
          {effectiveMode === 'exam' && !isMiniQuiz && (
            <div className="text-center mx-2">
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/60 hidden sm:block">Time Remaining</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight tabular-nums">
                {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
              </p>
            </div>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={handleFinish}
            className="gap-1.5 sm:gap-2 rounded-full bg-white text-primary font-bold hover:bg-white/90 px-3 sm:px-5 text-xs sm:text-sm shrink-0"
          >
            <span className="hidden sm:inline">Finish Exam</span>
            <span className="sm:hidden">Finish</span>
            <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="flex-1 w-full max-w-7xl mx-auto py-4 sm:py-6 px-3 sm:px-4 md:px-6">
        <div className="flex gap-6 items-start">

          {/* ─── Left Column: Question Area ─── */}
          <div className="flex-1 min-w-0">
            {/* Progress strip */}
            <div className="glass-card rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs sm:text-sm font-bold text-foreground">
                  Question <span className="text-primary">{currentIndex + 1}</span> of {questions.length}
                </p>
                <p className="text-xs sm:text-sm font-bold text-primary">{completedPercent}% Completed</p>
              </div>
              <Progress value={progressPercent} className="h-1.5 sm:h-2" />
            </div>

            {/* Question card */}
            <div className="glass-card rounded-xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
              {/* Flag toggle — desktop only (mobile version is below) */}
              <div className="hidden sm:flex justify-end mb-4">
                <button
                  onClick={toggleFlag}
                  className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-colors ${isFlaggedCurrent ? 'text-[#EF4135]' : 'text-muted-foreground hover:text-[#EF4135]'
                    }`}
                >
                  <Flag className={`h-3.5 w-3.5 ${isFlaggedCurrent ? 'fill-current' : ''}`} />
                  {isFlaggedCurrent ? 'Flagged' : 'Flag for Review'}
                </button>
              </div>

              {/* Question body */}
              <div className={warpState === 'exit' ? 'warp-exit' : warpState === 'enter' ? 'warp-enter' : ''}>
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
            </div>

            {/* ─── Mobile Flag Button (prominent, visible only on small screens) ─── */}
            <div className="sm:hidden mb-3">
              <button
                onClick={toggleFlag}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-sm uppercase tracking-widest transition-all ${isFlaggedCurrent
                  ? 'border-[#EF4135] bg-red-50 text-[#EF4135]'
                  : 'border-border/60 bg-card text-muted-foreground hover:border-[#EF4135] hover:text-[#EF4135]'
                  }`}
              >
                <Flag className={`h-4 w-4 ${isFlaggedCurrent ? 'fill-current' : ''}`} />
                {isFlaggedCurrent ? '🚩 Flagged' : '🏳️ Flag Question'}
              </button>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <Button
                variant="outline"
                onClick={() => warpTo(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 h-10 sm:h-11 rounded-xl"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous Question</span>
                <span className="sm:hidden">Previous</span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => warpTo(Math.min(questions.length - 1, currentIndex + 1))}
                disabled={currentIndex === questions.length - 1}
                className="gap-1 sm:gap-2 text-muted-foreground text-xs sm:text-sm h-10 sm:h-11"
              >
                Skip
              </Button>

              {currentIndex === questions.length - 1 ? (
                <Button onClick={handleFinish} className="gap-1 sm:gap-2 btn-glow text-xs sm:text-sm px-4 sm:px-6 h-10 sm:h-11 rounded-xl">
                  Finish Exam
                  <CheckCircle className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => warpTo(Math.min(questions.length - 1, currentIndex + 1))}
                  className="gap-1 sm:gap-2 btn-glow text-xs sm:text-sm px-4 sm:px-6 h-10 sm:h-11 rounded-xl"
                >
                  <span className="hidden sm:inline">Save &</span> Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* ─── Mobile Stats + Navigator (visible only on small screens) ─── */}
            <div className="lg:hidden mt-5 space-y-4">
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="rounded-xl border border-border/60 bg-card p-3 text-center">
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
                    Answered
                  </p>
                  <p className="text-xl sm:text-2xl font-extrabold text-foreground">{String(answeredCount).padStart(2, '0')}</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-card p-3 text-center">
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
                    Flagged
                  </p>
                  <p className="text-xl sm:text-2xl font-extrabold text-[#EF4135]">{String(flaggedCount).padStart(2, '0')}</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-card p-3 text-center">
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
                    Remaining
                  </p>
                  <p className="text-xl sm:text-2xl font-extrabold text-foreground">{String(remainingCount).padStart(2, '0')}</p>
                </div>
              </div>

              {/* Question navigator grid */}
              <div className="rounded-xl border border-border/60 bg-card p-4">
                <h3 className="text-xs font-bold text-foreground mb-3 uppercase tracking-widest">Exam Navigator</h3>
                <div className="grid grid-cols-5 gap-1.5">
                  {questions.map((q, idx) => {
                    const isCurrent = idx === currentIndex;
                    const isAnswered = answers[q.id] !== undefined;
                    const isFlagged = flagged.has(q.id);

                    let cls = 'bg-muted/50 text-muted-foreground border-transparent';
                    if (isCurrent) cls = 'bg-primary text-primary-foreground border-primary shadow-md';
                    else if (isFlagged) cls = 'bg-card text-[#EF4135] border-[#EF4135]/50';
                    else if (isAnswered) cls = 'bg-card text-primary border-primary/40';

                    return (
                      <button
                        key={q.id}
                        onClick={() => warpTo(idx)}
                        className={`relative h-9 rounded-lg border-2 text-[11px] font-bold transition-all ${cls}`}
                      >
                        {String(idx + 1).padStart(2, '0')}
                        {isFlagged && !isCurrent && (
                          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#EF4135] rounded-full border border-white" />
                        )}
                      </button>
                    );
                  })}
                </div>
                {/* Mobile legend */}
                <div className="grid grid-cols-2 gap-1.5 mt-3 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-primary" /> Current
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm border-2 border-primary/40" /> Answered
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm border-2 border-[#EF4135]/50 relative">
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#EF4135] rounded-full" />
                    </span>
                    Flagged
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-muted/50" /> Unvisited
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Right Column: Sidebar (hidden on small screens) ─── */}
          <div className="hidden lg:block w-72 xl:w-80 flex-shrink-0 sticky top-20">
            <ExamNavigator
              totalQuestions={questions.length}
              currentIndex={currentIndex}
              answers={answers}
              questionIds={questions.map(q => q.id)}
              flagged={flagged}
              onJump={warpTo}
            />
          </div>
        </div>
      </div>

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
