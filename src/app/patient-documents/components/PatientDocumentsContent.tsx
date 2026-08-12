'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type DocCategory = 'all' | 'ordonnances' | 'resultats' | 'comptes-rendus' | 'certificats' | 'imagerie' | 'autres';

interface Document {
  id: string;
  name: string;
  category: DocCategory;
  date: string;
  size: string;
  source: string;
  status: 'verified' | 'pending' | 'draft';
}

const mockDocs: Document[] = [
  { id: '1', name: 'Ordonnance — Dr. Sy — 08/08/2026', category: 'ordonnances', date: '08/08/2026', size: '124 Ko', source: 'Dr. Mohamed Sy', status: 'verified' },
  { id: '2', name: 'Bilan sanguin complet — Labo Central', category: 'resultats', date: '05/08/2026', size: '340 Ko', source: 'Laboratoire Central', status: 'verified' },
  { id: '3', name: 'Compte-rendu consultation — Cardiologie', category: 'comptes-rendus', date: '01/08/2026', size: '210 Ko', source: 'CHU Saint-Louis', status: 'verified' },
  { id: '4', name: 'Certificat médical — Aptitude sport', category: 'certificats', date: '28/07/2026', size: '98 Ko', source: 'Dr. Fatou Ndiaye', status: 'verified' },
  { id: '5', name: 'Radio thorax — Face + Profil', category: 'imagerie', date: '20/07/2026', size: '2.4 Mo', source: 'Centre Imagerie Dakar', status: 'verified' },
  { id: '6', name: 'Ordonnance renouvellement — Hypertension', category: 'ordonnances', date: '15/07/2026', size: '118 Ko', source: 'Dr. Mohamed Sy', status: 'verified' },
  { id: '7', name: 'Résultats glycémie à jeun', category: 'resultats', date: '10/07/2026', size: '156 Ko', source: 'Laboratoire Central', status: 'pending' },
  { id: '8', name: 'Attestation vaccination COVID-19', category: 'certificats', date: '01/06/2026', size: '88 Ko', source: 'Ministère de la Santé', status: 'verified' },
];

const categories: { key: DocCategory; label: string; icon: string }[] = [
  { key: 'all', label: 'Tous', icon: 'FolderOpenIcon' },
  { key: 'ordonnances', label: 'Ordonnances', icon: 'DocumentCheckIcon' },
  { key: 'resultats', label: 'Résultats', icon: 'BeakerIcon' },
  { key: 'comptes-rendus', label: 'Comptes-rendus', icon: 'ClipboardDocumentListIcon' },
  { key: 'certificats', label: 'Certificats', icon: 'AcademicCapIcon' },
  { key: 'imagerie', label: 'Imagerie', icon: 'PhotoIcon' },
  { key: 'autres', label: 'Autres', icon: 'DocumentIcon' },
];

const statusConfig = {
  verified: { label: 'Vérifié', color: 'var(--shifa-cyan)', bg: 'rgba(0,242,195,0.1)' },
  pending: { label: 'En attente', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  draft: { label: 'Brouillon', color: 'var(--muted-foreground)', bg: 'var(--muted)' },
};

const categoryIcons: Record<string, string> = {
  ordonnances: 'DocumentCheckIcon',
  resultats: 'BeakerIcon',
  'comptes-rendus': 'ClipboardDocumentListIcon',
  certificats: 'AcademicCapIcon',
  imagerie: 'PhotoIcon',
  autres: 'DocumentIcon',
};

export default function PatientDocumentsContent() {
  const [activeCategory, setActiveCategory] = useState<DocCategory>('all');
  const [search, setSearch] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const filtered = mockDocs.filter(d => {
    const matchCat = activeCategory === 'all' || d.category === activeCategory;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.source.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Mes Documents</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Tous vos documents médicaux centralisés et sécurisés</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
        >
          <Icon name="ArrowUpTrayIcon" size={16} />
          Importer un document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total documents', value: '8', icon: 'DocumentTextIcon', color: 'var(--shifa-blue)' },
          { label: 'Vérifiés', value: '7', icon: 'ShieldCheckIcon', color: 'var(--shifa-cyan)' },
          { label: 'Ce mois', value: '3', icon: 'CalendarDaysIcon', color: '#8b5cf6' },
          { label: 'Stockage utilisé', value: '3.6 Mo', icon: 'CircleStackIcon', color: '#f59e0b' },
        ].map(stat => (
          <div key={stat.label} className="card-base p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${stat.color}18` }}>
              <Icon name={stat.icon as any} size={20} style={{ color: stat.color } as any} className="" />
            </div>
            <div>
              <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>{stat.value}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Left: Categories */}
        <div className="lg:w-52 shrink-0">
          <div className="card-base p-2">
            <p className="section-label px-3 mb-2">Catégories</p>
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5"
                style={{
                  backgroundColor: activeCategory === cat.key ? 'var(--shifa-blue)' : 'transparent',
                  color: activeCategory === cat.key ? 'white' : 'var(--foreground)',
                }}
              >
                <Icon name={cat.icon as any} size={16} />
                <span className="flex-1 text-left">{cat.label}</span>
                <span className="text-xs opacity-70">
                  {cat.key === 'all' ? mockDocs.length : mockDocs.filter(d => d.category === cat.key).length}
                </span>
              </button>
            ))}
          </div>

          {/* Upload zone */}
          <div
            className="mt-4 rounded-2xl border-2 border-dashed p-5 text-center cursor-pointer transition-all"
            style={{
              borderColor: dragOver ? 'var(--shifa-blue)' : 'var(--border)',
              backgroundColor: dragOver ? 'rgba(0,102,255,0.05)' : 'var(--card)',
            }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={() => setDragOver(false)}
          >
            <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,102,255,0.1)' }}>
              <Icon name="CloudArrowUpIcon" size={22} style={{ color: 'var(--shifa-blue)' } as any} className="" />
            </div>
            <p className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>Glisser-déposer</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>PDF, JPG, PNG — max 10 Mo</p>
          </div>
        </div>

        {/* Right: Document list */}
        <div className="flex-1 min-w-0">
          {/* Search */}
          <div className="relative mb-4">
            <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un document..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                color: 'var(--foreground)',
              }}
            />
          </div>

          {/* Document list */}
          <div className="flex flex-col gap-2">
            {filtered.length === 0 ? (
              <div className="card-base p-12 text-center">
                <Icon name="DocumentMagnifyingGlassIcon" size={40} className="mx-auto mb-3 text-muted-foreground opacity-40" />
                <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Aucun document trouvé</p>
                <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Essayez une autre catégorie ou importez un document</p>
              </div>
            ) : filtered.map(doc => {
              const st = statusConfig[doc.status];
              const iconName = categoryIcons[doc.category] || 'DocumentIcon';
              return (
                <div
                  key={doc.id}
                  className="card-base p-4 flex items-center gap-4 hover:shadow-shifa transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.08)' }}>
                    <Icon name={iconName as any} size={20} style={{ color: 'var(--shifa-blue)' } as any} className="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{doc.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{doc.source} · {doc.date} · {doc.size}</p>
                  </div>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                    style={{ color: st.color, backgroundColor: st.bg }}
                  >
                    {st.label}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Télécharger">
                      <Icon name="ArrowDownTrayIcon" size={15} className="text-muted-foreground" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Partager">
                      <Icon name="ShareIcon" size={15} className="text-muted-foreground" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Plus">
                      <Icon name="EllipsisVerticalIcon" size={15} className="text-muted-foreground" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
