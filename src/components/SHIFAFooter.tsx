'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ShifaBrand from '@/components/ui/ShifaBrand';
import { SUPPORTED_LANGUAGES, COUNTRIES, CURRENCIES, type Language } from '@/lib/i18n';

export type FooterContext =
  | 'public' | 'patient' | 'professional' | 'organization' | 'institution' | 'ambassador' | 'admin';

interface SHIFAFooterProps {
  context?: FooterContext;
}

// ─── Navigation data ──────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  {
    id: 'patients',
    title: 'Patients',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    links: [
      { label: 'Trouver un professionnel', href: '/patient-explorer' },
      { label: 'Prendre rendez-vous', href: '/appointment-booking' },
      { label: 'Dossier de santé', href: '/dossier-de-sant' },
      { label: 'Téléconsultation', href: '/patient-teleconsultation' },
      { label: 'Carte SHIFA', href: '/shifa-card' },
      { label: 'Pharmacies', href: '/pharmacy-dashboard' },
      { label: 'Urgences', href: '/patient-emergency' },
    ],
  },
  {
    id: 'professionnels',
    title: 'Professionnels',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    links: [
      { label: 'Espace professionnel', href: '/workspace-professionnel' },
      { label: 'Consultation', href: '/consultation-workspace' },
      { label: 'Agenda', href: '/pro-agenda' },
      { label: 'Patients', href: '/pro-patients' },
      { label: 'Prescriptions', href: '/pro-prescriptions' },
      { label: 'Résultats', href: '/pro-resultats' },
      { label: 'Messagerie', href: '/pro-messages' },
      { label: 'SHIFA AI', href: '/shifa-ai-workspace' },
    ],
  },
  {
    id: 'institutions',
    title: 'Institutions',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    links: [
      { label: 'Établissements', href: '/hopital-dashboard' },
      { label: 'Ministères', href: '/espace-ministere' },
      { label: 'Assurances', href: '/espace-assurance' },
      { label: 'Universités', href: '/espace-universite' },
      { label: 'ONG', href: '/espace-ong' },
      { label: 'Santé publique', href: '/espace-sante-publique' },
      { label: 'Administration', href: '/administration-tablissement' },
    ],
  },
  {
    id: 'shifa',
    title: 'SHIFA',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    links: [
      { label: 'À propos', href: '/' },
      { label: 'Services', href: '/health-marketplace' },
      { label: 'Aide', href: '/support-center' },
      { label: 'Contact', href: '/enterprise-contact' },
      { label: 'Interopérabilité', href: '/interoperability-hub' },
      { label: 'Sécurité', href: '#securite', disabled: true },
      { label: 'Confidentialité', href: '#confidentialite', disabled: true },
    ],
  },
  {
    id: 'aide',
    title: 'Aide & sécurité',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    links: [
      { label: 'Centre d\'aide', href: '/support-center' },
      { label: 'Support', href: '/support-center' },
      { label: 'Signaler un problème', href: '/support-center' },
      { label: 'Accessibilité', href: '#accessibilite', disabled: true },
      { label: 'Confidentialité', href: '#confidentialite', disabled: true },
    ],
  },
];

const LEGAL_LINKS = [
  { label: 'Confidentialité', href: '#confidentialite', disabled: true },
  { label: 'Conditions d\'utilisation', href: '#conditions', disabled: true },
  { label: 'Mentions légales', href: '#mentions-legales', disabled: true },
  { label: 'Cookies', href: '#cookies', disabled: true },
  { label: 'Accessibilité', href: '#accessibilite', disabled: true },
  { label: 'Gestion des consentements', href: '#consentements', disabled: true },
];

const COMPACT_LINKS = [
  { label: 'Support', href: '/support-center' },
  { label: 'Centre d\'aide', href: '/support-center' },
  { label: 'Sécurité', href: '#securite', disabled: true },
  { label: 'Confidentialité', href: '#confidentialite', disabled: true },
  { label: 'Accessibilité', href: '#accessibilite', disabled: true },
];

const PATIENT_LINKS = [
  { label: 'Aide', href: '/support-center' },
  { label: 'Confidentialité', href: '#confidentialite', disabled: true },
  { label: 'Sécurité', href: '#securite', disabled: true },
  { label: 'Paramètres', href: '/patient-settings' },
];

// ─── Social Media Icons ───────────────────────────────────────────────────────

const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
];

// ─── Link renderer ────────────────────────────────────────────────────────────

function FooterLink({ label, href, disabled }: { label: string; href: string; disabled?: boolean }) {
  if (disabled) {
    return (
      <span className="text-sm text-gray-400 cursor-default leading-relaxed">
        {label}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="text-sm text-gray-500 hover:text-blue-600 transition-colors leading-relaxed"
    >
      {label}
    </Link>
  );
}

// ─── International Selector (3 separate boxes matching mockup) ────────────────

function InternationalBlock() {
  const [selectedCountry, setSelectedCountry] = useState('FR');
  const [selectedLang, setSelectedLang] = useState<Language>('fr');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showCurrencyInfo, setShowCurrencyInfo] = useState(false);

  const country = COUNTRIES.find(c => c.code === selectedCountry) || COUNTRIES[0];
  const lang = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];
  const currency = CURRENCIES[country.currency] || { code: country.currency, symbol: country.currency };

  return (
    <div className="relative">
      {/* 3-column selector row */}
      <div className="grid grid-cols-3 divide-x divide-gray-200 border border-gray-200 rounded-xl overflow-hidden bg-white">
        {/* Country */}
        <button
          onClick={() => { setShowCountryPicker(!showCountryPicker); setShowLangPicker(false); setShowCurrencyInfo(false); }}
          className="flex flex-col items-center gap-0.5 px-3 py-3 hover:bg-gray-50 transition-colors text-center"
        >
          <div className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 text-gray-500 flex-shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold text-gray-800 truncate">{country.name}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 text-gray-400 flex-shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <span className="text-xs text-gray-400">Pays / Région</span>
        </button>

        {/* Language */}
        <button
          onClick={() => { setShowLangPicker(!showLangPicker); setShowCountryPicker(false); setShowCurrencyInfo(false); }}
          className="flex flex-col items-center gap-0.5 px-3 py-3 hover:bg-gray-50 transition-colors text-center"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-base leading-none">{lang.flag}</span>
            <span className="text-sm font-semibold text-gray-800 truncate">{lang.nativeLabel}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 text-gray-400 flex-shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <span className="text-xs text-gray-400">Langue</span>
        </button>

        {/* Currency */}
        <button
          onClick={() => { setShowCurrencyInfo(!showCurrencyInfo); setShowCountryPicker(false); setShowLangPicker(false); }}
          className="flex flex-col items-center gap-0.5 px-3 py-3 hover:bg-gray-50 transition-colors text-center"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-gray-500 flex-shrink-0">{currency.symbol || '€'}</span>
            <span className="text-sm font-semibold text-gray-800">{currency.code}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 text-gray-400 flex-shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <span className="text-xs text-gray-400">Devise</span>
        </button>
      </div>

      {/* Country picker dropdown */}
      {showCountryPicker && (
        <div className="absolute bottom-full mb-2 left-0 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-3">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">🌍 Pays / Région</p>
          <select
            value={selectedCountry}
            onChange={e => { setSelectedCountry(e.target.value); setShowCountryPicker(false); }}
            className="w-full px-3 py-2 rounded-lg text-sm border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            size={6}
          >
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name} ({c.currency})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Language picker dropdown */}
      {showLangPicker && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-3">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">🗣 Langue</p>
          <div className="grid grid-cols-2 gap-1.5">
            {SUPPORTED_LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => { setSelectedLang(l.code); setShowLangPicker(false); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                  selectedLang === l.code
                    ? 'bg-blue-600 text-white font-semibold' :'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{l.flag}</span>
                <span>{l.nativeLabel}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Currency info */}
      {showCurrencyInfo && (
        <div className="absolute bottom-full mb-2 right-0 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-3">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">💱 Devise</p>
          <p className="text-sm text-gray-700">
            Devise locale : <strong className="text-gray-900">{currency.code}</strong>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            EUR et USD affichés comme valeurs de référence.
          </p>
          <button
            onClick={() => setShowCurrencyInfo(false)}
            className="mt-2 w-full py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Fermer
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Compact International (for connected spaces) ─────────────────────────────

function CompactInternational() {
  const [selectedCountry, setSelectedCountry] = useState('FR');
  const [selectedLang, setSelectedLang] = useState<Language>('fr');
  const [open, setOpen] = useState(false);

  const country = COUNTRIES.find(c => c.code === selectedCountry) || COUNTRIES[0];
  const lang = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];
  const currency = CURRENCIES[country.currency] || { code: country.currency };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-gray-600"
      >
        <span>{country.flag}</span>
        <span className="hidden sm:inline">{country.name}</span>
        <span className="text-gray-300 hidden sm:inline">·</span>
        <span>{lang.nativeLabel}</span>
        <span className="text-gray-300">·</span>
        <span>{currency.code}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3 text-gray-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute bottom-full mb-2 right-0 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4">
          <div className="mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">🌍 Pays / Région</p>
            <select
              value={selectedCountry}
              onChange={e => setSelectedCountry(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none"
            >
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.name} ({c.currency})</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">🗣 Langue</p>
            <div className="grid grid-cols-3 gap-1">
              {SUPPORTED_LANGUAGES.map(l => (
                <button
                  key={l.code}
                  onClick={() => setSelectedLang(l.code)}
                  className={`px-2 py-1.5 rounded-lg text-xs transition-colors text-center ${
                    selectedLang === l.code ? 'bg-blue-600 text-white font-semibold' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {l.flag} {l.nativeLabel}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-full py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Appliquer
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Accordion Section (mobile) ───────────────────────────────────────────────

function AccordionSection({
  title,
  icon,
  links,
}: {
  title: string;
  icon: React.ReactNode;
  links: { label: string; href: string; disabled?: boolean }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3.5 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
            {icon}
          </span>
          <span className="text-sm font-semibold text-gray-800">{title}</span>
        </div>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <ul className="pb-3 pl-12 space-y-2.5">
          {links.map(link => (
            <li key={link.label}>
              <FooterLink label={link.label} href={link.href} disabled={link.disabled} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Trust Zone ───────────────────────────────────────────────────────────────

function TrustZone() {
  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
      <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
        {/* Data protection */}
        <div className="flex items-start gap-2.5 min-w-0">
          <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-green-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-800">Données protégées</p>
            <p className="text-xs text-gray-500">RGPD · Chiffrement</p>
            <p className="text-xs text-gray-500">Contrôle des accès</p>
          </div>
        </div>

        {/* Interoperability */}
        <div className="flex items-start gap-2.5 min-w-0">
          <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-800">Interopérabilité</p>
            <p className="text-xs text-gray-500">FHIR · HL7</p>
          </div>
        </div>

        {/* Operational status */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
          <span className="text-sm font-semibold text-green-600">Services opérationnels</span>
        </div>
      </div>
    </div>
  );
}

// ─── Legal bottom bar ─────────────────────────────────────────────────────────

function LegalBar() {
  return (
    <div className="border-t border-gray-100 pt-4 mt-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-xs text-gray-400">
          © 2026 SHIFA Health OS — Un produit du groupe{' '}
          <span className="text-gray-600 font-medium">ELYVORA</span>
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {LEGAL_LINKS.map((link, i) => (
            <React.Fragment key={link.label}>
              {link.disabled ? (
                <span className="text-xs text-blue-500 cursor-default hover:text-blue-600 transition-colors">
                  {link.label}
                </span>
              ) : (
                <Link href={link.href} className="text-xs text-blue-500 hover:text-blue-700 transition-colors">
                  {link.label}
                </Link>
              )}
              {i < LEGAL_LINKS.length - 1 && (
                <span className="text-gray-300 text-xs">·</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Dark bottom bar with social + legal ─────────────────────────────────────

function DarkBottomBar() {
  return (
    <div className="bg-gray-900 text-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6">
        {/* Mobile layout */}
        <div className="lg:hidden space-y-4">
          {/* Help row */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Besoin d&apos;aide ?</p>
              <div className="flex items-center gap-2 flex-wrap">
                <Link href="/support-center" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Centre d&apos;aide</Link>
                <span className="text-gray-600 text-xs">·</span>
                <Link href="/support-center" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Support</Link>
                <span className="text-gray-600 text-xs">·</span>
                <Link href="/enterprise-contact" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Nous contacter</Link>
              </div>
            </div>
          </div>

          {/* Social row */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Suivez-nous</p>
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div className="border-t border-white/10 pt-4 space-y-2">
            <p className="text-xs text-gray-400">
              © 2026 SHIFA Health OS<br />
              <span className="text-gray-300">Un produit du groupe ELYVORA</span>
            </p>
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {LEGAL_LINKS.map((link, i) => (
                <React.Fragment key={link.label}>
                  <span className="text-xs text-blue-400 cursor-default">{link.label}</span>
                  {i < LEGAL_LINKS.length - 1 && <span className="text-gray-600 text-xs">·</span>}
                </React.Fragment>
              ))}
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Votre santé, notre mission.
            </p>
          </div>
        </div>

        {/* Tablet layout */}
        <div className="hidden md:flex lg:hidden flex-col gap-4">
          <div className="flex items-start justify-between gap-6">
            {/* Help */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Besoin d&apos;aide ?</p>
                <div className="flex items-center gap-2">
                  <Link href="/support-center" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Centre d&apos;aide</Link>
                  <span className="text-gray-600 text-xs">·</span>
                  <Link href="/support-center" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Support</Link>
                  <span className="text-gray-600 text-xs">·</span>
                  <Link href="/enterprise-contact" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Nous contacter</Link>
                </div>
              </div>
            </div>

            {/* Social */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Suivez-nous</p>
              <div className="flex items-center gap-2">
                {SOCIAL_LINKS.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs text-gray-300 font-medium">© 2026 SHIFA Health OS</p>
              <p className="text-xs text-gray-500">Un produit du groupe ELYVORA</p>
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {LEGAL_LINKS.map((link, i) => (
                <React.Fragment key={link.label}>
                  <span className="text-xs text-blue-400 cursor-default">{link.label}</span>
                  {i < LEGAL_LINKS.length - 1 && <span className="text-gray-600 text-xs">·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Votre santé, notre mission.
          </p>
        </div>

        {/* Desktop layout */}
        <div className="hidden lg:flex items-start justify-between gap-8">
          {/* Left: Help */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Besoin d&apos;aide ?</p>
              <div className="flex items-center gap-2">
                <Link href="/support-center" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Centre d&apos;aide</Link>
                <span className="text-gray-600 text-xs">·</span>
                <Link href="/support-center" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Support</Link>
                <span className="text-gray-600 text-xs">·</span>
                <Link href="/enterprise-contact" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Nous contacter</Link>
              </div>
            </div>
          </div>

          {/* Center: Social */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Suivez-nous</p>
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right: Legal */}
          <div className="text-right">
            <p className="text-xs text-gray-300 font-medium mb-1">
              © 2026 SHIFA Health OS — Un produit du groupe <span className="text-white font-semibold">ELYVORA</span>
            </p>
            <div className="flex flex-wrap justify-end gap-x-2 gap-y-1 mb-2">
              {LEGAL_LINKS.map((link, i) => (
                <React.Fragment key={link.label}>
                  <span className="text-xs text-blue-400 cursor-default hover:text-blue-300 transition-colors">{link.label}</span>
                  {i < LEGAL_LINKS.length - 1 && <span className="text-gray-600 text-xs">·</span>}
                </React.Fragment>
              ))}
            </div>
            <p className="text-xs text-gray-500 flex items-center justify-end gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Votre santé, notre mission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PUBLIC FOOTER ────────────────────────────────────────────────────────────

function PublicFooter() {
  return (
    <footer className="bg-white border-t border-gray-100 w-full">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-8 pb-0">

        {/* ── MOBILE (< md) ── */}
        <div className="md:hidden">
          {/* Identity */}
          <div className="flex items-start gap-3 mb-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <ShifaBrand variant="compact" />
            <div>
              <p className="text-base font-bold text-gray-900 leading-tight">SHIFA Health OS</p>
              <p className="text-xs font-medium text-blue-600 mt-0.5">
                One Patient · One Record · One Ecosystem
              </p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                La plateforme de santé unifiée qui connecte patients, professionnels, établissements et institutions pour une santé meilleure.
              </p>
            </div>
          </div>

          {/* Accordions */}
          <div className="border border-gray-100 rounded-xl overflow-hidden bg-white mb-4 divide-y divide-gray-100">
            {NAV_SECTIONS.map(section => (
              <AccordionSection
                key={section.id}
                title={section.title}
                icon={section.icon}
                links={section.links}
              />
            ))}
          </div>

          {/* International */}
          <div className="mb-4">
            <InternationalBlock />
          </div>

          {/* Trust zone */}
          <div className="mb-4">
            <TrustZone />
          </div>
        </div>

        {/* ── TABLET (md to lg) ── */}
        <div className="hidden md:block lg:hidden">
          {/* Identity + International */}
          <div className="flex items-start justify-between gap-6 mb-6">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <ShifaBrand variant="compact" />
              <div className="min-w-0">
                <p className="text-base font-bold text-gray-900 leading-tight">SHIFA Health OS</p>
                <p className="text-xs font-medium text-blue-600 mt-0.5">One Patient · One Record · One Ecosystem</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-xs">
                  La plateforme de santé unifiée qui connecte patients, professionnels et institutions.
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 w-64">
              <InternationalBlock />
            </div>
          </div>

          {/* 2×3 grid of nav sections */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-6">
            {NAV_SECTIONS.map(col => (
              <div key={col.id}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-blue-600">{col.icon}</span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">{col.title}</h3>
                </div>
                <ul className="space-y-2">
                  {col.links.map(link => (
                    <li key={link.label}>
                      <FooterLink label={link.label} href={link.href} disabled={link.disabled} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <TrustZone />
        </div>

        {/* ── LAPTOP / DESKTOP (lg+) ── */}
        <div className="hidden lg:block">
          {/* Top row: Identity + International */}
          <div className="flex items-start justify-between gap-8 mb-8">
            {/* SHIFA Identity */}
            <div className="flex items-start gap-4 flex-shrink-0 max-w-xs">
              <ShifaBrand variant="full" />
              <div>
                <p className="text-xs font-medium text-blue-600 mt-1">
                  One Patient · One Record · One Ecosystem
                </p>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                  La plateforme de santé unifiée qui connecte patients, professionnels, établissements et institutions pour une santé meilleure.
                </p>
              </div>
            </div>

            {/* International block */}
            <div className="flex-shrink-0 w-72 xl:w-80">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">International</p>
              <InternationalBlock />
            </div>
          </div>

          {/* 5 nav columns */}
          <div className="grid grid-cols-5 gap-6 xl:gap-8 mb-8">
            {NAV_SECTIONS.map(col => (
              <div key={col.id}>
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-blue-600 flex-shrink-0">{col.icon}</span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 leading-tight">{col.title}</h3>
                </div>
                <ul className="space-y-2">
                  {col.links.map(link => (
                    <li key={link.label}>
                      <FooterLink label={link.label} href={link.href} disabled={link.disabled} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Trust zone */}
          <TrustZone />
        </div>

      </div>

      {/* Dark bottom bar with social + legal */}
      <DarkBottomBar />
    </footer>
  );
}

// ─── COMPACT FOOTER (connected spaces) ───────────────────────────────────────

function CompactFooter({ context }: { context: FooterContext }) {
  const isPatient = context === 'patient';
  const links = isPatient ? PATIENT_LINKS : COMPACT_LINKS;

  return (
    <footer className="bg-white border-t border-gray-100 w-full">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <ShifaBrand variant="symbol" symbolSize={20} />
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-gray-800">SHIFA Health OS</span>
              <span className="text-xs text-gray-400 hidden sm:inline">
                One Patient · One Record · One Ecosystem
              </span>
            </div>
          </div>
          {isPatient && <CompactInternational />}
        </div>

        {/* Links row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
          {links.map((link, i) => (
            <React.Fragment key={link.label}>
              {link.disabled ? (
                <span className="text-xs text-gray-400 cursor-default">{link.label}</span>
              ) : (
                <Link href={link.href} className="text-xs text-gray-500 hover:text-blue-600 transition-colors">
                  {link.label}
                </Link>
              )}
              {i < links.length - 1 && (
                <span className="text-gray-300 text-xs">·</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
          <span className="inline-flex items-center gap-1.5 text-xs text-green-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
            Services opérationnels
          </span>
          <p className="text-xs text-gray-400">
            © 2026 SHIFA Health OS — Groupe <span className="text-gray-600">ELYVORA</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

export default function SHIFAFooter({ context = 'public' }: SHIFAFooterProps) {
  if (context === 'public') {
    return <PublicFooter />;
  }
  return <CompactFooter context={context} />;
}
