import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useUserProfile, GOAL_LABELS } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import LearnSidebar from '@/components/learn/LearnSidebar';
import DashboardRightSidebar from '@/components/learn/DashboardRightSidebar';
import SubscriptionGate from '@/components/SubscriptionGate';
import { Target, Flag, Play, Landmark, FileText, HeartHandshake, History, Component, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ExamHistoryEntry {
  date: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
}

const CATEGORY_MAP: Record<string, { icon: any, color: string, bg: string, desc: string }> = {
  'Principles': { icon: Flag, color: 'text-[#EF4135]', bg: 'bg-[#EF4135]/10 border-[#EF4135]/20', desc: 'Valeurs et principes de la République' },
  'Institutions': { icon: Landmark, color: 'text-[#0055A4]', bg: 'bg-[#0055A4]/10 border-[#0055A4]/20', desc: 'Fonctionnement de l\'État et des institutions' },
  'Rights': { icon: FileText, color: 'text-[#1A1A1A]', bg: 'bg-[#F5F7FA] border-[#E6EAF0]', desc: 'Droits et devoirs du citoyen' },
  'History': { icon: History, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10 border-[#F59E0B]/20', desc: 'Histoire de France et repères clés' },
  'Living': { icon: HeartHandshake, color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10 border-[#22C55E]/20', desc: 'Vivre ensemble et société' },
  'Politics': { icon: Landmark, color: 'text-[#0055A4]', bg: 'bg-[#0055A4]/10 border-[#0055A4]/20', desc: 'Organisation politique de la France' },
  'Society': { icon: Component, color: 'text-[#1A1A1A]', bg: 'bg-[#F5F7FA] border-[#E6EAF0]', desc: 'La société française contemporaine' },
};

export default function LearningDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { tier, isPremium, isStandardOrAbove, loading: tierLoading } = useSubscription();
  const navigate = useNavigate();
  const { profile: userProfile, loading: profileLoading } = useUserProfile();

  const [examHistory, setExamHistory] = useState<ExamHistoryEntry[]>([]);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const [showGate, setShowGate] = useState(false);
  const [gateTier, setGateTier] = useState<'standard' | 'premium'>('standard');

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/auth'); return; }

    if (!profileLoading && userProfile !== undefined && !userProfile?.onboarding_completed) {
      navigate('/onboarding');
      return;
    }

    const fetchData = async () => {
      const { data: profileRes } = await supabase
        .from('profiles')
        .select('display_name, email, exam_history, total_questions_seen')
        .eq('id', user.id)
        .maybeSingle();

      setDisplayName(profileRes?.display_name || profileRes?.email || '');
      setExamHistory((profileRes?.exam_history as unknown as ExamHistoryEntry[]) || []);
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
      <div className="flex min-h-screen bg-white">
        <LearnSidebar />
        <div className="flex-1 md:ml-[260px] flex items-center justify-center pb-20 md:pb-0">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
        </div>
      </div>
    );
  }

  const firstName = displayName.split(' ')[0] || displayName || 'Learner';
  const personaGoalLabel = userProfile?.goal_type ? GOAL_LABELS[userProfile.goal_type as keyof typeof GOAL_LABELS] : 'Naturalisation';

  // Calculate generic progress stats
  const today = new Date().toISOString().split('T')[0];
  const examsToday = examHistory.filter(e => e.date?.startsWith(today)).length;
  // Free tier rule: 1 exam per day
  const canTakeExamFree = examsToday < 1;

  const handleStartExam = (category?: string) => {
    // Standard tier check for more than 1 exam
    if (tier === 'free' && !canTakeExamFree) {
      openGate('standard');
      return;
    }
    // Premium tier check for specific category
    if (category && tier !== 'premium') {
      openGate('premium');
      return;
    }

    if (category) {
      navigate(`/quiz?category=${category}`);
    } else {
      navigate('/quiz');
    }
  };

  const estimatedScore = examHistory.length > 0
    ? Math.round(examHistory.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions), 0) / examHistory.length * 100)
    : 0;

  let streak = 0;
  if (examHistory.length > 0) streak = 1; // Simplified streak for demo

  return (
    <div className="flex min-h-screen bg-white">
      <LearnSidebar />

      <main className="flex-1 md:ml-[260px] pb-24 md:pb-8 flex justify-center">
        <div className="w-full max-w-7xl px-4 md:px-8 py-8 flex flex-col xl:flex-row gap-8">

          {/* Center Column: Main Content */}
          <div className="flex-1 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-2 font-sans tracking-tight">Bonjour, {firstName}</h1>
              <p className="text-[#1A1A1A]/60 text-lg">Continuez votre parcours vers la citoyenneté française</p>
            </div>

            {/* Persona Block */}
            <div className="bg-[#F5F7FA] rounded-2xl border border-[#E6EAF0] p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 h-10 w-10 flex-shrink-0 bg-white rounded-xl shadow-sm border border-[#E6EAF0] flex items-center justify-center">
                  <Target className="h-5 w-5 text-[#0055A4]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1A1A1A]/50 uppercase tracking-widest mb-1">Votre objectif</p>
                  <p className="text-xl font-bold text-[#1A1A1A]">{personaGoalLabel}</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/onboarding')}
                className="bg-white border-[#0055A4] text-[#0055A4] hover:bg-[#F5F7FA] font-semibold rounded-xl h-11 px-6 shadow-sm hover:scale-[1.02] transition-transform"
              >
                Modifier mon objectif
              </Button>
            </div>

            {/* Recommended Exam Card */}
            <div className="mb-10 group bg-white rounded-2xl border-[2px] border-[#0055A4] p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className="bg-[#0055A4]/10 text-[#0055A4] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Recommandé</span>
              </div>

              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2 mt-4">Simulation Complète</h2>
              <p className="text-[#1A1A1A]/60 font-medium mb-6 max-w-lg">
                Un examen blanc de 20 questions aléatoires couvrant tous les domaines. Idéal pour évaluer votre niveau global aujourd'hui.
              </p>

              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#1A1A1A]/50" />
                  <span className="text-sm font-semibold text-[#1A1A1A]">20 Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#1A1A1A]/50" />
                  <span className="text-sm font-semibold text-[#1A1A1A]">~ 15 min</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-[#1A1A1A]/50" />
                  <span className="text-sm font-semibold text-[#1A1A1A]">Score requis: 60%</span>
                </div>
              </div>

              <Button
                onClick={() => handleStartExam()}
                size="lg"
                className="w-full sm:w-auto bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold rounded-xl h-12 px-8 shadow-sm hover:scale-[1.02] transition-transform"
              >
                Commencer l'examen complet
              </Button>
            </div>

            {/* Category Exam Grid */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">Entraînement par catégorie</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {Object.entries(CATEGORY_MAP).slice(0, 4).map(([cat, info], idx) => {
                  const Icon = info.icon;
                  return (
                    <div
                      key={cat}
                      className="bg-white rounded-2xl border border-[#E6EAF0] p-5 shadow-[0_2px_6px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,85,164,0.08)] transition-all duration-300 hover:-translate-y-1 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center border ${info.bg}`}>
                          <Icon className={`h-6 w-6 ${info.color}`} />
                        </div>
                        {tier !== 'premium' && (
                          <span className="bg-[#F59E0B]/10 text-[#F59E0B] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Premium
                          </span>
                        )}
                      </div>

                      <h4 className="text-lg font-bold text-[#1A1A1A] mb-1">{cat === 'Principles' ? 'Fondamentaux' : cat}</h4>
                      <p className="text-sm text-[#1A1A1A]/60 font-medium mb-6 flex-1 line-clamp-2">{info.desc}</p>

                      <div className="space-y-4 mt-auto">
                        <div className="flex justify-between items-center text-xs font-bold text-[#1A1A1A]/50 uppercase tracking-widest">
                          <span>Progression</span>
                          <span className="text-[#0055A4]">0%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#F5F7FA] rounded-full overflow-hidden">
                          <div className="h-full bg-[#0055A4] w-0 rounded-full transition-all duration-1000" />
                        </div>

                        <Button
                          onClick={() => handleStartExam(cat)}
                          variant="outline"
                          className="w-full bg-white border-[#E6EAF0] hover:border-[#0055A4] text-[#1A1A1A] hover:text-[#0055A4] hover:bg-[#F5F7FA] font-bold rounded-xl h-10 shadow-sm hover:scale-[1.02] transition-transform"
                        >
                          S'entraîner
                        </Button>
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>

          </div>

          {/* Right Column: Progress & Premium */}
          <DashboardRightSidebar
            score={estimatedScore}
            streak={streak}
            examHistory={examHistory}
            tier={tier}
            onUpgrade={() => openGate('premium')}
          />

        </div>
      </main>

      <SubscriptionGate open={showGate} onOpenChange={setShowGate} requiredTier={gateTier} />
    </div>
  );
}
