import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile, GOAL_LABELS } from '@/hooks/useUserProfile';
import { useSubscription } from '@/hooks/useSubscription';
import { useParcours } from '@/hooks/useParcours';
import LearnSidebar from '@/components/learn/LearnSidebar';
import SubscriptionGate from '@/components/SubscriptionGate';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Route, Lock, CheckCircle2, Play, Trophy, Sparkles } from 'lucide-react';

export default function ParcoursPage() {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { profile, loading: profileLoading } = useUserProfile();
    const { tier, loading: tierLoading } = useSubscription();
    const { classes, progress, loading: parcoursLoading } = useParcours();

    const [showGate, setShowGate] = useState(false);
    const [gateTier, setGateTier] = useState<'standard' | 'premium'>('standard');

    if (authLoading || profileLoading || tierLoading || parcoursLoading) {
        return (
            <div className="flex min-h-screen bg-[#F8FAFC]">
                <LearnSidebar />
                <div className="flex-1 md:ml-[260px] flex items-center justify-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
                </div>
            </div>
        );
    }

    const personaGoalLabel = profile?.goal_type ? GOAL_LABELS[profile.goal_type as keyof typeof GOAL_LABELS] : 'Naturalisation';
    const totalClasses = classes.length || 100;

    // Calculate completed classes
    const completedCount = Object.values(progress).filter(p => p.status === 'completed').length;
    const progressPercent = totalClasses > 0 ? Math.round((completedCount / totalClasses) * 100) : 0;

    // Determine next recommended class (first non-completed class)
    const nextClass = classes.find(c => progress[c.id]?.status !== 'completed') || classes[0];

    const handleClassClick = (clazz: any) => {
        // Determine if unlocked
        const isFree = tier === 'free';
        const isStandard = tier === 'standard';

        let isUnlocked = false;

        if (tier === 'premium') {
            isUnlocked = true; // Premium: Jump anywhere
        } else if (isFree) {
            isUnlocked = clazz.class_number === 1; // Free: Only class 1
        } else if (isStandard) {
            // Standard: Sequential unlocking. Unlocked if it's class 1, or if previous class is completed.
            if (clazz.class_number === 1) {
                isUnlocked = true;
            } else {
                const prevClass = classes.find(c => c.class_number === clazz.class_number - 1);
                if (prevClass && progress[prevClass.id]?.status === 'completed') {
                    isUnlocked = true;
                }
            }
        }

        if (isUnlocked) {
            navigate(`/parcours/classe/${clazz.id}`);
        } else {
            // Show Paywall
            const targetTier = isFree ? 'standard' : 'premium';
            setGateTier(targetTier);
            setShowGate(true);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <LearnSidebar />

            <main className="flex-1 md:ml-[260px] pb-24 md:pb-8 flex justify-center">
                <div className="w-full max-w-5xl px-4 md:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Header & Back Button */}
                    <div className="mb-8 flex items-center gap-4">
                        <button
                            onClick={() => navigate('/learn')}
                            className="h-10 w-10 bg-white border border-[#E6EAF0] rounded-full flex items-center justify-center text-[#1A1A1A]/60 hover:text-[#0055A4] hover:border-[#0055A4]/30 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] flex items-center gap-2">
                                <Route className="w-6 h-6 text-[#0055A4]" />
                                Parcours 1→100
                            </h1>
                            <p className="text-sm font-medium text-[#1A1A1A]/60 mt-1">
                                La méthode progressive pour: <span className="text-[#0055A4] font-bold">{personaGoalLabel}</span>
                            </p>
                        </div>
                    </div>

                    {/* Top Progress Widget */}
                    <div className="bg-white rounded-3xl border border-[#E6EAF0] p-6 md:p-8 mb-10 shadow-sm flex flex-col md:flex-row gap-8 justify-between relative overflow-hidden">
                        {/* Background design */}
                        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-[#0055A4]/5 to-transparent rounded-bl-full pointer-events-none" />

                        <div className="flex-1 relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-12 w-12 rounded-2xl bg-[#0055A4]/10 flex items-center justify-center">
                                    <Trophy className="w-6 h-6 text-[#0055A4]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[#1A1A1A]">Votre Progression Globale</h2>
                                    <p className="text-sm text-[#1A1A1A]/60">Avancez pas à pas vers la maîtrise.</p>
                                </div>
                            </div>

                            <div className="mb-2 flex justify-between items-end">
                                <span className="text-3xl font-black text-[#1A1A1A]">{completedCount} <span className="text-base text-[#1A1A1A]/40 font-bold">/ {totalClasses} classes</span></span>
                                <span className="text-[#0055A4] font-bold">{progressPercent}%</span>
                            </div>
                            <div className="h-3 w-full bg-[#F5F7FA] rounded-full overflow-hidden mb-1">
                                <div
                                    className="h-full bg-gradient-to-r from-[#0055A4] to-[#1B6ED6] rounded-full transition-all duration-1000 relative"
                                    style={{ width: `${progressPercent}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" />
                                </div>
                            </div>
                        </div>

                        {/* Next Recommended Class Snippet */}
                        {nextClass && (
                            <div className="md:w-72 bg-[#F8FAFC] rounded-2xl p-5 border border-[#E6EAF0] flex flex-col justify-between relative z-10">
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#0055A4] mb-2 flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> Prochaine étape
                                    </div>
                                    <h3 className="font-bold text-[#1A1A1A] mb-1 line-clamp-1">Classe {nextClass.class_number}: {nextClass.title}</h3>
                                    <p className="text-xs text-[#1A1A1A]/60 mb-4 line-clamp-2">{nextClass.description || "Continuez l'apprentissage."}</p>
                                </div>
                                <Button
                                    onClick={() => handleClassClick(nextClass)}
                                    className="w-full bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold rounded-xl h-10 shadow-sm"
                                >
                                    Commencer <Play className="w-4 h-4 ml-2 fill-current" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Fallback if no classes */}
                    {classes.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-[#E6EAF0]">
                            <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">Parcours en cours de construction</h3>
                            <p className="text-[#1A1A1A]/60 max-w-sm mx-auto">
                                Les classes pour l'objectif "{personaGoalLabel}" sont en cours d'élaboration. Revenez bientôt !
                            </p>
                        </div>
                    )}

                    {/* Classes Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {classes.map((clazz) => {
                            const clazzProgress = progress[clazz.id];
                            const status = clazzProgress?.status || 'not_started';
                            const isCompleted = status === 'completed';

                            // Determine unlocked state based on Tier exactly like `handleClassClick`
                            let isUnlocked = false;
                            if (tier === 'premium') {
                                isUnlocked = true;
                            } else if (tier === 'free') {
                                isUnlocked = clazz.class_number === 1;
                            } else {
                                if (clazz.class_number === 1) isUnlocked = true;
                                else {
                                    const prevClass = classes.find(c => c.class_number === clazz.class_number - 1);
                                    if (prevClass && progress[prevClass.id]?.status === 'completed') isUnlocked = true;
                                }
                            }

                            // Visual variants
                            const cardBg = isCompleted ? 'bg-[#22C55E]/5 border-[#22C55E]/20' : isUnlocked ? 'bg-white border-[#E6EAF0] hover:border-[#0055A4]/50' : 'bg-[#F8FAFC] border-[#E6EAF0] opacity-80';
                            const numColor = isCompleted ? 'text-[#22C55E]' : isUnlocked ? 'text-[#0055A4]' : 'text-[#1A1A1A]/30';

                            return (
                                <div
                                    key={clazz.id}
                                    onClick={() => handleClassClick(clazz)}
                                    className={`relative p-5 rounded-2xl border transition-all duration-300 ${isUnlocked ? 'cursor-pointer hover:shadow-md hover:-translate-y-1' : 'cursor-not-allowed'} ${cardBg}`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`text-xl font-black font-serif ${numColor}`}>
                                            {clazz.class_number.toString().padStart(2, '0')}
                                        </span>

                                        {isCompleted ? (
                                            <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                                        ) : !isUnlocked ? (
                                            <Lock className="w-4 h-4 text-[#1A1A1A]/30" />
                                        ) : null}
                                    </div>

                                    <h3 className={`font-bold mb-1 leading-tight ${!isUnlocked ? 'text-[#1A1A1A]/50' : 'text-[#1A1A1A]'}`}>
                                        {clazz.title}
                                    </h3>

                                    {isUnlocked && clazz.estimated_minutes && (
                                        <p className="text-xs text-[#1A1A1A]/50 mt-4 flex items-center gap-1">
                                            <Play className="w-3 h-3" /> {clazz.estimated_minutes} min
                                        </p>
                                    )}

                                    {!isUnlocked && (
                                        <div className="absolute inset-0 rounded-2xl backdrop-blur-[1px] bg-white/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <span className="bg-[#1A1A1A] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-2 shadow-lg">
                                                <Lock className="w-3 h-3" /> Débloquer
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                </div>
            </main>

            {/* Reused Subscription Gate for paywall */}
            <SubscriptionGate open={showGate} onOpenChange={setShowGate} requiredTier={gateTier} />
        </div>
    );
}
