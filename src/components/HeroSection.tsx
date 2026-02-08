import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, BookOpen, Shield, Award } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

export default function HeroSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-primary">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="relative container py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2">
            <Shield className="h-4 w-4 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">
              République Française — 2026
            </span>
          </div>

          <h1 className="mb-6 font-serif text-4xl font-bold tracking-tight text-primary-foreground md:text-6xl">
            {t('hero.title')}
          </h1>

          <p className="mb-10 text-lg text-primary-foreground/80 md:text-xl">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 text-base font-semibold"
              onClick={() => navigate('/quiz?mode=study')}
            >
              <BookOpen className="h-5 w-5" />
              {t('hero.cta')}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-primary-foreground/30 bg-primary-foreground/10 text-base text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => {
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('hero.cta2')}
            </Button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: BookOpen, label: '20+ Questions', desc: 'Banque complète' },
            { icon: Shield, label: '80% requis', desc: 'Seuil officiel' },
            { icon: Award, label: '45 min', desc: 'Conditions réelles' },
          ].map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-lg border border-primary-foreground/10 bg-primary-foreground/5 p-4"
            >
              <Icon className="h-8 w-8 text-primary-foreground/70" />
              <div>
                <p className="font-semibold text-primary-foreground">{label}</p>
                <p className="text-sm text-primary-foreground/60">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
