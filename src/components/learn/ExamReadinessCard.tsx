import { motion } from 'framer-motion';
import { Target, TrendingUp, AlertTriangle } from 'lucide-react';

interface ExamReadinessCardProps {
    successRate: number; // The overall rolling accuracy score (0-100)
    totalExams: number;
}

export default function ExamReadinessCard({ successRate, totalExams }: ExamReadinessCardProps) {
    const minExamsForReadiness = 5;
    const passThreshold = 80;

    // Calculate readiness percentage based on moving towards the 80% passing threshold.
    // Cap at 100%. We use the success rate relative to the pass threshold.
    const readinessPercent = Math.min(100, Math.round((successRate / passThreshold) * 100));

    let statusColor = 'text-[var(--dash-text-muted)]';
    let bgGradient = 'from-slate-500 to-slate-400';
    let message = 'Commencez à vous entraîner';
    let Icon = Target;

    if (totalExams < minExamsForReadiness) {
        statusColor = 'text-amber-600';
        bgGradient = 'from-amber-400 to-amber-500';
        message = `Encore ${minExamsForReadiness - totalExams} examens pour évaluer votre niveau`;
    } else if (successRate >= passThreshold) {
        statusColor = 'text-emerald-600';
        bgGradient = 'from-emerald-400 to-emerald-500';
        message = 'Vous êtes prêt pour la naturalisation !';
        Icon = TrendingUp;
    } else if (successRate >= 60) {
        statusColor = 'text-blue-600';
        bgGradient = 'from-blue-400 to-blue-500';
        message = 'En bonne voie, continuez à réviser';
        Icon = TrendingUp;
    } else {
        statusColor = 'text-red-500';
        bgGradient = 'from-red-400 to-red-500';
        message = 'Des révisions supplémentaires sont nécessaires';
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
                        Préparation à l'Examen
                    </h3>
                </div>
                <div className="text-right">
                    <span className={`text-xl font-bold ${statusColor}`}>{successRate}%</span>
                    <span className="text-xs text-[var(--dash-text-muted)] ml-1">Précision Moyenne</span>
                </div>
            </div>

            <div className="relative h-4 w-full bg-[var(--dash-surface)] rounded-full overflow-hidden border border-[var(--dash-card-border)] mb-2">
                {/* Target marker at 80% */}
                <div className="absolute top-0 bottom-0 left-[80%] w-0.5 bg-red-400 z-10" title="Seuil de réussite (80%)" />

                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${successRate}%` }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className={`absolute top-0 bottom-0 left-0 bg-gradient-to-r ${bgGradient} rounded-full z-0`}
                />
            </div>

            <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[var(--dash-text-muted)]">{message}</span>
                <span className="text-[var(--dash-text-muted)]">Objectif: 80%</span>
            </div>
        </motion.div>
    );
}
