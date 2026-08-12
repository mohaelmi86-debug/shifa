'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tab = 'all' | 'upload' | 'preview' | 'audit';

interface Document {
  id: string;
  name: string;
  category: 'ordonnance' | 'compte_rendu' | 'certificat' | 'resultat' | 'imagerie' | 'administratif' | 'autre';
  patient?: string;
  size: string;
  version: number;
  uploadedAt: string;
  uploadedBy: string;
  sharedWith: string[];
  permissions: 'private' | 'shared' | 'org';
  status: 'active' | 'archived' | 'pending_review';
  tags: string[];
}

const mockDocs: Document[] = [
  { id: 'd1', name: 'Ordonnance_Diallo_20260810.pdf', category: 'ordonnance', patient: 'Oumar Diallo', size: '124 Ko', version: 1, uploadedAt: '10 août 2026', uploadedBy: 'Dr. Sy', sharedWith: ['Oumar Diallo', 'Pharmacie Centrale'], permissions: 'shared', status: 'active', tags: ['hypertension', 'renouvellement'] },
  { id: 'd2', name: 'CR_Consultation_Seck_20260810.pdf', category: 'compte_rendu', patient: 'Fatou Seck', size: '256 Ko', version: 2, uploadedAt: '10 août 2026', uploadedBy: 'Dr. Sy', sharedWith: ['Fatou Seck'], permissions: 'shared', status: 'active', tags: ['gastro', 'suivi'] },
  { id: 'd3', name: 'Certificat_Aptitude_Ba.pdf', category: 'certificat', patient: 'Ibrahima Ba', size: '98 Ko', version: 1, uploadedAt: '09 août 2026', uploadedBy: 'Dr. Sy', sharedWith: [], permissions: 'private', status: 'active', tags: ['aptitude', 'sport'] },
  { id: 'd4', name: 'Protocole_Diabete_v3.pdf', category: 'administratif', size: '512 Ko', version: 3, uploadedAt: '01 août 2026', uploadedBy: 'Dr. Sy', sharedWith: ['Équipe soins'], permissions: 'org', status: 'active', tags: ['protocole', 'diabète'] },
  { id: 'd5', name: 'Resultat_Biologie_Ndiaye.pdf', category: 'resultat', patient: 'Mariama Ndiaye', size: '180 Ko', version: 1, uploadedAt: '08 août 2026', uploadedBy: 'Labo Central', sharedWith: ['Mariama Ndiaye', 'Dr. Sy'], permissions: 'shared', status: 'active', tags: ['biologie', 'NFS'] },
  { id: 'd6', name: 'Radio_Thorax_Diop.dcm', category: 'imagerie', patient: 'Cheikh Diop', size: '4.2 Mo', version: 1, uploadedAt: '07 août 2026', uploadedBy: 'Imagerie CHU', sharedWith: ['Dr. Sy'], permissions: 'shared', status: 'active', tags: ['radiologie', 'thorax'] },
  { id: 'd7', name: 'Contrat_Exercice_Liberal.pdf', category: 'administratif', size: '340 Ko', version: 1, uploadedAt: '01 jan. 2026', uploadedBy: 'Dr. Sy', sharedWith: [], permissions: 'private', status: 'archived', tags: ['contrat', 'libéral'] },
];

const auditLog = [
  { id: 'a1', action: 'Téléchargement', doc: 'Ordonnance_Diallo_20260810.pdf', user: 'Pharmacie Centrale', date: '10 août 2026 — 16h42', ip: '196.x.x.x' },
  { id: 'a2', action: 'Consultation', doc: 'CR_Consultation_Seck_20260810.pdf', user: 'Fatou Seck', date: '10 août 2026 — 15h10', ip: '197.x.x.x' },
  { id: 'a3', action: 'Partage', doc: 'Resultat_Biologie_Ndiaye.pdf', user: 'Dr. Sy', date: '08 août 2026 — 11h30', ip: '196.x.x.x' },
  { id: 'a4', action: 'Upload', doc: 'Protocole_Diabete_v3.pdf', user: 'Dr. Sy', date: '01 août 2026 — 09h00', ip: '196.x.x.x' },
  { id: 'a5', action: 'Révocation accès', doc: 'Certificat_Aptitude_Ba.pdf', user: 'Dr. Sy', date: '09 août 2026 — 14h20', ip: '196.x.x.x' },
];

const categoryConfig: Record<Document['category'], { label: string; color: string; bg: string; icon: string }> = {
  ordonnance: { label: 'Ordonnance', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.1)', icon: 'DocumentCheckIcon' },
  compte_rendu: { label: 'Compte rendu', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', icon: 'ClipboardDocumentListIcon' },
  certificat: { label: 'Certificat', color: '#16a34a', bg: '#dcfce7', icon: 'DocumentTextIcon' },
  resultat: { label: 'Résultat', color: '#d97706', bg: '#fef3c7', icon: 'BeakerIcon' },
  imagerie: { label: 'Imagerie', color: 'var(--shifa-cyan)', bg: 'rgba(0,242,195,0.1)', icon: 'PhotoIcon' },
  administratif: { label: 'Administratif', color: '#6b7280', bg: '#f3f4f6', icon: 'FolderIcon' },
  autre: { label: 'Autre', color: '#6b7280', bg: '#f3f4f6', icon: 'DocumentIcon' },
};

const permConfig = { private: { label: 'Privé', color: '#6b7280', bg: '#f3f4f6' }, shared: { label: 'Partagé', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.1)' }, org: { label: 'Organisation', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' } };

export default function ProDocumentsContent() {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const filtered = mockDocs.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || (d.patient ?? '').toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || d.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Documents Professionnels</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Gestion, classification, partage et audit de vos documents médicaux</p>
        </div>
        <button onClick={() => setActiveTab('upload')} className="btn-primary flex items-center gap-2 text-sm px-4 py-2 rounded-lg">
          <Icon name="ArrowUpTrayIcon" className="w-4 h-4" />
          Téléverser un document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total documents', value: mockDocs.length, icon: 'DocumentTextIcon', color: 'var(--shifa-blue)' },
          { label: 'Partagés', value: mockDocs.filter(d => d.permissions === 'shared').length, icon: 'ShareIcon', color: '#8b5cf6' },
          { label: 'Archivés', value: mockDocs.filter(d => d.status === 'archived').length, icon: 'ArchiveBoxIcon', color: '#6b7280' },
          { label: 'Accès audit', value: auditLog.length, icon: 'ClipboardDocumentCheckIcon', color: '#d97706' },
        ].map(kpi => (
          <div key={kpi.label} className="card-base p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}18` }}>
              <Icon name={kpi.icon} className="w-5 h-5" style={{ color: kpi.color }} />
            </div>
            <div>
              <div className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>{kpi.value}</div>
              <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'Tous les documents', icon: 'FolderOpenIcon' },
          { key: 'upload', label: 'Téléverser', icon: 'ArrowUpTrayIcon' },
          { key: 'preview', label: 'Aperçu', icon: 'EyeIcon' },
          { key: 'audit', label: 'Journal d\'accès', icon: 'ClipboardDocumentCheckIcon' },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key as Tab)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all" style={{ background: activeTab === t.key ? 'var(--shifa-blue)' : 'var(--card)', color: activeTab === t.key ? '#fff' : 'var(--muted-foreground)', border: '1px solid var(--border)' }}>
            <Icon name={t.icon} className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* All documents */}
      {activeTab === 'all' && (
        <div>
          <div className="flex gap-3 mb-4 flex-wrap">
            <div className="flex-1 min-w-48 relative">
              <Icon name="MagnifyingGlassIcon" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un document ou patient…" className="w-full pl-9 pr-3 py-2 rounded-lg text-sm" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--shifa-dark)' }} />
            </div>
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--shifa-dark)' }}>
              <option value="all">Toutes catégories</option>
              {Object.entries(categoryConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            {filtered.map(doc => {
              const cat = categoryConfig[doc.category];
              const perm = permConfig[doc.permissions];
              return (
                <div key={doc.id} className="card-base p-4 flex items-center gap-4 flex-wrap cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setSelectedDoc(doc); setActiveTab('preview'); }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: cat.bg }}>
                    <Icon name={cat.icon} className="w-5 h-5" style={{ color: cat.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate" style={{ color: 'var(--shifa-dark)' }}>{doc.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                      {doc.patient ? `Patient : ${doc.patient} — ` : ''}{doc.uploadedAt} — {doc.size} — v{doc.version}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: cat.bg, color: cat.color }}>{cat.label}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: perm.bg, color: perm.color }}>{perm.label}</span>
                    {doc.status === 'archived' && <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: '#f3f4f6', color: '#6b7280' }}>Archivé</span>}
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg" style={{ background: 'var(--background)', border: '1px solid var(--border)' }} onClick={e => { e.stopPropagation(); }}>
                        <Icon name="ArrowDownTrayIcon" className="w-3.5 h-3.5" style={{ color: 'var(--muted-foreground)' }} />
                      </button>
                      <button className="p-1.5 rounded-lg" style={{ background: 'var(--background)', border: '1px solid var(--border)' }} onClick={e => { e.stopPropagation(); }}>
                        <Icon name="ShareIcon" className="w-3.5 h-3.5" style={{ color: 'var(--muted-foreground)' }} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="card-base p-12 text-center">
                <Icon name="DocumentMagnifyingGlassIcon" className="w-10 h-10 mx-auto mb-2" style={{ color: 'var(--muted-foreground)' }} />
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Aucun document trouvé</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload */}
      {activeTab === 'upload' && (
        <div className="card-base p-6 space-y-5">
          <h2 className="font-semibold" style={{ color: 'var(--shifa-dark)' }}>Téléverser un document</h2>
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); }}
            className="rounded-xl border-2 border-dashed p-10 text-center transition-all"
            style={{ borderColor: dragOver ? 'var(--shifa-blue)' : 'var(--border)', background: dragOver ? 'rgba(0,102,255,0.04)' : 'var(--background)' }}
          >
            <Icon name="CloudArrowUpIcon" className="w-12 h-12 mx-auto mb-3" style={{ color: dragOver ? 'var(--shifa-blue)' : 'var(--muted-foreground)' }} />
            <p className="font-medium text-sm" style={{ color: 'var(--shifa-dark)' }}>Glissez-déposez vos fichiers ici</p>
            <p className="text-xs mt-1 mb-4" style={{ color: 'var(--muted-foreground)' }}>PDF, JPEG, PNG, DICOM — max 50 Mo par fichier</p>
            <button className="btn-primary px-4 py-2 rounded-lg text-sm">Parcourir les fichiers</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Catégorie</label>
              <select className="w-full rounded-lg px-3 py-2 text-sm" style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--shifa-dark)' }}>
                {Object.entries(categoryConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Patient associé (optionnel)</label>
              <input className="w-full rounded-lg px-3 py-2 text-sm" style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--shifa-dark)' }} placeholder="Rechercher un patient…" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Permissions d'accès</label>
              <select className="w-full rounded-lg px-3 py-2 text-sm" style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--shifa-dark)' }}>
                <option value="private">Privé — moi uniquement</option>
                <option value="shared">Partagé — avec le patient</option>
                <option value="org">Organisation — équipe soins</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Tags (séparés par virgule)</label>
              <input className="w-full rounded-lg px-3 py-2 text-sm" style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--shifa-dark)' }} placeholder="Ex: suivi, diabète, résultat…" />
            </div>
          </div>
          <button className="btn-primary px-5 py-2 rounded-lg text-sm">Téléverser et classifier</button>
        </div>
      )}

      {/* Preview */}
      {activeTab === 'preview' && (
        <div>
          {!selectedDoc ? (
            <div className="card-base p-12 text-center">
              <Icon name="EyeIcon" className="w-10 h-10 mx-auto mb-2" style={{ color: 'var(--muted-foreground)' }} />
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Sélectionnez un document dans la liste pour l'apercevoir</p>
              <button onClick={() => setActiveTab('all')} className="mt-3 text-sm font-medium" style={{ color: 'var(--shifa-blue)' }}>Voir tous les documents</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 card-base overflow-hidden">
                <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
                  <span className="font-medium text-sm truncate" style={{ color: 'var(--shifa-dark)' }}>{selectedDoc.name}</span>
                  <div className="flex gap-2">
                    <button className="p-1.5 rounded-lg" style={{ background: 'var(--background)', border: '1px solid var(--border)' }}>
                      <Icon name="ArrowDownTrayIcon" className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                    </button>
                    <button className="p-1.5 rounded-lg" style={{ background: 'var(--background)', border: '1px solid var(--border)' }}>
                      <Icon name="PrinterIcon" className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-center" style={{ minHeight: 400, background: '#f8fafc' }}>
                  <div className="text-center">
                    <Icon name={categoryConfig[selectedDoc.category].icon} className="w-16 h-16 mx-auto mb-3" style={{ color: categoryConfig[selectedDoc.category].color }} />
                    <p className="font-medium text-sm" style={{ color: 'var(--shifa-dark)' }}>{selectedDoc.name}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Aperçu disponible en Phase 3 (intégration viewer)</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="card-base p-4">
                  <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--shifa-dark)' }}>Informations</h3>
                  <div className="space-y-2 text-sm">
                    {[
                      ['Catégorie', categoryConfig[selectedDoc.category].label],
                      ['Version', `v${selectedDoc.version}`],
                      ['Taille', selectedDoc.size],
                      ['Ajouté le', selectedDoc.uploadedAt],
                      ['Par', selectedDoc.uploadedBy],
                      ['Permissions', permConfig[selectedDoc.permissions].label],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span style={{ color: 'var(--muted-foreground)' }}>{k}</span>
                        <span className="font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card-base p-4">
                  <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--shifa-dark)' }}>Partagé avec</h3>
                  {selectedDoc.sharedWith.length === 0 ? (
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Non partagé</p>
                  ) : (
                    <div className="space-y-1">
                      {selectedDoc.sharedWith.map(s => (
                        <div key={s} className="flex items-center justify-between">
                          <span className="text-xs" style={{ color: 'var(--shifa-dark)' }}>{s}</span>
                          <button className="text-xs" style={{ color: '#dc2626' }}>Révoquer</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button className="mt-2 text-xs font-medium" style={{ color: 'var(--shifa-blue)' }}>+ Ajouter un accès</button>
                </div>
                <div className="card-base p-4">
                  <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--shifa-dark)' }}>Tags</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedDoc.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Audit */}
      {activeTab === 'audit' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold" style={{ color: 'var(--shifa-dark)' }}>Journal d'accès aux documents</h2>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--shifa-dark)' }}>
              <Icon name="ArrowDownTrayIcon" className="w-4 h-4" />
              Exporter
            </button>
          </div>
          <div className="card-base p-4 flex items-start gap-3 mb-4" style={{ borderLeft: '4px solid var(--shifa-blue)' }}>
            <Icon name="ShieldCheckIcon" className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--shifa-blue)' }} />
            <p className="text-sm" style={{ color: 'var(--shifa-dark)' }}>Tous les accès aux documents médicaux sont enregistrés de manière immuable conformément aux exigences réglementaires.</p>
          </div>
          {auditLog.map(log => (
            <div key={log.id} className="card-base p-4 flex items-center gap-4 flex-wrap">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,102,255,0.1)' }}>
                <Icon name="ClipboardDocumentCheckIcon" className="w-4 h-4" style={{ color: 'var(--shifa-blue)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm" style={{ color: 'var(--shifa-dark)' }}>
                  <span className="font-bold">{log.action}</span> — {log.doc}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Par {log.user} — {log.date} — IP: {log.ip}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
