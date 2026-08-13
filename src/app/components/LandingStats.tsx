'use client';
import React from 'react';

const stats = [
  {
    key: 's1',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    label: 'Sécurisé',
    desc: 'Données protégées et conformes aux normes internationales',
    color: '#0878EF',
    bg: '#EBF4FF',
  },
  {
    key: 's2',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
    label: 'Accessible',
    desc: 'À tout moment, partout, sur tous vos appareils',
    color: '#0878EF',
    bg: '#EBF4FF',
  },
  {
    key: 's3',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
    label: 'Connecté',
    desc: 'Un écosystème complet de santé numérique',
    color: '#0878EF',
    bg: '#EBF4FF',
  },
  {
    key: 's4',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    label: 'Fiable',
    desc: 'Conforme aux normes internationales de santé',
    color: '#0878EF',
    bg: '#EBF4FF',
  },
];

export default function LandingStats() {
  return (
    <section className="py-8 lg:py-12" style={{ backgroundColor: '#F8FAFF' }}>
      <div className="max-w-screen-xl mx-auto px-5 lg:px-10 xl:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats?.map((s) => (
            <div key={s?.key} className="flex flex-col gap-3 p-4 rounded-2xl bg-white border" style={{ borderColor: '#E8EFF8', boxShadow: '0 1px 6px rgba(8,120,239,0.05)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s?.bg, color: s?.color }}>
                {s?.icon}
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: '#123B86' }}>{s?.label}</p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: '#5F7A9B' }}>{s?.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
