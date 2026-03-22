import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { SubscriptionTier } from '@/hooks/useSubscription';
import {
  AlertTriangle, ArrowRight, Crown, X as XIcon,
  Loader2, Lock, Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface TierMismatchPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userTier: SubscriptionTier;
  requiredTier: 'standard' | 'premium';
  /** A short description of why they're blocked */
  featureLabel?: string;
}

/* ─── Messaging per scenario ─── */

interface MismatchContent {
  emoji: string;
  title: string;
  explanation: string;
  benefit: string;
  ctaLabel: string;
}

function getContent(userTier: SubscriptionTier, requiredTier: 'standard' | 'premium', featureLabel?: string): MismatchContent {
  // Standard user trying Premium feature
  if (userTier === 'standard' && requiredTier === 'premium') {
    return {
      emoji: '⚡',
      title: 'Oups ! Vous avez le forfait Standard',
      explanation: featureLabel
        ? `La fonctionnalité « ${featureLabel} » est réservée aux abonnés Premium.`
        : 'Cette fonctionnalité est réservée aux abonnés Premium.',
      benefit: 'Le forfait Premium vous permet de naviguer librement entre les classes, d\'utiliser la traduction instantanée et l\'entraînement ciblé par catégorie.',
      ctaLabel: 'Passer au Premium — 10,99 €/mois',
    };
  }

  // Fallback — shouldn't really happen since free users should see SubscriptionGate
  return {
    emoji: '🔒',
    title: 'Fonctionnalité verrouillée',
    explanation: featureLabel
      ? `« ${featureLabel} » nécessite un abonnement ${requiredTier === 'premium' ? 'Premium' : 'Standard'}.`
      : `Cette fonctionnalité nécessite un abonnement ${requiredTier === 'premium' ? 'Premium' : 'Standard'}.`,
    benefit: 'Abonnez-vous pour débloquer toutes les fonctionnalités.',
    ctaLabel: requiredTier === 'premium' ? 'Passer au Premium — 10,99 €/mois' : 'Passer au Standard — 6,99 €/mois',
  };
}

export default function TierMismatchPopup({
  open,
  onOpenChange,
  userTier,
  requiredTier,
  featureLabel,
}: TierMismatchPopupProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const content = getContent(userTier, requiredTier, featureLabel);

  const handleUpgrade = async () => {
    if (!user) {
      onOpenChange(false);
      navigate('/auth');
      return;
    }

    setIsProcessing(true);
    try {
      localStorage.setItem('pending_subscription_tier', requiredTier);

      const premiumLink = import.meta.env.VITE_STRIPE_PREMIUM_LINK || 'https://buy.stripe.com/cNiaEZ9QRcHz44i1gR6EU01';
      const standardLink = import.meta.env.VITE_STRIPE_STANDARD_LINK || 'https://buy.stripe.com/8x2dRb4wxfTLfN02kV6EU00';
      const baseUrl = requiredTier === 'premium' ? premiumLink : standardLink;

      const url = new URL(baseUrl);
      url.searchParams.set('client_reference_id', user.id);
      if (user.email) {
        url.searchParams.set('prefilled_email', user.email);
      }

      window.location.href = url.toString();
    } catch (err) {
      toast.error("Erreur lors de la redirection vers le paiement");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 sm:max-w-[420px] bg-white border-0 rounded-2xl shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 z-50 h-7 w-7 rounded-full bg-slate-100/80 hover:bg-slate-200 flex items-center justify-center text-slate-400 transition-colors"
          aria-label="Fermer"
        >
          <XIcon className="w-3.5 h-3.5" />
        </button>

        {/* Accent top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-red-400" />

        {/* Content */}
        <div className="px-6 pt-6 pb-2">
          {/* Emoji + title */}
          <div className="flex items-start gap-3 mb-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">{content.emoji}</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">{content.title}</h3>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">{content.explanation}</p>
            </div>
          </div>

          {/* Benefit box */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4 mb-1">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Premium</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{content.benefit}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-5 pt-3 space-y-2">
          <Button
            disabled={isProcessing}
            onClick={handleUpgrade}
            className="w-full text-white rounded-xl font-bold text-sm py-5 shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {content.ctaLabel}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
          <button
            onClick={() => onOpenChange(false)}
            className="w-full text-center text-xs text-slate-400 hover:text-slate-600 transition-colors py-1.5"
          >
            Non merci, rester en Standard
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
