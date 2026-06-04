// Centralised Stripe checkout helpers.
//
// Why this exists: previously, a logged-out visitor who clicked a paid plan was
// bounced to /auth and their purchase intent was lost. These helpers let us
// remember the chosen tier across the signup/login step and resume checkout
// automatically once the user is authenticated.

export type CheckoutTier = 'standard' | 'premium';

/** localStorage key holding the tier a logged-out user wanted to buy. */
export const PENDING_CHECKOUT_KEY = 'pending_checkout_tier';

/** localStorage key read by SubscriptionSuccess to confirm the tier after payment. */
export const PENDING_SUBSCRIPTION_KEY = 'pending_subscription_tier';

const PREMIUM_LINK =
  import.meta.env.VITE_STRIPE_PREMIUM_LINK || 'https://buy.stripe.com/cNiaEZ9QRcHz44i1gR6EU01';
const STANDARD_LINK =
  import.meta.env.VITE_STRIPE_STANDARD_LINK || 'https://buy.stripe.com/8x2dRb4wxfTLfN02kV6EU00';

type CheckoutUser = { id: string; email?: string | null };

/** Build the Stripe payment-link URL for a tier, tagged with the user id/email. */
export function buildCheckoutUrl(tier: CheckoutTier, user: CheckoutUser): string {
  const base = tier === 'premium' ? PREMIUM_LINK : STANDARD_LINK;
  const url = new URL(base);
  url.searchParams.set('client_reference_id', user.id);
  if (user.email) url.searchParams.set('prefilled_email', user.email);
  return url.toString();
}

/** Redirect the browser straight to Stripe Checkout for the given tier. */
export function startCheckout(tier: CheckoutTier, user: CheckoutUser): void {
  // Read back by SubscriptionSuccess as a fallback if the webhook is slow.
  localStorage.setItem(PENDING_SUBSCRIPTION_KEY, tier);
  window.location.href = buildCheckoutUrl(tier, user);
}

/** Remember which tier a logged-out user wanted, so we can resume after auth. */
export function setPendingCheckout(tier: CheckoutTier): void {
  localStorage.setItem(PENDING_CHECKOUT_KEY, tier);
}

/** Return (without clearing) any pending checkout tier. */
export function getPendingCheckout(): CheckoutTier | null {
  const t = localStorage.getItem(PENDING_CHECKOUT_KEY);
  return t === 'standard' || t === 'premium' ? t : null;
}

export function clearPendingCheckout(): void {
  localStorage.removeItem(PENDING_CHECKOUT_KEY);
}
