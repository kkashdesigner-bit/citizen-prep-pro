import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from 'framer-motion';
import { Flame, Target, TrendingUp, Check } from 'lucide-react';

interface StatCardsProps {
    successRate: number;
    streak: number;
    dailyGoalCurrent: number;
    dailyGoalTarget: number;
}

const cardVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 12 },
    visible: { opacity: 1, scale: 1, y: 0 },
};
const cardHover = { y: -3, boxShadow: '0 14px 34px -10px rgba(0,85,164,0.18)' };

/** Animated count-up number (static when reduced motion is preferred). */
function CountUp({ value, suffix = '', className }: { value: number; suffix?: string; className?: string }) {
    const reduced = useReducedMotion();
    const mv = useMotionValue(0);
    const rounded = useTransform(mv, v => `${Math.round(v)}${suffix}`);
    useEffect(() => {
        if (reduced) { mv.set(value); return; }
        const controls = animate(mv, value, { duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] });
        return controls.stop;
    }, [value, reduced, mv]);
    return <motion.span className={className}>{rounded}</motion.span>;
}

/**
 * Interactive, always-flickering fire. It flickers and sheds embers on its own,
 * fans bigger on hover, and pops a burst ring on hover/tap. Purely decorative.
 */
function InteractiveFire({ lit }: { lit: boolean }) {
    const reduced = useReducedMotion();
    const [burst, setBurst] = useState(0);
    const ignite = () => setBurst(b => b + 1);

    return (
        <motion.button
            type="button"
            aria-hidden
            tabIndex={-1}
            onHoverStart={ignite}
            onTapStart={ignite}
            whileHover={reduced ? undefined : { scale: 1.1 }}
            whileTap={reduced ? undefined : { scale: 0.88 }}
            className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-transparent outline-none"
        >
            {/* Pulsing heat glow */}
            <motion.span
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{ background: lit ? 'radial-gradient(circle, rgba(249,115,22,0.45), transparent 68%)' : 'transparent' }}
                animate={reduced || !lit ? undefined : { opacity: [0.45, 0.85, 0.45], scale: [0.9, 1.12, 0.9] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Rising embers */}
            {!reduced && lit && [0, 1, 2].map(i => (
                <motion.span
                    key={i}
                    className="pointer-events-none absolute h-1 w-1 rounded-full bg-amber-400"
                    style={{ left: `${42 + i * 6}%`, bottom: '34%' }}
                    animate={{ y: [0, -16], opacity: [0, 1, 0], scale: [0.9, 0.3] }}
                    transition={{ duration: 1.5 + i * 0.35, repeat: Infinity, delay: i * 0.45, ease: 'easeOut' }}
                />
            ))}

            {/* Burst ring fired on hover / tap */}
            {!reduced && (
                <motion.span
                    key={burst}
                    className="pointer-events-none absolute inset-0 rounded-full border-2 border-amber-400/60"
                    initial={{ scale: 0.5, opacity: burst === 0 ? 0 : 0.7 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                />
            )}

            {/* The flame */}
            <motion.span
                className="relative"
                style={{ transformOrigin: 'bottom center' }}
                animate={reduced || !lit ? undefined : { rotate: [-3, 3, -2, 2, -3], scaleY: [1, 1.1, 0.96, 1.06, 1], scaleX: [1, 0.96, 1.04, 0.98, 1] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
            >
                <Flame className={`h-8 w-8 ${lit ? 'text-[#F97316] fill-amber-400/40 drop-shadow-[0_0_10px_rgba(249,115,22,0.55)]' : 'text-[var(--dash-text-muted)]'}`} />
            </motion.span>
        </motion.button>
    );
}

export default function StatCards({ successRate, streak, dailyGoalCurrent, dailyGoalTarget }: StatCardsProps) {
    const reducedMotion = useReducedMotion();
    const dailyPercent = Math.min(100, Math.round((dailyGoalCurrent / Math.max(1, dailyGoalTarget)) * 100));
    const goalDone = dailyPercent >= 100;
    const circumference = 2 * Math.PI * 40;
    const successStrokeOffset = circumference - (successRate / 100) * circumference;

    // Next streak milestone (multiples of 7) and days remaining.
    const nextMilestone = Math.max(7, Math.ceil((streak + 1) / 7) * 7);
    const daysToNext = Math.max(0, nextMilestone - streak);

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-full"
        >
            {/* ── Success Rate — blue ring ── */}
            <motion.div
                variants={cardVariants}
                whileHover={reducedMotion ? undefined : cardHover}
                className="group relative bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center justify-between h-full min-h-[190px] overflow-hidden transition-colors hover:border-[#0055A4]/30"
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
                            stroke="url(#successRingGrad)" strokeWidth="7" fill="none"
                            strokeDasharray={circumference} strokeLinecap="round"
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: successStrokeOffset }}
                            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            style={{ filter: 'drop-shadow(0 0 4px rgba(0,85,164,0.25))' }}
                        />
                    </svg>
                    <CountUp value={successRate} suffix="%" className="text-2xl font-black text-[var(--dash-text)] tabular-nums" />
                </div>

                <div className="text-center mt-3">
                    <p className="text-[11px] font-extrabold text-[var(--dash-text-muted)] uppercase tracking-wider flex items-center justify-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5 text-[#0055A4]" /> Taux de réussite
                    </p>
                    <p className="text-[10px] text-[var(--dash-text-muted)] mt-0.5">Précision sur vos réponses</p>
                </div>
            </motion.div>

            {/* ── Streak — interactive fire ── */}
            <motion.div
                variants={cardVariants}
                whileHover={reducedMotion ? undefined : cardHover}
                className="group relative bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center justify-between h-full min-h-[190px] overflow-hidden transition-colors hover:border-[#F97316]/40"
            >
                <div aria-hidden className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-amber-500/5 blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-colors" />

                <div className="flex items-center gap-2 mt-2">
                    <InteractiveFire lit={streak > 0} />
                    <div className="flex flex-col items-start leading-none">
                        <CountUp value={streak} className="text-4xl font-black text-[var(--dash-text)] tabular-nums" />
                        <span className="text-[10px] font-extrabold text-[var(--dash-text-muted)] uppercase tracking-widest mt-1">jours</span>
                    </div>
                </div>

                <div className="text-center mt-3">
                    <p className="text-[11px] font-extrabold text-[var(--dash-text-muted)] uppercase tracking-wider">Série de jours</p>
                    <p className="text-[10px] text-[var(--dash-text-muted)] mt-0.5">
                        {streak > 0
                            ? `Plus que ${daysToNext} j. avant ${nextMilestone} 🔥`
                            : 'Commencez votre série aujourd’hui'}
                    </p>
                </div>
            </motion.div>

            {/* ── Daily Goal — progress bar ── */}
            <motion.div
                variants={cardVariants}
                whileHover={reducedMotion ? undefined : cardHover}
                className="group relative bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center justify-between h-full min-h-[190px] overflow-hidden transition-colors hover:border-[#22C55E]/40"
            >
                <div aria-hidden className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-emerald-500/5 blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />

                <div className="flex flex-1 w-full flex-col items-center justify-center px-1">
                    {goalDone ? (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15">
                            <Check className="h-7 w-7 text-[#22C55E]" />
                        </motion.span>
                    ) : (
                        <div className="flex items-baseline gap-1">
                            <CountUp value={dailyGoalCurrent} className="text-3xl font-black text-[var(--dash-text)] tabular-nums" />
                            <span className="text-sm font-bold text-[var(--dash-text-muted)]">/ {dailyGoalTarget}</span>
                        </div>
                    )}
                    <span className="text-[10px] font-semibold text-[var(--dash-text-muted)] uppercase tracking-wider mt-1">questions</span>

                    <div className="w-full mt-3 h-2.5 rounded-full bg-[var(--dash-surface)] overflow-hidden border border-[var(--dash-card-border)]">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${dailyPercent}%` }}
                            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                            className="h-full rounded-full bg-gradient-to-r from-[#22C55E] to-[#10B981]"
                        />
                    </div>
                    <span className="text-[11px] font-bold text-[#16A34A] mt-1.5">{dailyPercent}% complété</span>
                </div>

                <p className="text-[11px] font-extrabold text-[var(--dash-text-muted)] uppercase tracking-wider flex items-center gap-1.5 mt-3">
                    <Target className="h-3.5 w-3.5 text-[#22C55E]" /> Objectif quotidien
                </p>
            </motion.div>
        </motion.div>
    );
}
