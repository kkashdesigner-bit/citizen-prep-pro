import { motion } from 'framer-motion';

interface WeeklyActivityChartProps {
    data: number[];
}

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
    const max = Math.max(...data, 1); // At least 1 to avoid division by zero

    return (
        <div className="bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <h3 className="font-bold text-[var(--dash-text)] text-sm mb-1">Activité hebdomadaire</h3>
            <p className="text-xs text-[var(--dash-text-muted)] mb-5">Questions répondues cette semaine</p>

            <div className="flex items-end justify-between gap-2 h-32">
                {data.map((val, i) => {
                    const height = max > 0 ? (val / max) * 100 : 0;
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                            <span className="text-[10px] font-bold text-[var(--dash-text-muted)]">{val}</span>
                            <div className="w-full bg-[var(--dash-surface)] rounded-md overflow-hidden" style={{ height: '80px' }}>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
                                    className="w-full bg-gradient-to-t from-[#0055A4] to-[#3B82F6] rounded-md mt-auto"
                                    style={{ marginTop: `${100 - height}%` }}
                                />
                            </div>
                            <span className="text-[10px] font-semibold text-[var(--dash-text-muted)]">{DAYS[i]}</span>
                        </div>
                    );
                })}
            </div>

            {data.every(v => v === 0) && (
                <p className="text-center text-xs text-[var(--dash-text-muted)] mt-3">Aucune activité cette semaine — commencez un quiz !</p>
            )}
        </div>
    );
}
