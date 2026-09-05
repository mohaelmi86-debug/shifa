'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tab = 'offres' | 'stages' | 'candidatures' | 'profil' | 'recruteur';
type OffreType = 'emploi' | 'stage' | 'vacation' | 'bénévolat';

interface Offre {
  id: string;
  type: OffreType;
  titre: string;
  etablissement: string;
  ville: string;
  pays: string;
  specialite: string;
  contrat: string;
  salaire: string;
  dateDebut: string;
  duree?: string;
  description: string;
  competences: string[];
  color: string;
  bg: string;
  icon: string;
  publie: string;
  candidatures: number;
  urgent: boolean;
}

const offres: Offre[] = [
  {
    id: 'o1', type: 'emploi', titre: 'Médecin généraliste', etablissement: 'Clinique du Cap-Vert', ville: 'Dakar', pays: 'Sénégal',
    specialite: 'Médecine générale', contrat: 'CDI', salaire: '800 000 – 1 200 000 FCFA/mois',
    dateDebut: 'Immédiat', description: 'Nous recherchons un médecin généraliste pour rejoindre notre équipe de 12 praticiens. Vous assurerez des consultations ambulatoires, le suivi des patients chroniques et les gardes de nuit.',
    competences: ['Médecine générale', 'Urgences', 'Pédiatrie de base', 'Téléconsultation'],
    color: '#0ea5e9', bg: '#e0f2fe', icon: 'UserIcon', publie: 'Il y a 2 jours', candidatures: 14, urgent: true,
  },
  {
    id: 'o2', type: 'emploi', titre: 'Pharmacien hospitalier', etablissement: 'CHU de Bamako', ville: 'Bamako', pays: 'Mali',
    specialite: 'Pharmacie hospitalière', contrat: 'CDD 12 mois', salaire: '650 000 – 900 000 FCFA/mois',
    dateDebut: '01 Oct 2026', description: 'Le CHU de Bamako recrute un pharmacien hospitalier pour son service de pharmacie clinique. Missions : gestion des stocks, validation des prescriptions, pharmacovigilance.',
    competences: ['Pharmacie clinique', 'Gestion des stocks', 'Pharmacovigilance', 'Oncologie'],
    color: '#8b5cf6', bg: '#ede9fe', icon: 'BeakerIcon', publie: 'Il y a 5 jours', candidatures: 8, urgent: false,
  },
  {
    id: 'o3', type: 'emploi', titre: 'Chirurgien orthopédiste', etablissement: 'Hôpital Régional de Lomé', ville: 'Lomé', pays: 'Togo',
    specialite: 'Orthopédie', contrat: 'CDI', salaire: '1 500 000 – 2 500 000 FCFA/mois',
    dateDebut: '15 Oct 2026', description: 'Poste de chirurgien orthopédiste senior. Vous serez responsable du bloc opératoire orthopédique, de la consultation spécialisée et de la formation des internes.',
    competences: ['Chirurgie orthopédique', 'Traumatologie', 'Arthroplastie', 'Arthroscopie'],
    color: '#ef4444', bg: '#fee2e2', icon: 'WrenchScrewdriverIcon', publie: 'Il y a 1 semaine', candidatures: 5, urgent: false,
  },
  {
    id: 'o4', type: 'emploi', titre: 'Infirmier(e) en soins intensifs', etablissement: 'Polyclinique Internationale', ville: 'Abidjan', pays: 'Côte d\'Ivoire',
    specialite: 'Soins intensifs', contrat: 'CDI', salaire: '350 000 – 500 000 FCFA/mois',
    dateDebut: 'Immédiat', description: 'Recrutement d\'infirmiers diplômés d\'État pour le service de réanimation. Expérience en soins intensifs exigée. Travail en équipe pluridisciplinaire.',
    competences: ['Réanimation', 'Soins intensifs', 'Ventilation mécanique', 'Monitoring'],
    color: '#10b981', bg: '#d1fae5', icon: 'HeartIcon', publie: 'Il y a 3 jours', candidatures: 22, urgent: true,
  },
  {
    id: 'o5', type: 'vacation', titre: 'Médecin vacataire — Urgences', etablissement: 'Clinique Pasteur', ville: 'Ouagadougou', pays: 'Burkina Faso',
    specialite: 'Urgences', contrat: 'Vacation', salaire: '50 000 FCFA/garde',
    dateDebut: 'Flexible', description: 'Gardes de nuit et week-end aux urgences. Idéal pour médecins en activité libérale souhaitant compléter leur activité.',
    competences: ['Urgences', 'SMUR', 'Triage', 'Réanimation de base'],
    color: '#f59e0b', bg: '#fef3c7', icon: 'BoltIcon', publie: 'Il y a 1 jour', candidatures: 7, urgent: true,
  },
  {
    id: 'o6', type: 'emploi', titre: 'Sage-femme coordinatrice', etablissement: 'Maternité de Référence', ville: 'Conakry', pays: 'Guinée',
    specialite: 'Maternité', contrat: 'CDI', salaire: '400 000 – 600 000 FCFA/mois',
    dateDebut: '01 Nov 2026', description: 'Poste de sage-femme coordinatrice pour superviser une équipe de 8 sages-femmes. Gestion des accouchements, suivi prénatal et postnatal, formation du personnel.',
    competences: ['Obstétrique', 'Management', 'Suivi prénatal', 'Urgences obstétricales'],
    color: '#ec4899', bg: '#fce7f3', icon: 'StarIcon', publie: 'Il y a 4 jours', candidatures: 11, urgent: false,
  },
];

const stages: Offre[] = [
  {
    id: 's1', type: 'stage', titre: 'Stage en cardiologie interventionnelle', etablissement: 'Institut Cardiologique de Dakar', ville: 'Dakar', pays: 'Sénégal',
    specialite: 'Cardiologie', contrat: 'Stage', salaire: 'Indemnisé — 150 000 FCFA/mois',
    dateDebut: '01 Oct 2026', duree: '6 mois', description: 'Stage de formation en cardiologie interventionnelle pour internes ou résidents. Participation aux cathétérismes cardiaques, coronarographies et poses de stents.',
    competences: ['Cardiologie', 'Cathétérisme', 'ECG', 'Échocardiographie'],
    color: '#ef4444', bg: '#fee2e2', icon: 'HeartIcon', publie: 'Il y a 3 jours', candidatures: 6, urgent: false,
  },
  {
    id: 's2', type: 'stage', titre: 'Stage en santé publique et épidémiologie', etablissement: 'Direction Nationale de la Santé', ville: 'Bamako', pays: 'Mali',
    specialite: 'Santé publique', contrat: 'Stage', salaire: 'Non rémunéré',
    dateDebut: '15 Sep 2026', duree: '3 mois', description: 'Stage au sein de la direction de l\'épidémiologie. Participation aux enquêtes de terrain, analyse des données de surveillance épidémiologique, rédaction de rapports.',
    competences: ['Épidémiologie', 'Biostatistiques', 'Surveillance sanitaire', 'Rédaction scientifique'],
    color: '#0ea5e9', bg: '#e0f2fe', icon: 'ChartBarIcon', publie: 'Il y a 1 semaine', candidatures: 18, urgent: false,
  },
  {
    id: 's3', type: 'stage', titre: 'Stage en pharmacie clinique hospitalière', etablissement: 'CHU de Lomé', ville: 'Lomé', pays: 'Togo',
    specialite: 'Pharmacie', contrat: 'Stage', salaire: 'Indemnisé — 100 000 FCFA/mois',
    dateDebut: '01 Nov 2026', duree: '4 mois', description: 'Stage pour étudiants en 5ème ou 6ème année de pharmacie. Validation des ordonnances, conciliation médicamenteuse, participation aux staffs pluridisciplinaires.',
    competences: ['Pharmacie clinique', 'Conciliation médicamenteuse', 'Pharmacovigilance'],
    color: '#8b5cf6', bg: '#ede9fe', icon: 'BeakerIcon', publie: 'Il y a 2 jours', candidatures: 9, urgent: false,
  },
  {
    id: 's4', type: 'stage', titre: 'Stage en télémédecine et santé numérique', etablissement: 'SHIFA Health OS', ville: 'Dakar', pays: 'Sénégal',
    specialite: 'Santé numérique', contrat: 'Stage', salaire: 'Indemnisé — 200 000 FCFA/mois',
    dateDebut: 'Immédiat', duree: '6 mois', description: 'Stage au sein de l\'équipe produit SHIFA. Participation au déploiement de la plateforme, formation des utilisateurs, analyse des données de santé, amélioration des modules cliniques.',
    competences: ['Santé numérique', 'Télémédecine', 'Analyse de données', 'Formation'],
    color: '#10b981', bg: '#d1fae5', icon: 'ComputerDesktopIcon', publie: 'Il y a 1 jour', candidatures: 34, urgent: true,
  },
];

const candidatures = [
  { id: 'c1', offre: 'Médecin généraliste — Clinique du Cap-Vert', type: 'emploi', statut: 'en_attente', date: '10 Août 2026', color: '#f59e0b' },
  { id: 'c2', offre: 'Stage en télémédecine — SHIFA Health OS', type: 'stage', statut: 'entretien', date: '08 Août 2026', color: '#0ea5e9' },
  { id: 'c3', offre: 'Infirmier soins intensifs — Polyclinique Internationale', type: 'emploi', statut: 'refusé', date: '01 Août 2026', color: '#ef4444' },
];

const typeColors: Record<OffreType, { bg: string; text: string; label: string }> = {
  emploi: { bg: '#dbeafe', text: '#1d4ed8', label: 'Emploi' },
  stage: { bg: '#d1fae5', text: '#065f46', label: 'Stage' },
  vacation: { bg: '#fef3c7', text: '#92400e', label: 'Vacation' },
  bénévolat: { bg: '#ede9fe', text: '#5b21b6', label: 'Bénévolat' },
};

const statutColors: Record<string, { bg: string; text: string; label: string }> = {
  en_attente: { bg: '#fef3c7', text: '#92400e', label: 'En attente' },
  entretien: { bg: '#dbeafe', text: '#1d4ed8', label: 'Entretien planifié' },
  accepté: { bg: '#d1fae5', text: '#065f46', label: 'Accepté' },
  refusé: { bg: '#fee2e2', text: '#991b1b', label: 'Refusé' },
};

export default function ShifaEmploiStageContent() {
  const [activeTab, setActiveTab] = useState<Tab>('offres');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('Tous');
  const [specialiteFilter, setSpecialiteFilter] = useState('Toutes');
  const [selectedOffre, setSelectedOffre] = useState<Offre | null>(null);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [showApplyForm, setShowApplyForm] = useState(false);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'offres', label: 'Offres d\'emploi', icon: 'BriefcaseIcon' },
    { key: 'stages', label: 'Stages', icon: 'AcademicCapIcon' },
    { key: 'candidatures', label: 'Mes candidatures', icon: 'ClipboardDocumentListIcon' },
    { key: 'profil', label: 'Mon profil', icon: 'UserCircleIcon' },
    { key: 'recruteur', label: 'Espace recruteur', icon: 'BuildingOfficeIcon' },
  ];

  const allOffres = activeTab === 'stages' ? stages : offres;
  const specialites = ['Toutes', ...Array.from(new Set(allOffres.map(o => o.specialite)))];

  const filtered = allOffres.filter(o =>
    (typeFilter === 'Tous' || o.type === typeFilter) &&
    (specialiteFilter === 'Toutes' || o.specialite === specialiteFilter) &&
    (o.titre.toLowerCase().includes(search.toLowerCase()) ||
      o.etablissement.toLowerCase().includes(search.toLowerCase()) ||
      o.ville.toLowerCase().includes(search.toLowerCase()))
  );

  const handleApply = (offre: Offre) => {
    setSelectedOffre(offre);
    setShowApplyForm(true);
  };

  const submitApplication = () => {
    if (selectedOffre) {
      setAppliedIds(prev => [...prev, selectedOffre.id]);
      setShowApplyForm(false);
      setSelectedOffre(null);
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0ea5e9, #10b981)' }}>
            <Icon name="BriefcaseIcon" size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--foreground)', fontFamily: 'DM Sans, sans-serif' }}>SHIFA Emploi & Stages</h1>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Offres d'emploi · Stages cliniques · Vacations · Recrutement santé</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-4 text-xs" style={{ color: 'var(--muted-foreground)' }}>
            <span className="flex items-center gap-1"><Icon name="BriefcaseIcon" size={12} style={{ color: '#0ea5e9' }} />142 offres actives</span>
            <span className="flex items-center gap-1"><Icon name="AcademicCapIcon" size={12} style={{ color: '#10b981' }} />67 stages disponibles</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b px-6 overflow-x-auto" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex gap-0">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
              style={{ borderColor: activeTab === tab.key ? '#0ea5e9' : 'transparent', color: activeTab === tab.key ? '#0ea5e9' : 'var(--muted-foreground)' }}>
              <Icon name={tab.icon as any} size={15} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">

        {/* ── OFFRES D'EMPLOI ── */}
        {(activeTab === 'offres' || activeTab === 'stages') && (
          <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: activeTab === 'stages' ? 'Stages disponibles' : 'Offres actives', value: activeTab === 'stages' ? '67' : '142', icon: activeTab === 'stages' ? 'AcademicCapIcon' : 'BriefcaseIcon', color: '#0ea5e9' },
                { label: 'Établissements', value: '38', icon: 'BuildingOfficeIcon', color: '#8b5cf6' },
                { label: 'Pays couverts', value: '12', icon: 'GlobeAltIcon', color: '#10b981' },
                { label: 'Mes candidatures', value: String(appliedIds.length), icon: 'ClipboardDocumentListIcon', color: '#f59e0b' },
              ].map((k, i) => (
                <div key={i} className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: k.color + '20' }}>
                      <Icon name={k.icon as any} size={16} style={{ color: k.color }} />
                    </div>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{k.label}</span>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{k.value}</p>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher un poste, établissement, ville..."
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border outline-none"
                  style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              </div>
              <select
                value={specialiteFilter}
                onChange={e => setSpecialiteFilter(e.target.value)}
                className="px-3 py-2 text-sm rounded-xl border outline-none"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                {specialites.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Offre list */}
            <div className="space-y-4">
              {filtered.map(offre => (
                <div key={offre.id} className="rounded-2xl border overflow-hidden hover:shadow-md transition-shadow" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: offre.bg }}>
                          <Icon name={offre.icon as any} size={22} style={{ color: offre.color }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{offre.titre}</h3>
                            {offre.urgent && (
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>🔴 Urgent</span>
                            )}
                          </div>
                          <p className="text-xs font-medium" style={{ color: offre.color }}>{offre.etablissement}</p>
                          <div className="flex items-center gap-3 mt-1 flex-wrap text-xs" style={{ color: 'var(--muted-foreground)' }}>
                            <span className="flex items-center gap-1"><Icon name="MapPinIcon" size={11} />{offre.ville}, {offre.pays}</span>
                            <span className="flex items-center gap-1"><Icon name="ClockIcon" size={11} />{offre.publie}</span>
                            <span className="flex items-center gap-1"><Icon name="UsersIcon" size={11} />{offre.candidatures} candidatures</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: typeColors[offre.type]?.bg, color: typeColors[offre.type]?.text }}>
                          {typeColors[offre.type]?.label}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>{offre.contrat}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3 text-xs">
                      <div className="flex items-center gap-1.5" style={{ color: 'var(--muted-foreground)' }}>
                        <Icon name="BanknotesIcon" size={12} style={{ color: '#10b981' }} />
                        <span>{offre.salaire}</span>
                      </div>
                      <div className="flex items-center gap-1.5" style={{ color: 'var(--muted-foreground)' }}>
                        <Icon name="CalendarIcon" size={12} style={{ color: '#0ea5e9' }} />
                        <span>Début : {offre.dateDebut}</span>
                      </div>
                      {offre.duree && (
                        <div className="flex items-center gap-1.5" style={{ color: 'var(--muted-foreground)' }}>
                          <Icon name="ClockIcon" size={12} style={{ color: '#8b5cf6' }} />
                          <span>Durée : {offre.duree}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{offre.description}</p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {offre.competences.map(comp => (
                        <span key={comp} className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: offre.color + '40', color: offre.color, backgroundColor: offre.bg }}>
                          {comp}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      {appliedIds.includes(offre.id) ? (
                        <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
                          <Icon name="CheckIcon" size={13} /> Candidature envoyée
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApply(offre)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-white"
                          style={{ backgroundColor: offre.color }}>
                          <Icon name="PaperAirplaneIcon" size={13} />
                          {offre.type === 'stage' ? 'Postuler au stage' : 'Postuler'}
                        </button>
                      )}
                      <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                        <Icon name="BookmarkIcon" size={13} /> Sauvegarder
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                        <Icon name="ShareIcon" size={13} /> Partager
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <Icon name="MagnifyingGlassIcon" size={40} className="mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Aucune offre ne correspond à votre recherche</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── MES CANDIDATURES ── */}
        {activeTab === 'candidatures' && (
          <div className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'En attente', value: candidatures.filter(c => c.statut === 'en_attente').length + appliedIds.length, color: '#f59e0b' },
                { label: 'Entretiens', value: candidatures.filter(c => c.statut === 'entretien').length, color: '#0ea5e9' },
                { label: 'Acceptées', value: candidatures.filter(c => c.statut === 'accepté').length, color: '#10b981' },
              ].map((k, i) => (
                <div key={i} className="rounded-xl p-4 border text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <p className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{k.label}</p>
                </div>
              ))}
            </div>
            {candidatures.map(c => (
              <div key={c.id} className="rounded-2xl border p-4 flex items-center gap-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: c.color + '20' }}>
                  <Icon name={c.type === 'stage' ? 'AcademicCapIcon' : 'BriefcaseIcon'} size={18} style={{ color: c.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{c.offre}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Postulé le {c.date}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full font-medium shrink-0" style={{ backgroundColor: statutColors[c.statut]?.bg, color: statutColors[c.statut]?.text }}>
                  {statutColors[c.statut]?.label}
                </span>
              </div>
            ))}
            {appliedIds.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3 mt-4" style={{ color: 'var(--foreground)' }}>Nouvelles candidatures</h3>
                {[...offres, ...stages].filter(o => appliedIds.includes(o.id)).map(o => (
                  <div key={o.id} className="rounded-2xl border p-4 flex items-center gap-4 mb-3" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: o.bg }}>
                      <Icon name={o.icon as any} size={18} style={{ color: o.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{o.titre} — {o.etablissement}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Postulé aujourd'hui</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full font-medium shrink-0" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>En attente</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── MON PROFIL ── */}
        {activeTab === 'profil' && (
          <div className="max-w-2xl space-y-6">
            <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0ea5e9, #10b981)' }}>
                  <Icon name="UserCircleIcon" size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>Dr. Kofi Diallo</h2>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Médecin généraliste · Dakar, Sénégal</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>Profil vérifié SHIFA</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}>Disponible</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Spécialité', value: 'Médecine générale', icon: 'UserIcon' },
                  { label: 'Expérience', value: '8 ans', icon: 'ClockIcon' },
                  { label: 'Diplôme', value: 'Doctorat en médecine — UCAD 2018', icon: 'AcademicCapIcon' },
                  { label: 'Langues', value: 'Français, Wolof, Anglais', icon: 'LanguageIcon' },
                  { label: 'Disponibilité', value: 'Immédiate', icon: 'CalendarIcon' },
                  { label: 'Type de contrat', value: 'CDI, CDD, Vacation', icon: 'BriefcaseIcon' },
                ].map(f => (
                  <div key={f.label} className="flex items-start gap-2">
                    <Icon name={f.icon as any} size={14} className="mt-0.5 shrink-0" style={{ color: '#0ea5e9' }} />
                    <div>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{f.label}</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{f.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Compétences & Certifications</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {['Médecine générale', 'Urgences', 'Pédiatrie', 'Téléconsultation', 'Diabétologie', 'Cardiologie de base', 'Soins primaires'].map(comp => (
                  <span key={comp} className="text-xs px-3 py-1 rounded-full border" style={{ borderColor: '#0ea5e9', color: '#0ea5e9', backgroundColor: '#e0f2fe' }}>{comp}</span>
                ))}
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: '#0ea5e9' }}>
                <Icon name="PencilIcon" size={14} /> Modifier mon profil
              </button>
            </div>
            <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Documents</h3>
              <div className="space-y-2">
                {[
                  { name: 'CV médical', status: 'Téléchargé', icon: 'DocumentTextIcon', color: '#10b981' },
                  { name: 'Diplôme de médecine', status: 'Vérifié', icon: 'AcademicCapIcon', color: '#10b981' },
                  { name: 'Ordre des médecins', status: 'Vérifié', icon: 'ShieldCheckIcon', color: '#10b981' },
                  { name: 'Lettre de motivation', status: 'Non fourni', icon: 'DocumentPlusIcon', color: '#f59e0b' },
                ].map(doc => (
                  <div key={doc.name} className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2">
                      <Icon name={doc.icon as any} size={15} style={{ color: doc.color }} />
                      <span className="text-sm" style={{ color: 'var(--foreground)' }}>{doc.name}</span>
                    </div>
                    <span className="text-xs font-medium" style={{ color: doc.color }}>{doc.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ESPACE RECRUTEUR ── */}
        {activeTab === 'recruteur' && (
          <div className="space-y-6">
            <div className="rounded-2xl p-5 border" style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(16,185,129,0.1))', borderColor: 'var(--border)' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #0ea5e9, #10b981)' }}>
                  <Icon name="BuildingOfficeIcon" size={22} className="text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold mb-1" style={{ color: 'var(--foreground)' }}>Espace Recruteur</h2>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    Publiez vos offres d'emploi et de stage, gérez vos candidatures et trouvez les meilleurs professionnels de santé en Afrique.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Offres publiées', value: '3', icon: 'BriefcaseIcon', color: '#0ea5e9' },
                { label: 'Candidatures reçues', value: '47', icon: 'UsersIcon', color: '#8b5cf6' },
                { label: 'Entretiens planifiés', value: '8', icon: 'CalendarIcon', color: '#f59e0b' },
                { label: 'Recrutements finalisés', value: '2', icon: 'CheckCircleIcon', color: '#10b981' },
              ].map((k, i) => (
                <div key={i} className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: k.color + '20' }}>
                    <Icon name={k.icon as any} size={16} style={{ color: k.color }} />
                  </div>
                  <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{k.value}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{k.label}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Publier une nouvelle offre</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Titre du poste', placeholder: 'Ex: Médecin généraliste' },
                  { label: 'Type', placeholder: 'Emploi / Stage / Vacation / Bénévolat' },
                  { label: 'Spécialité', placeholder: 'Ex: Médecine générale' },
                  { label: 'Ville & Pays', placeholder: 'Ex: Dakar, Sénégal' },
                  { label: 'Type de contrat', placeholder: 'CDI / CDD / Vacation' },
                  { label: 'Salaire / Indemnité', placeholder: 'Ex: 800 000 FCFA/mois' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>{f.label}</label>
                    <input placeholder={f.placeholder} className="w-full px-3 py-2 text-sm rounded-xl border outline-none" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>Description du poste</label>
                  <textarea rows={4} placeholder="Décrivez les missions, responsabilités et profil recherché..." className="w-full px-3 py-2 text-sm rounded-xl border outline-none resize-none" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                </div>
              </div>
              <button className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: '#0ea5e9' }}>
                <Icon name="PlusIcon" size={14} /> Publier l'offre
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {showApplyForm && selectedOffre && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="rounded-2xl border p-6 w-full max-w-md" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>
                {selectedOffre.type === 'stage' ? 'Postuler au stage' : 'Postuler à cette offre'}
              </h3>
              <button onClick={() => setShowApplyForm(false)} className="p-1.5 rounded-lg hover:bg-muted">
                <Icon name="XMarkIcon" size={18} style={{ color: 'var(--muted-foreground)' }} />
              </button>
            </div>
            <div className="p-3 rounded-xl mb-4" style={{ backgroundColor: selectedOffre.bg }}>
              <p className="text-sm font-semibold" style={{ color: selectedOffre.color }}>{selectedOffre.titre}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{selectedOffre.etablissement} · {selectedOffre.ville}, {selectedOffre.pays}</p>
            </div>
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>Lettre de motivation</label>
                <textarea rows={4} placeholder="Présentez votre motivation et votre expérience..." className="w-full px-3 py-2 text-sm rounded-xl border outline-none resize-none" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>CV (PDF)</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer hover:bg-muted/40" style={{ borderColor: 'var(--border)' }}>
                  <Icon name="PaperClipIcon" size={14} style={{ color: 'var(--muted-foreground)' }} />
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>CV_Dr_Kofi_Diallo.pdf (déjà téléchargé)</span>
                  <Icon name="CheckIcon" size={14} style={{ color: '#10b981' }} />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={submitApplication} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: selectedOffre.color }}>
                Envoyer ma candidature
              </button>
              <button onClick={() => setShowApplyForm(false)} className="px-4 py-2.5 rounded-xl text-sm font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
