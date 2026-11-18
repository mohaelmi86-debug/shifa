'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type TabKey = 'dashboard' | 'scheduling' | 'reports' | 'equipment' | 'anapath';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
  { key: 'scheduling', label: 'Planning actes', icon: 'CalendarDaysIcon' },
  { key: 'reports', label: 'Comptes-rendus', icon: 'DocumentTextIcon' },
  { key: 'equipment', label: 'Traçabilité matériel', icon: 'CpuChipIcon' },
  { key: 'anapath', label: 'Résultats anapath', icon: 'BeakerIcon' },
];

const kpis = [
  { label: 'Actes ce mois', value: '184', sub: '12 aujourd\'hui', icon: 'ClipboardDocumentListIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Endoscopes actifs', value: '8', sub: '2 en stérilisation', icon: 'CpuChipIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
  { label: 'CR à valider', value: '6', sub: 'Délai moyen 24h', icon: 'DocumentTextIcon', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  { label: 'Anapath en attente', value: '14', sub: '3 urgents', icon: 'BeakerIcon', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
];

const procedures = [
  { id: 'ENDO-001', patient: 'Mamadou Sow', age: 58, date: '12/08/2026', time: '08:30', type: 'Coloscopie totale', indication: 'Dépistage CCR — ATCD familial', endoscopist: 'Dr. Diallo', room: 'Salle 1', anesthesia: 'Sédation consciente', status: 'scheduled', prep: 'OK' },
  { id: 'ENDO-002', patient: 'Fatou Ndiaye', age: 45, date: '12/08/2026', time: '09:30', type: 'FOGD', indication: 'Épigastralgies — Recherche ulcère', endoscopist: 'Dr. Sy', room: 'Salle 2', anesthesia: 'Sans anesthésie', status: 'in-progress', prep: 'OK' },
  { id: 'ENDO-003', patient: 'Ibrahima Fall', age: 67, date: '12/08/2026', time: '11:00', type: 'Bronchoscopie', indication: 'Opacité pulmonaire — Bilan', endoscopist: 'Dr. Diallo', room: 'Salle 1', anesthesia: 'AG', status: 'scheduled', prep: 'OK' },
  { id: 'ENDO-004', patient: 'Aïcha Ba', age: 52, date: '12/08/2026', time: '14:00', type: 'Coloscopie + polypectomie', indication: 'Polype détecté — Résection', endoscopist: 'Dr. Sy', room: 'Salle 2', anesthesia: 'Sédation profonde', status: 'scheduled', prep: 'En cours' },
  { id: 'ENDO-005', patient: 'Oumar Diop', age: 71, date: '11/08/2026', time: '10:00', type: 'CPRE', indication: 'Lithiase voie biliaire principale', endoscopist: 'Dr. Diallo', room: 'Salle 1', anesthesia: 'AG', status: 'completed', prep: 'OK' },
];

const reports = [
  { id: 'CR-001', patient: 'Oumar Diop', date: '11/08/2026', type: 'CPRE', endoscopist: 'Dr. Diallo', findings: 'Calcul VBP 8mm extrait par sphinctérotomie. Voie biliaire libre en fin de procédure.', biopsies: false, status: 'signed' },
  { id: 'CR-002', patient: 'Cheikh Mbaye', date: '10/08/2026', type: 'FOGD', endoscopist: 'Dr. Sy', findings: 'Ulcère gastrique antral 1.5cm. Biopsies réalisées (×4). CLO test positif.', biopsies: true, status: 'signed' },
  { id: 'CR-003', patient: 'Mariama Balde', date: '10/08/2026', type: 'Coloscopie', endoscopist: 'Dr. Diallo', findings: 'Polype sessile 12mm au sigmoïde. Polypectomie réalisée. Pièce envoyée en anapath.', biopsies: true, status: 'signed' },
  { id: 'CR-004', patient: 'Fatou Ndiaye', date: '12/08/2026', type: 'FOGD', endoscopist: 'Dr. Sy', findings: 'En cours de rédaction...', biopsies: false, status: 'draft' },
  { id: 'CR-005', patient: 'Rokhaya Sarr', date: '09/08/2026', type: 'Rectoscopie', endoscopist: 'Dr. Diallo', findings: 'Hémorroïdes internes grade II. Pas de lésion suspecte.', biopsies: false, status: 'pending' },
];

const equipment = [
  { id: 'END-001', name: 'Coloscope Olympus CF-HQ190L', serial: 'OLY-2023-4521', type: 'Coloscope', status: 'available', lastSterilization: '11/08/2026 18:00', cycles: 1247, nextMaintenance: '01/09/2026', location: 'Salle 1' },
  { id: 'END-002', name: 'Gastroscope Olympus GIF-H290', serial: 'OLY-2022-3812', type: 'Gastroscope', status: 'in-use', lastSterilization: '12/08/2026 07:30', cycles: 2103, nextMaintenance: '15/08/2026', location: 'Salle 2' },
  { id: 'END-003', name: 'Bronchoscope Pentax EB-1970TK', serial: 'PEN-2024-0891', type: 'Bronchoscope', status: 'sterilization', lastSterilization: '12/08/2026 08:00', cycles: 456, nextMaintenance: '01/10/2026', location: 'Stérilisation' },
  { id: 'END-004', name: 'Duodénoscope Olympus TJF-Q180V', serial: 'OLY-2021-2234', type: 'Duodénoscope', status: 'available', lastSterilization: '11/08/2026 20:00', cycles: 3421, nextMaintenance: '20/08/2026', location: 'Salle 1' },
  { id: 'END-005', name: 'Coloscope Fujifilm EC-760ZP', serial: 'FUJ-2023-1567', type: 'Coloscope', status: 'maintenance', lastSterilization: '10/08/2026 18:00', cycles: 892, nextMaintenance: '12/08/2026', location: 'Maintenance' },
];

const anapathResults = [
  { id: 'ANAPATH-001', patient: 'Mariama Balde', sample: 'Polype sigmoïde 12mm', date: '10/08/2026', received: '10/08/2026', result: 'Adénome tubuleux avec dysplasie de bas grade', pathologist: 'Dr. Ndiaye', status: 'final', urgent: false },
  { id: 'ANAPATH-002', patient: 'Cheikh Mbaye', sample: 'Biopsies gastriques ×4', date: '10/08/2026', received: '10/08/2026', result: 'Gastrite chronique active — H. pylori +', pathologist: 'Dr. Ndiaye', status: 'final', urgent: false },
  { id: 'ANAPATH-003', patient: 'Ndéye Gaye', sample: 'Biopsie duodénale ×2', date: '11/08/2026', received: '11/08/2026', result: 'En attente de lecture', pathologist: 'Dr. Ndiaye', status: 'pending', urgent: true },
  { id: 'ANAPATH-004', patient: 'Aliou Diallo', sample: 'Polype rectal 8mm', date: '08/08/2026', received: '08/08/2026', result: 'Adénome tubulo-villeux avec dysplasie de haut grade', pathologist: 'Dr. Seck', status: 'final', urgent: true },
  { id: 'ANAPATH-005', patient: 'Rokhaya Sarr', sample: 'Biopsie iléale ×3', date: '09/08/2026', received: '09/08/2026', result: 'En cours de traitement', pathologist: 'Dr. Ndiaye', status: 'processing', urgent: false },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  available: { label: 'Disponible', bg: '#dcfce7', color: '#16a34a' },
  'in-use': { label: 'En utilisation', bg: '#dbeafe', color: '#1d4ed8' },
  sterilization: { label: 'Stérilisation', bg: '#fef3c7', color: '#b45309' },
  maintenance: { label: 'Maintenance', bg: '#fee2e2', color: '#dc2626' },
};

export default function ProEndoscopyContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)', padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="EyeIcon" size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>Endoscopie & Explorations Fonctionnelles</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: 0 }}>Planning actes, comptes-rendus, traçabilité matériel, résultats anapath</p>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 32px', display: 'flex', gap: 4, overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            style={{ padding: '14px 16px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: activeTab === t.key ? 600 : 400, color: activeTab === t.key ? '#0369a1' : '#64748b', borderBottom: activeTab === t.key ? '2px solid #0369a1' : '2px solid transparent', whiteSpace: 'nowrap' }}>
            <Icon name={t.icon} size={15} color={activeTab === t.key ? '#0369a1' : '#94a3b8'} />
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
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>Planning du jour</h3>
                {procedures.filter(p => p.date === '12/08/2026').map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ width: 48, textAlign: 'center', background: '#f0f9ff', borderRadius: 6, padding: '4px 0' }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: '#0369a1', margin: 0 }}>{p.time}</p>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0 }}>{p.patient} — {p.type}</p>
                      <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>{p.endoscopist} — {p.room}</p>
                    </div>
                    <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, background: p.status === 'in-progress' ? '#dbeafe' : p.status === 'completed' ? '#dcfce7' : '#f1f5f9', color: p.status === 'in-progress' ? '#1d4ed8' : p.status === 'completed' ? '#16a34a' : '#64748b' }}>
                      {p.status === 'in-progress' ? 'En cours' : p.status === 'completed' ? 'Terminé' : 'Planifié'}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>État des endoscopes</h3>
                {equipment.map((e, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < equipment.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', margin: 0 }}>{e.id} — {e.type}</p>
                      <p style={{ fontSize: 11, color: '#64748b', margin: '2px 0 0' }}>{e.location}</p>
                    </div>
                    <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, background: statusConfig[e.status].bg, color: statusConfig[e.status].color }}>{statusConfig[e.status].label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scheduling' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Planning des actes endoscopiques</h3>
              <button style={{ padding: '8px 16px', background: '#0369a1', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>+ Planifier acte</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['ID', 'Patient', 'Date/Heure', 'Type d\'acte', 'Indication', 'Endoscopiste', 'Salle', 'Anesthésie', 'Préparation', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {procedures.map((p, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 12px', fontSize: 11, color: '#64748b' }}>{p.id}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{p.patient}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{p.date} {p.time}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 11, background: '#e0f2fe', color: '#0369a1' }}>{p.type}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 11, color: '#475569', maxWidth: 160 }}>{p.indication}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{p.endoscopist}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{p.room}</td>
                    <td style={{ padding: '10px 12px', fontSize: 11, color: '#475569' }}>{p.anesthesia}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 11, background: p.prep === 'OK' ? '#dcfce7' : '#fef3c7', color: p.prep === 'OK' ? '#16a34a' : '#b45309' }}>{p.prep}</span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 11, background: p.status === 'completed' ? '#dcfce7' : p.status === 'in-progress' ? '#dbeafe' : '#f1f5f9', color: p.status === 'completed' ? '#16a34a' : p.status === 'in-progress' ? '#1d4ed8' : '#64748b' }}>
                        {p.status === 'completed' ? 'Terminé' : p.status === 'in-progress' ? 'En cours' : 'Planifié'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Comptes-rendus endoscopiques</h3>
              <button style={{ padding: '8px 16px', background: '#0369a1', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>+ Nouveau CR</button>
            </div>
            {reports.map((r, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>{r.patient} — {r.type}</p>
                    <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>{r.date} — {r.endoscopist}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {r.biopsies && <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, background: '#fef3c7', color: '#b45309' }}>Biopsies</span>}
                    <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, background: r.status === 'signed' ? '#dcfce7' : r.status === 'draft' ? '#fef3c7' : '#f1f5f9', color: r.status === 'signed' ? '#16a34a' : r.status === 'draft' ? '#b45309' : '#64748b' }}>
                      {r.status === 'signed' ? 'Signé' : r.status === 'draft' ? 'Brouillon' : 'En attente'}
                    </span>
                  </div>
                </div>
                <div style={{ background: '#f8fafc', borderRadius: 8, padding: 12, fontSize: 13, color: '#475569', fontStyle: r.status === 'draft' ? 'italic' : 'normal' }}>{r.findings}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'equipment' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Traçabilité des endoscopes</h3>
              <button style={{ padding: '8px 16px', background: '#0369a1', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>+ Enregistrer équipement</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['ID', 'Nom', 'N° Série', 'Type', 'Statut', 'Dernière stérilisation', 'Cycles', 'Prochaine maintenance', 'Localisation'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {equipment.map((e, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748b' }}>{e.id}</td>
                    <td style={{ padding: '12px 14px', fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{e.name}</td>
                    <td style={{ padding: '12px 14px', fontSize: 11, color: '#64748b' }}>{e.serial}</td>
                    <td style={{ padding: '12px 14px' }}><span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 11, background: '#e0f2fe', color: '#0369a1' }}>{e.type}</span></td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, background: statusConfig[e.status].bg, color: statusConfig[e.status].color }}>{statusConfig[e.status].label}</span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: '#475569' }}>{e.lastSterilization}</td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: '#475569' }}>{e.cycles.toLocaleString()}</td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: e.status === 'maintenance' ? '#dc2626' : '#475569', fontWeight: e.status === 'maintenance' ? 600 : 400 }}>{e.nextMaintenance}</td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: '#475569' }}>{e.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'anapath' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Résultats anatomopathologiques</h3>
            </div>
            {anapathResults.map((a, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 12, border: `1px solid ${a.urgent && a.status !== 'final' ? '#fca5a5' : '#e2e8f0'}`, padding: 20, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>{a.patient}</p>
                    <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>{a.sample} — Reçu le {a.received}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {a.urgent && <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, background: '#fee2e2', color: '#dc2626' }}>Urgent</span>}
                    <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, background: a.status === 'final' ? '#dcfce7' : a.status === 'processing' ? '#dbeafe' : '#fef3c7', color: a.status === 'final' ? '#16a34a' : a.status === 'processing' ? '#1d4ed8' : '#b45309' }}>
                      {a.status === 'final' ? 'Résultat final' : a.status === 'processing' ? 'En traitement' : 'En attente'}
                    </span>
                  </div>
                </div>
                <div style={{ background: '#f8fafc', borderRadius: 8, padding: 12, fontSize: 13, color: '#475569', marginBottom: 8 }}>{a.result}</div>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Pathologiste: {a.pathologist} — Demande: {a.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
