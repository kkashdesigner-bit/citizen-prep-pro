import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Target, Zap, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { WeaknessAlert } from '@/hooks/useDashboardStats';
import FlashQuizModal from '@/components/flash-quiz/FlashQuizModal';

interface WeaknessDrillCardProps {
  alerts: WeaknessAlert[];
}

export default function WeaknessDrillCard({ alerts }: WeaknessDrillCardProps) {
  const [showDrill, setShowDrill] = useState(false);

  if (alerts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] mb-8"
      >
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="h-4 w-4 text-[#22C55E]" />
          <h3 className="font-bold text-[var(--dash-text)] text-sm">Pas de point faible détecté</h3>
        </div>
        <p className="text-xs text-[var(--dash-text-muted)]">
          Continuez à répondre aux questions pour obtenir une analyse personnalisée.
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[#F59E0B]" />
            <h3 className="font-bold text-[var(--dash-text)] text-sm">Points à réviser</h3>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">
            <Target className="w-3 h-3" />
            {alerts.length} {alerts.length === 1 ? 'domaine' : 'domaines'}
          </div>
        </div>

        <div className="space-y-3">
          {alerts.map((alert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-[var(--dash-surface)] border border-[var(--dash-card-border)] group"
            >
              <div className="flex-shrink-0 h-2 w-2 rounded-full" style={{ backgroundColor: alert.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[var(--dash-text)] mb-0.5">{alert.domain}</p>
                <p className="text-[11px] text-[var(--dash-text-muted)] truncate">{alert.message}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Drill CTA */}
        <Button
          onClick={() => setShowDrill(true)}
          className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl h-10 text-sm shadow-[0_4px_12px_rgba(245,158,11,0.25)] transition-all gap-1.5"
        >
          <Zap className="w-4 h-4" />
          Lancer l'exercice ciblé (5 Qs)
        </Button>
      </motion.div>

      <FlashQuizModal open={showDrill} onOpenChange={setShowDrill} />
    </>
  );
}
