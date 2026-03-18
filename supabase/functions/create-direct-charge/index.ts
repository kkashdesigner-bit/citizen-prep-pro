import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      return new Response(
        JSON.stringify({ error: 'Stripe not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const stripe = new Stripe(stripeKey);

    const {
      amount,
      currency,
      application_fee_amount,
      stripe_account,
      payment_method,
    }: {
      amount: number;
      currency: string;
      application_fee_amount: number;
      stripe_account: string;
      payment_method?: string;
    } = await req.json();

    if (!amount || !currency || !stripe_account) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: amount, currency, stripe_account' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a direct charge on the connected account.
    // The platform keeps application_fee_amount; the rest goes to the connected account.
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount,
        currency,
        application_fee_amount,
        payment_method_types: ['card'],
        ...(payment_method
          ? { payment_method, confirm: true }
          : {}),
        description: 'Direct charge via GoCivique platform',
      },
      {
        stripeAccount: stripe_account,
      }
    );

    return new Response(
      JSON.stringify({
        id: paymentIntent.id,
        client_secret: paymentIntent.client_secret,
        status: paymentIntent.status,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('create-direct-charge error:', err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
