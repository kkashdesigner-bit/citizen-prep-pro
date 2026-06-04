import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';

/**
 * A slim, dismissible conversion bar fixed to the bottom of the landing page.
 * It keeps a clear path to subscribe in view as visitors scroll past the hero —
 * pricing is otherwise the 8th section down the page.
 *
 * Hidden for visitors who already have a paid plan.
 */
export default function StickyCtaBar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isStandardOrAbove, loading } = useSubscription();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Don't distract paying users; wait until subscription state resolves.
  if (loading || isStandardOrAbove || dismissed || !visible) return null;

  const goToPricing = () => {
    const el = document.getElementById('pricing');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else navigate('/#pricing');
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 pointer-events-none">
      <div className="pointer-events-auto mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-white/15 bg-[#0a2540]/95 px-4 py-3 shadow-2xl backdrop-blur-md sm:px-5">
        <div className="hidden sm:flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-white">
            Prêt à réussir l'examen civique 2026 ?
          </p>
          <p className="hidden truncate text-xs text-white/60 sm:block">
            Accès illimité dès 4,17 €/mois — satisfait ou remboursé sous 7 jours.
          </p>
        </div>
        <Button
          onClick={goToPricing}
          className="shrink-0 gap-1.5 rounded-xl bg-white px-4 font-bold text-[#0a2540] hover:bg-white/90"
        >
          {user ? "S'abonner" : 'Voir les offres'}
          <ArrowRight className="h-4 w-4" />
        </Button>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Fermer"
          className="shrink-0 text-white/50 transition-colors hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
