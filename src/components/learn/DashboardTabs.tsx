import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import WeeklyActivityChart from '@/components/learn/WeeklyActivityChart';
import DomainMasteryBars from '@/components/learn/DomainMasteryBars';
import RecentActivityLog from '@/components/learn/RecentActivityLog';

interface DashboardTabsProps {
    children: React.ReactNode;
}

const TABS = [
    { key: 'overview', label: 'Aperçu' },
    { key: 'stats', label: 'Statistiques' },
    { key: 'history', label: 'Historique' },
];

export default function DashboardTabs({ children }: DashboardTabsProps) {
    const [activeTab, setActiveTab] = useState('overview');
    const stats = useDashboardStats();

    return (
        <div className="mb-8">
            <div className="flex items-center gap-1 border-b border-[var(--dash-card-border)] mb-6">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`relative px-4 py-3 text-sm font-semibold transition-colors ${activeTab === tab.key
                                ? 'text-[#0055A4]'
                                : 'text-[var(--dash-text-muted)] hover:text-[var(--dash-text)]'
                            }`}
                    >
                        {tab.label}
                        {activeTab === tab.key && (
                            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0055A4] rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
            >
                {activeTab === 'overview' && children}

                {activeTab === 'stats' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { label: 'Taux de réussite', value: `${stats.successRate}%` },
                                { label: 'Série de jours', value: stats.streak },
                                { label: 'XP total', value: stats.totalXP },
                                { label: 'À réviser', value: stats.wrongQuestionsCount },
                            ].map((s) => (
                                <div key={s.label} className="rounded-xl border border-[var(--dash-card-border)] p-4">
                                    <p className="text-xs text-[var(--dash-text-muted)]">{s.label}</p>
                                    <p className="text-2xl font-bold text-[var(--dash-text)] mt-1">{s.value}</p>
                                </div>
                            ))}
                        </div>
                        <WeeklyActivityChart data={stats.weeklyActivity} />
                        <DomainMasteryBars domains={stats.domainMastery} />
                    </div>
                )}

                {activeTab === 'history' && (
                    stats.recentActivity.length > 0 ? (
                        <RecentActivityLog activities={stats.recentActivity} />
                    ) : (
                        <div className="text-center py-16 text-[var(--dash-text-muted)]">
                            <p className="text-lg font-semibold mb-1">Aucun examen pour l'instant</p>
                            <p className="text-sm">Lancez votre premier quiz pour voir votre historique ici.</p>
                        </div>
                    )
                )}
            </motion.div>
        </div>
    );
}
