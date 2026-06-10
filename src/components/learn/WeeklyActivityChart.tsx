import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface WeeklyActivityChartProps {
    data: number[];
}

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
    const max = Math.max(...data, 1);
    const reducedMotion = useReducedMotion();
    const [hovered, setHovered] = useState<number | null>(null);
    // Monday-indexed today (Lun=0 … Dim=6)
    const todayIdx = (new Date().getDay() + 6) % 7;
    const total = data.reduce((a, b) => a + b, 0);

    return (
        <div className="bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] relative overflow-hidden">
            <div aria-hidden className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-blue-500/8 blur-3xl pointer-events-none" />
            <div className="flex items-start justify-between mb-5">
                <div>
                    <h3 className="font-bold text-[var(--dash-text)] text-sm mb-1">Activité hebdomadaire</h3>
                    <p className="text-xs text-[var(--dash-text-muted)]">Questions répondues cette semaine</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-[#0055A4] tabular-nums">
                    {total} cette semaine
                </span>
            </div>

            <div className="flex items-end justify-between gap-2 h-32">
                {data.map((val, i) => {
                    const height = max > 0 ? (val / max) * 100 : 0;
                    const isToday = i === todayIdx;
                    const isHovered = hovered === i;
                    return (
                        <div
                            key={i}
                            className="flex-1 flex flex-col items-center gap-1.5 cursor-default"
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <motion.span
                                animate={{ opacity: isHovered || val > 0 ? 1 : 0.4, scale: isHovered ? 1.15 : 1 }}
                                className={`text-[10px] font-bold tabular-nums ${isHovered ? 'text-[#0055A4]' : 'text-[var(--dash-text-muted)]'}`}
                            >
                                {val}
                            </motion.span>
                            <div className="w-full bg-[var(--dash-surface)] rounded-md overflow-hidden relative" style={{ height: '80px' }}>
                                <motion.div
                                    initial={reducedMotion ? false : { height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    transition={{ duration: 0.6, delay: reducedMotion ? 0 : i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                    className={`w-full rounded-md absolute bottom-0 transition-all duration-200 ${
                                        isToday
                                            ? 'bg-gradient-to-t from-[#0055A4] via-[#1B6ED6] to-[#4D94E0] shadow-[0_0_10px_rgba(27,110,214,0.45)]'
                                            : 'bg-gradient-to-t from-[#0055A4] to-[#3B82F6]'
                                    } ${isHovered ? 'brightness-110 saturate-125' : ''}`}
                                />
                            </div>
                            <span className={`text-[10px] font-semibold transition-colors ${
                                isToday
                                    ? 'text-[#0055A4] font-bold'
                                    : isHovered ? 'text-[var(--dash-text)]' : 'text-[var(--dash-text-muted)]'
                            }`}>
                                {DAYS[i]}
                                {isToday && <span aria-hidden className="block mx-auto mt-0.5 h-1 w-1 rounded-full bg-[#0055A4]" />}
                            </span>
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
