import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Award, BookOpen, CheckCircle, Sparkles } from 'lucide-react';

interface SubscriptionGateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SubscriptionGate({ open, onOpenChange }: SubscriptionGateProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-center font-serif text-2xl">
            Vous avez le potentiel pour réussir !
          </DialogTitle>
        </DialogHeader>

        <p className="text-center text-muted-foreground">
          Débloquez l'accès illimité et le mode étude pour maximiser vos chances de réussite à
          l'examen civique.
        </p>

        <div className="my-4 space-y-3">
          {[
            { icon: BookOpen, text: 'Mode étude avec explications détaillées' },
            { icon: Award, text: 'Examens illimités sans répétition' },
            { icon: CheckCircle, text: 'Suivi de progression personnalisé' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <Icon className="h-5 w-5 shrink-0 text-primary" />
              <span className="text-sm text-foreground">{text}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="cursor-pointer border-2 transition-colors hover:border-primary">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Mensuel</p>
              <p className="font-serif text-2xl font-bold text-foreground">6,99 €</p>
              <p className="text-xs text-muted-foreground">/mois</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer border-2 border-primary">
            <CardContent className="p-4 text-center">
              <p className="text-sm font-medium text-primary">Populaire</p>
              <p className="font-serif text-2xl font-bold text-foreground">30,99 €</p>
              <p className="text-xs text-muted-foreground">/6 mois</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-2 flex flex-col gap-2">
          <Button size="lg" className="w-full" onClick={() => navigate('/auth')}>
            Débloquer l'accès — 6,99 €/mois
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Peut-être plus tard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
