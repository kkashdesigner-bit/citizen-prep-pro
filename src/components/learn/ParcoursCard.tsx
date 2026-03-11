import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lock, Sparkles, Play, CheckCircle2, MapPin } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useParcours } from '@/hooks/useParcours';
import { motion } from 'framer-motion';

export default function ParcoursCard() {
    const navigate = useNavigate();
    const { tier } = useSubscription();
    const { classes, progress, loading } = useParcours();

    const isFree = tier === 'free';
    const totalClasses = classes.length || 100;
    const completedCount = Object.values(progress).filter(p => p.status === 'completed').length;
    const progressPercent = totalClasses > 0 ? Math.round((completedCount / totalClasses) * 100) : 0;

    const nextClass = classes.find(c => progress[c.id]?.status !== 'completed');
    const nextClassNumber = nextClass?.class_number || 1;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className="mb-6 group bg-[var(--dash-card)] rounded-2xl border-2 border-[#0055A4]/10 p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,85,164,0.08)] transition-all duration-300 relative overflow-hidden"
        >
            {/* Desktop background illustration */}
            <div className="absolute inset-y-0 right-0 w-[55%] hidden md:block pointer-events-none overflow-hidden rounded-r-2xl">
                <img
                    src="/parcour-GOCIVIQUE-1-TO-100-DESKTOP.jpg"
                    alt=""
                    className="h-full w-full object-cover object-left"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent" />
            </div>

            {/* Mobile background illustration */}
            <div className="absolute top-0 right-0 w-28 h-28 md:hidden pointer-events-none overflow-hidden rounded-tr-2xl">
                <img
                    src="/parcour-GOCIVIQUE-1-TO-100-MOBILE.jpg"
                    alt=""
                    className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent" />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-lg bg-[#0055A4] flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-[var(--dash-text)] tracking-tight">Parcours Citoyen</h2>
                        {isFree && (
                            <span className="ml-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                                <Lock className="w-3 h-3" /> 3 Classes
                            </span>
                        )}
                    </div>

                    <p className="text-[var(--dash-text-muted)] font-medium mb-4 max-w-lg text-sm">
                        {isFree
                            ? "Découvrez la méthode étape par étape. Essayez les 3 premières classes gratuitement !"
                            : "Avancez étape par étape avec des leçons courtes et des quiz de 5 questions."}
                    </p>

                    {!isFree && (
                        <div className="mb-1 max-w-md">
                            <div className="flex justify-between text-xs font-bold text-[var(--dash-text)] mb-1.5">
                                <span>Classe {nextClassNumber} / {totalClasses}</span>
                                <span className="text-[#0055A4]">{progressPercent}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 border border-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-[#0055A4] to-[#3B82F6] rounded-full"
                                />
                            </div>
                            {nextClass && (
                                <p className="text-[10px] font-bold text-[var(--dash-text-muted)] mt-2 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-[#0055A4]" />
                                    Prochaine : {nextClass.title}
                                </p>
                            )}
                        </div>
                    )}

                    {completedCount > 0 && (
                        <div className="flex items-center gap-1.5 mt-2 text-emerald-500">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold">{completedCount} classe{completedCount > 1 ? 's' : ''} complétée{completedCount > 1 ? 's' : ''}</span>
                        </div>
                    )}
                </div>

                <div className="flex-shrink-0">
                    <Button
                        onClick={() => navigate('/parcours')}
                        className="w-full sm:w-auto bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold rounded-xl h-12 px-6 shadow-[0_4px_12px_rgba(0,85,164,0.2)] hover:shadow-[0_6px_16px_rgba(0,85,164,0.3)] hover:-translate-y-0.5 transition-all"
                    >
                        {isFree ? "Découvrir le parcours" : loading ? "Chargement..." : completedCount > 0 ? "Continuer" : "Commencer"}
                        {isFree ? <ArrowRight className="w-4 h-4 ml-2" /> : <Play className="w-4 h-4 ml-2 fill-current" />}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
