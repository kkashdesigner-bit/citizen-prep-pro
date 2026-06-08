import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Shield, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import ParticleMesh from '@/components/ParticleMesh';
import Logo from '@/components/Logo';
import DemoExamPopup from '@/components/DemoExamPopup';

export default function HeroSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const [loaded, setLoaded] = useState(false);
  const [showDemoPopup, setShowDemoPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    if (!user) { navigate('/auth'); return; }
    if (profileLoading) { navigate('/learn'); return; }
    if (!profile?.onboarding_completed) { navigate('/onboarding'); return; }
    navigate('/learn');
  };

  return (
    <section id="hero" className="relative bg-gradient-to-br from-[#f0f4ff] via-white to-[#fff0ef] min-h-[92vh] flex items-center justify-center">
      {/* Particle mesh background */}
      <div className="absolute inset-0 pointer-events-none">
        <ParticleMesh />
      </div>

      {/* Soft glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(0,85,164,0.12), transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(239,65,53,0.10), transparent 70%)' }} />
      </div>

      {/* Floating sample question cards — desktop only */}
      <div
        className={`hidden lg:block absolute top-[18%] left-[4%] xl:left-[8%] transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{ transitionDelay: '600ms' }}
      >
        <div className="bg-white/90 backdrop-blur-md border border-slate-100 shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-2xl p-4 flex items-start gap-3 animate-float max-w-[260px]" style={{ animationDelay: '0s' }}>
          <div className="h-8 w-8 rounded-xl bg-[#0055A4]/10 flex items-center flex-shrink-0 justify-center border border-[#0055A4]/15">
            <span className="text-[#0055A4] font-black text-sm">Q</span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 mb-1.5 leading-snug">Quelle est la devise de la République ?</p>
            <p className="text-[11px] font-semibold text-[#0055A4] bg-[#0055A4]/8 px-2 py-0.5 rounded-full inline-block">Liberté, Égalité, Fraternité</p>
          </div>
        </div>
      </div>

      <div
        className={`hidden lg:block absolute top-[38%] right-[3%] xl:right-[7%] transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{ transitionDelay: '800ms' }}
      >
        <div className="bg-white/90 backdrop-blur-md border border-slate-100 shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-2xl p-4 flex items-start gap-3 animate-float max-w-[255px]" style={{ animationDelay: '1s' }}>
          <div className="h-8 w-8 rounded-xl bg-[#EF4135]/10 flex items-center flex-shrink-0 justify-center border border-[#EF4135]/15">
            <span className="text-[#EF4135] font-black text-sm">Q</span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 mb-1.5 leading-snug">Qui a écrit La Marseillaise ?</p>
            <p className="text-[11px] font-semibold text-[#EF4135] bg-[#EF4135]/8 px-2 py-0.5 rounded-full inline-block">Rouget de Lisle</p>
          </div>
        </div>
      </div>

      <div
        className={`hidden lg:block absolute bottom-[22%] left-[7%] xl:left-[11%] transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{ transitionDelay: '1000ms' }}
      >
        <div className="bg-white/90 backdrop-blur-md border border-slate-100 shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-2xl p-4 flex items-start gap-3 animate-float max-w-[245px]" style={{ animationDelay: '2s' }}>
          <div className="h-8 w-8 rounded-xl bg-amber-500/10 flex items-center flex-shrink-0 justify-center border border-amber-500/15">
            <span className="text-amber-600 font-black text-sm">Q</span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 mb-1.5 leading-snug">En quelle année : la Révolution française ?</p>
            <p className="text-[11px] font-semibold text-amber-600 bg-amber-500/8 px-2 py-0.5 rounded-full inline-block">1789</p>
          </div>
        </div>
      </div>

      {/* ─── Centered content ─── */}
      <div className="relative z-10 container flex flex-col items-center text-center px-5 py-16 md:py-24">

        {/* Logo */}
        <div className={`mb-8 md:mb-10 transition-all duration-700 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <Logo size="lg" className="!w-[220px] sm:!w-[360px] md:!w-[440px] !h-auto drop-shadow-xl hover:scale-[1.02] transition-transform duration-500" />
        </div>

        {/* Main headline — two clean lines, no gradient-clip overflow issue */}
        <div
          className={`mb-4 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ transitionDelay: '200ms' }}
        >
          <h1 className="font-serif font-black tracking-tight text-slate-900 leading-[1.1]">
            <span className="block text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Tout ce qu'il faut savoir
            </span>
            {/* Gradient on its own block — no overflow clip from parent h1 */}
            <span
              className="block text-3xl sm:text-5xl md:text-6xl lg:text-7xl mt-1 sm:mt-2"
              style={{
                background: 'linear-gradient(90deg, #0055A4 0%, #3d7fcc 40%, #ef4135 80%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                paddingBottom: '0.1em', /* prevents descender clip */
              }}
            >
              sur la France.
            </span>
          </h1>
        </div>

        {/* Tricolour underline */}
        <div
          className={`flex gap-1 mb-6 md:mb-8 transition-all duration-700 ${loaded ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
          style={{ transitionDelay: '400ms' }}
        >
          <div className="w-10 sm:w-14 h-[3px] rounded-full bg-[#0055A4]" />
          <div className="w-10 sm:w-14 h-[3px] rounded-full bg-slate-300" />
          <div className="w-10 sm:w-14 h-[3px] rounded-full bg-[#EF4135]" />
        </div>

        {/* Subtext */}
        <p
          className={`mb-6 md:mb-8 max-w-lg text-center text-sm sm:text-base text-slate-500 font-medium transition-all duration-700 leading-relaxed ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: '450ms' }}
        >
          7 034 questions officielles&nbsp;·&nbsp;5 thèmes&nbsp;·&nbsp;100 cours
          <br className="hidden sm:block" />
          Tout pour réussir l'examen civique 2026.
        </p>

        {/* Social proof bar */}
        <div
          className={`mb-7 md:mb-9 flex flex-wrap items-center justify-center gap-2 sm:gap-3 rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-xl px-5 py-2.5 shadow-sm transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: '500ms' }}
        >
          <span className="flex items-center gap-1.5 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-600">LIVE</span>
          </span>
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((n, i) => (
              <img
                key={i}
                src={`/examen-civique-avatar-${n}.webp`}
                alt={`utilisateur ${n}`}
                width={28}
                height={28}
                loading="lazy"
                className="h-6 w-6 sm:h-7 sm:w-7 rounded-full border-2 border-white object-cover"
              />
            ))}
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-700">
            {t('hero.subscribers')}
          </div>
          <span className="hidden sm:flex items-center gap-1 text-xs text-amber-600 font-semibold">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            4,9 / 5
          </span>
        </div>

        {/* CTA buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center gap-3 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '700ms' }}
        >
          <Button
            size="lg"
            onClick={handleStart}
            className="gap-2 px-7 sm:px-8 text-sm sm:text-base font-bold text-white shadow-lg shadow-[#0055A4]/25 hover:-translate-y-0.5 transition-all"
            style={{ background: 'linear-gradient(135deg, #0055A4, #1B6ED6)' }}
          >
            {t('hero.startLearning')}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 px-7 sm:px-8 text-sm sm:text-base font-medium border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
            onClick={() => setShowDemoPopup(true)}
          >
            {t('hero.demoExam')}
          </Button>
        </div>

        {/* Trust signals */}
        <div
          className={`mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 transition-all duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: '900ms' }}
        >
          <span className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <Shield className="h-3 w-3 text-emerald-500" />
            3 jours gratuits
          </span>
          <span className="h-3 w-px bg-slate-200" />
          <span className="text-[11px] text-slate-400 font-medium">Sans carte requise</span>
          <span className="h-3 w-px bg-slate-200" />
          <span className="text-[11px] text-slate-400 font-medium">Annulation libre</span>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <DemoExamPopup open={showDemoPopup} onOpenChange={setShowDemoPopup} />
    </section>
  );
}
