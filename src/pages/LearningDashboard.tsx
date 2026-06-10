import { useState } from 'react';
import SEOHead from '@/components/SEOHead';
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
import DailyQuestionCard from '@/components/daily-question/DailyQuestionCard';
import WeaknessDrillCard from '@/components/weakness-drill/WeaknessDrillCard';
import ExamReadinessCard from '@/components/learn/ExamReadinessCard';
import ParcoursCard from '@/components/learn/ParcoursCard';
import RevisionCard from '@/components/learn/RevisionCard';
import { useParcours } from '@/hooks/useParcours';
import MiniatureIcon from '@/components/MiniatureIcon';
import OnboardingChecklist from '@/components/learn/OnboardingChecklist';
import NextActionCard from '@/components/learn/NextActionCard';
import GuidedTour from '@/components/learn/GuidedTour';
import { Target, FileText, Clock, X, Check, Lock, Crown, Sparkles, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import type { GoalType } from '@/hooks/useUserProfile';
import NotificationBell from '@/components/notifications/NotificationBell';
import ReferralSection from '@/components/ReferralSection';
import { generateReferralCode } from '@/utils/referral';
import { useAuth } from '@/hooks/useAuth';

const CATEGORY_MAP: Record<string, { emoji: string; gradient: string; shadow: string; label: string; desc: string; dbCategory: string; image: string; imageAlt: string }> = {
  Principles: { emoji: '⚖️', gradient: 'from-blue-600 via-blue-500 to-indigo-600', shadow: 'shadow-blue-500/30', label: 'Fondamentaux', desc: 'Valeurs et principes de la République', dbCategory: 'Principles and values of the Republic', image: '/examen-civique-qcm-valeurs-republique-francaise.jpg', imageAlt: 'QCM examen civique — Valeurs et principes de la République française' },
  Institutions: { emoji: '🏛️', gradient: 'from-indigo-600 via-purple-500 to-violet-600', shadow: 'shadow-indigo-500/30', label: 'Institutions', desc: "Fonctionnement de l'État et des institutions", dbCategory: 'Institutional and political system', image: '/examen-civique-qcm-institutions-systeme-politique.jpg', imageAlt: 'QCM examen civique — Institutions et système politique français' },
  Rights: { emoji: '🛡️', gradient: 'from-emerald-600 via-green-500 to-teal-600', shadow: 'shadow-emerald-500/30', label: 'Droits & Devoirs', desc: 'Droits et devoirs du citoyen', dbCategory: 'Rights and duties', image: '/examen-civique-qcm-droits-devoirs-citoyen.jpg', imageAlt: 'QCM examen civique — Droits et devoirs du citoyen français' },
  History: { emoji: '📜', gradient: 'from-amber-600 via-orange-500 to-yellow-600', shadow: 'shadow-amber-500/30', label: 'Histoire & Culture', desc: 'Histoire de France et repères clés', dbCategory: 'History, geography and culture', image: '/examen-civique-qcm-histoire-geographie-culture.jpg', imageAlt: 'QCM examen civique — Histoire géographie culture de France' },
  Living: { emoji: '🏠', gradient: 'from-sky-600 via-cyan-500 to-blue-600', shadow: 'shadow-sky-500/30', label: 'Vivre en société', desc: 'Vie quotidienne, éducation, santé, emploi', dbCategory: 'Living in French society', image: '/examen-civique-qcm-vivre-societe-integration.jpg', imageAlt: 'QCM examen civique — Vivre en société et intégration en France' },
};

export default function LearningDashboard() {
  const { tier, isPremium, isStandardOrAbove, isLifetime, loading: tierLoading } = useSubscription();
  const navigate = useNavigate();
  const { profile: userProfile, loading: profileLoading, saveProfile } = useUserProfile();
  const stats = useDashboardStats();

  const { user } = useAuth();
  const { classes: parcoursClasses, progress: parcoursProgress } = useParcours();
  const [showGate, setShowGate] = useState(false);
  const [gateTier, setGateTier] = useState<'standard' | 'premium'>('standard');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [savingGoal, setSavingGoal] = useState(false);
  const [catOffset, setCatOffset] = useState(0);

  const openGate = (required: 'standard' | 'premium') => { setGateTier(required); setShowGate(true); };

  // ── Loading ──
  if (stats.loading || tierLoading || profileLoading) {
    return (
      <div className="flex min-h-screen bg-[var(--dash-bg)]">
        <LearnSidebar />
        <div className="flex-1 md:ml-[260px] flex items-center justify-center pb-20 md:pb-0">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
        </div>
      </div>
    );
  }

  const firstName = userProfile?.first_name || stats.displayName.split(' ')[0] || stats.displayName || 'Apprenant';
  const displayAvatar = userProfile?.avatar_url || stats.avatarUrl;
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
      navigate('/quiz?mode=exam&limit=40');
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--dash-bg)] transition-colors duration-300 overflow-x-hidden">
      <SEOHead
        titleKey="seo.dashboardTitle"
        descriptionKey="seo.dashboardDesc"
        path="/learn"
        noindex
      />
      <LearnSidebar />

      <main className="flex-1 md:ml-[260px] pb-24 md:pb-8 flex justify-center overflow-x-hidden">
        <div className="w-full max-w-[1400px] px-4 md:px-6 lg:px-8 py-6 md:py-8 flex flex-col xl:flex-row gap-6 overflow-x-hidden">

          {/* ═══════ CENTER COLUMN ═══════ */}
          <motion.div
            initial="hidden" animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
            className="flex-1 min-w-0"
          >
            {/* ─── User Profile Card + Inline Stats (mobile) ─── */}
            <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }} className="mb-4 sm:mb-6 bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] shadow-[0_8px_30px_-12px_rgba(0,85,164,0.12)] relative overflow-hidden">
              {/* Tricolor hairline */}
              <div aria-hidden className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#0055A4] via-white to-[#EF4135] opacity-80" />
              {/* Gradient mesh backdrop */}
              <div aria-hidden className="absolute inset-0 pointer-events-none opacity-70 dark:opacity-40"
                style={{ background: 'radial-gradient(420px 180px at 12% 0%, rgba(0,85,164,0.10), transparent 60%), radial-gradient(380px 200px at 88% 10%, rgba(239,65,53,0.06), transparent 60%), radial-gradient(300px 160px at 55% 100%, rgba(27,110,214,0.07), transparent 60%)' }} />
              <motion.div
                aria-hidden
                className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
                animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Profile row */}
              <div className="p-4 sm:p-6 flex items-center gap-3 sm:gap-5">
                {/* Avatar wrapped in an SVG daily-goal progress ring */}
                <div className="relative shrink-0 w-[52px] h-[52px] sm:w-[96px] sm:h-[96px]">
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
                    <defs>
                      <linearGradient id="heroRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0055A4" />
                        <stop offset="60%" stopColor="#1B6ED6" />
                        <stop offset="100%" stopColor="#4D94E0" />
                      </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="46" stroke="var(--dash-card-border)" strokeWidth="5" fill="none" />
                    <motion.circle
                      cx="50" cy="50" r="46"
                      stroke="url(#heroRingGrad)" strokeWidth="5" fill="none" strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 46}
                      initial={{ strokeDashoffset: 2 * Math.PI * 46 }}
                      animate={{ strokeDashoffset: (2 * Math.PI * 46) * (1 - Math.min(1, stats.dailyGoalTarget > 0 ? stats.dailyGoalCurrent / stats.dailyGoalTarget : 0)) }}
                      transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      style={{ filter: 'drop-shadow(0 0 4px rgba(27,110,214,0.45))' }}
                    />
                  </svg>
                  <div className="absolute inset-[7px] sm:inset-[9px] rounded-full overflow-hidden ring-2 ring-[var(--dash-card)] shadow-lg">
                    {displayAvatar ? (
                      <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-lg sm:text-2xl">
                        {firstName.charAt(0)}
                      </div>
                    )}
                  </div>
                  {/* Streak flame badge */}
                  {stats.streak > 0 && (
                    <motion.div
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.9 }}
                      className="absolute -bottom-0.5 -right-0.5 sm:bottom-0 sm:right-0 flex items-center gap-0.5 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#F97316] text-white text-[9px] sm:text-[11px] font-bold pl-1 pr-1.5 py-0.5 shadow-[0_2px_8px_rgba(245,158,11,0.5)] ring-2 ring-[var(--dash-card)]"
                      title={`Série de ${stats.streak} jours`}
                    >
                      <Flame className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      {stats.streak}
                    </motion.div>
                  )}
                </div>

                <div className="flex-1 min-w-0 z-10">
                  <div className="flex items-start justify-between gap-2">
                    <h1 className="text-base sm:text-2xl md:text-3xl font-bold text-[var(--dash-text)] tracking-tight truncate">
                      {new Date().getHours() >= 18 ? 'Bonsoir' : 'Bonjour'},{' '}
                      <span className="bg-gradient-to-r from-[#0055A4] to-[#1B6ED6] bg-clip-text text-transparent">{firstName}</span>{' '}
                      <span className="inline-block animate-wave origin-bottom-right">👋</span>
                    </h1>
                    <div className="sm:hidden shrink-0 mt-0.5">
                      <NotificationBell align="right" />
                    </div>
                  </div>
                  <p className="hidden sm:block text-sm text-[var(--dash-text-muted)] mt-0.5 font-medium">
                    {stats.dailyGoalCurrent >= stats.dailyGoalTarget
                      ? 'Objectif du jour atteint — bravo ! 🎉'
                      : `Plus que ${Math.max(0, stats.dailyGoalTarget - stats.dailyGoalCurrent)} question${stats.dailyGoalTarget - stats.dailyGoalCurrent > 1 ? 's' : ''} pour atteindre votre objectif du jour.`}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-3">
                    {/* Tier Badge */}
                    {isLifetime ? (
                      <div className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold border bg-violet-100 text-violet-700 border-violet-200">
                        <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Accès à Vie
                      </div>
                    ) : isPremium ? (
                      <div className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold border bg-amber-100 text-amber-700 border-amber-200">
                        <Crown className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Premium
                      </div>
                    ) : isStandardOrAbove ? (
                      <div className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold border bg-[#f04e42]/10 text-[#f04e42] border-[#f04e42]/20">
                        <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Standard
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold border bg-[#f04e42]/10 text-[#f04e42] border-[#f04e42]/20">
                        Gratuit
                      </div>
                    )}

                    {/* Goal Badge */}
                    <motion.button
                      whileHover={{ y: -1, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowGoalModal(true)}
                      className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold border border-[var(--dash-card-border)] bg-[var(--dash-card)] text-[var(--dash-text-muted)] hover:border-[#0055A4]/40 hover:text-[#0055A4] transition-colors shadow-sm"
                    >
                      <Target className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#0055A4]" />
                      <span className="hidden sm:inline">Objectif : </span>{personaGoalLabel}
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Inline Stats Strip — mobile only */}
              <div className="sm:hidden border-t border-[var(--dash-card-border)] grid grid-cols-3 divide-x divide-[var(--dash-card-border)]">
                {/* Success Rate */}
                <div className="flex flex-col items-center py-3 gap-0.5">
                  <span className="text-lg font-bold text-[#0055A4]">{stats.successRate}%</span>
                  <span className="text-[9px] font-bold text-[var(--dash-text-muted)] uppercase tracking-wider">Réussite</span>
                </div>
                {/* Streak */}
                <div className="flex flex-col items-center py-3 gap-0.5">
                  <div className="flex items-center gap-1">
                    <Flame className={`h-4 w-4 ${stats.streak > 0 ? 'text-[#F59E0B]' : 'text-[var(--dash-text-muted)]'}`} />
                    <span className="text-lg font-bold text-[var(--dash-text)]">{stats.streak}</span>
                  </div>
                  <span className="text-[9px] font-bold text-[var(--dash-text-muted)] uppercase tracking-wider">Série</span>
                </div>
                {/* Daily Goal */}
                <div className="flex flex-col items-center py-3 gap-0.5">
                  <span className="text-lg font-bold text-[#22C55E]">{stats.dailyGoalCurrent}/{stats.dailyGoalTarget}</span>
                  <span className="text-[9px] font-bold text-[var(--dash-text-muted)] uppercase tracking-wider">Quotidien</span>
                </div>
              </div>
            </motion.div>

            {/* Stat Cards & Readiness — desktop only (hidden on mobile, merged into profile card above) */}
            <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="hidden sm:block">
              <div className="flex flex-col lg:flex-row gap-4 mb-6 sm:mb-8">
                <div className="flex-1">
                  <StatCards
                    successRate={stats.successRate}
                    streak={stats.streak}
                    dailyGoalCurrent={stats.dailyGoalCurrent}
                    dailyGoalTarget={stats.dailyGoalTarget}
                  />
                </div>
                <div className="w-full lg:w-[320px] flex-shrink-0">
                  <ExamReadinessCard
                    successRate={stats.successRate}
                    totalExams={stats.examHistory.length}
                    themeStats={Object.fromEntries(
                      stats.domainMastery.map(d => {
                        const themeKey =
                          d.dbCategory.includes('History') ? 'histoire' :
                          d.dbCategory.includes('Institutional') ? 'institutions' :
                          d.dbCategory.includes('Principles') ? 'valeurs' :
                          d.dbCategory.includes('Rights') ? 'symboles' :
                          d.dbCategory.includes('Living') ? 'europe' : d.dbCategory;
                        return [themeKey, { correct: d.correct, total: d.total }];
                      })
                    )}
                  />
                </div>
              </div>
            </motion.div>

            {/* Onboarding Checklist Guide */}
            <div data-tour="checklist"><OnboardingChecklist stats={stats} /></div>

            {/* Next Recommended Study Action (Funnel) */}
            <NextActionCard stats={stats} />

            {/* Daily Question */}
            <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }} className="mb-6">
              <DailyQuestionCard />
            </motion.div>

            {/* Revision Card — wrong answers drill */}
            {stats.wrongQuestionsCount > 0 && (
              <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
                <RevisionCard
                  wrongQuestionsCount={stats.wrongQuestionsCount}
                  isStandardOrAbove={isStandardOrAbove}
                  onGate={() => openGate('standard')}
                />
              </motion.div>
            )}

            {/* Parcours Card — Real progress */}
            <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
              <div data-tour="parcours"><ParcoursCard /></div>
            </motion.div>

            {/* Révision du jour — SM-2 spaced repetition */}
            <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }} className="mb-6">
              <div data-tour="revision" className="bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[var(--dash-text)] flex items-center gap-2">
                      <span className="text-lg">🧠</span> Révision du jour
                    </h3>
                    <p className="text-xs text-[var(--dash-text-muted)] mt-1">
                      Révisez les questions que vous êtes sur le point d'oublier
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate('/quiz?mode=revision')}
                    className="bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold rounded-xl h-10 px-5 text-sm"
                  >
                    Commencer
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Referral Section */}
            {user && (
              <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }} className="mb-6">
                <ReferralSection
                  referralCode={generateReferralCode(user.id)}
                  referralCount={0}
                />
              </motion.div>
            )}

            {/* Category Grid — Real mastery % */}
            <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[var(--dash-text)]" data-tour="categories">Entraînement par catégorie</h3>
                  {/* Desktop nav arrows */}
                  <div className="hidden sm:flex gap-2">
                    <button
                      onClick={() => setCatOffset(o => Math.max(0, o - 1))}
                      disabled={catOffset === 0}
                      className="w-8 h-8 rounded-full border border-[var(--dash-card-border)] flex items-center justify-center disabled:opacity-30 hover:border-[#0055A4] hover:text-[#0055A4] transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCatOffset(o => Math.min(Object.keys(CATEGORY_MAP).length - 3, o + 1))}
                      disabled={catOffset >= Object.keys(CATEGORY_MAP).length - 3}
                      className="w-8 h-8 rounded-full border border-[var(--dash-card-border)] flex items-center justify-center disabled:opacity-30 hover:border-[#0055A4] hover:text-[#0055A4] transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {/* Mobile: horizontal swipe */}
                <div className="flex sm:hidden gap-3 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide">
                  {Object.entries(CATEGORY_MAP).map(([cat, info], idx) => {
                    const masteryPercent = getMasteryForCategory(info.dbCategory);
                    return (
                      <motion.div
                        key={cat}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden snap-center shrink-0 w-[72vw] max-w-[280px]"
                      >
                        <div className="relative w-full h-[150px] overflow-hidden">
                          <img src={info.image} alt={info.imageAlt} className="w-full h-full object-cover" loading="lazy" />
                          {tier !== 'premium' && (
                            <span className="absolute top-2.5 right-2.5 bg-amber-500/90 backdrop-blur-sm text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">Premium</span>
                          )}
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <p className="text-xs text-[var(--dash-text-muted)] font-medium mb-4 flex-1 line-clamp-2">{info.desc}</p>
                          <div className="space-y-2.5 mt-auto">
                            <div className="flex justify-between items-center text-[10px] font-bold text-[var(--dash-text-muted)] uppercase tracking-widest">
                              <span>Progression</span>
                              <span className="text-[#0055A4]">{masteryPercent}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-[var(--dash-surface)] rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${masteryPercent}%` }} transition={{ duration: 0.8, delay: 0.2 + idx * 0.1, ease: "easeOut" }} className="h-full bg-[#0055A4] rounded-full" />
                            </div>
                            <Button onClick={() => handleStartExam(cat)} variant="outline" className="w-full border-[var(--dash-card-border)] hover:border-[#0055A4] text-[var(--dash-text)] hover:text-[#0055A4] hover:bg-blue-500/5 font-bold rounded-xl h-9 text-sm transition-all gap-1.5">
                              {tier !== 'premium' && <Lock className="h-3.5 w-3.5 text-slate-400" />}
                              S'entraîner
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                {/* Desktop: 3-col carousel */}
                <div className="hidden sm:grid sm:grid-cols-3 gap-4">
                  {Object.entries(CATEGORY_MAP).slice(catOffset, catOffset + 3).map(([cat, info], idx) => {
                    const masteryPercent = getMasteryForCategory(info.dbCategory);
                    return (
                      <motion.div
                        key={cat}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ y: -3, boxShadow: "0 10px 28px rgba(0,0,0,0.08)" }}
                        className="bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden"
                      >
                        {/* Category Image Banner */}
                        <div className="relative w-full h-[150px] overflow-hidden">
                          <img
                            src={info.image}
                            alt={info.imageAlt}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          {tier !== 'premium' && (
                            <span className="absolute top-2.5 right-2.5 bg-amber-500/90 backdrop-blur-sm text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">Premium</span>
                          )}
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <p className="text-xs text-[var(--dash-text-muted)] font-medium mb-4 flex-1 line-clamp-2">{info.desc}</p>

                          <div className="space-y-2.5 mt-auto">
                            <div className="flex justify-between items-center text-[10px] font-bold text-[var(--dash-text-muted)] uppercase tracking-widest">
                              <span>Progression</span>
                              <span className="text-[#0055A4]">{masteryPercent}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-[var(--dash-surface)] rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${masteryPercent}%` }}
                                transition={{ duration: 0.8, delay: 0.2 + idx * 0.1, ease: "easeOut" }}
                                className="h-full bg-[#0055A4] rounded-full"
                              />
                            </div>
                            <Button
                              onClick={() => handleStartExam(cat)}
                              variant="outline"
                              className="w-full border-[var(--dash-card-border)] hover:border-[#0055A4] text-[var(--dash-text)] hover:text-[#0055A4] hover:bg-blue-500/5 font-bold rounded-xl h-9 text-sm transition-all gap-1.5"
                            >
                              {tier !== 'premium' && <Lock className="h-3.5 w-3.5 text-slate-400" />}
                              S'entraîner
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
            {/* Tabs */}
            <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
              <DashboardTabs>
                {/* Resume study — real parcours data */}
                {(() => {
                  const completedCount = Object.values(parcoursProgress).filter(p => p.status === 'completed').length;
                  const nextClass = parcoursClasses.find(c => parcoursProgress[c.id]?.status !== 'completed');
                  const total = parcoursClasses.length || 100;
                  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
                  return (
                    <ResumeStudyCard
                      chapterTitle={nextClass ? nextClass.title : 'Parcours terminé'}
                      chapterNumber={nextClass?.class_number ?? total}
                      totalChapters={total}
                      progressPercent={pct}
                    />
                  );
                })()}

                {/* Analytics row — Real data */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                  <WeeklyActivityChart data={stats.weeklyActivity} />
                  <DomainMasteryBars domains={stats.domainMastery} />
                </div>

                {/* Weakness drill — Real data */}
                <WeaknessDrillCard alerts={stats.weaknessAlerts} />

                {/* Recommended Exam */}
                <motion.div
                  whileHover={{ y: -2 }}
                  data-tour="exam" className="bg-[var(--dash-card)] rounded-2xl border-2 border-[#0055A4] p-5 md:p-6 shadow-[0_4px_20px_rgba(0,85,164,0.06)] mb-8 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-3">
                    <span className="bg-blue-500/10 text-[#0055A4] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">Recommandé</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-[var(--dash-text)] mb-1.5 mt-3">Examen Blanc</h2>
                  <p className="text-xs sm:text-sm text-[var(--dash-text-muted)] font-medium mb-4 sm:mb-5 max-w-lg">
                    40 questions aléatoires couvrant tous les domaines — évaluez votre niveau global.
                  </p>
                  <div className="flex flex-wrap items-center gap-5 mb-6">
                    {[
                      { icon: FileText, text: '40 Questions' },
                      { icon: Clock, text: '~ 45 min' },
                      { icon: Target, text: 'Seuil : 80%' },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-1.5">
                        <Icon className="h-4 w-4 text-[var(--dash-text-muted)]" />
                        <span className="text-sm font-semibold text-[var(--dash-text)]">{text}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => handleStartExam()}
                    className="w-full sm:w-auto bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold rounded-xl h-11 px-8 shadow-[0_4px_14px_rgba(0,85,164,0.25)] hover:-translate-y-0.5 transition-all"
                  >
                    Commencer l'examen
                  </Button>
                </motion.div>

              </DashboardTabs>
            </motion.div>
          </motion.div>

          {/* ═══════ RIGHT COLUMN — Real data ═══════ */}
          <DashboardRightSidebar
            tier={tier}
            onUpgrade={() => openGate('premium')}
            recentActivity={stats.recentActivity}
            totalXP={stats.totalXP}
          />
        </div>
      </main>

      <SubscriptionGate open={showGate} onOpenChange={setShowGate} requiredTier={gateTier} featureLabel={gateTier === 'premium' ? 'Entraînement par catégorie' : 'Examens illimités'} />

      <GuidedTour />

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
                    className={`w-full flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all hover:-translate-y-0.5 ${isActive ? 'border-[#0055A4] bg-blue-500/5' : 'border-[var(--dash-card-border)] hover:border-[#0055A4]/40'}`}
                  >
                    <div className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-[#0055A4] text-white' : 'bg-blue-500/10 text-[#0055A4]'}`}>
                      <Target className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[var(--dash-text)]">{goal.label}</p>
                      <p className="text-sm text-[var(--dash-text-muted)] mt-0.5">{goal.desc}</p>
                    </div>
                    {isActive && <Check className="h-5 w-5 text-[#0055A4] flex-shrink-0" />}
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
