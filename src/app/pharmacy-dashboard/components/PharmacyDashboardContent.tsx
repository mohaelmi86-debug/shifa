'use client';
import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';

type TabKey = 'patients' | 'dispensing' | 'inventory' | 'orders' | 'billing';

interface RxPatient { id: string; name: string; age: number; doctor: string; drug: string; qty: string; status: 'en attente' | 'en cours' | 'dispensé' | 'refusé'; date: string; insurance: boolean; }
interface MedItem { id: string; name: string; form: string; lot: string; expiry: string; stock: number; min: number; unit: string; supplier: string; status: 'ok' | 'low' | 'expired' | 'expiring'; }
interface Order { id: string; supplier: string; items: number; total: string; status: 'brouillon' | 'envoyé' | 'confirmé' | 'livré'; date: string; }
interface BillItem { id: string; patient: string; drugs: string; amount: string; insurance: string; balance: string; status: 'payé' | 'en attente' | 'remboursement'; }

const rxPatients: RxPatient[] = [
  { id: 'RX-201', name: 'Oumar Diallo', age: 58, doctor: 'Dr. Sy', drug: 'Metformine 850mg + Amlodipine 5mg', qty: '30j', status: 'en cours', date: '10:20', insurance: true },
  { id: 'RX-202', name: 'Fatou Seck', age: 34, doctor: 'Dr. Ndiaye', drug: 'Amoxicilline 1g + Ibuprofène 400mg', qty: '7j', status: 'en attente', date: '10:45', insurance: false },
  { id: 'RX-203', name: 'Ibrahima Ba', age: 72, doctor: 'Dr. Diallo', drug: 'Furosémide 40mg + Spironolactone 25mg', qty: '30j', status: 'dispensé', date: '09:30', insurance: true },
  { id: 'RX-204', name: 'Mariama Koné', age: 26, doctor: 'Dr. Fall', drug: 'Acide folique 5mg + Fer 80mg', qty: '90j', status: 'dispensé', date: '09:15', insurance: true },
  { id: 'RX-205', name: 'Cheikh Mbaye', age: 45, doctor: 'Dr. Sow', drug: 'Atorvastatine 20mg', qty: '30j', status: 'en attente', date: '11:00', insurance: false },
];

const inventory: MedItem[] = [
  { id: 'M-001', name: 'Metformine 850mg', form: 'Comprimé', lot: 'L2024-089', expiry: '2027-03', stock: 480, min: 100, unit: 'cp', supplier: 'Pharma Sénégal', status: 'ok' },
  { id: 'M-002', name: 'Amoxicilline 1g', form: 'Comprimé', lot: 'L2024-112', expiry: '2026-09', stock: 45, min: 100, unit: 'cp', supplier: 'MedImport', status: 'low' },
  { id: 'M-003', name: 'Furosémide 40mg', form: 'Comprimé', lot: 'L2023-445', expiry: '2026-08', stock: 200, min: 50, unit: 'cp', supplier: 'Pharma Sénégal', status: 'expiring' },
  { id: 'M-004', name: 'Amlodipine 5mg', form: 'Comprimé', lot: 'L2024-201', expiry: '2027-06', stock: 320, min: 80, unit: 'cp', supplier: 'MedImport', status: 'ok' },
  { id: 'M-005', name: 'Acide folique 5mg', form: 'Comprimé', lot: 'L2024-078', expiry: '2025-12', stock: 60, min: 50, unit: 'cp', supplier: 'Dakar Pharma', status: 'expired' },
  { id: 'M-006', name: 'Atorvastatine 20mg', form: 'Comprimé', lot: 'L2024-156', expiry: '2027-01', stock: 150, min: 60, unit: 'cp', supplier: 'Pharma Sénégal', status: 'ok' },
  { id: 'M-007', name: 'Paracétamol 500mg', form: 'Comprimé', lot: 'L2024-300', expiry: '2027-08', stock: 1200, min: 200, unit: 'cp', supplier: 'Dakar Pharma', status: 'ok' },
];

const orders: Order[] = [
  { id: 'CMD-2024-089', supplier: 'Pharma Sénégal', items: 12, total: '485 000 FCFA', status: 'livré', date: '05/08/2026' },
  { id: 'CMD-2024-090', supplier: 'MedImport', items: 8, total: '312 000 FCFA', status: 'confirmé', date: '08/08/2026' },
  { id: 'CMD-2024-091', supplier: 'Dakar Pharma', items: 5, total: '128 500 FCFA', status: 'envoyé', date: '09/08/2026' },
  { id: 'CMD-2024-092', supplier: 'Pharma Sénégal', items: 15, total: '620 000 FCFA', status: 'brouillon', date: '10/08/2026' },
];

const billing: BillItem[] = [
  { id: 'FAC-501', patient: 'Oumar Diallo', drugs: 'Metformine + Amlodipine', amount: '8 500 FCFA', insurance: '6 800 FCFA', balance: '1 700 FCFA', status: 'en attente' },
  { id: 'FAC-502', patient: 'Fatou Seck', drugs: 'Amoxicilline + Ibuprofène', amount: '4 200 FCFA', insurance: '0 FCFA', balance: '4 200 FCFA', status: 'en attente' },
  { id: 'FAC-503', patient: 'Ibrahima Ba', drugs: 'Furosémide + Spironolactone', amount: '6 000 FCFA', insurance: '4 800 FCFA', balance: '1 200 FCFA', status: 'payé' },
  { id: 'FAC-504', patient: 'Mariama Koné', drugs: 'Acide folique + Fer', amount: '3 500 FCFA', insurance: '3 500 FCFA', balance: '0 FCFA', status: 'remboursement' },
];

const statusRxConfig: Record<string, { bg: string; color: string }> = {
  'en attente': { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)' },
  'en cours': { bg: 'rgba(0,102,255,0.10)', color: 'var(--shifa-blue)' },
  'dispensé': { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' },
  'refusé': { bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)' },
};

const stockStatusConfig = {
  ok: { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)', label: 'OK' },
  low: { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)', label: 'Stock bas' },
  expiring: { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)', label: 'Exp. proche' },
  expired: { bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)', label: 'Périmé' },
};

const orderStatusConfig: Record<string, { bg: string; color: string }> = {
  brouillon: { bg: 'rgba(156,163,175,0.15)', color: 'var(--muted-foreground)' },
  envoyé: { bg: 'rgba(0,102,255,0.10)', color: 'var(--shifa-blue)' },
  confirmé: { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)' },
  livré: { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' },
};

const billStatusConfig: Record<string, { bg: string; color: string }> = {
  payé: { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' },
  'en attente': { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)' },
  remboursement: { bg: 'rgba(0,102,255,0.10)', color: 'var(--shifa-blue)' },
};

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'patients', label: 'Ordonnances', icon: 'DocumentTextIcon' },
  { key: 'dispensing', label: 'Dispensation', icon: 'ArchiveBoxIcon' },
  { key: 'inventory', label: 'Stock', icon: 'ClipboardDocumentListIcon' },
  { key: 'orders', label: 'Commandes', icon: 'TruckIcon' },
  { key: 'billing', label: 'Facturation', icon: 'BanknotesIcon' },
];

export default function PharmacyDashboardContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('patients');
  const [posTransactions, setPosTransactions] = useState<any[]>([]);
  const [posLoading, setPosLoading] = useState(false);
  const [posError, setPosError] = useState('');

  useEffect(() => {
    if (activeTab === 'dispensing') {
      fetchPosTransactions();
    }
  }, [activeTab]);

  const fetchPosTransactions = async () => {
    setPosLoading(true);
    setPosError('');
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('pharmacy_pos_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      setPosTransactions(data || []);
    } catch (err: any) {
      setPosError(err?.message || 'Erreur lors du chargement des transactions.');
    } finally {
      setPosLoading(false);
    }
  };

  const kpis = [
    { label: 'Ordonnances du jour', value: String(rxPatients.length), icon: 'DocumentTextIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
    { label: 'En attente dispensation', value: String(rxPatients.filter(r => r.status === 'en attente').length), icon: 'ClockIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)' },
    { label: 'Médicaments stock bas', value: String(inventory.filter(m => m.status === 'low' || m.status === 'expired').length), icon: 'ExclamationTriangleIcon', color: 'var(--shifa-red)', bg: 'rgba(239,68,68,0.08)' },
    { label: 'Commandes en cours', value: String(orders.filter(o => o.status !== 'livré').length), icon: 'TruckIcon', color: 'var(--shifa-purple)', bg: 'rgba(123,94,167,0.08)' },
  ];

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      {/* Premium Page Header — SHIFA design tokens */}
      <div
        className="relative rounded-2xl overflow-hidden mb-8 p-6 lg:p-8"
        style={{
          background: 'linear-gradient(135deg, #0D4F3C 0%, #0D9E6E 55%, #00F2C3 100%)',
          boxShadow: '0 8px 32px rgba(13,158,110,0.3)',
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.04)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.03)', transform: 'translateY(40%)' }} />

        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
            >
              <Icon name="ArchiveBoxIcon" size={26} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}>
                  Pharmacie hospitalière
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>
                Tableau de bord Pharmacie
              </h1>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.72)' }}>
                Ordonnances, dispensation, stock, commandes et facturation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Icon name="ArrowDownTrayIcon" size={15} />
              Exporter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'rgba(255,255,255,0.95)', color: '#0D4F3C' }}>
              <Icon name="PlusIcon" size={15} />
              Nouvelle dispensation
            </button>
          </div>
        </div>

        {/* Quick stats bar */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="rounded-xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div className="flex items-center gap-2 mb-1">
                <Icon name={kpi.icon as any} size={14} className="text-white opacity-80" />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{kpi.label}</span>
              </div>
              <p className="text-xl font-bold text-white">{kpi.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin mb-6 pb-1">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-150 ${activeTab === tab.key ? 'shadow-shifa' : ''}`}
            style={{ backgroundColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--card)', color: activeTab === tab.key ? 'white' : 'var(--muted-foreground)', borderColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--border)' }}>
            <Icon name={tab.icon as any} size={15} />{tab.label}
          </button>
        ))}
      </div>

      {/* Ordonnances Tab */}
      {activeTab === 'patients' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Ordonnances du jour</h3>
            <button className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"><Icon name="PlusIcon" size={13} />Nouvelle</button>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {rxPatients.map((rx) => (
              <div key={rx.id} className="p-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(13,158,110,0.1)' }}>
                    <Icon name="DocumentTextIcon" size={16} style={{ color: 'var(--shifa-green)' }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold" style={{ color: 'var(--shifa-dark)' }}>{rx.name}</p>
                      <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{rx.id}</span>
                      {rx.insurance && <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)' }}>Assuré</span>}
                    </div>
                    <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>{rx.doctor} · {rx.date}</p>
                    <p className="text-xs" style={{ color: 'var(--foreground)' }}>{rx.drug} · {rx.qty}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold shrink-0" style={{ backgroundColor: statusRxConfig[rx.status]?.bg, color: statusRxConfig[rx.status]?.color }}>
                  {rx.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dispensation Tab — Supabase */}
      {activeTab === 'dispensing' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Transactions POS (pharmacy_pos_transactions)</h3>
            <button onClick={fetchPosTransactions} className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5">
              <Icon name="ArrowPathIcon" size={13} className={posLoading ? 'animate-spin' : ''} />
              Actualiser
            </button>
          </div>

          {posLoading && (
            <div className="p-12 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--shifa-green)', borderTopColor: 'transparent' }} />
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Chargement des transactions…</p>
            </div>
          )}

          {!posLoading && posError && (
            <div className="p-8 flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}>
                <Icon name="ExclamationCircleIcon" size={24} style={{ color: 'var(--shifa-red)' }} />
              </div>
              <p className="text-sm font-semibold" style={{ color: 'var(--shifa-red)' }}>Erreur de chargement</p>
              <p className="text-xs text-center" style={{ color: 'var(--muted-foreground)' }}>{posError}</p>
              <button onClick={fetchPosTransactions} className="btn-primary text-xs px-4 py-2">Réessayer</button>
            </div>
          )}

          {!posLoading && !posError && posTransactions.length === 0 && (
            <div className="p-12 flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(13,158,110,0.08)' }}>
                <Icon name="ArchiveBoxIcon" size={26} style={{ color: 'var(--shifa-green)' }} />
              </div>
              <p className="text-sm font-semibold" style={{ color: 'var(--shifa-dark)' }}>Aucune transaction enregistrée</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Les transactions POS apparaîtront ici.</p>
            </div>
          )}

          {!posLoading && !posError && posTransactions.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--shifa-surface)' }}>
                    {['ID', 'Statut', 'Total', 'Créé le'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {posTransactions.map((t: any, i: number) => (
                    <tr key={t.id} className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--shifa-surface)' }}>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{t.id?.slice(0, 8)}…</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{t.status || '—'}</td>
                      <td className="px-4 py-3 text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{t.total_amount ? `${t.total_amount} FCFA` : '—'}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{t.created_at ? new Date(t.created_at).toLocaleDateString('fr-FR') : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Stock médicaments</h3>
            <button className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"><Icon name="PlusIcon" size={13} />Ajouter</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--shifa-surface)' }}>
                  {['Médicament', 'Forme', 'Lot', 'Expiration', 'Stock', 'Min', 'Fournisseur', 'Statut'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inventory.map((m, i) => (
                  <tr key={m.id} className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--shifa-surface)' }}>
                    <td className="px-4 py-3 font-semibold text-sm" style={{ color: 'var(--shifa-dark)' }}>{m.name}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.form}</td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{m.lot}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.expiry}</td>
                    <td className="px-4 py-3 text-sm font-bold" style={{ color: m.stock < m.min ? 'var(--shifa-red)' : 'var(--shifa-dark)' }}>{m.stock} {m.unit}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.min}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.supplier}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: stockStatusConfig[m.status].bg, color: stockStatusConfig[m.status].color }}>
                        {stockStatusConfig[m.status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Commandes fournisseurs</h3>
            <button className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"><Icon name="PlusIcon" size={13} />Nouvelle commande</button>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {orders.map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(13,158,110,0.1)' }}>
                    <Icon name="TruckIcon" size={16} style={{ color: 'var(--shifa-green)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--shifa-dark)' }}>{order.id}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{order.supplier} · {order.items} articles · {order.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>{order.total}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: orderStatusConfig[order.status]?.bg, color: orderStatusConfig[order.status]?.color }}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Facturation patients</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--shifa-surface)' }}>
                  {['Patient', 'Médicaments', 'Montant', 'Assurance', 'Reste à payer', 'Statut'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {billing.map((b, i) => (
                  <tr key={b.id} className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--shifa-surface)' }}>
                    <td className="px-4 py-3 font-semibold text-sm" style={{ color: 'var(--shifa-dark)' }}>{b.patient}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{b.drugs}</td>
                    <td className="px-4 py-3 text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{b.amount}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--shifa-blue)' }}>{b.insurance}</td>
                    <td className="px-4 py-3 text-xs font-bold" style={{ color: 'var(--shifa-dark)' }}>{b.balance}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: billStatusConfig[b.status]?.bg, color: billStatusConfig[b.status]?.color }}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
