'use client';
import React, { useState } from 'react';
import AppIcon from '@/components/ui/AppIcon';

type Status = 'ready' | 'attention' | 'blocked';

interface ReportItem {
  area: string;
  status: Status;
  score: number;
  details: string[];
  issues?: string[];
}

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string; icon: string; emoji: string }> = {
  ready:     { label: 'READY',           color: '#16a34a', bg: '#f0fdf4', icon: 'CheckCircleIcon',      emoji: '🟢' },
  attention: { label: 'NEEDS ATTENTION', color: '#d97706', bg: '#fffbeb', icon: 'ExclamationTriangleIcon', emoji: '🟡' },
  blocked:   { label: 'BLOCKED',         color: '#dc2626', bg: '#fef2f2', icon: 'XCircleIcon',           emoji: '🔴' },
};

const REPORT_DATA: ReportItem[] = [
  {
    area: 'UX / UI',
    status: 'ready',
    score: 9,
    details: [
      'Design system centralisé (CSS variables, tokens)',
      'Navigation mobile 5 onglets (Découvrir / Planifier / Mon Suivi / Échanges / Mon Espace)',
      'MobileBottomNav avec badges et safe-area iOS',
      'Page Découvrir mobile-first avec recherche et services',
      'AuthLayout premium avec logo SHIFA',
      'Cartes arrondies, ombres légères, surfaces blanches',
      'Responsive 320px → 430px+',
    ],
    issues: ['Quelques pages secondaires non encore migrées vers le nouveau design system'],
  },
  {
    area: 'SECURITY',
    status: 'ready',
    score: 8,
    details: [
      'RLS activé sur toutes les tables financières (subscriptions, payments, invoices, tax_records, commissions, settlements, api_billing_records, ambassador_payouts, marketplace_settlements, revenue_reconciliation)',
      'Super-admin route protégée (platform_admin uniquement)',
      'Isolation inter-organisations via user_org_id()',
      'Middleware vérifie email_confirmed_at avant accès aux routes protégées',
      'Trigger handle_new_user() sécurisé (SECURITY DEFINER, REVOKE PUBLIC)',
      'Aucune clé secrète exposée côté client',
    ],
    issues: ['Audit complet des policies RLS sur tables secondaires à finaliser'],
  },
  {
    area: 'AUTH',
    status: 'ready',
    score: 9,
    details: [
      'Email OTP verification flow (6 chiffres, auto-advance, paste, auto-submit)',
      'EmailVerificationModal intégré dans les 3 formulaires d\'inscription',
      'signIn() bloque les utilisateurs non confirmés et renvoie un OTP',
      'Middleware redirige les non-confirmés vers /sign-up-login-screen?unconfirmed=1',
      'resendVerificationOtp() avec cooldown 60s',
      'fetchRole() utilise maybeSingle() — pas de crash si profil absent',
    ],
    issues: ['Google/Apple OAuth non connectés (boutons masqués ou désactivés)'],
  },
  {
    area: 'ROLE ASSIGNMENT',
    status: 'ready',
    score: 9,
    details: [
      'Trigger handle_new_user() lit le rôle depuis raw_user_meta_data',
      'Validation enum avec EXCEPTION handler — fallback patient uniquement si rôle invalide',
      'ON CONFLICT DO UPDATE : corrige les profils existants avec mauvais rôle patient',
      'ProfessionalRegisterForm passe role: "professional"',
      'InstitutionRegisterForm passe role: "org_admin"',
      'PatientRegisterForm passe role: "patient"',
      'REVOKE ALL sur la fonction — non appelable par les utilisateurs',
      'get_my_role() helper sans récursion RLS',
    ],
  },
  {
    area: 'RLS',
    status: 'attention',
    score: 7,
    details: [
      'RLS activé sur user_profiles, patients, professionals, organizations',
      'RLS activé sur toutes les tables financières',
      'Policies SELECT/INSERT/UPDATE/DELETE sur tables core',
      'Isolation inter-organisations implémentée',
      '10+ modules spécialisés avec RLS (imaging, blood_bank, operating_room, etc.)',
    ],
    issues: [
      'Certaines tables de modules secondaires sans policies explicites (héritent du deny-all)',
      'Audit complet des 50+ tables recommandé avant production',
    ],
  },
  {
    area: 'MOBILE',
    status: 'ready',
    score: 9,
    details: [
      'Navigation bottom fixe avec safe-area iOS (pb-safe)',
      'Design mobile-first sur toutes les nouvelles pages',
      'Touch targets ≥ 44px',
      'Responsive 320px → 430px+',
      'Pas de débordement horizontal',
      'Animations discrètes (transition-all)',
    ],
  },
  {
    area: 'iOS',
    status: 'attention',
    score: 6,
    details: [
      'Safe-area CSS implémentée (env(safe-area-inset-bottom))',
      'Viewport meta configuré',
      'Fonts système iOS supportées',
      'Structure d\'icônes App Store définie (src/lib/appStoreAssets.ts)',
    ],
    issues: [
      'Build natif iOS non généré (nécessite Capacitor ou React Native)',
      'Icônes App Store à générer depuis le logo SHIFA',
      'Screenshots iPhone à produire',
      'Bundle ID à enregistrer sur App Store Connect',
    ],
  },
  {
    area: 'ANDROID',
    status: 'attention',
    score: 6,
    details: [
      'Structure d\'icônes Google Play définie (src/lib/appStoreAssets.ts)',
      'Package ID défini : health.shifa.app',
      'Permissions documentées',
      'Data Safety documentée',
    ],
    issues: [
      'Build natif Android non généré (nécessite Capacitor ou React Native)',
      'Icônes Play Store à générer depuis le logo SHIFA',
      'Feature Graphic à créer (1024×500)',
      'Screenshots à produire',
    ],
  },
  {
    area: 'STORE READINESS',
    status: 'attention',
    score: 5,
    details: [
      'Métadonnées complètes définies (src/lib/appStoreAssets.ts)',
      'Descriptions en FR/EN/AR',
      'Permissions iOS et Android documentées',
      'Data Safety Google Play documentée',
      'App Privacy Apple documentée',
      'Compte de démonstration défini',
      'Suppression de compte implémentée (Mon Espace)',
      'Politique de confidentialité accessible (/patient-privacy)',
    ],
    issues: [
      'Build natif requis (Capacitor.js recommandé pour PWA → App Store)',
      'Icônes et screenshots à générer',
      'Compte développeur Apple ($99/an) et Google ($25 unique) requis',
      'Review Apple peut prendre 1-3 jours',
    ],
  },
  {
    area: 'PERFORMANCE',
    status: 'attention',
    score: 7,
    details: [
      'Next.js 15 avec App Router (Server Components)',
      'Images optimisées via next/image',
      'Fonts avec display: swap',
      'Lazy loading sur les composants lourds',
      'Realtime Supabase avec cleanup sur unmount',
    ],
    issues: [
      'useSupabaseCount peut créer des channels inutiles — à auditer',
      'Bundle size à analyser (next build --analyze)',
      'Quelques re-renders à optimiser avec useMemo/useCallback',
    ],
  },
  {
    area: 'ACCESSIBILITY',
    status: 'attention',
    score: 7,
    details: [
      'Contraste texte/fond respecté (design system)',
      'Touch targets ≥ 44px',
      'Labels de formulaires associés',
      'Messages d\'erreur descriptifs',
      'Focus visible sur les éléments interactifs',
    ],
    issues: [
      'Audit WCAG 2.1 AA complet à réaliser',
      'ARIA labels à compléter sur les composants complexes',
      'Navigation clavier à tester sur toutes les pages',
    ],
  },
  {
    area: 'I18N',
    status: 'ready',
    score: 10,
    details: [
      'Système i18n centralisé (src/lib/i18n.ts)',
      '6 langues complètes : Français, English, Español, Português, العربية, 中文',
      '200+ clés de traduction par langue',
      'Support RTL complet pour l\'arabe (dir, text-align, font-family)',
      'LANGUAGE_FONTS et LANGUAGE_DIR exportés',
      'LanguageContext met à jour document.documentElement.dir au changement',
      'Restauration depuis localStorage au montage',
      'Sélecteur de langue dans le header',
    ],
  },
];

const MODULES_STATUS = [
  { module: 'Portail Patient', route: '/patient-home', backend: true, rls: true },
  { module: 'Espace Professionnel', route: '/workspace-professionnel', backend: true, rls: true },
  { module: 'Administration Établissement', route: '/administration-tablissement', backend: true, rls: true },
  { module: 'Téléconsultation', route: '/teleconsultation-session', backend: true, rls: true },
  { module: 'Dossier de Santé', route: '/dossier-de-sant', backend: true, rls: true },
  { module: 'Laboratoire', route: '/lab-dashboard', backend: true, rls: true },
  { module: 'Pharmacie', route: '/pharmacy-dashboard', backend: true, rls: true },
  { module: 'Imagerie', route: '/imaging-dashboard', backend: false, rls: true, note: 'UI sans backend complet' },
  { module: 'Urgences', route: '/emergency', backend: true, rls: true },
  { module: 'Bloc Opératoire', route: '/operating-room', backend: false, rls: true, note: 'UI sans backend complet' },
  { module: 'Banque de Sang', route: '/blood-bank', backend: false, rls: true, note: 'UI sans backend complet' },
  { module: 'Stérilisation', route: '/sterilization', backend: false, rls: true, note: 'UI sans backend complet' },
  { module: 'Ambulance', route: '/ambulance-transport', backend: false, rls: true, note: 'UI sans backend complet' },
  { module: 'Équipements Biomédicaux', route: '/biomedical-equipment', backend: false, rls: true, note: 'UI sans backend complet' },
  { module: 'Pharmacie POS', route: '/pharmacy-pos', backend: false, rls: true, note: 'UI sans backend complet' },
  { module: 'Finance & Facturation', route: '/finance-dashboard', backend: true, rls: true },
  { module: 'Inventaire', route: '/inventory-procurement', backend: true, rls: true },
  { module: 'Qualité & Accréditation', route: '/quality-accreditation', backend: true, rls: true },
  { module: 'SHIFA AI', route: '/shifa-ai-workspace', backend: true, rls: true },
  { module: 'Académie SHIFA', route: '/shifa-academy', backend: true, rls: true },
  { module: 'Marketplace', route: '/health-marketplace', backend: true, rls: true },
  { module: 'Programme Ambassadeur', route: '/ambassador-workspace', backend: true, rls: true },
  { module: 'Espace Assurance', route: '/espace-assurance', backend: true, rls: true },
  { module: 'Espace ONG', route: '/espace-ong', backend: true, rls: true },
  { module: 'Espace Université', route: '/espace-universite', backend: true, rls: true },
];

const GLOBAL_SCORE = Math.round(REPORT_DATA.reduce((sum, item) => sum + item.score, 0) / REPORT_DATA.length * 10) / 10;

export default function Phase3CompletionReportContent() {
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'details'>('overview');

  const readyCount = REPORT_DATA.filter(r => r.status === 'ready').length;
  const attentionCount = REPORT_DATA.filter(r => r.status === 'attention').length;
  const blockedCount = REPORT_DATA.filter(r => r.status === 'blocked').length;

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 border-b" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0066FF, #00B4D8)' }}>
              <AppIcon name="DocumentChartBarIcon" size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>Phase 3 Completion Report</h1>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>SHIFA Health OS — 2026-08-13</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: 'var(--shifa-blue)15', border: '1px solid var(--shifa-blue)30' }}>
            <span className="text-lg font-black" style={{ color: 'var(--shifa-blue)' }}>{GLOBAL_SCORE}</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>/10</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-4 flex gap-1 pb-2">
          {(['overview', 'modules', 'details'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize"
              style={{
                background: activeTab === tab ? 'var(--shifa-blue)' : 'transparent',
                color: activeTab === tab ? 'white' : 'var(--muted-foreground)',
              }}
            >
              {tab === 'overview' ? 'Vue d\'ensemble' : tab === 'modules' ? 'Modules' : 'Détails'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'READY', count: readyCount, color: '#16a34a', bg: '#f0fdf4', emoji: '🟢' },
                { label: 'NEEDS ATTENTION', count: attentionCount, color: '#d97706', bg: '#fffbeb', emoji: '🟡' },
                { label: 'BLOCKED', count: blockedCount, color: '#dc2626', bg: '#fef2f2', emoji: '🔴' },
              ].map(item => (
                <div key={item.label} className="rounded-2xl p-4 text-center" style={{ background: item.bg, border: `1px solid ${item.color}20` }}>
                  <div className="text-2xl mb-1">{item.emoji}</div>
                  <div className="text-2xl font-black" style={{ color: item.color }}>{item.count}</div>
                  <div className="text-xs font-semibold mt-0.5" style={{ color: item.color }}>{item.label}</div>
                </div>
              ))}
            </div>

            {/* Score Grid */}
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div className="px-4 py-3 border-b" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <h2 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Scores par domaine</h2>
              </div>
              <div className="divide-y" style={{ divideColor: 'var(--border)' }}>
                {REPORT_DATA.map(item => {
                  const cfg = STATUS_CONFIG[item.status];
                  return (
                    <div key={item.area} className="flex items-center gap-3 px-4 py-3" style={{ background: 'var(--card)' }}>
                      <span className="text-base">{cfg.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{item.area}</span>
                          <span className="text-sm font-black" style={{ color: cfg.color }}>{item.score}/10</span>
                        </div>
                        <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${item.score * 10}%`, background: cfg.color }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Phase 3 Deliverables */}
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div className="px-4 py-3 border-b" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <h2 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Livrables Phase 3</h2>
              </div>
              <div className="p-4 space-y-2" style={{ background: 'var(--card)' }}>
                {[
                  { done: true, label: 'Attribution des rôles à l\'inscription (professionnel / institution)' },
                  { done: true, label: 'Trigger handle_new_user() robuste avec ON CONFLICT DO UPDATE' },
                  { done: true, label: 'Support RTL arabe complet (dir, text-align, font-family, localStorage)' },
                  { done: true, label: 'i18n 6 langues complètes (FR/EN/ES/PT/AR/ZH) — 200+ clés chacune' },
                  { done: true, label: 'Structure assets App Store et Google Play (src/lib/appStoreAssets.ts)' },
                  { done: true, label: 'Métadonnées, permissions, Data Safety, App Privacy documentées' },
                  { done: true, label: 'Rapport de complétion Phase 3 (/phase3-completion-report)' },
                  { done: true, label: 'Email OTP verification flow (Phase 2 → Phase 3)' },
                  { done: true, label: 'Design system premium (bleu médical, surfaces blanches)' },
                  { done: true, label: 'Navigation mobile 5 onglets avec MobileBottomNav' },
                  { done: true, label: 'Page Découvrir mobile-first' },
                  { done: true, label: 'Suppression de compte (Mon Espace → Confidentialité)' },
                  { done: true, label: 'Réseaux sociaux dans Mon Espace' },
                  { done: false, label: 'Build natif iOS/Android (Capacitor — hors scope Next.js)' },
                  { done: false, label: 'Icônes App Store générées depuis logo SHIFA' },
                  { done: false, label: 'Screenshots App Store produits' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex-shrink-0">
                      {item.done
                        ? <AppIcon name="CheckCircleIcon" size={16} style={{ color: '#16a34a' } as any} className="" />
                        : <AppIcon name="ClockIcon" size={16} style={{ color: '#d97706' } as any} className="" />
                      }
                    </div>
                    <span className="text-sm" style={{ color: item.done ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'modules' && (
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="px-4 py-3 border-b" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <h2 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>État des modules ({MODULES_STATUS.length} modules)</h2>
            </div>
            <div className="divide-y" style={{ divideColor: 'var(--border)' }}>
              {MODULES_STATUS.map(mod => (
                <div key={mod.route} className="flex items-center gap-3 px-4 py-3" style={{ background: 'var(--card)' }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{mod.module}</span>
                      {mod.note && (
                        <span className="text-xs px-1.5 py-0.5 rounded-md flex-shrink-0" style={{ background: '#fffbeb', color: '#d97706', border: '1px solid #d9770620' }}>
                          {mod.note}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{mod.route}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: mod.backend ? '#f0fdf4' : '#fef2f2', color: mod.backend ? '#16a34a' : '#dc2626', border: `1px solid ${mod.backend ? '#16a34a' : '#dc2626'}20` }}>
                      {mod.backend ? 'Backend ✓' : 'UI only'}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: mod.rls ? '#f0fdf4' : '#fef2f2', color: mod.rls ? '#16a34a' : '#dc2626', border: `1px solid ${mod.rls ? '#16a34a' : '#dc2626'}20` }}>
                      RLS {mod.rls ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-4">
            {REPORT_DATA.map(item => {
              const cfg = STATUS_CONFIG[item.status];
              return (
                <div key={item.area} className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between px-4 py-3 border-b" style={{ background: cfg.bg, borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-base">{cfg.emoji}</span>
                      <h3 className="text-sm font-bold" style={{ color: cfg.color }}>{item.area}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: cfg.color + '20', color: cfg.color }}>
                        {cfg.label}
                      </span>
                      <span className="text-sm font-black" style={{ color: cfg.color }}>{item.score}/10</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-3" style={{ background: 'var(--card)' }}>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--muted-foreground)' }}>✅ Réalisé</p>
                      <ul className="space-y-1">
                        {item.details.map((d, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--foreground)' }}>
                            <span className="mt-1 flex-shrink-0 w-1 h-1 rounded-full" style={{ background: '#16a34a' }} />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {item.issues && item.issues.length > 0 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--muted-foreground)' }}>⚠️ À traiter</p>
                        <ul className="space-y-1">
                          {item.issues.map((issue, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#d97706' }}>
                              <span className="mt-1 flex-shrink-0 w-1 h-1 rounded-full" style={{ background: '#d97706' }} />
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
