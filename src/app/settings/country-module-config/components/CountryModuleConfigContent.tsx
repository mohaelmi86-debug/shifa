'use client';
import React, { useState, useMemo } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslations, COUNTRIES } from '@/lib/i18n';

// ─── Types ────────────────────────────────────────────────────────────────────

type ModuleStatus = 'available' | 'restricted' | 'unavailable' | 'coming_soon';

interface ShifaModule {
  id: string;
  nameKey: string;
  nameFr: string;
  category: 'clinical' | 'admin' | 'institutional' | 'ai' | 'patient' | 'integration';
  icon: string;
  description: string;
  dependencies?: string[];
  requiresLicense?: boolean;
}

interface CountryModuleRule {
  countryCode: string;
  moduleId: string;
  status: ModuleStatus;
  regulatoryNote?: string;
  licenseRequired?: boolean;
  authorizationRequired?: boolean;
  effectiveDate?: string;
}

// ─── 25 SHIFA Modules ─────────────────────────────────────────────────────────

const SHIFA_MODULES: ShifaModule[] = [
  { id: 'patient-portal', nameKey: 'modPatientPortal', nameFr: 'Portail Patient', category: 'patient', icon: 'UserIcon', description: 'Espace patient complet — dossier, rendez-vous, prescriptions' },
  { id: 'professional-workspace', nameKey: 'modProfessionalWorkspace', nameFr: 'Espace Professionnel', category: 'clinical', icon: 'BriefcaseIcon', description: 'Espace de travail pour les professionnels de santé' },
  { id: 'hospital-management', nameKey: 'modHospitalManagement', nameFr: 'Gestion Hospitalière', category: 'admin', icon: 'BuildingOffice2Icon', description: 'Admissions, lits, services, hospitalisations' },
  { id: 'laboratory', nameKey: 'modLaboratory', nameFr: 'Laboratoire', category: 'clinical', icon: 'BeakerIcon', description: 'Analyses biologiques, résultats, contrôle qualité', requiresLicense: true },
  { id: 'pharmacy', nameKey: 'modPharmacy', nameFr: 'Pharmacie', category: 'clinical', icon: 'ArchiveBoxIcon', description: 'Dispensation, inventaire, ordonnances', requiresLicense: true },
  { id: 'imaging', nameKey: 'modImaging', nameFr: 'Imagerie Médicale', category: 'clinical', icon: 'PhotoIcon', description: 'Radiologie, DICOM, rapports d\'imagerie', requiresLicense: true },
  { id: 'emergency', nameKey: 'modEmergency', nameFr: 'Urgences', category: 'clinical', icon: 'BoltIcon', description: 'Triage, prise en charge urgences, file d\'attente' },
  { id: 'maternity-pediatrics', nameKey: 'modMaternityPediatrics', nameFr: 'Maternité & Pédiatrie', category: 'clinical', icon: 'HeartIcon', description: 'Suivi grossesse, accouchement, pédiatrie' },
  { id: 'finance-billing', nameKey: 'modFinanceBilling', nameFr: 'Finance & Facturation', category: 'admin', icon: 'BanknotesIcon', description: 'Facturation, paiements, remboursements, assurance' },
  { id: 'inventory-supply', nameKey: 'modInventorySupplyChain', nameFr: 'Inventaire & Approvisionnement', category: 'admin', icon: 'CubeIcon', description: 'Stocks, commandes, fournisseurs, péremptions' },
  { id: 'biomedical', nameKey: 'modBiomedicalEquipment', nameFr: 'Équipements Biomédicaux', category: 'admin', icon: 'CpuChipIcon', description: 'Maintenance, contrats, interventions équipements' },
  { id: 'quality-accreditation', nameKey: 'modQualityAccreditation', nameFr: 'Qualité & Accréditation', category: 'admin', icon: 'ShieldCheckIcon', description: 'Indicateurs qualité, non-conformités, audits' },
  { id: 'teleconsultation', nameKey: 'modTeleconsultation', nameFr: 'Téléconsultation', category: 'clinical', icon: 'VideoCameraIcon', description: 'Consultations vidéo sécurisées à distance', requiresLicense: true },
  { id: 'interoperability', nameKey: 'modInteroperability', nameFr: 'Interopérabilité', category: 'integration', icon: 'ArrowsRightLeftIcon', description: 'FHIR, HL7, DICOM, APIs, webhooks' },
  { id: 'shifa-card', nameKey: 'modShifaCard', nameFr: 'Carte SHIFA', category: 'patient', icon: 'CreditCardIcon', description: 'Carte numérique et physique d\'identité santé' },
  { id: 'wallet', nameKey: 'modWallet', nameFr: 'Portefeuilles Numériques', category: 'patient', icon: 'WalletIcon', description: 'Google Wallet, Apple Wallet, mobile money' },
  { id: 'notifications', nameKey: 'modNotifications', nameFr: 'Notifications & Communications', category: 'integration', icon: 'BellIcon', description: 'Notifications push, SMS, email, messagerie sécurisée' },
  { id: 'shifa-ai', nameKey: 'modShifaAI', nameFr: 'SHIFA AI', category: 'ai', icon: 'SparklesIcon', description: 'Assistant clinique IA, aide à la documentation', requiresLicense: true },
  { id: 'shifa-academy', nameKey: 'modShifaAcademy', nameFr: 'SHIFA Académie', category: 'institutional', icon: 'AcademicCapIcon', description: 'Formation, cours, certifications santé' },
  { id: 'marketplace', nameKey: 'modMarketplace', nameFr: 'Marketplace Santé', category: 'integration', icon: 'ShoppingBagIcon', description: 'Produits, services, fournisseurs santé' },
  { id: 'ambassador', nameKey: 'modAmbassadorProgram', nameFr: 'Programme Ambassadeur', category: 'institutional', icon: 'StarIcon', description: 'Réseau ambassadeurs, parrainages, récompenses' },
  { id: 'ministry-authority', nameKey: 'modMinistryAuthority', nameFr: 'Ministère & Autorités', category: 'institutional', icon: 'BuildingLibraryIcon', description: 'Supervision nationale, indicateurs santé publique' },
  { id: 'health-insurance', nameKey: 'modHealthInsurance', nameFr: 'Assurance Santé', category: 'institutional', icon: 'ShieldCheckIcon', description: 'Membres, couverture, remboursements, sinistres' },
  { id: 'university-training', nameKey: 'modUniversityTraining', nameFr: 'Université & Formation', category: 'institutional', icon: 'BookOpenIcon', description: 'Étudiants, stages, recherche, datasets autorisés' },
  { id: 'ngo-partner', nameKey: 'modNGOPartner', nameFr: 'ONG & Partenaires', category: 'institutional', icon: 'GlobeAltIcon', description: 'Programmes humanitaires, bénéficiaires, terrains' },
];

const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  clinical: { label: 'Clinique', color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
  admin: { label: 'Administration', color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
  institutional: { label: 'Institutionnel', color: '#0891b2', bg: 'rgba(8,145,178,0.08)' },
  ai: { label: 'IA', color: '#059669', bg: 'rgba(5,150,105,0.08)' },
  patient: { label: 'Patient', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
  integration: { label: 'Intégration', color: '#d97706', bg: 'rgba(217,119,6,0.08)' },
};

const STATUS_CONFIG: Record<ModuleStatus, { label: string; labelEn: string; color: string; bg: string; icon: string }> = {
  available: { label: 'Actif', labelEn: 'Active', color: '#16a34a', bg: 'rgba(22,163,74,0.10)', icon: 'CheckCircleIcon' },
  restricted: { label: 'Restreint', labelEn: 'Restricted', color: '#d97706', bg: 'rgba(217,119,6,0.10)', icon: 'ExclamationTriangleIcon' },
  unavailable: { label: 'Non disponible', labelEn: 'Unavailable', color: '#dc2626', bg: 'rgba(220,38,38,0.10)', icon: 'XCircleIcon' },
  coming_soon: { label: 'Bientôt', labelEn: 'Coming soon', color: '#6366f1', bg: 'rgba(99,102,241,0.10)', icon: 'ClockIcon' },
};

// Default rules for all countries (available by default)
const buildDefaultRules = (): Record<string, Record<string, CountryModuleRule>> => {
  const rules: Record<string, Record<string, CountryModuleRule>> = {};
  COUNTRIES.forEach(country => {
    rules[country.code] = {};
    SHIFA_MODULES.forEach(mod => {
      // Some modules restricted in certain countries by default
      let status: ModuleStatus = 'available';
      if (mod.id === 'teleconsultation' && ['SA', 'AE'].includes(country.code)) status = 'restricted';
      if (mod.id === 'shifa-ai' && ['CN'].includes(country.code)) status = 'restricted';
      if (mod.id === 'marketplace' && ['SA'].includes(country.code)) status = 'restricted';
      rules[country.code][mod.id] = {
        countryCode: country.code,
        moduleId: mod.id,
        status,
        licenseRequired: mod.requiresLicense || false,
        authorizationRequired: status === 'restricted',
        regulatoryNote: status === 'restricted' ? 'Soumis à réglementation locale' : undefined,
      };
    });
  });
  return rules;
};

const REGULATORY_NOTES: Record<string, string> = {
  teleconsultation: 'La téléconsultation peut nécessiter une autorisation spécifique selon la législation nationale.',
  pharmacy: 'La dispensation de médicaments est soumise à licence pharmaceutique nationale.',
  laboratory: 'Les analyses biologiques requièrent une accréditation du laboratoire selon les normes locales.',
  imaging: 'L\'imagerie médicale est soumise à autorisation de l\'autorité sanitaire compétente.',
  'shifa-ai': 'L\'IA médicale est soumise à réglementation sur les dispositifs médicaux logiciels (SaMD).',
  'health-insurance': 'L\'assurance santé est réglementée par les autorités financières et sanitaires nationales.',
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CountryModuleConfigContent() {
  const { language } = useLanguage();
  const tr = getTranslations(language);

  const [selectedCountry, setSelectedCountry] = useState<string>('SN');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [rules, setRules] = useState<Record<string, Record<string, CountryModuleRule>>>(buildDefaultRules);
  const [savedCountries, setSavedCountries] = useState<Set<string>>(new Set());
  const [editingModule, setEditingModule] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'matrix'>('grid');

  const country = COUNTRIES.find(c => c.code === selectedCountry);

  const filteredModules = useMemo(() => {
    return SHIFA_MODULES.filter(mod => {
      const matchCat = selectedCategory === 'all' || mod.category === selectedCategory;
      const matchSearch = !searchQuery || mod.nameFr.toLowerCase().includes(searchQuery.toLowerCase()) || mod.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const getRule = (countryCode: string, moduleId: string): CountryModuleRule => {
    return rules[countryCode]?.[moduleId] || { countryCode, moduleId, status: 'available', licenseRequired: false, authorizationRequired: false };
  };

  const updateStatus = (moduleId: string, status: ModuleStatus) => {
    setRules(prev => ({
      ...prev,
      [selectedCountry]: {
        ...prev[selectedCountry],
        [moduleId]: {
          ...getRule(selectedCountry, moduleId),
          status,
          authorizationRequired: status === 'restricted',
        },
      },
    }));
    setSavedCountries(prev => { const s = new Set(prev); s.delete(selectedCountry); return s; });
  };

  const updateNote = (moduleId: string, note: string) => {
    setRules(prev => ({
      ...prev,
      [selectedCountry]: {
        ...prev[selectedCountry],
        [moduleId]: { ...getRule(selectedCountry, moduleId), regulatoryNote: note },
      },
    }));
  };

  const saveConfig = () => {
    setSavedCountries(prev => new Set([...prev, selectedCountry]));
  };

  const resetConfig = () => {
    const defaults = buildDefaultRules();
    setRules(prev => ({ ...prev, [selectedCountry]: defaults[selectedCountry] }));
    setSavedCountries(prev => { const s = new Set(prev); s.delete(selectedCountry); return s; });
  };

  const countByStatus = (status: ModuleStatus) =>
    SHIFA_MODULES.filter(m => getRule(selectedCountry, m.id).status === status).length;

  const isSaved = savedCountries.has(selectedCountry);

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Icon name="GlobeAltIcon" size={20} style={{ color: 'var(--shifa-blue)' } as any} />
            <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>
              {tr.countryModuleConfig}
            </h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            {language === 'fr' ? 'Configurez la disponibilité des 25 modules SHIFA par pays et définissez les règles réglementaires.' :
             language === 'en' ? 'Configure the availability of 25 SHIFA modules per country and define regulatory rules.' :
             language === 'es' ? 'Configure la disponibilidad de los 25 módulos SHIFA por país y defina las reglas regulatorias.' :
             language === 'ar' ? 'قم بتكوين توفر 25 وحدة SHIFA لكل بلد وتحديد القواعد التنظيمية.' :
             language === 'zh'? '配置每个国家25个SHIFA模块的可用性并定义监管规则。' : 'Configure a disponibilidade dos 25 módulos SHIFA por país e defina as regras regulatórias.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(v => v === 'grid' ? 'matrix' : 'grid')}
            className="btn-outline text-sm px-3 py-2 flex items-center gap-2"
          >
            <Icon name={viewMode === 'grid' ? 'TableCellsIcon' : 'Squares2X2Icon'} size={15} />
            {viewMode === 'grid' ? 'Vue matrice' : 'Vue grille'}
          </button>
          <button onClick={resetConfig} className="btn-outline text-sm px-3 py-2 flex items-center gap-2">
            <Icon name="ArrowPathIcon" size={15} />
            {tr.resetConfig}
          </button>
          <button
            onClick={saveConfig}
            className="btn-primary text-sm px-4 py-2 flex items-center gap-2"
          >
            <Icon name={isSaved ? 'CheckIcon' : 'CloudArrowUpIcon'} size={15} />
            {isSaved ? tr.configSaved : tr.saveConfig}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Country Selector Panel */}
        <div className="lg:col-span-1">
          <div className="card-base p-4 mb-4">
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
              {tr.selectCountry}
            </h3>
            <div className="space-y-1 max-h-80 overflow-y-auto scrollbar-thin">
              {COUNTRIES.map(c => {
                const isSelected = c.code === selectedCountry;
                const hasSaved = savedCountries.has(c.code);
                return (
                  <button
                    key={c.code}
                    onClick={() => setSelectedCountry(c.code)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left ${isSelected ? 'font-semibold' : 'hover:bg-muted'}`}
                    style={{
                      backgroundColor: isSelected ? 'rgba(0,102,255,0.08)' : undefined,
                      color: isSelected ? 'var(--shifa-blue)' : 'var(--foreground)',
                    }}
                  >
                    <span className="text-base">{c.flag}</span>
                    <span className="flex-1 truncate">{c.name}</span>
                    {hasSaved && <Icon name="CheckCircleIcon" size={12} style={{ color: 'var(--shifa-green)' } as any} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Country Stats */}
          {country && (
            <div className="card-base p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{country.flag}</span>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{country.name}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{country.currency} · {country.phonePrefix}</p>
                </div>
              </div>
              <div className="space-y-2">
                {(['available', 'restricted', 'unavailable', 'coming_soon'] as ModuleStatus[]).map(s => {
                  const cfg = STATUS_CONFIG[s];
                  const count = countByStatus(s);
                  return (
                    <div key={s} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{cfg.label}</span>
                      </div>
                      <span className="text-xs font-bold" style={{ color: cfg.color }}>{count}</span>
                    </div>
                  );
                })}
                <div className="pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Total modules</span>
                    <span className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>{SHIFA_MODULES.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Module Config Panel */}
        <div className="lg:col-span-3">
          {/* Filters */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Icon name="MagnifyingGlassIcon" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={tr.search + '...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-transparent"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedCategory === 'all' ? 'text-white' : 'hover:bg-muted'}`}
                style={{ backgroundColor: selectedCategory === 'all' ? 'var(--shifa-blue)' : undefined, color: selectedCategory === 'all' ? 'white' : 'var(--foreground)' }}
              >
                Tous
              </button>
              {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedCategory === key ? '' : 'hover:bg-muted'}`}
                  style={{
                    backgroundColor: selectedCategory === key ? cfg.bg : undefined,
                    color: selectedCategory === key ? cfg.color : 'var(--foreground)',
                    border: selectedCategory === key ? `1px solid ${cfg.color}30` : undefined,
                  }}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {viewMode === 'grid' ? (
            /* Grid View */
            <div className="space-y-3">
              {filteredModules.map(mod => {
                const rule = getRule(selectedCountry, mod.id);
                const statusCfg = STATUS_CONFIG[rule.status];
                const catCfg = CATEGORY_CONFIG[mod.category];
                const isEditing = editingModule === mod.id;
                const defaultNote = REGULATORY_NOTES[mod.id] || '';

                return (
                  <div
                    key={mod.id}
                    className="card-base p-4 transition-all"
                    style={{ borderLeft: `3px solid ${statusCfg.color}` }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Module icon */}
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: catCfg.bg }}>
                        <Icon name={mod.icon as any} size={18} style={{ color: catCfg.color } as any} />
                      </div>

                      {/* Module info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{mod.nameFr}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: catCfg.bg, color: catCfg.color }}>{catCfg.label}</span>
                          {mod.requiresLicense && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1" style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#d97706' }}>
                              <Icon name="KeyIcon" size={10} />
                              {tr.licenseRequired}
                            </span>
                          )}
                        </div>
                        <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>{mod.description}</p>

                        {/* Status selector */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {(['available', 'restricted', 'unavailable', 'coming_soon'] as ModuleStatus[]).map(s => {
                            const sCfg = STATUS_CONFIG[s];
                            const isActive = rule.status === s;
                            return (
                              <button
                                key={s}
                                onClick={() => updateStatus(mod.id, s)}
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                                style={{
                                  backgroundColor: isActive ? sCfg.bg : 'transparent',
                                  color: isActive ? sCfg.color : 'var(--muted-foreground)',
                                  border: `1px solid ${isActive ? sCfg.color + '40' : 'var(--border)'}`,
                                }}
                              >
                                <Icon name={sCfg.icon as any} size={11} />
                                {sCfg.label}
                              </button>
                            );
                          })}
                        </div>

                        {/* Regulatory note */}
                        {(rule.status === 'restricted' || rule.regulatoryNote) && (
                          <div className="mt-2">
                            {isEditing ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={editNote}
                                  onChange={e => setEditNote(e.target.value)}
                                  placeholder="Note réglementaire..."
                                  className="flex-1 px-2 py-1 text-xs rounded border bg-transparent"
                                  style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                                />
                                <button
                                  onClick={() => { updateNote(mod.id, editNote); setEditingModule(null); }}
                                  className="text-xs px-2 py-1 rounded"
                                  style={{ backgroundColor: 'var(--shifa-blue)', color: 'white' }}
                                >
                                  {tr.save}
                                </button>
                                <button onClick={() => setEditingModule(null)} className="text-xs px-2 py-1 rounded hover:bg-muted" style={{ color: 'var(--muted-foreground)' }}>
                                  {tr.cancel}
                                </button>
                              </div>
                            ) : (
                              <div
                                className="flex items-start gap-1.5 px-2.5 py-1.5 rounded-lg cursor-pointer hover:opacity-80"
                                style={{ backgroundColor: 'rgba(217,119,6,0.06)', borderLeft: '2px solid #d97706' }}
                                onClick={() => { setEditingModule(mod.id); setEditNote(rule.regulatoryNote || defaultNote); }}
                              >
                                <Icon name="InformationCircleIcon" size={13} style={{ color: '#d97706', marginTop: '1px' } as any} className="shrink-0" />
                                <span className="text-xs" style={{ color: '#d97706' }}>
                                  {rule.regulatoryNote || defaultNote || 'Cliquer pour ajouter une note réglementaire...'}
                                </span>
                                <Icon name="PencilIcon" size={11} style={{ color: '#d97706', marginTop: '1px', marginLeft: 'auto' } as any} className="shrink-0" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Status badge */}
                      <div className="shrink-0">
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}>
                          <Icon name={statusCfg.icon as any} size={12} />
                          {statusCfg.label}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Matrix View */
            <div className="card-base overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th className="px-3 py-2.5 text-left font-semibold" style={{ color: 'var(--muted-foreground)', minWidth: '180px' }}>Module</th>
                    {COUNTRIES.slice(0, 8).map(c => (
                      <th key={c.code} className="px-2 py-2.5 text-center font-semibold" style={{ color: 'var(--muted-foreground)', minWidth: '70px' }}>
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-base">{c.flag}</span>
                          <span style={{ fontSize: '10px' }}>{c.code}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredModules.map((mod, idx) => {
                    const catCfg = CATEGORY_CONFIG[mod.category];
                    return (
                      <tr key={mod.id} style={{ borderBottom: '1px solid var(--border)', backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.01)' }}>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <Icon name={mod.icon as any} size={13} style={{ color: catCfg.color } as any} />
                            <span style={{ color: 'var(--foreground)' }}>{mod.nameFr}</span>
                          </div>
                        </td>
                        {COUNTRIES.slice(0, 8).map(c => {
                          const rule = getRule(c.code, mod.id);
                          const sCfg = STATUS_CONFIG[rule.status];
                          return (
                            <td key={c.code} className="px-2 py-2 text-center">
                              <button
                                onClick={() => {
                                  setSelectedCountry(c.code);
                                  const statuses: ModuleStatus[] = ['available', 'restricted', 'unavailable', 'coming_soon'];
                                  const currentIdx = statuses.indexOf(rule.status);
                                  const nextStatus = statuses[(currentIdx + 1) % statuses.length];
                                  setRules(prev => ({
                                    ...prev,
                                    [c.code]: { ...prev[c.code], [mod.id]: { ...rule, status: nextStatus } },
                                  }));
                                }}
                                className="w-6 h-6 rounded-full flex items-center justify-center mx-auto transition-transform hover:scale-110"
                                style={{ backgroundColor: sCfg.bg }}
                                title={`${c.name}: ${sCfg.label}`}
                              >
                                <Icon name={sCfg.icon as any} size={12} style={{ color: sCfg.color } as any} />
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="px-3 py-2 border-t flex items-center gap-4 flex-wrap" style={{ borderColor: 'var(--border)' }}>
                {(['available', 'restricted', 'unavailable', 'coming_soon'] as ModuleStatus[]).map(s => {
                  const cfg = STATUS_CONFIG[s];
                  return (
                    <div key={s} className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cfg.color }} />
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{cfg.label}</span>
                    </div>
                  );
                })}
                <span className="text-xs ml-auto" style={{ color: 'var(--muted-foreground)' }}>Cliquer sur un indicateur pour changer le statut</span>
              </div>
            </div>
          )}

          {filteredModules.length === 0 && (
            <div className="card-base p-12 text-center">
              <Icon name="MagnifyingGlassIcon" size={32} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{tr.noResults}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Essayez un autre terme de recherche ou catégorie</p>
            </div>
          )}
        </div>
      </div>

      {/* Save banner */}
      {!isSaved && country && (
        <div
          className="fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border z-40"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--shifa-blue)' }}
        >
          <Icon name="ExclamationCircleIcon" size={18} style={{ color: 'var(--shifa-blue)' } as any} />
          <span className="text-sm" style={{ color: 'var(--foreground)' }}>
            Modifications non sauvegardées pour <strong>{country.name}</strong>
          </span>
          <button onClick={saveConfig} className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5">
            <Icon name="CloudArrowUpIcon" size={13} />
            {tr.saveConfig}
          </button>
        </div>
      )}
    </div>
  );
}
