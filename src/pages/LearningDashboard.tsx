import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserProfile, GOAL_TO_LEVEL, GOAL_LABELS } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import LearnSidebar from '@/components/learn/LearnSidebar';
import DashboardHeader from '@/components/learn/DashboardHeader';
import ActionCards from '@/components/learn/ActionCards';
import DomainCards from '@/components/learn/DomainCards';
import FocusCard from '@/components/learn/FocusCard';
import RecentActivity from '@/components/learn/RecentActivity';
import UpgradeBanner from '@/components/learn/UpgradeBanner';
import SubscriptionGate from '@/components/SubscriptionGate';

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
  timeSpent?: number;
  categoryBreakdown?: Record<string, { correct: number; total: number }>;
}

const ALL_CATEGORIES = ['Principles', 'Institutions', 'Rights', 'History', 'Living', 'Politics', 'Society'];

export default function LearningDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { tier, isStandardOrAbove, isPremium, loading: tierLoading } = useSubscription();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { profile: userProfile, loading: profileLoading } = useUserProfile();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [examHistory, setExamHistory] = useState<ExamHistoryEntry[]>([]);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const [showGate, setShowGate] = useState(false);
  const [gateTier, setGateTier] = useState<'standard' | 'premium'>('standard');

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/auth'); return; }

    // Redirect to onboarding if not completed
    if (!profileLoading && userProfile !== undefined && !userProfile?.onboarding_completed) {
      navigate('/onboarding');
      return;
    }

    const fetchData = async () => {
      const [lessonsRes, progressRes, profileRes] = await Promise.all([
        supabase.from('lessons').select('id, category, level, title, estimated_minutes, order_index').order('order_index'),
        supabase.from('lesson_progress').select('lesson_id, status, score_last').eq('user_id', user.id),
        supabase.from('profiles').select('display_name, email, exam_history, total_questions_seen').eq('id', user.id).maybeSingle(),
      ]);

      setLessons((lessonsRes.data as Lesson[]) || []);
      setProgress((progressRes.data as LessonProgress[]) || []);
      setDisplayName(profileRes.data?.display_name || profileRes.data?.email || '');
      setExamHistory((profileRes.data?.exam_history as unknown as ExamHistoryEntry[]) || []);
      setLoading(false);
    };
    if (!profileLoading) fetchData();
  }, [user, authLoading, navigate, userProfile, profileLoading]);

  const openGate = (required: 'standard' | 'premium') => {
    setGateTier(required);
    setShowGate(true);
  };

  if (authLoading || loading || tierLoading || profileLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <LearnSidebar />
        <div className="flex-1 md:ml-64 flex items-center justify-center">
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

  const mastery = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const xp = completedLessons * 50 + examHistory.length * 100;
  // Streak: count consecutive recent exam days (simplified)
  const streak = calculateStreak(examHistory);

  const categoryProgress = ALL_CATEGORIES.map(cat => {
    const catLessons = lessons.filter(l => l.category === cat);
    const catCompleted = catLessons.filter(l => progress.find(p => p.lesson_id === l.id && p.status === 'completed')).length;
    return { category: cat, total: catLessons.length, completed: catCompleted };
  });

  const firstName = displayName.split(' ')[0] || displayName || 'Learner';

  // Persona-based exam level
  const personaLevel = userProfile?.goal_type
    ? GOAL_TO_LEVEL[userProfile.goal_type as keyof typeof GOAL_TO_LEVEL]
    : 'CSP';
  const personaGoalLabel = userProfile?.goal_type
    ? GOAL_LABELS[userProfile.goal_type as keyof typeof GOAL_LABELS]
    : null;

  return (
    <div className="flex min-h-screen bg-background">
      <LearnSidebar />

      <main className="flex-1 md:ml-64 pb-20 md:pb-8">
        <div className="mx-auto max-w-5xl px-4 md:px-8 py-6 md:py-8">
          <DashboardHeader
            firstName={firstName}
            mastery={mastery}
            streak={streak}
            xp={xp}
            goalLabel={personaGoalLabel}
          />

          {/* Focus Recommendation (dynamic weak area) */}
          <FocusCard examHistory={examHistory} />

          {/* Free tier upgrade banner */}
          {tier === 'free' && (
            <div className="mb-6">
              <UpgradeBanner
                title="Unlock Full Access"
                description="Get unlimited exams, training modes, progress tracking, and structured learning paths."
                tier="standard"
                onUpgrade={() => openGate('standard')}
              />
            </div>
          )}

          <ActionCards
            nextLesson={nextLesson || null}
            isStandardOrAbove={isStandardOrAbove}
            onGate={openGate}
            personaLevel={personaLevel}
          />

          {/* Recent Activity */}
          <RecentActivity
            examHistory={examHistory}
            lessons={lessons}
            progress={progress}
          />

          <DomainCards categoryProgress={categoryProgress} isPremium={isPremium} onGate={openGate} />

          {/* Premium upsell for standard users */}
          {tier === 'standard' && (
            <div className="mt-8">
              <UpgradeBanner
                title="Go Premium"
                description="Unlock question translation, category-specific training, and advanced practice tools."
                tier="premium"
                onUpgrade={() => openGate('premium')}
              />
            </div>
          )}
        </div>
      </main>

      <SubscriptionGate open={showGate} onOpenChange={setShowGate} requiredTier={gateTier} />
    </div>
  );
}

/** Calculate consecutive study days from exam history dates */
function calculateStreak(history: ExamHistoryEntry[]): number {
  if (history.length === 0) return 0;

  const dates = [...new Set(
    history
      .map(e => e.date?.split('T')[0])
      .filter(Boolean)
  )].sort().reverse();

  if (dates.length === 0) return 0;

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Streak must include today or yesterday
  if (dates[0] !== today && dates[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diffDays = (prev.getTime() - curr.getTime()) / 86400000;
    if (Math.round(diffDays) === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
