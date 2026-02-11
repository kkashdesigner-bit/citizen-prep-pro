import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import LearnSidebar from '@/components/learn/LearnSidebar';
import { Progress } from '@/components/ui/progress';
import { CATEGORY_LABELS, Category } from '@/lib/types';
import {
  BarChart3, TrendingUp, TrendingDown, Target, Clock, CheckCircle,
} from 'lucide-react';

interface ExamHistoryEntry {
  date: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  timeSpent?: number;
  categoryBreakdown?: Record<string, { correct: number; total: number }>;
}

export default function ProgressPage() {
  const { user, loading: authLoading } = useAuth();
  const { tier, loading: tierLoading } = useSubscription();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [examHistory, setExamHistory] = useState<ExamHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/auth'); return; }
    const fetch = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('exam_history')
        .eq('id', user.id)
        .maybeSingle();
      setExamHistory((data?.exam_history as unknown as ExamHistoryEntry[]) || []);
      setLoading(false);
    };
    fetch();
  }, [user, authLoading, navigate]);

  if (authLoading || loading || tierLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <LearnSidebar />
        <div className="flex-1 md:ml-64 flex items-center justify-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  // Computed stats
  const totalExams = examHistory.length;
  const overallAccuracy = totalExams > 0
    ? Math.round(examHistory.reduce((s, e) => s + (e.score / e.totalQuestions), 0) / totalExams * 100)
    : 0;
  const predictedScore = overallAccuracy; // simple prediction based on avg
  const totalStudyTime = examHistory.reduce((s, e) => s + (e.timeSpent || 0), 0);
  const studyMinutes = Math.round(totalStudyTime / 60);

  // Category breakdown
  const categoryStats: Record<string, { correct: number; total: number }> = {};
  examHistory.forEach((exam) => {
    if (!exam.categoryBreakdown) return;
    Object.entries(exam.categoryBreakdown).forEach(([cat, data]) => {
      if (!categoryStats[cat]) categoryStats[cat] = { correct: 0, total: 0 };
      categoryStats[cat].correct += data.correct;
      categoryStats[cat].total += data.total;
    });
  });

  const sortedCategories = Object.entries(categoryStats)
    .map(([cat, data]) => ({ category: cat, accuracy: data.total > 0 ? data.correct / data.total : 0, ...data }))
    .sort((a, b) => a.accuracy - b.accuracy);

  const strongCategories = sortedCategories.filter(c => c.accuracy >= 0.8);
  const weakCategories = sortedCategories.filter(c => c.accuracy < 0.8);

  return (
    <div className="flex min-h-screen bg-background">
      <LearnSidebar />
      <main className="flex-1 md:ml-64 pb-20 md:pb-8">
        <div className="mx-auto max-w-4xl px-4 md:px-8 py-6 md:py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Your Progress</h1>

          {/* Top stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
            <StatBox icon={Target} label="Predicted Score" value={`${predictedScore}%`}
              subtext={predictedScore >= 80 ? 'On track to pass' : 'Keep practicing'}
              accent={predictedScore >= 80}
            />
            <StatBox icon={BarChart3} label="Accuracy" value={`${overallAccuracy}%`}
              subtext={`${totalExams} exams`}
            />
            <StatBox icon={Clock} label="Study Time" value={`${studyMinutes}m`}
              subtext="Total time"
            />
            <StatBox icon={CheckCircle} label="Exams Done" value={`${totalExams}`}
              subtext={`${examHistory.filter(e => e.passed).length} passed`}
            />
          </div>

          {/* Domain Breakdown */}
          {sortedCategories.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-foreground mb-4">Domain Breakdown</h2>
              <div className="space-y-3">
                {sortedCategories.map(({ category, accuracy, correct, total }) => {
                  const pct = Math.round(accuracy * 100);
                  const label = CATEGORY_LABELS[language]?.[category as Category] || category;
                  return (
                    <div key={category} className="rounded-xl border border-border/50 bg-card p-3 md:p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">{label}</span>
                        <span className="text-xs text-muted-foreground">{correct}/{total} ({pct}%)</span>
                      </div>
                      <Progress value={pct} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Strong vs Weak */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weakCategories.length > 0 && (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 md:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown className="h-5 w-5 text-destructive" />
                  <h3 className="font-semibold text-foreground">Needs Improvement</h3>
                </div>
                <ul className="space-y-2">
                  {weakCategories.map(c => (
                    <li key={c.category} className="flex items-center justify-between text-sm">
                      <span className="text-foreground">
                        {CATEGORY_LABELS[language]?.[c.category as Category] || c.category}
                      </span>
                      <span className="text-destructive font-medium">{Math.round(c.accuracy * 100)}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {strongCategories.length > 0 && (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 md:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Strong Areas</h3>
                </div>
                <ul className="space-y-2">
                  {strongCategories.map(c => (
                    <li key={c.category} className="flex items-center justify-between text-sm">
                      <span className="text-foreground">
                        {CATEGORY_LABELS[language]?.[c.category as Category] || c.category}
                      </span>
                      <span className="text-primary font-medium">{Math.round(c.accuracy * 100)}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {totalExams === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground">Take your first exam to see your progress analytics.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatBox({ icon: Icon, label, value, subtext, accent }: {
  icon: React.ElementType; label: string; value: string; subtext: string; accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-3 md:p-4 text-center transition-all hover:border-primary/20">
      <Icon className={`mx-auto h-5 w-5 mb-1 ${accent ? 'text-primary' : 'text-muted-foreground'}`} />
      <p className="text-xl md:text-2xl font-bold text-foreground">{value}</p>
      <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
      <p className="text-[10px] text-muted-foreground mt-0.5">{subtext}</p>
    </div>
  );
}
