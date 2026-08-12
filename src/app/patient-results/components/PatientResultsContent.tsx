'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type ResultTab = 'all' | 'biologie' | 'imagerie' | 'anatomopathologie';

interface Result {
  id: string;
  date: string;
  type: 'biologie' | 'imagerie' | 'anatomopathologie';
  title: string;
  lab: string;
  prescribedBy: string;
  status: 'normal' | 'abnormal' | 'critical' | 'pending';
  values?: { name: string; value: string; unit: string; ref: string; flag?: 'H' | 'L' | 'N' }[];
}

const mockResults: Result[] = [
  {
    id: 'R001', date: '06/08/2026', type: 'biologie', title: 'Bilan sanguin complet', lab: 'Laboratoire Central Dakar', prescribedBy: 'Dr. Mohamed Sy', status: 'abnormal',
    values: [
      { name: 'Hémoglobine', value: '11.2', unit: 'g/dL', ref: '12–16', flag: 'L' },
      { name: 'Globules blancs', value: '7.8', unit: '10³/µL', ref: '4–10', flag: 'N' },
      { name: 'Plaquettes', value: '245', unit: '10³/µL', ref: '150–400', flag: 'N' },
      { name: 'Glycémie', value: '5.4', unit: 'mmol/L', ref: '3.9–5.6', flag: 'N' },
      { name: 'Créatinine', value: '78', unit: 'µmol/L', ref: '44–97', flag: 'N' },
    ],
  },
  {
    id: 'R002', date: '20/07/2026', type: 'imagerie', title: 'Radiographie thorax F+P', lab: 'Centre Imagerie Dakar', prescribedBy: 'Dr. Aminata Diallo', status: 'normal',
  },
  {
    id: 'R003', date: '10/07/2026', type: 'biologie', title: 'Bilan lipidique', lab: 'Laboratoire Central Dakar', prescribedBy: 'Dr. Fatou Ndiaye', status: 'abnormal',
    values: [
      { name: 'Cholestérol total', value: '6.2', unit: 'mmol/L', ref: '<5.2', flag: 'H' },
      { name: 'LDL', value: '4.1', unit: 'mmol/L', ref: '<3.4', flag: 'H' },
      { name: 'HDL', value: '1.1', unit: 'mmol/L', ref: '>1.0', flag: 'N' },
      { name: 'Triglycérides', value: '1.8', unit: 'mmol/L', ref: '<1.7', flag: 'H' },
    ],
  },
  { id: 'R004', date: '01/07/2026', type: 'imagerie', title: 'Échographie abdominale', lab: 'Centre Imagerie Dakar', prescribedBy: 'Dr. Mohamed Sy', status: 'normal' },
  { id: 'R005', date: '15/06/2026', type: 'biologie', title: 'Sérologie hépatite B', lab: 'Laboratoire Pasteur', prescribedBy: 'Dr. Mohamed Sy', status: 'normal' },
  { id: 'R006', date: '10/06/2026', type: 'anatomopathologie', title: 'Biopsie cutanée', lab: 'Laboratoire Anatomopathologie CHU', prescribedBy: 'Dr. Ibrahima Fall', status: 'pending' },
];

const typeConfig = {
  biologie: { label: 'Biologie', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.1)', icon: 'BeakerIcon' },
  imagerie: { label: 'Imagerie', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', icon: 'PhotoIcon' },
  anatomopathologie: { label: 'Anatomopathologie', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: 'MagnifyingGlassIcon' },
};

const statusConfig = {
  normal: { label: 'Normal', color: '#16a34a', bg: '#dcfce7' },
  abnormal: { label: 'Anomalie', color: '#d97706', bg: '#fef3c7' },
  critical: { label: 'Critique', color: '#dc2626', bg: '#fee2e2' },
  pending: { label: 'En attente', color: '#6b7280', bg: '#f3f4f6' },
};

const flagConfig = { H: { color: '#dc2626', label: 'Élevé' }, L: { color: '#2563eb', label: 'Bas' }, N: { color: '#16a34a', label: 'Normal' } };

export default function PatientResultsContent() {
  const [activeTab, setActiveTab] = useState<ResultTab>('all');
  const [selected, setSelected] = useState<Result | null>(null);

  const tabs: { key: ResultTab; label: string; icon: string }[] = [
    { key: 'all', label: 'Tous', icon: 'ClipboardDocumentListIcon' },
    { key: 'biologie', label: 'Biologie', icon: 'BeakerIcon' },
    { key: 'imagerie', label: 'Imagerie', icon: 'PhotoIcon' },
    { key: 'anatomopathologie', label: 'Anatomopathologie', icon: 'MagnifyingGlassIcon' },
  ];

  const filtered = activeTab === 'all' ? mockResults : mockResults.filter(r => r.type === activeTab);

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Mes Résultats</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Résultats de biologie, imagerie et anatomopathologie</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total résultats', value: '6', icon: 'ClipboardDocumentListIcon', color: 'var(--shifa-blue)' },
          { label: 'Avec anomalie', value: '2', icon: 'ExclamationTriangleIcon', color: '#f59e0b' },
          { label: 'En attente', value: '1', icon: 'ClockIcon', color: '#6b7280' },
          { label: 'Normaux', value: '3', icon: 'CheckCircleIcon', color: '#16a34a' },
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
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px"
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
          {filtered.map(r => {
            const tc = typeConfig[r.type];
            const sc = statusConfig[r.status];
            return (
              <button
                key={r.id}
                onClick={() => setSelected(r)}
                className="w-full text-left card-base p-4 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: tc.bg }}>
                      <Icon name={tc.icon as any} size={18} style={{ color: tc.color } as any} className="" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{r.title}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.lab}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Prescrit par {r.prescribedBy}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>{r.date}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: sc.bg, color: sc.color }}>{sc.label}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail */}
        <div className="card-base p-5">
          {selected ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{selected.title}</h3>
                <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-muted">
                  <Icon name="XMarkIcon" size={16} className="text-muted-foreground" />
                </button>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}><span className="font-medium">Date :</span> {selected.date}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}><span className="font-medium">Laboratoire :</span> {selected.lab}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}><span className="font-medium">Prescrit par :</span> {selected.prescribedBy}</p>
              </div>
              {selected.values && selected.values.length > 0 && (
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Valeurs</p>
                  <div className="space-y-2">
                    {selected.values.map(v => (
                      <div key={v.name} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                        <div className="min-w-0">
                          <p className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{v.name}</p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Réf: {v.ref} {v.unit}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{v.value}</span>
                          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{v.unit}</span>
                          {v.flag && (
                            <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${flagConfig[v.flag].color}18`, color: flagConfig[v.flag].color }}>{v.flag}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selected.type === 'imagerie' && (
                <div className="mt-4 p-3 rounded-xl text-center" style={{ backgroundColor: 'var(--muted)' }}>
                  <Icon name="PhotoIcon" size={32} className="mx-auto mb-2 text-muted-foreground opacity-40" />
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Images disponibles via le portail DICOM</p>
                </div>
              )}
              <button className="btn-primary w-full text-sm py-2 mt-4 flex items-center justify-center gap-2">
                <Icon name="ArrowDownTrayIcon" size={16} /> Télécharger le rapport
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <Icon name="BeakerIcon" size={36} className="mb-3 text-muted-foreground opacity-30" />
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Sélectionnez un résultat pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
