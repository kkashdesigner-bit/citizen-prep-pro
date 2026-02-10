import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Category, CATEGORY_LABELS } from '@/lib/types';
import { Scale, Landmark, Home, ArrowRight, Shield, ScrollText } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const FEATURES: { key: Category; icon: typeof Scale }[] = [
  { key: 'Principles', icon: Scale },
  { key: 'Institutions', icon: Landmark },
  { key: 'Rights', icon: Shield },
  { key: 'History', icon: ScrollText },
  { key: 'Living', icon: Home },
];

export default function LandingCategoryTabs() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="relative bg-background py-16 md:py-24 section-glow">
      <div className="container relative z-10">
        <AnimatedSection>
          <h2 className="mb-4 text-center font-serif text-3xl font-bold md:text-4xl">
            <span className="gradient-text">{t('cat.explore')}</span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            {t('cat.exploreSubtitle')}
          </p>
        </AnimatedSection>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {FEATURES.map(({ key, icon: Icon }, i) => (
            <AnimatedSection key={key} delay={i * 100}>
              <div
                className="glass-card glow-hover group h-full cursor-pointer p-6 text-center transition-all duration-300 hover:scale-[1.02]"
                onClick={() => navigate(`/quiz?mode=study&category=${key}`)}
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 shadow-[0_0_15px_hsl(var(--primary)/0.2)] transition-all duration-300 group-hover:shadow-[0_0_25px_hsl(var(--primary)/0.4)]">
                  <Icon className="h-7 w-7 text-primary icon-glow" />
                </div>
                <h3 className="mb-2 font-serif text-lg font-semibold text-foreground">
                  {CATEGORY_LABELS[language][key]}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">{t(`cat.${key}.desc`)}</p>
                <Button variant="ghost" size="sm" className="btn-glow mt-auto gap-1 text-primary">
                  {t('cat.study')}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
