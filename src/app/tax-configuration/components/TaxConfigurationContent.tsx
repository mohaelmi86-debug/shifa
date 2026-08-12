'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface TaxRule {
  id: string;
  country: string;
  flag: string;
  customerType: string;
  serviceType: string;
  taxName: string;
  rate: string;
  effectiveDate: string;
  status: 'active' | 'inactive' | 'draft';
  notes: string;
}

const TAX_RULES: TaxRule[] = [
  { id: 'TAX-001', country: 'France', flag: '🇫🇷', customerType: 'Professionnel', serviceType: 'Abonnement logiciel', taxName: 'TVA', rate: 'Configurable', effectiveDate: '2025-01-01', status: 'active', notes: 'Taux à configurer selon réglementation locale' },
  { id: 'TAX-002', country: 'France', flag: '🇫🇷', customerType: 'Organisation', serviceType: 'Services médicaux', taxName: 'TVA exonérée', rate: '0%', effectiveDate: '2025-01-01', status: 'active', notes: 'Services de santé exonérés de TVA en France' },
  { id: 'TAX-003', country: 'Maroc', flag: '🇲🇦', customerType: 'Tous', serviceType: 'Services numériques', taxName: 'TVA Maroc', rate: 'Configurable', effectiveDate: '2025-01-01', status: 'draft', notes: 'Taux à confirmer avec expert fiscal local' },
  { id: 'TAX-004', country: 'Sénégal', flag: '🇸🇳', customerType: 'Organisation', serviceType: 'Abonnement plateforme', taxName: 'TVA Sénégal', rate: 'Configurable', effectiveDate: '2025-01-01', status: 'draft', notes: 'Taux à confirmer avec expert fiscal local' },
  { id: 'TAX-005', country: 'Comores', flag: '🇰🇲', customerType: 'Tous', serviceType: 'Tous services', taxName: 'Taxe locale', rate: 'Configurable', effectiveDate: '2025-01-01', status: 'draft', notes: 'Régime fiscal à définir avec autorités locales' },
  { id: 'TAX-006', country: "Côte d'Ivoire", flag: '🇨🇮', customerType: 'Professionnel', serviceType: 'Services numériques', taxName: 'TVA CI', rate: 'Configurable', effectiveDate: '2025-01-01', status: 'draft', notes: 'Taux à confirmer avec expert fiscal local' },
  { id: 'TAX-007', country: 'Tunisie', flag: '🇹🇳', customerType: 'Tous', serviceType: 'Services médicaux', taxName: 'TVA Tunisie', rate: 'Configurable', effectiveDate: '2025-01-01', status: 'draft', notes: 'Taux à confirmer avec expert fiscal local' },
  { id: 'TAX-008', country: 'International', flag: '🌍', customerType: 'B2G / Ministère', serviceType: 'Contrat gouvernemental', taxName: 'Exonération', rate: '0%', effectiveDate: '2025-01-01', status: 'active', notes: 'Contrats gouvernementaux généralement exonérés' },
];

const CUSTOMER_TYPES = ['Tous', 'Patient', 'Professionnel', 'Organisation', 'Assurance', 'B2G / Ministère', 'Université', 'ONG'];
const SERVICE_TYPES = ['Tous', 'Abonnement logiciel', 'Services médicaux', 'Services numériques', 'Abonnement plateforme', 'Contrat gouvernemental', 'Carte physique', 'Téléconsultation'];

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: '#dcfce7', text: '#16a34a', label: 'Actif' },
  inactive: { bg: '#fee2e2', text: '#dc2626', label: 'Inactif' },
  draft: { bg: '#fef9c3', text: '#ca8a04', label: 'Brouillon' },
};

const PRINCIPLES = [
  { title: 'Aucune TVA française hardcodée', desc: 'Les règles fiscales françaises ne sont pas appliquées globalement. Chaque pays a sa propre configuration.', icon: 'ShieldCheckIcon', color: '#16a34a' },
  { title: 'Configurable par pays', desc: 'Chaque règle fiscale est définie par pays, type de client et type de service — indépendamment.', icon: 'GlobeAltIcon', color: '#2563eb' },
  { title: 'Configurable par type de client', desc: 'Un patient, un professionnel, une organisation ou un ministère peuvent avoir des règles fiscales différentes.', icon: 'UsersIcon', color: '#7c3aed' },
  { title: 'Date d\'effet configurable', desc: 'Chaque règle a une date d\'entrée en vigueur — permettant la gestion des changements de taux.', icon: 'CalendarDaysIcon', color: '#d97706' },
  { title: 'Exonérations supportées', desc: 'Services médicaux, contrats gouvernementaux et ONG peuvent être exonérés selon la réglementation locale.', icon: 'DocumentCheckIcon', color: '#e11d48' },
];

export default function TaxConfigurationContent() {
  const [filterCountry, setFilterCountry] = useState('Tous');
  const [filterCustomer, setFilterCustomer] = useState('Tous');
  const [filterStatus, setFilterStatus] = useState('Tous');
  const [tab, setTab] = useState<'rules' | 'principles' | 'matrix'>('rules');

  const countries = ['Tous', ...Array.from(new Set(TAX_RULES.map(r => r.country)))];

  const filtered = TAX_RULES.filter(r =>
    (filterCountry === 'Tous' || r.country === filterCountry) &&
    (filterCustomer === 'Tous' || r.customerType === filterCustomer || r.customerType === 'Tous') &&
    (filterStatus === 'Tous' || r.status === filterStatus)
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Configuration Fiscale Globale</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Règles TVA/taxes par pays, type de client et type de service — architecture configurable, aucune TVA française hardcodée
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: '#fee2e2', color: '#dc2626' }}>
            <Icon name="ExclamationTriangleIcon" size={12} />
            Aucun taux hardcodé
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: '#dcfce7', color: '#16a34a' }}>
            <Icon name="Cog6ToothIcon" size={12} />
            Tout configurable
          </span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Règles définies', value: TAX_RULES.length.toString(), icon: 'DocumentTextIcon', color: '#2563eb' },
          { label: 'Pays couverts', value: '7+', icon: 'GlobeAltIcon', color: '#7c3aed' },
          { label: 'Règles actives', value: TAX_RULES.filter(r => r.status === 'active').length.toString(), icon: 'CheckCircleIcon', color: '#16a34a' },
          { label: 'En brouillon', value: TAX_RULES.filter(r => r.status === 'draft').length.toString(), icon: 'PencilIcon', color: '#d97706' },
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
        {([['rules', 'Règles fiscales'], ['principles', 'Principes'], ['matrix', 'Matrice pays × service']] as const).map(([t, label]) => (
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

      {/* Tab: Rules */}
      {tab === 'rules' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Pays :</span>
              <select
                value={filterCountry}
                onChange={e => setFilterCountry(e.target.value)}
                className="text-xs px-2 py-1 rounded-lg border"
                style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                {countries.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Client :</span>
              <select
                value={filterCustomer}
                onChange={e => setFilterCustomer(e.target.value)}
                className="text-xs px-2 py-1 rounded-lg border"
                style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                {CUSTOMER_TYPES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Statut :</span>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="text-xs px-2 py-1 rounded-lg border"
                style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                {['Tous', 'active', 'draft', 'inactive'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'var(--muted)' }}>
                    {['ID', 'Pays', 'Type client', 'Type service', 'Taxe', 'Taux', 'Date effet', 'Statut', 'Notes'].map(h => (
                      <th key={h} className="px-3 py-2 text-left text-xs font-semibold whitespace-nowrap" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((rule, i) => (
                    <tr key={rule.id} style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                      <td className="px-3 py-3 font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>{rule.id}</td>
                      <td className="px-3 py-3 text-xs font-medium" style={{ color: 'var(--foreground)' }}>{rule.flag} {rule.country}</td>
                      <td className="px-3 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{rule.customerType}</td>
                      <td className="px-3 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{rule.serviceType}</td>
                      <td className="px-3 py-3 text-xs font-medium" style={{ color: 'var(--foreground)' }}>{rule.taxName}</td>
                      <td className="px-3 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: rule.rate === '0%' ? '#dcfce7' : '#fef9c3', color: rule.rate === '0%' ? '#16a34a' : '#ca8a04' }}>
                          {rule.rate}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{rule.effectiveDate}</td>
                      <td className="px-3 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: STATUS_CONFIG[rule.status]?.bg, color: STATUS_CONFIG[rule.status]?.text }}>
                          {STATUS_CONFIG[rule.status]?.label}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-xs max-w-48" style={{ color: 'var(--muted-foreground)' }}>{rule.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Principles */}
      {tab === 'principles' && (
        <div className="space-y-3">
          {PRINCIPLES.map(p => (
            <div key={p.title} className="rounded-xl border p-5 flex items-start gap-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: p.color + '15' }}>
                <Icon name={p.icon as any} size={20} style={{ color: p.color }} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{p.title}</p>
                <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Matrix */}
      {tab === 'matrix' && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <div className="px-4 py-3 border-b" style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}>
            <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Matrice Pays × Type de service</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: 'var(--muted)' }}>
                  <th className="px-3 py-2 text-left font-semibold" style={{ color: 'var(--muted-foreground)' }}>Pays</th>
                  {SERVICE_TYPES.slice(1).map(s => (
                    <th key={s} className="px-2 py-2 text-center font-semibold whitespace-nowrap" style={{ color: 'var(--muted-foreground)' }}>{s}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {countries.slice(1).map((country, i) => (
                  <tr key={country} style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                    <td className="px-3 py-2 font-medium" style={{ color: 'var(--foreground)' }}>
                      {TAX_RULES.find(r => r.country === country)?.flag} {country}
                    </td>
                    {SERVICE_TYPES.slice(1).map(service => {
                      const rule = TAX_RULES.find(r => r.country === country && (r.serviceType === service || r.serviceType === 'Tous services'));
                      return (
                        <td key={service} className="px-2 py-2 text-center">
                          {rule ? (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: STATUS_CONFIG[rule.status]?.bg, color: STATUS_CONFIG[rule.status]?.text }}>
                              {rule.rate}
                            </span>
                          ) : (
                            <span className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--border)', background: 'var(--muted)' }}>
            <p className="text-xs italic" style={{ color: 'var(--muted-foreground)' }}>
              * Tous les taux sont configurables. Les cellules vides indiquent qu'aucune règle n'a encore été définie pour cette combinaison pays × service.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
