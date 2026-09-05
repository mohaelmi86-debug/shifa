'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type TabKey = 'dashboard' | 'patients' | 'assessments' | 'medications' | 'therapy' | 'crisis';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
  { key: 'patients', label: 'Patients', icon: 'UsersIcon' },
  { key: 'assessments', label: 'Évaluations', icon: 'ClipboardDocumentListIcon' },
  { key: 'medications', label: 'Psychotropes', icon: 'BeakerIcon' },
  { key: 'therapy', label: 'Thérapies', icon: 'ChatBubbleLeftRightIcon' },
  { key: 'crisis', label: 'Gestion de crise', icon: 'ExclamationTriangleIcon' },
];

const kpis = [
  { label: 'Patients suivis', value: '87', icon: 'UsersIcon', color: '#7c3aed' },
  { label: 'Hospitalisés', value: '12', icon: 'BuildingOffice2Icon', color: '#0066ff' },
  { label: 'Consultations/sem.', value: '34', icon: 'CalendarDaysIcon', color: '#0891b2' },
  { label: 'Alertes crise', value: '2', icon: 'ExclamationTriangleIcon', color: '#dc2626' },
  { label: 'Séances TCC', value: '18', icon: 'ChatBubbleLeftRightIcon', color: '#059669' },
  { label: 'Ordonnances actives', value: '64', icon: 'BeakerIcon', color: '#d97706' },
];

const patients = [
  { id: 'PSY-001', name: 'Aminata Diallo', age: 34, diagnosis: 'Trouble bipolaire type I', severity: 'modéré', physician: 'Dr. Bah', status: 'stabilisé', lastSeen: '10/08/2026', nextAppt: '24/08/2026', hospitalized: false, risk: 'faible' },
  { id: 'PSY-002', name: 'Moussa Koné', age: 28, diagnosis: 'Schizophrénie paranoïde', severity: 'sévère', physician: 'Dr. Bah', status: 'suivi renforcé', lastSeen: '11/08/2026', nextAppt: '18/08/2026', hospitalized: true, risk: 'élevé' },
  { id: 'PSY-003', name: 'Fatoumata Sow', age: 42, diagnosis: 'Dépression majeure récurrente', severity: 'modéré', physician: 'Dr. Camara', status: 'en cours', lastSeen: '08/08/2026', nextAppt: '22/08/2026', hospitalized: false, risk: 'modéré' },
  { id: 'PSY-004', name: 'Ibrahim Traoré', age: 19, diagnosis: 'Trouble anxieux généralisé', severity: 'léger', physician: 'Dr. Camara', status: 'stable', lastSeen: '05/08/2026', nextAppt: '19/08/2026', hospitalized: false, risk: 'faible' },
  { id: 'PSY-005', name: 'Kadiatou Barry', age: 55, diagnosis: 'PTSD — violence conjugale', severity: 'modéré', physician: 'Dr. Bah', status: 'en cours', lastSeen: '09/08/2026', nextAppt: '23/08/2026', hospitalized: false, risk: 'modéré' },
];

const assessments = [
  { patient: 'Aminata Diallo', tool: 'YMRS (Manie)', score: 8, interpretation: 'Manie légère', date: '10/08/2026', physician: 'Dr. Bah' },
  { patient: 'Moussa Koné', tool: 'PANSS', score: 72, interpretation: 'Symptômes modérés-sévères', date: '11/08/2026', physician: 'Dr. Bah' },
  { patient: 'Fatoumata Sow', tool: 'PHQ-9', score: 16, interpretation: 'Dépression modérément sévère', date: '08/08/2026', physician: 'Dr. Camara' },
  { patient: 'Ibrahim Traoré', tool: 'GAD-7', score: 9, interpretation: 'Anxiété modérée', date: '05/08/2026', physician: 'Dr. Camara' },
  { patient: 'Kadiatou Barry', tool: 'PCL-5 (PTSD)', score: 38, interpretation: 'PTSD probable', date: '09/08/2026', physician: 'Dr. Bah' },
  { patient: 'Moussa Koné', tool: 'Columbia (Suicidalité)', score: 3, interpretation: 'Idéations actives', date: '11/08/2026', physician: 'Dr. Bah' },
];

const medications = [
  { patient: 'Aminata Diallo', drug: 'Lithium', dose: '600 mg/j', indication: 'Thymorégulateur', level: '0.7 mEq/L', monitoring: 'Lithiémie mensuelle', status: 'ok' },
  { patient: 'Moussa Koné', drug: 'Rispéridone', dose: '4 mg/j', indication: 'Antipsychotique', level: '—', monitoring: 'Glycémie, poids', status: 'ok' },
  { patient: 'Moussa Koné', drug: 'Lorazépam', dose: '1 mg si besoin', indication: 'Anxiolytique PRN', level: '—', monitoring: 'Dépendance', status: 'attention' },
  { patient: 'Fatoumata Sow', drug: 'Sertraline', dose: '100 mg/j', indication: 'Antidépresseur ISRS', level: '—', monitoring: 'Suicidalité J1-J14', status: 'ok' },
  { patient: 'Ibrahim Traoré', drug: 'Escitalopram', dose: '10 mg/j', indication: 'Anxiété/Dépression', level: '—', monitoring: 'Tolérance', status: 'ok' },
  { patient: 'Kadiatou Barry', drug: 'Venlafaxine', dose: '150 mg/j', indication: 'PTSD/Dépression', level: '—', monitoring: 'TA, fréquence cardiaque', status: 'ok' },
];

const therapySessions = [
  { patient: 'Fatoumata Sow', type: 'TCC', session: '6/12', therapist: 'Psy. Diallo', date: '12/08/2026', focus: 'Restructuration cognitive — pensées automatiques', progress: 50 },
  { patient: 'Kadiatou Barry', type: 'EMDR', session: '3/8', therapist: 'Psy. Diallo', date: '13/08/2026', focus: 'Désensibilisation traumatisme principal', progress: 37 },
  { patient: 'Ibrahim Traoré', type: 'TCC', session: '4/10', therapist: 'Psy. Camara', date: '14/08/2026', focus: 'Exposition progressive — situations anxiogènes', progress: 40 },
  { patient: 'Aminata Diallo', type: 'Psychoéducation', session: '2/6', therapist: 'Psy. Camara', date: '15/08/2026', focus: 'Reconnaissance des prodromes maniaques', progress: 33 },
];

const crisisAlerts = [
  { patient: 'Moussa Koné', type: 'Idéations suicidaires', level: 'élevé', time: 'Aujourd\'hui 09h15', action: 'Hospitalisation en cours — chambre 12B', physician: 'Dr. Bah', resolved: false },
  { patient: 'Aminata Diallo', type: 'Épisode hypomaniaque', level: 'modéré', time: 'Hier 18h30', action: 'Ajustement lithium + contact famille', physician: 'Dr. Bah', resolved: true },
];

const riskConfig: Record<string, { bg: string; color: string }> = {
  faible: { bg: '#dcfce7', color: '#16a34a' },
  modéré: { bg: '#fef3c7', color: '#b45309' },
  élevé: { bg: '#fee2e2', color: '#dc2626' },
};

const statusConfig: Record<string, { bg: string; color: string }> = {
  stabilisé: { bg: '#dcfce7', color: '#16a34a' },
  stable: { bg: '#dcfce7', color: '#16a34a' },
  'en cours': { bg: '#dbeafe', color: '#1d4ed8' },
  'suivi renforcé': { bg: '#fee2e2', color: '#dc2626' },
  ok: { bg: '#dcfce7', color: '#16a34a' },
  attention: { bg: '#fef3c7', color: '#b45309' },
};

export default function PsychiatryWorkspaceContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)', padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="BrainIcon" size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Espace Psychiatrie</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0 }}>Évaluations · Psychotropes · Thérapies · Gestion de crise</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <span style={{ background: '#dc2626', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>2 ALERTES CRISE</span>
            <button style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}>+ Nouveau patient</button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 20, borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, background: activeTab === tab.key ? '#fff' : 'transparent', color: activeTab === tab.key ? '#7c3aed' : 'rgba(255,255,255,0.8)', transition: 'all 0.2s' }}>
              <Icon name={tab.icon as any} size={14} color={activeTab === tab.key ? '#7c3aed' : 'rgba(255,255,255,0.8)'} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '28px 32px' }}>
        {/* DASHBOARD */}
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
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 14 }}>Alertes de crise actives</h3>
                {crisisAlerts.map((a, i) => (
                  <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: a.resolved ? '#f0fdf4' : '#fef2f2', border: `1px solid ${a.resolved ? '#bbf7d0' : '#fecaca'}`, marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>{a.patient}</span>
                      <span style={{ fontSize: 11, background: a.resolved ? '#dcfce7' : '#fee2e2', color: a.resolved ? '#16a34a' : '#dc2626', borderRadius: 20, padding: '2px 10px', fontWeight: 600 }}>{a.resolved ? 'Résolu' : 'ACTIF'}</span>
                    </div>
                    <p style={{ fontSize: 13, color: '#475569', margin: '4px 0' }}>{a.type} — {a.time}</p>
                    <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{a.action}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 14 }}>Répartition diagnostics</h3>
                {[
                  { label: 'Troubles de l\'humeur', count: 28, pct: 32, color: '#7c3aed' },
                  { label: 'Troubles anxieux', count: 22, pct: 25, color: '#0066ff' },
                  { label: 'Troubles psychotiques', count: 18, pct: 21, color: '#dc2626' },
                  { label: 'PTSD / Trauma', count: 12, pct: 14, color: '#d97706' },
                  { label: 'Autres', count: 7, pct: 8, color: '#64748b' },
                ].map((d, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, color: '#475569' }}>{d.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{d.count} ({d.pct}%)</span>
                    </div>
                    <div style={{ height: 6, background: '#f1f5f9', borderRadius: 4 }}>
                      <div style={{ height: '100%', width: `${d.pct}%`, background: d.color, borderRadius: 4 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PATIENTS */}
        {activeTab === 'patients' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Patients psychiatriques</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['ID', 'Patient', 'Âge', 'Diagnostic', 'Sévérité', 'Médecin', 'Statut', 'Risque', 'Prochain RDV'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {patients.map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{p.id}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                      {p.name}
                      {p.hospitalized && <span style={{ marginLeft: 6, background: '#dbeafe', color: '#1d4ed8', borderRadius: 4, padding: '1px 6px', fontSize: 10, fontWeight: 600 }}>HOSPIT.</span>}
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: '#475569' }}>{p.age} ans</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569', maxWidth: 180 }}>{p.diagnosis}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{p.severity}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{p.physician}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: statusConfig[p.status]?.bg || '#f1f5f9', color: statusConfig[p.status]?.color || '#64748b', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{p.status}</span></td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: riskConfig[p.risk]?.bg, color: riskConfig[p.risk]?.color, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{p.risk}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#0066ff', fontFamily: 'monospace' }}>{p.nextAppt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ASSESSMENTS */}
        {activeTab === 'assessments' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', margin: 0 }}>Évaluations psychométriques</h3>
              <button style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}>+ Nouvelle évaluation</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Patient', 'Outil', 'Score', 'Interprétation', 'Date', 'Médecin'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {assessments.map((a, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{a.patient}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: '#ede9fe', color: '#7c3aed', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>{a.tool}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 18, fontWeight: 700, color: '#1e293b' }}>{a.score}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: '#475569' }}>{a.interpretation}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{a.date}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{a.physician}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MEDICATIONS */}
        {activeTab === 'medications' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', margin: 0 }}>Psychotropes en cours</h3>
              <button style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}>+ Prescrire</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Patient', 'Médicament', 'Dose', 'Indication', 'Taux/Niveau', 'Surveillance', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {medications.map((m, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{m.patient}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: '#1e293b', fontWeight: 500 }}>{m.drug}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: '#475569', fontFamily: 'monospace' }}>{m.dose}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{m.indication}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#1e293b', fontFamily: 'monospace' }}>{m.level}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{m.monitoring}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: statusConfig[m.status]?.bg, color: statusConfig[m.status]?.color, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{m.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* THERAPY */}
        {activeTab === 'therapy' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {therapySessions.map((t, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 15, color: '#1e293b', margin: 0 }}>{t.patient}</p>
                      <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>{t.therapist} · {t.date}</p>
                    </div>
                    <span style={{ background: '#ede9fe', color: '#7c3aed', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 700 }}>{t.type}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#475569', marginBottom: 14 }}>{t.focus}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>Progression — Séance {t.session}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#7c3aed' }}>{t.progress}%</span>
                  </div>
                  <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4 }}>
                    <div style={{ height: '100%', width: `${t.progress}%`, background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CRISIS */}
        {activeTab === 'crisis' && (
          <div>
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 20, marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#dc2626', marginBottom: 14 }}>⚠ Protocole de gestion de crise psychiatrique</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[
                  { step: '1', title: 'Évaluation immédiate', desc: 'Columbia Suicide Severity Rating Scale (C-SSRS) — Évaluer idéations, plan, intention, accès aux moyens' },
                  { step: '2', title: 'Sécurisation', desc: 'Retrait des objets dangereux — Présence continue — Appel famille/tuteur légal si mineur' },
                  { step: '3', title: 'Décision clinique', desc: 'Hospitalisation libre ou sous contrainte (HDT/HO) — Contacter psychiatre de garde si besoin' },
                ].map((s, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: 10, padding: 16 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#dc2626', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, marginBottom: 10 }}>{s.step}</div>
                    <p style={{ fontWeight: 600, fontSize: 14, color: '#1e293b', marginBottom: 6 }}>{s.title}</p>
                    <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 14 }}>Historique des crises</h3>
              {crisisAlerts.map((a, i) => (
                <div key={i} style={{ padding: '14px 16px', borderRadius: 10, background: a.resolved ? '#f0fdf4' : '#fef2f2', border: `1px solid ${a.resolved ? '#bbf7d0' : '#fecaca'}`, marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>{a.patient} — {a.type}</span>
                    <span style={{ fontSize: 11, background: a.resolved ? '#dcfce7' : '#fee2e2', color: a.resolved ? '#16a34a' : '#dc2626', borderRadius: 20, padding: '2px 10px', fontWeight: 600 }}>{a.resolved ? 'Résolu' : 'EN COURS'}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#475569', margin: '0 0 4px' }}>Niveau de risque : <strong style={{ color: riskConfig[a.level]?.color }}>{a.level}</strong> · {a.time}</p>
                  <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Action : {a.action}</p>
                  <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0' }}>Médecin responsable : {a.physician}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
