'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type TabKey = 'dashboard' | 'patients' | 'obstetrics' | 'gynecology' | 'oncogyneco' | 'fertility';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
  { key: 'patients', label: 'Patientes', icon: 'UsersIcon' },
  { key: 'obstetrics', label: 'Obstétrique', icon: 'HeartIcon' },
  { key: 'gynecology', label: 'Gynécologie', icon: 'ClipboardDocumentListIcon' },
  { key: 'oncogyneco', label: 'Onco-gynécologie', icon: 'BeakerIcon' },
  { key: 'fertility', label: 'Fertilité & PMA', icon: 'SparklesIcon' },
];

const kpis = [
  { label: 'Patientes suivies', value: '142', icon: 'UsersIcon', color: '#be185d' },
  { label: 'Grossesses actives', value: '38', icon: 'HeartIcon', color: '#e11d48' },
  { label: 'Accouchements/mois', value: '24', icon: 'StarIcon', color: '#7c3aed' },
  { label: 'Consultations/sem.', value: '52', icon: 'CalendarDaysIcon', color: '#0066ff' },
  { label: 'Dossiers onco actifs', value: '11', icon: 'BeakerIcon', color: '#d97706' },
  { label: 'Cycles PMA en cours', value: '6', icon: 'SparklesIcon', color: '#059669' },
];

const patients = [
  { id: 'GYN-001', name: 'Aminata Diallo', age: 28, type: 'Obstétrique', detail: 'Grossesse 32 SA — suivi normal', physician: 'Dr. Sow', nextAppt: '18/08/2026', status: 'suivi normal' },
  { id: 'GYN-002', name: 'Fatoumata Ba', age: 35, type: 'Obstétrique', detail: 'Grossesse 38 SA — pré-éclampsie légère', physician: 'Dr. Camara', nextAppt: '13/08/2026', status: 'surveillance' },
  { id: 'GYN-003', name: 'Mariama Koné', age: 42, type: 'Onco-gynéco', detail: 'Cancer col utérin stade IIB — chimioradiothérapie', physician: 'Dr. Diallo', nextAppt: '15/08/2026', status: 'traitement actif' },
  { id: 'GYN-004', name: 'Kadiatou Traoré', age: 31, type: 'PMA', detail: 'FIV — cycle 2 — stimulation ovarienne', physician: 'Dr. Sow', nextAppt: '14/08/2026', status: 'en cours' },
  { id: 'GYN-005', name: 'Rokhaya Ndiaye', age: 48, type: 'Gynécologie', detail: 'Fibrome utérin symptomatique — myomectomie planifiée', physician: 'Dr. Camara', nextAppt: '20/08/2026', status: 'planifié' },
  { id: 'GYN-006', name: 'Aïcha Baldé', age: 24, type: 'Gynécologie', detail: 'Endométriose stade III — traitement hormonal', physician: 'Dr. Diallo', nextAppt: '22/08/2026', status: 'traitement actif' },
];

const obstetricsData = [
  { patient: 'Aminata Diallo', sa: 32, parity: 'G2P1', bp: '118/72', weight: 72, fhr: 148, presentation: 'Céphalique', placenta: 'Fundique', risk: 'faible', nextEcho: '36 SA' },
  { patient: 'Fatoumata Ba', sa: 38, parity: 'G1P0', bp: '148/96', weight: 84, fhr: 142, presentation: 'Céphalique', placenta: 'Antérieur', risk: 'élevé', nextEcho: 'Urgente' },
  { patient: 'Seynabou Fall', sa: 28, parity: 'G3P2', bp: '122/78', weight: 68, fhr: 152, presentation: 'Siège', placenta: 'Postérieur', risk: 'modéré', nextEcho: '32 SA' },
  { patient: 'Oumou Diop', sa: 40, parity: 'G1P0', bp: '120/76', weight: 78, fhr: 138, presentation: 'Céphalique', placenta: 'Fundique', risk: 'faible', nextEcho: 'Déclenchement prévu' },
];

const gynecologyData = [
  { patient: 'Rokhaya Ndiaye', diagnosis: 'Fibrome utérin G3 — 8cm', treatment: 'Myomectomie laparoscopique', date: '20/08/2026', physician: 'Dr. Camara', status: 'planifié' },
  { patient: 'Aïcha Baldé', diagnosis: 'Endométriose stade III', treatment: 'Dienogest 2mg/j + suivi écho 3 mois', date: '22/08/2026', physician: 'Dr. Diallo', status: 'traitement actif' },
  { patient: 'Binta Kouyaté', diagnosis: 'Kyste ovarien fonctionnel 5cm', treatment: 'Surveillance 6 semaines — écho de contrôle', date: '28/08/2026', physician: 'Dr. Sow', status: 'surveillance' },
  { patient: 'Hawa Traoré', diagnosis: 'Ménorragies — DIU Mirena posé', treatment: 'Contrôle fils DIU — bilan fer', date: '16/08/2026', physician: 'Dr. Camara', status: 'suivi' },
];

const oncoData = [
  { patient: 'Mariama Koné', cancer: 'Col utérin', stage: 'IIB', treatment: 'Chimioradiothérapie concomitante', cycle: '3/6', response: 'Partielle', physician: 'Dr. Diallo', nextRCP: '20/08/2026' },
  { patient: 'Fatou Sow', cancer: 'Sein', stage: 'IIA', treatment: 'AC-T — cycle 4/8', cycle: '4/8', response: 'Bonne réponse', physician: 'Dr. Bah', nextRCP: '25/08/2026' },
  { patient: 'Marème Diop', cancer: 'Endomètre', stage: 'IA', treatment: 'Hystérectomie totale — surveillance', cycle: 'Post-op M3', response: 'Rémission complète', physician: 'Dr. Camara', nextRCP: '01/09/2026' },
];

const fertilityData = [
  { patient: 'Kadiatou Traoré', protocol: 'FIV — Stimulation longue', cycle: 2, day: 'J8 stimulation', e2: '1240 pg/mL', follicles: '8 follicules > 12mm', nextStep: 'Déclenchement prévu J10', physician: 'Dr. Sow' },
  { patient: 'Coumba Baldé', protocol: 'IIU — Stimulation simple', cycle: 3, day: 'J12', e2: '480 pg/mL', follicles: '2 follicules dominants', nextStep: 'IIU demain matin', physician: 'Dr. Sow' },
  { patient: 'Ndèye Diallo', protocol: 'FIV — Congélation embryons', cycle: 1, day: 'Transfert J5', e2: '—', follicles: '3 blastocystes congelés', nextStep: 'TEC cycle prochain', physician: 'Dr. Diallo' },
];

const statusConfig: Record<string, { bg: string; color: string }> = {
  'suivi normal': { bg: '#dcfce7', color: '#16a34a' },
  surveillance: { bg: '#fef3c7', color: '#b45309' },
  'traitement actif': { bg: '#fee2e2', color: '#dc2626' },
  'en cours': { bg: '#dbeafe', color: '#1d4ed8' },
  planifié: { bg: '#ede9fe', color: '#7c3aed' },
  suivi: { bg: '#dcfce7', color: '#16a34a' },
};

const riskConfig: Record<string, { bg: string; color: string }> = {
  faible: { bg: '#dcfce7', color: '#16a34a' },
  modéré: { bg: '#fef3c7', color: '#b45309' },
  élevé: { bg: '#fee2e2', color: '#dc2626' },
};

export default function GynecologyWorkspaceContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #831843 0%, #be185d 100%)', padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="HeartIcon" size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Espace Gynécologie-Obstétrique</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0 }}>Obstétrique · Gynécologie · Onco-gynéco · Fertilité & PMA</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 12 }}>38 grossesses actives</span>
            <button style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}>+ Nouvelle patiente</button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 20, borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, background: activeTab === tab.key ? '#fff' : 'transparent', color: activeTab === tab.key ? '#be185d' : 'rgba(255,255,255,0.8)', transition: 'all 0.2s' }}>
              <Icon name={tab.icon as any} size={14} color={activeTab === tab.key ? '#be185d' : 'rgba(255,255,255,0.8)'} />
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 14 }}>Grossesses à risque — Surveillance</h3>
                {obstetricsData.filter(o => o.risk !== 'faible').map((o, i) => (
                  <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: o.risk === 'élevé' ? '#fef2f2' : '#fefce8', border: `1px solid ${o.risk === 'élevé' ? '#fecaca' : '#fef08a'}`, marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>{o.patient} — {o.sa} SA</span>
                      <span style={{ background: riskConfig[o.risk].bg, color: riskConfig[o.risk].color, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>Risque {o.risk}</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#475569', margin: '4px 0 0' }}>TA: {o.bp} · Poids: {o.weight}kg · RCF: {o.fhr} bpm</p>
                  </div>
                ))}
              </div>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 14 }}>Dossiers onco-gynécologie actifs</h3>
                {oncoData.map((o, i) => (
                  <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>{o.patient}</span>
                      <span style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>Stade {o.stage}</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#475569', margin: '4px 0 2px' }}>{o.cancer} · {o.treatment}</p>
                    <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>Cycle {o.cycle} · Réponse: {o.response}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Patientes — Gynécologie-Obstétrique</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['ID', 'Patiente', 'Âge', 'Type', 'Détail', 'Médecin', 'Prochain RDV', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {patients.map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{p.id}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{p.name}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: '#475569' }}>{p.age} ans</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: '#fce7f3', color: '#be185d', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{p.type}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569', maxWidth: 200 }}>{p.detail}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{p.physician}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#be185d', fontFamily: 'monospace' }}>{p.nextAppt}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: statusConfig[p.status]?.bg, color: statusConfig[p.status]?.color, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'obstetrics' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', margin: 0 }}>Suivi obstétrical — Grossesses actives</h3>
              <button style={{ background: '#be185d', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}>+ Nouvelle grossesse</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Patiente', 'SA', 'Parité', 'TA', 'Poids', 'RCF', 'Présentation', 'Placenta', 'Risque', 'Prochaine écho'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {obstetricsData.map((o, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc', background: o.risk === 'élevé' ? '#fff5f5' : 'transparent' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{o.patient}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 700, color: '#be185d' }}>{o.sa} SA</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{o.parity}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: o.bp.startsWith('14') ? '#dc2626' : '#1e293b', fontFamily: 'monospace', fontWeight: o.bp.startsWith('14') ? 700 : 400 }}>{o.bp}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#1e293b' }}>{o.weight} kg</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#1e293b', fontFamily: 'monospace' }}>{o.fhr} bpm</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{o.presentation}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{o.placenta}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: riskConfig[o.risk].bg, color: riskConfig[o.risk].color, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{o.risk}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#be185d', fontWeight: 600 }}>{o.nextEcho}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'gynecology' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Consultations gynécologiques</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Patiente', 'Diagnostic', 'Traitement / Acte', 'Date', 'Médecin', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gynecologyData.map((g, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{g.patient}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{g.diagnosis}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{g.treatment}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{g.date}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{g.physician}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: statusConfig[g.status]?.bg, color: statusConfig[g.status]?.color, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{g.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'oncogyneco' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', margin: 0 }}>Onco-gynécologie — Dossiers actifs</h3>
              <button style={{ background: '#be185d', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}>+ Nouveau dossier RCP</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Patiente', 'Cancer', 'Stade', 'Traitement', 'Cycle', 'Réponse', 'Médecin', 'Prochaine RCP'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {oncoData.map((o, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{o.patient}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: '#fce7f3', color: '#be185d', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>{o.cancer}</span></td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>Stade {o.stage}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{o.treatment}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#1e293b', fontFamily: 'monospace' }}>{o.cycle}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: o.response.includes('Rémission') ? '#dcfce7' : '#fef3c7', color: o.response.includes('Rémission') ? '#16a34a' : '#b45309', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{o.response}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{o.physician}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#be185d', fontFamily: 'monospace' }}>{o.nextRCP}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'fertility' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {fertilityData.map((f, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderTop: '3px solid #be185d' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 15, color: '#1e293b', margin: 0 }}>{f.patient}</p>
                      <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>{f.physician} · Cycle {f.cycle}</p>
                    </div>
                    <span style={{ background: '#fce7f3', color: '#be185d', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 700 }}>{f.protocol}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                    <div style={{ background: '#f8fafc', borderRadius: 8, padding: '8px 12px' }}>
                      <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 2px' }}>Jour</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#be185d', margin: 0 }}>{f.day}</p>
                    </div>
                    <div style={{ background: '#f8fafc', borderRadius: 8, padding: '8px 12px' }}>
                      <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 2px' }}>E2</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', margin: 0 }}>{f.e2}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: '#475569', marginBottom: 10 }}>{f.follicles}</p>
                  <div style={{ background: '#fce7f3', borderRadius: 8, padding: '10px 12px' }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#be185d', margin: '0 0 2px' }}>PROCHAINE ÉTAPE</p>
                    <p style={{ fontSize: 13, color: '#1e293b', margin: 0 }}>{f.nextStep}</p>
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
