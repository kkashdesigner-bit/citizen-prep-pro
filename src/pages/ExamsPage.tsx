import { useNavigate } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import {
  GraduationCap, PlayCircle, Trophy, Target, Clock,
  CheckCircle, XCircle, TrendingUp, Shield, Sparkles,
} from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useUserProfile, GoalType, GOAL_TO_LEVEL, GOAL_LABELS } from '@/hooks/useUserProfile';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import SubscriptionGate from '@/components/SubscriptionGate';
import LearnSidebar from '@/components/learn/LearnSidebar';
import AppHeader from '@/components/AppHeader';
import { useState } from 'react';
import { motion } from 'framer-motion';

const EXAM_CATEGORIES = [
  { label: 'Fondamentaux', color: '#3B82F6', icon: Shield },
  { label: 'Institutions', color: '#8B5CF6', icon: Target },
  { label: 'Droits & Devoirs', color: '#22C55E', icon: CheckCircle },
  { label: 'Histoire & Culture', color: '#F59E0B', icon: TrendingUp },
  { label: 'Vie en société', color: '#06B6D4', icon: Sparkles },
];

const LEVEL_DESCRIPTIONS: Record<string, { tagline: string; detail: string }> = {
  Naturalisation: {
    tagline: 'Niveau le plus complet',
    detail: 'Inclut les questions CSP, CR et Naturalisation — couvre l\'ensemble des connaissances requises.',
  },
  CR: {
    tagline: 'Niveau intermédiaire',
    detail: 'Inclut les questions CSP et Carte de Résident — adapté à votre démarche.',
  },
  CSP: {
    tagline: 'Niveau fondamental',
    detail: 'Questions sur les valeurs républicaines fondamentales — l\'essentiel pour la CSP.',
  },
};

export default function ExamsPage() {
  const navigate = useNavigate();
  const { tier, isStandardOrAbove, isPremium } = useSubscription();
  const { profile } = useUserProfile();
  const { examHistory, successRate, examsToday, domainMastery } = useDashboardStats();
  const [showGate, setShowGate] = useState(false);

  const isFree = tier === 'free';

  // Resolve exam level from user profile
  const goalType = profile?.goal_type as GoalType | null;
  const examLevel = goalType ? GOAL_TO_LEVEL[goalType] : 'CSP';
  const goalLabel = goalType ? GOAL_LABELS[goalType] : 'Carte de Séjour Pluriannuelle (CSP)';
  const levelInfo = LEVEL_DESCRIPTIONS[examLevel] || LEVEL_DESCRIPTIONS['CSP'];

  // Exam stats
  const totalExams = examHistory.filter(e => !e.mode || e.mode === 'exam').length;
  const passedExams = examHistory.filter(e => (!e.mode || e.mode === 'exam') && e.passed).length;
  const bestScore = totalExams > 0
    ? Math.max(...examHistory.filter(e => !e.mode || e.mode === 'exam').map(e => Math.round((e.score / e.totalQuestions) * 100)))
    : 0;

  // Weakest category
  const weakest = domainMastery.filter(d => d.total > 0).sort((a, b) => a.percent - b.percent)[0];

  const handleStartExam = () => {
    if (isFree && examsToday >= 1) {
      setShowGate(true);
      return;
    }
    if (!isFree && !isStandardOrAbove) {
      setShowGate(true);
      return;
    }
    navigate('/quiz?mode=exam&limit=40');
  };

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="flex min-h-screen bg-[var(--dash-bg)]">
      <SEOHead titleKey="seo.examsTitle" descriptionKey="seo.examsDesc" path="/exams" />
      <LearnSidebar />
      <div className="flex-1 md:ml-[260px] flex flex-col">
        <AppHeader
          pageTitle="Examens Blancs"
          pageIcon={<GraduationCap className="h-5 w-5" />}
          backTo="/learn"
          backLabel="Tableau de bord"
        />
        <main className="flex-1 pb-20 md:pb-8">
          <motion.div
            initial="hidden" animate="visible" variants={stagger}
            className="mx-auto max-w-3xl px-4 md:px-8 py-6 md:py-8 space-y-5"
          >
            {/* ── Main Exam Card ── */}
            <motion.div
              variants={fadeUp}
              className="relative overflow-hidden rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-card)] p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
            >
              {/* Accent stripe */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0055A4] via-[#3B82F6] to-[#EF4135]" />

              <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-[#0055A4]/10 flex items-center justify-center">
                  <GraduationCap className="h-7 w-7 text-[#0055A4]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-[var(--dash-text)] mb-1">Examen blanc complet</h2>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-[#0055A4]/10 text-[#0055A4] px-2.5 py-1 rounded-full">
                      40 questions
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-[var(--dash-surface)] text-[var(--dash-text-muted)] px-2.5 py-1 rounded-full">
                      <Clock className="h-3 w-3" /> 45 min
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-500/10 text-emerald-600 px-2.5 py-1 rounded-full">
                      <CheckCircle className="h-3 w-3" /> 80% pour réussir
                    </span>
                  </div>

                  {/* Tailored info */}
                  <div className="rounded-xl bg-[var(--dash-surface)] border border-[var(--dash-card-border)] p-4 mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="h-4 w-4 text-[#0055A4]" />
                      <span className="text-sm font-bold text-[var(--dash-text)]">Adapté à votre profil</span>
                    </div>
                    <p className="text-xs text-[var(--dash-text-muted)] mb-2">
                      Objectif : <strong className="text-[var(--dash-text)]">{goalLabel}</strong> — {levelInfo.tagline}
                    </p>
                    <p className="text-[11px] text-[var(--dash-text-muted)] leading-relaxed">
                      {levelInfo.detail}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      size="lg"
                      className="gap-2 font-bold bg-[#0055A4] hover:bg-[#1B6ED6] rounded-xl transition-all hover:scale-[1.01]"
                      onClick={handleStartExam}
                    >
                      <GraduationCap className="h-4 w-4" /> Lancer l'examen
                    </Button>
                    {isFree && (
                      <span className="text-xs text-[var(--dash-text-muted)]">
                        {examsToday >= 1
                          ? 'Limite atteinte (1/jour) — revenez demain'
                          : `${1 - examsToday} examen restant aujourd'hui`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Categories Tested ── */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-card)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
            >
              <h3 className="text-sm font-bold text-[var(--dash-text)] mb-3">5 domaines évalués — 8 questions chacun</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {EXAM_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div
                      key={cat.label}
                      className="flex flex-col items-center gap-1.5 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-surface)] p-3 text-center"
                    >
                      <div
                        className="h-8 w-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${cat.color}15` }}
                      >
                        <Icon className="h-4 w-4" style={{ color: cat.color }} />
                      </div>
                      <span className="text-[10px] font-semibold text-[var(--dash-text-muted)] leading-tight">{cat.label}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* ── Your Stats ── */}
            {totalExams > 0 && (
              <motion.div
                variants={fadeUp}
                className="rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-card)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
              >
                <h3 className="text-sm font-bold text-[var(--dash-text)] mb-4">Vos résultats</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatCard icon={Trophy} color="#F59E0B" label="Examens passés" value={totalExams} />
                  <StatCard icon={CheckCircle} color="#22C55E" label="Taux de réussite" value={`${successRate}%`} />
                  <StatCard icon={TrendingUp} color="#3B82F6" label="Meilleur score" value={`${bestScore}%`} />
                  <StatCard
                    icon={XCircle}
                    color={weakest && weakest.percent < 70 ? '#EF4444' : '#06B6D4'}
                    label="Point faible"
                    value={weakest ? weakest.label : '—'}
                    small
                  />
                </div>

                {/* Pass/fail breakdown */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1 h-2 bg-[var(--dash-surface)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${totalExams > 0 ? (passedExams / totalExams) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[var(--dash-text-muted)]">
                    {passedExams}/{totalExams} réussis
                  </span>
                </div>
              </motion.div>
            )}

            {/* ── Demo Option (free users) ── */}
            {!isStandardOrAbove && (
              <motion.div
                variants={fadeUp}
                className="rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-card)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-[#EF4135]/10 flex items-center justify-center flex-shrink-0">
                    <PlayCircle className="h-5 w-5 text-[#EF4135]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-[var(--dash-text)]">Démo gratuite</h3>
                    <p className="text-xs text-[var(--dash-text-muted)]">20 questions pour découvrir le format de l'examen</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 flex-shrink-0 rounded-xl"
                    onClick={() => navigate('/quiz?mode=demo')}
                  >
                    <PlayCircle className="h-3.5 w-3.5" /> Essayer
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
      <SubscriptionGate open={showGate} onOpenChange={setShowGate} requiredTier="standard" featureLabel="Examens blancs illimités" />
    </div>
  );
}

/* ── Small stat card ── */
function StatCard({ icon: Icon, color, label, value, small }: {
  icon: React.ElementType;
  color: string;
  label: string;
  value: string | number;
  small?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-surface)] p-3 flex flex-col gap-2">
      <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div>
        <p className={`font-bold text-[var(--dash-text)] ${small ? 'text-xs' : 'text-lg'} leading-tight`}>{value}</p>
        <p className="text-[10px] text-[var(--dash-text-muted)] font-medium">{label}</p>
      </div>
    </div>
  );
}
