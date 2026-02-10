import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ParticleMesh from '@/components/ParticleMesh';
import Logo from '@/components/Logo';

export default function HeroSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-background min-h-[90vh] flex items-center justify-center">
      {/* Particle mesh background */}
      <div className="absolute inset-0">
        <ParticleMesh />
      </div>

      {/* Large glowing ring/halo */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div
          className="w-[700px] h-[700px] md:w-[900px] md:h-[900px] rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle, transparent 40%, hsl(263 84% 58% / 0.12) 50%, hsl(200 80% 50% / 0.08) 65%, transparent 75%)',
            filter: 'blur(2px)',
          }}
        />
      </div>

      {/* Additional purple/teal nebula */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[50%] rounded-full opacity-25"
          style={{ background: 'radial-gradient(ellipse, hsl(190 70% 50% / 0.15), hsl(263 84% 58% / 0.1), transparent 70%)' }}
        />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[50%] h-[40%] rounded-full opacity-20"
          style={{ background: 'radial-gradient(ellipse, hsl(280 70% 50% / 0.12), transparent 70%)' }}
        />
      </div>

      {/* Floating glassmorphism cards */}
      <div className={`absolute top-[18%] left-[5%] md:left-[10%] transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '600ms' }}>
        <div className="glass-card w-32 h-16 md:w-40 md:h-20 p-3 flex items-center gap-2 animate-float" style={{ animationDelay: '0s' }}>
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20"><rect x="3" y="3" width="14" height="14" rx="2" /></svg>
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="h-2 w-full rounded-full bg-muted-foreground/20" />
            <div className="h-2 w-3/4 rounded-full bg-muted-foreground/10" />
          </div>
        </div>
      </div>

      <div className={`absolute top-[35%] right-[3%] md:right-[8%] transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '800ms' }}>
        <div className="glass-card w-36 h-16 md:w-44 md:h-20 p-3 flex items-center gap-2 animate-float" style={{ animationDelay: '1s' }}>
          <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20"><rect x="3" y="3" width="14" height="14" rx="2" /></svg>
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="h-2 w-full rounded-full bg-muted-foreground/20" />
            <div className="h-2 w-2/3 rounded-full bg-muted-foreground/10" />
          </div>
        </div>
      </div>

      <div className={`absolute bottom-[30%] left-[3%] md:left-[12%] transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '1000ms' }}>
        <div className="glass-card w-28 h-14 md:w-36 md:h-18 p-3 flex items-center gap-2 animate-float" style={{ animationDelay: '2s' }}>
          <div className="h-7 w-7 rounded-lg bg-primary/20 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-primary" fill="currentColor" viewBox="0 0 20 20"><rect x="3" y="3" width="14" height="14" rx="2" /></svg>
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="h-2 w-full rounded-full bg-muted-foreground/20" />
          </div>
        </div>
      </div>

      {/* Centered content */}
      <div className="relative z-10 container flex flex-col items-center text-center py-20">
        {/* Logo + Brand */}
        <div className={`mb-8 transition-all duration-700 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <Logo size="lg" />
        </div>

        {/* Main title */}
        <h1
          className={`mb-3 font-serif text-5xl font-black tracking-tight text-foreground md:text-7xl lg:text-8xl transition-all duration-700 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          {t('hero.title')}
        </h1>

        {/* Gradient underline */}
        <div
          className={`mx-auto mb-8 h-[2px] w-48 md:w-72 transition-all duration-700 ${loaded ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
          style={{
            background: 'linear-gradient(90deg, transparent, hsl(263 84% 58%), hsl(272 91% 65%), hsl(190 70% 50%), transparent)',
            transitionDelay: '400ms',
          }}
        />

        {/* Social proof bar */}
        <div
          className={`mb-8 flex items-center gap-3 rounded-full border border-primary/15 bg-card/60 backdrop-blur-xl px-5 py-2.5 transition-all duration-700 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '500ms' }}
        >
          <span className="flex items-center gap-1.5 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-[hsl(var(--success))] animate-pulse" />
            <span className="text-[hsl(var(--success))]">LIVE</span>
          </span>
          <div className="flex -space-x-2">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="h-7 w-7 rounded-full border-2 border-card bg-muted" style={{
                background: `hsl(${260 + i * 30} 50% ${55 + i * 5}%)`,
              }} />
            ))}
          </div>
          <div className="text-sm">
            <span className="font-bold text-foreground">35,000 +</span>
            <span className="ml-1 text-muted-foreground text-xs">{t('hero.usersActive') || 'Users active in the last 24h'}</span>
          </div>
        </div>

        {/* Subtitle */}
        <p
          className={`mb-10 max-w-xl text-base text-muted-foreground md:text-lg transition-all duration-700 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          {t('hero.subtitle')}
        </p>

        {/* CTA */}
        <div
          className={`transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '700ms' }}
        >
          <Button
            size="lg"
            variant="gradient"
            className={`btn-glow gap-2 px-8 text-base font-semibold ${loaded ? 'animate-glow' : ''}`}
            style={{ animationDelay: '1.5s' }}
            onClick={() => navigate(user ? '/learn' : '/auth')}
          >
            {t('hero.startLearning')}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
