'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';


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

const kpis = [
  { label: 'Ordonnances du jour', value: '34', icon: 'DocumentTextIcon', color: 'var(--shifa-blue)' },
  { label: 'En attente dispensation', value: '7', icon: 'ClockIcon', color: 'var(--shifa-amber)' },
  { label: 'Médicaments stock bas', value: '3', icon: 'ExclamationTriangleIcon', color: 'var(--shifa-red)' },
  { label: 'Lots expirant < 30j', value: '2', icon: 'CalendarDaysIcon', color: 'var(--shifa-amber)' },
  { label: 'Commandes en cours', value: '2', icon: 'TruckIcon', color: 'var(--shifa-purple)' },
  { label: 'Recettes du jour', value: '142K', icon: 'BanknotesIcon', color: 'var(--shifa-green)' },
];

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'patients', label: 'Patients & Ordonnances', icon: 'UsersIcon' },
  { key: 'dispensing', label: 'Dispensation', icon: 'DocumentCheckIcon' },
  { key: 'inventory', label: 'Stock & Lots', icon: 'ArchiveBoxIcon' },
  { key: 'orders', label: 'Fournisseurs & Commandes', icon: 'TruckIcon' },
  { key: 'billing', label: 'Facturation', icon: 'BanknotesIcon' },
];

export default function PharmacyDashboardContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('patients');

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--shifa-green), var(--shifa-cyan))' }}>
              <Icon name="ArchiveBoxIcon" size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>Pharmacie Hospitalière</h1>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Gestion médicaments, dispensation & facturation</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-sm flex items-center gap-1.5 px-3 py-1.5"><Icon name="ArrowDownTrayIcon" size={14} /> Export</button>
            <button className="btn-primary text-sm flex items-center gap-1.5 px-3 py-1.5"><Icon name="PlusIcon" size={14} /> Nouvelle dispensation</button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="px-6 py-4 grid grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="card p-3 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <Icon name={k.icon as any} size={16} style={{ color: k.color }} />
              <span className="text-xl font-bold" style={{ color: k.color, fontFamily: 'var(--font-display)' }}>{k.value}</span>
            </div>
            <p className="text-xs leading-tight" style={{ color: 'var(--muted-foreground)' }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-6 border-b flex gap-1" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === t.key ? 'border-[var(--shifa-green)] text-[var(--shifa-green)]' : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}>
            <Icon name={t.icon as any} size={14} />{t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">

        {/* PATIENTS & PRESCRIPTIONS */}
        {activeTab === 'patients' && (
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>File d'attente — Ordonnances du jour</h3>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{rxPatients.length} ordonnances</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Réf.', 'Patient', 'Médecin', 'Médicaments prescrits', 'Durée', 'Assurance', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rxPatients.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: i < rxPatients.length - 1 ? '1px solid var(--border)' : 'none' }} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--shifa-green)' }}>{p.id}</td>
                    <td className="px-4 py-3"><p className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{p.name}</p><p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.age} ans</p></td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.doctor}</td>
                    <td className="px-4 py-3 text-xs max-w-xs" style={{ color: 'var(--foreground)' }}>{p.drug}</td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{p.qty}</td>
                    <td className="px-4 py-3">
                      {p.insurance ? <span className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' }}>Oui</span> : <span className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: 'rgba(156,163,175,0.15)', color: 'var(--muted-foreground)' }}>Non</span>}
                    </td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: statusRxConfig[p.status].bg, color: statusRxConfig[p.status].color }}>{p.status}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="p-1 rounded hover:bg-muted" title="Dispenser"><Icon name="CheckCircleIcon" size={14} style={{ color: 'var(--shifa-green)' }} /></button>
                        <button className="p-1 rounded hover:bg-muted" title="Voir"><Icon name="EyeIcon" size={14} style={{ color: 'var(--shifa-blue)' }} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* DISPENSING */}
        {activeTab === 'dispensing' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card p-4">
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Dispensation en cours — RX-201</h3>
              <div className="p-3 rounded-xl mb-3" style={{ backgroundColor: 'var(--muted)' }}>
                <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Oumar Diallo, 58 ans</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Prescrit par Dr. Sy — 10:20</p>
              </div>
              {['Metformine 850mg — 30 comprimés', 'Amlodipine 5mg — 30 comprimés'].map((drug, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border mb-2" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{drug.split(' — ')[0]}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{drug.split(' — ')[1]}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' }}>En stock</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  </div>
                </div>
              ))}
              <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-white mt-2" style={{ backgroundColor: 'var(--shifa-green)' }}>Confirmer la dispensation</button>
            </div>
            <div className="card p-4">
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Historique dispensations — Aujourd'hui</h3>
              <div className="space-y-2">
                {rxPatients.filter(p => p.status === 'dispensé').map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                    <div>
                      <p className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.drug.substring(0, 40)}…</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' }}>Dispensé</span>
                      <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--muted-foreground)' }}>{p.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* INVENTORY */}
        {activeTab === 'inventory' && (
          <div>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Références actives', count: inventory.length, color: 'var(--shifa-blue)' },
                { label: 'Stock bas', count: inventory.filter(m => m.status === 'low').length, color: 'var(--shifa-amber)' },
                { label: 'Expirant bientôt', count: inventory.filter(m => m.status === 'expiring').length, color: 'var(--shifa-amber)' },
                { label: 'Périmés', count: inventory.filter(m => m.status === 'expired').length, color: 'var(--shifa-red)' },
              ].map(s => (
                <div key={s.label} className="card p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}18` }}>
                    <Icon name="ArchiveBoxIcon" size={16} style={{ color: s.color }} />
                  </div>
                  <div>
                    <p className="text-xl font-bold" style={{ color: s.color, fontFamily: 'var(--font-display)' }}>{s.count}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Médicament', 'Forme', 'N° Lot', 'Expiration', 'Stock', 'Stock min.', 'Fournisseur', 'Statut'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((m, i) => (
                    <tr key={m.id} style={{ borderBottom: i < inventory.length - 1 ? '1px solid var(--border)' : 'none', backgroundColor: m.status === 'expired' ? 'rgba(239,68,68,0.03)' : 'transparent' }} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-sm" style={{ color: 'var(--foreground)' }}>{m.name}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.form}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--shifa-blue)' }}>{m.lot}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: m.status === 'expired' ? 'var(--shifa-red)' : m.status === 'expiring' ? 'var(--shifa-amber)' : 'var(--muted-foreground)' }}>{m.expiry}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm" style={{ color: m.stock < m.min ? 'var(--shifa-red)' : 'var(--foreground)' }}>{m.stock}</span>
                          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.unit}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{m.min} {m.unit}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.supplier}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: stockStatusConfig[m.status].bg, color: stockStatusConfig[m.status].color }}>{stockStatusConfig[m.status].label}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 card overflow-hidden">
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Commandes fournisseurs</h3>
                <button className="btn-primary text-xs px-2.5 py-1 flex items-center gap-1"><Icon name="PlusIcon" size={12} /> Nouvelle commande</button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Réf. commande', 'Fournisseur', 'Articles', 'Montant total', 'Date', 'Statut'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => (
                    <tr key={o.id} style={{ borderBottom: i < orders.length - 1 ? '1px solid var(--border)' : 'none' }} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--shifa-green)' }}>{o.id}</td>
                      <td className="px-4 py-3 font-medium text-sm" style={{ color: 'var(--foreground)' }}>{o.supplier}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{o.items} articles</td>
                      <td className="px-4 py-3 font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{o.total}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{o.date}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: orderStatusConfig[o.status].bg, color: orderStatusConfig[o.status].color }}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card p-4">
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Fournisseurs actifs</h3>
              {['Pharma Sénégal', 'MedImport', 'Dakar Pharma'].map(s => (
                <div key={s} className="flex items-center justify-between p-3 rounded-xl mb-2" style={{ backgroundColor: 'var(--muted)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(0,102,255,0.1)' }}>
                      <Icon name="BuildingStorefrontIcon" size={14} style={{ color: 'var(--shifa-blue)' }} />
                    </div>
                    <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{s}</p>
                  </div>
                  <button className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' }}>Commander</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BILLING */}
        {activeTab === 'billing' && (
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Facturation — Dispensations du jour</h3>
              <div className="flex gap-2">
                <span className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--shifa-green)' }}>Total encaissé : 142 000 FCFA</span>
              </div>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Réf.', 'Patient', 'Médicaments', 'Montant total', 'Part assurance', 'Reste à payer', 'Statut', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {billing.map((b, i) => (
                  <tr key={b.id} style={{ borderBottom: i < billing.length - 1 ? '1px solid var(--border)' : 'none' }} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--shifa-green)' }}>{b.id}</td>
                    <td className="px-4 py-3 font-medium text-sm" style={{ color: 'var(--foreground)' }}>{b.patient}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{b.drugs}</td>
                    <td className="px-4 py-3 font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{b.amount}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--shifa-blue)' }}>{b.insurance}</td>
                    <td className="px-4 py-3 font-bold text-sm" style={{ color: b.balance === '0 FCFA' ? 'var(--shifa-green)' : 'var(--shifa-amber)' }}>{b.balance}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: billStatusConfig[b.status].bg, color: billStatusConfig[b.status].color }}>{b.status}</span></td>
                    <td className="px-4 py-3"><button className="text-xs px-2.5 py-1 rounded-lg font-medium text-white" style={{ backgroundColor: 'var(--shifa-green)' }}>Encaisser</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
