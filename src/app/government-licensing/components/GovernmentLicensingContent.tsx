'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

// ============================================================
// Country list — African countries first, then rest of world
// ============================================================
const AFRICAN_COUNTRIES = [
  { code: 'DZ', name: 'Algérie', flag: '🇩🇿' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴' },
  { code: 'BJ', name: 'Bénin', flag: '🇧🇯' },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮' },
  { code: 'CV', name: 'Cap-Vert', flag: '🇨🇻' },
  { code: 'CM', name: 'Cameroun', flag: '🇨🇲' },
  { code: 'CF', name: 'Centrafrique', flag: '🇨🇫' },
  { code: 'KM', name: 'Comores', flag: '🇰🇲' },
  { code: 'CG', name: 'Congo', flag: '🇨🇬' },
  { code: 'CD', name: 'Congo (RDC)', flag: '🇨🇩' },
  { code: 'CI', name: "Côte d\'Ivoire", flag: '🇨🇮' },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯' },
  { code: 'EG', name: 'Égypte', flag: '🇪🇬' },
  { code: 'ER', name: 'Érythrée', flag: '🇪🇷' },
  { code: 'ET', name: 'Éthiopie', flag: '🇪🇹' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦' },
  { code: 'GM', name: 'Gambie', flag: '🇬🇲' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'GN', name: 'Guinée', flag: '🇬🇳' },
  { code: 'GW', name: 'Guinée-Bissau', flag: '🇬🇼' },
  { code: 'GQ', name: 'Guinée équatoriale', flag: '🇬🇶' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'LS', name: 'Lesotho', flag: '🇱🇸' },
  { code: 'LR', name: 'Liberia', flag: '🇱🇷' },
  { code: 'LY', name: 'Libye', flag: '🇱🇾' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬' },
  { code: 'MW', name: 'Malawi', flag: '🇲🇼' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱' },
  { code: 'MR', name: 'Mauritanie', flag: '🇲🇷' },
  { code: 'MU', name: 'Maurice', flag: '🇲🇺' },
  { code: 'MA', name: 'Maroc', flag: '🇲🇦' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿' },
  { code: 'NA', name: 'Namibie', flag: '🇳🇦' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'ST', name: 'São Tomé-et-Príncipe', flag: '🇸🇹' },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨' },
  { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱' },
  { code: 'SO', name: 'Somalie', flag: '🇸🇴' },
  { code: 'ZA', name: 'Afrique du Sud', flag: '🇿🇦' },
  { code: 'SS', name: 'Soudan du Sud', flag: '🇸🇸' },
  { code: 'SD', name: 'Soudan', flag: '🇸🇩' },
  { code: 'SZ', name: 'Eswatini', flag: '🇸🇿' },
  { code: 'TZ', name: 'Tanzanie', flag: '🇹🇿' },
  { code: 'TD', name: 'Tchad', flag: '🇹🇩' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬' },
  { code: 'TN', name: 'Tunisie', flag: '🇹🇳' },
  { code: 'UG', name: 'Ouganda', flag: '🇺🇬' },
  { code: 'ZM', name: 'Zambie', flag: '🇿🇲' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼' },
];

const WORLD_COUNTRIES = [
  { code: 'AF', name: 'Afghanistan', flag: '🇦🇫' },
  { code: 'AL', name: 'Albanie', flag: '🇦🇱' },
  { code: 'DE', name: 'Allemagne', flag: '🇩🇪' },
  { code: 'SA', name: 'Arabie Saoudite', flag: '🇸🇦' },
  { code: 'AR', name: 'Argentine', flag: '🇦🇷' },
  { code: 'AU', name: 'Australie', flag: '🇦🇺' },
  { code: 'AT', name: 'Autriche', flag: '🇦🇹' },
  { code: 'BE', name: 'Belgique', flag: '🇧🇪' },
  { code: 'BR', name: 'Brésil', flag: '🇧🇷' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'CL', name: 'Chili', flag: '🇨🇱' },
  { code: 'CN', name: 'Chine', flag: '🇨🇳' },
  { code: 'CO', name: 'Colombie', flag: '🇨🇴' },
  { code: 'KR', name: 'Corée du Sud', flag: '🇰🇷' },
  { code: 'HR', name: 'Croatie', flag: '🇭🇷' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺' },
  { code: 'DK', name: 'Danemark', flag: '🇩🇰' },
  { code: 'AE', name: 'Émirats arabes unis', flag: '🇦🇪' },
  { code: 'ES', name: 'Espagne', flag: '🇪🇸' },
  { code: 'US', name: 'États-Unis', flag: '🇺🇸' },
  { code: 'FI', name: 'Finlande', flag: '🇫🇮' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'GR', name: 'Grèce', flag: '🇬🇷' },
  { code: 'HT', name: 'Haïti', flag: '🇭🇹' },
  { code: 'IN', name: 'Inde', flag: '🇮🇳' },
  { code: 'ID', name: 'Indonésie', flag: '🇮🇩' },
  { code: 'IQ', name: 'Irak', flag: '🇮🇶' },
  { code: 'IR', name: 'Iran', flag: '🇮🇷' },
  { code: 'IE', name: 'Irlande', flag: '🇮🇪' },
  { code: 'IL', name: 'Israël', flag: '🇮🇱' },
  { code: 'IT', name: 'Italie', flag: '🇮🇹' },
  { code: 'JP', name: 'Japon', flag: '🇯🇵' },
  { code: 'JO', name: 'Jordanie', flag: '🇯🇴' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿' },
  { code: 'KW', name: 'Koweït', flag: '🇰🇼' },
  { code: 'LB', name: 'Liban', flag: '🇱🇧' },
  { code: 'MX', name: 'Mexique', flag: '🇲🇽' },
  { code: 'NO', name: 'Norvège', flag: '🇳🇴' },
  { code: 'NZ', name: 'Nouvelle-Zélande', flag: '🇳🇿' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'NL', name: 'Pays-Bas', flag: '🇳🇱' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'PL', name: 'Pologne', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦' },
  { code: 'RO', name: 'Roumanie', flag: '🇷🇴' },
  { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧' },
  { code: 'RU', name: 'Russie', flag: '🇷🇺' },
  { code: 'SE', name: 'Suède', flag: '🇸🇪' },
  { code: 'CH', name: 'Suisse', flag: '🇨🇭' },
  { code: 'SY', name: 'Syrie', flag: '🇸🇾' },
  { code: 'TH', name: 'Thaïlande', flag: '🇹🇭' },
  { code: 'TR', name: 'Turquie', flag: '🇹🇷' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'YE', name: 'Yémen', flag: '🇾🇪' },
];

const ALL_COUNTRIES = [...AFRICAN_COUNTRIES, ...WORLD_COUNTRIES];

// ============================================================
// License types
// ============================================================
const LICENSE_TYPES = [
  {
    id: 'national',
    icon: 'BuildingLibraryIcon',
    title: 'Licence Nationale Gouvernement',
    subtitle: 'Pour les gouvernements nationaux',
    color: 'var(--shifa-blue)',
    bg: 'rgba(0,102,255,0.08)',
    description: 'Un gouvernement souscrit une licence nationale SHIFA. Il peut ensuite accorder ou révoquer l\'accès aux établissements de santé, cliniques, hôpitaux et entreprises de son pays. L\'accès direct des entités locales sans passer par le gouvernement est bloqué.',
    features: [
      'Accès centralisé pour tout le pays',
      'Gestion des sous-licences pour les établissements locaux',
      'Tableau de bord de supervision nationale',
      'Données agrégées de santé publique',
      'API gouvernementale sécurisée',
      'Support dédié 24/7',
    ],
    pricing: 'Sur devis — selon population et modules',
    badge: 'Gouvernement',
  },
  {
    id: 'ngo',
    icon: 'GlobeAltIcon',
    title: 'Licence ONG / Organisation Internationale',
    subtitle: 'Pour OMS, UNICEF, MSF, UNFPA...',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
    description: 'Une organisation internationale (OMS, UNICEF, MSF, etc.) obtient une licence multi-pays. Elle peut déployer SHIFA dans les pays partenaires, gérer les accès des équipes terrain, et accéder aux données épidémiologiques agrégées.',
    features: [
      'Déploiement multi-pays',
      'Gestion des équipes terrain',
      'Accès aux données épidémiologiques',
      'Modules humanitaires (camps, urgences)',
      'Intégration avec systèmes OMS/DHIS2',
      'Rapports standardisés OMS',
    ],
    pricing: 'Sur devis — selon périmètre d\'intervention',
    badge: 'ONG / OI',
  },
  {
    id: 'regional',
    icon: 'MapIcon',
    title: 'Licence Régionale / Union',
    subtitle: 'Pour CEDEAO, UA, SADC...',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    description: 'Une union régionale (CEDEAO, Union Africaine, SADC...) souscrit une licence couvrant plusieurs pays membres. Chaque État membre peut ensuite gérer ses propres sous-licences dans le cadre régional.',
    features: [
      'Couverture multi-États membres',
      'Harmonisation des données régionales',
      'Surveillance épidémiologique régionale',
      'Interopérabilité transfrontalière',
      'Gestion des transferts de patients',
      'Tableau de bord régional unifié',
    ],
    pricing: 'Sur devis — selon nombre d\'États membres',
    badge: 'Régional',
  },
];

// ============================================================
// Mock active licenses
// ============================================================
const mockLicenses = [
  { id: 'lic-001', type: 'national', country: 'Sénégal', flag: '🇸🇳', status: 'active', entities: 47, since: '2025-01-15', expires: '2026-01-15' },
  { id: 'lic-002', type: 'ngo', country: 'OMS — Afrique de l\'Ouest', flag: '🌍', status: 'active', entities: 12, since: '2025-03-01', expires: '2027-03-01' },
  { id: 'lic-003', type: 'national', country: 'Côte d\'Ivoire', flag: '🇨🇮', status: 'pending', entities: 0, since: '2026-07-01', expires: '2027-07-01' },
];

type LicenseTab = 'overview' | 'apply' | 'countries' | 'active';

export default function GovernmentLicensingContent() {
  const [activeTab, setActiveTab] = useState<LicenseTab>('overview');
  const [selectedLicenseType, setSelectedLicenseType] = useState('national');
  const [countrySearch, setCountrySearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [orgName, setOrgName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showAfricaOnly, setShowAfricaOnly] = useState(false);

  const filteredCountries = (showAfricaOnly ? AFRICAN_COUNTRIES : ALL_COUNTRIES).filter(c =>
    !countrySearch || c.name.toLowerCase().includes(countrySearch.toLowerCase()) || c.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 4000);
  };

  const licenseStatusConfig = {
    active: { label: 'Active', color: 'var(--shifa-cyan)', bg: 'rgba(0,242,195,0.1)' },
    pending: { label: 'En attente', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    expired: { label: 'Expirée', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  };

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
              <Icon name="BuildingLibraryIcon" size={16} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Licences Gouvernements & ONG</h1>
          </div>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Modèle d'accès institutionnel — gouvernements, organisations internationales et unions régionales
          </p>
        </div>
        <button
          onClick={() => setActiveTab('apply')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
        >
          <Icon name="DocumentPlusIcon" size={16} />
          Demander une licence
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-6 w-fit" style={{ backgroundColor: 'var(--muted)' }}>
        {[
          { key: 'overview', label: 'Modèle d\'accès', icon: 'InformationCircleIcon' },
          { key: 'active', label: 'Licences actives', icon: 'CheckBadgeIcon' },
          { key: 'countries', label: 'Pays', icon: 'GlobeAltIcon' },
          { key: 'apply', label: 'Demande', icon: 'DocumentPlusIcon' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as LicenseTab)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              backgroundColor: activeTab === tab.key ? 'var(--card)' : 'transparent',
              color: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
            }}
          >
            <Icon name={tab.icon as any} size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* How it works */}
          <div className="card-base p-6">
            <h2 className="font-bold text-lg mb-4" style={{ color: 'var(--shifa-dark)' }}>Comment fonctionne le modèle de licence institutionnelle ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { step: '1', title: 'Souscription institutionnelle', desc: 'Un gouvernement ou une ONG souscrit une licence SHIFA couvrant son périmètre (pays, région, mission).', icon: 'BuildingLibraryIcon', color: 'var(--shifa-blue)' },
                { step: '2', title: 'Gestion des sous-accès', desc: 'L\'institution accorde ou révoque l\'accès aux établissements, cliniques et entreprises de santé locaux via un tableau de bord dédié.', icon: 'KeyIcon', color: '#8b5cf6' },
                { step: '3', title: 'Accès direct bloqué', desc: 'Les entités locales ne peuvent pas s\'abonner directement à SHIFA si leur pays a une licence nationale active. Elles doivent passer par leur gouvernement.', icon: 'ShieldCheckIcon', color: '#f59e0b' },
              ].map(item => (
                <div key={item.step} className="flex flex-col gap-3 p-4 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ backgroundColor: item.color }}>
                      {item.step}
                    </div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{item.title}</p>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Access control diagram */}
            <div className="p-4 rounded-xl border" style={{ backgroundColor: 'rgba(0,102,255,0.03)', borderColor: 'rgba(0,102,255,0.15)' }}>
              <p className="text-xs font-semibold mb-3" style={{ color: 'var(--shifa-blue)' }}>SCHÉMA D'ACCÈS</p>
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-lg font-semibold text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>SHIFA Platform</span>
                  <Icon name="ArrowRightIcon" size={14} className="text-muted-foreground" />
                  <span className="px-2 py-1 rounded-lg font-semibold text-white" style={{ backgroundColor: '#8b5cf6' }}>Gouvernement / ONG (Licence)</span>
                  <Icon name="ArrowRightIcon" size={14} className="text-muted-foreground" />
                  <span className="px-2 py-1 rounded-lg font-semibold text-white" style={{ backgroundColor: 'var(--shifa-cyan)', color: 'var(--shifa-dark)' }}>Établissements locaux (Sous-licence)</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-1 rounded-lg border text-xs" style={{ borderColor: '#ef4444', color: '#ef4444' }}>Accès direct local</span>
                  <Icon name="XMarkIcon" size={14} style={{ color: '#ef4444' } as any} className="" />
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Bloqué si licence nationale active</span>
                </div>
              </div>
            </div>
          </div>

          {/* License types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LICENSE_TYPES.map(lt => (
              <div key={lt.id} className="card-base p-5 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: lt.bg }}>
                    <Icon name={lt.icon as any} size={20} style={{ color: lt.color } as any} className="" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{lt.title}</h3>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: lt.color, backgroundColor: lt.bg }}>{lt.badge}</span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{lt.subtitle}</p>
                  </div>
                </div>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{lt.description}</p>
                <ul className="flex flex-col gap-1.5">
                  {lt.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <Icon name="CheckCircleIcon" size={13} style={{ color: lt.color, flexShrink: 0 } as any} className="mt-0.5" />
                      <span style={{ color: 'var(--foreground)' }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-xs font-semibold" style={{ color: lt.color }}>{lt.pricing}</p>
                </div>
                <button
                  onClick={() => { setSelectedLicenseType(lt.id); setActiveTab('apply'); }}
                  className="w-full py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                  style={{ backgroundColor: lt.color, color: 'white' }}
                >
                  Demander cette licence
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ACTIVE LICENSES ── */}
      {activeTab === 'active' && (
        <div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Licences actives', value: mockLicenses.filter(l => l.status === 'active').length, icon: 'CheckBadgeIcon', color: 'var(--shifa-cyan)' },
              { label: 'En attente', value: mockLicenses.filter(l => l.status === 'pending').length, icon: 'ClockIcon', color: '#f59e0b' },
              { label: 'Entités couvertes', value: mockLicenses.reduce((s, l) => s + l.entities, 0), icon: 'BuildingOffice2Icon', color: 'var(--shifa-blue)' },
            ].map(stat => (
              <div key={stat.label} className="card-base p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${stat.color}18` }}>
                  <Icon name={stat.icon as any} size={20} style={{ color: stat.color } as any} className="" />
                </div>
                <div>
                  <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{stat.value}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {mockLicenses.map(lic => {
              const st = licenseStatusConfig[lic.status as keyof typeof licenseStatusConfig];
              const lt = LICENSE_TYPES.find(l => l.id === lic.type);
              return (
                <div key={lic.id} className="card-base p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: 'var(--muted)' }}>
                      {lic.flag}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <p className="font-bold" style={{ color: 'var(--foreground)' }}>{lic.country}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{lt?.title}</p>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0" style={{ color: st.color, backgroundColor: st.bg }}>
                          {st.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <Icon name="BuildingOffice2Icon" size={13} className="text-muted-foreground" />
                          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{lic.entities} entités couvertes</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Icon name="CalendarDaysIcon" size={13} className="text-muted-foreground" />
                          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Expire le {lic.expires}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {lic.status === 'active' && (
                    <div className="flex gap-2 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:shadow-sm" style={{ borderColor: 'var(--shifa-blue)', color: 'var(--shifa-blue)', backgroundColor: 'rgba(0,102,255,0.05)' }}>
                        <Icon name="UsersIcon" size={13} />
                        Gérer les entités
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:shadow-sm" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                        <Icon name="DocumentChartBarIcon" size={13} />
                        Rapport
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── COUNTRIES ── */}
      {activeTab === 'countries' && (
        <div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher un pays..."
                className="input-field pl-9 w-full"
                value={countrySearch}
                onChange={e => setCountrySearch(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowAfricaOnly(!showAfricaOnly)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all"
              style={{
                backgroundColor: showAfricaOnly ? 'var(--shifa-blue)' : 'var(--card)',
                borderColor: showAfricaOnly ? 'var(--shifa-blue)' : 'var(--border)',
                color: showAfricaOnly ? 'white' : 'var(--foreground)',
              }}
            >
              🌍 Afrique uniquement
            </button>
          </div>

          {!showAfricaOnly && (
            <div className="mb-4 p-3 rounded-xl flex items-center gap-2" style={{ backgroundColor: 'rgba(0,102,255,0.05)', border: '1px solid rgba(0,102,255,0.15)' }}>
              <Icon name="InformationCircleIcon" size={16} style={{ color: 'var(--shifa-blue)' } as any} className="" />
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                <strong style={{ color: 'var(--foreground)' }}>{AFRICAN_COUNTRIES.length} pays africains</strong> en priorité · {WORLD_COUNTRIES.length} autres pays disponibles
              </p>
            </div>
          )}

          {!showAfricaOnly && !countrySearch && (
            <p className="text-xs font-semibold mb-2 px-1" style={{ color: 'var(--shifa-blue)' }}>🌍 PAYS AFRICAINS ({AFRICAN_COUNTRIES.length})</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-4">
            {filteredCountries.slice(0, showAfricaOnly || countrySearch ? undefined : AFRICAN_COUNTRIES.length).map(country => (
              <button
                key={country.code}
                onClick={() => setSelectedCountry(country.code === selectedCountry ? '' : country.code)}
                className="flex items-center gap-2 p-2.5 rounded-xl border text-sm transition-all hover:shadow-sm"
                style={{
                  backgroundColor: selectedCountry === country.code ? 'rgba(0,102,255,0.08)' : 'var(--card)',
                  borderColor: selectedCountry === country.code ? 'var(--shifa-blue)' : 'var(--border)',
                  color: 'var(--foreground)',
                }}
              >
                <span className="text-lg shrink-0">{country.flag}</span>
                <span className="text-xs font-medium truncate">{country.name}</span>
              </button>
            ))}
          </div>

          {!showAfricaOnly && !countrySearch && (
            <>
              <p className="text-xs font-semibold mb-2 px-1 mt-4" style={{ color: 'var(--muted-foreground)' }}>RESTE DU MONDE ({WORLD_COUNTRIES.length})</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {WORLD_COUNTRIES.map(country => (
                  <button
                    key={country.code}
                    onClick={() => setSelectedCountry(country.code === selectedCountry ? '' : country.code)}
                    className="flex items-center gap-2 p-2.5 rounded-xl border text-sm transition-all hover:shadow-sm"
                    style={{
                      backgroundColor: selectedCountry === country.code ? 'rgba(0,102,255,0.08)' : 'var(--card)',
                      borderColor: selectedCountry === country.code ? 'var(--shifa-blue)' : 'var(--border)',
                      color: 'var(--foreground)',
                    }}
                  >
                    <span className="text-lg shrink-0">{country.flag}</span>
                    <span className="text-xs font-medium truncate">{country.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {selectedCountry && (
            <div className="mt-4 p-4 rounded-xl border" style={{ backgroundColor: 'rgba(0,102,255,0.04)', borderColor: 'rgba(0,102,255,0.2)' }}>
              {(() => {
                const c = ALL_COUNTRIES.find(x => x.code === selectedCountry);
                return c ? (
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{c.flag}</span>
                      <div>
                        <p className="font-bold" style={{ color: 'var(--foreground)' }}>{c.name}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Aucune licence active — accès direct disponible</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setSelectedLicenseType('national'); setActiveTab('apply'); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: 'var(--shifa-blue)' }}
                    >
                      <Icon name="DocumentPlusIcon" size={14} />
                      Demander une licence pour {c.name}
                    </button>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>
      )}

      {/* ── APPLY ── */}
      {activeTab === 'apply' && (
        <div className="max-w-2xl">
          <div className="card-base p-6">
            <h2 className="font-bold text-lg mb-1" style={{ color: 'var(--shifa-dark)' }}>Demande de licence institutionnelle</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>Remplissez ce formulaire pour initier une demande. Notre équipe vous contactera sous 48h.</p>

            {formSubmitted && (
              <div className="flex items-center gap-3 p-4 rounded-xl mb-5 border" style={{ backgroundColor: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.3)' }}>
                <Icon name="CheckCircleIcon" size={18} style={{ color: 'var(--shifa-green)' } as any} className="" />
                <p className="text-sm font-semibold" style={{ color: 'var(--shifa-green)' }}>Demande envoyée ! Notre équipe vous contactera sous 48h.</p>
              </div>
            )}

            <form onSubmit={handleApply} className="flex flex-col gap-5">
              {/* License type */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Type de licence</label>
                <div className="flex flex-col gap-2">
                  {LICENSE_TYPES.map(lt => (
                    <button
                      key={lt.id}
                      type="button"
                      onClick={() => setSelectedLicenseType(lt.id)}
                      className="flex items-center gap-3 p-3 rounded-xl border text-left transition-all"
                      style={{
                        backgroundColor: selectedLicenseType === lt.id ? lt.bg : 'var(--background)',
                        borderColor: selectedLicenseType === lt.id ? lt.color : 'var(--border)',
                      }}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: lt.bg }}>
                        <Icon name={lt.icon as any} size={16} style={{ color: lt.color } as any} className="" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{lt.title}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{lt.subtitle}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>
                  Pays / Région <span style={{ color: 'var(--shifa-red)' }}>*</span>
                </label>
                <select
                  className="input-field w-full"
                  value={selectedCountry}
                  onChange={e => setSelectedCountry(e.target.value)}
                  required
                >
                  <option value="">Sélectionner un pays...</option>
                  <optgroup label="🌍 Pays africains">
                    {AFRICAN_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                  </optgroup>
                  <optgroup label="🌐 Reste du monde">
                    {WORLD_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                  </optgroup>
                </select>
              </div>

              {/* Org name */}
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>
                  Nom de l'organisation <span style={{ color: 'var(--shifa-red)' }}>*</span>
                </label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="Ex: Ministère de la Santé du Sénégal, OMS Bureau Afrique..."
                  value={orgName}
                  onChange={e => setOrgName(e.target.value)}
                  required
                />
              </div>

              {/* Contact email */}
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>
                  Email de contact officiel <span style={{ color: 'var(--shifa-red)' }}>*</span>
                </label>
                <input
                  type="email"
                  className="input-field w-full"
                  placeholder="contact@ministere-sante.gov.sn"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
              >
                <Icon name="PaperAirplaneIcon" size={16} />
                Envoyer la demande
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
