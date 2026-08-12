'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tab = 'documents' | 'upload' | 'permissions' | 'audit';

interface Document {
  id: string;
  name: string;
  category: string;
  version: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  status: 'active' | 'archived' | 'draft';
  access: 'public' | 'restricted' | 'confidential';
  tags: string[];
}

const CATEGORIES = ['Tous', 'Protocoles', 'Procédures', 'Formulaires', 'Rapports', 'Contrats', 'Réglementaire'];

const documents: Document[] = [
  { id: 'd1', name: 'Protocole de prise en charge urgences.pdf', category: 'Protocoles', version: 'v3.2', size: '2.4 MB', uploadedBy: 'Dr. Aminata Diallo', uploadedAt: '2025-07-15', status: 'active', access: 'restricted', tags: ['urgences', 'protocole', 'validé'] },
  { id: 'd2', name: 'Procédure hygiène des mains.pdf', category: 'Procédures', version: 'v1.8', size: '1.1 MB', uploadedBy: 'Fatou Ndiaye', uploadedAt: '2025-07-10', status: 'active', access: 'public', tags: ['hygiène', 'infection'] },
  { id: 'd3', name: 'Formulaire consentement chirurgie.docx', category: 'Formulaires', version: 'v2.1', size: '0.3 MB', uploadedBy: 'Dr. Moussa Traoré', uploadedAt: '2025-06-28', status: 'active', access: 'restricted', tags: ['consentement', 'chirurgie'] },
  { id: 'd4', name: 'Rapport qualité T2 2025.xlsx', category: 'Rapports', version: 'v1.0', size: '4.7 MB', uploadedBy: 'Fatou Ndiaye', uploadedAt: '2025-07-01', status: 'active', access: 'confidential', tags: ['qualité', 'rapport', 'T2'] },
  { id: 'd5', name: 'Contrat maintenance biomédicale.pdf', category: 'Contrats', version: 'v1.3', size: '0.8 MB', uploadedBy: 'Cheikh Diop', uploadedAt: '2025-05-20', status: 'active', access: 'confidential', tags: ['contrat', 'biomédical'] },
  { id: 'd6', name: 'Politique de confidentialité patients.pdf', category: 'Réglementaire', version: 'v4.0', size: '1.6 MB', uploadedBy: 'Fatou Ndiaye', uploadedAt: '2025-04-01', status: 'active', access: 'public', tags: ['RGPD', 'confidentialité'] },
];

const ACCESS_CONFIG = {
  public: { label: 'Public', bg: '#dcfce7', text: '#16a34a' },
  restricted: { label: 'Restreint', bg: '#fef9c3', text: '#a16207' },
  confidential: { label: 'Confidentiel', bg: '#fee2e2', text: '#b91c1c' },
};

const STATUS_CONFIG = {
  active: { label: 'Actif', bg: '#dcfce7', text: '#16a34a' },
  archived: { label: 'Archivé', bg: '#f1f5f9', text: '#64748b' },
  draft: { label: 'Brouillon', bg: '#fef9c3', text: '#a16207' },
};

const FILE_ICONS: Record<string, string> = {
  pdf: 'DocumentTextIcon',
  docx: 'DocumentIcon',
  xlsx: 'TableCellsIcon',
  default: 'DocumentIcon',
};

const auditLog = [
  { action: 'Téléchargement', doc: 'Protocole de prise en charge urgences.pdf', user: 'Dr. Aminata Diallo', date: '2025-08-01 14:32', ip: '192.168.1.45' },
  { action: 'Modification', doc: 'Rapport qualité T2 2025.xlsx', user: 'Fatou Ndiaye', date: '2025-07-31 09:15', ip: '192.168.1.12' },
  { action: 'Upload', doc: 'Politique de confidentialité patients.pdf', user: 'Fatou Ndiaye', date: '2025-07-30 16:48', ip: '192.168.1.12' },
  { action: 'Consultation', doc: 'Contrat maintenance biomédicale.pdf', user: 'Cheikh Diop', date: '2025-07-29 11:20', ip: '192.168.1.78' },
  { action: 'Partage', doc: 'Procédure hygiène des mains.pdf', user: 'Ibrahima Sow', date: '2025-07-28 08:05', ip: '192.168.1.33' },
];

export default function OrgDocumentsContent() {
  const [activeTab, setActiveTab] = useState<Tab>('documents');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [search, setSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'documents', label: 'Documents', icon: 'FolderOpenIcon' },
    { key: 'upload', label: 'Importer', icon: 'ArrowUpTrayIcon' },
    { key: 'permissions', label: 'Permissions', icon: 'ShieldCheckIcon' },
    { key: 'audit', label: 'Journal d\'audit', icon: 'ClipboardDocumentCheckIcon' },
  ];

  const filtered = documents.filter(d =>
    (selectedCategory === 'Tous' || d.category === selectedCategory) &&
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase() || 'default';
    return FILE_ICONS[ext] || FILE_ICONS.default;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'DM Sans, sans-serif' }}>
            Gestion documentaire
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            {documents.length} documents · {documents.filter(d => d.status === 'active').length} actifs · Versionnage activé
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: 'var(--primary)' }}>
          <Icon name="ArrowUpTrayIcon" size={16} />
          Importer un document
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total documents', value: documents.length, icon: 'DocumentTextIcon', color: '#dbeafe' },
          { label: 'Accès public', value: documents.filter(d => d.access === 'public').length, icon: 'GlobeAltIcon', color: '#dcfce7' },
          { label: 'Confidentiels', value: documents.filter(d => d.access === 'confidential').length, icon: 'LockClosedIcon', color: '#fee2e2' },
          { label: 'Mis à jour ce mois', value: 4, icon: 'ArrowPathIcon', color: '#fef9c3' },
        ].map((kpi, i) => (
          <div key={i} className="p-4 rounded-xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: kpi.color }}>
                <Icon name={kpi.icon as any} size={18} style={{ color: '#374151' }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{kpi.value}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--muted)' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: activeTab === tab.key ? 'var(--background)' : 'transparent',
              color: activeTab === tab.key ? 'var(--foreground)' : 'var(--muted-foreground)',
              boxShadow: activeTab === tab.key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <Icon name={tab.icon as any} size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-7 space-y-4">
            {/* Search & Filter */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                <input
                  type="text"
                  placeholder="Rechercher un document..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm"
                  style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                  style={{
                    background: selectedCategory === cat ? 'var(--primary)' : 'var(--muted)',
                    color: selectedCategory === cat ? '#fff' : 'var(--muted-foreground)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Document List */}
            <div className="space-y-2">
              {filtered.map(doc => {
                const ac = ACCESS_CONFIG[doc.access];
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className="flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm"
                    style={{
                      background: selectedDoc?.id === doc.id ? 'var(--muted)' : 'var(--card)',
                      borderColor: selectedDoc?.id === doc.id ? 'var(--primary)' : 'var(--border)',
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--muted)' }}>
                      <Icon name={getFileIcon(doc.name) as any} size={20} style={{ color: 'var(--muted-foreground)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate" style={{ color: 'var(--foreground)' }}>{doc.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        {doc.category} · {doc.version} · {doc.size} · {doc.uploadedAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: ac.bg, color: ac.text }}>{ac.label}</span>
                      <button className="p-1.5 rounded-lg" style={{ background: 'var(--muted)' }}>
                        <Icon name="ArrowDownTrayIcon" size={13} style={{ color: 'var(--muted-foreground)' }} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Document Detail */}
          {selectedDoc ? (
            <div className="col-span-5 rounded-xl border p-5 space-y-5 h-fit" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--muted)' }}>
                  <Icon name={getFileIcon(selectedDoc.name) as any} size={24} style={{ color: 'var(--muted-foreground)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm leading-tight" style={{ color: 'var(--foreground)' }}>{selectedDoc.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{selectedDoc.category}</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Version', value: selectedDoc.version },
                  { label: 'Taille', value: selectedDoc.size },
                  { label: 'Importé par', value: selectedDoc.uploadedBy },
                  { label: 'Date d\'import', value: selectedDoc.uploadedAt },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</span>
                    <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: ACCESS_CONFIG[selectedDoc.access].bg, color: ACCESS_CONFIG[selectedDoc.access].text }}>
                  {ACCESS_CONFIG[selectedDoc.access].label}
                </span>
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: STATUS_CONFIG[selectedDoc.status].bg, color: STATUS_CONFIG[selectedDoc.status].text }}>
                  {STATUS_CONFIG[selectedDoc.status].label}
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--muted-foreground)' }}>Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDoc.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-lg" style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>{tag}</span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--muted-foreground)' }}>Historique des versions</p>
                <div className="space-y-1.5">
                  {[selectedDoc.version, 'v' + (parseFloat(selectedDoc.version.replace('v', '')) - 0.1).toFixed(1)].map((v, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg" style={{ background: 'var(--muted)' }}>
                      <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{v}</span>
                      {i === 0 && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#dbeafe', color: '#1d4ed8' }}>Actuelle</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--primary)' }}>
                  <Icon name="ArrowDownTrayIcon" size={14} />
                  Télécharger
                </button>
                <button className="px-3 py-2 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                  <Icon name="ShareIcon" size={14} />
                </button>
                <button className="px-3 py-2 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                  <Icon name="PencilIcon" size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="col-span-5 rounded-xl border flex items-center justify-center p-10" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="text-center">
                <Icon name="DocumentTextIcon" size={40} style={{ color: 'var(--muted-foreground)', margin: '0 auto 8px' }} />
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Sélectionnez un document</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="max-w-2xl space-y-5">
          {/* Drop Zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); }}
            className="border-2 border-dashed rounded-2xl p-10 text-center transition-all"
            style={{
              borderColor: dragOver ? 'var(--primary)' : 'var(--border)',
              background: dragOver ? 'var(--muted)' : 'var(--card)',
            }}
          >
            <Icon name="ArrowUpTrayIcon" size={36} style={{ color: 'var(--muted-foreground)', margin: '0 auto 12px' }} />
            <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Glissez-déposez vos fichiers ici</p>
            <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>ou</p>
            <button className="mt-3 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: 'var(--primary)' }}>
              Parcourir les fichiers
            </button>
            <p className="text-xs mt-3" style={{ color: 'var(--muted-foreground)' }}>PDF, DOCX, XLSX, PNG — Max 50 MB</p>
          </div>

          {/* Metadata Form */}
          <div className="p-5 rounded-xl border space-y-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Métadonnées du document</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--foreground)' }}>Catégorie</label>
                <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                  {CATEGORIES.filter(c => c !== 'Tous').map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--foreground)' }}>Niveau d'accès</label>
                <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                  <option>Public</option>
                  <option>Restreint</option>
                  <option>Confidentiel</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--foreground)' }}>Tags (séparés par des virgules)</label>
              <input type="text" placeholder="protocole, urgences, validé..." className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--foreground)' }}>Description (optionnel)</label>
              <textarea rows={3} className="w-full px-3 py-2 rounded-lg border text-sm resize-none" style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
            </div>
            <button className="w-full py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: 'var(--primary)' }}>
              Importer le document
            </button>
          </div>
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <div className="space-y-4">
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Définissez les droits d'accès par rôle et par catégorie de document</p>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--muted)' }}>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>Rôle</th>
                  {CATEGORIES.filter(c => c !== 'Tous').map(cat => (
                    <th key={cat} className="text-center px-3 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>{cat}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {['Médecin chef', 'Infirmier', 'Administrateur', 'Technicien'].map((role, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--foreground)' }}>{role}</td>
                    {CATEGORIES.filter(c => c !== 'Tous').map((cat, j) => (
                      <td key={j} className="px-3 py-3 text-center">
                        <select
                          className="text-xs px-2 py-1 rounded-lg border"
                          style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                          defaultValue={j < 3 ? 'read' : 'none'}
                        >
                          <option value="none">Aucun</option>
                          <option value="read">Lecture</option>
                          <option value="write">Écriture</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: 'var(--primary)' }}>
            Enregistrer les permissions
          </button>
        </div>
      )}

      {/* Audit Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Journal immuable de toutes les actions sur les documents</p>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
              <Icon name="ArrowDownTrayIcon" size={14} />
              Exporter
            </button>
          </div>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--muted)' }}>
                  {['Action', 'Document', 'Utilisateur', 'Date & Heure', 'IP'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {auditLog.map((entry, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full" style={{
                        background: entry.action === 'Upload' ? '#dcfce7' : entry.action === 'Modification' ? '#fef9c3' : '#dbeafe',
                        color: entry.action === 'Upload' ? '#16a34a' : entry.action === 'Modification' ? '#a16207' : '#1d4ed8',
                      }}>
                        {entry.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs max-w-[200px] truncate" style={{ color: 'var(--foreground)' }}>{entry.doc}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{entry.user}</td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{entry.date}</td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{entry.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
