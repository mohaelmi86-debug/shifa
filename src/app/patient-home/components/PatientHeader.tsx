'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

function BellIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
  );
}

export default function PatientHeader() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState<string>('');

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from('user_profiles')
      .select('full_name')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.full_name) {
          setFirstName(data.full_name.split(' ')[0]);
        } else if (user.email) {
          setFirstName(user.email.split('@')[0]);
        }
      });
  }, [user]);

  const greeting = firstName ? `Bonjour, ${firstName}` : 'Bonjour';

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 py-3"
      style={{
        backgroundColor: 'var(--shifa-surface-2)',
        borderBottom: '1px solid var(--border)',
        boxShadow: '0 1px 8px rgba(21,88,214,0.06)',
      }}
      role="banner"
    >
      <div className="flex items-center gap-3">
        {/* SHIFA Logo mark */}
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #1252B0 0%, #1565D8 100%)' }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
            <path d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 2c1.85 0 3.55.63 4.9 1.68L5.68 16.9A6.965 6.965 0 015 12c0-3.87 3.13-7 7-7zm0 14c-1.85 0-3.55-.63-4.9-1.68L18.32 7.1A6.965 6.965 0 0119 12c0 3.87-3.13 7-7 7z" fill="white" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-medium leading-none mb-0.5" style={{ color: 'var(--shifa-gray)' }}>
            {greeting} 👋
          </p>
          <p className="font-bold text-sm leading-none" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}>
            Votre espace santé
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/patient-notifications"
          className="w-9 h-9 rounded-xl flex items-center justify-center relative transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ backgroundColor: 'var(--shifa-light)' }}
          aria-label="Voir les notifications"
        >
          <BellIcon className="w-5 h-5" style={{ color: 'var(--shifa-blue)' } as React.CSSProperties} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white"
            style={{ backgroundColor: 'var(--shifa-red)' }}
            aria-hidden="true"
          />
        </Link>
      </div>
    </header>
  );
}