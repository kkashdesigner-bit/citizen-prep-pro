import { useState } from 'react';
import { motion } from 'framer-motion';

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

    return (
        <div className="mb-8">
            {/* Tab Buttons */}
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

            {/* Tab Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
            >
                {activeTab === 'overview' && children}
                {activeTab === 'stats' && (
                    <div className="text-center py-16 text-[var(--dash-text-muted)]">
                        <p className="text-lg font-semibold mb-1">Statistiques détaillées</p>
                        <p className="text-sm">Bientôt disponible</p>
                    </div>
                )}
                {activeTab === 'history' && (
                    <div className="text-center py-16 text-[var(--dash-text-muted)]">
                        <p className="text-lg font-semibold mb-1">Historique des examens</p>
                        <p className="text-sm">Bientôt disponible</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
