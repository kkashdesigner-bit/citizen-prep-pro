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
        const standardProductId = Deno.env.get('STRIPE_STANDARD_PRODUCT_ID');
        const premiumProductId = Deno.env.get('STRIPE_PREMIUM_PRODUCT_ID');

        // Determine tier from product ID (default to standard)
        let tier = 'standard';

        // Retrieve subscription to get the product ID
        if (session.subscription) {
          try {
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
            const productId = subscription.items.data[0]?.price?.product as string;
            if (premiumProductId && productId === premiumProductId) {
              tier = 'premium';
            } else if (standardProductId && productId === standardProductId) {
              tier = 'standard';
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
    // Fires when a subscription is modified (plan change, cancel_at_period_end, etc.)
    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      // Find user by stripe_customer_id, fall back to email lookup
      let profile: { id: string } | null = null;
      const { data: profileByCustomer } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .maybeSingle();
      profile = profileByCustomer;

      if (!profile) {
        // Fallback: look up customer email in Stripe, then find user by email
        try {
          const customer = await stripe.customers.retrieve(customerId);
          if (customer && !customer.deleted && customer.email) {
            const { data: profileByEmail } = await supabase
              .from('profiles')
              .select('id')
              .eq('email', customer.email)
              .maybeSingle();
            if (profileByEmail) {
              profile = profileByEmail;
              // Backfill stripe_customer_id
              await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', profile.id);
            }
          }
        } catch (e) {
          console.error('Email fallback lookup failed:', e);
        }
      }

      if (profile) {
        const standardProductId = Deno.env.get('STRIPE_STANDARD_PRODUCT_ID');
        const premiumProductId = Deno.env.get('STRIPE_PREMIUM_PRODUCT_ID');
        const productId = subscription.items.data[0]?.price?.product as string;

        let tier = 'standard';
        if (premiumProductId && productId === premiumProductId) {
          tier = 'premium';
        } else if (standardProductId && productId === standardProductId) {
          tier = 'standard';
        }

        // Update tier + subscription ID in case of plan change
        await supabase
          .from('profiles')
          .update({
            subscription_tier: tier,
            stripe_subscription_id: subscription.id,
          })
          .eq('id', profile.id);

        if (subscription.cancel_at_period_end) {
          console.log(`User ${profile.id} subscription (${tier}) marked for cancellation`);
        } else {
          console.log(`User ${profile.id} subscription updated to ${tier}`);
        }
      }
    }

    // ─── customer.subscription.deleted ───
    // Fires when a subscription is fully cancelled/expired
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      // Find user by stripe_customer_id, fall back to email lookup
      let profile: { id: string } | null = null;
      const { data: profileByCustomer } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .maybeSingle();
      profile = profileByCustomer;

      if (!profile) {
        try {
          const customer = await stripe.customers.retrieve(customerId);
          if (customer && !customer.deleted && customer.email) {
            const { data: profileByEmail } = await supabase
              .from('profiles')
              .select('id')
              .eq('email', customer.email)
              .maybeSingle();
            if (profileByEmail) {
              profile = profileByEmail;
              await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', profile.id);
            }
          }
        } catch (e) {
          console.error('Email fallback lookup failed:', e);
        }
      }

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

      // Find user by stripe_customer_id, fall back to email lookup
      let profile: { id: string } | null = null;
      const { data: profileByCustomer } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .maybeSingle();
      profile = profileByCustomer;

      if (!profile) {
        try {
          const customer = await stripe.customers.retrieve(customerId);
          if (customer && !customer.deleted && customer.email) {
            const { data: profileByEmail } = await supabase
              .from('profiles')
              .select('id')
              .eq('email', customer.email)
              .maybeSingle();
            if (profileByEmail) {
              profile = profileByEmail;
              await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', profile.id);
            }
          }
        } catch (e) {
          console.error('Email fallback lookup failed:', e);
        }
      }

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
