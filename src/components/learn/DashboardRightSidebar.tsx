import { Target, Flame, FileText, ArrowRight, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExamHistoryEntry } from '@/pages/LearningDashboard';
import { motion } from 'framer-motion';

interface RightSidebarProps {
    score: number;
    streak: number;
    examHistory: ExamHistoryEntry[];
    tier: 'free' | 'standard' | 'premium';
    onUpgrade: () => void;
}

export default function DashboardRightSidebar({ score, streak, examHistory, tier, onUpgrade }: RightSidebarProps) {
    const recentExams = examHistory.slice(0, 3);

    return (
        <motion.aside
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
            }}
            className="w-full xl:w-[320px] flex-shrink-0 flex flex-col gap-6"
        >

            {/* Progress Card */}
            <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }} className="bg-white rounded-2xl border border-[#E6EAF0] p-6 shadow-sm">
                <h3 className="font-bold text-[#1A1A1A] mb-6 flex items-center justify-between">
                    Aperçu de progression
                    <Target className="h-4 w-4 text-[#1A1A1A]/50" />
                </h3>

                {/* Circular Progress (Score) */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle cx="64" cy="64" r="56" stroke="#E6EAF0" strokeWidth="8" fill="none" />
                            <circle
                                cx="64" cy="64" r="56"
                                stroke="#0055A4"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray="351"
                                strokeDashoffset={351 - (score / 100) * 351}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="text-center">
                            <span className="text-3xl font-bold text-[#1A1A1A]">{score}%</span>
                            <span className="block text-[10px] font-bold text-[#1A1A1A]/50 uppercase tracking-widest mt-1">Score Prévu</span>
                        </div>
                    </div>
                </div>

                {/* Streak */}
                <div className="flex items-center gap-4 bg-[#F5F7FA] p-4 rounded-xl mb-6 shadow-inner border border-[#E6EAF0]/50">
                    <div className="h-10 w-10 bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center border border-[#E6EAF0]">
                        <Flame className={`h-5 w-5 ${streak > 0 ? 'text-[#EF4135]' : 'text-[#1A1A1A]/30'}`} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-[#1A1A1A]">{streak} Jours de suite</p>
                        <p className="text-xs text-[#1A1A1A]/60 font-medium">Continuez comme ça !</p>
                    </div>
                </div>

                {/* Recent Exams */}
                <div>
                    <h4 className="text-xs font-bold text-[#1A1A1A]/50 uppercase tracking-wider mb-3">Examens Récents</h4>
                    {recentExams.length > 0 ? (
                        <div className="space-y-3">
                            {recentExams.map((exam, i) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-[#F5F7FA] flex items-center justify-center border border-[#E6EAF0]">
                                            <FileText className="h-4 w-4 text-[#1A1A1A]/70" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[#1A1A1A]">Examen de niveau</p>
                                            <p className="text-[11px] font-medium text-[#1A1A1A]/50">{new Date(exam.date).toLocaleDateString('fr-FR')}</p>
                                        </div>
                                    </div>
                                    <span className={`text-sm font-bold ${exam.passed ? 'text-[#22C55E]' : 'text-[#F59E0B]'}`}>
                                        {Math.round((exam.score / exam.totalQuestions) * 100)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-[#1A1A1A]/50 text-center py-4 bg-[#F5F7FA] rounded-xl border border-[#E6EAF0] border-dashed">Aucun examen récent</p>
                    )}
                </div>
            </motion.div>

            {/* Premium Upsell */}
            {tier !== 'premium' && (
                <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }} className="bg-gradient-to-br from-[#0055A4] to-[#1B6ED6] rounded-2xl p-6 shadow-md text-white relative overflow-hidden group hover:shadow-lg transition-all">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
                    <div className="flex items-center gap-2 mb-4 relative z-10">
                        <Globe className="h-6 w-6 text-white/90" />
                        <h3 className="font-bold text-lg">Passez au supérieur</h3>
                    </div>
                    <p className="text-sm text-white/90 mb-6 font-medium leading-relaxed relative z-10">
                        Débloquez la traduction instantanée et la pratique par catégories ciblées.
                    </p>
                    <Button
                        onClick={onUpgrade}
                        className="w-full bg-white text-[#0055A4] hover:bg-[#F5F7FA] font-bold border-0 shadow-sm rounded-xl py-6 relative z-10"
                    >
                        Débloquer Premium
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </motion.div>
            )}

        </motion.aside>
    );
}
