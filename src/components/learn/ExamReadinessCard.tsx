import { motion } from 'framer-motion';
import { Target, TrendingUp, AlertTriangle, BookOpen } from 'lucide-react';
import { calculateReadiness, EXAM_WEIGHTS, type ThemeScore, type ReadinessScore } from '@/lib/exam-prediction';

interface ExamReadinessCardProps {
    successRate: number; // The overall rolling accuracy score (0-100)
    totalExams: number;
    themeStats?: Record<string, { correct: number; total: number }>;
}

const THEME_LABELS: Record<string, string> = {
    histoire: 'Histoire',
    institutions: 'Institutions',
    valeurs: 'Valeurs',
    symboles: 'Symboles',
    europe: 'Europe',
};

export default function ExamReadinessCard({ successRate, totalExams, themeStats }: ExamReadinessCardProps) {
    const minExamsForReadiness = 5;
    const passThreshold = 80;

    // Build theme scores for weighted prediction if stats are available
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

    const displayScore = readiness ? readiness.predictedPct : successRate;
    const predictedOutOf40 = readiness?.predictedScore ?? Math.round((successRate / 100) * 40);

    let statusColor = 'text-[var(--dash-text-muted)]';
    let bgGradient = 'from-slate-500 to-slate-400';
    let message = 'Commencez \u00e0 vous entra\u00eener';
    let Icon = Target;

    if (totalExams < minExamsForReadiness) {
        statusColor = 'text-amber-600';
        bgGradient = 'from-amber-400 to-amber-500';
        message = `Encore ${minExamsForReadiness - totalExams} examens pour \u00e9valuer votre niveau`;
    } else if (readiness?.willPass || displayScore >= passThreshold) {
        statusColor = 'text-emerald-600';
        bgGradient = 'from-emerald-400 to-emerald-500';
        message = 'Vous \u00eates pr\u00eat pour la naturalisation !';
        Icon = TrendingUp;
    } else if (displayScore >= 60) {
        statusColor = 'text-blue-600';
        bgGradient = 'from-blue-400 to-blue-500';
        message = 'En bonne voie, continuez \u00e0 r\u00e9viser';
        Icon = TrendingUp;
    } else {
        statusColor = 'text-red-500';
        bgGradient = 'from-red-400 to-red-500';
        message = 'Des r\u00e9visions suppl\u00e9mentaires sont n\u00e9cessaires';
        Icon = AlertTriangle;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] mb-6 sm:mb-8"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg bg-opacity-10 ${statusColor.replace('text-', 'bg-')}`}>
                        <Icon className={`h-5 w-5 ${statusColor}`} />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[var(--dash-text)]">
                        Pr\u00e9paration \u00e0 l'Examen
                    </h3>
                </div>
                <div className="text-right">
                    <span className={`text-xl font-bold ${statusColor}`}>{predictedOutOf40}</span>
                    <span className="text-xs text-[var(--dash-text-muted)] ml-1">/40 pr\u00e9vu</span>
                </div>
            </div>

            <div className="relative h-4 w-full bg-[var(--dash-surface)] rounded-full overflow-hidden border border-[var(--dash-card-border)] mb-2">
                {/* Target marker at 80% (32/40) */}
                <div className="absolute top-0 bottom-0 left-[80%] w-0.5 bg-red-400 z-10" title="Seuil de r\u00e9ussite (32/40)" />

                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, displayScore)}%` }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className={`absolute top-0 bottom-0 left-0 bg-gradient-to-r ${bgGradient} rounded-full z-0`}
                />
            </div>

            <div className="flex justify-between items-center text-xs mb-3">
                <span className="font-semibold text-[var(--dash-text-muted)]">{message}</span>
                <span className="text-[var(--dash-text-muted)]">Objectif: 32/40</span>
            </div>

            {/* Theme breakdown */}
            {readiness && themeStats && (
                <div className="grid grid-cols-5 gap-1.5 mt-3 pt-3 border-t border-[var(--dash-card-border)]">
                    {Object.entries(EXAM_WEIGHTS).map(([theme, weight]) => {
                        const stats = themeStats[theme];
                        const rate = stats && stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                        const isWeak = readiness!.weakestThemes.includes(theme);
                        return (
                            <div key={theme} className="text-center">
                                <p className={`text-[10px] font-bold uppercase tracking-wider ${isWeak ? 'text-red-500' : 'text-[var(--dash-text-muted)]'}`}>
                                    {THEME_LABELS[theme] || theme}
                                </p>
                                <p className={`text-sm font-bold ${isWeak ? 'text-red-500' : 'text-[var(--dash-text)]'}`}>
                                    {rate}%
                                </p>
                                <p className="text-[9px] text-[var(--dash-text-muted)]">{weight}q</p>
                            </div>
                        );
                    })}
                </div>
            )}

            {readiness?.confidenceLevel === 'low' && (
                <p className="text-[11px] text-[var(--dash-text-muted)] mt-2 flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    Faites plus de quiz pour am\u00e9liorer la pr\u00e9cision de cette estimation.
                </p>
            )}
        </motion.div>
    );
}
