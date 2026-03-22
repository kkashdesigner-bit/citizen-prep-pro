import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useSubscription, SubscriptionTier } from '@/hooks/useSubscription';
import {
  Check, X as XIcon, Lock, ArrowRight, Sparkles,
  GraduationCap, Route, BookOpen, Info
} from 'lucide-react';

type TierContext = 'parcours' | 'exams' | 'courses';

interface TierInfoPopupProps {
  context: TierContext;
  onUpgrade?: () => void;
}

/* ─── Content definitions per tier & context ─── */

interface TierContextContent {
  title: string;
  subtitle: string;
  allowed: string[];
  blocked: string[];
  upgradeLabel: string;
  upgradeTier: 'standard' | 'premium';
}

function getContent(tier: SubscriptionTier, context: TierContext): TierContextContent | null {
  if (tier === 'premium') return null; // Premium sees nothing

  if (tier === 'free') {
    switch (context) {
      case 'parcours':
        return {
          title: 'Forfait Gratuit',
          subtitle: 'Voici ce que vous pouvez faire dans le Parcours',
          allowed: [
            'Classes 1 à 10 — accès séquentiel',
            '1 examen blanc par jour',
            'Démo gratuite illimitée',
          ],
          blocked: [
            'Classes 11 à 100 verrouillées',
            'Mode entraînement par catégorie',
            'Traduction instantanée',
          ],
          upgradeLabel: 'Débloquer tout le parcours',
          upgradeTier: 'standard',
        };
      case 'exams':
        return {
          title: 'Forfait Gratuit',
          subtitle: 'Vos limites pour les examens blancs',
          allowed: [
            '1 examen blanc par jour',
            'Démo gratuite illimitée (20 questions)',
            'Résultats détaillés après chaque examen',
          ],
          blocked: [
            'Examens illimités (Standard+)',
            'Entraînement ciblé par catégorie (Premium)',
          ],
          upgradeLabel: 'Examens illimités',
          upgradeTier: 'standard',
        };
      case 'courses':
        return {
          title: 'Forfait Gratuit',
          subtitle: 'Vos limites pour les cours',
          allowed: [
            '10 premiers cours accessibles',
            'Flashcards et quiz intégrés',
            'Progression séquentielle',
          ],
          blocked: [
            'Cours 11 à 100 verrouillés',
            'Navigation libre entre les cours (Premium)',
            'Traduction instantanée (Premium)',
          ],
          upgradeLabel: 'Débloquer tous les cours',
          upgradeTier: 'standard',
        };
    }
  }

  // Standard tier
  switch (context) {
    case 'parcours':
      return {
        title: 'Forfait Standard',
        subtitle: 'Voici vos avantages dans le Parcours',
        allowed: [
          '100 classes — parcours complet',
          'Examens blancs illimités',
          'Mode entraînement',
          'Suivi de progression',
        ],
        blocked: [
          'Accès libre entre les classes (Premium)',
          'Traduction instantanée (Premium)',
          'Entraînement ciblé par catégorie (Premium)',
        ],
        upgradeLabel: 'Passer au Premium',
        upgradeTier: 'premium',
      };
    case 'exams':
      return {
        title: 'Forfait Standard',
        subtitle: 'Vos avantages pour les examens',
        allowed: [
          'Examens blancs illimités',
          'Résultats détaillés',
          'Suivi de progression',
        ],
        blocked: [
          'Entraînement ciblé par catégorie (Premium)',
          'Traduction instantanée (Premium)',
        ],
        upgradeLabel: 'Passer au Premium',
        upgradeTier: 'premium',
      };
    case 'courses':
      return {
        title: 'Forfait Standard',
        subtitle: 'Vos avantages pour les cours',
        allowed: [
          'Accès aux 100 cours',
          'Flashcards et quiz intégrés',
          'Progression séquentielle complète',
          'Accès aux leçons',
        ],
        blocked: [
          'Navigation libre entre les cours (Premium)',
          'Traduction instantanée (Premium)',
          'Entraînement ciblé par catégorie (Premium)',
        ],
        upgradeLabel: 'Passer au Premium',
        upgradeTier: 'premium',
      };
  }
}

const CONTEXT_ICONS: Record<TierContext, React.ElementType> = {
  parcours: Route,
  exams: GraduationCap,
  courses: BookOpen,
};

const TIER_EMOJI: Record<SubscriptionTier, string> = {
  free: '🎓',
  standard: '✨',
  premium: '👑',
};

const TIER_COLORS: Record<SubscriptionTier, { bg: string; border: string; accent: string }> = {
  free: { bg: 'bg-blue-50', border: 'border-blue-200', accent: '#1764ac' },
  standard: { bg: 'bg-indigo-50', border: 'border-indigo-200', accent: '#4F46E5' },
  premium: { bg: 'bg-amber-50', border: 'border-amber-200', accent: '#D97706' },
};

export default function TierInfoPopup({ context, onUpgrade }: TierInfoPopupProps) {
  const { tier, loading } = useSubscription();
  const [open, setOpen] = useState(false);

  const storageKey = `tier_info_seen_${context}_${tier}`;

  useEffect(() => {
    if (loading || tier === 'premium') return;
    // Show once per session per context per tier
    const seen = sessionStorage.getItem(storageKey);
    if (!seen) {
      // Slight delay so the page renders first
      const timer = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, [loading, tier, storageKey]);

  const handleClose = () => {
    sessionStorage.setItem(storageKey, 'true');
    setOpen(false);
  };

  const handleUpgrade = () => {
    sessionStorage.setItem(storageKey, 'true');
    setOpen(false);
    onUpgrade?.();
  };

  if (loading || tier === 'premium') return null;

  const content = getContent(tier, context);
  if (!content) return null;

  const ContextIcon = CONTEXT_ICONS[context];
  const colors = TIER_COLORS[tier];

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="p-0 sm:max-w-[440px] bg-white border-0 rounded-2xl shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-50 h-7 w-7 rounded-full bg-slate-100/80 hover:bg-slate-200 flex items-center justify-center text-slate-400 transition-colors"
          aria-label="Fermer"
        >
          <XIcon className="w-3.5 h-3.5" />
        </button>

        {/* Header — colored stripe */}
        <div className={`${colors.bg} ${colors.border} border-b px-6 pt-6 pb-5`}>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-sm"
              style={{ backgroundColor: colors.accent }}
            >
              <ContextIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{TIER_EMOJI[tier]}</span>
                <h3 className="text-base font-bold text-slate-900">{content.title}</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{content.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Allowed */}
          <div>
            <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Inclus dans votre forfait
            </h4>
            <ul className="space-y-2">
              {content.allowed.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Blocked */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Non inclus
            </h4>
            <ul className="space-y-2">
              {content.blocked.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-400">
                  <XIcon className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 space-y-2">
          <Button
            onClick={handleUpgrade}
            className="w-full text-white rounded-xl font-bold text-sm py-5 shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}CC)` }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {content.upgradeLabel}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <button
            onClick={handleClose}
            className="w-full text-center text-xs text-slate-400 hover:text-slate-600 transition-colors py-1"
          >
            J'ai compris, continuer
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
