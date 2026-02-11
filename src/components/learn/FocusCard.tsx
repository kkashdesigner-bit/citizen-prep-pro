import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { CATEGORY_LABELS, Category } from '@/lib/types';
import { AlertTriangle, ArrowRight } from 'lucide-react';

interface ExamHistoryEntry {
  date: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  timeSpent?: number;
  categoryBreakdown?: Record<string, { correct: number; total: number }>;
}

interface FocusCardProps {
  examHistory: ExamHistoryEntry[];
}

export default function FocusCard({ examHistory }: FocusCardProps) {
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Calculate accuracy per category across all exams
  const categoryStats: Record<string, { correct: number; total: number }> = {};
  examHistory.forEach((exam) => {
    if (!exam.categoryBreakdown) return;
    Object.entries(exam.categoryBreakdown).forEach(([cat, data]) => {
      if (!categoryStats[cat]) categoryStats[cat] = { correct: 0, total: 0 };
      categoryStats[cat].correct += data.correct;
      categoryStats[cat].total += data.total;
    });
  });

  // Find weakest category
  let weakest: { category: string; accuracy: number } | null = null;
  Object.entries(categoryStats).forEach(([cat, data]) => {
    if (data.total < 2) return; // need at least 2 questions
    const acc = data.correct / data.total;
    if (!weakest || acc < weakest.accuracy) {
      weakest = { category: cat, accuracy: acc };
    }
  });

  // Check for recent performance drop (last 3 vs previous exams)
  let recentDrop = false;
  if (examHistory.length >= 4) {
    const recent = examHistory.slice(-3);
    const older = examHistory.slice(0, -3);
    const recentAvg = recent.reduce((s, e) => s + e.score / e.totalQuestions, 0) / recent.length;
    const olderAvg = older.reduce((s, e) => s + e.score / e.totalQuestions, 0) / older.length;
    if (recentAvg < olderAvg - 0.05) recentDrop = true;
  }

  if (!weakest || weakest.accuracy >= 0.85) return null;

  const catLabel = CATEGORY_LABELS[language]?.[weakest.category as Category] || weakest.category;
  const accPct = Math.round(weakest.accuracy * 100);

   return (
     <div className="mb-6 rounded-2xl border border-[hsl(0,85,75)] bg-[hsl(0,85,95)] p-4 md:p-5">
       <div className="flex items-start gap-3">
         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[hsl(0,85,85)]">
           <AlertTriangle className="h-5 w-5 text-white" />
         </div>
         <div className="flex-1 min-w-0">
           <h3 className="font-semibold text-[hsl(0,85,40)]">
             Focus: {catLabel}
           </h3>
           <p className="mt-1 text-sm text-[hsl(0,85,50)]">
             Your accuracy in this area is {accPct}%.
             {recentDrop && ' Your recent scores show a downward trend.'}
             {' '}Revisit this domain to improve your chances.
           </p>
           <Button
             size="sm"
             className="mt-3 gap-1.5 bg-[hsl(0,85,60)] text-white hover:bg-[hsl(0,85,50)]"
             onClick={() => navigate(`/quiz?mode=study&category=${weakest!.category}`)}
           >
             Revise Now
             <ArrowRight className="h-3.5 w-3.5" />
           </Button>
         </div>
       </div>
     </div>
   );
}
