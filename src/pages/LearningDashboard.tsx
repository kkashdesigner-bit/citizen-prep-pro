import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SubscriptionGate from '@/components/SubscriptionGate';
import { TIER_LABELS, TIER_BADGE_VARIANT, TIER_BADGE_CLASS } from '@/lib/subscriptionTiers';
import {
  BookOpen, GraduationCap, Target, BarChart3, Lock, Play,
  ArrowRight, Clock, CheckCircle, Trophy, Sparkles
} from 'lucide-react';

interface Lesson {
  id: string;
  category: string;
  level: string;
  title: string;
  estimated_minutes: number;
  order_index: number;
}

interface LessonProgress {
  lesson_id: string;
  status: string;
  score_last: number | null;
}

interface ExamHistoryEntry {
  date: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
}

const CATEGORIES = ['Principles', 'Institutions', 'Rights', 'History', 'Living'];

export default function LearningDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { tier, isStandardOrAbove, isPremium, loading: tierLoading } = useSubscription();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [examHistory, setExamHistory] = useState<ExamHistoryEntry[]>([]);
  const [displayName, setDisplayName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showGate, setShowGate] = useState(false);
  const [gateTier, setGateTier] = useState<'standard' | 'premium'>('standard');

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/auth'); return; }

    const fetchData = async () => {
      const [lessonsRes, progressRes, profileRes] = await Promise.all([
        supabase.from('lessons').select('id, category, level, title, estimated_minutes, order_index').order('order_index'),
        supabase.from('lesson_progress').select('lesson_id, status, score_last').eq('user_id', user.id),
        supabase.from('profiles').select('display_name, email, exam_history').eq('id', user.id).maybeSingle(),
      ]);

      setLessons((lessonsRes.data as Lesson[]) || []);
      setProgress((progressRes.data as LessonProgress[]) || []);
      setDisplayName(profileRes.data?.display_name || profileRes.data?.email || '');
      setExamHistory((profileRes.data?.exam_history as unknown as ExamHistoryEntry[]) || []);
      setLoading(false);
    };
    fetchData();
  }, [user, authLoading, navigate]);

  const openGate = (required: 'standard' | 'premium') => {
    setGateTier(required);
    setShowGate(true);
  };

  if (authLoading || loading || tierLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container flex items-center justify-center py-20">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  const completedLessons = progress.filter(p => p.status === 'completed').length;
  const totalLessons = lessons.length;
  const nextLesson = lessons.find(l => {
    const p = progress.find(pr => pr.lesson_id === l.id);
    return !p || p.status !== 'completed';
  });

  const avgScore = examHistory.length > 0
    ? Math.round(examHistory.reduce((sum, e) => sum + (e.score / e.totalQuestions) * 100, 0) / examHistory.length)
    : 0;

  const categoryProgress = CATEGORIES.map(cat => {
    const catLessons = lessons.filter(l => l.category === cat);
    const catCompleted = catLessons.filter(l => progress.find(p => p.lesson_id === l.id && p.status === 'completed')).length;
    return { category: cat, total: catLessons.length, completed: catCompleted };
  });

  const firstName = displayName.split(' ')[0] || displayName;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
                {t('learn.welcome').replace('{name}', firstName)}
              </h1>
              <p className="mt-2 text-muted-foreground">{t('learn.subtitle')}</p>
            </div>
            <Badge variant={TIER_BADGE_VARIANT[tier]} className={TIER_BADGE_CLASS[tier] || ''}>
              {TIER_LABELS[tier]}
            </Badge>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* CONTINUE LEARNING */}
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-primary" />
                {t('learn.continueLearning')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nextLesson ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-border/30 bg-secondary/30 p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Clock className="h-3 w-3" />
                      {nextLesson.estimated_minutes} min
                      <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                        {nextLesson.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground">{nextLesson.title}</h3>
                  </div>
                  <Button
                    className="w-full btn-glow gap-2"
                    onClick={() => {
                      if (!isStandardOrAbove) { openGate('standard'); return; }
                      navigate(`/lesson/${nextLesson.id}`);
                    }}
                  >
                    <Play className="h-4 w-4" />
                    {t('learn.resume')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center py-6 text-center">
                  <Trophy className="mb-3 h-10 w-10 text-primary" />
                  <p className="font-medium text-foreground">{t('learn.allCompleted')}</p>
                </div>
              )}
            </CardContent>
            {tier === 'free' && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-md">
                <div className="text-center">
                  <Lock className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="mb-3 text-sm font-medium text-foreground">{t('learn.locked')}</p>
                  <Button size="sm" className="btn-glow" onClick={() => openGate('standard')}>
                    {t('learn.upgrade')}
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* MY LEARNING PATH */}
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <GraduationCap className="h-5 w-5 text-primary" />
                {t('learn.learningPath')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryProgress.map(cp => (
                  <div key={cp.category} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{cp.category}</span>
                      <span className="text-muted-foreground">
                        {cp.completed}/{cp.total}
                      </span>
                    </div>
                    <Progress value={cp.total > 0 ? (cp.completed / cp.total) * 100 : 0} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
            {tier === 'free' && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-md">
                <div className="text-center">
                  <Lock className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="mb-3 text-sm font-medium text-foreground">{t('learn.locked')}</p>
                  <Button size="sm" className="btn-glow" onClick={() => openGate('standard')}>
                    {t('learn.upgrade')}
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* PRACTICE & TEST */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-primary" />
                {t('learn.practiceTest')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 glow-hover"
                  onClick={() => navigate('/quiz?mode=exam')}
                >
                  <Play className="h-4 w-4 text-primary" />
                  {t('learn.demoExam')}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 glow-hover"
                  onClick={() => {
                    if (!isStandardOrAbove) { openGate('standard'); return; }
                    navigate('/quiz?mode=exam');
                  }}
                >
                  <CheckCircle className="h-4 w-4 text-primary" />
                  {t('learn.fullExam')}
                  {!isStandardOrAbove && <Lock className="ml-auto h-4 w-4 text-muted-foreground" />}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 glow-hover"
                  onClick={() => {
                    if (!isStandardOrAbove) { openGate('standard'); return; }
                    navigate('/quiz?mode=study');
                  }}
                >
                  <BookOpen className="h-4 w-4 text-primary" />
                  {t('learn.training')}
                  {!isStandardOrAbove && <Lock className="ml-auto h-4 w-4 text-muted-foreground" />}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 glow-hover"
                  onClick={() => {
                    if (!isPremium) { openGate('premium'); return; }
                    navigate('/quiz?mode=training');
                  }}
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                  {t('learn.categoryTraining')}
                  {!isPremium && <Lock className="ml-auto h-4 w-4 text-muted-foreground" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* MY PROGRESS */}
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-primary" />
                {t('learn.myProgress')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border/30 bg-secondary/30 p-3">
                  <span className="text-sm text-muted-foreground">{t('learn.lessonsCompleted')}</span>
                  <span className="font-semibold text-foreground">{completedLessons}/{totalLessons}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/30 bg-secondary/30 p-3">
                  <span className="text-sm text-muted-foreground">{t('learn.accuracy')}</span>
                  <span className="font-semibold text-foreground">{avgScore}%</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/30 bg-secondary/30 p-3">
                  <span className="text-sm text-muted-foreground">{t('learn.examsTaken')}</span>
                  <span className="font-semibold text-foreground">{examHistory.length}</span>
                </div>
              </div>
            </CardContent>
            {tier === 'free' && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-md">
                <div className="text-center">
                  <Lock className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="mb-3 text-sm font-medium text-foreground">{t('learn.locked')}</p>
                  <Button size="sm" className="btn-glow" onClick={() => openGate('standard')}>
                    {t('learn.upgrade')}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
      <Footer />
      <SubscriptionGate open={showGate} onOpenChange={setShowGate} requiredTier={gateTier} />
    </div>
  );
}
