'use client';
import React from 'react';
import Link from 'next/link';
import ShifaBrand from '@/components/ui/ShifaBrand';
import Icon from '@/components/ui/AppIcon';

export default function LandingTopbar() {
  return (
    <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: 'rgba(242, 246, 255, 0.92)', backdropFilter: 'blur(12px)', borderColor: 'var(--border)' }}>
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 xl:px-16 h-16 flex items-center justify-between">
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
            <a key={item?.key} href={item?.href} className="px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-muted" style={{ color: 'var(--muted-foreground)' }}>
              {item?.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors hover:bg-muted" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
            <Icon name="GlobeAltIcon" size={15} />
            <span>Français</span>
            <Icon name="ChevronDownIcon" size={13} />
          </button>
          <Link href="/sign-up-login-screen" className="btn-outline text-sm px-4 py-2">
            Se connecter
          </Link>
          <Link href="/sign-up-login-screen" className="btn-primary text-sm px-4 py-2 hidden sm:inline-flex">
            Créer mon compte
          </Link>
        </div>
      </div>
    </header>
  );
}