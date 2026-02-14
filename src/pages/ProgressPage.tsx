import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import LearnSidebar from '@/components/learn/LearnSidebar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CATEGORY_LABELS, Category } from '@/lib/types';
import {
  BarChart3, TrendingUp, TrendingDown, Target, Clock, CheckCircle, ArrowRight,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts';

interface ExamHistoryEntry {
  date: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  timeSpent?: number;
  categoryBreakdown?: Record<string, { correct: number; total: number }>;
}

interface LessonProgressEntry {
  lesson_id: string;
  status: string;
  score_last: number | null;
}

export default function ProgressPage() {
  const { user, loading: authLoading } = useAuth();
  const { tier, isPremium, loading: tierLoading } = useSubscription();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [examHistory, setExamHistory] = useState<ExamHistoryEntry[]>([]);
  const [lessonProgress, setLessonProgress] = useState<LessonProgressEntry[]>([]);
  const [totalLessons, setTotalLessons] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/auth'); return; }
    const load = async () => {
      const [profileRes, progressRes, lessonsRes] = await Promise.all([
        supabase.from('profiles').select('exam_history').eq('id', user.id).maybeSingle(),
        supabase.from('lesson_progress').select('lesson_id, status, score_last').eq('user_id', user.id),
        supabase.from('lessons').select('id', { count: 'exact', head: true }),
      ]);
      setExamHistory((profileRes.data?.exam_history as unknown as ExamHistoryEntry[]) || []);
      setLessonProgress((progressRes.data as LessonProgressEntry[]) || []);
      setTotalLessons(lessonsRes.count || 0);
      setLoading(false);
    };
    load();
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

  const totalExams = examHistory.length;
  const overallAccuracy = totalExams > 0
    ? Math.round(examHistory.reduce((s, e) => s + (e.score / e.totalQuestions), 0) / totalExams * 100)
    : 0;
  const passRate = totalExams > 0
    ? Math.round(examHistory.filter(e => e.passed).length / totalExams * 100)
    : 0;
  const totalStudyTime = examHistory.reduce((s, e) => s + (e.timeSpent || 0), 0);
  const studyMinutes = Math.round(totalStudyTime / 60);
  const completedLessons = lessonProgress.filter(p => p.status === 'completed').length;

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

  const weakCategories = sortedCategories.filter(c => c.accuracy < 0.8);
  const strongCategories = sortedCategories.filter(c => c.accuracy >= 0.8);

  // Chart data
  const chartData = sortedCategories.map(c => ({
    name: CATEGORY_LABELS[language]?.[c.category as Category] || c.category,
    accuracy: Math.round(c.accuracy * 100),
    category: c.category,
  }));

  // Exam history chart (last 10)
  const examChartData = examHistory.slice(-10).map((e, i) => ({
    name: `#${i + 1}`,
    score: Math.round((e.score / e.totalQuestions) * 100),
    passed: e.passed,
  }));

  return (
    <div className="flex min-h-screen bg-background">
      <LearnSidebar />
      <main className="flex-1 md:ml-64 pb-20 md:pb-8">
        <div className="mx-auto max-w-4xl px-4 md:px-8 py-6 md:py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Your Progress</h1>

          {/* Top stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-8">
            <StatBox icon={Target} label="Predicted Score" value={`${overallAccuracy}%`}
              subtext={overallAccuracy >= 80 ? 'On track' : 'Keep practicing'}
              accent={overallAccuracy >= 80}
            />
            <StatBox icon={BarChart3} label="Accuracy" value={`${overallAccuracy}%`}
              subtext={`${totalExams} exams`}
            />
            <StatBox icon={CheckCircle} label="Pass Rate" value={`${passRate}%`}
              subtext={`${examHistory.filter(e => e.passed).length}/${totalExams}`}
            />
            <StatBox icon={Clock} label="Study Time" value={`${studyMinutes}m`}
              subtext="Total time"
            />
            <StatBox icon={CheckCircle} label="Lessons" value={`${completedLessons}/${totalLessons}`}
              subtext="Completed"
            />
          </div>

          {/* Exam score trend chart */}
          {examChartData.length > 1 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-foreground mb-4">Exam Score Trend</h2>
              <div className="rounded-xl border border-border/50 bg-card p-4">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={examChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                      {examChartData.map((entry, i) => (
                        <Cell key={i} fill={entry.passed ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}

          {/* Category performance chart */}
          {chartData.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-foreground mb-4">Performance by Domain</h2>
              <div className="rounded-xl border border-border/50 bg-card p-4">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Bar dataKey="accuracy" radius={[0, 4, 4, 0]}>
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={entry.accuracy >= 80 ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}

          {/* Domain Breakdown list */}
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

          {/* Weak area suggestions */}
          {weakCategories.length > 0 && (
            <section className="mb-8">
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 md:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown className="h-5 w-5 text-destructive" />
                  <h3 className="font-semibold text-foreground">Needs Improvement</h3>
                </div>
                <ul className="space-y-3">
                  {weakCategories.map(c => {
                    const catLabel = CATEGORY_LABELS[language]?.[c.category as Category] || c.category;
                    return (
                      <li key={c.category} className="flex items-center justify-between">
                        <span className="text-sm text-foreground">{catLabel}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-destructive">{Math.round(c.accuracy * 100)}%</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="gap-1 text-xs"
                            onClick={() => navigate(
                              isPremium
                                ? `/quiz?mode=training&category=${c.category}`
                                : `/quiz?mode=study&category=${c.category}`
                            )}
                          >
                            Practice <ArrowRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
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

          {totalExams === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground mb-4">Take your first exam to see your progress analytics.</p>
              <Button onClick={() => navigate('/quiz?mode=exam')} className="gap-2">
                Start Exam <ArrowRight className="h-4 w-4" />
              </Button>
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
