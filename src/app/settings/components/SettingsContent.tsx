'use client';
import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  SUPPORTED_LANGUAGES,
  CURRENCIES,
  COUNTRIES,
  Language,
} from '@/lib/i18n';
import { createClient } from '@/lib/supabase/client';

// ─── Timezones ────────────────────────────────────────────────────────────────
const TIMEZONES = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'Europe/Paris', label: 'Europe/Paris (UTC+1/+2)' },
  { value: 'Europe/London', label: 'Europe/London (UTC+0/+1)' },
  { value: 'Europe/Madrid', label: 'Europe/Madrid (UTC+1/+2)' },
  { value: 'Europe/Zurich', label: 'Europe/Zurich (UTC+1/+2)' },
  { value: 'Africa/Casablanca', label: 'Africa/Casablanca (UTC+1)' },
  { value: 'Africa/Dakar', label: 'Africa/Dakar (UTC+0)' },
  { value: 'Africa/Abidjan', label: 'Africa/Abidjan (UTC+0)' },
  { value: 'Africa/Douala', label: 'Africa/Douala (UTC+1)' },
  { value: 'Indian/Comoro', label: 'Indian/Comoro (UTC+3)' },
  { value: 'Asia/Riyadh', label: 'Asia/Riyadh (UTC+3)' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (UTC+4)' },
  { value: 'Asia/Shanghai', label: 'Asia/Shanghai (UTC+8)' },
  { value: 'America/New_York', label: 'America/New_York (UTC-5/-4)' },
  { value: 'America/Toronto', label: 'America/Toronto (UTC-5/-4)' },
  { value: 'America/Sao_Paulo', label: 'America/Sao_Paulo (UTC-3)' },
];

// ─── Date Formats ─────────────────────────────────────────────────────────────
const DATE_FORMATS = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2025)' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2025)' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2025-12-31)' },
  { value: 'YYYY/MM/DD', label: 'YYYY/MM/DD (2025/12/31)' },
  { value: 'DD.MM.YYYY', label: 'DD.MM.YYYY (31.12.2025)' },
  { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY (31-12-2025)' },
];

type SettingsTab = 'localisation' | 'compte' | 'securite';

const STORAGE_KEY = 'shifa_user_settings';

interface UserSettings {
  country: string;
  language: Language;
  currency: string;
  timezone: string;
  dateFormat: string;
}

function defaultSettings(): UserSettings {
  return {
    country: 'FR',
    language: 'fr',
    currency: 'EUR',
    timezone: 'Europe/Paris',
    dateFormat: 'DD/MM/YYYY',
  };
}

function loadSettings(): UserSettings {
  if (typeof window === 'undefined') return defaultSettings();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultSettings(), ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return defaultSettings();
}

const labelMap: Record<string, Record<Language, string>> = {
  country: { fr: 'Pays', en: 'Country', es: 'País', pt: 'País', ar: 'البلد', zh: '国家' },
  language: { fr: 'Langue', en: 'Language', es: 'Idioma', pt: 'Idioma', ar: 'اللغة', zh: '语言' },
  currency: { fr: 'Devise', en: 'Currency', es: 'Moneda', pt: 'Moeda', ar: 'العملة', zh: '货币' },
  timezone: { fr: 'Fuseau horaire', en: 'Timezone', es: 'Zona horaria', pt: 'Fuso horário', ar: 'المنطقة الزمنية', zh: '时区' },
  dateFormat: { fr: 'Format de date', en: 'Date format', es: 'Formato de fecha', pt: 'Formato de data', ar: 'تنسيق التاريخ', zh: '日期格式' },
  save: { fr: 'Enregistrer les préférences', en: 'Save preferences', es: 'Guardar preferencias', pt: 'Salvar preferências', ar: 'حفظ التفضيلات', zh: '保存偏好' },
  saved: { fr: 'Préférences enregistrées !', en: 'Preferences saved!', es: '¡Preferencias guardadas!', pt: 'Preferências salvas!', ar: 'تم حفظ التفضيلات!', zh: '偏好已保存！' },
  logout: { fr: 'Se déconnecter', en: 'Sign out', es: 'Cerrar sesión', pt: 'Sair', ar: 'تسجيل الخروج', zh: '退出登录' },
  autoFill: { fr: 'Sélectionner un pays remplit automatiquement la devise, le fuseau horaire et la langue par défaut.', en: 'Selecting a country auto-fills currency, timezone and default language.', es: 'Seleccionar un país rellena automáticamente la moneda, zona horaria e idioma.', pt: 'Selecionar um país preenche automaticamente moeda, fuso horário e idioma.', ar: 'اختيار البلد يملأ تلقائياً العملة والمنطقة الزمنية واللغة.', zh: '选择国家会自动填充货币、时区和语言。' },
  title: { fr: 'Paramètres', en: 'Settings', es: 'Configuración', pt: 'Configurações', ar: 'الإعدادات', zh: '设置' },
  subtitle: { fr: 'Gérez vos préférences de langue, région et compte', en: 'Manage your language, region and account preferences', es: 'Gestione sus preferencias de idioma, región y cuenta', pt: 'Gerencie suas preferências de idioma, região e conta', ar: 'إدارة تفضيلات اللغة والمنطقة والحساب', zh: '管理您的语言、地区和账户偏好' },
  preview: { fr: 'Aperçu', en: 'Preview', es: 'Vista previa', pt: 'Pré-visualização', ar: 'معاينة', zh: '预览' },
  accountInfo: { fr: 'Informations du compte', en: 'Account Information', es: 'Información de la cuenta', pt: 'Informações da conta', ar: 'معلومات الحساب', zh: '账户信息' },
  session: { fr: 'Session', en: 'Session', es: 'Sesión', pt: 'Sessão', ar: 'الجلسة', zh: '会话' },
  sessionDesc: { fr: 'Déconnectez-vous de votre compte SHIFA sur cet appareil.', en: 'Sign out of your SHIFA account on this device.', es: 'Cierre sesión en su cuenta SHIFA en este dispositivo.', pt: 'Sair da sua conta SHIFA neste dispositivo.', ar: 'تسجيل الخروج من حساب SHIFA على هذا الجهاز.', zh: '在此设备上退出您的 SHIFA 账户。' },
  changePassword: { fr: 'Changer le mot de passe', en: 'Change password', es: 'Cambiar contraseña', pt: 'Alterar senha', ar: 'تغيير كلمة المرور', zh: '修改密码' },
  update: { fr: 'Mettre à jour', en: 'Update', es: 'Actualizar', pt: 'Atualizar', ar: 'تحديث', zh: '更新' },
  emailVerified: { fr: '✓ Email vérifié', en: '✓ Email verified', es: '✓ Email verificado', pt: '✓ Email verificado', ar: '✓ البريد الإلكتروني مُحقق', zh: '✓ 邮箱已验证' },
  emailNotVerified: { fr: '⚠ Email non vérifié', en: '⚠ Email not verified', es: '⚠ Email no verificado', pt: '⚠ Email não verificado', ar: '⚠ البريد الإلكتروني غير مُحقق', zh: '⚠ 邮箱未验证' },
};

export default function SettingsContent() {
  const { language, setLanguage } = useLanguage();
  const { signOut, user } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<SettingsTab>('localisation');
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const L = (key: string) => labelMap[key]?.[language] ?? labelMap[key]?.['en'] ?? key;

  // Load persisted settings on mount — from Supabase if logged in, else localStorage
  useEffect(() => {
    const local = loadSettings();
    setSettings(local);

    if (!user) return;
    const supabase = createClient();
    supabase
      .from('user_profiles')
      .select('country, language, currency, timezone, date_format')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        const merged: UserSettings = {
          country: (data as any).country ?? local.country,
          language: ((data as any).language as Language) ?? local.language,
          currency: (data as any).currency ?? local.currency,
          timezone: (data as any).timezone ?? local.timezone,
          dateFormat: (data as any).date_format ?? local.dateFormat,
        };
        setSettings(merged);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      });
  }, [user]);

  const handleCountryChange = (countryCode: string) => {
    const country = COUNTRIES.find(c => c.code === countryCode);
    if (!country) return;
    setSettings(prev => ({
      ...prev,
      country: countryCode,
      currency: country.currency,
      timezone: country.timezone,
      dateFormat: country.dateFormat,
      language: country.defaultLanguage,
    }));
  };

  const handleSave = async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setLanguage(settings.language);

    if (user) {
      const supabase = createClient();
      await supabase
        .from('user_profiles')
        .update({
          country: settings.country,
          language: settings.language,
          currency: settings.currency,
          timezone: settings.timezone,
          date_format: settings.dateFormat,
        })
        .eq('id', user.id);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await signOut();
      router.push('/');
    } catch {
      setSigningOut(false);
    }
  };

  const tabs: { key: SettingsTab; label: string; icon: string }[] = [
    { key: 'localisation', label: L('title') + ' — ' + (language === 'fr' ? 'Région' : language === 'ar' ? 'المنطقة' : language === 'es' ? 'Región' : language === 'pt' ? 'Região' : language === 'zh' ? '地区' : 'Region'), icon: 'GlobeAltIcon' },
    { key: 'compte', label: language === 'fr' ? 'Compte' : language === 'ar' ? 'الحساب' : language === 'es' ? 'Cuenta' : language === 'pt' ? 'Conta' : language === 'zh' ? '账户' : 'Account', icon: 'UserCircleIcon' },
    { key: 'securite', label: language === 'fr' ? 'Sécurité' : language === 'ar' ? 'الأمان' : language === 'es' ? 'Seguridad' : language === 'pt' ? 'Segurança' : language === 'zh' ? '安全' : 'Security', icon: 'LockClosedIcon' },
  ];

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>{L('title')}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>{L('subtitle')}</p>
        </div>
        {/* Prominent logout button */}
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border"
          style={{ color: '#ef4444', borderColor: '#ef4444', backgroundColor: 'transparent' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#ef4444'; }}
        >
          {signingOut ? (
            <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'currentColor', borderTopColor: 'transparent' }} />
          ) : (
            <Icon name="ArrowLeftOnRectangleIcon" size={17} />
          )}
          {L('logout')}
        </button>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Sidebar tabs */}
        <div className="lg:w-56 shrink-0">
          <div className="card-base p-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 mb-0.5"
                style={{
                  backgroundColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'transparent',
                  color: activeTab === tab.key ? 'white' : 'var(--foreground)',
                }}
              >
                <Icon name={tab.icon as any} size={17} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* ── Localisation Tab ─────────────────────────────────── */}
          {activeTab === 'localisation' && (
            <div className="flex flex-col gap-4">
              <div className="card-base">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="GlobeAltIcon" size={18} style={{ color: 'var(--shifa-blue)' } as React.CSSProperties} />
                  <h2 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>
                    {language === 'fr' ? 'Langue & Région' : language === 'ar' ? 'اللغة والمنطقة' : language === 'es' ? 'Idioma y Región' : language === 'pt' ? 'Idioma e Região' : language === 'zh' ? '语言与地区' : 'Language & Region'}
                  </h2>
                </div>
                <p className="text-xs mb-5" style={{ color: 'var(--muted-foreground)' }}>{L('autoFill')}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Country */}
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--muted-foreground)' }}>{L('country')}</label>
                    <select
                      value={settings.country}
                      onChange={e => handleCountryChange(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2"
                      style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    >
                      {COUNTRIES.map(c => (
                        <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--muted-foreground)' }}>{L('language')}</label>
                    <select
                      value={settings.language}
                      onChange={e => setSettings(prev => ({ ...prev, language: e.target.value as Language }))}
                      className="w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2"
                      style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    >
                      {SUPPORTED_LANGUAGES.map(l => (
                        <option key={l.code} value={l.code}>{l.flag} {l.nativeLabel} ({l.label})</option>
                      ))}
                    </select>
                  </div>

                  {/* Currency */}
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--muted-foreground)' }}>{L('currency')}</label>
                    <select
                      value={settings.currency}
                      onChange={e => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2"
                      style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    >
                      {Object.values(CURRENCIES).map(c => (
                        <option key={c.code} value={c.code}>{c.symbol} {c.code} — {c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Timezone */}
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--muted-foreground)' }}>{L('timezone')}</label>
                    <select
                      value={settings.timezone}
                      onChange={e => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2"
                      style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    >
                      {TIMEZONES.map(tz => (
                        <option key={tz.value} value={tz.value}>{tz.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date Format */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--muted-foreground)' }}>{L('dateFormat')}</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {DATE_FORMATS.map(fmt => (
                        <button
                          key={fmt.value}
                          onClick={() => setSettings(prev => ({ ...prev, dateFormat: fmt.value }))}
                          className="px-3 py-2.5 rounded-xl text-xs font-medium border transition-all text-left"
                          style={{
                            backgroundColor: settings.dateFormat === fmt.value ? 'var(--shifa-blue)' : 'var(--background)',
                            borderColor: settings.dateFormat === fmt.value ? 'var(--shifa-blue)' : 'var(--border)',
                            color: settings.dateFormat === fmt.value ? 'white' : 'var(--foreground)',
                          }}
                        >
                          {fmt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-5 p-4 rounded-xl" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>{L('preview')}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{L('language')}: </span>
                      <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
                        {SUPPORTED_LANGUAGES.find(l => l.code === settings.language)?.nativeLabel ?? settings.language}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{L('currency')}: </span>
                      <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
                        {CURRENCIES[settings.currency]?.symbol ?? settings.currency} 1 234,56
                      </span>
                    </div>
                    <div>
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{L('dateFormat')}: </span>
                      <span className="font-semibold font-mono" style={{ color: 'var(--foreground)' }}>{settings.dateFormat}</span>
                    </div>
                    <div>
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{L('timezone')}: </span>
                      <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{settings.timezone}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                    style={{ backgroundColor: 'var(--shifa-blue)' }}
                  >
                    {saved ? <Icon name="CheckIcon" size={16} /> : <Icon name="CloudArrowUpIcon" size={16} />}
                    {saved ? L('saved') : L('save')}
                  </button>
                  {saved && (
                    <span className="text-xs font-medium" style={{ color: '#16a34a' }}>✓ {L('saved')}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Account Tab ──────────────────────────────────────── */}
          {activeTab === 'compte' && (
            <div className="flex flex-col gap-4">
              <div className="card-base">
                <h2 className="text-base font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>{L('accountInfo')}</h2>
                <div className="flex items-center gap-4 p-4 rounded-xl mb-4" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                    {user?.email?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{user?.email ?? '—'}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                      {user?.email_confirmed_at ? L('emailVerified') : L('emailNotVerified')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Logout card */}
              <div className="card-base">
                <h2 className="text-base font-bold mb-2" style={{ color: 'var(--shifa-dark)' }}>{L('session')}</h2>
                <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>{L('sessionDesc')}</p>
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ backgroundColor: '#ef4444' }}
                >
                  {signingOut ? (
                    <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(255,255,255,0.4)', borderTopColor: 'white' }} />
                  ) : (
                    <Icon name="ArrowLeftOnRectangleIcon" size={17} />
                  )}
                  {L('logout')}
                </button>
              </div>
            </div>
          )}

          {/* ── Security Tab ─────────────────────────────────────── */}
          {activeTab === 'securite' && (
            <div className="flex flex-col gap-4">
              <div className="card-base">
                <h2 className="text-base font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>{L('changePassword')}</h2>
                <div className="flex flex-col gap-3 max-w-sm">
                  {[
                    { label: language === 'fr' ? 'Mot de passe actuel' : language === 'ar' ? 'كلمة المرور الحالية' : 'Current password', key: 'current' },
                    { label: language === 'fr' ? 'Nouveau mot de passe' : language === 'ar' ? 'كلمة المرور الجديدة' : 'New password', key: 'new' },
                    { label: language === 'fr' ? 'Confirmer le nouveau mot de passe' : language === 'ar' ? 'تأكيد كلمة المرور الجديدة' : 'Confirm new password', key: 'confirm' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--muted-foreground)' }}>{field.label}</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none"
                        style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                      />
                    </div>
                  ))}
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white mt-1 self-start transition-all"
                    style={{ backgroundColor: 'var(--shifa-blue)' }}>
                    <Icon name="LockClosedIcon" size={15} />
                    {L('update')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
