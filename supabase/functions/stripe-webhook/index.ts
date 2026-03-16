import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';

serve(async (req) => {
  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!stripeKey || !webhookSecret) {
      return new Response('Stripe not configured', { status: 500 });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify webhook signature
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return new Response('No signature', { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response('Invalid signature', { status: 400 });
    }

    console.log(`Processing Stripe event: ${event.type}`);

    // ─── checkout.session.completed ───
    // Fires when a customer completes Stripe Checkout
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      const customerId = session.customer as string;

      if (userId) {
        // Determine tier from the price/product
        let tier = 'standard';
        if (session.amount_total && session.amount_total >= 1000) {
          tier = 'premium'; // €10.99 = 1099 cents
        }

        // Also check line items for more precise detection
        if (session.subscription) {
          try {
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
            const priceId = subscription.items.data[0]?.price?.id;
            const amount = subscription.items.data[0]?.price?.unit_amount || 0;
            // Premium is €10.99 (1099 cents), Standard is €6.99 (699 cents)
            if (amount >= 1000) {
              tier = 'premium';
            }

            // Save subscription ID
            await supabase
              .from('profiles')
              .update({
                subscription_tier: tier,
                is_subscribed: true,
                stripe_customer_id: customerId,
                stripe_subscription_id: session.subscription as string,
              })
              .eq('id', userId);
          } catch {
            // Fallback: update without subscription ID
            await supabase
              .from('profiles')
              .update({
                subscription_tier: tier,
                is_subscribed: true,
                stripe_customer_id: customerId,
              })
              .eq('id', userId);
          }
        } else {
          await supabase
            .from('profiles')
            .update({
              subscription_tier: tier,
              is_subscribed: true,
              stripe_customer_id: customerId,
            })
            .eq('id', userId);
        }

        console.log(`User ${userId} subscribed to ${tier}`);
      }
    }

    // ─── customer.subscription.updated ───
    // Fires when a subscription is modified (e.g., cancel_at_period_end set)
    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      // Find user by stripe_customer_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .maybeSingle();

      if (profile) {
        if (subscription.cancel_at_period_end) {
          console.log(`User ${profile.id} subscription marked for cancellation`);
          // Subscription still active until period end — no DB change needed yet
        }
      }
    }

    // ─── customer.subscription.deleted ───
    // Fires when a subscription is fully cancelled/expired
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      // Find user by stripe_customer_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .maybeSingle();

      if (profile) {
        await supabase
          .from('profiles')
          .update({
            subscription_tier: 'free',
            is_subscribed: false,
            stripe_subscription_id: null,
          })
          .eq('id', profile.id);

        console.log(`User ${profile.id} subscription cancelled — reverted to free`);
      }
    }

    // ─── invoice.payment_failed ───
    // Fires when a payment attempt fails
    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .maybeSingle();

      if (profile) {
        console.log(`Payment failed for user ${profile.id}`);
        // Stripe handles retry logic — we just log for now
        // After all retries fail, subscription.deleted will fire
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('stripe-webhook error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
