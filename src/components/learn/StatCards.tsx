import { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from 'framer-motion';
import { Flame, Target, TrendingUp, Check } from 'lucide-react';

interface StatCardsProps {
    successRate: number;
    streak: number;
    dailyGoalCurrent: number;
    dailyGoalTarget: number;
}

const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 12 },
    visible: { opacity: 1, scale: 1, y: 0 },
};

const cardHover = { y: -3, boxShadow: '0 12px 32px -8px rgba(0,85,164,0.16)' };

/** Animated count-up number (static value when reduced motion is preferred). */
function CountUp({ value, suffix = '', className }: { value: number; suffix?: string; className?: string }) {
    const reducedMotion = useReducedMotion();
    const mv = useMotionValue(0);
    const rounded = useTransform(mv, v => `${Math.round(v)}${suffix}`);

    useEffect(() => {
        if (reducedMotion) { mv.set(value); return; }
        const controls = animate(mv, value, { duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] });
        return controls.stop;
    }, [value, reducedMotion, mv]);

    return <motion.span className={className}>{rounded}</motion.span>;
}

export default function StatCards({ successRate, streak, dailyGoalCurrent, dailyGoalTarget }: StatCardsProps) {
    const reducedMotion = useReducedMotion();
    const dailyPercent = Math.min(100, Math.round((dailyGoalCurrent / Math.max(1, dailyGoalTarget)) * 100));
    const goalDone = dailyPercent >= 100;
    const circumference = 2 * Math.PI * 40;
    const successStrokeOffset = circumference - (successRate / 100) * circumference;
    const dailyStrokeOffset = circumference - (dailyPercent / 100) * circumference;

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-full"
        >
            {/* ── Success Rate — blue SVG ring ── */}
            <motion.div
                variants={cardVariants}
                whileHover={reducedMotion ? undefined : cardHover}
                className="group bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center justify-between h-full min-h-[190px] transition-colors hover:border-[#0055A4]/30"
            >
                <div aria-hidden className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-blue-500/5 blur-2xl pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
                
                <div className="relative w-24 h-24 flex items-center justify-center mt-1">
                    <svg viewBox="0 0 96 96" className="absolute inset-0 w-full h-full -rotate-90">
                        <defs>
                            <linearGradient id="successRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#0055A4" />
                                <stop offset="100%" stopColor="#3B82F6" />
                            </linearGradient>
                        </defs>
                        <circle cx="48" cy="48" r="40" stroke="var(--dash-surface)" strokeWidth="7" fill="none" />
                        <motion.circle
                            cx="48" cy="48" r="40"
                            stroke="url(#successRingGrad)"
                            strokeWidth="7"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeLinecap="round"
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: successStrokeOffset }}
                            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            style={{ filter: 'drop-shadow(0 0 4px rgba(0,85,164,0.25))' }}
                        />
                    </svg>
                    <CountUp value={successRate} suffix="%" className="text-2xl font-black text-[var(--dash-text)] tabular-nums" />
                </div>
                
                <p className="text-[11px] font-extrabold text-[var(--dash-text-muted)] uppercase tracking-wider text-center flex items-center gap-1.5 mt-3">
                    <TrendingUp className="h-3.5 w-3.5 text-[#0055A4]" /> Taux de réussite
                </p>
            </motion.div>

            {/* ── Streak — orange flame + 7-day dots ── */}
            <motion.div
                variants={cardVariants}
                whileHover={reducedMotion ? undefined : cardHover}
                className="group bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center justify-between h-full min-h-[190px] transition-colors hover:border-[#F59E0B]/40"
            >
                <div aria-hidden className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-amber-500/5 blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-colors" />

                <div className="flex flex-col items-center gap-2 mt-2">
                    <div className="flex items-center gap-3">
                        <motion.div
                            animate={!reducedMotion && streak > 0 ? { scale: [1, 1.12, 1], rotate: [0, -3, 3, 0] } : undefined}
                            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                            className={`flex items-center justify-center h-12 w-12 rounded-2xl ${streak > 0 ? 'bg-gradient-to-br from-amber-400/20 to-orange-500/20' : 'bg-[var(--dash-surface)]'}`}
                        >
                            <Flame className={`h-6 w-6 ${streak > 0 ? 'text-[#F59E0B] drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]' : 'text-[var(--dash-text-muted)]'}`} />
                        </motion.div>
                        <CountUp value={streak} className="text-3xl font-black text-[var(--dash-text)] tabular-nums" />
                    </div>
                    
                    {/* 7-day dots */}
                    <div className="flex items-center gap-1.5 mt-2" aria-hidden>
                        {Array.from({ length: 7 }).map((_, i) => (
                            <motion.span
                                key={i}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 + i * 0.06, type: 'spring', stiffness: 300, damping: 18 }}
                                className={`h-2 w-2 rounded-full ${i < Math.min(streak, 7) ? 'bg-gradient-to-r from-[#F59E0B] to-[#F97316]' : 'bg-[var(--dash-surface)] border border-[var(--dash-card-border)]'}`}
                            />
                        ))}
                    </div>
                </div>

                <p className="text-[11px] font-extrabold text-[var(--dash-text-muted)] uppercase tracking-wider text-center mt-3">
                    Série de jours
                </p>
            </motion.div>

            {/* ── Daily Goal — green SVG ring ── */}
            <motion.div
                variants={cardVariants}
                whileHover={reducedMotion ? undefined : cardHover}
                className="group bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center justify-between h-full min-h-[190px] transition-colors hover:border-[#22C55E]/40"
            >
                <div aria-hidden className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-emerald-500/5 blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />

                <div className="relative w-24 h-24 flex items-center justify-center mt-1">
                    <svg viewBox="0 0 96 96" className="absolute inset-0 w-full h-full -rotate-90">
                        <defs>
                            <linearGradient id="dailyRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#22C55E" />
                                <stop offset="100%" stopColor="#10B981" />
                            </linearGradient>
                        </defs>
                        <circle cx="48" cy="48" r="40" stroke="var(--dash-surface)" strokeWidth="7" fill="none" />
                        <motion.circle
                            cx="48" cy="48" r="40"
                            stroke="url(#dailyRingGrad)"
                            strokeWidth="7"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeLinecap="round"
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: dailyStrokeOffset }}
                            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            style={{ filter: 'drop-shadow(0 0 4px rgba(34,197,94,0.25))' }}
                        />
                    </svg>
                    
                    <div className="flex flex-col items-center">
                        {goalDone ? (
                            <motion.span 
                                initial={{ scale: 0 }} 
                                animate={{ scale: 1 }} 
                                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                            >
                                <Check className="h-7 w-7 text-[#22C55E]" />
                            </motion.span>
                        ) : (
                            <>
                                <span className="text-base font-black text-[var(--dash-text)] leading-none">
                                    {dailyGoalCurrent}
                                </span>
                                <span className="text-[10px] font-bold text-[var(--dash-text-muted)] border-t border-slate-200 mt-0.5 pt-0.5 px-1">
                                    {dailyGoalTarget}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <p className="text-[11px] font-extrabold text-[var(--dash-text-muted)] uppercase tracking-wider text-center flex items-center gap-1.5 mt-3">
                    <Target className="h-3.5 w-3.5 text-[#22C55E]" /> Objectif quotidien
                </p>
            </motion.div>
        </motion.div>
    );
}
