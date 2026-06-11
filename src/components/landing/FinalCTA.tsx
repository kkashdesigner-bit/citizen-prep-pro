import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import ParticleMesh from '@/components/ParticleMesh';
import DemoExamPopup from '@/components/DemoExamPopup';
import { useLanguage } from '@/contexts/LanguageContext';

export default function FinalCTA() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { profile, loading: profileLoading } = useUserProfile();
  const [showDemoPopup, setShowDemoPopup] = useState(false);

  const handleStart = () => {
    if (!user) { navigate('/auth'); return; }
    if (profileLoading) { navigate('/learn'); return; }
    if (!profile?.onboarding_completed) { navigate('/onboarding'); return; }
    navigate('/learn');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#0055A4] via-[#1B6ED6] to-[#0055A4] py-20 md:py-28">
      {/* Particle mesh */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <ParticleMesh />
      </div>

      {/* Content */}
      <div className="relative z-10 container text-center max-w-xl mx-auto">
        {/* French tricolour accent bar */}
        <div className="flex justify-center gap-1 mb-8">
          <div className="w-8 h-1.5 rounded-full bg-[#0055A4]" />
          <div className="w-8 h-1.5 rounded-full bg-white" />
          <div className="w-8 h-1.5 rounded-full bg-[#EF4135]" />
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
          {t('landing.cta.title1')}
          <br />
          {t('landing.cta.title2')}
        </h2>

        <p className="text-white/80 text-base mb-8">
          {t('landing.cta.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            className="bg-white text-[#0055A4] hover:bg-white/90 font-bold gap-2 px-8 shadow-2xl"
            onClick={handleStart}
          >
            {t('landing.cta.start')}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="text-white border border-white/40 hover:bg-white/10 font-medium px-8"
            onClick={() => setShowDemoPopup(true)}
          >
            {t('landing.cta.demo')}
          </Button>
        </div>

        <p className="text-white/50 text-xs mt-6">
          {t('landing.cta.trust')}
        </p>
      </div>

      <DemoExamPopup open={showDemoPopup} onOpenChange={setShowDemoPopup} />
    </section>
  );
}
