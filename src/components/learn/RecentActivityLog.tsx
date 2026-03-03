import { motion } from 'framer-motion';
import { FileText, BookOpen, CheckCircle, Sparkles } from 'lucide-react';
import type { ActivityItem } from '@/hooks/useDashboardStats';

interface RecentActivityLogProps {
    activities: ActivityItem[];
}

function ActivityIcon({ type }: { type: ActivityItem['type'] }) {
    const base = "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0";
    if (type === 'exam') return <div className={`${base} bg-blue-500/10`}><FileText className="h-4 w-4 text-blue-500" /></div>;
    if (type === 'answer') return <div className={`${base} bg-emerald-500/10`}><BookOpen className="h-4 w-4 text-emerald-500" /></div>;
    return <div className={`${base} bg-amber-500/10`}><Sparkles className="h-4 w-4 text-amber-500" /></div>;
}

export default function RecentActivityLog({ activities }: RecentActivityLogProps) {
    return (
        <motion.div
            variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
            className="bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
        >
            <h3 className="font-bold text-[var(--dash-text)] text-sm mb-4">Activité récente</h3>

            {activities.length === 0 ? (
                <p className="text-xs text-[var(--dash-text-muted)] text-center py-4">
                    Aucune activité pour le moment
                </p>
            ) : (
                <div className="space-y-3">
                    {activities.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.06 }}
                            className="flex items-center gap-3"
                        >
                            <ActivityIcon type={item.type} />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-[var(--dash-text)] truncate">{item.title}</p>
                                <p className="text-[10px] text-[var(--dash-text-muted)]">{item.date}</p>
                            </div>
                            {item.detail && (
                                <span className="text-[10px] font-semibold text-[var(--dash-text-muted)] flex-shrink-0">{item.detail}</span>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
