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
    const [isProcessingPlan, setIsProcessingPlan] = useState<PlanKey | null>(null);

    // Never show a wall to someone who already has what they're reaching for.
    if (isPremium) return null;
    if (requiredTier === 'standard' && isStandardOrAbove) return null;

    // Only offer plans that would actually unlock the gated feature.
    const availablePlans: PlanKey[] =
      requiredTier === 'premium' ? ['premium', 'lifetime'] : ['standard', 'premium', 'lifetime'];

    const handleSubscribePlan = async (planKey: PlanKey) => {
      if (!user) {
        setPendingCheckout(planKey);
        onOpenChange(false);
        navigate('/auth?intent=checkout');
        return;
      }

      setIsProcessingPlan(planKey);
      try {
        await startCheckout(planKey, { id: user.id, email: user.email });
      } catch (err) {
        toast.error("Erreur lors de l'activation de l'abonnement");
        console.error(err);
        setIsProcessingPlan(null);
      }
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent ref={ref} className="p-0 sm:max-w-[580px] md:max-w-[800px] lg:max-w-[900px] bg-white border-0 rounded-3xl shadow-2xl overflow-hidden [&>button]:hidden">

          {/* ─── Top banner ─── */}
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 px-6 py-6 text-center overflow-hidden border-b border-slate-800">
            {/* French tricolore indicator */}
            <div className="absolute top-0 left-0 right-0 h-1.5 flex">
              <div className="w-1/3 bg-[#0055A4]" />
              <div className="w-1/3 bg-white" />
              <div className="w-1/3 bg-[#EF4135]" />
            </div>

            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 z-20 h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mx-auto mb-2 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
              <Lock className="w-5 h-5 text-white" />
            </div>

            <h2 className="text-lg font-bold text-white mb-0.5">Débloquez l'accès complet</h2>
            
            {featureLabel ? (
              <div className="inline-flex items-center gap-1.5 mt-1.5 bg-white/10 px-3 py-1 rounded-full text-white/90 text-[11px] font-medium border border-white/5">
                <Lock className="w-3 h-3" />
                {featureLabel}
              </div>
            ) : (
              <p className="text-xs text-white/60">
                Choisissez le forfait idéal pour réussir votre examen de naturalisation
              </p>
            )}
          </div>

          {/* ─── Body ─── */}
          <div className="p-5 md:p-6 bg-slate-50">
            
            {/* Pricing Cards Row — swipeable on mobile, columns on desktop */}
            <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory pb-4 md:pb-0 scrollbar-none">
              {availablePlans.map((id) => {
                const p = plans[id];
                const isPremiumPlan = id === 'premium';
                const isLifetimePlan = id === 'lifetime';

                return (
                  <div 
                    key={id}
                    className={`
                      snap-center shrink-0 w-[78vw] md:w-auto bg-white rounded-2xl border p-5 flex flex-col justify-between shadow-sm relative transition-all duration-300 hover:shadow-md
                      ${isPremiumPlan ? 'border-amber-500/60 shadow-amber-500/5 ring-1 ring-amber-500/10' : 'border-slate-200'}
                      ${isLifetimePlan ? 'border-purple-500/60 shadow-purple-500/5 ring-1 ring-purple-500/10' : ''}
                    `}
                  >
                    {/* Badge at the top */}
                    {id === 'lifetime' && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-purple-500">
                        Meilleur rapport
                      </span>
                    )}
                    {id === 'premium' && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-amber-500">
                        Le plus populaire
                      </span>
                    )}

                    <div>
                      {/* Card Header */}
                      <div className="flex items-center gap-2 mb-2">
                        <span 
                          className="w-7 h-7 rounded-lg flex items-center justify-center font-bold"
                          style={{ backgroundColor: `${p.color}15`, color: p.color }}
                        >
                          {p.icon}
                        </span>
                        <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">{p.name}</h3>
                      </div>

                      {/* Price display */}
                      <div className="mb-1 flex items-baseline gap-1">
                        <span className="text-2xl font-black text-slate-900">{p.price}€</span>
                        <span className="text-xs text-slate-400 font-semibold">{p.period}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold mb-4 leading-normal">
                        {p.periodLabel}
                      </p>

                      {/* Features List */}
                      <div className="space-y-2.5 mb-6 border-t border-slate-100 pt-3.5">
                        {p.features.map((feat, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-slate-600 leading-snug">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card Button */}
                    <Button
                      disabled={isProcessingPlan !== null}
                      onClick={() => handleSubscribePlan(id)}
                      className="w-full text-white rounded-xl font-bold text-xs h-10 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer mt-auto"
                      style={{
                        background: isLifetimePlan
                          ? 'linear-gradient(135deg, #7C3AED, #4F46E5)'
                          : isPremiumPlan
                          ? 'linear-gradient(135deg, #D97706, #B45309)'
                          : `linear-gradient(135deg, ${p.color}, #1B6ED6)`,
                      }}
                    >
                      {isProcessingPlan === id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          {id === 'lifetime' ? 'Activer à vie' : 'Essayer gratuitement'}
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Mobile swipe indicators */}
            <div className="flex md:hidden items-center justify-center gap-1.5 mt-2">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
            </div>

            {/* Current free plan comparison & secure guarantee bar */}
            <div className="mt-5 rounded-2xl bg-white border border-slate-200/80 px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Forfait Gratuit Actuel</p>
                <div className="flex flex-wrap gap-x-3.5 gap-y-1 mt-1">
                  {['1 examen/jour', '10 classes', 'Progression séquentielle'].map((f) => (
                    <span key={f} className="text-[11px] text-slate-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-left md:text-right border-t md:border-t-0 md:border-l border-slate-100 pt-2.5 md:pt-0 md:pl-4 flex-shrink-0 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-[11px] font-semibold text-slate-500">Paiement Stripe sécurisé 🔒</span>
              </div>
            </div>

          </div>
        </DialogContent>
      </Dialog>
    );
  }
);
SubscriptionGate.displayName = 'SubscriptionGate';
export default SubscriptionGate;
