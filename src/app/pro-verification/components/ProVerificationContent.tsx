'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tab = 'pending' | 'review' | 'approved' | 'rejected' | 'stats';
type VerifStatus = 'pending' | 'in_review' | 'approved' | 'rejected' | 'suspended';

interface Professional {
  id: string;
  name: string;
  specialty: string;
  licenseNumber: string;
  institution: string;
  country: string;
  submittedDate: string;
  status: VerifStatus;
  documents: { name: string; type: string; verified: boolean | null }[];
  score: number;
  reviewer?: string;
  notes?: string;
  priority: 'normal' | 'urgent';
}

const professionals: Professional[] = [
  {
    id: 'PRO-001', name: 'Dr. Aminata Kouyaté', specialty: 'Cardiologie', licenseNumber: 'SN-MED-2019-4521',
    institution: 'CHU Aristide Le Dantec', country: 'Sénégal', submittedDate: '2026-08-08', status: 'pending',
    documents: [
      { name: 'Diplôme de médecine', type: 'diploma', verified: null },
      { name: 'Spécialisation cardiologie', type: 'specialty', verified: null },
      { name: 'Ordre des médecins', type: 'license', verified: null },
      { name: 'Pièce d\'identité', type: 'id', verified: null },
    ],
    score: 0, priority: 'urgent',
  },
  {
    id: 'PRO-002', name: 'Dr. Ibrahima Diallo', specialty: 'Médecine générale', licenseNumber: 'SN-MED-2021-7832',
    institution: 'Clinique Pasteur', country: 'Sénégal', submittedDate: '2026-08-07', status: 'in_review',
    documents: [
      { name: 'Diplôme de médecine', type: 'diploma', verified: true },
      { name: 'Ordre des médecins', type: 'license', verified: true },
      { name: 'Pièce d\'identité', type: 'id', verified: null },
      { name: 'Attestation employeur', type: 'employment', verified: null },
    ],
    score: 72, reviewer: 'Admin Vérification', priority: 'normal',
  },
  {
    id: 'PRO-003', name: 'Dr. Fatou Mbaye', specialty: 'Pédiatrie', licenseNumber: 'SN-MED-2018-3301',
    institution: 'Hôpital Principal', country: 'Sénégal', submittedDate: '2026-08-05', status: 'approved',
    documents: [
      { name: 'Diplôme de médecine', type: 'diploma', verified: true },
      { name: 'Spécialisation pédiatrie', type: 'specialty', verified: true },
      { name: 'Ordre des médecins', type: 'license', verified: true },
      { name: 'Pièce d\'identité', type: 'id', verified: true },
    ],
    score: 98, reviewer: 'Admin Vérification', notes: 'Dossier complet, vérification rapide.', priority: 'normal',
  },
  {
    id: 'PRO-004', name: 'Dr. Moussa Sarr', specialty: 'Chirurgie', licenseNumber: 'SN-MED-2020-5512',
    institution: 'Clinique du Cap', country: 'Sénégal', submittedDate: '2026-08-03', status: 'rejected',
    documents: [
      { name: 'Diplôme de médecine', type: 'diploma', verified: false },
      { name: 'Spécialisation chirurgie', type: 'specialty', verified: false },
      { name: 'Ordre des médecins', type: 'license', verified: false },
      { name: 'Pièce d\'identité', type: 'id', verified: true },
    ],
    score: 22, reviewer: 'Admin Vérification', notes: 'Documents non conformes. Diplôme non reconnu.', priority: 'normal',
  },
  {
    id: 'PRO-005', name: 'Dr. Aïssatou Ndiaye', specialty: 'Gynécologie', licenseNumber: 'SN-MED-2017-2198',
    institution: 'Maternité Roi Baudouin', country: 'Sénégal', submittedDate: '2026-08-09', status: 'pending',
    documents: [
      { name: 'Diplôme de médecine', type: 'diploma', verified: null },
      { name: 'Spécialisation gynéco', type: 'specialty', verified: null },
      { name: 'Ordre des médecins', type: 'license', verified: null },
      { name: 'Pièce d\'identité', type: 'id', verified: null },
    ],
    score: 0, priority: 'normal',
  },
];

const statusConfig: Record<VerifStatus, { label: string; bg: string; text: string; icon: string }> = {
  pending: { label: 'En attente', bg: '#fef9c3', text: '#ca8a04', icon: 'ClockIcon' },
  in_review: { label: 'En cours', bg: '#dbeafe', text: '#1d4ed8', icon: 'MagnifyingGlassIcon' },
  approved: { label: 'Approuvé', bg: '#dcfce7', text: '#16a34a', icon: 'CheckCircleIcon' },
  rejected: { label: 'Rejeté', bg: '#fee2e2', text: '#dc2626', icon: 'XCircleIcon' },
  suspended: { label: 'Suspendu', bg: '#f3e8ff', text: '#7c3aed', icon: 'ExclamationCircleIcon' },
};

const docTypeLabel: Record<string, string> = {
  diploma: 'Diplôme', specialty: 'Spécialisation', license: 'Ordre médecins', id: 'Identité', employment: 'Attestation',
};

export default function ProVerificationContent() {
  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [selected, setSelected] = useState<Professional | null>(null);

  const tabs: { id: Tab; label: string; icon: string; count?: number }[] = [
    { id: 'pending', label: 'En attente', icon: 'ClockIcon', count: professionals.filter(p => p.status === 'pending').length },
    { id: 'review', label: 'En cours', icon: 'MagnifyingGlassIcon', count: professionals.filter(p => p.status === 'in_review').length },
    { id: 'approved', label: 'Approuvés', icon: 'CheckCircleIcon', count: professionals.filter(p => p.status === 'approved').length },
    { id: 'rejected', label: 'Rejetés', icon: 'XCircleIcon', count: professionals.filter(p => p.status === 'rejected').length },
    { id: 'stats', label: 'Statistiques', icon: 'ChartBarIcon' },
  ];

  const tabStatusMap: Record<Tab, VerifStatus | null> = {
    pending: 'pending', review: 'in_review', approved: 'approved', rejected: 'rejected', stats: null,
  };

  const filtered = activeTab === 'stats' ? [] : professionals.filter(p => p.status === tabStatusMap[activeTab]);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>
              Vérification des Professionnels
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
              Validation des diplômes, licences et accréditations médicales
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium hover:bg-muted" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
              <Icon name="ArrowDownTrayIcon" size={16} />
              Exporter
            </button>
          </div>
        </div>
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSelected(null); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-white' : 'hover:bg-muted'}`}
              style={activeTab === tab.id ? { backgroundColor: 'var(--shifa-blue)' } : { color: 'var(--muted-foreground)' }}
            >
              <Icon name={tab.icon as any} size={15} />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="px-1.5 py-0.5 text-xs font-bold rounded-full" style={{ backgroundColor: activeTab === tab.id ? 'rgba(255,255,255,0.25)' : 'var(--shifa-blue)', color: activeTab === tab.id ? '#fff' : '#fff', minWidth: '20px', textAlign: 'center' }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* List */}
        {activeTab !== 'stats' && (
          <div className={`${selected ? 'w-1/2' : 'w-full'} overflow-y-auto p-6 transition-all`}>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Icon name="CheckCircleIcon" size={48} className="text-muted-foreground mb-4" />
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Aucun dossier dans cette catégorie</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(pro => {
                  const scfg = statusConfig[pro.status];
                  const verifiedDocs = pro.documents.filter(d => d.verified === true).length;
                  return (
                    <div
                      key={pro.id}
                      onClick={() => setSelected(selected?.id === pro.id ? null : pro)}
                      className={`rounded-xl border p-5 cursor-pointer transition-all ${selected?.id === pro.id ? 'ring-2' : 'hover:border-opacity-80'}`}
                      style={{ backgroundColor: 'var(--card)', borderColor: selected?.id === pro.id ? 'var(--shifa-blue)' : 'var(--border)', ['--tw-ring-color' as string]: 'var(--shifa-blue)' }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                            {pro.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>{pro.name}</h3>
                              {pro.priority === 'urgent' && (
                                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>Urgent</span>
                              )}
                            </div>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{pro.specialty} · {pro.institution}</p>
                            <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{pro.licenseNumber}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Documents</p>
                            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{verifiedDocs}/{pro.documents.length}</p>
                          </div>
                          {pro.score > 0 && (
                            <div className="text-right">
                              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Score</p>
                              <p className="text-sm font-bold" style={{ color: pro.score >= 80 ? '#16a34a' : pro.score >= 50 ? '#ca8a04' : '#dc2626' }}>{pro.score}%</p>
                            </div>
                          )}
                          <span className="text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1" style={{ backgroundColor: scfg.bg, color: scfg.text }}>
                            <Icon name={scfg.icon as any} size={11} />
                            {scfg.label}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex gap-1.5">
                          {pro.documents.map((doc, i) => (
                            <div key={i} className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: doc.verified === true ? '#dcfce7' : doc.verified === false ? '#fee2e2' : 'var(--muted)' }}>
                              <Icon name={doc.verified === true ? 'CheckIcon' : doc.verified === false ? 'XMarkIcon' : 'DocumentIcon'} size={12} style={{ color: doc.verified === true ? '#16a34a' : doc.verified === false ? '#dc2626' : 'var(--muted-foreground)' }} />
                            </div>
                          ))}
                        </div>
                        <p className="text-xs ml-auto" style={{ color: 'var(--muted-foreground)' }}>Soumis le {pro.submittedDate}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Detail panel */}
        {selected && (
          <div className="w-1/2 border-l overflow-y-auto p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>Dossier de vérification</h2>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-muted">
                <Icon name="XMarkIcon" size={18} className="text-muted-foreground" />
              </button>
            </div>

            {/* Pro info */}
            <div className="rounded-xl border p-4 mb-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                  {selected.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>{selected.name}</h3>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{selected.specialty}</p>
                  <p className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{selected.licenseNumber}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span style={{ color: 'var(--muted-foreground)' }}>Institution: </span><span style={{ color: 'var(--foreground)' }}>{selected.institution}</span></div>
                <div><span style={{ color: 'var(--muted-foreground)' }}>Pays: </span><span style={{ color: 'var(--foreground)' }}>{selected.country}</span></div>
                <div><span style={{ color: 'var(--muted-foreground)' }}>Soumis: </span><span style={{ color: 'var(--foreground)' }}>{selected.submittedDate}</span></div>
                {selected.reviewer && <div><span style={{ color: 'var(--muted-foreground)' }}>Réviseur: </span><span style={{ color: 'var(--foreground)' }}>{selected.reviewer}</span></div>}
              </div>
            </div>

            {/* Documents */}
            <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Documents soumis</h4>
            <div className="space-y-2 mb-4">
              {selected.documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--muted)' }}>
                      <Icon name="DocumentTextIcon" size={15} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{doc.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{docTypeLabel[doc.type]}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                      <Icon name="EyeIcon" size={14} className="text-muted-foreground" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" style={{ color: '#16a34a' }}>
                      <Icon name="CheckIcon" size={14} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" style={{ color: '#dc2626' }}>
                      <Icon name="XMarkIcon" size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Notes */}
            {selected.notes && (
              <div className="rounded-lg p-3 mb-4" style={{ backgroundColor: '#fef9c3', borderLeft: '3px solid #ca8a04' }}>
                <p className="text-xs font-medium mb-1" style={{ color: '#ca8a04' }}>Note du réviseur</p>
                <p className="text-sm" style={{ color: '#92400e' }}>{selected.notes}</p>
              </div>
            )}

            {/* Actions */}
            {(selected.status === 'pending' || selected.status === 'in_review') && (
              <div className="space-y-2">
                <textarea
                  placeholder="Ajouter une note de vérification..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
                  style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
                <div className="flex gap-2">
                  {selected.status === 'pending' && (
                    <button className="flex-1 py-2 rounded-lg border text-sm font-medium hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                      Commencer révision
                    </button>
                  )}
                  <button className="flex-1 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#16a34a' }}>
                    <Icon name="CheckIcon" size={15} className="inline mr-1" />
                    Approuver
                  </button>
                  <button className="flex-1 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#dc2626' }}>
                    <Icon name="XMarkIcon" size={15} className="inline mr-1" />
                    Rejeter
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats tab */}
        {activeTab === 'stats' && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total dossiers', value: professionals.length, color: 'var(--shifa-blue)' },
                { label: 'Approuvés', value: professionals.filter(p => p.status === 'approved').length, color: '#16a34a' },
                { label: 'En attente', value: professionals.filter(p => p.status === 'pending').length, color: '#ca8a04' },
                { label: 'Rejetés', value: professionals.filter(p => p.status === 'rejected').length, color: '#dc2626' },
              ].map((s, i) => (
                <div key={i} className="rounded-xl border p-5 text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <p className="text-3xl font-bold mb-1" style={{ color: s.color, fontFamily: 'var(--font-display)' }}>{s.value}</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{s.label}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Taux d'approbation par spécialité</h3>
              <div className="space-y-3">
                {['Cardiologie', 'Médecine générale', 'Pédiatrie', 'Chirurgie', 'Gynécologie'].map((spec, i) => {
                  const rate = [0, 72, 98, 22, 0][i];
                  return (
                    <div key={spec} className="flex items-center gap-3">
                      <span className="text-sm w-40 shrink-0" style={{ color: 'var(--foreground)' }}>{spec}</span>
                      <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                        <div className="h-full rounded-full" style={{ width: `${rate}%`, backgroundColor: rate >= 80 ? '#16a34a' : rate >= 50 ? '#f59e0b' : 'var(--muted-foreground)' }} />
                      </div>
                      <span className="text-sm font-medium w-10 text-right" style={{ color: 'var(--foreground)' }}>{rate}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
