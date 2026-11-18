'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type TabKey = 'dashboard' | 'patients' | 'symptoms' | 'care-plans' | 'team' | 'ethics';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
  { key: 'patients', label: 'Patients', icon: 'UsersIcon' },
  { key: 'symptoms', label: 'Contrôle symptômes', icon: 'ChartBarIcon' },
  { key: 'care-plans', label: 'Plans de soins', icon: 'ClipboardDocumentListIcon' },
  { key: 'team', label: 'Équipe pluridisciplinaire', icon: 'UserGroupIcon' },
  { key: 'ethics', label: 'Éthique & Directives', icon: 'ShieldCheckIcon' },
];

const kpis = [
  { label: 'Patients suivis', value: '34', icon: 'UsersIcon', color: '#0891b2' },
  { label: 'À domicile', value: '18', icon: 'HomeIcon', color: '#059669' },
  { label: 'En unité SP', value: '9', icon: 'BuildingOffice2Icon', color: '#7c3aed' },
  { label: 'En hospice', value: '7', icon: 'HeartIcon', color: '#be185d' },
  { label: 'Consultations/sem.', value: '22', icon: 'CalendarDaysIcon', color: '#0066ff' },
  { label: 'Réunions équipe', value: '3', icon: 'UserGroupIcon', color: '#d97706' },
];

const patients = [
  { id: 'PC-001', name: 'Mariama Bah', age: 38, diagnosis: 'Cancer du sein stade IV', prognosis: '2-4 mois', location: 'unité SP', dnr: true, pain: 4, comfort: 'modéré', physician: 'Dr. Camara', nurse: 'Inf. Kadiatou', goals: ['Contrôle douleur', 'Temps famille', 'Dignité'] },
  { id: 'PC-002', name: 'Oumar Diallo', age: 71, diagnosis: 'Insuffisance cardiaque terminale', prognosis: '3-6 mois', location: 'domicile', dnr: true, pain: 3, comfort: 'bon', physician: 'Dr. Diop', nurse: 'Inf. Aminata', goals: ['Rester à domicile', 'Confort respiratoire'] },
  { id: 'PC-003', name: 'Ibrahima Kouyaté', age: 55, diagnosis: 'Cancer pancréas stade IV', prognosis: '< 1 mois', location: 'hospice', dnr: true, pain: 7, comfort: 'mauvais', physician: 'Dr. Sy', nurse: 'Inf. Fatou', goals: ['Sédation palliative', 'Présence famille'] },
  { id: 'PC-004', name: 'Fatoumata Traoré', age: 62, diagnosis: 'BPCO sévère — IRC', prognosis: '6-12 mois', location: 'domicile', dnr: false, pain: 2, comfort: 'bon', physician: 'Dr. Baldé', nurse: 'Inf. Kadiatou', goals: ['O2 domicile', 'Réduire hospitalisations'] },
  { id: 'PC-005', name: 'Seydou Ndiaye', age: 67, diagnosis: 'Glioblastome multiforme', prognosis: '1-3 mois', location: 'unité SP', dnr: true, pain: 5, comfort: 'modéré', physician: 'Dr. Camara', nurse: 'Inf. Aminata', goals: ['Contrôle douleur', 'Accompagnement spirituel'] },
];

const symptomAssessments = [
  { patient: 'Mariama Bah', date: 'Aujourd\'hui 08h', pain: 4, dyspnea: 2, nausea: 3, anxiety: 5, fatigue: 7, notes: 'Douleur thoracique modérée. Anxiété majorée. Morphine ajustée à 30mg/j.', nurse: 'Inf. Kadiatou' },
  { patient: 'Ibrahima Kouyaté', date: 'Aujourd\'hui 09h', pain: 7, dyspnea: 5, nausea: 6, anxiety: 8, fatigue: 9, notes: 'Douleur sévère. Discussion sédation palliative avec famille. Midazolam SC initié.', nurse: 'Inf. Fatou' },
  { patient: 'Oumar Diallo', date: 'Hier 14h', pain: 3, dyspnea: 4, nausea: 1, anxiety: 2, fatigue: 6, notes: 'Dyspnée d\'effort. Furosémide ajusté. Confort global satisfaisant.', nurse: 'Inf. Aminata' },
  { patient: 'Seydou Ndiaye', date: 'Hier 16h', pain: 5, dyspnea: 1, nausea: 2, anxiety: 4, fatigue: 8, notes: 'Céphalées persistantes. Dexaméthasone augmentée. Famille informée.', nurse: 'Inf. Aminata' },
];

const carePlans = [
  { patient: 'Mariama Bah', objective: 'Contrôle douleur EVA < 3', medications: 'Morphine LP 30mg/12h + Morphine IR 10mg si besoin', nonPharm: 'Relaxation, présence famille, musique', review: '15/08/2026', status: 'actif' },
  { patient: 'Ibrahima Kouyaté', objective: 'Sédation palliative — confort terminal', medications: 'Midazolam SC 10mg/24h + Morphine SC 20mg/24h', nonPharm: 'Présence continue famille, accompagnement spirituel', review: 'Quotidien', status: 'actif' },
  { patient: 'Oumar Diallo', objective: 'Maintien à domicile — confort respiratoire', medications: 'Furosémide 40mg/j + O2 2L/min + Morphine 5mg si dyspnée', nonPharm: 'Kiné respiratoire, soutien aidant', review: '20/08/2026', status: 'actif' },
  { patient: 'Fatoumata Traoré', objective: 'Qualité de vie — réduction hospitalisations', medications: 'Bronchodilatateurs + O2 domicile + Anxiolytique léger', nonPharm: 'Éducation patient/famille, télésurveillance', review: '25/08/2026', status: 'actif' },
];

const teamMembers = [
  { name: 'Dr. Camara', role: 'Médecin coordinateur SP', patients: 14, availability: 'Lun-Ven 8h-18h', contact: '+224 620 001 001' },
  { name: 'Dr. Diop', role: 'Médecin SP — domicile', patients: 12, availability: 'Lun-Sam 8h-20h', contact: '+224 620 001 002' },
  { name: 'Inf. Kadiatou', role: 'Infirmière coordinatrice', patients: 18, availability: '24h/24 — astreinte', contact: '+224 620 001 003' },
  { name: 'Inf. Aminata', role: 'Infirmière SP', patients: 10, availability: 'Lun-Ven 7h-19h', contact: '+224 620 001 004' },
  { name: 'Psy. Diallo', role: 'Psychologue clinicienne', patients: 8, availability: 'Mar-Jeu 9h-17h', contact: '+224 620 001 005' },
  { name: 'AS Koné', role: 'Assistant(e) social(e)', patients: 15, availability: 'Lun-Ven 8h-17h', contact: '+224 620 001 006' },
  { name: 'Aumônier Bah', role: 'Accompagnement spirituel', patients: 12, availability: 'Sur demande', contact: '+224 620 001 007' },
];

const ethicsData = [
  { patient: 'Mariama Bah', directive: 'DAL signées', dnr: true, sedation: 'Acceptée', futility: 'Pas de réanimation', family: 'Époux informé et accord', date: '05/08/2026' },
  { patient: 'Ibrahima Kouyaté', directive: 'DAL signées', dnr: true, sedation: 'Sédation palliative demandée', futility: 'Arrêt nutrition artificielle accepté', family: 'Famille présente — accord unanime', date: '10/08/2026' },
  { patient: 'Oumar Diallo', directive: 'DAL signées', dnr: true, sedation: 'Non souhaitée', futility: 'Pas de dialyse, pas de réanimation', family: 'Épouse et fils informés', date: '01/08/2026' },
  { patient: 'Fatoumata Traoré', directive: 'En cours de rédaction', dnr: false, sedation: 'Non discutée', futility: 'À définir', family: 'Fils présent — discussion en cours', date: '08/08/2026' },
];

const locationConfig: Record<string, { bg: string; color: string }> = {
  'unité SP': { bg: '#ede9fe', color: '#7c3aed' },
  domicile: { bg: '#dcfce7', color: '#16a34a' },
  hospice: { bg: '#fce7f3', color: '#be185d' },
};

const comfortConfig: Record<string, { bg: string; color: string }> = {
  bon: { bg: '#dcfce7', color: '#16a34a' },
  modéré: { bg: '#fef3c7', color: '#b45309' },
  mauvais: { bg: '#fee2e2', color: '#dc2626' },
};

const ScoreBar = ({ value, max = 10, color }: { value: number; max?: number; color: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <div style={{ width: 48, height: 6, background: '#f1f5f9', borderRadius: 3 }}>
      <div style={{ height: '100%', width: `${(value / max) * 100}%`, background: color, borderRadius: 3 }} />
    </div>
    <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 16 }}>{value}</span>
  </div>
);

export default function PalliativeCareWorkspaceContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #164e63 0%, #0891b2 100%)', padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="HeartIcon" size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Espace Soins Palliatifs</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0 }}>Contrôle symptômes · Plans de soins · Équipe pluridisciplinaire · Éthique</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 12 }}>34 patients suivis</span>
            <button style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}>+ Nouveau patient</button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 20, borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, background: activeTab === tab.key ? '#fff' : 'transparent', color: activeTab === tab.key ? '#0891b2' : 'rgba(255,255,255,0.8)', transition: 'all 0.2s' }}>
              <Icon name={tab.icon as any} size={14} color={activeTab === tab.key ? '#0891b2' : 'rgba(255,255,255,0.8)'} />
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
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 14 }}>Patients — Confort & Localisation</h3>
                {patients.map((p, i) => (
                  <div key={i} style={{ padding: '10px 12px', borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 13, color: '#1e293b' }}>{p.name} <span style={{ color: '#94a3b8', fontWeight: 400 }}>{p.age}a</span></span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <span style={{ background: locationConfig[p.location]?.bg, color: locationConfig[p.location]?.color, borderRadius: 6, padding: '1px 7px', fontSize: 10, fontWeight: 600 }}>{p.location}</span>
                        <span style={{ background: comfortConfig[p.comfort]?.bg, color: comfortConfig[p.comfort]?.color, borderRadius: 6, padding: '1px 7px', fontSize: 10, fontWeight: 600 }}>{p.comfort}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{p.diagnosis} · Pronostic: {p.prognosis}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 14 }}>Évaluations symptômes récentes</h3>
                {symptomAssessments.slice(0, 3).map((s, i) => (
                  <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: 13, color: '#1e293b' }}>{s.patient}</span>
                      <span style={{ fontSize: 11, color: '#64748b' }}>{s.date}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
                      {[
                        { label: 'Douleur', value: s.pain, color: s.pain >= 7 ? '#dc2626' : s.pain >= 4 ? '#d97706' : '#16a34a' },
                        { label: 'Dyspnée', value: s.dyspnea, color: s.dyspnea >= 5 ? '#dc2626' : '#d97706' },
                        { label: 'Nausées', value: s.nausea, color: s.nausea >= 5 ? '#dc2626' : '#d97706' },
                        { label: 'Anxiété', value: s.anxiety, color: s.anxiety >= 6 ? '#dc2626' : '#d97706' },
                        { label: 'Fatigue', value: s.fatigue, color: s.fatigue >= 7 ? '#dc2626' : '#d97706' },
                      ].map((sym, j) => (
                        <div key={j} style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: 10, color: '#64748b', margin: '0 0 2px' }}>{sym.label}</p>
                          <p style={{ fontSize: 16, fontWeight: 700, color: sym.color, margin: 0 }}>{sym.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Patients en soins palliatifs</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['ID', 'Patient', 'Âge', 'Diagnostic', 'Pronostic', 'Lieu', 'DNR', 'Douleur', 'Confort', 'Médecin'].map(h => (
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
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569', maxWidth: 180 }}>{p.diagnosis}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#dc2626', fontWeight: 600 }}>{p.prognosis}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: locationConfig[p.location]?.bg, color: locationConfig[p.location]?.color, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{p.location}</span></td>
                    <td style={{ padding: '10px 12px' }}>{p.dnr ? <span style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>OUI</span> : <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>NON</span>}</td>
                    <td style={{ padding: '10px 12px' }}><ScoreBar value={p.pain} color={p.pain >= 7 ? '#dc2626' : p.pain >= 4 ? '#d97706' : '#16a34a'} /></td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: comfortConfig[p.comfort]?.bg, color: comfortConfig[p.comfort]?.color, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{p.comfort}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{p.physician}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'symptoms' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', margin: 0 }}>Contrôle des symptômes — Évaluations</h3>
              <button style={{ background: '#0891b2', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}>+ Nouvelle évaluation</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Patient', 'Date', 'Douleur', 'Dyspnée', 'Nausées', 'Anxiété', 'Fatigue', 'Notes', 'IDE'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {symptomAssessments.map((s, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{s.patient}</td>
                    <td style={{ padding: '10px 12px', fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>{s.date}</td>
                    {[
                      { v: s.pain, c: s.pain >= 7 ? '#dc2626' : s.pain >= 4 ? '#d97706' : '#16a34a' },
                      { v: s.dyspnea, c: s.dyspnea >= 5 ? '#dc2626' : '#d97706' },
                      { v: s.nausea, c: s.nausea >= 5 ? '#dc2626' : '#d97706' },
                      { v: s.anxiety, c: s.anxiety >= 6 ? '#dc2626' : '#d97706' },
                      { v: s.fatigue, c: s.fatigue >= 7 ? '#dc2626' : '#d97706' },
                    ].map((sym, j) => (
                      <td key={j} style={{ padding: '10px 12px' }}><ScoreBar value={sym.v} color={sym.c} /></td>
                    ))}
                    <td style={{ padding: '10px 12px', fontSize: 11, color: '#475569', maxWidth: 200 }}>{s.notes}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{s.nurse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'care-plans' && (
          <div>
            {carePlans.map((cp, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16, borderLeft: '4px solid #0891b2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: 0 }}>{cp.patient}</h3>
                  <span style={{ background: '#dcfce7', color: '#16a34a', borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>{cp.status}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ background: '#f0fdfa', borderRadius: 10, padding: '12px 16px' }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#0891b2', margin: '0 0 6px' }}>OBJECTIF PRINCIPAL</p>
                    <p style={{ fontSize: 13, color: '#1e293b', margin: 0 }}>{cp.objective}</p>
                  </div>
                  <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 16px' }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#64748b', margin: '0 0 6px' }}>TRAITEMENTS MÉDICAMENTEUX</p>
                    <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>{cp.medications}</p>
                  </div>
                  <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 16px' }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#64748b', margin: '0 0 6px' }}>MESURES NON MÉDICAMENTEUSES</p>
                    <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>{cp.nonPharm}</p>
                  </div>
                  <div style={{ background: '#fef3c7', borderRadius: 10, padding: '12px 16px' }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#b45309', margin: '0 0 6px' }}>PROCHAINE RÉVISION</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', margin: 0 }}>{cp.review}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'team' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {teamMembers.map((m, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #0891b2, #0066ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16 }}>{m.name.split(' ')[1]?.[0] || m.name[0]}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: '#1e293b', margin: 0 }}>{m.name}</p>
                    <p style={{ fontSize: 12, color: '#0891b2', margin: '2px 0 0' }}>{m.role}</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                  <div style={{ background: '#f0fdfa', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                    <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 2px' }}>Patients</p>
                    <p style={{ fontSize: 18, fontWeight: 700, color: '#0891b2', margin: 0 }}>{m.patients}</p>
                  </div>
                  <div style={{ background: '#f8fafc', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                    <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 2px' }}>Disponibilité</p>
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#1e293b', margin: 0 }}>{m.availability}</p>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{m.contact}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ethics' && (
          <div>
            <div style={{ background: '#f0fdfa', border: '1px solid #a5f3fc', borderRadius: 12, padding: 20, marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0891b2', marginBottom: 10 }}>Principes éthiques — Soins palliatifs</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {['Bienfaisance — Agir dans l\'intérêt du patient', 'Non-malfaisance — Ne pas nuire', 'Autonomie — Respecter les choix du patient', 'Justice — Équité d\'accès aux soins'].map((p, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: 10, padding: '12px 14px' }}>
                    <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>{p}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Directives anticipées & DNR</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                    {['Patient', 'Directives', 'DNR', 'Sédation palliative', 'Obstination déraisonnable', 'Famille informée', 'Date'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ethicsData.map((e, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{e.patient}</td>
                      <td style={{ padding: '10px 12px' }}><span style={{ background: e.directive.includes('signées') ? '#dcfce7' : '#fef3c7', color: e.directive.includes('signées') ? '#16a34a' : '#b45309', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{e.directive}</span></td>
                      <td style={{ padding: '10px 12px' }}>{e.dnr ? <span style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>OUI</span> : <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>NON</span>}</td>
                      <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{e.sedation}</td>
                      <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{e.futility}</td>
                      <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{e.family}</td>
                      <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{e.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
