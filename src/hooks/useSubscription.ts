import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export type SubscriptionTier = 'free' | 'tier_1' | 'tier_2';

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
        if (data.subscription_tier === 'tier_1' || data.subscription_tier === 'tier_2') {
          setTier(data.subscription_tier as SubscriptionTier);
        } else if (data.is_subscribed) {
          // backward compat: old is_subscribed users default to tier_1
          setTier('tier_1');
        } else {
          setTier('free');
        }
      }
      setLoading(false);
    };

    fetchTier();
  }, [user, authLoading]);

  return {
    tier,
    isTier1OrAbove: tier === 'tier_1' || tier === 'tier_2',
    isTier2: tier === 'tier_2',
    loading,
  };
}
