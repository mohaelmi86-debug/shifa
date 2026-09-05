'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type TabKey = 'dashboard' | 'preanesthesia' | 'protocols' | 'intraop' | 'pacu' | 'schedule';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
  { key: 'preanesthesia', label: 'Consultation pré-anesthésique', icon: 'ClipboardDocumentListIcon' },
  { key: 'protocols', label: 'Protocoles', icon: 'BookOpenIcon' },
  { key: 'intraop', label: 'Monitoring peropératoire', icon: 'ChartBarIcon' },
  { key: 'pacu', label: 'SSPI', icon: 'HeartIcon' },
  { key: 'schedule', label: 'Planning bloc', icon: 'CalendarDaysIcon' },
];

const kpis = [
  { label: 'Interventions/sem.', value: '48', sub: '8 urgentes', icon: 'ScissorsIcon', color: '#0066ff', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Consultations pré-anest.', value: '32', sub: 'Cette semaine', icon: 'ClipboardDocumentListIcon', color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
  { label: 'En SSPI', value: '4', sub: 'Surveillance active', icon: 'HeartIcon', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  { label: 'Incidents anesthésiques', value: '0', sub: 'Ce mois', icon: 'ShieldCheckIcon', color: '#16a34a', bg: 'rgba(22,163,74,0.08)' },
];

const preAnesthesiaConsults = [
  { id: 'CPA-001', patient: 'Mamadou Sow', age: 58, surgery: 'Colectomie droite', date: '12/08/2026', asa: 3, allergies: 'Pénicilline', comorbidities: 'HTA, Diabète T2', anesthesia: 'AG', status: 'validated' },
  { id: 'CPA-002', patient: 'Fatou Ndiaye', age: 42, surgery: 'Cholécystectomie laparoscopique', date: '12/08/2026', asa: 2, allergies: 'Aucune', comorbidities: 'Aucune', anesthesia: 'AG', status: 'validated' },
  { id: 'CPA-003', patient: 'Ibrahima Fall', age: 72, surgery: 'PTH droite', date: '13/08/2026', asa: 3, allergies: 'AINS', comorbidities: 'Cardiopathie, IRC', anesthesia: 'ALR rachianesthésie', status: 'pending' },
  { id: 'CPA-004', patient: 'Aïcha Ba', age: 35, surgery: 'Appendicectomie', date: '11/08/2026', asa: 1, allergies: 'Aucune', comorbidities: 'Aucune', anesthesia: 'AG', status: 'urgent' },
  { id: 'CPA-005', patient: 'Oumar Diop', age: 65, surgery: 'Pontage coronarien', date: '14/08/2026', asa: 4, allergies: 'Latex', comorbidities: 'Coronaropathie, BPCO', anesthesia: 'AG + CEC', status: 'validated' },
];

const protocols = [
  { name: 'Induction anesthésique standard adulte', category: 'Induction', drugs: ['Propofol 2mg/kg', 'Fentanyl 2mcg/kg', 'Rocuronium 0.6mg/kg'], lastUpdate: '01/06/2026', version: '3.2', status: 'active' },
  { name: 'TIVA (Anesthésie totale IV)', category: 'Entretien', drugs: ['Propofol AIVOC', 'Rémifentanil AIVOC'], lastUpdate: '15/05/2026', version: '2.1', status: 'active' },
  { name: 'Rachianesthésie pour chirurgie orthopédique', category: 'ALR', drugs: ['Bupivacaïne hyperbare 0.5% 3mL', 'Morphine 100mcg'], lastUpdate: '20/04/2026', version: '1.8', status: 'active' },
  { name: 'Analgésie multimodale postopératoire', category: 'Analgésie', drugs: ['Paracétamol 1g/6h', 'Kétoprofène 100mg/8h', 'Morphine PCA'], lastUpdate: '10/07/2026', version: '4.0', status: 'active' },
  { name: 'Protocole intubation difficile', category: 'Urgence', drugs: ['Kétamine 1.5mg/kg', 'Succinylcholine 1.5mg/kg'], lastUpdate: '01/08/2026', version: '2.5', status: 'active' },
  { name: 'Anesthésie pédiatrique < 10 ans', category: 'Pédiatrie', drugs: ['Sévoflurane 8% induction', 'Propofol 2.5mg/kg entretien'], lastUpdate: '15/07/2026', version: '3.1', status: 'active' },
];

const intraopData = [
  { time: '08:00', fc: 72, pas: 128, spo2: 99, etco2: 35, bis: 45 },
  { time: '08:15', fc: 68, pas: 115, spo2: 99, etco2: 34, bis: 42 },
  { time: '08:30', fc: 75, pas: 122, spo2: 98, etco2: 36, bis: 48 },
  { time: '08:45', fc: 82, pas: 135, spo2: 99, etco2: 38, bis: 52 },
  { time: '09:00', fc: 70, pas: 118, spo2: 99, etco2: 35, bis: 44 },
  { time: '09:15', fc: 68, pas: 112, spo2: 99, etco2: 34, bis: 41 },
  { time: '09:30', fc: 72, pas: 120, spo2: 99, etco2: 35, bis: 43 },
];

const pacuPatients = [
  { id: 'SSPI-001', patient: 'Fatou Ndiaye', surgery: 'Cholécystectomie', anesthesia: 'AG', entryTime: '10:45', aldrete: 9, pain: 2, nausea: 'Non', status: 'ready_discharge' },
  { id: 'SSPI-002', patient: 'Aïcha Ba', surgery: 'Appendicectomie', anesthesia: 'AG', entryTime: '09:30', aldrete: 7, pain: 5, nausea: 'Oui', status: 'monitoring' },
  { id: 'SSPI-003', patient: 'Cheikh Mbaye', surgery: 'Hernie inguinale', anesthesia: 'ALR', entryTime: '11:15', aldrete: 8, pain: 3, nausea: 'Non', status: 'monitoring' },
  { id: 'SSPI-004', patient: 'Ndéye Gaye', surgery: 'Thyroïdectomie', anesthesia: 'AG', entryTime: '12:00', aldrete: 6, pain: 4, nausea: 'Légère', status: 'alert' },
];

const schedule = [
  { time: '08:00', patient: 'Mamadou Sow', surgery: 'Colectomie droite', room: 'Bloc 1', surgeon: 'Dr. Diallo', anesthesiologist: 'Dr. Sy', duration: '3h', status: 'in_progress' },
  { time: '08:00', patient: 'Fatou Ndiaye', surgery: 'Cholécystectomie laparoscopique', room: 'Bloc 2', surgeon: 'Dr. Fall', anesthesiologist: 'Dr. Ba', duration: '1h30', status: 'completed' },
  { time: '10:00', patient: 'Ibrahima Fall', surgery: 'PTH droite', room: 'Bloc 3', surgeon: 'Dr. Mbaye', anesthesiologist: 'Dr. Sy', duration: '2h', status: 'scheduled' },
  { time: '11:30', patient: 'Aïcha Ba', surgery: 'Appendicectomie', room: 'Bloc 1', surgeon: 'Dr. Diallo', anesthesiologist: 'Dr. Ba', duration: '1h', status: 'completed' },
  { time: '14:00', patient: 'Oumar Diop', surgery: 'Pontage coronarien', room: 'Bloc Cardio', surgeon: 'Dr. Ndiaye', anesthesiologist: 'Dr. Sy', duration: '5h', status: 'scheduled' },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  validated: { label: 'Validée', bg: '#dcfce7', color: '#16a34a' },
  pending: { label: 'En attente', bg: '#fef3c7', color: '#b45309' },
  urgent: { label: 'Urgente', bg: '#fee2e2', color: '#dc2626' },
  active: { label: 'Actif', bg: '#dcfce7', color: '#16a34a' },
  ready_discharge: { label: 'Prêt sortie', bg: '#dcfce7', color: '#16a34a' },
  monitoring: { label: 'Surveillance', bg: '#dbeafe', color: '#1d4ed8' },
  alert: { label: 'Alerte', bg: '#fee2e2', color: '#dc2626' },
  in_progress: { label: 'En cours', bg: '#fef3c7', color: '#b45309' },
  completed: { label: 'Terminée', bg: '#dcfce7', color: '#16a34a' },
  scheduled: { label: 'Planifiée', bg: '#dbeafe', color: '#1d4ed8' },
};

export default function ProAnesthesiaContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)', padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="ScissorsIcon" size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Anesthésie & Bloc Opératoire</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0 }}>Consultation pré-anesthésique — Protocoles — Monitoring peropératoire — SSPI</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 12 }}>4 en SSPI</span>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 12 }}>48 interventions/sem</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 20, borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, background: activeTab === tab.key ? '#fff' : 'transparent', color: activeTab === tab.key ? '#1d4ed8' : 'rgba(255,255,255,0.8)', transition: 'all 0.2s' }}>
              <Icon name={tab.icon} size={15} color={activeTab === tab.key ? '#1d4ed8' : 'rgba(255,255,255,0.8)'} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '28px 32px' }}>
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              {kpis.map((k, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={k.icon} size={18} color={k.color} />
                    </div>
                    <span style={{ fontSize: 13, color: '#64748b' }}>{k.label}</span>
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: '#1e293b' }}>{k.value}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{k.sub}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>Planning bloc — Aujourd'hui</h3>
                {schedule.map((s, i) => (
                  <div key={i} style={{ padding: '10px 0', borderBottom: i < schedule.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace', width: 45 }}>{s.time}</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{s.patient}</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>{s.surgery} — {s.room}</div>
                        </div>
                      </div>
                      <span style={{ background: statusConfig[s.status]?.bg, color: statusConfig[s.status]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{statusConfig[s.status]?.label}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>SSPI — Patients en surveillance</h3>
                {pacuPatients.map((p, i) => (
                  <div key={i} style={{ padding: '10px 0', borderBottom: i < pacuPatients.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{p.patient}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>Aldrete: {p.aldrete}/10 — Douleur: {p.pain}/10</div>
                      </div>
                      <span style={{ background: statusConfig[p.status]?.bg, color: statusConfig[p.status]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{statusConfig[p.status]?.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preanesthesia' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Consultations pré-anesthésiques</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['ID', 'Patient', 'Chirurgie prévue', 'Date', 'ASA', 'Allergies', 'Comorbidités', 'Type anesthésie', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preAnesthesiaConsults.map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{c.id}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{c.patient} <span style={{ color: '#94a3b8', fontWeight: 400 }}>{c.age}a</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{c.surgery}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{c.date}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: c.asa >= 4 ? '#fee2e2' : c.asa >= 3 ? '#fef3c7' : '#dcfce7', color: c.asa >= 4 ? '#dc2626' : c.asa >= 3 ? '#b45309' : '#16a34a', borderRadius: 6, padding: '3px 10px', fontSize: 13, fontWeight: 700 }}>ASA {c.asa}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: c.allergies !== 'Aucune' ? '#dc2626' : '#16a34a', fontWeight: c.allergies !== 'Aucune' ? 700 : 400 }}>{c.allergies}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{c.comorbidities}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: '#dbeafe', color: '#1d4ed8', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{c.anesthesia}</span></td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: statusConfig[c.status]?.bg, color: statusConfig[c.status]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{statusConfig[c.status]?.label}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'protocols' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {protocols.map((p, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <span style={{ background: '#dbeafe', color: '#1d4ed8', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{p.category}</span>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', margin: '8px 0 4px' }}>{p.name}</h4>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>v{p.version} — MAJ: {p.lastUpdate}</div>
                  </div>
                  <span style={{ background: statusConfig[p.status]?.bg, color: statusConfig[p.status]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{statusConfig[p.status]?.label}</span>
                </div>
                <div style={{ background: '#f8fafc', borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6, fontWeight: 600 }}>MÉDICAMENTS</div>
                  {p.drugs.map((d, j) => (
                    <div key={j} style={{ fontSize: 12, color: '#475569', padding: '2px 0' }}>• {d}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'intraop' && (
          <div>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Monitoring peropératoire — Mamadou Sow (Colectomie droite)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={intraopData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="fc" stroke="#dc2626" strokeWidth={2} name="FC (bpm)" dot={false} />
                  <Line type="monotone" dataKey="pas" stroke="#0066ff" strokeWidth={2} name="PAS (mmHg)" dot={false} />
                  <Line type="monotone" dataKey="spo2" stroke="#16a34a" strokeWidth={2} name="SpO2 (%)" dot={false} />
                  <Line type="monotone" dataKey="bis" stroke="#f59e0b" strokeWidth={2} name="BIS" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
              {[
                { label: 'FC', value: '72 bpm', color: '#dc2626', icon: 'HeartIcon' },
                { label: 'PAS', value: '120 mmHg', color: '#0066ff', icon: 'ChartBarIcon' },
                { label: 'SpO2', value: '99%', color: '#16a34a', icon: 'ArrowPathIcon' },
                { label: 'EtCO2', value: '35 mmHg', color: '#7c3aed', icon: 'BeakerIcon' },
                { label: 'BIS', value: '43', color: '#f59e0b', icon: 'CpuChipIcon' },
              ].map((v, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', textAlign: 'center', borderTop: `4px solid ${v.color}` }}>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>{v.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: v.color }}>{v.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'pacu' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>SSPI — Salle de Surveillance Post-Interventionnelle</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['ID', 'Patient', 'Chirurgie', 'Anesthésie', 'Entrée SSPI', 'Score Aldrete', 'Douleur (EVA)', 'Nausées', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pacuPatients.map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{p.id}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{p.patient}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{p.surgery}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: '#dbeafe', color: '#1d4ed8', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{p.anesthesia}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{p.entryTime}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: p.aldrete >= 9 ? '#dcfce7' : p.aldrete >= 7 ? '#fef3c7' : '#fee2e2', color: p.aldrete >= 9 ? '#16a34a' : p.aldrete >= 7 ? '#b45309' : '#dc2626', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>{p.aldrete}/10</span></td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: p.pain >= 7 ? '#fee2e2' : p.pain >= 4 ? '#fef3c7' : '#dcfce7', color: p.pain >= 7 ? '#dc2626' : p.pain >= 4 ? '#b45309' : '#16a34a', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>{p.pain}/10</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: p.nausea !== 'Non' ? '#f59e0b' : '#16a34a', fontWeight: p.nausea !== 'Non' ? 700 : 400 }}>{p.nausea}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: statusConfig[p.status]?.bg, color: statusConfig[p.status]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{statusConfig[p.status]?.label}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Planning bloc opératoire — 12/08/2026</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Heure', 'Patient', 'Intervention', 'Salle', 'Chirurgien', 'Anesthésiste', 'Durée', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schedule.map((s, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 700, color: '#1e293b', fontFamily: 'monospace' }}>{s.time}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{s.patient}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{s.surgery}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: '#dbeafe', color: '#1d4ed8', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{s.room}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{s.surgeon}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{s.anesthesiologist}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{s.duration}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: statusConfig[s.status]?.bg, color: statusConfig[s.status]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{statusConfig[s.status]?.label}</span></td>
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
