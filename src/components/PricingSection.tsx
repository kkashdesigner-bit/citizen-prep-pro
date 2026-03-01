import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedSection from '@/components/AnimatedSection';
import { useAuth } from '@/hooks/useAuth';
import SubscriptionGate from '@/components/SubscriptionGate';

export default function PricingSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showGate, setShowGate] = useState(false);
  const [gateTier, setGateTier] = useState<'standard' | 'premium'>('standard');

  const features = [
    { key: 'pricing.feat.browse', free: true, standard: true, premium: true },
    { key: 'pricing.feat.demo', free: true, standard: true, premium: true },
    { key: 'pricing.feat.unlimited', free: false, standard: true, premium: true },
    { key: 'pricing.feat.training', free: false, standard: true, premium: true },
    { key: 'pricing.feat.progress', free: false, standard: true, premium: true },
    { key: 'pricing.feat.lessons', free: false, standard: true, premium: true },
    { key: 'pricing.feat.path', free: false, standard: true, premium: true },
    { key: 'pricing.feat.translation', free: false, standard: false, premium: true },
    { key: 'pricing.feat.catTraining', free: false, standard: false, premium: true },
  ];

  const tiers = [
    {
      name: 'Gratuit',
      price: '0 €',
      period: '',
      popular: false,
      cta: t('pricing.ctaFree'),
      onClick: () => navigate('/auth'),
    },
    {
      name: 'Standard',
      price: '6,99 €',
      period: '/mo',
      popular: true,
      badge: t('pricing.recommended'),
      cta: t('pricing.ctaStandard'),
      onClick: () => {
        setGateTier('standard');
        setShowGate(true);
      },
    },
    {
      name: 'Premium',
      price: '10,99 €',
      period: '/mo',
      popular: false,
      cta: t('pricing.ctaPremium'),
      onClick: () => {
        setGateTier('premium');
        setShowGate(true);
      },
    },
  ];

  return (
    <section id="pricing" className="relative bg-background py-12 md:py-24 section-glow">
      <div className="container relative z-10 px-4">
        <AnimatedSection>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-2xl font-bold sm:text-3xl md:text-4xl">
              <span className="gradient-text">{t('pricing.title')}</span>
            </h2>
          </div>
        </AnimatedSection>

        <div className="mx-auto mt-8 md:mt-12 grid max-w-5xl grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
          {tiers.map((tier, i) => (
            <AnimatedSection key={tier.name} delay={i * 150}>
              <div
                className={`glass-card glow-hover relative flex flex-col overflow-hidden p-6 transition-all duration-300 hover:scale-[1.02] ${tier.popular
                  ? 'border-primary/40 shadow-[0_0_35px_hsl(var(--primary)/0.2)]'
                  : ''
                  }`}
              >
                {tier.badge && (
                  <Badge
                    className="absolute right-4 top-4 text-primary-foreground"
                    style={{ background: 'linear-gradient(135deg, hsl(263 84% 58%), hsl(239 84% 67%))' }}
                  >
                    {tier.badge}
                  </Badge>
                )}
                <div className="mb-4">
                  <p className="text-xl font-bold text-foreground">{tier.name}</p>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="font-serif text-4xl font-bold gradient-text">{tier.price}</span>
                    {tier.period && <span className="text-sm font-medium text-muted-foreground">{tier.period}</span>}
                  </div>
                </div>
                <ul className="mb-6 flex-1 space-y-3 mt-4">
                  {features.map((feat) => {
                    const included = i === 0 ? feat.free : i === 1 ? feat.standard : feat.premium;
                    return (
                      <li key={feat.key} className="flex items-center gap-2 text-sm">
                        {included ? (
                          <Check className="h-4 w-4 shrink-0 text-primary" />
                        ) : (
                          <X className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                        )}
                        <span className={included ? 'text-foreground' : 'text-muted-foreground/50'}>
                          {t(feat.key)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <Button
                  className="w-full"
                  variant={tier.popular ? 'gradient' : 'outline'}
                  onClick={tier.onClick}
                >
                  {tier.cta}
                </Button>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
      <SubscriptionGate open={showGate} onOpenChange={setShowGate} requiredTier={gateTier} />
    </section>
  );
}
