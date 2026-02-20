import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe, X, Loader2 } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useLanguage } from "@/contexts/LanguageContext";
import SubscriptionGate from "@/components/SubscriptionGate";

interface Props {
  text: string;
  onTranslated: (translated: string) => void;
}

export default function TranslateButton({ text, onTranslated }: Props) {
  const { isPremium } = useSubscription();
  const { language } = useLanguage();
  const [showGate, setShowGate] = useState(false);
  const [shown, setShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState("");

  const simulateTranslation = async (originalText: string, targetLang: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return `${originalText} [Mock Translation to ${targetLang.toUpperCase()}]`;
  };

  async function handleClick() {
    if (!isPremium) {
      setShowGate(true);
      return;
    }
    if (shown) {
      setShown(false);
      return;
    }

    // Perform mock translation
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
            <span className="ml-1 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary">
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

      <SubscriptionGate
        open={showGate}
        onOpenChange={setShowGate}
        requiredTier="premium"
      />
    </>
  );
}
