'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Prescription {
  id: string;
  patient: string;
  avatar: string;
  date: string;
  medications: string[];
  status: 'active' | 'dispensed' | 'expired' | 'pending';
  duration: string;
  refills: number;
}

const prescriptions: Prescription[] = [
  { id: 'rx1', patient: 'Aïcha Diallo', avatar: 'AD', date: '08/08/2026', medications: ['Metformine 500mg', 'Glibenclamide 5mg'], status: 'active', duration: '3 mois', refills: 2 },
  { id: 'rx2', patient: 'Kwame Asante', avatar: 'KA', date: '05/08/2026', medications: ['Amlodipine 10mg', 'Furosémide 40mg', 'Spironolactone 25mg'], status: 'dispensed', duration: '1 mois', refills: 0 },
  { id: 'rx3', patient: 'Nadia Benali', avatar: 'NB', date: '10/08/2026', medications: ['Acide folique 5mg', 'Fer + Vit C'], status: 'pending', duration: '2 mois', refills: 1 },
  { id: 'rx4', patient: 'Pierre Dubois', avatar: 'PD', date: '01/08/2026', medications: ['Salbutamol spray', 'Béclométasone 250µg', 'Tiotropium 18µg'], status: 'active', duration: '6 mois', refills: 5 },
  { id: 'rx5', patient: 'Isabelle Fontaine', avatar: 'IF', date: '07/08/2026', medications: ['Lévothyroxine 50µg'], status: 'active', duration: '6 mois', refills: 5 },
  { id: 'rx6', patient: 'Mamadou Traoré', avatar: 'MT', date: '03/08/2026', medications: ['Artéméther-Luméfantrine', 'Paracétamol 1g'], status: 'dispensed', duration: '3 jours', refills: 0 },
  { id: 'rx7', patient: 'Alioune Badara Cissé', avatar: 'AC', date: '06/08/2026', medications: ['Metformine 1g', 'Ramipril 5mg', 'Atorvastatine 40mg'], status: 'active', duration: '3 mois', refills: 2 },
];

const statusConfig = {
  active: { label: 'Active', color: 'var(--shifa-green)', bg: 'rgba(16, 185, 129, 0.1)' },
  dispensed: { label: 'Dispensée', color: 'var(--shifa-blue)', bg: 'rgba(0, 102, 255, 0.08)' },
  expired: { label: 'Expirée', color: 'var(--shifa-red)', bg: 'rgba(239, 68, 68, 0.1)' },
  pending: { label: 'En attente', color: 'var(--shifa-amber)', bg: 'rgba(245, 158, 11, 0.1)' },
};

export default function ProPrescriptionsContent() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'dispensed' | 'expired' | 'pending'>('all');

  const filtered = prescriptions.filter(p => {
    const matchSearch = p.patient.toLowerCase().includes(search.toLowerCase()) ||
      p.medications.some(m => m.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Prescriptions</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Ordonnances numériques et suivi des traitements</p>
        </div>
        <button className="btn-primary text-sm px-4 py-2.5">
          <Icon name="PlusIcon" size={16} />
          Nouvelle ordonnance
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: prescriptions.length, color: 'var(--shifa-blue)' },
          { label: 'Actives', value: prescriptions.filter(p => p.status === 'active').length, color: 'var(--shifa-green)' },
          { label: 'En attente', value: prescriptions.filter(p => p.status === 'pending').length, color: 'var(--shifa-amber)' },
          { label: 'Dispensées', value: prescriptions.filter(p => p.status === 'dispensed').length, color: 'var(--shifa-cyan)' },
        ].map((kpi) => (
          <div key={kpi.label} className="card-base text-center py-4">
            <p className="text-3xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-48">
          <Icon name="MagnifyingGlassIcon" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher patient ou médicament..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm border focus:outline-none"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(['all', 'active', 'pending', 'dispensed', 'expired'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                backgroundColor: statusFilter === s ? 'var(--shifa-blue)' : 'var(--card)',
                color: statusFilter === s ? 'white' : 'var(--muted-foreground)',
                border: `1px solid ${statusFilter === s ? 'var(--shifa-blue)' : 'var(--border)'}`,
              }}
            >
              {s === 'all' ? 'Toutes' : statusConfig[s]?.label || s}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((rx) => {
          const st = statusConfig[rx.status];
          return (
            <div key={rx.id} className="card-base flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
                  >
                    {rx.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{rx.patient}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{rx.date}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold shrink-0" style={{ backgroundColor: st.bg, color: st.color }}>
                  {st.label}
                </span>
              </div>

              <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>Médicaments prescrits</p>
                <div className="flex flex-col gap-1">
                  {rx.medications.map((med, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: 'var(--shifa-blue)' }} />
                      <span className="text-sm" style={{ color: 'var(--foreground)' }}>{med}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--muted-foreground)' }}>
                <span>Durée : <strong style={{ color: 'var(--foreground)' }}>{rx.duration}</strong></span>
                <span>Renouvellements : <strong style={{ color: 'var(--foreground)' }}>{rx.refills}</strong></span>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
                <button className="flex-1 btn-secondary text-xs py-2">
                  <Icon name="PrinterIcon" size={13} />
                  Imprimer
                </button>
                <button className="flex-1 btn-secondary text-xs py-2">
                  <Icon name="PencilIcon" size={13} />
                  Modifier
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
