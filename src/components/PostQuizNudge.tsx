import { useEffect, useState } from 'react';
import { X, Flame, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PostQuizNudgeProps {
    scorePercent: number;
    onUpgrade: () => void;
    onDismiss: () => void;
}

export default function PostQuizNudge({ scorePercent, onUpgrade, onDismiss }: PostQuizNudgeProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 60);
        return () => clearTimeout(t);
    }, []);

    return (
        <>
            <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                onClick={onDismiss}
                aria-hidden="true"
            />
            <div
                className={`fixed inset-x-4 bottom-6 z-50 max-w-sm mx-auto transition-all duration-500 ease-out ${
                    visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                role="dialog"
                aria-modal="true"
                aria-label="Offre spéciale"
            >
                <div className="relative bg-gradient-to-br from-[#0f172a] to-[#135bec] rounded-3xl p-6 shadow-[0_24px_60px_rgba(19,91,236,.45)] overflow-hidden">
                    <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

                    <button
                        onClick={onDismiss}
                        className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors p-1 rounded-full hover:bg-white/10"
                        aria-label="Fermer"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="relative">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-[58px] h-[58px] rounded-2xl bg-white/10 flex items-center justify-center flex-none border border-white/10">
                                <span className="text-[22px] font-black text-white leading-none">{scorePercent}%</span>
                            </div>
                            <div>
                                <div className="text-white font-black text-[17px] leading-tight">
                                    Vous progressez vite !
                                </div>
                                <div className="text-white/60 text-[13px] mt-0.5 flex items-center gap-1.5">
                                    <Flame className="h-3.5 w-3.5 text-orange-400 fill-orange-400 flex-none" />
                                    Continuez sur cette lancée
                                </div>
                            </div>
                        </div>

                        <p className="text-white/75 text-[13.5px] leading-relaxed mb-4">
                            Passez au <strong className="text-white font-bold">Standard</strong> pour des examens
                            illimités, le Mode Étude complet et votre Parcours personnalisé — et soyez prêt·e
                            avant votre vraie date d'examen.
                        </p>

                        <div className="flex items-center gap-2 bg-white/8 rounded-xl px-3 py-2.5 mb-5 border border-white/10">
                            <span className="text-green-400 text-sm font-black flex-none">✓</span>
                            <span className="text-white/65 text-[12px] font-medium">
                                Remboursé sous 7 jours · Sans engagement
                            </span>
                        </div>

                        <Button
                            onClick={onUpgrade}
                            className="w-full bg-white text-[#135bec] hover:bg-white/92 font-black rounded-xl h-12 text-[15px] shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] gap-2"
                        >
                            Commencer maintenant
                            <ArrowRight className="h-4 w-4" />
                        </Button>

                        <button
                            onClick={onDismiss}
                            className="w-full text-center text-white/35 hover:text-white/60 text-xs mt-3 py-1 transition-colors"
                        >
                            Pas maintenant
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
