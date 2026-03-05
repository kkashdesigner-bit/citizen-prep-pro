import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSubscription } from '@/hooks/useSubscription';
import { CATEGORY_LABELS, Category } from '@/lib/types';
import { AlertTriangle, ArrowRight, Target, Lock } from 'lucide-react';
import SubscriptionGate from '@/components/SubscriptionGate';

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
  const { isPremium } = useSubscription();
  const [showGate, setShowGate] = useState(false);
  const [gateLabel, setGateLabel] = useState('');

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
    if (data.total < 2) return;
    const acc = data.correct / data.total;
    if (!weakest || acc < weakest.accuracy) {
      weakest = { category: cat, accuracy: acc };
    }
  });

  // Detect recent performance drop
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

  const handlePractice = (mode: 'study' | 'training') => {
    if (!isPremium) {
      setGateLabel(`Entraînement ciblé — ${catLabel}`);
      setShowGate(true);
      return;
    }
    navigate(`/quiz?mode=${mode}&category=${weakest!.category}`);
  };

  return (
    <>
      <div className="mb-6 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 md:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/15">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground">
              Focus : {catLabel}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Votre précision dans ce domaine est de {accPct}%.
              {recentDrop && ' Vos scores récents montrent une tendance à la baisse.'}
              {' '}Révisez ce domaine pour améliorer vos chances.
            </p>
            <div className="flex gap-2 mt-3 flex-wrap">
              <Button
                size="sm"
                variant="destructive"
                className="gap-1.5"
                onClick={() => handlePractice('study')}
              >
                {!isPremium && <Lock className="h-3 w-3" />}
                <Target className="h-3.5 w-3.5" />
                Réviser les leçons
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              {isPremium && (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  onClick={() => handlePractice('training')}
                >
                  Entraînement ciblé
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <SubscriptionGate
        open={showGate}
        onOpenChange={setShowGate}
        requiredTier="premium"
        featureLabel={gateLabel}
      />
    </>
  );
}
