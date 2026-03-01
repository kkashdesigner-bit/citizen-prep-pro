import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import ParticleMesh from '@/components/ParticleMesh';
import Logo from '@/components/Logo';

export default function HeroSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    if (!user) { navigate('/quiz?mode=demo'); return; }
    if (profileLoading) return;
    if (!profile?.onboarding_completed) { navigate('/onboarding'); return; }
    navigate('/learn');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#0055A4]/10 via-white via-50% to-[#EF4135]/10 min-h-[80vh] sm:min-h-[90vh] flex items-center justify-center">
      {/* Particle mesh background */}
      <div className="absolute inset-0">
        <ParticleMesh />
      </div>

      {/* Large glowing ring/halo */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div
          className="w-[700px] h-[700px] md:w-[900px] md:h-[900px] rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, transparent 40%, hsl(192 31% 58% / 0.1) 50%, hsl(168 35% 72% / 0.08) 65%, transparent 75%)',
          }}
        />
      </div>

      {/* Additional purple/teal nebula */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[50%] rounded-full opacity-15"
          style={{ background: 'radial-gradient(ellipse, hsl(192 31% 58% / 0.12), hsl(225 48% 25% / 0.06), transparent 70%)' }}
        />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[50%] h-[40%] rounded-full opacity-10"
          style={{ background: 'radial-gradient(ellipse, hsl(168 35% 72% / 0.1), transparent 70%)' }}
        />
      </div>

      {/* Floating glassmorphism cards — hidden on mobile */}
      <div className={`hidden md:block absolute top-[15%] left-[5%] xl:left-[10%] transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '600ms' }}>
        <div className="bg-white/80 backdrop-blur-md border border-[#E6EAF0] shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-2xl p-4 flex items-start gap-4 animate-float max-w-[280px]" style={{ animationDelay: '0s' }}>
          <div className="h-8 w-8 rounded-xl bg-[#0055A4]/10 flex items-center flex-shrink-0 justify-center border border-[#0055A4]/20">
            <span className="text-[#0055A4] font-bold text-sm tracking-widest">Q</span>
          </div>
          <div>
            <p className="text-sm font-bold text-[#1A1A1A] mb-1.5 leading-snug">Quelle est la devise de la République ?</p>
            <p className="text-[11px] font-semibold text-[#0055A4]">Liberté, Égalité, Fraternité</p>
          </div>
        </div>
      </div>

      <div className={`hidden md:block absolute top-[40%] right-[3%] xl:right-[6%] transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '800ms' }}>
        <div className="bg-white/80 backdrop-blur-md border border-[#E6EAF0] shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-2xl p-4 flex items-start gap-4 animate-float max-w-[280px]" style={{ animationDelay: '1s' }}>
          <div className="h-8 w-8 rounded-xl bg-[#EF4135]/10 flex items-center flex-shrink-0 justify-center border border-[#EF4135]/20">
            <span className="text-[#EF4135] font-bold text-sm tracking-widest">Q</span>
          </div>
          <div>
            <p className="text-sm font-bold text-[#1A1A1A] mb-1.5 leading-snug">Qui a écrit La Marseillaise ?</p>
            <p className="text-[11px] font-semibold text-[#EF4135]">Rouget de Lisle</p>
          </div>
        </div>
      </div>

      <div className={`hidden md:block absolute bottom-[20%] left-[8%] xl:left-[12%] transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '1000ms' }}>
        <div className="bg-white/80 backdrop-blur-md border border-[#E6EAF0] shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-2xl p-4 flex items-start gap-4 animate-float max-w-[260px]" style={{ animationDelay: '2s' }}>
          <div className="h-8 w-8 rounded-xl bg-[#F59E0B]/10 flex items-center flex-shrink-0 justify-center border border-[#F59E0B]/20">
            <span className="text-[#F59E0B] font-bold text-sm tracking-widest">Q</span>
          </div>
          <div>
            <p className="text-sm font-bold text-[#1A1A1A] mb-1.5 leading-snug">En quelle année a eu lieu la Révolution ?</p>
            <p className="text-[11px] font-semibold text-[#F59E0B]">1789</p>
          </div>
        </div>
      </div>

      {/* Centered content */}
      <div className="relative z-10 container flex flex-col items-center text-center px-4 py-16 md:py-20">
        {/* Logo + Brand */}
        <div className={`mb-8 md:mb-12 transition-all duration-700 flex flex-col items-center justify-center ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <Logo size="lg" className="!w-[280px] md:!w-[500px] !h-auto drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500" />
        </div>

        {/* Main title */}
        <h1
          className={`mb-3 font-serif text-3xl font-black tracking-tight text-foreground sm:text-5xl md:text-7xl lg:text-8xl transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          style={{ transitionDelay: '200ms' }}
        >
          {t('hero.title')}
        </h1>

        {/* Gradient underline */}
        <div
          className={`mx-auto mb-6 md:mb-8 h-[2px] w-32 sm:w-48 md:w-72 transition-all duration-700 ${loaded ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
          style={{
            background: 'linear-gradient(90deg, transparent, hsl(225 48% 25%), hsl(192 31% 58%), hsl(168 35% 72%), transparent)',
            transitionDelay: '400ms',
          }}
        />

        {/* Social proof bar */}
        <div
          className={`mb-6 md:mb-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 rounded-2xl sm:rounded-full border border-primary/15 bg-card/60 backdrop-blur-xl px-4 py-2.5 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          style={{ transitionDelay: '500ms' }}
        >
          <span className="flex items-center gap-1.5 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-[hsl(var(--success))] animate-pulse" />
            <span className="text-[hsl(var(--success))]">LIVE</span>
          </span>
          <div className="flex -space-x-2">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="h-6 w-6 sm:h-7 sm:w-7 rounded-full border-2 border-card bg-muted" style={{
                background: `hsl(${260 + i * 30} 50% ${55 + i * 5}%)`,
              }} />
            ))}
          </div>
          <div className="text-xs sm:text-sm">
            <span className="font-bold text-foreground">35,000+</span>
            <span className="ml-1 text-muted-foreground">{t('hero.usersActive') || 'Users active'}</span>
          </div>
        </div>

        {/* CTA */}
        <div
          className={`transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '700ms' }}
        >
          <Button
            size="lg"
            variant="gradient"
            className={`gap-2 px-6 sm:px-8 text-sm sm:text-base font-semibold ${loaded ? '' : ''}`}
            onClick={handleStart}
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
