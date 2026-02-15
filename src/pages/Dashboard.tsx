import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WeaknessAlert from '@/components/WeaknessAlert';
import CategorySelector from '@/components/CategorySelector';
import LevelSelector from '@/components/LevelSelector';
import SubscriptionGate from '@/components/SubscriptionGate';
import PremiumVideoGuides from '@/components/PremiumVideoGuides';
import CircularProgress from '@/components/CircularProgress';
import { BookOpen, CheckCircle, Clock, Lock, Target, XCircle } from 'lucide-react';
import { Category, ExamLevel, DB_CATEGORIES, CATEGORY_LABELS } from '@/lib/types';
import { TIER_LABELS, TIER_BADGE_VARIANT, TIER_BADGE_CLASS } from '@/lib/subscriptionTiers';

interface ExamHistoryEntry {
  date: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  timeSpent: number;
  categoryBreakdown?: Record<string, { correct: number; total: number }>;
}

interface CategoryProgress {
  category: string;
  answered: number;
  total: number;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { tier, isStandardOrAbove, isPremium, loading: tierLoading } = useSubscription();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [examHistory, setExamHistory] = useState<ExamHistoryEntry[]>([]);
  const [totalQuestionCount, setTotalQuestionCount] = useState(0);
  const [uniqueAnsweredCount, setUniqueAnsweredCount] = useState(0);
  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<ExamLevel>('CSP');
  const [loading, setLoading] = useState(true);
  const [showGate, setShowGate] = useState(false);
  const [gateTier, setGateTier] = useState<'standard' | 'premium'>('standard');
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/auth'); return; }

    const fetchData = async () => {
      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('exam_history, display_name, avatar_url, email')
        .eq('id', user.id)
        .maybeSingle();

      if (profile) {
        setExamHistory((profile.exam_history as unknown as ExamHistoryEntry[]) || []);
        setDisplayName(profile.display_name);
        setAvatarUrl(profile.avatar_url);
        setEmail(profile.email);
      }

      // Total questions count
      const { count: totalCount } = await supabase
        .from('questions')
        .select('id', { count: 'exact', head: true });
      setTotalQuestionCount(totalCount || 0);

      // Count unique questions answered by this user from user_answers
      const { data: answeredData } = await supabase
        .from('user_answers' as any)
        .select('question_id, category')
        .eq('user_id', user.id);

      const uniqueQuestionIds = new Set((answeredData || []).map((a: any) => a.question_id));
      setUniqueAnsweredCount(uniqueQuestionIds.size);

      // Calculate per-category progress
      const catProgressMap: Record<string, Set<number>> = {};
      (answeredData || []).forEach((a: any) => {
        const cat = a.category || 'Unknown';
        if (!catProgressMap[cat]) catProgressMap[cat] = new Set();
        catProgressMap[cat].add(a.question_id);
      });

      // Get total per category
      const catProgressArr: CategoryProgress[] = [];
      for (const cat of DB_CATEGORIES) {
        const { count } = await supabase
          .from('questions')
          .select('id', { count: 'exact', head: true })
          .eq('category', cat);
        catProgressArr.push({
          category: cat,
          answered: catProgressMap[cat]?.size || 0,
          total: count || 0,
        });
      }
      setCategoryProgress(catProgressArr);

      setLoading(false);
    };
    fetchData();
  }, [user, authLoading, navigate]);

  const openGate = (requiredTier: 'standard' | 'premium') => { setGateTier(requiredTier); setShowGate(true); };

  const handleCategorySelect = (category: Category) => {
    if (!isStandardOrAbove) { openGate('standard'); return; }
    navigate(`/quiz?mode=training&category=${category}`);
  };

  const handleStartExam = () => {
    if (!isStandardOrAbove) {
      openGate('standard');
      return;
    }
    navigate(`/quiz?mode=exam&level=${selectedLevel}`);
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

  const totalExams = examHistory.length;
  const avgScore = totalExams > 0 ? Math.round(examHistory.reduce((sum, e) => sum + (e.score / e.totalQuestions) * 100, 0) / totalExams) : 0;
  const overallProgress = totalQuestionCount > 0 ? Math.round((uniqueAnsweredCount / totalQuestionCount) * 100) : 0;
  const last3 = [...examHistory].reverse().slice(0, 3);
  const userName = displayName || email || 'User';
  const initials = userName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        {/* HEADER CARD */}
        <Card className="mb-8">
          <CardContent className="flex items-center gap-4 p-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={avatarUrl || undefined} alt={userName} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="font-serif text-2xl font-bold text-foreground">{userName}</h1>
              <p className="text-sm text-muted-foreground">{t('dash.dashboard')}</p>
            </div>
            <Badge variant={TIER_BADGE_VARIANT[tier]} className={TIER_BADGE_CLASS[tier] || ''}>{TIER_LABELS[tier]}</Badge>
          </CardContent>
        </Card>

        {/* PROGRESS SECTION */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-4 w-4 text-primary" />
                {t('dash.overallProgress')}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center pb-6">
              <CircularProgress value={overallProgress} label={`${uniqueAnsweredCount} / ${totalQuestionCount} questions`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-4 w-4 text-primary" />
                {t('dash.currentStatus')}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-3 pb-6">
              {avgScore >= 70 ? (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <span className="text-lg font-semibold text-foreground">{t('dash.onTrack')}</span>
                  <span className="text-sm text-muted-foreground">{t('dash.avgScore')} : {avgScore}%</span>
                </>
              ) : (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                    <XCircle className="h-8 w-8 text-destructive" />
                  </div>
                  <span className="text-lg font-semibold text-foreground">{t('dash.needsPractice')}</span>
                  <span className="text-sm text-muted-foreground">{t('dash.avgScore')} : {avgScore}%</span>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-primary" />
                {t('dash.recentActivity')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              {last3.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">{t('dash.noExams')}</p>
              ) : (
                <div className="space-y-3">
                  {last3.map((entry, i) => {
                    const percent = Math.round((entry.score / entry.totalQuestions) * 100);
                    return (
                      <div key={i} className="flex items-center justify-between rounded-md border border-border/30 bg-secondary/30 px-3 py-2">
                        <span className="text-sm text-foreground">Quiz #{examHistory.length - i}</span>
                        <Badge variant={entry.passed ? 'default' : 'secondary'} className="text-xs">{percent}%</Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
            {tier === 'free' && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-md">
                <div className="text-center">
                  <Lock className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="mb-3 text-sm font-medium text-foreground">{t('dash.subscriberOnly')}</p>
                  <Button size="sm" className="btn-glow" onClick={() => navigate('/quiz?mode=exam')}>Lancer la démo</Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        <WeaknessAlert examHistory={examHistory} language={language} />

        {/* Per-Category Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-primary" />
              Progression par catégorie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryProgress.map((cp) => {
              const pct = cp.total > 0 ? Math.round((cp.answered / cp.total) * 100) : 0;
              const label = CATEGORY_LABELS[language]?.[cp.category as Category] || cp.category;
              return (
                <div key={cp.category}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-foreground">{label}</span>
                    <span className="text-muted-foreground">{cp.answered}/{cp.total} ({pct}%)</span>
                  </div>
                  <Progress value={pct} className="h-3" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Level Selector */}
        <div className="glass-card mb-8 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-semibold text-foreground">{t('dash.examLevel')}</h3>
            <Button onClick={handleStartExam} size="sm" className="btn-glow">Lancer l'examen</Button>
          </div>
          <LevelSelector selectedLevel={selectedLevel} onSelect={setSelectedLevel} isSubscribed={isStandardOrAbove} />
        </div>

        {/* Category Training */}
        <div className="glass-card mb-8 p-6">
          <h3 className="font-serif text-lg font-semibold text-foreground mb-4">{t('dash.categoryTraining')}</h3>
          <div className="relative">
            <p className="mb-4 text-sm text-muted-foreground">
              {t('dash.chooseCat')}
              {!isStandardOrAbove && ` (${t('dash.subscriberEssential')})`}
            </p>
            <CategorySelector onSelect={handleCategorySelect} />
            {!isStandardOrAbove && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-md">
                <div className="text-center">
                  <Lock className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="mb-3 text-sm font-medium text-foreground">{t('dash.subscriberEssential')}</p>
                  <Button size="sm" className="btn-glow" onClick={() => openGate('standard')}>{t('dash.upgradeEssential')}</Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Premium Video Guides */}
        <div className="glass-card mb-8 p-6">
          <h3 className="font-serif text-lg font-semibold text-foreground mb-4">{t('dash.videoGuides')}</h3>
          <PremiumVideoGuides isTier2={isPremium} />
        </div>

        {/* Exam history */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-semibold text-foreground">{t('dash.examHistory')}</h3>
            <Button onClick={() => navigate('/quiz?mode=exam')} size="sm" className="btn-glow">{t('dash.newExam')}</Button>
          </div>
          {examHistory.length === 0 ? (
            <div className="py-8 text-center">
              <Clock className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground">{t('dash.noExamsYet')}</p>
              <Button className="mt-4 btn-glow" variant="outline" onClick={() => navigate('/quiz?mode=exam')}>{t('dash.takeFirst')}</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {[...examHistory].reverse().map((entry, i) => {
                const percent = Math.round((entry.score / entry.totalQuestions) * 100);
                const mins = Math.floor(entry.timeSpent / 60);
                return (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border/30 bg-secondary/30 p-4 glow-hover">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${entry.passed ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}`}>
                        {percent}%
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {entry.score}/{entry.totalQuestions} — {entry.passed ? t('dash.passed') : t('dash.failed')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : undefined)} · {mins} min
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
      <SubscriptionGate open={showGate} onOpenChange={setShowGate} requiredTier={gateTier} />
    </div>
  );
}
