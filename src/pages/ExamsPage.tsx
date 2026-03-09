import { useNavigate } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { GraduationCap, PlayCircle } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import SubscriptionGate from '@/components/SubscriptionGate';
import LearnSidebar from '@/components/learn/LearnSidebar';
import AppHeader from '@/components/AppHeader';
import { useState } from 'react';

export default function ExamsPage() {
  const navigate = useNavigate();
  const { isStandardOrAbove, isPremium } = useSubscription();
  const [showGate, setShowGate] = useState(false);

  const handleStartExam = () => {
    if (!isStandardOrAbove) {
      setShowGate(true);
      return;
    }
    navigate('/quiz?mode=exam');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <SEOHead
        titleKey="seo.examsTitle"
        descriptionKey="seo.examsDesc"
        path="/exams"
      />
      <LearnSidebar />
      <div className="flex-1 md:ml-64 flex flex-col">
        <AppHeader
          pageTitle="Examens Blancs"
          pageIcon={<GraduationCap className="h-5 w-5" />}
          backTo="/learn"
          backLabel="Tableau de bord"
        />
        <main className="flex-1 pb-20 md:pb-8">
          <div className="mx-auto max-w-3xl px-4 md:px-8 py-6 md:py-8">
            <div className="rounded-2xl border border-border/40 bg-card p-6 mb-4">
              <h2 className="font-semibold text-foreground mb-2">Examen blanc complet</h2>
              <p className="text-sm text-muted-foreground mb-2">40 questions · 45 min · 80% pour réussir</p>
              <p className="text-xs text-muted-foreground mb-4">Les questions d'examen sont tirées d'une banque de plus de 10 000 questions.</p>
              <Button className="gap-2" onClick={handleStartExam}>
                <GraduationCap className="h-4 w-4" /> Lancer l'examen
              </Button>
            </div>

            {/* Non-subscribed users see Demo */}
            {!isStandardOrAbove && (
              <div className="rounded-2xl border border-border/40 bg-card p-6">
                <h2 className="font-semibold text-foreground mb-2">Démo gratuite</h2>
                <p className="text-sm text-muted-foreground mb-4">20 questions pour découvrir le format</p>
                <Button variant="outline" className="gap-2" onClick={() => navigate('/quiz?mode=demo')}>
                  <PlayCircle className="h-4 w-4" /> Lancer la démo
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
      <SubscriptionGate open={showGate} onOpenChange={setShowGate} requiredTier="standard" featureLabel="Examens blancs illimités" />
    </div>
  );
}

