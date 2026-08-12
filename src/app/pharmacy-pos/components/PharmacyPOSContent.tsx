'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Tab = 'pos' | 'prescriptions' | 'inventory' | 'patients' | 'cash' | 'reports';

interface POSItem {
  id: string;
  name: string;
  dci: string;
  form: string;
  dosage: string;
  price: number;
  stock: number;
  category: string;
  requiresPrescription: boolean;
}

interface Sale {
  id: string;
  patient: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  insurance: number;
  patientShare: number;
  paymentMethod: 'cash' | 'card' | 'insurance' | 'mobile';
  time: string;
  pharmacist: string;
  prescriptionId?: string;
}

interface Prescription {
  id: string;
  patient: string;
  physician: string;
  date: string;
  items: { name: string; qty: number; dispensed: boolean }[];
  status: 'pending' | 'partial' | 'dispensed' | 'expired';
  insurance: string;
}

const catalog: POSItem[] = [
  { id: 'M-001', name: 'Amoxicilline 500mg', dci: 'Amoxicilline', form: 'Gélule', dosage: '500mg', price: 2500, stock: 240, category: 'Antibiotiques', requiresPrescription: true },
  { id: 'M-002', name: 'Paracétamol 1g', dci: 'Paracétamol', form: 'Comprimé', dosage: '1g', price: 800, stock: 580, category: 'Antalgiques', requiresPrescription: false },
  { id: 'M-003', name: 'Metformine 850mg', dci: 'Metformine', form: 'Comprimé', dosage: '850mg', price: 1200, stock: 320, category: 'Antidiabétiques', requiresPrescription: true },
  { id: 'M-004', name: 'Amlodipine 5mg', dci: 'Amlodipine', form: 'Comprimé', dosage: '5mg', price: 1800, stock: 180, category: 'Antihypertenseurs', requiresPrescription: true },
  { id: 'M-005', name: 'Ibuprofène 400mg', dci: 'Ibuprofène', form: 'Comprimé', dosage: '400mg', price: 900, stock: 420, category: 'Anti-inflammatoires', requiresPrescription: false },
  { id: 'M-006', name: 'Oméprazole 20mg', dci: 'Oméprazole', form: 'Gélule', dosage: '20mg', price: 1500, stock: 260, category: 'IPP', requiresPrescription: false },
  { id: 'M-007', name: 'Salbutamol spray', dci: 'Salbutamol', form: 'Aérosol', dosage: '100µg/dose', price: 4500, stock: 48, category: 'Bronchodilatateurs', requiresPrescription: true },
  { id: 'M-008', name: 'Acide folique 5mg', dci: 'Acide folique', form: 'Comprimé', dosage: '5mg', price: 600, stock: 380, category: 'Vitamines', requiresPrescription: false },
];

const sales: Sale[] = [
  { id: 'S-001', patient: 'Aïcha Diallo', items: [{ name: 'Metformine 850mg', qty: 60, price: 1200 }, { name: 'Amlodipine 5mg', qty: 30, price: 1800 }], total: 126000, insurance: 88200, patientShare: 37800, paymentMethod: 'insurance', time: '09:15', pharmacist: 'Ph. Koné', prescriptionId: 'ORD-2025-0812-001' },
  { id: 'S-002', patient: 'Moussa Traoré', items: [{ name: 'Paracétamol 1g', qty: 20, price: 800 }, { name: 'Ibuprofène 400mg', qty: 10, price: 900 }], total: 25000, insurance: 0, patientShare: 25000, paymentMethod: 'cash', time: '09:42', pharmacist: 'Ph. Bah' },
  { id: 'S-003', patient: 'Fatoumata Camara', items: [{ name: 'Acide folique 5mg', qty: 90, price: 600 }, { name: 'Oméprazole 20mg', qty: 30, price: 1500 }], total: 99000, insurance: 69300, patientShare: 29700, paymentMethod: 'mobile', time: '10:08', pharmacist: 'Ph. Koné', prescriptionId: 'ORD-2025-0812-002' },
  { id: 'S-004', patient: 'Ibrahima Kouyaté', items: [{ name: 'Amoxicilline 500mg', qty: 21, price: 2500 }], total: 52500, insurance: 36750, patientShare: 15750, paymentMethod: 'card', time: '10:35', pharmacist: 'Ph. Bah', prescriptionId: 'ORD-2025-0812-003' },
];

const prescriptions: Prescription[] = [
  { id: 'ORD-2025-0812-001', patient: 'Aïcha Diallo', physician: 'Dr. Sy', date: '12 août 2025', items: [{ name: 'Metformine 850mg — 60 cp', qty: 60, dispensed: true }, { name: 'Amlodipine 5mg — 30 cp', qty: 30, dispensed: true }], status: 'dispensed', insurance: 'IPRES' },
  { id: 'ORD-2025-0812-002', patient: 'Fatoumata Camara', physician: 'Dr. Diop', date: '12 août 2025', items: [{ name: 'Acide folique 5mg — 90 cp', qty: 90, dispensed: true }, { name: 'Oméprazole 20mg — 30 gel', qty: 30, dispensed: true }], status: 'dispensed', insurance: 'CSS' },
  { id: 'ORD-2025-0812-003', patient: 'Ibrahima Kouyaté', physician: 'Dr. Baldé', date: '12 août 2025', items: [{ name: 'Amoxicilline 500mg — 21 gel', qty: 21, dispensed: true }], status: 'dispensed', insurance: 'Aucune' },
  { id: 'ORD-2025-0811-004', patient: 'Mariama Bah', physician: 'Dr. Camara', date: '11 août 2025', items: [{ name: 'Morphine LP 10mg — 30 cp', qty: 30, dispensed: false }, { name: 'Ondansétron 8mg — 20 cp', qty: 20, dispensed: true }], status: 'partial', insurance: 'IPRES' },
  { id: 'ORD-2025-0810-005', patient: 'Oumar Diallo', physician: 'Dr. Diop', date: '10 août 2025', items: [{ name: 'Furosémide 40mg — 30 cp', qty: 30, dispensed: false }, { name: 'Spironolactone 25mg — 30 cp', qty: 30, dispensed: false }], status: 'pending', insurance: 'IPRES' },
];

const salesByHour = [
  { hour: '08h', sales: 8 },
  { hour: '09h', sales: 15 },
  { hour: '10h', sales: 22 },
  { hour: '11h', sales: 18 },
  { hour: '12h', sales: 12 },
  { hour: '13h', sales: 6 },
  { hour: '14h', sales: 14 },
  { hour: '15h', sales: 19 },
  { hour: '16h', sales: 11 },
];

const revenueByDay = [
  { day: 'Lun', revenue: 485000 },
  { day: 'Mar', revenue: 612000 },
  { day: 'Mer', revenue: 534000 },
  { day: 'Jeu', revenue: 698000 },
  { day: 'Ven', revenue: 721000 },
  { day: 'Sam', revenue: 389000 },
];

const paymentConfig = {
  cash: { label: 'Espèces', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  card: { label: 'Carte', bg: 'bg-blue-50', text: 'text-blue-700' },
  insurance: { label: 'Assurance', bg: 'bg-purple-50', text: 'text-purple-700' },
  mobile: { label: 'Mobile', bg: 'bg-amber-50', text: 'text-amber-700' },
};

const prescStatusConfig = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'En attente' },
  partial: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Partielle' },
  dispensed: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Délivrée' },
  expired: { bg: 'bg-red-50', text: 'text-red-700', label: 'Expirée' },
};

export default function PharmacyPOSContent() {
  const [activeTab, setActiveTab] = useState<Tab>('pos');
  const [cart, setCart] = useState<{ item: POSItem; qty: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'pos', label: 'Caisse', icon: 'ShoppingCartIcon' },
    { id: 'prescriptions', label: 'Ordonnances', icon: 'DocumentCheckIcon' },
    { id: 'inventory', label: 'Stock', icon: 'ArchiveBoxIcon' },
    { id: 'patients', label: 'Historique patients', icon: 'UsersIcon' },
    { id: 'cash', label: 'Caisse & Paiements', icon: 'BanknotesIcon' },
    { id: 'reports', label: 'Rapports', icon: 'DocumentChartBarIcon' },
  ];

  const filteredCatalog = catalog.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.dci.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cartTotal = cart.reduce((s, c) => s + c.item.price * c.qty, 0);

  const addToCart = (item: POSItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) return prev.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { item, qty: 1 }];
    });
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <Icon name="ArchiveBoxIcon" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Pharmacie — Point de Vente</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Délivrance, ordonnances, stock et caisse</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {[
            { label: 'Ventes aujourd\'hui', value: sales.length.toString(), color: '#f59e0b' },
            { label: 'CA du jour', value: `${(sales.reduce((s, v) => s + v.total, 0) / 1000).toFixed(0)}k FCFA`, color: '#10b981' },
            { label: 'Ordonnances', value: prescriptions.filter(p => p.status === 'pending').length.toString(), color: '#3b82f6' },
          ].map(kpi => (
            <div key={kpi.label} className="text-center">
              <p className="text-xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6 pt-4 border-b" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors"
            style={{ borderBottomColor: activeTab === tab.id ? '#f59e0b' : 'transparent', color: activeTab === tab.id ? '#d97706' : 'var(--muted-foreground)' }}
          >
            <Icon name={tab.icon as any} size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* POS TAB */}
        {activeTab === 'pos' && (
          <div className="flex gap-6 h-full">
            {/* Catalog */}
            <div className="flex-1">
              <div className="mb-4">
                <div className="relative">
                  <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                  <input
                    type="text"
                    placeholder="Rechercher médicament, DCI, catégorie..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border text-sm"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {filteredCatalog.map(item => (
                  <div key={item.id} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{item.name}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.dci} — {item.form}</p>
                      </div>
                      {item.requiresPrescription && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-red-50 text-red-700">Ord.</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold" style={{ color: '#f59e0b' }}>{item.price.toLocaleString()} FCFA</p>
                        <p className="text-xs" style={{ color: item.stock < 50 ? '#ef4444' : 'var(--muted-foreground)' }}>Stock : {item.stock}</p>
                      </div>
                      <button
                        onClick={() => addToCart(item)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                        style={{ backgroundColor: '#f59e0b' }}
                      >
                        <Icon name="PlusIcon" size={14} />
                        Ajouter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart */}
            <div className="w-80 shrink-0 rounded-xl border flex flex-col" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Panier de vente</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon name="ShoppingCartIcon" size={32} className="mx-auto mb-2" style={{ color: 'var(--muted-foreground)' }} />
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Panier vide</p>
                  </div>
                ) : (
                  cart.map(c => (
                    <div key={c.item.id} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate" style={{ color: 'var(--foreground)' }}>{c.item.name}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{(c.item.price * c.qty).toLocaleString()} FCFA</p>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          onClick={() => setCart(prev => prev.map(p => p.item.id === c.item.id ? { ...p, qty: Math.max(1, p.qty - 1) } : p))}
                          className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold border"
                          style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                        >-</button>
                        <span className="text-xs w-6 text-center" style={{ color: 'var(--foreground)' }}>{c.qty}</span>
                        <button
                          onClick={() => setCart(prev => prev.map(p => p.item.id === c.item.id ? { ...p, qty: p.qty + 1 } : p))}
                          className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold border"
                          style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                        >+</button>
                        <button
                          onClick={() => setCart(prev => prev.filter(p => p.item.id !== c.item.id))}
                          className="w-6 h-6 rounded flex items-center justify-center ml-1"
                          style={{ color: '#ef4444' }}
                        >
                          <Icon name="XMarkIcon" size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {cart.length > 0 && (
                <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex justify-between mb-1 text-sm">
                    <span style={{ color: 'var(--muted-foreground)' }}>Sous-total</span>
                    <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{cartTotal.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between mb-3 text-sm">
                    <span style={{ color: 'var(--muted-foreground)' }}>Part assurance (70%)</span>
                    <span className="font-semibold text-purple-600">{Math.round(cartTotal * 0.7).toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between mb-4 text-base font-bold">
                    <span style={{ color: 'var(--foreground)' }}>À payer</span>
                    <span style={{ color: '#f59e0b' }}>{Math.round(cartTotal * 0.3).toLocaleString()} FCFA</span>
                  </div>
                  <button className="w-full py-2.5 rounded-lg text-sm font-bold text-white" style={{ backgroundColor: '#f59e0b' }}>
                    Valider la vente
                  </button>
                  <button onClick={() => setCart([])} className="w-full py-2 rounded-lg text-sm font-medium mt-2 border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                    Vider le panier
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PRESCRIPTIONS TAB */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Ordonnances à délivrer</h2>
              <div className="flex gap-2">
                {['Toutes', 'En attente', 'Partielles'].map(f => (
                  <button key={f} className="px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>{f}</button>
                ))}
              </div>
            </div>
            {prescriptions.map(p => {
              const cfg = prescStatusConfig[p.status];
              return (
                <div key={p.id} className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{p.patient}</p>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Prescrit par {p.physician} — {p.date}</p>
                      <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{p.id}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">{p.insurance}</span>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    {p.items.map(item => (
                      <div key={item.name} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                        <span className="text-sm" style={{ color: 'var(--foreground)' }}>{item.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${item.dispensed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          {item.dispensed ? 'Délivré' : 'En attente'}
                        </span>
                      </div>
                    ))}
                  </div>
                  {p.status !== 'dispensed' && (
                    <button className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#f59e0b' }}>
                      Délivrer l'ordonnance
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Stock médicaments</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#f59e0b' }}>
                <Icon name="PlusIcon" size={16} />
                Réapprovisionnement
              </button>
            </div>
            <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border)' }}>
              <table className="w-full text-sm" style={{ backgroundColor: 'var(--card)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Médicament', 'DCI', 'Forme', 'Dosage', 'Stock', 'Prix', 'Catégorie', 'Ord.'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {catalog.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="py-3 px-4 font-medium" style={{ color: 'var(--foreground)' }}>{item.name}</td>
                      <td className="py-3 px-4 text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.dci}</td>
                      <td className="py-3 px-4 text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.form}</td>
                      <td className="py-3 px-4 text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.dosage}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                            <div className="h-1.5 rounded-full" style={{ width: `${Math.min(100, (item.stock / 600) * 100)}%`, backgroundColor: item.stock < 50 ? '#ef4444' : item.stock < 100 ? '#f59e0b' : '#10b981' }} />
                          </div>
                          <span className="text-xs" style={{ color: item.stock < 50 ? '#ef4444' : 'var(--foreground)' }}>{item.stock}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold" style={{ color: '#f59e0b' }}>{item.price.toLocaleString()} F</td>
                      <td className="py-3 px-4 text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.category}</td>
                      <td className="py-3 px-4">
                        {item.requiresPrescription ? (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-red-50 text-red-700">Oui</span>
                        ) : (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">Non</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PATIENTS TAB */}
        {activeTab === 'patients' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Historique des ventes — Aujourd'hui</h2>
            {sales.map(sale => {
              const pmCfg = paymentConfig[sale.paymentMethod];
              return (
                <div key={sale.id} className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{sale.patient}</p>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{sale.time} — {sale.pharmacist}</p>
                      {sale.prescriptionId && <p className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>Ord. : {sale.prescriptionId}</p>}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pmCfg.bg} ${pmCfg.text}`}>{pmCfg.label}</span>
                  </div>
                  <div className="space-y-1 mb-4">
                    {sale.items.map(item => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <span style={{ color: 'var(--foreground)' }}>{item.name} × {item.qty}</span>
                        <span style={{ color: 'var(--muted-foreground)' }}>{(item.price * item.qty).toLocaleString()} FCFA</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex gap-4 text-xs">
                      <span style={{ color: 'var(--muted-foreground)' }}>Total : <strong style={{ color: 'var(--foreground)' }}>{sale.total.toLocaleString()} FCFA</strong></span>
                      <span style={{ color: 'var(--muted-foreground)' }}>Assurance : <strong className="text-purple-600">{sale.insurance.toLocaleString()} FCFA</strong></span>
                      <span style={{ color: 'var(--muted-foreground)' }}>Patient : <strong style={{ color: '#f59e0b' }}>{sale.patientShare.toLocaleString()} FCFA</strong></span>
                    </div>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                      <Icon name="PrinterIcon" size={14} />
                      Reçu
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CASH TAB */}
        {activeTab === 'cash' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'CA total', value: `${(sales.reduce((s, v) => s + v.total, 0) / 1000).toFixed(0)}k FCFA`, color: '#f59e0b' },
                { label: 'Part assurance', value: `${(sales.reduce((s, v) => s + v.insurance, 0) / 1000).toFixed(0)}k FCFA`, color: '#8b5cf6' },
                { label: 'Encaissé patients', value: `${(sales.reduce((s, v) => s + v.patientShare, 0) / 1000).toFixed(0)}k FCFA`, color: '#10b981' },
                { label: 'Ventes', value: sales.length.toString(), color: '#3b82f6' },
              ].map(kpi => (
                <div key={kpi.label} className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Ventes par heure</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={salesByHour}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Ventes" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>CA journalier (FCFA)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={revenueByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v: number) => `${(v / 1000).toFixed(0)}k FCFA`} />
                    <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="CA" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Rapports Pharmacie</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: 'Rapport ventes journalier', desc: 'Détail ventes, paiements, pharmaciens' },
                { title: 'Rapport stock mensuel', desc: 'Inventaire, mouvements, ruptures' },
                { title: 'Rapport tiers-payant', desc: 'Remboursements assurances — août 2025' },
                { title: 'Rapport ordonnances', desc: 'Délivrances, refus, partielles' },
              ].map(r => (
                <div key={r.title} className="p-4 rounded-xl border flex items-center justify-between" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{r.title}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.desc}</p>
                  </div>
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                    <Icon name="ArrowDownTrayIcon" size={14} />
                    Export
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
