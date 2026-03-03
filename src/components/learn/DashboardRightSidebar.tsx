import { motion } from 'framer-motion';
import { CheckCircle, Lock, ArrowRight, Globe, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RecentActivityLog from './RecentActivityLog';
import type { ActivityItem } from '@/hooks/useDashboardStats';

interface LearningJourneyProps {
    tier: 'free' | 'standard' | 'premium';
    onUpgrade: () => void;
    recentActivity: ActivityItem[];
}

const STAGES = [
    { key: 'fundamentals', label: 'Fondamentaux', desc: 'Valeurs de la République', status: 'completed' as const },
    { key: 'institutions', label: 'Institutions', desc: 'Système politique', status: 'completed' as const },
    { key: 'rights', label: 'Droits & Devoirs', desc: 'Citoyenneté active', status: 'current' as const },
    { key: 'history', label: 'Histoire & Culture', desc: 'Repères historiques', status: 'locked' as const },
    { key: 'society', label: 'Vie en société', desc: 'Quotidien en France', status: 'locked' as const },
];

function StatusDot({ status }: { status: 'completed' | 'current' | 'locked' }) {
    if (status === 'completed') {
        return (
            <div className="h-8 w-8 rounded-full bg-[#22C55E] flex items-center justify-center shadow-[0_0_12px_rgba(34,197,94,0.3)]">
                <CheckCircle className="h-4 w-4 text-white" />
            </div>
        );
    }
    if (status === 'current') {
        return (
            <div className="relative h-8 w-8 rounded-full bg-[#0055A4] dark:bg-blue-500 flex items-center justify-center shadow-[0_0_12px_rgba(0,85,164,0.3)]">
                <Sparkles className="h-4 w-4 text-white" />
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[#0055A4]/40 dark:border-blue-400/40"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>
        );
    }
    return (
        <div className="h-8 w-8 rounded-full bg-[var(--dash-card-border)] flex items-center justify-center">
            <Lock className="h-3.5 w-3.5 text-[var(--dash-text-muted)]" />
        </div>
    );
}

export default function DashboardRightSidebar({ tier, onUpgrade, recentActivity }: LearningJourneyProps) {
    return (
        <motion.aside
            initial="hidden" animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }}
            className="w-full xl:w-[340px] flex-shrink-0 flex flex-col gap-6"
        >
            {/* ── Learning Journey Timeline ── */}
            <motion.div
                variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
                className="bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
            >
                <h3 className="font-bold text-[var(--dash-text)] mb-5 text-sm">Votre Parcours</h3>
                <div className="relative">
                    {STAGES.map((stage, idx) => {
                        const isLast = idx === STAGES.length - 1;
                        return (
                            <div key={stage.key} className="flex gap-3 relative">
                                <div className="flex flex-col items-center">
                                    <StatusDot status={stage.status} />
                                    {!isLast && (
                                        <div className={`w-0.5 flex-1 min-h-[36px] ${stage.status === 'completed' ? 'bg-[#22C55E]' : 'bg-[var(--dash-card-border)]'}`} />
                                    )}
                                </div>
                                <div className={`pb-5 flex-1 ${isLast ? 'pb-0' : ''}`}>
                                    <p className={`text-sm font-bold mb-0.5 ${stage.status === 'locked' ? 'text-[var(--dash-text-muted)]' : 'text-[var(--dash-text)]'}`}>
                                        {stage.label}
                                    </p>
                                    <p className={`text-xs font-medium ${stage.status === 'locked' ? 'text-[var(--dash-text-muted)] opacity-50' : 'text-[var(--dash-text-muted)]'}`}>
                                        {stage.desc}
                                    </p>
                                    {stage.status === 'current' && (
                                        <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-widest text-[#0055A4] dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                                            En cours
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            {/* ── Recent Activity ── */}
            <RecentActivityLog activities={recentActivity} />

            {/* ── Premium Upsell ── */}
            {tier !== 'premium' && (
                <motion.div
                    variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
                    className="bg-gradient-to-br from-[#0055A4] to-[#3B82F6] rounded-2xl p-5 shadow-md text-white relative overflow-hidden group hover:shadow-lg transition-all"
                >
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
                    <div className="flex items-center gap-2 mb-3 relative z-10">
                        <Globe className="h-5 w-5 text-white/90" />
                        <h3 className="font-bold text-base">Passez au supérieur</h3>
                    </div>
                    <p className="text-sm text-white/80 mb-5 font-medium leading-relaxed relative z-10">
                        Débloquez tous les chapitres et la traduction instantanée.
                    </p>
                    <Button
                        onClick={onUpgrade}
                        className="w-full bg-white text-[#0055A4] hover:bg-white/90 font-bold border-0 shadow-sm rounded-xl py-5 relative z-10"
                    >
                        Débloquer Premium
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </motion.div>
            )}
        </motion.aside>
    );
}
