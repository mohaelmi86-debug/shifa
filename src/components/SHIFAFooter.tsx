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

// ─── PUBLIC FOOTER ────────────────────────────────────────────────────────────

function PublicFooter() {
  return (
    <footer className="bg-white border-t border-gray-100 w-full">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-8 pb-5">

        {/* ── MOBILE (< md) ── */}
        <div className="md:hidden">
          {/* Identity */}
          <div className="flex items-start gap-3 mb-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <ShifaBrand variant="symbol" symbolSize={48} />
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

          {/* Legal */}
          <LegalBar />
        </div>

        {/* ── TABLET (md to lg) ── */}
        <div className="hidden md:block lg:hidden">
          {/* Identity + International */}
          <div className="flex items-start justify-between gap-6 mb-6">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <ShifaBrand variant="symbol" symbolSize={44} />
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
          <LegalBar />
        </div>

        {/* ── LAPTOP / DESKTOP (lg+) ── */}
        <div className="hidden lg:block">
          {/* Top row: Identity + International */}
          <div className="flex items-start justify-between gap-8 mb-8">
            {/* SHIFA Identity */}
            <div className="flex items-start gap-4 flex-shrink-0 max-w-xs">
              <ShifaBrand variant="compact" />
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

          {/* Legal */}
          <LegalBar />
        </div>

      </div>
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
