'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tab = 'overview' | 'products' | 'suppliers' | 'orders' | 'movements' | 'lots';

interface Product {
  id: string; name: string; category: string; sku: string;
  stock: number; minStock: number; unit: string; unitPrice: number;
  location: string; status: 'ok' | 'low' | 'critical' | 'expired';
}

interface Supplier {
  id: string; name: string; type: string; country: string;
  contact: string; rating: number; activeOrders: number; status: 'active' | 'inactive';
}

interface PurchaseOrder {
  id: string; supplier: string; date: string; items: number;
  total: number; status: 'draft' | 'sent' | 'confirmed' | 'received' | 'partial';
}

interface StockMovement {
  id: string; product: string; type: 'in' | 'out' | 'transfer' | 'adjustment';
  qty: number; unit: string; date: string; reference: string; operator: string;
}

interface Lot {
  id: string; product: string; lotNumber: string; qty: number; unit: string;
  expiryDate: string; supplier: string; status: 'valid' | 'expiring_soon' | 'expired' | 'quarantine';
}

const products: Product[] = [
  { id: 'p1', name: 'Paracétamol 500mg', category: 'Médicament', sku: 'MED-001', stock: 1200, minStock: 500, unit: 'cp', unitPrice: 50, location: 'Pharmacie A1', status: 'ok' },
  { id: 'p2', name: 'Amoxicilline 500mg', category: 'Médicament', sku: 'MED-002', stock: 80, minStock: 200, unit: 'gél', unitPrice: 120, location: 'Pharmacie A2', status: 'critical' },
  { id: 'p3', name: 'Seringues 5ml', category: 'Consommable', sku: 'CON-001', stock: 350, minStock: 300, unit: 'pcs', unitPrice: 25, location: 'Stock B1', status: 'low' },
  { id: 'p4', name: 'Gants latex M', category: 'Consommable', sku: 'CON-002', stock: 2400, minStock: 1000, unit: 'paires', unitPrice: 15, location: 'Stock B2', status: 'ok' },
  { id: 'p5', name: 'Réactif HbA1c', category: 'Réactif', sku: 'REA-001', stock: 12, minStock: 20, unit: 'kit', unitPrice: 45000, location: 'Labo C1', status: 'low' },
  { id: 'p6', name: 'Insuline Glargine', category: 'Médicament', sku: 'MED-003', stock: 0, minStock: 50, unit: 'stylo', unitPrice: 8500, location: 'Pharmacie A3', status: 'expired' },
  { id: 'p7', name: 'Compresses stériles 10x10', category: 'Consommable', sku: 'CON-003', stock: 800, minStock: 400, unit: 'pcs', unitPrice: 30, location: 'Stock B3', status: 'ok' },
];

const suppliers: Supplier[] = [
  { id: 's1', name: 'PharmaDis Sénégal', type: 'Grossiste pharmaceutique', country: 'Sénégal', contact: 'contact@pharmadis.sn', rating: 4.5, activeOrders: 2, status: 'active' },
  { id: 's2', name: 'MedSupply Africa', type: 'Fournisseur consommables', country: 'Côte d\'Ivoire', contact: 'orders@medsupply.ci', rating: 4.2, activeOrders: 1, status: 'active' },
  { id: 's3', name: 'BioReactifs International', type: 'Réactifs & Labo', country: 'France', contact: 'export@bioreactifs.fr', rating: 4.8, activeOrders: 0, status: 'active' },
  { id: 's4', name: 'EquipMed Dakar', type: 'Équipements médicaux', country: 'Sénégal', contact: 'info@equipmed.sn', rating: 3.9, activeOrders: 0, status: 'inactive' },
];

const purchaseOrders: PurchaseOrder[] = [
  { id: 'PO-2026-0041', supplier: 'PharmaDis Sénégal', date: '10 août 2026', items: 8, total: 1250000, status: 'confirmed' },
  { id: 'PO-2026-0040', supplier: 'MedSupply Africa', date: '08 août 2026', items: 5, total: 380000, status: 'received' },
  { id: 'PO-2026-0039', supplier: 'BioReactifs International', date: '05 août 2026', items: 3, total: 890000, status: 'sent' },
  { id: 'PO-2026-0038', supplier: 'PharmaDis Sénégal', date: '01 août 2026', items: 12, total: 2100000, status: 'received' },
  { id: 'PO-2026-0037', supplier: 'MedSupply Africa', date: '25 juil. 2026', items: 4, total: 145000, status: 'partial' },
];

const movements: StockMovement[] = [
  { id: 'm1', product: 'Paracétamol 500mg', type: 'in', qty: 500, unit: 'cp', date: '10 août 2026', reference: 'PO-2026-0040', operator: 'Magasinier Diallo' },
  { id: 'm2', product: 'Seringues 5ml', type: 'out', qty: 50, unit: 'pcs', date: '10 août 2026', reference: 'REQ-2026-0128', operator: 'Infirmière Seck' },
  { id: 'm3', product: 'Amoxicilline 500mg', type: 'out', qty: 120, unit: 'gél', date: '09 août 2026', reference: 'REQ-2026-0127', operator: 'Pharmacien Ba' },
  { id: 'm4', product: 'Gants latex M', type: 'in', qty: 1000, unit: 'paires', date: '08 août 2026', reference: 'PO-2026-0040', operator: 'Magasinier Diallo' },
  { id: 'm5', product: 'Réactif HbA1c', type: 'adjustment', qty: -2, unit: 'kit', date: '07 août 2026', reference: 'ADJ-2026-0012', operator: 'Biologiste Ndiaye' },
];

const lots: Lot[] = [
  { id: 'l1', product: 'Amoxicilline 500mg', lotNumber: 'LOT-AMX-2024-08', qty: 80, unit: 'gél', expiryDate: '31 déc. 2026', supplier: 'PharmaDis Sénégal', status: 'valid' },
  { id: 'l2', product: 'Insuline Glargine', lotNumber: 'LOT-INS-2024-03', qty: 0, unit: 'stylo', expiryDate: '01 août 2026', supplier: 'PharmaDis Sénégal', status: 'expired' },
  { id: 'l3', product: 'Réactif HbA1c', lotNumber: 'LOT-HBA-2025-11', qty: 12, unit: 'kit', expiryDate: '30 sept. 2026', supplier: 'BioReactifs International', status: 'expiring_soon' },
  { id: 'l4', product: 'Paracétamol 500mg', lotNumber: 'LOT-PAR-2025-06', qty: 1200, unit: 'cp', expiryDate: '30 juin 2027', supplier: 'PharmaDis Sénégal', status: 'valid' },
  { id: 'l5', product: 'Seringues 5ml', lotNumber: 'LOT-SER-2025-09', qty: 350, unit: 'pcs', expiryDate: '31 déc. 2027', supplier: 'MedSupply Africa', status: 'valid' },
];

const stockStatusConfig = {
  ok: { label: 'Normal', color: '#16a34a', bg: '#dcfce7', icon: 'CheckCircleIcon' },
  low: { label: 'Stock bas', color: '#d97706', bg: '#fef3c7', icon: 'ExclamationTriangleIcon' },
  critical: { label: 'Critique', color: '#dc2626', bg: '#fee2e2', icon: 'XCircleIcon' },
  expired: { label: 'Épuisé/Périmé', color: '#6b7280', bg: '#f3f4f6', icon: 'ArchiveBoxXMarkIcon' },
};

const orderStatusConfig = {
  draft: { label: 'Brouillon', color: '#6b7280', bg: '#f3f4f6' },
  sent: { label: 'Envoyée', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.1)' },
  confirmed: { label: 'Confirmée', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  received: { label: 'Reçue', color: '#16a34a', bg: '#dcfce7' },
  partial: { label: 'Partielle', color: '#d97706', bg: '#fef3c7' },
};

const lotStatusConfig = {
  valid: { label: 'Valide', color: '#16a34a', bg: '#dcfce7' },
  expiring_soon: { label: 'Expire bientôt', color: '#d97706', bg: '#fef3c7' },
  expired: { label: 'Périmé', color: '#dc2626', bg: '#fee2e2' },
  quarantine: { label: 'Quarantaine', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
};

const movTypeConfig = {
  in: { label: 'Entrée', color: '#16a34a', bg: '#dcfce7', icon: 'ArrowDownTrayIcon' },
  out: { label: 'Sortie', color: '#dc2626', bg: '#fee2e2', icon: 'ArrowUpTrayIcon' },
  transfer: { label: 'Transfert', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.1)', icon: 'ArrowsRightLeftIcon' },
  adjustment: { label: 'Ajustement', color: '#d97706', bg: '#fef3c7', icon: 'AdjustmentsHorizontalIcon' },
};

export default function SupplyChainContent() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [search, setSearch] = useState('');

  const alerts = products.filter(p => p.status !== 'ok');
  const expiringLots = lots.filter(l => l.status === 'expiring_soon' || l.status === 'expired');

  const tabs = [
    { key: 'overview', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
    { key: 'products', label: 'Produits & Stock', icon: 'ArchiveBoxIcon' },
    { key: 'suppliers', label: 'Fournisseurs', icon: 'TruckIcon' },
    { key: 'orders', label: 'Commandes', icon: 'ClipboardDocumentListIcon' },
    { key: 'movements', label: 'Mouvements', icon: 'ArrowsRightLeftIcon' },
    { key: 'lots', label: 'Lots & Péremption', icon: 'CalendarDaysIcon' },
  ];

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Chaîne d'Approvisionnement</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Inventaire, fournisseurs, commandes, mouvements de stock, lots et alertes de péremption</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--shifa-dark)' }}>
            <Icon name="ArrowDownTrayIcon" className="w-4 h-4" />
            Exporter
          </button>
          <button className="btn-primary flex items-center gap-2 text-sm px-4 py-2 rounded-lg">
            <Icon name="PlusIcon" className="w-4 h-4" />
            Nouvelle commande
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key as Tab)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all" style={{ background: activeTab === t.key ? 'var(--shifa-blue)' : 'var(--card)', color: activeTab === t.key ? '#fff' : 'var(--muted-foreground)', border: '1px solid var(--border)' }}>
            <Icon name={t.icon} className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Références en stock', value: products.length, icon: 'ArchiveBoxIcon', color: 'var(--shifa-blue)' },
              { label: 'Alertes stock', value: alerts.length, icon: 'ExclamationTriangleIcon', color: '#dc2626' },
              { label: 'Commandes actives', value: purchaseOrders.filter(o => ['sent', 'confirmed', 'partial'].includes(o.status)).length, icon: 'ClipboardDocumentListIcon', color: '#8b5cf6' },
              { label: 'Lots à surveiller', value: expiringLots.length, icon: 'CalendarDaysIcon', color: '#d97706' },
            ].map(kpi => (
              <div key={kpi.label} className="card-base p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}18` }}>
                  <Icon name={kpi.icon} className="w-5 h-5" style={{ color: kpi.color }} />
                </div>
                <div>
                  <div className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>{kpi.value}</div>
                  <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="card-base p-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--shifa-dark)' }}>
                <Icon name="BellAlertIcon" className="w-4 h-4" style={{ color: '#dc2626' }} />
                Alertes stock ({alerts.length})
              </h3>
              <div className="space-y-2">
                {alerts.map(p => {
                  const sc = stockStatusConfig[p.status];
                  return (
                    <div key={p.id} className="flex items-center justify-between p-2 rounded-lg" style={{ background: sc.bg }}>
                      <div>
                        <span className="text-sm font-medium" style={{ color: 'var(--shifa-dark)' }}>{p.name}</span>
                        <span className="text-xs ml-2" style={{ color: 'var(--muted-foreground)' }}>{p.stock} {p.unit} (min: {p.minStock})</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: 'white', color: sc.color }}>{sc.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Expiring lots */}
          {expiringLots.length > 0 && (
            <div className="card-base p-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--shifa-dark)' }}>
                <Icon name="CalendarDaysIcon" className="w-4 h-4" style={{ color: '#d97706' }} />
                Lots à surveiller ({expiringLots.length})
              </h3>
              <div className="space-y-2">
                {expiringLots.map(l => {
                  const ls = lotStatusConfig[l.status];
                  return (
                    <div key={l.id} className="flex items-center justify-between p-2 rounded-lg" style={{ background: ls.bg }}>
                      <div>
                        <span className="text-sm font-medium" style={{ color: 'var(--shifa-dark)' }}>{l.product}</span>
                        <span className="text-xs ml-2" style={{ color: 'var(--muted-foreground)' }}>Lot {l.lotNumber} — expire {l.expiryDate}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: 'white', color: ls.color }}>{ls.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Products */}
      {activeTab === 'products' && (
        <div>
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Icon name="MagnifyingGlassIcon" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un produit…" className="w-full pl-9 pr-3 py-2 rounded-lg text-sm" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--shifa-dark)' }} />
            </div>
          </div>
          <div className="space-y-2">
            {products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map(p => {
              const sc = stockStatusConfig[p.status];
              const pct = Math.min(100, (p.stock / (p.minStock * 3)) * 100);
              return (
                <div key={p.id} className="card-base p-4">
                  <div className="flex items-center gap-4 flex-wrap mb-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: sc.bg }}>
                      <Icon name={sc.icon} className="w-5 h-5" style={{ color: sc.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm" style={{ color: 'var(--shifa-dark)' }}>{p.name}</div>
                      <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.category} — SKU: {p.sku} — {p.location}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-bold text-sm" style={{ color: 'var(--shifa-dark)' }}>{p.stock.toLocaleString()} {p.unit}</div>
                        <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>min: {p.minStock}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                    </div>
                  </div>
                  <div className="w-full rounded-full h-1.5" style={{ background: 'var(--border)' }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: p.status === 'ok' ? '#16a34a' : p.status === 'low' ? '#d97706' : '#dc2626' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Suppliers */}
      {activeTab === 'suppliers' && (
        <div className="space-y-3">
          {suppliers.map(s => (
            <div key={s.id} className="card-base p-4 flex items-center gap-4 flex-wrap">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,102,255,0.08)' }}>
                <Icon name="TruckIcon" className="w-5 h-5" style={{ color: 'var(--shifa-blue)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm" style={{ color: 'var(--shifa-dark)' }}>{s.name}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{s.type} — {s.country} — {s.contact}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(star => (
                    <Icon key={star} name="StarIcon" className="w-3.5 h-3.5" style={{ color: star <= Math.round(s.rating) ? '#f59e0b' : 'var(--border)' }} />
                  ))}
                  <span className="text-xs ml-1" style={{ color: 'var(--muted-foreground)' }}>{s.rating}</span>
                </div>
                {s.activeOrders > 0 && <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' }}>{s.activeOrders} commande(s)</span>}
                <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: s.status === 'active' ? '#dcfce7' : '#f3f4f6', color: s.status === 'active' ? '#16a34a' : '#6b7280' }}>{s.status === 'active' ? 'Actif' : 'Inactif'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Purchase Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold" style={{ color: 'var(--shifa-dark)' }}>Bons de commande</h2>
            <button className="btn-primary flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg">
              <Icon name="PlusIcon" className="w-4 h-4" />
              Nouvelle commande
            </button>
          </div>
          {purchaseOrders.map(po => {
            const os = orderStatusConfig[po.status];
            return (
              <div key={po.id} className="card-base p-4 flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm flex items-center gap-2" style={{ color: 'var(--shifa-dark)' }}>
                    <span className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--background)', border: '1px solid var(--border)' }}>{po.id}</span>
                    {po.supplier}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{po.date} — {po.items} article(s)</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sm" style={{ color: 'var(--shifa-dark)' }}>{po.total.toLocaleString()} FCFA</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: os.bg, color: os.color }}>{os.label}</span>
                  <button className="p-1.5 rounded-lg" style={{ background: 'var(--background)', border: '1px solid var(--border)' }}>
                    <Icon name="EyeIcon" className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Movements */}
      {activeTab === 'movements' && (
        <div className="space-y-3">
          <h2 className="font-semibold mb-2" style={{ color: 'var(--shifa-dark)' }}>Mouvements de stock</h2>
          {movements.map(m => {
            const mt = movTypeConfig[m.type];
            return (
              <div key={m.id} className="card-base p-4 flex items-center gap-4 flex-wrap">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: mt.bg }}>
                  <Icon name={mt.icon} className="w-5 h-5" style={{ color: mt.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm" style={{ color: 'var(--shifa-dark)' }}>{m.product}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{m.date} — Réf: {m.reference} — {m.operator}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm" style={{ color: m.type === 'in' ? '#16a34a' : m.type === 'out' ? '#dc2626' : 'var(--shifa-dark)' }}>
                    {m.type === 'in' ? '+' : m.type === 'out' ? '-' : ''}{m.qty} {m.unit}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: mt.bg, color: mt.color }}>{mt.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lots */}
      {activeTab === 'lots' && (
        <div className="space-y-3">
          <h2 className="font-semibold mb-2" style={{ color: 'var(--shifa-dark)' }}>Lots & Traçabilité</h2>
          {lots.map(l => {
            const ls = lotStatusConfig[l.status];
            return (
              <div key={l.id} className="card-base p-4 flex items-center gap-4 flex-wrap">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: ls.bg }}>
                  <Icon name="CalendarDaysIcon" className="w-5 h-5" style={{ color: ls.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm" style={{ color: 'var(--shifa-dark)' }}>{l.product}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Lot {l.lotNumber} — {l.supplier} — {l.qty} {l.unit}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-xs font-medium" style={{ color: 'var(--shifa-dark)' }}>Expire : {l.expiryDate}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: ls.bg, color: ls.color }}>{ls.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
