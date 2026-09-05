'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

type TabKey = 'dashboard' | 'preventive' | 'corrective' | 'contracts' | 'parts' | 'predictive';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Tableau de bord', icon: 'Squares2X2Icon' },
  { key: 'preventive', label: 'Maintenance préventive', icon: 'CalendarDaysIcon' },
  { key: 'corrective', label: 'Tickets correctifs', icon: 'WrenchScrewdriverIcon' },
  { key: 'contracts', label: 'Contrats & Garanties', icon: 'DocumentTextIcon' },
  { key: 'parts', label: 'Pièces détachées', icon: 'ArchiveBoxIcon' },
  { key: 'predictive', label: 'SHIFA AI Prédictif', icon: 'CpuChipIcon' },
];

const kpis = [
  { label: 'Équipements actifs', value: '284', sub: '18 en maintenance', icon: 'CpuChipIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Tickets ouverts', value: '9', sub: '3 urgents', icon: 'WrenchScrewdriverIcon', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
  { label: 'Disponibilité globale', value: '94.2%', sub: 'Objectif: 95%', icon: 'CheckCircleIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
  { label: 'Coût maintenance YTD', value: '28.4M', sub: 'FCFA · Budget: 35M', icon: 'BanknotesIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)' },
];

const preventivePlans = [
  { id: 'PM-001', equipment: 'IRM 3 Tesla — Salle A', category: 'Imagerie', serial: 'SIE-MRI-2019-001', frequency: 'Trimestrielle', lastDone: '15/07/2026', nextDue: '15/10/2026', contractor: 'Siemens Healthineers', status: 'scheduled', daysLeft: 65 },
  { id: 'PM-002', equipment: 'Scanner CT 128 coupes', category: 'Imagerie', serial: 'GE-CT-2020-003', frequency: 'Trimestrielle', lastDone: '20/07/2026', nextDue: '20/10/2026', contractor: 'GE Healthcare', status: 'scheduled', daysLeft: 70 },
  { id: 'PM-003', equipment: 'Ventilateur réanimation #1', category: 'Réanimation', serial: 'DRG-VENT-2021-001', frequency: 'Mensuelle', lastDone: '01/08/2026', nextDue: '01/09/2026', contractor: 'Dräger Medical', status: 'upcoming', daysLeft: 22 },
  { id: 'PM-004', equipment: 'Ventilateur réanimation #2', category: 'Réanimation', serial: 'DRG-VENT-2021-002', frequency: 'Mensuelle', lastDone: '01/08/2026', nextDue: '01/09/2026', contractor: 'Dräger Medical', status: 'upcoming', daysLeft: 22 },
  { id: 'PM-005', equipment: 'Analyseur biochimie Cobas', category: 'Laboratoire', serial: 'ROC-COBAS-2022-001', frequency: 'Trimestrielle', lastDone: '25/07/2026', nextDue: '25/10/2026', contractor: 'Roche Diagnostics', status: 'scheduled', daysLeft: 75 },
  { id: 'PM-006', equipment: 'Défibrillateurs DAE x12', category: 'Urgences', serial: 'ZOLL-DAE-2020-*', frequency: 'Semestrielle', lastDone: '30/07/2026', nextDue: '30/01/2027', contractor: 'Zoll Medical', status: 'scheduled', daysLeft: 173 },
  { id: 'PM-007', equipment: 'Moniteurs multiparamétriques x8', category: 'Surveillance', serial: 'MDR-MON-2021-*', frequency: 'Trimestrielle', lastDone: '12/07/2026', nextDue: '12/10/2026', contractor: 'Mindray France', status: 'upcoming', daysLeft: 62 },
];

const correctiveTickets = [
  { id: 'CM-001', equipment: 'Table opératoire motorisée', category: 'Chirurgie', serial: 'MAQ-TABLE-2019-001', fault: 'Panne moteur de positionnement', reportedBy: 'Dr. Ndiaye', reportedDate: '10/08/2026', technician: 'Maquet Service', status: 'in_progress', priority: 'urgent', estimatedCost: '2 400 000 FCFA', estimatedEnd: '13/08/2026', downtime: '3 jours' },
  { id: 'CM-002', equipment: 'Échographe cardiaque Philips', category: 'Imagerie', serial: 'PHI-ECHO-2022-002', fault: 'Sonde cardiaque 3.5 MHz défectueuse', reportedBy: 'Dr. Ba', reportedDate: '10/08/2026', technician: 'Philips Healthcare', status: 'in_progress', priority: 'haute', estimatedCost: '850 000 FCFA', estimatedEnd: '12/08/2026', downtime: '2 jours' },
  { id: 'CM-003', equipment: 'Ventilateur réanimation #3', category: 'Réanimation', serial: 'DRG-VENT-2021-003', fault: 'Alarme capteur O2 — fausse alerte', reportedBy: 'Inf. Sow', reportedDate: '08/08/2026', technician: 'Dräger Medical', status: 'resolved', priority: 'urgent', estimatedCost: '120 000 FCFA', estimatedEnd: '09/08/2026', downtime: '28h' },
  { id: 'CM-004', equipment: 'Moniteur multiparamétrique #7', category: 'Surveillance', serial: 'MDR-MON-2021-007', fault: 'Écran tactile défaillant', reportedBy: 'Inf. Diop', reportedDate: '05/08/2026', technician: 'Mindray France', status: 'resolved', priority: 'normale', estimatedCost: '280 000 FCFA', estimatedEnd: '06/08/2026', downtime: '26h' },
  { id: 'CM-005', equipment: 'Autoclave stérilisation 134L', category: 'Stérilisation', serial: 'MEL-AUTO-2020-001', fault: 'Fuite vapeur — joint d\'étanchéité usé', reportedBy: 'Tech. Ndiaye', reportedDate: '11/08/2026', technician: 'En attente d\'assignation', status: 'pending', priority: 'haute', estimatedCost: '—', estimatedEnd: '—', downtime: '—' },
  { id: 'CM-006', equipment: 'Centrifugeuse laboratoire', category: 'Laboratoire', serial: 'EPP-CENT-2021-002', fault: 'Vibrations anormales à haute vitesse', reportedBy: 'Inf. Ndiaye', reportedDate: '09/08/2026', technician: 'Eppendorf Service', status: 'pending', priority: 'normale', estimatedCost: '—', estimatedEnd: '—', downtime: '—' },
];

const contracts = [
  { id: 'CTR-001', equipment: 'IRM 3 Tesla', contractor: 'Siemens Healthineers', type: 'Full Service', startDate: '01/01/2024', endDate: '31/12/2026', annualCost: '8 500 000 FCFA', coverage: 'Pièces + Main d\'œuvre + Déplacements', sla: '4h', status: 'active' },
  { id: 'CTR-002', equipment: 'Scanner CT 128 coupes', contractor: 'GE Healthcare', type: 'Maintenance préventive', startDate: '01/03/2024', endDate: '28/02/2027', annualCost: '5 200 000 FCFA', coverage: 'Main d\'œuvre + Pièces critiques', sla: '8h', status: 'active' },
  { id: 'CTR-003', equipment: 'Ventilateurs Dräger x6', contractor: 'Dräger Medical', type: 'Full Service', startDate: '01/06/2023', endDate: '31/05/2026', annualCost: '3 800 000 FCFA', coverage: 'Pièces + Main d\'œuvre', sla: '2h', status: 'expiring' },
  { id: 'CTR-004', equipment: 'Analyseur Cobas c501', contractor: 'Roche Diagnostics', type: 'Contrat réactifs + maintenance', startDate: '01/01/2025', endDate: '31/12/2027', annualCost: '4 100 000 FCFA', coverage: 'Réactifs + Calibrateurs + Maintenance', sla: '4h', status: 'active' },
];

const spareParts = [
  { id: 'PD-001', name: 'Sonde cardiaque 3.5 MHz Philips', equipment: 'Échographe Philips', ref: 'PHI-S3-3.5-2022', qty: 0, minQty: 1, unitCost: '850 000 FCFA', status: 'out_of_stock', leadTime: '7 jours' },
  { id: 'PD-002', name: 'Joint vapeur autoclave 134L', equipment: 'Autoclave Melag', ref: 'MEL-JOINT-134-001', qty: 2, minQty: 3, unitCost: '45 000 FCFA', status: 'low', leadTime: '3 jours' },
  { id: 'PD-003', name: 'Capteur O2 Dräger Evita', equipment: 'Ventilateurs Dräger', ref: 'DRG-O2-EVITA-001', qty: 4, minQty: 2, unitCost: '120 000 FCFA', status: 'ok', leadTime: '5 jours' },
  { id: 'PD-004', name: 'Écran tactile 10" Mindray', equipment: 'Moniteurs Mindray', ref: 'MDR-SCREEN-10-001', qty: 1, minQty: 2, unitCost: '280 000 FCFA', status: 'low', leadTime: '10 jours' },
  { id: 'PD-005', name: 'Filtre HEPA IRM Siemens', equipment: 'IRM Siemens', ref: 'SIE-HEPA-MRI-001', qty: 6, minQty: 2, unitCost: '180 000 FCFA', status: 'ok', leadTime: '14 jours' },
];

const aiPredictions = [
  { equipment: 'IRM 3 Tesla — Salle A', risk: 'Élevé', component: 'Compresseur hélium', prediction: 'Défaillance probable dans 45-60 jours', confidence: 87, recommendation: 'Planifier maintenance préventive avant le 30/09/2026', savings: '12 000 000 FCFA' },
  { equipment: 'Scanner CT 128 coupes', risk: 'Modéré', component: 'Tube radiogène', prediction: 'Dégradation progressive détectée — remplacement dans 4-6 mois', confidence: 74, recommendation: 'Commander tube de remplacement dès maintenant (délai 8 semaines)', savings: '8 500 000 FCFA' },
  { equipment: 'Ventilateur réanimation #4', risk: 'Faible', component: 'Turbine principale', prediction: 'Usure normale — aucune action immédiate requise', confidence: 92, recommendation: 'Maintenir programme de maintenance mensuelle', savings: '—' },
  { equipment: 'Analyseur biochimie Cobas', risk: 'Modéré', component: 'Pompe péristaltique', prediction: 'Anomalie de débit détectée — maintenance dans 30 jours', confidence: 81, recommendation: 'Inclure remplacement pompe dans prochaine maintenance trimestrielle', savings: '2 200 000 FCFA' },
];

const availabilityData = [
  { month: 'Mar', rate: 96.2 }, { month: 'Avr', rate: 95.8 }, { month: 'Mai', rate: 97.1 }, { month: 'Jun', rate: 94.5 }, { month: 'Jul', rate: 93.8 }, { month: 'Aoû', rate: 94.2 },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  scheduled: { label: 'Planifié', bg: '#dbeafe', color: '#1d4ed8' },
  upcoming: { label: 'Imminent', bg: '#fef3c7', color: '#b45309' },
  in_progress: { label: 'En cours', bg: '#ede9fe', color: '#5b21b6' },
  pending: { label: 'En attente', bg: '#f3f4f6', color: '#6b7280' },
  resolved: { label: 'Résolu', bg: '#dcfce7', color: '#16a34a' },
  active: { label: 'Actif', bg: '#dcfce7', color: '#16a34a' },
  expiring: { label: 'Expire bientôt', bg: '#fef3c7', color: '#b45309' },
  ok: { label: 'OK', bg: '#dcfce7', color: '#16a34a' },
  low: { label: 'Stock bas', bg: '#fef3c7', color: '#b45309' },
  out_of_stock: { label: 'Rupture', bg: '#fee2e2', color: '#dc2626' },
};

const priorityConfig: Record<string, { label: string; bg: string; color: string }> = {
  normale: { label: 'Normale', bg: '#f3f4f6', color: '#6b7280' },
  haute: { label: 'Haute', bg: '#fef3c7', color: '#b45309' },
  urgent: { label: 'Urgent', bg: '#fee2e2', color: '#dc2626' },
};

export default function OrgBiomedicalMaintenanceContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [newTicket, setNewTicket] = useState(false);

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '4px' }}>Maintenance Biomédicale</h1>
        <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>Maintenance préventive planifiée, tickets correctifs, contrats, garanties, pièces et prédictif SHIFA AI</p>
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
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Taux de disponibilité (%)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={availabilityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[90, 100]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`${v}%`, 'Disponibilité']} />
                <Line type="monotone" dataKey="rate" stroke="var(--shifa-green)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Statut des équipements</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'En service', count: 258, color: '#16a34a', pct: 91 },
                { label: 'En maintenance préventive', count: 8, color: '#1d4ed8', pct: 3 },
                { label: 'En réparation (correctif)', count: 9, color: '#dc2626', pct: 3 },
                { label: 'Hors service', count: 9, color: '#6b7280', pct: 3 },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--foreground)' }}>{s.label}</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: s.color }}>{s.count}</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--muted)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: '3px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ gridColumn: 'span 2', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Tickets urgents en cours</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {correctiveTickets.filter(t => t.status === 'in_progress').map(t => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#fee2e2', borderRadius: '8px', border: '1px solid #fca5a5' }}>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)' }}>{t.equipment}</p>
                    <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{t.fault} · {t.technician}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#dc2626' }}>Fin prévue: {t.estimatedEnd}</p>
                    <p style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{t.estimatedCost}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Preventive */}
      {activeTab === 'preventive' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Plan de maintenance préventive</h3>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'var(--shifa-blue)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              <Icon name="PlusIcon" size={14} /> Planifier maintenance
            </button>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--muted)' }}>
                  {['Équipement', 'Catégorie', 'N° Série', 'Fréquence', 'Dernière', 'Prochaine', 'Prestataire', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preventivePlans.map(pm => {
                  const sc = statusConfig[pm.status];
                  return (
                    <tr key={pm.id} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px 12px', fontSize: '13px', fontWeight: 600 }}>{pm.equipment}</td>
                      <td style={{ padding: '10px 12px', fontSize: '12px', color: 'var(--muted-foreground)' }}>{pm.category}</td>
                      <td style={{ padding: '10px 12px', fontSize: '11px', fontFamily: 'monospace', color: 'var(--muted-foreground)' }}>{pm.serial}</td>
                      <td style={{ padding: '10px 12px', fontSize: '12px' }}>{pm.frequency}</td>
                      <td style={{ padding: '10px 12px', fontSize: '12px', color: 'var(--muted-foreground)' }}>{pm.lastDone}</td>
                      <td style={{ padding: '10px 12px', fontSize: '12px', fontWeight: pm.daysLeft < 30 ? 700 : 400, color: pm.daysLeft < 30 ? '#ca8a04' : 'var(--foreground)' }}>{pm.nextDue} <span style={{ fontSize: '10px', color: 'var(--muted-foreground)' }}>({pm.daysLeft}j)</span></td>
                      <td style={{ padding: '10px 12px', fontSize: '12px', color: 'var(--muted-foreground)' }}>{pm.contractor}</td>
                      <td style={{ padding: '10px 12px' }}>
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

      {/* Corrective */}
      {activeTab === 'corrective' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Tickets de maintenance corrective</h3>
            <button onClick={() => setNewTicket(!newTicket)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              <Icon name="PlusIcon" size={14} /> Nouveau ticket
            </button>
          </div>
          {newTicket && (
            <div style={{ background: 'var(--card)', border: '1px solid #fca5a5', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: '#dc2626' }}>Nouveau ticket correctif</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <input placeholder="Équipement concerné" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '13px' }} />
                <select style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '13px' }}>
                  <option>Priorité normale</option><option>Priorité haute</option><option>Urgent</option>
                </select>
              </div>
              <textarea placeholder="Description de la panne..." style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box', marginBottom: '10px' }} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ padding: '8px 16px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Créer ticket</button>
                <button onClick={() => setNewTicket(false)} style={{ padding: '8px 16px', background: 'var(--muted)', color: 'var(--foreground)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Annuler</button>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {correctiveTickets.map(ticket => {
              const sc = statusConfig[ticket.status];
              const pc = priorityConfig[ticket.priority];
              return (
                <div key={ticket.id} style={{ background: 'var(--card)', border: `1px solid ${ticket.status === 'in_progress' ? '#fca5a5' : 'var(--border)'}`, borderLeft: `4px solid ${ticket.priority === 'urgent' ? '#dc2626' : ticket.priority === 'haute' ? '#ca8a04' : 'var(--border)'}`, borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                        <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)' }}>{ticket.equipment}</p>
                        <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, background: pc.bg, color: pc.color }}>{pc.label}</span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>{ticket.fault}</p>
                      <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{ticket.category} · {ticket.serial} · Signalé par {ticket.reportedBy} le {ticket.reportedDate}</p>
                    </div>
                    <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: sc.bg, color: sc.color }}>{sc.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Technicien: <strong>{ticket.technician}</strong></p>
                    <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Coût estimé: <strong>{ticket.estimatedCost}</strong></p>
                    <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Fin prévue: <strong>{ticket.estimatedEnd}</strong></p>
                    <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Immobilisation: <strong>{ticket.downtime}</strong></p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Contracts */}
      {activeTab === 'contracts' && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Contrats de maintenance & Garanties</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {contracts.map(c => {
              const sc = statusConfig[c.status];
              return (
                <div key={c.id} style={{ background: 'var(--card)', border: `1px solid ${c.status === 'expiring' ? '#fde68a' : 'var(--border)'}`, borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)' }}>{c.equipment}</h4>
                      <p style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>{c.contractor} · {c.type}</p>
                    </div>
                    <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: sc.bg, color: sc.color }}>{sc.label}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    {[
                      { l: 'Début', v: c.startDate }, { l: 'Fin', v: c.endDate },
                      { l: 'Coût annuel', v: c.annualCost }, { l: 'SLA intervention', v: c.sla },
                    ].map(f => (
                      <div key={f.l} style={{ padding: '8px 10px', background: 'var(--muted)', borderRadius: '6px' }}>
                        <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '2px' }}>{f.l}</p>
                        <p style={{ fontSize: '13px', fontWeight: 600 }}>{f.v}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginTop: '10px' }}>Couverture: {c.coverage}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Parts */}
      {activeTab === 'parts' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Stock de pièces détachées</h3>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'var(--shifa-blue)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              <Icon name="PlusIcon" size={14} /> Commander pièce
            </button>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--muted)' }}>
                  {['Pièce', 'Équipement', 'Référence', 'Qté', 'Qté min.', 'Coût unitaire', 'Délai appro.', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {spareParts.map(part => {
                  const sc = statusConfig[part.status];
                  return (
                    <tr key={part.id} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px', fontSize: '13px', fontWeight: 600 }}>{part.name}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: 'var(--muted-foreground)' }}>{part.equipment}</td>
                      <td style={{ padding: '12px', fontSize: '11px', fontFamily: 'monospace', color: 'var(--muted-foreground)' }}>{part.ref}</td>
                      <td style={{ padding: '12px', fontSize: '14px', fontWeight: 700, color: part.qty === 0 ? '#dc2626' : part.qty < part.minQty ? '#ca8a04' : 'var(--foreground)' }}>{part.qty}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: 'var(--muted-foreground)' }}>{part.minQty}</td>
                      <td style={{ padding: '12px', fontSize: '13px', fontWeight: 600 }}>{part.unitCost}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: 'var(--muted-foreground)' }}>{part.leadTime}</td>
                      <td style={{ padding: '12px' }}>
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

      {/* Predictive AI */}
      {activeTab === 'predictive' && (
        <div>
          <div style={{ background: 'linear-gradient(135deg, rgba(0,102,255,0.05) 0%, rgba(139,92,246,0.05) 100%)', border: '1px solid rgba(0,102,255,0.2)', borderRadius: '12px', padding: '16px', marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(0,102,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="CpuChipIcon" size={22} color="var(--shifa-blue)" />
            </div>
            <div>
              <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)' }}>SHIFA AI — Maintenance Prédictive</p>
              <p style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>Analyse des données IoT des équipements · Détection précoce des défaillances · Économies estimées: 22.7M FCFA/an</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {aiPredictions.map((pred, i) => (
              <div key={i} style={{ background: 'var(--card)', border: `1px solid ${pred.risk === 'Élevé' ? '#fca5a5' : pred.risk === 'Modéré' ? '#fde68a' : 'var(--border)'}`, borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)' }}>{pred.equipment}</p>
                    <p style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>Composant: {pred.component}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Confiance: <strong>{pred.confidence}%</strong></span>
                    <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: pred.risk === 'Élevé' ? '#fee2e2' : pred.risk === 'Modéré' ? '#fef9c3' : '#dcfce7', color: pred.risk === 'Élevé' ? '#dc2626' : pred.risk === 'Modéré' ? '#ca8a04' : '#16a34a' }}>
                      Risque {pred.risk}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--foreground)', marginBottom: '8px' }}>🔮 {pred.prediction}</p>
                <div style={{ padding: '10px 12px', background: 'rgba(0,102,255,0.05)', borderRadius: '8px', border: '1px solid rgba(0,102,255,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '13px', color: 'var(--foreground)' }}>💡 {pred.recommendation}</p>
                  {pred.savings !== '—' && <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--shifa-green)', whiteSpace: 'nowrap', marginLeft: '12px' }}>Économie: {pred.savings}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
