'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type ConsultTab = 'all' | 'teleconsult' | 'cabinet' | 'urgences';

interface Consultation {
  id: string;
  date: string;
  type: 'teleconsult' | 'cabinet' | 'urgences';
  doctor: string;
  specialty: string;
  facility: string;
  motif: string;
  diagnostic: string;
  status: 'completed' | 'cancelled' | 'pending';
  hasPrescription: boolean;
  hasDocuments: boolean;
}

const mockConsultations: Consultation[] = [
  { id: 'C001', date: '08/08/2026', type: 'cabinet', doctor: 'Dr. Mohamed Sy', specialty: 'Médecine générale', facility: 'Cabinet Médical Plateau', motif: 'Douleurs abdominales', diagnostic: 'Gastrite aiguë', status: 'completed', hasPrescription: true, hasDocuments: true },
  { id: 'C002', date: '01/08/2026', type: 'teleconsult', doctor: 'Dr. Fatou Ndiaye', specialty: 'Cardiologie', facility: 'CHU Saint-Louis (Téléconsultation)', motif: 'Suivi hypertension', diagnostic: 'HTA contrôlée', status: 'completed', hasPrescription: true, hasDocuments: false },
  { id: 'C003', date: '20/07/2026', type: 'cabinet', doctor: 'Dr. Ibrahima Fall', specialty: 'Dermatologie', facility: 'Clinique Pasteur', motif: 'Éruption cutanée', diagnostic: 'Eczéma atopique', status: 'completed', hasPrescription: true, hasDocuments: true },
  { id: 'C004', date: '10/07/2026', type: 'urgences', doctor: 'Dr. Aminata Diallo', specialty: 'Urgences', facility: 'CHU Fann — Urgences', motif: 'Douleur thoracique', diagnostic: 'Douleur musculaire intercostale', status: 'completed', hasPrescription: false, hasDocuments: true },
  { id: 'C005', date: '25/06/2026', type: 'teleconsult', doctor: 'Dr. Oumar Bâ', specialty: 'Psychiatrie', facility: 'SHIFA Téléconsultation', motif: 'Anxiété — suivi', diagnostic: 'Trouble anxieux généralisé', status: 'completed', hasPrescription: true, hasDocuments: false },
  { id: 'C006', date: '15/06/2026', type: 'cabinet', doctor: 'Dr. Mohamed Sy', specialty: 'Médecine générale', facility: 'Cabinet Médical Plateau', motif: 'Bilan annuel', diagnostic: 'Bilan satisfaisant', status: 'completed', hasPrescription: false, hasDocuments: true },
  { id: 'C007', date: '05/06/2026', type: 'cabinet', doctor: 'Dr. Rokhaya Sow', specialty: 'Gynécologie', facility: 'Clinique de la Madeleine', motif: 'Consultation de routine', diagnostic: 'RAS', status: 'cancelled', hasPrescription: false, hasDocuments: false },
];

const typeConfig = {
  teleconsult: { label: 'Téléconsultation', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.1)', icon: 'VideoCameraIcon' },
  cabinet: { label: 'Cabinet', color: 'var(--shifa-cyan)', bg: 'rgba(0,242,195,0.1)', icon: 'BuildingOffice2Icon' },
  urgences: { label: 'Urgences', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: 'BoltIcon' },
};

const statusConfig = {
  completed: { label: 'Terminée', color: '#16a34a', bg: '#dcfce7' },
  cancelled: { label: 'Annulée', color: '#dc2626', bg: '#fee2e2' },
  pending: { label: 'En attente', color: '#d97706', bg: '#fef3c7' },
};

export default function PatientConsultationsContent() {
  const [activeTab, setActiveTab] = useState<ConsultTab>('all');
  const [selected, setSelected] = useState<Consultation | null>(null);

  const tabs: { key: ConsultTab; label: string; icon: string }[] = [
    { key: 'all', label: 'Toutes', icon: 'ClipboardDocumentListIcon' },
    { key: 'cabinet', label: 'Cabinet', icon: 'BuildingOffice2Icon' },
    { key: 'teleconsult', label: 'Téléconsultation', icon: 'VideoCameraIcon' },
    { key: 'urgences', label: 'Urgences', icon: 'BoltIcon' },
  ];

  const filtered = activeTab === 'all' ? mockConsultations : mockConsultations.filter(c => c.type === activeTab);

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Mes Consultations</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Historique complet de vos consultations médicales</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total consultations', value: '7', icon: 'ClipboardDocumentListIcon', color: 'var(--shifa-blue)' },
          { label: 'Cette année', value: '6', icon: 'CalendarDaysIcon', color: 'var(--shifa-cyan)' },
          { label: 'Téléconsultations', value: '2', icon: 'VideoCameraIcon', color: '#8b5cf6' },
          { label: 'Ordonnances émises', value: '4', icon: 'DocumentCheckIcon', color: '#f59e0b' },
        ].map(stat => (
          <div key={stat.label} className="card-base p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${stat.color}18` }}>
              <Icon name={stat.icon as any} size={20} style={{ color: stat.color } as any} className="" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>{stat.value}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${activeTab === tab.key ? 'border-shifa-blue text-shifa-blue' : 'border-transparent'}`}
            style={{ color: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)', borderColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'transparent' }}
          >
            <Icon name={tab.icon as any} size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map(c => {
            const tc = typeConfig[c.type];
            const sc = statusConfig[c.status];
            return (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className={`w-full text-left card-base p-4 transition-all hover:shadow-md ${selected?.id === c.id ? 'ring-2' : ''}`}
                style={{ ringColor: 'var(--shifa-blue)' } as any}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: tc.bg }}>
                      <Icon name={tc.icon as any} size={18} style={{ color: tc.color } as any} className="" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{c.doctor}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.specialty} — {c.facility}</p>
                      <p className="text-xs mt-1 font-medium" style={{ color: 'var(--foreground)' }}>{c.motif}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>{c.date}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: sc.bg, color: sc.color }}>{sc.label}</span>
                  </div>
                </div>
                {(c.hasPrescription || c.hasDocuments) && (
                  <div className="flex gap-2 mt-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                    {c.hasPrescription && (
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)' }}>
                        <Icon name="DocumentCheckIcon" size={12} /> Ordonnance
                      </span>
                    )}
                    {c.hasDocuments && (
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(0,242,195,0.08)', color: 'var(--shifa-cyan)' }}>
                        <Icon name="PaperClipIcon" size={12} /> Documents
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="card-base p-12 text-center">
              <Icon name="ClipboardDocumentListIcon" size={40} className="mx-auto mb-3 text-muted-foreground opacity-40" />
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Aucune consultation dans cette catégorie</p>
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div className="card-base p-5">
          {selected ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>Détail de la consultation</h3>
                <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-muted">
                  <Icon name="XMarkIcon" size={16} className="text-muted-foreground" />
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Référence', value: selected.id },
                  { label: 'Date', value: selected.date },
                  { label: 'Type', value: typeConfig[selected.type].label },
                  { label: 'Médecin', value: selected.doctor },
                  { label: 'Spécialité', value: selected.specialty },
                  { label: 'Établissement', value: selected.facility },
                  { label: 'Motif', value: selected.motif },
                  { label: 'Diagnostic', value: selected.diagnostic },
                ].map(row => (
                  <div key={row.label}>
                    <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--muted-foreground)' }}>{row.label}</p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{row.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2 mt-5">
                {selected.hasPrescription && (
                  <button className="btn-primary text-sm py-2 flex items-center justify-center gap-2">
                    <Icon name="DocumentCheckIcon" size={16} /> Voir l'ordonnance
                  </button>
                )}
                {selected.hasDocuments && (
                  <button className="btn-secondary text-sm py-2 flex items-center justify-center gap-2">
                    <Icon name="PaperClipIcon" size={16} /> Documents joints
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <Icon name="CursorArrowRaysIcon" size={36} className="mb-3 text-muted-foreground opacity-30" />
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Sélectionnez une consultation pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
