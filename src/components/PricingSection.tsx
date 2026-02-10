import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedSection from '@/components/AnimatedSection';

export default function PricingSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();

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
      name: t('pricing.free'),
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
      sub: '30,99 € /6mo',
      cta: t('pricing.ctaStandard'),
      onClick: () => navigate('/auth'),
    },
    {
      name: 'Premium',
      price: '9,99 €',
      period: '/mo',
      popular: false,
      sub: '49,99 € /6mo',
      cta: t('pricing.ctaPremium'),
      onClick: () => navigate('/auth'),
    },
  ];

  return (
    <section id="pricing" className="bg-background py-16 md:py-24">
      <div className="container">
        <AnimatedSection>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              {t('pricing.title')}
            </h2>
          </div>
        </AnimatedSection>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {tiers.map((tier, i) => (
            <AnimatedSection key={tier.name} delay={i * 150}>
              <div
                className={`glass-card glow-hover relative flex flex-col overflow-hidden p-6 transition-all duration-300 ${
                  tier.popular ? 'border-primary/50 shadow-[0_0_30px_hsl(var(--primary)/0.15)]' : ''
                }`}
              >
                {tier.badge && (
                  <Badge className="absolute right-4 top-4 bg-primary text-primary-foreground">
                    {tier.badge}
                  </Badge>
                )}
                <div className="mb-4">
                  <p className="text-lg font-semibold text-foreground">{tier.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-4xl font-bold text-foreground">{tier.price}</span>
                    {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
                  </div>
                  {tier.sub && (
                    <p className="mt-1 text-sm text-muted-foreground">{tier.sub}</p>
                  )}
                </div>
                <ul className="mb-6 flex-1 space-y-2">
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
                  className={`w-full ${tier.popular ? 'btn-glow' : ''}`}
                  variant={tier.popular ? 'default' : 'outline'}
                  onClick={tier.onClick}
                >
                  {tier.cta}
                </Button>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
