'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useSupabaseRealtime, useSupabaseCount } from '@/lib/hooks/useSupabaseRealtime';

// ─── Types ────────────────────────────────────────────────────────────────────
interface NgoPartnership {
  id: string;
  partner_name: string;
  partner_type: string;
  country_code: string;
  focus_areas: string[];
  contact_name: string;
  contact_email: string;
  status: 'active' | 'pending' | 'suspended' | 'ended';
  start_date: string;
  description: string;
  budget_allocated: number;
  beneficiaries_count: number;
}

interface HealthService {
  id: string;
  name: string;
  service_type: string;
  description: string;
  price: number;
  is_free: boolean;
  is_teleconsult: boolean;
  duration_minutes: number;
  available_days: string[];
  location: string;
  is_active: boolean;
}

interface MarketplaceProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  stock_quantity: number;
  is_certified: boolean;
  is_active: boolean;
}

interface FundingCampaign {
  id: string;
  title: string;
  description: string;
  goal_amount: number;
  raised_amount: number;
  status: 'open' | 'funded' | 'closed' | 'cancelled';
  start_date: string;
  end_date: string;
  beneficiary_type: string;
  region: string;
  donor_count: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR').format(n);

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  active: { label: 'Actif', bg: '#dcfce7', text: '#16a34a' },
  pending: { label: 'En attente', bg: '#fef9c3', text: '#ca8a04' },
  suspended: { label: 'Suspendu', bg: '#fee2e2', text: '#dc2626' },
  ended: { label: 'Terminé', bg: '#f1f5f9', text: '#64748b' },
  open: { label: 'Ouvert', bg: '#dbeafe', text: '#1d4ed8' },
  funded: { label: 'Financé', bg: '#dcfce7', text: '#16a34a' },
  closed: { label: 'Clôturé', bg: '#f1f5f9', text: '#64748b' },
  cancelled: { label: 'Annulé', bg: '#fee2e2', text: '#dc2626' },
};

const categoryLabels: Record<string, string> = {
  equipment: 'Équipement',
  medication: 'Médicament',
  supplies: 'Consommables',
  diagnostics: 'Diagnostic',
  digital: 'Numérique',
  services: 'Services',
  other: 'Autre',
};

const serviceTypeLabels: Record<string, string> = {
  consultation: 'Consultation',
  screening: 'Dépistage',
  vaccination: 'Vaccination',
  lab: 'Laboratoire',
  imaging: 'Imagerie',
  mental_health: 'Santé mentale',
  nutrition: 'Nutrition',
  rehabilitation: 'Rééducation',
  other: 'Autre',
};

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className}`} />;
}

// ─── KPI Strip ────────────────────────────────────────────────────────────────
function KPIStrip() {
  const { count: partnerCount, loading: l1 } = useSupabaseCount('ngo_partnerships', { status: 'active' });
  const { count: serviceCount, loading: l2 } = useSupabaseCount('health_services', { is_active: true });
  const { count: productCount, loading: l3 } = useSupabaseCount('marketplace_products', { is_active: true });
  const { count: campaignCount, loading: l4 } = useSupabaseCount('funding_campaigns', { status: 'open' });

  const kpis = [
    { label: 'Partenaires ONG', value: partnerCount, loading: l1, icon: 'HeartIcon', color: '#10b981' },
    { label: 'Services actifs', value: serviceCount, loading: l2, icon: 'ClipboardDocumentListIcon', color: '#3b82f6' },
    { label: 'Produits marketplace', value: productCount, loading: l3, icon: 'ShoppingBagIcon', color: '#8b5cf6' },
    { label: 'Campagnes ouvertes', value: campaignCount, loading: l4, icon: 'BanknotesIcon', color: '#f59e0b' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpis.map((k) => (
        <div key={k.label} className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${k.color}20` }}>
            <Icon name={k.icon as any} size={20} style={{ color: k.color }} />
          </div>
          <div>
            {k.loading ? (
              <Skeleton className="h-6 w-12 mb-1" />
            ) : (
              <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{k.value}</p>
            )}
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{k.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── NGO Partnerships Tab ─────────────────────────────────────────────────────
function NGOPartnershipsTab() {
  const { data: partners, loading, error } = useSupabaseRealtime<NgoPartnership>({
    table: 'ngo_partnerships',
    orderBy: { column: 'created_at', ascending: false },
  });
  const [search, setSearch] = useState('');

  const filtered = partners.filter(p =>
    p.partner_name.toLowerCase().includes(search.toLowerCase()) ||
    (p.focus_areas || []).some(f => f.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un partenaire..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
          />
        </div>
        <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{filtered.length} partenaire(s)</span>
      </div>

      {error && (
        <div className="p-3 rounded-lg mb-4 text-sm" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
          Erreur : {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12" style={{ color: 'var(--muted-foreground)' }}>
          <Icon name="HeartIcon" size={40} className="mx-auto mb-3 opacity-30" />
          <p>Aucun partenariat trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(p => {
            const s = statusConfig[p.status] || statusConfig.pending;
            return (
              <div key={p.id} className="card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{p.partner_name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{p.partner_type?.replace('_', ' ').toUpperCase()} · {p.country_code}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
                </div>
                {p.description && (
                  <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>{p.description}</p>
                )}
                <div className="flex flex-wrap gap-1 mb-3">
                  {(p.focus_areas || []).map(f => (
                    <span key={f} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                      {f.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <p style={{ color: 'var(--muted-foreground)' }}>Budget alloué</p>
                    <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{fmt(p.budget_allocated)} XOF</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--muted-foreground)' }}>Bénéficiaires</p>
                    <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{fmt(p.beneficiaries_count)}</p>
                  </div>
                </div>
                {p.contact_name && (
                  <div className="mt-2 pt-2 border-t flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
                    <Icon name="UserIcon" size={12} className="text-muted-foreground" />
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.contact_name}</span>
                    {p.contact_email && (
                      <>
                        <span style={{ color: 'var(--border)' }}>·</span>
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.contact_email}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Marketplace Tab ──────────────────────────────────────────────────────────
function MarketplaceTab() {
  const { data: products, loading, error } = useSupabaseRealtime<MarketplaceProduct>({
    table: 'marketplace_products',
    filter: { is_active: true },
    orderBy: { column: 'created_at', ascending: false },
  });
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'all' || p.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-48">
          <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className="px-3 py-1.5 text-xs rounded-lg border transition-colors"
              style={{
                borderColor: catFilter === c ? 'var(--shifa-blue)' : 'var(--border)',
                backgroundColor: catFilter === c ? 'var(--shifa-blue)' : 'transparent',
                color: catFilter === c ? '#fff' : 'var(--muted-foreground)',
              }}
            >
              {c === 'all' ? 'Tous' : categoryLabels[c] || c}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg mb-4 text-sm" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>Erreur : {error}</div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12" style={{ color: 'var(--muted-foreground)' }}>
          <Icon name="ShoppingBagIcon" size={40} className="mx-auto mb-3 opacity-30" />
          <p>Aucun produit trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="card p-4 flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                  {categoryLabels[p.category] || p.category}
                </span>
                {p.is_certified && (
                  <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
                    <Icon name="CheckBadgeIcon" size={10} />
                    Certifié
                  </span>
                )}
              </div>
              <p className="font-semibold text-sm mb-1" style={{ color: 'var(--foreground)' }}>{p.name}</p>
              <p className="text-xs mb-3 flex-1 line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>{p.description}</p>
              <div className="flex items-end justify-between mt-auto pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <p className="text-base font-bold" style={{ color: 'var(--shifa-blue)' }}>{fmt(p.price)} XOF</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>par {p.unit}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: p.stock_quantity > 0 ? '#16a34a' : '#dc2626' }}>
                    {p.stock_quantity > 0 ? `${fmt(p.stock_quantity)} en stock` : 'Rupture'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Services Tab ─────────────────────────────────────────────────────────────
function ServicesTab() {
  const { data: services, loading, error } = useSupabaseRealtime<HealthService>({
    table: 'health_services',
    filter: { is_active: true },
    orderBy: { column: 'created_at', ascending: false },
  });
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const types = ['all', ...Array.from(new Set(services.map(s => s.service_type)))];
  const filtered = services.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.location?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || s.service_type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-48">
          <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un service ou lieu..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className="px-3 py-1.5 text-xs rounded-lg border transition-colors"
              style={{
                borderColor: typeFilter === t ? 'var(--shifa-blue)' : 'var(--border)',
                backgroundColor: typeFilter === t ? 'var(--shifa-blue)' : 'transparent',
                color: typeFilter === t ? '#fff' : 'var(--muted-foreground)',
              }}
            >
              {t === 'all' ? 'Tous' : serviceTypeLabels[t] || t}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg mb-4 text-sm" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>Erreur : {error}</div>
      )}

      {loading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-24 w-full" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12" style={{ color: 'var(--muted-foreground)' }}>
          <Icon name="ClipboardDocumentListIcon" size={40} className="mx-auto mb-3 opacity-30" />
          <p>Aucun service trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(s => (
            <div key={s.id} className="card p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{s.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                    {serviceTypeLabels[s.service_type] || s.service_type}
                    {s.is_teleconsult && ' · 🎥 Téléconsultation'}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-2">
                  {s.is_free ? (
                    <span className="text-sm font-bold" style={{ color: '#16a34a' }}>Gratuit</span>
                  ) : (
                    <span className="text-sm font-bold" style={{ color: 'var(--shifa-blue)' }}>{fmt(s.price)} XOF</span>
                  )}
                </div>
              </div>
              {s.description && (
                <p className="text-xs mb-2 line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>{s.description}</p>
              )}
              <div className="flex items-center gap-4 text-xs pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                {s.location && (
                  <span className="flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                    <Icon name="MapPinIcon" size={12} />
                    {s.location}
                  </span>
                )}
                <span className="flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                  <Icon name="ClockIcon" size={12} />
                  {s.duration_minutes} min
                </span>
                {(s.available_days || []).length > 0 && (
                  <span className="flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                    <Icon name="CalendarDaysIcon" size={12} />
                    {(s.available_days || []).join(', ')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Funding Tab ──────────────────────────────────────────────────────────────
function FundingTab() {
  const { data: campaigns, loading, error } = useSupabaseRealtime<FundingCampaign>({
    table: 'funding_campaigns',
    orderBy: { column: 'created_at', ascending: false },
  });
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = campaigns.filter(c => statusFilter === 'all' || c.status === statusFilter);

  return (
    <div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {['all', 'open', 'funded', 'closed'].map(s => {
          const cfg = s === 'all' ? { label: 'Toutes', bg: '', text: '' } : statusConfig[s];
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-1.5 text-xs rounded-lg border transition-colors"
              style={{
                borderColor: statusFilter === s ? 'var(--shifa-blue)' : 'var(--border)',
                backgroundColor: statusFilter === s ? 'var(--shifa-blue)' : 'transparent',
                color: statusFilter === s ? '#fff' : 'var(--muted-foreground)',
              }}
            >
              {s === 'all' ? 'Toutes' : cfg?.label}
            </button>
          );
        })}
        <span className="text-sm ml-auto" style={{ color: 'var(--muted-foreground)' }}>{filtered.length} campagne(s)</span>
      </div>

      {error && (
        <div className="p-3 rounded-lg mb-4 text-sm" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>Erreur : {error}</div>
      )}

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-40 w-full" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12" style={{ color: 'var(--muted-foreground)' }}>
          <Icon name="BanknotesIcon" size={40} className="mx-auto mb-3 opacity-30" />
          <p>Aucune campagne trouvée</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(c => {
            const pct = c.goal_amount > 0 ? Math.min(100, Math.round((c.raised_amount / c.goal_amount) * 100)) : 0;
            const s = statusConfig[c.status] || statusConfig.open;
            return (
              <div key={c.id} className="card p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-sm flex-1 pr-2" style={{ color: 'var(--foreground)' }}>{c.title}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
                </div>
                {c.description && (
                  <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>{c.description}</p>
                )}
                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'var(--muted-foreground)' }}>Collecté : <strong style={{ color: 'var(--foreground)' }}>{fmt(c.raised_amount)} XOF</strong></span>
                    <span style={{ color: 'var(--muted-foreground)' }}>{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: pct >= 100 ? '#16a34a' : 'var(--shifa-blue)' }}
                    />
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Objectif : {fmt(c.goal_amount)} XOF</p>
                </div>
                <div className="flex items-center gap-4 text-xs pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                  {c.region && (
                    <span className="flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                      <Icon name="MapPinIcon" size={12} />
                      {c.region}
                    </span>
                  )}
                  {c.beneficiary_type && (
                    <span className="flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                      <Icon name="UsersIcon" size={12} />
                      {c.beneficiary_type}
                    </span>
                  )}
                  <span className="flex items-center gap-1 ml-auto" style={{ color: 'var(--muted-foreground)' }}>
                    <Icon name="HeartIcon" size={12} />
                    {c.donor_count} donateur(s)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const TABS = [
  { key: 'ngo', label: 'Partenariats ONG', icon: 'HeartIcon' },
  { key: 'marketplace', label: 'Marketplace', icon: 'ShoppingBagIcon' },
  { key: 'services', label: 'Services de santé', icon: 'ClipboardDocumentListIcon' },
  { key: 'funding', label: 'Financement collaboratif', icon: 'BanknotesIcon' },
];

export default function CommunityHubContent() {
  const [activeTab, setActiveTab] = useState('ngo');

  return (
    <div className="px-6 lg:px-8 xl:px-10 2xl:px-12 py-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
            <Icon name="GlobeAltIcon" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Hub Communautaire SHIFA</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Coordination inter-institutionnelle · ONG · Marketplace · Services · Financement
            </p>
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <KPIStrip />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
            style={{
              borderBottomColor: activeTab === t.key ? 'var(--shifa-blue)' : 'transparent',
              color: activeTab === t.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
            }}
          >
            <Icon name={t.icon as any} size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'ngo' && <NGOPartnershipsTab />}
        {activeTab === 'marketplace' && <MarketplaceTab />}
        {activeTab === 'services' && <ServicesTab />}
        {activeTab === 'funding' && <FundingTab />}
      </div>
    </div>
  );
}
