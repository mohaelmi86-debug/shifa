'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import Icon from '@/components/ui/AppIcon';
import { useSupabaseRealtime } from '@/lib/hooks/useSupabaseRealtime';
import { useAuth } from '@/contexts/AuthContext';

const VitalsChart = dynamic(() => import('./VitalsChart'), { ssr: false });

interface HealthRecord {
  id: string;
  record_type: string;
  title: string;
  content: Record<string, unknown>;
  created_at: string;
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className}`} />;
}

const trendIcon: Record<string, string> = {
  up: 'ArrowTrendingUpIcon',
  down: 'ArrowTrendingDownIcon',
  stable: 'MinusIcon',
};
const trendColor: Record<string, string> = {
  up: 'var(--shifa-amber)',
  down: 'var(--shifa-green)',
  stable: 'var(--shifa-blue)',
};

const staticVitals = [
  { key: 'vital-ta', label: 'Tension artérielle', value: '120/80', unit: 'mmHg', icon: 'HeartIcon', color: 'var(--shifa-red)', trend: 'stable', trendLabel: 'Normale' },
  { key: 'vital-pouls', label: 'Pouls', value: '72', unit: 'bpm', icon: 'ArrowTrendingUpIcon', color: 'var(--shifa-blue)', trend: 'up', trendLabel: '+3 bpm' },
  { key: 'vital-poids', label: 'Poids', value: '64', unit: 'kg', icon: 'ScaleIcon', color: 'var(--shifa-green)', trend: 'down', trendLabel: '-0.5 kg' },
  { key: 'vital-glycemie', label: 'Glycémie', value: '5.2', unit: 'mmol/L', icon: 'BeakerIcon', color: 'var(--shifa-amber)', trend: 'stable', trendLabel: 'Normale' },
];

export default function HealthSummary() {
  const { user } = useAuth();

  // Live health records for the current patient
  const { data: records, loading } = useSupabaseRealtime<HealthRecord>({
    table: 'health_records',
    orderBy: { column: 'created_at', ascending: false },
    limit: 5,
    enabled: true,
  });

  const latestConsultation = records.find(r => r.record_type === 'consultation');
  const latestPrescription = records.find(r => r.record_type === 'prescription');

  return (
    <div className="card-base">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>Résumé de santé</h2>
        <button className="text-xs font-semibold transition-colors hover:underline" style={{ color: 'var(--shifa-blue)' }}>
          Voir le dossier
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {staticVitals.map((v) => (
          <div key={v.key} className="p-3 rounded-xl border" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-1.5">
              <Icon name={v.icon as any} size={14} style={{ color: v.color } as any} />
              <div className="flex items-center gap-0.5">
                <Icon name={trendIcon[v.trend] as any} size={11} style={{ color: trendColor[v.trend] } as any} />
                <span className="text-xs font-medium" style={{ color: trendColor[v.trend], fontSize: '10px' }}>{v.trendLabel}</span>
              </div>
            </div>
            <p className="text-lg font-extrabold font-tabular" style={{ color: 'var(--foreground)' }}>{v.value}</p>
            <p className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>{v.label}</p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{v.unit}</p>
          </div>
        ))}
      </div>

      <div className="h-28 mt-2">
        <VitalsChart />
      </div>

      {/* Live records summary */}
      {loading ? (
        <Skeleton className="h-12 w-full mt-3" />
      ) : records.length > 0 ? (
        <div className="mt-3 space-y-2">
          {latestConsultation && (
            <div className="p-3 rounded-xl border flex items-start gap-2" style={{ backgroundColor: 'rgba(0,102,255,0.04)', borderColor: 'rgba(0,102,255,0.15)' }}>
              <Icon name="ClipboardDocumentListIcon" size={15} style={{ color: 'var(--shifa-blue)', flexShrink: 0 } as any} />
              <div>
                <p className="text-xs font-semibold" style={{ color: 'var(--shifa-blue)' }}>Dernière consultation</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{latestConsultation.title}</p>
              </div>
            </div>
          )}
          {latestPrescription && (
            <div className="p-3 rounded-xl border flex items-start gap-2" style={{ backgroundColor: 'rgba(16,185,129,0.04)', borderColor: 'rgba(16,185,129,0.15)' }}>
              <Icon name="DocumentCheckIcon" size={15} style={{ color: 'var(--shifa-green)', flexShrink: 0 } as any} />
              <div>
                <p className="text-xs font-semibold" style={{ color: 'var(--shifa-green)' }}>Ordonnance active</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{latestPrescription.title}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-3 p-3 rounded-xl border flex items-start gap-2" style={{ backgroundColor: 'rgba(245, 158, 11, 0.06)', borderColor: 'rgba(245, 158, 11, 0.25)' }}>
          <Icon name="ExclamationTriangleIcon" size={15} style={{ color: 'var(--shifa-amber)', flexShrink: 0 } as any} />
          <div>
            <p className="text-xs font-semibold" style={{ color: 'var(--shifa-amber)' }}>Rappel vaccination</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Rappel DTP prévu le 20 sept. 2026</p>
          </div>
        </div>
      )}
    </div>
  );
}