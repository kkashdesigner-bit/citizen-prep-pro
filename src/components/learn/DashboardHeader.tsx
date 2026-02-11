import { useLanguage } from '@/contexts/LanguageContext';
import { Bell } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface DashboardHeaderProps {
  firstName: string;
  avatarUrl?: string | null;
  mastery: number;
  streak: number;
  xp: number;
}

export default function DashboardHeader({ firstName, avatarUrl, mastery, streak, xp }: DashboardHeaderProps) {
  const { t } = useLanguage();
  const initials = firstName.slice(0, 2).toUpperCase();

  return (
    <div className="mb-6 md:mb-8">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {t('learn.welcome').replace('{name}', firstName)} 👋
          </h1>
          <p className="mt-1 text-sm md:text-base text-muted-foreground">
            {t('learn.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative rounded-xl p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <Bell className="h-5 w-5" />
          </button>
          <Avatar className="h-9 w-9 border border-border">
            <AvatarFallback className="bg-primary/15 text-primary text-sm font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <StatCard label="Mastery" value={`${mastery}%`} icon="📊" />
        <StatCard label="Streak" value={`${streak}d`} icon="🔥" />
        <StatCard label="XP" value={`${xp}`} icon="⭐" />
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-white p-3 md:p-4 text-center shadow-[0_4px_12px_hsl(225,48%,25%/0.05)] transition-all hover:border-secondary/40 hover:shadow-[0_8px_24px_hsl(225,48%,25%/0.1)] hover:-translate-y-0.5">
      <span className="text-lg md:text-xl">{icon}</span>
      <p className="mt-1 text-lg md:text-2xl font-bold text-foreground">{value}</p>
      <p className="text-[11px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
    </div>
  );
}
