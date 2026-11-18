'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

type Tab = 'catalog' | 'cart' | 'quote' | 'vendor' | 'reviews' | 'commissions' | 'supply-chain';

const products = [
  { id: 1, name: 'Tensiomètre numérique Omron M3', category: 'Équipement', price: 45000, stock: 24, rating: 4.7, reviews: 89, seller: 'MedTech Dakar', certified: true, color: '#0ea5e9', bg: '#e0f2fe', description: 'Tensiomètre bras automatique, mémoire 60 mesures, détection arythmie' },
  { id: 2, name: 'Glucomètre Accu-Chek Active', category: 'Diagnostic', price: 28500, stock: 67, rating: 4.8, reviews: 142, seller: 'PharmaPro SN', certified: true, color: '#10b981', bg: '#d1fae5', description: 'Glycémie en 5 secondes, 500 mémoires, compatible application mobile' },
  { id: 3, name: 'Stéthoscope Littmann Classic III', category: 'Équipement', price: 89000, stock: 12, rating: 4.9, reviews: 67, seller: 'MedSupply Africa', certified: true, color: '#8b5cf6', bg: '#ede9fe', description: 'Stéthoscope double pavillon, membrane accordable, tube de 69 cm' },
  { id: 4, name: 'Oxymètre de pouls portable', category: 'Monitoring', price: 15000, stock: 89, rating: 4.6, reviews: 203, seller: 'HealthStore CI', certified: false, color: '#f59e0b', bg: '#fef3c7', description: 'SpO2 + fréquence cardiaque, affichage OLED, autonomie 30h' },
  { id: 5, name: 'Kit de suture stérile (boîte 10)', category: 'Consommable', price: 8500, stock: 156, rating: 4.5, reviews: 45, seller: 'MedTech Dakar', certified: true, color: '#ef4444', bg: '#fee2e2', description: 'Fils résorbables et non-résorbables, aiguilles courbes, stérile' },
  { id: 6, name: 'Électrocardiographe 12 dérivations', category: 'Équipement', price: 1250000, stock: 3, rating: 4.8, reviews: 12, seller: 'MedSupply Africa', certified: true, color: '#06b6d4', bg: '#cffafe', description: 'ECG 12 dérivations, impression thermique, mémoire 200 ECG, WiFi' },
  { id: 7, name: 'Thermomètre infrarouge frontal', category: 'Diagnostic', price: 12000, stock: 45, rating: 4.4, reviews: 178, seller: 'HealthStore CI', certified: false, color: '#ec4899', bg: '#fce7f3', description: 'Mesure en 1 seconde, sans contact, mémoire 32 mesures' },
  { id: 8, name: 'Défibrillateur semi-automatique', category: 'Urgences', price: 850000, stock: 5, rating: 4.9, reviews: 8, seller: 'MedSupply Africa', certified: true, color: '#dc2626', bg: '#fee2e2', description: 'DEA avec guidage vocal, électrodes adulte/enfant incluses' },
];

const vendorProducts = [
  { id: 1, name: 'Tensiomètre Omron M3', stock: 24, sold: 156, revenue: 7020000, status: 'actif' },
  { id: 2, name: 'Kit suture stérile', stock: 156, sold: 89, revenue: 756500, status: 'actif' },
  { id: 3, name: 'Électrocardiographe 12D', stock: 3, sold: 7, revenue: 8750000, status: 'stock_faible' },
];

const vendorOrders = [
  { id: 'CMD-2847', buyer: 'Clinique Al-Shifa', product: 'Tensiomètre Omron M3 ×3', date: '08/08/2026', total: 135000, status: 'livré' },
  { id: 'CMD-2831', buyer: 'Dr. Ndiaye', product: 'Kit suture ×10', date: '05/08/2026', total: 85000, status: 'en_transit' },
  { id: 'CMD-2819', buyer: 'CHU Dakar', product: 'ECG 12D ×2', date: '01/08/2026', total: 2500000, status: 'livré' },
];

const reviews = [
  { id: 1, product: 'Tensiomètre Omron M3', author: 'Dr. Fatou Ndiaye', rating: 5, date: '10 août 2026', comment: 'Excellent appareil, très précis. Livraison rapide. Je recommande vivement pour les consultations.' },
  { id: 2, product: 'Glucomètre Accu-Chek', author: 'Inf. Ibrahima Sow', rating: 4, date: '8 août 2026', comment: 'Bon produit, facile d\'utilisation. L\'application mobile est pratique pour le suivi des patients.' },
  { id: 3, product: 'Stéthoscope Littmann', author: 'Dr. Moussa Traoré', rating: 5, date: '5 août 2026', comment: 'Qualité irréprochable. Le meilleur stéthoscope que j\'ai utilisé. Acoustique parfaite.' },
  { id: 4, product: 'Oxymètre portable', author: 'Inf. Aïssatou Ba', rating: 3, date: '2 août 2026', comment: 'Correct pour le prix. Quelques imprécisions à faible saturation. Convient pour usage courant.' },
];

const commissionData = [
  { mois: 'Mar', montant: 45000 },
  { mois: 'Avr', montant: 62000 },
  { mois: 'Mai', montant: 78000 },
  { mois: 'Jun', montant: 55000 },
  { mois: 'Jul', montant: 89000 },
  { mois: 'Aoû', montant: 95000 },
];

const commissionRows = [
  { id: 'c1', produit: 'Électrocardiographe 12D', vendeur: 'MedSupply Africa', date: '08 août 2026', vente: 2500000, taux: '5%', montant: 125000, statut: 'payé' },
  { id: 'c2', produit: 'Tensiomètre Omron M3 ×3', vendeur: 'MedTech Dakar', date: '05 août 2026', vente: 135000, taux: '3%', montant: 4050, statut: 'payé' },
  { id: 'c3', produit: 'Kit suture ×10', vendeur: 'MedTech Dakar', date: '01 août 2026', vente: 85000, taux: '3%', montant: 2550, statut: 'en_attente' },
];

const categories = ['Tous', 'Équipement', 'Diagnostic', 'Monitoring', 'Consommable', 'Urgences'];

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  livré: { label: 'Livré', bg: '#dcfce7', text: '#16a34a' },
  en_transit: { label: 'En transit', bg: '#fef9c3', text: '#ca8a04' },
  en_attente: { label: 'En attente', bg: '#fef9c3', text: '#ca8a04' },
  payé: { label: 'Payé', bg: '#dcfce7', text: '#16a34a' },
  actif: { label: 'Actif', bg: '#dcfce7', text: '#16a34a' },
  stock_faible: { label: 'Stock faible', bg: '#fee2e2', text: '#dc2626' },
};

export default function HealthMarketplaceContent() {
  const [activeTab, setActiveTab] = useState<Tab>('catalog');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Tous');
  const [cart, setCart] = useState<{ id: number; qty: number }[]>([]);
  const [quoteStep, setQuoteStep] = useState(1);

  const filtered = products.filter(p =>
    (categoryFilter === 'Tous' || p.category === categoryFilter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
  );

  const cartItems = cart.map(ci => ({ ...products.find(p => p.id === ci.id)!, qty: ci.qty })).filter(Boolean);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const addToCart = (id: number) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === id);
      if (existing) return prev.map(c => c.id === id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id, qty: 1 }];
    });
  };

  const removeFromCart = (id: number) => setCart(prev => prev.filter(c => c.id !== id));

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'catalog', label: 'Catalogue', icon: 'ShoppingBagIcon' },
    { key: 'cart', label: `Panier (${cart.length})`, icon: 'ShoppingCartIcon' },
    { key: 'quote', label: 'Devis → Commande', icon: 'DocumentTextIcon' },
    { key: 'vendor', label: 'Espace Vendeur', icon: 'BuildingStorefrontIcon' },
    { key: 'reviews', label: 'Avis & Notes', icon: 'StarIcon' },
    { key: 'commissions', label: 'Commissions', icon: 'BanknotesIcon' },
    { key: 'supply-chain', label: 'Supply Chain & Finance', icon: 'ArrowsRightLeftIcon' },
  ];

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0ea5e9, #10b981)' }}>
            <Icon name="ShoppingBagIcon" size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--foreground)', fontFamily: 'DM Sans, sans-serif' }}>Marketplace Santé</h1>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Équipements médicaux · Consommables · Services · Fournisseurs certifiés</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setActiveTab('cart')} className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
            <Icon name="ShoppingCartIcon" size={16} />
            Panier
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ backgroundColor: 'var(--shifa-blue)' }}>{cart.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b px-6 overflow-x-auto" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex gap-0">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
              style={{ borderColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'transparent', color: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)' }}>
              <Icon name={tab.icon as any} size={15} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">

        {/* ── CATALOG ── */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Produits disponibles', value: '2 847', icon: 'ShoppingBagIcon', color: '#0ea5e9' },
                { label: 'Fournisseurs certifiés', value: '124', icon: 'ShieldCheckIcon', color: '#10b981' },
                { label: 'Commandes ce mois', value: '18', icon: 'TruckIcon', color: '#8b5cf6' },
                { label: 'Économies réalisées', value: '12%', icon: 'BanknotesIcon', color: '#f59e0b' },
              ].map((k, i) => (
                <div key={i} className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: k.color + '20' }}>
                      <Icon name={k.icon as any} size={16} style={{ color: k.color }} />
                    </div>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{k.label}</span>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{k.value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher un produit, équipement..."
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border outline-none"
                  style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setCategoryFilter(cat)}
                    className="px-3 py-2 rounded-xl text-xs font-medium border transition-colors"
                    style={{ backgroundColor: categoryFilter === cat ? 'var(--shifa-blue)' : 'var(--card)', color: categoryFilter === cat ? '#fff' : 'var(--muted-foreground)', borderColor: 'var(--border)' }}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(p => (
                <div key={p.id} className="rounded-2xl border overflow-hidden hover:shadow-md transition-shadow" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="h-2" style={{ backgroundColor: p.color }} />
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: p.bg, color: p.color }}>{p.category}</span>
                      {p.certified && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>✓ Certifié</span>}
                    </div>
                    <h3 className="text-sm font-semibold mb-1 leading-snug" style={{ color: 'var(--foreground)' }}>{p.name}</h3>
                    <p className="text-xs mb-2 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{p.description}</p>
                    <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>{p.seller}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-base font-bold" style={{ color: p.color }}>{p.price.toLocaleString()} FCFA</span>
                      <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        <Icon name="StarIcon" size={12} style={{ color: '#f59e0b' }} />
                        <span>{p.rating}</span>
                        <span>({p.reviews})</span>
                      </div>
                    </div>
                    <p className="text-xs mb-3" style={{ color: p.stock < 10 ? '#dc2626' : 'var(--muted-foreground)' }}>Stock : {p.stock} unités{p.stock < 10 ? ' ⚠️' : ''}</p>
                    <div className="flex gap-2">
                      <button onClick={() => addToCart(p.id)} className="flex-1 py-2 rounded-xl text-xs font-medium text-white" style={{ backgroundColor: p.color }}>
                        + Panier
                      </button>
                      <button onClick={() => { setActiveTab('quote'); }} className="px-3 py-2 rounded-xl text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                        Devis
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CART ── */}
        {activeTab === 'cart' && (
          <div className="max-w-3xl mx-auto space-y-4">
            {cartItems.length === 0 ? (
              <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <Icon name="ShoppingCartIcon" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Votre panier est vide</p>
                <button onClick={() => setActiveTab('catalog')} className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                  Parcourir le catalogue
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cartItems.map(item => (
                    <div key={item.id} className="rounded-2xl border p-4 flex items-center gap-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: item.bg }}>
                        <Icon name="ShoppingBagIcon" size={20} style={{ color: item.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{item.name}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.seller}</p>
                        <p className="text-sm font-bold mt-1" style={{ color: item.color }}>{(item.price * item.qty).toLocaleString()} FCFA</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => setCart(prev => prev.map(c => c.id === item.id ? { ...c, qty: Math.max(1, c.qty - 1) } : c))} className="w-7 h-7 rounded-lg flex items-center justify-center border" style={{ borderColor: 'var(--border)' }}>
                          <Icon name="MinusIcon" size={12} />
                        </button>
                        <span className="text-sm font-bold w-6 text-center" style={{ color: 'var(--foreground)' }}>{item.qty}</span>
                        <button onClick={() => addToCart(item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center border" style={{ borderColor: 'var(--border)' }}>
                          <Icon name="PlusIcon" size={12} />
                        </button>
                        <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fee2e2' }}>
                          <Icon name="TrashIcon" size={12} style={{ color: '#dc2626' }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Total ({cartItems.length} articles)</span>
                    <span className="text-xl font-bold" style={{ color: 'var(--shifa-blue)' }}>{cartTotal.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setActiveTab('quote')} className="flex-1 py-3 rounded-xl text-sm font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                      Demander un devis
                    </button>
                    <button className="flex-1 py-3 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                      Commander maintenant
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── QUOTE TO ORDER ── */}
        {activeTab === 'quote' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
              {[1, 2, 3].map(step => (
                <React.Fragment key={step}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: quoteStep >= step ? 'var(--shifa-blue)' : 'var(--muted)', color: quoteStep >= step ? '#fff' : 'var(--muted-foreground)' }}>
                      {quoteStep > step ? '✓' : step}
                    </div>
                    <span className="text-xs font-medium hidden sm:block" style={{ color: quoteStep >= step ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                      {step === 1 ? 'Détails devis' : step === 2 ? 'Validation' : 'Commande'}
                    </span>
                  </div>
                  {step < 3 && <div className="flex-1 h-0.5" style={{ backgroundColor: quoteStep > step ? 'var(--shifa-blue)' : 'var(--border)' }} />}
                </React.Fragment>
              ))}
            </div>

            {quoteStep === 1 && (
              <div className="rounded-2xl border p-6 space-y-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Demande de devis</h3>
                {[
                  { label: 'Établissement / Organisation', placeholder: 'Nom de votre établissement' },
                  { label: 'Produit(s) souhaité(s)', placeholder: 'Ex: Tensiomètre Omron M3 ×5, ECG 12D ×1' },
                  { label: 'Quantité totale estimée', placeholder: 'Ex: 6 unités' },
                  { label: 'Budget indicatif (FCFA)', placeholder: 'Ex: 500 000' },
                  { label: 'Délai de livraison souhaité', placeholder: 'Ex: 2 semaines' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>{f.label}</label>
                    <input placeholder={f.placeholder} className="w-full px-3 py-2 text-sm rounded-xl border outline-none" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>Commentaires / Spécifications</label>
                  <textarea rows={3} placeholder="Précisions sur vos besoins..." className="w-full px-3 py-2 text-sm rounded-xl border outline-none resize-none" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                </div>
                <button onClick={() => setQuoteStep(2)} className="w-full py-3 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                  Envoyer la demande de devis
                </button>
              </div>
            )}

            {quoteStep === 2 && (
              <div className="rounded-2xl border p-6 space-y-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#dcfce7' }}>
                    <Icon name="CheckCircleIcon" size={20} style={{ color: '#16a34a' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Devis reçu — DEV-2026-08-047</h3>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>MedSupply Africa · Valable jusqu'au 22 août 2026</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { item: 'Tensiomètre Omron M3 ×5', prix: 225000 },
                    { item: 'Électrocardiographe 12D ×1', prix: 1250000 },
                    { item: 'Frais de livraison', prix: 15000 },
                  ].map((line, i) => (
                    <div key={i} className="flex justify-between text-sm py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                      <span style={{ color: 'var(--foreground)' }}>{line.item}</span>
                      <span className="font-bold" style={{ color: 'var(--foreground)' }}>{line.prix.toLocaleString()} FCFA</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-base font-bold pt-2">
                    <span style={{ color: 'var(--foreground)' }}>Total TTC</span>
                    <span style={{ color: 'var(--shifa-blue)' }}>1 490 000 FCFA</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setQuoteStep(1)} className="flex-1 py-3 rounded-xl text-sm font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                    Modifier
                  </button>
                  <button onClick={() => setQuoteStep(3)} className="flex-1 py-3 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: '#16a34a' }}>
                    Accepter & Commander
                  </button>
                </div>
              </div>
            )}

            {quoteStep === 3 && (
              <div className="rounded-2xl border p-8 text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#dcfce7' }}>
                  <Icon name="CheckCircleIcon" size={32} style={{ color: '#16a34a' }} />
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: 'var(--foreground)' }}>Commande confirmée !</h3>
                <p className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>Référence : <span className="font-mono font-bold" style={{ color: 'var(--shifa-blue)' }}>CMD-2026-08-2848</span></p>
                <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>Livraison estimée : 14–16 août 2026</p>
                <button onClick={() => setQuoteStep(1)} className="px-6 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                  Nouvelle commande
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── VENDOR SPACE ── */}
        {activeTab === 'vendor' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Produits listés', value: '3', icon: 'ShoppingBagIcon', color: '#0ea5e9' },
                { label: 'Commandes ce mois', value: '12', icon: 'TruckIcon', color: '#8b5cf6' },
                { label: 'Revenus totaux', value: '16,5M FCFA', icon: 'BanknotesIcon', color: '#10b981' },
                { label: 'Note vendeur', value: '4.8/5', icon: 'StarIcon', color: '#f59e0b' },
              ].map((k, i) => (
                <div key={i} className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: k.color + '20' }}>
                    <Icon name={k.icon as any} size={16} style={{ color: k.color }} />
                  </div>
                  <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{k.value}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{k.label}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Mes produits</h3>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                  <Icon name="PlusIcon" size={13} /> Ajouter un produit
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--muted)' }}>
                      {['Produit', 'Stock', 'Vendus', 'Revenus', 'Statut', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {vendorProducts.map(p => {
                      const s = statusConfig[p.status];
                      return (
                        <tr key={p.id} className="border-t hover:bg-muted/40" style={{ borderColor: 'var(--border)' }}>
                          <td className="px-4 py-3 font-medium text-sm" style={{ color: 'var(--foreground)' }}>{p.name}</td>
                          <td className="px-4 py-3 text-xs" style={{ color: p.stock < 10 ? '#dc2626' : 'var(--foreground)' }}>{p.stock}</td>
                          <td className="px-4 py-3 text-xs" style={{ color: 'var(--foreground)' }}>{p.sold}</td>
                          <td className="px-4 py-3 text-xs font-bold" style={{ color: '#10b981' }}>{p.revenue.toLocaleString()} FCFA</td>
                          <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span></td>
                          <td className="px-4 py-3">
                            <button className="text-xs px-2 py-1 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Modifier</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Commandes reçues</h3>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {vendorOrders.map(o => {
                  const s = statusConfig[o.status];
                  return (
                    <div key={o.id} className="p-4 flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold" style={{ color: 'var(--shifa-blue)' }}>{o.id}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
                        </div>
                        <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{o.product}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{o.buyer} · {o.date}</p>
                      </div>
                      <span className="text-base font-bold" style={{ color: 'var(--foreground)' }}>{o.total.toLocaleString()} FCFA</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── REVIEWS ── */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {[
                { label: 'Note moyenne', value: '4.7/5', icon: 'StarIcon', color: '#f59e0b' },
                { label: 'Total avis', value: '524', icon: 'ChatBubbleLeftIcon', color: '#0ea5e9' },
                { label: 'Avis 5 étoiles', value: '68%', icon: 'HandThumbUpIcon', color: '#10b981' },
              ].map((k, i) => (
                <div key={i} className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: k.color + '20' }}>
                    <Icon name={k.icon as any} size={16} style={{ color: k.color }} />
                  </div>
                  <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{k.value}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{k.label}</p>
                </div>
              ))}
            </div>
            {reviews.map(r => (
              <div key={r.id} className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{r.author}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.product} · {r.date}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Icon key={i} name="StarIcon" size={14} style={{ color: i < r.rating ? '#f59e0b' : 'var(--border)' }} />
                    ))}
                  </div>
                </div>
                <p className="text-sm" style={{ color: 'var(--foreground)' }}>{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── COMMISSIONS ── */}
        {activeTab === 'commissions' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Commissions totales', value: '424 000 FCFA', icon: 'BanknotesIcon', color: '#10b981' },
                { label: 'Ce mois', value: '95 000 FCFA', icon: 'TrendingUpIcon', color: '#0ea5e9' },
                { label: 'En attente', value: '2 550 FCFA', icon: 'ClockIcon', color: '#f59e0b' },
              ].map((k, i) => (
                <div key={i} className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: k.color + '20' }}>
                    <Icon name={k.icon as any} size={16} style={{ color: k.color }} />
                  </div>
                  <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{k.value}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{k.label}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Évolution des commissions (6 mois)</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={commissionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="mois" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} formatter={(v: any) => [`${v.toLocaleString()} FCFA`, 'Commission']} />
                  <Bar dataKey="montant" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Détail des commissions</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--muted)' }}>
                      {['Produit', 'Vendeur', 'Date', 'Vente', 'Taux', 'Commission', 'Statut'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {commissionRows.map(c => {
                      const s = statusConfig[c.statut];
                      return (
                        <tr key={c.id} className="border-t hover:bg-muted/40" style={{ borderColor: 'var(--border)' }}>
                          <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--foreground)' }}>{c.produit}</td>
                          <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.vendeur}</td>
                          <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.date}</td>
                          <td className="px-4 py-3 text-xs" style={{ color: 'var(--foreground)' }}>{c.vente.toLocaleString()} FCFA</td>
                          <td className="px-4 py-3 text-xs font-bold" style={{ color: '#10b981' }}>{c.taux}</td>
                          <td className="px-4 py-3 text-xs font-bold" style={{ color: 'var(--shifa-dark)' }}>{c.montant.toLocaleString()} FCFA</td>
                          <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── SUPPLY CHAIN & FINANCE ── */}
        {activeTab === 'supply-chain' && (
          <div className="space-y-6">
            {/* Interconnect notice */}
            <div className="flex items-start gap-3 p-4 rounded-2xl border" style={{ backgroundColor: 'rgba(14,165,233,0.06)', borderColor: 'rgba(14,165,233,0.2)' }}>
              <Icon name="ArrowsRightLeftIcon" size={20} style={{ color: '#0ea5e9' }} className="shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Marketplace ↔ Supply Chain ↔ Finance — Workflow intégré</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  Chaque commande Marketplace alimente automatiquement le stock Supply Chain et génère une écriture comptable dans Finance. Le workflow complet : Besoin → Devis → Commande → Paiement → Livraison → Stock → Facturation.
                </p>
              </div>
            </div>

            {/* Workflow */}
            <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Workflow Achat → Stock → Finance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                {[
                  { label: 'Besoin identifié', icon: 'ClipboardDocumentListIcon', color: '#64748b', bg: '#f1f5f9' },
                  { label: 'Recherche fournisseur', icon: 'MagnifyingGlassIcon', color: '#0ea5e9', bg: '#e0f2fe' },
                  { label: 'Devis reçu', icon: 'DocumentTextIcon', color: '#8b5cf6', bg: '#ede9fe' },
                  { label: 'Commande validée', icon: 'CheckCircleIcon', color: '#16a34a', bg: '#dcfce7' },
                  { label: 'Paiement', icon: 'BanknotesIcon', color: '#d97706', bg: '#fef3c7' },
                  { label: 'Livraison → Stock', icon: 'TruckIcon', color: '#0891b2', bg: '#cffafe' },
                  { label: 'Facture → Finance', icon: 'ReceiptPercentIcon', color: '#dc2626', bg: '#fee2e2' },
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-xl text-center" style={{ backgroundColor: step.bg }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: step.color + '20' }}>
                      <Icon name={step.icon as any} size={16} style={{ color: step.color }} />
                    </div>
                    <p className="text-xs font-medium leading-tight" style={{ color: step.color }}>{step.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Module connections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#e0f2fe' }}>
                    <Icon name="ArchiveBoxIcon" size={20} style={{ color: '#0ea5e9' }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Supply Chain</h3>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Gestion des stocks</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {[
                    { label: 'Articles en stock', value: '1 247', color: '#0ea5e9' },
                    { label: 'Commandes en cours', value: '8', color: '#d97706' },
                    { label: 'Alertes stock faible', value: '3', color: '#dc2626' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between text-xs">
                      <span style={{ color: 'var(--muted-foreground)' }}>{item.label}</span>
                      <span className="font-bold" style={{ color: item.color }}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <Link href="/org-supply-chain" className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-medium border" style={{ borderColor: '#0ea5e9', color: '#0ea5e9' }}>
                  <Icon name="ArrowTopRightOnSquareIcon" size={13} />
                  Ouvrir Supply Chain
                </Link>
              </div>

              <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#dcfce7' }}>
                    <Icon name="BanknotesIcon" size={20} style={{ color: '#16a34a' }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Finance</h3>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Facturation & Comptabilité</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {[
                    { label: 'Factures générées (mois)', value: '18', color: '#16a34a' },
                    { label: 'Montant total', value: '16,5M FCFA', color: '#16a34a' },
                    { label: 'En attente de paiement', value: '3', color: '#d97706' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between text-xs">
                      <span style={{ color: 'var(--muted-foreground)' }}>{item.label}</span>
                      <span className="font-bold" style={{ color: item.color }}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <Link href="/finance-dashboard" className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-medium border" style={{ borderColor: '#16a34a', color: '#16a34a' }}>
                  <Icon name="ArrowTopRightOnSquareIcon" size={13} />
                  Ouvrir Finance
                </Link>
              </div>

              <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#ede9fe' }}>
                    <Icon name="BuildingStorefrontIcon" size={20} style={{ color: '#8b5cf6' }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Fournisseurs</h3>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Vendeurs certifiés</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {[
                    { label: 'Fournisseurs actifs', value: '124', color: '#8b5cf6' },
                    { label: 'Certifiés SHIFA', value: '89', color: '#16a34a' },
                    { label: 'Nouveaux ce mois', value: '6', color: '#0891b2' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between text-xs">
                      <span style={{ color: 'var(--muted-foreground)' }}>{item.label}</span>
                      <span className="font-bold" style={{ color: item.color }}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <Link href="/marketplace-vendor" className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-medium border" style={{ borderColor: '#8b5cf6', color: '#8b5cf6' }}>
                  <Icon name="ArrowTopRightOnSquareIcon" size={13} />
                  Espace Vendeur
                </Link>
              </div>
            </div>

            {/* Recent orders with finance status */}
            <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Commandes récentes — Statut Finance & Stock</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--muted)' }}>
                      {['Commande', 'Produit', 'Montant', 'Statut livraison', 'Statut stock', 'Statut finance', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 'CMD-2847', product: 'Tensiomètre Omron M3 ×3', amount: '135 000 FCFA', delivery: 'livré', stock: 'mis_a_jour', finance: 'facturé', color: '#16a34a' },
                      { id: 'CMD-2831', product: 'Kit suture ×10', amount: '85 000 FCFA', delivery: 'en_transit', stock: 'en_attente', finance: 'en_attente', color: '#d97706' },
                      { id: 'CMD-2819', product: 'ECG 12D ×2', amount: '2 500 000 FCFA', delivery: 'livré', stock: 'mis_a_jour', finance: 'facturé', color: '#16a34a' },
                    ].map(order => (
                      <tr key={order.id} className="border-t hover:bg-muted/40" style={{ borderColor: 'var(--border)' }}>
                        <td className="px-4 py-3 font-mono text-xs font-bold" style={{ color: 'var(--shifa-blue)' }}>{order.id}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--foreground)' }}>{order.product}</td>
                        <td className="px-4 py-3 text-xs font-bold" style={{ color: 'var(--foreground)' }}>{order.amount}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: order.delivery === 'livré' ? '#dcfce7' : '#fef3c7', color: order.delivery === 'livré' ? '#16a34a' : '#d97706' }}>
                            {order.delivery === 'livré' ? 'Livré' : 'En transit'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: order.stock === 'mis_a_jour' ? '#dcfce7' : '#fef3c7', color: order.stock === 'mis_a_jour' ? '#16a34a' : '#d97706' }}>
                            {order.stock === 'mis_a_jour' ? 'Mis à jour' : 'En attente'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: order.finance === 'facturé' ? '#dcfce7' : '#fef3c7', color: order.finance === 'facturé' ? '#16a34a' : '#d97706' }}>
                            {order.finance === 'facturé' ? 'Facturé' : 'En attente'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-xs px-2 py-1 rounded-lg hover:bg-muted" style={{ color: '#0ea5e9' }}>Voir</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
