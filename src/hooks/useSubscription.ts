import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export type SubscriptionTier = 'free' | 'standard' | 'premium' | 'lifetime';

export function useSubscription() {
  const { user, loading: authLoading } = useAuth();
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setTier('free');
      setLoading(false);
      return;
    }

    const fetchTier = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('subscription_tier, is_subscribed')
        .eq('id', user.id)
        .maybeSingle();

      if (data) {
        const t = data.subscription_tier;
        if (t === 'lifetime') {
          setTier('lifetime');
        } else if (t === 'premium') {
          setTier('premium');
        } else if (t === 'standard') {
          setTier('standard');
        } else if (t === 'tier_2') {
          setTier('premium');
        } else if (t === 'tier_1') {
          setTier('standard');
        } else if (data.is_subscribed) {
          setTier('standard');
        } else {
          setTier('free');
        }
      }
      setLoading(false);
    };

    fetchTier();
  }, [user, authLoading]);

  const isLifetime   = tier === 'lifetime';
  const isPremium    = tier === 'premium' || tier === 'lifetime';
  const isStandardOrAbove = tier === 'standard' || tier === 'premium' || tier === 'lifetime';

  return {
    tier,
    isLifetime,
    isPremium,
    isStandardOrAbove,
    // backward-compat aliases
    isTier1OrAbove: isStandardOrAbove,
    isTier2: isPremium,
    loading,
  };
}
