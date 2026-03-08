import type { SubscriptionTier } from '@/hooks/useSubscription';

export const TIER_LABELS: Record<SubscriptionTier, string> = {
  free: 'Gratuit',
  standard: 'Standard — 6,99 €/mois',
  premium: 'Premium — 10,99 €/mois',
};

export const TIER_BADGE_VARIANT: Record<SubscriptionTier, 'secondary' | 'default' | 'destructive' | 'outline'> = {
  free: 'secondary',
  standard: 'default',
  premium: 'default',
};

export const TIER_BADGE_CLASS: Record<SubscriptionTier, string> = {
  free: 'text-[#1764ac] bg-[#1764ac]/10 border-[#1764ac]/20',
  standard: '',
  premium: 'border-amber-500/30 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30',
};
