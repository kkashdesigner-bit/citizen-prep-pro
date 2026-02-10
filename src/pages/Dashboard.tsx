import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WeaknessAlert from '@/components/WeaknessAlert';
import ProgressionBar from '@/components/ProgressionBar';
import CategorySelector from '@/components/CategorySelector';
import LevelSelector from '@/components/LevelSelector';
import SubscriptionGate from '@/components/SubscriptionGate';
import PremiumVideoGuides from '@/components/PremiumVideoGuides';
import CircularProgress from '@/components/CircularProgress';
import { BookOpen, CheckCircle, Clock, Lock, Target, XCircle } from 'lucide-react';
import { Category, ExamLevel } from '@/lib/types';
import { TIER_LABELS, TIER_BADGE_VARIANT, TIER_BADGE_CLASS } from '@/lib/subscriptionTiers';

interface ExamHistoryEntry {
  date: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  timeSpent: number;
  categoryBreakdown?: Record<string, { correct: number; total: number }>;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { tier, isStandardOrAbove, isPremium, isTier1OrAbove, isTier2, loading: tierLoading } = useSubscription();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [examHistory, setExamHistory] = useState<ExamHistoryEntry[]>([]);
  const [usedQuestions, setUsedQuestions] = useState<string[]>([]);
  const [totalQuestionCount, setTotalQuestionCount] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<ExamLevel>('CSP');
  const [loading, setLoading] = useState(true);
  const [showGate, setShowGate] = useState(false);
  const [gateTier, setGateTier] = useState<'tier_1' | 'tier_2'>('tier_1');
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/auth'); return; }

    const fetchData = async () => {
      const [profileResult, countResult] = await Promise.all([
        supabase.from('profiles').select('exam_history, used_questions, display_name, avatar_url, email').eq('id', user.id).maybeSingle(),
        supabase.from('questions').select('id', { count: 'exact', head: true }),
      ]);
      if (profileResult.data) {
        setExamHistory((profileResult.data.exam_history as unknown as ExamHistoryEntry[]) || []);
        setUsedQuestions((profileResult.data.used_questions as string[]) || []);
        setDisplayName(profileResult.data.display_name);
        setAvatarUrl(profileResult.data.avatar_url);
        setEmail(profileResult.data.email);
      }
      setTotalQuestionCount(countResult.count || 0);
      setLoading(false);
    };
    fetchData();
  }, [user, authLoading, navigate]);

  const openGate = (requiredTier: 'tier_1' | 'tier_2') => { setGateTier(requiredTier); setShowGate(true); };

  const handleCategorySelect = (category: Category) => {
    if (!isTier1OrAbove) { openGate('tier_1'); return; }
    navigate(`/quiz?mode=training&category=${category}`);
  };

  const handleStartExam = () => navigate(`/quiz?mode=exam&level=${selectedLevel}`);

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
  const overallProgress = totalQuestionCount > 0 ? Math.round((usedQuestions.length / totalQuestionCount) * 100) : 0;
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
              <CircularProgress value={overallProgress} label={`${usedQuestions.length} / ${totalQuestionCount} ${t('about.questions').toLowerCase()}`} />
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
                  <Button size="sm" className="btn-glow" onClick={() => openGate('tier_1')}>{t('dash.startTrial')}</Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        <WeaknessAlert examHistory={examHistory} language={language} />

        <div className="mb-8">
          <ProgressionBar usedCount={usedQuestions.length} totalCount={totalQuestionCount} />
        </div>

        {/* Level Selector */}
        <div className="glass-card mb-8 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-semibold text-foreground">{t('dash.examLevel')}</h3>
            <Button onClick={handleStartExam} size="sm" className="btn-glow">{t('dash.startExam')}</Button>
          </div>
          <LevelSelector selectedLevel={selectedLevel} onSelect={setSelectedLevel} isSubscribed={isTier1OrAbove} />
        </div>

        {/* Category Training */}
        <div className="glass-card mb-8 p-6">
          <h3 className="font-serif text-lg font-semibold text-foreground mb-4">{t('dash.categoryTraining')}</h3>
          <div className="relative">
            <p className="mb-4 text-sm text-muted-foreground">
              {t('dash.chooseCat')}
              {!isTier1OrAbove && ` (${t('dash.subscriberEssential')})`}
            </p>
            <CategorySelector onSelect={handleCategorySelect} />
            {!isTier1OrAbove && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-md">
                <div className="text-center">
                  <Lock className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="mb-3 text-sm font-medium text-foreground">{t('dash.subscriberEssential')}</p>
                  <Button size="sm" className="btn-glow" onClick={() => openGate('tier_1')}>{t('dash.upgradeEssential')}</Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Premium Video Guides */}
        <div className="glass-card mb-8 p-6">
          <h3 className="font-serif text-lg font-semibold text-foreground mb-4">{t('dash.videoGuides')}</h3>
          <PremiumVideoGuides isTier2={isTier2} />
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
