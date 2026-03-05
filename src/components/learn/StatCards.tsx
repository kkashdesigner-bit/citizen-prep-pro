import { motion } from 'framer-motion';
import { Flame, Target } from 'lucide-react';

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

export default function StatCards({ successRate, streak, dailyGoalCurrent, dailyGoalTarget }: StatCardsProps) {
    const dailyPercent = Math.min(100, Math.round((dailyGoalCurrent / dailyGoalTarget) * 100));
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
            {/* ── Success Rate ── */}
            <motion.div variants={cardVariants} className="snap-center shrink-0 w-[65vw] max-w-[240px] sm:w-auto sm:max-w-none bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center gap-3">
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="var(--dash-card-border)" strokeWidth="6" fill="none" />
                        <motion.circle
                            cx="48" cy="48" r="40"
                            stroke="#0055A4"
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeLinecap="round"
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: strokeOffset }}
                            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                            className=""
                        />
                    </svg>
                    <span className="text-2xl font-bold text-[var(--dash-text)]">{successRate}%</span>
                </div>
                <p className="text-xs font-bold text-[var(--dash-text-muted)] uppercase tracking-widest text-center">Taux de réussite</p>
            </motion.div>

            {/* ── Streak ── */}
            <motion.div variants={cardVariants} className="snap-center shrink-0 w-[65vw] max-w-[240px] sm:w-auto sm:max-w-none bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-2">
                    <Flame className={`h-7 w-7 ${streak > 0 ? 'text-[#F59E0B]' : 'text-[var(--dash-text-muted)]'}`} />
                    <span className="text-3xl font-bold text-[var(--dash-text)]">{streak}</span>
                </div>
                <p className="text-xs font-bold text-[var(--dash-text-muted)] uppercase tracking-widest text-center">Série de jours</p>
                {streak > 0 && (
                    <p className="text-xs text-[#F59E0B] font-semibold">🔥 Continuez comme ça !</p>
                )}
            </motion.div>

            {/* ── Daily Goal ── */}
            <motion.div variants={cardVariants} className="snap-center shrink-0 w-[65vw] max-w-[240px] sm:w-auto sm:max-w-none bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-[#22C55E]" />
                        <span className="text-sm font-bold text-[var(--dash-text)]">Objectif quotidien</span>
                    </div>
                    <span className="text-sm font-bold text-[#22C55E]">{dailyGoalCurrent}/{dailyGoalTarget}</span>
                </div>
                <div className="h-3 w-full bg-[var(--dash-surface)] rounded-full overflow-hidden border border-[var(--dash-card-border)]">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${dailyPercent}%` }}
                        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[#22C55E] to-[#16A34A] rounded-full"
                    />
                </div>
                <p className="text-xs text-[var(--dash-text-muted)] font-medium">
                    {dailyPercent >= 100 ? '✅ Objectif atteint !' : `Encore ${dailyGoalTarget - dailyGoalCurrent} questions`}
                </p>
            </motion.div>
        </motion.div>
    );
}
