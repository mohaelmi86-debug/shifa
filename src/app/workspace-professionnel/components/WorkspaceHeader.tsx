'use client';
import React from 'react';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslations } from '@/lib/i18n';

export default function WorkspaceHeader() {
  const { language } = useLanguage();
  const tr = getTranslations(language);

  const greetings: Record<string, string> = {
    fr: 'Bonjour, Dr. Sy 👨‍⚕️',
    en: 'Hello, Dr. Sy 👨‍⚕️',
    es: 'Hola, Dr. Sy 👨‍⚕️',
    pt: 'Olá, Dr. Sy 👨‍⚕️',
    ar: 'مرحباً، د. سي 👨‍⚕️',
    zh: '你好，Sy医生 👨‍⚕️',
  };

  const subtitles: Record<string, (n: number, done: number, remaining: number) => string> = {
    fr: (n, done, rem) => `Vous avez ${n} patients aujourd'hui · ${done} consultations terminées · ${rem} à venir`,
    en: (n, done, rem) => `You have ${n} patients today · ${done} consultations done · ${rem} upcoming`,
    es: (n, done, rem) => `Tiene ${n} pacientes hoy · ${done} consultas terminadas · ${rem} pendientes`,
    pt: (n, done, rem) => `Você tem ${n} pacientes hoje · ${done} consultas concluídas · ${rem} a seguir`,
    ar: (n, done, rem) => `لديك ${n} مرضى اليوم · ${done} استشارات منتهية · ${rem} قادمة`,
    zh: (n, done, rem) => `今天有${n}位患者 · ${done}次问诊已完成 · ${rem}次即将进行`,
  };

  const subtitleFn = subtitles[language] || subtitles.fr;

  const statusLabels: Record<string, string> = {
    fr: 'En service', en: 'On duty', es: 'En servicio', pt: 'Em serviço', ar: 'في الخدمة', zh: '值班中',
  };

  const startConsultLabels: Record<string, string> = {
    fr: 'Démarrer une consultation', en: 'Start consultation', es: 'Iniciar consulta',
    pt: 'Iniciar consulta', ar: 'بدء الاستشارة', zh: '开始问诊',
  };

  return (
    <div className="flex items-start justify-between flex-wrap gap-4">
      <div>
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
          {tr.today} · CHU Saint-Louis
        </p>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>
          {greetings[language] || greetings.fr}
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          {subtitleFn(8, 3, 5)}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--shifa-green)' }} />
          <span style={{ color: 'var(--foreground)' }}>{statusLabels[language] || statusLabels.fr}</span>
        </div>
        <button className="btn-primary text-sm px-4 py-2">
          <Icon name="PlayIcon" size={15} />
          {startConsultLabels[language] || startConsultLabels.fr}
        </button>
        <button className="relative p-2.5 rounded-xl border transition-colors hover:bg-muted" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <Icon name="BellIcon" size={18} className="text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--shifa-red)' }} />
        </button>
      </div>
    </div>
  );
}