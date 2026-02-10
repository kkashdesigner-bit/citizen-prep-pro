import type { SubscriptionTier } from '@/hooks/useSubscription';

export const TIER_LABELS: Record<SubscriptionTier, string> = {
  free: 'Free Plan',
  tier_1: 'Essential',
  tier_2: 'Premium',
};

export const TIER_BADGE_VARIANT: Record<SubscriptionTier, 'secondary' | 'default' | 'destructive' | 'outline'> = {
  free: 'secondary',
  tier_1: 'default',
  tier_2: 'default',
};

export const TIER_BADGE_CLASS: Record<SubscriptionTier, string> = {
  free: '',
  tier_1: '',
  tier_2: 'border-amber-500/30 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30',
};
