'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import SmartAmount from '@/components/ui/SmartAmount';

const PROVIDERS = [
  { id: 'p1', name: 'Dr. Mohamed Sy', specialty: 'Médecin généraliste', country: '🇸🇳 Sénégal', currency: 'XOF', consultPrice: 15000, shifaFee: 'Configurable', paymentStatus: 'Reçu', insuranceStatus: 'Remboursé', revenueShare: 85 },
  { id: 'p2', name: 'Dr. Fatima Benali', specialty: 'Cardiologue', country: '🇲🇦 Maroc', currency: 'MAD', consultPrice: 350, shifaFee: 'Configurable', paymentStatus: 'En attente', insuranceStatus: 'En cours', revenueShare: 80 },
  { id: 'p3', name: 'Dr. Koné Ibrahima', specialty: 'Pédiatre', country: "🇨🇮 Côte d\'Ivoire", currency: 'XOF', consultPrice: 12000, shifaFee: 'Configurable', paymentStatus: 'Reçu', insuranceStatus: 'Non couvert', revenueShare: 85 },
  { id: 'p4', name: 'Dr. Amina Hassan', specialty: 'Dermatologue', country: '🇰🇲 Comores', currency: 'KMF', consultPrice: 8000, shifaFee: 'Configurable', paymentStatus: 'Remboursé', insuranceStatus: 'Remboursé', revenueShare: 80 },
];

const SESSIONS = [
  { id: 'TC-001', patient: 'Aïcha Diallo', provider: 'Dr. Mohamed Sy', date: '2025-01-10', duration: '25 min', amount: 15000, currency: 'XOF', shifaFee: '—', providerRevenue: 12750, payStatus: 'Payé', insuranceStatus: 'Remboursé', refundStatus: '—' },
  { id: 'TC-002', patient: 'Youssef Tazi', provider: 'Dr. Fatima Benali', date: '2025-01-09', duration: '40 min', amount: 350, currency: 'MAD', shifaFee: '—', providerRevenue: 280, payStatus: 'En attente', insuranceStatus: 'En cours', refundStatus: '—' },
  { id: 'TC-003', patient: 'Mariam Coulibaly', provider: 'Dr. Koné Ibrahima', date: '2025-01-08', duration: '20 min', amount: 12000, currency: 'XOF', shifaFee: '—', providerRevenue: 10200, payStatus: 'Payé', insuranceStatus: 'Non couvert', refundStatus: '—' },
  { id: 'TC-004', patient: 'Omar Abdallah', provider: 'Dr. Amina Hassan', date: '2025-01-07', duration: '30 min', amount: 8000, currency: 'KMF', shifaFee: '—', providerRevenue: 6400, payStatus: 'Remboursé', insuranceStatus: 'Remboursé', refundStatus: 'Traité' },
];

const PAYMENT_STATUS_CONFIG: Record<string, { bg: string; text: string }> = {
  'Payé': { bg: '#dcfce7', text: '#16a34a' },
  'En attente': { bg: '#fef9c3', text: '#ca8a04' },
  'Remboursé': { bg: '#dbeafe', text: '#1d4ed8' },
  'Remboursé (assurance)': { bg: '#f3e8ff', text: '#7c3aed' },
  'Non couvert': { bg: '#fee2e2', text: '#dc2626' },
  'En cours': { bg: '#fef9c3', text: '#ca8a04' },
  'Traité': { bg: '#dcfce7', text: '#16a34a' },
  '—': { bg: '#f1f5f9', text: '#64748b' },
};

const REVENUE_MODELS = [
  { model: 'Inclus dans le plan Pro', description: 'Téléconsultation incluse — aucun frais SHIFA par session', actors: ['Professionnel Pro/Premium'], color: '#16a34a', bg: '#dcfce7' },
  { model: 'Frais par consultation', description: 'Le prestataire fixe son prix — SHIFA prélève un % configurable', actors: ['Professionnel Starter', 'Indépendant'], color: '#2563eb', bg: '#dbeafe' },
  { model: 'Contrat organisation', description: 'Volume de consultations inclus dans le contrat organisationnel', actors: ['Hôpital', 'Clinique', 'Réseau de santé'], color: '#7c3aed', bg: '#f5f3ff' },
];

export default function TeleconsultationCommercialContent() {
  const [tab, setTab] = useState<'providers' | 'sessions' | 'models'>('providers');

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Téléconsultation — Surface Commerciale</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Prix prestataire, frais SHIFA configurables, statut paiement, remboursement assurance et répartition des revenus
          </p>
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: '#dbeafe', color: '#1d4ed8' }}>
          <Icon name="VideoCameraIcon" size={12} />
          Frais SHIFA non hardcodés — Phase 1
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Prestataires actifs', value: '4', icon: 'UserGroupIcon', color: '#2563eb' },
          { label: 'Sessions (démo)', value: '4', icon: 'VideoCameraIcon', color: '#7c3aed' },
          { label: 'Modèles revenus', value: '3', icon: 'ChartBarIcon', color: '#16a34a' },
          { label: 'Frais SHIFA', value: 'Config.', icon: 'Cog6ToothIcon', color: '#d97706' },
        ].map(k => (
          <div key={k.label} className="rounded-xl p-4 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Icon name={k.icon as any} size={16} style={{ color: k.color }} />
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{k.label}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--muted)' }}>
        {([['providers', 'Prestataires & Tarifs'], ['sessions', 'Sessions & Paiements'], ['models', 'Modèles de revenus']] as const).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: tab === t ? 'var(--card)' : 'transparent',
              color: tab === t ? 'var(--foreground)' : 'var(--muted-foreground)',
              boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Providers */}
      {tab === 'providers' && (
        <div className="space-y-3">
          {PROVIDERS.map(p => (
            <div key={p.id} className="rounded-xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: '#dbeafe', color: '#1d4ed8' }}>
                    {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.specialty} · {p.country}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="text-center">
                    <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Prix consultation</p>
                    <SmartAmount amount={p.consultPrice} currency={p.currency} size="sm" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Frais SHIFA</p>
                    <span className="text-sm font-medium px-2 py-0.5 rounded-full" style={{ background: '#fef9c3', color: '#ca8a04' }}>{p.shifaFee}</span>
                  </div>
                  <div className="text-center">
                    <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Part prestataire</p>
                    <span className="text-sm font-bold" style={{ color: '#16a34a' }}>{p.revenueShare}%</span>
                  </div>
                  <div className="text-center">
                    <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Paiement</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: PAYMENT_STATUS_CONFIG[p.paymentStatus]?.bg, color: PAYMENT_STATUS_CONFIG[p.paymentStatus]?.text }}>
                      {p.paymentStatus}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Assurance</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: PAYMENT_STATUS_CONFIG[p.insuranceStatus]?.bg, color: PAYMENT_STATUS_CONFIG[p.insuranceStatus]?.text }}>
                      {p.insuranceStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <p className="text-xs italic px-1" style={{ color: 'var(--muted-foreground)' }}>
            * Le % de frais SHIFA est configurable par pays, type de prestataire et contrat. Aucune commission universelle hardcodée.
          </p>
        </div>
      )}

      {/* Tab: Sessions */}
      {tab === 'sessions' && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <div className="px-4 py-3 border-b" style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}>
            <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Historique sessions & flux financiers</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--muted)' }}>
                  {['ID', 'Patient', 'Prestataire', 'Date', 'Durée', 'Montant', 'Frais SHIFA', 'Revenu prestataire', 'Paiement', 'Assurance', 'Remboursement'].map(h => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-semibold whitespace-nowrap" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SESSIONS.map((s, i) => (
                  <tr key={s.id} style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                    <td className="px-3 py-3 font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.id}</td>
                    <td className="px-3 py-3 text-xs font-medium" style={{ color: 'var(--foreground)' }}>{s.patient}</td>
                    <td className="px-3 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.provider}</td>
                    <td className="px-3 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.date}</td>
                    <td className="px-3 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.duration}</td>
                    <td className="px-3 py-3"><SmartAmount amount={s.amount} currency={s.currency} size="xs" inline /></td>
                    <td className="px-3 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.shifaFee}</td>
                    <td className="px-3 py-3"><SmartAmount amount={s.providerRevenue} currency={s.currency} size="xs" inline /></td>
                    <td className="px-3 py-3">
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ background: PAYMENT_STATUS_CONFIG[s.payStatus]?.bg, color: PAYMENT_STATUS_CONFIG[s.payStatus]?.text }}>{s.payStatus}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ background: PAYMENT_STATUS_CONFIG[s.insuranceStatus]?.bg, color: PAYMENT_STATUS_CONFIG[s.insuranceStatus]?.text }}>{s.insuranceStatus}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: PAYMENT_STATUS_CONFIG[s.refundStatus]?.bg, color: PAYMENT_STATUS_CONFIG[s.refundStatus]?.text }}>{s.refundStatus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Models */}
      {tab === 'models' && (
        <div className="space-y-4">
          {REVENUE_MODELS.map(m => (
            <div key={m.model} className="rounded-xl border p-5" style={{ background: m.bg, borderColor: m.color + '30' }}>
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full mt-1 shrink-0" style={{ background: m.color }} />
                <div>
                  <p className="font-semibold text-sm" style={{ color: m.color }}>{m.model}</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--foreground)' }}>{m.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {m.actors.map(a => (
                      <span key={a} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.7)', color: 'var(--foreground)' }}>{a}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="rounded-xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Séparation financière — Téléconsultation</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { label: 'Paiement patient', desc: 'Montant total payé par le patient en devise locale', color: '#2563eb' },
                { label: 'Revenu prestataire', desc: 'Part du prestataire après déduction des frais SHIFA (si applicable)', color: '#16a34a' },
                { label: 'Frais SHIFA', desc: 'Commission SHIFA configurable — 0% si inclus dans le plan', color: '#7c3aed' },
                { label: 'Remboursement assurance', desc: 'Montant remboursé par l\'assureur au patient ou au prestataire', color: '#d97706' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'var(--muted)' }}>
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: item.color }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{item.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
