import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { LANGUAGES, Language } from '@/lib/types';
import { Languages, Lock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSubscription } from '@/hooks/useSubscription';
import SubscriptionGate from '@/components/SubscriptionGate';

interface TranslateButtonProps {
  translatedText: string | null;
}

export default function TranslateButton({ translatedText }: TranslateButtonProps) {
  const { language, setLanguage } = useLanguage();
  const { isPremium } = useSubscription();
  const [showTranslation, setShowTranslation] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Language | null>(
    language !== 'fr' ? language : null,
  );

  const handleSelect = (lang: Language) => {
    setSelectedLang(lang);
    setLanguage(lang);
    setShowTranslation(true);
  };

  if (!translatedText) {
    return null;
  }

  if (showTranslation && selectedLang && isPremium) {
    return (
      <div className="mt-2 rounded-md border border-border bg-muted/50 p-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            {LANGUAGES[selectedLang]}
          </span>
          <button
            onClick={() => setShowTranslation(false)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>
        <p className="text-sm italic text-muted-foreground">{translatedText}</p>
      </div>
    );
  }

  // Non-Premium: show locked button
  if (!isPremium) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          className="mt-1 gap-1.5 text-xs text-muted-foreground"
          onClick={() => setShowGate(true)}
        >
          <Lock className="h-3.5 w-3.5" />
          <Languages className="h-3.5 w-3.5" />
          Traduire
        </Button>
        <SubscriptionGate open={showGate} onOpenChange={setShowGate} requiredTier="premium" />
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="mt-1 gap-1.5 text-xs text-muted-foreground">
          <Languages className="h-3.5 w-3.5" />
          Traduire
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {(Object.entries(LANGUAGES) as [Language, string][])
          .filter(([code]) => code !== 'fr')
          .map(([code, name]) => (
            <DropdownMenuItem key={code} onClick={() => handleSelect(code)}>
              {name}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
