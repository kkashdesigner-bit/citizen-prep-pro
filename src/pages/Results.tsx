import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { CATEGORY_LABELS, ExamResult } from '@/lib/types';
import Header from '@/components/Header';
import SubscriptionGate from '@/components/SubscriptionGate';
import { Trophy, XCircle, Clock, BarChart3, RotateCcw, Home } from 'lucide-react';

export default function Results() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [result, setResult] = useState<ExamResult | null>(null);
  const [showGate, setShowGate] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('quizResults');
    if (stored) {
      setResult(JSON.parse(stored));
      const demoTaken = sessionStorage.getItem('demoTaken');
      if (demoTaken) {
        setTimeout(() => setShowGate(true), 2000);
      } else {
        sessionStorage.setItem('demoTaken', 'true');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!result) return null;

  const scorePercent = Math.round((result.score / result.totalQuestions) * 100);
  const minutes = Math.floor(result.timeSpent / 60);
  const seconds = result.timeSpent % 60;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-12">
        <div className="mx-auto max-w-2xl glass-card overflow-hidden">
          <div
            className={`p-8 text-center ${
              result.passed
                ? 'bg-primary/20 shadow-[inset_0_0_60px_hsl(var(--primary)/0.15)]'
                : 'bg-destructive/20 shadow-[inset_0_0_60px_hsl(var(--destructive)/0.15)]'
            }`}
          >
            <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${
              result.passed ? 'bg-primary/20' : 'bg-destructive/20'
            }`}>
              {result.passed ? (
                <Trophy className="h-10 w-10 text-primary" />
              ) : (
                <XCircle className="h-10 w-10 text-destructive" />
              )}
            </div>
            <h1 className="mb-2 font-serif text-3xl font-bold text-foreground">
              {result.passed ? t('results.passed') : t('results.failed')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('results.passThreshold')}
            </p>
          </div>

          <div className="p-6">
            <div className="mb-8 grid grid-cols-2 gap-4">
              <div className="glass-card p-4 text-center">
                <BarChart3 className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="text-3xl font-bold text-foreground">{scorePercent}%</p>
                <p className="text-sm text-muted-foreground">
                  {result.score}/{result.totalQuestions} {t('results.score')}
                </p>
              </div>
              <div className="glass-card p-4 text-center">
                <Clock className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="text-3xl font-bold text-foreground">
                  {minutes}:{String(seconds).padStart(2, '0')}
                </p>
                <p className="text-sm text-muted-foreground">{t('results.time')}</p>
              </div>
            </div>

            <h3 className="mb-4 font-serif text-lg font-bold text-foreground">
              {t('results.categories')}
            </h3>
            <div className="space-y-4">
              {Object.entries(result.categoryBreakdown).map(([cat, data]) => {
                const catPercent = Math.round((data.correct / data.total) * 100);
                const categoryName =
                  CATEGORY_LABELS[language]?.[cat as keyof typeof CATEGORY_LABELS.fr] || cat;
                return (
                  <div key={cat}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-foreground">{categoryName}</span>
                      <span className="text-muted-foreground">
                        {data.correct}/{data.total} ({catPercent}%)
                      </span>
                    </div>
                    <Progress value={catPercent} className="h-3" />
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex gap-3">
              <Button
                variant="default"
                className="flex-1 gap-2 btn-glow"
                onClick={() => {
                  sessionStorage.removeItem('quizResults');
                  navigate('/quiz?mode=exam');
                }}
              >
                <RotateCcw className="h-4 w-4" />
                {t('results.retry')}
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2 glow-hover"
                onClick={() => {
                  sessionStorage.removeItem('quizResults');
                  navigate('/');
                }}
              >
                <Home className="h-4 w-4" />
                {t('results.home')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <SubscriptionGate open={showGate} onOpenChange={setShowGate} />
    </div>
  );
}
