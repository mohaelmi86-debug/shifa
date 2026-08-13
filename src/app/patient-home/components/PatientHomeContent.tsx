'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
}

const staticNews: NewsItem[] = [
  { id: 'n1', title: 'Importance de la vaccination contre la grippe saisonnière', category: 'Prévention', date: '12 août 2026', readTime: '3 min' },
  { id: 'n2', title: 'Nouvelles recommandations sur l\'activité physique et la santé cardiaque', category: 'Cardiologie', date: '10 août 2026', readTime: '4 min' },
  { id: 'n3', title: 'Santé mentale : briser les tabous pour mieux se soigner', category: 'Santé mentale', date: '8 août 2026', readTime: '5 min' },
];

const quickActions = [
  { key: 'rdv', icon: CalendarIcon, label: 'Rendez-vous', href: '/appointment-booking', color: '#1565D8', bg: '#E3EDFF' },
  { key: 'teleconsult', icon: VideoIcon, label: 'Téléconsultation', href: '/patient-teleconsultation', color: '#059669', bg: '#D1FAE5' },
  { key: 'results', icon: BeakerIcon, label: 'Résultats', href: '/patient-results', color: '#6D28D9', bg: '#EDE9FE' },
  { key: 'dossier', icon: FolderIcon, label: 'Dossier santé', href: '/dossier-de-sant', color: '#0EA5E9', bg: '#E0F2FE' },
  { key: 'messages', icon: ChatIcon, label: 'Messages', href: '/patient-messages', color: '#D97706', bg: '#FEF3C7' },
  { key: 'prevention', icon: ShieldIcon, label: 'Prévention', href: '/patient-prevention', color: '#059669', bg: '#D1FAE5' },
];

const docTypes = [
  { key: 'ord', label: 'Ordonnances', count: 4, color: '#1565D8', bg: '#E3EDFF', href: '/patient-documents' },
  { key: 'res', label: 'Résultats', count: 6, color: '#6D28D9', bg: '#EDE9FE', href: '/patient-results' },
  { key: 'docs', label: 'Documents', count: 12, color: '#059669', bg: '#D1FAE5', href: '/patient-documents' },
];

const recentResults = [
  { key: 'r1', type: 'Bilan sanguin complet', lab: 'Laboratoire Central', date: '22 août 2026', status: 'Normal', statusColor: '#059669', statusBg: '#D1FAE5' },
  { key: 'r2', type: 'Radiographie thoracique', lab: 'Imagerie Médicale', date: '15 août 2026', status: 'À surveiller', statusColor: '#D97706', statusBg: '#FEF3C7' },
  { key: 'r3', type: 'Fiche de suivi tension', lab: 'Dr. Faouzia Ahmed', date: '10 août 2026', status: 'Normal', statusColor: '#059669', statusBg: '#D1FAE5' },
];

const healthDossierItems = [
  { key: 'd1', label: 'Antécédents médicaux', sub: 'Historique complet', icon: ClipboardIcon, href: '/dossier-de-sant' },
  { key: 'd2', label: 'Allergies & intolérances', sub: '2 allergies enregistrées', icon: AlertIcon, href: '/dossier-de-sant' },
  { key: 'd3', label: 'Vaccinations', sub: 'Carnet à jour', icon: ShieldIcon, href: '/patient-vaccination' },
  { key: 'd4', label: 'Traitements en cours', sub: '1 traitement actif', icon: PillIcon, href: '/dossier-de-sant' },
];

// ── Inline SVG icons ──────────────────────────────────────────────────────────
function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}
function VideoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}
function BeakerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15M14.25 3.104c.251.023.501.05.75.082M19.8 15a2.25 2.25 0 01.45 1.318 2.25 2.25 0 01-2.25 2.25H5.25a2.25 2.25 0 01-2.25-2.25 2.25 2.25 0 01.45-1.318L5 14.5m14.8.5l.45.318M5 14.5l-.45.318" />
    </svg>
  );
}
function FolderIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
  );
}
function ChatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  );
}
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}
function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );
}
function AlertIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}
function PillIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15M14.25 3.104c.251.023.501.05.75.082M19.8 15a2.25 2.25 0 01.45 1.318 2.25 2.25 0 01-2.25 2.25H5.25a2.25 2.25 0 01-2.25-2.25 2.25 2.25 0 01.45-1.318L5 14.5m14.8.5l.45.318M5 14.5l-.45.318" />
    </svg>
  );
}
function BellIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
  );
}
function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}
function NewsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
    </svg>
  );
}

export default function PatientHomeContent() {
  const { user } = useAuth();
  const [userName, setUserName] = useState<string>('');
  const [news, setNews] = useState<NewsItem[]>(staticNews);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from('user_profiles')
      .select('full_name')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.full_name) setUserName(data.full_name.split(' ')[0]);
        else if (user.email) setUserName(user.email.split('@')[0]);
      });
  }, [user]);

  useEffect(() => {
    fetch('/api/health-news')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setNews(data.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setNewsLoading(false));
  }, []);

  const greeting = userName ? `Bonjour, ${userName}` : 'Bonjour';

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* ── Sticky Header ──────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-4 py-3"
        style={{
          backgroundColor: 'var(--shifa-surface-2)',
          borderBottom: '1px solid var(--border)',
          boxShadow: '0 1px 8px rgba(21,88,214,0.06)',
        }}
      >
        <div>
          <p className="text-xs font-medium" style={{ color: 'var(--shifa-gray)' }}>
            {greeting}
          </p>
          <p className="font-bold text-base" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}>
            Mon espace santé 👋
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/patient-notifications"
            className="w-9 h-9 rounded-xl flex items-center justify-center relative transition-colors"
            style={{ backgroundColor: 'var(--shifa-light)' }}
            aria-label="Notifications"
          >
            <BellIcon className="w-5 h-5" />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ backgroundColor: 'var(--shifa-red)' }}
              aria-hidden="true"
            />
          </Link>
        </div>
      </header>

      <div className="px-4 pt-5 pb-28 max-w-2xl mx-auto lg:max-w-3xl">

        {/* ── Stats Strip ────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { value: '2', label: 'À venir', color: 'var(--shifa-blue)', bg: 'var(--shifa-light)' },
            { value: '5', label: 'Terminés', color: 'var(--shifa-green)', bg: 'var(--shifa-green-light)' },
            { value: '1', label: 'Annulé', color: 'var(--shifa-red)', bg: 'var(--shifa-red-light)' },
            { value: '12', label: 'Documents', color: 'var(--shifa-purple)', bg: '#EDE9FE' },
          ].map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1 p-3 rounded-2xl"
              style={{
                backgroundColor: 'var(--shifa-surface-2)',
                border: '1px solid var(--border)',
                boxShadow: '0 1px 4px rgba(21,88,214,0.05)',
              }}
            >
              <p className="text-xl font-bold" style={{ color: s.color, fontFamily: 'var(--font-heading)' }}>{s.value}</p>
              <p className="text-xs text-center leading-tight" style={{ color: 'var(--shifa-gray)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Prochain rendez-vous ────────────────────────────────── */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}>
              Prochain rendez-vous
            </p>
            <Link href="/appointment-history" className="text-xs font-semibold" style={{ color: 'var(--shifa-blue)' }}>
              Voir tout
            </Link>
          </div>
          <div
            className="rounded-2xl p-4"
            style={{
              backgroundColor: 'var(--shifa-surface-2)',
              border: '1px solid var(--border)',
              boxShadow: '0 2px 12px rgba(21,88,214,0.07)',
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="flex flex-col items-center justify-center rounded-xl px-3 py-2 shrink-0"
                style={{ backgroundColor: 'var(--shifa-light)', minWidth: '52px' }}
              >
                <p className="text-lg font-bold leading-none" style={{ color: 'var(--shifa-blue)', fontFamily: 'var(--font-heading)' }}>25</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--shifa-blue)' }}>AOÛT</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}>
                  Dr. Faouzia Ahmed
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--shifa-gray)' }}>Médecin généraliste</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--shifa-gray)' }}>
                    <path strokeLinecap="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <p className="text-xs truncate" style={{ color: 'var(--shifa-gray)' }}>Hôpital El-Maarouf, Moroni</p>
                </div>
              </div>
              <span
                className="px-2.5 py-1 rounded-lg text-xs font-bold shrink-0"
                style={{ backgroundColor: 'var(--shifa-light)', color: 'var(--shifa-blue)' }}
              >
                10:00
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Link
                href="/appointment-booking"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
                style={{ backgroundColor: 'var(--shifa-blue)', boxShadow: '0 2px 8px rgba(21,101,216,0.25)' }}
              >
                <CalendarIcon className="w-4 h-4" />
                Nouveau rendez-vous
              </Link>
              <Link
                href="/patient-teleconsultation"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all active:scale-95"
                style={{ borderColor: 'var(--border)', color: 'var(--shifa-dark)', backgroundColor: 'var(--shifa-surface)' }}
              >
                <VideoIcon className="w-4 h-4" />
                Téléconsultation
              </Link>
            </div>
          </div>
        </section>

        {/* ── Actions rapides ─────────────────────────────────────── */}
        <section className="mb-6">
          <p className="text-sm font-bold mb-3" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}>
            Accès rapide
          </p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {quickActions.map((a) => {
              const IconComp = a.icon;
              return (
                <Link key={a.key} href={a.href} className="flex flex-col items-center gap-2 group">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-active:scale-95 group-hover:shadow-md"
                    style={{ backgroundColor: a.bg }}
                  >
                    <IconComp className="w-6 h-6" style={{ color: a.color } as React.CSSProperties} />
                  </div>
                  <p className="text-xs text-center leading-tight font-medium" style={{ color: 'var(--shifa-gray)' }}>
                    {a.label}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Mes documents ───────────────────────────────────────── */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}>
              Mes documents
            </p>
            <Link href="/patient-documents" className="text-xs font-semibold" style={{ color: 'var(--shifa-blue)' }}>
              Voir tout
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {docTypes.map((d) => (
              <Link
                key={d.key}
                href={d.href}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all active:scale-95"
                style={{ backgroundColor: 'var(--shifa-surface-2)', border: '1px solid var(--border)' }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: d.bg }}>
                  <FolderIcon className="w-4 h-4" style={{ color: d.color } as React.CSSProperties} />
                </div>
                <p className="text-base font-bold" style={{ color: d.color, fontFamily: 'var(--font-heading)' }}>{d.count}</p>
                <p className="text-xs text-center" style={{ color: 'var(--shifa-gray)' }}>{d.label}</p>
              </Link>
            ))}
          </div>

          {/* Derniers résultats */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold" style={{ color: 'var(--shifa-gray)' }}>Derniers résultats</p>
            <Link href="/patient-results" className="text-xs font-semibold" style={{ color: 'var(--shifa-blue)' }}>
              Voir tout
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {recentResults.map((r) => (
              <Link
                key={r.key}
                href="/patient-results"
                className="flex items-center gap-3 p-3.5 rounded-2xl transition-all active:scale-[0.98]"
                style={{
                  backgroundColor: 'var(--shifa-surface-2)',
                  border: '1px solid var(--border)',
                  boxShadow: '0 1px 4px rgba(21,88,214,0.04)',
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'var(--shifa-light)' }}
                >
                  <BeakerIcon className="w-4 h-4" style={{ color: 'var(--shifa-blue)' } as React.CSSProperties} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--shifa-dark)' }}>{r.type}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--shifa-gray)' }}>{r.lab} · {r.date}</p>
                </div>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-semibold shrink-0"
                  style={{ backgroundColor: r.statusBg, color: r.statusColor }}
                >
                  {r.status}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Mon dossier de santé ────────────────────────────────── */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}>
              Mon dossier de santé
            </p>
            <Link href="/dossier-de-sant" className="text-xs font-semibold" style={{ color: 'var(--shifa-blue)' }}>
              Voir tout
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {healthDossierItems.map((d) => {
              const IconComp = d.icon;
              return (
                <Link
                  key={d.key}
                  href={d.href}
                  className="flex items-center gap-3 p-3.5 rounded-2xl transition-all active:scale-[0.98]"
                  style={{
                    backgroundColor: 'var(--shifa-surface-2)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 1px 4px rgba(21,88,214,0.04)',
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'var(--shifa-light)' }}
                  >
                    <IconComp className="w-4 h-4" style={{ color: 'var(--shifa-blue)' } as React.CSSProperties} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: 'var(--shifa-dark)' }}>{d.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--shifa-gray)' }}>{d.sub}</p>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 shrink-0" style={{ color: 'var(--shifa-gray)' } as React.CSSProperties} />
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Actualités santé ────────────────────────────────────── */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}>
                Actualités santé
              </p>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{ backgroundColor: 'var(--shifa-light)', color: 'var(--shifa-blue)' }}
              >
                Général
              </span>
            </div>
          </div>
          <p className="text-xs mb-3" style={{ color: 'var(--shifa-gray)' }}>
            Informations générales de santé publique — non liées à votre dossier personnel.
          </p>
          {newsLoading ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ backgroundColor: 'var(--muted)' }} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {news.map((n) => (
                <div
                  key={n.id}
                  className="flex items-start gap-3 p-3.5 rounded-2xl"
                  style={{
                    backgroundColor: 'var(--shifa-surface-2)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: 'var(--shifa-light)' }}
                  >
                    <NewsIcon className="w-4 h-4" style={{ color: 'var(--shifa-blue)' } as React.CSSProperties} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--shifa-dark)' }}>{n.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="px-1.5 py-0.5 rounded text-xs font-semibold"
                        style={{ backgroundColor: 'var(--shifa-light)', color: 'var(--shifa-blue)', fontSize: '10px' }}
                      >
                        {n.category}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--shifa-gray)' }}>{n.date}</span>
                      <span className="text-xs" style={{ color: 'var(--shifa-gray)' }}>· {n.readTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}