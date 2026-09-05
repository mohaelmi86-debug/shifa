'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import SmartAmount from '@/components/ui/SmartAmount';
import { CURRENCIES } from '@/lib/i18n';
import type { Language } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getStripe } from '@/lib/stripe/client';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import DynamicInvoice, { type InvoiceData } from '@/components/DynamicInvoice';
import { getInvoiceLocaleConfig } from '@/lib/invoiceI18n';
import { useSupabaseRealtime } from '@/lib/hooks/useSupabaseRealtime';

type CheckoutStep = 'plan' | 'country' | 'currency' | 'payment' | 'confirm' | 'invoice' | 'activation';

interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  language: Language;
  paymentMethods: string[];
}

const countries: Country[] = [
  { code: 'KM', name: 'Comores', flag: '🇰🇲', currency: 'KMF', language: 'fr', paymentMethods: ['Huri Money', 'Virement bancaire', 'Carte bancaire'] },
  { code: 'MA', name: 'Maroc', flag: '🇲🇦', currency: 'MAD', language: 'fr', paymentMethods: ['Carte bancaire', 'Virement bancaire', 'CMI'] },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳', currency: 'XOF', language: 'fr', paymentMethods: ['Orange Money', 'Wave', 'Carte bancaire'] },
  { code: 'FR', name: 'France', flag: '🇫🇷', currency: 'EUR', language: 'fr', paymentMethods: ['Carte bancaire', 'Virement SEPA', 'Apple Pay', 'Google Pay'] },
  { code: 'AE', name: 'Émirats Arabes Unis', flag: '🇦🇪', currency: 'AED', language: 'ar', paymentMethods: ['Carte bancaire', 'Apple Pay', 'Google Pay'] },
  { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧', currency: 'GBP', language: 'en', paymentMethods: ['Carte bancaire', 'Apple Pay', 'Google Pay', 'Virement bancaire'] },
  { code: 'BR', name: 'Brésil', flag: '🇧🇷', currency: 'BRL', language: 'pt', paymentMethods: ['Carte bancaire', 'PIX', 'Boleto'] },
  { code: 'CN', name: 'Chine', flag: '🇨🇳', currency: 'CNY', language: 'zh', paymentMethods: ['Alipay', 'WeChat Pay', 'Carte bancaire'] },
];

const plans = [
  { id: 'pro_monthly', name: 'Pro Mensuel', actor: 'Professionnel', color: 'var(--shifa-blue)', gradient: 'linear-gradient(135deg, var(--shifa-blue), #0044cc)', icon: 'UserGroupIcon', amount: 2900 },
  { id: 'pro_annual', name: 'Pro Annuel', actor: 'Professionnel', color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)', icon: 'UserGroupIcon', amount: 29000 },
  { id: 'org_base', name: 'Organisation Base', actor: 'Organisation', color: 'var(--shifa-purple)', gradient: 'linear-gradient(135deg, var(--shifa-purple), #5b3d8a)', icon: 'BuildingOffice2Icon', amount: 9900 },
  { id: 'org_pro', name: 'Organisation Pro', actor: 'Organisation', color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #ea580c)', icon: 'BuildingOffice2Icon', amount: 19900 },
  { id: 'card_physical', name: 'Carte SHIFA Physique', actor: 'Patient / Pro', color: '#10B981', gradient: 'linear-gradient(135deg, #10B981, #059669)', icon: 'CreditCardIcon', amount: 1500 },
];

const paymentMethodIcons: Record<string, string> = {
  'Carte bancaire': 'CreditCardIcon',
  'Virement bancaire': 'BuildingLibraryIcon',
  'Orange Money': 'DevicePhoneMobileIcon',
  'Wave': 'DevicePhoneMobileIcon',
  'Apple Pay': 'DevicePhoneMobileIcon',
  'Google Pay': 'DevicePhoneMobileIcon',
  'Huri Money': 'DevicePhoneMobileIcon',
  'CMI': 'CreditCardIcon',
  'Virement SEPA': 'BuildingLibraryIcon',
  'PIX': 'BoltIcon',
  'Boleto': 'DocumentTextIcon',
  'Alipay': 'DevicePhoneMobileIcon',
  'WeChat Pay': 'DevicePhoneMobileIcon',
};

const stepLabels: Record<CheckoutStep, string> = {
  plan: 'Plan', country: 'Pays', currency: 'Devise',
  payment: 'Paiement', confirm: 'Confirmation', invoice: 'Facture', activation: 'Activation',
};
const stepOrder: CheckoutStep[] = ['plan', 'country', 'currency', 'payment', 'confirm', 'invoice', 'activation'];

// ─── Stripe Payment Form ──────────────────────────────────────────────────────
interface StripeFormProps {
  clientSecret: string;
  paymentIntentId: string;
  planId: string;
  planName: string;
  countryCode: string;
  language: Language;
  onSuccess: (invoiceId: string | null, invoiceNumber: string) => void;
  onError: (msg: string) => void;
}

function StripePaymentForm({ clientSecret, paymentIntentId, planId, planName, countryCode, language, onSuccess, onError }: StripeFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/checkout` },
      redirect: 'if_required',
    });

    if (error) {
      onError(error.message || 'Paiement échoué');
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      try {
        const session = await supabase.auth.getSession();
        const token = session.data.session?.access_token;
        const { data, error: confirmError } = await supabase.functions.invoke('confirm-payment', {
          body: { paymentIntentId: paymentIntent.id, planId, planName, countryCode, languageCode: language },
        });
        if (confirmError) throw new Error((data as { error?: string })?.error ?? confirmError.message);
        const result = data as { invoiceId?: string; invoiceNumber?: string };
        onSuccess(result?.invoiceId || null, result?.invoiceNumber || `INV-${Date.now()}`);
      } catch (err) {
        onError(err instanceof Error ? err.message : 'Confirmation failed');
      }
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full py-3 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        style={{ background: '#10B981', color: 'white' }}
      >
        {processing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Traitement en cours...
          </>
        ) : (
          <>
            <Icon name="LockClosedIcon" className="w-4 h-4" />
            Payer maintenant
          </>
        )}
      </button>
    </form>
  );
}

// ─── Main Checkout Component ──────────────────────────────────────────────────
export default function CheckoutContent() {
  const { user, role } = useAuth();
  const [step, setStep] = useState<CheckoutStep>('plan');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [intentError, setIntentError] = useState<string | null>(null);
  const [completedInvoiceId, setCompletedInvoiceId] = useState<string | null>(null);
  const [completedInvoiceNumber, setCompletedInvoiceNumber] = useState<string>('');
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [stripePromise] = useState(() => getStripe());

  const currentStepIndex = stepOrder.indexOf(step);
  const plan = plans.find(p => p.id === selectedPlan);
  const currency = selectedCountry ? CURRENCIES[selectedCountry.currency] : null;

  // Realtime audit log subscription for compliance display
  const { data: auditLogs } = useSupabaseRealtime<{
    id: string; action: string; resource_type: string; details: Record<string, unknown>; created_at: string;
  }>({
    table: 'audit_logs',
    filter: user ? { user_id: user.id } : undefined,
    orderBy: { column: 'created_at', ascending: false },
    limit: 5,
    enabled: !!user && (step === 'invoice' || step === 'activation'),
  });

  const goNext = () => {
    const next = stepOrder[currentStepIndex + 1];
    if (next) setStep(next);
  };
  const goBack = () => {
    const prev = stepOrder[currentStepIndex - 1];
    if (prev) setStep(prev);
  };

  // Create payment intent when reaching confirm step
  const createPaymentIntent = useCallback(async () => {
    if (!plan || !selectedCountry || !user) return;
    setLoadingIntent(true);
    setIntentError(null);
    try {
      const supabase = createClient();
      const localeConfig = getInvoiceLocaleConfig(selectedCountry.language, selectedCountry.code);
      const amountInSmallestUnit = Math.round(plan.amount * (localeConfig.taxRate + 1));

      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          planId: plan.id,
          planName: plan.name,
          amount: amountInSmallestUnit,
          currency: selectedCountry.currency,
          paymentMethod: selectedPayment,
          countryCode: selectedCountry.code,
          languageCode: selectedCountry.language,
        },
      });

      if (error) throw new Error((data as { error?: string })?.error ?? error.message);
      const result = data as { clientSecret: string; paymentIntentId: string };
      setClientSecret(result.clientSecret);
      setPaymentIntentId(result.paymentIntentId);
    } catch (err) {
      setIntentError(err instanceof Error ? err.message : 'Erreur de paiement');
    } finally {
      setLoadingIntent(false);
    }
  }, [plan, selectedCountry, selectedPayment, user]);

  const handleConfirmAndPay = async () => {
    if (!agreed) return;
    await createPaymentIntent();
    goNext();
  };

  const handlePaymentSuccess = (invId: string | null, invNumber: string) => {
    setCompletedInvoiceId(invId);
    setCompletedInvoiceNumber(invNumber);

    // Build local invoice data for display
    if (plan && selectedCountry) {
      const localeConfig = getInvoiceLocaleConfig(selectedCountry.language, selectedCountry.code);
      const subtotal = plan.amount;
      const taxAmount = Math.round(subtotal * localeConfig.taxRate * 100) / 100;
      const total = subtotal + taxAmount;
      setInvoiceData({
        invoiceNumber: invNumber,
        issuedAt: new Date(),
        billingName: user?.email || '',
        subtotal,
        taxAmount,
        total,
        currency: selectedCountry.currency,
        status: 'paid',
        paymentMethod: selectedPayment || 'Carte bancaire',
        lineItems: [{ description: plan.name, quantity: 1, unit_price: subtotal, total: subtotal }],
        planName: plan.name,
      });
    }
    setStep('invoice');
  };

  const handlePaymentError = (msg: string) => {
    setIntentError(msg);
  };

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--shifa-dark)' }}>Checkout SHIFA</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Souscrivez à votre plan en quelques étapes
          {role && (
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' }}>
              {role}
            </span>
          )}
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {stepOrder.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  background: i < currentStepIndex ? '#10B981' : i === currentStepIndex ? 'var(--shifa-blue)' : 'var(--muted)',
                  color: i <= currentStepIndex ? 'white' : 'var(--muted-foreground)',
                }}>
                {i < currentStepIndex ? <Icon name="CheckIcon" className="w-4 h-4" /> : i + 1}
              </div>
              <span className="text-[10px] font-medium whitespace-nowrap" style={{ color: i === currentStepIndex ? 'var(--shifa-blue)' : 'var(--muted-foreground)' }}>
                {stepLabels[s]}
              </span>
            </div>
            {i < stepOrder.length - 1 && (
              <div className="flex-1 h-0.5 mb-4 min-w-4" style={{ background: i < currentStepIndex ? '#10B981' : 'var(--border)' }} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Step: Plan */}
          {step === 'plan' && (
            <div className="card-base p-5">
              <h2 className="text-base font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Choisissez votre plan</h2>
              <div className="space-y-3">
                {plans.map((p) => (
                  <button key={p.id} onClick={() => setSelectedPlan(p.id)}
                    className="w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all"
                    style={{
                      border: selectedPlan === p.id ? `2px solid ${p.color}` : '2px solid var(--border)',
                      background: selectedPlan === p.id ? `${p.color}08` : 'var(--card)',
                    }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: p.gradient }}>
                      <Icon name={p.icon} className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.actor}</p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${p.color}15`, color: p.color }}>
                      {p.amount / 100} {p.id.includes('annual') ? '/ an' : '/ mois'}
                    </span>
                    {selectedPlan === p.id && <Icon name="CheckCircleIcon" className="w-5 h-5 flex-shrink-0" style={{ color: p.color }} />}
                  </button>
                ))}
              </div>
              <button onClick={goNext} disabled={!selectedPlan}
                className="mt-5 w-full py-3 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-40"
                style={{ background: 'var(--shifa-blue)', color: 'white' }}>
                Continuer →
              </button>
            </div>
          )}

          {/* Step: Country */}
          {step === 'country' && (
            <div className="card-base p-5">
              <h2 className="text-base font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Sélectionnez votre pays</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {countries.map((c) => (
                  <button key={c.code} onClick={() => setSelectedCountry(c)}
                    className="flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                    style={{
                      border: selectedCountry?.code === c.code ? '2px solid var(--shifa-blue)' : '2px solid var(--border)',
                      background: selectedCountry?.code === c.code ? 'rgba(0,102,255,0.06)' : 'var(--card)',
                    }}>
                    <span className="text-2xl">{c.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{c.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.currency} · {c.language.toUpperCase()}</p>
                    </div>
                    {selectedCountry?.code === c.code && <Icon name="CheckCircleIcon" className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--shifa-blue)' }} />}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={goBack} className="px-4 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
                  ← Retour
                </button>
                <button onClick={goNext} disabled={!selectedCountry}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-40"
                  style={{ background: 'var(--shifa-blue)', color: 'white' }}>
                  Continuer →
                </button>
              </div>
            </div>
          )}

          {/* Step: Currency */}
          {step === 'currency' && selectedCountry && (
            <div className="card-base p-5">
              <h2 className="text-base font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Devise & Localisation</h2>
              <div className="p-4 rounded-xl mb-4" style={{ background: 'rgba(0,102,255,0.06)', border: '1px solid rgba(0,102,255,0.15)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{selectedCountry.flag}</span>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>{selectedCountry.name}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      Devise : {selectedCountry.currency} · Langue : {selectedCountry.language.toUpperCase()}
                    </p>
                  </div>
                </div>
                {plan && (
                  <div className="p-3 rounded-lg" style={{ background: 'var(--card)' }}>
                    <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>Montant estimé</p>
                    <SmartAmount amount={plan.amount / 100} currency={selectedCountry.currency} size="md" />
                  </div>
                )}
              </div>
              {/* Invoice locale preview */}
              {plan && selectedCountry && (
                <div className="p-3 rounded-xl mb-4" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: '#10B981' }}>
                    <Icon name="DocumentTextIcon" className="w-3 h-3 inline mr-1" />
                    Aperçu format facture
                  </p>
                  {(() => {
                    const lc = getInvoiceLocaleConfig(selectedCountry.language, selectedCountry.code);
                    return (
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        {lc.invoiceLabel} · {lc.taxLabel} {Math.round(lc.taxRate * 100)}% · {lc.taxIdLabel}
                      </p>
                    );
                  })()}
                </div>
              )}
              <div className="flex gap-3 mt-5">
                <button onClick={goBack} className="px-4 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
                  ← Retour
                </button>
                <button onClick={goNext}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: 'var(--shifa-blue)', color: 'white' }}>
                  Confirmer la devise →
                </button>
              </div>
            </div>
          )}

          {/* Step: Payment method selection */}
          {step === 'payment' && selectedCountry && (
            <div className="card-base p-5">
              <h2 className="text-base font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Méthode de paiement</h2>
              <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>
                Méthodes disponibles pour {selectedCountry.name} ({selectedCountry.currency})
              </p>
              <div className="space-y-2">
                {selectedCountry.paymentMethods.map((pm) => (
                  <button key={pm} onClick={() => setSelectedPayment(pm)}
                    className="w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all"
                    style={{
                      border: selectedPayment === pm ? '2px solid var(--shifa-blue)' : '2px solid var(--border)',
                      background: selectedPayment === pm ? 'rgba(0,102,255,0.06)' : 'var(--card)',
                    }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: selectedPayment === pm ? 'rgba(0,102,255,0.1)' : 'var(--muted)' }}>
                      <Icon name={paymentMethodIcons[pm] || 'CreditCardIcon'} className="w-4 h-4"
                        style={{ color: selectedPayment === pm ? 'var(--shifa-blue)' : 'var(--muted-foreground)' }} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{pm}</span>
                    {selectedPayment === pm && <Icon name="CheckCircleIcon" className="w-4 h-4 ml-auto flex-shrink-0" style={{ color: 'var(--shifa-blue)' }} />}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={goBack} className="px-4 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
                  ← Retour
                </button>
                <button onClick={goNext} disabled={!selectedPayment}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-40"
                  style={{ background: 'var(--shifa-blue)', color: 'white' }}>
                  Continuer →
                </button>
              </div>
            </div>
          )}

          {/* Step: Confirm + T&C */}
          {step === 'confirm' && plan && selectedCountry && (
            <div className="card-base p-5">
              <h2 className="text-base font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Confirmation de commande</h2>
              <div className="space-y-3 mb-5">
                {[
                  { label: 'Plan sélectionné', value: plan.name },
                  { label: 'Rôle', value: role || 'patient' },
                  { label: 'Pays', value: `${selectedCountry.flag} ${selectedCountry.name}` },
                  { label: 'Devise', value: selectedCountry.currency },
                  { label: 'Langue facture', value: selectedCountry.language.toUpperCase() },
                  { label: 'Méthode de paiement', value: selectedPayment || '—' },
                  { label: 'Montant HT', value: `${(plan.amount / 100).toFixed(2)} ${selectedCountry.currency}` },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              {/* RLS isolation notice */}
              <div className="p-3 rounded-xl mb-4" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)' }}>
                <div className="flex items-start gap-2">
                  <Icon name="ShieldCheckIcon" className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#6366f1' }} />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--shifa-dark)' }}>Isolation financière RLS</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      Vos données financières sont isolées par rôle ({role || 'patient'}). Aucun autre utilisateur ne peut accéder à vos transactions.
                    </p>
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer mb-5">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded" />
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  J'accepte les <span style={{ color: 'var(--shifa-blue)' }}>Conditions Générales d'Utilisation</span> et la{' '}
                  <span style={{ color: 'var(--shifa-blue)' }}>Politique de Confidentialité</span> de SHIFA Health OS.
                </span>
              </label>
              <div className="flex gap-3">
                <button onClick={goBack} className="px-4 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
                  ← Retour
                </button>
                <button onClick={handleConfirmAndPay} disabled={!agreed || loadingIntent}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
                  style={{ background: '#10B981', color: 'white' }}>
                  {loadingIntent ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Préparation...</>
                  ) : (
                    <><Icon name="LockClosedIcon" className="w-4 h-4" /> Procéder au paiement →</>
                  )}
                </button>
              </div>
              {intentError && (
                <p className="mt-3 text-xs text-center" style={{ color: '#EF4444' }}>{intentError}</p>
              )}
            </div>
          )}

          {/* Step: Stripe Payment */}
          {step === 'invoice' && !invoiceData && clientSecret && plan && selectedCountry && (
            <div className="card-base p-5">
              <h2 className="text-base font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Paiement sécurisé</h2>
              <div className="flex items-center gap-2 mb-4 p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <Icon name="LockClosedIcon" className="w-4 h-4 flex-shrink-0" style={{ color: '#10B981' }} />
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  Paiement sécurisé par Stripe · Chiffrement SSL/TLS
                </p>
              </div>
              {intentError && (
                <div className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <p className="text-xs" style={{ color: '#EF4444' }}>{intentError}</p>
                </div>
              )}
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                <StripePaymentForm
                  clientSecret={clientSecret}
                  paymentIntentId={paymentIntentId || ''}
                  planId={plan.id}
                  planName={plan.name}
                  countryCode={selectedCountry.code}
                  language={selectedCountry.language}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
              <button onClick={goBack} className="mt-3 w-full py-2 rounded-xl text-xs font-semibold"
                style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }}>
                ← Retour
              </button>
            </div>
          )}

          {/* Step: Invoice display */}
          {step === 'invoice' && invoiceData && selectedCountry && (
            <div className="space-y-4">
              <div className="card-base p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                    <Icon name="CheckIcon" className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Paiement confirmé</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Votre facture a été générée</p>
                  </div>
                </div>
              </div>
              <DynamicInvoice
                invoice={invoiceData}
                language={selectedCountry.language}
                countryCode={selectedCountry.code}
                onDownload={() => window.print()}
              />
              {/* Realtime audit log */}
              {auditLogs.length > 0 && (
                <div className="card-base p-4">
                  <p className="text-xs font-semibold mb-3 flex items-center gap-1" style={{ color: 'var(--shifa-dark)' }}>
                    <Icon name="ShieldCheckIcon" className="w-3.5 h-3.5" style={{ color: '#6366f1' }} />
                    Journal d'audit en temps réel
                  </p>
                  <div className="space-y-2">
                    {auditLogs.slice(0, 3).map((log) => (
                      <div key={log.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'var(--muted)' }}>
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#10B981' }} />
                        <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{log.action}</span>
                        <span className="text-xs ml-auto" style={{ color: 'var(--muted-foreground)' }}>
                          {new Date(log.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={goNext}
                className="w-full py-3 rounded-xl text-sm font-semibold"
                style={{ background: 'var(--shifa-blue)', color: 'white' }}>
                Activer mon plan →
              </button>
            </div>
          )}

          {/* Step: Activation */}
          {step === 'activation' && (
            <div className="card-base p-8 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                <Icon name="CheckIcon" className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--shifa-dark)' }}>Plan activé !</h2>
              <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>
                Votre plan {plan?.name} est maintenant actif. Bienvenue dans SHIFA !
              </p>
              {completedInvoiceNumber && (
                <p className="text-xs mb-6 font-mono" style={{ color: 'var(--muted-foreground)' }}>
                  Facture : {completedInvoiceNumber}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/workspace-professionnel" className="px-6 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: 'var(--shifa-blue)', color: 'white' }}>
                  Accéder à mon espace
                </Link>
                <Link href="/subscription-management" className="px-6 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
                  Gérer mon abonnement
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-1">
          <div className="card-base p-5 sticky top-6">
            <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Récapitulatif</h3>
            <div className="space-y-3">
              {[
                { icon: 'CheckCircleIcon', active: !!selectedPlan, label: selectedPlan ? plan?.name : 'Plan non sélectionné' },
                { icon: 'CheckCircleIcon', active: !!selectedCountry, label: selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : 'Pays non sélectionné' },
                { icon: 'CheckCircleIcon', active: !!selectedCountry, label: selectedCountry ? `Devise : ${selectedCountry.currency}` : 'Devise non sélectionnée' },
                { icon: 'CheckCircleIcon', active: !!selectedPayment, label: selectedPayment || 'Paiement non sélectionné' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Icon name={item.icon} className="w-4 h-4 flex-shrink-0" style={{ color: item.active ? '#10B981' : 'var(--border)' }} />
                  <span className="text-xs" style={{ color: item.active ? 'var(--foreground)' : 'var(--muted-foreground)' }}>{item.label}</span>
                </div>
              ))}
            </div>

            {selectedCountry && plan && (
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>Montant estimé</p>
                <SmartAmount amount={plan.amount / 100} currency={selectedCountry.currency} size="lg" />
                {(() => {
                  const lc = getInvoiceLocaleConfig(selectedCountry.language, selectedCountry.code);
                  return (
                    <p className="text-[11px] mt-1" style={{ color: 'var(--muted-foreground)' }}>
                      + {lc.taxLabel} {Math.round(lc.taxRate * 100)}% = {((plan.amount / 100) * (1 + lc.taxRate)).toFixed(2)} {selectedCountry.currency}
                    </p>
                  );
                })()}
              </div>
            )}

            {/* Security badges */}
            <div className="mt-4 pt-4 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
              {[
                { icon: 'LockClosedIcon', label: 'Paiement Stripe sécurisé', color: '#10B981' },
                { icon: 'ShieldCheckIcon', label: 'Isolation RLS par rôle', color: '#6366f1' },
                { icon: 'DocumentTextIcon', label: 'Facture i18n automatique', color: 'var(--shifa-blue)' },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Icon name={badge.icon} className="w-3.5 h-3.5 flex-shrink-0" style={{ color: badge.color }} />
                  <span className="text-[11px]" style={{ color: 'var(--muted-foreground)' }}>{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
