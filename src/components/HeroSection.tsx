import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Scale } from 'lucide-react';
import { useEffect, useState } from 'react';
import heroBg from '@/assets/hero-bg.jpg';
export default function HeroSection() {
  const {
    t
  } = useLanguage();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);
  return <section className="relative overflow-hidden bg-primary">
      {/* Parallax background */}
      <div className="absolute inset-0 opacity-15 transition-transform duration-1000" style={{
      backgroundImage: `url(${heroBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }} />

      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary to-primary" />

      <div className="relative container py-24 md:py-36">
        <div className="mx-auto max-w-3xl text-center">
          {/* Animated icon */}
          <div className={`mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 transition-all duration-700 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
            <Scale className="text-primary-foreground w-[200px] h-[200px] rounded-none" />
          </div>

          <h1 className={`mb-6 font-serif text-4xl font-bold uppercase tracking-tight text-primary-foreground transition-all duration-700 delay-200 md:text-6xl ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {t('hero.title')}
          </h1>

          <p className={`mb-10 text-lg text-primary-foreground/80 transition-all duration-700 delay-400 md:text-xl ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {t('hero.subtitle')}
          </p>

          <div className={`flex flex-col items-center gap-4 transition-all duration-700 delay-500 sm:flex-row sm:justify-center ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <Button size="lg" variant="secondary" className="gap-2 text-base font-semibold" onClick={() => navigate('/quiz?mode=study')}>
              {t('hero.cta')}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2 border-primary-foreground/30 bg-primary-foreground/10 text-base text-primary-foreground hover:bg-primary-foreground/20" onClick={() => {
            document.getElementById('pricing')?.scrollIntoView({
              behavior: 'smooth'
            });
          }}>
              {t('hero.cta2')}
            </Button>
          </div>
        </div>
      </div>

      {/* Curved divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full">
          <path d="M0 60V30C360 0 720 0 1080 30C1260 45 1380 55 1440 60H0Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>;
}