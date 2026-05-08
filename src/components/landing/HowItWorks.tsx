import { useRef } from 'react';
import { Target, BookOpen, Trophy, LucideIcon } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Step {
  number: string;
  title: string;
  icon: LucideIcon;
  color: string;
  desc: string;
  badge: string;
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Diagnostiquez votre niveau',
    icon: Target,
    color: '#0055A4',
    desc: 'Un test rapide identifie vos lacunes parmi les 5 thèmes. On sait exactement par où commencer.',
    badge: 'Test gratuit',
  },
  {
    number: '02',
    title: 'Apprenez avec les cours',
    icon: BookOpen,
    color: '#4F46E5',
    desc: '100 cours structurés, du plus simple au plus avancé. Flashcards, QCM ciblés, explications détaillées.',
    badge: '100 cours',
  },
  {
    number: '03',
    title: 'Validez avec un examen blanc',
    icon: Trophy,
    color: '#EF4135',
    desc: "40 questions, 45 minutes, conditions réelles. Votre score prédit s'affiche en direct.",
    badge: 'Examen blanc',
  },
];

export default function HowItWorks() {
  const gridRef = useRef<HTMLDivElement>(null);

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
            De zéro à certifié —
            <br />
            <span className="gradient-text">en 3 étapes simples</span>
          </h2>
          <p className="text-slate-500 text-base">15 minutes par jour suffisent.</p>
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
                    <h3 className="font-bold text-slate-900 text-base mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>

                  {/* Badge chip */}
                  <div className="mt-auto">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: step.color + '15', color: step.color }}
                    >
                      {step.badge}
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
