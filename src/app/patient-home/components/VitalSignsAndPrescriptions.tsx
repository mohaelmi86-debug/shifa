'use client';
import React from 'react';
import Icon from '@/components/ui/AppIcon';
import { useSupabaseRealtime } from '@/lib/hooks/useSupabaseRealtime';
import { useAuth } from '@/contexts/AuthContext';

interface VitalSign {
  id: string;
  vital_type: string;
  value: string;
  unit: string;
  recorded_at: string;
  status: string | null;
}

interface Prescription {
  id: string;
  medication_name: string;
  dosage: string | null;
  frequency: string | null;
  status: string;
  prescribed_at: string;
  end_date: string | null;
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className}`} />;
}

const vitalIcons: Record<string, { icon: string; color: string }> = {
  blood_pressure: { icon: 'HeartIcon', color: 'var(--shifa-red)' },
  heart_rate: { icon: 'ArrowTrendingUpIcon', color: 'var(--shifa-blue)' },
  weight: { icon: 'ScaleIcon', color: 'var(--shifa-green)' },
  blood_glucose: { icon: 'BeakerIcon', color: 'var(--shifa-amber)' },
  temperature: { icon: 'FireIcon', color: '#f97316' },
  oxygen_saturation: { icon: 'CloudIcon', color: '#06b6d4' },
};

const prescriptionStatusStyle: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Actif', color: '#059669', bg: 'rgba(16,185,129,0.08)' },
  completed: { label: 'Terminé', color: '#6b7280', bg: 'rgba(107,114,128,0.08)' },
  cancelled: { label: 'Annulé', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
  pending: { label: 'En attente', color: '#d97706', bg: 'rgba(217,119,6,0.08)' },
};

export default function VitalSignsAndPrescriptions() {
  const { user } = useAuth();

  const { data: vitals, loading: vitalsLoading } = useSupabaseRealtime<VitalSign>({
    table: 'vital_signs',
    orderBy: { column: 'recorded_at', ascending: false },
    limit: 6,
    enabled: !!user,
  });

  const { data: prescriptions, loading: rxLoading } = useSupabaseRealtime<Prescription>({
    table: 'prescriptions',
    filter: { status: 'active' },
    orderBy: { column: 'prescribed_at', ascending: false },
    limit: 5,
    enabled: !!user,
  });

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* ── Vital Signs ── */}
      <div className="card-base">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--shifa-red), #f97316)' }}>
              <Icon name="HeartIcon" size={14} className="text-white" />
            </div>
            <h2 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Constantes vitales</h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--shifa-green)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live
          </div>
        </div>

        {vitalsLoading ? (
          <div className="grid grid-cols-2 gap-2">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : vitals.length === 0 ? (
          <div className="text-center py-6" style={{ color: 'var(--muted-foreground)' }}>
            <Icon name="HeartIcon" size={28} className="mx-auto mb-2 opacity-30" />
            <p className="text-xs">Aucune constante enregistrée</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {vitals.slice(0, 4).map((v) => {
              const cfg = vitalIcons[v.vital_type] || { icon: 'ChartBarIcon', color: 'var(--shifa-blue)' };
              return (
                <div key={v.id} className="p-3 rounded-xl border"
                  style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-1">
                    <Icon name={cfg.icon as any} size={13} style={{ color: cfg.color } as any} />
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>
                      {formatDate(v.recorded_at)}
                    </span>
                  </div>
                  <p className="text-base font-extrabold font-tabular" style={{ color: 'var(--foreground)' }}>
                    {v.value}
                    <span className="text-xs font-normal ml-0.5" style={{ color: 'var(--muted-foreground)' }}>{v.unit}</span>
                  </p>
                  <p className="text-xs mt-0.5 capitalize" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>
                    {v.vital_type.replace(/_/g, ' ')}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Active Prescriptions ── */}
      <div className="card-base">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
              <Icon name="DocumentCheckIcon" size={14} className="text-white" />
            </div>
            <h2 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Ordonnances actives</h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--shifa-green)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live
          </div>
        </div>

        {rxLoading ? (
          <div className="flex flex-col gap-2">
            {[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="text-center py-6" style={{ color: 'var(--muted-foreground)' }}>
            <Icon name="DocumentCheckIcon" size={28} className="mx-auto mb-2 opacity-30" />
            <p className="text-xs">Aucune ordonnance active</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {prescriptions.map((rx) => {
              const s = prescriptionStatusStyle[rx.status] || prescriptionStatusStyle.pending;
              return (
                <div key={rx.id} className="flex items-start gap-3 p-3 rounded-xl border"
                  style={{ backgroundColor: s.bg, borderColor: 'var(--border)' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
                    <Icon name="DocumentCheckIcon" size={13} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-semibold truncate" style={{ color: 'var(--foreground)' }}>
                        {rx.medication_name}
                      </p>
                      <span className="text-xs font-medium shrink-0" style={{ color: s.color }}>{s.label}</span>
                    </div>
                    {rx.dosage && (
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                        {rx.dosage}{rx.frequency ? ` · ${rx.frequency}` : ''}
                      </p>
                    )}
                    {rx.end_date && (
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>
                        Jusqu'au {formatDate(rx.end_date)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
