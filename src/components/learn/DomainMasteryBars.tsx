import { motion } from 'framer-motion';
import type { DomainMastery } from '@/hooks/useDashboardStats';

interface DomainMasteryBarsProps {
    domains: DomainMastery[];
}

export default function DomainMasteryBars({ domains }: DomainMasteryBarsProps) {
    const hasData = domains.some(d => d.total > 0);

    return (
        <div className="bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <h3 className="font-bold text-[var(--dash-text)] text-sm mb-1">Maîtrise par domaine</h3>
            <p className="text-xs text-[var(--dash-text-muted)] mb-5">Votre niveau dans chaque catégorie</p>

            <div className="space-y-4">
                {domains.map((d, i) => (
                    <div key={d.label}>
                        <div className="flex justify-between items-center mb-1.5">
                            <span className="text-xs font-semibold text-[var(--dash-text)]">{d.label}</span>
                            <span className="text-xs font-bold" style={{ color: d.color }}>
                                {d.total > 0 ? `${d.percent}%` : '—'}
                            </span>
                        </div>
                        <div className="h-2 w-full bg-[var(--dash-surface)] rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${d.percent}%` }}
                                transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: d.color }}
                            />
                        </div>
                        {d.total > 0 && (
                            <p className="text-[10px] text-[var(--dash-text-muted)] mt-1">{d.correct}/{d.total} bonnes réponses</p>
                        )}
                    </div>
                ))}
            </div>

            {!hasData && (
                <p className="text-center text-xs text-[var(--dash-text-muted)] mt-3">
                    Répondez à des questions pour voir votre maîtrise
                </p>
            )}
        </div>
    );
}
