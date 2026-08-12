'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type TabKey = 'dashboard' | 'patients' | 'imaging' | 'surgery' | 'rehab' | 'implants';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
  { key: 'patients', label: 'Patients', icon: 'UsersIcon' },
  { key: 'imaging', label: 'Imagerie & Scores', icon: 'PhotoIcon' },
  { key: 'surgery', label: 'Chirurgie', icon: 'ScissorsIcon' },
  { key: 'rehab', label: 'Rééducation', icon: 'BoltIcon' },
  { key: 'implants', label: 'Implants & Prothèses', icon: 'CpuChipIcon' },
];

const kpis = [
  { label: 'Patients suivis', value: '94', icon: 'UsersIcon', color: '#0066ff' },
  { label: 'Hospitalisés', value: '18', icon: 'BuildingOffice2Icon', color: '#dc2626' },
  { label: 'Opérations/sem.', value: '12', icon: 'ScissorsIcon', color: '#7c3aed' },
  { label: 'Fractures actives', value: '31', icon: 'ExclamationTriangleIcon', color: '#d97706' },
  { label: 'Séances kiné', value: '47', icon: 'BoltIcon', color: '#059669' },
  { label: 'Prothèses posées', value: '8', icon: 'CpuChipIcon', color: '#0891b2' },
];

const patients = [
  { id: 'ORT-001', name: 'Ibrahima Sow', age: 72, diagnosis: 'Fracture col fémoral — Garden III', side: 'Gauche', mechanism: 'Chute', surgery: 'PTH prévue J+2', status: 'hospitalisé', physician: 'Dr. Diallo', pain: 7 },
  { id: 'ORT-002', name: 'Fatoumata Koné', age: 45, diagnosis: 'Rupture LCA — genou droit', side: 'Droit', mechanism: 'Sport', surgery: 'Ligamentoplastie planifiée', status: 'consultation', physician: 'Dr. Bah', pain: 4 },
  { id: 'ORT-003', name: 'Moussa Traoré', age: 28, diagnosis: 'Fracture radius distal — déplacée', side: 'Droit', mechanism: 'AVP', surgery: 'Ostéosynthèse J0', status: 'post-op', physician: 'Dr. Diallo', pain: 3 },
  { id: 'ORT-004', name: 'Aminata Ba', age: 58, diagnosis: 'Gonarthrose sévère — Kellgren IV', side: 'Bilatéral', mechanism: 'Dégénératif', surgery: 'PTG genou gauche planifiée', status: 'consultation', physician: 'Dr. Camara', pain: 6 },
  { id: 'ORT-005', name: 'Cheikh Diop', age: 35, diagnosis: 'Hernie discale L4-L5 — compression S1', side: 'Gauche', mechanism: 'Effort', surgery: 'Discectomie si échec kiné', status: 'rééducation', physician: 'Dr. Bah', pain: 5 },
  { id: 'ORT-006', name: 'Kadiatou Fall', age: 19, diagnosis: 'Fracture diaphyse tibiale — ouverte', side: 'Droit', mechanism: 'AVP moto', surgery: 'Enclouage centromédullaire J0', status: 'post-op', physician: 'Dr. Diallo', pain: 4 },
];

const imagingData = [
  { patient: 'Ibrahima Sow', exam: 'Radiographie bassin F+P', finding: 'Fracture col fémoral Garden III — déplacement modéré', date: '10/08/2026', score: 'Garden III', action: 'PTH cimentée' },
  { patient: 'Fatoumata Koné', exam: 'IRM genou droit', finding: 'Rupture complète LCA — lésion ménisque interne associée', date: '09/08/2026', score: 'IKDC C', action: 'Ligamentoplastie DIDT' },
  { patient: 'Aminata Ba', exam: 'Radiographie genoux bilatéral', finding: 'Pincement articulaire complet — ostéophytes — Kellgren IV', date: '08/08/2026', score: 'Kellgren IV', action: 'PTG genou gauche' },
  { patient: 'Cheikh Diop', exam: 'IRM lombaire', finding: 'Hernie discale L4-L5 paramédiane gauche — compression S1', date: '07/08/2026', score: 'Pfirrmann IV', action: 'Kiné 6 semaines puis réévaluation' },
  { patient: 'Kadiatou Fall', exam: 'Radiographie tibia F+P', finding: 'Fracture diaphyse tibiale 1/3 moyen — ouverte Gustilo II', date: '11/08/2026', score: 'Gustilo II', action: 'Enclouage + ATB prophylaxie' },
];

const surgeries = [
  { patient: 'Moussa Traoré', procedure: 'Ostéosynthèse radius distal — plaque vissée', date: '11/08/2026', duration: '65 min', surgeon: 'Dr. Diallo', anesthesia: 'ALR — bloc axillaire', status: 'terminé', complications: 'Aucune' },
  { patient: 'Kadiatou Fall', procedure: 'Enclouage centromédullaire tibia droit', date: '11/08/2026', duration: '90 min', surgeon: 'Dr. Diallo', anesthesia: 'AG', status: 'terminé', complications: 'Aucune' },
  { patient: 'Ibrahima Sow', procedure: 'Prothèse totale de hanche cimentée', date: '13/08/2026', duration: '120 min', surgeon: 'Dr. Bah', anesthesia: 'Rachianesthésie', status: 'planifié', complications: '—' },
  { patient: 'Aminata Ba', procedure: 'Prothèse totale de genou gauche', date: '20/08/2026', duration: '110 min', surgeon: 'Dr. Camara', anesthesia: 'Rachianesthésie', status: 'planifié', complications: '—' },
];

const rehabSessions = [
  { patient: 'Moussa Traoré', type: 'Rééducation post-op radius', session: '3/15', therapist: 'Kiné Diallo', focus: 'Mobilisation doigts + poignet — œdème résiduel', progress: 20, date: '12/08/2026' },
  { patient: 'Cheikh Diop', type: 'Rééducation lombaire', session: '8/20', therapist: 'Kiné Sow', focus: 'Renforcement paravertébraux — étirements ischio-jambiers', progress: 40, date: '12/08/2026' },
  { patient: 'Fatoumata Koné', type: 'Préparation pré-op genou', session: '4/8', therapist: 'Kiné Camara', focus: 'Renforcement quadriceps — proprioception', progress: 50, date: '13/08/2026' },
];

const implants = [
  { patient: 'Moussa Traoré', type: 'Plaque vissée radius', ref: 'SYNTHES DRP 3.5mm', lot: 'LOT-2026-0811', date: '11/08/2026', surgeon: 'Dr. Diallo', followUp: '6 semaines' },
  { patient: 'Kadiatou Fall', type: 'Clou centromédullaire tibial', ref: 'STRYKER T2 9x360mm', lot: 'LOT-2026-0811', date: '11/08/2026', surgeon: 'Dr. Diallo', followUp: '6 semaines' },
  { patient: 'Ibrahima Sow', type: 'PTH cimentée (planifiée)', ref: 'DEPUY PINNACLE', lot: '—', date: '13/08/2026', surgeon: 'Dr. Bah', followUp: '3 mois' },
];

const statusConfig: Record<string, { bg: string; color: string }> = {
  hospitalisé: { bg: '#fee2e2', color: '#dc2626' },
  consultation: { bg: '#dbeafe', color: '#1d4ed8' },
  'post-op': { bg: '#fef3c7', color: '#b45309' },
  rééducation: { bg: '#dcfce7', color: '#16a34a' },
  terminé: { bg: '#dcfce7', color: '#16a34a' },
  planifié: { bg: '#dbeafe', color: '#1d4ed8' },
};

export default function OrthopedicsWorkspaceContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0066ff 100%)', padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="WrenchScrewdriverIcon" size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Espace Orthopédie</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0 }}>Fractures · Chirurgie · Rééducation · Implants & Prothèses</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 12 }}>2 opérations aujourd\'hui</span>
            <button style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}>+ Nouveau patient</button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 20, borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, background: activeTab === tab.key ? '#fff' : 'transparent', color: activeTab === tab.key ? '#0066ff' : 'rgba(255,255,255,0.8)', transition: 'all 0.2s' }}>
              <Icon name={tab.icon as any} size={14} color={activeTab === tab.key ? '#0066ff' : 'rgba(255,255,255,0.8)'} />
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
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 14 }}>Répartition pathologies</h3>
                {[
                  { label: 'Fractures traumatiques', count: 31, pct: 33, color: '#dc2626' },
                  { label: 'Pathologies dégénératives', count: 28, pct: 30, color: '#0066ff' },
                  { label: 'Ligamentaires & tendons', count: 18, pct: 19, color: '#7c3aed' },
                  { label: 'Rachis & discopathies', count: 12, pct: 13, color: '#d97706' },
                  { label: 'Autres', count: 5, pct: 5, color: '#64748b' },
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
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 14 }}>Planning chirurgical — Cette semaine</h3>
                {surgeries.map((s, i) => (
                  <div key={i} style={{ padding: '10px 12px', borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: 13, color: '#1e293b' }}>{s.patient}</span>
                      <span style={{ background: statusConfig[s.status]?.bg, color: statusConfig[s.status]?.color, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{s.status}</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#475569', margin: '4px 0 2px' }}>{s.procedure}</p>
                    <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{s.date} · {s.duration} · {s.surgeon}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Patients orthopédiques</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['ID', 'Patient', 'Âge', 'Diagnostic', 'Côté', 'Mécanisme', 'Chirurgie', 'Douleur', 'Statut', 'Médecin'].map(h => (
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
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{p.side}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{p.mechanism}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{p.surgery}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 40, height: 6, background: '#f1f5f9', borderRadius: 3 }}>
                          <div style={{ height: '100%', width: `${p.pain * 10}%`, background: p.pain >= 7 ? '#dc2626' : p.pain >= 4 ? '#d97706' : '#16a34a', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: p.pain >= 7 ? '#dc2626' : p.pain >= 4 ? '#d97706' : '#16a34a' }}>{p.pain}/10</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: statusConfig[p.status]?.bg, color: statusConfig[p.status]?.color, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{p.status}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{p.physician}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'imaging' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Imagerie & Scores radiologiques</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Patient', 'Examen', 'Résultat', 'Date', 'Score/Classification', 'Décision'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {imagingData.map((d, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{d.patient}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: '#dbeafe', color: '#1d4ed8', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{d.exam}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569', maxWidth: 220 }}>{d.finding}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{d.date}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: '#fef3c7', color: '#b45309', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>{d.score}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#059669', fontWeight: 600 }}>{d.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'surgery' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', margin: 0 }}>Interventions chirurgicales</h3>
              <button style={{ background: '#0066ff', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}>+ Planifier intervention</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Patient', 'Procédure', 'Date', 'Durée', 'Chirurgien', 'Anesthésie', 'Statut', 'Complications'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {surgeries.map((s, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{s.patient}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{s.procedure}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{s.date}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#1e293b' }}>{s.duration}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{s.surgeon}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{s.anesthesia}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: statusConfig[s.status]?.bg, color: statusConfig[s.status]?.color, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{s.status}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: s.complications === 'Aucune' ? '#16a34a' : '#dc2626' }}>{s.complications}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'rehab' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {rehabSessions.map((r, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 15, color: '#1e293b', margin: 0 }}>{r.patient}</p>
                      <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>{r.therapist} · {r.date}</p>
                    </div>
                    <span style={{ background: '#dbeafe', color: '#1d4ed8', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 700 }}>{r.type}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#475569', marginBottom: 14 }}>{r.focus}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>Séance {r.session}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0066ff' }}>{r.progress}%</span>
                  </div>
                  <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4 }}>
                    <div style={{ height: '100%', width: `${r.progress}%`, background: 'linear-gradient(90deg, #0066ff, #38bdf8)', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'implants' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', margin: 0 }}>Traçabilité implants & prothèses</h3>
              <button style={{ background: '#0066ff', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}>+ Enregistrer implant</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Patient', 'Type d\'implant', 'Référence', 'N° Lot', 'Date pose', 'Chirurgien', 'Suivi'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {implants.map((imp, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{imp.patient}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: '#475569' }}>{imp.type}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#1e293b', fontFamily: 'monospace' }}>{imp.ref}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{imp.lot}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{imp.date}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{imp.surgeon}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: '#dbeafe', color: '#1d4ed8', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{imp.followUp}</span></td>
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
