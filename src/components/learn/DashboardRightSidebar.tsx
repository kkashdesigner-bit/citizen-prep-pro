import { motion } from 'framer-motion';
import { CheckCircle, Lock, ArrowRight, Globe, Sparkles, Zap, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RecentActivityLog from './RecentActivityLog';
import FlashQuizCard from '@/components/flash-quiz/FlashQuizCard';
import type { ActivityItem, LeaderboardEntry } from '@/hooks/useDashboardStats';
import { useLanguage } from '@/contexts/LanguageContext';

interface LearningJourneyProps {
    tier: 'free' | 'standard' | 'premium';
    onUpgrade: () => void;
    recentActivity: ActivityItem[];
    totalXP: number;
    leaderboard: LeaderboardEntry[];
    currentUserRank: number;
    currentUserElo: number;
}

const STAGES = [
    { key: 'fundamentals', labelKey: 'theme.valeurs.label', descKey: 'cat.Principles.desc', status: 'completed' as const },
    { key: 'institutions', labelKey: 'theme.institutions.label', descKey: 'cat.Institutions.desc', status: 'completed' as const },
    { key: 'rights', labelKey: 'theme.droits.label', descKey: 'cat.Rights.desc', status: 'current' as const },
    { key: 'history', labelKey: 'theme.histoire.label', descKey: 'cat.History.desc', status: 'locked' as const },
    { key: 'society', labelKey: 'theme.societe.label', descKey: 'cat.Living.desc', status: 'locked' as const },
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
            <div className="relative h-8 w-8 rounded-full bg-[#0055A4] flex items-center justify-center shadow-[0_0_12px_rgba(0,85,164,0.3)]">
                <Sparkles className="h-4 w-4 text-white" />
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[#0055A4]/40"
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

export default function DashboardRightSidebar({ 
    tier, 
    onUpgrade, 
    recentActivity, 
    totalXP,
    leaderboard,
    currentUserRank,
    currentUserElo
}: LearningJourneyProps) {
    const { t, language } = useLanguage();
    const formattedXP = language === 'ar' ? totalXP.toLocaleString('ar-EG') : totalXP.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US');

    return (
        <motion.aside
            initial="hidden" animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }}
            className="w-full xl:w-[340px] flex-shrink-0 flex flex-col gap-6"
        >
            {/* ── XP Score Card ── */}
            <motion.div
                variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
                className="bg-gradient-to-br from-[#0055A4] to-[#3B82F6] rounded-2xl p-5 shadow-md text-white"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-1">{t('dashboard.right.totalScore')}</p>
                        <p className="text-3xl font-black text-white">{formattedXP} <span className="text-lg font-bold text-white/80">XP</span></p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-white/15 flex items-center justify-center">
                        <Zap className="h-6 w-6 text-amber-300" />
                    </div>
                </div>
            </motion.div>

            {/* ── Flash Quiz Card ── */}
            <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}>
              <FlashQuizCard />
            </motion.div>

            {/* ── Leaderboard Card ── */}
            <motion.div
                variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
                className="bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] relative overflow-hidden"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[var(--dash-text)] text-sm flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-amber-500 fill-amber-500/20 animate-bounce" />
                        {t('dashboard.right.eloLeaderboard')}
                    </h3>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Top 5
                    </span>
                </div>

                <div className="space-y-3">
                    {leaderboard.map((entry) => {
                        const rankColors: Record<number, string> = {
                            1: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
                            2: 'bg-slate-300/20 text-slate-500 dark:text-slate-400 border-slate-300/30',
                            3: 'bg-amber-600/10 text-amber-700 dark:text-amber-500 border-amber-600/20',
                        };
                        const defaultRankColor = 'bg-[var(--dash-surface)] text-[var(--dash-text-muted)] border-[var(--dash-card-border)]';
                        const badgeStyle = rankColors[entry.rank] || defaultRankColor;

                        return (
                            <div 
                                key={entry.id} 
                                className={`flex items-center justify-between p-2 rounded-xl border transition-all ${entry.isCurrentUser ? 'bg-blue-500/5 border-blue-500/30 shadow-sm' : 'border-transparent'}`}
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className={`h-6 w-6 rounded-lg border text-xs font-bold flex items-center justify-center shrink-0 ${badgeStyle}`}>
                                        {entry.rank}
                                    </div>
                                    
                                    <div className="h-7 w-7 rounded-full overflow-hidden bg-blue-50 dark:bg-blue-950 border border-[var(--dash-card-border)] shrink-0 flex items-center justify-center font-bold text-xs text-blue-600 dark:text-blue-300">
                                        {entry.avatarUrl ? (
                                            <img src={entry.avatarUrl} alt={entry.displayName} className="h-full w-full object-cover" />
                                        ) : (
                                            entry.displayName.charAt(0).toUpperCase()
                                        )}
                                    </div>

                                    <span className={`text-xs font-semibold truncate ${entry.isCurrentUser ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-[var(--dash-text)]'}`}>
                                        {entry.displayName} {entry.isCurrentUser && ` (${t('dashboard.right.you')})`}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <span className="text-xs font-bold text-[var(--dash-text)]">{entry.eloRating}</span>
                                    <span className="text-[9px] font-bold text-[var(--dash-text-muted)]">ELO</span>
                                </div>
                            </div>
                        );
                    })}

                    {!leaderboard.some(e => e.isCurrentUser) && (
                        <>
                            <div className="border-t border-dashed border-[var(--dash-card-border)] my-2" />
                            <div className="flex items-center justify-between p-2 rounded-xl border bg-blue-500/5 border-blue-500/30 shadow-sm">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="h-6 w-6 rounded-lg border text-xs font-bold flex items-center justify-center shrink-0 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                                        {currentUserRank}
                                    </div>

                                    <div className="h-7 w-7 rounded-full overflow-hidden bg-blue-50 dark:bg-blue-950 border border-[var(--dash-card-border)] shrink-0 flex items-center justify-center font-bold text-xs text-blue-600 dark:text-blue-300">
                                        <span>{t('dashboard.right.you').charAt(0).toUpperCase()}</span>
                                    </div>

                                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 truncate">
                                        {t('dashboard.right.you')}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <span className="text-xs font-bold text-[var(--dash-text)]">{currentUserElo}</span>
                                    <span className="text-[9px] font-bold text-[var(--dash-text-muted)]">ELO</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>

            {/* ── Learning Journey Timeline ── */}
            <motion.div
                variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
                className="bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
            >
                <h3 className="font-bold text-[var(--dash-text)] mb-5 text-sm">{t('dashboard.right.yourJourney')}</h3>
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
                                        {t(stage.labelKey)}
                                    </p>
                                    <p className={`text-xs font-medium ${stage.status === 'locked' ? 'text-[var(--dash-text-muted)] opacity-50' : 'text-[var(--dash-text-muted)]'}`}>
                                        {t(stage.descKey)}
                                    </p>
                                    {stage.status === 'current' && (
                                        <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-widest text-[#0055A4] bg-blue-500/10 px-2 py-0.5 rounded-full">
                                            {t('dashboard.right.inProgress')}
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
                        <h3 className="font-bold text-base">{t('dashboard.right.upgradeTitle')}</h3>
                    </div>
                    <p className="text-sm text-white/80 mb-5 font-medium leading-relaxed relative z-10">
                        {t('dashboard.right.upgradeDesc')}
                    </p>
                    <Button
                        onClick={onUpgrade}
                        className="w-full bg-white text-[#0055A4] hover:bg-white/90 font-bold border-0 shadow-sm rounded-xl py-5 relative z-10"
                    >
                        {t('dashboard.right.upgradeBtn')}
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </motion.div>
            )}
        </motion.aside>
    );
}
