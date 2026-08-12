'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type TabKey = 'admissions' | 'beds' | 'transfers' | 'episodes' | 'nursing' | 'medication' | 'discharge' | 'billing';

interface HospAdmission {
  id: string; patient: string; age: number; sex: 'M' | 'F'; dept: string; bed: string;
  admitDate: string; physician: string; diagnosis: string; status: 'actif' | 'transfert' | 'sortie planifiée' | 'sorti';
  insurance: string; coverage: number; days: number;
}
interface Bed {
  id: string; dept: string; type: string; status: 'libre' | 'occupé' | 'nettoyage' | 'maintenance';
  patient?: string; since?: string; equipment: string[];
}
interface Transfer {
  id: string; patient: string; fromDept: string; toDept: string; reason: string;
  requestedBy: string; requestedAt: string; status: 'demandé' | 'approuvé' | 'effectué' | 'refusé';
}
interface NursingOrder {
  id: string; patient: string; type: string; description: string; frequency: string;
  nurse: string; status: 'actif' | 'suspendu' | 'terminé'; startDate: string;
}
interface Medication {
  id: string; patient: string; drug: string; dose: string; route: string; frequency: string;
  prescribedBy: string; startDate: string; endDate?: string; status: 'actif' | 'suspendu' | 'terminé';
}
interface DischargeSummary {
  id: string; patient: string; admitDate: string; dischargeDate: string; diagnosis: string;
  procedures: string[]; physician: string; followUp: string; status: 'brouillon' | 'validé' | 'signé';
}
interface BillingItem {
  id: string; patient: string; category: string; description: string; amount: number;
  insurance: string; covered: number; patientShare: number; status: 'en attente' | 'facturé' | 'payé' | 'litige';
}

const admissions: HospAdmission[] = [
  { id: 'HSP-001', patient: 'Oumar Diallo', age: 58, sex: 'M', dept: 'Cardiologie', bed: 'CARD-04', admitDate: '08/08/2026', physician: 'Dr. Ba', diagnosis: 'Insuffisance cardiaque décompensée', status: 'actif', insurance: 'IPRES', coverage: 80, days: 3 },
  { id: 'HSP-002', patient: 'Fatou Seck', age: 34, sex: 'F', dept: 'Pneumologie', bed: 'PNEU-11', admitDate: '09/08/2026', physician: 'Dr. Ndiaye', diagnosis: 'Pneumonie communautaire sévère', status: 'actif', insurance: 'CSS', coverage: 70, days: 2 },
  { id: 'HSP-003', patient: 'Ibrahima Ba', age: 72, sex: 'M', dept: 'Neurologie', bed: 'NEUR-03', admitDate: '07/08/2026', physician: 'Dr. Diallo', diagnosis: 'AVC ischémique sylvien gauche', status: 'actif', insurance: 'LONASE', coverage: 70, days: 4 },
  { id: 'HSP-004', patient: 'Mariama Koné', age: 26, sex: 'F', dept: 'Chirurgie', bed: 'CHIR-07', admitDate: '10/08/2026', physician: 'Dr. Fall', diagnosis: 'Appendicite aiguë — appendicectomie', status: 'sortie planifiée', insurance: 'Mutuelle', coverage: 60, days: 1 },
  { id: 'HSP-005', patient: 'Cheikh Mbaye', age: 45, sex: 'M', dept: 'Médecine interne', bed: 'MED-18', admitDate: '06/08/2026', physician: 'Dr. Sow', diagnosis: 'Diabète décompensé — acidocétose', status: 'actif', insurance: 'Privé', coverage: 40, days: 5 },
  { id: 'HSP-006', patient: 'Aïssatou Diop', age: 19, sex: 'F', dept: 'Réanimation', bed: 'REA-02', admitDate: '10/08/2026', physician: 'Dr. Camara', diagnosis: 'Sepsis sévère — choc septique', status: 'actif', insurance: 'CSS', coverage: 90, days: 1 },
];

const beds: Bed[] = [
  { id: 'CARD-01', dept: 'Cardiologie', type: 'Standard', status: 'libre', equipment: ['O2', 'Monitoring ECG'] },
  { id: 'CARD-04', dept: 'Cardiologie', type: 'Standard', status: 'occupé', patient: 'Oumar Diallo', since: '08/08', equipment: ['O2', 'Monitoring ECG', 'Pompe'] },
  { id: 'PNEU-11', dept: 'Pneumologie', type: 'Standard', status: 'occupé', patient: 'Fatou Seck', since: '09/08', equipment: ['O2 haut débit', 'Spiromètre'] },
  { id: 'NEUR-03', dept: 'Neurologie', type: 'Standard', status: 'occupé', patient: 'Ibrahima Ba', since: '07/08', equipment: ['O2', 'Monitoring'] },
  { id: 'CHIR-07', dept: 'Chirurgie', type: 'Post-op', status: 'occupé', patient: 'Mariama Koné', since: '10/08', equipment: ['O2', 'Pompe analgésie'] },
  { id: 'REA-02', dept: 'Réanimation', type: 'Réanimation', status: 'occupé', patient: 'Aïssatou Diop', since: '10/08', equipment: ['Ventilateur', 'Monitoring invasif', 'Pompes x3'] },
  { id: 'REA-05', dept: 'Réanimation', type: 'Réanimation', status: 'nettoyage', equipment: ['Ventilateur', 'Monitoring invasif'] },
  { id: 'MED-22', dept: 'Médecine interne', type: 'Standard', status: 'libre', equipment: ['O2'] },
  { id: 'MED-23', dept: 'Médecine interne', type: 'Standard', status: 'maintenance', equipment: ['O2'] },
];

const transfers: Transfer[] = [
  { id: 'TRF-01', patient: 'Ibrahima Ba', fromDept: 'Urgences', toDept: 'Neurologie', reason: 'AVC confirmé — prise en charge spécialisée', requestedBy: 'Dr. Diallo', requestedAt: '07/08 09:45', status: 'effectué' },
  { id: 'TRF-02', patient: 'Aïssatou Diop', fromDept: 'Médecine interne', toDept: 'Réanimation', reason: 'Aggravation — choc septique', requestedBy: 'Dr. Camara', requestedAt: '10/08 14:20', status: 'effectué' },
  { id: 'TRF-03', patient: 'Cheikh Mbaye', fromDept: 'Médecine interne', toDept: 'Endocrinologie', reason: 'Équilibration diabète — avis spécialisé', requestedBy: 'Dr. Sow', requestedAt: '10/08 11:00', status: 'approuvé' },
  { id: 'TRF-04', patient: 'Fatou Seck', fromDept: 'Pneumologie', toDept: 'Réanimation', reason: 'Détresse respiratoire progressive', requestedBy: 'Dr. Ndiaye', requestedAt: '10/08 16:30', status: 'demandé' },
];

const nursingOrders: NursingOrder[] = [
  { id: 'NO-01', patient: 'Oumar Diallo', type: 'Surveillance', description: 'Monitoring cardiaque continu — FC, TA, SpO2 toutes les heures', frequency: 'Toutes les heures', nurse: 'Inf. Camara', status: 'actif', startDate: '08/08' },
  { id: 'NO-02', patient: 'Oumar Diallo', type: 'Soin', description: 'Pesée quotidienne — bilan entrées/sorties', frequency: 'Quotidien', nurse: 'Inf. Camara', status: 'actif', startDate: '08/08' },
  { id: 'NO-03', patient: 'Fatou Seck', type: 'Surveillance', description: 'Saturation O2 et fréquence respiratoire toutes les 2h', frequency: 'Toutes les 2h', nurse: 'Inf. Sarr', status: 'actif', startDate: '09/08' },
  { id: 'NO-04', patient: 'Ibrahima Ba', type: 'Soin', description: 'Prévention escarres — retournement toutes les 2h', frequency: 'Toutes les 2h', nurse: 'Inf. Diallo', status: 'actif', startDate: '07/08' },
  { id: 'NO-05', patient: 'Aïssatou Diop', type: 'Surveillance', description: 'Monitoring invasif continu — PA artérielle, PVC', frequency: 'Continue', nurse: 'Inf. Ba', status: 'actif', startDate: '10/08' },
  { id: 'NO-06', patient: 'Cheikh Mbaye', type: 'Prélèvement', description: 'Glycémie capillaire avant chaque repas et au coucher', frequency: '4x/jour', nurse: 'Inf. Traoré', status: 'actif', startDate: '06/08' },
];

const medications: Medication[] = [
  { id: 'MED-01', patient: 'Oumar Diallo', drug: 'Furosémide', dose: '40 mg', route: 'IV', frequency: '2x/jour', prescribedBy: 'Dr. Ba', startDate: '08/08', status: 'actif' },
  { id: 'MED-02', patient: 'Oumar Diallo', drug: 'Ramipril', dose: '5 mg', route: 'PO', frequency: '1x/jour', prescribedBy: 'Dr. Ba', startDate: '08/08', status: 'actif' },
  { id: 'MED-03', patient: 'Fatou Seck', drug: 'Amoxicilline-Acide clavulanique', dose: '1 g', route: 'IV', frequency: '3x/jour', prescribedBy: 'Dr. Ndiaye', startDate: '09/08', status: 'actif' },
  { id: 'MED-04', patient: 'Ibrahima Ba', drug: 'Aspirine', dose: '100 mg', route: 'PO', frequency: '1x/jour', prescribedBy: 'Dr. Diallo', startDate: '07/08', status: 'actif' },
  { id: 'MED-05', patient: 'Ibrahima Ba', drug: 'Héparine HBPM', dose: '4000 UI', route: 'SC', frequency: '1x/jour', prescribedBy: 'Dr. Diallo', startDate: '07/08', status: 'actif' },
  { id: 'MED-06', patient: 'Aïssatou Diop', drug: 'Noradrénaline', dose: '0.1 µg/kg/min', route: 'IV continu', frequency: 'Continue', prescribedBy: 'Dr. Camara', startDate: '10/08', status: 'actif' },
  { id: 'MED-07', patient: 'Cheikh Mbaye', drug: 'Insuline rapide', dose: 'Selon glycémie', route: 'SC', frequency: 'Selon protocole', prescribedBy: 'Dr. Sow', startDate: '06/08', status: 'actif' },
];

const dischargeSummaries: DischargeSummary[] = [
  { id: 'DS-001', patient: 'Mariama Koné', admitDate: '10/08/2026', dischargeDate: '12/08/2026', diagnosis: 'Appendicite aiguë non perforée', procedures: ['Appendicectomie cœlioscopique'], physician: 'Dr. Fall', followUp: 'Consultation chirurgie J15', status: 'brouillon' },
  { id: 'DS-002', patient: 'Moussa Traoré', admitDate: '03/08/2026', dischargeDate: '10/08/2026', diagnosis: 'Pneumonie communautaire', procedures: ['Antibiothérapie IV 7 jours'], physician: 'Dr. Ndiaye', followUp: 'Consultation pneumologie M1', status: 'signé' },
];

const billingItems: BillingItem[] = [
  { id: 'BIL-001', patient: 'Oumar Diallo', category: 'Hospitalisation', description: 'Chambre Cardiologie — 3 jours', amount: 45000, insurance: 'IPRES', covered: 36000, patientShare: 9000, status: 'en attente' },
  { id: 'BIL-002', patient: 'Oumar Diallo', category: 'Médicaments', description: 'Furosémide IV + Ramipril', amount: 8500, insurance: 'IPRES', covered: 6800, patientShare: 1700, status: 'en attente' },
  { id: 'BIL-003', patient: 'Ibrahima Ba', category: 'Actes', description: 'Scanner cérébral + IRM cérébrale', amount: 120000, insurance: 'LONASE', covered: 84000, patientShare: 36000, status: 'facturé' },
  { id: 'BIL-004', patient: 'Mariama Koné', category: 'Chirurgie', description: 'Appendicectomie cœlioscopique', amount: 85000, insurance: 'Mutuelle', covered: 51000, patientShare: 34000, status: 'payé' },
  { id: 'BIL-005', patient: 'Aïssatou Diop', category: 'Réanimation', description: 'Soins intensifs — 1 jour', amount: 95000, insurance: 'CSS', covered: 85500, patientShare: 9500, status: 'en attente' },
];

const bedStatusConfig = {
  libre: { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)', label: 'Libre' },
  occupé: { bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)', label: 'Occupé' },
  nettoyage: { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)', label: 'Nettoyage' },
  maintenance: { bg: 'rgba(156,163,175,0.15)', color: 'var(--muted-foreground)', label: 'Maintenance' },
};

const admStatusConfig: Record<string, { bg: string; color: string }> = {
  actif: { bg: 'rgba(0,102,255,0.10)', color: 'var(--shifa-blue)' },
  transfert: { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)' },
  'sortie planifiée': { bg: 'rgba(123,94,167,0.10)', color: 'var(--shifa-purple)' },
  sorti: { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' },
};

const transferStatusConfig: Record<string, { bg: string; color: string }> = {
  demandé: { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)' },
  approuvé: { bg: 'rgba(0,102,255,0.10)', color: 'var(--shifa-blue)' },
  effectué: { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' },
  refusé: { bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)' },
};

const billingStatusConfig: Record<string, { bg: string; color: string }> = {
  'en attente': { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)' },
  facturé: { bg: 'rgba(0,102,255,0.10)', color: 'var(--shifa-blue)' },
  payé: { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' },
  litige: { bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)' },
};

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'admissions', label: 'Admissions', icon: 'UserPlusIcon' },
  { key: 'beds', label: 'Lits & Chambres', icon: 'HomeIcon' },
  { key: 'transfers', label: 'Transferts', icon: 'ArrowsRightLeftIcon' },
  { key: 'episodes', label: 'Épisodes', icon: 'ClipboardDocumentListIcon' },
  { key: 'nursing', label: 'Soins infirmiers', icon: 'HeartIcon' },
  { key: 'medication', label: 'Médicaments', icon: 'BeakerIcon' },
  { key: 'discharge', label: 'Comptes rendus', icon: 'DocumentTextIcon' },
  { key: 'billing', label: 'Facturation', icon: 'CurrencyDollarIcon' },
];

const kpis = [
  { label: 'Patients hospitalisés', value: String(admissions.filter(a => a.status === 'actif').length), icon: 'UsersIcon', color: 'var(--shifa-blue)' },
  { label: 'Lits occupés', value: `${beds.filter(b => b.status === 'occupé').length}/${beds.length}`, icon: 'HomeIcon', color: 'var(--shifa-amber)' },
  { label: 'Transferts en cours', value: String(transfers.filter(t => t.status === 'demandé' || t.status === 'approuvé').length), icon: 'ArrowsRightLeftIcon', color: 'var(--shifa-purple)' },
  { label: 'Sorties planifiées', value: String(admissions.filter(a => a.status === 'sortie planifiée').length), icon: 'ArrowRightCircleIcon', color: 'var(--shifa-cyan)' },
  { label: 'Ordres infirmiers actifs', value: String(nursingOrders.filter(n => n.status === 'actif').length), icon: 'HeartIcon', color: 'var(--shifa-green)' },
  { label: 'Factures en attente', value: String(billingItems.filter(b => b.status === 'en attente').length), icon: 'CurrencyDollarIcon', color: 'var(--shifa-red)' },
];

export default function HospitalizationContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('admissions');
  const [selectedAdm, setSelectedAdm] = useState<HospAdmission | null>(null);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-purple))' }}>
              <Icon name="BuildingOffice2Icon" size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>Hospitalisation</h1>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Admissions · Lits · Soins · Sortie · Facturation</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-sm flex items-center gap-1.5 px-3 py-1.5">
              <Icon name="PrinterIcon" size={14} /> Rapport
            </button>
            <button className="btn-primary text-sm flex items-center gap-1.5 px-3 py-1.5">
              <Icon name="UserPlusIcon" size={14} /> Nouvelle admission
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="px-6 py-4 grid grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="card p-3 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <Icon name={k.icon as any} size={16} style={{ color: k.color }} />
              <span className="text-xl font-bold" style={{ color: k.color, fontFamily: 'var(--font-display)' }}>{k.value}</span>
            </div>
            <p className="text-xs leading-tight" style={{ color: 'var(--muted-foreground)' }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-6 border-b flex gap-1 overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === t.key ? 'border-[var(--shifa-blue)] text-[var(--shifa-blue)]' : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}>
            <Icon name={t.icon as any} size={14} />{t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">

        {/* ADMISSIONS */}
        {activeTab === 'admissions' && (
          <div>
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Réf.', 'Patient', 'Département / Lit', 'Diagnostic', 'Statut', 'Assurance', 'Durée', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {admissions.map((a, i) => (
                    <tr key={a.id} className="hover:bg-muted/30 cursor-pointer transition-colors" style={{ borderBottom: i < admissions.length - 1 ? '1px solid var(--border)' : 'none' }} onClick={() => setSelectedAdm(a)}>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--shifa-blue)' }}>{a.id}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium" style={{ color: 'var(--foreground)' }}>{a.patient}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{a.age} ans · {a.sex === 'M' ? 'H' : 'F'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm" style={{ color: 'var(--foreground)' }}>{a.dept}</p>
                        <p className="text-xs font-mono" style={{ color: 'var(--shifa-blue)' }}>{a.bed}</p>
                      </td>
                      <td className="px-4 py-3 text-xs max-w-[200px]" style={{ color: 'var(--foreground)' }}>{a.diagnosis}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: admStatusConfig[a.status].bg, color: admStatusConfig[a.status].color }}>{a.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{a.insurance}</p>
                        <p className="text-xs" style={{ color: 'var(--shifa-green)' }}>{a.coverage}% couvert</p>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{a.days}j</td>
                      <td className="px-4 py-3">
                        <button className="text-xs px-2 py-1 rounded-lg hover:bg-muted transition-colors" style={{ color: 'var(--shifa-blue)' }}>Voir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BEDS */}
        {activeTab === 'beds' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                {Object.entries(bedStatusConfig).map(([k, v]) => (
                  <span key={k} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: v.bg, color: v.color }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: v.color }} />
                    {v.label}: {beds.filter(b => b.status === k).length}
                  </span>
                ))}
              </div>
              <button className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Icon name="PlusIcon" size={12} /> Ajouter lit</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {beds.map(b => (
                <div key={b.id} className="card p-4 border-l-4" style={{ borderLeftColor: bedStatusConfig[b.status].color }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-sm font-mono" style={{ color: 'var(--foreground)' }}>{b.id}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{b.dept} · {b.type}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: bedStatusConfig[b.status].bg, color: bedStatusConfig[b.status].color }}>{bedStatusConfig[b.status].label}</span>
                  </div>
                  {b.patient && (
                    <div className="mt-2 p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{b.patient}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Depuis le {b.since}</p>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {b.equipment.map(eq => (
                      <span key={eq} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)' }}>{eq}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TRANSFERS */}
        {activeTab === 'transfers' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Transferts inter-départements</h3>
              <button className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Icon name="PlusIcon" size={12} /> Demander transfert</button>
            </div>
            <div className="space-y-3">
              {transfers.map(t => (
                <div key={t.id} className="card p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{t.patient}</p>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: transferStatusConfig[t.status].bg, color: transferStatusConfig[t.status].color }}>{t.status}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs mb-2">
                        <span className="px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--shifa-red)' }}>{t.fromDept}</span>
                        <Icon name="ArrowRightIcon" size={12} style={{ color: 'var(--muted-foreground)' }} />
                        <span className="px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--shifa-green)' }}>{t.toDept}</span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{t.reason}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Demandé par {t.requestedBy} · {t.requestedAt}</p>
                    </div>
                    {t.status === 'demandé' && (
                      <div className="flex gap-2 ml-4">
                        <button className="text-xs px-2.5 py-1 rounded-lg text-white" style={{ backgroundColor: 'var(--shifa-green)' }}>Approuver</button>
                        <button className="text-xs px-2.5 py-1 rounded-lg text-white" style={{ backgroundColor: 'var(--shifa-red)' }}>Refuser</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EPISODES */}
        {activeTab === 'episodes' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Épisodes d'hospitalisation en cours</h3>
            {admissions.filter(a => a.status === 'actif').map(a => (
              <div key={a.id} className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{a.id}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: admStatusConfig[a.status].bg, color: admStatusConfig[a.status].color }}>{a.status}</span>
                    </div>
                    <h4 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>{a.patient}</h4>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{a.age} ans · {a.dept} · Lit {a.bed} · {a.physician}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: 'var(--shifa-blue)', fontFamily: 'var(--font-display)' }}>{a.days}j</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Depuis {a.admitDate}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl mb-3" style={{ backgroundColor: 'var(--muted)' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>DIAGNOSTIC PRINCIPAL</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{a.diagnosis}</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 rounded-lg" style={{ backgroundColor: 'rgba(0,102,255,0.06)' }}>
                    <p className="text-lg font-bold" style={{ color: 'var(--shifa-blue)' }}>{nursingOrders.filter(n => n.patient === a.patient && n.status === 'actif').length}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Ordres infirmiers</p>
                  </div>
                  <div className="text-center p-2 rounded-lg" style={{ backgroundColor: 'rgba(123,94,167,0.06)' }}>
                    <p className="text-lg font-bold" style={{ color: 'var(--shifa-purple)' }}>{medications.filter(m => m.patient === a.patient && m.status === 'actif').length}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Médicaments actifs</p>
                  </div>
                  <div className="text-center p-2 rounded-lg" style={{ backgroundColor: 'rgba(16,185,129,0.06)' }}>
                    <p className="text-lg font-bold" style={{ color: 'var(--shifa-green)' }}>{a.coverage}%</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Couverture assurance</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NURSING ORDERS */}
        {activeTab === 'nursing' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Ordres de soins infirmiers actifs</h3>
              <button className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Icon name="PlusIcon" size={12} /> Nouvel ordre</button>
            </div>
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Réf.', 'Patient', 'Type', 'Description', 'Fréquence', 'Infirmier(e)', 'Statut'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {nursingOrders.map((n, i) => (
                    <tr key={n.id} className="hover:bg-muted/30 transition-colors" style={{ borderBottom: i < nursingOrders.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--shifa-blue)' }}>{n.id}</td>
                      <td className="px-4 py-3 font-medium text-sm" style={{ color: 'var(--foreground)' }}>{n.patient}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)' }}>{n.type}</span>
                      </td>
                      <td className="px-4 py-3 text-xs max-w-[250px]" style={{ color: 'var(--foreground)' }}>{n.description}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{n.frequency}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{n.nurse}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: n.status === 'actif' ? 'rgba(16,185,129,0.12)' : 'rgba(156,163,175,0.15)', color: n.status === 'actif' ? 'var(--shifa-green)' : 'var(--muted-foreground)' }}>{n.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MEDICATION */}
        {activeTab === 'medication' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Prescriptions médicamenteuses actives</h3>
              <button className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Icon name="PlusIcon" size={12} /> Nouvelle prescription</button>
            </div>
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Réf.', 'Patient', 'Médicament', 'Dose', 'Voie', 'Fréquence', 'Prescripteur', 'Statut'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {medications.map((m, i) => (
                    <tr key={m.id} className="hover:bg-muted/30 transition-colors" style={{ borderBottom: i < medications.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--shifa-purple)' }}>{m.id}</td>
                      <td className="px-4 py-3 font-medium text-sm" style={{ color: 'var(--foreground)' }}>{m.patient}</td>
                      <td className="px-4 py-3 font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{m.drug}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--shifa-blue)' }}>{m.dose}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.route}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.frequency}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.prescribedBy}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: m.status === 'actif' ? 'rgba(16,185,129,0.12)' : 'rgba(156,163,175,0.15)', color: m.status === 'actif' ? 'var(--shifa-green)' : 'var(--muted-foreground)' }}>{m.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DISCHARGE SUMMARIES */}
        {activeTab === 'discharge' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Comptes rendus de sortie</h3>
              <button className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Icon name="PlusIcon" size={12} /> Nouveau compte rendu</button>
            </div>
            <div className="space-y-3">
              {dischargeSummaries.map(ds => (
                <div key={ds.id} className="card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{ds.id}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: ds.status === 'signé' ? 'rgba(16,185,129,0.12)' : ds.status === 'validé' ? 'rgba(0,102,255,0.10)' : 'rgba(245,158,11,0.12)', color: ds.status === 'signé' ? 'var(--shifa-green)' : ds.status === 'validé' ? 'var(--shifa-blue)' : 'var(--shifa-amber)' }}>{ds.status}</span>
                      </div>
                      <h4 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>{ds.patient}</h4>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{ds.admitDate} → {ds.dischargeDate} · {ds.physician}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-xs px-2.5 py-1 rounded-lg hover:bg-muted transition-colors" style={{ color: 'var(--shifa-blue)' }}>Modifier</button>
                      <button className="text-xs px-2.5 py-1 rounded-lg hover:bg-muted transition-colors" style={{ color: 'var(--shifa-green)' }}>Signer</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>DIAGNOSTIC</p>
                      <p className="text-sm" style={{ color: 'var(--foreground)' }}>{ds.diagnosis}</p>
                    </div>
                    <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>SUIVI</p>
                      <p className="text-sm" style={{ color: 'var(--foreground)' }}>{ds.followUp}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>ACTES RÉALISÉS</p>
                    <div className="flex flex-wrap gap-1">
                      {ds.procedures.map(p => (
                        <span key={p} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(123,94,167,0.10)', color: 'var(--shifa-purple)' }}>{p}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BILLING */}
        {activeTab === 'billing' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold" style={{ color: 'var(--shifa-blue)', fontFamily: 'var(--font-display)' }}>
                    {billingItems.reduce((s, b) => s + b.amount, 0).toLocaleString()} FCFA
                  </p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Total facturé</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold" style={{ color: 'var(--shifa-green)', fontFamily: 'var(--font-display)' }}>
                    {billingItems.reduce((s, b) => s + b.covered, 0).toLocaleString()} FCFA
                  </p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Pris en charge</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold" style={{ color: 'var(--shifa-amber)', fontFamily: 'var(--font-display)' }}>
                    {billingItems.reduce((s, b) => s + b.patientShare, 0).toLocaleString()} FCFA
                  </p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Part patient</p>
                </div>
              </div>
              <button className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Icon name="PlusIcon" size={12} /> Ajouter ligne</button>
            </div>
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Réf.', 'Patient', 'Catégorie', 'Description', 'Montant', 'Assurance', 'Part patient', 'Statut'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {billingItems.map((b, i) => (
                    <tr key={b.id} className="hover:bg-muted/30 transition-colors" style={{ borderBottom: i < billingItems.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--shifa-blue)' }}>{b.id}</td>
                      <td className="px-4 py-3 font-medium text-sm" style={{ color: 'var(--foreground)' }}>{b.patient}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)' }}>{b.category}</span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--foreground)' }}>{b.description}</td>
                      <td className="px-4 py-3 font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{b.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'var(--shifa-green)' }}>{b.covered.toLocaleString()}</td>
                      <td className="px-4 py-3 font-semibold text-sm" style={{ color: 'var(--shifa-amber)' }}>{b.patientShare.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: billingStatusConfig[b.status].bg, color: billingStatusConfig[b.status].color }}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Admission Detail Modal */}
      {selectedAdm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelectedAdm(null)}>
          <div className="w-full max-w-lg rounded-2xl shadow-2xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{selectedAdm.id}</span>
                <h3 className="text-lg font-bold mt-1" style={{ color: 'var(--foreground)' }}>{selectedAdm.patient}</h3>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{selectedAdm.age} ans · {selectedAdm.dept} · {selectedAdm.bed}</p>
              </div>
              <button onClick={() => setSelectedAdm(null)} className="p-2 rounded-lg hover:bg-muted transition-colors"><Icon name="XMarkIcon" size={18} className="text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>DIAGNOSTIC</p>
                <p className="text-sm" style={{ color: 'var(--foreground)' }}>{selectedAdm.diagnosis}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>MÉDECIN</p>
                  <p className="text-sm" style={{ color: 'var(--foreground)' }}>{selectedAdm.physician}</p>
                </div>
                <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>ASSURANCE</p>
                  <p className="text-sm" style={{ color: 'var(--foreground)' }}>{selectedAdm.insurance} · {selectedAdm.coverage}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
