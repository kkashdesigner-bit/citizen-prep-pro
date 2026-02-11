import { useLanguage } from '@/contexts/LanguageContext';
import { CATEGORY_LABELS, Category } from '@/lib/types';
import { Clock, Trophy, BookOpen } from 'lucide-react';

interface ExamHistoryEntry {
  date: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  timeSpent?: number;
  categoryBreakdown?: Record<string, { correct: number; total: number }>;
}

interface LessonProgress {
  lesson_id: string;
  status: string;
  score_last: number | null;
}

interface Lesson {
  id: string;
  title: string;
  category: string;
}

interface RecentActivityProps {
  examHistory: ExamHistoryEntry[];
  lessons: Lesson[];
  progress: LessonProgress[];
}

export default function RecentActivity({ examHistory, lessons, progress }: RecentActivityProps) {
  const { language } = useLanguage();

  const lastExam = examHistory.length > 0 ? examHistory[examHistory.length - 1] : null;

  // Find last completed lesson
  const completedProgress = progress.filter(p => p.status === 'completed');
  const lastCompletedLesson = completedProgress.length > 0
    ? lessons.find(l => l.id === completedProgress[completedProgress.length - 1]?.lesson_id)
    : null;

  // Find interrupted (in_progress) session
  const inProgressEntry = progress.find(p => p.status === 'in_progress');
  const interruptedLesson = inProgressEntry
    ? lessons.find(l => l.id === inProgressEntry.lesson_id)
    : null;

  const items: { icon: React.ElementType; iconClass: string; label: string; detail: string }[] = [];

  if (lastExam) {
    const pct = Math.round((lastExam.score / lastExam.totalQuestions) * 100);
    items.push({
      icon: Trophy,
      iconClass: lastExam.passed ? 'text-primary' : 'text-destructive',
      label: 'Last Exam',
      detail: `${pct}% — ${lastExam.passed ? 'Passed' : 'Failed'}`,
    });
  }

  if (lastCompletedLesson) {
    items.push({
      icon: BookOpen,
      iconClass: 'text-primary',
      label: 'Completed Module',
      detail: lastCompletedLesson.title,
    });
  }

  if (interruptedLesson) {
    items.push({
      icon: Clock,
      iconClass: 'text-[hsl(var(--warning))]',
      label: 'In Progress',
      detail: interruptedLesson.title,
    });
  }

  if (items.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg md:text-xl font-bold text-foreground">Recent Activity</h2>
      <div className="space-y-2">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-3 md:p-4 transition-all hover:border-primary/20"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <Icon className={`h-4 w-4 ${item.iconClass}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-medium text-foreground truncate">{item.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
