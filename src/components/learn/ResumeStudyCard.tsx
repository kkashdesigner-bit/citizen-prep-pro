import { motion } from 'framer-motion';
import { BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ResumeStudyCardProps {
    chapterTitle: string;
    chapterNumber: number;
    totalChapters: number;
    progressPercent: number;
}

export default function ResumeStudyCard({
    chapterTitle, chapterNumber, totalChapters, progressPercent,
}: ResumeStudyCardProps) {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -2, boxShadow: "0 8px 28px rgba(0,0,0,0.08)" }}
            className="bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] mb-8 cursor-pointer group"
            onClick={() => navigate('/parcours')}
        >
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-[#0055A4]" />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[var(--dash-text-muted)] uppercase tracking-widest mb-1">Reprendre l'étude</p>
                    <h3 className="text-base font-bold text-[var(--dash-text)] mb-3 truncate">{chapterTitle}</h3>

                    <div className="flex items-center justify-between text-xs font-semibold text-[var(--dash-text-muted)] mb-2">
                        <span>Chapitre {chapterNumber}/{totalChapters}</span>
                        <span className="text-[#0055A4]">{progressPercent}%</span>
                    </div>
                    <div className="h-2 w-full bg-[var(--dash-surface)] rounded-full overflow-hidden border border-[var(--dash-card-border)]">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-[#0055A4] to-[#3B82F6] rounded-full"
                        />
                    </div>
                </div>

                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#0055A4] flex items-center justify-center shadow-sm self-center group-hover:bg-[#1B6ED6] transition-colors">
                    <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-0.5 transition-transform" />
                </div>
            </div>
        </motion.div>
    );
}
