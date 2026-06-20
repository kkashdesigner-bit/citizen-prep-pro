import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { motion } from 'framer-motion';
import { RotateCcw, Crown, Lock, Target, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import LearnSidebar from '@/components/learn/LearnSidebar';
import AppHeader from '@/components/AppHeader';
import SubscriptionGate from '@/components/SubscriptionGate';

const CATEGORIES = [
  { key: 'Principles and values of the Republic', label: 'Principes & Valeurs', desc: 'Liberté, égalité, fraternité, laïcité', color: '#3B82F6', bg: '#EFF6FF', emoji: '⚖️' },
  { key: 'Institutional and political system', label: 'Institutions', desc: 'Président, Parlement, justice', color: '#8B5CF6', bg: '#F5F3FF', emoji: '🏛️' },
  { key: 'Rights and duties', label: 'Droits & Devoirs', desc: 'Droits fondamentaux et devoirs', color: '#22C55E', bg: '#F0FDF4', emoji: '🛡️' },
  { key: 'History, geography and culture', label: 'Histoire & Culture', desc: 'Repères historiques et culturels', color: '#F59E0B', bg: '#FFFBEB', emoji: '📜' },
  { key: 'Living in French society', label: 'Vivre en société', desc: 'Vie quotidienne, santé, emploi', color: '#06B6D4', bg: '#ECFEFF', emoji: '🏠' },
] as const;

type RevMode = 'errors' | 'all';

export default function RevisionPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  const [showGate, setShowGate] = useState(false);
  const [mode, setMode] = useState<RevMode>('errors');
  const [mistakes, setMistakes] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('user_answers' as any)
        .select('question_id, category, is_correct')
        .eq('user_id', user.id);
      if (cancelled) return;
      const rows = (data || []) as { question_id: number | null; category: string | null; is_correct: boolean }[];
      const correct = new Set(rows.filter(r => r.is_correct && r.question_id != null).map(r => r.question_id));
      const sets: Record<string, Set<number>> = {};
      for (const r of rows) {
        if (!r.is_correct && r.question_id != null && r.question_id < 9000 && r.category && !correct.has(r.question_id)) {
          (sets[r.category] ||= new Set()).add(r.question_id);
        }
      }
      const out: Record<string, number> = {};
      for (const k in sets) out[k] = sets[k].size;
      setMistakes(out);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user]);

  const totalMistakes = Object.values(mistakes).reduce((s, n) => s + n, 0);

  const start = (key: string, count: number) => {
    if (!isPremium) { setShowGate(true); return; }
    if (mode === 'errors') {
      if (count === 0) return;
      navigate(`/quiz?mode=revision&category=${encodeURIComponent(key)}`);
    } else {
      navigate(`/quiz?mode=training&category=${encodeURIComponent(key)}&limit=20`);
    }
  };

  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } };
  const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  return (
    <div className="flex min-h-screen bg-[var(--dash-bg)] overflow-x-hidden">
      <SEOHead titleKey="seo.dashboardTitle" descriptionKey="seo.dashboardDesc" path="/revision" noindex />
      <LearnSidebar />
      <div className="flex-1 md:ml-[260px] flex flex-col overflow-x-hidden">
        <AppHeader pageTitle="Révision ciblée" pageIcon={<RotateCcw className="h-5 w-5" />} backTo="/learn" backLabel="Tableau de bord" />

        {!isPremium && (
          <div className="mx-auto max-w-3xl w-full px-4 md:px-8 pt-4">
            <div className="rounded-xl border border-amber-200 bg-amber-50 flex items-center gap-3 px-4 py-3">
              <Crown className="h-5 w-5 text-amber-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-amber-800">Fonctionnalité Premium</p>
                <p className="text-xs text-amber-700">La révision ciblée par thème est disponible avec l'abonnement Premium.</p>
              </div>
              <Button size="sm" className="flex-shrink-0 bg-amber-500 hover:bg-amber-600 text-white rounded-lg" onClick={() => setShowGate(true)}>
                Débloquer
              </Button>
            </div>
          </div>
        )}

        <main className="flex-1 pb-20 md:pb-8 overflow-x-hidden">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="mx-auto max-w-3xl px-4 md:px-8 py-6 space-y-4">

            {/* Header + mode toggle */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-card)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <h2 className="text-sm font-bold text-[var(--dash-text)] mb-1">Choisissez un thème à réviser</h2>
              <p className="text-xs text-[var(--dash-text-muted)] mb-4">
                {mode === 'errors'
                  ? `Vous avez ${totalMistakes} erreur${totalMistakes > 1 ? 's' : ''} à corriger au total. Reprenez-les thème par thème.`
                  : 'Entraînez-vous sur l’ensemble des questions, thème par thème.'}
              </p>
              <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[var(--dash-surface)] border border-[var(--dash-card-border)]">
                {([['errors', 'Mes erreurs'], ['all', 'Toutes les questions']] as const).map(([val, lbl]) => (
                  <button
                    key={val}
                    onClick={() => setMode(val)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${mode === val ? 'bg-[#0055A4] text-white shadow-sm' : 'text-[var(--dash-text-muted)] hover:text-[var(--dash-text)]'}`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Category cards */}
            {CATEGORIES.map((cat) => {
              const count = mistakes[cat.key] || 0;
              const noErrors = mode === 'errors' && count === 0;
              return (
                <motion.div key={cat.key} variants={fadeUp} className="rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-card)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center text-xl" style={{ background: cat.bg }}>
                      {cat.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[var(--dash-text)]">{cat.label}</h3>
                      <p className="text-xs text-[var(--dash-text-muted)]">
                        {mode === 'errors'
                          ? (loading ? 'Calcul…' : noErrors ? 'Aucune erreur — bravo !' : `${count} erreur${count > 1 ? 's' : ''} à corriger`)
                          : cat.desc}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => start(cat.key, count)}
                      disabled={noErrors}
                      className="rounded-xl h-9 px-4 text-xs font-bold gap-1.5 text-white disabled:opacity-40"
                      style={{ background: noErrors ? '#94a3b8' : cat.color }}
                    >
                      {!isPremium && <Lock className="h-3 w-3" />}
                      {mode === 'errors'
                        ? (noErrors ? <CheckCircle2 className="h-3.5 w-3.5" /> : <RotateCcw className="h-3.5 w-3.5" />)
                        : <Target className="h-3.5 w-3.5" />}
                      {mode === 'errors' ? (noErrors ? 'À jour' : `Réviser (${count})`) : 'S’entraîner'}
                    </Button>
                  </div>
                </motion.div>
              );
            })}

            <motion.p variants={fadeUp} className="text-[11px] text-[var(--dash-text-muted)] flex items-center justify-center gap-1.5 pt-1">
              <Sparkles className="h-3 w-3 text-amber-500" />
              La révision de vos erreurs est le moyen le plus rapide d’augmenter votre score.
            </motion.p>
          </motion.div>
        </main>
      </div>

      <SubscriptionGate open={showGate} onOpenChange={setShowGate} requiredTier="premium" featureLabel="Révision ciblée par thème" />
    </div>
  );
}
