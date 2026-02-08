import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Category, CATEGORY_LABELS } from '@/lib/types';
import { BookOpen, Landmark, Scale, Clock, Home } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const CATEGORIES: { key: Category; icon: typeof BookOpen }[] = [
  { key: 'Principles', icon: Scale },
  { key: 'Institutions', icon: Landmark },
  { key: 'Rights', icon: BookOpen },
  { key: 'History', icon: Clock },
  { key: 'Living', icon: Home },
];

export default function LandingCategoryTabs() {
  const [active, setActive] = useState<Category>('Principles');
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const descriptions: Record<Category, string> = {
    Principles: 'Liberté, Égalité, Fraternité — Laïcité, symboles et valeurs fondamentales de la République.',
    Institutions: 'Président, Parlement, Justice — Comprenez l\'organisation de l\'État français.',
    Rights: 'Droits fondamentaux et devoirs du citoyen français.',
    History: 'De la Révolution à la Ve République — les grandes dates de l\'Histoire de France.',
    Living: 'Santé, éducation, travail — la vie quotidienne en France.',
  };

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container">
        <AnimatedSection>
          <h2 className="mb-8 text-center font-serif text-3xl font-bold text-foreground md:text-4xl">
            {t('pricing.feature1').includes('questions') ? 'Explorez les catégories' : 'Explore Categories'}
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={100}>
          <div className="mx-auto mb-10 flex max-w-3xl flex-wrap justify-center gap-2">
            {CATEGORIES.map(({ key, icon: Icon }) => (
              <Button
                key={key}
                variant={active === key ? 'default' : 'outline'}
                className="gap-2 rounded-full px-5"
                onClick={() => setActive(key)}
              >
                <Icon className="h-4 w-4" />
                {CATEGORY_LABELS[language][key]}
              </Button>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-8 text-center shadow-sm">
            <p className="mb-6 text-lg text-muted-foreground">{descriptions[active]}</p>
            <Button
              onClick={() => navigate(`/quiz?mode=study&category=${active}`)}
              className="gap-2"
            >
              <BookOpen className="h-4 w-4" />
              S'entraîner
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
