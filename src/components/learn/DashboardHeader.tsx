import { useLanguage } from '@/contexts/LanguageContext';
import { Target, BarChart3, Flame, Star, Hand } from 'lucide-react';

interface DashboardHeaderProps {
  firstName: string;
  avatarUrl?: string | null;
  mastery: number;
  streak: number;
  xp: number;
  goalLabel?: string | null;
}

export default function DashboardHeader({ firstName, avatarUrl, mastery, streak, xp, goalLabel }: DashboardHeaderProps) {
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

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <StatCard label="Mastery" value={`${mastery}%`} icon={<BarChart3 className="h-5 w-5 text-primary" />} />
        <StatCard label="Streak" value={`${streak}d`} icon={<Flame className="h-5 w-5 text-destructive" />} />
        <StatCard label="XP" value={`${xp}`} icon={<Star className="h-5 w-5 text-secondary" />} />
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-3 md:p-4 text-center shadow-[0_4px_12px_hsl(225,48%,25%/0.05)] transition-all hover:border-secondary/40 hover:shadow-[0_8px_24px_hsl(225,48%,25%/0.1)] hover:-translate-y-0.5">
      <div className="flex justify-center">{icon}</div>
      <p className="mt-1 text-lg md:text-2xl font-bold text-foreground">{value}</p>
      <p className="text-[11px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
    </div>
  );
}
