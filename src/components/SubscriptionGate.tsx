import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Check, ArrowRight, Loader2, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface SubscriptionGateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requiredTier?: 'standard' | 'premium';
}

const plans = [
  {
    id: 'free' as const,
    name: 'Liberté',
    iconSymbol: '🎓',
    price: '0',
    currency: '€',
    period: 'Forever',
    periodLabel: '',
    popular: false,
    colorClass: 'blue',
    features: ['Histoire basique', '1 Quiz/jour'],
  },
  {
    id: 'standard' as const,
    name: 'Égalité',
    iconSymbol: '✨',
    price: '6,99',
    currency: '€',
    period: '/mo',
    periodLabel: 'Facturé mensuellement',
    popular: true,
    colorClass: 'blue',
    features: ['Examens illimités', 'Mode entraînement', 'Suivi progression', 'Parcours structuré'],
  },
  {
    id: 'premium' as const,
    name: 'Fraternité',
    iconSymbol: '👥',
    price: '10,99',
    currency: '€',
    period: '/mo',
    periodLabel: 'Facturé mensuellement',
    popular: false,
    colorClass: 'red',
    features: ['Tout dans Égalité', 'Traduction', 'Catégories ciblées'],
  },
];

export default function SubscriptionGate({ open, onOpenChange, requiredTier = 'standard' }: SubscriptionGateProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'premium'>(requiredTier === 'premium' ? 'premium' : 'standard');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      onOpenChange(false);
      navigate('/auth');
      return;
    }

    setIsProcessing(true);
    try {
      localStorage.setItem('pending_subscription_tier', selectedPlan);

      const premiumLink = 'https://buy.stripe.com/test_7sYfZ96hz9tI3t12A69AA01';
      const standardLink = 'https://buy.stripe.com/test_28EcMXbBT6hw3t1a2y9AA00';
      const baseUrl = selectedPlan === 'premium' ? premiumLink : standardLink;

      const url = new URL(baseUrl);
      url.searchParams.set('client_reference_id', user.id);
      if (user.email) {
        url.searchParams.set('prefilled_email', user.email);
      }

      window.location.href = url.toString();
    } catch (err) {
      toast.error("Erreur lors de l'activation de l'abonnement");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 sm:max-w-[920px] max-h-[90vh] overflow-y-auto bg-white border-0 grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-0 rounded-3xl shadow-2xl">

        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-50 h-8 w-8 rounded-full bg-slate-100/80 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ─── LEFT COLUMN — Illustration ─── */}
        <div className="relative flex flex-col items-center justify-center p-6 md:p-10 overflow-hidden text-center bg-[#F7F9FC]">
          {/* Decorative blurs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[#0055A4]/8 blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-[#EF4135]/8 blur-3xl" />
          </div>

          {/* French-themed SVG illustration */}
          <div className="relative mb-8" style={{ animation: 'subFloat 6s ease-in-out infinite' }}>
            <svg width="180" height="220" viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Eiffel Tower base */}
              <path d="M60 220 L140 220 L130 180 L70 180 Z" fill="#CBD5E1" />
              <path d="M75 180 L125 180 L115 120 L85 120 Z" fill="#94A3B8" />
              <path d="M85 120 L115 120 L100 40 Z" fill="#64748B" />
              {/* Person */}
              <circle cx="130" cy="140" r="22" fill="#FFE4C4" />
              <path d="M130 162 C112 162 103 215 103 215 L157 215 C157 215 148 162 130 162 Z" fill="#EF4135" opacity="0.85" />
              {/* Flag */}
              <path d="M150 140 L150 80 L190 80 L190 108 L150 108" fill="none" stroke="#334155" strokeWidth="2" />
              <rect x="152" y="80" width="12" height="28" fill="#0055A4" />
              <rect x="164" y="80" width="12" height="28" fill="#FFFFFF" />
              <rect x="176" y="80" width="12" height="28" fill="#EF4135" />
              {/* Stars */}
              <path d="M30 60 L35 50 L40 60 L50 65 L40 70 L35 80 L30 70 L20 65 Z" fill="#FBBF24" opacity="0.8" style={{ animation: 'subPulse 3s ease-in-out infinite' }} />
              <path d="M170 38 L173 33 L176 38 L181 40 L176 42 L173 47 L170 42 L165 40 Z" fill="#FBBF24" opacity="0.7" style={{ animation: 'subPulse 3s ease-in-out infinite 0.5s' }} />
            </svg>
          </div>

          <h2 className="relative z-10 font-serif text-3xl font-bold text-slate-900 leading-tight mb-4">
            Maîtrisez votre destin.
          </h2>
          <p className="relative z-10 text-sm text-slate-500 max-w-[260px] leading-relaxed mb-8">
            Rejoignez des milliers de futurs citoyens se préparant de manière interactive à leur entretien de naturalisation.
          </p>
          <div className="relative z-10 inline-flex items-center gap-2 text-xs font-medium text-slate-500 bg-white/70 px-4 py-2 rounded-full shadow-sm border border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Approuvé par +5 000 candidats
          </div>
        </div>

        {/* ─── RIGHT COLUMN — Tiers ─── */}
        <div className="relative p-6 md:p-8 flex flex-col bg-white">
          {/* Header */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">Choisissez votre voie</h3>
            <p className="text-sm text-slate-400 mt-0.5">Annulation libre. Sans frais cachés.</p>
          </div>

          {/* Tier Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              const isSelectable = plan.id !== 'free';
              const accentColor = plan.id === 'premium' ? '#EF4135' : '#0055A4';

              return (
                <div
                  key={plan.id}
                  onClick={() => isSelectable && setSelectedPlan(plan.id as 'standard' | 'premium')}
                  className={`
                    relative flex flex-col p-5 rounded-2xl border-2 transition-all duration-300
                    ${isSelectable ? 'cursor-pointer hover:-translate-y-1 hover:shadow-md' : 'opacity-70'}
                    ${isSelected ? 'shadow-lg' : 'border-slate-100 bg-white'}
                  `}
                  style={isSelected ? {
                    borderColor: accentColor,
                    backgroundColor: `${accentColor}05`,
                    boxShadow: `0 8px 24px ${accentColor}18`,
                  } : {}}
                >
                  {/* Popular badge */}
                  {plan.popular && (
                    <div
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full whitespace-nowrap z-10"
                      style={{ backgroundColor: accentColor }}
                    >
                      Plus Populaire
                    </div>
                  )}

                  {/* Top stripe for non-popular cards */}
                  {!plan.popular && isSelectable && (
                    <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl" style={{ backgroundColor: accentColor, opacity: 0.7 }} />
                  )}

                  {/* Name + icon */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-serif font-bold text-base text-slate-900">{plan.name}</span>
                    <span className="text-lg">{plan.iconSymbol}</span>
                  </div>

                  {/* Price */}
                  <div className="mb-1">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-3xl font-extrabold text-slate-900">{plan.price}</span>
                      <span className="text-base font-bold text-slate-900 ml-0.5">{plan.currency}</span>
                      <span className="text-xs text-slate-400 ml-1">{plan.period}</span>
                    </div>
                    {plan.periodLabel && (
                      <p className="text-[10px] text-slate-400 mt-0.5">{plan.periodLabel}</p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="flex-1 space-y-2 my-4">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: isSelectable ? accentColor : '#94A3B8' }} />
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Radio dot */}
                  <div className="mt-auto flex justify-center pt-2">
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                      style={{ borderColor: isSelected ? accentColor : '#CBD5E1' }}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trial progress bar */}
          <div className="mb-5">
            <div className="flex justify-between text-xs font-medium text-slate-600 mb-1.5">
              <span>Essai dès aujourd'hui</span>
              <span className="font-bold" style={{ color: '#0055A4' }}>7 Jours Gratuits</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full transition-all duration-1000"
                style={{
                  width: '15%',
                  background: 'linear-gradient(90deg, #0055A4, #4D94E0)',
                  boxShadow: '0 0 8px rgba(0,85,164,0.4)',
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Jour 1</span>
              <span>Jour 7 (Premier prélèvement)</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-auto">
            <Button
              disabled={isProcessing}
              onClick={handleSubscribe}
              className="w-full text-white rounded-full font-bold text-base py-6 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-[#0055A4] to-[#4D94E0] hover:from-[#003d7a] hover:to-[#3a7cc7]"
              style={{
                animation: 'subBtnPulse 2.5s infinite',
              }}
            >
              {isProcessing ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Débloquer maintenant
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            <p className="text-[10px] text-slate-400 mt-4 text-center">
              Paiement sécurisé via Stripe. En continuant, vous acceptez nos CGU.
            </p>
          </div>
        </div>

        {/* Scoped animations */}
        <style>{`
          @keyframes subFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes subPulse {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
          }
          @keyframes subBtnPulse {
            0% { box-shadow: 0 0 0 0 rgba(0,85,164,0.5); }
            70% { box-shadow: 0 0 0 10px rgba(0,85,164,0); }
            100% { box-shadow: 0 0 0 0 rgba(0,85,164,0); }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
