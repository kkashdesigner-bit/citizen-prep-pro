import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowLeft, PlayCircle } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import SubscriptionGate from '@/components/SubscriptionGate';
import LearnSidebar from '@/components/learn/LearnSidebar';
import { useState } from 'react';
import { Category, DB_CATEGORIES, CATEGORY_LABELS } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ExamsPage() {
  const navigate = useNavigate();
  const { isStandardOrAbove, isPremium } = useSubscription();
  const { language, t } = useLanguage();
  const [showGate, setShowGate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

  const handleStartExam = () => {
    if (!isStandardOrAbove) {
      setShowGate(true);
      return;
    }
    const url = selectedCategory === 'all'
      ? '/quiz?mode=exam'
      : `/quiz?mode=exam&category=${encodeURIComponent(selectedCategory)}`;
    navigate(url);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <LearnSidebar />
      <main className="flex-1 md:ml-64 pb-20 md:pb-8">
        <div className="mx-auto max-w-3xl px-4 md:px-8 py-6 md:py-8">
          <Button variant="ghost" size="sm" className="mb-4 gap-2" onClick={() => navigate('/learn')}>
            <ArrowLeft className="h-4 w-4" /> Tableau de bord
          </Button>

          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Examens</h1>
          </div>

          <div className="rounded-2xl border border-border/40 bg-card p-6 mb-4">
            <h2 className="font-semibold text-foreground mb-2">Examen blanc complet</h2>
            <p className="text-sm text-muted-foreground mb-4">20 questions · 45 min · 80% pour réussir</p>

            <div className="mb-6 space-y-2">
              <label className="text-sm font-medium text-foreground block">
                Filtrer par catégorie (Optionnel)
              </label>
              <Select
                value={selectedCategory}
                onValueChange={(val) => setSelectedCategory(val as Category | 'all')}
              >
                <SelectTrigger className="w-full md:w-[320px]">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {DB_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {CATEGORY_LABELS[language as never]?.[cat as never] || cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button className="gap-2" onClick={handleStartExam}>
              <GraduationCap className="h-4 w-4" /> Lancer l'examen
            </Button>
          </div>

          {/* Non-subscribed users see Demo */}
          {!isStandardOrAbove && (
            <div className="rounded-2xl border border-border/40 bg-card p-6">
              <h2 className="font-semibold text-foreground mb-2">Démo gratuite</h2>
              <p className="text-sm text-muted-foreground mb-4">10 questions pour découvrir le format</p>
              <Button variant="outline" className="gap-2" onClick={() => navigate('/quiz?mode=demo')}>
                <PlayCircle className="h-4 w-4" /> Lancer la démo
              </Button>
            </div>
          )}

          {/* Standard users see Upgrade to Premium prompt */}
          {isStandardOrAbove && !isPremium && (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 mt-4">
              <h2 className="font-semibold text-primary mb-2">Passez au Premium !</h2>
              <p className="text-sm text-muted-foreground mb-4">Débloquez toutes les traductions, les statistiques avancées et des guides pour maximiser vos chances de réussite.</p>
              <Button variant="default" className="gap-2" onClick={() => navigate('/#pricing')}>
                Voir les offres Premium
              </Button>
            </div>
          )}
        </div>
      </main>
      <SubscriptionGate open={showGate} onOpenChange={setShowGate} requiredTier="standard" />
    </div>
  );
}
