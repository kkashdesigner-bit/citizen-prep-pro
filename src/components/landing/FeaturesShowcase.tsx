import { useState, useRef } from 'react';
import { Target, Flame, ClipboardList, Map, Globe, RefreshCw, LucideIcon } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import PassProbabilityRing from '@/components/PassProbabilityRing';
import { useLanguage } from '@/contexts/LanguageContext';

interface Feature {
  id: string;
  titleKey: string;
  icon: LucideIcon;
  color: string;
  large: boolean;
  descKey: string;
}

const features: Feature[] = [
  {
    id: 'pass-ring',
    titleKey: 'landing.features.f1Title',
    icon: Target,
    color: '#0055A4',
    large: true,
    descKey: 'landing.features.f1Desc',
  },
  {
    id: 'streak',
    titleKey: 'landing.features.f2Title',
    icon: Flame,
    color: '#F59E0B',
    large: false,
    descKey: 'landing.features.f2Desc',
  },
  {
    id: 'mock-exam',
    titleKey: 'landing.features.f3Title',
    icon: ClipboardList,
    color: '#EF4135',
    large: false,
    descKey: 'landing.features.f3Desc',
  },
  {
    id: 'parcours',
    titleKey: 'landing.features.f4Title',
    icon: Map,
    color: '#059669',
    large: false,
    descKey: 'landing.features.f4Desc',
  },
  {
    id: 'traduction',
    titleKey: 'landing.features.f5Title',
    icon: Globe,
    color: '#4F46E5',
    large: false,
    descKey: 'landing.features.f5Desc',
  },
  {
    id: 'spaced-rep',
    titleKey: 'landing.features.f6Title',
    icon: RefreshCw,
    color: '#8B5CF6',
    large: false,
    descKey: 'landing.features.f6Desc',
  },
];

function CornerBrackets({ color }: { color: string }) {
  const borderColor = color + '50';
  return (
    <>
      <span className="absolute -left-px -top-px block w-2 h-2 border-l-2 border-t-2" style={{ borderColor }} />
      <span className="absolute -right-px -top-px block w-2 h-2 border-r-2 border-t-2" style={{ borderColor }} />
      <span className="absolute -bottom-px -left-px block w-2 h-2 border-b-2 border-l-2" style={{ borderColor }} />
      <span className="absolute -bottom-px -right-px block w-2 h-2 border-b-2 border-r-2" style={{ borderColor }} />
    </>
  );
}

export default function FeaturesShowcase() {
  const { t } = useLanguage();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <section
      id="features"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="bg-background py-16 md:py-24 relative"
      style={{
        background: `radial-gradient(600px at ${mouse.x}px ${mouse.y}px, rgba(0,85,164,0.06), transparent 80%)`,
      }}
    >
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-foreground mb-3">
            <span className="gradient-text">{t('landing.features.title1')}</span> {t('landing.features.title2')}
          </h2>
          <p className="text-slate-500 text-base">
            {t('landing.features.subtitle')}
          </p>
        </div>

        {/* Bento grid */}
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto auto-rows-fr">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <AnimatedSection
                  key={feature.id}
                  delay={i * 80}
                  className={feature.large ? 'md:row-span-2' : ''}
                >
                  <div
                    className="glass-card glow-hover p-5 flex flex-col gap-3 h-full relative overflow-visible"
                  >
                    <CornerBrackets color={feature.color} />

                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: feature.color + '15',
                        border: `1px solid ${feature.color}30`,
                      }}
                    >
                      <Icon className="h-4 w-4" style={{ color: feature.color }} />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 text-sm mb-1.5">{t(feature.titleKey)}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{t(feature.descKey)}</p>
                    </div>

                    {/* Large card visual */}
                    {feature.large && (
                      <div className="mt-4 flex flex-col items-center gap-2">
                        <PassProbabilityRing probability={85} size={80} animated={false} />
                        <p className="text-xs font-semibold text-slate-500">{t('landing.features.predictedScore')}</p>
                      </div>
                    )}
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
