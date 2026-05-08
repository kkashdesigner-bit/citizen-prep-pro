import { useState, useRef } from 'react';
import { Target, Flame, ClipboardList, Map, Globe, RefreshCw, LucideIcon } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import PassProbabilityRing from '@/components/PassProbabilityRing';

interface Feature {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  large: boolean;
  desc: string;
}

const features: Feature[] = [
  {
    id: 'pass-ring',
    title: 'Taux de réussite prédit',
    icon: Target,
    color: '#0055A4',
    large: true,
    desc: 'Notre algorithme prédit votre score officiel en temps réel, basé sur vos résultats par thème.',
  },
  {
    id: 'streak',
    title: 'Série de jours',
    icon: Flame,
    color: '#F59E0B',
    large: false,
    desc: "Une question par jour. Maintenez votre série et restez dans le rythme jusqu'à l'examen.",
  },
  {
    id: 'mock-exam',
    title: 'Examens blancs',
    icon: ClipboardList,
    color: '#EF4135',
    large: false,
    desc: '40 questions, 45 minutes, résultats détaillés. En conditions réelles.',
  },
  {
    id: 'parcours',
    title: '3 parcours adaptés',
    icon: Map,
    color: '#059669',
    large: false,
    desc: 'CSP, Carte de Résident ou Naturalisation — chaque parcours cible vos questions.',
  },
  {
    id: 'traduction',
    title: 'Questions en 7 langues',
    icon: Globe,
    color: '#4F46E5',
    large: false,
    desc: 'Révisez en arabe, espagnol, portugais, chinois, turc, anglais ou français.',
  },
  {
    id: 'spaced-rep',
    title: 'Répétition espacée',
    icon: RefreshCw,
    color: '#8B5CF6',
    large: false,
    desc: 'Les questions où vous échouez reviennent plus souvent. Apprenez ce qui compte.',
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
            <span className="gradient-text">Tout ce qu'il faut</span> pour réussir
          </h2>
          <p className="text-slate-500 text-base">
            Une plateforme conçue pour les futurs citoyens français.
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
                      <h3 className="font-bold text-slate-900 text-sm mb-1.5">{feature.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
                    </div>

                    {/* Large card visual */}
                    {feature.large && (
                      <div className="mt-4 flex flex-col items-center gap-2">
                        <PassProbabilityRing probability={85} size={80} animated={false} />
                        <p className="text-xs font-semibold text-slate-500">Votre score prédit</p>
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
