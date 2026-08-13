'use client';
import React from 'react';
import Link from 'next/link';

const stats = [
  { key: 's1', value: '2', label: 'À venir', color: '#0878EF' },
  { key: 's2', value: '5', label: 'Terminés', color: '#059669' },
  { key: 's3', value: '1', label: 'Annulé', color: '#EF4444' },
  { key: 's4', value: '12', label: 'Documents', color: '#7C3AED' },
];

const nextAppointment = {
  date: '25 MAI',
  doctor: 'Dr. Faouzia Ahmed',
  specialty: 'Médecin généraliste',
  location: 'Hôpital El-Maarouf, Moroni',
  time: '10:00',
};

const quickServices = [
  { key: 'ord', icon: '📋', label: 'Ordonnances', href: '/pro-prescriptions', color: '#0878EF', bg: '#EBF4FF' },
  { key: 'res', icon: '🧪', label: "Résultats d\'analyses", href: '/patient-results', color: '#7C3AED', bg: '#F5F3FF' },
  { key: 'dos', icon: '📁', label: 'Dossier médical', href: '/dossier-de-sant', color: '#059669', bg: '#ECFDF5' },
  { key: 'msg', icon: '💬', label: 'Messagerie', href: '/patient-messages', color: '#0EA5E9', bg: '#E0F2FE' },
];

const recentResults = [
  { key: 'r1', type: 'Prise de sang', date: '22 mai 2024', status: 'Disponible', icon: '🩸', color: '#EF4444', bg: '#FEF2F2' },
  { key: 'r2', type: 'Radiographie thorax', date: '15 mai 2024', status: 'Disponible', icon: '🫁', color: '#0878EF', bg: '#EBF4FF' },
  { key: 'r3', type: 'Fiche de suivi', date: '10 mai 2024', status: 'Disponible', icon: '📄', color: '#059669', bg: '#ECFDF5' },
];

const healthDossier = [
  { key: 'd1', label: 'Antécédents', icon: '📋', href: '/dossier-de-sant' },
  { key: 'd2', label: 'Allergies', icon: '⚠️', href: '/dossier-de-sant' },
  { key: 'd3', label: 'Vaccinations', icon: '💉', href: '/patient-vaccination' },
];

export default function PatientHomeContent() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFF' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white"
        style={{ borderBottom: '1px solid #E8EFF8', boxShadow: '0 1px 8px rgba(8,120,239,0.06)' }}
      >
        <div>
          <p className="text-xs font-medium" style={{ color: '#9AAAC0' }}>Bonjour,</p>
          <p className="font-bold text-base" style={{ color: '#123B86' }}>Mohamed Ali 👋</p>
        </div>
        <Link
          href="/patient-notifications"
          className="w-9 h-9 rounded-xl flex items-center justify-center relative"
          style={{ backgroundColor: '#F0F4FA' }}
          aria-label="Notifications"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5" style={{ color: '#5F7A9B' }}>
            <path strokeLinecap="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: '#EF4444' }} />
        </Link>
      </header>
      <div className="px-4 pt-5 pb-28 max-w-2xl mx-auto">
        {/* Stats strip */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {stats?.map((s) => (
            <div key={s?.key} className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-white border" style={{ borderColor: '#E8EFF8', boxShadow: '0 1px 4px rgba(8,120,239,0.05)' }}>
              <p className="text-xl font-bold" style={{ color: s?.color }}>{s?.value}</p>
              <p className="text-xs text-center leading-tight" style={{ color: '#9AAAC0' }}>{s?.label}</p>
            </div>
          ))}
        </div>

        {/* Prochain rendez-vous */}
        <section className="mb-6">
          <p className="text-xs font-semibold mb-3" style={{ color: '#9AAAC0' }}>Prochain rendez-vous</p>
          <div className="rounded-2xl bg-white border p-4" style={{ borderColor: '#E8EFF8', boxShadow: '0 2px 12px rgba(8,120,239,0.08)' }}>
            <div className="flex items-start gap-4">
              <div
                className="flex flex-col items-center justify-center rounded-xl px-3 py-2 shrink-0"
                style={{ backgroundColor: '#EBF4FF', minWidth: '52px' }}
              >
                <p className="text-lg font-bold leading-none" style={{ color: '#0878EF' }}>25</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: '#0878EF' }}>MAI</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: '#123B86' }}>{nextAppointment?.doctor}</p>
                <p className="text-xs mt-0.5" style={{ color: '#5F7A9B' }}>{nextAppointment?.specialty}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5 shrink-0" style={{ color: '#9AAAC0' }}>
                    <path strokeLinecap="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <p className="text-xs truncate" style={{ color: '#9AAAC0' }}>{nextAppointment?.location}</p>
                </div>
              </div>
              <span className="px-2 py-1 rounded-lg text-xs font-bold shrink-0" style={{ backgroundColor: '#EBF4FF', color: '#0878EF' }}>
                {nextAppointment?.time}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Link
                href="/appointment-booking"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ backgroundColor: '#0878EF', boxShadow: '0 2px 8px rgba(8,120,239,0.25)' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                Prendre un rendez-vous
              </Link>
              <Link
                href="/patient-teleconsultation"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border"
                style={{ borderColor: '#E8EFF8', color: '#123B86', backgroundColor: '#F8FAFF' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
                Téléconsultation
              </Link>
            </div>
          </div>
        </section>

        {/* Services rapides */}
        <section className="mb-6">
          <p className="text-xs font-semibold mb-3" style={{ color: '#9AAAC0' }}>Services rapides</p>
          <div className="grid grid-cols-4 gap-3">
            {quickServices?.map((s) => (
              <Link key={s?.key} href={s?.href} className="flex flex-col items-center gap-2 group">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all group-active:scale-95"
                  style={{ backgroundColor: s?.bg, boxShadow: '0 2px 8px rgba(8,120,239,0.08)' }}
                >
                  {s?.icon}
                </div>
                <p className="text-xs text-center leading-tight font-medium" style={{ color: '#5F7A9B' }}>{s?.label}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Mes documents — Derniers résultats */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold" style={{ color: '#123B86' }}>Mes documents</p>
            <Link href="/patient-documents" className="text-xs font-semibold" style={{ color: '#0878EF' }}>Voir tout</Link>
          </div>

          {/* Doc type tabs */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { key: 'ord', label: 'Ordonnances', count: 4, color: '#0878EF', bg: '#EBF4FF' },
              { key: 'res', label: 'Résultats', count: 6, color: '#7C3AED', bg: '#F5F3FF' },
              { key: 'docs', label: 'Documents', count: 12, color: '#059669', bg: '#ECFDF5' },
            ]?.map((d) => (
              <div key={d?.key} className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-white border" style={{ borderColor: '#E8EFF8' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: d?.bg }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4" style={{ color: d?.color }}>
                    <path strokeLinecap="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <p className="text-sm font-bold" style={{ color: d?.color }}>{d?.count}</p>
                <p className="text-xs text-center" style={{ color: '#9AAAC0' }}>{d?.label}</p>
              </div>
            ))}
          </div>

          {/* Derniers résultats */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold" style={{ color: '#9AAAC0' }}>Derniers résultats</p>
            <Link href="/patient-results" className="text-xs font-semibold" style={{ color: '#0878EF' }}>Voir tout</Link>
          </div>
          <div className="flex flex-col gap-2">
            {recentResults?.map((r) => (
              <Link
                key={r?.key}
                href="/patient-results"
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border transition-all active:scale-[0.98]"
                style={{ borderColor: '#E8EFF8', boxShadow: '0 1px 4px rgba(8,120,239,0.04)' }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0" style={{ backgroundColor: r?.bg }}>
                  {r?.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: '#123B86' }}>{r?.type}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#9AAAC0' }}>{r?.date}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold shrink-0" style={{ backgroundColor: '#ECFDF5', color: '#059669' }}>
                  {r?.status}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Mon dossier de santé */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold" style={{ color: '#123B86' }}>Mon dossier de santé</p>
            <Link href="/dossier-de-sant" className="text-xs font-semibold" style={{ color: '#0878EF' }}>Voir tout</Link>
          </div>
          <div className="flex flex-col gap-2">
            {healthDossier?.map((d) => (
              <Link
                key={d?.key}
                href={d?.href}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border transition-all active:scale-[0.98]"
                style={{ borderColor: '#E8EFF8', boxShadow: '0 1px 4px rgba(8,120,239,0.04)' }}
              >
                <span className="text-lg">{d?.icon}</span>
                <p className="flex-1 text-sm font-medium" style={{ color: '#123B86' }}>{d?.label}</p>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 shrink-0" style={{ color: '#9AAAC0' }}>
                  <path strokeLinecap="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}