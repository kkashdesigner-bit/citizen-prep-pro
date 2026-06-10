import { motion, useReducedMotion } from 'framer-motion';
import type { DomainMastery } from '@/hooks/useDashboardStats';

interface DomainMasteryBarsProps {
    domains: DomainMastery[];
}

export default function DomainMasteryBars({ domains }: DomainMasteryBarsProps) {
    const hasData = domains.some(d => d.total > 0);
    const reducedMotion = useReducedMotion();

    return (
        <div className="bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] relative overflow-hidden">
            <div aria-hidden className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-indigo-500/8 blur-3xl pointer-events-none" />
            <h3 className="font-bold text-[var(--dash-text)] text-sm mb-1">Maîtrise par domaine</h3>
            <p className="text-xs text-[var(--dash-text-muted)] mb-5">Votre niveau dans chaque catégorie</p>

            <div className="space-y-4">
                {domains.map((d, i) => (
                    <motion.div
                        key={d.label}
                        initial={reducedMotion ? false : { opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: reducedMotion ? 0 : i * 0.07 }}
                        className="group"
                    >
                        <div className="flex justify-between items-center mb-1.5">
                            <span className="text-xs font-semibold text-[var(--dash-text)] group-hover:translate-x-0.5 transition-transform">{d.label}</span>
                            <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded-full tabular-nums"
                                style={{ color: d.color, backgroundColor: `${d.color}1A` }}
                            >
                                {d.total > 0 ? `${d.percent}%` : '—'}
                            </span>
                        </div>
                        <div className="h-2.5 w-full bg-[var(--dash-surface)] rounded-full overflow-hidden relative">
                            <motion.div
                                initial={reducedMotion ? false : { width: 0 }}
                                animate={{ width: `${d.percent}%` }}
                                transition={{ duration: 0.8, delay: reducedMotion ? 0 : 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                className="h-full rounded-full relative overflow-hidden"
                                style={{ background: `linear-gradient(90deg, ${d.color}, ${d.color}CC)` }}
                            >
                                {!reducedMotion && d.percent > 0 && (
                                    <motion.span
                                        aria-hidden
                                        className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/35 to-transparent"
                                        animate={{ x: ['-120%', '420%'] }}
                                        transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2 + i * 0.4, ease: 'easeInOut' }}
                                    />
                                )}
                            </motion.div>
                        </div>
                        {d.total > 0 && (
                            <p className="text-[10px] text-[var(--dash-text-muted)] mt-1 tabular-nums">{d.correct}/{d.total} bonnes réponses</p>
                        )}
                    </motion.div>
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
