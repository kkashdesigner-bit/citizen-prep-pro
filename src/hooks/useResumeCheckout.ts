import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getPendingCheckout, clearPendingCheckout, startCheckout } from '@/lib/checkout';

/**
 * After a logged-out visitor clicks a paid plan and then signs up / logs in,
 * automatically resume Stripe checkout instead of dropping them on a dashboard.
 *
 * Safe to mount on any auth-landing surface (Auth page, Onboarding). It only
 * fires when a pending-checkout intent exists in localStorage, and only once.
 */
export function useResumeCheckout(): boolean {
  const { user, loading } = useAuth();
  const fired = useRef(false);

  useEffect(() => {
    if (loading || !user || fired.current) return;
    const tier = getPendingCheckout();
    if (!tier) return;
    fired.current = true;
    clearPendingCheckout();
    startCheckout(tier, { id: user.id, email: user.email }).catch(console.error);
  }, [user, loading]);

  // True while a redirect is pending so callers can show a spinner / skip nav.
  return !loading && !!user && !!getPendingCheckout();
}
