import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Category, CATEGORY_LABELS } from '@/lib/types';
import { Scale, Landmark, Home, ArrowRight, Shield, ScrollText, Vote, Users } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const FEATURES: { key: Category; icon: typeof Scale }[] = [
  { key: 'Principles', icon: Scale },
  { key: 'Institutions', icon: Landmark },
  { key: 'Rights', icon: Shield },
  { key: 'History', icon: ScrollText },
  { key: 'Living', icon: Home },
  { key: 'Politics', icon: Vote },
  { key: 'Society', icon: Users },
];

export default function LandingCategoryTabs() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="relative bg-background py-12 md:py-24 section-glow">
      <div className="container relative z-10">
        <AnimatedSection>
          <h2 className="mb-3 md:mb-4 text-center font-serif text-2xl font-bold sm:text-3xl md:text-4xl">
            <span className="gradient-text">{t('cat.explore')}</span>
          </h2>
          <p className="mx-auto mb-8 md:mb-12 max-w-2xl text-center text-sm sm:text-base text-muted-foreground px-2">
            {t('cat.exploreSubtitle')}
          </p>
        </AnimatedSection>

        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {FEATURES.map(({ key, icon: Icon }, i) => (
            <AnimatedSection key={key} delay={i * 100} className={i === FEATURES.length - 1 && FEATURES.length % 2 !== 0 ? 'col-span-2 md:col-span-1 max-w-xs mx-auto w-full' : ''}>
              <div
                className="glass-card glow-hover group h-full cursor-pointer p-4 sm:p-6 text-center transition-all duration-300 hover:scale-[1.02]"
                onClick={() => navigate(`/quiz?mode=study&category=${key}`)}
              >
                <div className="mx-auto mb-3 sm:mb-4 flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-primary/10 shadow-[0_0_15px_hsl(var(--primary)/0.2)] transition-all duration-300 group-hover:shadow-[0_0_25px_hsl(var(--primary)/0.4)]">
                  <Icon className="h-5 w-5 sm:h-7 sm:w-7 text-primary icon-glow" />
                </div>
                <h3 className="mb-1 sm:mb-2 font-serif text-base sm:text-lg font-semibold text-foreground">
                  {CATEGORY_LABELS[language][key]}
                </h3>
                <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-muted-foreground">{t(`cat.${key}.desc`)}</p>
                <Button variant="ghost" size="sm" className="btn-glow mt-auto gap-1 text-primary text-xs sm:text-sm">
                  {t('cat.study')}
                  <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </Button>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
