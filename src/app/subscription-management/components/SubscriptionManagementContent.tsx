'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import SmartAmount from '@/components/ui/SmartAmount';

type SubTab = 'current' | 'upgrade' | 'billing' | 'invoices' | 'payment_methods';

interface Invoice {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'refunded';
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile_money' | 'bank_transfer';
  label: string;
  detail: string;
  default: boolean;
}

const mockInvoices: Invoice[] = [
  { id: 'INV-2026-0811', date: '11 août 2026', description: 'SHIFA Pro — Mensuel', amount: 5000, currency: 'XOF', status: 'paid' },
  { id: 'INV-2026-0711', date: '11 juil. 2026', description: 'SHIFA Pro — Mensuel', amount: 5000, currency: 'XOF', status: 'paid' },
  { id: 'INV-2026-0611', date: '11 juin 2026', description: 'SHIFA Pro — Mensuel', amount: 5000, currency: 'XOF', status: 'paid' },
  { id: 'INV-2026-0511', date: '11 mai 2026', description: 'SHIFA Pro — Mensuel + Module Téléconsult.', amount: 7500, currency: 'XOF', status: 'paid' },
  { id: 'INV-2026-0411', date: '11 avr. 2026', description: 'SHIFA Pro — Mensuel', amount: 5000, currency: 'XOF', status: 'refunded' },
];

const mockPaymentMethods: PaymentMethod[] = [
  { id: 'pm-1', type: 'mobile_money', label: 'Orange Money', detail: '+269 321 ****', default: true },
  { id: 'pm-2', type: 'card', label: 'Visa', detail: '**** **** **** 4242', default: false },
];

const upgradePlans = [
  {
    id: 'pro', name: 'Pro', price: 'À configurer', currency: 'XOF', color: 'var(--shifa-blue)',
    gradient: 'linear-gradient(135deg, var(--shifa-blue), #0044cc)',
    features: ['Espace de consultation', 'Prescriptions numériques', 'Téléconsultation', 'SHIFA AI Pro', 'Statistiques avancées'],
    current: true,
  },
  {
    id: 'premium', name: 'Premium', price: 'À configurer', currency: 'XOF', color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    features: ['Tout le plan Pro', 'Téléconsultation illimitée', 'SHIFA AI Enterprise', 'Automatisation avancée', 'Intégrations avancées'],
    current: false,
  },
  {
    id: 'enterprise', name: 'Enterprise', price: 'Sur devis', currency: 'XOF', color: '#0A1B3D',
    gradient: 'linear-gradient(135deg, #0A1B3D, #1e3a6e)',
    features: ['Tout le plan Premium', 'Multi-sites', 'API dédiée', 'SLA garanti', 'Support 24/7'],
    current: false,
  },
];

const statusColors = {
  paid: { bg: 'rgba(16,185,129,0.1)', color: '#10B981', label: 'Payé' },
  pending: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', label: 'En attente' },
  refunded: { bg: 'rgba(107,114,128,0.1)', color: '#6b7280', label: 'Remboursé' },
};

const pmIcons = { card: 'CreditCardIcon', mobile_money: 'DevicePhoneMobileIcon', bank_transfer: 'BuildingLibraryIcon' };

export default function SubscriptionManagementContent() {
  const [activeTab, setActiveTab] = useState<SubTab>('current');
  const [showCancelModal, setShowCancelModal] = useState(false);

  const tabs: { key: SubTab; label: string; icon: string }[] = [
    { key: 'current', label: 'Mon abonnement', icon: 'StarIcon' },
    { key: 'upgrade', label: 'Changer de plan', icon: 'ArrowUpCircleIcon' },
    { key: 'billing', label: 'Historique', icon: 'ClipboardDocumentListIcon' },
    { key: 'invoices', label: 'Factures', icon: 'DocumentTextIcon' },
    { key: 'payment_methods', label: 'Paiement', icon: 'CreditCardIcon' },
  ];

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--shifa-dark)' }}>Gestion de l'abonnement</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Gérez votre plan SHIFA, vos factures et vos méthodes de paiement
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl mb-6 overflow-x-auto" style={{ background: 'var(--muted)' }}>
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap"
            style={activeTab === tab.key ? { background: 'var(--shifa-blue)', color: 'white' } : { color: 'var(--muted-foreground)' }}>
            <Icon name={tab.icon} className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Current plan */}
      {activeTab === 'current' && (
        <div className="space-y-5">
          {/* Plan banner */}
          <div className="card-base overflow-hidden">
            <div className="p-6" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), #0044cc)' }}>
              <div className="flex items-start justify-between gap-4">
                <div className="text-white">
                  <p className="text-xs font-semibold opacity-80 mb-1">Plan actuel</p>
                  <h2 className="text-2xl font-bold">SHIFA Pro</h2>
                  <p className="text-sm opacity-80 mt-1">Professionnel de santé · Mensuel</p>
                  <div className="mt-3">
                    <SmartAmount amount={5000} currency="XOF" size="lg" lightMode />
                    <p className="text-xs opacity-60 mt-1">/ mois · Prochain renouvellement : 11 sept. 2026</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                    ACTIF
                  </span>
                </div>
              </div>
            </div>
            <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Statut', value: 'Actif', color: '#10B981' },
                { label: 'Période', value: 'Mensuel', color: 'var(--shifa-blue)' },
                { label: 'Prochain paiement', value: '11 sept. 2026', color: 'var(--foreground)' },
                { label: 'Méthode', value: 'Orange Money', color: 'var(--foreground)' },
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: item.color }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Active modules */}
          <div className="card-base p-5">
            <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--shifa-dark)' }}>Modules actifs</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {['Espace de consultation', 'Prescriptions', 'Résultats', 'Messagerie sécurisée', 'Agenda avancé', 'Téléconsultation'].map((m, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <Icon name="CheckCircleIcon" className="w-4 h-4 flex-shrink-0" style={{ color: '#10B981' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setActiveTab('upgrade')}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: 'var(--shifa-blue)', color: 'white' }}>
              Changer de plan
            </button>
            <button onClick={() => setActiveTab('billing')}
              className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
              Voir l'historique
            </button>
            <button onClick={() => setShowCancelModal(true)}
              className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              Résilier l'abonnement
            </button>
          </div>

          {/* Cancel modal */}
          {showCancelModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
              <div className="card-base p-6 max-w-md w-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
                    <Icon name="ExclamationTriangleIcon" className="w-5 h-5" style={{ color: '#EF4444' }} />
                  </div>
                  <h3 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>Résilier l'abonnement</h3>
                </div>
                <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
                  Votre abonnement SHIFA Pro restera actif jusqu'au 11 septembre 2026. Après cette date, votre compte passera au plan Starter gratuit.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setShowCancelModal(false)}
                    className="flex-1 py-2 rounded-lg text-sm font-semibold"
                    style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
                    Annuler
                  </button>
                  <button onClick={() => setShowCancelModal(false)}
                    className="flex-1 py-2 rounded-lg text-sm font-semibold"
                    style={{ background: '#EF4444', color: 'white' }}>
                    Confirmer la résiliation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upgrade */}
      {activeTab === 'upgrade' && (
        <div className="space-y-5">
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Comparez les plans et choisissez celui qui correspond à votre pratique.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upgradePlans.map((plan) => (
              <div key={plan.id} className="card-base overflow-hidden"
                style={{ border: plan.current ? `2px solid ${plan.color}` : '2px solid transparent' }}>
                <div className="p-4" style={{ background: plan.gradient }}>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    {plan.current && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.25)', color: 'white' }}>ACTUEL</span>}
                  </div>
                  <p className="text-xl font-bold text-white">{plan.price}</p>
                  {plan.price !== 'Sur devis' && <p className="text-xs text-white opacity-60">/ mois · par pays</p>}
                </div>
                <div className="p-4">
                  <ul className="space-y-1.5 mb-4">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Icon name="CheckIcon" className="w-3.5 h-3.5 flex-shrink-0" style={{ color: plan.color }} />
                        <span className="text-xs" style={{ color: 'var(--foreground)' }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.current ? (
                    <button disabled className="w-full py-2 rounded-lg text-xs font-semibold opacity-50 cursor-not-allowed"
                      style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                      Plan actuel
                    </button>
                  ) : plan.price === 'Sur devis' ? (
                    <Link href="/support-center" className="w-full block text-center py-2 rounded-lg text-xs font-semibold"
                      style={{ background: plan.gradient, color: 'white' }}>
                      Contacter SHIFA
                    </Link>
                  ) : (
                    <Link href="/checkout" className="w-full block text-center py-2 rounded-lg text-xs font-semibold"
                      style={{ background: plan.gradient, color: 'white' }}>
                      Passer à {plan.name}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Billing history */}
      {activeTab === 'billing' && (
        <div className="card-base overflow-hidden">
          <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Historique de facturation</h3>
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{mockInvoices.length} transactions</span>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {mockInvoices.map((inv) => (
              <div key={inv.id} className="p-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--muted)' }}>
                  <Icon name="DocumentTextIcon" className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>{inv.description}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{inv.date} · {inv.id}</p>
                </div>
                <SmartAmount amount={inv.amount} currency={inv.currency} size="sm" inline />
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: statusColors[inv.status].bg, color: statusColors[inv.status].color }}>
                  {statusColors[inv.status].label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invoices */}
      {activeTab === 'invoices' && (
        <div className="space-y-3">
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Téléchargez vos factures SHIFA au format PDF.</p>
          {mockInvoices.filter(i => i.status === 'paid').map((inv) => (
            <div key={inv.id} className="card-base p-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,102,255,0.1)' }}>
                <Icon name="DocumentArrowDownIcon" className="w-4 h-4" style={{ color: 'var(--shifa-blue)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{inv.id}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{inv.date} · {inv.description}</p>
              </div>
              <SmartAmount amount={inv.amount} currency={inv.currency} size="sm" inline />
              <button className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                style={{ background: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' }}>
                <Icon name="ArrowDownTrayIcon" className="w-3.5 h-3.5" />
                PDF
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Payment methods */}
      {activeTab === 'payment_methods' && (
        <div className="space-y-4">
          <div className="space-y-3">
            {mockPaymentMethods.map((pm) => (
              <div key={pm.id} className="card-base p-4 flex items-center gap-4"
                style={{ border: pm.default ? '2px solid var(--shifa-blue)' : '2px solid transparent' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: pm.default ? 'rgba(0,102,255,0.1)' : 'var(--muted)' }}>
                  <Icon name={pmIcons[pm.type]} className="w-5 h-5" style={{ color: pm.default ? 'var(--shifa-blue)' : 'var(--muted-foreground)' }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{pm.label}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{pm.detail}</p>
                </div>
                {pm.default && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' }}>
                    PAR DÉFAUT
                  </span>
                )}
                <button className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Modifier</button>
              </div>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px dashed var(--border)' }}>
            <Icon name="PlusIcon" className="w-4 h-4" />
            Ajouter une méthode de paiement
          </button>
          <div className="card-base p-4" style={{ background: 'rgba(0,102,255,0.04)', border: '1px solid rgba(0,102,255,0.15)' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--shifa-dark)' }}>Méthodes disponibles selon votre pays</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {['Carte bancaire', 'Orange Money', 'M-Pesa', 'Virement bancaire', 'Wave', 'Google Pay', 'Apple Pay'].map((m) => (
                <span key={m} className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>{m}</span>
              ))}
            </div>
            <p className="text-[11px] mt-2" style={{ color: 'var(--muted-foreground)' }}>Les méthodes disponibles dépendent de votre pays et de votre devise. Intégration fournisseurs en Phase 3.</p>
          </div>
        </div>
      )}
    </div>
  );
}
