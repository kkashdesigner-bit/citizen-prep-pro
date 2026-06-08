import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TRIAL_DAYS = 3;

// Lifetime product/price — created 2026-06-04
const LIFETIME_PRODUCT_ID = 'prod_UduU86dMSn1zKH';
const LIFETIME_PRICE_ID    = 'price_1TecfyP5T0wCun4w2LA3Tk8g';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      return new Response(
        JSON.stringify({ error: 'Stripe non configuré' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });

    // ── Auth ──
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Non authentifié' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Token invalide' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { tier, return_url } = await req.json() as {
      tier: 'standard' | 'premium' | 'lifetime';
      return_url: string;
    };

    // ── Find or create Stripe customer ──
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, display_name')
      .eq('id', user.id)
      .maybeSingle();

    let customerId = profile?.stripe_customer_id as string | undefined;

    if (!customerId) {
      const customers = await stripe.customers.list({ email: user.email!, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        const customer = await stripe.customers.create({
          email: user.email!,
          name: profile?.display_name || undefined,
          metadata: { supabase_user_id: user.id },
        });
        customerId = customer.id;
      }
      await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id);
    }

    // ── LIFETIME — one-time payment ──
    if (tier === 'lifetime') {
      const priceId = Deno.env.get('STRIPE_LIFETIME_PRICE_ID') || LIFETIME_PRICE_ID;

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        client_reference_id: user.id,
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        payment_intent_data: {
          metadata: { supabase_user_id: user.id, tier: 'lifetime' },
        },
        success_url: `${return_url}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: return_url,
        allow_promotion_codes: true,
        locale: 'fr',
      });

      return new Response(
        JSON.stringify({ url: session.url }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ── SUBSCRIPTION (standard / premium) — 3-day free trial ──
    const standardPriceId = Deno.env.get('STRIPE_STANDARD_PRICE_ID');
    const premiumPriceId  = Deno.env.get('STRIPE_PREMIUM_PRICE_ID');
    const standardProductId = Deno.env.get('STRIPE_STANDARD_PRODUCT_ID');
    const premiumProductId  = Deno.env.get('STRIPE_PREMIUM_PRODUCT_ID');

    let priceId = tier === 'premium' ? premiumPriceId : standardPriceId;

    if (!priceId) {
      const productId = tier === 'premium' ? premiumProductId : standardProductId;
      if (productId) {
        const product = await stripe.products.retrieve(productId) as Stripe.Product;
        priceId = product.default_price as string | undefined;
      }
    }

    if (!priceId) {
      return new Response(
        JSON.stringify({ error: 'Prix non configuré. Ajoutez STRIPE_STANDARD_PRICE_ID / STRIPE_PREMIUM_PRICE_ID dans les secrets Supabase.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: user.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: TRIAL_DAYS,
        metadata: { supabase_user_id: user.id },
      },
      success_url: `${return_url}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: return_url,
      allow_promotion_codes: true,
      locale: 'fr',
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('create-checkout-session error:', err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
