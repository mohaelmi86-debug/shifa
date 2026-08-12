'use client';
import React from 'react';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslations } from '@/lib/i18n';

export default function AdminHeader() {
  const { language } = useLanguage();
  const tr = getTranslations(language);

  const titles: Record<string, string> = {
    fr: 'Administration — CHU Saint-Louis',
    en: 'Administration — CHU Saint-Louis',
    es: 'Administración — CHU Saint-Louis',
    pt: 'Administração — CHU Saint-Louis',
    ar: 'الإدارة — CHU Saint-Louis',
    zh: '管理 — CHU Saint-Louis',
  };

  const subtitles: Record<string, string> = {
    fr: 'Gestion complète de votre établissement de santé',
    en: 'Complete management of your healthcare facility',
    es: 'Gestión completa de su establecimiento de salud',
    pt: 'Gestão completa do seu estabelecimento de saúde',
    ar: 'الإدارة الشاملة لمنشأتك الصحية',
    zh: '医疗机构的全面管理',
  };

  return (
    <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>
          {titles[language] || titles.fr}
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          {subtitles[language] || subtitles.fr}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button className="btn-outline text-sm px-4 py-2 flex items-center gap-2">
          <Icon name="ArrowDownTrayIcon" size={15} />
          {tr.export}
        </button>
        <button className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
          <Icon name="Cog6ToothIcon" size={15} />
          {tr.settings}
        </button>
      </div>
    </div>
  );
}