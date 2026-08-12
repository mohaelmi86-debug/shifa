'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tab = 'catalog' | 'orders' | 'wishlist' | 'invoices';

interface Product {
  id: string;
  name: string;
  category: string;
  vendor: string;
  price: number;
  unit: string;
  stock: 'available' | 'low' | 'out';
  rating: number;
  image: string;
  description: string;
}

const CATEGORIES = ['Tous', 'Médicaments', 'Consommables', 'Équipements', 'Réactifs', 'Dispositifs médicaux'];

const products: Product[] = [
  { id: 'p1', name: 'Amoxicilline 500mg (boîte 30)', category: 'Médicaments', vendor: 'PharmaSN', price: 4500, unit: 'boîte', stock: 'available', rating: 4.8, image: '', description: 'Antibiotique large spectre, générique certifié' },
  { id: 'p2', name: 'Seringues 5ml stériles (x100)', category: 'Consommables', vendor: 'MedSupply', price: 8200, unit: 'boîte', stock: 'available', rating: 4.6, image: '', description: 'Seringues jetables, emballage individuel' },
  { id: 'p3', name: 'Glucomètre Accu-Chek', category: 'Équipements', vendor: 'DiagTech', price: 45000, unit: 'unité', stock: 'low', rating: 4.9, image: '', description: 'Mesure glycémie capillaire, mémoire 500 résultats' },
  { id: 'p4', name: 'Réactif CRP (x50 tests)', category: 'Réactifs', vendor: 'BioLab', price: 32000, unit: 'kit', stock: 'available', rating: 4.5, image: '', description: 'Dosage protéine C-réactive, méthode immunoturbidimétrique' },
  { id: 'p5', name: 'Masques FFP2 (x20)', category: 'Consommables', vendor: 'SafeGuard', price: 6800, unit: 'boîte', stock: 'available', rating: 4.7, image: '', description: 'Protection respiratoire certifiée CE' },
  { id: 'p6', name: 'Tensiomètre électronique', category: 'Équipements', vendor: 'DiagTech', price: 28000, unit: 'unité', stock: 'out', rating: 4.4, image: '', description: 'Mesure automatique bras, mémoire 60 mesures' },
];

const orders = [
  { id: 'CMD-2025-0847', date: '2025-07-28', items: 3, total: 52700, status: 'delivered', vendor: 'PharmaSN' },
  { id: 'CMD-2025-0831', date: '2025-07-20', items: 5, total: 124500, status: 'shipped', vendor: 'MedSupply' },
  { id: 'CMD-2025-0812', date: '2025-07-10', items: 2, total: 77000, status: 'processing', vendor: 'DiagTech' },
  { id: 'CMD-2025-0798', date: '2025-07-02', items: 4, total: 38400, status: 'delivered', vendor: 'BioLab' },
];

const ORDER_STATUS = {
  delivered: { label: 'Livré', bg: '#dcfce7', text: '#16a34a' },
  shipped: { label: 'En transit', bg: '#dbeafe', text: '#1d4ed8' },
  processing: { label: 'En traitement', bg: '#fef9c3', text: '#a16207' },
  cancelled: { label: 'Annulé', bg: '#fee2e2', text: '#b91c1c' },
};

const STOCK_CONFIG = {
  available: { label: 'En stock', color: '#16a34a' },
  low: { label: 'Stock faible', color: '#a16207' },
  out: { label: 'Rupture', color: '#b91c1c' },
};

export default function MarketplaceBuyerContent() {
  const [activeTab, setActiveTab] = useState<Tab>('catalog');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [showCart, setShowCart] = useState(false);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'catalog', label: 'Catalogue', icon: 'ShoppingBagIcon' },
    { key: 'orders', label: 'Mes commandes', icon: 'ClipboardDocumentListIcon' },
    { key: 'wishlist', label: 'Liste de souhaits', icon: 'HeartIcon' },
    { key: 'invoices', label: 'Factures', icon: 'DocumentTextIcon' },
  ];

  const filtered = products.filter(p =>
    (selectedCategory === 'Tous' || p.category === selectedCategory) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(c => c.product.id === product.id);
      if (existing) return prev.map(c => c.product.id === product.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { product, qty: 1 }];
    });
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.product.price * c.qty, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'DM Sans, sans-serif' }}>
            Marketplace Santé — Acheteur
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Approvisionnement médical · {products.length} produits disponibles
          </p>
        </div>
        <button
          onClick={() => setShowCart(!showCart)}
          className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: 'var(--primary)' }}
        >
          <Icon name="ShoppingCartIcon" size={16} />
          Panier
          {cart.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold" style={{ background: '#ef4444', color: '#fff' }}>
              {cart.reduce((s, c) => s + c.qty, 0)}
            </span>
          )}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Commandes ce mois', value: '4', icon: 'ShoppingBagIcon', color: '#dbeafe' },
          { label: 'Total dépensé', value: '293 K FCFA', icon: 'BanknotesIcon', color: '#dcfce7' },
          { label: 'En cours de livraison', value: '1', icon: 'TruckIcon', color: '#fef9c3' },
          { label: 'Fournisseurs actifs', value: '4', icon: 'BuildingStorefrontIcon', color: '#ede9fe' },
        ].map((kpi, i) => (
          <div key={i} className="p-4 rounded-xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: kpi.color }}>
                <Icon name={kpi.icon as any} size={18} style={{ color: '#374151' }} />
              </div>
              <div>
                <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{kpi.value}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--muted)' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: activeTab === tab.key ? 'var(--background)' : 'transparent',
              color: activeTab === tab.key ? 'var(--foreground)' : 'var(--muted-foreground)',
              boxShadow: activeTab === tab.key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <Icon name={tab.icon as any} size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Catalog Tab */}
      {activeTab === 'catalog' && (
        <div className="grid grid-cols-12 gap-6">
          <div className={`${showCart ? 'col-span-8' : 'col-span-12'} space-y-4`}>
            {/* Search & Category */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm"
                  style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                  style={{
                    background: selectedCategory === cat ? 'var(--primary)' : 'var(--muted)',
                    color: selectedCategory === cat ? '#fff' : 'var(--muted-foreground)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-3 gap-4">
              {filtered.map(product => {
                const sc = STOCK_CONFIG[product.stock];
                const inCart = cart.find(c => c.product.id === product.id);
                return (
                  <div key={product.id} className="rounded-xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="h-28 flex items-center justify-center" style={{ background: 'var(--muted)' }}>
                      <Icon name="ArchiveBoxIcon" size={32} style={{ color: 'var(--muted-foreground)' }} />
                    </div>
                    <div className="p-4 space-y-2">
                      <div>
                        <p className="font-semibold text-sm leading-tight" style={{ color: 'var(--foreground)' }}>{product.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{product.vendor}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="font-bold" style={{ color: 'var(--foreground)' }}>{product.price.toLocaleString()} FCFA</p>
                        <span className="text-xs" style={{ color: sc.color }}>● {sc.label}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(s => (
                          <Icon key={s} name="StarIcon" size={11} style={{ color: s <= Math.round(product.rating) ? '#f59e0b' : 'var(--muted-foreground)' }} />
                        ))}
                        <span className="text-xs ml-1" style={{ color: 'var(--muted-foreground)' }}>{product.rating}</span>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 'out'}
                        className="w-full py-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                          background: product.stock === 'out' ? 'var(--muted)' : 'var(--primary)',
                          color: product.stock === 'out' ? 'var(--muted-foreground)' : '#fff',
                          opacity: product.stock === 'out' ? 0.6 : 1,
                        }}
                      >
                        {inCart ? `Dans le panier (${inCart.qty})` : 'Ajouter au panier'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart Sidebar */}
          {showCart && (
            <div className="col-span-4 rounded-xl border p-5 space-y-4 h-fit" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>Panier ({cart.reduce((s, c) => s + c.qty, 0)} articles)</h3>
                <button onClick={() => setShowCart(false)} style={{ color: 'var(--muted-foreground)' }}>
                  <Icon name="XMarkIcon" size={16} />
                </button>
              </div>
              {cart.length === 0 ? (
                <p className="text-sm text-center py-4" style={{ color: 'var(--muted-foreground)' }}>Panier vide</p>
              ) : (
                <>
                  <div className="space-y-3">
                    {cart.map(({ product, qty }) => (
                      <div key={product.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--muted)' }}>
                          <Icon name="ArchiveBoxIcon" size={16} style={{ color: 'var(--muted-foreground)' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate" style={{ color: 'var(--foreground)' }}>{product.name}</p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{product.price.toLocaleString()} × {qty}</p>
                        </div>
                        <p className="text-sm font-bold shrink-0" style={{ color: 'var(--foreground)' }}>{(product.price * qty).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-3" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex justify-between mb-3">
                      <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Total</span>
                      <span className="font-bold" style={{ color: 'var(--foreground)' }}>{cartTotal.toLocaleString()} FCFA</span>
                    </div>
                    <button className="w-full py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: 'var(--primary)' }}>
                      Passer la commande
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--muted)' }}>
                {['N° Commande', 'Date', 'Fournisseur', 'Articles', 'Total', 'Statut', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => {
                const sc = ORDER_STATUS[order.status as keyof typeof ORDER_STATUS];
                return (
                  <tr key={i} className="border-t" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-4 py-3 font-mono text-xs font-medium" style={{ color: 'var(--foreground)' }}>{order.id}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{order.date}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--foreground)' }}>{order.vendor}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{order.items} articles</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: 'var(--foreground)' }}>{order.total.toLocaleString()} FCFA</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full" style={{ background: sc.bg, color: sc.text }}>{sc.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-xs px-3 py-1 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>Détails</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Wishlist Tab */}
      {activeTab === 'wishlist' && (
        <div className="grid grid-cols-3 gap-4">
          {products.slice(0, 3).map(product => {
            const sc = STOCK_CONFIG[product.stock];
            return (
              <div key={product.id} className="rounded-xl border p-4 space-y-3" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between">
                  <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{product.name}</p>
                  <button style={{ color: '#ef4444' }}><Icon name="HeartIcon" size={16} /></button>
                </div>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{product.vendor}</p>
                <div className="flex items-center justify-between">
                  <p className="font-bold" style={{ color: 'var(--foreground)' }}>{product.price.toLocaleString()} FCFA</p>
                  <span className="text-xs" style={{ color: sc.color }}>● {sc.label}</span>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full py-2 rounded-lg text-sm font-medium text-white"
                  style={{ background: 'var(--primary)' }}
                >
                  Ajouter au panier
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--muted)' }}>
                {['N° Facture', 'Date', 'Commande', 'Montant', 'Statut', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-3 font-mono text-xs font-medium" style={{ color: 'var(--foreground)' }}>FAC-{order.id.replace('CMD-', '')}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{order.date}</td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>{order.id}</td>
                  <td className="px-4 py-3 font-semibold" style={{ color: 'var(--foreground)' }}>{order.total.toLocaleString()} FCFA</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: '#dcfce7', color: '#16a34a' }}>Payée</span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                      <Icon name="ArrowDownTrayIcon" size={12} />
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
