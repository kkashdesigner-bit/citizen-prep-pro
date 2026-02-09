import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedSection from '@/components/AnimatedSection';

export default function PricingSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const plans = [
    {
      name: t('pricing.monthly'),
      price: t('pricing.monthly.price'),
      period: '/mo',
      popular: false,
      features: [
        t('pricing.feature1'),
        t('pricing.feature2'),
        t('pricing.feature3'),
        t('pricing.feature4'),
      ],
    },
    {
      name: t('pricing.semester'),
      price: t('pricing.semester.price'),
      period: '/6mo',
      popular: true,
      badge: t('pricing.save'),
      features: [
        t('pricing.feature1'),
        t('pricing.feature2'),
        t('pricing.feature3'),
        t('pricing.feature4'),
      ],
    },
  ];

  return (
    <section id="pricing" className="bg-background py-16 md:py-24">
      <div className="container">
        <AnimatedSection>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Lock className="h-5 w-5 animate-shimmer text-primary" />
              <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
                {t('pricing.title')}
              </h2>
            </div>
          </div>
        </AnimatedSection>

        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
          {plans.map((plan, i) => (
            <AnimatedSection key={plan.name} delay={i * 150}>
              <Card
                className={`hover-lift relative overflow-hidden transition-all duration-300 ${
                  plan.popular ? 'border-2 border-primary' : ''
                }`}
              >
                {plan.badge && (
                  <Badge className="absolute right-4 top-4 bg-accent text-accent-foreground">
                    {plan.badge}
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-lg text-muted-foreground">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="mb-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <Check className="h-4 w-4 shrink-0 text-primary" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="btn-glow w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => navigate('/auth')}
                  >
                    {t('pricing.cta')}
                  </Button>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
