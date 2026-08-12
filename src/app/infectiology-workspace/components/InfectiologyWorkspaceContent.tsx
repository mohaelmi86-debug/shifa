'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type TabKey = 'dashboard' | 'infections' | 'tropical' | 'hiv' | 'antibiotics' | 'isolation';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: "Vue d'ensemble", icon: 'Squares2X2Icon' },
  { key: 'infections', label: 'Infections actives', icon: 'ExclamationTriangleIcon' },
  { key: 'tropical', label: 'Maladies tropicales', icon: 'GlobeAltIcon' },
  { key: 'hiv', label: 'VIH & Immunodépression', icon: 'ShieldCheckIcon' },
  { key: 'antibiotics', label: 'Antibiothérapie & BMR', icon: 'BeakerIcon' },
  { key: 'isolation', label: 'Isolement & Précautions', icon: 'LockClosedIcon' },
];

const kpis = [
  { label: 'Patients suivis', value: '156', sub: 'Infectiologie', icon: 'UsersIcon', color: '#b45309', bg: 'rgba(180,83,9,0.08)' },
  { label: 'Infections actives', value: '48', sub: '12 sévères', icon: 'ExclamationTriangleIcon', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
  { label: 'Patients VIH', value: '62', sub: '54 sous ARV', icon: 'ShieldCheckIcon', color: '#0284c7', bg: 'rgba(2,132,199,0.08)' },
  { label: 'BMR identifiées', value: '14', sub: 'BLSE/SARM/EPC', icon: 'BeakerIcon', color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
];

const infections = [
  { patient: 'Oumar Diallo', age: 52, diagnosis: 'Pneumonie à pneumocoque', site: 'Pulmonaire', severity: 'Sévère', pathogen: 'S. pneumoniae', treatment: 'Amoxicilline-clavulanate IV + Azithromycine', duration: 'J5/J10', status: 'severe' },
  { patient: 'Fatou Ndiaye', age: 38, diagnosis: 'Pyélonéphrite aiguë', site: 'Urinaire', severity: 'Modérée', pathogen: 'E. coli BLSE', treatment: 'Ertapénème IV 1g/j', duration: 'J3/J14', status: 'bmr' },
  { patient: 'Ibrahima Sow', age: 61, diagnosis: 'Endocardite infectieuse', site: 'Cardiaque', severity: 'Critique', pathogen: 'S. aureus SARM', treatment: 'Vancomycine + Rifampicine', duration: 'J8/J42', status: 'critical' },
  { patient: 'Mariama Ba', age: 29, diagnosis: 'Méningite bactérienne', site: 'SNC', severity: 'Sévère', pathogen: 'N. meningitidis', treatment: 'Céfotaxime IV 300mg/kg/j', duration: 'J2/J10', status: 'severe' },
];

const tropicalDiseases = [
  { patient: 'Cheikh Mbaye', age: 35, disease: 'Paludisme grave', parasite: 'P. falciparum', parasitemia: 4.2, treatment: 'Artésunate IV + Quinine', origin: 'Casamance', status: 'critical' },
  { patient: 'Aïcha Diop', age: 28, disease: 'Tuberculose pulmonaire', smear: 'BAAR+', resistance: 'Sensible', treatment: 'RHZE 2 mois + RH 4 mois', origin: 'Dakar', status: 'treatment' },
  { patient: 'Moussa Camara', age: 44, disease: 'Leishmaniose viscérale', spleen: 'Splénomégalie grade IV', treatment: 'Amphotéricine B liposomale 3mg/kg/j', origin: 'Guinée', status: 'treatment' },
  { patient: 'Ndéye Fall', age: 22, disease: 'Fièvre typhoïde', widal: 'H 1/640 O 1/320', treatment: 'Ceftriaxone IV 2g/j', origin: 'Saint-Louis', status: 'moderate' },
];

const hivPatients = [
  { patient: 'Rokhaya Sarr', age: 42, cd4: 380, vl: 'Indétectable', arv: 'TDF/3TC/DTG', adherence: 96, oi: 'Aucune', status: 'controlled' },
  { patient: 'Amadou Balde', age: 55, cd4: 48, vl: '124000 cp/mL', arv: 'Initiation ARV', adherence: 0, oi: 'Pneumocystose', status: 'critical' },
  { patient: 'Fatou Camara', age: 33, cd4: 620, vl: 'Indétectable', arv: 'ABC/3TC/EFV', adherence: 88, oi: 'Aucune', status: 'controlled' },
];

const bmrData = [
  { name: 'BLSE', count: 7 }, { name: 'SARM', count: 4 }, { name: 'EPC', count: 2 }, { name: 'ERV', count: 1 },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  severe: { label: 'Sévère', bg: '#fef3c7', color: '#b45309' },
  bmr: { label: 'BMR', bg: '#f3e8ff', color: '#7c3aed' },
  critical: { label: 'Critique', bg: '#fee2e2', color: '#dc2626' },
  treatment: { label: 'Traitement', bg: '#dbeafe', color: '#1d4ed8' },
  moderate: { label: 'Modéré', bg: '#fef3c7', color: '#b45309' },
  controlled: { label: 'Contrôlé', bg: '#dcfce7', color: '#16a34a' },
  isolation: { label: 'Isolement', bg: '#fee2e2', color: '#dc2626' },
  contact: { label: 'Précautions contact', bg: '#fef3c7', color: '#b45309' },
  droplet: { label: 'Gouttelettes', bg: '#dbeafe', color: '#1d4ed8' },
  airborne: { label: 'Aérien', bg: '#fee2e2', color: '#dc2626' },
};

export default function InfectiologyWorkspaceContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #78350f 0%, #b45309 100%)', padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="ShieldCheckIcon" size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>Infectiologie & Maladies Tropicales</h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, margin: 0 }}>Infections · Maladies tropicales · VIH · Antibiothérapie · BMR · Isolement</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 20, flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              style={{ padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                background: activeTab === t.key ? '#fff' : 'rgba(255,255,255,0.12)',
                color: activeTab === t.key ? '#b45309' : '#fff' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '24px 32px' }}>
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
              {kpis.map((k, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 4px' }}>{k.label}</p>
                      <p style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', margin: 0 }}>{k.value}</p>
                      <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0' }}>{k.sub}</p>
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={k.icon} size={20} color={k.color} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>BMR identifiées ce mois</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={bmrData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#7c3aed" radius={[4,4,0,0]} name="Cas" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>Alertes infectiologiques actives</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Isolement aérien actif', count: 3, color: '#dc2626', bg: '#fee2e2' },
                    { label: 'Précautions gouttelettes', count: 7, color: '#1d4ed8', bg: '#dbeafe' },
                    { label: 'Précautions contact BMR', count: 14, color: '#7c3aed', bg: '#f3e8ff' },
                    { label: 'Antibiothérapie IV > 7j', count: 22, color: '#b45309', bg: '#fef3c7' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 8, background: item.bg }}>
                      <span style={{ fontSize: 13, color: item.color, fontWeight: 500 }}>{item.label}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: item.color }}>{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'infections' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Infections actives — Suivi antibiothérapie</h3>
              <button style={{ padding: '7px 14px', background: '#b45309', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ Nouveau cas</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Patient', 'Âge', 'Diagnostic', 'Site', 'Sévérité', 'Germe', 'Traitement', 'Durée', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {infections.map((p, i) => {
                  const s = statusConfig[p.status];
                  return (
                    <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{p.patient}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.age} ans</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.diagnosis}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.site}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.severity}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#7c3aed' }}>{p.pathogen}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#475569', maxWidth: 180 }}>{p.treatment}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#475569' }}>{p.duration}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'tropical' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Maladies tropicales & Endémiques</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Patient', 'Âge', 'Maladie', 'Détail', 'Traitement', 'Origine', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tropicalDiseases.map((p, i) => {
                  const s = statusConfig[p.status];
                  return (
                    <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{p.patient}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.age} ans</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#b45309' }}>{p.disease}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#475569' }}>
                        {'parasite' in p ? `P: ${p.parasite} — Parasitémie: ${p.parasitemia}%` :
                         'smear' in p ? `Frottis: ${p.smear} — Résistance: ${p.resistance}` :
                         'spleen'in p ? p.spleen : 'widal' in p ? `Widal: ${p.widal}` : ''}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#475569', maxWidth: 180 }}>{p.treatment}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.origin}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'hiv' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>VIH — Suivi immunovirologique & ARV</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Patient', 'Âge', 'CD4/µL', 'Charge virale', 'ARV', 'Observance %', 'IO', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hivPatients.map((p, i) => {
                  const s = statusConfig[p.status];
                  return (
                    <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{p.patient}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.age} ans</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.cd4 < 200 ? '#dc2626' : p.cd4 < 350 ? '#f59e0b' : '#16a34a', fontWeight: 600 }}>{p.cd4}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.vl === 'Indétectable' ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{p.vl}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#475569' }}>{p.arv}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.adherence >= 90 ? '#16a34a' : p.adherence > 0 ? '#f59e0b' : '#64748b', fontWeight: 600 }}>{p.adherence > 0 ? `${p.adherence}%` : '—'}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: p.oi !== 'Aucune' ? '#dc2626' : '#16a34a', fontWeight: p.oi !== 'Aucune' ? 600 : 400 }}>{p.oi}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'antibiotics' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
            {[
              { patient: 'Fatou Ndiaye', pathogen: 'E. coli BLSE', sample: 'ECBU', resistances: ['Amoxicilline', 'C3G', 'Fluoroquinolones', 'Cotrimoxazole'], sensible: ['Ertapénème', 'Fosfomycine', 'Nitrofurantoïne'], recommendation: 'Ertapénème IV 1g/j — Durée 14j', status: 'bmr' },
              { patient: 'Ibrahima Sow', pathogen: 'S. aureus SARM', sample: 'Hémoculture', resistances: ['Oxacilline', 'Amoxicilline', 'Clindamycine'], sensible: ['Vancomycine', 'Linézolide', 'Daptomycine'], recommendation: 'Vancomycine IV + Rifampicine — Durée 42j', status: 'critical' },
              { patient: 'Cheikh Mbaye', pathogen: 'K. pneumoniae EPC', sample: 'LBA', resistances: ['Toutes β-lactamines', 'Fluoroquinolones', 'Aminosides'], sensible: ['Colistine', 'Tigécycline'], recommendation: 'Colistine IV + Tigécycline — Avis référent', status: 'critical' },
              { patient: 'Mariama Diop', pathogen: 'E. faecium ERV', sample: 'Selles (dépistage)', resistances: ['Vancomycine', 'Teicoplanine'], sensible: ['Linézolide', 'Daptomycine'], recommendation: 'Isolement contact strict — Pas de traitement si colonisation', status: 'isolation' },
            ].map((p, i) => {
              const s = statusConfig[p.status];
              return (
                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{p.patient}</p>
                      <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{p.pathogen} — {p.sample}</p>
                    </div>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                    <div style={{ background: '#fee2e2', borderRadius: 8, padding: 10 }}>
                      <p style={{ fontSize: 11, color: '#dc2626', fontWeight: 600, margin: '0 0 4px' }}>Résistances</p>
                      {p.resistances.map((r, j) => <p key={j} style={{ fontSize: 11, color: '#475569', margin: '1px 0' }}>• {r}</p>)}
                    </div>
                    <div style={{ background: '#dcfce7', borderRadius: 8, padding: 10 }}>
                      <p style={{ fontSize: 11, color: '#16a34a', fontWeight: 600, margin: '0 0 4px' }}>Sensible</p>
                      {p.sensible.map((r, j) => <p key={j} style={{ fontSize: 11, color: '#475569', margin: '1px 0' }}>• {r}</p>)}
                    </div>
                  </div>
                  <div style={{ background: '#fef3c7', borderRadius: 8, padding: 10 }}>
                    <p style={{ fontSize: 11, color: '#b45309', fontWeight: 600, margin: '0 0 4px' }}>Recommandation</p>
                    <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>{p.recommendation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'isolation' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
            {[
              { patient: 'Ibrahima Sow', room: 'Ch. 12 — Infectio', type: 'airborne', reason: 'SARM — Endocardite', measures: ['Chambre individuelle', 'Masque FFP2 obligatoire', 'Surblouse + gants', 'Matériel dédié'], since: '08/08/2026' },
              { patient: 'Cheikh Mbaye', room: 'Ch. 08 — Infectio', type: 'contact', reason: 'K. pneumoniae EPC', measures: ['Chambre individuelle', 'Gants + surblouse', 'SHA à l\'entrée/sortie', 'Signalétique BMR'], since: '06/08/2026' },
              { patient: 'Aïcha Diop', room: 'Ch. 15 — Pneumo', type: 'airborne', reason: 'Tuberculose pulmonaire BAAR+', measures: ['Chambre pression négative', 'Masque FFP2', 'Fenêtre fermée', 'Visite limitée'], since: '05/08/2026' },
              { patient: 'Mariama Diop', room: 'Ch. 22 — Médecine', type: 'contact', reason: 'E. faecium ERV (dépistage)', measures: ['Chambre individuelle', 'Gants + surblouse', 'Matériel dédié', 'Pas de transfert sans avis'], since: '10/08/2026' },
            ].map((p, i) => {
              const s = statusConfig[p.type];
              return (
                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, border: `2px solid ${p.type === 'airborne' ? '#fca5a5' : '#fde68a'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{p.patient}</p>
                      <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{p.room} — Depuis {p.since}</p>
                    </div>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#dc2626', fontWeight: 600, margin: '0 0 10px' }}>{p.reason}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {p.measures.map((m, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#b45309', flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: '#475569' }}>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
