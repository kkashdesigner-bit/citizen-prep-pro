import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe, X } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import SubscriptionGate from "@/components/SubscriptionGate";

interface Props {
  text: string;
  onTranslated: (translated: string) => void;
}

export default function TranslateButton({ text, onTranslated }: Props) {
  const { isPremium } = useSubscription();
  const [showGate, setShowGate] = useState(false);
  const [shown, setShown] = useState(false);

  function handleClick() {
    if (!isPremium) {
      setShowGate(true);
      return;
    }
    if (shown) {
      setShown(false);
      return;
    }
    setShown(true);
    onTranslated(text);
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <Button
          onClick={handleClick}
          variant="outline"
          size="sm"
          className="gap-2 self-start"
        >
          {shown ? <X className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
          {shown ? "Masquer la traduction" : "Traduire"}
          {!isPremium && (
            <span className="ml-1 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary">
              Premium
            </span>
          )}
        </Button>

        {shown && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
            {text}
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
