'use client';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';
import {
  ProfessionConfigRegistry,
  ProfessionConfig,
  ProfessionCategory,
  categoryLabels,
  categoryIcons,
  getProfessionsByCategory,
} from '@/lib/professionConfig';
import {
  fetchWorkspaceProfile,
  fetchWorkspaceKPIs,
  buildWorkspaceAlerts,
  WorkspaceProfile,
  WorkspaceKPIs,
  WorkspaceAlert,
} from '@/lib/supabase/workspaceService';
import ProfessionSummaryCard from './ProfessionSummaryCard';

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
      <div className="relative">
        <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
        <input
          type="text"
          placeholder="Rechercher une profession..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border text-sm outline-none focus:ring-2"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
        />
      </div>
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
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${prof.color}20` }}>
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

// ─── Active Workspace (module grid) ──────────────────────────────────────────
function ActiveWorkspace({ profession }: { profession: ProfessionConfig }) {
  const [activeTab, setActiveTab] = useState<'modules' | 'stats'>('modules');
  return (
    <div className="flex flex-col gap-6">
      <div
        className="rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ background: `linear-gradient(135deg, ${profession.color}18, ${profession.color}08)`, border: `1px solid ${profession.color}30` }}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${profession.color}25` }}>
            <Icon name={profession.icon as any} size={28} style={{ color: profession.color }} />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{profession.labelFr}</h2>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              {categoryLabels[profession.category]} · {profession.modules.length} modules disponibles
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: `${profession.color}20`, color: profession.color }}>
          Espace actif
        </span>
      </div>
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
      {activeTab === 'modules' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {profession.modules.map(mod => (
            <ModuleCard key={mod.id} mod={mod} color={profession.color} />
          ))}
        </div>
      )}
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

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function SummarySkeleton() {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      <div className="rounded-2xl p-6 h-36" style={{ backgroundColor: 'var(--muted)' }} />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl h-20" style={{ backgroundColor: 'var(--muted)' }} />
        ))}
      </div>
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl h-10 w-36" style={{ backgroundColor: 'var(--muted)' }} />
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function WorkspaceEngineContent() {
  const { user } = useAuth();

  // Live data state
  const [workspaceProfile, setWorkspaceProfile] = useState<WorkspaceProfile | null>(null);
  const [kpis, setKpis] = useState<WorkspaceKPIs | null>(null);
  const [alerts, setAlerts] = useState<WorkspaceAlert[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  // UI state
  const [selectedProfession, setSelectedProfession] = useState<ProfessionConfig | null>(null);
  const [showSelector, setShowSelector] = useState(false);
  const [showModuleGrid, setShowModuleGrid] = useState(false);

  const totalProfessions = ProfessionConfigRegistry.length;
  const totalModules = ProfessionConfigRegistry.reduce((acc, p) => acc + p.modules.length, 0);

  // Resolve profession config from live profile
  const resolvedProfession = useMemo(() => {
    if (selectedProfession) return selectedProfession;
    if (!workspaceProfile?.profession) return ProfessionConfigRegistry[0] ?? null;
    // Try to match by profession id or label
    const match = ProfessionConfigRegistry.find(
      p =>
        p.id === workspaceProfile.profession ||
        p.label.toLowerCase() === workspaceProfile.profession?.toLowerCase() ||
        p.labelFr.toLowerCase() === workspaceProfile.profession?.toLowerCase()
    );
    return match ?? ProfessionConfigRegistry[0] ?? null;
  }, [selectedProfession, workspaceProfile]);

  const loadLiveData = useCallback(async () => {
    if (!user?.id) {
      setLoadingProfile(false);
      return;
    }
    setLoadingProfile(true);
    setProfileError(null);
    try {
      const profile = await fetchWorkspaceProfile(user.id);
      setWorkspaceProfile(profile);

      if (profile?.professionalId) {
        const liveKpis = await fetchWorkspaceKPIs(
          profile.professionalId,
          profile.organizationId
        );
        setKpis(liveKpis);
        setAlerts(buildWorkspaceAlerts(profile, liveKpis));
      }
    } catch (err: any) {
      setProfileError(err?.message ?? 'Erreur lors du chargement du profil.');
    } finally {
      setLoadingProfile(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadLiveData();
  }, [loadLiveData]);

  // When profession is selected manually, reset module grid view
  const handleSelectProfession = (p: ProfessionConfig) => {
    setSelectedProfession(p);
    setShowSelector(false);
    setShowModuleGrid(false);
  };

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
        <div className="flex items-center gap-2">
          {showModuleGrid && (
            <button
              onClick={() => setShowModuleGrid(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors border"
              style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
            >
              <Icon name="ArrowLeftIcon" size={16} />
              Résumé
            </button>
          )}
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
        <div className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
            Sélectionner une profession
          </h3>
          <ProfessionSelector
            selected={resolvedProfession}
            onSelect={handleSelectProfession}
          />
        </div>
      )}

      {/* Main content area */}
      {!showSelector && resolvedProfession && (
        <>
          {/* ── SUMMARY LANDING CARD (before module grid) ── */}
          {!showModuleGrid && (
            <>
              {loadingProfile ? (
                <SummarySkeleton />
              ) : profileError ? (
                <div
                  className="rounded-2xl border p-6 flex flex-col items-center gap-3 text-center"
                  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                >
                  <Icon name="ExclamationTriangleIcon" size={32} style={{ color: '#dc2626' }} />
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                    Impossible de charger les données en direct
                  </p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{profileError}</p>
                  <button
                    onClick={loadLiveData}
                    className="px-4 py-2 rounded-xl text-sm font-medium"
                    style={{ backgroundColor: 'var(--shifa-blue)', color: '#fff' }}
                  >
                    Réessayer
                  </button>
                </div>
              ) : workspaceProfile ? (
                <ProfessionSummaryCard
                  profession={resolvedProfession}
                  profile={workspaceProfile}
                  kpis={kpis ?? {
                    todayAppointments: 0,
                    pendingAppointments: 0,
                    completedToday: 0,
                    teleconsultToday: 0,
                    totalPatients: 0,
                    recentRecords: 0,
                    pendingRecords: 0,
                  }}
                  alerts={alerts}
                  onEnterWorkspace={() => setShowModuleGrid(true)}
                />
              ) : (
                /* Not a professional — show summary card with static config data */
                <div className="flex flex-col gap-5">
                  {/* Guest / patient banner */}
                  <div
                    className="rounded-2xl border p-5 flex items-start gap-4"
                    style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${resolvedProfession.color}18` }}
                    >
                      <Icon name={resolvedProfession.icon as any} size={24} style={{ color: resolvedProfession.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                        Espace {resolvedProfession.labelFr}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                        Aucun profil professionnel associé à ce compte. Créez ou complétez votre profil pour accéder aux indicateurs en direct.
                      </p>
                      <Link
                        href="/pro-profile"
                        className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold hover:underline"
                        style={{ color: resolvedProfession.color }}
                      >
                        <Icon name="UserPlusIcon" size={12} />
                        Créer mon profil professionnel
                      </Link>
                    </div>
                    <button
                      onClick={() => setShowModuleGrid(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shrink-0"
                      style={{ background: `linear-gradient(135deg, ${resolvedProfession.color}, ${resolvedProfession.color}cc)`, color: '#fff' }}
                    >
                      <Icon name="Squares2X2Icon" size={14} />
                      Modules
                    </button>
                  </div>
                  {/* Static KPI tiles from config */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
                      Indicateurs de référence
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {resolvedProfession.quickStats.map((stat, i) => (
                        <StatCard key={i} stat={stat} />
                      ))}
                    </div>
                  </div>
                  {/* Quick actions */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
                      Accès rapide
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {resolvedProfession.modules.slice(0, 5).filter(m => m.href).map(mod => (
                        <Link
                          key={mod.id}
                          href={mod.href!}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all hover:shadow-sm"
                          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                        >
                          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: `${resolvedProfession.color}18` }}>
                            <Icon name={mod.icon as any} size={13} style={{ color: resolvedProfession.color }} />
                          </div>
                          {mod.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── MODULE GRID (after entering workspace) ── */}
          {showModuleGrid && (
            <ActiveWorkspace profession={resolvedProfession} />
          )}
        </>
      )}

      {/* Quick-access grid — all professions (only when selector is closed and not in module grid) */}
      {!showSelector && !showModuleGrid && (
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
                      const isActive = resolvedProfession?.id === prof.id;
                      return (
                        <button
                          key={prof.id}
                          onClick={() => handleSelectProfession(prof)}
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
