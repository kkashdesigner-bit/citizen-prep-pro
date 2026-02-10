import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SubscriptionGate from '@/components/SubscriptionGate';
import { Clock, CheckCircle, ArrowLeft, Play } from 'lucide-react';

interface Lesson {
  id: string;
  category: string;
  level: string;
  title: string;
  content: string;
  estimated_minutes: number;
}

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const { isStandardOrAbove, loading: tierLoading } = useSubscription();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [status, setStatus] = useState<string>('not_started');
  const [loading, setLoading] = useState(true);
  const [showGate, setShowGate] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/auth'); return; }

    const fetchLesson = async () => {
      const [lessonRes, progressRes] = await Promise.all([
        supabase.from('lessons').select('*').eq('id', id!).maybeSingle(),
        supabase.from('lesson_progress').select('status').eq('user_id', user.id).eq('lesson_id', id!).maybeSingle(),
      ]);

      if (!lessonRes.data) { navigate('/learn'); return; }
      setLesson(lessonRes.data as Lesson);
      setStatus(progressRes.data?.status || 'not_started');
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
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-primary text-xs">
                {lesson.category}
              </span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground text-xs">
                {lesson.level}
              </span>
            </div>
            <CardTitle className="font-serif text-2xl">{lesson.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none mb-8 whitespace-pre-wrap text-foreground">
              {lesson.content}
            </div>

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
                onClick={() => navigate(`/quiz?mode=study&category=${lesson.category}`)}
              >
                <Play className="h-4 w-4" />
                {t('learn.practice')}
              </Button>
            </div>
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
