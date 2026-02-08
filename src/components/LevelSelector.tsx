import { ExamLevel, EXAM_LEVEL_LABELS } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Shield, Award, Crown } from 'lucide-react';

interface LevelSelectorProps {
  selectedLevel: ExamLevel;
  onSelect: (level: ExamLevel) => void;
  isSubscribed: boolean;
}

const LEVEL_ICONS: Record<ExamLevel, React.ElementType> = {
  CSP: Shield,
  CR: Award,
  Naturalisation: Crown,
};

export default function LevelSelector({ selectedLevel, onSelect, isSubscribed }: LevelSelectorProps) {
  const levels: ExamLevel[] = ['CSP', 'CR', 'Naturalisation'];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {levels.map((level) => {
        const Icon = LEVEL_ICONS[level];
        const info = EXAM_LEVEL_LABELS[level];
        const isLocked = !isSubscribed && level !== 'CSP';
        const isSelected = selectedLevel === level;

        return (
          <Card
            key={level}
            className={`cursor-pointer border-2 transition-all ${
              isSelected
                ? 'border-primary bg-primary/5'
                : isLocked
                ? 'border-border opacity-60'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => {
              if (!isLocked) onSelect(level);
            }}
          >
            <CardContent className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="font-bold text-foreground">{info.name}</span>
                </div>
                {isLocked ? (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                ) : (
                  isSelected && (
                    <Badge variant="default" className="text-xs">
                      Sélectionné
                    </Badge>
                  )
                )}
              </div>
              <p className="text-xs text-muted-foreground">{info.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
