import { useLanguage } from '@/contexts/LanguageContext';
import { Clock } from 'lucide-react';

interface QuizTimerProps {
  timeRemaining: number;
}

export default function QuizTimer({ timeRemaining }: QuizTimerProps) {
  const { t } = useLanguage();
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isLow = timeRemaining < 300; // 5 minutes

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border-2 px-4 py-2 font-mono text-lg font-bold ${
        isLow
          ? 'border-destructive bg-destructive/10 text-destructive animate-pulse'
          : 'border-border bg-card text-foreground'
      }`}
    >
      <Clock className="h-5 w-5" />
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
