import type { SubscriptionTier } from '@/hooks/useSubscription';

export const TIER_LABELS: Record<SubscriptionTier, string> = {
  free: 'Tier 1 — Free',
  standard: 'Tier 2 — Standard',
  premium: 'Tier 3 — Premium',
};

export const TIER_BADGE_VARIANT: Record<SubscriptionTier, 'secondary' | 'default' | 'destructive' | 'outline'> = {
  free: 'secondary',
  standard: 'default',
  premium: 'default',
};

export const TIER_BADGE_CLASS: Record<SubscriptionTier, string> = {
  free: '',
  standard: '',
  premium: 'border-amber-500/30 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30',
};
