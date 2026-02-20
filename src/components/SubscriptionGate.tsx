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
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SubscriptionGateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requiredTier?: 'standard' | 'premium';
}

export default function SubscriptionGate({ open, onOpenChange, requiredTier = 'standard' }: SubscriptionGateProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const isPremium = requiredTier === 'premium';

  const STANDARD_FEATURES = [
    { icon: BookOpen, key: 'gate.feat1' },
    { icon: Award, key: 'gate.feat2' },
    { icon: CheckCircle, key: 'gate.feat3' },
    { icon: Target, key: 'gate.feat4' },
    { icon: Shield, key: 'gate.feat5' },
  ];

  const PREMIUM_FEATURES = [
    { icon: Languages, key: 'gate.feat6' },
    { icon: PlayCircle, key: 'gate.feat7' },
    { icon: BookOpen, key: 'gate.feat8' },
    { icon: CheckCircle, key: 'gate.feat9' },
  ];

  const features = isPremium ? PREMIUM_FEATURES : STANDARD_FEATURES;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg glass-card border-primary/20 bg-card/95 backdrop-blur-2xl">
        <div className="absolute top-4 right-12 rotate-12 border-2 border-destructive/40 px-3 py-1 rounded">
          <span className="text-xs font-bold uppercase tracking-widest text-destructive/60">
            {t('gate.classified')}
          </span>
        </div>

        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full shadow-[0_0_30px_hsl(var(--primary)/0.3)]"
            style={{ background: 'linear-gradient(135deg, hsl(263 84% 58% / 0.2), hsl(239 84% 67% / 0.1))' }}
          >
            <Sparkles className="h-8 w-8 text-primary icon-glow" />
          </div>
          <DialogTitle className="text-center font-serif text-2xl">
            <span className="gradient-text">{isPremium ? t('gate.tier2Title') : t('gate.tier1Title')}</span>
          </DialogTitle>
        </DialogHeader>

        <p className="text-center text-muted-foreground">
          {isPremium ? t('gate.tier2Desc') : t('gate.tier1Desc')}
        </p>

        <div className="my-4 space-y-3">
          {features.map(({ icon: Icon, key }) => (
            <div key={key} className="flex items-center gap-3">
              <Icon className="h-5 w-5 shrink-0 text-primary icon-glow" />
              <span className="text-sm text-foreground">{t(key)}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card cursor-pointer p-4 text-center transition-all hover:border-primary/40 glow-hover">
            <p className="text-sm text-muted-foreground">{t('gate.monthly')}</p>
            <p className="font-serif text-2xl font-bold gradient-text">
              {isPremium ? '10,99 €' : '6,99 €'}
            </p>
            <p className="text-xs text-muted-foreground">{t('gate.perMonth')}</p>
          </div>
          <div className="glass-card cursor-pointer p-4 text-center border-primary/30 shadow-[0_0_20px_hsl(var(--primary)/0.15)]">
            <p className="text-sm font-medium text-primary">{t('gate.popular')}</p>
            <p className="font-serif text-2xl font-bold gradient-text">
              {isPremium ? '54,99 €' : '34,99 €'}
            </p>
            <p className="text-xs text-muted-foreground">{t('gate.per6Months')}</p>
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-2">
          <Button
            size="lg"
            variant="gradient"
            className="w-full pulse-unlock shine-border btn-glow"
            onClick={async () => {
              if (!user) {
                onOpenChange(false);
                navigate('/auth');
                return;
              }

              const tierValue = isPremium ? 'premium' : 'standard';
              try {
                const { error } = await supabase
                  .from('profiles')
                  .update({
                    subscription_tier: tierValue,
                    is_subscribed: true
                  })
                  .eq('id', user.id);

                if (error) throw error;

                toast.success(`Abonnement ${isPremium ? 'Premium' : 'Standard'} activé avec succès !`);
                onOpenChange(false);
                setTimeout(() => window.location.reload(), 1500);
              } catch (err) {
                toast.error("Erreur lors de l'activation de l'abonnement");
                console.error(err);
              }
            }}
          >
            {isPremium ? t('gate.tier2Cta') : t('gate.tier1Cta')}
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => onOpenChange(false)}>
            {t('gate.later')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
