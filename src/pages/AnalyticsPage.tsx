import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart3, ArrowLeft } from 'lucide-react';
import LearnSidebar from '@/components/learn/LearnSidebar';

export default function AnalyticsPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-background">
      <LearnSidebar />
      <main className="flex-1 md:ml-64 pb-20 md:pb-8">
        <div className="mx-auto max-w-3xl px-4 md:px-8 py-6 md:py-8">
          <Button variant="ghost" size="sm" className="mb-4 gap-2" onClick={() => navigate('/learn')}>
            <ArrowLeft className="h-4 w-4" /> Tableau de bord
          </Button>

          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Analyses</h1>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Pour une vue détaillée de votre progression, consultez la page Progression.
          </p>

          <Button className="gap-2" onClick={() => navigate('/progress')}>
            <BarChart3 className="h-4 w-4" /> Voir ma progression
          </Button>
        </div>
      </main>
    </div>
  );
}
