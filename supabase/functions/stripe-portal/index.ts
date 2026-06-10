import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import {
  preflight, json, tooMany, clientIp, serviceClient,
  getAuthedUser, rateLimit, readJson, isAllowedReturnUrl,
} from './shared.ts';

const ALLOWED_ACTIONS = new Set(['portal', 'cancel', 'status']);
const DEFAULT_RETURN_URL = 'https://gocivique.fr/settings';

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

    // Rate limit: 30 portal operations / 15 min per user
    const userLimit = await rateLimit(supabase, `portal:user:${user.id}`, 30, 900);
    if (!userLimit.allowed) return tooMany(req, userLimit.retryAfter);
    const ipLimit = await rateLimit(supabase, `portal:ip:${clientIp(req)}`, 60, 900);
    if (!ipLimit.allowed) return tooMany(req, ipLimit.retryAfter);

    // ── Input validation ──
    const body = await readJson<{ action?: unknown; return_url?: unknown }>(req, 2_000);
    if (!body) return json(req, { error: 'Requête invalide' }, 400);
    const action = typeof body.action === 'string' ? body.action : '';
    if (!ALLOWED_ACTIONS.has(action)) return json(req, { error: 'Action inconnue' }, 400);
    const returnUrl = isAllowedReturnUrl(body.return_url) ? (body.return_url as string) : DEFAULT_RETURN_URL;

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email, display_name')
      .eq('id', user.id)
      .maybeSingle();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        const customer = await stripe.customers.create({
          email: user.email,
          name: profile?.display_name || undefined,
          metadata: { supabase_user_id: user.id },
        });
        customerId = customer.id;
      }

      let subscriptionId: string | null = null;
      try {
        const subs = await stripe.subscriptions.list({ customer: customerId, status: 'active', limit: 1 });
        if (subs.data.length > 0) subscriptionId = subs.data[0].id;
      } catch (e) {
        console.error('Failed to look up subscriptions:', e);
      }

      const updateData: Record<string, string | null> = { stripe_customer_id: customerId };
      if (subscriptionId) updateData.stripe_subscription_id = subscriptionId;
      await supabase.from('profiles').update(updateData).eq('id', user.id);
    }

    // ─── Portal: open Stripe Billing Portal ───
    if (action === 'portal') {
      try {
        const session = await stripe.billingPortal.sessions.create({
          customer: customerId,
          return_url: returnUrl,
        });
        return json(req, { url: session.url });
      } catch (portalErr) {
        console.error('Billing portal session error:', portalErr);
        const msg = String((portalErr as Error)?.message ?? portalErr);
        const userMsg = msg.includes('configuration')
          ? "Le portail Stripe n'est pas configuré. Activez-le dans Stripe Dashboard → Settings → Billing → Customer portal."
          : 'Erreur lors de l’ouverture du portail de facturation.';
        return json(req, { error: userMsg }, 400);
      }
    }

    // ─── Cancel: cancel the active subscription (at period end) ───
    if (action === 'cancel') {
      try {
        const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: 'active', limit: 1 });
        if (subscriptions.data.length === 0) {
          return json(req, { error: 'Aucun abonnement actif trouvé' }, 404);
        }
        await stripe.subscriptions.update(subscriptions.data[0].id, { cancel_at_period_end: true });
        return json(req, { success: true });
      } catch (cancelErr) {
        console.error('Cancel subscription error:', cancelErr);
        return json(req, { error: 'Erreur lors de l’annulation de l’abonnement.' }, 400);
      }
    }

    // ─── Status: check subscription cancel state ───
    try {
      const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: 'active', limit: 1 });
      if (subscriptions.data.length === 0) {
        return json(req, { cancel_at_period_end: false, active: false });
      }
      const sub = subscriptions.data[0];
      return json(req, {
        active: true,
        cancel_at_period_end: sub.cancel_at_period_end,
        current_period_end: sub.current_period_end,
      });
    } catch (statusErr) {
      console.error('Status check error:', statusErr);
      return json(req, { error: 'Erreur lors de la vérification du statut.' }, 400);
    }
  } catch (err) {
    console.error('stripe-portal error:', err);
    return json(req, { error: 'Erreur interne' }, 500);
  }
});
