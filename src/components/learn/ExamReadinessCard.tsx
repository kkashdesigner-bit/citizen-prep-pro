import { motion, useReducedMotion } from 'framer-motion';
import { Target, TrendingUp, AlertTriangle, BookOpen } from 'lucide-react';
import { calculateReadiness, EXAM_WEIGHTS, type ThemeScore, type ReadinessScore } from '@/lib/exam-prediction';

interface ExamReadinessCardProps {
    successRate: number; // overall rolling accuracy (0-100)
    totalExams: number;
    themeStats?: Record<string, { correct: number; total: number }>;
}

const THEME_LABELS: Record<string, string> = {
    histoire: 'Hist.', institutions: 'Inst.', valeurs: 'Val.', symboles: 'Symb.', europe: 'Eur.',
};
const THEME_FULL_LABELS: Record<string, string> = {
    histoire: 'Histoire', institutions: 'Institutions', valeurs: 'Valeurs et Principes', symboles: 'Symboles et Rites', europe: 'Europe et Monde',
};

export default function ExamReadinessCard({ successRate, totalExams, themeStats }: ExamReadinessCardProps) {
    const reduced = useReducedMotion();
    const minExamsForReadiness = 5;
    const passThreshold = 80;

    let readiness: ReadinessScore | null = null;
    if (themeStats && Object.keys(themeStats).length > 0) {
        const themeScores: ThemeScore[] = Object.entries(EXAM_WEIGHTS).map(([theme, weight]) => {
            const stats = themeStats[theme];
            return {
                theme,
                totalQuestions: weight,
                correctRate: stats && stats.total > 0 ? stats.correct / stats.total : 0,
                questionsAttempted: stats?.total ?? 0,
            };
        });
        readiness = calculateReadiness(themeScores);
    }

    const displayScore = Math.max(0, Math.min(100, Math.round(readiness ? readiness.predictedPct : successRate)));
    const predictedOutOf40 = readiness?.predictedScore ?? Math.round((successRate / 100) * 40);

    let gradId = 'gaugeAmber';
    let stops = ['#F59E0B', '#FBBF24'];
    let statusColor = 'text-amber-600';
    let level = 'À évaluer';
    let message = `Encore ${Math.max(0, minExamsForReadiness - totalExams)} examens pour évaluer votre niveau`;
    let Icon = Target;

    if (totalExams >= minExamsForReadiness) {
        if (readiness?.willPass || displayScore >= passThreshold) {
            gradId = 'gaugeGreen'; stops = ['#22C55E', '#10B981']; statusColor = 'text-emerald-600'; level = 'Élevé';
            message = 'Vous êtes prêt pour la naturalisation !'; Icon = TrendingUp;
        } else if (displayScore >= 60) {
            gradId = 'gaugeBlue'; stops = ['#0055A4', '#3B82F6']; statusColor = 'text-blue-600'; level = 'Moyen';
            message = 'En bonne voie, continuez à réviser'; Icon = TrendingUp;
        } else {
            gradId = 'gaugeRed'; stops = ['#EF4444', '#F87171']; statusColor = 'text-red-500'; level = 'Faible';
            message = 'Des révisions supplémentaires sont nécessaires'; Icon = AlertTriangle;
        }
    }

    const R = 64;
    const SEMI = Math.PI * R; // length of the semicircle arc
    const offset = SEMI * (1 - displayScore / 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] h-full flex flex-col justify-between min-h-[190px] overflow-hidden transition-colors hover:border-[#7C3AED]/30"
        >
            <div aria-hidden className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-purple-500/5 blur-2xl pointer-events-none group-hover:bg-purple-500/10 transition-colors" />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${statusColor.replace('text-', 'bg-')}/10`}>
                        <Icon className={`h-4 w-4 ${statusColor}`} />
                    </div>
                    <h3 className="text-[13px] font-extrabold text-[var(--dash-text)] uppercase tracking-wide leading-tight">
                        Préparation à l'examen
                    </h3>
                </div>
                <div className="text-right shrink-0">
                    <span className={`text-lg font-black ${statusColor}`}>{predictedOutOf40}</span>
                    <span className="text-[10px] text-[var(--dash-text-muted)] ml-1">/40 prévu</span>
                </div>
            </div>

            {/* Half-circle gauge */}
            <div className="relative mx-auto mt-1" style={{ width: 160, height: 90 }}>
                <svg viewBox="0 0 160 92" className="w-full h-full">
                    <defs>
                        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={stops[0]} />
                            <stop offset="100%" stopColor={stops[1]} />
                        </linearGradient>
                    </defs>
                    <path d="M 16 80 A 64 64 0 0 1 144 80" fill="none" stroke="var(--dash-surface)" strokeWidth="12" strokeLinecap="round" />
                    <motion.path
                        d="M 16 80 A 64 64 0 0 1 144 80"
                        fill="none" stroke={`url(#${gradId})`} strokeWidth="12" strokeLinecap="round"
                        strokeDasharray={SEMI}
                        initial={{ strokeDashoffset: reduced ? offset : SEMI }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    />
                </svg>
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
                    <span className={`text-[11px] font-bold ${statusColor}`}>{level}</span>
                    <span className="text-2xl font-black text-[var(--dash-text)] tabular-nums leading-none">{displayScore}%</span>
                </div>
            </div>

            <p className={`text-[11px] font-semibold text-center ${statusColor} px-2`}>{message}</p>

            {/* Theme breakdown */}
            {readiness && themeStats ? (
                <div className="grid grid-cols-5 gap-1 pt-2.5 border-t border-[var(--dash-card-border)] mt-1">
                    {Object.entries(EXAM_WEIGHTS).map(([theme, weight]) => {
                        const stats = themeStats[theme];
                        const rate = stats && stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                        const isWeak = readiness!.weakestThemes.includes(theme);
                        return (
                            <div key={theme} className="text-center">
                                <p className={`text-[9px] font-extrabold uppercase tracking-wider ${isWeak ? 'text-red-500' : 'text-[var(--dash-text-muted)]'}`} title={THEME_FULL_LABELS[theme] || theme}>
                                    {THEME_LABELS[theme] || theme}
                                </p>
                                <p className={`text-xs font-black ${isWeak ? 'text-red-500' : 'text-[var(--dash-text)]'}`}>{rate}%</p>
                                <p className="text-[8px] text-[var(--dash-text-muted)]">{weight}q</p>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-[10px] text-[var(--dash-text-muted)] flex items-center justify-center gap-1.5 leading-normal">
                    <BookOpen className="h-3 w-3 text-slate-400 flex-shrink-0" />
                    <span>Faites plus de quiz pour améliorer la précision.</span>
                </p>
            )}
        </motion.div>
    );
}
