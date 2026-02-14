import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SubscriptionGate from '@/components/SubscriptionGate';
import { Clock, CheckCircle, ArrowLeft, ArrowRight, Play, BookOpen, Lightbulb } from 'lucide-react';

interface Lesson {
  id: string;
  category: string;
  level: string;
  title: string;
  content: string;
  estimated_minutes: number;
  order_index: number;
}

/** Very lightweight markdown-ish renderer */
function renderContent(content: string) {
  return content.split('\n').map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('### ')) {
      return <h3 key={i} className="mt-6 mb-2 text-lg font-bold text-foreground">{trimmed.slice(4)}</h3>;
    }
    if (trimmed.startsWith('## ')) {
      return <h2 key={i} className="mt-8 mb-3 text-xl font-bold text-foreground">{trimmed.slice(3)}</h2>;
    }
    if (trimmed.startsWith('# ')) {
      return <h1 key={i} className="mt-8 mb-3 text-2xl font-bold text-foreground">{trimmed.slice(2)}</h1>;
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      return (
        <li key={i} className="ml-4 list-disc text-sm text-foreground/90 leading-relaxed">
          {renderInline(trimmed.slice(2))}
        </li>
      );
    }
    if (trimmed === '') return <div key={i} className="h-2" />;
    return <p key={i} className="text-sm text-foreground/90 leading-relaxed">{renderInline(trimmed)}</p>;
  });
}

function renderInline(text: string) {
  // Bold
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold text-foreground">{part}</strong> : part
  );
}

/** Extract key points from content (lines starting with "- " after a "Key Points" heading) */
function extractKeyPoints(content: string): string[] {
  const lines = content.split('\n');
  const points: string[] = [];
  let inKeySection = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^#{1,3}\s.*(?:key|point|résumé|essentiel|retenir)/i.test(trimmed)) {
      inKeySection = true;
      continue;
    }
    if (inKeySection && (trimmed.startsWith('- ') || trimmed.startsWith('* '))) {
      points.push(trimmed.slice(2));
    } else if (inKeySection && trimmed.startsWith('#')) {
      break; // new heading = end key section
    }
  }
  return points;
}

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const { isStandardOrAbove, loading: tierLoading } = useSubscription();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  const [status, setStatus] = useState<string>('not_started');
  const [loading, setLoading] = useState(true);
  const [showGate, setShowGate] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/auth'); return; }

    const fetchLesson = async () => {
      const [lessonRes, allLessonsRes, progressRes] = await Promise.all([
        supabase.from('lessons').select('*').eq('id', id!).maybeSingle(),
        supabase.from('lessons').select('id, category, level, title, estimated_minutes, order_index, content').order('order_index'),
        supabase.from('lesson_progress').select('status, score_last').eq('user_id', user.id).eq('lesson_id', id!).maybeSingle(),
      ]);

      if (!lessonRes.data) { navigate('/learn'); return; }
      const currentLesson = lessonRes.data as Lesson;
      setLesson(currentLesson);
      setStatus(progressRes.data?.status || 'not_started');

      // Find next lesson
      const allLessons = (allLessonsRes.data || []) as Lesson[];
      const currentIdx = allLessons.findIndex(l => l.id === id);
      if (currentIdx >= 0 && currentIdx < allLessons.length - 1) {
        setNextLesson(allLessons[currentIdx + 1]);
      }
      setLoading(false);
    };
    fetchLesson();
  }, [id, user, authLoading, navigate]);

  useEffect(() => {
    if (!tierLoading && !isStandardOrAbove) {
      setShowGate(true);
    }
  }, [tierLoading, isStandardOrAbove]);

  const handleMarkComplete = async () => {
    if (!user || !lesson) return;
    const { error } = await supabase
      .from('lesson_progress')
      .upsert(
        { user_id: user.id, lesson_id: lesson.id, status: 'completed' },
        { onConflict: 'user_id,lesson_id' }
      );
    if (!error) setStatus('completed');
  };

  if (authLoading || loading || tierLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container flex items-center justify-center py-20">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!lesson) return null;

  const keyPoints = extractKeyPoints(lesson.content);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-3xl py-8">
        <Button variant="ghost" className="mb-4 gap-2" onClick={() => navigate('/learn')}>
          <ArrowLeft className="h-4 w-4" />
          {t('learn.backToLearn')}
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Clock className="h-4 w-4" />
              {lesson.estimated_minutes} min
              <Badge variant="secondary" className="ml-2">{lesson.category}</Badge>
              <Badge variant="outline">{lesson.level}</Badge>
            </div>
            <CardTitle className="font-serif text-2xl">{lesson.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Main content */}
            <div className="mb-8">
              {renderContent(lesson.content)}
            </div>

            {/* Key points summary */}
            {keyPoints.length > 0 && (
              <div className="mb-8 rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Points clés</h3>
                </div>
                <ul className="space-y-2">
                  {keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              {status === 'completed' ? (
                <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-primary">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">{t('learn.completed')}</span>
                </div>
              ) : (
                <Button className="btn-glow gap-2" onClick={handleMarkComplete}>
                  <CheckCircle className="h-4 w-4" />
                  {t('learn.markComplete')}
                </Button>
              )}
              <Button
                variant="outline"
                className="gap-2 glow-hover"
                onClick={() => navigate(`/quiz?mode=study&category=${lesson.category}&mini=1`)}
              >
                <Play className="h-4 w-4" />
                Mini Quiz
              </Button>
            </div>

            {/* Next lesson suggestion */}
            {status === 'completed' && nextLesson && (
              <div className="mt-6 rounded-xl border border-border/50 bg-card p-4">
                <p className="text-xs text-muted-foreground mb-2">Leçon suivante</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{nextLesson.title}</p>
                      <p className="text-xs text-muted-foreground">{nextLesson.category} · {nextLesson.estimated_minutes} min</p>
                    </div>
                  </div>
                  <Button size="sm" className="gap-1.5" onClick={() => navigate(`/lesson/${nextLesson.id}`)}>
                    Continuer
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
      <SubscriptionGate open={showGate} onOpenChange={(open) => {
        setShowGate(open);
        if (!open && !isStandardOrAbove) navigate('/learn');
      }} requiredTier="standard" />
    </div>
  );
}
