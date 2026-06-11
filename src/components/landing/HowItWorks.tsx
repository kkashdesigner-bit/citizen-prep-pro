import { useRef } from 'react';
import { Target, BookOpen, Trophy, LucideIcon } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

interface Step {
  number: string;
  titleKey: string;
  icon: LucideIcon;
  color: string;
  descKey: string;
  badgeKey: string;
}

const steps: Step[] = [
  {
    number: '01',
    titleKey: 'landing.how.step1Title',
    icon: Target,
    color: '#0055A4',
    descKey: 'landing.how.step1Desc',
    badgeKey: 'landing.how.step1Badge',
  },
  {
    number: '02',
    titleKey: 'landing.how.step2Title',
    icon: BookOpen,
    color: '#4F46E5',
    descKey: 'landing.how.step2Desc',
    badgeKey: 'landing.how.step2Badge',
  },
  {
    number: '03',
    titleKey: 'landing.how.step3Title',
    icon: Trophy,
    color: '#EF4135',
    descKey: 'landing.how.step3Desc',
    badgeKey: 'landing.how.step3Badge',
  },
];

export default function HowItWorks() {
  const gridRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useGSAP(() => {
    if (!gridRef.current) return;
    gsap.from('.step-number', {
      opacity: 0,
      scale: 0.5,
      scrollTrigger: {
        trigger: gridRef.current,
        start: 'top 70%',
      },
      stagger: 0.2,
      duration: 0.6,
      ease: 'back.out(1.5)',
    });
  }, []);

  return (
    <section id="how-it-works" className="bg-background py-16 md:py-24">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-foreground mb-3">
            {t('landing.how.title1')}
            <br />
            <span className="gradient-text">{t('landing.how.title2')}</span>
          </h2>
          <p className="text-slate-500 text-base">{t('landing.how.subtitle')}</p>
        </div>

        {/* Steps grid */}
        <div ref={gridRef} className="steps-grid grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <AnimatedSection key={step.number} delay={i * 150}>
                <div className="glass-card p-6 relative flex flex-col gap-4 h-full">
                  {/* Ghost number */}
                  <span
                    className="step-number absolute top-4 right-5 text-5xl font-black text-slate-100 select-none pointer-events-none"
                    aria-hidden="true"
                  >
                    {step.number}
                  </span>

                  {/* Icon box */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center border flex-shrink-0"
                    style={{
                      background: step.color + '15',
                      borderColor: step.color + '30',
                    }}
                  >
                    <Icon className="h-5 w-5" style={{ color: step.color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-base mb-2">{t(step.titleKey)}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{t(step.descKey)}</p>
                  </div>

                  {/* Badge chip */}
                  <div className="mt-auto">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: step.color + '15', color: step.color }}
                    >
                      {t(step.badgeKey)}
                    </span>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
