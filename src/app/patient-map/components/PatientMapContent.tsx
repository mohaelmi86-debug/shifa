'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type MapFilter = 'all' | 'doctor' | 'pharmacy' | 'lab' | 'hospital' | 'emergency' | 'imaging';

interface HealthcarePlace {
  id: string;
  name: string;
  type: MapFilter;
  specialty?: string;
  address: string;
  distance: string;
  distanceNum: number;
  rating: number;
  reviews: number;
  open: boolean;
  openHours: string;
  phone: string;
  shifa: boolean;
  teleconsult?: boolean;
  waitTime?: string;
}

const mockPlaces: HealthcarePlace[] = [
  { id: 'P001', name: 'Dr. Aminata Ndiaye', type: 'doctor', specialty: 'Médecin généraliste', address: 'Rue 12, Plateau, Dakar', distance: '0.3 km', distanceNum: 0.3, rating: 4.8, reviews: 124, open: true, openHours: 'Ouvert jusqu\'à 18h', phone: '+221 33 821 00 01', shifa: true, teleconsult: true, waitTime: '~15 min' },
  { id: 'P002', name: 'Pharmacie Centrale Dakar', type: 'pharmacy', address: 'Avenue Pompidou, Dakar', distance: '0.5 km', distanceNum: 0.5, rating: 4.5, reviews: 89, open: true, openHours: 'Ouvert 24h/24', phone: '+221 33 821 00 02', shifa: true },
  { id: 'P003', name: 'Clinique Pasteur', type: 'hospital', specialty: 'Clinique privée', address: 'Rue Pasteur, Dakar', distance: '1.2 km', distanceNum: 1.2, rating: 4.7, reviews: 312, open: true, openHours: 'Ouvert 24h/24', phone: '+221 33 821 00 03', shifa: true, waitTime: '~30 min' },
  { id: 'P004', name: 'Laboratoire BioSanté', type: 'lab', address: 'Almadies, Dakar', distance: '1.8 km', distanceNum: 1.8, rating: 4.6, reviews: 67, open: true, openHours: 'Ouvert jusqu\'à 17h', phone: '+221 33 821 00 04', shifa: true },
  { id: 'P005', name: 'Centre d\'Imagerie Médicale', type: 'imaging', address: 'Point E, Dakar', distance: '2.1 km', distanceNum: 2.1, rating: 4.4, reviews: 45, open: false, openHours: 'Ouvre à 08h', phone: '+221 33 821 00 05', shifa: false },
  { id: 'P006', name: 'SAMU — Centre 15', type: 'emergency', address: 'Hôpital Principal, Dakar', distance: '2.5 km', distanceNum: 2.5, rating: 4.9, reviews: 201, open: true, openHours: 'Ouvert 24h/24', phone: '15', shifa: true, waitTime: 'Urgences' },
  { id: 'P007', name: 'Dr. Oumar Seck', type: 'doctor', specialty: 'Cardiologue', address: 'Fann, Dakar', distance: '2.8 km', distanceNum: 2.8, rating: 4.9, reviews: 156, open: true, openHours: 'Ouvert jusqu\'à 16h', phone: '+221 33 821 00 07', shifa: true, teleconsult: true, waitTime: '~45 min' },
  { id: 'P008', name: 'Pharmacie de Garde Médina', type: 'pharmacy', address: 'Médina, Dakar', distance: '3.1 km', distanceNum: 3.1, rating: 4.2, reviews: 33, open: true, openHours: 'Garde de nuit', phone: '+221 33 821 00 08', shifa: false },
];

const typeConfig: Record<MapFilter, { label: string; icon: string; color: string; bg: string }> = {
  all: { label: 'Tout', icon: 'MapPinIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.1)' },
  doctor: { label: 'Médecins', icon: 'UserIcon', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  pharmacy: { label: 'Pharmacies', icon: 'ArchiveBoxIcon', color: '#16a34a', bg: 'rgba(22,163,74,0.1)' },
  lab: { label: 'Laboratoires', icon: 'BeakerIcon', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  hospital: { label: 'Hôpitaux', icon: 'BuildingOffice2Icon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.1)' },
  emergency: { label: 'Urgences', icon: 'BoltIcon', color: '#dc2626', bg: 'rgba(220,38,38,0.1)' },
  imaging: { label: 'Imagerie', icon: 'PhotoIcon', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
};

export default function PatientMapContent() {
  const [activeFilter, setActiveFilter] = useState<MapFilter>('all');
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance');
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockPlaces
    .filter(p => activeFilter === 'all' || p.type === activeFilter)
    .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.specialty?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => sortBy === 'distance' ? a.distanceNum - b.distanceNum : b.rating - a.rating);

  const selected = mockPlaces.find(p => p.id === selectedPlace);

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Carte de Santé</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Établissements et professionnels de santé à proximité</p>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="MapPinIcon" size={16} style={{ color: 'var(--shifa-blue)' } as any} />
          <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Dakar, Sénégal</span>
        </div>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un médecin, pharmacie, spécialité..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
          />
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as any)}
          className="px-3 py-2.5 rounded-xl text-sm border"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
        >
          <option value="distance">Trier par distance</option>
          <option value="rating">Trier par note</option>
        </select>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {(Object.keys(typeConfig) as MapFilter[]).map(filter => {
          const cfg = typeConfig[filter];
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all"
              style={{
                backgroundColor: isActive ? cfg.color : 'var(--muted)',
                color: isActive ? 'white' : 'var(--muted-foreground)',
              }}
            >
              <Icon name={cfg.icon as any} size={14} />
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Map placeholder + List */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Map */}
        <div className="lg:col-span-3">
          <div
            className="w-full rounded-2xl overflow-hidden relative"
            style={{ height: '420px', backgroundColor: '#e8f0fe', border: '1px solid var(--border)' }}
          >
            {/* Map placeholder */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(0,102,255,0.1)' }}>
                <Icon name="MapIcon" size={32} style={{ color: 'var(--shifa-blue)' } as any} />
              </div>
              <div className="text-center">
                <p className="font-bold" style={{ color: 'var(--shifa-dark)' }}>Carte interactive</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Intégration cartographique — Phase 3</p>
              </div>
            </div>

            {/* Simulated pins */}
            <div className="absolute inset-0 pointer-events-none">
              {filtered.slice(0, 5).map((place, i) => {
                const cfg = typeConfig[place.type];
                const positions = [
                  { top: '30%', left: '40%' },
                  { top: '50%', left: '55%' },
                  { top: '40%', left: '25%' },
                  { top: '65%', left: '45%' },
                  { top: '25%', left: '65%' },
                ];
                const pos = positions[i] || { top: '50%', left: '50%' };
                return (
                  <div
                    key={place.id}
                    className="absolute flex flex-col items-center"
                    style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -100%)' }}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: cfg.color }}>
                      <Icon name={cfg.icon as any} size={14} className="text-white" />
                    </div>
                    <div className="w-2 h-2 rounded-full mt-0.5" style={{ backgroundColor: cfg.color }} />
                  </div>
                );
              })}
            </div>

            {/* Location badge */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-2 rounded-xl shadow-lg" style={{ backgroundColor: 'var(--card)' }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#16a34a' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>Ma position · Dakar</span>
            </div>

            {/* Results count */}
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl shadow-lg" style={{ backgroundColor: 'var(--card)' }}>
              <span className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{filtered.length} résultats</span>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-3 overflow-y-auto" style={{ maxHeight: '420px' }}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Icon name="MagnifyingGlassIcon" size={32} className="text-muted-foreground mb-3" />
              <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Aucun résultat</p>
              <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Modifiez votre recherche ou vos filtres</p>
            </div>
          ) : (
            filtered.map(place => {
              const cfg = typeConfig[place.type];
              const isSelected = selectedPlace === place.id;
              return (
                <div
                  key={place.id}
                  onClick={() => setSelectedPlace(isSelected ? null : place.id)}
                  className="card-base p-4 cursor-pointer transition-all"
                  style={{ border: isSelected ? '2px solid var(--shifa-blue)' : '1px solid var(--border)' }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: cfg.bg }}>
                      <Icon name={cfg.icon as any} size={18} style={{ color: cfg.color } as any} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate" style={{ color: 'var(--foreground)' }}>{place.name}</p>
                          {place.specialty && <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{place.specialty}</p>}
                        </div>
                        <span className="text-xs font-bold shrink-0" style={{ color: 'var(--shifa-blue)' }}>{place.distance}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Icon name="StarIcon" size={12} style={{ color: '#f59e0b' } as any} />
                          <span className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{place.rating}</span>
                          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>({place.reviews})</span>
                        </div>
                        <span className="text-xs font-semibold" style={{ color: place.open ? '#16a34a' : '#dc2626' }}>
                          {place.open ? '● Ouvert' : '● Fermé'}
                        </span>
                        {place.shifa && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' }}>SHIFA</span>
                        )}
                        {place.teleconsult && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'rgba(0,242,195,0.1)', color: 'var(--shifa-cyan)' }}>Téléconsult.</span>
                        )}
                      </div>
                      {isSelected && (
                        <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                          <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>{place.address}</p>
                          <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>{place.openHours}{place.waitTime ? ` · Attente : ${place.waitTime}` : ''}</p>
                          <div className="flex gap-2">
                            <a href={`tel:${place.phone}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                              <Icon name="PhoneIcon" size={12} />
                              Appeler
                            </a>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>
                              <Icon name="CalendarDaysIcon" size={12} />
                              Rendez-vous
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
