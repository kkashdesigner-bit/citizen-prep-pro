import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
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

export default function SubscriptionGate({ open, onOpenChange, requiredTier = 'tier_1' }: SubscriptionGateProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isTier2 = requiredTier === 'tier_2';

  const TIER_1_FEATURES = [
    { icon: BookOpen, key: 'gate.feat1' },
    { icon: Award, key: 'gate.feat2' },
    { icon: CheckCircle, key: 'gate.feat3' },
    { icon: Target, key: 'gate.feat4' },
    { icon: Shield, key: 'gate.feat5' },
  ];

  const TIER_2_FEATURES = [
    { icon: Languages, key: 'gate.feat6' },
    { icon: PlayCircle, key: 'gate.feat7' },
    { icon: BookOpen, key: 'gate.feat8' },
    { icon: CheckCircle, key: 'gate.feat9' },
  ];

  const features = isTier2 ? TIER_2_FEATURES : TIER_1_FEATURES;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg glass-card border-border/50 bg-card/95 backdrop-blur-2xl">
        <div className="absolute top-4 right-12 rotate-12 border-2 border-destructive/40 px-3 py-1 rounded">
          <span className="text-xs font-bold uppercase tracking-widest text-destructive/60">
            {t('gate.classified')}
          </span>
        </div>

        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 shadow-[0_0_30px_hsl(var(--primary)/0.3)]">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-center font-serif text-2xl text-foreground">
            {isTier2 ? t('gate.tier2Title') : t('gate.tier1Title')}
          </DialogTitle>
        </DialogHeader>

        <p className="text-center text-muted-foreground">
          {isTier2 ? t('gate.tier2Desc') : t('gate.tier1Desc')}
        </p>

        <div className="my-4 space-y-3">
          {features.map(({ icon: Icon, key }) => (
            <div key={key} className="flex items-center gap-3">
              <Icon className="h-5 w-5 shrink-0 text-primary" />
              <span className="text-sm text-foreground">{t(key)}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card cursor-pointer p-4 text-center transition-all hover:border-primary/50 glow-hover">
            <p className="text-sm text-muted-foreground">{t('gate.monthly')}</p>
            <p className="font-serif text-2xl font-bold text-foreground">
              {isTier2 ? '9,99 €' : '6,99 €'}
            </p>
            <p className="text-xs text-muted-foreground">{t('gate.perMonth')}</p>
          </div>
          <div className="glass-card cursor-pointer p-4 text-center border-primary/50 shadow-[0_0_20px_hsl(var(--primary)/0.15)]">
            <p className="text-sm font-medium text-primary">{t('gate.popular')}</p>
            <p className="font-serif text-2xl font-bold text-foreground">
              {isTier2 ? '12,99 €' : '30,99 €'}
            </p>
            <p className="text-xs text-muted-foreground">{t('gate.per6Months')}</p>
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-2">
          <Button
            size="lg"
            className="w-full pulse-unlock shine-border btn-glow"
            onClick={() => { onOpenChange(false); navigate('/#pricing'); }}
          >
            {isTier2 ? t('gate.tier2Cta') : t('gate.tier1Cta')}
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => onOpenChange(false)}>
            {t('gate.later')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
