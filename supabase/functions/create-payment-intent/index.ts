import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (req: Request) => Promise<Response>): void;
};

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  try {
    // Verify auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401, headers: CORS_HEADERS,
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: CORS_HEADERS,
      });
    }

    // Get user profile + role
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role, organization_id, full_name, email, stripe_customer_id')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile) {
      return new Response(JSON.stringify({ error: 'User profile not found' }), {
        status: 403, headers: CORS_HEADERS,
      });
    }

    const body = await req.json();
    const { planId, planName, amount, currency, paymentMethod, countryCode, languageCode } = body;

    if (!amount || !currency || !planId) {
      return new Response(JSON.stringify({ error: 'Missing required fields: amount, currency, planId' }), {
        status: 400, headers: CORS_HEADERS,
      });
    }

    // Validate amount server-side (never trust client)
    const validatedAmount = Math.round(Number(amount));
    if (isNaN(validatedAmount) || validatedAmount < 50) {
      return new Response(JSON.stringify({ error: 'Invalid amount' }), {
        status: 400, headers: CORS_HEADERS,
      });
    }

    // Create or update Stripe customer
    let stripeCustomerId = profile.stripe_customer_id;
    const customerData: Stripe.CustomerCreateParams = {
      name: profile.full_name || user.email || 'SHIFA User',
      email: profile.email || user.email,
      metadata: {
        supabase_user_id: user.id,
        role: profile.role || 'patient',
        organization_id: profile.organization_id || '',
      },
    };

    if (stripeCustomerId) {
      await stripe.customers.update(stripeCustomerId, customerData);
    } else {
      const customer = await stripe.customers.create(customerData);
      stripeCustomerId = customer.id;
      // Persist stripe_customer_id
      await supabase
        .from('user_profiles')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', user.id);
    }

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: validatedAmount,
      currency: currency.toLowerCase(),
      customer: stripeCustomerId,
      description: `SHIFA ${planName || planId} — ${profile.role || 'patient'}`,
      metadata: {
        plan_id: planId,
        plan_name: planName || planId,
        user_id: user.id,
        role: profile.role || 'patient',
        organization_id: profile.organization_id || '',
        country_code: countryCode || 'FR',
        language_code: languageCode || 'fr',
      },
    });

    // Create pending payment record in DB (RLS enforced via service role)
    const reference = `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const { data: paymentRecord, error: paymentError } = await supabase
      .from('payments')
      .insert({
        reference,
        user_id: user.id,
        organization_id: profile.organization_id || null,
        amount: validatedAmount / 100,
        currency: currency.toUpperCase(),
        payment_method: 'card',
        status: 'pending',
        provider: 'stripe',
        payment_intent_id: paymentIntent.id,
        description: `${planName || planId} subscription`,
        metadata: {
          plan_id: planId,
          stripe_customer_id: stripeCustomerId,
          country_code: countryCode || 'FR',
          language_code: languageCode || 'fr',
        },
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Payment record creation failed:', paymentError);
      // Don't block checkout — log and continue
    }

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        paymentRecordId: paymentRecord?.id || null,
        stripeCustomerId,
      }),
      { headers: CORS_HEADERS }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Payment setup failed';
    console.error('create-payment-intent error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: CORS_HEADERS,
    });
  }
});
