import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Globe, X, Loader2, Lock, Crown, ArrowRight, Sparkles } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  text: string;
  onTranslated: (translated: string) => void;
}

export default function TranslateButton({ text, onTranslated }: Props) {
  const { isPremium } = useSubscription();
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [shown, setShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const simulateTranslation = async (originalText: string, targetLang: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return `${originalText} [Mock Translation to ${targetLang.toUpperCase()}]`;
  };

  async function handleClick() {
    if (!isPremium) {
      setShowPopup(true);
      return;
    }
    if (shown) {
      setShown(false);
      return;
    }

    setLoading(true);
    try {
      const result = await simulateTranslation(text, language);
      setTranslatedText(result);
      setShown(true);
      onTranslated(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleSubscribe = async () => {
    if (!user) {
      setShowPopup(false);
      navigate('/auth');
      return;
    }

    setIsProcessing(true);
    try {
      localStorage.setItem('pending_subscription_tier', 'premium');

      const premiumLink = 'https://buy.stripe.com/test_7sYfZ96hz9tI3t12A69AA01';
      const url = new URL(premiumLink);
      url.searchParams.set('client_reference_id', user.id);
      if (user.email) {
        url.searchParams.set('prefilled_email', user.email);
      }

      window.location.href = url.toString();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'activation de l'abonnement");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <Button
          onClick={handleClick}
          variant="outline"
          size="sm"
          className="gap-2 self-start"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : shown ? (
            <X className="h-4 w-4" />
          ) : (
            <Globe className="h-4 w-4" />
          )}
          {shown ? "Masquer la traduction" : "Traduire"}
          {!isPremium && (
            <span className="ml-1 rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-600">
              Premium
            </span>
          )}
        </Button>

        {shown && translatedText && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground animate-in fade-in zoom-in-95 duration-200">
            {translatedText}
          </div>
        )}
      </div>

      {/* ─── Beautiful Translate Upgrade Popup ─── */}
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="p-0 sm:max-w-[440px] bg-white border-0 rounded-3xl shadow-2xl overflow-hidden">
          {/* Close button */}
          <button
            onClick={() => setShowPopup(false)}
            className="absolute top-4 right-4 z-50 h-8 w-8 rounded-full bg-white/80 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Top gradient banner */}
          <div className="relative bg-gradient-to-br from-[#0055A4] via-[#1B6ED6] to-[#0055A4] px-8 pt-10 pb-8 text-center overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-8 w-16 h-16 bg-[#EF4135]/10 rounded-full blur-xl pointer-events-none" />

            {/* Animated globe icon */}
            <div className="relative mx-auto mb-5 w-20 h-20 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/20"
              style={{ animation: 'subFloat 4s ease-in-out infinite' }}
            >
              <Globe className="w-10 h-10 text-white" />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center shadow-md border-2 border-white">
                <Lock className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-white mb-2">
              Besoin d'aide avec le français ?
            </h2>
            <p className="text-white/70 text-sm max-w-[300px] mx-auto leading-relaxed">
              Traduisez instantanément chaque question dans votre langue maternelle.
            </p>
          </div>

          {/* Bottom content */}
          <div className="px-8 py-6">
            {/* Feature highlights */}
            <div className="space-y-3 mb-4">
              {[
                { icon: Globe, text: "Traduction instantanée de toutes les questions" },
                { icon: Crown, text: "Accès à toutes les fonctionnalités Premium" },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#0055A4]/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#0055A4]" />
                  </div>
                  <p className="text-sm text-slate-700 font-medium">{text}</p>
                </div>
              ))}
            </div>

            {/* Supported languages */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Langues disponibles</p>
              <div className="flex flex-wrap gap-1.5">
                {['🇬🇧 Anglais', '🇸🇦 Arabe', '🇪🇸 Espagnol', '🇧🇷 Portugais', '🇨🇳 Chinois'].map((lang) => (
                  <span key={lang} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">{lang}</span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Button
              disabled={isProcessing}
              onClick={handleSubscribe}
              className="w-full bg-gradient-to-r from-[#0055A4] to-[#1B6ED6] hover:from-[#003F7F] hover:to-[#0055A4] text-white font-bold rounded-xl h-12 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:scale-[1.02] text-base gap-2"
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Crown className="w-5 h-5 text-amber-300" />
                  Passer au forfait Premium
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            <p className="text-center text-xs text-slate-400 mt-3">
              Annulation libre · Sans engagement
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes subFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
}
