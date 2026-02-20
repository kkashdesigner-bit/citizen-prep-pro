import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Check, CheckCircle2, Sparkles, GraduationCap, Users, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SubscriptionGateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requiredTier?: 'standard' | 'premium';
}

export default function SubscriptionGate({ open, onOpenChange, requiredTier = 'standard' }: SubscriptionGateProps) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'premium'>(requiredTier === 'premium' ? 'premium' : 'standard');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Liberté',
      icon: GraduationCap,
      price: '0 €',
      period: 'Forever',
      popular: false,
      features: [
        language === 'en' ? 'Basic History' : 'Histoire Basique',
        language === 'en' ? '1 Quiz/day' : '1 Quiz/jour'
      ]
    },
    {
      id: 'standard',
      name: 'Égalité',
      icon: Sparkles,
      price: '6,99 €',
      period: '/mo',
      popular: true,
      features: [
        language === 'en' ? 'Unlimited Quizzes' : 'Examens illimités',
        language === 'en' ? 'Training mode' : 'Mode entraînement',
        language === 'en' ? 'Progress Tracker' : 'Suivi progression',
        language === 'en' ? 'Learning path' : 'Parcours structuré'
      ]
    },
    {
      id: 'premium',
      name: 'Fraternité',
      icon: Users,
      price: '10,99 €',
      period: '/mo',
      popular: false,
      features: [
        language === 'en' ? 'Everything in Égalité' : 'Tout dans Égalité',
        language === 'en' ? 'Translations' : 'Traduction',
        language === 'en' ? 'Category training' : 'Catégories ciblées'
      ]
    }
  ];

  const handleSubscribe = async () => {
    if (!user) {
      onOpenChange(false);
      navigate('/auth');
      return;
    }

    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_tier: selectedPlan,
          is_subscribed: true
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success(language === 'en' ? `Subscribed to ${selectedPlan} successfully!` : `Abonnement ${selectedPlan} activé avec succès !`);
      onOpenChange(false);
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      toast.error(language === 'en' ? "Failed to activate subscription" : "Erreur lors de l'activation de l'abonnement");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 sm:max-w-[850px] overflow-hidden bg-white border-0 grid grid-cols-1 md:grid-cols-[3fr_4fr] gap-0 rounded-3xl shadow-2xl">

        {/* LEFT COLUMN - ILLUSTRATION (French Aesthetic) */}
        <div className="relative flex flex-col items-center justify-center p-8 overflow-hidden text-center bg-gradient-to-br from-blue-50 via-white to-red-50">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent"></div>

          {/* Abstract Eiffel Tower / French Flag Illustration */}
          <div className="relative mb-8 h-32 w-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-24 bg-slate-200" style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-10 bg-slate-300"></div>

            {/* Person */}
            <div className="absolute bottom-4 right-4 z-10 w-12 h-16">
              <div className="w-8 h-8 bg-amber-200 rounded-full mx-auto"></div>
              <div className="w-12 h-12 bg-red-500 rounded-t-full mt-1 mx-auto" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }}></div>
            </div>

            {/* Flag */}
            <div className="absolute top-4 right-0 flex shadow-sm transform -rotate-6">
              <div className="w-3 h-5 bg-blue-600"></div>
              <div className="w-3 h-5 bg-white"></div>
              <div className="w-3 h-5 bg-red-600"></div>
              {/* Flagpole */}
              <div className="w-0.5 h-12 bg-slate-800 absolute -left-0.5 top-0"></div>
            </div>

            <Sparkles className="w-6 h-6 text-yellow-500 absolute -left-2 top-4 animate-pulse" />
            <Sparkles className="w-4 h-4 text-yellow-500 absolute right-8 top-0 animate-pulse delay-150" />
          </div>

          <h2 className="z-10 mb-4 font-serif text-3xl font-bold text-slate-900 leading-tight">
            Maîtrisez votre destin.
          </h2>
          <p className="z-10 mb-8 max-w-[260px] text-sm text-slate-600">
            {language === 'en' ? 'Join thousands of future citizens preparing interactively for their French naturalization interview.' : 'Rejoignez des milliers de futurs citoyens se préparant de manière interactive à leur entretien de naturalisation.'}
          </p>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 z-10 bg-white/60 px-3 py-1.5 rounded-full shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            {language === 'en' ? 'Trusted by 5,000+ candidates' : 'Approuvé par +5 000 candidats'}
          </div>
        </div>

        {/* RIGHT COLUMN - TIERS */}
        <div className="relative p-6 md:p-8 flex flex-col bg-white">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">{language === 'en' ? 'Choose your path' : 'Choisissez votre voie'}</h3>
              <p className="text-sm text-slate-500">{language === 'en' ? 'Cancel anytime. No hidden fees.' : 'Annulation libre. Sans frais cachés.'}</p>
            </div>
          </div>

          {/* Tier Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isSelected = selectedPlan === plan.id;
              const isSelectable = plan.id !== 'free'; // Force them to choose standard or premium in the modal

              // Define colors based on the tier
              const themeColor = plan.id === 'premium' ? 'red' : plan.id === 'standard' ? 'blue' : 'slate';
              const borderClass = isSelected ? (themeColor === 'red' ? 'border-red-600 bg-red-50/30' : 'border-blue-600 bg-blue-50/30') : 'border-slate-100';
              const hoverClass = isSelectable ? (themeColor === 'red' ? 'hover:border-red-200 cursor-pointer' : 'hover:border-blue-200 cursor-pointer') : 'opacity-70';
              const textClass = themeColor === 'red' ? 'text-red-600' : themeColor === 'blue' ? 'text-blue-600' : 'text-slate-400';
              const bgClass = themeColor === 'red' ? 'bg-red-600' : themeColor === 'blue' ? 'bg-blue-600' : 'bg-slate-400';

              return (
                <div
                  key={plan.id}
                  onClick={() => isSelectable && setSelectedPlan(plan.id as any)}
                  className={`
                    relative flex flex-col p-4 rounded-xl border-2 transition-all duration-200 
                    ${hoverClass} 
                    ${borderClass}
                  `}
                >
                  {plan.popular && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${bgClass} text-white text-[10px] font-bold uppercase tracking-wider py-0.5 px-2 rounded-full whitespace-nowrap z-10`}>
                      {language === 'en' ? 'Most Popular' : 'Plus Populaire'}
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <span className="font-serif font-bold text-slate-900">{plan.name}</span>
                    <Icon className={`w-4 h-4 ${plan.id !== 'free' ? textClass : 'text-slate-400'}`} />
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold text-slate-900">{plan.price.split(' ')[0]}</span>
                      {plan.price.split(' ')[1] && <span className="text-sm font-bold text-slate-900 ml-1">{plan.price.split(' ')[1]}</span>}
                      <span className="text-xs text-slate-500 ml-1">{plan.period}</span>
                    </div>
                    {plan.period !== 'Forever' && (
                      <div className="text-[10px] text-slate-500 mt-1">{language === 'en' ? 'Billed monthly' : 'Facturé mensuellement'}</div>
                    )}
                  </div>

                  <ul className="flex-1 space-y-2 mb-4">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[10px] sm:text-xs text-slate-600">
                        <Check className={`w-3 h-3 ${plan.id !== 'free' ? textClass : 'text-slate-400'} shrink-0 mt-0.5`} />
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex justify-center">
                    <div className={`
                      w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors
                      ${isSelected ? (themeColor === 'red' ? 'border-red-600' : 'border-blue-600') : 'border-slate-300'}
                    `}>
                      {isSelected && <div className={`w-2 h-2 rounded-full ${bgClass}`} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-auto pt-4 flex flex-col items-center">
            {/* 7 Days Free Trial bar mock */}
            <div className="w-full mb-4">
              <div className="flex justify-between text-[11px] font-semibold mb-1">
                <span className="text-slate-900">{language === 'en' ? 'Trial starts today' : 'Essai dès aujourd\'hui'}</span>
                <span className={selectedPlan === 'premium' ? 'text-red-600' : 'text-blue-600'}>
                  7 {language === 'en' ? 'Days Free' : 'Jours Gratuits'}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full w-[15%] rounded-full transition-colors ${selectedPlan === 'premium' ? 'bg-red-600' : 'bg-blue-600'}`}></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>{language === 'en' ? 'Day 1' : 'Jour 1'}</span>
                <span>{language === 'en' ? 'Day 7 (First charge)' : 'Jour 7 (Premier prélèvement)'}</span>
              </div>
            </div>

            <Button
              disabled={isProcessing}
              onClick={handleSubscribe}
              className={`w-full text-white rounded-full font-bold text-base py-6 shadow-lg transition-all hover:scale-[1.02]
                ${selectedPlan === 'premium' ? 'bg-red-600 hover:bg-red-700 shadow-red-600/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'}
              `}
            >
              {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  {language === 'en' ? 'Unlock Now' : 'Débloquer maintenant'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            <p className="text-[10px] text-slate-400 mt-4 text-center">
              {language === 'en' ? 'Secure payment via Stripe. By continuing, you agree to our Terms.' : 'Paiement sécurisé via Stripe. En continuant, vous acceptez nos CGU.'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
