import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { CATEGORY_LABELS, ExamResult } from '@/lib/types';
import Header from '@/components/Header';
import { Trophy, XCircle, Clock, BarChart3, RotateCcw, Home } from 'lucide-react';

export default function Results() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [result, setResult] = useState<ExamResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('quizResults');
    if (stored) {
      setResult(JSON.parse(stored));
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!result) return null;

  const scorePercent = Math.round((result.score / result.totalQuestions) * 100);
  const minutes = Math.floor(result.timeSpent / 60);
  const seconds = result.timeSpent % 60;

  return (
    <div className="min-h-screen bg-secondary">
      <Header />
      <div className="container py-12">
        {/* Score card */}
        <Card className="mx-auto max-w-2xl overflow-hidden">
          <div
            className={`p-8 text-center ${
              result.passed ? 'bg-primary' : 'bg-destructive'
            }`}
          >
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-background/20">
              {result.passed ? (
                <Trophy className="h-10 w-10 text-primary-foreground" />
              ) : (
                <XCircle className="h-10 w-10 text-destructive-foreground" />
              )}
            </div>
            <h1 className="mb-2 font-serif text-3xl font-bold text-primary-foreground">
              {result.passed ? t('results.passed') : t('results.failed')}
            </h1>
            <p className="text-lg text-primary-foreground/80">
              {t('results.passThreshold')}
            </p>
          </div>

          <CardContent className="p-6">
            {/* Stats */}
            <div className="mb-8 grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-border bg-card p-4 text-center">
                <BarChart3 className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="text-3xl font-bold text-foreground">{scorePercent}%</p>
                <p className="text-sm text-muted-foreground">
                  {result.score}/{result.totalQuestions} {t('results.score')}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4 text-center">
                <Clock className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="text-3xl font-bold text-foreground">
                  {minutes}:{String(seconds).padStart(2, '0')}
                </p>
                <p className="text-sm text-muted-foreground">{t('results.time')}</p>
              </div>
            </div>

            {/* Category breakdown */}
            <h3 className="mb-4 font-serif text-lg font-bold text-foreground">
              {t('results.categories')}
            </h3>
            <div className="space-y-4">
              {Object.entries(result.categoryBreakdown).map(([cat, data]) => {
                const catPercent = Math.round((data.correct / data.total) * 100);
                const categoryName = CATEGORY_LABELS[language]?.[cat as keyof typeof CATEGORY_LABELS.fr] || cat;
                return (
                  <div key={cat}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-foreground">{categoryName}</span>
                      <span className="text-muted-foreground">
                        {data.correct}/{data.total} ({catPercent}%)
                      </span>
                    </div>
                    <Progress
                      value={catPercent}
                      className={`h-3 ${catPercent >= 80 ? '' : ''}`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-3">
              <Button
                variant="default"
                className="flex-1 gap-2"
                onClick={() => {
                  sessionStorage.removeItem('quizResults');
                  navigate('/quiz?mode=study');
                }}
              >
                <RotateCcw className="h-4 w-4" />
                {t('results.retry')}
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => {
                  sessionStorage.removeItem('quizResults');
                  navigate('/');
                }}
              >
                <Home className="h-4 w-4" />
                {t('results.home')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
