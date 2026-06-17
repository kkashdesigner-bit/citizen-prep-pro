import { useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Check, ArrowRight, Loader2, X, CheckCircle2, Lock, Crown, Sparkles, Infinity } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { setPendingCheckout, startCheckout } from '@/lib/checkout';
import { toast } from 'sonner';

interface SubscriptionGateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requiredTier?: 'standard' | 'premium';
  featureLabel?: string;
}

const plans = {
  standard: {
    name: 'Standard',
    icon: <Sparkles className="w-4 h-4" />,
    price: '6,99',
    priceLabel: '6,99 €/mois',
    period: '/mois',
    periodLabel: 'Facturé mensuellement · 3 jours gratuits',
    color: '#0055A4',
    badge: null as string | null,
    features: [
      'Examens illimités',
      'Parcours complet 1→100',
      'Mode entraînement',
      'Accès aux leçons',
      'Suivi de progression',
    ],
  },
  premium: {
    name: 'Premium',
    icon: <Crown className="w-4 h-4" />,
    price: '10,99',
    priceLabel: '10,99 €/mois',
    period: '/mois',
    periodLabel: 'Facturé mensuellement · 3 jours gratuits',
    color: '#D97706',
    badge: null as string | null,
    features: [
      'Tout dans Standard',
      'Entraînement ciblé par catégorie',
      'Traduction instantanée (5 langues)',
      'Accès libre entre les classes',
      'Guides vidéo',
    ],
  },
  lifetime: {
    name: 'Accès à Vie',
    icon: <Infinity className="w-4 h-4" />,
    price: '99',
    priceLabel: '99 € une fois',
    period: ' à vie',
    periodLabel: 'Paiement unique · Aucun abonnement',
    color: '#7C3AED',
    badge: 'Meilleur rapport',
    features: [
      'Tout dans Premium',
      'Accès Premium complet à vie',
      'Accès anticipé aux nouvelles fonctionnalités',
      'Badge exclusif Membre Fondateur',
    ],
  },
} as const;

type PlanKey = keyof typeof plans;

const SubscriptionGate = forwardRef<HTMLDivElement, SubscriptionGateProps>(
  function SubscriptionGate({ open, onOpenChange, requiredTier = 'standard', featureLabel }, ref) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { isPremium, isStandardOrAbove } = useSubscription();
    const [selectedPlan, setSelectedPlan] = useState<PlanKey>('lifetime');
    const [isProcessing, setIsProcessing] = useState(false);

    // Never show a wall to someone who already has what they're reaching for.
    // Premium/lifetime users have everything; a Standard user only ever hits a
    // wall on genuinely Premium-only features (requiredTier === 'premium').
    if (isPremium) return null;
    if (requiredTier === 'standard' && isStandardOrAbove) return null;

    // Only offer plans that would actually unlock the gated feature.
    const availablePlans: PlanKey[] =
      requiredTier === 'premium' ? ['premium', 'lifetime'] : ['standard', 'premium', 'lifetime'];

    const plan = plans[selectedPlan];

    const handleSubscribe = async () => {
      if (!user) {
        setPendingCheckout(selectedPlan);
        onOpenChange(false);
        navigate('/auth?intent=checkout');
        return;
      }

      setIsProcessing(true);
      try {
        await startCheckout(selectedPlan, { id: user.id, email: user.email });
      } catch (err) {
        toast.error("Erreur lors de l'activation de l'abonnement");
        console.error(err);
        setIsProcessing(false);
      }
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent ref={ref} className="p-0 sm:max-w-[480px] bg-white border-0 rounded-3xl shadow-2xl overflow-hidden [&>button]:hidden">

          {/* ─── Top banner ─── */}
          <div className="relative bg-gradient-to-br from-[#0055A4] via-[#1B6ED6] to-[#7C3AED] px-6 pt-7 pb-5 text-center overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-8 w-20 h-20 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />

            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-3 right-3 z-20 h-7 w-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="mx-auto mb-3 w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Lock className="w-7 h-7 text-white" />
            </div>

            <h2 className="text-lg font-bold text-white mb-1">Débloquez cette fonctionnalité</h2>

            {featureLabel && (
              <div className="inline-flex items-center gap-1.5 mt-1.5 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full text-white/90 text-xs font-medium border border-white/10">
                <Lock className="w-3 h-3" />
                {featureLabel}
              </div>
            )}
          </div>

          {/* ─── Body ─── */}
          <div className="px-6 pt-5 pb-6">

            {/* Plan toggle */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-5">
              {availablePlans.map((id) => {
                const p = plans[id];
                const isActive = selectedPlan === id;
                return (
                  <button
                    key={id}
                    onClick={() => setSelectedPlan(id)}
                    className={`
                      relative flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer
                      ${isActive ? 'bg-white shadow-md text-slate-900' : 'text-slate-500 hover:text-slate-700'}
                    `}
                  >
                    {p.badge && (
                      <span className="absolute -top-2 -right-1 bg-violet-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                        {p.badge}
                      </span>
                    )}
                    <span className={isActive ? '' : 'opacity-60'}>{p.icon}</span>
                    {p.name}
                    <span className="text-xs font-bold" style={{ color: isActive ? p.color : undefined }}>
                      {p.price}€
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Period label */}
            <p className="text-center text-[11px] text-slate-400 font-medium -mt-3 mb-4">
              {plan.periodLabel}
            </p>

            {/* Selected plan features */}
            <div className="space-y-2.5 mb-5">
              {plan.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${plan.color}18` }}
                  >
                    <Check className="w-3 h-3" style={{ color: plan.color }} />
                  </div>
                  <span className="text-sm text-slate-700">{feat}</span>
                </div>
              ))}
            </div>

            {/* Free tier comparison */}
            <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 mb-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Forfait Gratuit actuel</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {['1 examen/jour', '10 classes', 'Séquentiel'].map((f) => (
                  <span key={f} className="text-xs text-slate-400 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Trust badge */}
            <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 mb-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs text-emerald-800 leading-snug">
                {selectedPlan === 'lifetime'
                   ? <><span className="font-bold">Paiement unique, accès éternel.</span> Aucun frais récurrent — jamais.</>
                   : <><span className="font-bold">3 jours gratuits, sans engagement.</span> Aucun débit pendant l'essai. Annulez quand vous voulez.</>
                }
              </p>
            </div>

            {/* CTA */}
            <Button
              disabled={isProcessing}
              onClick={handleSubscribe}
              className="w-full text-white rounded-xl font-bold text-sm h-12 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{
                background: selectedPlan === 'lifetime'
                  ? 'linear-gradient(135deg, #7C3AED, #4F46E5)'
                  : `linear-gradient(135deg, ${plan.color}, #3a7cc7)`,
              }}
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : selectedPlan === 'lifetime' ? (
                <>
                  <Infinity className="w-4 h-4 mr-2" />
                  Accès à Vie — 99 € une fois
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Commencer l'essai gratuit — {plan.price}€{plan.period}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {selectedPlan === 'lifetime' ? 'Paiement unique' : 'Sans engagement'}
              </span>
              <span className="w-px h-3 bg-slate-200" />
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {selectedPlan === 'lifetime' ? 'Accès éternel' : 'Annulation libre'}
              </span>
              <span className="w-px h-3 bg-slate-200" />
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Stripe sécurisé
              </span>
            </div>
          </div>

        </DialogContent>
      </Dialog>
    );
  }
);

SubscriptionGate.displayName = 'SubscriptionGate';
export default SubscriptionGate;
