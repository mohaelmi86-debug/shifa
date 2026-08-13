'use client';
import React from 'react';

const stats = [
  { key: 's1', value: '57', label: 'Pays', icon: '🌍' },
  { key: 's2', value: '100%', label: 'Sécurisé', icon: '🔒' },
  { key: 's3', value: '24/7', label: 'Disponible', icon: '⚡' },
];

export default function LandingStats() {
  return (
    <section className="px-5 py-8 bg-white">
      <div className="max-w-md mx-auto">
        <div className="rounded-2xl p-5" style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
          <p className="text-center text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: '#2563EB' }}>
            Chiffres clés
          </p>
          <div className="grid grid-cols-3 gap-3">
            {stats?.map((s) => (
              <div key={s?.key} className="flex flex-col items-center gap-1.5 text-center">
                <span className="text-2xl">{s?.icon}</span>
                <p className="text-xl font-extrabold" style={{ color: '#0F172A', letterSpacing: '-0.03em' }}>{s?.value}</p>
                <p className="text-xs font-medium" style={{ color: '#64748B' }}>{s?.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
