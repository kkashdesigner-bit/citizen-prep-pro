import { useNavigate } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import {
  GraduationCap, PlayCircle, Trophy, Target, Clock,
  CheckCircle, XCircle, TrendingUp, Shield, Sparkles,
  Zap, Crown, Lock, Star,
} from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useUserProfile, GoalType, GOAL_TO_LEVEL, GOAL_LABELS } from '@/hooks/useUserProfile';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import SubscriptionGate from '@/components/SubscriptionGate';
import TierInfoPopup from '@/components/TierInfoPopup';
import LearnSidebar from '@/components/learn/LearnSidebar';
import AppHeader from '@/components/AppHeader';
import { useState } from 'react';
import { motion } from 'framer-motion';

const EXAM_LEVELS = [
  {
    key: 'CSP',
    label: 'CSP',
    fullLabel: 'Carte de Séjour Pluriannuelle',
    color: '#3B82F6',
    bg: '#3B82F615',
    count: 2422,
    desc: 'Questions fondamentales sur les valeurs républicaines.',
  },
  {
    key: 'CR',
    label: 'CR',
    fullLabel: 'Carte de Résident',
    color: '#8B5CF6',
    bg: '#8B5CF615',
    count: 2377,
    desc: 'Niveau intermédiaire — inclut les questions CSP.',
  },
  {
    key: 'Naturalisation',
    label: 'Naturalisation',
    fullLabel: 'Naturalisation française',
    color: '#0055A4',
    bg: '#0055A415',
    count: 2337,
    desc: 'Niveau complet — toutes les connaissances requises.',
  },
] as const;

const SUBCATEGORIES = [
  { label: "La devise française", count: 49 },
  { label: "La liberté", count: 59 },
  { label: "L'égalité", count: 129 },
  { label: "La fraternité", count: 49 },
  { label: "La discrimination", count: 53 },
  { label: "Limites des libertés", count: 80 },
  { label: "DDHC", count: 45 },
  { label: "Droits fondamentaux", count: 42 },
  { label: "Droits liés à la personne", count: 38 },
  { label: "Droits économiques et sociaux", count: 22 },
  { label: "Droits de 3ème génération", count: 20 },
  { label: "Citoyenneté", count: 36 },
  { label: "Dignité humaine", count: 30 },
  { label: "Droit de disposer de son corps", count: 21 },
  { label: "Libertés au couple", count: 28 },
  { label: "Protection des victimes", count: 46 },
  { label: "Traite et prostitution", count: 34 },
  { label: "Infractions", count: 40 },
  { label: "Interdiction des violences", count: 40 },
  { label: "Obligations des résidents", count: 37 },
  { label: "Charte de l'environnement", count: 27 },
  { label: "Acteurs institutionnels", count: 40 },
  { label: "Découpage administratif", count: 69 },
  { label: "Fonctionnement européen", count: 35 },
  { label: "Institutions européennes", count: 20 },
  { label: "Élections européennes", count: 30 },
];

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
  const [gateFeature, setGateFeature] = useState<'standard' | 'premium'>('standard');
  const [freshOnly, setFreshOnly] = useState(false);

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
    <div className="flex min-h-screen bg-[var(--dash-bg)] overflow-x-hidden">
      <SEOHead titleKey="seo.examsTitle" descriptionKey="seo.examsDesc" path="/exams" />
      <LearnSidebar />
      <div className="flex-1 md:ml-[260px] flex flex-col overflow-x-hidden">
        <AppHeader
          pageTitle="Examens Blancs"
          pageIcon={<GraduationCap className="h-5 w-5" />}
          backTo="/learn"
          backLabel="Tableau de bord"
        />
        <main className="flex-1 pb-20 md:pb-8 overflow-x-hidden">
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
                      {levelInfo.detail} Chaque examen est unique : 40 questions tirées aléatoirement d'une banque de plus de 7 000 questions.
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

            {/* ── Mode Difficile (Premium) ── */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-[#EF4444]/20 bg-[#EF4444]/5 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-[var(--dash-text)] flex items-center gap-2">
                  🔥 Mode Difficile
                </h3>
                {!isPremium && (
                  <span className="text-[10px] font-bold bg-amber-500/15 text-amber-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Crown className="h-3 w-3" /> Premium
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--dash-text-muted)] mb-4">
                Les questions avec le taux de réussite le plus bas parmi tous les utilisateurs. Un vrai défi.
              </p>
              <Button
                className="gap-2 font-bold rounded-xl text-white"
                style={{ background: isPremium ? '#EF4444' : undefined }}
                variant={isPremium ? 'default' : 'outline'}
                onClick={() => {
                  if (!isPremium) { setGateFeature('premium'); setShowGate(true); return; }
                  navigate('/quiz?mode=training&hard=1&limit=20');
                }}
              >
                {!isPremium && <Lock className="h-4 w-4" />}
                🔥 Lancer le Mode Difficile
              </Button>
            </motion.div>

            {/* ── Entraînement par Niveau (Standard+) ── */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-card)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-[var(--dash-text)] flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[#0055A4]" />
                  Entraînement par niveau d'examen
                </h3>
                {!isStandardOrAbove && (
                  <span className="text-[10px] font-bold bg-[#0055A4]/10 text-[#0055A4] px-2 py-0.5 rounded-full">Standard+</span>
                )}
              </div>
              <p className="text-xs text-[var(--dash-text-muted)] mb-3">
                Ciblez exactement le niveau de votre examen pour maximiser vos révisions.
              </p>

              {/* Adaptive mode entry */}
              {isPremium && (
                <button
                  onClick={() => navigate('/quiz?mode=training&adaptive=1&limit=20')}
                  className="mb-3 w-full text-left rounded-xl border border-amber-200 bg-amber-50 p-3 flex items-center gap-3 hover:border-amber-400 transition-all"
                >
                  <span className="text-lg">🧠</span>
                  <div>
                    <p className="text-xs font-bold text-amber-800">Difficulté Adaptative</p>
                    <p className="text-[11px] text-amber-700">Le niveau s'ajuste automatiquement à vos réponses — toutes les 3 questions.</p>
                  </div>
                  <Sparkles className="h-4 w-4 text-amber-500 ml-auto flex-shrink-0" />
                </button>
              )}

              {/* freshOnly toggle */}
              <label className="flex items-center gap-2 mb-4 cursor-pointer w-fit">
                <div
                  onClick={() => setFreshOnly(f => !f)}
                  className={`relative h-5 w-9 rounded-full transition-colors ${freshOnly ? 'bg-[#0055A4]' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${freshOnly ? 'translate-x-4' : ''}`} />
                </div>
                <span className="text-xs font-medium text-[var(--dash-text-muted)]">Questions inédites uniquement</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {EXAM_LEVELS.map((lvl) => (
                  <button
                    key={lvl.key}
                    onClick={() => {
                      if (!isStandardOrAbove) { setGateFeature('standard'); setShowGate(true); return; }
                      const params = new URLSearchParams({ mode: 'training', level: lvl.key, limit: '20' });
                      if (freshOnly) params.set('fresh', '1');
                      navigate(`/quiz?${params.toString()}`);
                    }}
                    className="text-left rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-surface)] p-4 hover:border-[#0055A4]/40 hover:-translate-y-0.5 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: lvl.bg, color: lvl.color }}>
                        {lvl.label}
                      </span>
                      <span className="text-[10px] text-[var(--dash-text-muted)]">{lvl.count.toLocaleString()} Q</span>
                    </div>
                    <p className="text-xs font-semibold text-[var(--dash-text)] mb-1">{lvl.fullLabel}</p>
                    <p className="text-[11px] text-[var(--dash-text-muted)] leading-relaxed">{lvl.desc}</p>
                    {!isStandardOrAbove && <Lock className="h-3.5 w-3.5 text-slate-400 mt-2" />}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* ── Entraînement par Sous-thème (Premium) ── */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-card)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-[var(--dash-text)] flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  Entraînement par sous-thème
                </h3>
                {!isPremium && (
                  <span className="text-[10px] font-bold bg-amber-500/15 text-amber-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Crown className="h-3 w-3" /> Premium
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--dash-text-muted)] mb-4">
                26 sous-thèmes ciblés — entraînez-vous sur "La devise française", "Droits fondamentaux", etc.
              </p>
              <div className="flex flex-wrap gap-2">
                {SUBCATEGORIES.map((sub) => (
                  <button
                    key={sub.label}
                    onClick={() => {
                      if (!isPremium) { setGateFeature('premium'); setShowGate(true); return; }
                      navigate(`/quiz?mode=training&subcategory=${encodeURIComponent(sub.label)}&limit=20`);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all hover:-translate-y-0.5 ${
                      isPremium
                        ? 'border-[var(--dash-card-border)] bg-[var(--dash-surface)] text-[var(--dash-text)] hover:border-[#0055A4]/40 hover:text-[#0055A4]'
                        : 'border-dashed border-slate-200 bg-slate-50 text-slate-400 cursor-pointer'
                    }`}
                  >
                    {!isPremium && <Lock className="h-3 w-3" />}
                    {sub.label}
                    <span className="text-[10px] opacity-60">{sub.count}</span>
                  </button>
                ))}
              </div>
            </motion.div>

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
      <SubscriptionGate open={showGate} onOpenChange={setShowGate} requiredTier={gateFeature} featureLabel={gateFeature === 'premium' ? 'Entraînement par sous-thème' : 'Examens blancs illimités'} />
      <TierInfoPopup context="exams" onUpgrade={() => setShowGate(true)} />
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
