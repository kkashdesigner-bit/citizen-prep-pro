import { useLanguage } from '@/contexts/LanguageContext';
import { Target, Hand } from 'lucide-react';

interface DashboardHeaderProps {
  firstName: string;
  goalLabel?: string | null;
}

export default function DashboardHeader({ firstName, goalLabel }: DashboardHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="mb-6 md:mb-8">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            {t('learn.welcome').replace('{name}', firstName)}
            <Hand className="h-6 w-6 text-primary animate-bounce" />
          </h1>
          <p className="mt-1 text-sm md:text-base text-muted-foreground">
            {t('learn.subtitle')}
          </p>
        </div>
      </div>

      {/* Persona goal badge */}
      {goalLabel && (
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
          <Target className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-primary">Objectif : {goalLabel}</span>
        </div>
      )}
    </div>
  );
}
