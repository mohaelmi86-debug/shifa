'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type TabKey = 'overview' | 'admissions' | 'care' | 'vitals' | 'prescriptions' | 'medications' | 'acts' | 'access' | 'discharge';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'overview', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
  { key: 'admissions', label: 'Admission', icon: 'UserPlusIcon' },
  { key: 'care', label: 'Soins & Notes', icon: 'ClipboardDocumentListIcon' },
  { key: 'vitals', label: 'Constantes', icon: 'HeartIcon' },
  { key: 'prescriptions', label: 'Prescriptions', icon: 'DocumentCheckIcon' },
  { key: 'medications', label: 'Médicaments', icon: 'ArchiveBoxIcon' },
  { key: 'acts', label: 'Actes & Examens', icon: 'BeakerIcon' },
  { key: 'access', label: 'Accès & NEED-TO-KNOW', icon: 'ShieldCheckIcon' },
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

const accessLog = [
  { id: 'ACC-001', actor: 'Dr. Amadou Ba', role: 'Médecin référent', module: 'DPI complet', action: 'Consultation dossier', time: '10/08/2026 08:30', authorized: true, dataScope: 'Accès complet (médecin référent)' },
  { id: 'ACC-002', actor: 'Inf. Fatou Sow', role: 'Infirmier', module: 'Constantes + Soins', action: 'Enregistrement constantes', time: '10/08/2026 09:15', authorized: true, dataScope: 'Constantes, soins, médicaments (scope infirmier)' },
  { id: 'ACC-003', actor: 'Ph. Koné', role: 'Pharmacien', module: 'Prescriptions uniquement', action: 'Consultation ordonnance', time: '10/08/2026 09:30', authorized: true, dataScope: 'Prescriptions uniquement — pas d\'accès aux notes cliniques' },
  { id: 'ACC-004', actor: 'Lab. Diallo', role: 'Laborantin', module: 'Demandes biologiques', action: 'Réception demande analyse', time: '10/08/2026 08:22', authorized: true, dataScope: 'Demande d\'analyse uniquement — pas d\'accès au diagnostic' },
  { id: 'ACC-005', actor: 'Dr. Aminata Faye', role: 'Médecin de garde', module: 'DPI complet', action: 'Visite du soir', time: '10/08/2026 18:00', authorized: true, dataScope: 'Accès complet (médecin de garde autorisé)' },
  { id: 'ACC-006', actor: 'Compt. Mbaye', role: 'Comptable', module: 'Facturation uniquement', action: 'Consultation actes facturables', time: '10/08/2026 14:00', authorized: true, dataScope: 'Actes et tarifs uniquement — pas d\'accès aux données cliniques' },
  { id: 'ACC-007', actor: 'Admin. Seck', role: 'Administratif', module: 'Identité + Assurance', action: 'Vérification couverture', time: '10/08/2026 08:20', authorized: true, dataScope: 'Identité et assurance uniquement' },
  { id: 'ACC-008', actor: 'Dr. Kofi Asante', role: 'Médecin externe', module: 'Résumé de transfert', action: 'Tentative accès DPI complet', time: '10/08/2026 15:00', authorized: false, dataScope: 'REFUSÉ — accès non autorisé au DPI complet' },
];

const moduleAccessMatrix = [
  { module: 'Médecin référent', access: ['DPI complet', 'Constantes', 'Prescriptions', 'Notes cliniques', 'Résultats', 'Imagerie', 'Actes'], color: '#2563eb' },
  { module: 'Infirmier', access: ['Constantes', 'Soins', 'Médicaments administrés', 'Notes infirmières'], color: '#059669' },
  { module: 'Pharmacien', access: ['Prescriptions uniquement'], color: '#7c3aed' },
  { module: 'Laborantin', access: ['Demandes d\'analyse', 'Résultats biologiques'], color: '#d97706' },
  { module: 'Radiologue', access: ['Demandes d\'imagerie', 'Comptes rendus imagerie'], color: '#0891b2' },
  { module: 'Comptable', access: ['Actes facturables', 'Tarifs', 'Assurance'], color: '#64748b' },
  { module: 'Administratif', access: ['Identité', 'Assurance', 'Admission/Sortie'], color: '#64748b' },
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
          <span style={{ padding: '4px 12px', borderRadius: '20px', background: '#ede9fe', color: '#7c3aed', fontSize: '12px', fontWeight: 600 }}>NEED-TO-KNOW actif</span>
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
          {/* Modules connectés (NEED-TO-KNOW) */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: 'var(--foreground)' }}>Modules connectés (NEED-TO-KNOW)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Laboratoire', href: '/lab-dashboard', icon: 'BeakerIcon', color: '#7c3aed', scope: 'Résultats biologiques' },
                { label: 'Imagerie', href: '/imaging-dashboard', icon: 'PhotoIcon', color: '#0891b2', scope: 'Comptes rendus imagerie' },
                { label: 'Pharmacie', href: '/pharmacy-dashboard', icon: 'ArchiveBoxIcon', color: '#059669', scope: 'Prescriptions uniquement' },
                { label: 'Transfert patient', href: '/patient-transfer', icon: 'ArrowsRightLeftIcon', color: '#dc2626', scope: 'Données de transfert' },
                { label: 'Coordination soins', href: '/pro-care-coordination', icon: 'UsersIcon', color: '#2563eb', scope: 'Plan de soins partagé' },
              ].map(mod => (
                <a key={mod.label} href={mod.href} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'var(--muted)', borderRadius: '8px', textDecoration: 'none' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: mod.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name={mod.icon as any} size={16} color={mod.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>{mod.label}</p>
                    <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', margin: 0 }}>{mod.scope}</p>
                  </div>
                  <Icon name="ArrowTopRightOnSquareIcon" size={13} color={mod.color} />
                </a>
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
              <div key={note.id} style={{ background: 'var(--card)', border: `1px solid ${note.priority === 'urgent' ? '#dc2626' : 'var(--border)'}`, borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, background: note.type === 'Médical' ? 'rgba(0,102,255,0.1)' : '#dcfce7', color: note.type === 'Médical' ? 'var(--shifa-blue)' : '#16a34a' }}>{note.type}</span>
                    {note.priority === 'urgent' && <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, background: '#fee2e2', color: '#dc2626' }}>Urgent</span>}
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{note.datetime}</span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--foreground)', lineHeight: 1.6, marginBottom: '8px' }}>{note.content}</p>
                <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', fontWeight: 600 }}>— {note.author}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vitals Tab */}
      {activeTab === 'vitals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Évolution TA & FC — Aujourd'hui</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={vitalsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="time" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                <Tooltip />
                <Line type="monotone" dataKey="systolic" stroke="var(--shifa-blue)" strokeWidth={2} name="TA Systolique" dot={false} />
                <Line type="monotone" dataKey="diastolic" stroke="var(--shifa-cyan)" strokeWidth={2} name="TA Diastolique" dot={false} />
                <Line type="monotone" dataKey="pulse" stroke="#dc2626" strokeWidth={2} name="FC" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
            {[
              { label: 'TA', value: '122/78', unit: 'mmHg', color: 'var(--shifa-blue)', trend: '↓ Amélioration' },
              { label: 'FC', value: '80', unit: '/min', color: '#dc2626', trend: '↓ Stable' },
              { label: 'SpO₂', value: '99', unit: '%', color: 'var(--shifa-green)', trend: '↑ Amélioration' },
              { label: 'Temp.', value: '36.8', unit: '°C', color: 'var(--shifa-amber)', trend: '= Stable' },
              { label: 'FR', value: '16', unit: '/min', color: 'var(--shifa-purple)', trend: '= Stable' },
              { label: 'Glycémie', value: '7.2', unit: 'mmol/L', color: 'var(--shifa-cyan)', trend: '↓ Amélioration' },
            ].map(v => (
              <div key={v.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '4px' }}>{v.label}</p>
                <p style={{ fontSize: '22px', fontWeight: 700, color: v.color }}>{v.value}</p>
                <p style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{v.unit}</p>
                <p style={{ fontSize: '10px', color: '#16a34a', marginTop: '4px' }}>{v.trend}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prescriptions Tab */}
      {activeTab === 'prescriptions' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Prescriptions</h3>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'var(--shifa-blue)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              <Icon name="PlusIcon" size={14} /> Nouvelle prescription
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--muted)' }}>
                {['Médicament', 'Dose', 'Voie', 'Fréquence', 'Durée', 'Prescripteur', 'Début', 'Statut'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted-foreground)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((rx, i) => (
                <tr key={rx.id} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>{rx.drug}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--foreground)' }}>{rx.dose}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--muted-foreground)' }}>{rx.route}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--foreground)' }}>{rx.frequency}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--muted-foreground)' }}>{rx.duration}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--muted-foreground)' }}>{rx.prescriber}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--muted-foreground)' }}>{rx.startDate}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, background: rx.status === 'active' ? '#dcfce7' : '#fee2e2', color: rx.status === 'active' ? '#16a34a' : '#dc2626' }}>
                      {rx.status === 'active' ? 'Actif' : 'Arrêté'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Medications Tab */}
      {activeTab === 'medications' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Administration des médicaments — Aujourd'hui</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--muted)' }}>
                {['Médicament', 'Heure', 'Dose', 'Voie', 'Infirmier', 'Statut', 'Note'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted-foreground)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {medications.map((med, i) => (
                <tr key={med.id} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>{med.drug}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--foreground)' }}>{med.time}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--muted-foreground)' }}>{med.dose}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--muted-foreground)' }}>{med.route}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--muted-foreground)' }}>{med.nurse}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, background: med.status === 'given' ? '#dcfce7' : '#fef9c3', color: med.status === 'given' ? '#16a34a' : '#ca8a04' }}>
                      {med.status === 'given' ? 'Administré' : 'En attente'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--muted-foreground)', fontStyle: med.note ? 'normal' : 'italic' }}>{med.note || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Acts Tab */}
      {activeTab === 'acts' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Actes & Examens</h3>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'var(--shifa-blue)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              <Icon name="PlusIcon" size={14} /> Nouvelle demande
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--muted)' }}>
                {['Type', 'Examen', 'Demandé par', 'Heure', 'Résultat', 'Statut'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted-foreground)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {acts.map((act, i) => (
                <tr key={act.id} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, background: act.type === 'Biologie' ? '#ede9fe' : act.type === 'Imagerie' ? '#cffafe' : '#dcfce7', color: act.type === 'Biologie' ? '#7c3aed' : act.type === 'Imagerie' ? '#0891b2' : '#16a34a' }}>{act.type}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>
                    {act.urgent && <span style={{ color: '#dc2626', marginRight: '4px' }}>⚡</span>}
                    {act.name}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--muted-foreground)' }}>{act.requestedBy}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--muted-foreground)' }}>{act.requestedAt}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--foreground)' }}>{act.result}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, background: act.status === 'completed' ? '#dcfce7' : act.status === 'pending' ? '#fef9c3' : '#dbeafe', color: act.status === 'completed' ? '#16a34a' : act.status === 'pending' ? '#ca8a04' : 'var(--shifa-blue)' }}>
                      {act.status === 'completed' ? 'Terminé' : act.status === 'pending' ? 'En attente' : 'Planifié'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Access & NEED-TO-KNOW Tab */}
      {activeTab === 'access' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* NEED-TO-KNOW principle */}
          <div style={{ background: '#dbeafe', border: '1px solid #2563eb', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Icon name="ShieldCheckIcon" size={20} color="#1d4ed8" />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e3a8a', margin: 0 }}>Principe NEED-TO-KNOW — DPI Hôpital</h3>
            </div>
            <p style={{ fontSize: '13px', color: '#1e3a8a', lineHeight: 1.6 }}>
              Le DPI hospitalier est le point de convergence des informations médicales autorisées. Chaque module ne reçoit que les données strictement nécessaires à son fonctionnement. Aucun accès global n'est accordé automatiquement. Chaque consultation est journalisée et auditable.
            </p>
          </div>

          {/* Access matrix */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: 'var(--foreground)' }}>Matrice d'accès par rôle</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {moduleAccessMatrix.map(role => (
                <div key={role.module} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', background: 'var(--muted)', borderRadius: '8px' }}>
                  <div style={{ width: '160px', flexShrink: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: role.color, margin: 0 }}>{role.module}</p>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {role.access.map(item => (
                      <span key={item} style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, background: role.color + '20', color: role.color }}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Access log */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)' }}>Journal d'accès au DPI</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '6px', background: '#dcfce7' }}>
                <Icon name="ShieldCheckIcon" size={13} color="#16a34a" />
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#16a34a' }}>Audit complet activé</span>
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--muted)' }}>
                  {['Acteur', 'Rôle', 'Module accédé', 'Action', 'Horodatage', 'Périmètre des données', 'Statut'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {accessLog.map((log, i) => (
                  <tr key={log.id} style={{ borderTop: '1px solid var(--border)', background: !log.authorized ? '#fff1f2' : i % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>{log.actor}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--muted-foreground)' }}>{log.role}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--shifa-blue)', fontWeight: 600 }}>{log.module}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--foreground)' }}>{log.action}</td>
                    <td style={{ padding: '12px 16px', fontSize: '11px', fontFamily: 'monospace', color: 'var(--muted-foreground)' }}>{log.time}</td>
                    <td style={{ padding: '12px 16px', fontSize: '11px', color: log.authorized ? 'var(--muted-foreground)' : '#dc2626', fontStyle: 'italic' }}>{log.dataScope}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, background: log.authorized ? '#dcfce7' : '#fee2e2', color: log.authorized ? '#16a34a' : '#dc2626' }}>
                        {log.authorized ? '✓ Autorisé' : '✗ Refusé'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Discharge Tab */}
      {activeTab === 'discharge' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Préparation de la sortie</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: 'var(--foreground)' }}>Checklist de sortie</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { label: 'Compte-rendu d\'hospitalisation rédigé', done: false },
                  { label: 'Ordonnance de sortie établie', done: false },
                  { label: 'Rendez-vous de suivi planifié', done: false },
                  { label: 'Éducation patient réalisée', done: false },
                  { label: 'Dossier de sortie transmis au médecin traitant', done: false },
                  { label: 'Facturation finalisée', done: false },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'var(--muted)', borderRadius: '8px' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '4px', border: `2px solid ${item.done ? '#16a34a' : 'var(--border)'}`, background: item.done ? '#16a34a' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {item.done && <Icon name="CheckIcon" size={12} color="#fff" />}
                    </div>
                    <span style={{ fontSize: '13px', color: item.done ? 'var(--muted-foreground)' : 'var(--foreground)', textDecoration: item.done ? 'line-through' : 'none' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: 'var(--foreground)' }}>Informations de sortie</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--muted-foreground)', display: 'block', marginBottom: '4px' }}>Date de sortie prévue</label>
                  <input type="datetime-local" style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--muted-foreground)', display: 'block', marginBottom: '4px' }}>Mode de sortie</label>
                  <select style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '13px' }}>
                    <option>Retour à domicile</option>
                    <option>Transfert en SSR</option>
                    <option>Transfert inter-établissement</option>
                    <option>Décès</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--muted-foreground)', display: 'block', marginBottom: '4px' }}>Instructions de sortie</label>
                  <textarea rows={4} placeholder="Instructions pour le patient..." style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box' }} />
                </div>
                <button style={{ padding: '10px', background: 'var(--shifa-blue)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                  Valider la sortie
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
