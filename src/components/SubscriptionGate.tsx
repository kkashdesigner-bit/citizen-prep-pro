import { useState, useEffect, useCallback, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
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
    name: 'Standard', icon: <Sparkles className="w-4 h-4" />, price: '6,99', period: '/mois',
    periodLabel: 'Facturé mensuellement · 3 jours gratuits', color: '#0055A4', cta: 'Essayer gratuitement',
    features: ['Examens illimités', 'Parcours complet 1→100', 'Mode entraînement', 'Accès aux leçons', 'Suivi de progression'],
  },
  premium: {
    name: 'Premium', icon: <Crown className="w-4 h-4" />, price: '10,99', period: '/mois',
    periodLabel: 'Facturé mensuellement · 3 jours gratuits', color: '#D97706', cta: 'Essayer gratuitement',
    features: ['Tout dans Standard', 'Entraînement ciblé par catégorie', 'Traduction instantanée (5 langues)', 'Accès libre entre les classes', 'Guides vidéo'],
  },
  lifetime: {
    name: 'Accès à Vie', icon: <Infinity className="w-4 h-4" />, price: '99', period: ' à vie',
    periodLabel: 'Paiement unique · Aucun abonnement', color: '#7C3AED', cta: 'Activer à vie',
    features: ['Tout dans Premium', 'Accès Premium complet à vie', 'Accès anticipé aux nouveautés', 'Badge exclusif Membre Fondateur'],
  },
} as const;
type PlanKey = keyof typeof plans;

const planGradient = (id: PlanKey) =>
  id === 'lifetime' ? 'linear-gradient(135deg, #7C3AED, #4F46E5)'
  : id === 'premium' ? 'linear-gradient(135deg, #D97706, #B45309)'
  : 'linear-gradient(135deg, #0055A4, #1B6ED6)';

const SubscriptionGate = forwardRef<HTMLDivElement, SubscriptionGateProps>(
  function SubscriptionGate({ open, onOpenChange, requiredTier = 'standard', featureLabel }, ref) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { isPremium, isStandardOrAbove } = useSubscription();
    const [isProcessingPlan, setIsProcessingPlan] = useState<PlanKey | null>(null);

    // Plans that would actually unlock the gated feature.
    const availablePlans: PlanKey[] =
      requiredTier === 'premium' ? ['premium', 'lifetime'] : ['standard', 'premium', 'lifetime'];
    // Open centered on the "recommended" plan.
    const startIndex = Math.max(0, availablePlans.indexOf('premium'));

    // Embla carousel — swipe on mobile, static (drag off) on desktop.
    const [emblaRef, emblaApi] = useEmblaCarousel({
      align: 'center',
      containScroll: 'trimSnaps',
      startIndex,
      breakpoints: { '(min-width: 768px)': { active: false } },
    });
    const [selectedIndex, setSelectedIndex] = useState(startIndex);
    const onSelect = useCallback(() => {
      if (emblaApi) setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);
    useEffect(() => {
      if (!emblaApi) return;
      onSelect();
      emblaApi.on('select', onSelect);
      emblaApi.on('reInit', onSelect);
      return () => { emblaApi.off('select', onSelect); emblaApi.off('reInit', onSelect); };
    }, [emblaApi, onSelect]);

    // Never show a wall to someone who already has what they're reaching for.
    if (isPremium) return null;
    if (requiredTier === 'standard' && isStandardOrAbove) return null;

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

    const selectedPlan = availablePlans[selectedIndex] ?? availablePlans[0];

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent ref={ref} className="p-0 sm:max-w-[580px] md:max-w-[820px] lg:max-w-[900px] bg-white border-0 rounded-3xl shadow-2xl overflow-hidden [&>button]:hidden">

          {/* ─── Top banner ─── */}
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 px-6 py-6 text-center overflow-hidden border-b border-slate-800">
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
              <p className="text-xs text-white/60">Choisissez le forfait idéal pour réussir votre naturalisation</p>
            )}
          </div>

          {/* ─── Body ─── */}
          <div className="p-5 md:p-6 bg-slate-50">

            {/* Embla viewport */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4 py-3 md:py-1">
                {availablePlans.map((id, idx) => {
                  const p = plans[id];
                  const isSel = idx === selectedIndex;
                  const isPremiumPlan = id === 'premium';
                  const isLifetimePlan = id === 'lifetime';
                  return (
                    <div
                      key={id}
                      className={`relative shrink-0 flex-[0_0_82%] sm:flex-[0_0_60%] md:flex-[0_0_calc(33.333%-0.75rem)] bg-white rounded-2xl border p-5 flex flex-col justify-between shadow-sm transition-all duration-300
                        ${isLifetimePlan ? 'border-purple-500/50' : isPremiumPlan ? 'border-amber-500/50' : 'border-slate-200'}
                        ${isSel ? 'md:ring-0 ring-2 ring-offset-1 scale-[1.0]' : 'opacity-95 md:opacity-100'}`}
                      style={isSel ? { boxShadow: `0 10px 30px -10px ${p.color}55` } : undefined}
                    >
                      {isLifetimePlan && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">Meilleur rapport</span>
                      )}
                      {isPremiumPlan && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">Le plus populaire</span>
                      )}

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-7 h-7 rounded-lg flex items-center justify-center font-bold" style={{ backgroundColor: `${p.color}15`, color: p.color }}>
                            {p.icon}
                          </span>
                          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">{p.name}</h3>
                        </div>
                        <div className="mb-1 flex items-baseline gap-1">
                          <span className="text-2xl font-black text-slate-900">{p.price}€</span>
                          <span className="text-xs text-slate-400 font-semibold">{p.period}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold mb-4 leading-normal">{p.periodLabel}</p>
                        <div className="space-y-2.5 mb-5 border-t border-slate-100 pt-3.5">
                          {p.features.map((feat, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                              <span className="text-xs text-slate-600 leading-snug">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Per-card CTA — desktop only (mobile uses the single confirm bar) */}
                      <Button
                        disabled={isProcessingPlan !== null}
                        onClick={() => handleSubscribePlan(id)}
                        className="hidden md:flex w-full text-white rounded-xl font-bold text-xs h-10 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] mt-auto"
                        style={{ background: planGradient(id) }}
                      >
                        {isProcessingPlan === id ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{p.cta}<ArrowRight className="w-3.5 h-3.5 ml-1.5" /></>}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile: tracking dots + single confirm button */}
            <div className="md:hidden">
              <div className="flex items-center justify-center gap-1.5 mt-3">
                {availablePlans.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => emblaApi?.scrollTo(i)}
                    aria-label={`Forfait ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${i === selectedIndex ? 'w-5 bg-[#0055A4]' : 'w-1.5 bg-slate-300'}`}
                  />
                ))}
              </div>
              <Button
                disabled={isProcessingPlan !== null}
                onClick={() => handleSubscribePlan(selectedPlan)}
                className="w-full mt-4 text-white rounded-xl font-bold text-sm h-12 shadow-md transition-all active:scale-[0.99]"
                style={{ background: planGradient(selectedPlan) }}
              >
                {isProcessingPlan ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{plans[selectedPlan].cta} — {plans[selectedPlan].name}<ArrowRight className="w-4 h-4 ml-2" /></>}
              </Button>
            </div>

            {/* Free plan comparison + secure payment */}
            <div className="mt-5 rounded-2xl bg-white border border-slate-200/80 px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Forfait Gratuit Actuel</p>
                <div className="flex flex-wrap gap-x-3.5 gap-y-1 mt-1">
                  {['1 examen/jour', '10 classes', 'Progression séquentielle'].map((f) => (
                    <span key={f} className="text-[11px] text-slate-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />{f}
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
