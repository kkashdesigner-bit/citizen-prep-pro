import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useClassDetail } from '@/hooks/useClassDetail';
import { useParcours } from '@/hooks/useParcours';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
    ArrowLeft, BookOpen, BrainCircuit, ChevronRight, XCircle, Lock, Trophy
} from 'lucide-react';
import SubscriptionGate from '@/components/SubscriptionGate';

export default function ClassDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { tier, loading: tierLoading } = useSubscription();

    const { data: classData, loading: detailLoading, error } = useClassDetail(id);
    const { classes, progress } = useParcours();

    const [showGate, setShowGate] = useState(false);
    const [gateTier, setGateTier] = useState<'standard' | 'premium'>('standard');
    const [gateLabel, setGateLabel] = useState('');

    // ── Tier enforcement: free users blocked from class 4+ ──
    useEffect(() => {
        if (tierLoading || !classData) return;

        if (tier === 'free' && classData.class_number > 3) {
            setGateLabel(`Classe ${classData.class_number} — ${classData.title}`);
            setGateTier('standard');
            setShowGate(true);
        }

        // Sequential lock for non-premium: check previous class
        if (tier !== 'premium' && classData.class_number > 1) {
            const prevClass = classes.find(c => c.class_number === classData.class_number - 1);
            if (prevClass && progress[prevClass.id]?.status !== 'completed') {
                setGateLabel(`Classe ${classData.class_number} — Terminez d'abord la classe précédente`);
                setGateTier(tier === 'free' ? 'standard' : 'standard');
                setShowGate(true);
            }
        }
    }, [tierLoading, tier, classData, classes, progress]);

    const renderInline = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index} className="font-bold text-[#0055A4]">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    const renderMarkdown = (md: string) => {
        return md.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('# '))
                return <h2 key={idx} className="text-2xl font-black text-gray-900 mb-4 mt-8 pb-3 border-b border-gray-100 tracking-tight">{renderInline(paragraph.slice(2))}</h2>;
            if (paragraph.startsWith('## '))
                return (
                    <h3 key={idx} className="text-lg font-bold text-gray-800 mb-4 mt-8 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0055A4]" />
                        {renderInline(paragraph.slice(3))}
                    </h3>
                );
            if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').filter(l => l.startsWith('- '));
                return (
                    <div key={idx} className="bg-[#F8FAFC] rounded-2xl p-5 mb-6 border border-gray-100">
                        <ul className="list-none space-y-3 m-0 p-0">
                            {items.map((item, i) => (
                                <li key={i} className="text-gray-700 leading-relaxed text-[15px] flex items-start gap-3">
                                    <div className="mt-2 w-1.5 h-1.5 shrink-0 rounded-full bg-blue-300" />
                                    <span>{renderInline(item.slice(2))}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            }
            return <p key={idx} className="mb-6 text-gray-700 text-[15px] leading-relaxed break-words">{renderInline(paragraph)}</p>;
        });
    };

    if (detailLoading || tierLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
            </div>
        );
    }

    if (error || !classData) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-white gap-4">
                <XCircle className="w-12 h-12 text-red-400" />
                <h2 className="text-xl font-bold text-gray-900">Classe introuvable</h2>
                <Button onClick={() => navigate('/parcours')} variant="outline">Retour au parcours</Button>
            </div>
        );
    }

    const totalQuestions = classData.questions.length;
    const isRecapQuiz = classData.class_number % 10 === 0;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* ─── Sticky Header ─── */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-100 h-14 flex items-center px-4 shadow-sm">
                <button
                    onClick={() => navigate('/parcours')}
                    className="p-2 mr-2 text-gray-400 hover:text-[#0055A4] transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-[#0055A4] uppercase tracking-widest">
                        Classe {classData.class_number.toString().padStart(2, '0')} / 100
                    </p>
                    <h1 className="text-sm font-bold text-gray-900 truncate">{classData.title}</h1>
                </div>

                {/* Top Progress */}
                <div className="hidden md:flex items-center gap-3 ml-4">
                    <div className="h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#0055A4] rounded-full transition-all"
                            style={{ width: `${(classData.class_number / 100) * 100}%` }}
                        />
                    </div>
                    <span className="text-xs text-gray-400 font-bold">{classData.class_number}%</span>
                </div>
            </header>

            {/* ─── Main Content ─── */}
            <div className="flex-1 w-full max-w-3xl mx-auto px-4 md:px-8 py-6 pb-32 md:pb-8">
                {isRecapQuiz ? (
                    /* ── Quiz Récapitulatif UI ── */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-[#0055A4] to-[#1B6ED6] rounded-2xl p-8 md:p-12 text-white text-center shadow-lg"
                    >
                        <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-white/15 flex items-center justify-center">
                            <Trophy className="w-10 h-10 text-amber-300" />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Quiz Récapitulatif</p>
                        <h2 className="text-2xl md:text-3xl font-black mb-3">{classData.title}</h2>
                        <p className="text-white/75 text-sm mb-8 max-w-md mx-auto leading-relaxed">
                            Testez vos connaissances sur l'ensemble du module avec 20 questions aléatoires.
                            Obtenez au moins 80% pour valider le module.
                        </p>
                        <Button
                            onClick={() => navigate(`/quiz?mode=exam&classId=${id}&limit=20`)}
                            size="lg"
                            className="bg-white text-[#0055A4] hover:bg-white/90 font-bold rounded-xl shadow-sm px-8"
                        >
                            <Trophy className="w-5 h-5 mr-2 text-amber-500" />
                            Lancer le Quiz Récapitulatif
                            <ChevronRight className="w-5 h-5 ml-1" />
                        </Button>
                    </motion.div>
                ) : (
                    /* ── Regular Lesson UI ── */
                    <motion.div
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-2xl p-6 md:p-10 border border-gray-100 shadow-sm"
                    >
                        <div className="flex items-center gap-2 mb-6 text-[#0055A4]">
                            <BookOpen className="w-5 h-5" />
                            <span className="text-sm font-bold uppercase tracking-widest">Leçon</span>
                        </div>
                        <div className="max-w-none prose-sm overflow-hidden break-words">{renderMarkdown(classData.content_markdown)}</div>

                        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
                            <Button
                                onClick={() => navigate(`/quiz?mode=training&classId=${id}`)}
                                size="lg"
                                className="bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold rounded-xl shadow-sm"
                            >
                                <BrainCircuit className="w-5 h-5 mr-2" />
                                Passer au Quiz ({totalQuestions} questions)
                                <ChevronRight className="w-5 h-5 ml-1" />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>

            <SubscriptionGate
                open={showGate}
                onOpenChange={(open) => {
                    setShowGate(open);
                    if (!open) navigate('/parcours');
                }}
                requiredTier={gateTier}
                featureLabel={gateLabel}
            />
        </div>
    );
}

