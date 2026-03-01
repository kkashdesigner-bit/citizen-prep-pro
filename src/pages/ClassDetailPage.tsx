import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useClassDetail } from '@/hooks/useClassDetail';
import { useParcours } from '@/hooks/useParcours';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, BrainCircuit, CheckCircle2, ChevronRight } from 'lucide-react';
import { getCorrectAnswerText, getQuestionOptions } from '@/lib/types';
import { toast } from 'sonner';

export default function ClassDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const { data: classData, loading: detailLoading, error } = useClassDetail(id);
    const { updateProgress } = useParcours();

    const [activeTab, setActiveTab] = useState<'lesson' | 'quiz'>('lesson');
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // We consider it a "mock" markdown render by splitting on double newlines
    const renderMockMarkdown = (md: string) => {
        return md.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="mb-4 text-slate-700 leading-relaxed">
                {paragraph}
            </p>
        ));
    };

    const calculateScore = () => {
        if (!classData) return { score: 0, percent: 0, passed: false };
        const total = classData.questions.length;
        if (total === 0) return { score: 100, percent: 100, passed: true }; // Pass by default if no questions

        let correct = 0;
        classData.questions.forEach(q => {
            if (answers[q.id] === getCorrectAnswerText(q)) correct++;
        });

        const percent = Math.round((correct / total) * 100);
        return { score: correct, percent, passed: percent >= 70 };
    };

    const handleSubmit = async () => {
        if (!user || !classData || !id) return;
        setIsUpdating(true);

        const { percent, passed } = calculateScore();
        setIsSubmitted(true);

        try {
            await updateProgress(id, percent, passed);
            if (passed) {
                toast.success(`Bravo ! Classe complétée avec ${percent}%.`);
            } else {
                toast.error(`Score insuffisant (${percent}%). Requis: 70%.`);
            }
        } catch (err) {
            toast.error('Erreur lors de la sauvegarde de la progression.');
        } finally {
            setIsUpdating(false);
        }
    };

    if (detailLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
            </div>
        );
    }

    if (error || !classData) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC]">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Erreur: {error || 'Classe introuvable'}</h2>
                <Button onClick={() => navigate('/parcours')}>Retour au parcours</Button>
            </div>
        );
    }

    const { percent, passed } = isSubmitted ? calculateScore() : { percent: 0, passed: false };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col pt-16 md:pt-20 pb-28">
            {/* Sticky Header */}
            <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-slate-200 h-16 flex items-center px-4 shadow-sm">
                <button
                    onClick={() => navigate('/parcours')}
                    className="p-2 mr-2 text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#0055A4] uppercase tracking-wider">Classe {classData.class_number.toString().padStart(2, '0')}</p>
                    <h1 className="text-base font-bold text-slate-900 truncate">{classData.title}</h1>
                </div>
            </header>

            <div className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-8">

                {/* Toggle Lesson / Quiz Tabs */}
                <div className="flex bg-slate-100 p-1 rounded-xl mb-8 max-w-md mx-auto mt-6 shadow-inner">
                    <button
                        onClick={() => setActiveTab('lesson')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'lesson' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        <BookOpen className="w-4 h-4" /> La Leçon
                    </button>
                    <button
                        onClick={() => setActiveTab('quiz')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'quiz' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        <BrainCircuit className="w-4 h-4" /> Le Quiz
                    </button>
                </div>

                {/* Lesson View */}
                {activeTab === 'lesson' && (
                    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="prose prose-slate max-w-none">
                            {renderMockMarkdown(classData.content_markdown)}
                        </div>

                        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
                            <Button
                                onClick={() => setActiveTab('quiz')}
                                size="lg"
                                className="bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold rounded-xl"
                            >
                                Passer au Quiz <ChevronRight className="w-5 h-5 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Quiz View */}
                {activeTab === 'quiz' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {classData.questions.length === 0 ? (
                            <div className="bg-white p-8 rounded-2xl text-center border border-slate-200 shadow-sm">
                                <CheckCircle2 className="w-12 h-12 text-[#22C55E] mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Aucun Quiz</h3>
                                <p className="text-slate-500 mb-6">Cette classe ne contient pas de questions de vérification.</p>
                                <Button onClick={handleSubmit} className="bg-[#0055A4] hover:bg-[#1B6ED6] text-white">
                                    Valider la classe
                                </Button>
                            </div>
                        ) : (
                            classData.questions.map((q, idx) => {
                                const options = getQuestionOptions(q);
                                const isAnswered = answers[q.id] !== undefined;
                                const correctText = getCorrectAnswerText(q);

                                return (
                                    <div key={q.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                        <h3 className="text-lg font-bold text-slate-900 mb-6">
                                            <span className="text-[#0055A4] mr-2">{idx + 1}.</span>
                                            {q.question_text}
                                        </h3>

                                        <div className="space-y-3">
                                            {options.map((opt, i) => {
                                                const isSelected = answers[q.id] === opt;
                                                const isCorrectOption = correctText === opt;

                                                let btnClass = "border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700";

                                                if (isSelected && !isSubmitted) {
                                                    btnClass = "border-[#0055A4] bg-[#0055A4]/5 text-[#0055A4] font-bold";
                                                } else if (isSubmitted) {
                                                    if (isCorrectOption) {
                                                        btnClass = "border-[#22C55E] bg-[#22C55E]/10 text-[#166534] font-bold";
                                                    } else if (isSelected && !isCorrectOption) {
                                                        btnClass = "border-[#EF4135] bg-[#EF4135]/10 text-[#991B1B] font-bold";
                                                    } else {
                                                        btnClass = "border-slate-200 text-slate-400 opacity-50";
                                                    }
                                                }

                                                return (
                                                    <button
                                                        key={i}
                                                        disabled={isSubmitted}
                                                        onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${btnClass}`}
                                                    >
                                                        {opt}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Explanation if submitted */}
                                        {isSubmitted && q.explanation && (
                                            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-600">
                                                <strong className="text-slate-900 block mb-1">Explication :</strong>
                                                {q.explanation}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}

                        {/* Submit Block */}
                        {classData.questions.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-center">
                                {!isSubmitted ? (
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={Object.keys(answers).length < classData.questions.length || isUpdating}
                                        className="w-full sm:w-auto bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold rounded-xl h-12 px-8"
                                    >
                                        Valider mes réponses
                                    </Button>
                                ) : (
                                    <div>
                                        <h3 className={`text-2xl font-black mb-2 ${passed ? 'text-[#22C55E]' : 'text-[#EF4135]'}`}>
                                            {passed ? 'Félicitations !' : 'Oups...'}
                                        </h3>
                                        <p className="text-slate-600 mb-6">
                                            Vous avez obtenu un score de <strong className={passed ? 'text-[#22C55E]' : 'text-[#EF4135]'}>{percent}%</strong>.
                                            <br />
                                            {passed ? "Vous pouvez passer à la classe suivante." : "Il faut 70% pour valider. Révisez la leçon et réessayez."}
                                        </p>
                                        <div className="flex justify-center gap-4">
                                            {!passed && (
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setIsSubmitted(false);
                                                        setAnswers({});
                                                        setActiveTab('lesson');
                                                    }}
                                                >
                                                    Réessayer
                                                </Button>
                                            )}

                                            <Button
                                                onClick={() => navigate('/parcours')}
                                                className="bg-[#0055A4] hover:bg-[#1B6ED6] text-white"
                                            >
                                                Retourner au parcours
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
}
