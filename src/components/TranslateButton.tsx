import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

interface Props {
  text: string;
  onTranslated: (translated: string) => void;
}

export default function TranslateButton({ text, onTranslated }: Props) {

  const { subscriptionTier } = useSubscription();

  const [loading, setLoading] = useState(false);

  const isPremium = subscriptionTier === "premium";

  async function translate() {

    if (!isPremium) {

      alert("Cette fonctionnalité est réservée aux abonnés Premium");

      return;
    }

    setLoading(true);

    try {

      const res = await fetch("/api/translate", {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

        },

        body: JSON.stringify({

          text,

        }),

      });

      const data = await res.json();

      onTranslated(data.translation);

    } catch {

      alert("Erreur traduction");

    }

    setLoading(false);

  }

  return (

    <Button

      onClick={translate}

      disabled={loading}

      variant={isPremium ? "default" : "outline"}

      className={

        isPremium

          ? "bg-blue-600 hover:bg-blue-700 text-white"

          : "opacity-50 cursor-not-allowed"

      }

    >

      <Globe className="mr-2 h-4 w-4" />

      Traduire

      {!isPremium && (

        <span className="ml-2 text-xs">

          Premium

        </span>

      )}

    </Button>

  );
}
