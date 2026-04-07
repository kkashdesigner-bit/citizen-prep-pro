import { useNavigate } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { motion } from 'framer-motion';
import { Crown, Lock, Zap, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/hooks/useSubscription';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import LearnSidebar from '@/components/learn/LearnSidebar';
import AppHeader from '@/components/AppHeader';
import SubscriptionGate from '@/components/SubscriptionGate';
import { useState } from 'react';

const CATEGORIES = [
  {
    key: 'Principles and values of the Republic',
    label: 'Principes & Valeurs',
    desc: 'Valeurs républicaines fondamentales',
    color: '#3B82F6',
    bg: '#EFF6FF',
    total: 892,
    emoji: '⚖️',
  },
  {
    key: 'Institutional and political system',
    label: 'Institutions',
    desc: "Fonctionnement de l'État",
    color: '#8B5CF6',
    bg: '#F5F3FF',
    total: 1146,
    emoji: '🏛️',
  },
  {
    key: 'Rights and duties',
    label: 'Droits & Devoirs',
    desc: 'Droits et devoirs du citoyen',
    color: '#22C55E',
    bg: '#F0FDF4',
    total: 1312,
    emoji: '🛡️',
  },
  {
    key: 'History, geography and culture',
    label: 'Histoire & Culture',
    desc: 'Histoire et repères culturels',
    color: '#F59E0B',
    bg: '#FFFBEB',
    total: 2376,
    emoji: '📜',
  },
  {
    key: 'Living in French society',
    label: 'Vivre en société',
    desc: 'Vie quotidienne, santé, emploi',
    color: '#06B6D4',
    bg: '#ECFEFF',
    total: 1506,
    emoji: '🏠',
  },
] as const;

function getMasteryLabel(pct: number): { label: string; color: string } {
  if (pct >= 85) return { label: 'Maîtrisé', color: '#22C55E' };
  if (pct >= 60) return { label: 'En progression', color: '#F59E0B' };
  return { label: 'À renforcer', color: '#EF4444' };
}

export default function MasteryPage() {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();
  const { domainMastery, loading } = useDashboardStats();
  const [showGate, setShowGate] = useState(false);

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="flex min-h-screen bg-[var(--dash-bg)] overflow-x-hidden">
      <SEOHead titleKey="seo.dashboardTitle" descriptionKey="seo.dashboardDesc" path="/mastery" noindex />
      <LearnSidebar />
      <div className="flex-1 md:ml-[260px] flex flex-col overflow-x-hidden">
        <AppHeader
          pageTitle="Maîtrise par Catégorie"
          pageIcon={<TrendingUp className="h-5 w-5" />}
          backTo="/learn"
          backLabel="Tableau de bord"
        />

        {!isPremium && (
          <div className="mx-auto max-w-3xl w-full px-4 md:px-8 pt-4">
            <div className="rounded-xl border border-amber-200 bg-amber-50 flex items-center gap-3 px-4 py-3">
              <Crown className="h-5 w-5 text-amber-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-amber-800">Fonctionnalité Premium</p>
                <p className="text-xs text-amber-700">La maîtrise par catégorie est disponible avec l'abonnement Premium.</p>
              </div>
              <Button size="sm" className="flex-shrink-0 bg-amber-500 hover:bg-amber-600 text-white rounded-lg" onClick={() => setShowGate(true)}>
                Débloquer
              </Button>
            </div>
          </div>
        )}

        <main className="flex-1 pb-20 md:pb-8 overflow-x-hidden">
          <motion.div
            initial="hidden" animate="visible" variants={stagger}
            className="mx-auto max-w-3xl px-4 md:px-8 py-6 space-y-4"
          >
            {/* Header info */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-card)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <h2 className="text-sm font-bold text-[var(--dash-text)] mb-1">7 232 questions disponibles</h2>
              <p className="text-xs text-[var(--dash-text-muted)]">
                Chaque catégorie dispose d'une large banque de questions. Entraînez-vous jusqu'à atteindre 85% de maîtrise dans chaque domaine.
              </p>
            </motion.div>

            {/* Category cards */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
              </div>
            ) : (
              CATEGORIES.map((cat, idx) => {
                const mastery = domainMastery.find(d => d.dbCategory === cat.key);
                const percent = mastery?.percent || 0;
                const seen = mastery?.total || 0;
                const { label: statusLabel, color: statusColor } = getMasteryLabel(percent);
                const remaining = Math.max(0, cat.total - seen);

                return (
                  <motion.div
                    key={cat.key}
                    variants={fadeUp}
                    className="rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-card)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: cat.bg }}
                      >
                        {cat.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-[var(--dash-text)]">{cat.label}</h3>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${statusColor}15`, color: statusColor }}>
                            {statusLabel}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--dash-text-muted)] mb-3">{cat.desc}</p>

                        {/* Progress bar */}
                        <div className="mb-2">
                          <div className="flex justify-between text-[10px] font-semibold text-[var(--dash-text-muted)] mb-1">
                            <span>{seen} vues / {cat.total.toLocaleString()} questions</span>
                            <span style={{ color: cat.color }}>{percent}%</span>
                          </div>
                          <div className="h-2 w-full bg-[var(--dash-surface)] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              transition={{ duration: 0.8, delay: 0.1 + idx * 0.08, ease: 'easeOut' }}
                              className="h-full rounded-full"
                              style={{ background: cat.color }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <span className="text-[11px] text-[var(--dash-text-muted)]">
                            {remaining > 0 ? `${remaining.toLocaleString()} questions inédites disponibles` : 'Toutes les questions vues !'}
                          </span>
                          <Button
                            size="sm"
                            className="rounded-xl h-8 px-4 text-xs font-bold gap-1.5 text-white"
                            style={{ background: isPremium ? cat.color : undefined }}
                            variant={isPremium ? 'default' : 'outline'}
                            onClick={() => {
                              if (!isPremium) { setShowGate(true); return; }
                              navigate(`/quiz?mode=training&category=${encodeURIComponent(cat.key)}&fresh=1&limit=20`);
                            }}
                          >
                            {!isPremium && <Lock className="h-3 w-3" />}
                            <Zap className="h-3 w-3" />
                            S'entraîner
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </main>
      </div>

      <SubscriptionGate open={showGate} onOpenChange={setShowGate} requiredTier="premium" featureLabel="Maîtrise par catégorie" />
    </div>
  );
}
