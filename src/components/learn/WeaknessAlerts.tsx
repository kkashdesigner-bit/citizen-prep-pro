import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { WeaknessAlert } from '@/hooks/useDashboardStats';

interface WeaknessAlertsProps {
    alerts: WeaknessAlert[];
}

export default function WeaknessAlerts({ alerts }: WeaknessAlertsProps) {
    const navigate = useNavigate();

    if (alerts.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] mb-8"
            >
                <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                    <h3 className="font-bold text-[var(--dash-text)] text-sm">Pas de point faible détecté</h3>
                </div>
                <p className="text-xs text-[var(--dash-text-muted)]">
                    Continuez à répondre aux questions pour obtenir une analyse personnalisée.
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] mb-8"
        >
            <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-4 w-4 text-[#F59E0B]" />
                <h3 className="font-bold text-[var(--dash-text)] text-sm">Points à réviser</h3>
            </div>

            <div className="space-y-3">
                {alerts.map((alert, i) => (
                    <motion.button
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.08 }}
                        whileHover={{ x: 4 }}
                        onClick={() => navigate(`/quiz?category=${encodeURIComponent(alert.category)}`)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-[var(--dash-surface)] border border-[var(--dash-card-border)] hover:border-[var(--dash-text-muted)] transition-all text-left group"
                    >
                        <div className="flex-shrink-0 h-2 w-2 rounded-full" style={{ backgroundColor: alert.color }} />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[var(--dash-text)] mb-0.5">{alert.domain}</p>
                            <p className="text-[11px] text-[var(--dash-text-muted)] truncate">{alert.message}</p>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-[var(--dash-text-muted)] group-hover:text-[var(--dash-text)] transition-colors flex-shrink-0" />
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
}
