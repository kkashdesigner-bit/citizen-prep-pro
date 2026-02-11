import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import LearnSidebar from '@/components/learn/LearnSidebar';
import DashboardHeader from '@/components/learn/DashboardHeader';
import ActionCards from '@/components/learn/ActionCards';
import DomainCards from '@/components/learn/DomainCards';
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
}

const ALL_CATEGORIES = ['Principles', 'Institutions', 'Rights', 'History', 'Living', 'Politics', 'Society'];

export default function LearningDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { tier, isStandardOrAbove, loading: tierLoading } = useSubscription();
  const { t } = useLanguage();
  const navigate = useNavigate();

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
    fetchData();
  }, [user, authLoading, navigate]);

  const openGate = (required: 'standard' | 'premium') => {
    setGateTier(required);
    setShowGate(true);
  };

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

  const completedLessons = progress.filter(p => p.status === 'completed').length;
  const totalLessons = lessons.length;
  const nextLesson = lessons.find(l => {
    const p = progress.find(pr => pr.lesson_id === l.id);
    return !p || p.status !== 'completed';
  });

  const mastery = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const xp = completedLessons * 50 + examHistory.length * 100;
  // Streak placeholder (would need daily tracking table)
  const streak = examHistory.length > 0 ? Math.min(examHistory.length, 7) : 0;

  const categoryProgress = ALL_CATEGORIES.map(cat => {
    const catLessons = lessons.filter(l => l.category === cat);
    const catCompleted = catLessons.filter(l => progress.find(p => p.lesson_id === l.id && p.status === 'completed')).length;
    return { category: cat, total: catLessons.length, completed: catCompleted };
  });

  const firstName = displayName.split(' ')[0] || displayName || 'Learner';

  return (
    <div className="flex min-h-screen bg-background">
      <LearnSidebar />

      {/* Main content area */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-8">
        <div className="mx-auto max-w-5xl px-4 md:px-8 py-6 md:py-8">
          <DashboardHeader
            firstName={firstName}
            mastery={mastery}
            streak={streak}
            xp={xp}
          />

          <ActionCards
            nextLesson={nextLesson || null}
            isStandardOrAbove={isStandardOrAbove}
            onGate={openGate}
          />

          <DomainCards categoryProgress={categoryProgress} />
        </div>
      </main>

      <SubscriptionGate open={showGate} onOpenChange={setShowGate} requiredTier={gateTier} />
    </div>
  );
}
