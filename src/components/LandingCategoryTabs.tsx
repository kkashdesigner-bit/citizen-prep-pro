import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Category } from '@/lib/types';
import AnimatedSection from '@/components/AnimatedSection';

interface CategoryFeature {
  key: Category;
  label: string;
  emoji: string;
  gradient: string;
  shadow: string;
  shape: 'book' | 'pillar' | 'shield' | 'globe' | 'house';
}

const FEATURES: CategoryFeature[] = [
  {
    key: 'Principles and values of the Republic',
    label: 'Valeurs & Principes',
    emoji: '⚖️',
    gradient: 'from-blue-600 via-blue-500 to-indigo-600',
    shadow: 'shadow-blue-500/30',
    shape: 'pillar',
  },
  {
    key: 'Institutional and political system',
    label: 'Institutions & Politique',
    emoji: '🏛️',
    gradient: 'from-indigo-600 via-purple-500 to-violet-600',
    shadow: 'shadow-indigo-500/30',
    shape: 'pillar',
  },
  {
    key: 'Rights and duties',
    label: 'Droits & Devoirs',
    emoji: '🛡️',
    gradient: 'from-emerald-600 via-green-500 to-teal-600',
    shadow: 'shadow-emerald-500/30',
    shape: 'shield',
  },
  {
    key: 'History, geography and culture',
    label: 'Histoire & Culture',
    emoji: '📜',
    gradient: 'from-amber-600 via-orange-500 to-yellow-600',
    shadow: 'shadow-amber-500/30',
    shape: 'globe',
  },
  {
    key: 'Living in French society',
    label: 'Vie Française',
    emoji: '🏠',
    gradient: 'from-rose-600 via-red-500 to-pink-600',
    shadow: 'shadow-rose-500/30',
    shape: 'house',
  },
];

function MiniatureScene({ feature, index }: { feature: CategoryFeature; index: number }) {
  const delay = index * 0.15;

  return (
    <div
      className="relative w-24 h-24 sm:w-28 sm:h-28"
      style={{ perspective: '400px' }}
    >
      {/* Floating platform shadow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-3 rounded-[50%] bg-black/10 blur-sm"
        style={{
          animation: `platform-pulse 3s ease-in-out infinite`,
          animationDelay: `${delay}s`,
        }}
      />

      {/* 3D rotating mini-object */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          animation: `float-bob 4s ease-in-out infinite, gentle-rotate 8s ease-in-out infinite`,
          animationDelay: `${delay}s`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Main 3D cube/shape */}
        <div
          className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} ${feature.shadow} shadow-xl`}
          style={{
            transform: 'rotateX(15deg) rotateY(-15deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Top face depth illusion */}
          <div
            className="absolute inset-0 rounded-2xl opacity-30"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)',
            }}
          />

          {/* Side-face illusion (right) */}
          <div
            className="absolute top-1 -right-1 w-2 h-full rounded-r-lg opacity-40"
            style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3))',
              transform: 'skewY(-10deg)',
            }}
          />

          {/* Bottom-face illusion */}
          <div
            className="absolute -bottom-1 left-1 w-full h-2 rounded-b-lg opacity-30"
            style={{
              background: 'linear-gradient(90deg, rgba(0,0,0,0.15), rgba(0,0,0,0.3))',
              transform: 'skewX(-10deg)',
            }}
          />

          {/* Emoji centerd on face */}
          <div className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl drop-shadow-lg">
            {feature.emoji}
          </div>

          {/* Shine sweep animation */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{ transform: 'translateZ(1px)' }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 45%, rgba(255,255,255,0.1) 50%, transparent 55%)',
                animation: `shine-sweep 4s ease-in-out infinite`,
                animationDelay: `${delay + 1}s`,
              }}
            />
          </div>
        </div>

        {/* Orbiting sparkle dots */}
        {[0, 1, 2].map((sparkle) => (
          <div
            key={sparkle}
            className="absolute w-1.5 h-1.5 rounded-full bg-white/60"
            style={{
              animation: `orbit-sparkle 5s linear infinite`,
              animationDelay: `${delay + sparkle * 1.6}s`,
              top: '50%',
              left: '50%',
              transformOrigin: `${20 + sparkle * 8}px 0`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function LandingCategoryTabs() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="relative bg-background py-16 md:py-28 overflow-hidden">
      {/* Soft ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(ellipse, hsl(209 100% 32% / 0.15), transparent 70%)' }}
        />
      </div>

      <div className="container relative z-10">
        <AnimatedSection>
          <h2 className="mb-3 md:mb-4 text-center font-serif text-2xl font-bold sm:text-3xl md:text-4xl">
            <span className="gradient-text">{t('cat.explore')}</span>
          </h2>
          <p className="mx-auto mb-12 md:mb-16 max-w-xl text-center text-sm sm:text-base text-muted-foreground px-2">
            {t('cat.exploreSubtitle')}
          </p>
        </AnimatedSection>

        {/* Category grid */}
        <div className="mx-auto max-w-5xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {FEATURES.map((feature, i) => (
            <AnimatedSection key={feature.key} delay={i * 120}>
              <div
                className="group flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() => navigate(`/quiz?mode=study&category=${encodeURIComponent(feature.key)}`)}
              >
                {/* 3D miniature */}
                <MiniatureScene feature={feature} index={i} />

                {/* 2-word label */}
                <h3 className="mt-4 text-sm sm:text-base font-bold text-foreground text-center leading-tight group-hover:text-primary transition-colors duration-300">
                  {feature.label}
                </h3>

                {/* Subtle underline on hover */}
                <div className={`mt-2 h-0.5 w-0 group-hover:w-12 bg-gradient-to-r ${feature.gradient} transition-all duration-500 rounded-full`} />
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes float-bob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes gentle-rotate {
          0%, 100% { transform: rotateY(0deg); }
          25% { transform: rotateY(8deg); }
          75% { transform: rotateY(-8deg); }
        }

        @keyframes platform-pulse {
          0%, 100% { transform: translateX(-50%) scaleX(1); opacity: 0.1; }
          50% { transform: translateX(-50%) scaleX(0.8); opacity: 0.06; }
        }

        @keyframes shine-sweep {
          0%, 100% { transform: translateX(-120%); }
          50% { transform: translateX(120%); }
        }

        @keyframes orbit-sparkle {
          0% { transform: rotate(0deg) translateX(24px); opacity: 0; }
          20% { opacity: 0.7; }
          80% { opacity: 0.7; }
          100% { transform: rotate(360deg) translateX(24px); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
