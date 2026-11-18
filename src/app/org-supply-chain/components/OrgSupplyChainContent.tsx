'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type TabKey = 'dashboard' | 'requests' | 'quotes' | 'orders' | 'receiving' | 'stock' | 'alerts';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Tableau de bord', icon: 'Squares2X2Icon' },
  { key: 'requests', label: 'Demandes d\'achat', icon: 'DocumentPlusIcon' },
  { key: 'quotes', label: 'Devis & Appels d\'offres', icon: 'DocumentTextIcon' },
  { key: 'orders', label: 'Bons de commande', icon: 'ShoppingCartIcon' },
  { key: 'receiving', label: 'Réception & Lots', icon: 'ArchiveBoxIcon' },
  { key: 'stock', label: 'Stock & Péremption', icon: 'ClipboardDocumentListIcon' },
  { key: 'alerts', label: 'Alertes & Seuils', icon: 'BellAlertIcon' },
];

const kpis = [
  { label: 'DA en attente', value: '12', sub: '3 urgentes', icon: 'DocumentPlusIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)' },
  { label: 'Commandes en cours', value: '8', sub: 'Valeur: 14.2M FCFA', icon: 'ShoppingCartIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Produits sous seuil', value: '7', sub: 'Réapprovisionnement requis', icon: 'ExclamationTriangleIcon', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
  { label: 'Péremptions < 30j', value: '4', sub: 'Action requise', icon: 'ClockIcon', color: 'var(--shifa-purple)', bg: 'rgba(139,92,246,0.08)' },
];

const purchaseRequests = [
  { id: 'DA-2026-089', title: 'Médicaments urgences — réapprovisionnement', requestedBy: 'Dr. Mbaye', dept: 'Urgences', date: '10/08/2026', amount: '2 400 000 FCFA', priority: 'urgent', status: 'pending', items: 8 },
  { id: 'DA-2026-088', title: 'Consommables laboratoire Q3', requestedBy: 'Inf. Sow', dept: 'Laboratoire', date: '09/08/2026', amount: '1 850 000 FCFA', priority: 'normal', status: 'approved', items: 15 },
  { id: 'DA-2026-087', title: 'Équipements de protection individuelle', requestedBy: 'Admin. Diallo', dept: 'Administration', date: '08/08/2026', amount: '680 000 FCFA', priority: 'normal', status: 'quote_requested', items: 5 },
  { id: 'DA-2026-086', title: 'Réactifs biochimie — Roche', requestedBy: 'Inf. Ndiaye', dept: 'Laboratoire', date: '07/08/2026', amount: '3 200 000 FCFA', priority: 'haute', status: 'ordered', items: 12 },
  { id: 'DA-2026-085', title: 'Matériel chirurgical stérile', requestedBy: 'Dr. Ndiaye', dept: 'Chirurgie', date: '06/08/2026', amount: '5 100 000 FCFA', priority: 'normal', status: 'received', items: 22 },
];

const quotes = [
  { id: 'DEV-2026-034', da: 'DA-2026-087', supplier: 'MedSupply Dakar', amount: '680 000 FCFA', validUntil: '25/08/2026', status: 'pending_review', deliveryDays: 5 },
  { id: 'DEV-2026-033', da: 'DA-2026-087', supplier: 'PharmaCo Sénégal', amount: '720 000 FCFA', validUntil: '20/08/2026', status: 'pending_review', deliveryDays: 3 },
  { id: 'DEV-2026-032', da: 'DA-2026-088', supplier: 'BioLab Afrique', amount: '1 850 000 FCFA', validUntil: '30/08/2026', status: 'accepted', deliveryDays: 7 },
  { id: 'DEV-2026-031', da: 'DA-2026-086', supplier: 'Roche Diagnostics', amount: '3 200 000 FCFA', validUntil: '15/09/2026', status: 'accepted', deliveryDays: 14 },
];

const orders = [
  { id: 'BC-2026-021', da: 'DA-2026-086', supplier: 'Roche Diagnostics', amount: '3 200 000 FCFA', orderedDate: '08/08/2026', expectedDelivery: '22/08/2026', status: 'confirmed', items: 12 },
  { id: 'BC-2026-020', da: 'DA-2026-085', supplier: 'MedSurg International', amount: '5 100 000 FCFA', orderedDate: '07/08/2026', expectedDelivery: '14/08/2026', status: 'in_transit', items: 22 },
  { id: 'BC-2026-019', da: 'DA-2026-084', supplier: 'Oxygène Médical SA', amount: '1 200 000 FCFA', orderedDate: '05/08/2026', expectedDelivery: '12/08/2026', status: 'delivered', items: 3 },
  { id: 'BC-2026-018', da: 'DA-2026-083', supplier: 'PharmaCo Sénégal', amount: '890 000 FCFA', orderedDate: '01/08/2026', expectedDelivery: '10/08/2026', status: 'delivered', items: 8 },
];

const stockItems = [
  { id: 'STK-001', name: 'Amoxicilline 500mg', category: 'Antibiotiques', lot: 'LOT-2024-A8', qty: 240, unit: 'boîtes', minStock: 100, expiry: '15/03/2027', status: 'ok' },
  { id: 'STK-002', name: 'Sérum physiologique 500mL', category: 'Perfusion', lot: 'LOT-2025-B2', qty: 45, unit: 'poches', minStock: 80, expiry: '30/09/2026', status: 'low' },
  { id: 'STK-003', name: 'Gants latex M', category: 'EPI', lot: 'LOT-2025-C1', qty: 12, unit: 'boîtes', minStock: 50, expiry: '01/01/2028', status: 'critical' },
  { id: 'STK-004', name: 'Morphine 10mg/mL', category: 'Stupéfiants', lot: 'LOT-2025-D4', qty: 28, unit: 'ampoules', minStock: 20, expiry: '30/08/2026', status: 'expiring' },
  { id: 'STK-005', name: 'Paracétamol 1g IV', category: 'Antalgiques', lot: 'LOT-2025-E3', qty: 180, unit: 'flacons', minStock: 60, expiry: '15/12/2026', status: 'ok' },
  { id: 'STK-006', name: 'Insuline Glargine', category: 'Diabétologie', lot: 'LOT-2025-F1', qty: 8, unit: 'stylos', minStock: 15, expiry: '20/09/2026', status: 'critical' },
];

const alerts = [
  { id: 'ALT-001', type: 'stock_critical', product: 'Gants latex M', message: 'Stock critique: 12 boîtes (seuil: 50)', severity: 'critical', date: '10/08/2026' },
  { id: 'ALT-002', type: 'stock_critical', product: 'Insuline Glargine', message: 'Stock critique: 8 stylos (seuil: 15)', severity: 'critical', date: '10/08/2026' },
  { id: 'ALT-003', type: 'expiry', product: 'Morphine 10mg/mL', message: 'Péremption dans 20 jours — LOT-2025-D4', severity: 'warning', date: '10/08/2026' },
  { id: 'ALT-004', type: 'stock_low', product: 'Sérum physiologique 500mL', message: 'Stock bas: 45 poches (seuil: 80)', severity: 'warning', date: '09/08/2026' },
  { id: 'ALT-005', type: 'expiry', product: 'Sérum physiologique 500mL', message: 'Péremption dans 51 jours — LOT-2025-B2', severity: 'info', date: '09/08/2026' },
];

const spendData = [
  { month: 'Mar', spend: 8.2 }, { month: 'Avr', spend: 11.4 }, { month: 'Mai', spend: 9.8 }, { month: 'Jun', spend: 13.2 }, { month: 'Jul', spend: 10.6 }, { month: 'Aoû', spend: 14.2 },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  pending: { label: 'En attente', bg: '#fef9c3', color: '#ca8a04' },
  approved: { label: 'Approuvée', bg: '#dcfce7', color: '#16a34a' },
  quote_requested: { label: 'Devis demandé', bg: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' },
  ordered: { label: 'Commandée', bg: 'rgba(139,92,246,0.1)', color: '#7c3aed' },
  received: { label: 'Reçue', bg: '#dcfce7', color: '#16a34a' },
  pending_review: { label: 'À évaluer', bg: '#fef9c3', color: '#ca8a04' },
  accepted: { label: 'Accepté', bg: '#dcfce7', color: '#16a34a' },
  confirmed: { label: 'Confirmée', bg: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' },
  in_transit: { label: 'En transit', bg: 'rgba(139,92,246,0.1)', color: '#7c3aed' },
  delivered: { label: 'Livrée', bg: '#dcfce7', color: '#16a34a' },
  ok: { label: 'OK', bg: '#dcfce7', color: '#16a34a' },
  low: { label: 'Bas', bg: '#fef9c3', color: '#ca8a04' },
  critical: { label: 'Critique', bg: '#fee2e2', color: '#dc2626' },
  expiring: { label: 'Péremption proche', bg: '#ede9fe', color: '#7c3aed' },
};

export default function OrgSupplyChainContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '4px' }}>Chaîne d'Approvisionnement</h1>
        <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>Workflow complet DA → Devis → BC → Réception · Gestion des lots et péremptions</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {kpis.map(kpi => (
          <div key={kpi.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={kpi.icon} size={20} color={kpi.color} />
            </div>
            <div>
              <p style={{ fontSize: '24px', fontWeight: 700, color: kpi.color, lineHeight: 1 }}>{kpi.value}</p>
              <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', marginTop: '4px' }}>{kpi.label}</p>
              <p style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: activeTab === tab.key ? 700 : 500, background: activeTab === tab.key ? 'var(--shifa-blue)' : 'transparent', color: activeTab === tab.key ? '#fff' : 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>
            <Icon name={tab.icon} size={13} />{tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Dépenses mensuelles (M FCFA)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={spendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`${v}M FCFA`, 'Dépenses']} />
                <Bar dataKey="spend" fill="var(--shifa-blue)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Pipeline d'approvisionnement</h3>
            {[
              { label: 'DA en attente d\'approbation', count: 3, color: '#ca8a04' },
              { label: 'Devis en cours d\'évaluation', count: 2, color: 'var(--shifa-blue)' },
              { label: 'Commandes confirmées', count: 2, color: '#7c3aed' },
              { label: 'Livraisons attendues', count: 1, color: 'var(--shifa-green)' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <p style={{ fontSize: '13px', color: 'var(--foreground)' }}>{item.label}</p>
                <span style={{ fontSize: '18px', fontWeight: 700, color: item.color }}>{item.count}</span>
              </div>
            ))}
          </div>
          <div style={{ gridColumn: 'span 2', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Alertes actives</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {alerts.slice(0, 3).map(alert => (
                <div key={alert.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px 12px', background: alert.severity === 'critical' ? '#fee2e2' : alert.severity === 'warning' ? '#fef9c3' : '#dbeafe', borderRadius: '8px' }}>
                  <Icon name="ExclamationTriangleIcon" size={16} color={alert.severity === 'critical' ? '#dc2626' : alert.severity === 'warning' ? '#ca8a04' : '#1d4ed8'} />
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>{alert.product}</p>
                    <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Purchase Requests */}
      {activeTab === 'requests' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Demandes d'achat (DA)</h3>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'var(--shifa-blue)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              <Icon name="PlusIcon" size={14} /> Nouvelle DA
            </button>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--muted)' }}>
                  {['N° DA', 'Titre', 'Demandeur', 'Service', 'Montant estimé', 'Priorité', 'Statut', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {purchaseRequests.map(req => {
                  const sc = statusConfig[req.status];
                  return (
                    <tr key={req.id} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 700, color: 'var(--shifa-blue)' }}>{req.id}</td>
                      <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600 }}>{req.title}</td>
                      <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--muted-foreground)' }}>{req.requestedBy}</td>
                      <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--muted-foreground)' }}>{req.dept}</td>
                      <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600 }}>{req.amount}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, background: req.priority === 'urgent' ? '#fee2e2' : req.priority === 'haute' ? '#fef9c3' : '#f3f4f6', color: req.priority === 'urgent' ? '#dc2626' : req.priority === 'haute' ? '#ca8a04' : '#6b7280' }}>{req.priority}</span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, background: sc.bg, color: sc.color }}>{sc.label}</span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        {req.status === 'pending' && (
                          <button style={{ padding: '4px 10px', background: 'var(--shifa-green)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>Approuver</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quotes */}
      {activeTab === 'quotes' && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Devis & Appels d'offres</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {quotes.map(q => {
              const sc = statusConfig[q.status];
              return (
                <div key={q.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)' }}>{q.id}</p>
                      <span style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>→ {q.da}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--foreground)', fontWeight: 600 }}>{q.supplier}</p>
                    <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Valide jusqu'au {q.validUntil} · Délai: {q.deliveryDays}j</p>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--foreground)' }}>{q.amount}</p>
                    <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: sc.bg, color: sc.color }}>{sc.label}</span>
                    {q.status === 'pending_review' && (
                      <button style={{ padding: '6px 12px', background: 'var(--shifa-green)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Accepter</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Orders */}
      {activeTab === 'orders' && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Bons de commande</h3>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--muted)' }}>
                  {['N° BC', 'DA', 'Fournisseur', 'Montant', 'Date commande', 'Livraison prévue', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(ord => {
                  const sc = statusConfig[ord.status];
                  return (
                    <tr key={ord.id} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 700, color: 'var(--shifa-blue)' }}>{ord.id}</td>
                      <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--muted-foreground)' }}>{ord.da}</td>
                      <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600 }}>{ord.supplier}</td>
                      <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600 }}>{ord.amount}</td>
                      <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--muted-foreground)' }}>{ord.orderedDate}</td>
                      <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--muted-foreground)' }}>{ord.expectedDelivery}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, background: sc.bg, color: sc.color }}>{sc.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Receiving */}
      {activeTab === 'receiving' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Réception & Gestion des lots</h3>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'var(--shifa-blue)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              <Icon name="PlusIcon" size={14} /> Enregistrer réception
            </button>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <p style={{ fontSize: '14px', color: 'var(--muted-foreground)', marginBottom: '16px' }}>Livraison en attente de réception : <strong>BC-2026-020</strong> — MedSurg International</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              {[{ l: 'N° BC', v: 'BC-2026-020' }, { l: 'Fournisseur', v: 'MedSurg International' }, { l: 'Date livraison prévue', v: '14/08/2026' }, { l: 'Articles attendus', v: '22 références' }].map(f => (
                <div key={f.l} style={{ padding: '10px 12px', background: 'var(--muted)', borderRadius: '8px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '2px' }}>{f.l}</p>
                  <p style={{ fontSize: '13px', fontWeight: 600 }}>{f.v}</p>
                </div>
              ))}
            </div>
            <div style={{ padding: '16px', background: '#fef9c3', borderRadius: '8px', border: '1px solid #fde68a' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#92400e' }}>À la réception, vérifier :</p>
              <ul style={{ marginTop: '8px', paddingLeft: '16px', fontSize: '13px', color: '#92400e', lineHeight: '1.8' }}>
                <li>Conformité des articles avec le BC</li>
                <li>Numéros de lot et dates de péremption</li>
                <li>État des emballages et conditions de transport</li>
                <li>Températures pour les produits thermosensibles</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Stock */}
      {activeTab === 'stock' && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Stock & Dates de péremption</h3>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--muted)' }}>
                  {['Produit', 'Catégorie', 'N° Lot', 'Quantité', 'Stock min.', 'Péremption', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stockItems.map(item => {
                  const sc = statusConfig[item.status];
                  return (
                    <tr key={item.id} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600 }}>{item.name}</td>
                      <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--muted-foreground)' }}>{item.category}</td>
                      <td style={{ padding: '12px 14px', fontSize: '12px', fontFamily: 'monospace', color: 'var(--muted-foreground)' }}>{item.lot}</td>
                      <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 700, color: item.qty < item.minStock ? '#dc2626' : 'var(--foreground)' }}>{item.qty} {item.unit}</td>
                      <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--muted-foreground)' }}>{item.minStock} {item.unit}</td>
                      <td style={{ padding: '12px 14px', fontSize: '12px', color: item.status === 'expiring' ? '#7c3aed' : 'var(--muted-foreground)', fontWeight: item.status === 'expiring' ? 600 : 400 }}>{item.expiry}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, background: sc.bg, color: sc.color }}>{sc.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Alerts */}
      {activeTab === 'alerts' && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Alertes & Seuils de réapprovisionnement</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {alerts.map(alert => (
              <div key={alert.id} style={{ background: 'var(--card)', border: `1px solid ${alert.severity === 'critical' ? '#fca5a5' : alert.severity === 'warning' ? '#fde68a' : '#bfdbfe'}`, borderLeft: `4px solid ${alert.severity === 'critical' ? '#dc2626' : alert.severity === 'warning' ? '#ca8a04' : '#1d4ed8'}`, borderRadius: '10px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Icon name="ExclamationTriangleIcon" size={20} color={alert.severity === 'critical' ? '#dc2626' : alert.severity === 'warning' ? '#ca8a04' : '#1d4ed8'} />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)' }}>{alert.product}</p>
                    <p style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>{alert.message}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{alert.date}</span>
                  <button style={{ padding: '6px 12px', background: 'var(--shifa-blue)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Créer DA</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
