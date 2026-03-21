import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
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
        JSON.stringify({ error: 'Stripe non configuré' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });

    // Authenticate user via Supabase JWT
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

    // Verify the JWT and get user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Token invalide' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user profile to find stripe_customer_id
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email, display_name')
      .eq('id', user.id)
      .maybeSingle();

    const { action, return_url } = await req.json();

    // Find or create Stripe customer
    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      // Search for existing customer by email
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1,
      });

      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        // Create new customer
        const customer = await stripe.customers.create({
          email: user.email,
          name: profile?.display_name || undefined,
          metadata: { supabase_user_id: user.id },
        });
        customerId = customer.id;
      }

      // Look up active subscription for this customer and save both IDs
      let subscriptionId: string | null = null;
      try {
        const subs = await stripe.subscriptions.list({
          customer: customerId,
          status: 'active',
          limit: 1,
        });
        if (subs.data.length > 0) {
          subscriptionId = subs.data[0].id;
        }
      } catch (e) {
        console.error('Failed to look up subscriptions:', e);
      }

      // Save customer ID (and subscription ID if found) to profile
      const updateData: Record<string, string | null> = { stripe_customer_id: customerId };
      if (subscriptionId) {
        updateData.stripe_subscription_id = subscriptionId;
      }
      await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);
    }

    // ─── Portal: open Stripe Billing Portal ───
    if (action === 'portal') {
      try {
        const session = await stripe.billingPortal.sessions.create({
          customer: customerId,
          return_url: return_url || `${req.headers.get('origin')}/settings`,
        });

        return new Response(
          JSON.stringify({ url: session.url }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (portalErr: any) {
        console.error('Billing portal session error:', portalErr);
        const msg = String(portalErr?.message || portalErr);
        const userMsg = msg.includes('configuration')
          ? 'Le portail Stripe n\'est pas configuré. Activez-le dans Stripe Dashboard → Settings → Billing → Customer portal.'
          : `Erreur portail : ${msg}`;
        return new Response(
          JSON.stringify({ error: userMsg }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // ─── Cancel: cancel the active subscription ───
    if (action === 'cancel') {
      try {
        // Find active subscriptions for this customer
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          status: 'active',
          limit: 1,
        });

        if (subscriptions.data.length === 0) {
          return new Response(
            JSON.stringify({ error: 'Aucun abonnement actif trouvé' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Cancel at end of billing period
        await stripe.subscriptions.update(subscriptions.data[0].id, {
          cancel_at_period_end: true,
        });

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (cancelErr: any) {
        console.error('Cancel subscription error:', cancelErr);
        return new Response(
          JSON.stringify({ error: `Erreur annulation : ${cancelErr?.message || String(cancelErr)}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: 'Action inconnue' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('stripe-portal error:', err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
