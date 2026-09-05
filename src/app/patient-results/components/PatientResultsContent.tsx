'use client';
import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

type ResultTab = 'all' | 'biologie' | 'imagerie' | 'anatomopathologie';

interface Result {
  id: string;
  date: string;
  type: 'biologie' | 'imagerie' | 'anatomopathologie';
  title: string;
  lab: string;
  prescribedBy: string;
  status: 'normal' | 'abnormal' | 'critical' | 'pending';
  values?: { name: string; value: string; unit: string; ref: string; flag?: 'H' | 'L' | 'N' }[];
}

const typeConfig = {
  biologie: { label: 'Biologie', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.1)', icon: 'BeakerIcon' },
  imagerie: { label: 'Imagerie', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', icon: 'PhotoIcon' },
  anatomopathologie: { label: 'Anatomopathologie', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: 'MagnifyingGlassIcon' },
};

const statusConfig = {
  normal: { label: 'Normal', color: '#16a34a', bg: '#dcfce7' },
  abnormal: { label: 'Anomalie', color: '#d97706', bg: '#fef3c7' },
  critical: { label: 'Critique', color: '#dc2626', bg: '#fee2e2' },
  pending: { label: 'En attente', color: '#6b7280', bg: '#f3f4f6' },
};

const flagConfig = { H: { color: '#dc2626', label: 'Élevé' }, L: { color: '#2563eb', label: 'Bas' }, N: { color: '#16a34a', label: 'Normal' } };

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl ${className}`} style={{ backgroundColor: 'var(--muted)' }} aria-hidden="true" />;
}

// Map Supabase status to local status
function mapStatus(s: string): 'normal' | 'abnormal' | 'critical' | 'pending' {
  if (s === 'Normal') return 'normal';
  if (s === 'Anomalie') return 'critical';
  if (s === 'À surveiller') return 'abnormal';
  return 'pending';
}

export default function PatientResultsContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ResultTab>('all');
  const [selected, setSelected] = useState<Result | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    setLoading(true);
    setError(null);

    supabase
      .from('lab_results')
      .select('id, title, lab_name, result_date, status, result_data, notes')
      .eq('patient_id', user.id)
      .order('result_date', { ascending: false })
      .then(({ data, error: err }) => {
        if (err) {
          setError('Impossible de charger vos résultats.');
          setResults([]);
        } else if (data && data.length > 0) {
          setResults(data.map((r: any) => ({
            id: r.id,
            date: r.result_date ? new Date(r.result_date).toLocaleDateString('fr-FR') : '',
            type: 'biologie' as const,
            title: r.title || 'Résultat',
            lab: r.lab_name || 'Laboratoire',
            prescribedBy: '',
            status: mapStatus(r.status || 'En attente'),
            values: r.result_data?.values || undefined,
          })));
        } else {
          setResults([]);
        }
        setLoading(false);
      });
  }, [user]);

  const tabs: { key: ResultTab; label: string; icon: string }[] = [
    { key: 'all', label: 'Tous', icon: 'ClipboardDocumentListIcon' },
    { key: 'biologie', label: 'Biologie', icon: 'BeakerIcon' },
    { key: 'imagerie', label: 'Imagerie', icon: 'PhotoIcon' },
    { key: 'anatomopathologie', label: 'Anatomopathologie', icon: 'MagnifyingGlassIcon' },
  ];

  const filtered = activeTab === 'all' ? results : results.filter(r => r.type === activeTab);

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Mes Résultats</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Résultats de biologie, imagerie et anatomopathologie</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all"
            style={{
              backgroundColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--shifa-surface-2)',
              color: activeTab === tab.key ? 'white' : 'var(--shifa-gray)',
              border: `1px solid ${activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--border)'}`,
            }}
          >
            <Icon name={tab.icon as any} size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA' }}>
          <Icon name="ExclamationTriangleIcon" size={20} style={{ color: '#DC2626' } as any} />
          <p className="text-sm font-semibold" style={{ color: '#991B1B' }}>{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--shifa-light)' }}>
            <Icon name="BeakerIcon" size={28} style={{ color: 'var(--shifa-blue)' } as any} />
          </div>
          <p className="text-base font-semibold mb-1" style={{ color: 'var(--shifa-dark)' }}>Aucun résultat disponible</p>
          <p className="text-sm" style={{ color: 'var(--shifa-gray)' }}>Vos résultats d'analyses apparaîtront ici</p>
        </div>
      )}

      {/* Results list */}
      {!loading && !error && filtered.length > 0 && (
        <div className="flex flex-col gap-3">
          {filtered.map(result => {
            const tc = typeConfig[result.type];
            const sc = statusConfig[result.status];
            return (
              <div
                key={result.id}
                className="rounded-2xl p-4 cursor-pointer transition-all hover:shadow-shifa"
                style={{ backgroundColor: 'var(--shifa-surface-2)', border: `1px solid ${selected?.id === result.id ? 'var(--shifa-blue)' : 'var(--border)'}` }}
                onClick={() => setSelected(selected?.id === result.id ? null : result)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setSelected(selected?.id === result.id ? null : result)}
                aria-expanded={selected?.id === result.id}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: tc.bg }}>
                    <Icon name={tc.icon as any} size={18} style={{ color: tc.color } as any} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <p className="font-semibold text-sm" style={{ color: 'var(--shifa-dark)' }}>{result.title}</p>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0" style={{ backgroundColor: sc.bg, color: sc.color }}>
                        {sc.label}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--shifa-gray)' }}>
                      {result.lab}{result.prescribedBy ? ` · ${result.prescribedBy}` : ''} · {result.date}
                    </p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: tc.bg, color: tc.color, fontSize: '10px' }}>
                      {tc.label}
                    </span>
                  </div>
                </div>

                {/* Expanded values */}
                {selected?.id === result.id && result.values && result.values.length > 0 && (
                  <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--shifa-gray)' }}>Valeurs détaillées</p>
                    <div className="flex flex-col gap-2">
                      {result.values.map((v, i) => {
                        const fc = v.flag ? flagConfig[v.flag] : null;
                        return (
                          <div key={i} className="flex items-center justify-between gap-2 p-2.5 rounded-xl" style={{ backgroundColor: 'var(--background)' }}>
                            <p className="text-sm font-medium" style={{ color: 'var(--shifa-dark)' }}>{v.name}</p>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-sm font-bold" style={{ color: fc ? fc.color : 'var(--shifa-dark)' }}>
                                {v.value} {v.unit}
                              </span>
                              <span className="text-xs" style={{ color: 'var(--shifa-gray)' }}>({v.ref})</span>
                              {fc && (
                                <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ color: fc.color, backgroundColor: `${fc.color}18` }}>
                                  {v.flag}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
