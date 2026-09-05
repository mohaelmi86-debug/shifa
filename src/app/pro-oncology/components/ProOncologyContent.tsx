'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type TabKey = 'dashboard' | 'protocols' | 'cycles' | 'toxicity' | 'rcp' | 'markers';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
  { key: 'protocols', label: 'Protocoles chimio', icon: 'BeakerIcon' },
  { key: 'cycles', label: 'Cycles en cours', icon: 'ArrowPathIcon' },
  { key: 'toxicity', label: 'Toxicité', icon: 'ExclamationTriangleIcon' },
  { key: 'rcp', label: 'RCP Pluridisciplinaire', icon: 'UsersIcon' },
  { key: 'markers', label: 'Marqueurs tumoraux', icon: 'ChartBarIcon' },
];

const kpis = [
  { label: 'Patients en chimio', value: '67', sub: '12 actifs ce jour', icon: 'UsersIcon', color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
  { label: 'Protocoles actifs', value: '14', sub: '8 types différents', icon: 'BeakerIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Toxicités grade ≥3', value: '4', sub: 'Ce mois', icon: 'ExclamationTriangleIcon', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
  { label: 'RCP planifiées', value: '3', sub: 'Cette semaine', icon: 'UsersIcon', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
];

const chemoProtocols = [
  { id: 'PROT-ONC-001', name: 'FOLFOX-4', cancer: 'Côlon métastatique', drugs: ['Oxaliplatine', '5-FU', 'Leucovorine'], cycle: '14 jours', cycles: 12, patients: 8, status: 'active' },
  { id: 'PROT-ONC-002', name: 'AC-T', cancer: 'Sein — adjuvant', drugs: ['Doxorubicine', 'Cyclophosphamide', 'Paclitaxel'], cycle: '21 jours', cycles: 8, patients: 12, status: 'active' },
  { id: 'PROT-ONC-003', name: 'BEP', cancer: 'Testicule', drugs: ['Bléomycine', 'Étoposide', 'Cisplatine'], cycle: '21 jours', cycles: 3, patients: 2, status: 'active' },
  { id: 'PROT-ONC-004', name: 'CHOP', cancer: 'Lymphome non hodgkinien', drugs: ['Cyclophosphamide', 'Doxorubicine', 'Vincristine', 'Prednisone'], cycle: '21 jours', cycles: 6, patients: 5, status: 'active' },
  { id: 'PROT-ONC-005', name: 'Carboplatine-Paclitaxel', cancer: 'Poumon NSCLC', drugs: ['Carboplatine', 'Paclitaxel'], cycle: '21 jours', cycles: 6, patients: 7, status: 'active' },
];

const activeCycles = [
  { patient: 'Aïcha Diallo', id: 'PAT-001', protocol: 'AC-T', cancer: 'Sein — stade III', currentCycle: 4, totalCycles: 8, nextDate: '14/08/2026', lastDate: '24/07/2026', status: 'on-track', weight: 62, bsa: 1.68 },
  { patient: 'Mamadou Sow', id: 'PAT-002', protocol: 'FOLFOX-4', cancer: 'Côlon métastatique', currentCycle: 7, totalCycles: 12, nextDate: '12/08/2026', lastDate: '29/07/2026', status: 'delayed', weight: 78, bsa: 1.92 },
  { patient: 'Fatou Ndiaye', id: 'PAT-003', protocol: 'CHOP', cancer: 'LNH diffus', currentCycle: 2, totalCycles: 6, nextDate: '18/08/2026', lastDate: '28/07/2026', status: 'on-track', weight: 55, bsa: 1.58 },
  { patient: 'Ibrahima Fall', id: 'PAT-004', protocol: 'Carboplatine-Paclitaxel', cancer: 'Poumon NSCLC', currentCycle: 3, totalCycles: 6, nextDate: '21/08/2026', lastDate: '31/07/2026', status: 'on-track', weight: 70, bsa: 1.82 },
];

const toxicityEvents = [
  { patient: 'Mamadou Sow', protocol: 'FOLFOX-4', cycle: 6, type: 'Neuropathie périphérique', grade: 3, onset: '02/08/2026', action: 'Réduction dose 25%', resolved: false },
  { patient: 'Aïcha Diallo', protocol: 'AC-T', cycle: 3, type: 'Neutropénie fébrile', grade: 4, onset: '28/07/2026', action: 'Hospitalisation + G-CSF', resolved: true },
  { patient: 'Cheikh Mbaye', protocol: 'BEP', cycle: 2, type: 'Nausées/vomissements', grade: 2, onset: '05/08/2026', action: 'Antiémétiques renforcés', resolved: true },
  { patient: 'Fatou Ndiaye', protocol: 'CHOP', cycle: 1, type: 'Mucite', grade: 2, onset: '01/08/2026', action: 'Bains de bouche + analgésie', resolved: true },
  { patient: 'Ibrahima Fall', protocol: 'Carboplatine-Paclitaxel', cycle: 2, type: 'Thrombopénie', grade: 3, onset: '10/08/2026', action: 'Surveillance + report cycle', resolved: false },
];

const rcpMeetings = [
  { id: 'RCP-001', date: '12/08/2026', time: '14:00', type: 'Oncologie digestive', cases: 4, participants: ['Dr. Diallo (Onco)', 'Dr. Sy (Chir)', 'Dr. Ba (Radio)', 'Dr. Ndiaye (Anapath)'], status: 'scheduled' },
  { id: 'RCP-002', date: '14/08/2026', time: '15:30', type: 'Oncologie thoracique', cases: 3, participants: ['Dr. Diallo (Onco)', 'Dr. Fall (Pneumo)', 'Dr. Camara (Radio)', 'Dr. Seck (Anapath)'], status: 'scheduled' },
  { id: 'RCP-003', date: '08/08/2026', time: '14:00', type: 'Oncologie mammaire', cases: 5, participants: ['Dr. Diallo (Onco)', 'Dr. Sy (Chir)', 'Dr. Ba (Radio)', 'Dr. Mbaye (Anapath)'], status: 'completed' },
];

const tumorMarkers = [
  { patient: 'Aïcha Diallo', marker: 'CA 15-3', values: [{ date: 'Jun', val: 85 }, { date: 'Jul', val: 62 }, { date: 'Aoû', val: 48 }], normal: 30, trend: 'down', status: 'elevated' },
  { patient: 'Mamadou Sow', marker: 'ACE', values: [{ date: 'Jun', val: 12 }, { date: 'Jul', val: 18 }, { date: 'Aoû', val: 24 }], normal: 5, trend: 'up', status: 'elevated' },
  { patient: 'Ibrahima Fall', marker: 'NSE', values: [{ date: 'Jun', val: 28 }, { date: 'Jul', val: 22 }, { date: 'Aoû', val: 19 }], normal: 16.3, trend: 'down', status: 'elevated' },
  { patient: 'Fatou Ndiaye', marker: 'LDH', values: [{ date: 'Jun', val: 380 }, { date: 'Jul', val: 290 }, { date: 'Aoû', val: 245 }], normal: 250, trend: 'down', status: 'normal' },
];

const gradeConfig: Record<number, { bg: string; color: string }> = {
  1: { bg: '#dbeafe', color: '#1d4ed8' },
  2: { bg: '#fef3c7', color: '#b45309' },
  3: { bg: '#fed7aa', color: '#c2410c' },
  4: { bg: '#fee2e2', color: '#dc2626' },
};

export default function ProOncologyContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 100%)', padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="BeakerIcon" size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>Oncologie & Chimiothérapie</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: 0 }}>Protocoles, cycles, toxicité, RCP pluridisciplinaire, marqueurs tumoraux</p>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 32px', display: 'flex', gap: 4, overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            style={{ padding: '14px 16px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: activeTab === t.key ? 600 : 400, color: activeTab === t.key ? '#7c3aed' : '#64748b', borderBottom: activeTab === t.key ? '2px solid #7c3aed' : '2px solid transparent', whiteSpace: 'nowrap' }}>
            <Icon name={t.icon} size={15} color={activeTab === t.key ? '#7c3aed' : '#94a3b8'} />
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '24px 32px' }}>
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
              {kpis.map((k, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 6px' }}>{k.label}</p>
                      <p style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', margin: 0 }}>{k.value}</p>
                      <p style={{ color: '#94a3b8', fontSize: 12, margin: '4px 0 0' }}>{k.sub}</p>
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={k.icon} size={20} color={k.color} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>Cycles en cours</h3>
                {activeCycles.map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < activeCycles.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0 }}>{c.patient}</p>
                      <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>{c.protocol} — Cycle {c.currentCycle}/{c.totalCycles}</p>
                    </div>
                    <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, background: c.status === 'on-track' ? '#dcfce7' : '#fef3c7', color: c.status === 'on-track' ? '#16a34a' : '#b45309' }}>{c.status === 'on-track' ? 'En cours' : 'Retardé'}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>Toxicités actives</h3>
                {toxicityEvents.filter(t => !t.resolved).map((t, i) => (
                  <div key={i} style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: 12, marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{t.patient}</span>
                      <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, background: gradeConfig[t.grade].bg, color: gradeConfig[t.grade].color }}>Grade {t.grade}</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{t.type} — {t.action}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'protocols' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Protocoles de chimiothérapie</h3>
              <button style={{ padding: '8px 16px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>+ Nouveau protocole</button>
            </div>
            {chemoProtocols.map((p, i) => (
              <div key={i} style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>{p.name}</p>
                    <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>{p.cancer} — Cycle {p.cycle} × {p.cycles} cycles — {p.patients} patients actifs</p>
                  </div>
                  <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: 11, background: '#dcfce7', color: '#16a34a' }}>Actif</span>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {p.drugs.map((d, j) => (
                    <span key={j} style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, background: '#ede9fe', color: '#7c3aed' }}>{d}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'cycles' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Cycles de chimiothérapie en cours</h3>
              <button style={{ padding: '8px 16px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>+ Planifier cycle</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Patient', 'Protocole', 'Cancer', 'Cycle actuel', 'Prochain cycle', 'Poids/BSA', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeCycles.map((c, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{c.patient}</td>
                    <td style={{ padding: '12px 16px' }}><span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, background: '#ede9fe', color: '#7c3aed' }}>{c.protocol}</span></td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{c.cancer}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${(c.currentCycle / c.totalCycles) * 100}%`, height: '100%', background: '#7c3aed', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 12, color: '#64748b' }}>{c.currentCycle}/{c.totalCycles}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{c.nextDate}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{c.weight}kg / {c.bsa}m²</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, background: c.status === 'on-track' ? '#dcfce7' : '#fef3c7', color: c.status === 'on-track' ? '#16a34a' : '#b45309' }}>{c.status === 'on-track' ? 'En cours' : 'Retardé'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'toxicity' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Événements de toxicité — Grille CTCAE</h3>
              <button style={{ padding: '8px 16px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>+ Déclarer toxicité</button>
            </div>
            {toxicityEvents.map((t, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 12, border: `1px solid ${!t.resolved ? '#fed7aa' : '#e2e8f0'}`, padding: 20, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>{t.patient} — {t.protocol} (Cycle {t.cycle})</p>
                    <p style={{ fontSize: 13, color: '#475569', margin: '4px 0 0' }}>{t.type}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: gradeConfig[t.grade].bg, color: gradeConfig[t.grade].color }}>Grade {t.grade}</span>
                    <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: 11, background: t.resolved ? '#dcfce7' : '#fee2e2', color: t.resolved ? '#16a34a' : '#dc2626' }}>{t.resolved ? 'Résolu' : 'En cours'}</span>
                  </div>
                </div>
                <div style={{ background: '#f8fafc', borderRadius: 8, padding: 10, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: '#64748b' }}>Action: <strong>{t.action}</strong></span>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>Début: {t.onset}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'rcp' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Réunions de Concertation Pluridisciplinaire</h3>
              <button style={{ padding: '8px 16px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>+ Planifier RCP</button>
            </div>
            {rcpMeetings.map((r, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>{r.type}</p>
                    <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>{r.date} à {r.time} — {r.cases} dossiers à présenter</p>
                  </div>
                  <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: 11, background: r.status === 'completed' ? '#dcfce7' : '#dbeafe', color: r.status === 'completed' ? '#16a34a' : '#1d4ed8' }}>{r.status === 'completed' ? 'Terminée' : 'Planifiée'}</span>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {r.participants.map((p, j) => (
                    <span key={j} style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, background: '#f1f5f9', color: '#475569' }}>{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'markers' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Marqueurs tumoraux — Suivi longitudinal</h3>
              <button style={{ padding: '8px 16px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>+ Saisir résultats</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {tumorMarkers.map((m, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>{m.patient}</p>
                      <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>Marqueur: <strong>{m.marker}</strong> — Norme: &lt;{m.normal}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon name={m.trend === 'down' ? 'ArrowDownIcon' : 'ArrowUpIcon'} size={14} color={m.trend === 'down' ? '#16a34a' : '#dc2626'} />
                      <span style={{ fontSize: 12, color: m.trend === 'down' ? '#16a34a' : '#dc2626' }}>{m.trend === 'down' ? 'Baisse' : 'Hausse'}</span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={100}>
                    <LineChart data={m.values}>
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="val" stroke="#7c3aed" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>Dernière valeur: <strong>{m.values[m.values.length - 1].val}</strong></span>
                    <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, background: m.status === 'normal' ? '#dcfce7' : '#fee2e2', color: m.status === 'normal' ? '#16a34a' : '#dc2626' }}>{m.status === 'normal' ? 'Normal' : 'Élevé'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
