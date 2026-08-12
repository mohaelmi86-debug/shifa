'use client';
import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslations } from '@/lib/i18n';

export default function PatientHeader() {
  const { language } = useLanguage();
  const tr = getTranslations(language);

  const greetings: Record<string, string> = {
    fr: 'Bonjour, Aïcha 👋',
    en: 'Hello, Aïcha 👋',
    es: 'Hola, Aïcha 👋',
    pt: 'Olá, Aïcha 👋',
    ar: 'مرحباً، عائشة 👋',
    zh: '你好，Aïcha 👋',
  };

  const subtitles: Record<string, string> = {
    fr: 'Prenez soin de vous. Votre prochain rendez-vous est dans 2 jours.',
    en: 'Take care of yourself. Your next appointment is in 2 days.',
    es: 'Cuídate. Tu próxima cita es en 2 días.',
    pt: 'Cuide-se. Sua próxima consulta é em 2 dias.',
    ar: 'اعتنِ بصحتك. موعدك القادم بعد يومين.',
    zh: '保重身体。您的下一次预约在2天后。',
  };

  return (
    <div className="flex items-start justify-between flex-wrap gap-4">
      <div>
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
          {tr.today} · 10 août 2026
        </p>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>
          {greetings[language] || greetings.fr}
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          {subtitles[language] || subtitles.fr}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <Icon name="MapPinIcon" size={15} style={{ color: 'var(--shifa-blue)' } as any} className="" />
          <span style={{ color: 'var(--foreground)' }}>Paris, France</span>
        </div>
        <Link href="/patient-notifications" className="relative p-2.5 rounded-xl border transition-colors hover:bg-muted" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <Icon name="BellIcon" size={18} className="text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--shifa-blue)' }} />
        </Link>
      </div>
    </div>
  );
}