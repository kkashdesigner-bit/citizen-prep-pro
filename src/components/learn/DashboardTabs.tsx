import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { LayoutGrid, BarChart3, History } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import WeeklyActivityChart from '@/components/learn/WeeklyActivityChart';
import DomainMasteryBars from '@/components/learn/DomainMasteryBars';
import RecentActivityLog from '@/components/learn/RecentActivityLog';
import { useLanguage } from '@/contexts/LanguageContext';

interface DashboardTabsProps {
    children: React.ReactNode;
}

const TABS = [
    { key: 'overview', labelKey: 'dashboard.tab.overview', icon: LayoutGrid },
    { key: 'stats', labelKey: 'dashboard.tab.stats', icon: BarChart3 },
    { key: 'history', labelKey: 'dashboard.tab.history', icon: History },
];

export default function DashboardTabs({ children }: DashboardTabsProps) {
    const [activeTab, setActiveTab] = useState('overview');
    const stats = useDashboardStats();
    const reducedMotion = useReducedMotion();
    const { t } = useLanguage();

    return (
        <div className="mb-8">
            {/* Glass pill tab bar with sliding indicator */}
            <div
                data-tour="progress"
                role="tablist"
                aria-label={t('dashboard.tab.aria')}
                className="inline-flex items-center gap-1 p-1 mb-6 rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-card)]/80 backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
            >
                {TABS.map(({ key, labelKey, icon: Icon }) => {
                    const isActive = activeTab === key;
                    return (
                        <button
                            key={key}
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => setActiveTab(key)}
                            className={`relative px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#0055A4]/50 ${
                                isActive ? 'text-white' : 'text-[var(--dash-text-muted)] hover:text-[var(--dash-text)]'
                            }`}
                        >
                            {isActive && (
                                <motion.span
                                    layoutId="dash-tab-pill"
                                    transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#0055A4] to-[#1B6ED6] shadow-[0_4px_14px_rgba(0,85,164,0.35)]"
                                    aria-hidden
                                />
                            )}
                            <span className="relative z-10 inline-flex items-center gap-1.5">
                                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                {t(labelKey)}
                            </span>
                        </button>
                    );
                })}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={reducedMotion ? false : { opacity: 0, y: 10, filter: 'blur(2px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={reducedMotion ? undefined : { opacity: 0, y: -8, filter: 'blur(2px)' }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                    {activeTab === 'overview' && children}

                    {activeTab === 'stats' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { label: t('dashboard.tab.stat.success'), value: `${stats.successRate}%`, accent: '#0055A4' },
                                    { label: t('dashboard.tab.stat.streak'), value: stats.streak, accent: '#F59E0B' },
                                    { label: t('dashboard.tab.stat.xp'), value: stats.totalXP, accent: '#8B5CF6' },
                                    { label: t('dashboard.tab.stat.review'), value: stats.wrongQuestionsCount, accent: '#EF4135' },
                                ].map((s, i) => (
                                    <motion.div
                                        key={s.label}
                                        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.06 }}
                                        whileHover={reducedMotion ? undefined : { y: -2, boxShadow: '0 8px 24px -8px rgba(0,85,164,0.15)' }}
                                        className="rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card)] p-4 relative overflow-hidden"
                                    >
                                        <span aria-hidden className="absolute top-0 left-0 h-full w-1 rounded-r" style={{ backgroundColor: s.accent, opacity: 0.85 }} />
                                        <p className="text-xs text-[var(--dash-text-muted)] pl-2">{s.label}</p>
                                        <p className="text-2xl font-bold text-[var(--dash-text)] mt-1 pl-2 tabular-nums">{s.value}</p>
                                    </motion.div>
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
                            <div className="text-center py-16 text-[var(--dash-text-muted)] rounded-2xl border border-dashed border-[var(--dash-card-border)] bg-[var(--dash-card)]/50">
                                <History className="h-8 w-8 mx-auto mb-3 opacity-40" />
                                <p className="text-lg font-semibold mb-1">{t('dashboard.tab.history.empty.title')}</p>
                                <p className="text-sm">{t('dashboard.tab.history.empty.desc')}</p>
                            </div>
                        )
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
