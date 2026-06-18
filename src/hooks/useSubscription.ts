import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export type SubscriptionTier = 'free' | 'standard' | 'premium' | 'lifetime';

export function useSubscription() {
  const { user, loading: authLoading } = useAuth();
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [uniqueQuestionsAnswered, setUniqueQuestionsAnswered] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setTier('free');
      setUniqueQuestionsAnswered(0);
      setLoading(false);
      return;
    }

    const fetchSubscriptionData = async () => {
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('subscription_tier, is_subscribed')
          .eq('id', user.id)
          .maybeSingle();

        let resolvedTier: SubscriptionTier = 'free';
        if (profileData) {
          const t = profileData.subscription_tier;
          if (t === 'lifetime') {
            resolvedTier = 'lifetime';
          } else if (t === 'premium') {
            resolvedTier = 'premium';
          } else if (t === 'standard') {
            resolvedTier = 'standard';
          } else if (t === 'tier_2') {
            resolvedTier = 'premium';
          } else if (t === 'tier_1') {
            resolvedTier = 'standard';
          } else if (profileData.is_subscribed) {
            resolvedTier = 'standard';
          }
        }
        setTier(resolvedTier);

        // Fetch count of unique questions answered only if user is on free tier
        if (resolvedTier === 'free') {
          const { data: answeredData } = await supabase
            .from('user_answers' as any)
            .select('question_id')
            .eq('user_id', user.id);

          if (answeredData) {
            const uniqueIds = new Set(answeredData.map((d: any) => d.question_id).filter(Boolean));
            setUniqueQuestionsAnswered(uniqueIds.size);
          } else {
            setUniqueQuestionsAnswered(0);
          }
        } else {
          setUniqueQuestionsAnswered(0);
        }
      } catch (err) {
        console.error('Error fetching subscription data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [user, authLoading]);

  const isLifetime   = tier === 'lifetime';
  const isPremium    = tier === 'premium' || tier === 'lifetime';
  const isStandardOrAbove = tier === 'standard' || tier === 'premium' || tier === 'lifetime';
  const isQuestionsLimitReached = tier === 'free' && uniqueQuestionsAnswered >= 220;

  return {
    tier,
    isLifetime,
    isPremium,
    isStandardOrAbove,
    isQuestionsLimitReached,
    uniqueQuestionsAnswered,
    // backward-compat aliases
    isTier1OrAbove: isStandardOrAbove,
    isTier2: isPremium,
    loading,
  };
}
