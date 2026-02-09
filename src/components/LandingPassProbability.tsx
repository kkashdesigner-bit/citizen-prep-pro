import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import PassProbabilityRing from '@/components/PassProbabilityRing';
import AnimatedSection from '@/components/AnimatedSection';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { TrendingUp, Target, BarChart3 } from 'lucide-react';

interface ExamHistoryEntry {
  score: number;
  totalQuestions: number;
  passed: boolean;
}

export default function LandingPassProbability() {
  const { user } = useAuth();
  const [passProb, setPassProb] = useState(0);
  const [totalExams, setTotalExams] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [loading, setLoading] = useState(true);

  const { ref: ringRef, isVisible: ringVisible } = useScrollAnimation({ threshold: 0.3 });
  const { ref: progressRef, isVisible: progressVisible } = useScrollAnimation({ threshold: 0.3 });

  useEffect(() => {
    if (!user) {
      setPassProb(75);
      setTotalExams(12);
      setAvgScore(78);
      setProgressPercent(50);
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

  const isDemo = !user;

  return (
    <section className="bg-secondary/30 py-16 md:py-24">
      <div className="container">
        <AnimatedSection>
          <h2 className="mb-2 text-center font-serif text-3xl font-bold text-foreground md:text-4xl">
            {isDemo ? 'Suivez votre progression' : 'Votre progression'}
          </h2>
          <p className="mb-10 text-center text-muted-foreground">
            {isDemo
              ? 'Connectez-vous pour voir vos vraies statistiques'
              : "Basée sur vos résultats d'examens"}
          </p>
        </AnimatedSection>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
          <AnimatedSection delay={100} className="md:col-span-1">
            <div className="glass-card glow-hover flex h-full flex-col items-center justify-center p-6">
              <h3 className="mb-4 text-center font-serif text-lg font-semibold text-foreground">
                Pass Probability
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
                Basée sur les 5 derniers examens
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200} className="md:col-span-2">
            <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { icon: TrendingUp, label: 'Examens passés', value: loading ? '—' : String(totalExams), delay: 100 },
                { icon: Target, label: 'Score moyen', value: loading ? '—' : `${avgScore}%`, delay: 200 },
                { icon: BarChart3, label: 'Seuil officiel', value: '80%', delay: 300 },
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
                      <span className="text-muted-foreground">Progression dans la banque</span>
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
