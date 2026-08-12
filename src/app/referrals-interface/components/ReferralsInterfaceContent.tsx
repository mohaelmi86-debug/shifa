'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tab = 'outgoing' | 'incoming' | 'network' | 'history';
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

const referrals: Referral[] = [
  { id: 'REF-2026-0421', patientName: 'Aïcha Diallo', patientId: 'PAT-7K4D', fromDoctor: 'Dr. Mohamed Sy', fromSpecialty: 'Médecine générale', toDoctor: 'Dr. Aminata Kouyaté', toSpecialty: 'Cardiologie', toInstitution: 'CHU Aristide Le Dantec', reason: 'Douleurs thoraciques récurrentes, ECG anormal', urgency: 'urgent', status: 'accepted', sentDate: '2026-08-08', appointmentDate: '2026-08-15', direction: 'out' },
  { id: 'REF-2026-0418', patientName: 'Oumar Ndiaye', patientId: 'PAT-3M2K', fromDoctor: 'Dr. Mohamed Sy', fromSpecialty: 'Médecine générale', toDoctor: 'Dr. Fatou Mbaye', toSpecialty: 'Pédiatrie', toInstitution: 'Hôpital Principal', reason: 'Retard de croissance, bilan nutritionnel', urgency: 'routine', status: 'scheduled', sentDate: '2026-08-06', appointmentDate: '2026-08-20', direction: 'out' },
  { id: 'REF-2026-0415', patientName: 'Mariama Ba', patientId: 'PAT-9P1R', fromDoctor: 'Dr. Mohamed Sy', fromSpecialty: 'Médecine générale', toDoctor: 'Dr. Ibrahima Diallo', toSpecialty: 'Neurologie', toInstitution: 'Clinique Pasteur', reason: 'Céphalées chroniques, IRM recommandée', urgency: 'urgent', status: 'sent', sentDate: '2026-08-09', direction: 'out' },
  { id: 'REF-2026-0410', patientName: 'Cheikh Fall', patientId: 'PAT-2L8S', fromDoctor: 'Dr. Fatou Mbaye', fromSpecialty: 'Pédiatrie', toDoctor: 'Dr. Mohamed Sy', toSpecialty: 'Médecine générale', toInstitution: 'Cabinet Dr. Sy', reason: 'Suivi post-hospitalisation, contrôle vaccins', urgency: 'routine', status: 'completed', sentDate: '2026-07-28', appointmentDate: '2026-08-05', direction: 'in' },
  { id: 'REF-2026-0408', patientName: 'Rokhaya Seck', patientId: 'PAT-5N7T', fromDoctor: 'Dr. Aminata Kouyaté', fromSpecialty: 'Cardiologie', toDoctor: 'Dr. Mohamed Sy', toSpecialty: 'Médecine générale', toInstitution: 'Cabinet Dr. Sy', reason: 'Suivi traitement antihypertenseur', urgency: 'routine', status: 'accepted', sentDate: '2026-08-07', appointmentDate: '2026-08-18', direction: 'in' },
  { id: 'REF-2026-0405', patientName: 'Lamine Diop', patientId: 'PAT-4Q6V', fromDoctor: 'Dr. Mohamed Sy', fromSpecialty: 'Médecine générale', toDoctor: 'Dr. Moussa Sarr', toSpecialty: 'Chirurgie', toInstitution: 'Clinique du Cap', reason: 'Hernie inguinale, évaluation chirurgicale', urgency: 'routine', status: 'declined', sentDate: '2026-08-01', notes: 'Spécialiste indisponible, rediriger vers CHU', direction: 'out' },
];

const specialists: SpecialistContact[] = [
  { id: 'SP001', name: 'Dr. Aminata Kouyaté', specialty: 'Cardiologie', institution: 'CHU Aristide Le Dantec', city: 'Dakar', availability: 'available', avgWait: '3 jours', referralsReceived: 47, rating: 4.8 },
  { id: 'SP002', name: 'Dr. Fatou Mbaye', specialty: 'Pédiatrie', institution: 'Hôpital Principal', city: 'Dakar', availability: 'busy', avgWait: '7 jours', referralsReceived: 62, rating: 4.9 },
  { id: 'SP003', name: 'Dr. Ibrahima Diallo', specialty: 'Neurologie', institution: 'Clinique Pasteur', city: 'Dakar', availability: 'available', avgWait: '5 jours', referralsReceived: 31, rating: 4.5 },
  { id: 'SP004', name: 'Dr. Aïssatou Ndiaye', specialty: 'Gynécologie', institution: 'Maternité Roi Baudouin', city: 'Dakar', availability: 'unavailable', avgWait: '14 jours', referralsReceived: 28, rating: 4.7 },
  { id: 'SP005', name: 'Dr. Moussa Sarr', specialty: 'Chirurgie', institution: 'Clinique du Cap', city: 'Dakar', availability: 'available', avgWait: '10 jours', referralsReceived: 19, rating: 3.9 },
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

export default function ReferralsInterfaceContent() {
  const [activeTab, setActiveTab] = useState<Tab>('outgoing');
  const [showNewForm, setShowNewForm] = useState(false);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'outgoing', label: 'Adressages sortants', icon: 'ArrowUpRightIcon' },
    { id: 'incoming', label: 'Adressages reçus', icon: 'ArrowDownLeftIcon' },
    { id: 'network', label: 'Réseau spécialistes', icon: 'UsersIcon' },
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
              Gestion des adressages patients entre professionnels et spécialistes
            </p>
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

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Adressages actifs', value: referrals.filter(r => ['sent', 'accepted', 'scheduled'].includes(r.status)).length, color: 'var(--shifa-blue)' },
            { label: 'En attente réponse', value: referrals.filter(r => r.status === 'sent').length, color: '#f59e0b' },
            { label: 'Planifiés', value: referrals.filter(r => r.status === 'scheduled').length, color: '#16a34a' },
            { label: 'Ce mois', value: referrals.length, color: '#7c3aed' },
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
        {activeTab !== 'network' ? (
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
        ) : (
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
      </div>

      {/* New referral modal */}
      {showNewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-2xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>Nouvel adressage</h2>
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
              <div className="flex gap-3">
                <button onClick={() => setShowNewForm(false)} className="flex-1 py-2 rounded-lg border text-sm font-medium hover:bg-muted" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Annuler</button>
                <button className="flex-1 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>Envoyer adressage</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
