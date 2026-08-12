'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tab = 'templates' | 'create' | 'exceptions' | 'history';

interface Template {
  id: string;
  name: string;
  type: 'weekly' | 'biweekly' | 'monthly' | 'custom';
  days: string[];
  slots: { start: string; end: string; type: 'consultation' | 'teleconsult' | 'pause' | 'blocked' }[];
  location: string;
  active: boolean;
  appliedFrom: string;
  appliedTo?: string;
}

const SLOT_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  consultation: { bg: '#dbeafe', text: '#1d4ed8', label: 'Consultation' },
  teleconsult: { bg: '#ede9fe', text: '#7c3aed', label: 'Téléconsultation' },
  pause: { bg: '#fef9c3', text: '#a16207', label: 'Pause' },
  blocked: { bg: '#fee2e2', text: '#b91c1c', label: 'Bloqué' },
};

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const templates: Template[] = [
  {
    id: 't1',
    name: 'Semaine standard — Cabinet',
    type: 'weekly',
    days: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'],
    slots: [
      { start: '08:00', end: '12:00', type: 'consultation' },
      { start: '12:00', end: '13:00', type: 'pause' },
      { start: '13:00', end: '17:00', type: 'consultation' },
    ],
    location: 'Cabinet principal',
    active: true,
    appliedFrom: '2025-01-01',
  },
  {
    id: 't2',
    name: 'Mercredi téléconsultation',
    type: 'weekly',
    days: ['Mer'],
    slots: [
      { start: '09:00', end: '12:00', type: 'teleconsult' },
      { start: '14:00', end: '17:00', type: 'teleconsult' },
    ],
    location: 'En ligne',
    active: true,
    appliedFrom: '2025-03-01',
  },
  {
    id: 't3',
    name: 'Permanence weekend (bi-mensuel)',
    type: 'biweekly',
    days: ['Sam'],
    slots: [
      { start: '09:00', end: '13:00', type: 'consultation' },
    ],
    location: 'Clinique annexe',
    active: false,
    appliedFrom: '2025-06-01',
    appliedTo: '2025-12-31',
  },
];

const exceptions = [
  { date: '2025-08-15', reason: 'Fête nationale — Congé', type: 'holiday' },
  { date: '2025-09-10', reason: 'Formation continue — Journée bloquée', type: 'blocked' },
  { date: '2025-10-01', reason: 'Déplacement professionnel', type: 'blocked' },
];

export default function ProScheduleTemplatesContent() {
  const [activeTab, setActiveTab] = useState<Tab>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(templates[0]);
  const [newSlotType, setNewSlotType] = useState<'consultation' | 'teleconsult' | 'pause' | 'blocked'>('consultation');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Lun', 'Mar', 'Mer', 'Jeu', 'Ven']);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'templates', label: 'Mes modèles', icon: 'CalendarDaysIcon' },
    { key: 'create', label: 'Créer un modèle', icon: 'PlusCircleIcon' },
    { key: 'exceptions', label: 'Exceptions & Congés', icon: 'XCircleIcon' },
    { key: 'history', label: 'Historique', icon: 'ClockIcon' },
  ];

  const toggleDay = (day: string) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'DM Sans, sans-serif' }}>
            Modèles de planning récurrents
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Configurez vos horaires types et appliquez-les automatiquement à votre agenda
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: 'var(--primary)' }}>
          <Icon name="PlusIcon" size={16} />
          Nouveau modèle
        </button>
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

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-12 gap-6">
          {/* Template List */}
          <div className="col-span-4 space-y-3">
            {templates.map(t => (
              <div
                key={t.id}
                onClick={() => setSelectedTemplate(t)}
                className="p-4 rounded-xl border cursor-pointer transition-all"
                style={{
                  background: selectedTemplate?.id === t.id ? 'var(--primary)' : 'var(--card)',
                  borderColor: selectedTemplate?.id === t.id ? 'var(--primary)' : 'var(--border)',
                  color: selectedTemplate?.id === t.id ? '#fff' : 'var(--foreground)',
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-sm leading-tight">{t.name}</p>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full shrink-0 ml-2"
                    style={{
                      background: t.active ? '#dcfce7' : '#f1f5f9',
                      color: t.active ? '#16a34a' : '#64748b',
                    }}
                  >
                    {t.active ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs opacity-80">
                  <Icon name="MapPinIcon" size={12} />
                  {t.location}
                </div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {t.days.map(d => (
                    <span
                      key={d}
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{
                        background: selectedTemplate?.id === t.id ? 'rgba(255,255,255,0.2)' : 'var(--muted)',
                        color: selectedTemplate?.id === t.id ? '#fff' : 'var(--muted-foreground)',
                      }}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Template Detail */}
          {selectedTemplate && (
            <div className="col-span-8 rounded-xl border p-6 space-y-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>{selectedTemplate.name}</h2>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    Applicable du {selectedTemplate.appliedFrom}{selectedTemplate.appliedTo ? ` au ${selectedTemplate.appliedTo}` : ' (sans fin)'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg border text-sm" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                    <Icon name="PencilIcon" size={15} />
                  </button>
                  <button className="p-2 rounded-lg border text-sm" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                    <Icon name="DocumentDuplicateIcon" size={15} />
                  </button>
                </div>
              </div>

              {/* Days grid */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--muted-foreground)' }}>Jours actifs</p>
                <div className="flex gap-2">
                  {DAYS.map(d => (
                    <div
                      key={d}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium"
                      style={{
                        background: selectedTemplate.days.includes(d) ? 'var(--primary)' : 'var(--muted)',
                        color: selectedTemplate.days.includes(d) ? '#fff' : 'var(--muted-foreground)',
                      }}
                    >
                      {d}
                    </div>
                  ))}
                </div>
              </div>

              {/* Slots */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--muted-foreground)' }}>Créneaux horaires</p>
                <div className="space-y-2">
                  {selectedTemplate.slots.map((slot, i) => {
                    const cfg = SLOT_COLORS[slot.type];
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--muted)' }}>
                        <div className="w-2 h-8 rounded-full" style={{ background: cfg.text }} />
                        <div className="flex-1">
                          <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                            {slot.start} — {slot.end}
                          </p>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: cfg.bg, color: cfg.text }}>
                            {cfg.label}
                          </span>
                        </div>
                        <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                          {(() => {
                            const [sh, sm] = slot.start.split(':').map(Number);
                            const [eh, em] = slot.end.split(':').map(Number);
                            const mins = (eh * 60 + em) - (sh * 60 + sm);
                            return `${Math.floor(mins / 60)}h${mins % 60 > 0 ? String(mins % 60).padStart(2, '0') : ''}`;
                          })()}
                        </div>
                        <button style={{ color: 'var(--muted-foreground)' }}>
                          <Icon name="TrashIcon" size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <button className="mt-3 flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-dashed w-full justify-center" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                  <Icon name="PlusIcon" size={14} />
                  Ajouter un créneau
                </button>
              </div>

              {/* Apply button */}
              <div className="flex gap-3 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                <button className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: 'var(--primary)' }}>
                  Appliquer ce modèle à l'agenda
                </button>
                <button className="px-4 py-2.5 rounded-xl text-sm font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                  Désactiver
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Tab */}
      {activeTab === 'create' && (
        <div className="rounded-xl border p-6 space-y-6 max-w-2xl" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>Créer un nouveau modèle</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--foreground)' }}>Nom du modèle</label>
              <input
                type="text"
                placeholder="Ex: Semaine standard cabinet"
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--foreground)' }}>Type de récurrence</label>
                <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                  <option>Hebdomadaire</option>
                  <option>Bi-mensuel</option>
                  <option>Mensuel</option>
                  <option>Personnalisé</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--foreground)' }}>Lieu</label>
                <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                  <option>Cabinet principal</option>
                  <option>En ligne</option>
                  <option>Clinique annexe</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2" style={{ color: 'var(--foreground)' }}>Jours actifs</label>
              <div className="flex gap-2">
                {DAYS.map(d => (
                  <button
                    key={d}
                    onClick={() => toggleDay(d)}
                    className="w-10 h-10 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: selectedDays.includes(d) ? 'var(--primary)' : 'var(--muted)',
                      color: selectedDays.includes(d) ? '#fff' : 'var(--muted-foreground)',
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2" style={{ color: 'var(--foreground)' }}>Ajouter un créneau</label>
              <div className="flex gap-3 items-end">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--muted-foreground)' }}>Début</label>
                  <input type="time" defaultValue="08:00" className="px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--muted-foreground)' }}>Fin</label>
                  <input type="time" defaultValue="12:00" className="px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--muted-foreground)' }}>Type</label>
                  <select
                    value={newSlotType}
                    onChange={e => setNewSlotType(e.target.value as any)}
                    className="px-3 py-2 rounded-lg border text-sm"
                    style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  >
                    {Object.entries(SLOT_COLORS).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>
                <button className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--primary)' }}>
                  Ajouter
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--foreground)' }}>Applicable à partir du</label>
                <input type="date" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--foreground)' }}>Jusqu'au (optionnel)</label>
                <input type="date" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
            <button className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: 'var(--primary)' }}>
              Enregistrer le modèle
            </button>
            <button className="px-4 py-2.5 rounded-xl text-sm font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Exceptions Tab */}
      {activeTab === 'exceptions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Jours fériés, congés et journées bloquées</p>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: 'var(--primary)' }}>
              <Icon name="PlusIcon" size={15} />
              Ajouter une exception
            </button>
          </div>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--muted)' }}>
                  {['Date', 'Motif', 'Type', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {exceptions.map((ex, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--foreground)' }}>{ex.date}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{ex.reason}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full" style={{
                        background: ex.type === 'holiday' ? '#dcfce7' : '#fee2e2',
                        color: ex.type === 'holiday' ? '#16a34a' : '#b91c1c',
                      }}>
                        {ex.type === 'holiday' ? 'Congé' : 'Bloqué'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button style={{ color: 'var(--muted-foreground)' }}><Icon name="TrashIcon" size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {[
            { action: 'Modèle "Semaine standard" appliqué à l\'agenda', date: '2025-07-01', user: 'Dr. Mohamed Sy' },
            { action: 'Nouveau modèle "Mercredi téléconsultation" créé', date: '2025-06-15', user: 'Dr. Mohamed Sy' },
            { action: 'Exception ajoutée : 15 août 2025', date: '2025-06-10', user: 'Dr. Mohamed Sy' },
            { action: 'Modèle "Permanence weekend" désactivé', date: '2025-05-20', user: 'Dr. Mohamed Sy' },
          ].map((h, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--muted)' }}>
                <Icon name="ClockIcon" size={15} style={{ color: 'var(--muted-foreground)' }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{h.action}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{h.user} · {h.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
