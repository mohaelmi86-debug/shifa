'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useSupabaseRealtime } from '@/lib/hooks/useSupabaseRealtime';

interface Patient {
  id: string;
  shifa_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  gender: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className}`} />;
}

function calcAge(dob: string | null): string {
  if (!dob) return '—';
  const diff = Date.now() - new Date(dob).getTime();
  return `${Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))} ans`;
}

export default function PatientQueue() {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: patients, loading, error } = useSupabaseRealtime<Patient>({
    table: 'patients',
    filter: { is_active: true },
    orderBy: { column: 'created_at', ascending: false },
    limit: 50,
  });

  const filtered = patients.filter(p =>
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    p.shifa_id.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="card-base">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>
          Patients
          {!loading && <span className="ml-2 text-sm font-normal" style={{ color: 'var(--muted-foreground)' }}>({patients.length})</span>}
        </h2>
        <Link href="/dossier-de-sant" className="text-xs font-semibold transition-colors hover:underline" style={{ color: 'var(--shifa-blue)' }}>
          Voir tous les dossiers
        </Link>
      </div>

      <div className="relative mb-3">
        <Icon name="MagnifyingGlassIcon" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          className="input-field pl-9 text-sm"
          placeholder="Rechercher un patient, SHIFA ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <div className="p-2 rounded-lg mb-3 text-xs" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>{error}</div>
      )}

      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between px-3 py-2 rounded-xl mb-3" style={{ backgroundColor: 'rgba(0, 102, 255, 0.08)', border: '1px solid rgba(0, 102, 255, 0.2)' }}>
          <span className="text-xs font-semibold" style={{ color: 'var(--shifa-blue)' }}>{selectedIds.length} patient(s) sélectionné(s)</span>
          <button onClick={() => setSelectedIds([])} className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Désélectionner</button>
        </div>
      )}

      <div className="overflow-x-auto scrollbar-thin rounded-xl border" style={{ borderColor: 'var(--border)' }}>
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr style={{ backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
              <th className="w-8 px-3 py-2.5">
                <input type="checkbox" className="w-3.5 h-3.5 accent-primary"
                  onChange={(e) => setSelectedIds(e.target.checked ? filtered.map(p => p.id) : [])} />
              </th>
              {['Patient', 'SHIFA ID', 'Âge', 'Genre', 'Téléphone', ''].map((col) => (
                <th key={`th-${col}`} className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1,2,3,4].map(i => (
                <tr key={i}>
                  <td colSpan={7} className="px-3 py-3"><Skeleton className="h-8 w-full" /></td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  {patients.length === 0 ? 'Aucun patient enregistré' : 'Aucun résultat'}
                </td>
              </tr>
            ) : (
              filtered.map((p, idx) => (
                <tr
                  key={p.id}
                  className="group border-b transition-colors hover:bg-muted/50 cursor-pointer"
                  style={{ borderColor: 'var(--border)', backgroundColor: idx % 2 === 0 ? 'var(--card)' : 'var(--background)' }}
                >
                  <td className="px-3 py-3">
                    <input type="checkbox" className="w-3.5 h-3.5 accent-primary"
                      checked={selectedIds.includes(p.id)} onChange={() => toggleSelect(p.id)} />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                        {`${p.first_name[0] || ''}${p.last_name[0] || ''}`}
                      </div>
                      <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{p.first_name} {p.last_name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className="font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.shifa_id}</span>
                  </td>
                  <td className="px-3 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{calcAge(p.date_of_birth)}</td>
                  <td className="px-3 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    {p.gender === 'male' ? 'M' : p.gender === 'female' ? 'F' : '—'}
                  </td>
                  <td className="px-3 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.phone || '—'}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href="/dossier-de-sant" className="p-1.5 rounded-lg transition-colors hover:bg-muted" title="Voir le dossier">
                        <Icon name="FolderOpenIcon" size={14} className="text-muted-foreground" />
                      </Link>
                      <button className="p-1.5 rounded-lg transition-colors hover:bg-muted" title="Démarrer une consultation">
                        <Icon name="PlayIcon" size={14} style={{ color: 'var(--shifa-blue)' } as any} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          {filtered.length} patient(s) affiché(s) · Données en temps réel
        </p>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--shifa-green)' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Live
        </div>
      </div>
    </div>
  );
}