import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleCheckBig } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AnimatedSection from '@/components/AnimatedSection';

/* ──────────────────────────────────────────────
   Interactive exam-mode selector card
   ────────────────────────────────────────────── */
function ExamModeMockup() {
  const [selected, setSelected] = useState<'exam' | 'training'>('exam');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStart = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (selected === 'exam') {
      navigate('/quiz?mode=exam&limit=40');
    } else {
      navigate('/quiz?mode=training&limit=40');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-2xl border border-border bg-card shadow-xl p-6 space-y-5">
      <h3 className="text-lg font-bold text-foreground">Mode d'examen</h3>

      {/* Option 1 — Mode Examen */}
      <label
        className="flex items-start gap-3 cursor-pointer"
        onClick={() => setSelected('exam')}
      >
        <span className={`mt-0.5 h-5 w-5 rounded-full shrink-0 transition-all ${selected === 'exam' ? 'border-[5px] border-[#0055A4] bg-white' : 'border-2 border-border bg-white'}`} />
        <div>
          <p className="font-semibold text-foreground text-sm">Mode Examen</p>
          <p className="text-xs text-muted-foreground">
            40 minutes, aucun feedback pendant l'examen, résultats à la fin uniquement
          </p>
        </div>
      </label>

      {/* Option 2 — Mode Préparation */}
      <label
        className="flex items-start gap-3 cursor-pointer"
        onClick={() => setSelected('training')}
      >
        <span className={`mt-0.5 h-5 w-5 rounded-full shrink-0 transition-all ${selected === 'training' ? 'border-[5px] border-[#0055A4] bg-white' : 'border-2 border-border bg-white'}`} />
        <div>
          <p className="font-semibold text-foreground text-sm">Mode Préparation</p>
          <p className="text-xs text-muted-foreground">
            Sans minuteur, choisissez quand voir les réponses
          </p>
        </div>
      </label>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex-1 rounded-xl border border-border py-2.5 text-center text-sm font-medium text-muted-foreground hover:bg-secondary/50 transition-colors cursor-pointer"
        >
          Annuler
        </button>
        <button
          onClick={handleStart}
          className="flex-1 rounded-xl bg-[#0055A4] py-2.5 text-center text-sm font-bold text-white hover:bg-[#1B6ED6] transition-colors cursor-pointer"
        >
          Commencer l'examen
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Bullet item with check icon
   ────────────────────────────────────────────── */
function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <CircleCheckBig className="h-5 w-5 shrink-0 mt-0.5 text-[#0055A4]" />
      <span className="text-slate-700 dark:text-slate-300 text-[15px] leading-relaxed">{children}</span>
    </li>
  );
}

/* ──────────────────────────────────────────────
   Image frame with shadow + subtle tilt
   ────────────────────────────────────────────── */
function ImageFrame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="rounded-2xl border border-border/60 bg-card shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden">
        {children}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Section data
   ────────────────────────────────────────────── */
const SECTIONS = [
  {
    id: 'practice',
    title: 'Entraînez-vous par section',
    titleAccent: 'à votre rythme',
    bullets: [
      'Progression synchronisée entre vos appareils',
      '5 sections thématiques correspondant au programme officiel',
      'Progression visible pour chaque section',
      'QCM gratuites pour commencer immédiatement',
      'Mises en situation réalistes pour une préparation complète',
    ],
    imagePosition: 'right' as const,
    renderImage: () => (
      <div className="flex gap-4">
        <div className="flex-1 rounded-2xl border border-border/60 bg-card shadow-xl overflow-hidden">
          <img
            src="/examen-civique-qcm-valeurs-republique-francaise.jpg"
            alt="Examen civique — quiz sur les valeurs de la République française"
            className="w-full h-auto"
            loading="lazy"
          />
        </div>
        <div className="flex-1 rounded-2xl border border-border/60 bg-card shadow-xl overflow-hidden">
          <img
            src="/examen-civique-qcm-institutions-systeme-politique.jpg"
            alt="Examen civique — quiz sur les institutions et le système politique"
            className="w-full h-auto"
            loading="lazy"
          />
        </div>
      </div>
    ),
  },
  {
    id: 'modes',
    title: 'Choisissez votre mode',
    titleAccent: "d'entraînement",
    bullets: [
      'Mode Examen : 45 minutes, résultats à la fin uniquement',
      'Mode Préparation : sans minuteur, voir les réponses quand vous voulez',
    ],
    imagePosition: 'left' as const,
    renderImage: () => <ExamModeMockup />,
  },
  {
    id: 'exams',
    title: 'Testez-vous',
    titleAccent: 'avec des examens blancs',
    bullets: [
      '40 questions en conditions réelles, comme le jour J',
      'Examens blancs basés sur les questions officielles',
      'Un test gratuit par niveau',
    ],
    imagePosition: 'right' as const,
    renderImage: () => (
      <ImageFrame>
        <img
          src="/examen-civique-resultat-passe.jpg"
          alt="Examen civique — résultat d'un examen blanc réussi sur GoCivique"
          className="w-full h-auto"
          loading="lazy"
        />
      </ImageFrame>
    ),
  },
  {
    id: 'parcours',
    title: 'Suivez votre parcours',
    titleAccent: "d'apprentissage",
    bullets: [
      '100 cours structurés du plus simple au plus complexe',
      'Flashcards et quiz interactifs dans chaque leçon',
      '3 parcours adaptés : CSP, Carte de Résident, Naturalisation',
    ],
    imagePosition: 'left' as const,
    renderImage: () => (
      <ImageFrame>
        <img
          src="/examen-civique-parcours-100-niveaux-desktop.jpg"
          alt="Examen civique — parcours de 100 niveaux sur GoCivique"
          className="w-full h-auto"
          loading="lazy"
        />
      </ImageFrame>
    ),
  },
];

/* ──────────────────────────────────────────────
   Main component
   ────────────────────────────────────────────── */
export default function LandingFeatures() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {SECTIONS.map((section, i) => {
        const isImageLeft = section.imagePosition === 'left';
        const bgClass = i % 2 === 0 ? 'bg-background' : 'bg-secondary/30';

        return (
          <section
            key={section.id}
            className={`${bgClass} py-16 md:py-24 overflow-hidden`}
          >
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid items-center gap-10 md:gap-16 md:grid-cols-2">
                {/* Text block */}
                <AnimatedSection
                  direction={isImageLeft ? 'right' : 'left'}
                  delay={100}
                  className={isImageLeft ? 'md:order-2' : 'md:order-1'}
                >
                  <h2 className="text-2xl font-bold sm:text-3xl md:text-[2.25rem] leading-tight text-foreground">
                    <span className="text-[#0055A4] font-serif">{section.title}</span>{' '}
                    <span className="font-serif">{section.titleAccent}</span>
                  </h2>

                  <ul className="mt-6 space-y-4">
                    {section.bullets.map((bullet) => (
                      <Bullet key={bullet}>{bullet}</Bullet>
                    ))}
                  </ul>

                  {/* CTA for the first section */}
                  {i === 0 && (
                    <div className="mt-8">
                      <button
                        onClick={() => navigate(user ? '/learn' : '/auth')}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#0055A4] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#0055A4]/25 transition-all hover:bg-[#1B6ED6] hover:-translate-y-0.5"
                      >
                        Commencer gratuitement
                      </button>
                    </div>
                  )}
                </AnimatedSection>

                {/* Image / mockup block */}
                <AnimatedSection
                  direction={isImageLeft ? 'left' : 'right'}
                  delay={250}
                  className={isImageLeft ? 'md:order-1' : 'md:order-2'}
                >
                  {section.renderImage()}
                </AnimatedSection>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
