'use client';
import React from 'react';
import Link from 'next/link';

const paths = [
  {
    key: 'patient',
    emoji: '🩺',
    label: 'Patient',
    desc: 'Dossier médical, rendez-vous, suivi',
    color: '#2563EB',
    bg: '#EFF6FF',
    border: '#BFDBFE',
  },
  {
    key: 'pro',
    emoji: '👨‍⚕️',
    label: 'Professionnel',
    desc: 'Agenda, consultations, prescriptions',
    color: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
  },
  {
    key: 'etablissement',
    emoji: '🏥',
    label: 'Établissement',
    desc: 'Gestion, équipes, modules',
    color: '#7C3AED',
    bg: '#F5F3FF',
    border: '#DDD6FE',
  },
];

export default function LandingPaths() {
  return (
    <section className="px-5 py-8" style={{ backgroundColor: '#F8FAFF' }}>
      <div className="max-w-md mx-auto">
        <p className="text-center text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: '#2563EB' }}>
          Qui êtes-vous ?
        </p>

        <div className="flex flex-col gap-3">
          {paths?.map((p) => (
            <Link key={p?.key} href="/sign-up-login-screen" className="block group">
              <div
                className="flex items-center gap-4 p-4 rounded-2xl border transition-all duration-150 active:scale-98"
                style={{ backgroundColor: p?.bg, borderColor: p?.border }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ backgroundColor: 'white', boxShadow: `0 2px 8px ${p?.color}20` }}
                >
                  {p?.emoji}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm" style={{ color: '#0F172A' }}>{p?.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{p?.desc}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: p?.color, flexShrink: 0 }}>
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
