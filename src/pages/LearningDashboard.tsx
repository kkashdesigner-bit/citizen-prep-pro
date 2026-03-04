import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { useUserProfile, GOAL_LABELS } from '@/hooks/useUserProfile';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import LearnSidebar from '@/components/learn/LearnSidebar';
import DashboardRightSidebar from '@/components/learn/DashboardRightSidebar';
import SubscriptionGate from '@/components/SubscriptionGate';
import StatCards from '@/components/learn/StatCards';
import DashboardTabs from '@/components/learn/DashboardTabs';
import ResumeStudyCard from '@/components/learn/ResumeStudyCard';
import WeeklyActivityChart from '@/components/learn/WeeklyActivityChart';
import DomainMasteryBars from '@/components/learn/DomainMasteryBars';
import WeaknessAlerts from '@/components/learn/WeaknessAlerts';
import ParcoursCard from '@/components/learn/ParcoursCard';
import MiniatureIcon from '@/components/MiniatureIcon';
import { Target, FileText, Clock, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import type { GoalType } from '@/hooks/useUserProfile';

const CATEGORY_MAP: Record<string, { emoji: string; gradient: string; shadow: string; label: string; desc: string; dbCategory: string }> = {
  Principles: { emoji: '⚖️', gradient: 'from-blue-600 via-blue-500 to-indigo-600', shadow: 'shadow-blue-500/30', label: 'Fondamentaux', desc: 'Valeurs et principes de la République', dbCategory: 'Principles and values of the Republic' },
  Institutions: { emoji: '🏛️', gradient: 'from-indigo-600 via-purple-500 to-violet-600', shadow: 'shadow-indigo-500/30', label: 'Institutions', desc: "Fonctionnement de l'État et des institutions", dbCategory: 'Institutional and political system' },
  Rights: { emoji: '🛡️', gradient: 'from-emerald-600 via-green-500 to-teal-600', shadow: 'shadow-emerald-500/30', label: 'Droits & Devoirs', desc: 'Droits et devoirs du citoyen', dbCategory: 'Rights and duties' },
  History: { emoji: '📜', gradient: 'from-amber-600 via-orange-500 to-yellow-600', shadow: 'shadow-amber-500/30', label: 'Histoire & Culture', desc: 'Histoire de France et repères clés', dbCategory: 'History, geography and culture' },
  Living: { emoji: '🏠', gradient: 'from-sky-600 via-cyan-500 to-blue-600', shadow: 'shadow-sky-500/30', label: 'Vivre en société', desc: 'Vie quotidienne, éducation, santé, emploi', dbCategory: 'Living in French society' },
};

export default function LearningDashboard() {
  const { tier, loading: tierLoading } = useSubscription();
  const navigate = useNavigate();
  const { profile: userProfile, loading: profileLoading, saveProfile } = useUserProfile();
  const stats = useDashboardStats();

  const [showGate, setShowGate] = useState(false);
  const [gateTier, setGateTier] = useState<'standard' | 'premium'>('standard');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [savingGoal, setSavingGoal] = useState(false);

  const openGate = (required: 'standard' | 'premium') => { setGateTier(required); setShowGate(true); };

  // ── Loading ──
  if (stats.loading || tierLoading || profileLoading) {
    return (
      <div className="flex min-h-screen bg-[var(--dash-bg)]">
        <LearnSidebar />
        <div className="flex-1 md:ml-[260px] flex items-center justify-center pb-20 md:pb-0">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#0055A4] dark:border-blue-400 border-t-transparent" />
        </div>
      </div>
    );
  }

  const firstName = stats.displayName.split(' ')[0] || stats.displayName || 'Apprenant';
  const personaGoalLabel = userProfile?.goal_type ? GOAL_LABELS[userProfile.goal_type as keyof typeof GOAL_LABELS] : 'Naturalisation';

  // Find domain mastery for category grid
  const getMasteryForCategory = (dbCategory: string) => {
    const mastery = stats.domainMastery.find(d => d.dbCategory === dbCategory);
    return mastery?.percent || 0;
  };

  const handleStartExam = (category?: string) => {
    if (tier === 'free' && !stats.canTakeExamFree) { openGate('standard'); return; }
    if (category && tier !== 'premium') { openGate('premium'); return; }
    if (category) {
      navigate(`/quiz?category=${encodeURIComponent(CATEGORY_MAP[category]?.dbCategory || category)}`);
    } else {
      navigate('/quiz');
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--dash-bg)] transition-colors duration-300">
      <LearnSidebar />

      <main className="flex-1 md:ml-[260px] pb-24 md:pb-8 flex justify-center">
        <div className="w-full max-w-[1400px] px-4 md:px-6 lg:px-8 py-6 md:py-8 flex flex-col xl:flex-row gap-6">

          {/* ═══════ CENTER COLUMN ═══════ */}
          <motion.div
            initial="hidden" animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
            className="flex-1 min-w-0"
          >
            {/* Header */}
            <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }} className="mb-6 flex items-center gap-4">
              {stats.avatarUrl && (
                <img src={stats.avatarUrl} alt="Avatar" className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-[var(--dash-card-border)] object-cover shadow-md flex-shrink-0" />
              )}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[var(--dash-text)] tracking-tight">
                  Bonjour, {firstName} <span className="inline-block animate-wave origin-bottom-right">👋</span>
                </h1>
                <p className="text-[var(--dash-text-muted)] text-sm">{personaGoalLabel} — Continuez votre parcours</p>
              </div>
            </motion.div>

            {/* Stat Cards — Real data */}
            <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
              <StatCards
                successRate={stats.successRate}
                streak={stats.streak}
                dailyGoalCurrent={stats.dailyGoalCurrent}
                dailyGoalTarget={stats.dailyGoalTarget}
              />
            </motion.div>

            {/* Parcours Card — Real progress */}
            <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
              <ParcoursCard />
            </motion.div>

            {/* Tabs */}
            <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
              <DashboardTabs>
                {/* Resume study */}
                <ResumeStudyCard chapterTitle="Quiz : Histoire de France" chapterNumber={3} totalChapters={5} progressPercent={65} />

                {/* Analytics row — Real data */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                  <WeeklyActivityChart data={stats.weeklyActivity} />
                  <DomainMasteryBars domains={stats.domainMastery} />
                </div>

                {/* Weakness alerts — Real data */}
                <WeaknessAlerts alerts={stats.weaknessAlerts} />

                {/* Recommended Exam */}
                <motion.div
                  whileHover={{ y: -2 }}
                  className="bg-[var(--dash-card)] rounded-2xl border-2 border-[#0055A4] dark:border-blue-500 p-5 md:p-6 shadow-[0_4px_20px_rgba(0,85,164,0.06)] mb-8 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-3">
                    <span className="bg-blue-500/10 text-[#0055A4] dark:text-blue-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">Recommandé</span>
                  </div>
                  <h2 className="text-xl font-bold text-[var(--dash-text)] mb-1.5 mt-3">Examen Blanc</h2>
                  <p className="text-sm text-[var(--dash-text-muted)] font-medium mb-5 max-w-lg">
                    20 questions aléatoires couvrant tous les domaines — évaluez votre niveau global.
                  </p>
                  <div className="flex flex-wrap items-center gap-5 mb-6">
                    {[
                      { icon: FileText, text: '20 Questions' },
                      { icon: Clock, text: '~ 15 min' },
                      { icon: Target, text: 'Seuil : 60%' },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-1.5">
                        <Icon className="h-4 w-4 text-[var(--dash-text-muted)]" />
                        <span className="text-sm font-semibold text-[var(--dash-text)]">{text}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => handleStartExam()}
                    className="w-full sm:w-auto bg-[#0055A4] hover:bg-[#1B6ED6] dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold rounded-xl h-11 px-8 shadow-[0_4px_14px_rgba(0,85,164,0.25)] hover:-translate-y-0.5 transition-all"
                  >
                    Commencer l'examen
                  </Button>
                </motion.div>

                {/* Category Grid — Real mastery % */}
                <div>
                  <h3 className="text-lg font-bold text-[var(--dash-text)] mb-4">Entraînement par catégorie</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(CATEGORY_MAP).map(([cat, info], idx) => {
                      const masteryPercent = getMasteryForCategory(info.dbCategory);
                      return (
                        <motion.div
                          key={cat}
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ y: -3, boxShadow: "0 10px 28px rgba(0,0,0,0.08)" }}
                          className="bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col h-full"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <MiniatureIcon emoji={info.emoji} gradient={info.gradient} shadow={info.shadow} size="sm" delay={idx * 0.06} />
                            {tier !== 'premium' && (
                              <span className="bg-amber-500/10 text-amber-500 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Premium</span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-[var(--dash-text)] mb-0.5">{info.label}</h4>
                          <p className="text-xs text-[var(--dash-text-muted)] font-medium mb-4 flex-1 line-clamp-2">{info.desc}</p>

                          <div className="space-y-2.5 mt-auto">
                            <div className="flex justify-between items-center text-[10px] font-bold text-[var(--dash-text-muted)] uppercase tracking-widest">
                              <span>Progression</span>
                              <span className="text-[#0055A4] dark:text-blue-400">{masteryPercent}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-[var(--dash-surface)] rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${masteryPercent}%` }}
                                transition={{ duration: 0.8, delay: 0.2 + idx * 0.1, ease: "easeOut" }}
                                className="h-full bg-[#0055A4] dark:bg-blue-500 rounded-full"
                              />
                            </div>
                            <Button
                              onClick={() => handleStartExam(cat)}
                              variant="outline"
                              className="w-full border-[var(--dash-card-border)] hover:border-[#0055A4] dark:hover:border-blue-400 text-[var(--dash-text)] hover:text-[#0055A4] dark:hover:text-blue-400 hover:bg-blue-500/5 font-bold rounded-xl h-9 text-sm transition-all"
                            >
                              S'entraîner
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </DashboardTabs>
            </motion.div>
          </motion.div>

          {/* ═══════ RIGHT COLUMN — Real data ═══════ */}
          <DashboardRightSidebar
            tier={tier}
            onUpgrade={() => openGate('premium')}
            recentActivity={stats.recentActivity}
          />
        </div>
      </main>

      <SubscriptionGate open={showGate} onOpenChange={setShowGate} requiredTier={gateTier} />

      {/* Goal Modal */}
      <Dialog open={showGoalModal} onOpenChange={setShowGoalModal}>
        <DialogContent className="sm:max-w-md p-0 rounded-2xl overflow-hidden bg-[var(--dash-card)] border border-[var(--dash-card-border)] shadow-2xl">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[var(--dash-text)]">Modifier mon objectif</h2>
              <button onClick={() => setShowGoalModal(false)} className="h-8 w-8 rounded-full bg-[var(--dash-surface)] hover:bg-[var(--dash-card-border)] flex items-center justify-center text-[var(--dash-text-muted)] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {([
                { value: 'naturalisation' as GoalType, label: 'Naturalisation française', desc: 'Devenir citoyen français' },
                { value: 'carte_resident' as GoalType, label: 'Carte de Résident (CR)', desc: 'Obtenir la carte de résident de 10 ans' },
                { value: 'csp' as GoalType, label: 'Carte de Séjour Pluriannuelle (CSP)', desc: 'Renouveler votre titre de séjour' },
              ]).map(goal => {
                const isActive = userProfile?.goal_type === goal.value;
                return (
                  <button
                    key={goal.value}
                    disabled={savingGoal}
                    onClick={async () => { setSavingGoal(true); await saveProfile({ goal_type: goal.value }); setSavingGoal(false); setShowGoalModal(false); }}
                    className={`w-full flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all hover:-translate-y-0.5 ${isActive ? 'border-[#0055A4] dark:border-blue-400 bg-blue-500/5' : 'border-[var(--dash-card-border)] hover:border-[#0055A4]/40'}`}
                  >
                    <div className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-[#0055A4] dark:bg-blue-500 text-white' : 'bg-blue-500/10 text-[#0055A4] dark:text-blue-400'}`}>
                      <Target className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[var(--dash-text)]">{goal.label}</p>
                      <p className="text-sm text-[var(--dash-text-muted)] mt-0.5">{goal.desc}</p>
                    </div>
                    {isActive && <Check className="h-5 w-5 text-[#0055A4] dark:text-blue-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
