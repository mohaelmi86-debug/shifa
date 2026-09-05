'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tab = 'outgoing' | 'incoming' | 'network' | 'secure' | 'history';
type RefStatus = 'draft' | 'sent' | 'accepted' | 'scheduled' | 'completed' | 'declined';

interface Referral {
  id: string;
  patientName: string;
  patientId: string;
  fromDoctor: string;
  fromSpecialty: string;
  toDoctor: string;
  toSpecialty: string;
  toInstitution: string;
  reason: string;
  urgency: 'routine' | 'urgent' | 'emergency';
  status: RefStatus;
  sentDate: string;
  appointmentDate?: string;
  notes?: string;
  direction: 'out' | 'in';
  dataShared?: string[];
}

interface SpecialistContact {
  id: string;
  name: string;
  specialty: string;
  institution: string;
  city: string;
  availability: 'available' | 'busy' | 'unavailable';
  avgWait: string;
  referralsReceived: number;
  rating: number;
}

interface SecureShare {
  id: string;
  patient: string;
  sharedWith: string;
  sharedBy: string;
  dataScope: string[];
  createdAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'revoked';
  accessCount: number;
  consentObtained: boolean;
}

const referrals: Referral[] = [
  { id: 'REF-2026-0421', patientName: 'Aïcha Diallo', patientId: 'PAT-7K4D', fromDoctor: 'Dr. Mohamed Sy', fromSpecialty: 'Médecine générale', toDoctor: 'Dr. Aminata Kouyaté', toSpecialty: 'Cardiologie', toInstitution: 'CHU Aristide Le Dantec', reason: 'Douleurs thoraciques récurrentes, ECG anormal', urgency: 'urgent', status: 'accepted', sentDate: '2026-08-08', appointmentDate: '2026-08-15', direction: 'out', dataShared: ['Résumé clinique', 'ECG', 'Constantes'] },
  { id: 'REF-2026-0418', patientName: 'Oumar Ndiaye', patientId: 'PAT-3M2K', fromDoctor: 'Dr. Mohamed Sy', fromSpecialty: 'Médecine générale', toDoctor: 'Dr. Fatou Mbaye', toSpecialty: 'Pédiatrie', toInstitution: 'Hôpital Principal', reason: 'Retard de croissance, bilan nutritionnel', urgency: 'routine', status: 'scheduled', sentDate: '2026-08-06', appointmentDate: '2026-08-20', direction: 'out', dataShared: ['Résumé clinique', 'Courbe de croissance'] },
  { id: 'REF-2026-0415', patientName: 'Mariama Ba', patientId: 'PAT-9P1R', fromDoctor: 'Dr. Mohamed Sy', fromSpecialty: 'Médecine générale', toDoctor: 'Dr. Ibrahima Diallo', toSpecialty: 'Neurologie', toInstitution: 'Clinique Pasteur', reason: 'Céphalées chroniques, IRM recommandée', urgency: 'urgent', status: 'sent', sentDate: '2026-08-09', direction: 'out', dataShared: ['Résumé clinique', 'Antécédents'] },
  { id: 'REF-2026-0410', patientName: 'Cheikh Fall', patientId: 'PAT-2L8S', fromDoctor: 'Dr. Fatou Mbaye', fromSpecialty: 'Pédiatrie', toDoctor: 'Dr. Mohamed Sy', toSpecialty: 'Médecine générale', toInstitution: 'Cabinet Dr. Sy', reason: 'Suivi post-hospitalisation, contrôle vaccins', urgency: 'routine', status: 'completed', sentDate: '2026-07-28', appointmentDate: '2026-08-05', direction: 'in', dataShared: ['Compte-rendu hospitalisation', 'Carnet vaccinal'] },
  { id: 'REF-2026-0408', patientName: 'Rokhaya Seck', patientId: 'PAT-5N7T', fromDoctor: 'Dr. Aminata Kouyaté', fromSpecialty: 'Cardiologie', toDoctor: 'Dr. Mohamed Sy', toSpecialty: 'Médecine générale', toInstitution: 'Cabinet Dr. Sy', reason: 'Suivi traitement antihypertenseur', urgency: 'routine', status: 'accepted', sentDate: '2026-08-07', appointmentDate: '2026-08-18', direction: 'in', dataShared: ['Résumé cardiologique', 'Prescriptions'] },
  { id: 'REF-2026-0405', patientName: 'Lamine Diop', patientId: 'PAT-4Q6V', fromDoctor: 'Dr. Mohamed Sy', fromSpecialty: 'Médecine générale', toDoctor: 'Dr. Moussa Sarr', toSpecialty: 'Chirurgie', toInstitution: 'Clinique du Cap', reason: 'Hernie inguinale, évaluation chirurgicale', urgency: 'routine', status: 'declined', sentDate: '2026-08-01', notes: 'Spécialiste indisponible, rediriger vers CHU', direction: 'out', dataShared: ['Résumé clinique'] },
];

const specialists: SpecialistContact[] = [
  { id: 'SP001', name: 'Dr. Aminata Kouyaté', specialty: 'Cardiologie', institution: 'CHU Aristide Le Dantec', city: 'Dakar', availability: 'available', avgWait: '3 jours', referralsReceived: 47, rating: 4.8 },
  { id: 'SP002', name: 'Dr. Fatou Mbaye', specialty: 'Pédiatrie', institution: 'Hôpital Principal', city: 'Dakar', availability: 'busy', avgWait: '7 jours', referralsReceived: 62, rating: 4.9 },
  { id: 'SP003', name: 'Dr. Ibrahima Diallo', specialty: 'Neurologie', institution: 'Clinique Pasteur', city: 'Dakar', availability: 'available', avgWait: '5 jours', referralsReceived: 31, rating: 4.5 },
  { id: 'SP004', name: 'Dr. Aïssatou Ndiaye', specialty: 'Gynécologie', institution: 'Maternité Roi Baudouin', city: 'Dakar', availability: 'unavailable', avgWait: '14 jours', referralsReceived: 28, rating: 4.7 },
  { id: 'SP005', name: 'Dr. Moussa Sarr', specialty: 'Chirurgie', institution: 'Clinique du Cap', city: 'Dakar', availability: 'available', avgWait: '10 jours', referralsReceived: 19, rating: 3.9 },
];

const secureShares: SecureShare[] = [
  { id: 'SS-001', patient: 'Aïcha Diallo', sharedWith: 'Dr. Aminata Kouyaté (Cardiologie)', sharedBy: 'Dr. Mohamed Sy', dataScope: ['Résumé clinique', 'ECG', 'Constantes'], createdAt: '2026-08-08 10:30', expiresAt: '2026-08-22 23:59', status: 'active', accessCount: 2, consentObtained: true },
  { id: 'SS-002', patient: 'Mariama Ba', sharedWith: 'Dr. Ibrahima Diallo (Neurologie)', sharedBy: 'Dr. Mohamed Sy', dataScope: ['Résumé clinique', 'Antécédents'], createdAt: '2026-08-09 14:00', expiresAt: '2026-08-23 23:59', status: 'active', accessCount: 0, consentObtained: true },
  { id: 'SS-003', patient: 'Cheikh Fall', sharedWith: 'Dr. Mohamed Sy (Médecine générale)', sharedBy: 'Dr. Fatou Mbaye', dataScope: ['Compte-rendu hospitalisation', 'Carnet vaccinal'], createdAt: '2026-07-28 09:00', expiresAt: '2026-08-11 23:59', status: 'expired', accessCount: 3, consentObtained: true },
  { id: 'SS-004', patient: 'Rokhaya Seck', sharedWith: 'Dr. Mohamed Sy (Médecine générale)', sharedBy: 'Dr. Aminata Kouyaté', dataScope: ['Résumé cardiologique', 'Prescriptions'], createdAt: '2026-08-07 11:00', expiresAt: '2026-08-21 23:59', status: 'active', accessCount: 1, consentObtained: true },
];

const statusConfig: Record<RefStatus, { label: string; bg: string; text: string }> = {
  draft: { label: 'Brouillon', bg: '#f1f5f9', text: '#64748b' },
  sent: { label: 'Envoyée', bg: '#dbeafe', text: '#1d4ed8' },
  accepted: { label: 'Acceptée', bg: '#dcfce7', text: '#16a34a' },
  scheduled: { label: 'Planifiée', bg: '#d1fae5', text: '#059669' },
  completed: { label: 'Terminée', bg: '#f0fdf4', text: '#15803d' },
  declined: { label: 'Refusée', bg: '#fee2e2', text: '#dc2626' },
};

const urgencyConfig = {
  routine: { label: 'Routine', color: '#64748b' },
  urgent: { label: 'Urgent', color: '#f59e0b' },
  emergency: { label: 'Urgence', color: '#dc2626' },
};

const availConfig = {
  available: { label: 'Disponible', color: '#16a34a', bg: '#dcfce7' },
  busy: { label: 'Occupé', color: '#ca8a04', bg: '#fef9c3' },
  unavailable: { label: 'Indisponible', color: '#dc2626', bg: '#fee2e2' },
};

const shareStatusConfig = {
  active: { label: 'Actif', color: '#16a34a', bg: '#dcfce7', icon: 'CheckCircleIcon' },
  expired: { label: 'Expiré', color: '#64748b', bg: '#f1f5f9', icon: 'ClockIcon' },
  revoked: { label: 'Révoqué', color: '#dc2626', bg: '#fee2e2', icon: 'XCircleIcon' },
};

export default function ReferralsInterfaceContent() {
  const [activeTab, setActiveTab] = useState<Tab>('outgoing');
  const [showNewForm, setShowNewForm] = useState(false);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'outgoing', label: 'Adressages sortants', icon: 'ArrowUpRightIcon' },
    { id: 'incoming', label: 'Adressages reçus', icon: 'ArrowDownLeftIcon' },
    { id: 'network', label: 'Réseau spécialistes', icon: 'UsersIcon' },
    { id: 'secure', label: 'Partages sécurisés', icon: 'LockClosedIcon' },
    { id: 'history', label: 'Historique complet', icon: 'ClipboardDocumentListIcon' },
  ];

  const outgoing = referrals.filter(r => r.direction === 'out');
  const incoming = referrals.filter(r => r.direction === 'in');
  const all = referrals;

  const displayList = activeTab === 'outgoing' ? outgoing : activeTab === 'incoming' ? incoming : all;

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>
              Adressages & Références
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
              Réseau de soins sécurisé — partage contrôlé, traçable et consenti
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}>
              <Icon name="ShieldCheckIcon" size={12} />
              Partage sécurisé SHIFA
            </div>
            <button
              onClick={() => setShowNewForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: 'var(--shifa-blue)' }}
            >
              <Icon name="PlusIcon" size={16} />
              Nouvel adressage
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Adressages actifs', value: referrals.filter(r => ['sent', 'accepted', 'scheduled'].includes(r.status)).length, color: 'var(--shifa-blue)' },
            { label: 'En attente réponse', value: referrals.filter(r => r.status === 'sent').length, color: '#f59e0b' },
            { label: 'Planifiés', value: referrals.filter(r => r.status === 'scheduled').length, color: '#16a34a' },
            { label: 'Partages actifs', value: secureShares.filter(s => s.status === 'active').length, color: '#7c3aed' },
          ].map((kpi, i) => (
            <div key={i} className="rounded-lg p-3 border" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
              <p className="text-xl font-bold" style={{ color: kpi.color, fontFamily: 'var(--font-display)' }}>{kpi.value}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-white' : 'hover:bg-muted'}`}
              style={activeTab === tab.id ? { backgroundColor: 'var(--shifa-blue)' } : { color: 'var(--muted-foreground)' }}
            >
              <Icon name={tab.icon as any} size={15} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Referral list tabs */}
        {(activeTab === 'outgoing' || activeTab === 'incoming' || activeTab === 'history') && (
          <div className="space-y-3">
            {displayList.map(ref => {
              const scfg = statusConfig[ref.status];
              const ucfg = urgencyConfig[ref.urgency];
              return (
                <div key={ref.id} className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: ref.direction === 'out' ? '#dbeafe' : '#dcfce7' }}>
                        <Icon name={ref.direction === 'out' ? 'ArrowUpRightIcon' : 'ArrowDownLeftIcon'} size={18} style={{ color: ref.direction === 'out' ? '#1d4ed8' : '#16a34a' }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>{ref.id}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: scfg.bg, color: scfg.text }}>{scfg.label}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: ucfg.color + '20', color: ucfg.color }}>{ucfg.label}</span>
                        </div>
                        <h3 className="font-semibold mt-1" style={{ color: 'var(--foreground)' }}>{ref.patientName}</h3>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{ref.reason}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1.5">
                            <Icon name="UserIcon" size={12} className="text-muted-foreground" />
                            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{ref.fromDoctor} ({ref.fromSpecialty})</span>
                          </div>
                          <Icon name="ArrowRightIcon" size={12} className="text-muted-foreground" />
                          <div className="flex items-center gap-1.5">
                            <Icon name="UserIcon" size={12} className="text-muted-foreground" />
                            <span className="text-xs" style={{ color: 'var(--foreground)' }}>{ref.toDoctor} ({ref.toSpecialty})</span>
                          </div>
                        </div>
                        <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{ref.toInstitution}</p>
                        {/* Data shared */}
                        {ref.dataShared && (
                          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                            <Icon name="LockClosedIcon" size={11} style={{ color: '#7c3aed' }} />
                            <span className="text-xs" style={{ color: '#7c3aed' }}>Données partagées :</span>
                            {ref.dataShared.map(d => (
                              <span key={d} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}>{d}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Envoyé le {ref.sentDate}</p>
                      {ref.appointmentDate && (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ backgroundColor: '#dcfce7' }}>
                          <Icon name="CalendarDaysIcon" size={12} style={{ color: '#16a34a' }} />
                          <span className="text-xs font-medium" style={{ color: '#16a34a' }}>RDV: {ref.appointmentDate}</span>
                        </div>
                      )}
                      {ref.notes && (
                        <p className="text-xs max-w-48 text-right" style={{ color: '#dc2626' }}>{ref.notes}</p>
                      )}
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded-lg border text-xs font-medium hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                          Voir détails
                        </button>
                        {ref.status === 'sent' && (
                          <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                            Relancer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Network tab */}
        {activeTab === 'network' && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input placeholder="Rechercher spécialiste..." className="w-full pl-9 pr-4 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              </div>
            </div>
            {specialists.map(sp => {
              const acfg = availConfig[sp.availability];
              return (
                <div key={sp.id} className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                        {sp.name.split(' ').map(n => n[0]).slice(1, 3).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>{sp.name}</h3>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: acfg.bg, color: acfg.color }}>{acfg.label}</span>
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{sp.specialty} · {sp.institution}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{sp.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{sp.avgWait}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Délai moyen</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{sp.referralsReceived}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Adressages reçus</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(s => <Icon key={s} name="StarIcon" size={12} style={{ color: s <= Math.round(sp.rating) ? '#f59e0b' : 'var(--muted)' }} />)}
                          <span className="text-xs font-medium ml-1" style={{ color: 'var(--foreground)' }}>{sp.rating}</span>
                        </div>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Note</p>
                      </div>
                      <button className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: sp.availability === 'unavailable' ? 'var(--muted-foreground)' : 'var(--shifa-blue)' }} disabled={sp.availability === 'unavailable'}>
                        Adresser
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Secure shares tab */}
        {activeTab === 'secure' && (
          <div className="space-y-5">
            {/* Security notice */}
            <div className="rounded-xl border p-4" style={{ backgroundColor: '#dbeafe', borderColor: '#2563eb' }}>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="ShieldCheckIcon" size={16} style={{ color: '#1d4ed8' }} />
                <h3 className="font-semibold text-sm" style={{ color: '#1e3a8a' }}>Règle absolue — Partage de données médicales</h3>
              </div>
              <p className="text-xs" style={{ color: '#1e3a8a' }}>
                Les données médicales (dossier, ordonnance, résultats, imagerie) ne peuvent JAMAIS être partagées sur les réseaux sociaux. Seul le partage sécurisé SHIFA est autorisé. Chaque partage est limité dans le temps, consenti, traçable et révocable.
              </p>
            </div>

            {/* Share KPIs */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Partages actifs', value: secureShares.filter(s => s.status === 'active').length, color: '#16a34a', bg: '#dcfce7', icon: 'LockClosedIcon' },
                { label: 'Expirés', value: secureShares.filter(s => s.status === 'expired').length, color: '#64748b', bg: '#f1f5f9', icon: 'ClockIcon' },
                { label: 'Révoqués', value: secureShares.filter(s => s.status === 'revoked').length, color: '#dc2626', bg: '#fee2e2', icon: 'XCircleIcon' },
              ].map(kpi => (
                <div key={kpi.label} className="rounded-xl border p-4 flex items-center gap-3" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: kpi.bg }}>
                    <Icon name={kpi.icon as any} size={20} style={{ color: kpi.color }} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Active shares */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Partages sécurisés SHIFA</h3>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                  <Icon name="PlusIcon" size={13} />
                  Nouveau partage sécurisé
                </button>
              </div>
              {secureShares.map(share => {
                const sc = shareStatusConfig[share.status];
                return (
                  <div key={share.id} className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#ede9fe' }}>
                          <Icon name="LockClosedIcon" size={18} style={{ color: '#7c3aed' }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>{share.id}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: sc.bg, color: sc.color }}>{sc.label}</span>
                            {share.consentObtained && (
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>✓ Consentement</span>
                            )}
                          </div>
                          <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>{share.patient}</h3>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                            Partagé par <span className="font-medium" style={{ color: 'var(--foreground)' }}>{share.sharedBy}</span> avec <span className="font-medium" style={{ color: 'var(--shifa-blue)' }}>{share.sharedWith}</span>
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {share.dataScope.map(d => (
                              <span key={d} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}>{d}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="text-right">
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Créé : {share.createdAt}</p>
                          <p className="text-xs" style={{ color: share.status === 'expired' ? '#dc2626' : 'var(--muted-foreground)' }}>Expire : {share.expiresAt}</p>
                          <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{share.accessCount} accès enregistré{share.accessCount > 1 ? 's' : ''}</p>
                        </div>
                        {share.status === 'active' && (
                          <button className="px-3 py-1.5 rounded-lg border text-xs font-medium" style={{ borderColor: '#dc2626', color: '#dc2626' }}>
                            Révoquer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Audit trail for shares */}
            <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Règles de partage SHIFA</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { rule: 'Consentement patient obligatoire', icon: 'DocumentCheckIcon', ok: true },
                  { rule: 'Données médicales jamais sur réseaux sociaux', icon: 'ShieldCheckIcon', ok: true },
                  { rule: 'Expiration automatique configurable', icon: 'ClockIcon', ok: true },
                  { rule: 'Révocation possible à tout moment', icon: 'XCircleIcon', ok: true },
                  { rule: 'Historique d\'accès complet', icon: 'ClipboardDocumentListIcon', ok: true },
                  { rule: 'Chiffrement bout-en-bout', icon: 'LockClosedIcon', ok: true },
                  { rule: 'Notification au patient', icon: 'BellIcon', ok: true },
                  { rule: 'Minimisation des données partagées', icon: 'FunnelIcon', ok: true },
                ].map(rule => (
                  <div key={rule.rule} className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: '#dcfce7' }}>
                    <Icon name={rule.icon as any} size={14} style={{ color: '#16a34a' }} />
                    <span className="text-xs font-medium" style={{ color: '#15803d' }}>{rule.rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New referral modal */}
      {showNewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-2xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>Nouvel adressage sécurisé</h2>
              <button onClick={() => setShowNewForm(false)} className="p-1.5 rounded-lg hover:bg-muted">
                <Icon name="XMarkIcon" size={18} className="text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--muted-foreground)' }}>Patient</label>
                <input placeholder="Rechercher patient..." className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--muted-foreground)' }}>Spécialité cible</label>
                  <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                    <option>Cardiologie</option>
                    <option>Neurologie</option>
                    <option>Pédiatrie</option>
                    <option>Chirurgie</option>
                    <option>Gynécologie</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--muted-foreground)' }}>Urgence</label>
                  <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                    <option>Routine</option>
                    <option>Urgent</option>
                    <option>Urgence</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--muted-foreground)' }}>Motif de l'adressage</label>
                <textarea rows={3} placeholder="Décrire le motif clinique..." className="w-full px-3 py-2 rounded-lg border text-sm resize-none" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--muted-foreground)' }}>Données à partager (NEED-TO-KNOW)</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Résumé clinique', 'Résultats biologiques', 'Imagerie', 'Prescriptions', 'Constantes', 'Antécédents'].map(d => (
                    <label key={d} className="flex items-center gap-2 text-xs cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span style={{ color: 'var(--foreground)' }}>{d}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: '#fef3c7' }}>
                <Icon name="ShieldCheckIcon" size={14} style={{ color: '#d97706' }} />
                <span className="text-xs" style={{ color: '#92400e' }}>Le consentement du patient sera requis avant l'envoi</span>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowNewForm(false)} className="flex-1 py-2 rounded-lg border text-sm font-medium hover:bg-muted" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Annuler</button>
                <button className="flex-1 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>Envoyer adressage sécurisé</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
