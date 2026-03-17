import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile, GOAL_LABELS } from '@/hooks/useUserProfile';
import { useSubscription } from '@/hooks/useSubscription';
import { useParcours } from '@/hooks/useParcours';
import LearnSidebar from '@/components/learn/LearnSidebar';
import SubscriptionGate from '@/components/SubscriptionGate';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Route, Lock, CheckCircle2, Play, Trophy,
    Sparkles, Clock, BookOpen, ChevronRight, Star, ShieldCheck
} from 'lucide-react';

/* ─────────────── Module groupings ─────────────── */
const MODULES = [
    { number: 1,  label: 'Module 1 : Les Valeurs Fondamentales de la République', range: [1,  10], icon: '⚖️', color: '#0055A4' },
    { number: 2,  label: 'Module 2 : Les Symboles et Principes Républicains',      range: [11, 20], icon: '🇫🇷', color: '#1B6ED6' },
    { number: 3,  label: 'Module 3 : Le Pouvoir Exécutif',                         range: [21, 30], icon: '🏛️', color: '#7C3AED' },
    { number: 4,  label: 'Module 4 : Le Pouvoir Législatif et Judiciaire',         range: [31, 40], icon: '⚖️', color: '#6D28D9' },
    { number: 5,  label: 'Module 5 : Les Droits Fondamentaux',                     range: [41, 50], icon: '🛡️', color: '#0891B2' },
    { number: 6,  label: 'Module 6 : Les Devoirs et la Citoyenneté',               range: [51, 60], icon: '🤝', color: '#059669' },
    { number: 7,  label: 'Module 7 : L\'Histoire de France',                       range: [61, 70], icon: '📜', color: '#D97706' },
    { number: 8,  label: 'Module 8 : La Géographie et la Culture Française',       range: [71, 80], icon: '🗺️', color: '#B45309' },
    { number: 9,  label: 'Module 9 : Économie, Travail et Protection Sociale',     range: [81, 90], icon: '💼', color: '#DC2626' },
    { number: 10, label: 'Module 10 : Vie Quotidienne et Intégration',             range: [91, 100], icon: '🏠', color: '#EF4135' },
];

/* ─────────────── Mastery helpers ─────────────── */
function getMasteryInfo(score: number): { label: string; color: string; textColor: string; icon: typeof Star } {
    if (score >= 86) return { label: 'Maîtrisé', color: 'bg-amber-400/15', textColor: 'text-amber-500', icon: Trophy };
    if (score >= 70) return { label: 'En cours d\'acquisition', color: 'bg-emerald-500/10', textColor: 'text-emerald-500', icon: ShieldCheck };
    return { label: 'Non acquis', color: 'bg-red-500/10', textColor: 'text-red-500', icon: Star };
}

export default function ParcoursPage() {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { profile, loading: profileLoading } = useUserProfile();
    const { tier, loading: tierLoading } = useSubscription();
    const { classes, progress, loading: parcoursLoading } = useParcours();

    const [showGate, setShowGate] = useState(false);
    const [gateTier, setGateTier] = useState<'standard' | 'premium'>('standard');
    const nextClassRef = useRef<HTMLDivElement | null>(null);

    const isLoading = authLoading || profileLoading || tierLoading || parcoursLoading;

    // Computations
    const completedCount = useMemo(
        () => Object.values(progress).filter(p => p.status === 'completed').length,
        [progress]
    );
    const totalClasses = classes.length || 100;
    const progressPercent = totalClasses > 0 ? Math.round((completedCount / totalClasses) * 100) : 0;

    const nextClass = useMemo(
        () => classes.find(c => progress[c.id]?.status !== 'completed') || classes[0],
        [classes, progress]
    );

    /* ─── Unlock logic (dynamic state derivation) ─── */
    const isUnlocked = (clazz: any) => {
        // Premium: can jump anywhere
        if (tier === 'premium') return true;

        // Free: only Classes 1–10 are accessible (sequentially)
        if (tier === 'free') {
            if (clazz.class_number > 10) return false;
        }

        // Sequential: Class 1 always open, others need previous class completed WITH passing score
        if (clazz.class_number === 1) return true;
        const prevClass = classes.find(c => c.class_number === clazz.class_number - 1);
        if (!prevClass) return false;
        const prevProgress = progress[prevClass.id];
        // Must be completed AND have a passing score (>= 60%)
        return prevProgress?.status === 'completed' && (prevProgress?.score ?? 0) >= 60;
    };

    const handleClassClick = (clazz: any) => {
        if (isUnlocked(clazz)) {
            navigate(`/parcours/classe/${clazz.id}`);
        } else {
            // Free user hitting the wall at class 4 or above
            setGateTier(tier === 'free' ? 'standard' : 'premium');
            setShowGate(true);
        }
    };

    // Auto-scroll to next class on mount
    useEffect(() => {
        if (!isLoading && nextClassRef.current) {
            setTimeout(() => {
                nextClassRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 600);
        }
    }, [isLoading, nextClass]);

    const personaGoalLabel = profile?.goal_type
        ? GOAL_LABELS[profile.goal_type as keyof typeof GOAL_LABELS]
        : 'Naturalisation';

    if (isLoading) {
        return (
            <div className="flex min-h-screen bg-white">
                <LearnSidebar />
                <div className="flex-1 md:ml-[260px] flex items-center justify-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-white overflow-x-hidden">
            <SEOHead noindex />
            <LearnSidebar />

            <main className="flex-1 md:ml-[260px] pb-24 md:pb-8 flex justify-center overflow-x-hidden">
                <div className="w-full max-w-4xl px-3 sm:px-4 md:px-8 py-6 md:py-8">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        className="mb-6 flex items-center gap-4"
                    >
                        <button
                            onClick={() => navigate('/learn')}
                            className="h-10 w-10 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-[#0055A4] hover:border-[#0055A4]/30 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                                <Route className="w-6 h-6 text-[#0055A4]" />
                                Parcours Citoyen
                            </h1>
                            <p className="text-sm font-medium text-gray-500 mt-0.5">
                                {personaGoalLabel} · <span className="text-[#0055A4] font-bold">{completedCount}/{totalClasses} classes</span>
                            </p>
                        </div>
                    </motion.div>

                    {/* Top Progress Widget */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-r from-[#0055A4] to-[#1B6ED6] rounded-2xl p-6 md:p-8 mb-10 shadow-lg text-white relative overflow-hidden"
                    >
                        {/* Desktop background illustration */}
                        <div className="absolute inset-y-0 right-0 w-[55%] hidden md:block pointer-events-none overflow-hidden rounded-r-2xl">
                            <img
                                src="/examen-civique-parcours-progression-desktop.jpg"
                                alt=""
                                aria-hidden="true"
                                className="h-full w-full object-cover object-left"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0055A4] via-[#0055A4]/60 to-transparent" />
                        </div>
                        {/* Mobile background illustration */}
                        <div className="absolute inset-y-0 right-0 w-[50%] md:hidden pointer-events-none overflow-hidden rounded-r-2xl">
                            <img
                                src="/examen-civique-parcours-progression-mobile.jpg"
                                alt=""
                                aria-hidden="true"
                                className="h-full w-full object-cover object-center"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0055A4] via-[#0055A4]/50 to-transparent" />
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-amber-300" /> Votre Progression
                            </h2>
                            <p className="text-white/70 text-sm mb-4">Avancez pas à pas vers la maîtrise.</p>

                            <div className="mb-2 flex justify-between items-end">
                                <span className="text-4xl font-black">
                                    {progressPercent}<span className="text-lg text-white/60">%</span>
                                </span>
                                {nextClass && (
                                    <span className="text-sm text-white/80 font-bold">
                                        Niveau actuel : Classe {nextClass.class_number}
                                    </span>
                                )}
                            </div>
                            <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                    className="h-full bg-white rounded-full"
                                />
                            </div>

                            {tier === 'premium' && (
                                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-white/10 px-3 py-1 rounded-full">
                                    <Sparkles className="w-3.5 h-3.5" /> Accès libre à toutes les classes
                                </div>
                            )}
                            {tier === 'free' && (
                                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-white/70 bg-white/10 px-3 py-1 rounded-full">
                                    <Lock className="w-3.5 h-3.5" /> Accès gratuit : Classes 1 à 10
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Empty state */}
                    {classes.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Parcours en cours de construction</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">
                                Les classes pour l'objectif "{personaGoalLabel}" sont en cours d'élaboration. Revenez bientôt !
                            </p>
                        </div>
                    )}

                    {/* ─── VERTICAL TIMELINE ─── */}
                    <div className="space-y-12">
                        {MODULES.map((mod, modIdx) => {
                            const moduleClasses = classes.filter(
                                c => c.class_number >= mod.range[0] && c.class_number <= mod.range[1]
                            );
                            if (moduleClasses.length === 0) return null;

                            const modCompleted = moduleClasses.filter(c => progress[c.id]?.status === 'completed').length;
                            const modPercent = moduleClasses.length > 0 ? Math.round((modCompleted / moduleClasses.length) * 100) : 0;

                            return (
                                <motion.div
                                    key={modIdx}
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: modIdx * 0.1 }}
                                >
                                    {/* Module Header */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <div
                                            className="h-11 w-11 rounded-xl flex items-center justify-center text-white text-lg shadow-sm"
                                            style={{ backgroundColor: mod.color }}
                                        >
                                            {mod.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">{mod.label}</h2>
                                            <div className="flex items-center gap-3 mt-1">
                                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-xs">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-700"
                                                        style={{ width: `${modPercent}%`, backgroundColor: mod.color }}
                                                    />
                                                </div>
                                                <span className="text-xs font-bold text-gray-400">
                                                    {modCompleted}/{moduleClasses.length}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Vertical Timeline of Classes */}
                                    <div className="relative ml-3 sm:ml-5 md:ml-[22px] border-l-2 border-gray-100 pl-6 sm:pl-8 md:pl-10 space-y-1">
                                        {moduleClasses.map((clazz, idx) => {
                                            const clazzProgress = progress[clazz.id];
                                            const status = clazzProgress?.status || 'not_started';
                                            const isCompleted = status === 'completed';
                                            const unlocked = isUnlocked(clazz);
                                            const isNext = nextClass?.id === clazz.id;
                                            const score = clazzProgress?.score || 0;
                                            const mastery = isCompleted ? getMasteryInfo(score) : null;

                                            return (
                                                <div
                                                    key={clazz.id}
                                                    ref={isNext ? nextClassRef : undefined}
                                                    className="relative"
                                                >
                                                    {/* Timeline Node (dot on the line) */}
                                                    <div className={`absolute -left-[33px] sm:-left-[41px] md:-left-[49px] top-4 w-4 h-4 rounded-full border-2 z-10 ${isCompleted
                                                        ? 'bg-emerald-500 border-emerald-500'
                                                        : isNext && unlocked
                                                            ? 'bg-[#0055A4] border-[#0055A4] ring-4 ring-[#0055A4]/20 animate-pulse'
                                                            : unlocked
                                                                ? 'bg-white border-[#0055A4]'
                                                                : 'bg-gray-100 border-gray-200'
                                                        }`}>
                                                        {isCompleted && (
                                                            <CheckCircle2 className="w-3 h-3 text-white absolute top-0 left-0" />
                                                        )}
                                                    </div>

                                                    {/* "Vous êtes ici" indicator */}
                                                    {isNext && unlocked && (
                                                        <div className="absolute -left-[90px] sm:-left-[100px] md:-left-[112px] top-3 text-[9px] font-bold text-[#0055A4] uppercase tracking-wider whitespace-nowrap hidden sm:block">
                                                            ← Vous êtes ici
                                                        </div>
                                                    )}

                                                    {/* Class Card */}
                                                    <motion.div
                                                        whileHover={unlocked ? { x: 4 } : {}}
                                                        onClick={() => handleClassClick(clazz)}
                                                        className={`group relative py-3.5 px-5 rounded-xl border transition-all duration-200 mb-2 ${unlocked ? 'cursor-pointer' : 'cursor-not-allowed'
                                                            } ${isCompleted
                                                                ? 'bg-white border-emerald-200 hover:border-emerald-300'
                                                                : isNext && unlocked
                                                                    ? 'bg-[#0055A4]/[0.03] border-[#0055A4]/30 hover:border-[#0055A4]/50 shadow-sm'
                                                                    : unlocked
                                                                        ? 'bg-white border-gray-150 hover:border-[#0055A4]/30 hover:shadow-sm'
                                                                        : 'bg-gray-50/70 border-gray-100 opacity-60'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            {/* Class Number */}
                                                            <span className={`text-lg font-black font-mono w-8 text-center flex-shrink-0 ${isCompleted
                                                                ? 'text-emerald-500'
                                                                : isNext && unlocked
                                                                    ? 'text-[#0055A4]'
                                                                    : unlocked
                                                                        ? 'text-gray-800'
                                                                        : 'text-gray-300'
                                                                }`}>
                                                                {clazz.class_number}
                                                            </span>

                                                            {/* Title & Meta */}
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className={`font-semibold text-sm leading-tight truncate ${!unlocked ? 'text-gray-400' : 'text-gray-900'
                                                                    }`}>
                                                                    {clazz.title}
                                                                </h3>
                                                                <div className="flex items-center gap-3 mt-0.5">
                                                                    {unlocked && (
                                                                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                                                            <Clock className="w-3 h-3" /> {clazz.estimated_minutes} min
                                                                        </span>
                                                                    )}
                                                                    {/* Mastery tag */}
                                                                    {mastery && (
                                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${mastery.color} ${mastery.textColor}`}>
                                                                            {score}% · {mastery.label}
                                                                        </span>
                                                                    )}
                                                                    {/* Failed tag — attempted but didn't pass */}
                                                                    {!isCompleted && status !== 'not_started' && (clazzProgress?.score ?? 0) < 60 && (clazzProgress?.score ?? 0) > 0 && (
                                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-500">
                                                                            {clazzProgress?.score}% · Non réussi — Réessayez
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Right Side: Status */}
                                                            <div className="flex-shrink-0">
                                                                {isCompleted ? (
                                                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                                                ) : isNext && unlocked ? (
                                                                    <Button
                                                                        size="sm"
                                                                        className="bg-[#0055A4] hover:bg-[#1B6ED6] text-white text-xs font-bold rounded-lg h-8 px-4 shadow-sm"
                                                                        onClick={(e) => { e.stopPropagation(); handleClassClick(clazz); }}
                                                                    >
                                                                        Commencer <Play className="w-3 h-3 ml-1 fill-current" />
                                                                    </Button>
                                                                ) : !unlocked ? (
                                                                    <Lock className="w-4 h-4 text-gray-300" />
                                                                ) : status === 'in_progress' ? (
                                                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0055A4]/10 text-[#0055A4] px-2.5 py-1 rounded-full">
                                                                        En cours
                                                                    </span>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                </div>
            </main >

            <SubscriptionGate open={showGate} onOpenChange={setShowGate} requiredTier={gateTier} featureLabel="90 niveaux supplémentaires, 1 500+ questions, examens blancs, entraînement par catégories et suivi de progression" />
        </div >
    );
}
