import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { Play, ArrowRight, Zap, BookOpen, GraduationCap, LogIn } from 'lucide-react';

interface ActionCardsProps {
  nextLesson?: { id: string; title: string; category: string; estimated_minutes: number } | null;
  isStandardOrAbove: boolean;
  onGate: (tier: 'standard' | 'premium') => void;
  /** Exam level derived from user persona (e.g., 'Naturalisation', 'CR', 'CSP') */
  personaLevel?: string;
  examHistory?: any[];
}

export default function ActionCards({ nextLesson, isStandardOrAbove, onGate, personaLevel = 'CSP', examHistory }: ActionCardsProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();

  // Logged-out prompt
  if (!user) {
    return (
      <div className="mb-8 rounded-2xl border border-border/40 bg-card p-6 text-center">
        <LogIn className="mx-auto h-10 w-10 text-primary mb-3" />
        <h3 className="text-lg font-bold text-foreground mb-1">Create an account to start learning</h3>
        <p className="text-sm text-muted-foreground mb-4">Track your progress, take exams, and access the full curriculum.</p>
        <Button className="gap-2" onClick={() => navigate('/auth')}>
          Sign Up
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {/* Resume Learning */}
      <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-[hsl(225,48%,25%)] p-5 md:p-6 transition-all hover:shadow-[0_8px_24px_hsl(225,48%,25%,0.12)]">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-semibold text-white">{t('learn.continueLearning')}</h3>
        </div>

        {nextLesson ? (
          <>
            <div className="rounded-lg bg-white/10 border border-white/20 p-3 mb-4">
              <p className="text-xs text-white/70 mb-1">{nextLesson.category} · {nextLesson.estimated_minutes} min</p>
              <p className="text-sm font-medium text-white">{nextLesson.title}</p>
            </div>
            <Button
              className="w-full gap-2 bg-white text-primary hover:bg-white/95"
              onClick={() => {
                if (!isStandardOrAbove) { onGate('standard'); return; }
                navigate(`/lesson/${nextLesson.id}`);
              }}
            >
              <Play className="h-4 w-4" />
              {t('learn.resume')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-white/70">{t('learn.allCompleted')}</p>
          </div>
        )}
      </div>

      {/* Quick Practice */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 md:p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/15">
            <Zap className="h-4 w-4 text-secondary" />
          </div>
          <h3 className="font-semibold text-foreground">Pratique rapide</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          10 questions aléatoires de tous les domaines.
        </p>
        <Button
          variant="outline"
          className="w-full gap-2 font-semibold"
          onClick={() => navigate('/quiz?mode=demo&limit=10')}
        >
          <Zap className="h-4 w-4" />
          Commencer
        </Button>
      </div>

      {/* Take Exam */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 md:p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <GraduationCap className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">{t('learn.fullExam')}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          20 questions · 45 min · 80% to pass
        </p>
        {personaLevel && personaLevel !== 'CSP' && (
          <p className="text-xs text-primary/70 font-medium mb-3">Niveau : {personaLevel}</p>
        )}
        <Button
          className="w-full gap-2 font-semibold"
          onClick={() => {
            const today = new Date().toISOString().split('T')[0];
            const examsToday = examHistory?.filter((e: any) => e.date?.startsWith(today)).length || 0;

            if (!isStandardOrAbove && examsToday >= 1) {
              onGate('standard');
              return;
            }
            navigate(`/quiz?mode=exam&level=${personaLevel}`);
          }}
        >
          <GraduationCap className="h-4 w-4" />
          {t('learn.fullExam')}
        </Button>
      </div>
    </div>
  );
}
