'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const modules = [
  { id: 'mod-001', name: 'Consultations', category: 'Clinique', icon: 'ClipboardDocumentListIcon', color: 'var(--shifa-blue)', active: true, users: 48, description: 'Gestion complète des consultations médicales.' },
  { id: 'mod-002', name: 'Dossier Patient', category: 'Clinique', icon: 'FolderOpenIcon', color: 'var(--shifa-blue)', active: true, users: 48, description: 'Dossier de santé longitudinal unifié.' },
  { id: 'mod-003', name: 'Prescriptions', category: 'Clinique', icon: 'DocumentTextIcon', color: 'var(--shifa-green)', active: true, users: 32, description: 'Ordonnances numériques et suivi des traitements.' },
  { id: 'mod-004', name: 'Résultats & Biologie', category: 'Diagnostique', icon: 'BeakerIcon', color: 'var(--shifa-purple)', active: true, users: 18, description: 'Intégration des résultats de laboratoire.' },
  { id: 'mod-005', name: 'Imagerie', category: 'Diagnostique', icon: 'PhotoIcon', color: 'var(--shifa-purple)', active: true, users: 12, description: 'Gestion des examens d\'imagerie médicale (DICOM).' },
  { id: 'mod-006', name: 'Urgences', category: 'Hospitalier', icon: 'ExclamationTriangleIcon', color: 'var(--shifa-red)', active: true, users: 24, description: 'Prise en charge et triage aux urgences.' },
  { id: 'mod-007', name: 'Hospitalisation', category: 'Hospitalier', icon: 'BuildingOffice2Icon', color: 'var(--shifa-amber)', active: true, users: 36, description: 'Gestion des admissions et des lits.' },
  { id: 'mod-008', name: 'Bloc Opératoire', category: 'Hospitalier', icon: 'ScissorsIcon', color: 'var(--shifa-amber)', active: true, users: 8, description: 'Planification et suivi des interventions chirurgicales.' },
  { id: 'mod-009', name: 'Messagerie Sécurisée', category: 'Communication', icon: 'ChatBubbleLeftRightIcon', color: 'var(--shifa-cyan)', active: true, users: 48, description: 'Messagerie chiffrée entre professionnels.' },
  { id: 'mod-010', name: 'Téléconsultation', category: 'Communication', icon: 'VideoCameraIcon', color: 'var(--shifa-cyan)', active: true, users: 28, description: 'Consultations à distance sécurisées.' },
  { id: 'mod-011', name: 'Pharmacie', category: 'Pharmacie', icon: 'BeakerIcon', color: 'var(--shifa-green)', active: false, users: 0, description: 'Gestion des stocks et dispensation médicamenteuse.' },
  { id: 'mod-012', name: 'Maternité', category: 'Spécialité', icon: 'HeartIcon', color: 'var(--shifa-purple)', active: true, users: 14, description: 'Suivi grossesse, accouchement et néonatologie.' },
  { id: 'mod-013', name: 'Pédiatrie', category: 'Spécialité', icon: 'UserIcon', color: 'var(--shifa-green)', active: false, users: 0, description: 'Suivi spécialisé pour les patients pédiatriques.' },
  { id: 'mod-014', name: 'SHIFA AI', category: 'Intelligence', icon: 'SparklesIcon', color: 'var(--shifa-blue)', active: false, users: 0, description: 'Assistance IA pour les professionnels de santé.' },
  { id: 'mod-015', name: 'Audit & Conformité', category: 'Administration', icon: 'ClipboardDocumentCheckIcon', color: 'var(--shifa-dark)', active: true, users: 4, description: 'Traçabilité et conformité réglementaire.' },
];

export default function ModuleGrid() {
  const [activeModules, setActiveModules] = useState<Record<string, boolean>>(
    Object.fromEntries(modules.map(m => [m.id, m.active]))
  );
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = ['all', ...new Set(modules.map(m => m.category))];
  const filtered = modules.filter(m => categoryFilter === 'all' || m.category === categoryFilter);

  const toggleModule = (id: string) => {
    setActiveModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const activeCount = Object.values(activeModules).filter(Boolean).length;

  return (
    <div className="card-base">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>Modules de l'établissement</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            <span className="font-semibold" style={{ color: 'var(--shifa-green)' }}>{activeCount}</span> actifs sur {modules.length} disponibles
          </p>
        </div>
        <button className="btn-secondary text-sm px-4 py-2">
          <Icon name="PuzzlePieceIcon" size={15} />
          Catalogue complet
        </button>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-thin pb-1">
        {categories.map((cat) => (
          <button
            key={`modcat-${cat}`}
            onClick={() => setCategoryFilter(cat)}
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
            style={{
              backgroundColor: categoryFilter === cat ? 'var(--shifa-blue)' : 'var(--muted)',
              color: categoryFilter === cat ? 'white' : 'var(--muted-foreground)',
            }}
          >
            {cat === 'all' ? 'Tous' : cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((mod) => {
          const isActive = activeModules[mod.id];
          return (
            <div
              key={mod.id}
              className="flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-200"
              style={{
                backgroundColor: isActive ? `${mod.color}08` : 'var(--background)',
                borderColor: isActive ? `${mod.color}30` : 'var(--border)',
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: isActive ? `${mod.color}15` : 'var(--muted)',
                  border: `1.5px solid ${isActive ? mod.color : 'var(--border)'}25`,
                }}
              >
                <Icon
                  name={mod.icon as any}
                  size={17}
                  style={{ color: isActive ? mod.color : 'var(--muted-foreground)' } as any}
                  className=""
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold truncate" style={{ color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                    {mod.name}
                  </p>
                  {/* Toggle switch */}
                  <button
                    onClick={() => toggleModule(mod.id)}
                    className="relative shrink-0 w-9 h-5 rounded-full transition-all duration-200 focus:outline-none"
                    style={{ backgroundColor: isActive ? mod.color : 'var(--border)' }}
                    aria-label={isActive ? `Désactiver ${mod.name}` : `Activer ${mod.name}`}
                  >
                    <span
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200"
                      style={{ left: isActive ? '18px' : '2px' }}
                    />
                  </button>
                </div>
                <p className="text-xs mt-0.5 leading-relaxed line-clamp-1" style={{ color: 'var(--muted-foreground)' }}>
                  {mod.description}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span
                    className="badge-base text-xs"
                    style={{ backgroundColor: `${mod.color}10`, color: mod.color, border: `1px solid ${mod.color}20`, fontSize: '9px' }}
                  >
                    {mod.category}
                  </span>
                  {isActive && mod.users > 0 && (
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>
                      {mod.users} utilisateurs
                    </span>
                  )}
                  {!isActive && (
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>Non activé</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}