'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const professionals = [
  { id: 'pro-001', name: 'Dr. Mohamed Sy', specialty: 'Médecine générale', distance: '0.4 km', availability: 'Disponible aujourd\'hui', rating: 4.9, consultations: 1247, teleconsult: true, avatar: 'MS', color: 'var(--shifa-blue)' },
  { id: 'pro-002', name: 'Pharmacie Centrale', specialty: 'Pharmacie', distance: '0.6 km', availability: 'Ouvert — ferme à 20h', rating: 4.7, consultations: null, teleconsult: false, avatar: 'PC', color: 'var(--shifa-green)' },
  { id: 'pro-003', name: 'Dr. Fatou Sarr', specialty: 'Gynécologie', distance: '1.2 km', availability: 'Prochain dispo: 18 août', rating: 4.8, consultations: 893, teleconsult: true, avatar: 'FS', color: 'var(--shifa-purple)' },
  { id: 'pro-004', name: 'Laboratoire BioSanté', specialty: 'Laboratoire', distance: '0.9 km', availability: 'Ouvert — résultats en 24h', rating: 4.6, consultations: null, teleconsult: false, avatar: 'LB', color: 'var(--shifa-amber)' },
  { id: 'pro-005', name: 'Dr. Kofi Mensah', specialty: 'Cardiologie', distance: '2.1 km', availability: 'Téléconsultation disponible', rating: 4.9, consultations: 2341, teleconsult: true, avatar: 'KM', color: 'var(--shifa-red)' },
];

const filters = [
  { key: 'filter-all', label: 'Tous' },
  { key: 'filter-medecin', label: 'Médecins' },
  { key: 'filter-pharmacie', label: 'Pharmacies' },
  { key: 'filter-labo', label: 'Laboratoires' },
  { key: 'filter-teleconsult', label: 'Téléconsultation' },
];

export default function NearbyProfessionals() {
  const [activeFilter, setActiveFilter] = useState('filter-all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = professionals.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === 'filter-teleconsult') return matchSearch && p.teleconsult;
    return matchSearch;
  });

  return (
    <div className="card-base">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>Autour de moi</h2>
        <button className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:underline" style={{ color: 'var(--shifa-blue)' }}>
          <Icon name="MapIcon" size={13} />
          Voir la carte
        </button>
      </div>

      {/* Map placeholder */}
      <div
        className="h-36 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden border"
        style={{ background: 'linear-gradient(135deg, #E8F0FE 0%, #D6E8FF 100%)', borderColor: 'var(--border)' }}
      >
        {/* Map placeholder content */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(6)].map((_, i) => (
            <div
              key={`map-line-h-${i}`}
              className="absolute w-full border-t"
              style={{ top: `${(i + 1) * 16}%`, borderColor: 'var(--shifa-blue)' }}
            />
          ))}
          {[...Array(8)].map((_, i) => (
            <div
              key={`map-line-v-${i}`}
              className="absolute h-full border-l"
              style={{ left: `${(i + 1) * 12}%`, borderColor: 'var(--shifa-blue)' }}
            />
          ))}
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full flex items-center justify-center pulse-ring" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
            <Icon name="MapPinIcon" size={20} className="text-white" />
          </div>
          <span className="text-xs font-semibold mt-2" style={{ color: 'var(--shifa-blue)' }}>Paris, France</span>
        </div>
        {/* Sample map pins */}
        {[
          { key: 'pin-1', top: '30%', left: '25%', color: 'var(--shifa-green)' },
          { key: 'pin-2', top: '55%', left: '65%', color: 'var(--shifa-purple)' },
          { key: 'pin-3', top: '20%', left: '70%', color: 'var(--shifa-amber)' },
        ].map((pin) => (
          <div
            key={pin.key}
            className="absolute w-3 h-3 rounded-full border-2 border-white shadow-md"
            style={{ top: pin.top, left: pin.left, backgroundColor: pin.color }}
          />
        ))}
        <p className="absolute bottom-2 right-3 text-xs font-medium" style={{ color: 'var(--shifa-blue)' }}>
          Carte interactive — intégration cartographique prévue
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Icon name="MagnifyingGlassIcon" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          className="input-field pl-9 text-sm"
          placeholder="Rechercher un professionnel, spécialité..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-thin pb-1">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
            style={{
              backgroundColor: activeFilter === f.key ? 'var(--shifa-blue)' : 'var(--muted)',
              color: activeFilter === f.key ? 'white' : 'var(--muted-foreground)',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {filtered.map((pro) => (
          <div
            key={pro.id}
            className="flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 hover:shadow-shifa cursor-pointer"
            style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: `linear-gradient(135deg, ${pro.color}, ${pro.color}99)` }}
            >
              {pro.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: 'var(--foreground)' }}>{pro.name}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{pro.specialty}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-0.5">
                  <Icon name="StarIcon" size={11} style={{ color: 'var(--shifa-amber)' } as any} className="" />
                  <span className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{pro.rating}</span>
                </div>
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>·</span>
                <div className="flex items-center gap-0.5">
                  <Icon name="MapPinIcon" size={11} className="text-muted-foreground" />
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{pro.distance}</span>
                </div>
                {pro.teleconsult && (
                  <>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>·</span>
                    <Icon name="VideoCameraIcon" size={11} style={{ color: 'var(--shifa-green)' } as any} className="" />
                  </>
                )}
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xs font-medium" style={{ color: 'var(--shifa-green)', fontSize: '10px' }}>{pro.availability}</p>
              <button className="mt-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150 hover:opacity-80" style={{ backgroundColor: 'var(--shifa-blue)', color: 'white' }}>
                Prendre RDV
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}