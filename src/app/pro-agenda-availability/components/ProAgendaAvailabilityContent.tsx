'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

type SlotStatus = 'available' | 'blocked' | 'teleconsult' | 'break';

const slotColors: Record<SlotStatus, string> = {
  available: 'bg-emerald-100 border-emerald-300 text-emerald-700',
  blocked: 'bg-slate-100 border-slate-300 text-slate-500',
  teleconsult: 'bg-blue-100 border-blue-300 text-blue-700',
  break: 'bg-amber-100 border-amber-300 text-amber-700',
};

const initialGrid: Record<string, SlotStatus> = {
  'Lun-08:00': 'available', 'Lun-09:00': 'available', 'Lun-10:00': 'available',
  'Lun-11:00': 'available', 'Lun-12:00': 'break', 'Lun-13:00': 'break',
  'Lun-14:00': 'available', 'Lun-15:00': 'available', 'Lun-16:00': 'teleconsult',
  'Lun-17:00': 'teleconsult', 'Lun-18:00': 'blocked', 'Lun-19:00': 'blocked',
  'Mar-08:00': 'available', 'Mar-09:00': 'available', 'Mar-10:00': 'blocked',
  'Mar-11:00': 'blocked', 'Mar-12:00': 'break', 'Mar-13:00': 'break',
  'Mar-14:00': 'available', 'Mar-15:00': 'available', 'Mar-16:00': 'available',
  'Mar-17:00': 'teleconsult', 'Mar-18:00': 'blocked', 'Mar-19:00': 'blocked',
  'Mer-08:00': 'blocked', 'Mer-09:00': 'blocked', 'Mer-10:00': 'blocked',
  'Mer-11:00': 'blocked', 'Mer-12:00': 'blocked', 'Mer-13:00': 'blocked',
  'Mer-14:00': 'available', 'Mer-15:00': 'available', 'Mer-16:00': 'available',
  'Mer-17:00': 'available', 'Mer-18:00': 'blocked', 'Mer-19:00': 'blocked',
  'Jeu-08:00': 'available', 'Jeu-09:00': 'available', 'Jeu-10:00': 'available',
  'Jeu-11:00': 'available', 'Jeu-12:00': 'break', 'Jeu-13:00': 'break',
  'Jeu-14:00': 'teleconsult', 'Jeu-15:00': 'teleconsult', 'Jeu-16:00': 'teleconsult',
  'Jeu-17:00': 'available', 'Jeu-18:00': 'blocked', 'Jeu-19:00': 'blocked',
  'Ven-08:00': 'available', 'Ven-09:00': 'available', 'Ven-10:00': 'available',
  'Ven-11:00': 'available', 'Ven-12:00': 'break', 'Ven-13:00': 'break',
  'Ven-14:00': 'available', 'Ven-15:00': 'available', 'Ven-16:00': 'blocked',
  'Ven-17:00': 'blocked', 'Ven-18:00': 'blocked', 'Ven-19:00': 'blocked',
  'Sam-08:00': 'available', 'Sam-09:00': 'available', 'Sam-10:00': 'available',
  'Sam-11:00': 'available', 'Sam-12:00': 'blocked', 'Sam-13:00': 'blocked',
  'Sam-14:00': 'blocked', 'Sam-15:00': 'blocked', 'Sam-16:00': 'blocked',
  'Sam-17:00': 'blocked', 'Sam-18:00': 'blocked', 'Sam-19:00': 'blocked',
  'Dim-08:00': 'blocked', 'Dim-09:00': 'blocked', 'Dim-10:00': 'blocked',
  'Dim-11:00': 'blocked', 'Dim-12:00': 'blocked', 'Dim-13:00': 'blocked',
  'Dim-14:00': 'blocked', 'Dim-15:00': 'blocked', 'Dim-16:00': 'blocked',
  'Dim-17:00': 'blocked', 'Dim-18:00': 'blocked', 'Dim-19:00': 'blocked',
};

const exceptions = [
  { date: '2026-08-15', label: 'Congé annuel', type: 'absence', color: 'bg-red-100 text-red-700 border-red-200' },
  { date: '2026-08-20', label: 'Formation continue', type: 'formation', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { date: '2026-08-25', label: 'Garde hospitalière', type: 'garde', color: 'bg-orange-100 text-orange-700 border-orange-200' },
];

const rules = [
  { label: 'Durée consultation standard', value: '30 min', icon: 'ClockIcon' },
  { label: 'Durée téléconsultation', value: '20 min', icon: 'VideoCameraIcon' },
  { label: 'Délai minimum avant RDV', value: '2h', icon: 'CalendarDaysIcon' },
  { label: 'Délai annulation patient', value: '24h', icon: 'XCircleIcon' },
  { label: 'Nb max RDV/jour', value: '18', icon: 'UserGroupIcon' },
  { label: 'Pause automatique', value: 'Activée', icon: 'PauseCircleIcon' },
];

const tabs = ['Grille horaire', 'Exceptions & Congés', 'Règles & Paramètres', 'Lieux de consultation'];

export default function ProAgendaAvailabilityContent() {
  const [activeTab, setActiveTab] = useState(0);
  const [grid, setGrid] = useState<Record<string, SlotStatus>>(initialGrid);
  const [paintMode, setPaintMode] = useState<SlotStatus>('available');
  const [saved, setSaved] = useState(false);

  const toggleSlot = (day: string, hour: string) => {
    const key = `${day}-${hour}`;
    setGrid(prev => ({ ...prev, [key]: paintMode }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const countByStatus = (s: SlotStatus) => Object.values(grid).filter(v => v === s).length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div>
          <h1 className="text-xl font-bold" style={{ fontFamily: 'DM Sans, sans-serif' }}>Disponibilités & Agenda</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Configurez vos plages horaires, exceptions et règles de prise de rendez-vous</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          <Icon name="CheckIcon" size={16} />
          {saved ? 'Enregistré !' : 'Enregistrer'}
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4 px-6 py-4">
        {[
          { label: 'Créneaux disponibles', value: countByStatus('available'), color: '#16a34a', icon: 'CheckCircleIcon' },
          { label: 'Téléconsultation', value: countByStatus('teleconsult'), color: '#2563eb', icon: 'VideoCameraIcon' },
          { label: 'Pauses', value: countByStatus('break'), color: '#d97706', icon: 'PauseCircleIcon' },
          { label: 'Bloqués', value: countByStatus('blocked'), color: '#64748b', icon: 'XCircleIcon' },
        ].map(k => (
          <div key={k.label} className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 mb-1">
              <Icon name={k.icon as any} size={16} style={{ color: k.color }} />
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{k.label}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: k.color, fontFamily: 'DM Sans, sans-serif' }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-6">
        <div className="flex gap-1 border-b" style={{ borderColor: 'var(--border)' }}>
          {tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setActiveTab(i)}
              className="px-4 py-2.5 text-sm font-medium transition-colors border-b-2"
              style={{
                borderBottomColor: activeTab === i ? 'var(--primary)' : 'transparent',
                color: activeTab === i ? 'var(--primary)' : 'var(--muted-foreground)',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-5">
        {/* Tab 0: Grille horaire */}
        {activeTab === 0 && (
          <div>
            {/* Paint mode selector */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Mode peinture :</span>
              {(['available', 'teleconsult', 'break', 'blocked'] as SlotStatus[]).map(s => (
                <button
                  key={s}
                  onClick={() => setPaintMode(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${slotColors[s]} ${paintMode === s ? 'ring-2 ring-offset-1 ring-current' : ''}`}
                >
                  {s === 'available' ? 'Disponible' : s === 'teleconsult' ? 'Téléconsult.' : s === 'break' ? 'Pause' : 'Bloqué'}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border)' }}>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ backgroundColor: 'var(--muted)' }}>
                    <th className="px-3 py-2 text-left font-medium w-16" style={{ color: 'var(--muted-foreground)' }}>Heure</th>
                    {DAYS.map(d => (
                      <th key={d} className="px-2 py-2 text-center font-medium" style={{ color: 'var(--foreground)' }}>{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HOURS.map((h, hi) => (
                    <tr key={h} style={{ backgroundColor: hi % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                      <td className="px-3 py-1.5 font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>{h}</td>
                      {DAYS.map(d => {
                        const key = `${d}-${h}`;
                        const status = grid[key] || 'blocked';
                        return (
                          <td key={d} className="px-1 py-1 text-center">
                            <button
                              onClick={() => toggleSlot(d, h)}
                              className={`w-full rounded border text-xs py-1 transition-all hover:opacity-80 ${slotColors[status]}`}
                            >
                              {status === 'available' ? '✓' : status === 'teleconsult' ? '📹' : status === 'break' ? '☕' : '—'}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-3" style={{ color: 'var(--muted-foreground)' }}>Cliquez sur un créneau pour appliquer le mode peinture sélectionné.</p>
          </div>
        )}

        {/* Tab 1: Exceptions */}
        {activeTab === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Exceptions & Congés planifiés</h3>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-colors hover:bg-muted" style={{ borderColor: 'var(--border)' }}>
                <Icon name="PlusIcon" size={14} />
                Ajouter une exception
              </button>
            </div>
            {exceptions.map((ex, i) => (
              <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${ex.color}`}>
                <div className="flex items-center gap-3">
                  <Icon name="CalendarDaysIcon" size={18} />
                  <div>
                    <p className="font-medium text-sm">{ex.label}</p>
                    <p className="text-xs opacity-75">{ex.date} · {ex.type}</p>
                  </div>
                </div>
                <button className="text-xs underline opacity-70 hover:opacity-100">Supprimer</button>
              </div>
            ))}
            <div className="rounded-xl border p-5 mt-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <h4 className="font-medium mb-3 text-sm">Ajouter une exception</h4>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--muted-foreground)' }}>Date</label>
                  <input type="date" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }} />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--muted-foreground)' }}>Type</label>
                  <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
                    <option>Congé</option>
                    <option>Formation</option>
                    <option>Garde</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--muted-foreground)' }}>Libellé</label>
                  <input type="text" placeholder="Description..." className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }} />
                </div>
              </div>
              <button className="mt-3 px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                Enregistrer l'exception
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Règles */}
        {activeTab === 2 && (
          <div className="grid grid-cols-2 gap-4">
            {rules.map(r => (
              <div key={r.label} className="flex items-center justify-between p-4 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--muted)' }}>
                    <Icon name={r.icon as any} size={18} style={{ color: 'var(--primary)' }} />
                  </div>
                  <span className="text-sm font-medium">{r.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold px-3 py-1 rounded-lg" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>{r.value}</span>
                  <button className="text-xs" style={{ color: 'var(--primary)' }}>Modifier</button>
                </div>
              </div>
            ))}
            <div className="col-span-2 p-4 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <h4 className="font-medium mb-3 text-sm">Notifications automatiques</h4>
              <div className="space-y-2">
                {[
                  { label: 'Rappel RDV 24h avant (SMS)', active: true },
                  { label: 'Rappel RDV 1h avant (Push)', active: true },
                  { label: 'Confirmation immédiate (Email)', active: true },
                  { label: 'Annulation automatique si non confirmé', active: false },
                ].map(n => (
                  <div key={n.label} className="flex items-center justify-between py-1.5">
                    <span className="text-sm">{n.label}</span>
                    <div className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${n.active ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform shadow ${n.active ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Lieux */}
        {activeTab === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Lieux de consultation</h3>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border" style={{ borderColor: 'var(--border)' }}>
                <Icon name="PlusIcon" size={14} />
                Ajouter un lieu
              </button>
            </div>
            {[
              { name: 'Cabinet principal', address: '12 Rue Blaise Diagne, Dakar', type: 'Cabinet', active: true, slots: 'Lun–Ven 08h–17h' },
              { name: 'CHU de Fann', address: 'Avenue Cheikh Anta Diop, Dakar', type: 'Hôpital', active: true, slots: 'Mer 14h–18h' },
              { name: 'Téléconsultation', address: 'Plateforme SHIFA', type: 'Téléconsultation', active: true, slots: 'Lun, Jeu 16h–18h' },
            ].map((loc, i) => (
              <div key={i} className="p-4 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mt-0.5" style={{ backgroundColor: 'var(--muted)' }}>
                      <Icon name={loc.type === 'Téléconsultation' ? 'VideoCameraIcon' : 'BuildingOffice2Icon'} size={20} style={{ color: 'var(--primary)' }} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{loc.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{loc.address}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>🕐 {loc.slots}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: loc.active ? '#dcfce7' : '#f1f5f9', color: loc.active ? '#16a34a' : '#64748b' }}>
                      {loc.active ? 'Actif' : 'Inactif'}
                    </span>
                    <button className="text-xs" style={{ color: 'var(--primary)' }}>Modifier</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
