'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tab = 'programs' | 'campaigns' | 'followup';

const tabs = [
  { id: 'programs' as Tab, label: 'Programmes de prévention', icon: 'ShieldCheckIcon' },
  { id: 'campaigns' as Tab, label: 'Campagnes de santé', icon: 'MegaphoneIcon' },
  { id: 'followup' as Tab, label: 'Protocoles de suivi', icon: 'ClipboardDocumentListIcon' },
];

const programs = [
  { id: 1, name: 'Dépistage diabète type 2', category: 'Métabolique', status: 'enrolled', progress: 60, nextStep: 'Bilan sanguin — 15/09/2025', icon: 'BeakerIcon', color: '#f59e0b' },
  { id: 2, name: 'Prévention cardiovasculaire', category: 'Cardiologie', status: 'enrolled', progress: 35, nextStep: 'ECG de contrôle — 22/09/2025', icon: 'HeartIcon', color: '#f87171' },
  { id: 3, name: 'Vaccination adulte', category: 'Immunologie', status: 'completed', progress: 100, nextStep: 'Rappel dans 5 ans', icon: 'ShieldCheckIcon', color: '#16a34a' },
  { id: 4, name: 'Santé mentale & bien-être', category: 'Psychiatrie', status: 'available', progress: 0, nextStep: 'Démarrer le programme', icon: 'SparklesIcon', color: '#7c3aed' },
];

const campaigns = [
  { id: 1, name: 'Octobre Rose — Dépistage cancer du sein', org: 'Ministère de la Santé', period: 'Oct 2025', status: 'upcoming', participants: 12400, icon: 'HeartIcon', color: '#ec4899' },
  { id: 2, name: 'Journée mondiale du diabète', org: 'OMS / SHIFA', period: 'Nov 2025', status: 'upcoming', participants: 8200, icon: 'BeakerIcon', color: '#f59e0b' },
  { id: 3, name: 'Campagne anti-paludisme', org: 'PNLP Sénégal', period: 'Juil–Sep 2025', status: 'active', participants: 45000, icon: 'ShieldCheckIcon', color: '#16a34a' },
  { id: 4, name: 'Hygiène des mains — Hôpitaux', org: 'CHU Saint-Louis', period: 'Continu', status: 'active', participants: 3200, icon: 'SparklesIcon', color: 'var(--shifa-blue)' },
];

const followups = [
  { id: 1, name: 'Suivi HTA — Protocole 6 mois', frequency: 'Mensuel', nextDate: '05/09/2025', professional: 'Dr. Sy', status: 'active', adherence: 85 },
  { id: 2, name: 'Contrôle glycémique', frequency: 'Trimestriel', nextDate: '20/09/2025', professional: 'Dr. Diallo', status: 'active', adherence: 72 },
  { id: 3, name: 'Suivi post-opératoire', frequency: 'Hebdomadaire', nextDate: '12/08/2025', professional: 'Dr. Ba', status: 'completed', adherence: 100 },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  enrolled: { label: 'Inscrit', bg: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' },
  completed: { label: 'Terminé', bg: '#dcfce7', color: '#16a34a' },
  available: { label: 'Disponible', bg: '#f1f5f9', color: '#64748b' },
  active: { label: 'Actif', bg: '#dcfce7', color: '#16a34a' },
  upcoming: { label: 'À venir', bg: '#fef3c7', color: '#d97706' },
};

export default function PatientHealthProgramsContent() {
  const [activeTab, setActiveTab] = useState<Tab>('programs');

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Programmes de Santé</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Prévention, campagnes et protocoles de suivi personnalisés</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl border" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t.id ? 'shadow-sm' : ''}`}
            style={activeTab === t.id ? { backgroundColor: 'var(--card)', color: 'var(--shifa-blue)' } : { color: 'var(--muted-foreground)' }}>
            <Icon name={t.icon as any} size={15} />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Programs */}
      {activeTab === 'programs' && (
        <div className="space-y-4">
          {programs.map(p => {
            const s = statusConfig[p.status];
            return (
              <div key={p.id} className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${p.color}18` }}>
                    <Icon name={p.icon as any} size={22} style={{ color: p.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{p.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{p.category}</p>
                    {p.status !== 'available' && (
                      <>
                        <div className="flex items-center gap-2 mt-3">
                          <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                            <div className="h-1.5 rounded-full transition-all" style={{ width: `${p.progress}%`, backgroundColor: p.color }} />
                          </div>
                          <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>{p.progress}%</span>
                        </div>
                        <p className="text-xs mt-2 flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                          <Icon name="CalendarDaysIcon" size={12} />
                          {p.nextStep}
                        </p>
                      </>
                    )}
                    {p.status === 'available' && (
                      <button className="mt-3 px-4 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: p.color }}>
                        S'inscrire au programme
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Campaigns */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          {campaigns.map(c => {
            const s = statusConfig[c.status];
            return (
              <div key={c.id} className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${c.color}18` }}>
                    <Icon name={c.icon as any} size={22} style={{ color: c.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{c.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{c.org} · {c.period}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                        <Icon name="UsersIcon" size={12} />{c.participants.toLocaleString()} participants
                      </span>
                      {c.status === 'upcoming' && (
                        <button className="text-xs px-3 py-1 rounded-lg font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                          Participer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Follow-up */}
      {activeTab === 'followup' && (
        <div className="space-y-4">
          {followups.map(f => {
            const s = statusConfig[f.status];
            return (
              <div key={f.id} className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{f.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                      {f.professional} · {f.frequency}
                    </p>
                    <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                      <Icon name="CalendarDaysIcon" size={12} />Prochain: {f.nextDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: f.adherence >= 80 ? '#16a34a' : '#d97706' }}>{f.adherence}%</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Adhérence</p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${f.adherence}%`, backgroundColor: f.adherence >= 80 ? '#16a34a' : '#d97706' }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
