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
    // Fires for both subscription sign-ups AND one-time lifetime purchases
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      const customerId = session.customer as string;

      if (userId) {
        // ── One-time payment → Lifetime tier ──
        if (session.mode === 'payment') {
          const lifetimeProductId = Deno.env.get('STRIPE_LIFETIME_PRODUCT_ID') || 'prod_UduU86dMSn1zKH';

          // Verify the purchased product is actually the lifetime product
          let isLifetime = false;
          try {
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 5 });
            for (const item of lineItems.data) {
              const productId = (item.price?.product as string) || '';
              if (productId === lifetimeProductId) { isLifetime = true; break; }
            }
          } catch (e) {
            console.error('Failed to list line items:', e);
            // Fall back: trust the payment_intent metadata
            if (session.payment_intent) {
              try {
                const pi = await stripe.paymentIntents.retrieve(session.payment_intent as string);
                if (pi.metadata?.tier === 'lifetime') isLifetime = true;
              } catch {}
            }
          }

          if (isLifetime) {
            await supabase
              .from('profiles')
              .update({
                subscription_tier: 'lifetime',
                is_subscribed: true,
                stripe_customer_id: customerId,
              })
              .eq('id', userId);
            console.log(`User ${userId} granted lifetime access`);
          }
          return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // ── Subscription checkout (standard / premium) ──
        const standardProductId = Deno.env.get('STRIPE_STANDARD_PRODUCT_ID');
        const premiumProductId = Deno.env.get('STRIPE_PREMIUM_PRODUCT_ID');

        let tier = 'standard';

        if (session.subscription) {
          try {
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
            const productId = subscription.items.data[0]?.price?.product as string;
            if (premiumProductId && productId === premiumProductId) {
              tier = 'premium';
            } else if (standardProductId && productId === standardProductId) {
              tier = 'standard';
            }

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
        // Fetch profile details before reverting to free
        const { data: fullProfile } = await supabase
          .from('profiles')
          .select('email, display_name, subscription_tier')
          .eq('id', profile.id)
          .maybeSingle();

        const previousTier = fullProfile?.subscription_tier || 'standard';

        // Never downgrade a lifetime user — their access never expires
        if (previousTier === 'lifetime') {
          console.log(`User ${profile.id} has lifetime access — skipping subscription.deleted downgrade`);
          return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        await supabase
          .from('profiles')
          .update({
            subscription_tier: 'free',
            is_subscribed: false,
            stripe_subscription_id: null,
          })
          .eq('id', profile.id);

        console.log(`User ${profile.id} subscription cancelled — reverted to free`);

        // Send subscription cancelled email
        if (fullProfile?.email) {
          try {
            await fetch(`${supabaseUrl}/functions/v1/send-email`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseServiceKey}`,
              },
              body: JSON.stringify({
                type: 'subscription_cancelled',
                data: {
                  email: fullProfile.email,
                  firstName: fullProfile.display_name || '',
                  tier: previousTier,
                },
              }),
            });
            console.log(`Subscription cancelled email sent to ${fullProfile.email}`);
          } catch (emailErr) {
            console.error('Failed to send subscription_cancelled email:', emailErr);
          }
        }
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

        // Send payment failed email
        const { data: fullProfile } = await supabase
          .from('profiles')
          .select('email, display_name, subscription_tier')
          .eq('id', profile.id)
          .maybeSingle();

        if (fullProfile?.email) {
          try {
            await fetch(`${supabaseUrl}/functions/v1/send-email`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseServiceKey}`,
              },
              body: JSON.stringify({
                type: 'payment_failed',
                data: {
                  email: fullProfile.email,
                  firstName: fullProfile.display_name || '',
                  tier: fullProfile.subscription_tier || 'standard',
                },
              }),
            });
            console.log(`Payment failed email sent to ${fullProfile.email}`);
          } catch (emailErr) {
            console.error('Failed to send payment_failed email:', emailErr);
          }
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('stripe-webhook error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
