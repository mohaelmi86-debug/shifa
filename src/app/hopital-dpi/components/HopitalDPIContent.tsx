'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type TabKey = 'overview' | 'admissions' | 'care' | 'vitals' | 'prescriptions' | 'medications' | 'acts' | 'discharge';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'overview', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
  { key: 'admissions', label: 'Admission', icon: 'UserPlusIcon' },
  { key: 'care', label: 'Soins & Notes', icon: 'ClipboardDocumentListIcon' },
  { key: 'vitals', label: 'Constantes', icon: 'HeartIcon' },
  { key: 'prescriptions', label: 'Prescriptions', icon: 'DocumentCheckIcon' },
  { key: 'medications', label: 'Médicaments', icon: 'ArchiveBoxIcon' },
  { key: 'acts', label: 'Actes & Examens', icon: 'BeakerIcon' },
  { key: 'discharge', label: 'Sortie', icon: 'ArrowRightCircleIcon' },
];

const patient = {
  id: 'SH-2-SN-2025-4F9K',
  name: 'Oumar Diallo',
  age: 58,
  gender: 'M',
  dob: '15/03/1967',
  blood: 'A+',
  weight: '78 kg',
  height: '175 cm',
  allergies: ['Pénicilline', 'Aspirine'],
  admissionId: 'ADM-2025-001',
  admissionDate: '10 août 2026',
  admissionTime: '08:14',
  dept: 'Réanimation',
  bed: 'REA-03',
  physician: 'Dr. Amadou Ba',
  motif: 'Douleur thoracique aiguë — Infarctus du myocarde suspecté',
  insurance: 'IPRES',
  coverage: 80,
  status: 'Hospitalisé',
};

const vitalsData = [
  { time: '08:00', systolic: 145, diastolic: 92, pulse: 98, spo2: 94, temp: 37.2 },
  { time: '10:00', systolic: 138, diastolic: 88, pulse: 92, spo2: 96, temp: 37.1 },
  { time: '12:00', systolic: 132, diastolic: 85, pulse: 88, spo2: 97, temp: 37.0 },
  { time: '14:00', systolic: 128, diastolic: 82, pulse: 84, spo2: 98, temp: 36.9 },
  { time: '16:00', systolic: 125, diastolic: 80, pulse: 82, spo2: 98, temp: 36.8 },
  { time: '18:00', systolic: 122, diastolic: 78, pulse: 80, spo2: 99, temp: 36.8 },
];

const careNotes = [
  { id: 'N-001', datetime: '10/08/2026 08:30', author: 'Dr. Amadou Ba', type: 'Médical', content: 'Patient admis pour douleur thoracique aiguë. ECG : sus-décalage ST en V1-V4. Troponine I élevée à 2.4 ng/mL. Diagnostic : STEMI antérieur. Mise en route du protocole thrombolyse.', priority: 'urgent' },
  { id: 'N-002', datetime: '10/08/2026 09:15', author: 'Inf. Fatou Sow', type: 'Infirmier', content: 'Voie veineuse périphérique posée. Monitoring continu installé. Patient conscient, orienté, douleur EVA 7/10. Oxygénothérapie 4L/min débutée.', priority: 'normal' },
  { id: 'N-003', datetime: '10/08/2026 11:00', author: 'Dr. Amadou Ba', type: 'Médical', content: 'Évolution favorable post-thrombolyse. Douleur EVA 3/10. Reperfusion clinique obtenue. Surveillance continue maintenue. Bilan biologique de contrôle prescrit.', priority: 'normal' },
  { id: 'N-004', datetime: '10/08/2026 14:00', author: 'Inf. Moussa Diop', type: 'Infirmier', content: 'Constantes stables. Patient repose. Alimentation légère tolérée. Diurèse 450 mL/4h. Pas de complication observée.', priority: 'normal' },
  { id: 'N-005', datetime: '10/08/2026 18:00', author: 'Dr. Aminata Faye', type: 'Médical', content: 'Visite du soir. Hémodynamique stable. TA 122/78, FC 80/min, SpO2 99%. Décision de transfert en cardiologie demain matin si évolution favorable.', priority: 'normal' },
];

const prescriptions = [
  { id: 'RX-001', drug: 'Aspirine', dose: '100 mg', route: 'PO', frequency: '1×/j', duration: '30 jours', prescriber: 'Dr. Ba', status: 'active', startDate: '10/08/2026' },
  { id: 'RX-002', drug: 'Clopidogrel', dose: '75 mg', route: 'PO', frequency: '1×/j', duration: '12 mois', prescriber: 'Dr. Ba', status: 'active', startDate: '10/08/2026' },
  { id: 'RX-003', drug: 'Enoxaparine', dose: '0.6 mL', route: 'SC', frequency: '2×/j', duration: '5 jours', prescriber: 'Dr. Ba', status: 'active', startDate: '10/08/2026' },
  { id: 'RX-004', drug: 'Métoprolol', dose: '25 mg', route: 'PO', frequency: '2×/j', duration: 'Continu', prescriber: 'Dr. Ba', status: 'active', startDate: '10/08/2026' },
  { id: 'RX-005', drug: 'Atorvastatine', dose: '80 mg', route: 'PO', frequency: '1×/j (soir)', duration: 'Continu', prescriber: 'Dr. Ba', status: 'active', startDate: '10/08/2026' },
  { id: 'RX-006', drug: 'Morphine', dose: '5 mg', route: 'IV', frequency: 'Si douleur EVA>5', duration: '48h', prescriber: 'Dr. Ba', status: 'stopped', startDate: '10/08/2026' },
];

const medications = [
  { id: 'ADM-001', drug: 'Aspirine 100mg', time: '08:30', dose: '1 cp', route: 'PO', nurse: 'Inf. Sow', status: 'given', note: '' },
  { id: 'ADM-002', drug: 'Clopidogrel 75mg', time: '08:30', dose: '1 cp', route: 'PO', nurse: 'Inf. Sow', status: 'given', note: '' },
  { id: 'ADM-003', drug: 'Enoxaparine 0.6mL', time: '09:00', dose: '0.6 mL', route: 'SC', nurse: 'Inf. Sow', status: 'given', note: 'Abdomen gauche' },
  { id: 'ADM-004', drug: 'Métoprolol 25mg', time: '12:00', dose: '1 cp', route: 'PO', nurse: 'Inf. Diop', status: 'given', note: '' },
  { id: 'ADM-005', drug: 'Atorvastatine 80mg', time: '20:00', dose: '1 cp', route: 'PO', nurse: 'Inf. Ndiaye', status: 'pending', note: '' },
  { id: 'ADM-006', drug: 'Enoxaparine 0.6mL', time: '21:00', dose: '0.6 mL', route: 'SC', nurse: '—', status: 'pending', note: '' },
];

const acts = [
  { id: 'ACT-001', type: 'Biologie', name: 'Troponine I', requestedBy: 'Dr. Ba', requestedAt: '08:20', result: '2.4 ng/mL (↑)', status: 'completed', urgent: true },
  { id: 'ACT-002', type: 'Biologie', name: 'NFS + Bilan coag.', requestedBy: 'Dr. Ba', requestedAt: '08:20', result: 'Hb 13.2 g/dL, TP 78%', status: 'completed', urgent: false },
  { id: 'ACT-003', type: 'Imagerie', name: 'Radiographie thorax', requestedBy: 'Dr. Ba', requestedAt: '08:25', result: 'Cardiomégalie modérée', status: 'completed', urgent: true },
  { id: 'ACT-004', type: 'Cardiologie', name: 'ECG 12 dérivations', requestedBy: 'Dr. Ba', requestedAt: '08:15', result: 'Sus-décalage ST V1-V4', status: 'completed', urgent: true },
  { id: 'ACT-005', type: 'Biologie', name: 'Troponine I contrôle', requestedBy: 'Dr. Ba', requestedAt: '11:00', result: '1.8 ng/mL (↓)', status: 'completed', urgent: false },
  { id: 'ACT-006', type: 'Biologie', name: 'Ionogramme + Créatinine', requestedBy: 'Dr. Faye', requestedAt: '18:00', result: 'En attente', status: 'pending', urgent: false },
  { id: 'ACT-007', type: 'Imagerie', name: 'Échocardiographie', requestedBy: 'Dr. Ba', requestedAt: '18:30', result: '—', status: 'scheduled', urgent: false },
];

export default function HopitalDPIContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [showNewNote, setShowNewNote] = useState(false);
  const [noteText, setNoteText] = useState('');

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--shifa-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '16px' }}>OD</div>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>{patient.name}</h1>
              <p style={{ fontSize: '13px', color: 'var(--muted-foreground)', margin: 0 }}>{patient.id} · {patient.age} ans · {patient.gender} · {patient.blood}</p>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ padding: '4px 12px', borderRadius: '20px', background: '#dcfce7', color: '#16a34a', fontSize: '12px', fontWeight: 600 }}>● {patient.status}</span>
          <span style={{ padding: '4px 12px', borderRadius: '20px', background: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)', fontSize: '12px', fontWeight: 600 }}>{patient.dept} — {patient.bed}</span>
          <span style={{ padding: '4px 12px', borderRadius: '20px', background: '#fef9c3', color: '#ca8a04', fontSize: '12px', fontWeight: 600 }}>Allergie: {patient.allergies.join(', ')}</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', overflowX: 'auto', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: activeTab === tab.key ? 700 : 500, background: activeTab === tab.key ? 'var(--shifa-blue)' : 'transparent', color: activeTab === tab.key ? '#fff' : 'var(--muted-foreground)', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
            <Icon name={tab.icon} size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Patient info card */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: 'var(--foreground)' }}>Informations patient</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { label: 'Date de naissance', value: patient.dob },
                { label: 'Poids / Taille', value: `${patient.weight} / ${patient.height}` },
                { label: 'Groupe sanguin', value: patient.blood },
                { label: 'Allergies', value: patient.allergies.join(', ') },
                { label: 'Assurance', value: `${patient.insurance} (${patient.coverage}%)` },
                { label: 'Médecin référent', value: patient.physician },
              ].map(item => (
                <div key={item.label}>
                  <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '2px' }}>{item.label}</p>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Admission info */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: 'var(--foreground)' }}>Séjour en cours</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { label: 'N° Admission', value: patient.admissionId },
                { label: 'Date d\'admission', value: `${patient.admissionDate} à ${patient.admissionTime}` },
                { label: 'Service', value: patient.dept },
                { label: 'Lit', value: patient.bed },
                { label: 'Motif', value: patient.motif },
                { label: 'Durée de séjour', value: '2 jours' },
              ].map(item => (
                <div key={item.label} style={{ gridColumn: item.label === 'Motif' ? 'span 2' : 'span 1' }}>
                  <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '2px' }}>{item.label}</p>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Latest vitals */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: 'var(--foreground)' }}>Dernières constantes</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {[
                { label: 'TA', value: '122/78', unit: 'mmHg', color: 'var(--shifa-blue)' },
                { label: 'FC', value: '80', unit: '/min', color: '#dc2626' },
                { label: 'SpO₂', value: '99', unit: '%', color: 'var(--shifa-green)' },
                { label: 'Temp.', value: '36.8', unit: '°C', color: 'var(--shifa-amber)' },
                { label: 'FR', value: '16', unit: '/min', color: 'var(--shifa-purple)' },
                { label: 'Glycémie', value: '7.2', unit: 'mmol/L', color: 'var(--shifa-cyan)' },
              ].map(v => (
                <div key={v.label} style={{ background: 'var(--muted)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '4px' }}>{v.label}</p>
                  <p style={{ fontSize: '20px', fontWeight: 700, color: v.color }}>{v.value}</p>
                  <p style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{v.unit}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Active prescriptions summary */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: 'var(--foreground)' }}>Prescriptions actives</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {prescriptions.filter(p => p.status === 'active').slice(0, 5).map(rx => (
                <div key={rx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--muted)', borderRadius: '8px' }}>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>{rx.drug} {rx.dose}</p>
                    <p style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{rx.route} · {rx.frequency}</p>
                  </div>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '10px', background: '#dcfce7', color: '#16a34a', fontWeight: 600 }}>Actif</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Admissions Tab */}
      {activeTab === 'admissions' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Dossier d'admission</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            {[
              { section: 'Identité', fields: [{ l: 'Nom complet', v: patient.name }, { l: 'Date de naissance', v: patient.dob }, { l: 'Sexe', v: 'Masculin' }, { l: 'SHIFA ID', v: patient.id }] },
              { section: 'Admission', fields: [{ l: 'N° Admission', v: patient.admissionId }, { l: 'Date/Heure', v: `${patient.admissionDate} ${patient.admissionTime}` }, { l: 'Service', v: patient.dept }, { l: 'Lit', v: patient.bed }] },
              { section: 'Assurance', fields: [{ l: 'Organisme', v: patient.insurance }, { l: 'Taux de couverture', v: `${patient.coverage}%` }, { l: 'Statut', v: 'Vérifiée' }, { l: 'N° Police', v: 'IP-2025-78432' }] },
            ].map(sec => (
              <div key={sec.section} style={{ background: 'var(--muted)', borderRadius: '10px', padding: '16px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--shifa-blue)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{sec.section}</h4>
                {sec.fields.map(f => (
                  <div key={f.l} style={{ marginBottom: '10px' }}>
                    <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '2px' }}>{f.l}</p>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>{f.v}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ marginTop: '20px', padding: '16px', background: '#fef9c3', borderRadius: '10px', border: '1px solid #fde68a' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#92400e', marginBottom: '4px' }}>⚠ Allergies connues</p>
            <p style={{ fontSize: '13px', color: '#92400e' }}>{patient.allergies.join(' · ')}</p>
          </div>
          <div style={{ marginTop: '16px', padding: '16px', background: 'var(--muted)', borderRadius: '10px' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Motif d'hospitalisation</p>
            <p style={{ fontSize: '14px', color: 'var(--foreground)' }}>{patient.motif}</p>
          </div>
        </div>
      )}

      {/* Care Notes Tab */}
      {activeTab === 'care' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Notes de soins & observations</h3>
            <button onClick={() => setShowNewNote(!showNewNote)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'var(--shifa-blue)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              <Icon name="PlusIcon" size={14} /> Nouvelle note
            </button>
          </div>
          {showNewNote && (
            <div style={{ background: 'var(--card)', border: '1px solid var(--shifa-blue)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <select style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', marginBottom: '10px', background: 'var(--background)', color: 'var(--foreground)', fontSize: '13px' }}>
                <option>Médical</option><option>Infirmier</option><option>Paramédical</option>
              </select>
              <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Saisir la note clinique..." style={{ width: '100%', minHeight: '100px', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box' }} />
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button style={{ padding: '8px 16px', background: 'var(--shifa-blue)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Enregistrer</button>
                <button onClick={() => setShowNewNote(false)} style={{ padding: '8px 16px', background: 'var(--muted)', color: 'var(--foreground)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Annuler</button>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {careNotes.map(note => (
              <div key={note.id} style={{ background: 'var(--card)', border: `1px solid ${note.priority === 'urgent' ? '#fca5a5' : 'var(--border)'}`, borderLeft: `4px solid ${note.priority === 'urgent' ? '#dc2626' : 'var(--shifa-blue)'}`, borderRadius: '10px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '10px', background: note.type === 'Médical' ? 'rgba(0,102,255,0.1)' : 'rgba(16,185,129,0.1)', color: note.type === 'Médical' ? 'var(--shifa-blue)' : 'var(--shifa-green)', fontSize: '11px', fontWeight: 600 }}>{note.type}</span>
                    {note.priority === 'urgent' && <span style={{ padding: '2px 8px', borderRadius: '10px', background: '#fee2e2', color: '#dc2626', fontSize: '11px', fontWeight: 600 }}>URGENT</span>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)' }}>{note.author}</p>
                    <p style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{note.datetime}</p>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--foreground)', lineHeight: '1.6' }}>{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vitals Tab */}
      {activeTab === 'vitals' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'Tension artérielle', value: '122/78', unit: 'mmHg', trend: '↓', color: 'var(--shifa-blue)' },
              { label: 'Fréquence cardiaque', value: '80', unit: '/min', trend: '↓', color: '#dc2626' },
              { label: 'SpO₂', value: '99%', unit: '', trend: '↑', color: 'var(--shifa-green)' },
              { label: 'Température', value: '36.8', unit: '°C', trend: '→', color: 'var(--shifa-amber)' },
              { label: 'Fréquence resp.', value: '16', unit: '/min', trend: '→', color: 'var(--shifa-purple)' },
            ].map(v => (
              <div key={v.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '8px' }}>{v.label}</p>
                <p style={{ fontSize: '28px', fontWeight: 700, color: v.color }}>{v.value}</p>
                <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{v.unit} <span style={{ color: v.trend === '↑' ? 'var(--shifa-green)' : v.trend === '↓' ? '#dc2626' : 'var(--muted-foreground)' }}>{v.trend}</span></p>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Évolution tension artérielle (mmHg)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={vitalsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis domain={[60, 160]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="systolic" stroke="var(--shifa-blue)" strokeWidth={2} dot={{ r: 4 }} name="Systolique" />
                <Line type="monotone" dataKey="diastolic" stroke="var(--shifa-purple)" strokeWidth={2} dot={{ r: 4 }} name="Diastolique" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: '20px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--muted)' }}>
                  {['Heure', 'TA (mmHg)', 'FC (/min)', 'SpO₂ (%)', 'Temp. (°C)'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vitalsData.map((row, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 600 }}>{row.time}</td>
                    <td style={{ padding: '10px 16px', fontSize: '13px' }}>{row.systolic}/{row.diastolic}</td>
                    <td style={{ padding: '10px 16px', fontSize: '13px' }}>{row.pulse}</td>
                    <td style={{ padding: '10px 16px', fontSize: '13px' }}>{row.spo2}</td>
                    <td style={{ padding: '10px 16px', fontSize: '13px' }}>{row.temp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Prescriptions Tab */}
      {activeTab === 'prescriptions' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Prescriptions médicamenteuses</h3>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'var(--shifa-blue)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              <Icon name="PlusIcon" size={14} /> Nouvelle prescription
            </button>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--muted)' }}>
                  {['Médicament', 'Dose', 'Voie', 'Fréquence', 'Durée', 'Prescripteur', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {prescriptions.map(rx => (
                  <tr key={rx.id} style={{ borderTop: '1px solid var(--border)', opacity: rx.status === 'stopped' ? 0.5 : 1 }}>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600 }}>{rx.drug}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>{rx.dose}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}><span style={{ padding: '2px 8px', borderRadius: '6px', background: 'var(--muted)', fontSize: '12px' }}>{rx.route}</span></td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>{rx.frequency}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>{rx.duration}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--muted-foreground)' }}>{rx.prescriber}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, background: rx.status === 'active' ? '#dcfce7' : '#f3f4f6', color: rx.status === 'active' ? '#16a34a' : '#6b7280' }}>{rx.status === 'active' ? 'Actif' : 'Arrêté'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Medications Tab */}
      {activeTab === 'medications' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Administration des médicaments — {patient.admissionDate}</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ padding: '4px 12px', borderRadius: '20px', background: '#dcfce7', color: '#16a34a', fontSize: '12px', fontWeight: 600 }}>4 administrés</span>
              <span style={{ padding: '4px 12px', borderRadius: '20px', background: '#fef9c3', color: '#ca8a04', fontSize: '12px', fontWeight: 600 }}>2 en attente</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {medications.map(med => (
              <div key={med.id} style={{ background: 'var(--card)', border: `1px solid ${med.status === 'pending' ? '#fde68a' : 'var(--border)'}`, borderRadius: '10px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: med.status === 'given' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="ArchiveBoxIcon" size={20} color={med.status === 'given' ? 'var(--shifa-green)' : 'var(--shifa-amber)'} />
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)' }}>{med.drug}</p>
                    <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{med.dose} · {med.route} · {med.time}</p>
                    {med.note && <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', fontStyle: 'italic' }}>{med.note}</p>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {med.nurse !== '—' && <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{med.nurse}</p>}
                  <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: med.status === 'given' ? '#dcfce7' : '#fef9c3', color: med.status === 'given' ? '#16a34a' : '#ca8a04' }}>{med.status === 'given' ? '✓ Administré' : '⏳ En attente'}</span>
                  {med.status === 'pending' && <button style={{ padding: '6px 12px', background: 'var(--shifa-green)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Valider</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Acts Tab */}
      {activeTab === 'acts' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Actes & Examens complémentaires</h3>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'var(--shifa-blue)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              <Icon name="PlusIcon" size={14} /> Prescrire un acte
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {acts.map(act => (
              <div key={act.id} style={{ background: 'var(--card)', border: `1px solid ${act.urgent ? '#fca5a5' : 'var(--border)'}`, borderRadius: '10px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '8px', background: act.type === 'Biologie' ? 'rgba(0,102,255,0.1)' : act.type === 'Imagerie' ? 'rgba(139,92,246,0.1)' : 'rgba(245,158,11,0.1)', color: act.type === 'Biologie' ? 'var(--shifa-blue)' : act.type === 'Imagerie' ? 'var(--shifa-purple)' : 'var(--shifa-amber)', fontSize: '11px', fontWeight: 600 }}>{act.type}</span>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {act.name}
                      {act.urgent && <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '6px', background: '#fee2e2', color: '#dc2626', fontWeight: 700 }}>URGENT</span>}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{act.requestedBy} · {act.requestedAt}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <p style={{ fontSize: '13px', color: 'var(--foreground)', fontWeight: act.result !== 'En attente' && act.result !== '—' ? 600 : 400 }}>{act.result}</p>
                  <span style={{ padding: '4px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, background: act.status === 'completed' ? '#dcfce7' : act.status === 'pending' ? '#fef9c3' : '#dbeafe', color: act.status === 'completed' ? '#16a34a' : act.status === 'pending' ? '#ca8a04' : '#1d4ed8' }}>{act.status === 'completed' ? 'Résultat disponible' : act.status === 'pending' ? 'En attente' : 'Planifié'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discharge Tab */}
      {activeTab === 'discharge' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Planification de la sortie</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Date de sortie prévue', value: '12 août 2026', editable: true },
                { label: 'Mode de sortie', value: 'Retour à domicile', editable: true },
                { label: 'Service de destination', value: 'Cardiologie ambulatoire', editable: true },
                { label: 'Médecin de suivi', value: 'Dr. Amadou Ba', editable: false },
              ].map(f => (
                <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--muted)', borderRadius: '8px' }}>
                  <p style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>{f.label}</p>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>{f.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Checklist de sortie</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { item: 'Ordonnance de sortie rédigée', done: true },
                { item: 'Lettre de sortie médicale', done: true },
                { item: 'Résultats biologiques disponibles', done: true },
                { item: 'Éducation thérapeutique réalisée', done: false },
                { item: 'RDV de suivi planifié', done: false },
                { item: 'Facture éditée & assurance notifiée', done: false },
              ].map(c => (
                <div key={c.item} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '8px 12px', background: c.done ? 'rgba(16,185,129,0.05)' : 'var(--muted)', borderRadius: '8px', border: `1px solid ${c.done ? 'rgba(16,185,129,0.2)' : 'var(--border)'}` }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: c.done ? 'var(--shifa-green)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {c.done && <Icon name="CheckIcon" size={12} color="#fff" />}
                  </div>
                  <p style={{ fontSize: '13px', color: c.done ? 'var(--foreground)' : 'var(--muted-foreground)', textDecoration: c.done ? 'none' : 'none' }}>{c.item}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ gridColumn: 'span 2', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Résumé de sortie</h3>
            <textarea placeholder="Saisir le résumé médical de sortie (diagnostic final, traitement instauré, recommandations, suivi)..." style={{ width: '100%', minHeight: '120px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box' }} defaultValue="Patient admis pour STEMI antérieur. Thrombolyse réalisée avec succès. Évolution favorable. Traitement anticoagulant et antiagrégant instauré. Transfert en cardiologie ambulatoire pour suivi et coronarographie programmée." />
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              <button style={{ padding: '10px 20px', background: 'var(--shifa-blue)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Valider la sortie</button>
              <button style={{ padding: '10px 20px', background: 'var(--muted)', color: 'var(--foreground)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>Imprimer lettre de sortie</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
