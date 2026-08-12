'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type TabKey = 'dashboard' | 'preventive' | 'corrective' | 'interventions' | 'technicians' | 'reports';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Tableau de bord', icon: 'Squares2X2Icon' },
  { key: 'preventive', label: 'Maintenance préventive', icon: 'CalendarDaysIcon' },
  { key: 'corrective', label: 'Maintenance corrective', icon: 'WrenchScrewdriverIcon' },
  { key: 'interventions', label: 'Interventions', icon: 'ClipboardDocumentListIcon' },
  { key: 'technicians', label: 'Techniciens', icon: 'UsersIcon' },
  { key: 'reports', label: 'Rapports', icon: 'ChartBarIcon' },
];

const kpis = [
  { label: 'Maintenances préventives', value: '18', sub: 'Planifiées ce trimestre', icon: 'CalendarDaysIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Interventions correctives', value: '7', sub: '2 urgentes en cours', icon: 'WrenchScrewdriverIcon', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
  { label: 'Taux de disponibilité', value: '94.2%', sub: 'Objectif: 95%', icon: 'CheckCircleIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
  { label: 'Coût maintenance YTD', value: '28.4M FCFA', sub: 'Budget: 35M FCFA', icon: 'BanknotesIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)' },
];

const preventivePlans = [
  { id: 'PM-001', equipment: 'IRM 3 Tesla — Salle A', category: 'Imagerie', frequency: 'Trimestrielle', lastDone: '15 juil. 2026', nextDue: '15 oct. 2026', technician: 'Équipe Siemens', status: 'scheduled', priority: 'normale' },
  { id: 'PM-002', equipment: 'Scanner CT 128 coupes', category: 'Imagerie', frequency: 'Trimestrielle', lastDone: '20 juil. 2026', nextDue: '20 oct. 2026', technician: 'GE Healthcare', status: 'scheduled', priority: 'normale' },
  { id: 'PM-003', equipment: 'Ventilateur réanimation', category: 'Réanimation', frequency: 'Mensuelle', lastDone: '01 août 2026', nextDue: '01 sept. 2026', technician: 'Dräger Medical', status: 'upcoming', priority: 'haute' },
  { id: 'PM-004', equipment: 'Analyseur biochimie', category: 'Laboratoire', frequency: 'Trimestrielle', lastDone: '25 juil. 2026', nextDue: '25 oct. 2026', technician: 'Roche Diagnostics', status: 'scheduled', priority: 'normale' },
  { id: 'PM-005', equipment: 'Défibrillateur DAE x12', category: 'Urgences', frequency: 'Semestrielle', lastDone: '30 juil. 2026', nextDue: '30 jan. 2027', technician: 'Zoll Medical', status: 'scheduled', priority: 'normale' },
  { id: 'PM-006', equipment: 'Moniteurs multiparamétriques x8', category: 'Surveillance', frequency: 'Trimestrielle', lastDone: '12 juil. 2026', nextDue: '12 oct. 2026', technician: 'Mindray France', status: 'upcoming', priority: 'normale' },
];

const correctiveOrders = [
  { id: 'CM-001', equipment: 'Table opératoire motorisée', category: 'Chirurgie', fault: 'Panne moteur de positionnement', reportedDate: '10 août 2026', technician: 'Maquet Service', status: 'in_progress', priority: 'urgente', estimatedCost: '2 400 000 FCFA', estimatedEnd: '13 août 2026' },
  { id: 'CM-002', equipment: 'Échographe cardiaque', category: 'Imagerie', fault: 'Sonde cardiaque défectueuse', reportedDate: '10 août 2026', technician: 'Philips Healthcare', status: 'in_progress', priority: 'haute', estimatedCost: '850 000 FCFA', estimatedEnd: '12 août 2026' },
  { id: 'CM-003', equipment: 'Ventilateur réanimation #3', category: 'Réanimation', fault: 'Alarme capteur O2 — fausse alerte', reportedDate: '08 août 2026', technician: 'Dräger Medical', status: 'resolved', priority: 'urgente', estimatedCost: '120 000 FCFA', estimatedEnd: '09 août 2026' },
  { id: 'CM-004', equipment: 'Moniteur multiparamétrique #7', category: 'Surveillance', fault: 'Écran tactile défaillant', reportedDate: '05 août 2026', technician: 'Mindray France', status: 'resolved', priority: 'normale', estimatedCost: '280 000 FCFA', estimatedEnd: '06 août 2026' },
  { id: 'CM-005', equipment: 'Autoclave stérilisation', category: 'Stérilisation', fault: 'Fuite vapeur — joint usé', reportedDate: '11 août 2026', technician: 'En attente', status: 'pending', priority: 'haute', estimatedCost: '—', estimatedEnd: '—' },
];

const interventions = [
  { id: 'INT-001', type: 'Corrective', equipment: 'Table opératoire motorisée', tech: 'Maquet Service', start: '10/08/2026 09:00', end: null, duration: 'En cours', status: 'in_progress', notes: 'Pièce commandée — moteur de positionnement' },
  { id: 'INT-002', type: 'Corrective', equipment: 'Échographe cardiaque', tech: 'Philips Healthcare', start: '10/08/2026 14:00', end: null, duration: 'En cours', status: 'in_progress', notes: 'Remplacement sonde 3.5 MHz' },
  { id: 'INT-003', type: 'Corrective', equipment: 'Ventilateur réanimation #3', tech: 'Dräger Medical', start: '08/08/2026 10:00', end: '09/08/2026 14:00', duration: '28h', status: 'completed', notes: 'Capteur O2 remplacé — résolu' },
  { id: 'INT-004', type: 'Préventive', equipment: 'IRM 3 Tesla — Salle A', tech: 'Équipe Siemens', start: '15/07/2026 08:00', end: '15/07/2026 12:00', duration: '4h', status: 'completed', notes: 'Maintenance trimestrielle effectuée' },
  { id: 'INT-005', type: 'Corrective', equipment: 'Moniteur multiparamétrique #7', tech: 'Mindray France', start: '05/08/2026 09:00', end: '06/08/2026 11:00', duration: '26h', status: 'completed', notes: 'Écran tactile remplacé' },
];

const technicians = [
  { name: 'Moussa Diallo', specialty: 'Imagerie médicale', certifications: ['Siemens Healthineers', 'GE Healthcare'], activeInterventions: 1, completedThisMonth: 4, availability: 'busy' },
  { name: 'Ibrahima Sow', specialty: 'Équipements de réanimation', certifications: ['Dräger Medical', 'Mindray'], activeInterventions: 0, completedThisMonth: 6, availability: 'available' },
  { name: 'Fatou Ndiaye', specialty: 'Équipements de laboratoire', certifications: ['Roche Diagnostics', 'Beckman Coulter'], activeInterventions: 0, completedThisMonth: 3, availability: 'available' },
  { name: 'Oumar Diop', specialty: 'Équipements chirurgicaux', certifications: ['Maquet', 'Stryker'], activeInterventions: 1, completedThisMonth: 2, availability: 'busy' },
];

const chartData = [
  { month: 'Mar', preventive: 6, corrective: 3 },
  { month: 'Avr', preventive: 8, corrective: 5 },
  { month: 'Mai', preventive: 5, corrective: 2 },
  { month: 'Jun', preventive: 9, corrective: 4 },
  { month: 'Jul', preventive: 7, corrective: 6 },
  { month: 'Aoû', preventive: 4, corrective: 7 },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  scheduled: { label: 'Planifié', bg: '#dbeafe', color: '#1d4ed8' },
  upcoming: { label: 'Imminent', bg: '#fef3c7', color: '#b45309' },
  in_progress: { label: 'En cours', bg: '#ede9fe', color: '#5b21b6' },
  pending: { label: 'En attente', bg: '#f3f4f6', color: '#6b7280' },
  resolved: { label: 'Résolu', bg: '#dcfce7', color: '#16a34a' },
  completed: { label: 'Terminé', bg: '#dcfce7', color: '#16a34a' },
  available: { label: 'Disponible', bg: '#dcfce7', color: '#16a34a' },
  busy: { label: 'Occupé', bg: '#fef3c7', color: '#b45309' },
};

const priorityConfig: Record<string, { label: string; bg: string; color: string }> = {
  normale: { label: 'Normale', bg: '#f3f4f6', color: '#6b7280' },
  haute: { label: 'Haute', bg: '#fef3c7', color: '#b45309' },
  urgente: { label: 'Urgente', bg: '#fee2e2', color: '#dc2626' },
};

export default function BiomedicalMaintenanceContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [showNewOrder, setShowNewOrder] = useState(false);

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Maintenance Biomédicale</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--shifa-muted)' }}>Maintenance préventive et corrective des équipements médicaux</p>
        </div>
        <button
          onClick={() => setShowNewOrder(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: 'var(--shifa-blue)' }}
        >
          <Icon name="PlusIcon" className="w-4 h-4" />
          Nouvelle intervention
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
            style={{
              background: activeTab === t.key ? 'var(--shifa-blue)' : 'var(--shifa-surface)',
              color: activeTab === t.key ? '#fff' : 'var(--shifa-muted)',
              border: `1px solid ${activeTab === t.key ? 'var(--shifa-blue)' : 'var(--shifa-border)'}`,
            }}
          >
            <Icon name={t.icon} className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map(k => (
              <div key={k.label} className="rounded-xl p-4 border" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: k.bg }}>
                    <Icon name={k.icon} className="w-5 h-5" style={{ color: k.color }} />
                  </div>
                  <span className="text-xs" style={{ color: 'var(--shifa-muted)' }}>{k.label}</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>{k.value}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--shifa-muted)' }}>{k.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl border p-5" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--shifa-dark)' }}>Interventions par mois</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--shifa-border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--shifa-muted)' }} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--shifa-muted)' }} />
                  <Tooltip />
                  <Bar dataKey="preventive" name="Préventive" fill="var(--shifa-blue)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="corrective" name="Corrective" fill="#dc2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-xl border p-5" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--shifa-dark)' }}>Interventions urgentes en cours</h3>
              <div className="space-y-3">
                {correctiveOrders.filter(o => o.status === 'in_progress').map(o => {
                  const pr = priorityConfig[o.priority];
                  return (
                    <div key={o.id} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'var(--shifa-bg)' }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(220,38,38,0.1)' }}>
                        <Icon name="WrenchScrewdriverIcon" className="w-4 h-4" style={{ color: '#dc2626' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate" style={{ color: 'var(--shifa-dark)' }}>{o.equipment}</p>
                        <p className="text-xs" style={{ color: 'var(--shifa-muted)' }}>{o.fault}</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--shifa-muted)' }}>{o.technician}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium shrink-0" style={{ background: pr.bg, color: pr.color }}>{pr.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-xl border p-5" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }}>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--shifa-dark)' }}>Prochaines maintenances préventives</h3>
            <div className="space-y-2">
              {preventivePlans.filter(p => p.status === 'upcoming').map(p => {
                const st = statusConfig[p.status];
                return (
                  <div key={p.id} className="flex items-center gap-4 p-3 rounded-lg border" style={{ borderColor: 'var(--shifa-border)' }}>
                    <Icon name="CalendarDaysIcon" className="w-5 h-5 shrink-0" style={{ color: 'var(--shifa-amber)' }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm" style={{ color: 'var(--shifa-dark)' }}>{p.equipment}</p>
                      <p className="text-xs" style={{ color: 'var(--shifa-muted)' }}>{p.technician} · {p.frequency}</p>
                    </div>
                    <p className="text-sm font-medium" style={{ color: 'var(--shifa-dark)' }}>{p.nextDue}</p>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Preventive */}
      {activeTab === 'preventive' && (
        <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--shifa-bg)', borderBottom: '1px solid var(--shifa-border)' }}>
                  {['ID', 'Équipement', 'Catégorie', 'Fréquence', 'Dernière maintenance', 'Prochaine échéance', 'Technicien', 'Statut'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-xs" style={{ color: 'var(--shifa-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preventivePlans.map((p, i) => {
                  const st = statusConfig[p.status];
                  return (
                    <tr key={p.id} style={{ borderBottom: i < preventivePlans.length - 1 ? '1px solid var(--shifa-border)' : 'none' }}>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--shifa-blue)' }}>{p.id}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: 'var(--shifa-dark)' }}>{p.equipment}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--shifa-muted)' }}>{p.category}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--shifa-muted)' }}>{p.frequency}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--shifa-muted)' }}>{p.lastDone}</td>
                      <td className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--shifa-dark)' }}>{p.nextDue}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--shifa-muted)' }}>{p.technician}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: st.bg, color: st.color }}>{st.label}</span>
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
        <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--shifa-bg)', borderBottom: '1px solid var(--shifa-border)' }}>
                  {['ID', 'Équipement', 'Panne signalée', 'Signalé le', 'Technicien', 'Priorité', 'Statut', 'Coût estimé'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-xs" style={{ color: 'var(--shifa-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {correctiveOrders.map((o, i) => {
                  const st = statusConfig[o.status];
                  const pr = priorityConfig[o.priority];
                  return (
                    <tr key={o.id} style={{ borderBottom: i < correctiveOrders.length - 1 ? '1px solid var(--shifa-border)' : 'none' }}>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--shifa-blue)' }}>{o.id}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium" style={{ color: 'var(--shifa-dark)' }}>{o.equipment}</p>
                        <p className="text-xs" style={{ color: 'var(--shifa-muted)' }}>{o.category}</p>
                      </td>
                      <td className="px-4 py-3 text-xs max-w-[160px]" style={{ color: 'var(--shifa-muted)' }}>{o.fault}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--shifa-muted)' }}>{o.reportedDate}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--shifa-muted)' }}>{o.technician}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: pr.bg, color: pr.color }}>{pr.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                      </td>
                      <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--shifa-dark)' }}>{o.estimatedCost}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Interventions */}
      {activeTab === 'interventions' && (
        <div className="space-y-3">
          {interventions.map(inv => {
            const st = statusConfig[inv.status];
            return (
              <div key={inv.id} className="rounded-xl border p-4" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: inv.type === 'Corrective' ? 'rgba(220,38,38,0.08)' : 'rgba(0,102,255,0.08)' }}>
                      <Icon name={inv.type === 'Corrective' ? 'WrenchScrewdriverIcon' : 'CalendarDaysIcon'} className="w-5 h-5" style={{ color: inv.type === 'Corrective' ? '#dc2626' : 'var(--shifa-blue)' }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs" style={{ color: 'var(--shifa-blue)' }}>{inv.id}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: inv.type === 'Corrective' ? 'rgba(220,38,38,0.08)' : 'rgba(0,102,255,0.08)', color: inv.type === 'Corrective' ? '#dc2626' : 'var(--shifa-blue)' }}>{inv.type}</span>
                      </div>
                      <p className="font-semibold" style={{ color: 'var(--shifa-dark)' }}>{inv.equipment}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--shifa-muted)' }}>Technicien: {inv.tech}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--shifa-muted)' }}>Début: {inv.start} · Fin: {inv.end || 'En cours'} · Durée: {inv.duration}</p>
                      <p className="text-xs mt-1 italic" style={{ color: 'var(--shifa-muted)' }}>{inv.notes}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium shrink-0" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Technicians */}
      {activeTab === 'technicians' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {technicians.map(tech => {
            const avail = statusConfig[tech.availability];
            return (
              <div key={tech.name} className="rounded-xl border p-5" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold" style={{ background: 'var(--shifa-blue)' }}>
                    {tech.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold" style={{ color: 'var(--shifa-dark)' }}>{tech.name}</p>
                    <p className="text-xs" style={{ color: 'var(--shifa-muted)' }}>{tech.specialty}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: avail.bg, color: avail.color }}>{avail.label}</span>
                </div>
                <div className="flex gap-2 flex-wrap mb-3">
                  {tech.certifications.map(c => (
                    <span key={c} className="px-2 py-0.5 rounded-full text-xs border" style={{ borderColor: 'var(--shifa-border)', color: 'var(--shifa-muted)' }}>{c}</span>
                  ))}
                </div>
                <div className="flex gap-4 text-sm">
                  <div>
                    <p className="text-xs" style={{ color: 'var(--shifa-muted)' }}>Interventions actives</p>
                    <p className="font-bold" style={{ color: 'var(--shifa-dark)' }}>{tech.activeInterventions}</p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--shifa-muted)' }}>Terminées ce mois</p>
                    <p className="font-bold" style={{ color: 'var(--shifa-dark)' }}>{tech.completedThisMonth}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reports */}
      {activeTab === 'reports' && (
        <div className="rounded-xl border p-6 text-center" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }}>
          <Icon name="ChartBarIcon" className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--shifa-muted)' }} />
          <p className="font-medium mb-1" style={{ color: 'var(--shifa-dark)' }}>Rapports de maintenance</p>
          <p className="text-sm" style={{ color: 'var(--shifa-muted)' }}>Les rapports détaillés de maintenance seront disponibles ici (Phase 3).</p>
        </div>
      )}

      {/* New Intervention Modal */}
      {showNewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="rounded-2xl w-full max-w-lg p-6" style={{ background: 'var(--shifa-surface)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ color: 'var(--shifa-dark)' }}>Nouvelle intervention</h2>
              <button onClick={() => setShowNewOrder(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <Icon name="XMarkIcon" className="w-5 h-5" style={{ color: 'var(--shifa-muted)' }} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--shifa-muted)' }}>Type d'intervention</label>
                <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--shifa-border)', background: 'var(--shifa-bg)', color: 'var(--shifa-dark)' }}>
                  <option>Maintenance corrective</option>
                  <option>Maintenance préventive</option>
                  <option>Calibration</option>
                  <option>Inspection</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--shifa-muted)' }}>Équipement concerné</label>
                <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--shifa-border)', background: 'var(--shifa-bg)', color: 'var(--shifa-dark)' }} placeholder="Rechercher un équipement..." />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--shifa-muted)' }}>Description du problème / travaux</label>
                <textarea rows={3} className="w-full px-3 py-2 rounded-lg border text-sm resize-none" style={{ borderColor: 'var(--shifa-border)', background: 'var(--shifa-bg)', color: 'var(--shifa-dark)' }} placeholder="Décrivez la panne ou les travaux à effectuer..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--shifa-muted)' }}>Priorité</label>
                  <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--shifa-border)', background: 'var(--shifa-bg)', color: 'var(--shifa-dark)' }}>
                    <option>Normale</option>
                    <option>Haute</option>
                    <option>Urgente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--shifa-muted)' }}>Technicien assigné</label>
                  <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--shifa-border)', background: 'var(--shifa-bg)', color: 'var(--shifa-dark)' }}>
                    <option>Moussa Diallo</option>
                    <option>Ibrahima Sow</option>
                    <option>Fatou Ndiaye</option>
                    <option>Oumar Diop</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowNewOrder(false)} className="flex-1 py-2 rounded-lg border text-sm font-medium" style={{ borderColor: 'var(--shifa-border)', color: 'var(--shifa-muted)' }}>Annuler</button>
              <button onClick={() => setShowNewOrder(false)} className="flex-1 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--shifa-blue)' }}>Créer l'intervention</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
