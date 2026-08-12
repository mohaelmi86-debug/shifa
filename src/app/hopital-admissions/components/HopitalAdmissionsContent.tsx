'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

// ─── Types ───────────────────────────────────────────────────────────────────
type AdmissionStatus = 'intake' | 'triage' | 'bed_assigned' | 'insurance_verified' | 'admitted' | 'discharge_planned' | 'discharged';
type TriagePriority = 'P1' | 'P2' | 'P3' | 'P4';
type InsuranceStatus = 'pending' | 'verified' | 'rejected' | 'partial';

interface Admission {
  id: string;
  patientName: string;
  age: number;
  gender: 'M' | 'F';
  motif: string;
  triage: TriagePriority;
  status: AdmissionStatus;
  bed?: string;
  dept?: string;
  insurance: InsuranceStatus;
  insuranceName?: string;
  coverage?: number;
  admittedAt: string;
  estimatedDischarge?: string;
  physician: string;
  notes?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const admissions: Admission[] = [
  { id: 'ADM-2025-001', patientName: 'Oumar Diallo', age: 58, gender: 'M', motif: 'Douleur thoracique aiguë', triage: 'P1', status: 'admitted', bed: 'REA-03', dept: 'Réanimation', insurance: 'verified', insuranceName: 'IPRES', coverage: 80, admittedAt: '08:14', estimatedDischarge: '2025-08-17', physician: 'Dr. Ba', notes: 'Surveillance cardiaque continue' },
  { id: 'ADM-2025-002', patientName: 'Fatou Seck', age: 34, gender: 'F', motif: 'Détresse respiratoire', triage: 'P2', status: 'bed_assigned', bed: 'MED-08', dept: 'Médecine interne', insurance: 'pending', insuranceName: 'CSS', coverage: 0, admittedAt: '09:02', physician: 'Dr. Diallo' },
  { id: 'ADM-2025-003', patientName: 'Ibrahima Ndiaye', age: 72, gender: 'M', motif: 'AVC suspecté', triage: 'P2', status: 'triage', insurance: 'verified', insuranceName: 'LONASE', coverage: 70, admittedAt: '09:45', physician: 'Dr. Mbaye' },
  { id: 'ADM-2025-004', patientName: 'Mariama Ba', age: 26, gender: 'F', motif: 'Fracture membre inférieur', triage: 'P3', status: 'insurance_verified', bed: 'CHIR-14', dept: 'Chirurgie', insurance: 'verified', insuranceName: 'Mutuelle CNTS', coverage: 60, admittedAt: '10:20', estimatedDischarge: '2025-08-14', physician: 'Dr. Ndiaye' },
  { id: 'ADM-2025-005', patientName: 'Cheikh Fall', age: 45, gender: 'M', motif: 'Crise hyperglycémique', triage: 'P3', status: 'discharge_planned', bed: 'MED-22', dept: 'Médecine interne', insurance: 'partial', insuranceName: 'Privé', coverage: 40, admittedAt: '07:30', estimatedDischarge: '2025-08-11', physician: 'Dr. Diallo', notes: 'Éducation thérapeutique planifiée' },
  { id: 'ADM-2025-006', patientName: 'Aïssatou Diop', age: 19, gender: 'F', motif: 'Plaie superficielle', triage: 'P4', status: 'intake', insurance: 'pending', admittedAt: '11:05', physician: 'Dr. Sow' },
  { id: 'ADM-2025-007', patientName: 'Moussa Traoré', age: 62, gender: 'M', motif: 'Insuffisance cardiaque décompensée', triage: 'P1', status: 'admitted', bed: 'REA-07', dept: 'Réanimation', insurance: 'verified', insuranceName: 'IPRES', coverage: 80, admittedAt: '06:50', estimatedDischarge: '2025-08-20', physician: 'Dr. Ba' },
  { id: 'ADM-2025-008', patientName: 'Aminata Coulibaly', age: 29, gender: 'F', motif: 'Accouchement imminent', triage: 'P2', status: 'admitted', bed: 'MAT-05', dept: 'Maternité', insurance: 'verified', insuranceName: 'CSS', coverage: 90, admittedAt: '05:30', physician: 'Dr. Faye' },
];

const availableBeds = [
  { id: 'MED-11', dept: 'Médecine interne', type: 'Standard', equipment: ['O2', 'Monitoring'] },
  { id: 'MED-15', dept: 'Médecine interne', type: 'Standard', equipment: ['O2'] },
  { id: 'CHIR-09', dept: 'Chirurgie', type: 'Post-op', equipment: ['O2', 'Monitoring', 'Pompe'] },
  { id: 'PED-03', dept: 'Pédiatrie', type: 'Pédiatrique', equipment: ['O2'] },
  { id: 'MAT-08', dept: 'Maternité', type: 'Maternité', equipment: ['CTG', 'O2'] },
];

const triageColors: Record<TriagePriority, { bg: string; text: string; label: string }> = {
  P1: { bg: '#fee2e2', text: '#dc2626', label: 'Critique' },
  P2: { bg: '#ffedd5', text: '#ea580c', label: 'Urgent' },
  P3: { bg: '#fef9c3', text: '#ca8a04', label: 'Semi-urgent' },
  P4: { bg: '#dcfce7', text: '#16a34a', label: 'Non-urgent' },
};

const statusConfig: Record<AdmissionStatus, { label: string; color: string; icon: string }> = {
  intake: { label: 'Accueil', color: 'var(--muted-foreground)', icon: 'UserPlusIcon' },
  triage: { label: 'Triage', color: 'var(--shifa-amber)', icon: 'ClipboardDocumentListIcon' },
  bed_assigned: { label: 'Lit assigné', color: 'var(--shifa-blue)', icon: 'HomeIcon' },
  insurance_verified: { label: 'Assurance vérifiée', color: 'var(--shifa-purple)', icon: 'ShieldCheckIcon' },
  admitted: { label: 'Admis', color: 'var(--shifa-green)', icon: 'CheckCircleIcon' },
  discharge_planned: { label: 'Sortie planifiée', color: 'var(--shifa-cyan)', icon: 'CalendarDaysIcon' },
  discharged: { label: 'Sorti', color: 'var(--muted-foreground)', icon: 'ArrowRightCircleIcon' },
};

const insuranceColors: Record<InsuranceStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: '#fef9c3', text: '#ca8a04', label: 'En attente' },
  verified: { bg: '#dcfce7', text: '#16a34a', label: 'Vérifiée' },
  rejected: { bg: '#fee2e2', text: '#dc2626', label: 'Rejetée' },
  partial: { bg: '#ede9fe', text: '#7c3aed', label: 'Partielle' },
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function KPIStrip() {
  const total = admissions.length;
  const p1p2 = admissions.filter(a => a.triage === 'P1' || a.triage === 'P2').length;
  const pending = admissions.filter(a => ['intake', 'triage'].includes(a.status)).length;
  const dischargeToday = admissions.filter(a => a.status === 'discharge_planned').length;
  const insVerified = admissions.filter(a => a.insurance === 'verified').length;

  const kpis = [
    { label: 'Admissions du jour', value: total, icon: 'UserPlusIcon', color: 'var(--shifa-blue)' },
    { label: 'Priorité P1/P2', value: p1p2, icon: 'ExclamationTriangleIcon', color: 'var(--shifa-red)' },
    { label: 'En attente de lit', value: pending, icon: 'ClockIcon', color: 'var(--shifa-amber)' },
    { label: 'Sorties planifiées', value: dischargeToday, icon: 'ArrowRightCircleIcon', color: 'var(--shifa-cyan)' },
    { label: 'Assurance vérifiée', value: insVerified, icon: 'ShieldCheckIcon', color: 'var(--shifa-green)' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
      {kpis.map(k => (
        <div key={k.label} className="card-base flex items-center gap-3 p-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${k.color}18` }}>
            <Icon name={k.icon as any} size={18} style={{ color: k.color } as React.CSSProperties} className="" />
          </div>
          <div>
            <p className="text-xl font-bold leading-none" style={{ color: k.color }}>{k.value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{k.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdmissionRow({ adm, onSelect }: { adm: Admission; onSelect: (a: Admission) => void }) {
  const triage = triageColors[adm.triage];
  const status = statusConfig[adm.status];
  const ins = insuranceColors[adm.insurance];

  return (
    <tr
      className="border-b hover:bg-muted/30 cursor-pointer transition-colors"
      style={{ borderColor: 'var(--border)' }}
      onClick={() => onSelect(adm)}
    >
      <td className="px-4 py-3">
        <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{adm.patientName}</p>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{adm.age} ans · {adm.gender === 'M' ? 'Homme' : 'Femme'}</p>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm" style={{ color: 'var(--foreground)' }}>{adm.motif}</p>
        <p className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{adm.id}</p>
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: triage.bg, color: triage.text }}>
          {adm.triage} · {triage.label}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${status.color}18`, color: status.color }}>
          <Icon name={status.icon as any} size={12} />
          {status.label}
        </span>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm" style={{ color: 'var(--foreground)' }}>{adm.bed || '—'}</p>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{adm.dept || ''}</p>
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: ins.bg, color: ins.text }}>
          {ins.label}
        </span>
        {adm.coverage ? <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{adm.coverage}% couvert</p> : null}
      </td>
      <td className="px-4 py-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>{adm.admittedAt}</td>
    </tr>
  );
}

// ─── Admission Detail Panel ───────────────────────────────────────────────────
function AdmissionDetail({ adm, onClose }: { adm: Admission; onClose: () => void }) {
  const [activeSection, setActiveSection] = useState<'intake' | 'triage' | 'bed' | 'insurance' | 'discharge'>('intake');
  const triage = triageColors[adm.triage];
  const ins = insuranceColors[adm.insurance];

  const sections = [
    { key: 'intake', label: 'Accueil patient', icon: 'UserPlusIcon' },
    { key: 'triage', label: 'Triage', icon: 'ClipboardDocumentListIcon' },
    { key: 'bed', label: 'Assignation lit', icon: 'HomeIcon' },
    { key: 'insurance', label: 'Assurance', icon: 'ShieldCheckIcon' },
    { key: 'discharge', label: 'Planif. sortie', icon: 'ArrowRightCircleIcon' },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{adm.id}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: triage.bg, color: triage.text }}>{adm.triage} · {triage.label}</span>
            </div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{adm.patientName}</h2>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{adm.age} ans · {adm.gender === 'M' ? 'Homme' : 'Femme'} · Admis à {adm.admittedAt} · {adm.physician}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <Icon name="XMarkIcon" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Section tabs */}
        <div className="flex gap-1 p-3 border-b overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
          {sections.map(s => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${activeSection === s.key ? 'text-white' : 'hover:bg-muted'}`}
              style={activeSection === s.key ? { backgroundColor: 'var(--shifa-blue)', color: 'white' } : { color: 'var(--muted-foreground)' }}
            >
              <Icon name={s.icon as any} size={13} />
              {s.label}
            </button>
          ))}
        </div>

        {/* Section content */}
        <div className="p-5">
          {activeSection === 'intake' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Informations d'accueil</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Nom complet', value: adm.patientName },
                  { label: 'Âge', value: `${adm.age} ans` },
                  { label: 'Sexe', value: adm.gender === 'M' ? 'Masculin' : 'Féminin' },
                  { label: 'Motif d\'admission', value: adm.motif },
                  { label: 'Médecin référent', value: adm.physician },
                  { label: 'Heure d\'arrivée', value: adm.admittedAt },
                ].map(f => (
                  <div key={f.label} className="p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>{f.label}</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{f.value}</p>
                  </div>
                ))}
              </div>
              {adm.notes && (
                <div className="p-3 rounded-xl border-l-4" style={{ backgroundColor: 'var(--muted)', borderLeftColor: 'var(--shifa-blue)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Notes cliniques</p>
                  <p className="text-sm" style={{ color: 'var(--foreground)' }}>{adm.notes}</p>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button className="btn-primary text-sm px-4 py-2">Mettre à jour le dossier</button>
                <button className="btn-secondary text-sm px-4 py-2">Imprimer bracelet</button>
              </div>
            </div>
          )}

          {activeSection === 'triage' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Évaluation de triage</h3>
              <div className="p-4 rounded-xl border-2" style={{ borderColor: triage.text, backgroundColor: triage.bg }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-black" style={{ backgroundColor: triage.text, color: 'white' }}>{adm.triage}</div>
                  <div>
                    <p className="font-bold text-lg" style={{ color: triage.text }}>{triage.label}</p>
                    <p className="text-sm" style={{ color: triage.text }}>Priorité de prise en charge</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(['P1', 'P2', 'P3', 'P4'] as TriagePriority[]).map(p => {
                  const t = triageColors[p];
                  return (
                    <button key={p} className="p-3 rounded-xl border-2 text-left transition-all hover:scale-[1.02]" style={{ borderColor: adm.triage === p ? t.text : 'var(--border)', backgroundColor: adm.triage === p ? t.bg : 'var(--card)' }}>
                      <p className="font-bold text-sm" style={{ color: t.text }}>{p} — {t.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                        {p === 'P1' ? 'Immédiat — menace vitale' : p === 'P2' ? 'Urgent — < 20 min' : p === 'P3' ? 'Semi-urgent — < 60 min' : 'Non-urgent — > 60 min'}
                      </p>
                    </button>
                  );
                })}
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>Orientation département</label>
                <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }}>
                  <option>Réanimation</option>
                  <option>Médecine interne</option>
                  <option>Chirurgie générale</option>
                  <option>Pédiatrie</option>
                  <option>Maternité</option>
                  <option>Urgences</option>
                </select>
              </div>
              <button className="btn-primary text-sm px-4 py-2">Valider le triage</button>
            </div>
          )}

          {activeSection === 'bed' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Assignation de lit</h3>
              {adm.bed && (
                <div className="p-3 rounded-xl flex items-center gap-3" style={{ backgroundColor: '#dcfce7' }}>
                  <Icon name="CheckCircleIcon" size={20} style={{ color: '#16a34a' } as React.CSSProperties} className="" />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#16a34a' }}>Lit assigné : {adm.bed}</p>
                    <p className="text-xs" style={{ color: '#16a34a' }}>{adm.dept}</p>
                  </div>
                </div>
              )}
              <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Lits disponibles</p>
              <div className="space-y-2">
                {availableBeds.map(bed => (
                  <div key={bed.id} className="flex items-center justify-between p-3 rounded-xl border hover:border-shifa-blue transition-colors cursor-pointer" style={{ borderColor: 'var(--border)' }}>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{bed.id}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{bed.dept} · {bed.type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {bed.equipment.map(eq => (
                        <span key={eq} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{eq}</span>
                      ))}
                      <button className="btn-primary text-xs px-3 py-1.5">Assigner</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'insurance' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Vérification assurance</h3>
              <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{adm.insuranceName || 'Non renseigné'}</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: ins.bg, color: ins.text }}>{ins.label}</span>
                </div>
                {adm.coverage ? (
                  <div>
                    <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
                      <span>Taux de couverture</span>
                      <span className="font-bold" style={{ color: 'var(--foreground)' }}>{adm.coverage}%</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
                      <div className="h-2 rounded-full" style={{ width: `${adm.coverage}%`, backgroundColor: 'var(--shifa-green)' }} />
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Organisme', placeholder: 'IPRES, CSS, Mutuelle...' },
                  { label: 'N° Police', placeholder: 'Numéro de police' },
                  { label: 'N° Adhérent', placeholder: 'Numéro adhérent' },
                  { label: 'Date validité', placeholder: 'JJ/MM/AAAA' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>{f.label}</label>
                    <input className="w-full px-3 py-2 rounded-lg border text-sm" placeholder={f.placeholder} style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }} />
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
                  <Icon name="ShieldCheckIcon" size={15} />
                  Vérifier en ligne
                </button>
                <button className="btn-secondary text-sm px-4 py-2">Saisie manuelle</button>
              </div>
            </div>
          )}

          {activeSection === 'discharge' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Planification de sortie</h3>
              {adm.estimatedDischarge && (
                <div className="p-3 rounded-xl flex items-center gap-3" style={{ backgroundColor: '#ede9fe' }}>
                  <Icon name="CalendarDaysIcon" size={20} style={{ color: '#7c3aed' } as React.CSSProperties} className="" />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#7c3aed' }}>Sortie prévue le {adm.estimatedDischarge}</p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>Date de sortie prévue</label>
                  <input type="date" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }} />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>Mode de sortie</label>
                  <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }}>
                    <option>Domicile</option>
                    <option>Transfert établissement</option>
                    <option>Maison de repos</option>
                    <option>Décès</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>Instructions de sortie</label>
                <textarea rows={3} className="w-full px-3 py-2 rounded-lg border text-sm resize-none" placeholder="Médicaments, suivi, restrictions..." style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>Rendez-vous de suivi</label>
                <input type="date" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }} />
              </div>
              <div className="flex gap-2">
                <button className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
                  <Icon name="DocumentCheckIcon" size={15} />
                  Planifier la sortie
                </button>
                <button className="btn-secondary text-sm px-4 py-2">Imprimer résumé</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── New Admission Form ───────────────────────────────────────────────────────
function NewAdmissionForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl border overflow-y-auto max-h-[90vh]"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>Nouvelle admission</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <Icon name="XMarkIcon" size={18} className="text-muted-foreground" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Nom complet', placeholder: 'Prénom Nom', col: 2 },
              { label: 'Âge', placeholder: 'Âge', col: 1 },
              { label: 'Sexe', placeholder: '', col: 1, type: 'select', options: ['Masculin', 'Féminin'] },
              { label: 'Motif d\'admission', placeholder: 'Motif principal', col: 2 },
              { label: 'Médecin référent', placeholder: 'Dr. Nom', col: 1 },
              { label: 'Heure d\'arrivée', placeholder: 'HH:MM', col: 1, type: 'time' },
            ].map(f => (
              <div key={f.label} className={f.col === 2 ? 'col-span-2' : ''}>
                <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>{f.label}</label>
                {f.type === 'select' ? (
                  <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }}>
                    {f.options?.map(o => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={f.type || 'text'} className="w-full px-3 py-2 rounded-lg border text-sm" placeholder={f.placeholder} style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }} />
                )}
              </div>
            ))}
          </div>
          <div>
            <label className="text-xs font-medium block mb-2" style={{ color: 'var(--muted-foreground)' }}>Priorité de triage</label>
            <div className="grid grid-cols-4 gap-2">
              {(['P1', 'P2', 'P3', 'P4'] as TriagePriority[]).map(p => {
                const t = triageColors[p];
                return (
                  <button key={p} className="p-2 rounded-lg border-2 text-center transition-all hover:scale-[1.02]" style={{ borderColor: t.text, backgroundColor: t.bg }}>
                    <p className="font-bold text-sm" style={{ color: t.text }}>{p}</p>
                    <p className="text-xs" style={{ color: t.text }}>{t.label}</p>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button className="btn-primary flex-1 text-sm py-2.5">Créer l'admission</button>
            <button onClick={onClose} className="btn-secondary px-4 text-sm py-2.5">Annuler</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HopitalAdmissionsContent() {
  const [selectedAdm, setSelectedAdm] = useState<Admission | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<AdmissionStatus | 'all'>('all');
  const [filterTriage, setFilterTriage] = useState<TriagePriority | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = admissions.filter(a => {
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    const matchTriage = filterTriage === 'all' || a.triage === filterTriage;
    const matchSearch = !search || a.patientName.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchTriage && matchSearch;
  });

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Admissions hospitalières</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Accueil, triage, assignation de lit, assurance et planification de sortie</p>
        </div>
        <button onClick={() => setShowNewForm(true)} className="btn-primary text-sm px-4 py-2.5 flex items-center gap-2">
          <Icon name="UserPlusIcon" size={16} />
          Nouvelle admission
        </button>
      </div>

      <KPIStrip />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm"
            placeholder="Rechercher patient ou ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }}
          />
        </div>
        <select
          className="px-3 py-2 rounded-lg border text-sm"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as AdmissionStatus | 'all')}
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }}
        >
          <option value="all">Tous les statuts</option>
          {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select
          className="px-3 py-2 rounded-lg border text-sm"
          value={filterTriage}
          onChange={e => setFilterTriage(e.target.value as TriagePriority | 'all')}
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }}
        >
          <option value="all">Toutes priorités</option>
          {(['P1', 'P2', 'P3', 'P4'] as TriagePriority[]).map(p => <option key={p} value={p}>{p} — {triageColors[p].label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
                {['Patient', 'Motif / ID', 'Triage', 'Statut', 'Lit / Dept.', 'Assurance', 'Heure'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(adm => (
                <AdmissionRow key={adm.id} adm={adm} onSelect={setSelectedAdm} />
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center" style={{ color: 'var(--muted-foreground)' }}>
              <Icon name="UserGroupIcon" size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">Aucune admission trouvée</p>
            </div>
          )}
        </div>
      </div>

      {selectedAdm && <AdmissionDetail adm={selectedAdm} onClose={() => setSelectedAdm(null)} />}
      {showNewForm && <NewAdmissionForm onClose={() => setShowNewForm(false)} />}
    </div>
  );
}
