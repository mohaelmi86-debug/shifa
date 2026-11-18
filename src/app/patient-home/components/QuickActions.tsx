import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

// ── i18n labels for quick actions ─────────────────────────────────────────────
const ACTION_LABELS: Record<string, Record<string, string>> = {
  fr: { title: 'Accès rapide', planifier: 'Planifier', teleconsult: 'Téléconsultation', resultats: 'Résultats', dossier: 'Dossier santé', echanges: 'Échanges', prevention: 'Prévention' },
  en: { title: 'Quick access', planifier: 'Schedule', teleconsult: 'Teleconsult', resultats: 'Results', dossier: 'Health record', echanges: 'Messages', prevention: 'Prevention' },
  es: { title: 'Acceso rápido', planifier: 'Planificar', teleconsult: 'Teleconsulta', resultats: 'Resultados', dossier: 'Historial', echanges: 'Mensajes', prevention: 'Prevención' },
  pt: { title: 'Acesso rápido', planifier: 'Agendar', teleconsult: 'Teleconsulta', resultats: 'Resultados', dossier: 'Prontuário', echanges: 'Mensagens', prevention: 'Prevenção' },
  ar: { title: 'وصول سريع', planifier: 'تحديد موعد', teleconsult: 'استشارة عن بُعد', resultats: 'النتائج', dossier: 'الملف الصحي', echanges: 'الرسائل', prevention: 'الوقاية' },
  zh: { title: '快速访问', planifier: '预约', teleconsult: '远程问诊', resultats: '结果', dossier: '健康档案', echanges: '消息', prevention: '预防' },
};

interface QuickActionsProps {
  language?: string;
}

export default function QuickActions({ language = 'fr' }: QuickActionsProps) {
  const labels = ACTION_LABELS[language] || ACTION_LABELS['fr'];

  const actions = [
    { key: 'qa-planifier', icon: 'CalendarDaysIcon', label: labels.planifier, color: 'var(--shifa-blue)', bg: 'var(--shifa-light)', href: '/appointment-booking' },
    { key: 'qa-teleconsult', icon: 'VideoCameraIcon', label: labels.teleconsult, color: '#059669', bg: '#D1FAE5', href: '/patient-teleconsultation' },
    { key: 'qa-resultats', icon: 'BeakerIcon', label: labels.resultats, color: 'var(--shifa-purple)', bg: '#EDE9FE', href: '/patient-results' },
    { key: 'qa-dossier', icon: 'FolderOpenIcon', label: labels.dossier, color: 'var(--shifa-cyan)', bg: '#E0F2FE', href: '/dossier-de-sant' },
    { key: 'qa-echanges', icon: 'ChatBubbleLeftRightIcon', label: labels.echanges, color: 'var(--shifa-amber)', bg: 'var(--shifa-amber-light)', href: '/patient-messages' },
    { key: 'qa-prevention', icon: 'ShieldCheckIcon', label: labels.prevention, color: '#059669', bg: '#D1FAE5', href: '/patient-prevention' },
  ];

  return (
    <section aria-labelledby="quick-actions-title">
      <div className="flex items-center justify-between mb-3">
        <h2 id="quick-actions-title" className="text-sm font-bold" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}>
          {labels.title}
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {actions.map((action) => (
          <Link
            key={action.key}
            href={action.href}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-150 hover:shadow-shifa hover:-translate-y-0.5 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              backgroundColor: 'var(--shifa-surface-2)',
              borderColor: 'var(--border)',
            }}
            aria-label={action.label}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: action.bg }}
              aria-hidden="true"
            >
              <Icon name={action.icon as any} size={22} style={{ color: action.color } as any} className="" />
            </div>
            <span className="text-xs font-semibold text-center leading-tight" style={{ color: 'var(--shifa-dark)' }}>
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}