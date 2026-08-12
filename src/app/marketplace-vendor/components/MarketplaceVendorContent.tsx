'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tab = 'dashboard' | 'products' | 'orders' | 'commissions';

const tabs = [
  { id: 'dashboard' as Tab, label: 'Tableau de bord', icon: 'Squares2X2Icon' },
  { id: 'products' as Tab, label: 'Produits', icon: 'ArchiveBoxIcon' },
  { id: 'orders' as Tab, label: 'Commandes', icon: 'ShoppingCartIcon' },
  { id: 'commissions' as Tab, label: 'Commissions', icon: 'BanknotesIcon' },
];

const kpis = [
  { label: 'Ventes ce mois', value: '2.8M FCFA', delta: '+14%', icon: 'BanknotesIcon', color: '#16a34a' },
  { label: 'Commandes actives', value: '47', delta: '+6', icon: 'ShoppingCartIcon', color: 'var(--shifa-blue)' },
  { label: 'Produits listés', value: '124', delta: '+8', icon: 'ArchiveBoxIcon', color: '#7c3aed' },
  { label: 'Commission SHIFA', value: '280K FCFA', delta: '10%', icon: 'ChartBarIcon', color: '#f59e0b' },
];

const products = [
  { id: 'PRD-001', name: 'Glucomètre Accu-Chek Active', category: 'Dispositifs médicaux', price: 45000, stock: 28, status: 'active', sales: 42 },
  { id: 'PRD-002', name: 'Tensiomètre OMRON M3', category: 'Dispositifs médicaux', price: 38000, stock: 15, status: 'active', sales: 31 },
  { id: 'PRD-003', name: 'Masques chirurgicaux (boîte 50)', category: 'Consommables', price: 8500, stock: 0, status: 'out_of_stock', sales: 156 },
  { id: 'PRD-004', name: 'Gants latex (boîte 100)', category: 'Consommables', price: 12000, stock: 45, status: 'active', sales: 89 },
  { id: 'PRD-005', name: 'Oxymètre de pouls', category: 'Dispositifs médicaux', price: 22000, stock: 8, status: 'low_stock', sales: 27 },
  { id: 'PRD-006', name: 'Stéthoscope Littmann Classic', category: 'Équipements', price: 95000, stock: 5, status: 'active', sales: 12 },
];

const orders = [
  { id: 'CMD-2025-0891', buyer: 'CHU Saint-Louis', items: 3, total: 145000, status: 'processing', date: '11/08/2025' },
  { id: 'CMD-2025-0890', buyer: 'Clinique du Plateau', items: 1, total: 38000, status: 'shipped', date: '10/08/2025' },
  { id: 'CMD-2025-0889', buyer: 'Cabinet Dr. Sy', items: 2, total: 57000, status: 'delivered', date: '09/08/2025' },
  { id: 'CMD-2025-0888', buyer: 'Pharmacie Centrale', items: 5, total: 210000, status: 'delivered', date: '08/08/2025' },
  { id: 'CMD-2025-0887', buyer: 'Hôpital Régional Thiès', items: 8, total: 380000, status: 'pending', date: '07/08/2025' },
];

const commissions = [
  { id: 'COM-2025-08-01', period: 'Août 2025 (1–10)', sales: 1250000, rate: 10, amount: 125000, status: 'pending' },
  { id: 'COM-2025-07', period: 'Juillet 2025', sales: 2800000, rate: 10, amount: 280000, status: 'paid', paidDate: '05/08/2025' },
  { id: 'COM-2025-06', period: 'Juin 2025', sales: 2400000, rate: 10, amount: 240000, status: 'paid', paidDate: '05/07/2025' },
  { id: 'COM-2025-05', period: 'Mai 2025', sales: 2100000, rate: 10, amount: 210000, status: 'paid', paidDate: '05/06/2025' },
];

const orderStatusConfig: Record<string, { label: string; bg: string; color: string }> = {
  pending: { label: 'En attente', bg: '#fef3c7', color: '#d97706' },
  processing: { label: 'En traitement', bg: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' },
  shipped: { label: 'Expédié', bg: '#e0f2fe', color: '#0284c7' },
  delivered: { label: 'Livré', bg: '#dcfce7', color: '#16a34a' },
  cancelled: { label: 'Annulé', bg: '#fee2e2', color: '#dc2626' },
};

const productStatusConfig: Record<string, { label: string; bg: string; color: string }> = {
  active: { label: 'Actif', bg: '#dcfce7', color: '#16a34a' },
  out_of_stock: { label: 'Rupture', bg: '#fee2e2', color: '#dc2626' },
  low_stock: { label: 'Stock faible', bg: '#fef3c7', color: '#d97706' },
  inactive: { label: 'Inactif', bg: '#f1f5f9', color: '#64748b' },
};

export default function MarketplaceVendorContent() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [showAddProduct, setShowAddProduct] = useState(false);

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Espace Vendeur / Fournisseur</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>MedSupply Sénégal · Marketplace SHIFA Health</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
            <Icon name="ShieldCheckIcon" size={14} />Vendeur vérifié
          </span>
          <button onClick={() => setShowAddProduct(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
            <Icon name="PlusIcon" size={16} />Ajouter produit
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${k.color}18` }}>
                <Icon name={k.icon as any} size={18} style={{ color: k.color }} />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>{k.delta}</span>
            </div>
            <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{k.value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl border overflow-x-auto" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === t.id ? 'shadow-sm' : ''}`}
            style={activeTab === t.id ? { backgroundColor: 'var(--card)', color: 'var(--shifa-blue)' } : { color: 'var(--muted-foreground)' }}>
            <Icon name={t.icon as any} size={15} />{t.label}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Commandes récentes</h3>
            <div className="space-y-3">
              {orders.slice(0, 3).map(o => {
                const s = orderStatusConfig[o.status];
                return (
                  <div key={o.id} className="flex items-center justify-between gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--background)' }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{o.buyer}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{o.id} · {o.items} article(s)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{o.total.toLocaleString()} FCFA</p>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Alertes stock</h3>
            <div className="space-y-3">
              {products.filter(p => p.status !== 'active').map(p => {
                const s = productStatusConfig[p.status];
                return (
                  <div key={p.id} className="flex items-center justify-between gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--background)' }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Stock: {p.stock} unités</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Products */}
      {activeTab === 'products' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--muted)' }}>
                  {['Produit', 'Catégorie', 'Prix', 'Stock', 'Ventes', 'Statut', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {products.map(p => {
                  const s = productStatusConfig[p.status];
                  return (
                    <tr key={p.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.id}</p>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.category}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: 'var(--foreground)' }}>{p.price.toLocaleString()} FCFA</td>
                      <td className="px-4 py-3" style={{ color: p.stock === 0 ? '#dc2626' : p.stock < 10 ? '#d97706' : 'var(--foreground)' }}>{p.stock}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{p.sales}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                          <Icon name="PencilSquareIcon" size={15} className="text-muted-foreground" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders */}
      {activeTab === 'orders' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--muted)' }}>
                  {['Commande', 'Acheteur', 'Articles', 'Total', 'Date', 'Statut'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {orders.map(o => {
                  const s = orderStatusConfig[o.status];
                  return (
                    <tr key={o.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>{o.id}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: 'var(--foreground)' }}>{o.buyer}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{o.items}</td>
                      <td className="px-4 py-3 font-semibold" style={{ color: 'var(--foreground)' }}>{o.total.toLocaleString()} FCFA</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{o.date}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Commissions */}
      {activeTab === 'commissions' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border" style={{ backgroundColor: 'rgba(0,102,255,0.04)', borderColor: 'rgba(0,102,255,0.15)' }}>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              <Icon name="InformationCircleIcon" size={14} className="inline mr-1.5" style={{ color: 'var(--shifa-blue)' }} />
              La commission SHIFA est de <strong style={{ color: 'var(--foreground)' }}>10%</strong> sur chaque vente réalisée via la Marketplace. Les paiements sont effectués le 5 de chaque mois.
            </p>
          </div>
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--muted)' }}>
                    {['Période', 'Ventes', 'Taux', 'Commission', 'Statut'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {commissions.map(c => (
                    <tr key={c.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 font-medium" style={{ color: 'var(--foreground)' }}>{c.period}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--foreground)' }}>{c.sales.toLocaleString()} FCFA</td>
                      <td className="px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{c.rate}%</td>
                      <td className="px-4 py-3 font-semibold" style={{ color: 'var(--foreground)' }}>{c.amount.toLocaleString()} FCFA</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={c.status === 'paid' ? { backgroundColor: '#dcfce7', color: '#16a34a' } : { backgroundColor: '#fef3c7', color: '#d97706' }}>
                          {c.status === 'paid' ? `Payé le ${c.paidDate}` : 'En attente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add product modal */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-lg rounded-2xl border p-6 space-y-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Ajouter un produit</h3>
              <button onClick={() => setShowAddProduct(false)} className="p-1 rounded-lg hover:bg-muted">
                <Icon name="XMarkIcon" size={18} className="text-muted-foreground" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Nom du produit', placeholder: 'Ex: Glucomètre...', col: 2 },
                { label: 'Catégorie', placeholder: 'Dispositifs médicaux', col: 1 },
                { label: 'Prix (FCFA)', placeholder: '0', col: 1 },
                { label: 'Stock initial', placeholder: '0', col: 1 },
                { label: 'Référence fournisseur', placeholder: 'REF-XXX', col: 1 },
              ].map(f => (
                <div key={f.label} className={f.col === 2 ? 'col-span-2' : ''}>
                  <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--muted-foreground)' }}>{f.label}</label>
                  <input placeholder={f.placeholder} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowAddProduct(false)} className="px-4 py-2 rounded-xl text-sm border" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>Annuler</button>
              <button onClick={() => setShowAddProduct(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>Ajouter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
