import { useState, useEffect, useCallback, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle, X, Map, ArrowRight, ArrowLeft } from 'lucide-react';

type Step = { target: string; title: string; body: string };

const STEPS: Step[] = [
  { target: 'parcours', title: 'Suivez votre parcours', body: "Le cœur de l'app : avancez classe par classe (1→100) avec des leçons courtes et des quiz. Commencez ici." },
  { target: 'exam', title: 'Passez un examen blanc', body: "Testez-vous en conditions réelles : 40 questions, 45 minutes, seuil de réussite à 80%." },
  { target: 'revision', title: 'Révisez chaque jour', body: "La révision intelligente vous redonne les questions que vous êtes sur le point d'oublier." },
  { target: 'categories', title: 'Ciblez vos points faibles', body: "L'entraînement par thème (Premium) vous fait progresser là où vous en avez le plus besoin." },
  { target: 'progress', title: 'Suivez votre progression', body: "Votre taux de réussite, votre série et votre maîtrise par domaine, au même endroit." },
  { target: 'checklist', title: 'Cochez vos premiers pas', body: "Cette liste vous guide étape par étape pour bien démarrer. Validez-les une par une !" },
];

const STORAGE_KEY = 'gocivique_tour_v1_done';
const BLUE = '#0055A4';

/**
 * First-run guided product tour for the dashboard.
 * - Spotlights real cards tagged with data-tour="..." (dims the rest).
 * - Fires once after onboarding (first dashboard visit); guarded by localStorage.
 * - Replayable via the floating button or a `gocivique:start-tour` window event.
 * Rendered through a portal to <body> so it sits above framer-motion transforms.
 */
export default function GuidedTour() {
  const [phase, setPhase] = useState<'idle' | 'welcome' | 'running'>('idle');
  const [idx, setIdx] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  // Auto-start once
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    let tries = 0;
    const iv = setInterval(() => {
      tries += 1;
      if (document.querySelector('[data-tour="parcours"]')) { clearInterval(iv); setPhase('welcome'); }
      else if (tries > 25) clearInterval(iv);
    }, 300);
    return () => clearInterval(iv);
  }, []);

  // Replay trigger
  useEffect(() => {
    const start = () => { setIdx(0); setPhase('welcome'); };
    window.addEventListener('gocivique:start-tour', start);
    return () => window.removeEventListener('gocivique:start-tour', start);
  }, []);

  const measure = useCallback(() => {
    const el = document.querySelector(`[data-tour="${STEPS[idx].target}"]`) as HTMLElement | null;
    setRect(el ? el.getBoundingClientRect() : null);
  }, [idx]);

  useEffect(() => {
    if (phase !== 'running') return;
    const el = document.querySelector(`[data-tour="${STEPS[idx].target}"]`) as HTMLElement | null;
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const t = setTimeout(measure, 380);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => { clearTimeout(t); window.removeEventListener('resize', measure); window.removeEventListener('scroll', measure, true); };
  }, [phase, idx, measure]);

  const close = (done: boolean) => { if (done) localStorage.setItem(STORAGE_KEY, '1'); setPhase('idle'); setRect(null); };
  const begin = () => { setIdx(0); setPhase('running'); };
  const next = () => { if (idx < STEPS.length - 1) setIdx((i) => i + 1); else close(true); };
  const prev = () => { if (idx > 0) setIdx((i) => i - 1); };

  if (typeof document === 'undefined') return null;

  const placeTop = !!rect && (rect.top + rect.height / 2) > (window.innerHeight / 2);
  const coachPos: CSSProperties = placeTop ? { top: 24 } : { bottom: 24 };

  const node = (
    <>
      {phase === 'idle' && (
        <button
          onClick={() => { setIdx(0); setPhase('welcome'); }}
          className="hidden md:inline-flex"
          style={{ position: 'fixed', left: 20, bottom: 20, zIndex: 40, alignItems: 'center', gap: 8, background: '#fff', color: BLUE, border: '1px solid #E6EAF0', borderRadius: 999, padding: '9px 14px', fontWeight: 600, fontSize: 13, boxShadow: '0 4px 14px rgba(0,0,0,0.10)', cursor: 'pointer' }}
        >
          <HelpCircle size={16} /> Revoir le guide
        </button>
      )}

      {phase === 'welcome' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'rgba(10,20,40,0.55)' }}>
          <div style={{ background: '#fff', borderRadius: 16, maxWidth: 360, width: '100%', textAlign: 'center', overflow: 'hidden', boxShadow: '0 20px 48px rgba(0,0,0,0.25)' }}>
            <div style={{ height: 4, background: 'linear-gradient(90deg,#0055A4 0%,#ffffff 50%,#EF4135 100%)' }} />
            <div style={{ padding: 26 }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: '#E7F0FA', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <Map size={26} color={BLUE} />
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#1A1A1A' }}>Bienvenue sur GoCivique</div>
              <p style={{ fontSize: 13.5, color: '#5B6573', margin: '8px 0 18px', lineHeight: 1.6 }}>Un tour rapide de 30 secondes pour réussir votre examen civique sans rien manquer.</p>
              <button onClick={begin} style={{ width: '100%', padding: 12, fontSize: 14, background: BLUE, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>Commencer le tour</button>
              <button onClick={() => close(true)} style={{ width: '100%', marginTop: 8, padding: 9, fontSize: 13, background: 'transparent', border: 'none', color: '#64748B', fontWeight: 600, cursor: 'pointer' }}>Plus tard</button>
            </div>
          </div>
        </div>
      )}

      {phase === 'running' && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 9998 }} />
          {rect && (
            <div style={{ position: 'fixed', top: rect.top - 8, left: rect.left - 8, width: rect.width + 16, height: rect.height + 16, borderRadius: 16, boxShadow: '0 0 0 9999px rgba(10,20,40,0.55)', border: `3px solid ${BLUE}`, pointerEvents: 'none', zIndex: 9999, transition: 'all .3s ease' }} />
          )}
          <div style={{ position: 'fixed', left: '50%', transform: 'translateX(-50%)', width: 'min(440px, calc(100vw - 32px))', zIndex: 10000, background: '#fff', border: '1px solid #E6EAF0', borderRadius: 16, boxShadow: '0 12px 32px rgba(0,0,0,0.16)', overflow: 'hidden', ...coachPos }}>
            <div style={{ height: 3, background: '#EEF1F5' }}>
              <div style={{ height: 3, width: `${Math.round(((idx + 1) / STEPS.length) * 100)}%`, background: 'linear-gradient(90deg,#0055A4,#1B6ED6)', transition: 'width .3s ease' }} />
            </div>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, gap: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: BLUE }}>Étape {idx + 1} / {STEPS.length}</span>
                <button onClick={() => close(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, background: '#F1F5F9', color: '#475569', border: 'none', borderRadius: 8, padding: '6px 11px', cursor: 'pointer' }}>Passer <X size={13} /></button>
              </div>
              <div style={{ fontWeight: 700, fontSize: 15.5, color: '#1A1A1A' }}>{STEPS[idx].title}</div>
              <p style={{ fontSize: 13.5, color: '#5B6573', margin: '4px 0 12px', lineHeight: 1.6 }}>{STEPS[idx].body}</p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                {idx > 0 && (
                  <button onClick={prev} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, padding: '9px 16px', background: '#fff', border: '1px solid #CBD5E1', color: '#1A1A1A', borderRadius: 12, fontWeight: 600, cursor: 'pointer' }}><ArrowLeft size={15} /> Précédent</button>
                )}
                <button onClick={next} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, padding: '9px 18px', background: BLUE, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>{idx === STEPS.length - 1 ? 'Terminer' : 'Suivant'}{idx < STEPS.length - 1 && <ArrowRight size={15} />}</button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );

  return createPortal(node, document.body);
}
