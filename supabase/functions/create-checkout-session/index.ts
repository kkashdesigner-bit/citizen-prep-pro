import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import {
  preflight, json, tooMany, clientIp, serviceClient,
  getAuthedUser, rateLimit, readJson, isAllowedReturnUrl,
} from './shared.ts';

const TRIAL_DAYS = 3;
const LIFETIME_PRICE_ID = 'price_1TecfyP5T0wCun4w2LA3Tk8g';
// 'lifetime' kept for backward compatibility (grandfathered offer, no longer sold).
// 'yearly' = Premium billed annually (maps to premium entitlements via the webhook).
const ALLOWED_TIERS = new Set(['standard', 'premium', 'yearly', 'lifetime']);
const DEFAULT_RETURN_URL = 'https://gocivique.fr';

serve(async (req) => {
  const pf = preflight(req);
  if (pf) return pf;
  if (req.method !== 'POST') return json(req, { error: 'Méthode non autorisée' }, 405);

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) return json(req, { error: 'Stripe non configuré' }, 500);
    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });

    const supabase = serviceClient();
    const user = await getAuthedUser(req, supabase);
    if (!user) return json(req, { error: 'Non authentifié' }, 401);

    // Rate limit: 10 checkout sessions / 15 min per user, 20 per IP
    const userLimit = await rateLimit(supabase, `checkout:user:${user.id}`, 10, 900);
    if (!userLimit.allowed) return tooMany(req, userLimit.retryAfter);
    const ipLimit = await rateLimit(supabase, `checkout:ip:${clientIp(req)}`, 20, 900);
    if (!ipLimit.allowed) return tooMany(req, ipLimit.retryAfter);

    // ── Input validation ──
    const body = await readJson<{ tier?: unknown; return_url?: unknown }>(req, 2_000);
    if (!body) return json(req, { error: 'Requête invalide' }, 400);
    const tier = typeof body.tier === 'string' ? body.tier : '';
    if (!ALLOWED_TIERS.has(tier)) return json(req, { error: 'Offre invalide' }, 400);
    // Only redirect back to our own origins (prevents open-redirect via Stripe).
    const returnUrl = isAllowedReturnUrl(body.return_url) ? (body.return_url as string) : DEFAULT_RETURN_URL;

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, display_name')
      .eq('id', user.id)
      .maybeSingle();

    let customerId = profile?.stripe_customer_id;
    if (!customerId) {
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        const c = await stripe.customers.create({
          email: user.email,
          name: profile?.display_name || undefined,
          metadata: { supabase_user_id: user.id },
        });
        customerId = c.id;
      }
      await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id);
    }

    if (tier === 'lifetime') {
      const priceId = Deno.env.get('STRIPE_LIFETIME_PRICE_ID') || LIFETIME_PRICE_ID;
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        client_reference_id: user.id,
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        payment_intent_data: { metadata: { supabase_user_id: user.id, tier: 'lifetime' } },
        success_url: `${returnUrl}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: returnUrl,
        allow_promotion_codes: true,
        locale: 'fr',
      });
      return json(req, { url: session.url });
    }

    const standardPriceId = Deno.env.get('STRIPE_STANDARD_PRICE_ID');
    const premiumPriceId = Deno.env.get('STRIPE_PREMIUM_PRICE_ID');
    const yearlyPriceId = Deno.env.get('STRIPE_YEARLY_PRICE_ID');
    const standardProductId = Deno.env.get('STRIPE_STANDARD_PRODUCT_ID');
    const premiumProductId = Deno.env.get('STRIPE_PREMIUM_PRODUCT_ID');
    const yearlyProductId = Deno.env.get('STRIPE_YEARLY_PRODUCT_ID');
    let priceId =
      tier === 'yearly' ? yearlyPriceId :
      tier === 'premium' ? premiumPriceId :
      standardPriceId;
    if (!priceId) {
      const productId =
        tier === 'yearly' ? yearlyProductId :
        tier === 'premium' ? premiumProductId :
        standardProductId;
      if (productId) {
        const product = await stripe.products.retrieve(productId);
        priceId = product.default_price as string | undefined;
      }
    }
    if (!priceId) return json(req, { error: 'Prix non configuré.' }, 500);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: user.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: { trial_period_days: TRIAL_DAYS, metadata: { supabase_user_id: user.id } },
      success_url: `${returnUrl}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: returnUrl,
      allow_promotion_codes: true,
      locale: 'fr',
    });
    return json(req, { url: session.url });
  } catch (err) {
    console.error('create-checkout-session error:', err);
    // Generic message: never leak internal error details to the client.
    return json(req, { error: 'Erreur lors de la création de la session de paiement.' }, 500);
  }
});
