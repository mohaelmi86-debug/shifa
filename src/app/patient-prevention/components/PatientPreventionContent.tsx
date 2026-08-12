'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Program {
  id: string;
  title: string;
  category: string;
  description: string;
  progress?: number;
  status: 'active' | 'available' | 'completed';
  icon: string;
  color: string;
  nextAction?: string;
}

const programs: Program[] = [
  { id: '1', title: 'Contrôle tension artérielle', category: 'Suivi chronique', description: 'Surveillance mensuelle de votre tension artérielle avec alertes personnalisées', progress: 75, status: 'active', icon: 'HeartIcon', color: '#ef4444', nextAction: 'Mesure prévue dans 5 jours' },
  { id: '2', title: 'Dépistage diabète type 2', category: 'Dépistage', description: 'Programme de dépistage précoce du diabète avec bilan glycémique annuel', progress: 50, status: 'active', icon: 'BeakerIcon', color: '#f59e0b', nextAction: 'Bilan glycémique recommandé' },
  { id: '3', title: 'Activité physique — 30 min/jour', category: 'Mode de vie', description: 'Objectif OMS : 150 minutes d\'activité modérée par semaine', progress: 60, status: 'active', icon: 'BoltIcon', color: 'var(--shifa-cyan)', nextAction: 'Objectif hebdomadaire en cours' },
  { id: '4', title: 'Dépistage cancer du sein', category: 'Dépistage', description: 'Mammographie recommandée tous les 2 ans après 40 ans', status: 'available', icon: 'MagnifyingGlassCircleIcon', color: '#ec4899', nextAction: 'Prendre rendez-vous' },
  { id: '5', title: 'Santé bucco-dentaire', category: 'Prévention', description: 'Visite dentaire semestrielle recommandée', status: 'available', icon: 'SparklesIcon', color: '#8b5cf6', nextAction: 'Dernière visite : il y a 8 mois' },
  { id: '6', title: 'Bilan ophtalmologique', category: 'Dépistage', description: 'Contrôle de la vue annuel recommandé', status: 'completed', icon: 'EyeIcon', color: 'var(--shifa-blue)', nextAction: 'Réalisé le 12/01/2026' },
];

const campaigns = [
  { title: 'Campagne nationale — Paludisme', org: 'Ministère de la Santé', date: 'Août 2026', icon: 'MegaphoneIcon', color: '#10b981' },
  { title: 'Semaine mondiale de l\'allaitement', org: 'OMS / UNICEF', date: '1–7 Août 2026', icon: 'HeartIcon', color: '#ec4899' },
  { title: 'Journée mondiale de l\'hypertension', org: 'OMS', date: '17 Mai 2026', icon: 'ChartBarIcon', color: '#ef4444' },
];

const statusConfig = {
  active: { label: 'En cours', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.1)' },
  available: { label: 'Disponible', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  completed: { label: 'Complété', color: 'var(--shifa-cyan)', bg: 'rgba(0,242,195,0.1)' },
};

export default function PatientPreventionContent() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'available' | 'completed'>('all');

  const filtered = programs.filter(p => activeFilter === 'all' || p.status === activeFilter);

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Prévention & Santé</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Programmes de prévention, dépistages et campagnes de santé</p>
      </div>

      {/* Health score card */}
      <div
        className="rounded-2xl p-6 mb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0A1B3D 0%, #0A4B9A 55%, #0066FF 100%)' }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Score de prévention SHIFA</p>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-extrabold text-white">72</span>
              <span className="text-xl font-bold mb-1" style={{ color: 'var(--shifa-cyan)' }}>/100</span>
            </div>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Bon — 3 actions recommandées pour améliorer votre score</p>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Programmes actifs', value: '3' },
              { label: 'Dépistages à jour', value: '4/6' },
              { label: 'Campagnes suivies', value: '2' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3 px-4 py-2 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <span className="text-sm font-bold text-white">{item.value}</span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Programs */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="font-bold" style={{ color: 'var(--shifa-dark)' }}>Mes programmes</h2>
            <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
              {(['all', 'active', 'available', 'completed'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: activeFilter === f ? 'var(--card)' : 'transparent',
                    color: activeFilter === f ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
                  }}
                >
                  {f === 'all' ? 'Tous' : f === 'active' ? 'En cours' : f === 'available' ? 'Disponibles' : 'Complétés'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {filtered.map(program => {
              const st = statusConfig[program.status];
              return (
                <div key={program.id} className="card-base p-5 hover:shadow-shifa transition-all cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${program.color}18` }}>
                      <Icon name={program.icon as any} size={22} style={{ color: program.color } as any} className="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{program.title}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{program.category}</p>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0" style={{ color: st.color, backgroundColor: st.bg }}>
                          {st.label}
                        </span>
                      </div>
                      <p className="text-sm mt-2" style={{ color: 'var(--muted-foreground)' }}>{program.description}</p>
                      {program.progress !== undefined && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Progression</p>
                            <p className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>{program.progress}%</p>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${program.progress}%`, backgroundColor: program.color }}
                            />
                          </div>
                        </div>
                      )}
                      {program.nextAction && (
                        <p className="text-xs mt-2 font-medium" style={{ color: st.color }}>→ {program.nextAction}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Campaigns */}
        <div>
          <h2 className="font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Campagnes de santé</h2>
          <div className="flex flex-col gap-3">
            {campaigns.map((c, i) => (
              <div key={i} className="card-base p-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${c.color}18` }}>
                  <Icon name={c.icon as any} size={18} style={{ color: c.color } as any} className="" />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{c.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{c.org}</p>
                  <p className="text-xs mt-1 font-medium" style={{ color: c.color }}>{c.date}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Screening checklist */}
          <div className="card-base p-5 mt-4">
            <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--shifa-dark)' }}>Dépistages recommandés</h3>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Tension artérielle', done: true },
                { label: 'Glycémie à jeun', done: true },
                { label: 'Cholestérol', done: false },
                { label: 'Mammographie', done: false },
                { label: 'Frottis cervical', done: true },
                { label: 'Bilan ophtalmologique', done: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: item.done ? 'var(--shifa-cyan)' : 'var(--border)' }}
                  >
                    {item.done && <Icon name="CheckIcon" size={11} className="text-white" />}
                  </div>
                  <p className="text-sm" style={{ color: item.done ? 'var(--foreground)' : 'var(--muted-foreground)' }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
