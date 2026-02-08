import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { BarChart3, BookOpen, Clock, Target, TrendingUp } from 'lucide-react';

interface ExamHistoryEntry {
  date: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  timeSpent: number;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [examHistory, setExamHistory] = useState<ExamHistoryEntry[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('exam_history, is_subscribed')
        .eq('id', user.id)
        .maybeSingle();

      if (data) {
        setExamHistory((data.exam_history as unknown as ExamHistoryEntry[]) || []);
        setIsSubscribed(data.is_subscribed);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container flex items-center justify-center py-20">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  const last5 = examHistory.slice(-5);
  const passProb =
    last5.length > 0
      ? Math.round(
          (last5.reduce((sum, e) => sum + (e.score / e.totalQuestions) * 100, 0) / last5.length),
        )
      : 0;

  const totalExams = examHistory.length;
  const totalPassed = examHistory.filter((e) => e.passed).length;
  const avgScore =
    totalExams > 0
      ? Math.round(
          examHistory.reduce((sum, e) => sum + (e.score / e.totalQuestions) * 100, 0) /
            totalExams,
        )
      : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground">Tableau de bord</h1>
          <p className="text-muted-foreground">Suivez votre progression et vos résultats</p>
        </div>

        {/* Stats grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Probabilité de réussite</p>
                <p className="text-2xl font-bold text-foreground">{passProb}%</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Examens passés</p>
                <p className="text-2xl font-bold text-foreground">{totalExams}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Score moyen</p>
                <p className="text-2xl font-bold text-foreground">{avgScore}%</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Réussis</p>
                <p className="text-2xl font-bold text-foreground">
                  {totalPassed}/{totalExams}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pass probability bar */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Probabilité de réussite</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Basée sur vos 5 derniers examens</span>
              <span className="font-medium text-foreground">{passProb}%</span>
            </div>
            <Progress value={passProb} className="h-4" />
            <p className="mt-2 text-xs text-muted-foreground">Seuil de réussite : 80%</p>
          </CardContent>
        </Card>

        {/* Exam history */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-lg">Historique des examens</CardTitle>
            <Button onClick={() => navigate('/quiz?mode=exam')} size="sm">
              Nouvel examen
            </Button>
          </CardHeader>
          <CardContent>
            {examHistory.length === 0 ? (
              <div className="py-8 text-center">
                <Clock className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground">Aucun examen passé pour le moment</p>
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={() => navigate('/quiz?mode=exam')}
                >
                  Passer votre premier examen
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {[...examHistory].reverse().map((entry, i) => {
                  const percent = Math.round((entry.score / entry.totalQuestions) * 100);
                  const mins = Math.floor(entry.timeSpent / 60);
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-border p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                            entry.passed
                              ? 'bg-primary/10 text-primary'
                              : 'bg-destructive/10 text-destructive'
                          }`}
                        >
                          {percent}%
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {entry.score}/{entry.totalQuestions} —{' '}
                            {entry.passed ? 'Réussi' : 'Échoué'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(entry.date).toLocaleDateString('fr-FR')} · {mins} min
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
