import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { CATEGORY_LABELS, Language, Category } from '@/lib/types';

interface ExamHistoryEntry {
  categoryBreakdown?: Record<string, { correct: number; total: number }>;
}

interface WeaknessAlertProps {
  examHistory: ExamHistoryEntry[];
  language: Language;
}

export function computeWeakestCategory(
  examHistory: ExamHistoryEntry[],
): { category: string; avgScore: number } | null {
  if (examHistory.length < 2) return null;

  const categoryScores: Record<string, { totalCorrect: number; totalQuestions: number }> = {};

  for (const entry of examHistory) {
    if (!entry.categoryBreakdown) continue;
    for (const [cat, data] of Object.entries(entry.categoryBreakdown)) {
      if (!categoryScores[cat]) {
        categoryScores[cat] = { totalCorrect: 0, totalQuestions: 0 };
      }
      categoryScores[cat].totalCorrect += data.correct;
      categoryScores[cat].totalQuestions += data.total;
    }
  }

  let weakest: { category: string; avgScore: number } | null = null;

  for (const [cat, data] of Object.entries(categoryScores)) {
    if (data.totalQuestions === 0) continue;
    const avg = (data.totalCorrect / data.totalQuestions) * 100;
    if (avg < 60 && (!weakest || avg < weakest.avgScore)) {
      weakest = { category: cat, avgScore: Math.round(avg) };
    }
  }

  return weakest;
}

export default function WeaknessAlert({ examHistory, language }: WeaknessAlertProps) {
  const navigate = useNavigate();
  const weakness = computeWeakestCategory(examHistory);

  if (!weakness) return null;

  const categoryLabel =
    CATEGORY_LABELS[language]?.[weakness.category as Category] || weakness.category;

  return (
    <Alert variant="destructive" className="mb-6 border-destructive/30 bg-destructive/5">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="font-bold">Catégorie à renforcer</AlertTitle>
      <AlertDescription className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Votre score en <strong>{categoryLabel}</strong> est de {weakness.avgScore}%.
          Essayez un entraînement ciblé !
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/quiz?mode=training&category=${weakness.category}`)}
          className="shrink-0"
        >
          Pratiquer {categoryLabel}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
