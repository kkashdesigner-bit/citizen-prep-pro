import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowLeft, Construction } from 'lucide-react';
import LearnSidebar from '@/components/learn/LearnSidebar';

export default function StudyMaterialPage() {
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
            <BookOpen className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Matériel d'étude</h1>
          </div>

          <div className="rounded-2xl border border-border/40 bg-card p-8 text-center">
            <Construction className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">Page en construction</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Les fiches de révision, résumés et supports d'étude seront bientôt disponibles.
            </p>
            <Button variant="outline" onClick={() => navigate('/learn')}>
              Retour au tableau de bord
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
