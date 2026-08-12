'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import {
  ProfessionConfigRegistry,
  ProfessionConfig,
  ProfessionCategory,
  categoryLabels,
  categoryIcons,
  getProfessionsByCategory,
} from '@/lib/professionConfig';

const CATEGORIES: ProfessionCategory[] = ['liberal', 'hospital', 'paramedical', 'pharmacy', 'support'];

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ stat }: { stat: { label: string; value: string; icon: string; trend?: 'up' | 'down' | 'neutral' } }) {
  const trendColor = stat.trend === 'up' ? '#16a34a' : stat.trend === 'down' ? '#dc2626' : '#64748b';
  const trendIcon = stat.trend === 'up' ? 'ArrowTrendingUpIcon' : stat.trend === 'down' ? 'ArrowTrendingDownIcon' : 'MinusIcon';
  return (
    <div className="rounded-xl border p-4 flex flex-col gap-2" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</span>
        <Icon name={stat.icon as any} size={16} style={{ color: 'var(--muted-foreground)' }} />
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{stat.value}</span>
        <Icon name={trendIcon as any} size={14} style={{ color: trendColor }} />
      </div>
    </div>
  );
}

// ─── Module Card ──────────────────────────────────────────────────────────────
function ModuleCard({ mod, color }: { mod: { id: string; label: string; icon: string; href?: string; description?: string }; color: string }) {
  const inner = (
    <div
      className="rounded-xl border p-4 flex flex-col gap-3 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 group"
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${color}18` }}
      >
        <Icon name={mod.icon as any} size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-sm font-semibold group-hover:underline" style={{ color: 'var(--foreground)' }}>{mod.label}</p>
        {mod.description && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{mod.description}</p>
        )}
      </div>
      <div className="flex items-center gap-1 mt-auto">
        <span className="text-xs font-medium" style={{ color }}>Ouvrir</span>
        <Icon name="ArrowRightIcon" size={12} style={{ color }} />
      </div>
    </div>
  );
  return mod.href ? <Link href={mod.href}>{inner}</Link> : <div>{inner}</div>;
}

// ─── Profession Selector ──────────────────────────────────────────────────────
function ProfessionSelector({
  selected,
  onSelect,
}: {
  selected: ProfessionConfig | null;
  onSelect: (p: ProfessionConfig) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<ProfessionCategory>('liberal');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const base = getProfessionsByCategory(activeCategory);
    if (!search.trim()) return base;
    const q = search.toLowerCase();
    return base.filter(p => p.labelFr.toLowerCase().includes(q));
  }, [activeCategory, search]);

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
        <input
          type="text"
          placeholder="Rechercher une profession..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border text-sm outline-none focus:ring-2"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            color: 'var(--foreground)',
          }}
        />
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setSearch(''); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border"
            style={{
              backgroundColor: activeCategory === cat ? 'var(--shifa-blue)' : 'var(--card)',
              color: activeCategory === cat ? '#fff' : 'var(--muted-foreground)',
              borderColor: activeCategory === cat ? 'var(--shifa-blue)' : 'var(--border)',
            }}
          >
            <Icon name={categoryIcons[cat] as any} size={12} />
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Profession list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-1">
        {filtered.map(prof => {
          const isSelected = selected?.id === prof.id;
          return (
            <button
              key={prof.id}
              onClick={() => onSelect(prof)}
              className="flex items-center gap-3 p-3 rounded-xl border text-left transition-all hover:shadow-sm"
              style={{
                backgroundColor: isSelected ? `${prof.color}12` : 'var(--card)',
                borderColor: isSelected ? prof.color : 'var(--border)',
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${prof.color}20` }}
              >
                <Icon name={prof.icon as any} size={16} style={{ color: prof.color }} />
              </div>
              <span className="text-sm font-medium leading-tight" style={{ color: 'var(--foreground)' }}>
                {prof.labelFr}
              </span>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-8 text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Aucune profession trouvée
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Active Workspace ─────────────────────────────────────────────────────────
function ActiveWorkspace({ profession }: { profession: ProfessionConfig }) {
  const [activeTab, setActiveTab] = useState<'modules' | 'stats'>('modules');

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div
        className="rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ background: `linear-gradient(135deg, ${profession.color}18, ${profession.color}08)`, border: `1px solid ${profession.color}30` }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `${profession.color}25` }}
          >
            <Icon name={profession.icon as any} size={28} style={{ color: profession.color }} />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{profession.labelFr}</h2>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              {categoryLabels[profession.category]} · {profession.modules.length} modules disponibles
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: `${profession.color}20`, color: profession.color }}
          >
            Espace actif
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ backgroundColor: 'var(--muted)' }}>
        {(['modules', 'stats'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: activeTab === tab ? 'var(--card)' : 'transparent',
              color: activeTab === tab ? 'var(--foreground)' : 'var(--muted-foreground)',
              boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            {tab === 'modules' ? 'Modules' : 'Indicateurs'}
          </button>
        ))}
      </div>

      {/* Modules grid */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {profession.modules.map(mod => (
            <ModuleCard key={mod.id} mod={mod} color={profession.color} />
          ))}
        </div>
      )}

      {/* Stats grid */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {profession.quickStats.map((stat, i) => (
            <StatCard key={i} stat={stat} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function WorkspaceEngineContent() {
  const [selectedProfession, setSelectedProfession] = useState<ProfessionConfig | null>(
    ProfessionConfigRegistry[0] ?? null
  );
  const [showSelector, setShowSelector] = useState(false);

  const totalProfessions = ProfessionConfigRegistry.length;
  const totalModules = ProfessionConfigRegistry.reduce((acc, p) => acc + p.modules.length, 0);

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto flex flex-col gap-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
            >
              <Icon name="Squares2X2Icon" size={16} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
              Professional Workspace Engine
            </h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Un seul espace. Configuré par profession et rôle. {totalProfessions} professions · {totalModules} modules injectables.
          </p>
        </div>
        <button
          onClick={() => setShowSelector(s => !s)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors border"
          style={{
            backgroundColor: showSelector ? 'var(--shifa-blue)' : 'var(--card)',
            color: showSelector ? '#fff' : 'var(--foreground)',
            borderColor: showSelector ? 'var(--shifa-blue)' : 'var(--border)',
          }}
        >
          <Icon name="AdjustmentsHorizontalIcon" size={16} />
          {showSelector ? 'Fermer le sélecteur' : 'Changer de profession'}
        </button>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        {CATEGORIES.map(cat => {
          const count = getProfessionsByCategory(cat).length;
          return (
            <div
              key={cat}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
            >
              <Icon name={categoryIcons[cat] as any} size={12} />
              {categoryLabels[cat]}
              <span
                className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                style={{ backgroundColor: 'var(--shifa-blue)', color: '#fff', fontSize: '10px' }}
              >
                {count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Profession selector panel */}
      {showSelector && (
        <div
          className="rounded-2xl border p-6"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
            Sélectionner une profession
          </h3>
          <ProfessionSelector
            selected={selectedProfession}
            onSelect={p => {
              setSelectedProfession(p);
              setShowSelector(false);
            }}
          />
        </div>
      )}

      {/* Active workspace */}
      {selectedProfession && !showSelector && (
        <ActiveWorkspace profession={selectedProfession} />
      )}

      {/* Quick-access grid — all professions */}
      {!showSelector && (
        <div>
          <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
            Toutes les professions configurées
          </h3>
          <div className="flex flex-col gap-6">
            {CATEGORIES.map(cat => {
              const profs = getProfessionsByCategory(cat);
              if (profs.length === 0) return null;
              return (
                <div key={cat}>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name={categoryIcons[cat] as any} size={16} style={{ color: 'var(--shifa-blue)' }} />
                    <h4 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                      {categoryLabels[cat]}
                    </h4>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}
                    >
                      {profs.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {profs.map(prof => {
                      const isActive = selectedProfession?.id === prof.id;
                      return (
                        <button
                          key={prof.id}
                          onClick={() => setSelectedProfession(prof)}
                          className="flex items-center gap-3 p-3 rounded-xl border text-left transition-all hover:shadow-sm"
                          style={{
                            backgroundColor: isActive ? `${prof.color}12` : 'var(--card)',
                            borderColor: isActive ? prof.color : 'var(--border)',
                          }}
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${prof.color}20` }}
                          >
                            <Icon name={prof.icon as any} size={16} style={{ color: prof.color }} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold leading-tight truncate" style={{ color: 'var(--foreground)' }}>
                              {prof.labelFr}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>
                              {prof.modules.length} modules
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
