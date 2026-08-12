'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface SearchFilters {
  query: string;
  type: 'all' | 'professional' | 'facility';
  specialty: string;
  location: string;
  availability: string;
  teleconsultation: boolean;
}

interface Professional {
  id: string;
  name: string;
  profession: string;
  specialty: string;
  location: string;
  distance: string;
  rating: number;
  reviews: number;
  available: boolean;
  teleconsultation: boolean;
  languages: string[];
  nextSlot: string;
  verified: boolean;
  avatar: string;
}

interface Facility {
  id: string;
  name: string;
  type: string;
  location: string;
  distance: string;
  rating: number;
  reviews: number;
  open: boolean;
  services: string[];
  phone: string;
}

const mockProfessionals: Professional[] = [
  { id: 'p1', name: 'Dr. Aminata Koné', profession: 'Médecin généraliste', specialty: 'Médecine générale', location: 'Dakar, Plateau', distance: '1.2 km', rating: 4.9, reviews: 312, available: true, teleconsultation: true, languages: ['Français', 'Wolof'], nextSlot: 'Aujourd\'hui 14h30', verified: true, avatar: 'AK' },
  { id: 'p2', name: 'Dr. Ibrahima Diallo', profession: 'Cardiologue', specialty: 'Cardiologie', location: 'Dakar, Almadies', distance: '3.4 km', rating: 4.8, reviews: 189, available: true, teleconsultation: false, languages: ['Français', 'Anglais'], nextSlot: 'Demain 09h00', verified: true, avatar: 'ID' },
  { id: 'p3', name: 'Dr. Fatou Mbaye', profession: 'Pédiatre', specialty: 'Pédiatrie', location: 'Dakar, Mermoz', distance: '2.1 km', rating: 4.7, reviews: 245, available: false, teleconsultation: true, languages: ['Français', 'Wolof', 'Anglais'], nextSlot: 'Lun. 10h00', verified: true, avatar: 'FM' },
  { id: 'p4', name: 'Dr. Moussa Sarr', profession: 'Dentiste', specialty: 'Chirurgie dentaire', location: 'Dakar, Fann', distance: '4.8 km', rating: 4.6, reviews: 98, available: true, teleconsultation: false, languages: ['Français'], nextSlot: 'Aujourd\'hui 16h00', verified: true, avatar: 'MS' },
  { id: 'p5', name: 'Mme. Rokhaya Ndiaye', profession: 'Sage-femme', specialty: 'Maternité', location: 'Dakar, Grand Yoff', distance: '5.2 km', rating: 4.9, reviews: 156, available: true, teleconsultation: true, languages: ['Français', 'Wolof'], nextSlot: 'Aujourd\'hui 15h00', verified: true, avatar: 'RN' },
  { id: 'p6', name: 'Dr. Cheikh Sow', profession: 'Ophtalmologue', specialty: 'Ophtalmologie', location: 'Dakar, Liberté 6', distance: '6.1 km', rating: 4.5, reviews: 73, available: false, teleconsultation: false, languages: ['Français', 'Anglais'], nextSlot: 'Mar. 11h30', verified: false, avatar: 'CS' },
];

const mockFacilities: Facility[] = [
  { id: 'f1', name: 'CHU de Fann', type: 'Hôpital universitaire', location: 'Dakar, Fann', distance: '2.3 km', rating: 4.4, reviews: 892, open: true, services: ['Urgences', 'Chirurgie', 'Maternité', 'Pédiatrie'], phone: '+221 33 869 18 18' },
  { id: 'f2', name: 'Clinique Pasteur', type: 'Clinique privée', location: 'Dakar, Plateau', distance: '1.8 km', rating: 4.7, reviews: 445, open: true, services: ['Consultation', 'Imagerie', 'Laboratoire'], phone: '+221 33 821 22 22' },
  { id: 'f3', name: 'Laboratoire Biomédical', type: 'Laboratoire d\'analyses', location: 'Dakar, Almadies', distance: '3.9 km', rating: 4.8, reviews: 234, open: false, services: ['Analyses biologiques', 'PCR', 'Sérologie'], phone: '+221 33 860 44 44' },
];

const specialties = ['Toutes spécialités', 'Médecine générale', 'Cardiologie', 'Pédiatrie', 'Gynécologie', 'Dermatologie', 'Ophtalmologie', 'Dentisterie', 'Neurologie', 'Orthopédie'];

export default function PatientExplorerContent() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [activeTab, setActiveTab] = useState<'professional' | 'facility'>('professional');
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: 'all',
    specialty: '',
    location: '',
    availability: '',
    teleconsultation: false,
  });
  const [selectedPro, setSelectedPro] = useState<Professional | null>(null);

  const filteredPros = mockProfessionals.filter(p => {
    if (filters.query && !p.name.toLowerCase().includes(filters.query.toLowerCase()) && !p.profession.toLowerCase().includes(filters.query.toLowerCase())) return false;
    if (filters.specialty && filters.specialty !== 'Toutes spécialités' && p.specialty !== filters.specialty) return false;
    if (filters.teleconsultation && !p.teleconsultation) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Search Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-xl font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Explorer les professionnels & établissements</h1>
          
          {/* Main search bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Icon name="MagnifyingGlassIcon" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Médecin, spécialité, établissement..."
                className="input-field pl-10 w-full"
                value={filters.query}
                onChange={e => setFilters(f => ({ ...f, query: e.target.value }))}
              />
            </div>
            <div className="relative sm:w-48">
              <Icon name="MapPinIcon" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Ville, quartier..."
                className="input-field pl-10 w-full"
                value={filters.location}
                onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
              />
            </div>
            <button className="btn-primary px-6 py-2.5 text-sm font-semibold whitespace-nowrap">
              <Icon name="MagnifyingGlassIcon" size={16} />
              Rechercher
            </button>
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 items-center">
            <select
              className="text-xs font-medium px-3 py-1.5 rounded-full border cursor-pointer"
              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              value={filters.specialty}
              onChange={e => setFilters(f => ({ ...f, specialty: e.target.value }))}
            >
              {specialties.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button
              onClick={() => setFilters(f => ({ ...f, teleconsultation: !f.teleconsultation }))}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${filters.teleconsultation ? 'text-white' : ''}`}
              style={{
                backgroundColor: filters.teleconsultation ? 'var(--shifa-blue)' : 'var(--background)',
                borderColor: filters.teleconsultation ? 'var(--shifa-blue)' : 'var(--border)',
                color: filters.teleconsultation ? 'white' : 'var(--foreground)',
              }}
            >
              <Icon name="VideoCameraIcon" size={14} />
              Téléconsultation
            </button>
            <button
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all"
              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              <Icon name="CalendarDaysIcon" size={14} />
              Disponible aujourd'hui
            </button>
            <button
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all"
              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              <Icon name="AdjustmentsHorizontalIcon" size={14} />
              Plus de filtres
            </button>
          </div>
        </div>
      </div>

      {/* Tabs + View toggle */}
      <div className="px-4 sm:px-6 lg:px-8 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="max-w-screen-xl mx-auto w-full flex items-center justify-between">
          <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
            {[
              { key: 'professional', label: 'Professionnels', count: filteredPros.length },
              { key: 'facility', label: 'Établissements', count: mockFacilities.length },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.key ? 'shadow-sm' : ''}`}
                style={{
                  backgroundColor: activeTab === tab.key ? 'var(--card)' : 'transparent',
                  color: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
                }}
              >
                {tab.label}
                <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ backgroundColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--border)', color: activeTab === tab.key ? 'white' : 'var(--muted-foreground)' }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
            {[
              { key: 'list', icon: 'ListBulletIcon' },
              { key: 'map', icon: 'MapIcon' },
            ].map(v => (
              <button
                key={v.key}
                onClick={() => setViewMode(v.key as any)}
                className={`p-1.5 rounded-lg transition-all ${viewMode === v.key ? 'shadow-sm' : ''}`}
                style={{ backgroundColor: viewMode === v.key ? 'var(--card)' : 'transparent', color: viewMode === v.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)' }}
              >
                <Icon name={v.icon as any} size={16} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-screen-xl mx-auto">
          {viewMode === 'map' ? (
            <div className="rounded-2xl border overflow-hidden flex flex-col items-center justify-center" style={{ height: '500px', borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
              <Icon name="MapIcon" size={48} className="text-muted-foreground mb-4" />
              <p className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>Carte interactive</p>
              <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Intégration cartographique disponible après activation</p>
              <span className="mt-3 px-3 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' }}>
                COMING SOON — Mapbox / Google Maps
              </span>
            </div>
          ) : activeTab === 'professional' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredPros.map(pro => (
                <div
                  key={pro.id}
                  className="rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-shifa"
                  style={{ backgroundColor: 'var(--card)', borderColor: selectedPro?.id === pro.id ? 'var(--shifa-blue)' : 'var(--border)' }}
                  onClick={() => setSelectedPro(selectedPro?.id === pro.id ? null : pro)}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                      {pro.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-sm truncate" style={{ color: 'var(--foreground)' }}>{pro.name}</p>
                        {pro.verified && <Icon name="CheckBadgeIcon" size={14} style={{ color: 'var(--shifa-blue)', flexShrink: 0 } as any} className="" />}
                      </div>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{pro.profession}</p>
                      <p className="text-xs font-medium" style={{ color: 'var(--shifa-blue)' }}>{pro.specialty}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    <span className="flex items-center gap-1">
                      <Icon name="MapPinIcon" size={12} />
                      {pro.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="StarIcon" size={12} style={{ color: '#F59E0B' } as any} className="" />
                      {pro.rating} ({pro.reviews})
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {pro.teleconsultation && (
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(0,242,195,0.1)', color: 'var(--shifa-cyan)' }}>
                        <Icon name="VideoCameraIcon" size={11} />
                        Téléconsultation
                      </span>
                    )}
                    {pro.languages.map(l => (
                      <span key={l} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{l}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Prochain créneau</p>
                      <p className={`text-xs font-semibold ${pro.available ? '' : 'opacity-60'}`} style={{ color: pro.available ? 'var(--shifa-blue)' : 'var(--muted-foreground)' }}>
                        {pro.nextSlot}
                      </p>
                    </div>
                    <button className="btn-primary text-xs px-3 py-1.5">
                      Prendre RDV
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {mockFacilities.map(fac => (
                <div key={fac.id} className="rounded-2xl border p-5 transition-all hover:shadow-shifa" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.1)' }}>
                      <Icon name="BuildingOffice2Icon" size={24} style={{ color: 'var(--shifa-blue)' } as any} className="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold" style={{ color: 'var(--foreground)' }}>{fac.name}</p>
                          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{fac.type}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${fac.open ? '' : 'opacity-70'}`} style={{ backgroundColor: fac.open ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: fac.open ? '#10B981' : '#EF4444' }}>
                          {fac.open ? 'Ouvert' : 'Fermé'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        <span className="flex items-center gap-1"><Icon name="MapPinIcon" size={12} />{fac.location} · {fac.distance}</span>
                        <span className="flex items-center gap-1"><Icon name="StarIcon" size={12} style={{ color: '#F59E0B' } as any} className="" />{fac.rating} ({fac.reviews} avis)</span>
                        <span className="flex items-center gap-1"><Icon name="PhoneIcon" size={12} />{fac.phone}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {fac.services.map(s => (
                          <span key={s} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{s}</span>
                        ))}
                      </div>
                    </div>
                    <button className="btn-primary text-xs px-4 py-2 shrink-0 hidden sm:flex">
                      Voir détails
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
