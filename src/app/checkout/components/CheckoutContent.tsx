'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import SmartAmount from '@/components/ui/SmartAmount';
import { CURRENCIES } from '@/lib/i18n';

type CheckoutStep = 'plan' | 'country' | 'currency' | 'payment' | 'confirm' | 'activation';

interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  paymentMethods: string[];
}

const countries: Country[] = [
  { code: 'KM', name: 'Comores', flag: '🇰🇲', currency: 'KMF', paymentMethods: ['Huri Money', 'Virement bancaire', 'Carte bancaire'] },
  { code: 'MA', name: 'Maroc', flag: '🇲🇦', currency: 'MAD', paymentMethods: ['Carte bancaire', 'Virement bancaire', 'CMI'] },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳', currency: 'XOF', paymentMethods: ['Orange Money', 'Wave', 'Carte bancaire'] },
  { code: 'FR', name: 'France', flag: '🇫🇷', currency: 'EUR', paymentMethods: ['Carte bancaire', 'Virement SEPA', 'Apple Pay', 'Google Pay'] },
  { code: 'AE', name: 'Émirats Arabes Unis', flag: '🇦🇪', currency: 'AED', paymentMethods: ['Carte bancaire', 'Apple Pay', 'Google Pay'] },
  { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧', currency: 'GBP', paymentMethods: ['Carte bancaire', 'Apple Pay', 'Google Pay', 'Virement bancaire'] },
  { code: 'BR', name: 'Brésil', flag: '🇧🇷', currency: 'BRL', paymentMethods: ['Carte bancaire', 'PIX', 'Boleto'] },
  { code: 'CN', name: 'Chine', flag: '🇨🇳', currency: 'CNY', paymentMethods: ['Alipay', 'WeChat Pay', 'Carte bancaire'] },
];

const plans = [
  { id: 'pro_monthly', name: 'Pro Mensuel', actor: 'Professionnel', color: 'var(--shifa-blue)', gradient: 'linear-gradient(135deg, var(--shifa-blue), #0044cc)', icon: 'UserGroupIcon', priceKey: 'pro_monthly' },
  { id: 'pro_annual', name: 'Pro Annuel', actor: 'Professionnel', color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)', icon: 'UserGroupIcon', priceKey: 'pro_annual' },
  { id: 'org_base', name: 'Organisation Base', actor: 'Organisation', color: 'var(--shifa-purple)', gradient: 'linear-gradient(135deg, var(--shifa-purple), #5b3d8a)', icon: 'BuildingOffice2Icon', priceKey: 'org_base' },
  { id: 'org_pro', name: 'Organisation Pro', actor: 'Organisation', color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #ea580c)', icon: 'BuildingOffice2Icon', priceKey: 'org_pro' },
  { id: 'card_physical', name: 'Carte SHIFA Physique', actor: 'Patient / Pro', color: '#10B981', gradient: 'linear-gradient(135deg, #10B981, #059669)', icon: 'CreditCardIcon', priceKey: 'card_physical' },
];

const paymentMethodIcons: Record<string, string> = {
  'Carte bancaire': 'CreditCardIcon',
  'Virement bancaire': 'BuildingLibraryIcon',
  'Orange Money': 'DevicePhoneMobileIcon',
  'Wave': 'DevicePhoneMobileIcon',
  'M-Pesa': 'DevicePhoneMobileIcon',
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
  plan: 'Plan',
  country: 'Pays',
  currency: 'Devise',
  payment: 'Paiement',
  confirm: 'Confirmation',
  activation: 'Activation',
};

const stepOrder: CheckoutStep[] = ['plan', 'country', 'currency', 'payment', 'confirm', 'activation'];

export default function CheckoutContent() {
  const [step, setStep] = useState<CheckoutStep>('plan');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [activated, setActivated] = useState(false);

  const currentStepIndex = stepOrder.indexOf(step);
  const plan = plans.find(p => p.id === selectedPlan);
  const currency = selectedCountry ? CURRENCIES[selectedCountry.currency] : null;

  const goNext = () => {
    const next = stepOrder[currentStepIndex + 1];
    if (next) setStep(next);
  };
  const goBack = () => {
    const prev = stepOrder[currentStepIndex - 1];
    if (prev) setStep(prev);
  };

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--shifa-dark)' }}>Checkout SHIFA</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Souscrivez à votre plan en quelques étapes</p>
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
                      Prix configurable
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
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.currency}</p>
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
              <h2 className="text-base font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Devise de transaction</h2>
              <div className="p-4 rounded-xl mb-4" style={{ background: 'rgba(0,102,255,0.06)', border: '1px solid rgba(0,102,255,0.15)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{selectedCountry.flag}</span>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>{selectedCountry.name}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Devise locale : {selectedCountry.currency}</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg" style={{ background: 'var(--card)' }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>Exemple d'affichage tarifaire</p>
                  <SmartAmount amount={selectedCountry.currency === 'KMF' ? 10000 : selectedCountry.currency === 'MAD' ? 250 : selectedCountry.currency === 'XOF' ? 5000 : selectedCountry.currency === 'EUR' ? 29 : selectedCountry.currency === 'GBP' ? 25 : selectedCountry.currency === 'AED' ? 110 : selectedCountry.currency === 'BRL' ? 150 : 200} currency={selectedCountry.currency} size="md" />
                </div>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <div className="flex items-start gap-2">
                  <Icon name="InformationCircleIcon" className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#F59E0B' }} />
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--shifa-dark)' }}>Devise locale = Devise de transaction</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      Votre transaction sera effectuée en {selectedCountry.currency}. Les valeurs EUR et USD affichées sont des références indicatives uniquement.
                    </p>
                  </div>
                </div>
              </div>
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

          {/* Step: Payment */}
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
              <div className="mt-4 p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  ⚠️ Phase 1 — Aucun paiement réel n'est traité. L'intégration des fournisseurs de paiement est prévue en Phase 3.
                </p>
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

          {/* Step: Confirm */}
          {step === 'confirm' && plan && selectedCountry && (
            <div className="card-base p-5">
              <h2 className="text-base font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Confirmation de commande</h2>
              <div className="space-y-3 mb-5">
                {[
                  { label: 'Plan sélectionné', value: plan.name },
                  { label: 'Pays', value: `${selectedCountry.flag} ${selectedCountry.name}` },
                  { label: 'Devise', value: selectedCountry.currency },
                  { label: 'Méthode de paiement', value: selectedPayment || '—' },
                  { label: 'Montant', value: 'À configurer par pays' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{item.value}</span>
                  </div>
                ))}
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
                <button onClick={goNext} disabled={!agreed}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-40"
                  style={{ background: '#10B981', color: 'white' }}>
                  Confirmer et payer →
                </button>
              </div>
            </div>
          )}

          {/* Step: Activation */}
          {step === 'activation' && (
            <div className="card-base p-8 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                <Icon name="CheckIcon" className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--shifa-dark)' }}>
                {activated ? 'Plan activé !' : 'Commande confirmée'}
              </h2>
              <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
                {activated
                  ? `Votre plan ${plan?.name} est maintenant actif. Bienvenue dans SHIFA !`
                  : 'Votre commande a été reçue. Cliquez sur Activer pour finaliser.'}
              </p>
              {!activated ? (
                <button onClick={() => setActivated(true)}
                  className="px-8 py-3 rounded-xl text-sm font-semibold"
                  style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white' }}>
                  Activer mon plan
                </button>
              ) : (
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
              )}
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-1">
          <div className="card-base p-5 sticky top-6">
            <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Récapitulatif</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Icon name="CheckCircleIcon" className="w-4 h-4 flex-shrink-0" style={{ color: selectedPlan ? '#10B981' : 'var(--border)' }} />
                <span className="text-xs" style={{ color: selectedPlan ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                  {selectedPlan ? plan?.name : 'Plan non sélectionné'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="CheckCircleIcon" className="w-4 h-4 flex-shrink-0" style={{ color: selectedCountry ? '#10B981' : 'var(--border)' }} />
                <span className="text-xs" style={{ color: selectedCountry ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                  {selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : 'Pays non sélectionné'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="CheckCircleIcon" className="w-4 h-4 flex-shrink-0" style={{ color: selectedCountry ? '#10B981' : 'var(--border)' }} />
                <span className="text-xs" style={{ color: selectedCountry ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                  {selectedCountry ? `Devise : ${selectedCountry.currency}` : 'Devise non sélectionnée'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="CheckCircleIcon" className="w-4 h-4 flex-shrink-0" style={{ color: selectedPayment ? '#10B981' : 'var(--border)' }} />
                <span className="text-xs" style={{ color: selectedPayment ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                  {selectedPayment || 'Paiement non sélectionné'}
                </span>
              </div>
            </div>

            {selectedCountry && (
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>Montant estimé</p>
                <SmartAmount
                  amount={selectedCountry.currency === 'KMF' ? 10000 : selectedCountry.currency === 'MAD' ? 250 : selectedCountry.currency === 'XOF' ? 5000 : selectedCountry.currency === 'EUR' ? 29 : selectedCountry.currency === 'GBP' ? 25 : selectedCountry.currency === 'AED' ? 110 : 200}
                  currency={selectedCountry.currency}
                  size="lg"
                />
                <p className="text-[11px] mt-2" style={{ color: 'var(--muted-foreground)' }}>
                  Prix illustratif · Prix final défini par pays
                </p>
              </div>
            )}

            <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <p className="text-[11px]" style={{ color: 'var(--muted-foreground)' }}>
                ⚠️ Phase 1 — Aucun paiement réel. Intégration fournisseurs en Phase 3.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
