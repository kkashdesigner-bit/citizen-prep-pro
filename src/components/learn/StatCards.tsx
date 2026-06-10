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
    const strokeOffset = circumference - (successRate / 100) * circumference;

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
            className="flex sm:grid sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-1 sm:pb-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
            {/* ── Success Rate — gradient SVG ring ── */}
            <motion.div
                variants={cardVariants}
                whileHover={reducedMotion ? undefined : cardHover}
                className="group snap-center shrink-0 w-[65vw] max-w-[240px] sm:w-auto sm:max-w-none bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center gap-3 relative overflow-hidden transition-colors hover:border-[#0055A4]/30"
            >
                <div aria-hidden className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-blue-500/10 blur-2xl pointer-events-none group-hover:bg-blue-500/15 transition-colors" />
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg viewBox="0 0 96 96" className="absolute inset-0 w-full h-full -rotate-90">
                        <defs>
                            <linearGradient id="statRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#0055A4" />
                                <stop offset="100%" stopColor="#4D94E0" />
                            </linearGradient>
                        </defs>
                        <circle cx="48" cy="48" r="40" stroke="var(--dash-surface)" strokeWidth="7" fill="none" />
                        <motion.circle
                            cx="48" cy="48" r="40"
                            stroke="url(#statRingGrad)"
                            strokeWidth="7"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeLinecap="round"
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: strokeOffset }}
                            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            style={{ filter: 'drop-shadow(0 0 5px rgba(27,110,214,0.4))' }}
                        />
                    </svg>
                    <CountUp value={successRate} suffix="%" className="text-2xl font-bold text-[var(--dash-text)] tabular-nums" />
                </div>
                <p className="text-xs font-bold text-[var(--dash-text-muted)] uppercase tracking-widest text-center flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-[#0055A4]" /> Taux de réussite
                </p>
            </motion.div>

            {/* ── Streak — pulsing flame + 7-day dots ── */}
            <motion.div
                variants={cardVariants}
                whileHover={reducedMotion ? undefined : cardHover}
                className="group snap-center shrink-0 w-[65vw] max-w-[240px] sm:w-auto sm:max-w-none bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center gap-2 relative overflow-hidden transition-colors hover:border-[#F59E0B]/40"
            >
                {streak > 0 && (
                    <div aria-hidden className="absolute -top-10 right-0 w-28 h-28 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
                )}
                <div className="flex items-center gap-2.5">
                    <motion.div
                        animate={!reducedMotion && streak > 0 ? { scale: [1, 1.12, 1], rotate: [0, -4, 3, 0] } : undefined}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                        className={`flex items-center justify-center h-11 w-11 rounded-xl ${streak > 0 ? 'bg-gradient-to-br from-amber-400/20 to-orange-500/20' : 'bg-[var(--dash-surface)]'}`}
                    >
                        <Flame className={`h-6 w-6 ${streak > 0 ? 'text-[#F59E0B] drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]' : 'text-[var(--dash-text-muted)]'}`} />
                    </motion.div>
                    <CountUp value={streak} className="text-3xl font-bold text-[var(--dash-text)] tabular-nums" />
                </div>
                <p className="text-xs font-bold text-[var(--dash-text-muted)] uppercase tracking-widest text-center">Série de jours</p>
                {/* 7-day dots */}
                <div className="flex items-center gap-1.5" aria-hidden>
                    {Array.from({ length: 7 }).map((_, i) => (
                        <motion.span
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 + i * 0.06, type: 'spring', stiffness: 300, damping: 18 }}
                            className={`h-1.5 w-1.5 rounded-full ${i < Math.min(streak, 7) ? 'bg-gradient-to-r from-[#F59E0B] to-[#F97316]' : 'bg-[var(--dash-surface)] border border-[var(--dash-card-border)]'}`}
                        />
                    ))}
                </div>
                {streak > 0 && (
                    <p className="text-xs text-[#F59E0B] font-semibold">🔥 Continuez comme ça !</p>
                )}
            </motion.div>

            {/* ── Daily Goal — shimmering gradient bar ── */}
            <motion.div
                variants={cardVariants}
                whileHover={reducedMotion ? undefined : cardHover}
                className="group snap-center shrink-0 w-[65vw] max-w-[240px] sm:w-auto sm:max-w-none bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col gap-3 relative overflow-hidden transition-colors hover:border-[#22C55E]/40"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className={`flex items-center justify-center h-8 w-8 rounded-lg ${goalDone ? 'bg-emerald-500/15' : 'bg-[var(--dash-surface)]'}`}>
                            {goalDone
                                ? <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.8 }}><Check className="h-5 w-5 text-[#22C55E]" /></motion.span>
                                : <Target className="h-4 w-4 text-[#22C55E]" />}
                        </span>
                        <span className="text-sm font-bold text-[var(--dash-text)]">Objectif quotidien</span>
                    </div>
                    <span className="text-sm font-bold text-[#22C55E] tabular-nums">{dailyGoalCurrent}/{dailyGoalTarget}</span>
                </div>
                <div className="h-3 w-full bg-[var(--dash-surface)] rounded-full overflow-hidden border border-[var(--dash-card-border)] relative">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${dailyPercent}%` }}
                        transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full bg-gradient-to-r from-[#22C55E] to-[#16A34A] rounded-full relative overflow-hidden"
                    >
                        {!reducedMotion && dailyPercent > 0 && (
                            <motion.span
                                aria-hidden
                                className="absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                animate={{ x: ['-150%', '350%'] }}
                                transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.6, ease: 'easeInOut' }}
                            />
                        )}
                    </motion.div>
                </div>
                <p className="text-xs text-[var(--dash-text-muted)] font-medium">
                    {goalDone ? '✅ Objectif atteint — à demain pour la série !' : `Encore ${dailyGoalTarget - dailyGoalCurrent} question${dailyGoalTarget - dailyGoalCurrent > 1 ? 's' : ''}`}
                </p>
            </motion.div>
        </motion.div>
    );
}
