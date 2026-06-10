import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import { json, isServiceRoleRequest, readJson } from './shared.ts';

// SECURITY LOCKDOWN: this Stripe Connect endpoint is not used by the GoCivique
// frontend. It previously allowed ANY caller to create arbitrary PaymentIntents
// on arbitrary connected accounts. It is now restricted to service-role callers
// only. If Stripe Connect is not on the roadmap, delete this function entirely.

const ALLOWED_CURRENCIES = new Set(['eur']);

serve(async (req) => {
  if (req.method !== 'POST') return json(req, { error: 'Method not allowed' }, 405);

  // Internal callers only — no browser/anon access.
  if (!isServiceRoleRequest(req)) {
    return json(req, { error: 'Forbidden' }, 403);
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) return json(req, { error: 'Stripe not configured' }, 500);
    const stripe = new Stripe(stripeKey);

    const body = await readJson<{
      amount?: unknown;
      currency?: unknown;
      application_fee_amount?: unknown;
      stripe_account?: unknown;
      payment_method?: unknown;
    }>(req, 2_000);
    if (!body) return json(req, { error: 'Invalid request body' }, 400);

    const amount = typeof body.amount === 'number' && Number.isInteger(body.amount) ? body.amount : NaN;
    const currency = typeof body.currency === 'string' ? body.currency.toLowerCase() : '';
    const fee = typeof body.application_fee_amount === 'number' && Number.isInteger(body.application_fee_amount)
      ? body.application_fee_amount : 0;
    const stripeAccount = typeof body.stripe_account === 'string' ? body.stripe_account : '';
    const paymentMethod = typeof body.payment_method === 'string' ? body.payment_method : undefined;

    if (!Number.isFinite(amount) || amount < 50 || amount > 1_000_000) {
      return json(req, { error: 'Invalid amount (50–1000000 minor units)' }, 400);
    }
    if (!ALLOWED_CURRENCIES.has(currency)) return json(req, { error: 'Unsupported currency' }, 400);
    if (!/^acct_[A-Za-z0-9]+$/.test(stripeAccount)) return json(req, { error: 'Invalid stripe_account' }, 400);
    if (fee < 0 || fee >= amount) return json(req, { error: 'Invalid application_fee_amount' }, 400);
    if (paymentMethod !== undefined && !/^pm_[A-Za-z0-9]+$/.test(paymentMethod)) {
      return json(req, { error: 'Invalid payment_method' }, 400);
    }

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount,
        currency,
        application_fee_amount: fee,
        payment_method_types: ['card'],
        ...(paymentMethod ? { payment_method: paymentMethod, confirm: true } : {}),
        description: 'Direct charge via GoCivique platform',
      },
      { stripeAccount },
    );

    return json(req, {
      id: paymentIntent.id,
      client_secret: paymentIntent.client_secret,
      status: paymentIntent.status,
    });
  } catch (err) {
    console.error('create-direct-charge error:', err);
    return json(req, { error: 'Internal error' }, 500);
  }
});
