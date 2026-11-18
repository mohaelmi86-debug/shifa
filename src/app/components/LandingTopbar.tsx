'use client';
import React from 'react';
import Link from 'next/link';
import ShifaBrand from '@/components/ui/ShifaBrand';
import Icon from '@/components/ui/AppIcon';

export default function LandingTopbar() {
  return (
    <header
      className="sticky top-0 z-50 border-b bg-white"
      style={{ borderColor: '#E8EFF8', boxShadow: '0 1px 8px rgba(8,120,239,0.06)' }}
    >
      <div className="max-w-screen-xl mx-auto px-5 lg:px-10 xl:px-16 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <ShifaBrand variant="topnav" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {[
            { key: 'nav-solutions', label: 'Solutions', href: '#' },
            { key: 'nav-modules', label: 'Modules', href: '#' },
            { key: 'nav-securite', label: 'Sécurité', href: '#' },
            { key: 'nav-apropos', label: 'À propos', href: '#' },
          ]?.map(item => (
            <a key={item?.key} href={item?.href} className="px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-blue-50" style={{ color: '#5F7A9B' }}>
              {item?.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors hover:bg-blue-50" style={{ borderColor: '#E8EFF8', color: '#5F7A9B' }}>
            <Icon name="GlobeAltIcon" size={15} />
            <span>Français</span>
            <Icon name="ChevronDownIcon" size={13} />
          </button>
          <Link
            href="/sign-up-login-screen"
            className="px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-colors"
            style={{ borderColor: '#0878EF', color: '#0878EF' }}
          >
            Se connecter
          </Link>
          <Link
            href="/sign-up-login-screen"
            className="hidden sm:inline-flex px-4 py-2 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: '#0878EF', boxShadow: '0 2px 8px rgba(8,120,239,0.3)' }}
          >
            Créer mon compte
          </Link>
        </div>
      </div>
    </header>
  );
}