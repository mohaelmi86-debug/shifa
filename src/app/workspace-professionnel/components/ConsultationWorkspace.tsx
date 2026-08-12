'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const tabs = [
  { key: 'tab-motif', label: 'Motif' },
  { key: 'tab-anamnese', label: 'Anamnèse' },
  { key: 'tab-constantes', label: 'Constantes' },
  { key: 'tab-examen', label: 'Examen' },
  { key: 'tab-evaluation', label: 'Évaluation' },
  { key: 'tab-prescription', label: 'Prescription' },
  { key: 'tab-documents', label: 'Documents' },
];

export default function ConsultationWorkspace() {
  const [activeTab, setActiveTab] = useState('tab-motif');
  const [motif, setMotif] = useState('Douleurs abdominales depuis 2 jours.');
  const [ta, setTa] = useState('120/80');
  const [pouls, setPouls] = useState('78');
  const [temp, setTemp] = useState('37.2');
  const [poids, setPoids] = useState('85');
  const [observations, setObservations] = useState('Abdomen souple, sensible à la palpation.');
  const [isSaving, setIsSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  const handleSave = () => {
    setIsSaving(true);
    // Backend integration point: PATCH /api/consultations/:id — save consultation draft
    setTimeout(() => {
      setIsSaving(false);
      setSavedMsg('Brouillon enregistré ✓');
      setTimeout(() => setSavedMsg(''), 3000);
    }, 1000);
  };

  return (
    <div className="card-base border-2" style={{ borderColor: 'rgba(0, 102, 255, 0.15)' }}>
      {/* Patient header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
          >
            KA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold" style={{ color: 'var(--foreground)' }}>Kwame Asante</p>
              <span className="badge-base status-completed">En consultation</span>
            </div>
            <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--muted-foreground)' }}>SH-1-233-GH-2025-4Q7R · 41 ans · H</p>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1">
                <Icon name="ExclamationTriangleIcon" size={12} style={{ color: 'var(--shifa-amber)' } as any} className="" />
                <span className="text-xs font-medium" style={{ color: 'var(--shifa-amber)' }}>Diabète type 2</span>
              </div>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>· Aucune allergie connue</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {savedMsg || 'Consultation en cours'}
          </span>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-secondary text-sm px-4 py-2 disabled:opacity-60"
          >
            {isSaving ? <Icon name="ArrowPathIcon" size={14} className="animate-spin" /> : <Icon name="DocumentArrowDownIcon" size={14} />}
            Enregistrer brouillon
          </button>
          <button className="btn-primary text-sm px-4 py-2">
            <Icon name="CheckBadgeIcon" size={15} />
            Signer et clôturer
          </button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin pb-1 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`tab-base shrink-0 ${activeTab === tab.key ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="animate-fade-in">
        {activeTab === 'tab-motif' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Motif de consultation</label>
              <textarea
                className="input-field resize-none"
                rows={4}
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                placeholder="Décrivez le motif de la consultation..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Observations préliminaires</label>
              <textarea
                className="input-field resize-none"
                rows={4}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Observations cliniques initiales..."
              />
            </div>
          </div>
        )}

        {activeTab === 'tab-constantes' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: 'ta', label: 'Tension artérielle', value: ta, setter: setTa, unit: 'mmHg', placeholder: '120/80' },
              { key: 'pouls', label: 'Pouls', value: pouls, setter: setPouls, unit: 'bpm', placeholder: '72' },
              { key: 'temp', label: 'Température', value: temp, setter: setTemp, unit: '°C', placeholder: '37.0' },
              { key: 'poids', label: 'Poids', value: poids, setter: setPoids, unit: 'kg', placeholder: '70' },
            ].map((field) => (
              <div key={`const-${field.key}`}>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{field.label}</label>
                <div className="relative">
                  <input
                    type="text"
                    className="input-field pr-12 font-tabular"
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    placeholder={field.placeholder}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>{field.unit}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tab-prescription' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Médicaments prescrits</p>
              <button className="btn-secondary text-xs px-3 py-1.5">
                <Icon name="PlusIcon" size={13} />
                Ajouter un médicament
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { key: 'med-001', name: 'Paracétamol 1g', posologie: '1 cp, 3 fois par jour, 5 jours', qty: '15 cp' },
                { key: 'med-002', name: 'Ésoméprazole 20 mg', posologie: '1 cp, le matin, 7 jours', qty: '7 cp' },
              ].map((med) => (
                <div key={med.key} className="flex items-center gap-3 p-3 rounded-xl border" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0, 102, 255, 0.1)' }}>
                    <Icon name="BeakerIcon" size={16} style={{ color: 'var(--shifa-blue)' } as any} className="" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{med.name}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{med.posologie}</p>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: 'var(--shifa-blue)' }}>{med.qty}</span>
                  <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Supprimer ce médicament">
                    <Icon name="TrashIcon" size={13} className="text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <button className="btn-secondary text-xs px-3 py-1.5">
                <Icon name="BeakerIcon" size={13} />
                Demander examens
              </button>
              <button className="btn-secondary text-xs px-3 py-1.5">
                <Icon name="PhotoIcon" size={13} />
                Demander imagerie
              </button>
            </div>
          </div>
        )}

        {(activeTab === 'tab-anamnese' || activeTab === 'tab-examen' || activeTab === 'tab-evaluation') && (
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>
              {activeTab === 'tab-anamnese' ? 'Anamnèse' : activeTab === 'tab-examen' ? 'Examen clinique' : 'Évaluation & Diagnostic'}
            </label>
            <textarea
              className="input-field resize-none w-full"
              rows={6}
              placeholder={
                activeTab === 'tab-anamnese' ? 'Antécédents, traitements en cours, mode de vie...'
                  : activeTab === 'tab-examen'? 'Résultats de l\'examen clinique...' :'Diagnostic, hypothèses diagnostiques, plan thérapeutique...'
              }
            />
          </div>
        )}

        {activeTab === 'tab-documents' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Documents de la consultation</p>
              <button className="btn-secondary text-xs px-3 py-1.5">
                <Icon name="ArrowUpTrayIcon" size={13} />
                Ajouter un document
              </button>
            </div>
            <div className="flex items-center justify-center h-24 rounded-xl border-2 border-dashed" style={{ borderColor: 'var(--border)' }}>
              <div className="text-center">
                <Icon name="DocumentPlusIcon" size={24} className="text-muted-foreground mx-auto mb-1" />
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Glissez des fichiers ici ou cliquez pour importer</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}