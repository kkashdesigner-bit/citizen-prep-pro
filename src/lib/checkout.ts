// Centralised Stripe checkout helpers.
//
// Uses a Supabase Edge Function (create-checkout-session) to create a
// Stripe Checkout Session with a 3-day free trial, instead of direct
// payment links (which charge immediately and don't support trials).

import { supabase } from '@/integrations/supabase/client';

export type CheckoutTier = 'standard' | 'premium' | 'yearly' | 'lifetime';

/** localStorage key holding the tier a logged-out user wanted to buy. */
export const PENDING_CHECKOUT_KEY = 'pending_checkout_tier';

/** localStorage key read by SubscriptionSuccess to confirm the tier after payment. */
export const PENDING_SUBSCRIPTION_KEY = 'pending_subscription_tier';

// Public Supabase values (env-first, with safe public fallback — see client.ts).
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://jblhxpzqbbarpqstcbvq.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpibGh4cHpxYmJhcnBxc3RjYnZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NzMxMDIsImV4cCI6MjA4NjE0OTEwMn0.vrHjiLjI67zsTGzSooqkREEVrzUAC353iuI0nA-zrH8';

type CheckoutUser = { id: string; email?: string | null };

/**
 * Redirect to Stripe Checkout with a 3-day free trial.
 * Creates a Checkout Session via the Edge Function (server-side) so the
 * trial_period_days is authoritative and cannot be bypassed.
 */
export async function startCheckout(tier: CheckoutTier, user: CheckoutUser): Promise<void> {
  localStorage.setItem(PENDING_SUBSCRIPTION_KEY, tier);

  // Get the live access token from the current Supabase session
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData?.session?.access_token;

  if (!accessToken) {
    throw new Error('Session expirée — veuillez vous reconnecter.');
  }

  const returnUrl = window.location.origin;

  const res = await fetch(`${SUPABASE_URL}/functions/v1/create-checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ tier, return_url: returnUrl }),
  });

  const data = await res.json();

  if (!res.ok || !data.url) {
    throw new Error(data.error || 'Erreur lors de la création de la session de paiement.');
  }

  window.location.href = data.url;
}

/** Remember which tier a logged-out user wanted, so we can resume after auth. */
export function setPendingCheckout(tier: CheckoutTier): void {
  localStorage.setItem(PENDING_CHECKOUT_KEY, tier);
}

/** Return (without clearing) any pending checkout tier. */
export function getPendingCheckout(): CheckoutTier | null {
  const t = localStorage.getItem(PENDING_CHECKOUT_KEY);
  return t === 'standard' || t === 'premium' || t === 'yearly' || t === 'lifetime' ? t : null;
}

export function clearPendingCheckout(): void {
  localStorage.removeItem(PENDING_CHECKOUT_KEY);
}
