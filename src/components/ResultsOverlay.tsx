import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { CATEGORY_LABELS, ExamResult } from '@/lib/types';
import SubscriptionGate from '@/components/SubscriptionGate';
import { Check, X, BarChart3, Clock, RotateCcw, LayoutDashboard, ArrowRight, ListChecks, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export interface QuizError {
    questionText: string;
    options: string[];
    selectedAnswer: string;
    correctAnswer: string;
    category: string;
    explanation: string;
}

/* ─── Animated counter hook ─── */
function useAnimatedCounter(target: number, duration = 1800) {
    const [value, setValue] = useState(0);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const start = performance.now();
        const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(target * eased));
            if (progress < 1) rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [target, duration]);

    return value;
}

interface ResultsOverlayProps {
    result: ExamResult;
    errors: QuizError[];
    isDemo?: boolean;
    onRetry: () => void;
    onHome: () => void;
}

export default function ResultsOverlay({ result, errors, isDemo, onRetry, onHome }: ResultsOverlayProps) {
    const navigate = useNavigate();
    const { t, language } = useLanguage();
    const [showGate, setShowGate] = useState(false);
    const [showErrors, setShowErrors] = useState(false);
    const errorsRef = useRef<HTMLDivElement>(null);

    const scorePercent = Math.round((result.score / result.totalQuestions) * 100);
    const minutes = Math.floor(result.timeSpent / 60);
    const seconds = result.timeSpent % 60;

    const handleToggleErrors = () => {
        setShowErrors(prev => !prev);
        if (!showErrors) {
            setTimeout(() => errorsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        }
    };

    return (
        <>
            <div
                className="fixed inset-0 z-[100] flex flex-col overflow-y-auto"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, #fdfdfd 0%, #f1f5f9 100%)',
                    animation: 'overlayIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                }}
            >
                {/* Floating background shapes */}
                <FloatingShapes />

                <main className="flex-1 flex flex-col items-center justify-start relative z-10 px-4 py-8 md:py-12 max-w-2xl mx-auto w-full">

                    {/* ─── Hero Banner ─── */}
                    <HeroBanner passed={result.passed} scorePercent={scorePercent} />

                    {/* ─── Score + Time Cards ─── */}
                    <div className="grid grid-cols-2 gap-4 md:gap-6 w-full mb-8">
                        <StatCard
                            icon={<BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-[#0055A4]" />}
                            value={`${scorePercent}%`}
                            label={`Score ${result.score}/${result.totalQuestions}`}
                            bgClass="bg-blue-50"
                            delay={100}
                            animatedValue={scorePercent}
                        />
                        <StatCard
                            icon={<Clock className="h-5 w-5 md:h-6 md:w-6 text-[#EF4135]" />}
                            value={`${minutes}:${String(seconds).padStart(2, '0')}`}
                            label={t('results.time') || 'Temps'}
                            bgClass="bg-red-50"
                            delay={200}
                        />
                    </div>

                    {/* ─── Category Breakdown ─── */}
                    <CategoryBreakdown
                        result={result}
                        language={language}
                        onReviewErrors={handleToggleErrors}
                        showErrors={showErrors}
                        hasErrors={errors.length > 0}
                    />

                    {/* ─── Action Buttons ─── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-6"
                        style={{ animation: 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards', animationDelay: '0.4s', opacity: 0 }}
                    >
                        <button
                            onClick={onRetry}
                            className="group w-full p-4 md:p-5 rounded-2xl transition-all flex items-center justify-center gap-3 text-slate-500 hover:text-[#0055A4]"
                            style={{
                                background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
                                boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
                                border: '1px solid rgba(255, 255, 255, 0.5)',
                            }}
                        >
                            <RotateCcw className="h-5 w-5 group-hover:rotate-[-120deg] transition-transform duration-500" />
                            <span className="font-bold text-sm uppercase tracking-widest">{t('results.retry') || "Refaire l'examen"}</span>
                        </button>
                        <button
                            onClick={onHome}
                            className="group w-full p-4 md:p-5 rounded-2xl transition-all flex items-center justify-center gap-3 text-slate-500 hover:text-[#0055A4]"
                            style={{
                                background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
                                boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
                                border: '1px solid rgba(255, 255, 255, 0.5)',
                            }}
                        >
                            <LayoutDashboard className="h-5 w-5 group-hover:scale-110 transition-transform" />
                            <span className="font-bold text-sm uppercase tracking-widest">{t('results.home') || 'Tableau de bord'}</span>
                        </button>
                    </div>

                    {/* ─── Subscription CTA ─── */}
                    <div className="w-full mb-5" style={{ animation: 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards', animationDelay: '0.45s', opacity: 0 }}>
                        <button
                            onClick={() => setShowGate(true)}
                            className="w-full p-4 md:p-5 rounded-2xl transition-all flex items-center justify-center gap-3 text-amber-600 hover:text-amber-700"
                            style={{
                                background: 'linear-gradient(145deg, #fffbeb, #fef3c7)',
                                boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
                                border: '1px solid rgba(251, 191, 36, 0.3)',
                            }}
                        >
                            <Sparkles className="h-5 w-5" />
                            <span className="font-bold text-sm uppercase tracking-widest">Accès complet — Débloquer</span>
                        </button>
                    </div>

                    {/* ─── Error Review Section ─── */}
                    {showErrors && errors.length > 0 && (
                        <div ref={errorsRef} className="w-full mb-8" style={{ animation: 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
                            <div
                                className="rounded-[2rem] p-6 md:p-10 w-full"
                                style={{
                                    background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
                                    boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
                                    border: '1px solid rgba(255, 255, 255, 0.5)',
                                }}
                            >
                                <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                                    <X className="h-5 w-5 text-[#EF4135]" />
                                    Vos erreurs ({errors.length})
                                </h2>
                                <div className="space-y-6">
                                    {errors.map((err, idx) => (
                                        <div key={idx} className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{err.category}</p>
                                            <p className="font-bold text-gray-900 mb-4">{err.questionText}</p>
                                            <div className="space-y-2 mb-4">
                                                {err.options.map((opt, oi) => {
                                                    const isSelected = opt.trim() === err.selectedAnswer.trim();
                                                    const isCorrect = opt.trim() === err.correctAnswer.trim();
                                                    let cls = 'border-slate-100 text-slate-500';
                                                    if (isCorrect) cls = 'border-green-200 bg-green-50 text-green-700';
                                                    else if (isSelected) cls = 'border-red-200 bg-red-50 text-red-600';
                                                    return (
                                                        <div key={oi} className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-medium ${cls}`}>
                                                            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold shrink-0">
                                                                {String.fromCharCode(65 + oi)}
                                                            </span>
                                                            {opt}
                                                            {isCorrect && <Check className="h-4 w-4 ml-auto text-green-600" />}
                                                            {isSelected && !isCorrect && <X className="h-4 w-4 ml-auto text-red-500" />}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            {err.explanation && (
                                                <p className="text-sm text-slate-600 bg-blue-50 rounded-xl p-3 border border-blue-100">
                                                    💡 {err.explanation}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ─── Next Exam CTA ─── */}
                    <div className="w-full pb-8" style={{ animation: 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards', animationDelay: '0.5s', opacity: 0 }}>
                        <button
                            onClick={onRetry}
                            className="w-full text-white p-5 md:p-6 rounded-2xl transition-all flex items-center justify-center gap-4 transform hover:-translate-y-1 active:scale-[0.98] group"
                            style={{
                                background: 'linear-gradient(145deg, #005dc3, #004d94)',
                                boxShadow: '4px 4px 10px rgba(0, 85, 164, 0.3), inset 0 2px 4px rgba(255,255,255,0.3)',
                            }}
                        >
                            <span className="font-bold text-lg md:text-xl tracking-wide">Prochain Examen</span>
                            <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </main>
            </div>

            <SubscriptionGate open={showGate} onOpenChange={setShowGate} />

            {/* Keyframes */}
            <style>{`
        @keyframes overlayIn {
          0% { opacity: 0; transform: translateY(40px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(15px, -25px) rotate(5deg); }
          66% { transform: translate(-10px, 15px) rotate(-5deg); }
        }
        @keyframes scaleIn {
          0% { transform: scale(0.9) translateY(10px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes slideUp {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes growWidth {
          0% { width: 0%; }
          100% { width: var(--target-width); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0, 85, 164, 0.2), inset 0 2px 4px rgba(255,255,255,0.3); }
          50% { box-shadow: 0 0 0 15px rgba(0, 85, 164, 0), inset 0 2px 4px rgba(255,255,255,0.3); }
        }
        @keyframes bounceScale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
        </>
    );
}

/* ─── Floating Background Shapes ─── */
function FloatingShapes() {
    return (
        <>
            <div
                className="fixed top-[10%] left-[5%] w-64 h-64 rounded-full opacity-20 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 30% 30%, #0055A4 0%, rgba(0,0,0,0.1) 100%)',
                    animation: 'float 8s ease-in-out infinite',
                }}
            />
            <div
                className="fixed top-[40%] right-[-5%] w-80 h-80 opacity-15 rotate-12 pointer-events-none"
                style={{
                    borderRadius: '20%',
                    background: 'linear-gradient(135deg, #EF4135 0%, rgba(0,0,0,0.05) 100%)',
                    animation: 'float 12s ease-in-out infinite 2s',
                }}
            />
            <div
                className="fixed bottom-[-10%] left-[20%] w-48 h-48 rounded-full opacity-10 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 30% 30%, #0055A4 0%, rgba(0,0,0,0.1) 100%)',
                    animation: 'float 8s ease-in-out infinite',
                }}
            />
        </>
    );
}

/* ─── Hero Banner ─── */
function HeroBanner({ passed, scorePercent }: { passed: boolean; scorePercent: number }) {
    return (
        <div
            className="w-full rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-14 text-center mb-8 relative overflow-hidden"
            style={{
                background: passed
                    ? 'linear-gradient(145deg, #0055A4, #004482)'
                    : 'linear-gradient(145deg, #EF4135, #c62828)',
                boxShadow: passed
                    ? '0 20px 40px -10px rgba(0, 85, 164, 0.4)'
                    : '0 20px 40px -10px rgba(239, 65, 53, 0.4)',
                animation: 'scaleIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
            }}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2)_0%,transparent_70%)]" />

            <div
                className="w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-5 md:mb-6 border border-white/30"
                style={{
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    animation: 'bounceScale 3s infinite',
                }}
            >
                <div className={`w-14 h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-inner ${passed ? 'text-[#0055A4]' : 'text-[#EF4135]'}`}>
                    {passed ? <Check className="h-8 w-8 md:h-9 md:w-9" strokeWidth={3} /> : <X className="h-8 w-8 md:h-9 md:w-9" strokeWidth={3} />}
                </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight uppercase">
                {passed ? 'Réussi' : 'Échoué'}
            </h1>
            <p className="text-white/80 font-medium tracking-wide">
                Seuil de réussite : 80%
            </p>

            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-3 h-3 bg-white/30 rounded-full" />
                <div className="absolute top-[30%] right-[15%] w-4 h-4 bg-white/20 rounded-sm rotate-45" />
                <div className="absolute top-[60%] left-[20%] w-2 h-2 bg-white/40 rounded-full" />
            </div>
        </div>
    );
}

/* ─── Stat Card ─── */
function StatCard({
    icon, value, label, bgClass, delay, animatedValue,
}: {
    icon: React.ReactNode; value: string; label: string; bgClass: string; delay: number; animatedValue?: number;
}) {
    const counter = useAnimatedCounter(animatedValue ?? 0, 1800);

    return (
        <div
            className="rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 flex flex-col items-center justify-center gap-2"
            style={{
                background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
                boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                animation: 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                animationDelay: `${delay / 1000}s`,
                opacity: 0,
            }}
        >
            <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl ${bgClass} flex items-center justify-center mb-1 md:mb-2`}
                style={{ boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.05), inset -2px -2px 5px rgba(255,255,255,0.8)' }}
            >
                {icon}
            </div>
            <div className="text-3xl md:text-5xl font-extrabold text-gray-900">
                {animatedValue !== undefined ? `${counter}%` : value}
            </div>
            <div className="text-[10px] md:text-sm text-slate-500 font-bold uppercase tracking-widest text-center">{label}</div>
        </div>
    );
}

/* ─── Category Breakdown ─── */
function CategoryBreakdown({ result, language, onReviewErrors, showErrors, hasErrors }: {
    result: ExamResult; language: string; onReviewErrors: () => void; showErrors: boolean; hasErrors: boolean;
}) {
    const entries = Object.entries(result.categoryBreakdown);

    return (
        <div
            className="rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 w-full mb-8"
            style={{
                background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
                boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                animation: 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                animationDelay: '0.3s',
                opacity: 0,
            }}
        >
            <h2 className="text-xl font-extrabold text-gray-900 mb-6 md:mb-8">Par catégorie</h2>

            <div className="space-y-6 md:space-y-8">
                {entries.map(([cat, data], idx) => {
                    const catPercent = Math.round((data.correct / data.total) * 100);
                    const categoryName =
                        CATEGORY_LABELS[language as keyof typeof CATEGORY_LABELS]?.[cat as keyof typeof CATEGORY_LABELS.fr] || cat;
                    const barColor = catPercent >= 80 ? '#0055A4' : '#EF4135';

                    return (
                        <div key={cat}>
                            <div className="flex justify-between text-sm mb-3">
                                <span className="font-bold text-gray-700">{categoryName}</span>
                                <span className="text-slate-500 font-bold">
                                    {data.correct}/{data.total} ({catPercent}%)
                                </span>
                            </div>
                            <div
                                className="h-3 md:h-4 bg-slate-100 rounded-full overflow-hidden"
                                style={{ boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.05), inset -2px -2px 5px rgba(255,255,255,0.8)' }}
                            >
                                <div
                                    className="h-full rounded-full"
                                    style={{
                                        '--target-width': `${catPercent}%`,
                                        background: barColor,
                                        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4)',
                                        animation: 'growWidth 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                                        animationDelay: `${0.5 + idx * 0.15}s`,
                                        width: 0,
                                    } as React.CSSProperties}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {hasErrors && (
                <button
                    onClick={onReviewErrors}
                    className="mt-8 md:mt-10 w-full py-4 md:py-5 rounded-2xl border border-[#0055A4]/10 bg-blue-50 text-[#0055A4] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] hover:bg-blue-100/80 transition-all flex items-center justify-center gap-3"
                    style={{ animation: 'pulseGlow 3s infinite' }}
                >
                    <ListChecks className="h-5 w-5" />
                    {showErrors ? 'Masquer mes erreurs' : 'Revoir mes erreurs'}
                    {showErrors ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
            )}
        </div>
    );
}
