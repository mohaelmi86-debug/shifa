'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface ConsultationRecord {
  id: string;
  patient: string;
  avatar: string;
  date: string;
  time: string;
  duration: string;
  type: 'video' | 'audio';
  status: 'completed' | 'no_show' | 'cancelled' | 'interrupted';
  reason: string;
  diagnosis: string;
  hasPrescription: boolean;
  hasNotes: boolean;
  rating?: number;
}

const history: ConsultationRecord[] = [
  { id: 'c1', patient: 'Aïcha Diallo', avatar: 'AD', date: '10/08/2026', time: '09:00', duration: '22 min', type: 'video', status: 'completed', reason: 'Suivi diabète type 2', diagnosis: 'Diabète type 2 — équilibré', hasPrescription: true, hasNotes: true, rating: 5 },
  { id: 'c2', patient: 'Kwame Asante', avatar: 'KA', date: '08/08/2026', time: '14:30', duration: '18 min', type: 'video', status: 'completed', reason: 'Renouvellement ordonnance HTA', diagnosis: 'HTA essentielle — stable', hasPrescription: true, hasNotes: true, rating: 4 },
  { id: 'c3', patient: 'Nadia Benali', avatar: 'NB', date: '07/08/2026', time: '10:00', duration: '0 min', type: 'audio', status: 'no_show', reason: 'Consultation prénatale', diagnosis: '—', hasPrescription: false, hasNotes: false },
  { id: 'c4', patient: 'Pierre Dubois', avatar: 'PD', date: '05/08/2026', time: '11:00', duration: '31 min', type: 'video', status: 'completed', reason: 'Suivi asthme', diagnosis: 'Asthme modéré persistant', hasPrescription: true, hasNotes: true, rating: 5 },
  { id: 'c5', patient: 'Isabelle Fontaine', avatar: 'IF', date: '03/08/2026', time: '09:30', duration: '14 min', type: 'video', status: 'completed', reason: 'Résultats thyroïde', diagnosis: 'Hypothyroïdie — traitement adapté', hasPrescription: true, hasNotes: true, rating: 4 },
  { id: 'c6', patient: 'Mamadou Traoré', avatar: 'MT', date: '01/08/2026', time: '16:00', duration: '8 min', type: 'audio', status: 'interrupted', reason: 'Fièvre persistante', diagnosis: 'Consultation interrompue — connexion', hasPrescription: false, hasNotes: false },
  { id: 'c7', patient: 'Alioune Badara Cissé', avatar: 'AC', date: '29/07/2026', time: '10:30', duration: '25 min', type: 'video', status: 'completed', reason: 'Suivi diabète + HTA', diagnosis: 'Diabète type 2 + HTA — ajustement traitement', hasPrescription: true, hasNotes: true, rating: 5 },
  { id: 'c8', patient: 'Fatou Sow', avatar: 'FS', date: '28/07/2026', time: '14:00', duration: '0 min', type: 'video', status: 'cancelled', reason: 'Douleurs lombaires', diagnosis: '—', hasPrescription: false, hasNotes: false },
];

const statusConfig = {
  completed: { label: 'Terminée', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.1)' },
  no_show: { label: 'Absent', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.1)' },
  cancelled: { label: 'Annulée', color: 'var(--muted-foreground)', bg: 'rgba(0,0,0,0.05)' },
  interrupted: { label: 'Interrompue', color: 'var(--shifa-red)', bg: 'rgba(239,68,68,0.1)' },
};

export default function TeleconsultationHistoryContent() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'no_show' | 'cancelled' | 'interrupted'>('all');
  const [selectedId, setSelectedId] = useState<string | null>('c1');

  const filtered = history.filter(c => {
    const matchSearch = c.patient.toLowerCase().includes(search.toLowerCase()) || c.reason.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const selected = history.find(c => c.id === selectedId);

  const completed = history.filter(c => c.status === 'completed');
  const avgDuration = Math.round(completed.reduce((a, c) => a + parseInt(c.duration), 0) / Math.max(completed.length, 1));
  const avgRating = (completed.filter(c => c.rating).reduce((a, c) => a + (c.rating || 0), 0) / Math.max(completed.filter(c => c.rating).length, 1)).toFixed(1);

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Historique Téléconsultations</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Toutes vos sessions de téléconsultation</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/teleconsultation-lobby" className="btn-secondary text-sm px-4 py-2.5 flex items-center gap-2">
            <Icon name="ArrowLeftIcon" size={16} />
            Lobby
          </Link>
          <button className="btn-secondary text-sm px-4 py-2.5 flex items-center gap-2">
            <Icon name="ArrowDownTrayIcon" size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total sessions', value: history.length, color: 'var(--shifa-blue)', icon: 'VideoCameraIcon' },
          { label: 'Complétées', value: completed.length, color: 'var(--shifa-green)', icon: 'CheckCircleIcon' },
          { label: 'Durée moyenne', value: `${avgDuration} min`, color: 'var(--shifa-cyan)', icon: 'ClockIcon' },
          { label: 'Note moyenne', value: `⭐ ${avgRating}`, color: 'var(--shifa-amber)', icon: 'StarIcon' },
        ].map(kpi => (
          <div key={kpi.label} className="card-base flex items-center gap-4 py-4 px-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${kpi.color}18` }}>
              <Icon name={kpi.icon as any} size={20} style={{ color: kpi.color }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* List */}
        <div className="xl:col-span-1">
          {/* Filters */}
          <div className="flex flex-col gap-3 mb-4">
            <div className="relative">
              <Icon name="MagnifyingGlassIcon" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border text-sm outline-none"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(['all', 'completed', 'no_show', 'cancelled'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                  style={statusFilter === f
                    ? { backgroundColor: 'var(--shifa-blue)', color: '#fff' }
                    : { backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                  {f === 'all' ? 'Toutes' : f === 'completed' ? 'Terminées' : f === 'no_show' ? 'Absents' : 'Annulées'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filtered.map(c => {
              const sc = statusConfig[c.status];
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full text-left card-base p-4 transition-all hover:shadow-md ${selectedId === c.id ? 'ring-2 ring-blue-500' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                      {c.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{c.patient}</p>
                        <span className="px-1.5 py-0.5 rounded text-xs font-medium shrink-0" style={{ color: sc.color, backgroundColor: sc.bg }}>
                          {sc.label}
                        </span>
                      </div>
                      <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{c.reason}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{c.date}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.time}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail */}
        <div className="xl:col-span-2">
          {selected ? (
            <div className="card-base p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                    {selected.avatar}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{selected.patient}</h2>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{selected.date} à {selected.time}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ color: statusConfig[selected.status].color, backgroundColor: statusConfig[selected.status].bg }}>
                        {statusConfig[selected.status].label}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)' }}>
                        {selected.type === 'video' ? '📹 Vidéo' : '📞 Audio'}
                      </span>
                      {selected.duration !== '0 min' && (
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>⏱ {selected.duration}</span>
                      )}
                    </div>
                  </div>
                </div>
                {selected.rating && (
                  <div className="text-right">
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Satisfaction patient</p>
                    <p className="text-2xl">{'⭐'.repeat(selected.rating)}</p>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>MOTIF</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{selected.reason}</p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>DIAGNOSTIC</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{selected.diagnosis}</p>
                </div>
              </div>

              {/* Documents */}
              <div className="flex items-center gap-3 mb-6">
                {selected.hasNotes && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: 'rgba(0,102,255,0.08)' }}>
                    <Icon name="ClipboardDocumentListIcon" size={16} style={{ color: 'var(--shifa-blue)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--shifa-blue)' }}>Notes cliniques</span>
                  </div>
                )}
                {selected.hasPrescription && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: 'rgba(16,185,129,0.08)' }}>
                    <Icon name="DocumentCheckIcon" size={16} style={{ color: 'var(--shifa-green)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--shifa-green)' }}>Ordonnance</span>
                  </div>
                )}
                {!selected.hasNotes && !selected.hasPrescription && (
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Aucun document associé</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 flex-wrap">
                {selected.status === 'completed' && (
                  <>
                    <button className="btn-secondary text-sm px-4 py-2.5 flex items-center gap-2">
                      <Icon name="DocumentTextIcon" size={16} />
                      Voir le compte-rendu
                    </button>
                    {selected.hasPrescription && (
                      <button className="btn-secondary text-sm px-4 py-2.5 flex items-center gap-2">
                        <Icon name="DocumentCheckIcon" size={16} />
                        Voir l'ordonnance
                      </button>
                    )}
                    <button className="btn-secondary text-sm px-4 py-2.5 flex items-center gap-2">
                      <Icon name="ArrowPathIcon" size={16} />
                      Replanifier
                    </button>
                  </>
                )}
                {(selected.status === 'no_show' || selected.status === 'cancelled') && (
                  <Link href="/teleconsultation-lobby" className="btn-primary text-sm px-4 py-2.5 flex items-center gap-2">
                    <Icon name="CalendarDaysIcon" size={16} />
                    Replanifier la session
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="card-base p-12 flex flex-col items-center justify-center text-center">
              <Icon name="ClipboardDocumentListIcon" size={48} className="text-muted-foreground mb-4" />
              <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Sélectionnez une consultation</p>
              <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Cliquez sur une session pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
