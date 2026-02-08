import { useLanguage } from '@/contexts/LanguageContext';
import { Progress } from '@/components/ui/progress';

interface QuizProgressProps {
  current: number;
  total: number;
  answeredCount: number;
}

export default function QuizProgress({ current, total, answeredCount }: QuizProgressProps) {
  const { t } = useLanguage();
  const progress = (answeredCount / total) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>
          {t('quiz.question')} {current} {t('quiz.of')} {total}
        </span>
        <span>{answeredCount}/{total}</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
