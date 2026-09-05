'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';


type TabKey = 'dashboard' | 'eeg' | 'stroke' | 'epilepsy' | 'chronic' | 'imaging';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
  { key: 'eeg', label: 'EEG & EMG', icon: 'ChartBarIcon' },
  { key: 'stroke', label: 'AVC & Urgences', icon: 'BoltIcon' },
  { key: 'epilepsy', label: 'Épilepsie', icon: 'ExclamationTriangleIcon' },
  { key: 'chronic', label: 'Parkinson & SEP', icon: 'HeartIcon' },
  { key: 'imaging', label: 'Imagerie neuro', icon: 'PhotoIcon' },
];

const kpis = [
  { label: 'Patients suivis', value: '312', sub: 'Neurologie active', icon: 'UsersIcon', color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
  { label: 'EEG ce mois', value: '48', sub: '7 anomalies', icon: 'ChartBarIcon', color: '#0066ff', bg: 'rgba(0,102,255,0.08)' },
  { label: 'AVC en cours', value: '3', sub: 'Unité neurovasculaire', icon: 'BoltIcon', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
  { label: 'Épileptiques actifs', value: '67', sub: '12 mal contrôlés', icon: 'ExclamationTriangleIcon', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
];

const eegList = [
  { id: 'EEG-001', patient: 'Mamadou Sow', age: 34, date: '11/08/2026', type: 'EEG standard', duration: '30 min', result: 'Décharges épileptiformes temporales droites', urgency: 'high', status: 'interpreted' },
  { id: 'EEG-002', patient: 'Fatou Ndiaye', age: 28, date: '11/08/2026', type: 'EEG de sommeil', duration: '8h', result: 'Normal', urgency: 'normal', status: 'interpreted' },
  { id: 'EEG-003', patient: 'Ibrahima Fall', age: 55, date: '10/08/2026', type: 'EEG vidéo-EEG', duration: '72h', result: 'En cours', urgency: 'normal', status: 'pending' },
  { id: 'EMG-001', patient: 'Aïcha Ba', age: 62, date: '09/08/2026', type: 'EMG membres inf.', duration: '45 min', result: 'Polyneuropathie axonale sensitivo-motrice', urgency: 'medium', status: 'interpreted' },
  { id: 'EMG-002', patient: 'Oumar Diop', age: 48, date: '08/08/2026', type: 'EMG canal carpien', duration: '30 min', result: 'Syndrome canal carpien bilatéral modéré', urgency: 'low', status: 'interpreted' },
];

const strokePatients = [
  { id: 'AVC-001', patient: 'Cheikh Mbaye', age: 68, type: 'AVC ischémique', nihss: 12, onset: '08:30', thrombolysis: true, thrombectomy: false, admission: '09:15', status: 'acute' },
  { id: 'AVC-002', patient: 'Rokhaya Sarr', age: 72, type: 'AVC hémorragique', nihss: 18, onset: '03:00', thrombolysis: false, thrombectomy: false, admission: '04:30', status: 'critical' },
  { id: 'AVC-003', patient: 'Moussa Camara', age: 58, type: 'AIT', nihss: 2, onset: '14:00', thrombolysis: false, thrombectomy: false, admission: '15:30', status: 'stable' },
];

const epilepsyPatients = [
  { patient: 'Mamadou Sow', type: 'Épilepsie focale temporale', drug1: 'Lévétiracétam 1000mg/j', drug2: 'Lamotrigine 200mg/j', lastCrisis: '05/08/2026', frequency: '2/mois', control: 'partial', eeg: 'Anormal' },
  { patient: 'Fatou Ndiaye', type: 'Épilepsie généralisée idiopathique', drug1: 'Valproate 1000mg/j', drug2: 'Aucun', lastCrisis: '01/06/2026', frequency: '0/mois', control: 'good', eeg: 'Normal' },
  { patient: 'Ibrahima Fall', type: 'Épilepsie réfractaire', drug1: 'Lévétiracétam 3000mg/j', drug2: 'Lacosamide 400mg/j', lastCrisis: '10/08/2026', frequency: '8/mois', control: 'poor', eeg: 'Anormal' },
  { patient: 'Aïcha Ba', type: 'Épilepsie post-traumatique', drug1: 'Phénobarbital 100mg/j', drug2: 'Carbamazépine 400mg/j', lastCrisis: '20/07/2026', frequency: '1/mois', control: 'partial', eeg: 'Anormal' },
];

const chronicPatients = [
  { patient: 'Oumar Diop', disease: 'Maladie de Parkinson', stage: 'Stade 3 Hoehn & Yahr', treatment: 'Lévodopa/Carbidopa 100/25mg x4', lastVisit: '01/08/2026', nextVisit: '01/11/2026', status: 'stable' },
  { patient: 'Mariama Balde', disease: 'Sclérose en plaques RR', stage: 'EDSS 3.5', treatment: 'Natalizumab 300mg/4sem', lastVisit: '15/07/2026', nextVisit: '15/10/2026', status: 'monitoring' },
  { patient: 'Cheikh Diallo', disease: 'Maladie de Parkinson', stage: 'Stade 2 Hoehn & Yahr', treatment: 'Pramipexole 1.05mg x3', lastVisit: '05/08/2026', nextVisit: '05/11/2026', status: 'stable' },
  { patient: 'Ndéye Gaye', disease: 'SEP progressive primaire', stage: 'EDSS 5.0', treatment: 'Ocrelizumab 600mg/6mois', lastVisit: '20/07/2026', nextVisit: '20/01/2027', status: 'monitoring' },
];

const imagingList = [
  { id: 'IRM-001', patient: 'Cheikh Mbaye', type: 'IRM cérébrale + ARM', indication: 'AVC ischémique', date: '11/08/2026', result: 'Infarctus sylvien droit — Occlusion ACM', urgency: 'urgent', status: 'reported' },
  { id: 'IRM-002', patient: 'Mariama Balde', type: 'IRM cérébrale + médullaire', indication: 'Suivi SEP', date: '10/08/2026', result: '2 nouvelles lésions T2 — Pas de prise de contraste', urgency: 'normal', status: 'reported' },
  { id: 'TDM-001', patient: 'Rokhaya Sarr', type: 'TDM cérébrale sans injection', indication: 'AVC hémorragique', date: '11/08/2026', result: 'Hématome putaminal droit 35mL — Engagement', urgency: 'urgent', status: 'reported' },
  { id: 'IRM-003', patient: 'Ibrahima Fall', type: 'IRM cérébrale fonctionnelle', indication: 'Épilepsie réfractaire', date: '08/08/2026', result: 'Dysplasie corticale focale temporale droite', urgency: 'normal', status: 'reported' },
];

const controlConfig: Record<string, { label: string; bg: string; color: string }> = {
  good: { label: 'Bon contrôle', bg: '#dcfce7', color: '#16a34a' },
  partial: { label: 'Partiel', bg: '#fef3c7', color: '#b45309' },
  poor: { label: 'Mauvais contrôle', bg: '#fee2e2', color: '#dc2626' },
  stable: { label: 'Stable', bg: '#dcfce7', color: '#16a34a' },
  monitoring: { label: 'Surveillance', bg: '#dbeafe', color: '#1d4ed8' },
  acute: { label: 'Phase aiguë', bg: '#fef3c7', color: '#b45309' },
  critical: { label: 'Critique', bg: '#fee2e2', color: '#dc2626' },
  reported: { label: 'Rapporté', bg: '#dcfce7', color: '#16a34a' },
  pending: { label: 'En cours', bg: '#fef3c7', color: '#b45309' },
  interpreted: { label: 'Interprété', bg: '#dcfce7', color: '#16a34a' },
  urgent: { label: 'Urgent', bg: '#fee2e2', color: '#dc2626' },
  normal: { label: 'Normal', bg: '#f1f5f9', color: '#64748b' },
};

export default function NeurologyWorkspaceContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)', padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="CpuChipIcon" size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Neurologie</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0 }}>EEG/EMG — AVC — Épilepsie — Parkinson — SEP — Imagerie neuro</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <span style={{ background: '#dc2626', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>3 AVC ACTIFS</span>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 12 }}>312 patients</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 20, borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, background: activeTab === tab.key ? '#fff' : 'transparent', color: activeTab === tab.key ? '#7c3aed' : 'rgba(255,255,255,0.8)', transition: 'all 0.2s' }}>
              <Icon name={tab.icon} size={15} color={activeTab === tab.key ? '#7c3aed' : 'rgba(255,255,255,0.8)'} />
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
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>AVC en cours — Unité neurovasculaire</h3>
                {strokePatients.map((s, i) => (
                  <div key={i} style={{ padding: '12px 0', borderBottom: i < strokePatients.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{s.patient} <span style={{ color: '#94a3b8', fontWeight: 400 }}>{s.age}a</span></div>
                        <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{s.type} — NIHSS: <strong>{s.nihss}</strong></div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Début: {s.onset} | Admission: {s.admission}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                        <span style={{ background: controlConfig[s.status]?.bg, color: controlConfig[s.status]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{controlConfig[s.status]?.label}</span>
                        {s.thrombolysis && <span style={{ background: '#dbeafe', color: '#1d4ed8', borderRadius: 6, padding: '2px 8px', fontSize: 10, fontWeight: 600 }}>Thrombolyse</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>Examens récents EEG/EMG</h3>
                {eegList.slice(0, 4).map((e, i) => (
                  <div key={i} style={{ padding: '10px 0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{e.patient} — {e.type}</div>
                        <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{e.result}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{e.date}</div>
                      </div>
                      <span style={{ background: controlConfig[e.status]?.bg, color: controlConfig[e.status]?.color, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{controlConfig[e.status]?.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'eeg' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Examens EEG & EMG</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['ID', 'Patient', 'Type', 'Durée', 'Résultat', 'Date', 'Urgence', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {eegList.map((e, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{e.id}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{e.patient} <span style={{ color: '#94a3b8', fontWeight: 400 }}>{e.age}a</span></td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: '#ede9fe', color: '#7c3aed', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{e.type}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{e.duration}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569', maxWidth: 200 }}>{e.result}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{e.date}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: controlConfig[e.urgency]?.bg, color: controlConfig[e.urgency]?.color, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{e.urgency === 'high' ? 'Urgent' : e.urgency === 'medium' ? 'Modéré' : 'Normal'}</span></td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: controlConfig[e.status]?.bg, color: controlConfig[e.status]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{controlConfig[e.status]?.label}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'stroke' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Unité Neurovasculaire — AVC & Urgences</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {strokePatients.map((s, i) => (
                <div key={i} style={{ border: `2px solid ${s.status === 'critical' ? '#dc2626' : s.status === 'acute' ? '#f59e0b' : '#e2e8f0'}`, borderRadius: 12, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{s.patient}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{s.age} ans — {s.id}</div>
                    </div>
                    <span style={{ background: controlConfig[s.status]?.bg, color: controlConfig[s.status]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{controlConfig[s.status]?.label}</span>
                  </div>
                  <div style={{ background: '#f8fafc', borderRadius: 8, padding: 12, marginBottom: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{s.type}</div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                      <div><div style={{ fontSize: 11, color: '#94a3b8' }}>NIHSS</div><div style={{ fontSize: 20, fontWeight: 700, color: s.nihss >= 15 ? '#dc2626' : s.nihss >= 8 ? '#f59e0b' : '#16a34a' }}>{s.nihss}</div></div>
                      <div><div style={{ fontSize: 11, color: '#94a3b8' }}>Début</div><div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{s.onset}</div></div>
                      <div><div style={{ fontSize: 11, color: '#94a3b8' }}>Admission</div><div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{s.admission}</div></div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {s.thrombolysis && <span style={{ background: '#dbeafe', color: '#1d4ed8', borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>✓ Thrombolyse</span>}
                    {s.thrombectomy && <span style={{ background: '#ede9fe', color: '#7c3aed', borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>✓ Thrombectomie</span>}
                    {!s.thrombolysis && !s.thrombectomy && <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: 6, padding: '3px 10px', fontSize: 11 }}>Traitement médical</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'epilepsy' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Suivi épilepsie</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Patient', 'Type d\'épilepsie', 'Traitement 1', 'Traitement 2', 'Dernière crise', 'Fréquence', 'Contrôle', 'EEG'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {epilepsyPatients.map((e, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{e.patient}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{e.type}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{e.drug1}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{e.drug2}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{e.lastCrisis}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#1e293b', fontWeight: 600 }}>{e.frequency}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: controlConfig[e.control]?.bg, color: controlConfig[e.control]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{controlConfig[e.control]?.label}</span></td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: e.eeg === 'Anormal' ? '#fee2e2' : '#dcfce7', color: e.eeg === 'Anormal' ? '#dc2626' : '#16a34a', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{e.eeg}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'chronic' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Parkinson & Sclérose en plaques</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Patient', 'Maladie', 'Stade', 'Traitement', 'Dernière visite', 'Prochaine visite', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chronicPatients.map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{p.patient}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: p.disease.includes('Parkinson') ? '#fef3c7' : '#ede9fe', color: p.disease.includes('Parkinson') ? '#b45309' : '#7c3aed', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{p.disease}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{p.stage}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{p.treatment}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{p.lastVisit}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{p.nextVisit}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: controlConfig[p.status]?.bg, color: controlConfig[p.status]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{controlConfig[p.status]?.label}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'imaging' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Imagerie neurologique</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['ID', 'Patient', 'Examen', 'Indication', 'Date', 'Résultat', 'Urgence', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {imagingList.map((img, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{img.id}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{img.patient}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: '#ede9fe', color: '#7c3aed', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{img.type}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{img.indication}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{img.date}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569', maxWidth: 220 }}>{img.result}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: controlConfig[img.urgency]?.bg, color: controlConfig[img.urgency]?.color, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{controlConfig[img.urgency]?.label}</span></td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: controlConfig[img.status]?.bg, color: controlConfig[img.status]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{controlConfig[img.status]?.label}</span></td>
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
