import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

declare const Deno: {
  env: { get(key: string): string | undefined };
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

    const { paymentIntentId, planId, planName, countryCode, languageCode } = await req.json();
    if (!paymentIntentId) {
      return new Response(JSON.stringify({ error: 'Missing paymentIntentId' }), {
        status: 400, headers: CORS_HEADERS,
      });
    }

    // Retrieve from Stripe to verify
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Security: ensure this payment belongs to this user
    if (paymentIntent.metadata?.user_id && paymentIntent.metadata.user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Payment does not belong to this user' }), {
        status: 403, headers: CORS_HEADERS,
      });
    }

    const isSucceeded = paymentIntent.status === 'succeeded';
    const newStatus = isSucceeded ? 'completed' : 'failed';

    // Update payment record
    const { data: paymentRecord } = await supabase
      .from('payments')
      .update({
        status: newStatus,
        stripe_charge_id: typeof paymentIntent.latest_charge === 'string'
          ? paymentIntent.latest_charge
          : null,
        processed_at: isSucceeded ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('payment_intent_id', paymentIntentId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (!isSucceeded) {
      return new Response(JSON.stringify({ success: false, status: newStatus }), {
        headers: CORS_HEADERS,
      });
    }

    // Get user profile for invoice
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role, organization_id, full_name, email')
      .eq('id', user.id)
      .maybeSingle();

    // Create invoice
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const amount = paymentRecord ? Number(paymentRecord.amount) : paymentIntent.amount / 100;
    const currency = paymentRecord?.currency || paymentIntent.currency.toUpperCase();
    const taxRate = getTaxRate(countryCode || 'FR');
    const subtotal = Math.round((amount / (1 + taxRate)) * 100) / 100;
    const taxAmount = Math.round((amount - subtotal) * 100) / 100;

    const { data: invoice } = await supabase
      .from('invoices')
      .insert({
        invoice_number: invoiceNumber,
        user_id: user.id,
        organization_id: profile?.organization_id || null,
        payment_id: paymentRecord?.id || null,
        status: 'paid',
        subtotal,
        tax_amount: taxAmount,
        discount_amount: 0,
        total: amount,
        currency,
        paid_at: new Date().toISOString(),
        country_code: countryCode || 'FR',
        language_code: languageCode || 'fr',
        billing_name: profile?.full_name || '',
        line_items: JSON.stringify([{
          description: planName || planId || 'SHIFA Subscription',
          quantity: 1,
          unit_price: subtotal,
          total: subtotal,
        }]),
        notes: getLegalDisclaimer(countryCode || 'FR', languageCode || 'fr'),
        legal_disclaimer: getLegalDisclaimer(countryCode || 'FR', languageCode || 'fr'),
      })
      .select()
      .single();

    // Create/activate subscription
    if (planId) {
      const planMap: Record<string, string> = {
        pro_monthly: 'pro',
        pro_annual: 'pro',
        org_base: 'starter',
        org_pro: 'enterprise',
        card_physical: 'free',
      };
      const supabasePlan = planMap[planId] || 'pro';
      const isAnnual = planId.includes('annual');

      await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          organization_id: profile?.organization_id || null,
          plan: supabasePlan,
          status: 'active',
          billing_cycle: isAnnual ? 'annual' : 'monthly',
          amount,
          currency,
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(
            Date.now() + (isAnnual ? 365 : 30) * 24 * 60 * 60 * 1000
          ).toISOString(),
          metadata: { plan_id: planId, payment_intent_id: paymentIntentId },
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: 'completed',
        invoiceId: invoice?.id || null,
        invoiceNumber,
      }),
      { headers: CORS_HEADERS }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Confirmation failed';
    console.error('confirm-payment error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: CORS_HEADERS,
    });
  }
});

function getTaxRate(countryCode: string): number {
  const rates: Record<string, number> = {
    FR: 0.20, DE: 0.19, ES: 0.21, PT: 0.23, IT: 0.22,
    GB: 0.20, MA: 0.20, SN: 0.18, KM: 0.10,
    AE: 0.05, SA: 0.15, CN: 0.13, BR: 0.12,
  };
  return rates[countryCode] ?? 0.0;
}

function getLegalDisclaimer(countryCode: string, lang: string): string {
  const disclaimers: Record<string, Record<string, string>> = {
    fr: {
      FR: 'Facture conforme à la réglementation française. TVA applicable selon l\'article 283 du CGI.',
      MA: 'Facture conforme à la réglementation marocaine. TVA applicable selon le Code Général des Impôts.',
      SN: 'Facture conforme à la réglementation sénégalaise. TVA applicable selon le Code Général des Impôts.',
      KM: 'Facture conforme à la réglementation comorienne.',
      DEFAULT: 'Facture émise par SHIFA Health OS. Tous droits réservés.',
    },
    en: {
      GB: 'Invoice compliant with UK regulations. VAT applicable under HMRC guidelines.',
      AE: 'Invoice compliant with UAE VAT regulations (Federal Decree-Law No. 8 of 2017).',
      DEFAULT: 'Invoice issued by SHIFA Health OS. All rights reserved.',
    },
    ar: {
      AE: 'فاتورة متوافقة مع لوائح ضريبة القيمة المضافة الإماراتية.',
      MA: 'فاتورة متوافقة مع اللوائح المغربية. ضريبة القيمة المضافة مطبقة.',
      DEFAULT: 'فاتورة صادرة عن SHIFA Health OS. جميع الحقوق محفوظة.',
    },
    es: {
      ES: 'Factura conforme a la normativa española. IVA aplicable según la Ley 37/1992.',
      DEFAULT: 'Factura emitida por SHIFA Health OS. Todos los derechos reservados.',
    },
    pt: {
      BR: 'Nota fiscal emitida em conformidade com a legislação brasileira.',
      PT: 'Fatura conforme a legislação portuguesa. IVA aplicável nos termos do CIVA.',
      DEFAULT: 'Fatura emitida por SHIFA Health OS. Todos os direitos reservados.',
    },
    zh: {
      CN: '发票符合中国税务法规。增值税适用。',
      DEFAULT: 'SHIFA Health OS 开具的发票。保留所有权利。',
    },
  };

  const langMap = disclaimers[lang] || disclaimers['fr'];
  return langMap[countryCode] || langMap['DEFAULT'] || 'SHIFA Health OS invoice.';
}
