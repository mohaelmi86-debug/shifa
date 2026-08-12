import React from 'react';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

const documents = [
  { id: 'doc-001', title: 'Ordonnance — Dr. Sy', type: 'Prescription', date: '05 août 2026', icon: 'DocumentTextIcon', color: 'var(--shifa-blue)' },
  { id: 'doc-002', title: 'Résultats d\'analyse', type: 'Biologie', date: '28 juil. 2026', icon: 'BeakerIcon', color: 'var(--shifa-purple)' },
  { id: 'doc-003', title: 'Compte rendu radio', type: 'Imagerie', date: '15 juil. 2026', icon: 'PhotoIcon', color: 'var(--shifa-amber)' },
  { id: 'doc-004', title: 'Carnet de vaccination', type: 'Vaccinations', date: '02 juin 2026', icon: 'ShieldCheckIcon', color: 'var(--shifa-green)' },
];

export default function RecentDocuments() {
  return (
    <div className="card-base">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>Documents récents</h2>
        <Link href="/dossier-de-sant" className="text-xs font-semibold transition-colors hover:underline" style={{ color: 'var(--shifa-blue)' }}>
          Tout voir
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 hover:shadow-shifa cursor-pointer"
            style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${doc.color}15`, border: `1.5px solid ${doc.color}25` }}
            >
              <Icon name={doc.icon as any} size={16} style={{ color: doc.color } as any} className="" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{doc.title}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs" style={{ color: doc.color, fontSize: '10px', fontWeight: 600 }}>{doc.type}</span>
                <span className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>· {doc.date}</span>
              </div>
            </div>
            <button className="p-1.5 rounded-lg transition-colors hover:bg-muted" title="Télécharger le document">
              <Icon name="ArrowDownTrayIcon" size={14} className="text-muted-foreground" />
            </button>
          </div>
        ))}
      </div>

      {/* SHIFA Card mini */}
      <div
        className="mt-4 p-4 rounded-2xl relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0A1B3D 0%, #0066FF 100%)' }}
      >
        <div className="blob-accent absolute -top-4 -right-4 w-20 h-20 rounded-full" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-white">Ma carte SHIFA</p>
            <p className="font-mono text-white/70 mt-0.5" style={{ fontSize: '9px' }}>SH-2-225-FR-2025-7K4D</p>
            <span className="badge-base status-verified mt-1.5" style={{ fontSize: '9px' }}>
              <Icon name="CheckCircleIcon" size={10} />
              Vérifiée
            </span>
          </div>
          <button className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 hover:opacity-90 active:scale-95" style={{ backgroundColor: 'var(--shifa-cyan)', color: 'var(--shifa-dark)' }}>
            Afficher
          </button>
        </div>
      </div>
    </div>
  );
}