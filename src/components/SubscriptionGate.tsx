import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Award, BookOpen, CheckCircle, Sparkles, Target, Shield, Languages, PlayCircle } from 'lucide-react';

interface SubscriptionGateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requiredTier?: 'tier_1' | 'tier_2';
}

const TIER_1_FEATURES = [
  { icon: BookOpen, text: 'Mode étude avec explications détaillées' },
  { icon: Award, text: 'Examens illimités sans répétition' },
  { icon: CheckCircle, text: 'Suivi de progression personnalisé' },
  { icon: Target, text: 'Entraînement par catégorie ciblé' },
  { icon: Shield, text: 'Niveaux CR et Naturalisation' },
];

const TIER_2_FEATURES = [
  { icon: Languages, text: 'Traduction des questions en temps réel' },
  { icon: PlayCircle, text: 'Guides vidéo premium' },
  { icon: BookOpen, text: 'Outils d\'étude avancés' },
  { icon: CheckCircle, text: 'Tous les avantages Tier 1 inclus' },
];

export default function SubscriptionGate({ open, onOpenChange, requiredTier = 'tier_1' }: SubscriptionGateProps) {
  const navigate = useNavigate();
  const isTier2 = requiredTier === 'tier_2';
  const features = isTier2 ? TIER_2_FEATURES : TIER_1_FEATURES;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg glass-card border-border/50 bg-card/95 backdrop-blur-2xl">
        {/* Classified stamp */}
        <div className="absolute top-4 right-12 rotate-12 border-2 border-destructive/40 px-3 py-1 rounded">
          <span className="text-xs font-bold uppercase tracking-widest text-destructive/60">
            Classifié
          </span>
        </div>

        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 shadow-[0_0_30px_hsl(var(--primary)/0.3)]">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-center font-serif text-2xl text-foreground">
            {isTier2
              ? 'Débloquez les outils premium !'
              : 'Vous avez le potentiel pour réussir !'}
          </DialogTitle>
        </DialogHeader>

        <p className="text-center text-muted-foreground">
          {isTier2
            ? 'Passez au Tier 2 pour accéder aux traductions, guides vidéo et outils avancés.'
            : 'Débloquez l\'accès illimité et le mode étude pour maximiser vos chances de réussite à l\'examen civique.'}
        </p>

        <div className="my-4 space-y-3">
          {features.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <Icon className="h-5 w-5 shrink-0 text-primary" />
              <span className="text-sm text-foreground">{text}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card cursor-pointer p-4 text-center transition-all hover:border-primary/50 glow-hover">
            <p className="text-sm text-muted-foreground">Mensuel</p>
            <p className="font-serif text-2xl font-bold text-foreground">
              {isTier2 ? '9,99 €' : '6,99 €'}
            </p>
            <p className="text-xs text-muted-foreground">/mois</p>
          </div>
          <div className="glass-card cursor-pointer p-4 text-center border-primary/50 shadow-[0_0_20px_hsl(var(--primary)/0.15)]">
            <p className="text-sm font-medium text-primary">Populaire</p>
            <p className="font-serif text-2xl font-bold text-foreground">
              {isTier2 ? '12,99 €' : '30,99 €'}
            </p>
            <p className="text-xs text-muted-foreground">/6 mois</p>
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-2">
          <Button
            size="lg"
            className="w-full pulse-unlock shine-border btn-glow"
            onClick={() => { onOpenChange(false); navigate('/#pricing'); }}
          >
            {isTier2 ? 'Passer au Tier 2' : 'Débloquer l\'accès — 6,99 €/mois'}
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => onOpenChange(false)}>
            Peut-être plus tard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
