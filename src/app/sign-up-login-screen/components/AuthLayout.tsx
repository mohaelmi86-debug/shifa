'use client';
import React from 'react';
import ShifaBrand from '@/components/ui/ShifaBrand';
import LanguageSelector from '@/components/ui/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AUTH_LAYOUT_STRINGS: Record<string, {
  headline: string;
  subline: string;
  tags: string[];
  stats: { value: string; label: string }[];
  footer: string;
}> = {
  fr: {
    headline: 'Votre santé,\nau même endroit.',
    subline: 'Dossier médical, rendez-vous, téléconsultation, échanges sécurisés et bien plus encore.',
    tags: ['RGPD', 'ISO 27001', 'FHIR-ready', 'IA médicale', '+190 pays'],
    stats: [{ value: '14', label: 'Rôles' }, { value: '100+', label: 'Modules' }, { value: '+190', label: 'Pays' }],
    footer: '© 2026 SHIFA Health OS · Plateforme de santé numérique',
  },
  en: {
    headline: 'Your health,\nin one place.',
    subline: 'Medical records, appointments, teleconsultation, secure messaging and much more.',
    tags: ['GDPR', 'ISO 27001', 'FHIR-ready', 'Medical AI', '+190 countries'],
    stats: [{ value: '14', label: 'Roles' }, { value: '100+', label: 'Modules' }, { value: '+190', label: 'Countries' }],
    footer: '© 2026 SHIFA Health OS · Digital Health Platform',
  },
  es: {
    headline: 'Tu salud,\nen un solo lugar.',
    subline: 'Historial médico, citas, teleconsulta, mensajería segura y mucho más.',
    tags: ['RGPD', 'ISO 27001', 'FHIR-ready', 'IA médica', '+190 países'],
    stats: [{ value: '14', label: 'Roles' }, { value: '100+', label: 'Módulos' }, { value: '+190', label: 'Países' }],
    footer: '© 2026 SHIFA Health OS · Plataforma de salud digital',
  },
  pt: {
    headline: 'Sua saúde,\nem um só lugar.',
    subline: 'Prontuário médico, consultas, teleconsulta, mensagens seguras e muito mais.',
    tags: ['LGPD', 'ISO 27001', 'FHIR-ready', 'IA médica', '+190 países'],
    stats: [{ value: '14', label: 'Funções' }, { value: '100+', label: 'Módulos' }, { value: '+190', label: 'Países' }],
    footer: '© 2026 SHIFA Health OS · Plataforma de saúde digital',
  },
  ar: {
    headline: 'صحتك،\nفي مكان واحد.',
    subline: 'السجل الطبي، المواعيد، الاستشارة عن بُعد، المراسلة الآمنة والمزيد.',
    tags: ['RGPD', 'ISO 27001', 'FHIR', 'ذكاء اصطناعي طبي', '+190 دولة'],
    stats: [{ value: '14', label: 'أدوار' }, { value: '100+', label: 'وحدات' }, { value: '+190', label: 'دولة' }],
    footer: '© 2026 SHIFA Health OS · منصة الصحة الرقمية',
  },
  zh: {
    headline: '您的健康，\n尽在一处。',
    subline: '病历、预约、远程问诊、安全通讯及更多功能。',
    tags: ['GDPR', 'ISO 27001', 'FHIR', '医疗AI', '+190国'],
    stats: [{ value: '14', label: '角色' }, { value: '100+', label: '模块' }, { value: '+190', label: '国家' }],
    footer: '© 2026 SHIFA Health OS · 数字健康平台',
  },
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { language } = useLanguage();
  const ls = AUTH_LAYOUT_STRINGS[language] || AUTH_LAYOUT_STRINGS['fr'];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#E8EEF8' }}>
      {/* Left panel — branding (hidden on mobile) */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] xl:w-[480px] shrink-0 p-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0A1E4A 0%, #0878EF 65%, #38B6FF 100%)' }}
      >
        {/* Subtle background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
          <div className="absolute top-1/3 -left-24 w-64 h-64 rounded-full" style={{ background: 'rgba(255,255,255,0.03)' }} />
          <div className="absolute -bottom-24 right-8 w-96 h-96 rounded-full" style={{ background: 'rgba(255,255,255,0.03)' }} />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <ShifaBrand variant="full" theme="dark" />
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white leading-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
            {ls.headline.split('\n').map((line, i) => (
              <React.Fragment key={i}>{line}{i < ls.headline.split('\n').length - 1 && <br />}</React.Fragment>
            ))}
          </h2>
          <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
            {ls.subline}
          </p>

          {/* Trust indicators */}
          <div className="flex flex-wrap gap-2 mt-6">
            {ls.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.88)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
            {ls.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>{stat.value}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs relative z-10" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {ls.footer}
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-start overflow-y-auto" style={{ backgroundColor: '#E8EEF8' }}>
        {/* Mobile top bar — language selector only, no logo */}
        <div className="w-full px-5 pt-5 pb-0 flex items-center justify-end lg:hidden">
          <LanguageSelector compact />
        </div>

        {/* Mobile logo card — clean centered */}
        <div className="lg:hidden w-full px-5 mt-4 mb-2">
          <div
            className="w-full rounded-2xl overflow-hidden relative flex flex-col items-center justify-center py-7"
            style={{
              background: 'linear-gradient(145deg, #0878EF 0%, #0A1E4A 100%)',
              minHeight: '130px',
            }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.04)', transform: 'translate(30%, -30%)' }} />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full pointer-events-none" style={{ background: 'rgba(56,182,255,0.10)', transform: 'translate(-20%, 30%)' }} />
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.95)', padding: '10px 18px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
              >
                <ShifaBrand variant="auth" />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop language selector */}
        <div className="hidden lg:flex w-full max-w-md px-10 pt-8 justify-end">
          <LanguageSelector compact={false} />
        </div>

        {/* Form content */}
        <div className="w-full max-w-md px-5 py-5 lg:px-10 lg:py-6">
          {children}
        </div>
      </div>
    </div>
  );
}