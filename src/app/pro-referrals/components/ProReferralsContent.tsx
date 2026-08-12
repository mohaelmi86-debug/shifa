'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type TabKey = 'outgoing' | 'incoming' | 'certificates' | 'network' | 'history';
type Urgency = 'routine' | 'urgent' | 'emergency';
type RefStatus = 'draft' | 'sent' | 'accepted' | 'scheduled' | 'completed' | 'declined';

interface Referral {
  id: string;
  patientName: string;
  patientId: string;
  toDoctor: string;
  toSpecialty: string;
  toInstitution: string;
  reason: string;
  urgency: Urgency;
  status: RefStatus;
  sentDate: string;
  appointmentDate?: string;
  direction: 'out' | 'in';
}

interface Certificate {
  id: string;
  patientName: string;
  type: string;
  issuedDate: string;
  validUntil?: string;
  status: 'issued' | 'pending' | 'expired';
  purpose: string;
}

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'outgoing', label: 'Adressages émis', icon: 'ArrowUpRightIcon' },
  { key: 'incoming', label: 'Adressages reçus', icon: 'ArrowDownLeftIcon' },
  { key: 'certificates', label: 'Certificats médicaux', icon: 'DocumentCheckIcon' },
  { key: 'network', label: 'Réseau spécialistes', icon: 'UsersIcon' },
  { key: 'history', label: 'Historique', icon: 'ClockIcon' },
];

const referrals: Referral[] = [
  { id: 'REF-2026-0421', patientName: 'Aïcha Diallo', patientId: 'PAT-7K4D', toDoctor: 'Dr. Aminata Kouyaté', toSpecialty: 'Cardiologie', toInstitution: 'CHU Aristide Le Dantec', reason: 'Douleurs thoraciques récurrentes, ECG anormal', urgency: 'urgent', status: 'accepted', sentDate: '08/08/2026', appointmentDate: '15/08/2026', direction: 'out' },
  { id: 'REF-2026-0418', patientName: 'Oumar Ndiaye', patientId: 'PAT-3M2K', toDoctor: 'Dr. Fatou Mbaye', toSpecialty: 'Pédiatrie', toInstitution: 'Hôpital Principal', reason: 'Retard de croissance, bilan nutritionnel', urgency: 'routine', status: 'scheduled', sentDate: '06/08/2026', appointmentDate: '20/08/2026', direction: 'out' },
  { id: 'REF-2026-0415', patientName: 'Mariama Ba', patientId: 'PAT-9P1R', toDoctor: 'Dr. Ibrahima Diallo', toSpecialty: 'Neurologie', toInstitution: 'Clinique Pasteur', reason: 'Céphalées chroniques, IRM recommandée', urgency: 'urgent', status: 'sent', sentDate: '09/08/2026', direction: 'out' },
  { id: 'REF-2026-0412', patientName: 'Lamine Diop', patientId: 'PAT-4Q6V', toDoctor: 'Dr. Moussa Sarr', toSpecialty: 'Chirurgie', toInstitution: 'Clinique du Cap', reason: 'Hernie inguinale, évaluation chirurgicale', urgency: 'routine', status: 'declined', sentDate: '01/08/2026', direction: 'out' },
  { id: 'REF-2026-0410', patientName: 'Cheikh Fall', patientId: 'PAT-2L8S', toDoctor: 'Dr. Mohamed Sy', toSpecialty: 'Médecine générale', toInstitution: 'Cabinet Dr. Sy', reason: 'Suivi post-hospitalisation', urgency: 'routine', status: 'completed', sentDate: '28/07/2026', appointmentDate: '05/08/2026', direction: 'in' },
  { id: 'REF-2026-0408', patientName: 'Rokhaya Seck', patientId: 'PAT-5N7T', toDoctor: 'Dr. Mohamed Sy', toSpecialty: 'Médecine générale', toInstitution: 'Cabinet Dr. Sy', reason: 'Suivi traitement antihypertenseur', urgency: 'routine', status: 'accepted', sentDate: '07/08/2026', appointmentDate: '18/08/2026', direction: 'in' },
];

const certificates: Certificate[] = [
  { id: 'CERT-2026-0145', patientName: 'Aïcha Diallo', type: 'Certificat médical de repos', issuedDate: '10/08/2026', validUntil: '17/08/2026', status: 'issued', purpose: 'Arrêt de travail 7 jours' },
  { id: 'CERT-2026-0144', patientName: 'Oumar Ndiaye', type: 'Certificat de non contre-indication sportive', issuedDate: '08/08/2026', validUntil: '08/08/2027', status: 'issued', purpose: 'Pratique du football' },
  { id: 'CERT-2026-0143', patientName: 'Mariama Ba', type: 'Certificat médical initial', issuedDate: '07/08/2026', status: 'issued', purpose: 'Constatation de blessure' },
  { id: 'CERT-2026-0142', patientName: 'Lamine Diop', type: 'Certificat de bonne santé', issuedDate: '05/08/2026', validUntil: '05/08/2027', status: 'issued', purpose: 'Emploi' },
  { id: 'CERT-2026-0141', patientName: 'Rokhaya Seck', type: 'Certificat médical de repos', issuedDate: '01/07/2026', validUntil: '08/07/2026', status: 'expired', purpose: 'Arrêt de travail' },
  { id: 'CERT-2026-0140', patientName: 'Cheikh Fall', type: 'Certificat de vaccination', issuedDate: '28/06/2026', validUntil: '28/06/2027', status: 'issued', purpose: 'Voyage international' },
];

const specialists = [
  { name: 'Dr. Aminata Kouyaté', specialty: 'Cardiologie', institution: 'CHU Aristide Le Dantec', availability: 'available', avgWait: '3 jours', rating: 4.8, referrals: 47 },
  { name: 'Dr. Fatou Mbaye', specialty: 'Pédiatrie', institution: 'Hôpital Principal', availability: 'busy', avgWait: '7 jours', rating: 4.9, referrals: 62 },
  { name: 'Dr. Ibrahima Diallo', specialty: 'Neurologie', institution: 'Clinique Pasteur', availability: 'available', avgWait: '5 jours', rating: 4.5, referrals: 31 },
  { name: 'Dr. Moussa Sarr', specialty: 'Chirurgie générale', institution: 'Clinique du Cap', availability: 'unavailable', avgWait: '14 jours', rating: 4.6, referrals: 28 },
  { name: 'Dr. Seynabou Diop', specialty: 'Ophtalmologie', institution: 'Institut d\'Ophtalmologie', availability: 'available', avgWait: '4 jours', rating: 4.7, referrals: 55 },
  { name: 'Dr. Alioune Ndiaye', specialty: 'Dermatologie', institution: 'Clinique Pasteur', availability: 'available', avgWait: '2 jours', rating: 4.4, referrals: 39 },
];

const urgencyConfig: Record<Urgency, { label: string; bg: string; color: string }> = {
  routine: { label: 'Routine', bg: '#dbeafe', color: '#1d4ed8' },
  urgent: { label: 'Urgent', bg: '#fef3c7', color: '#b45309' },
  emergency: { label: 'Urgence', bg: '#fee2e2', color: '#dc2626' },
};

const statusConfig: Record<RefStatus, { label: string; bg: string; color: string }> = {
  draft: { label: 'Brouillon', bg: '#f3f4f6', color: '#6b7280' },
  sent: { label: 'Envoyé', bg: '#dbeafe', color: '#1d4ed8' },
  accepted: { label: 'Accepté', bg: '#d1fae5', color: '#065f46' },
  scheduled: { label: 'Planifié', bg: '#ede9fe', color: '#5b21b6' },
  completed: { label: 'Complété', bg: '#dcfce7', color: '#16a34a' },
  declined: { label: 'Refusé', bg: '#fee2e2', color: '#dc2626' },
};

const certStatusConfig: Record<string, { label: string; bg: string; color: string }> = {
  issued: { label: 'Émis', bg: '#dcfce7', color: '#16a34a' },
  pending: { label: 'En attente', bg: '#fef9c3', color: '#ca8a04' },
  expired: { label: 'Expiré', bg: '#fee2e2', color: '#dc2626' },
};

const availabilityConfig: Record<string, { label: string; dot: string }> = {
  available: { label: 'Disponible', dot: '#16a34a' },
  busy: { label: 'Occupé', dot: '#f59e0b' },
  unavailable: { label: 'Indisponible', dot: '#dc2626' },
};

const kpis = [
  { label: 'Adressages émis', value: '24', sub: 'Ce mois', icon: 'ArrowUpRightIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Adressages reçus', value: '11', sub: 'Ce mois', icon: 'ArrowDownLeftIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
  { label: 'Taux d\'acceptation', value: '87%', sub: 'Adressages émis', icon: 'CheckCircleIcon', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
  { label: 'Certificats émis', value: '38', sub: 'Ce mois', icon: 'DocumentCheckIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)' },
];

export default function ProReferralsContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('outgoing');
  const [showNewReferral, setShowNewReferral] = useState(false);
  const [showNewCert, setShowNewCert] = useState(false);

  const outgoing = referrals.filter(r => r.direction === 'out');
  const incoming = referrals.filter(r => r.direction === 'in');

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Adressages & Certificats</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--shifa-muted)' }}>Gestion des adressages spécialisés et certificats médicaux</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowNewCert(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors"
            style={{ borderColor: 'var(--shifa-border)', color: 'var(--shifa-dark)', background: 'var(--shifa-surface)' }}
          >
            <Icon name="DocumentCheckIcon" className="w-4 h-4" />
            Nouveau certificat
          </button>
          <button
            onClick={() => setShowNewReferral(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ background: 'var(--shifa-blue)' }}
          >
            <Icon name="PlusIcon" className="w-4 h-4" />
            Nouvel adressage
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map(k => (
          <div key={k.label} className="rounded-xl p-4 border" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: k.bg }}>
                <Icon name={k.icon} className="w-5 h-5" style={{ color: k.color }} />
              </div>
              <span className="text-xs" style={{ color: 'var(--shifa-muted)' }}>{k.label}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>{k.value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--shifa-muted)' }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
            style={{
              background: activeTab === t.key ? 'var(--shifa-blue)' : 'var(--shifa-surface)',
              color: activeTab === t.key ? '#fff' : 'var(--shifa-muted)',
              border: `1px solid ${activeTab === t.key ? 'var(--shifa-blue)' : 'var(--shifa-border)'}`,
            }}
          >
            <Icon name={t.icon} className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {(activeTab === 'outgoing' || activeTab === 'incoming') && (
        <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--shifa-bg)', borderBottom: '1px solid var(--shifa-border)' }}>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--shifa-muted)' }}>Référence</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--shifa-muted)' }}>Patient</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--shifa-muted)' }}>{activeTab === 'outgoing' ? 'Destinataire' : 'Émetteur'}</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--shifa-muted)' }}>Motif</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--shifa-muted)' }}>Urgence</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--shifa-muted)' }}>Statut</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--shifa-muted)' }}>RDV</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {(activeTab === 'outgoing' ? outgoing : incoming).map((r, i) => {
                  const urg = urgencyConfig[r.urgency];
                  const st = statusConfig[r.status];
                  return (
                    <tr key={r.id} style={{ borderBottom: i < outgoing.length - 1 ? '1px solid var(--shifa-border)' : 'none' }}>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--shifa-blue)' }}>{r.id}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium" style={{ color: 'var(--shifa-dark)' }}>{r.patientName}</p>
                        <p className="text-xs" style={{ color: 'var(--shifa-muted)' }}>{r.patientId}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium" style={{ color: 'var(--shifa-dark)' }}>{r.toDoctor}</p>
                        <p className="text-xs" style={{ color: 'var(--shifa-muted)' }}>{r.toSpecialty} · {r.toInstitution}</p>
                      </td>
                      <td className="px-4 py-3 max-w-[180px]">
                        <p className="text-xs truncate" style={{ color: 'var(--shifa-muted)' }}>{r.reason}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: urg.bg, color: urg.color }}>{urg.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--shifa-muted)' }}>{r.appointmentDate || '—'}</td>
                      <td className="px-4 py-3">
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                          <Icon name="EyeIcon" className="w-4 h-4" style={{ color: 'var(--shifa-muted)' }} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'certificates' && (
        <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--shifa-bg)', borderBottom: '1px solid var(--shifa-border)' }}>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--shifa-muted)' }}>Référence</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--shifa-muted)' }}>Patient</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--shifa-muted)' }}>Type de certificat</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--shifa-muted)' }}>Objet</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--shifa-muted)' }}>Émis le</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--shifa-muted)' }}>Valide jusqu'au</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--shifa-muted)' }}>Statut</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((c, i) => {
                  const st = certStatusConfig[c.status];
                  return (
                    <tr key={c.id} style={{ borderBottom: i < certificates.length - 1 ? '1px solid var(--shifa-border)' : 'none' }}>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--shifa-blue)' }}>{c.id}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: 'var(--shifa-dark)' }}>{c.patientName}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--shifa-dark)' }}>{c.type}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--shifa-muted)' }}>{c.purpose}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--shifa-muted)' }}>{c.issuedDate}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--shifa-muted)' }}>{c.validUntil || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Voir">
                            <Icon name="EyeIcon" className="w-4 h-4" style={{ color: 'var(--shifa-muted)' }} />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Télécharger">
                            <Icon name="ArrowDownTrayIcon" className="w-4 h-4" style={{ color: 'var(--shifa-muted)' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'network' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {specialists.map(sp => {
            const avail = availabilityConfig[sp.availability];
            return (
              <div key={sp.name} className="rounded-xl border p-4" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'var(--shifa-blue)' }}>
                      {sp.name.split(' ').slice(-1)[0][0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--shifa-dark)' }}>{sp.name}</p>
                      <p className="text-xs" style={{ color: 'var(--shifa-blue)' }}>{sp.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: avail.dot }}></span>
                    <span className="text-xs" style={{ color: 'var(--shifa-muted)' }}>{avail.label}</span>
                  </div>
                </div>
                <p className="text-xs mb-3" style={{ color: 'var(--shifa-muted)' }}>{sp.institution}</p>
                <div className="flex items-center justify-between text-xs mb-3" style={{ color: 'var(--shifa-muted)' }}>
                  <span>Délai moyen: <strong style={{ color: 'var(--shifa-dark)' }}>{sp.avgWait}</strong></span>
                  <span>⭐ {sp.rating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--shifa-muted)' }}>{sp.referrals} adressages reçus</span>
                  <button
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors"
                    style={{ background: sp.availability === 'unavailable' ? '#9ca3af' : 'var(--shifa-blue)' }}
                    disabled={sp.availability === 'unavailable'}
                  >
                    Adresser
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="rounded-xl border p-6 text-center" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }}>
          <Icon name="ClockIcon" className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--shifa-muted)' }} />
          <p className="font-medium mb-1" style={{ color: 'var(--shifa-dark)' }}>Historique complet</p>
          <p className="text-sm" style={{ color: 'var(--shifa-muted)' }}>Tous les adressages et certificats archivés apparaîtront ici.</p>
        </div>
      )}

      {/* New Referral Modal */}
      {showNewReferral && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="rounded-2xl w-full max-w-lg p-6" style={{ background: 'var(--shifa-surface)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ color: 'var(--shifa-dark)' }}>Nouvel adressage</h2>
              <button onClick={() => setShowNewReferral(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <Icon name="XMarkIcon" className="w-5 h-5" style={{ color: 'var(--shifa-muted)' }} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--shifa-muted)' }}>Patient</label>
                <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--shifa-border)', background: 'var(--shifa-bg)', color: 'var(--shifa-dark)' }} placeholder="Rechercher un patient..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--shifa-muted)' }}>Spécialité</label>
                  <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--shifa-border)', background: 'var(--shifa-bg)', color: 'var(--shifa-dark)' }}>
                    <option>Cardiologie</option>
                    <option>Neurologie</option>
                    <option>Pédiatrie</option>
                    <option>Chirurgie</option>
                    <option>Ophtalmologie</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--shifa-muted)' }}>Urgence</label>
                  <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--shifa-border)', background: 'var(--shifa-bg)', color: 'var(--shifa-dark)' }}>
                    <option>Routine</option>
                    <option>Urgent</option>
                    <option>Urgence</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--shifa-muted)' }}>Motif de l'adressage</label>
                <textarea rows={3} className="w-full px-3 py-2 rounded-lg border text-sm resize-none" style={{ borderColor: 'var(--shifa-border)', background: 'var(--shifa-bg)', color: 'var(--shifa-dark)' }} placeholder="Décrivez le motif clinique..." />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowNewReferral(false)} className="flex-1 py-2 rounded-lg border text-sm font-medium" style={{ borderColor: 'var(--shifa-border)', color: 'var(--shifa-muted)' }}>Annuler</button>
              <button onClick={() => setShowNewReferral(false)} className="flex-1 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--shifa-blue)' }}>Envoyer l'adressage</button>
            </div>
          </div>
        </div>
      )}

      {/* New Certificate Modal */}
      {showNewCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="rounded-2xl w-full max-w-lg p-6" style={{ background: 'var(--shifa-surface)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ color: 'var(--shifa-dark)' }}>Nouveau certificat médical</h2>
              <button onClick={() => setShowNewCert(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <Icon name="XMarkIcon" className="w-5 h-5" style={{ color: 'var(--shifa-muted)' }} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--shifa-muted)' }}>Patient</label>
                <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--shifa-border)', background: 'var(--shifa-bg)', color: 'var(--shifa-dark)' }} placeholder="Rechercher un patient..." />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--shifa-muted)' }}>Type de certificat</label>
                <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--shifa-border)', background: 'var(--shifa-bg)', color: 'var(--shifa-dark)' }}>
                  <option>Certificat médical de repos</option>
                  <option>Certificat de non contre-indication sportive</option>
                  <option>Certificat médical initial</option>
                  <option>Certificat de bonne santé</option>
                  <option>Certificat de vaccination</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--shifa-muted)' }}>Objet / Destination</label>
                <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--shifa-border)', background: 'var(--shifa-bg)', color: 'var(--shifa-dark)' }} placeholder="Ex: Arrêt de travail, Emploi, Voyage..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--shifa-muted)' }}>Date d'émission</label>
                  <input type="date" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--shifa-border)', background: 'var(--shifa-bg)', color: 'var(--shifa-dark)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--shifa-muted)' }}>Valide jusqu'au</label>
                  <input type="date" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--shifa-border)', background: 'var(--shifa-bg)', color: 'var(--shifa-dark)' }} />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowNewCert(false)} className="flex-1 py-2 rounded-lg border text-sm font-medium" style={{ borderColor: 'var(--shifa-border)', color: 'var(--shifa-muted)' }}>Annuler</button>
              <button onClick={() => setShowNewCert(false)} className="flex-1 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--shifa-blue)' }}>Émettre le certificat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
