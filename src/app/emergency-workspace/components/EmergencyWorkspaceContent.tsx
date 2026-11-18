'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type TabKey = 'dashboard' | 'triage' | 'patients' | 'resuscitation' | 'procedures' | 'discharge';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
  { key: 'triage', label: 'Triage', icon: 'FunnelIcon' },
  { key: 'patients', label: 'Patients actifs', icon: 'UsersIcon' },
  { key: 'resuscitation', label: 'Réanimation', icon: 'BoltIcon' },
  { key: 'procedures', label: 'Actes & Procédures', icon: 'ScissorsIcon' },
  { key: 'discharge', label: 'Sorties & Orientations', icon: 'ArrowRightCircleIcon' },
];

const kpis = [
  { label: 'Patients présents', value: '23', icon: 'UsersIcon', color: '#dc2626' },
  { label: 'Temps attente moy.', value: '28 min', icon: 'ClockIcon', color: '#d97706' },
  { label: 'Lits disponibles', value: '4/18', icon: 'BuildingOffice2Icon', color: '#0066ff' },
  { label: 'Niveau 1 (CCMU)', value: '2', icon: 'BoltIcon', color: '#dc2626' },
  { label: 'Admissions/24h', value: '47', icon: 'ArrowDownTrayIcon', color: '#059669' },
  { label: 'Sorties/24h', value: '44', icon: 'ArrowUpTrayIcon', color: '#7c3aed' },
];

const triagePatients = [
  { id: 'URG-001', name: 'Mamadou Diallo', age: 67, complaint: 'Douleur thoracique — irradiation bras gauche', ccmu: 1, arrival: '08h42', wait: '0 min', nurse: 'Inf. Sow', status: 'en_salle_resus' },
  { id: 'URG-002', name: 'Fatoumata Ndiaye', age: 34, complaint: 'Dyspnée aiguë — SpO2 88%', ccmu: 2, arrival: '09h05', wait: '5 min', nurse: 'Inf. Sow', status: 'en_cours' },
  { id: 'URG-003', name: 'Ibrahima Ba', age: 8, complaint: 'Convulsions fébriles — T° 39.8°C', ccmu: 2, arrival: '09h18', wait: '8 min', nurse: 'Inf. Camara', status: 'en_cours' },
  { id: 'URG-004', name: 'Aïcha Kouyaté', age: 52, complaint: 'Traumatisme crânien — AVP', ccmu: 2, arrival: '09h30', wait: '12 min', nurse: 'Inf. Camara', status: 'attente_imagerie' },
  { id: 'URG-005', name: 'Oumar Traoré', age: 45, complaint: 'Douleur abdominale — défense', ccmu: 3, arrival: '09h45', wait: '18 min', nurse: 'Inf. Diop', status: 'attente_bilan' },
  { id: 'URG-006', name: 'Mariama Bah', age: 29, complaint: 'Céphalées intenses — raideur nuque', ccmu: 2, arrival: '10h00', wait: '22 min', nurse: 'Inf. Diop', status: 'attente_bilan' },
  { id: 'URG-007', name: 'Cheikh Fall', age: 72, complaint: 'Chute — douleur hanche droite', ccmu: 3, arrival: '10h15', wait: '35 min', nurse: 'Inf. Sow', status: 'attente_radio' },
];

const ccmuConfig: Record<number, { bg: string; color: string; label: string }> = {
  1: { bg: '#fee2e2', color: '#dc2626', label: 'CCMU 1 — Critique' },
  2: { bg: '#fef3c7', color: '#b45309', label: 'CCMU 2 — Urgent' },
  3: { bg: '#dbeafe', color: '#1d4ed8', label: 'CCMU 3 — Semi-urgent' },
  4: { bg: '#dcfce7', color: '#16a34a', label: 'CCMU 4 — Non urgent' },
  5: { bg: '#f1f5f9', color: '#64748b', label: 'CCMU 5 — Conseil' },
};

const statusLabels: Record<string, { label: string; color: string }> = {
  en_salle_resus: { label: 'Salle réanimation', color: '#dc2626' },
  en_cours: { label: 'En cours', color: '#d97706' },
  attente_imagerie: { label: 'Attente imagerie', color: '#0066ff' },
  attente_bilan: { label: 'Attente bilan', color: '#7c3aed' },
  attente_radio: { label: 'Attente radio', color: '#0891b2' },
};

const resusPatients = [
  { id: 'URG-001', name: 'Mamadou Diallo', age: 67, diagnosis: 'SCA STEMI — IDM antérieur', fc: 110, pas: 88, spo2: 94, gcs: 14, action: 'ECG 12D + Troponine + Cardio de garde', time: '08h42', physician: 'Dr. Sow' },
  { id: 'URG-008', name: 'Kadiatou Barry', age: 22, diagnosis: 'Anaphylaxie — piqûre d\'abeille', fc: 128, pas: 72, spo2: 91, gcs: 13, action: 'Adrénaline 0.5mg IM + VVP + Remplissage', time: '10h30', physician: 'Dr. Diallo' },
];

const procedures = [
  { patient: 'Fatoumata Ndiaye', procedure: 'Pose VVP + O2 masque haute concentration', physician: 'Dr. Sow', time: '09h10', status: 'fait' },
  { patient: 'Ibrahima Ba', procedure: 'Diazépam 0.5mg/kg IV + Monitoring', physician: 'Dr. Camara', time: '09h25', status: 'fait' },
  { patient: 'Aïcha Kouyaté', procedure: 'TDM cérébral sans injection', physician: 'Dr. Diallo', time: '09h45', status: 'en_cours' },
  { patient: 'Oumar Traoré', procedure: 'Bilan biologique complet + Écho abdominale', physician: 'Dr. Sow', time: '10h00', status: 'en_cours' },
  { patient: 'Cheikh Fall', procedure: 'Radiographie bassin + hanche droite', physician: 'Dr. Camara', time: '10h20', status: 'planifié' },
  { patient: 'Mariama Bah', procedure: 'PL + Bilan infectieux + Hémocultures', physician: 'Dr. Diallo', time: '10h15', status: 'planifié' },
];

const discharges = [
  { patient: 'Seydou Koné', age: 38, diagnosis: 'Entorse cheville — grade II', destination: 'Domicile', instructions: 'Attelle + AINS + Kiné J+3', time: '09h30', physician: 'Dr. Camara' },
  { patient: 'Rokhaya Diop', age: 61, diagnosis: 'HTA maligne — PA 200/120', destination: 'Hospitalisation cardiologie', instructions: 'Transfert service cardiologie — chambre 204', time: '10h00', physician: 'Dr. Sow' },
  { patient: 'Moussa Baldé', age: 14, diagnosis: 'Fracture radius distal', destination: 'Bloc orthopédie', instructions: 'Réduction + plâtre sous AG', time: '10h45', physician: 'Dr. Diallo' },
];

export default function EmergencyWorkspaceContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)', padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="BoltIcon" size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Urgences — SAU</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0 }}>Triage CCMU · Réanimation · Actes · Orientations</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <span style={{ background: '#fff', color: '#dc2626', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 700 }}>23 PATIENTS PRÉSENTS</span>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 12 }}>4 lits libres</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 20, borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, background: activeTab === tab.key ? '#fff' : 'transparent', color: activeTab === tab.key ? '#dc2626' : 'rgba(255,255,255,0.8)', transition: 'all 0.2s' }}>
              <Icon name={tab.icon as any} size={14} color={activeTab === tab.key ? '#dc2626' : 'rgba(255,255,255,0.8)'} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '28px 32px' }}>
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14, marginBottom: 24 }}>
              {kpis.map((k, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderTop: `3px solid ${k.color}` }}>
                  <Icon name={k.icon as any} size={18} color={k.color} />
                  <div style={{ fontSize: 26, fontWeight: 700, color: '#1e293b', marginTop: 8 }}>{k.value}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{k.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 14 }}>Répartition par niveau CCMU</h3>
                {[
                  { level: 1, count: 2, pct: 9, label: 'Critique — Pronostic vital immédiat' },
                  { level: 2, count: 8, pct: 35, label: 'Urgent — Pronostic vital potentiel' },
                  { level: 3, count: 9, pct: 39, label: 'Semi-urgent — Stabilité hémodynamique' },
                  { level: 4, count: 3, pct: 13, label: 'Non urgent — Pas de risque vital' },
                  { level: 5, count: 1, pct: 4, label: 'Conseil — Orientation ambulatoire' },
                ].map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <span style={{ background: ccmuConfig[c.level].bg, color: ccmuConfig[c.level].color, borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700, minWidth: 70, textAlign: 'center' }}>CCMU {c.level}</span>
                    <div style={{ flex: 1, height: 8, background: '#f1f5f9', borderRadius: 4 }}>
                      <div style={{ height: '100%', width: `${c.pct}%`, background: ccmuConfig[c.level].color, borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', minWidth: 30 }}>{c.count}</span>
                    <span style={{ fontSize: 12, color: '#64748b', minWidth: 200 }}>{c.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 14 }}>Salle de réanimation</h3>
                {resusPatients.map((r, i) => (
                  <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', marginBottom: 10 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, color: '#dc2626', margin: '0 0 4px' }}>{r.name} — {r.age} ans</p>
                    <p style={{ fontSize: 12, color: '#475569', margin: '0 0 6px' }}>{r.diagnosis}</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {[`FC: ${r.fc}`, `PAS: ${r.pas}`, `SpO2: ${r.spo2}%`, `GCS: ${r.gcs}`].map((v, j) => (
                        <span key={j} style={{ background: '#fff', border: '1px solid #fecaca', borderRadius: 6, padding: '2px 8px', fontSize: 11, color: '#dc2626', fontFamily: 'monospace', fontWeight: 600 }}>{v}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'triage' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', margin: 0 }}>File de triage — Temps réel</h3>
              <button style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}>+ Enregistrer patient</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['ID', 'Patient', 'Âge', 'Motif', 'CCMU', 'Arrivée', 'Attente', 'IDE', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {triagePatients.map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc', background: p.ccmu === 1 ? '#fff5f5' : 'transparent' }}>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{p.id}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{p.name}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: '#475569' }}>{p.age} ans</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569', maxWidth: 200 }}>{p.complaint}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: ccmuConfig[p.ccmu].bg, color: ccmuConfig[p.ccmu].color, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>CCMU {p.ccmu}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{p.arrival}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: p.ccmu <= 2 ? '#dc2626' : '#64748b', fontWeight: p.ccmu <= 2 ? 700 : 400 }}>{p.wait}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{p.nurse}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: '#f1f5f9', color: statusLabels[p.status]?.color || '#64748b', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{statusLabels[p.status]?.label || p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'patients' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Patients actifs aux urgences</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Patient', 'Diagnostic provisoire', 'CCMU', 'Médecin', 'Actes en cours', 'Durée présence'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {triagePatients.slice(0, 5).map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{p.name} <span style={{ color: '#94a3b8', fontWeight: 400 }}>{p.age}a</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{p.complaint}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: ccmuConfig[p.ccmu].bg, color: ccmuConfig[p.ccmu].color, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>CCMU {p.ccmu}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>Dr. Sow</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{procedures.find(pr => pr.patient === p.name)?.procedure || 'Évaluation initiale'}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#0066ff', fontFamily: 'monospace' }}>{i * 12 + 22} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'resuscitation' && (
          <div>
            {resusPatients.map((r, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16, borderLeft: '4px solid #dc2626' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: 0 }}>{r.name} — {r.age} ans</h3>
                    <p style={{ fontSize: 13, color: '#dc2626', fontWeight: 600, margin: '4px 0 0' }}>{r.diagnosis}</p>
                    <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>Arrivée : {r.time} · {r.physician}</p>
                  </div>
                  <span style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 700 }}>SALLE RÉANIMATION</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 14 }}>
                  {[
                    { label: 'FC', value: `${r.fc} bpm`, alert: r.fc > 100 },
                    { label: 'PAS', value: `${r.pas} mmHg`, alert: r.pas < 90 },
                    { label: 'SpO2', value: `${r.spo2}%`, alert: r.spo2 < 95 },
                    { label: 'GCS', value: `${r.gcs}/15`, alert: r.gcs < 14 },
                  ].map((v, j) => (
                    <div key={j} style={{ background: v.alert ? '#fef2f2' : '#f8fafc', borderRadius: 10, padding: '12px 16px', border: `1px solid ${v.alert ? '#fecaca' : '#e2e8f0'}` }}>
                      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 4px' }}>{v.label}</p>
                      <p style={{ fontSize: 22, fontWeight: 700, color: v.alert ? '#dc2626' : '#1e293b', margin: 0 }}>{v.value}</p>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#fef3c7', borderRadius: 10, padding: '12px 16px', border: '1px solid #fde68a' }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#b45309', margin: '0 0 4px' }}>ACTION EN COURS</p>
                  <p style={{ fontSize: 13, color: '#1e293b', margin: 0 }}>{r.action}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'procedures' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', margin: 0 }}>Actes & Procédures du jour</h3>
              <button style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}>+ Tracer un acte</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Patient', 'Procédure', 'Médecin', 'Heure', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {procedures.map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{p.patient}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{p.procedure}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{p.physician}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{p.time}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ background: p.status === 'fait' ? '#dcfce7' : p.status === 'en_cours' ? '#fef3c7' : '#dbeafe', color: p.status === 'fait' ? '#16a34a' : p.status === 'en_cours' ? '#b45309' : '#1d4ed8', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>
                        {p.status === 'fait' ? 'Fait' : p.status === 'en_cours' ? 'En cours' : 'Planifié'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'discharge' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', margin: 0 }}>Sorties & Orientations du jour</h3>
              <button style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}>+ Orienter patient</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Patient', 'Âge', 'Diagnostic', 'Destination', 'Instructions', 'Heure', 'Médecin'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {discharges.map((d, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{d.patient}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: '#475569' }}>{d.age} ans</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{d.diagnosis}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: d.destination === 'Domicile' ? '#dcfce7' : '#dbeafe', color: d.destination === 'Domicile' ? '#16a34a' : '#1d4ed8', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{d.destination}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{d.instructions}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{d.time}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{d.physician}</td>
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
