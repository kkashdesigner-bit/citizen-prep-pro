import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { CATEGORY_LABELS, ExamResult } from '@/lib/types';
import SubscriptionGate from '@/components/SubscriptionGate';
import Header from '@/components/Header';
import { useParcours } from '@/hooks/useParcours';
import { useAuth } from '@/hooks/useAuth';
import { Trophy, ArrowRight, Scale, Landmark, HeartHandshake, LayoutDashboard, RotateCcw, AlertTriangle, Medal, Check, X, ChevronUp, ChevronDown, ChevronRight } from 'lucide-react';

interface QuizError {
    questionText: string;
    options: string[];
    selectedAnswer: string;
    correctAnswer: string;
    category: string;
    explanation: string;
}

export default function Results() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { t, language } = useLanguage();
    const { user } = useAuth();
    const [result, setResult] = useState<ExamResult | null>(null);
    const [errors, setErrors] = useState<QuizError[]>([]);
    const [showErrors, setShowErrors] = useState(false);
    const [showGate, setShowGate] = useState(false);
    const errorsRef = useRef<HTMLDivElement>(null);
    const [classId, setClassId] = useState<string | null>(null);
    const { classes } = useParcours();

    useEffect(() => {
        const stored = sessionStorage.getItem('quizResults');
        if (stored) {
            setResult(JSON.parse(stored));
            const storedErrors = sessionStorage.getItem('quizErrors');
            if (storedErrors) setErrors(JSON.parse(storedErrors));
            const storedClassId = sessionStorage.getItem('quizClassId');
            if (storedClassId) setClassId(storedClassId);
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleToggleErrors = () => {
        setShowErrors(prev => !prev);
        if (!showErrors) {
            setTimeout(() => errorsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        }
    };

    if (!result) return null;

    const scorePercent = result.totalQuestions > 0 ? Math.round((result.score / result.totalQuestions) * 100) : 0;
    const entries = result.categoryBreakdown ? Object.entries(result.categoryBreakdown) : [];
    const primaryColor = "#135bec";
    const accentRed = "#ef4444";
    const currentClass = classId ? classes.find(c => c.id === classId) : null;
    const nextClass = currentClass ? classes.find(c => c.class_number === currentClass.class_number + 1) : null;

    return (
        <div className="min-h-screen bg-[#f6f6f8] text-slate-900 font-sans flex flex-col overflow-x-hidden">
            <SEOHead noindex />
            <style>{`
 .font-display { font-family: 'Lexend', sans-serif; }
 .confetti-bg {
 background-image: 
 radial-gradient(circle at 20% 30%, #135bec 2px, transparent 2px),
 radial-gradient(circle at 80% 10%, #ef4444 2px, transparent 2px),
 radial-gradient(circle at 50% 50%, #135bec 3px, transparent 3px),
 radial-gradient(circle at 10% 80%, #ef4444 2px, transparent 2px),
 radial-gradient(circle at 90% 70%, #135bec 2px, transparent 2px),
 radial-gradient(circle at 30% 90%, #ef4444 3px, transparent 3px);
 background-size: 200px 200px;
 }
 .tricolor-fill {
 background: linear-gradient(90deg, #135bec 0%, #135bec 33%, #ffffff 33%, #ffffff 66%, #ef4444 66%, #ef4444 100%);
 }
 `}</style>

            {/* Kept Original Header from the app framework */}
            <Header />

            <main className="flex flex-1 justify-center py-6 px-4 lg:px-0">
                <div className="flex flex-col max-w-[1000px] flex-1 gap-8 w-full mt-4">
                    <section className="relative overflow-hidden rounded-2xl sm:rounded-[2.5rem] shadow-2xl">
                        {/* Background image – desktop vs mobile */}
                        <picture>
                            <source
                                media="(min-width: 640px)"
                                srcSet={result.passed ? '/images/result-pass-desktop.jpg' : '/images/result-fail-desktop.jpg'}
                            />
                            <img
                                src={result.passed ? '/images/result-pass-mobile.jpg' : '/images/result-fail-mobile.jpg'}
                                alt=""
                                aria-hidden="true"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </picture>

                        {/* Dark overlay for text legibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />

                        <div className="relative z-10 flex flex-col items-center px-5 py-10 sm:px-10 sm:py-16 lg:px-16 lg:py-20 min-h-[340px] sm:min-h-[400px]">
                            <span className={`px-6 py-2 ${result.passed ? 'bg-green-500' : 'bg-red-500'} text-white rounded-full text-sm font-black uppercase tracking-[0.2em] mb-6 sm:mb-8 shadow-lg backdrop-blur-sm`}>
                                {result.passed ? 'Examen Réussi' : 'Examen Échoué'}
                            </span>

                            <div className="flex flex-col items-center gap-6 sm:gap-10 lg:flex-row lg:gap-20 w-full justify-center">
                                {/* Score card */}
                                <div className="relative group shrink-0">
                                    <div className="relative bg-gradient-to-b from-yellow-300 to-yellow-600 p-4 sm:p-8 rounded-2xl sm:rounded-[3rem] shadow-[0_20px_50px_rgba(234,179,8,0.4)] transform hover:scale-105 transition-transform duration-500">
                                        <div className="bg-white/10 p-3 sm:p-6 rounded-xl sm:rounded-[2rem] border border-white/20 backdrop-blur-sm flex flex-col items-center">
                                            <Trophy size={48} className="sm:hidden text-white drop-shadow-lg mb-1 fill-white" />
                                            <Trophy size={100} className="hidden sm:block text-white drop-shadow-lg mb-2 fill-white" />
                                            <div className="text-white text-center">
                                                <span className="block text-3xl sm:text-6xl font-black font-display tracking-tighter">{scorePercent}%</span>
                                                <span className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-80">Score Total</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Text content */}
                                <div className="text-center lg:text-left max-w-md">
                                    <h1 className="text-white text-3xl sm:text-5xl lg:text-7xl font-black mb-3 sm:mb-6 font-display leading-tight italic transform -rotate-1 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                                        {result.passed ? t('results.congratulations') : t('results.tooBad')}
                                    </h1>
                                    <p className="text-white/90 text-sm sm:text-xl font-medium leading-relaxed drop-shadow-md">
                                        {result.passed
                                            ? "Bravo ! Continuez comme ça, vous progressez bien vers votre objectif."
                                            : "Vous n'avez pas atteint le score nécessaire. Continuez à vous entraîner !"
                                        }
                                    </p>
                                    <div className="mt-8 sm:mt-10 flex flex-wrap gap-4 justify-center lg:justify-start">
                                        <button
                                            onClick={() => {
                                                sessionStorage.removeItem('quizResults');
                                                sessionStorage.removeItem('quizErrors');
                                                if (classId && nextClass) {
                                                    sessionStorage.removeItem('quizClassId');
                                                    navigate(`/parcours/classe/${nextClass.id}`);
                                                } else {
                                                    navigate('/quiz?mode=exam');
                                                }
                                            }}
                                            className="bg-white text-[#135bec] py-4 px-10 rounded-2xl font-black flex items-center gap-4 hover:scale-105 transition-all shadow-xl"
                                        >
                                            <span>{classId && nextClass ? 'Classe suivante' : t('results.nextExam')}</span>
                                            <ArrowRight size={24} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-xl font-black font-display italic text-slate-800">Résultats par catégorie</h3>
                                <span className="bg-blue-100 text-[#135bec] text-xs font-bold px-3 py-1 rounded-full">
                                    {entries.length} catégories
                                </span>
                            </div>

                            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-lg overflow-hidden divide-y divide-slate-100">
                                {entries.map(([cat, data], idx) => {
                                    const catPercent = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                                    const categoryName = CATEGORY_LABELS[language as keyof typeof CATEGORY_LABELS]?.[cat as keyof typeof CATEGORY_LABELS.fr] || cat;

                                    let Icon = Landmark;
                                    if (cat.toLowerCase().includes('valeur')) Icon = Scale;
                                    if (cat.toLowerCase().includes('droit') || cat.toLowerCase().includes('devoir')) Icon = HeartHandshake;

                                    return (
                                        <div key={idx} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-slate-50 transition-colors">
                                            <div className="size-10 shrink-0 rounded-xl bg-blue-50 text-[#135bec] flex items-center justify-center">
                                                <Icon size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <h4 className="font-bold text-sm text-slate-800 truncate pr-2">{categoryName}</h4>
                                                    <span className="text-sm font-black text-[#135bec] font-display shrink-0">{catPercent}%</span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full overflow-hidden h-2 border border-slate-200">
                                                    <div className="h-full tricolor-fill rounded-full" style={{ width: `${catPercent}%` }}></div>
                                                </div>
                                            </div>
                                            <span className="text-xs text-slate-400 font-bold shrink-0 hidden sm:block">{data.correct}/{data.total}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>


                        <div className="lg:col-span-4 space-y-4">
                            <h3 className="text-xl font-black px-1 font-display uppercase tracking-widest text-slate-400">Actions</h3>
                            <button
                                onClick={() => {
                                    if (!user) { navigate('/auth'); return; }
                                    navigate('/learn');
                                }}
                                className="w-full bg-slate-100 text-slate-700 py-4 px-6 rounded-2xl font-bold flex items-center gap-4 hover:bg-slate-200 transition-all border-b-4 border-slate-300 active:border-b-0 active:translate-y-1"
                            >
                                <LayoutDashboard className="text-[#135bec]" />
                                {t('results.dashboard')}
                            </button>

                            {classId && (() => {
                                const currentClass = classes.find(c => c.id === classId);
                                const nextClass = currentClass ? classes.find(c => c.class_number === currentClass.class_number + 1) : null;
                                return nextClass ? (
                                    <button
                                        onClick={() => { sessionStorage.removeItem('quizResults'); sessionStorage.removeItem('quizErrors'); sessionStorage.removeItem('quizClassId'); navigate(`/parcours/classe/${nextClass.id}`); }}
                                        className="w-full bg-[#135bec] text-white py-4 px-6 rounded-2xl font-bold flex items-center gap-4 hover:bg-[#0d4fd4] transition-all shadow-lg shadow-blue-500/20 border-b-4 border-blue-700 active:border-b-0 active:translate-y-1"
                                    >
                                        <ChevronRight className="text-white" />
                                        Classe suivante
                                    </button>
                                ) : null;
                            })()}

                            <button
                                onClick={() => {
                                    const storedIds = sessionStorage.getItem('quizQuestionIds');
                                    const storedMode = sessionStorage.getItem('quizMode') || 'exam';
                                    sessionStorage.removeItem('quizResults');
                                    sessionStorage.removeItem('quizErrors');
                                    sessionStorage.removeItem('quizQuestionIds');
                                    sessionStorage.removeItem('quizMode');
                                    if (storedIds) {
                                        sessionStorage.setItem('retakeQuestionIds', storedIds);
                                    }
                                    navigate(`/quiz?mode=${storedMode}&retake=1`);
                                }}
                                className="w-full border-2 border-slate-200 text-slate-600 py-4 px-6 rounded-2xl font-bold flex items-center gap-4 hover:bg-slate-50 transition-all border-b-4 border-slate-200 active:border-b-0 active:translate-y-1"
                            >
                                <RotateCcw className="text-[#ef4444]" />
                                {t('results.retakeExam')}
                            </button>

                            {errors.length > 0 && (
                                <button
                                    onClick={handleToggleErrors}
                                    className="w-full bg-slate-100 text-slate-700 py-4 px-6 rounded-2xl font-bold flex items-center gap-4 hover:bg-slate-200 transition-all border-b-4 border-slate-300 active:border-b-0 active:translate-y-1"
                                >
                                    <AlertTriangle className="text-yellow-500 fill-yellow-500" />
                                    {showErrors ? 'Masquer mes erreurs' : 'Revoir mes erreurs'}
                                    {showErrors ? <ChevronUp className="h-5 w-5 ml-auto text-slate-400" /> : <ChevronDown className="h-5 w-5 ml-auto text-slate-400" />}
                                </button>
                            )}

                            <div className="mt-8 p-6 rounded-[2rem] bg-gradient-to-br from-slate-900 to-[#135bec] text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2">
                                    <Medal className="text-yellow-400 text-4xl opacity-30 w-12 h-12" />
                                </div>
                                <h4 className="text-lg font-black font-display mb-2 italic">Passez au Pass Premium</h4>
                                <p className="text-slate-400 text-xs mb-6 font-medium">Débloquez 2000+ questions et simulations d'entretiens.</p>
                                <button onClick={() => setShowGate(true)} className="w-full bg-white text-[#135bec] py-3 rounded-xl font-black text-sm hover:scale-[1.02] transition-transform shadow-xl">
                                    Débloquer maintenant
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ─── Error Review Section ─── */}
                    {
                        showErrors && errors.length > 0 && (
                            <div ref={errorsRef} className="w-full mb-8 pt-6">
                                <div className="rounded-[2.5rem] p-8 md:p-10 w-full bg-white border-2 border-slate-100 shadow-xl">
                                    <h2 className="text-2xl font-black font-display text-slate-900 mb-6 flex items-center gap-3">
                                        <AlertTriangle className="h-6 w-6 text-[#ef4444] fill-[#ef4444]" />
                                        Vos erreurs ({errors.length})
                                    </h2>
                                    <div className="space-y-6">
                                        {errors.map((err, idx) => (
                                            <div key={idx} className="rounded-2xl bg-[#f6f6f8] p-6 border-l-4 border-[#ef4444] shadow-sm">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#135bec] mb-2">{err.category}</p>
                                                <p className="font-bold text-slate-900 text-lg mb-5">{err.questionText}</p>
                                                <div className="space-y-3 mb-5">
                                                    {err.options.map((opt, oi) => {
                                                        const isSelected = opt.trim() === err.selectedAnswer.trim();
                                                        const isCorrect = opt.trim() === err.correctAnswer.trim();
                                                        let cls = 'border-slate-200 bg-white text-slate-600 ';
                                                        if (isCorrect) cls = 'border-green-200 bg-green-50 text-green-700 ring-1 ring-green-500';
                                                        else if (isSelected) cls = 'border-red-200 bg-red-50 text-red-600 ring-1 ring-red-500';
                                                        return (
                                                            <div key={oi} className={`flex items-center gap-3 p-4 rounded-xl border-2 text-sm font-bold ${cls} transition-colors`}>
                                                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${isCorrect ? 'bg-green-100 ' : isSelected ? 'bg-red-100 ' : 'bg-slate-100 '}`}>
                                                                    {String.fromCharCode(65 + oi)}
                                                                </span>
                                                                {opt}
                                                                {isCorrect && <Check className="h-5 w-5 ml-auto text-green-600 " strokeWidth={3} />}
                                                                {isSelected && !isCorrect && <X className="h-5 w-5 ml-auto text-red-500 " strokeWidth={3} />}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                {err.explanation && (
                                                    <p className="text-sm text-[#135bec] bg-blue-50 rounded-xl p-4 border border-blue-100 font-medium">
                                                        💡 {err.explanation}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    <footer className="my-8 text-center pb-8 border-t border-slate-200 pt-8">
                        <p className="text-slate-400 text-sm font-bold tracking-tight">© 2026 GoCivique. Préparation citoyenne moderne.</p>
                        <div className="flex justify-center gap-8 mt-6">
                            <a className="text-slate-400 hover:text-[#135bec] transition-colors text-[10px] uppercase tracking-[0.2em] font-black cursor-pointer">Confidentialité</a>
                            <a className="text-slate-400 hover:text-[#135bec] transition-colors text-[10px] uppercase tracking-[0.2em] font-black cursor-pointer">Conditions</a>
                            <a className="text-slate-400 hover:text-[#135bec] transition-colors text-[10px] uppercase tracking-[0.2em] font-black cursor-pointer">Contact</a>
                        </div>
                    </footer>
                </div>
            </main>

            <SubscriptionGate open={showGate} onOpenChange={setShowGate} requiredTier="premium" />
        </div>
    );
}
