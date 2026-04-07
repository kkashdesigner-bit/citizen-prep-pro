import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface RevisionCardProps {
  wrongQuestionsCount: number;
  isStandardOrAbove: boolean;
  onGate: () => void;
}

export default function RevisionCard({ wrongQuestionsCount, isStandardOrAbove, onGate }: RevisionCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (wrongQuestionsCount === 0) return null;

  const handleStartRevision = async () => {
    if (!isStandardOrAbove) { onGate(); return; }
    if (!user) return;

    setLoading(true);
    try {
      // Fetch all wrong question IDs
      const { data: wrongData } = await supabase
        .from('user_answers' as any)
        .select('question_id')
        .eq('user_id', user.id)
        .eq('is_correct', false);

      const { data: correctData } = await supabase
        .from('user_answers' as any)
        .select('question_id')
        .eq('user_id', user.id)
        .eq('is_correct', true);

      const correctIds = new Set((correctData || []).map((r: any) => r.question_id));
      const wrongIds: number[] = [...new Set(
        (wrongData || [])
          .map((r: any) => r.question_id)
          .filter((id: number) => id != null && !correctIds.has(id))
      )];

      if (wrongIds.length === 0) { setLoading(false); return; }

      // Shuffle and cap at 20 per session
      const shuffled = wrongIds.sort(() => Math.random() - 0.5).slice(0, 20);
      sessionStorage.setItem('retakeQuestionIds', JSON.stringify(shuffled));
      navigate('/quiz?mode=training&retake=1');
    } catch {
      setLoading(false);
    }
  };

  const sessionCount = Math.min(wrongQuestionsCount, 20);

  return (
    <div className="mb-6 rounded-2xl border border-[#ef4444]/20 bg-[#ef4444]/5 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-[#ef4444]/10 flex items-center justify-center">
          <RotateCcw className="h-5 w-5 text-[#ef4444]" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-[var(--dash-text)]">
            Révision des erreurs
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-[#ef4444]/15 text-[#ef4444] text-xs font-bold">
              {wrongQuestionsCount} question{wrongQuestionsCount > 1 ? 's' : ''}
            </span>
          </p>
          <p className="text-sm text-[var(--dash-text-muted)] mt-0.5">
            Questions que vous avez ratées et jamais réussies — entraînez-vous dessus.
          </p>
        </div>
      </div>
      <Button
        onClick={handleStartRevision}
        disabled={loading}
        className="shrink-0 bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold rounded-xl h-10 px-5 shadow-sm gap-2 transition-all"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Réviser ({sessionCount})
          </>
        )}
      </Button>
    </div>
  );
}
