import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Route, ArrowRight, Lock, Sparkles } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

interface ParcoursCardProps {
    currentClassNumber?: number;
    totalClasses?: number;
}

export default function ParcoursCard({ currentClassNumber = 1, totalClasses = 100 }: ParcoursCardProps) {
    const navigate = useNavigate();
    const { tier } = useSubscription();

    const isFree = tier === 'free';
    const progressPercent = Math.round(((currentClassNumber - 1) / totalClasses) * 100);

    return (
        <div className="mb-10 group bg-gradient-to-br from-blue-50 to-white rounded-2xl border-[2px] border-[#0055A4]/20 p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 text-[#0055A4]/5 w-48 h-48 rotate-12 pointer-events-none">
                <Route className="w-full h-full" />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Route className="h-5 w-5 text-[#0055A4]" />
                        <h2 className="text-xl font-bold text-[#1A1A1A] tracking-tight">Parcours 1→100</h2>
                        {isFree && (
                            <span className="ml-2 bg-[#F59E0B]/10 text-[#F59E0B] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                                <Lock className="w-3 h-3" /> Partiel
                            </span>
                        )}
                    </div>

                    <p className="text-[#1A1A1A]/70 font-medium mb-4 max-w-lg text-sm">
                        {isFree
                            ? "Découvrez la méthode étape par étape pour réussir votre examen. Essayez la première classe gratuitement !"
                            : "Suivez notre méthode structurée étape par étape pour assimiler l'intégralité du programme officiel sans stress."}
                    </p>

                    {!isFree && (
                        <div className="mb-2 max-w-md">
                            <div className="flex justify-between text-xs font-bold text-[#1A1A1A] mb-1.5 uppercase tracking-wide">
                                <span>Classe {currentClassNumber} / {totalClasses}</span>
                                <span className="text-[#0055A4]">{progressPercent}%</span>
                            </div>
                            <div className="h-2 w-full bg-white border border-[#E6EAF0] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#0055A4] rounded-full transition-all duration-1000"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex-shrink-0">
                    <Button
                        onClick={() => navigate('/parcours')}
                        className="w-full sm:w-auto bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold rounded-xl h-12 px-6 shadow-[0_4px_12px_rgba(0,85,164,0.2)] hover:shadow-[0_6px_16px_rgba(0,85,164,0.3)] hover:-translate-y-0.5 transition-all group-hover:pr-4"
                    >
                        {isFree ? "Découvrir le parcours" : "Continuer ma classe"}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
