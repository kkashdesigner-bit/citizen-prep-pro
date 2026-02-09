import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Category, CATEGORY_LABELS } from '@/lib/types';
import { Scale, Landmark, Home, ArrowRight } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const FEATURES: { key: Category; icon: typeof Scale; descFr: string }[] = [
  {
    key: 'Principles',
    icon: Scale,
    descFr: 'Liberté, Égalité, Fraternité — Laïcité, symboles et valeurs fondamentales.',
  },
  {
    key: 'Institutions',
    icon: Landmark,
    descFr: 'Président, Parlement, Justice — l\'organisation de l\'État français.',
  },
  {
    key: 'Living',
    icon: Home,
    descFr: 'Santé, éducation, travail — la vie quotidienne en France.',
  },
];

export default function LandingCategoryTabs() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container">
        <AnimatedSection>
          <h2 className="mb-4 text-center font-serif text-3xl font-bold text-foreground md:text-4xl">
            Explorez les catégories
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            Préparez chaque domaine de l'examen de citoyenneté avec des quiz ciblés.
          </p>
        </AnimatedSection>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
          {FEATURES.map(({ key, icon: Icon, descFr }, i) => (
            <AnimatedSection key={key} delay={i * 150}>
              <div
                className="glass-card glow-hover group h-full cursor-pointer p-6 text-center transition-all duration-300"
                onClick={() => navigate(`/quiz?mode=study&category=${key}`)}
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 shadow-[0_0_15px_hsl(var(--primary)/0.15)] transition-all duration-300 group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 font-serif text-lg font-semibold text-foreground">
                  {CATEGORY_LABELS[language][key]}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">{descFr}</p>
                <Button variant="ghost" size="sm" className="btn-glow mt-auto gap-1 text-primary">
                  S'entraîner
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
