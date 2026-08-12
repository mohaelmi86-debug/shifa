'use client';
import React, { useState, useMemo, useCallback } from 'react';
import Icon from '@/components/ui/AppIcon';
import {
  SUPPORTED_LANGUAGES,
  Language,
  TranslationKey,
  getTranslations,
  Translations,
} from '@/lib/i18n';

// ─── Types ────────────────────────────────────────────────────────────────────

type ValidationStatus = 'valid' | 'missing' | 'empty';

interface TranslationRow {
  key: TranslationKey;
  category: string;
  values: Record<Language, string>;
  validation: Record<Language, ValidationStatus>;
}

interface EditCell {
  key: TranslationKey;
  lang: Language;
}

// ─── Key Categories ───────────────────────────────────────────────────────────

const KEY_CATEGORIES: Record<string, TranslationKey[]> = {
  'Actions principales': ['dashboard','patients','settings','logout','search','notifications','save','cancel','confirm','delete','edit','add','close','back','loading','error','success','noData','viewAll','filter','export','language','currency','country','timezone','profile','help','support'],
  'Espaces acteurs': ['ambassador','research','platformAdmin','organizations','users','modules','reports','analytics','security','audit','integrations','subscriptions','network','invitations','referrals','rewards','training','resources','projects','studies','datasets','participants','ethics','dataAccess'],
  'Navigation': ['home','explore','appointments','healthRecord','messages','documents','consultations','results','followUp','vaccination','prevention','emergency','teleconsultation','card','wallet','payments','consent','devices','agenda','prescriptions','carePlans','certificates','referralsNav','billing','finance','inventory','quality','biomedical','interoperability','laboratory','pharmacy','imaging','emergencyDept','maternity','pediatrics','academy','marketplace','aiAssistant','communityHub'],
  'Boutons': ['btnBook','btnStartConsult','btnSendMessage','btnDownload','btnUpload','btnNewInvoice','btnPay','btnRefund','btnApprove','btnReject','btnSubmit','btnConnect','btnDisconnect','btnActivate','btnDeactivate','btnRenew','btnInvite','btnShare','btnPrint','btnGenerate','btnVerify','btnRequest'],
  'Formulaires': ['firstName','lastName','email','phone','address','city','postalCode','dateOfBirth','gender','nationality','profession','specialty','organization','password','confirmPassword','currentPassword','newPassword','description','notes','reason','diagnosis','treatment','dosage','startDate','endDate','duration','quantity','price','total','discount'],
  'Validation': ['validRequired','validEmail','validPhone','validMinLength','validMaxLength','validPasswordMatch','validPasswordStrength','validFutureDate','validPastDate','validPositiveNumber','validFileSize','validFileType'],
  'Statuts': ['statusActive','statusInactive','statusPending','statusApproved','statusRejected','statusCompleted','statusCancelled','statusDraft','statusSent','statusPaid','statusOverdue','statusRefunded','statusCovered','statusScheduled','statusInProgress'],
  'Modules SHIFA': ['modPatientPortal','modProfessionalWorkspace','modHospitalManagement','modLaboratory','modPharmacy','modImaging','modEmergency','modMaternityPediatrics','modFinanceBilling','modInventorySupplyChain','modBiomedicalEquipment','modQualityAccreditation','modTeleconsultation','modInteroperability','modShifaCard','modWallet','modNotifications','modShifaAI','modShifaAcademy','modMarketplace','modAmbassadorProgram','modMinistryAuthority','modHealthInsurance','modUniversityTraining','modNGOPartner'],
  'Config pays-modules': ['countryModuleConfig','moduleStatus','statusAvailable','statusRestricted','statusUnavailable','statusComingSoon','regulatoryRules','licenseRequired','authorizationRequired','countryConfig','moduleVisibility','applyConfig','resetConfig','saveConfig','configSaved','selectCountry','selectModule'],
  'Salutations': ['hello','goodMorning','goodAfternoon','goodEvening','welcome','welcomeBack','today','yesterday','tomorrow','thisWeek','thisMonth','thisYear','noResults','tryAgain','contactSupport','learnMore','seeDetails','hideDetails'],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildRows(overrides: Partial<Record<Language, Partial<Translations>>>): TranslationRow[] {
  const rows: TranslationRow[] = [];
  for (const [category, keys] of Object.entries(KEY_CATEGORIES)) {
    for (const key of keys as TranslationKey[]) {
      const values = {} as Record<Language, string>;
      const validation = {} as Record<Language, ValidationStatus>;
      for (const lang of SUPPORTED_LANGUAGES) {
        const base = getTranslations(lang.code)[key] ?? '';
        const override = overrides[lang.code]?.[key];
        const val = override !== undefined ? override : base;
        values[lang.code] = val;
        validation[lang.code] = val === '' ? 'empty' : val === key ? 'missing' : 'valid';
      }
      rows.push({ key, category, values, validation });
    }
  }
  return rows;
}

function getValidationColor(status: ValidationStatus): string {
  if (status === 'valid') return 'var(--shifa-green, #10b981)';
  if (status === 'empty') return 'var(--shifa-red, #ef4444)';
  return 'var(--shifa-orange, #f59e0b)';
}

function getValidationIcon(status: ValidationStatus): string {
  if (status === 'valid') return 'CheckCircleIcon';
  if (status === 'empty') return 'XCircleIcon';
  return 'ExclamationCircleIcon';
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminTranslationsContent() {
  // Editable overrides stored in state (simulates save-to-backend)
  const [overrides, setOverrides] = useState<Partial<Record<Language, Partial<Translations>>>>({});
  const [savedSnapshot, setSavedSnapshot] = useState<Partial<Record<Language, Partial<Translations>>>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLang, setSelectedLang] = useState<Language | 'all'>('all');
  const [validationFilter, setValidationFilter] = useState<'all' | 'missing' | 'empty' | 'valid'>('all');
  const [activeTab, setActiveTab] = useState<'editor' | 'validation' | 'export'>('editor');

  // Inline editing
  const [editCell, setEditCell] = useState<EditCell | null>(null);
  const [editValue, setEditValue] = useState('');

  const allRows = useMemo(() => buildRows(overrides), [overrides]);

  const filteredRows = useMemo(() => {
    return allRows.filter(row => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchKey = row.key.toLowerCase().includes(q);
        const matchValues = Object.values(row.values).some(v => v.toLowerCase().includes(q));
        if (!matchKey && !matchValues) return false;
      }
      if (selectedCategory !== 'all' && row.category !== selectedCategory) return false;
      if (validationFilter !== 'all') {
        const langs = selectedLang === 'all' ? SUPPORTED_LANGUAGES.map(l => l.code) : [selectedLang];
        const hasIssue = langs.some(l => row.validation[l as Language] === validationFilter);
        if (!hasIssue) return false;
      }
      return true;
    });
  }, [allRows, searchQuery, selectedCategory, selectedLang, validationFilter]);

  // Validation stats
  const stats = useMemo(() => {
    let total = 0, valid = 0, empty = 0, missing = 0;
    for (const row of allRows) {
      for (const lang of SUPPORTED_LANGUAGES) {
        total++;
        const s = row.validation[lang.code];
        if (s === 'valid') valid++;
        else if (s === 'empty') empty++;
        else missing++;
      }
    }
    return { total, valid, empty, missing, pct: Math.round((valid / total) * 100) };
  }, [allRows]);

  const visibleLangs = selectedLang === 'all' ? SUPPORTED_LANGUAGES : SUPPORTED_LANGUAGES.filter(l => l.code === selectedLang);

  const startEdit = useCallback((key: TranslationKey, lang: Language, currentValue: string) => {
    setEditCell({ key, lang });
    setEditValue(currentValue);
  }, []);

  const commitEdit = useCallback(() => {
    if (!editCell) return;
    setOverrides(prev => ({
      ...prev,
      [editCell.lang]: {
        ...(prev[editCell.lang] || {}),
        [editCell.key]: editValue,
      },
    }));
    setIsDirty(true);
    setEditCell(null);
  }, [editCell, editValue]);

  const cancelEdit = useCallback(() => {
    setEditCell(null);
    setEditValue('');
  }, []);

  const handleSave = useCallback(() => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSavedSnapshot(overrides);
      setIsDirty(false);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2500);
    }, 800);
  }, [overrides]);

  const handleReset = useCallback(() => {
    setOverrides(savedSnapshot);
    setIsDirty(false);
  }, [savedSnapshot]);

  const handleExportJSON = useCallback(() => {
    const exportData: Record<Language, Record<string, string>> = {} as any;
    for (const lang of SUPPORTED_LANGUAGES) {
      exportData[lang.code] = {};
      for (const row of allRows) {
        exportData[lang.code][row.key] = row.values[lang.code];
      }
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shifa-translations-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [allRows]);

  const handleExportCSV = useCallback(() => {
    const langs = SUPPORTED_LANGUAGES.map(l => l.code);
    const header = ['key', 'category', ...langs].join(',');
    const rows = allRows.map(row => {
      const vals = langs.map(l => `"${(row.values[l as Language] || '').replace(/"/g, '""')}"`);
      return [`"${row.key}"`, `"${row.category}"`, ...vals].join(',');
    });
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shifa-translations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [allRows]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* ── Header ── */}
      <div className="border-b px-6 py-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--shifa-blue, #0066ff), var(--shifa-teal, #00b4d8))' }}>
              <Icon name="LanguageIcon" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Gestion des Traductions</h1>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                {allRows.length} clés · 6 langues · {stats.pct}% complètes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isDirty && (
              <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                Modifications non sauvegardées
              </span>
            )}
            <button
              onClick={handleReset}
              disabled={!isDirty}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors disabled:opacity-40"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              <Icon name="ArrowUturnLeftIcon" size={14} />
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={!isDirty || saveStatus === 'saving'}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: saveStatus === 'saved' ? '#10b981' : 'var(--shifa-blue, #0066ff)' }}
            >
              {saveStatus === 'saving' ? (
                <><Icon name="ArrowPathIcon" size={14} className="animate-spin" />Sauvegarde...</>
              ) : saveStatus === 'saved' ? (
                <><Icon name="CheckIcon" size={14} />Sauvegardé</>
              ) : (
                <><Icon name="CloudArrowUpIcon" size={14} />Sauvegarder</>
              )}
            </button>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total clés', value: allRows.length, icon: 'KeyIcon', color: 'var(--shifa-blue, #0066ff)' },
            { label: 'Complètes', value: stats.valid, icon: 'CheckCircleIcon', color: '#10b981' },
            { label: 'Vides', value: stats.empty, icon: 'XCircleIcon', color: '#ef4444' },
            { label: 'Manquantes', value: stats.missing, icon: 'ExclamationCircleIcon', color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2.5 p-3 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${s.color}18` }}>
                <Icon name={s.icon} size={16} style={{ color: s.color }} />
              </div>
              <div>
                <div className="text-lg font-bold leading-none" style={{ color: 'var(--foreground)' }}>{s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Progress bar ── */}
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
            <span>Progression globale</span>
            <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{stats.pct}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${stats.pct}%`, backgroundColor: '#10b981' }} />
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="mt-4 flex gap-1">
          {[
            { id: 'editor', label: 'Éditeur', icon: 'PencilSquareIcon' },
            { id: 'validation', label: 'Validation', icon: 'ShieldCheckIcon' },
            { id: 'export', label: 'Export', icon: 'ArrowDownTrayIcon' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-white' : ''}`}
              style={activeTab === tab.id ? { backgroundColor: 'var(--shifa-blue, #0066ff)' } : { color: 'var(--muted-foreground)' }}
            >
              <Icon name={tab.icon} size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Editor Tab ── */}
      {activeTab === 'editor' && (
        <div className="p-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-5">
            <div className="flex-1 min-w-48 relative">
              <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
              <input
                type="text"
                placeholder="Rechercher une clé ou une valeur..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }}
              />
            </div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-lg border text-sm"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }}
            >
              <option value="all">Toutes les catégories</option>
              {Object.keys(KEY_CATEGORIES).map(cat => (
                <option key={cat} value={cat}>{cat} ({KEY_CATEGORIES[cat].length})</option>
              ))}
            </select>
            <select
              value={selectedLang}
              onChange={e => setSelectedLang(e.target.value as Language | 'all')}
              className="px-3 py-2 rounded-lg border text-sm"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }}
            >
              <option value="all">Toutes les langues</option>
              {SUPPORTED_LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.flag} {l.nativeLabel}</option>
              ))}
            </select>
            <select
              value={validationFilter}
              onChange={e => setValidationFilter(e.target.value as any)}
              className="px-3 py-2 rounded-lg border text-sm"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }}
            >
              <option value="all">Tous les statuts</option>
              <option value="valid">✅ Valides</option>
              <option value="empty">❌ Vides</option>
              <option value="missing">⚠️ Manquantes</option>
            </select>
            <span className="flex items-center text-sm px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--card)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }}>
              {filteredRows.length} résultat{filteredRows.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Table */}
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
                    <th className="text-left px-4 py-3 font-semibold sticky left-0 z-10 min-w-[200px]" style={{ color: 'var(--foreground)', backgroundColor: 'var(--card)' }}>
                      Clé
                    </th>
                    {visibleLangs.map(lang => (
                      <th key={lang.code} className="text-left px-4 py-3 font-semibold min-w-[200px]" style={{ color: 'var(--foreground)' }}>
                        <span className="flex items-center gap-1.5">
                          <span>{lang.flag}</span>
                          <span>{lang.nativeLabel}</span>
                          {lang.rtl && <span className="text-[10px] px-1 rounded" style={{ backgroundColor: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue, #0066ff)' }}>RTL</span>}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row, idx) => {
                    const isEven = idx % 2 === 0;
                    return (
                      <tr
                        key={row.key}
                        style={{ backgroundColor: isEven ? 'var(--background)' : 'var(--card)', borderBottom: '1px solid var(--border)' }}
                      >
                        {/* Key cell */}
                        <td className="px-4 py-2.5 sticky left-0 z-10" style={{ backgroundColor: isEven ? 'var(--background)' : 'var(--card)' }}>
                          <div>
                            <code className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue, #0066ff)' }}>
                              {row.key}
                            </code>
                            <div className="text-[10px] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{row.category}</div>
                          </div>
                        </td>
                        {/* Language cells */}
                        {visibleLangs.map(lang => {
                          const val = row.values[lang.code];
                          const status = row.validation[lang.code];
                          const isEditing = editCell?.key === row.key && editCell?.lang === lang.code;
                          return (
                            <td key={lang.code} className="px-4 py-2.5">
                              {isEditing ? (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    autoFocus
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') cancelEdit(); }}
                                    dir={lang.rtl ? 'rtl' : 'ltr'}
                                    className="flex-1 px-2 py-1 rounded border text-sm"
                                    style={{ borderColor: 'var(--shifa-blue, #0066ff)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }}
                                  />
                                  <button onClick={commitEdit} className="p-1 rounded" style={{ color: '#10b981' }}>
                                    <Icon name="CheckIcon" size={14} />
                                  </button>
                                  <button onClick={cancelEdit} className="p-1 rounded" style={{ color: '#ef4444' }}>
                                    <Icon name="XMarkIcon" size={14} />
                                  </button>
                                </div>
                              ) : (
                                <div
                                  className="group flex items-start gap-2 cursor-pointer rounded px-2 py-1 hover:bg-opacity-50 transition-colors"
                                  style={{ backgroundColor: 'transparent' }}
                                  onClick={() => startEdit(row.key, lang.code, val)}
                                  title="Cliquer pour modifier"
                                >
                                  <Icon
                                    name={getValidationIcon(status)}
                                    size={13}
                                    className="mt-0.5 flex-shrink-0"
                                    style={{ color: getValidationColor(status) }}
                                  />
                                  <span
                                    className={`flex-1 text-sm leading-snug ${lang.rtl ? 'text-right' : ''} ${!val ? 'italic' : ''}`}
                                    dir={lang.rtl ? 'rtl' : 'ltr'}
                                    style={{ color: val ? 'var(--foreground)' : 'var(--muted-foreground)' }}
                                  >
                                    {val || '(vide)'}
                                  </span>
                                  <Icon name="PencilIcon" size={11} className="opacity-0 group-hover:opacity-60 flex-shrink-0 mt-0.5" style={{ color: 'var(--muted-foreground)' }} />
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                  {filteredRows.length === 0 && (
                    <tr>
                      <td colSpan={visibleLangs.length + 1} className="px-6 py-12 text-center" style={{ color: 'var(--muted-foreground)' }}>
                        <Icon name="MagnifyingGlassIcon" size={32} className="mx-auto mb-2 opacity-30" />
                        <p>Aucune clé trouvée pour ces filtres</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--muted-foreground)' }}>
            💡 Cliquez sur n'importe quelle cellule pour la modifier. Appuyez sur Entrée pour valider, Échap pour annuler.
          </p>
        </div>
      )}

      {/* ── Validation Tab ── */}
      {activeTab === 'validation' && (
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Rapport de validation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {SUPPORTED_LANGUAGES.map(lang => {
              const langRows = allRows;
              const langValid = langRows.filter(r => r.validation[lang.code] === 'valid').length;
              const langEmpty = langRows.filter(r => r.validation[lang.code] === 'empty').length;
              const langMissing = langRows.filter(r => r.validation[lang.code] === 'missing').length;
              const pct = Math.round((langValid / langRows.length) * 100);
              return (
                <div key={lang.code} className="p-4 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{lang.flag}</span>
                      <div>
                        <div className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{lang.nativeLabel}</div>
                        <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{lang.code.toUpperCase()}{lang.rtl ? ' · RTL' : ''}</div>
                      </div>
                    </div>
                    <span className="text-lg font-bold" style={{ color: pct === 100 ? '#10b981' : pct > 80 ? '#f59e0b' : '#ef4444' }}>{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full mb-3 overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: pct === 100 ? '#10b981' : pct > 80 ? '#f59e0b' : '#ef4444' }} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-sm font-bold" style={{ color: '#10b981' }}>{langValid}</div>
                      <div className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>Valides</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold" style={{ color: '#ef4444' }}>{langEmpty}</div>
                      <div className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>Vides</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold" style={{ color: '#f59e0b' }}>{langMissing}</div>
                      <div className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>Manquantes</div>
                    </div>
                  </div>
                  {(langEmpty > 0 || langMissing > 0) && (
                    <button
                      onClick={() => { setSelectedLang(lang.code); setValidationFilter('empty'); setActiveTab('editor'); }}
                      className="mt-3 w-full text-xs py-1.5 rounded-lg border font-medium transition-colors"
                      style={{ borderColor: 'var(--border)', color: 'var(--shifa-blue, #0066ff)' }}
                    >
                      Voir les clés manquantes →
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Category breakdown */}
          <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Par catégorie</h3>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
                  <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--foreground)' }}>Catégorie</th>
                  <th className="text-center px-3 py-3 font-semibold" style={{ color: 'var(--foreground)' }}>Clés</th>
                  {SUPPORTED_LANGUAGES.map(l => (
                    <th key={l.code} className="text-center px-3 py-3 font-semibold" style={{ color: 'var(--foreground)' }}>{l.flag}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(KEY_CATEGORIES).map(([cat, keys], idx) => {
                  const catRows = allRows.filter(r => r.category === cat);
                  return (
                    <tr key={cat} style={{ backgroundColor: idx % 2 === 0 ? 'var(--background)' : 'var(--card)', borderBottom: '1px solid var(--border)' }}>
                      <td className="px-4 py-2.5 font-medium" style={{ color: 'var(--foreground)' }}>{cat}</td>
                      <td className="px-3 py-2.5 text-center text-xs" style={{ color: 'var(--muted-foreground)' }}>{keys.length}</td>
                      {SUPPORTED_LANGUAGES.map(lang => {
                        let valid = catRows.filter(r => r.validation[lang.code] === 'valid').length;
                        const pct = Math.round((valid / catRows.length) * 100);
                        return (
                          <td key={lang.code} className="px-3 py-2.5 text-center">
                            <span className="text-xs font-semibold" style={{ color: pct === 100 ? '#10b981' : pct > 80 ? '#f59e0b' : '#ef4444' }}>
                              {pct}%
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Export Tab ── */}
      {activeTab === 'export' && (
        <div className="p-6 max-w-2xl">
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Exporter les traductions</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
            Exportez toutes les clés de traduction dans le format de votre choix. Les modifications non sauvegardées sont incluses dans l'export.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(0,102,255,0.1)' }}>
                  <Icon name="CodeBracketIcon" size={20} style={{ color: 'var(--shifa-blue, #0066ff)' }} />
                </div>
                <div>
                  <div className="font-semibold" style={{ color: 'var(--foreground)' }}>JSON</div>
                  <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Format structuré par langue</div>
                </div>
              </div>
              <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>
                Exporte un objet JSON avec une clé par langue (fr, en, es, pt, ar, zh), chacune contenant toutes les clés de traduction.
              </p>
              <button
                onClick={handleExportJSON}
                className="w-full py-2 rounded-lg text-sm font-semibold text-white"
                style={{ backgroundColor: 'var(--shifa-blue, #0066ff)' }}
              >
                <Icon name="ArrowDownTrayIcon" size={14} className="inline mr-1.5" />
                Télécharger JSON
              </button>
            </div>
            <div className="p-5 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}>
                  <Icon name="TableCellsIcon" size={20} style={{ color: '#10b981' }} />
                </div>
                <div>
                  <div className="font-semibold" style={{ color: 'var(--foreground)' }}>CSV</div>
                  <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Format tableur (Excel / Sheets)</div>
                </div>
              </div>
              <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>
                Exporte un fichier CSV avec une ligne par clé et une colonne par langue. Compatible avec Excel, Google Sheets et LibreOffice.
              </p>
              <button
                onClick={handleExportCSV}
                className="w-full py-2 rounded-lg text-sm font-semibold text-white"
                style={{ backgroundColor: '#10b981' }}
              >
                <Icon name="ArrowDownTrayIcon" size={14} className="inline mr-1.5" />
                Télécharger CSV
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(245,158,11,0.05)' }}>
            <div className="flex items-start gap-2">
              <Icon name="InformationCircleIcon" size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#f59e0b' }} />
              <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                <strong style={{ color: 'var(--foreground)' }}>Note Phase 1 :</strong> Les modifications effectuées dans cet éditeur sont stockées en mémoire de session. En Phase 3, elles seront persistées en base de données (Supabase) et synchronisées automatiquement avec le système i18n. Pour l'instant, exportez le JSON et intégrez-le manuellement dans <code className="text-xs px-1 rounded" style={{ backgroundColor: 'var(--border)' }}>src/lib/i18n.ts</code>.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
