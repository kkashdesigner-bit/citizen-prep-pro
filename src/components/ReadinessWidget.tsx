import { ReadinessScore } from '@/lib/exam-prediction';
import { Badge } from '@/components/ui/badge';

interface ReadinessWidgetProps {
  readiness: ReadinessScore;
}

export default function ReadinessWidget({ readiness }: ReadinessWidgetProps) {
  return (
    <div className="bg-gradient-to-r from-[#0055A4] to-[#1B6ED6] text-white rounded-2xl p-6">
      <p className="text-sm font-medium opacity-80 mb-1">Score pr&eacute;vu aujourd'hui</p>
      <div className="flex items-end gap-2 mb-3">
        <span className="text-5xl font-bold">{readiness.predictedScore}</span>
        <span className="text-xl opacity-70 pb-1">/40</span>
        <Badge className={`ml-2 border-0 ${
          readiness.willPass
            ? 'bg-emerald-400 text-emerald-900'
            : 'bg-red-400 text-red-900'
        }`}>
          {readiness.willPass
            ? '\u2713 Pr\u00eat \u00e0 passer'
            : `${readiness.gapToPass} question${readiness.gapToPass > 1 ? 's' : ''} manquante${readiness.gapToPass > 1 ? 's' : ''}`
          }
        </Badge>
      </div>
      {readiness.weakestThemes.length > 0 && (
        <p className="text-sm opacity-80">
          Concentrez-vous sur : {readiness.weakestThemes.join(', ')}
        </p>
      )}
      {readiness.confidenceLevel === 'low' && (
        <p className="text-xs opacity-60 mt-2">
          Faites plus de quiz pour am&eacute;liorer la pr&eacute;cision de cette estimation.
        </p>
      )}
    </div>
  );
}
