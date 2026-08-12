'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tab = 'generator' | 'templates' | 'history';
type CertType = 'work_absence' | 'fitness' | 'school_absence' | 'sports' | 'disability' | 'custom';

interface CertTemplate {
  id: string;
  type: CertType;
  name: string;
  description: string;
  icon: string;
  fields: string[];
  color: string;
}

interface IssuedCert {
  id: string;
  type: string;
  patientName: string;
  patientId: string;
  issuedDate: string;
  validUntil?: string;
  doctor: string;
  purpose: string;
  status: 'valid' | 'expired' | 'revoked';
}

const templates: CertTemplate[] = [
  { id: 'T001', type: 'work_absence', name: 'Arrêt de travail', description: 'Certificat médical d\'incapacité temporaire de travail', icon: 'BriefcaseIcon', fields: ['Durée', 'Diagnostic (optionnel)', 'Reprise prévue'], color: '#dbeafe' },
  { id: 'T002', type: 'fitness', name: 'Aptitude médicale', description: 'Certificat d\'aptitude physique pour emploi ou activité', icon: 'CheckBadgeIcon', fields: ['Poste / Activité', 'Durée de validité', 'Restrictions éventuelles'], color: '#dcfce7' },
  { id: 'T003', type: 'school_absence', name: 'Absence scolaire', description: 'Justificatif médical d\'absence pour établissement scolaire', icon: 'AcademicCapIcon', fields: ['Établissement', 'Dates d\'absence', 'Motif médical'], color: '#fef9c3' },
  { id: 'T004', type: 'sports', name: 'Non contre-indication sport', description: 'Certificat de non contre-indication à la pratique sportive', icon: 'TrophyIcon', fields: ['Sport pratiqué', 'Niveau (loisir/compétition)', 'Durée de validité'], color: '#f3e8ff' },
  { id: 'T005', type: 'disability', name: 'Invalidité / Handicap', description: 'Attestation médicale pour dossier d\'invalidité ou RQTH', icon: 'HeartIcon', fields: ['Nature du handicap', 'Taux estimé', 'Organisme destinataire'], color: '#fee2e2' },
  { id: 'T006', type: 'custom', name: 'Certificat personnalisé', description: 'Rédaction libre d\'un certificat médical sur mesure', icon: 'DocumentTextIcon', fields: ['Objet du certificat', 'Contenu libre'], color: '#f1f5f9' },
];

const issuedCerts: IssuedCert[] = [
  { id: 'CERT-2026-0891', type: 'Arrêt de travail', patientName: 'Aïcha Diallo', patientId: 'PAT-7K4D', issuedDate: '2026-08-10', validUntil: '2026-08-17', doctor: 'Dr. Mohamed Sy', purpose: 'Arrêt 7 jours — grippe sévère', status: 'valid' },
  { id: 'CERT-2026-0887', type: 'Aptitude médicale', patientName: 'Oumar Ndiaye', patientId: 'PAT-3M2K', issuedDate: '2026-08-08', validUntil: '2027-08-08', doctor: 'Dr. Mohamed Sy', purpose: 'Aptitude poste gardien de sécurité', status: 'valid' },
  { id: 'CERT-2026-0882', type: 'Absence scolaire', patientName: 'Mariama Ba', patientId: 'PAT-9P1R', issuedDate: '2026-08-05', validUntil: '2026-08-09', doctor: 'Dr. Mohamed Sy', purpose: 'Absence 5 jours — angine', status: 'expired' },
  { id: 'CERT-2026-0876', type: 'Non contre-indication sport', patientName: 'Cheikh Fall', patientId: 'PAT-2L8S', issuedDate: '2026-07-28', validUntil: '2027-07-28', doctor: 'Dr. Mohamed Sy', purpose: 'Football — niveau compétition', status: 'valid' },
  { id: 'CERT-2026-0871', type: 'Arrêt de travail', patientName: 'Rokhaya Seck', patientId: 'PAT-5N7T', issuedDate: '2026-07-20', validUntil: '2026-07-27', doctor: 'Dr. Mohamed Sy', purpose: 'Arrêt 7 jours — lombalgie aiguë', status: 'expired' },
];

const certStatusConfig = {
  valid: { label: 'Valide', bg: '#dcfce7', text: '#16a34a' },
  expired: { label: 'Expiré', bg: '#f1f5f9', text: '#64748b' },
  revoked: { label: 'Révoqué', bg: '#fee2e2', text: '#dc2626' },
};

export default function MedicalCertificatesContent() {
  const [activeTab, setActiveTab] = useState<Tab>('generator');
  const [selectedTemplate, setSelectedTemplate] = useState<CertTemplate | null>(null);
  const [formData, setFormData] = useState({ patient: '', date: '2026-08-10', notes: '' });

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'generator', label: 'Générateur', icon: 'DocumentPlusIcon' },
    { id: 'templates', label: 'Modèles', icon: 'RectangleStackIcon' },
    { id: 'history', label: 'Certificats émis', icon: 'ClipboardDocumentListIcon' },
  ];

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>
              Certificats Médicaux
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
              Génération, gestion et archivage des certificats médicaux
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
              <Icon name="DocumentCheckIcon" size={15} />
              <span>{issuedCerts.filter(c => c.status === 'valid').length} certificats actifs</span>
            </div>
          </div>
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
        {/* GENERATOR */}
        {activeTab === 'generator' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Template selection */}
            <div>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>1. Choisir le type de certificat</h3>
              <div className="grid grid-cols-2 gap-3">
                {templates.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(t)}
                    className={`p-4 rounded-xl border text-left transition-all ${selectedTemplate?.id === t.id ? 'ring-2' : 'hover:border-opacity-60'}`}
                    style={{ backgroundColor: 'var(--card)', borderColor: selectedTemplate?.id === t.id ? 'var(--shifa-blue)' : 'var(--border)' }}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: t.color }}>
                      <Icon name={t.icon as any} size={20} style={{ color: 'var(--foreground)' }} />
                    </div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{t.name}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{t.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <div>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>2. Remplir le certificat</h3>
              <div className="rounded-xl border p-5 space-y-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                {!selectedTemplate ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Icon name="DocumentTextIcon" size={40} className="text-muted-foreground mb-3" />
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Sélectionnez un type de certificat</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: selectedTemplate.color }}>
                      <Icon name={selectedTemplate.icon as any} size={20} style={{ color: 'var(--foreground)' }} />
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{selectedTemplate.name}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{selectedTemplate.description}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--muted-foreground)' }}>Patient *</label>
                      <input
                        value={formData.patient}
                        onChange={e => setFormData(p => ({ ...p, patient: e.target.value }))}
                        placeholder="Rechercher ou saisir le nom du patient..."
                        className="w-full px-3 py-2 rounded-lg border text-sm"
                        style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--muted-foreground)' }}>Date d'émission</label>
                        <input type="date" value={formData.date} onChange={e => setFormData(p => ({ ...p, date: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--muted-foreground)' }}>Valable jusqu'au</label>
                        <input type="date" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                      </div>
                    </div>

                    {selectedTemplate.fields.map((field, i) => (
                      <div key={i}>
                        <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--muted-foreground)' }}>{field}</label>
                        <input placeholder={`${field}...`} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                      </div>
                    ))}

                    <div>
                      <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--muted-foreground)' }}>Observations complémentaires</label>
                      <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                        placeholder="Observations médicales complémentaires..."
                        className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
                        style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                      />
                    </div>

                    {/* Preview box */}
                    <div className="rounded-lg border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>Aperçu du certificat</p>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--shifa-blue)' }} />
                          <span className="text-xs" style={{ color: 'var(--shifa-blue)' }}>SHIFA Médical</span>
                        </div>
                      </div>
                      <div className="text-center mb-3">
                        <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>CERTIFICAT MÉDICAL</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{selectedTemplate.name.toUpperCase()}</p>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground)' }}>
                        Je soussigné, <strong>Dr. Mohamed Sy</strong>, Médecin généraliste, certifie avoir examiné{' '}
                        <strong>{formData.patient || '[Nom du patient]'}</strong> en date du <strong>{formData.date}</strong>...
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                        <Icon name="EyeIcon" size={15} />
                        Prévisualiser
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                        <Icon name="DocumentArrowDownIcon" size={15} />
                        Générer PDF
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TEMPLATES */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {templates.map(t => (
              <div key={t.id} className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: t.color }}>
                    <Icon name={t.icon as any} size={22} style={{ color: 'var(--foreground)' }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>{t.name}</h3>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{t.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {t.fields.map((f, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{f}</span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => { setSelectedTemplate(t); setActiveTab('generator'); }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-white shrink-0"
                    style={{ backgroundColor: 'var(--shifa-blue)' }}
                  >
                    Utiliser
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input placeholder="Rechercher certificat ou patient..." className="w-full pl-9 pr-4 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              </div>
            </div>
            {issuedCerts.map(cert => {
              const scfg = certStatusConfig[cert.status];
              return (
                <div key={cert.id} className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--muted)' }}>
                        <Icon name="DocumentTextIcon" size={18} className="text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>{cert.id}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: scfg.bg, color: scfg.text }}>{scfg.label}</span>
                        </div>
                        <h3 className="font-semibold mt-0.5" style={{ color: 'var(--foreground)' }}>{cert.patientName}</h3>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{cert.type} · {cert.purpose}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Émis le {cert.issuedDate}</p>
                        {cert.validUntil && <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Valable jusqu'au {cert.validUntil}</p>}
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 rounded-lg border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)' }}>
                          <Icon name="EyeIcon" size={15} className="text-muted-foreground" />
                        </button>
                        <button className="p-2 rounded-lg border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)' }}>
                          <Icon name="ArrowDownTrayIcon" size={15} className="text-muted-foreground" />
                        </button>
                        <button className="p-2 rounded-lg border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)' }}>
                          <Icon name="ShareIcon" size={15} className="text-muted-foreground" />
                        </button>
                      </div>
                    </div>
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
