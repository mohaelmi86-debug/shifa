'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

type Tab = 'overview' | 'products' | 'movements' | 'lots' | 'suppliers' | 'orders';

interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  minStock: number;
  unit: string;
  unitPrice: number;
  location: string;
  status: 'ok' | 'low' | 'critical' | 'expired';
}

interface StockMovement {
  id: string;
  product: string;
  type: 'in' | 'out' | 'transfer' | 'adjustment';
  qty: number;
  unit: string;
  date: string;
  reference: string;
  operator: string;
  reason: string;
}

interface Lot {
  id: string;
  product: string;
  lotNumber: string;
  qty: number;
  unit: string;
  manufactureDate: string;
  expiryDate: string;
  supplier: string;
  status: 'valid' | 'expiring_soon' | 'expired' | 'quarantine';
}

interface Supplier {
  id: string;
  name: string;
  type: string;
  country: string;
  contact: string;
  email: string;
  rating: number;
  activeOrders: number;
  totalOrders: number;
  status: 'active' | 'inactive' | 'suspended';
}

interface PurchaseOrder {
  id: string;
  supplier: string;
  items: number;
  totalAmount: number;
  currency: string;
  status: 'draft' | 'sent' | 'confirmed' | 'partial' | 'received' | 'cancelled';
  orderDate: string;
  expectedDate: string;
  priority: 'normal' | 'urgent' | 'critical';
}

const products: Product[] = [
  { id: 'P001', name: 'Paracétamol 500mg', category: 'Médicament', sku: 'MED-PAR-500', stock: 2400, minStock: 500, unit: 'comprimés', unitPrice: 0.05, location: 'Armoire A-3', status: 'ok' },
  { id: 'P002', name: 'Seringues 5ml', category: 'Consommable', sku: 'CON-SER-5ML', stock: 180, minStock: 200, unit: 'unités', unitPrice: 0.30, location: 'Étagère B-1', status: 'low' },
  { id: 'P003', name: 'Gants latex M', category: 'EPI', sku: 'EPI-GAN-M', stock: 45, minStock: 100, unit: 'boîtes', unitPrice: 4.50, location: 'Réserve C-2', status: 'critical' },
  { id: 'P004', name: 'Amoxicilline 250mg', category: 'Médicament', sku: 'MED-AMO-250', stock: 800, minStock: 300, unit: 'gélules', unitPrice: 0.12, location: 'Armoire A-1', status: 'ok' },
  { id: 'P005', name: 'Sérum physiologique', category: 'Perfusion', sku: 'PER-SER-500', stock: 60, minStock: 80, unit: 'poches 500ml', unitPrice: 1.80, location: 'Frigo D-1', status: 'low' },
  { id: 'P006', name: 'Bandelettes glycémie', category: 'Diagnostic', sku: 'DIA-BAN-GLY', stock: 12, minStock: 50, unit: 'boîtes 50', unitPrice: 8.00, location: 'Labo E-2', status: 'critical' },
  { id: 'P007', name: 'Masques chirurgicaux', category: 'EPI', sku: 'EPI-MAS-CHI', stock: 1200, minStock: 500, unit: 'unités', unitPrice: 0.15, location: 'Réserve C-1', status: 'ok' },
  { id: 'P008', name: 'Insuline Rapide', category: 'Médicament', sku: 'MED-INS-RAP', stock: 24, minStock: 30, unit: 'flacons', unitPrice: 12.50, location: 'Frigo D-2', status: 'low' },
];

const movements: StockMovement[] = [
  { id: 'MV001', product: 'Paracétamol 500mg', type: 'in', qty: 1000, unit: 'comprimés', date: '2026-08-10', reference: 'BC-2026-0892', operator: 'Fatou Diop', reason: 'Réception commande' },
  { id: 'MV002', product: 'Seringues 5ml', type: 'out', qty: 50, unit: 'unités', date: '2026-08-10', reference: 'CONS-2026-1204', operator: 'Ibrahima Sow', reason: 'Consommation service' },
  { id: 'MV003', product: 'Gants latex M', type: 'out', qty: 10, unit: 'boîtes', date: '2026-08-09', reference: 'CONS-2026-1198', operator: 'Mariama Ba', reason: 'Urgences' },
  { id: 'MV004', product: 'Amoxicilline 250mg', type: 'transfer', qty: 200, unit: 'gélules', date: '2026-08-09', reference: 'TRF-2026-0045', operator: 'Oumar Ndiaye', reason: 'Transfert pharmacie' },
  { id: 'MV005', product: 'Sérum physiologique', type: 'in', qty: 40, unit: 'poches', date: '2026-08-08', reference: 'BC-2026-0881', operator: 'Fatou Diop', reason: 'Réception commande' },
  { id: 'MV006', product: 'Bandelettes glycémie', type: 'adjustment', qty: -3, unit: 'boîtes', date: '2026-08-08', reference: 'ADJ-2026-0012', operator: 'Admin', reason: 'Correction inventaire' },
];

const lots: Lot[] = [
  { id: 'L001', product: 'Paracétamol 500mg', lotNumber: 'LOT-2024-PAR-001', qty: 2400, unit: 'comprimés', manufactureDate: '2024-03-01', expiryDate: '2027-03-01', supplier: 'PharmaSénégal', status: 'valid' },
  { id: 'L002', product: 'Amoxicilline 250mg', lotNumber: 'LOT-2024-AMO-003', qty: 800, unit: 'gélules', manufactureDate: '2024-01-15', expiryDate: '2026-09-15', supplier: 'MediSupply Dakar', status: 'expiring_soon' },
  { id: 'L003', product: 'Insuline Rapide', lotNumber: 'LOT-2025-INS-007', qty: 24, unit: 'flacons', manufactureDate: '2025-06-01', expiryDate: '2026-12-01', supplier: 'ColdChain Africa', status: 'valid' },
  { id: 'L004', product: 'Sérum physiologique', lotNumber: 'LOT-2023-SER-012', qty: 10, unit: 'poches', manufactureDate: '2023-11-01', expiryDate: '2026-05-01', supplier: 'PharmaSénégal', status: 'expired' },
  { id: 'L005', product: 'Bandelettes glycémie', lotNumber: 'LOT-2025-BAN-002', qty: 12, unit: 'boîtes', manufactureDate: '2025-02-01', expiryDate: '2026-08-31', supplier: 'DiagLab West', status: 'expiring_soon' },
  { id: 'L006', product: 'Gants latex M', lotNumber: 'LOT-2025-GAN-009', qty: 45, unit: 'boîtes', manufactureDate: '2025-04-01', expiryDate: '2028-04-01', supplier: 'SafeProtect SN', status: 'quarantine' },
];

const suppliers: Supplier[] = [
  { id: 'S001', name: 'PharmaSénégal', type: 'Grossiste pharmaceutique', country: 'Sénégal', contact: 'Moussa Diallo', email: 'contact@pharmasn.sn', rating: 4.8, activeOrders: 3, totalOrders: 47, status: 'active' },
  { id: 'S002', name: 'MediSupply Dakar', type: 'Distributeur médical', country: 'Sénégal', contact: 'Aïssatou Ndiaye', email: 'orders@medisupply.sn', rating: 4.2, activeOrders: 1, totalOrders: 28, status: 'active' },
  { id: 'S003', name: 'ColdChain Africa', type: 'Chaîne du froid', country: 'Côte d\'Ivoire', contact: 'Kofi Mensah', email: 'supply@coldchain.ci', rating: 4.6, activeOrders: 2, totalOrders: 15, status: 'active' },
  { id: 'S004', name: 'DiagLab West', type: 'Équipements diagnostic', country: 'Ghana', contact: 'Ama Owusu', email: 'sales@diaglab.gh', rating: 3.9, activeOrders: 0, totalOrders: 9, status: 'inactive' },
  { id: 'S005', name: 'SafeProtect SN', type: 'EPI & Consommables', country: 'Sénégal', contact: 'Cheikh Fall', email: 'info@safeprotect.sn', rating: 2.8, activeOrders: 0, totalOrders: 6, status: 'suspended' },
];

const orders: PurchaseOrder[] = [
  { id: 'BC-2026-0895', supplier: 'PharmaSénégal', items: 8, totalAmount: 1240000, currency: 'XOF', status: 'confirmed', orderDate: '2026-08-08', expectedDate: '2026-08-15', priority: 'normal' },
  { id: 'BC-2026-0896', supplier: 'MediSupply Dakar', items: 3, totalAmount: 380000, currency: 'XOF', status: 'sent', orderDate: '2026-08-09', expectedDate: '2026-08-14', priority: 'urgent' },
  { id: 'BC-2026-0897', supplier: 'ColdChain Africa', items: 2, totalAmount: 920000, currency: 'XOF', status: 'draft', orderDate: '2026-08-10', expectedDate: '2026-08-20', priority: 'normal' },
  { id: 'BC-2026-0893', supplier: 'PharmaSénégal', items: 12, totalAmount: 2100000, currency: 'XOF', status: 'received', orderDate: '2026-07-28', expectedDate: '2026-08-05', priority: 'normal' },
  { id: 'BC-2026-0891', supplier: 'DiagLab West', items: 1, totalAmount: 145000, currency: 'XOF', status: 'cancelled', orderDate: '2026-07-20', expectedDate: '2026-07-30', priority: 'critical' },
  { id: 'BC-2026-0894', supplier: 'ColdChain Africa', items: 4, totalAmount: 680000, currency: 'XOF', status: 'partial', orderDate: '2026-08-01', expectedDate: '2026-08-10', priority: 'urgent' },
];

const stockTrendData = [
  { month: 'Mar', valeur: 8200000 }, { month: 'Avr', valeur: 9100000 }, { month: 'Mai', valeur: 8700000 },
  { month: 'Jun', valeur: 9800000 }, { month: 'Jul', valeur: 10200000 }, { month: 'Aoû', valeur: 9600000 },
];

const categoryData = [
  { cat: 'Médicaments', qty: 4200 }, { cat: 'Consommables', qty: 1380 }, { cat: 'EPI', qty: 1245 },
  { cat: 'Diagnostic', qty: 312 }, { cat: 'Perfusion', qty: 60 },
];

const statusConfig = {
  ok: { label: 'Normal', bg: '#dcfce7', text: '#16a34a' },
  low: { label: 'Bas', bg: '#fef9c3', text: '#ca8a04' },
  critical: { label: 'Critique', bg: '#fee2e2', text: '#dc2626' },
  expired: { label: 'Expiré', bg: '#f1f5f9', text: '#64748b' },
};

const movTypeConfig = {
  in: { label: 'Entrée', bg: '#dcfce7', text: '#16a34a', icon: 'ArrowDownTrayIcon' },
  out: { label: 'Sortie', bg: '#fee2e2', text: '#dc2626', icon: 'ArrowUpTrayIcon' },
  transfer: { label: 'Transfert', bg: '#dbeafe', text: '#1d4ed8', icon: 'ArrowsRightLeftIcon' },
  adjustment: { label: 'Ajustement', bg: '#f3e8ff', text: '#7c3aed', icon: 'AdjustmentsHorizontalIcon' },
};

const lotStatusConfig = {
  valid: { label: 'Valide', bg: '#dcfce7', text: '#16a34a' },
  expiring_soon: { label: 'Expire bientôt', bg: '#fef9c3', text: '#ca8a04' },
  expired: { label: 'Expiré', bg: '#fee2e2', text: '#dc2626' },
  quarantine: { label: 'Quarantaine', bg: '#f3e8ff', text: '#7c3aed' },
};

const orderStatusConfig = {
  draft: { label: 'Brouillon', bg: '#f1f5f9', text: '#64748b' },
  sent: { label: 'Envoyée', bg: '#dbeafe', text: '#1d4ed8' },
  confirmed: { label: 'Confirmée', bg: '#dcfce7', text: '#16a34a' },
  partial: { label: 'Partielle', bg: '#fef9c3', text: '#ca8a04' },
  received: { label: 'Reçue', bg: '#d1fae5', text: '#059669' },
  cancelled: { label: 'Annulée', bg: '#fee2e2', text: '#dc2626' },
};

const supplierStatusConfig = {
  active: { label: 'Actif', bg: '#dcfce7', text: '#16a34a' },
  inactive: { label: 'Inactif', bg: '#f1f5f9', text: '#64748b' },
  suspended: { label: 'Suspendu', bg: '#fee2e2', text: '#dc2626' },
};

export default function InventoryProcurementContent() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [search, setSearch] = useState('');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
    { id: 'products', label: 'Produits & Stock', icon: 'ArchiveBoxIcon' },
    { id: 'movements', label: 'Mouvements', icon: 'ArrowsRightLeftIcon' },
    { id: 'lots', label: 'Lots & Péremption', icon: 'CalendarDaysIcon' },
    { id: 'suppliers', label: 'Fournisseurs', icon: 'BuildingStorefrontIcon' },
    { id: 'orders', label: 'Bons de commande', icon: 'ClipboardDocumentListIcon' },
  ];

  const criticalCount = products.filter(p => p.status === 'critical').length;
  const lowCount = products.filter(p => p.status === 'low').length;
  const expiringSoon = lots.filter(l => l.status === 'expiring_soon').length;
  const pendingOrders = orders.filter(o => ['sent', 'confirmed', 'partial'].includes(o.status)).length;

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>
              Inventaire & Approvisionnement
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
              Gestion des stocks, lots, fournisseurs et commandes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors hover:bg-muted" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
              <Icon name="ArrowDownTrayIcon" size={16} />
              Exporter
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors" style={{ backgroundColor: 'var(--shifa-blue)' }}>
              <Icon name="PlusIcon" size={16} />
              Nouvelle commande
            </button>
          </div>
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'text-white' : 'hover:bg-muted'}`}
              style={activeTab === tab.id ? { backgroundColor: 'var(--shifa-blue)', color: '#fff' } : { color: 'var(--muted-foreground)' }}
            >
              <Icon name={tab.icon as any} size={15} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Références actives', value: '247', sub: '+12 ce mois', icon: 'ArchiveBoxIcon', color: 'var(--shifa-blue)' },
                { label: 'Alertes stock bas', value: `${criticalCount + lowCount}`, sub: `${criticalCount} critiques`, icon: 'ExclamationTriangleIcon', color: '#f59e0b' },
                { label: 'Lots expirant bientôt', value: `${expiringSoon}`, sub: 'Dans 30 jours', icon: 'CalendarDaysIcon', color: '#ef4444' },
                { label: 'Commandes en cours', value: `${pendingOrders}`, sub: 'En attente réception', icon: 'ClipboardDocumentListIcon', color: '#10b981' },
              ].map((kpi, i) => (
                <div key={i} className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: kpi.color + '20' }}>
                      <Icon name={kpi.icon as any} size={16} style={{ color: kpi.color }} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>{kpi.value}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{kpi.sub}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Valeur du stock (XOF)</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={stockTrendData}>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(v: number) => [`${v.toLocaleString()} XOF`, 'Valeur']} />
                    <Line type="monotone" dataKey="valeur" stroke="var(--shifa-blue)" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Stock par catégorie</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={categoryData} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="cat" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} width={90} />
                    <Tooltip />
                    <Bar dataKey="qty" fill="var(--shifa-cyan)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Critical alerts */}
            <div className="rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Alertes prioritaires</h3>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {products.filter(p => p.status !== 'ok').map(p => (
                  <div key={p.id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: p.status === 'critical' ? '#fee2e2' : '#fef9c3' }}>
                        <Icon name="ExclamationTriangleIcon" size={15} style={{ color: p.status === 'critical' ? '#dc2626' : '#ca8a04' }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.stock} {p.unit} — min. {p.minStock}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: statusConfig[p.status].bg, color: statusConfig[p.status].text }}>
                        {statusConfig[p.status].label}
                      </span>
                      <button className="text-xs px-3 py-1.5 rounded-lg font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>Commander</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher produit, SKU, catégorie..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg border text-sm"
                  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
              </div>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium hover:bg-muted" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                <Icon name="FunnelIcon" size={15} />
                Filtrer
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                <Icon name="PlusIcon" size={15} />
                Ajouter produit
              </button>
            </div>
            <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
                    {['SKU', 'Produit', 'Catégorie', 'Stock', 'Min.', 'Emplacement', 'Prix unit.', 'Statut', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.sku}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: 'var(--foreground)' }}>{p.name}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.category}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{p.stock.toLocaleString()}</span>
                          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.unit}</span>
                        </div>
                        <div className="w-20 h-1.5 rounded-full mt-1" style={{ backgroundColor: 'var(--muted)' }}>
                          <div className="h-full rounded-full" style={{ width: `${Math.min(100, (p.stock / (p.minStock * 3)) * 100)}%`, backgroundColor: p.status === 'critical' ? '#ef4444' : p.status === 'low' ? '#f59e0b' : '#22c55e' }} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.minStock} {p.unit}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.location}</td>
                      <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--foreground)' }}>{p.unitPrice.toFixed(2)} XOF</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: statusConfig[p.status].bg, color: statusConfig[p.status].text }}>
                          {statusConfig[p.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                          <Icon name="EllipsisVerticalIcon" size={15} className="text-muted-foreground" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MOVEMENTS */}
        {activeTab === 'movements' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {(['all', 'in', 'out', 'transfer', 'adjustment'] as const).map(t => (
                  <button key={t} className="px-3 py-1.5 rounded-lg text-xs font-medium border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                    {t === 'all' ? 'Tous' : movTypeConfig[t].label}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                <Icon name="PlusIcon" size={15} />
                Nouveau mouvement
              </button>
            </div>
            <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
                    {['Référence', 'Produit', 'Type', 'Quantité', 'Date', 'Opérateur', 'Motif'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {movements.map(m => {
                    const cfg = movTypeConfig[m.type];
                    return (
                      <tr key={m.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.reference}</td>
                        <td className="px-4 py-3 font-medium" style={{ color: 'var(--foreground)' }}>{m.product}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 w-fit" style={{ backgroundColor: cfg.bg, color: cfg.text }}>
                            <Icon name={cfg.icon as any} size={11} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold" style={{ color: m.type === 'in' ? '#16a34a' : m.type === 'out' ? '#dc2626' : 'var(--foreground)' }}>
                          {m.type === 'out' ? '-' : m.type === 'in' ? '+' : ''}{Math.abs(m.qty)} {m.unit}
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.date}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--foreground)' }}>{m.operator}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.reason}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LOTS */}
        {activeTab === 'lots' && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Lots valides', count: lots.filter(l => l.status === 'valid').length, color: '#16a34a', bg: '#dcfce7' },
                { label: 'Expirent bientôt', count: lots.filter(l => l.status === 'expiring_soon').length, color: '#ca8a04', bg: '#fef9c3' },
                { label: 'Expirés', count: lots.filter(l => l.status === 'expired').length, color: '#dc2626', bg: '#fee2e2' },
                { label: 'Quarantaine', count: lots.filter(l => l.status === 'quarantine').length, color: '#7c3aed', bg: '#f3e8ff' },
              ].map((s, i) => (
                <div key={i} className="rounded-xl p-4 border text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="text-2xl font-bold mb-1" style={{ color: s.color, fontFamily: 'var(--font-display)' }}>{s.count}</div>
                  <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
                    {['N° Lot', 'Produit', 'Quantité', 'Fabrication', 'Péremption', 'Fournisseur', 'Statut', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {lots.map(l => {
                    const cfg = lotStatusConfig[l.status];
                    const daysLeft = Math.floor((new Date(l.expiryDate).getTime() - Date.now()) / 86400000);
                    return (
                      <tr key={l.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>{l.lotNumber}</td>
                        <td className="px-4 py-3 font-medium" style={{ color: 'var(--foreground)' }}>{l.product}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--foreground)' }}>{l.qty} {l.unit}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{l.manufactureDate}</td>
                        <td className="px-4 py-3">
                          <div className="text-xs font-medium" style={{ color: daysLeft < 0 ? '#dc2626' : daysLeft < 30 ? '#ca8a04' : 'var(--foreground)' }}>{l.expiryDate}</div>
                          {daysLeft >= 0 && <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>J-{daysLeft}</div>}
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{l.supplier}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: cfg.bg, color: cfg.text }}>{cfg.label}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-xs px-2 py-1 rounded-lg border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>Détails</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUPPLIERS */}
        {activeTab === 'suppliers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{suppliers.length} fournisseurs enregistrés</p>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                <Icon name="PlusIcon" size={15} />
                Ajouter fournisseur
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {suppliers.map(s => {
                const scfg = supplierStatusConfig[s.status];
                return (
                  <div key={s.id} className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>{s.name}</h3>
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: scfg.bg, color: scfg.text }}>{scfg.label}</span>
                          </div>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{s.type} · {s.country}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{s.contact} · {s.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-right">
                        <div>
                          <div className="flex items-center gap-1 justify-end">
                            {[1,2,3,4,5].map(star => (
                              <Icon key={star} name="StarIcon" size={12} style={{ color: star <= Math.round(s.rating) ? '#f59e0b' : 'var(--muted)' }} />
                            ))}
                            <span className="text-xs font-medium ml-1" style={{ color: 'var(--foreground)' }}>{s.rating}</span>
                          </div>
                          <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Note fournisseur</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>{s.activeOrders}</p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Commandes actives</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>{s.totalOrders}</p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Total commandes</p>
                        </div>
                        <button className="px-3 py-1.5 rounded-lg border text-xs font-medium hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                          Voir détails
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {(['all', 'draft', 'sent', 'confirmed', 'partial', 'received'] as const).map(s => (
                  <button key={s} className="px-3 py-1.5 rounded-lg text-xs font-medium border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                    {s === 'all' ? 'Tous' : orderStatusConfig[s].label}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                <Icon name="PlusIcon" size={15} />
                Créer bon de commande
              </button>
            </div>
            <div className="space-y-3">
              {orders.map(o => {
                const ocfg = orderStatusConfig[o.status];
                const priorityColor = o.priority === 'critical' ? '#dc2626' : o.priority === 'urgent' ? '#f59e0b' : '#64748b';
                return (
                  <div key={o.id} className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{o.id}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: ocfg.bg, color: ocfg.text }}>{ocfg.label}</span>
                            {o.priority !== 'normal' && (
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: priorityColor + '20', color: priorityColor }}>
                                {o.priority === 'urgent' ? 'Urgent' : 'Critique'}
                              </span>
                            )}
                          </div>
                          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>{o.supplier} · {o.items} article{o.items > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{o.totalAmount.toLocaleString()} {o.currency}</p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Montant total</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Commandé le {o.orderDate}</p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Livraison prévue {o.expectedDate}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 rounded-lg border text-xs font-medium hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                            Voir
                          </button>
                          {['sent', 'confirmed', 'partial'].includes(o.status) && (
                            <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                              Réceptionner
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
