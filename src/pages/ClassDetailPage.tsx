import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useClassDetail } from '@/hooks/useClassDetail';
import { useParcours } from '@/hooks/useParcours';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, BookOpen, BrainCircuit, CheckCircle2,
    ChevronRight, ChevronLeft, Languages, RotateCcw, Trophy,
    Loader2, Sparkles, Star, ShieldCheck, XCircle
} from 'lucide-react';
import { getCorrectAnswerText, getQuestionOptions } from '@/lib/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

/* ─── Mastery helpers ─── */
function getMasteryInfo(score: number) {
    if (score >= 86) return { label: 'Maîtrisé', emoji: '🏆', color: 'text-amber-500', bgColor: 'bg-amber-50 border-amber-200' };
    if (score >= 70) return { label: 'En cours d\'acquisition', emoji: '✅', color: 'text-emerald-600', bgColor: 'bg-emerald-50 border-emerald-200' };
    return { label: 'Non acquis', emoji: '🔁', color: 'text-red-500', bgColor: 'bg-red-50 border-red-200' };
}

export default function ClassDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { tier } = useSubscription();

    const { data: classData, loading: detailLoading, error } = useClassDetail(id);
    const { classes, progress, updateProgress } = useParcours();

    const [activeTab, setActiveTab] = useState<'lesson' | 'quiz'>('lesson');
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showTranslation, setShowTranslation] = useState<Record<number, boolean>>({});

    const isPremium = tier === 'premium';

    const renderMarkdown = (md: string) => {
        return md.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('# '))
                return <h2 key={idx} className="text-xl font-bold text-gray-900 mb-3 mt-6">{paragraph.slice(2)}</h2>;
            if (paragraph.startsWith('## '))
                return <h3 key={idx} className="text-lg font-bold text-gray-900 mb-2 mt-5">{paragraph.slice(3)}</h3>;
            if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').filter(l => l.startsWith('- '));
                return (
                    <ul key={idx} className="list-disc pl-6 mb-4 space-y-1.5">
                        {items.map((item, i) => <li key={i} className="text-gray-600 leading-relaxed">{item.slice(2)}</li>)}
                    </ul>
                );
            }
            return <p key={idx} className="mb-4 text-gray-600 leading-relaxed">{paragraph}</p>;
        });
    };

    const calculateScore = () => {
        if (!classData) return { score: 0, total: 0, percent: 0, passed: false };
        const total = classData.questions.length;
        if (total === 0) return { score: 0, total: 0, percent: 100, passed: true };

        let correct = 0;
        classData.questions.forEach(q => {
            if (answers[q.id] === getCorrectAnswerText(q)) correct++;
        });

        const percent = Math.round((correct / total) * 100);
        return { score: correct, total, percent, passed: percent >= 70 };
    };

    const handleSubmit = async () => {
        if (!user || !classData || !id) return;
        setIsUpdating(true);

        const { percent, passed } = calculateScore();
        setIsSubmitted(true);

        try {
            await updateProgress(id, percent, passed);

            if (passed) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 4000);

                // Save used question IDs
                if (classData.questions.length > 0) {
                    const newIds = classData.questions.map(q => String(q.id));
                    const { data: profileData } = await supabase
                        .from('profiles')
                        .select('used_questions')
                        .eq('id', user.id)
                        .maybeSingle();
                    const existing: string[] = (profileData?.used_questions as string[]) || [];
                    const merged = [...new Set([...existing, ...newIds])];
                    await supabase.from('profiles').update({ used_questions: merged }).eq('id', user.id);
                }
            }
        } catch (err) {
            toast.error('Erreur lors de la sauvegarde.');
        } finally {
            setIsUpdating(false);
        }
    };

    const nextClassId = useMemo(() => {
        if (!classData) return null;
        const next = classes.find(c => c.class_number === classData.class_number + 1);
        return next?.id || null;
    }, [classData, classes]);

    if (detailLoading) {
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

    const { score: rawScore, total: totalQ, percent, passed } = isSubmitted ? calculateScore() : { score: 0, total: 0, percent: 0, passed: false };
    const mastery = isSubmitted ? getMasteryInfo(percent) : null;
    const currentQuestion = classData.questions[currentQuestionIdx];
    const totalQuestions = classData.questions.length;
    const answeredCount = Object.keys(answers).length;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* ─── Confetti Overlay ─── */}
            <AnimatePresence>
                {showConfetti && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
                    >
                        <div className="text-center">
                            {['🎉', '🇫🇷', '⭐', '🏆', '✨'].map((emoji, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 0, scale: 0 }}
                                    animate={{
                                        opacity: [0, 1, 1, 0],
                                        y: [0, -80 - Math.random() * 120],
                                        x: [(Math.random() - 0.5) * 200],
                                        scale: [0, 1.5, 1.2, 0],
                                        rotate: [0, Math.random() * 360],
                                    }}
                                    transition={{ duration: 2, delay: i * 0.15, ease: "easeOut" }}
                                    className="absolute text-4xl"
                                >
                                    {emoji}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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

                {/* Tab Toggle */}
                <div className="flex bg-gray-50 p-0.5 rounded-lg ml-4 border border-gray-100">
                    <button
                        onClick={() => setActiveTab('lesson')}
                        className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'lesson'
                                ? 'bg-white shadow-sm text-gray-900'
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <BookOpen className="w-3.5 h-3.5" /> Leçon
                    </button>
                    <button
                        onClick={() => setActiveTab('quiz')}
                        className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'quiz'
                                ? 'bg-white shadow-sm text-gray-900'
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <BrainCircuit className="w-3.5 h-3.5" /> Quiz
                    </button>
                </div>
            </header>

            {/* ─── Main Content ─── */}
            <div className="flex-1 w-full max-w-3xl mx-auto px-4 md:px-8 py-6 pb-32 md:pb-8">

                <AnimatePresence mode="wait">
                    {/* ─── LESSON VIEW ─── */}
                    {activeTab === 'lesson' && (
                        <motion.div
                            key="lesson"
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                            className="bg-white rounded-2xl p-6 md:p-10 border border-gray-100 shadow-sm"
                        >
                            <div className="max-w-none prose-sm">{renderMarkdown(classData.content_markdown)}</div>

                            <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
                                <Button
                                    onClick={() => setActiveTab('quiz')}
                                    size="lg"
                                    className="bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold rounded-xl shadow-sm"
                                >
                                    Passer au Quiz <ChevronRight className="w-5 h-5 ml-1" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* ─── QUIZ VIEW ─── */}
                    {activeTab === 'quiz' && (
                        <motion.div
                            key="quiz"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            {totalQuestions === 0 ? (
                                <div className="bg-white p-8 rounded-2xl text-center border border-gray-100 shadow-sm">
                                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Pas de Quiz</h3>
                                    <p className="text-gray-500 mb-6">Cette classe ne contient pas de questions.</p>
                                    <Button onClick={handleSubmit} className="bg-[#0055A4] hover:bg-[#1B6ED6] text-white">
                                        Valider la classe
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    {/* Quiz Progress */}
                                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                        <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                                            <span>Question {currentQuestionIdx + 1} / {totalQuestions}</span>
                                            <span>{answeredCount} répondues</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-[#0055A4] rounded-full"
                                                animate={{ width: `${((currentQuestionIdx + 1) / totalQuestions) * 100}%` }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </div>
                                    </div>

                                    {/* Current Question */}
                                    {currentQuestion && !isSubmitted && (
                                        <motion.div
                                            key={currentQuestion.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <h3 className="text-lg font-bold text-gray-900 flex-1">
                                                    <span className="text-[#0055A4] mr-2">{currentQuestionIdx + 1}.</span>
                                                    {currentQuestion.question_text}
                                                </h3>
                                                {isPremium && (
                                                    <button
                                                        onClick={() => setShowTranslation(prev => ({
                                                            ...prev, [currentQuestion.id]: !prev[currentQuestion.id]
                                                        }))}
                                                        className={`ml-3 p-2 rounded-lg border transition-all flex-shrink-0 ${showTranslation[currentQuestion.id]
                                                                ? 'bg-[#0055A4]/10 border-[#0055A4]/30 text-[#0055A4]'
                                                                : 'border-gray-200 text-gray-400 hover:text-gray-600'
                                                            }`}
                                                        title="Traduire (Premium)"
                                                    >
                                                        <Languages className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>

                                            {isPremium && showTranslation[currentQuestion.id] && (currentQuestion as any).explanation && (
                                                <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-700">
                                                    <Languages className="w-3.5 h-3.5 inline mr-1.5" />
                                                    {(currentQuestion as any).explanation}
                                                </div>
                                            )}

                                            <div className="space-y-3">
                                                {getQuestionOptions(currentQuestion).map((opt, i) => {
                                                    const isSelected = answers[currentQuestion.id] === opt;
                                                    return (
                                                        <button
                                                            key={i}
                                                            onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: opt }))}
                                                            className={`w-full text-left p-4 rounded-xl border-2 transition-all text-gray-800 ${isSelected
                                                                    ? 'border-[#0055A4] bg-[#0055A4]/5 font-semibold text-[#0055A4]'
                                                                    : 'border-gray-150 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            {opt}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* ─── RESULTS (After Submit) ─── */}
                                    {isSubmitted && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.96 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="space-y-6"
                                        >
                                            {/* Score Card */}
                                            <div className={`rounded-2xl p-8 border text-center ${mastery?.bgColor}`}>
                                                <span className="text-5xl mb-4 block">{mastery?.emoji}</span>
                                                <h3 className={`text-2xl font-black mb-1 ${mastery?.color}`}>
                                                    {passed ? 'Félicitations !' : 'Réessayez pour débloquer la suite.'}
                                                </h3>
                                                <p className="text-gray-600 mb-4">
                                                    Score : <strong className={mastery?.color}>{rawScore}/{totalQ} ({percent}%)</strong>
                                                </p>
                                                <span className={`inline-block text-sm font-bold px-4 py-1.5 rounded-full ${mastery?.bgColor} border ${mastery?.color}`}>
                                                    {mastery?.label}
                                                </span>
                                            </div>

                                            {/* Question Review */}
                                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                                <h4 className="font-bold text-gray-900 mb-4">Revue des réponses</h4>
                                                <div className="space-y-4">
                                                    {classData.questions.map((q, qi) => {
                                                        const userAnswer = answers[q.id];
                                                        const correctAnswer = getCorrectAnswerText(q);
                                                        const isCorrect = userAnswer === correctAnswer;

                                                        return (
                                                            <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? 'border-emerald-200 bg-emerald-50/50' : 'border-red-200 bg-red-50/50'}`}>
                                                                <div className="flex items-start gap-2 mb-2">
                                                                    {isCorrect
                                                                        ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                                        : <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                                                    }
                                                                    <span className="text-sm font-semibold text-gray-900">{qi + 1}. {q.question_text}</span>
                                                                </div>
                                                                {!isCorrect && (
                                                                    <div className="ml-6 text-xs">
                                                                        <p className="text-red-500">Votre réponse : {userAnswer || '—'}</p>
                                                                        <p className="text-emerald-600 font-semibold">Bonne réponse : {correctAnswer}</p>
                                                                    </div>
                                                                )}
                                                                {q.explanation && (
                                                                    <p className="ml-6 mt-1 text-xs text-gray-500 italic">{q.explanation}</p>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex justify-center gap-3 flex-wrap">
                                                {!passed && (
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setIsSubmitted(false);
                                                            setAnswers({});
                                                            setCurrentQuestionIdx(0);
                                                            setActiveTab('lesson');
                                                        }}
                                                        className="border-gray-200"
                                                    >
                                                        <RotateCcw className="w-4 h-4 mr-2" /> Réessayer
                                                    </Button>
                                                )}
                                                {passed && nextClassId && (
                                                    <Button
                                                        onClick={() => navigate(`/parcours/classe/${nextClassId}`)}
                                                        className="bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold"
                                                    >
                                                        Classe suivante <ChevronRight className="w-4 h-4 ml-1" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    onClick={() => navigate('/parcours')}
                                                    className="border-gray-200"
                                                >
                                                    Retour au parcours
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ─── Mobile Sticky Bottom Bar ─── */}
            {activeTab === 'quiz' && totalQuestions > 0 && !isSubmitted && (
                <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white border-t border-gray-100 p-3 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentQuestionIdx === 0}
                            onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                            className="border-gray-200 h-11"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>

                        {currentQuestionIdx < totalQuestions - 1 ? (
                            <Button
                                size="sm"
                                onClick={() => setCurrentQuestionIdx(prev => Math.min(totalQuestions - 1, prev + 1))}
                                className="flex-1 bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold h-11 rounded-xl"
                            >
                                Suivante <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        ) : (
                            <Button
                                size="sm"
                                onClick={handleSubmit}
                                disabled={answeredCount < totalQuestions || isUpdating}
                                className="flex-1 bg-[#EF4135] hover:bg-[#D63A30] text-white font-bold h-11 rounded-xl"
                            >
                                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Valider mes réponses
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {/* ─── Desktop Submit Bar ─── */}
            {activeTab === 'quiz' && totalQuestions > 0 && !isSubmitted && (
                <div className="hidden md:block w-full max-w-3xl mx-auto px-8 pb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentQuestionIdx === 0}
                                onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                                className="border-gray-200"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" /> Précédente
                            </Button>
                            {currentQuestionIdx < totalQuestions - 1 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentQuestionIdx(prev => Math.min(totalQuestions - 1, prev + 1))}
                                    className="border-gray-200"
                                >
                                    Suivante <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            )}
                        </div>
                        <Button
                            onClick={handleSubmit}
                            disabled={answeredCount < totalQuestions || isUpdating}
                            className="bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold rounded-xl h-11 px-8"
                        >
                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Valider mes réponses
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
