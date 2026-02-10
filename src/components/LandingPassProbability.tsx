import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import PassProbabilityRing from '@/components/PassProbabilityRing';
import AnimatedSection from '@/components/AnimatedSection';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { TrendingUp, Target, BarChart3, UserPlus } from 'lucide-react';

interface ExamHistoryEntry {
  score: number;
  totalQuestions: number;
  passed: boolean;
}

export default function LandingPassProbability() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [passProb, setPassProb] = useState(0);
  const [totalExams, setTotalExams] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [loading, setLoading] = useState(true);

  const { ref: ringRef, isVisible: ringVisible } = useScrollAnimation({ threshold: 0.3 });
  const { ref: progressRef, isVisible: progressVisible } = useScrollAnimation({ threshold: 0.3 });

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      const [profileResult, countResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('exam_history, used_questions')
          .eq('id', user.id)
          .maybeSingle(),
        supabase
          .from('questions')
          .select('id', { count: 'exact', head: true }),
      ]);

      if (profileResult.data) {
        const history = (profileResult.data.exam_history as unknown as ExamHistoryEntry[]) || [];
        const usedQuestions = (profileResult.data.used_questions as string[]) || [];
        const totalQ = countResult.count || 0;

        const last5 = history.slice(-5);
        const prob =
          last5.length > 0
            ? Math.round(
                last5.reduce((sum, e) => sum + (e.score / e.totalQuestions) * 100, 0) / last5.length
              )
            : 0;

        const avg =
          history.length > 0
            ? Math.round(
                history.reduce((sum, e) => sum + (e.score / e.totalQuestions) * 100, 0) /
                  history.length
              )
            : 0;

        setPassProb(prob);
        setTotalExams(history.length);
        setAvgScore(avg);
        setProgressPercent(totalQ > 0 ? Math.round((usedQuestions.length / totalQ) * 100) : 0);
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

  // Guest view: sign-up invitation
  if (!user) {
    return (
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container">
          <AnimatedSection>
            <div className="mx-auto max-w-lg glass-card glow-hover p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 shadow-[0_0_20px_hsl(var(--primary)/0.2)]">
                <UserPlus className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mb-2 font-serif text-2xl font-bold text-foreground">
                {t('progress.title')}
              </h2>
              <p className="mb-6 text-muted-foreground">
                {t('progress.subtitleGuest')}
              </p>
              <Button className="btn-glow" onClick={() => navigate('/auth')}>
                {t('progress.createAccount')}
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-secondary/30 py-16 md:py-24">
      <div className="container">
        <AnimatedSection>
          <h2 className="mb-2 text-center font-serif text-3xl font-bold text-foreground md:text-4xl">
            {t('progress.titleAuth')}
          </h2>
          <p className="mb-10 text-center text-muted-foreground">
            {t('progress.subtitleAuth')}
          </p>
        </AnimatedSection>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
          <AnimatedSection delay={100} className="md:col-span-1">
            <div className="glass-card glow-hover flex h-full flex-col items-center justify-center p-6">
              <h3 className="mb-4 text-center font-serif text-lg font-semibold text-foreground">
                {t('progress.passProbability')}
              </h3>
              <div ref={ringRef}>
                <PassProbabilityRing
                  probability={loading ? 0 : passProb}
                  size={140}
                  strokeWidth={12}
                  startAnimation={ringVisible}
                />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {t('progress.basedOnLast5')}
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200} className="md:col-span-2">
            <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { icon: TrendingUp, label: t('progress.examsTaken'), value: loading ? '—' : String(totalExams), delay: 100 },
                { icon: Target, label: t('progress.avgScore'), value: loading ? '—' : `${avgScore}%`, delay: 200 },
                { icon: BarChart3, label: t('progress.officialThreshold'), value: '80%', delay: 300 },
              ].map(({ icon: Icon, label, value, delay }) => (
                <AnimatedSection key={label} delay={delay}>
                  <div className="glass-card glow-hover flex items-center gap-3 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 shadow-[0_0_10px_hsl(var(--primary)/0.15)]">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-xl font-bold text-foreground">{value}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}

              <div className="sm:col-span-3" ref={progressRef}>
                <AnimatedSection delay={400}>
                  <div className="glass-card glow-hover p-5">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('progress.bankProgress')}</span>
                      <span className="font-medium text-foreground">
                        {loading ? '—' : `${progressPercent}%`}
                      </span>
                    </div>
                    <Progress
                      value={progressVisible ? (loading ? 0 : progressPercent) : 0}
                      className="h-3 transition-all duration-1000"
                    />
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
