'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

type FilterStatus = 'all' | 'active' | 'beta' | 'coming_soon';
type FilterCategory = 'all' | 'clinical' | 'admin' | 'institutional' | 'ai' | 'patient' | 'integration';

interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: FilterCategory;
  status: 'active' | 'beta' | 'coming_soon';
  href?: string;
  users?: number;
  version?: string;
  lastUpdated?: string;
  features: string[];
  color: string;
}

const modules: Module[] = [
  { id: 'M01', name: 'Espace Patient', description: 'Portail patient complet avec dossier santé, rendez-vous, ordonnances et suivi', icon: 'UserIcon', category: 'patient', status: 'active', href: '/patient-home', users: 12400, version: '2.4.1', lastUpdated: '2026-08-01', features: ['Dossier santé', 'Rendez-vous', 'Ordonnances', 'Téléconsultation'], color: '#dbeafe' },
  { id: 'M02', name: 'Workspace Professionnel', description: 'Tableau de bord clinique pour médecins avec agenda, consultations et prescriptions', icon: 'BriefcaseIcon', category: 'clinical', status: 'active', href: '/workspace-professionnel', users: 847, version: '3.1.0', lastUpdated: '2026-08-05', features: ['Agenda', 'Consultations', 'Prescriptions', 'Suivi patients'], color: '#dcfce7' },
  { id: 'M03', name: 'Téléconsultation', description: 'Plateforme de consultation vidéo sécurisée avec salle d\'attente et session en direct', icon: 'VideoCameraIcon', category: 'clinical', status: 'active', href: '/teleconsultation-lobby', users: 3200, version: '2.8.3', lastUpdated: '2026-08-08', features: ['Vidéo HD', 'Salle d\'attente', 'Ordonnances', 'Historique'], color: '#f3e8ff' },
  { id: 'M04', name: 'Administration Établissement', description: 'Gestion complète de l\'établissement : utilisateurs, modules, audit et configuration', icon: 'BuildingOffice2Icon', category: 'admin', status: 'active', href: '/administration-tablissement', users: 42, version: '2.2.0', lastUpdated: '2026-07-28', features: ['Utilisateurs', 'Modules', 'Audit', 'Rôles'], color: '#fef9c3' },
  { id: 'M05', name: 'Hôpital & Admissions', description: 'Gestion hospitalière avec admissions, triage, lits et planification des sorties', icon: 'BuildingOffice2Icon', category: 'admin', status: 'active', href: '/hopital-admissions', users: 156, version: '1.9.2', lastUpdated: '2026-08-03', features: ['Admissions', 'Triage P1-P4', 'Lits', 'Sorties'], color: '#fee2e2' },
  { id: 'M06', name: 'Facturation & Paiements', description: 'Facturation multi-entités, remboursements, réclamations assurance et abonnements', icon: 'BanknotesIcon', category: 'admin', status: 'active', href: '/billing-dashboard', users: 89, version: '2.5.1', lastUpdated: '2026-08-07', features: ['Factures', 'Paiements', 'Assurance', 'Abonnements'], color: '#d1fae5' },
  { id: 'M07', name: 'Inventaire & Approvisionnement', description: 'Gestion des stocks, lots, péremption, fournisseurs et bons de commande', icon: 'ArchiveBoxIcon', category: 'admin', status: 'active', href: '/inventory-procurement', users: 34, version: '1.2.0', lastUpdated: '2026-08-10', features: ['Stock', 'Lots', 'Fournisseurs', 'Commandes'], color: '#fef3c7' },
  { id: 'M08', name: 'Finance Dashboard', description: 'Tableau de bord financier avec revenus, dépenses, trésorerie et rapports', icon: 'ChartBarIcon', category: 'admin', status: 'active', href: '/finance-dashboard', users: 18, version: '1.0.0', lastUpdated: '2026-08-10', features: ['Revenus', 'Dépenses', 'Trésorerie', 'Rapports'], color: '#e0e7ff' },
  { id: 'M09', name: 'Vérification Professionnels', description: 'Workspace de validation des diplômes, licences et accréditations médicales', icon: 'ShieldCheckIcon', category: 'admin', status: 'active', href: '/pro-verification', users: 8, version: '1.1.0', lastUpdated: '2026-08-10', features: ['Documents', 'Validation', 'Score', 'Historique'], color: '#f0fdf4' },
  { id: 'M10', name: 'Adressages & Références', description: 'Gestion des adressages patients entre professionnels et réseau de spécialistes', icon: 'ArrowsRightLeftIcon', category: 'clinical', status: 'active', href: '/referrals-interface', users: 412, version: '1.0.0', lastUpdated: '2026-08-10', features: ['Adressages sortants', 'Adressages reçus', 'Réseau', 'Historique'], color: '#fce7f3' },
  { id: 'M11', name: 'Certificats Médicaux', description: 'Générateur de certificats médicaux avec modèles, aperçu PDF et archivage', icon: 'DocumentTextIcon', category: 'clinical', status: 'active', href: '/medical-certificates', users: 623, version: '1.0.0', lastUpdated: '2026-08-10', features: ['Modèles', 'Générateur', 'PDF', 'Archivage'], color: '#ecfdf5' },
  { id: 'M12', name: 'SHIFA AI Workspace', description: 'Outils d\'intelligence artificielle médicale : diagnostic, imagerie, synthèse clinique', icon: 'CpuChipIcon', category: 'ai', status: 'active', href: '/shifa-ai-workspace', users: 289, version: '1.5.0', lastUpdated: '2026-08-06', features: ['Diagnostic IA', 'Imagerie', 'Synthèse', 'Historique'], color: '#ede9fe' },
  { id: 'M13', name: 'Surveillance Épidémio.', description: 'Suivi des maladies, vaccination, campagnes santé et données géographiques', icon: 'EyeIcon', category: 'institutional', status: 'active', href: '/epidemio-surveillance', users: 67, version: '1.3.0', lastUpdated: '2026-07-30', features: ['Maladies', 'Vaccination', 'Campagnes', 'Carte'], color: '#fef9c3' },
  { id: 'M14', name: 'Espace Assureur', description: 'Éligibilité membres, polices, sinistres, pré-autorisations et réseau prestataires', icon: 'IdentificationIcon', category: 'institutional', status: 'active', href: '/assurance-workspace', users: 124, version: '1.4.0', lastUpdated: '2026-08-02', features: ['Éligibilité', 'Sinistres', 'Pré-auth.', 'Réseau'], color: '#dbeafe' },
  { id: 'M15', name: 'Hub Communautaire', description: 'Partenariats ONG, marketplace santé, services et financement collaboratif', icon: 'GlobeAltIcon', category: 'institutional', status: 'active', href: '/community-hub', users: 1840, version: '1.1.0', lastUpdated: '2026-08-09', features: ['ONG', 'Marketplace', 'Services', 'Financement'], color: '#dcfce7' },
  { id: 'M16', name: 'Interopérabilité HL7/FHIR', description: 'Hub d\'intégration FHIR, HL7, DICOM avec APIs, webhooks et journaux', icon: 'ArrowsRightLeftIcon', category: 'integration', status: 'active', href: '/interoperability-hub', users: 23, version: '1.0.0', lastUpdated: '2026-08-04', features: ['FHIR', 'HL7', 'APIs', 'Webhooks'], color: '#f1f5f9' },
  { id: 'M17', name: 'Qualité & Accréditation', description: 'Indicateurs qualité, procédures, non-conformités, CAPA et audits', icon: 'ClipboardDocumentCheckIcon', category: 'admin', status: 'active', href: '/quality-accreditation', users: 31, version: '1.0.0', lastUpdated: '2026-08-04', features: ['Indicateurs', 'Procédures', 'NC', 'Audits'], color: '#fef3c7' },
  { id: 'M18', name: 'Équipements Biomédicaux', description: 'Suivi des équipements, maintenance, interventions, contrats et alertes', icon: 'WrenchScrewdriverIcon', category: 'admin', status: 'active', href: '/biomedical-equipment', users: 19, version: '1.0.0', lastUpdated: '2026-08-04', features: ['Équipements', 'Maintenance', 'Contrats', 'Alertes'], color: '#fee2e2' },
  { id: 'M19', name: 'SHIFA Academy', description: 'Formation médicale continue avec cours, certifications et webinaires', icon: 'AcademicCapIcon', category: 'clinical', status: 'active', href: '/shifa-academy', users: 2100, version: '1.2.0', lastUpdated: '2026-08-06', features: ['Cours', 'Certifications', 'Webinaires', 'Communauté'], color: '#ede9fe' },
  { id: 'M20', name: 'Supervision Nationale', description: 'Registre établissements, annuaire professionnels, programmes nationaux et exports', icon: 'BuildingLibraryIcon', category: 'institutional', status: 'active', href: '/ministere-oversight', users: 45, version: '1.1.0', lastUpdated: '2026-07-25', features: ['Registre', 'Annuaire', 'Programmes', 'Exports'], color: '#f0fdf4' },
  { id: 'M21', name: 'Portefeuilles Numériques', description: 'Intégration Google Wallet, Apple Wallet, Orange Money et Wave', icon: 'CreditCardIcon', category: 'patient', status: 'beta', href: '/wallet-interface', users: 340, version: '0.9.0', lastUpdated: '2026-08-05', features: ['Google Wallet', 'Apple Wallet', 'Mobile Money', 'Transactions'], color: '#dbeafe' },
  { id: 'M22', name: 'Carte SHIFA Avancée', description: 'Gestion avancée de la carte SHIFA numérique et physique avec QR et activation', icon: 'IdentificationIcon', category: 'patient', status: 'beta', href: '/shifa-card-management', users: 890, version: '0.8.0', lastUpdated: '2026-08-05', features: ['Carte numérique', 'Carte physique', 'QR Code', 'Activation'], color: '#f3e8ff' },
  { id: 'M23', name: 'Marketplace Santé', description: 'Catalogue produits médicaux, équipements, médicaments et services', icon: 'ShoppingBagIcon', category: 'patient', status: 'active', href: '/health-marketplace', users: 1560, version: '1.0.0', lastUpdated: '2026-08-06', features: ['Produits', 'Équipements', 'Médicaments', 'Services'], color: '#fef9c3' },
  { id: 'M24', name: 'Notifications Center', description: 'Centre de notifications multi-canal avec préférences et historique', icon: 'BellIcon', category: 'admin', status: 'active', href: '/notifications-center', users: 14200, version: '1.0.0', lastUpdated: '2026-08-06', features: ['Multi-canal', 'Préférences', 'Historique', 'Filtres'], color: '#fce7f3' },
];

const categoryConfig: Record<FilterCategory, { label: string; color: string }> = {
  all: { label: 'Tous', color: 'var(--shifa-blue)' },
  clinical: { label: 'Clinique', color: '#16a34a' },
  admin: { label: 'Administration', color: '#7c3aed' },
  institutional: { label: 'Institutionnel', color: '#0891b2' },
  ai: { label: 'IA Médicale', color: '#f59e0b' },
  patient: { label: 'Patient', color: '#ec4899' },
  integration: { label: 'Intégration', color: '#64748b' },
};

const statusConfig = {
  active: { label: 'Actif', bg: '#dcfce7', text: '#16a34a' },
  beta: { label: 'Bêta', bg: '#fef9c3', text: '#ca8a04' },
  coming_soon: { label: 'Bientôt', bg: '#f1f5f9', text: '#64748b' },
};

export default function ModuleCatalogContent() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [search, setSearch] = useState('');
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const filtered = modules.filter(m => {
    const matchStatus = filterStatus === 'all' || m.status === filterStatus;
    const matchCategory = filterCategory === 'all' || m.category === filterCategory;
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.description.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchCategory && matchSearch;
  });

  const activeCount = modules.filter(m => m.status === 'active').length;
  const betaCount = modules.filter(m => m.status === 'beta').length;
  const totalUsers = modules.reduce((a, m) => a + (m.users || 0), 0);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>
              Catalogue des Modules SHIFA
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
              Tous les modules de la plateforme avec statut d'activation et accès direct
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-lg font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>{activeCount}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>modules actifs</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>{(totalUsers / 1000).toFixed(0)}K</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>utilisateurs</p>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="flex items-center gap-4 mb-4">
          {[
            { label: 'Modules actifs', value: activeCount, color: '#16a34a', bg: '#dcfce7' },
            { label: 'En bêta', value: betaCount, color: '#ca8a04', bg: '#fef9c3' },
            { label: 'Total modules', value: modules.length, color: 'var(--shifa-blue)', bg: '#dbeafe' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: s.bg }}>
              <span className="text-sm font-bold" style={{ color: s.color }}>{s.value}</span>
              <span className="text-xs" style={{ color: s.color }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Icon name="MagnifyingGlassIcon" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher module..."
              className="pl-8 pr-4 py-1.5 rounded-lg border text-sm w-48"
              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            />
          </div>
          <div className="flex gap-1">
            {(['all', 'active', 'beta', 'coming_soon'] as FilterStatus[]).map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterStatus === s ? 'text-white' : 'hover:bg-muted'}`}
                style={filterStatus === s ? { backgroundColor: 'var(--shifa-blue)' } : { color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}
              >
                {s === 'all' ? 'Tous' : statusConfig[s as keyof typeof statusConfig]?.label || s}
              </button>
            ))}
          </div>
          <div className="flex gap-1 flex-wrap">
            {(Object.keys(categoryConfig) as FilterCategory[]).map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${filterCategory === cat ? 'text-white' : 'hover:bg-muted border'}`}
                style={filterCategory === cat ? { backgroundColor: categoryConfig[cat].color } : { color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}
              >
                {categoryConfig[cat].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Grid */}
        <div className={`${selectedModule ? 'w-3/5' : 'w-full'} overflow-y-auto p-6 transition-all`}>
          <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>{filtered.length} module{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(mod => {
              const scfg = statusConfig[mod.status];
              const catcfg = categoryConfig[mod.category];
              return (
                <div
                  key={mod.id}
                  onClick={() => setSelectedModule(selectedModule?.id === mod.id ? null : mod)}
                  className={`rounded-xl border p-5 cursor-pointer transition-all hover:shadow-sm ${selectedModule?.id === mod.id ? 'ring-2' : ''}`}
                  style={{ backgroundColor: 'var(--card)', borderColor: selectedModule?.id === mod.id ? 'var(--shifa-blue)' : 'var(--border)' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: mod.color }}>
                      <Icon name={mod.icon as any} size={20} style={{ color: 'var(--foreground)' }} />
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: scfg.bg, color: scfg.text }}>{scfg.label}</span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--foreground)' }}>{mod.name}</h3>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--muted-foreground)' }}>{mod.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {mod.features.slice(0, 3).map((f, i) => (
                      <span key={i} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{f}</span>
                    ))}
                    {mod.features.length > 3 && <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>+{mod.features.length - 3}</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: catcfg.color + '20', color: catcfg.color }}>{catcfg.label}</span>
                      {mod.users && <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{mod.users >= 1000 ? `${(mod.users/1000).toFixed(1)}K` : mod.users} utilisateurs</span>}
                    </div>
                    {mod.href && mod.status === 'active' && (
                      <Link href={mod.href} onClick={e => e.stopPropagation()} className="flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--shifa-blue)' }}>
                        Ouvrir <Icon name="ArrowTopRightOnSquareIcon" size={12} />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        {selectedModule && (
          <div className="w-2/5 border-l overflow-y-auto p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>Détails du module</h2>
              <button onClick={() => setSelectedModule(null)} className="p-1.5 rounded-lg hover:bg-muted">
                <Icon name="XMarkIcon" size={18} className="text-muted-foreground" />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: selectedModule.color }}>
                <Icon name={selectedModule.icon as any} size={28} style={{ color: 'var(--foreground)' }} />
              </div>
              <div>
                <h3 className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>{selectedModule.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: statusConfig[selectedModule.status].bg, color: statusConfig[selectedModule.status].text }}>
                    {statusConfig[selectedModule.status].label}
                  </span>
                  {selectedModule.version && <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>v{selectedModule.version}</span>}
                </div>
              </div>
            </div>

            <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--muted-foreground)' }}>{selectedModule.description}</p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: 'Catégorie', value: categoryConfig[selectedModule.category].label },
                { label: 'Utilisateurs actifs', value: selectedModule.users ? `${selectedModule.users >= 1000 ? `${(selectedModule.users/1000).toFixed(1)}K` : selectedModule.users}` : 'N/A' },
                { label: 'Dernière MAJ', value: selectedModule.lastUpdated || 'N/A' },
                { label: 'Version', value: selectedModule.version ? `v${selectedModule.version}` : 'N/A' },
              ].map((info, i) => (
                <div key={i} className="rounded-lg p-3 border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{info.label}</p>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--foreground)' }}>{info.value}</p>
                </div>
              ))}
            </div>

            <div className="mb-5">
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Fonctionnalités incluses</h4>
              <div className="space-y-2">
                {selectedModule.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Icon name="CheckCircleIcon" size={15} style={{ color: '#16a34a' }} />
                    <span className="text-sm" style={{ color: 'var(--foreground)' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              {selectedModule.href && selectedModule.status === 'active' ? (
                <Link href={selectedModule.href} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                  <Icon name="ArrowTopRightOnSquareIcon" size={15} />
                  Ouvrir le module
                </Link>
              ) : (
                <button disabled className="flex-1 py-2.5 rounded-lg text-sm font-medium" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                  {selectedModule.status === 'coming_soon' ? 'Bientôt disponible' : 'Accéder au module'}
                </button>
              )}
              <button className="px-4 py-2.5 rounded-lg border text-sm font-medium hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                <Icon name="Cog6ToothIcon" size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
