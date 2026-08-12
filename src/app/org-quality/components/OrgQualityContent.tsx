'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';

type Tab = 'overview' | 'incidents' | 'adverse' | 'nonconformities' | 'capa' | 'audits' | 'procedures' | 'indicators' | 'certifications';

const kpis = [
  { label: 'Score qualité global', value: '87.4%', sub: 'Objectif: 90%', icon: 'StarIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Indicateurs conformes', value: '42/58', sub: '72% conformes', icon: 'CheckCircleIcon', color: '#16a34a', bg: '#dcfce7' },
  { label: 'Non-conformités ouvertes', value: '18', sub: '4 critiques', icon: 'ExclamationTriangleIcon', color: '#dc2626', bg: '#fee2e2' },
  { label: 'CAPA en cours', value: '24', sub: '8 en retard', icon: 'WrenchScrewdriverIcon', color: '#d97706', bg: '#fef3c7' },
  { label: 'Incidents ce mois', value: '7', sub: '2 graves', icon: 'BoltIcon', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
  { label: 'Accréditation', value: 'ISO 9001', sub: 'Valide jusqu\'en 2027', icon: 'ShieldCheckIcon', color: 'var(--shifa-cyan)', bg: 'rgba(0,242,195,0.08)' },
];

const radarData = [
  { subject: 'Sécurité', A: 88 },
  { subject: 'Hygiène', A: 92 },
  { subject: 'Clinique', A: 85 },
  { subject: 'Pharmacie', A: 78 },
  { subject: 'Urgences', A: 72 },
  { subject: 'Dossiers', A: 90 },
];

const trendData = [
  { mois: 'Mar', score: 82 },
  { mois: 'Avr', score: 84 },
  { mois: 'Mai', score: 83 },
  { mois: 'Jun', score: 85 },
  { mois: 'Jul', score: 86 },
  { mois: 'Aoû', score: 87.4 },
];

const indicators = [
  { id: 'i1', nom: 'Taux de satisfaction patient', domaine: 'Expérience', valeur: 88.4, objectif: 90, unite: '%', statut: 'attention', frequence: 'Mensuel' },
  { id: 'i2', nom: 'Délai moyen attente urgences', domaine: 'Urgences', valeur: 28, objectif: 20, unite: 'min', statut: 'non_conforme', frequence: 'Hebdomadaire' },
  { id: 'i3', nom: 'Taux infections nosocomiales', domaine: 'Hygiène', valeur: 1.2, objectif: 2, unite: '%', statut: 'conforme', frequence: 'Mensuel' },
  { id: 'i4', nom: 'Taux réadmission 30 jours', domaine: 'Clinique', valeur: 4.8, objectif: 5, unite: '%', statut: 'conforme', frequence: 'Mensuel' },
  { id: 'i5', nom: 'Conformité prescription électronique', domaine: 'Pharmacie', valeur: 94.2, objectif: 95, unite: '%', statut: 'attention', frequence: 'Hebdomadaire' },
  { id: 'i6', nom: 'Délai résultats biologiques critiques', domaine: 'Laboratoire', valeur: 42, objectif: 60, unite: 'min', statut: 'conforme', frequence: 'Quotidien' },
  { id: 'i7', nom: 'Taux de chutes patients', domaine: 'Sécurité', valeur: 0.8, objectif: 0.5, unite: '%', statut: 'non_conforme', frequence: 'Mensuel' },
  { id: 'i8', nom: 'Conformité hygiène des mains', domaine: 'Hygiène', valeur: 91, objectif: 85, unite: '%', statut: 'conforme', frequence: 'Mensuel' },
];

const incidents = [
  { id: 'inc1', titre: 'Chute patient — Chambre 14', gravite: 'grave', date: '09 août 2026', service: 'Médecine interne', statut: 'en_cours', declarant: 'Inf. Diallo', description: 'Patient âgé de 78 ans, chute lors du lever nocturne. Blessure légère au genou.' },
  { id: 'inc2', titre: 'Erreur médicamenteuse — Salle 12', gravite: 'grave', date: '07 août 2026', service: 'Pharmacie', statut: 'en_cours', declarant: 'Pharmacien Chef', description: 'Confusion entre deux médicaments de présentation similaire. Patient surveillé, pas de complication.' },
  { id: 'inc3', titre: 'Défaillance équipement monitoring', gravite: 'modéré', date: '05 août 2026', service: 'Réanimation', statut: 'traité', declarant: 'Dr. Koné', description: 'Alarme moniteur cardiaque défaillante. Remplacement effectué en urgence.' },
  { id: 'inc4', titre: 'Retard résultats biologiques critiques', gravite: 'modéré', date: '03 août 2026', service: 'Laboratoire', statut: 'traité', declarant: 'Biologiste', description: 'Résultats critiques transmis avec 45 min de retard. Protocole de rappel activé.' },
  { id: 'inc5', titre: 'Confusion identité patient', gravite: 'mineur', date: '01 août 2026', service: 'Admissions', statut: 'clôturé', declarant: 'Secrétariat', description: 'Confusion de dossier détectée avant tout acte. Aucune conséquence clinique.' },
];

const adverseEvents = [
  { id: 'ae1', titre: 'Réaction allergique post-injection', type: 'EIG', date: '08 août 2026', service: 'Médecine interne', statut: 'en_cours', gravite: 'grave', declarant: 'Dr. Ndiaye', notifie: true },
  { id: 'ae2', titre: 'Infection site opératoire', type: 'EIG', date: '04 août 2026', service: 'Chirurgie', statut: 'en_cours', gravite: 'grave', declarant: 'Dr. Traoré', notifie: true },
  { id: 'ae3', titre: 'Hypoglycémie sévère sous insuline', type: 'EI', date: '01 août 2026', service: 'Endocrinologie', statut: 'traité', gravite: 'modéré', declarant: 'Inf. Ba', notifie: false },
  { id: 'ae4', titre: 'Phlébite post-opératoire', type: 'EI', date: '28 juil. 2026', service: 'Chirurgie', statut: 'clôturé', gravite: 'modéré', declarant: 'Dr. Coulibaly', notifie: false },
];

const nonconformities = [
  { id: 'nc1', titre: 'Délai attente urgences > objectif', domaine: 'Urgences', gravite: 'majeure', date: '08 août 2026', statut: 'en_cours', responsable: 'Dr. Ndiaye', source: 'Indicateur' },
  { id: 'nc2', titre: 'Erreur médicamenteuse — Salle 12', domaine: 'Pharmacie', gravite: 'critique', date: '07 août 2026', statut: 'en_cours', responsable: 'Pharmacien Chef', source: 'Incident' },
  { id: 'nc3', titre: 'Non-conformité stérilisation instruments', domaine: 'Hygiène', gravite: 'majeure', date: '05 août 2026', statut: 'traité', responsable: 'Infirmière Chef', source: 'Audit' },
  { id: 'nc4', titre: 'Dossier patient incomplet — 3 cas', domaine: 'Dossier médical', gravite: 'mineure', date: '03 août 2026', statut: 'en_cours', responsable: 'Secrétariat', source: 'Contrôle' },
  { id: 'nc5', titre: 'Température réfrigérateur vaccins hors plage', domaine: 'Pharmacie', gravite: 'critique', date: '01 août 2026', statut: 'traité', responsable: 'Pharmacien Chef', source: 'Contrôle' },
];

const capas = [
  { id: 'ac1', ref: 'CAPA-2026-08-001', titre: 'Réorganisation flux urgences', type: 'Corrective', responsable: 'Dr. Ndiaye', echeance: '31 août 2026', avancement: 40, statut: 'en_cours', priorite: 'haute', nc: 'nc1' },
  { id: 'ac2', ref: 'CAPA-2026-08-002', titre: 'Formation double vérification médicaments', type: 'Corrective', responsable: 'Pharmacien Chef', echeance: '20 août 2026', avancement: 60, statut: 'en_cours', priorite: 'critique', nc: 'nc2' },
  { id: 'ac3', ref: 'CAPA-2026-07-018', titre: 'Révision protocole stérilisation', type: 'Corrective', responsable: 'Infirmière Chef', echeance: '15 août 2026', avancement: 100, statut: 'clôturé', priorite: 'haute', nc: 'nc3' },
  { id: 'ac4', ref: 'CAPA-2026-08-003', titre: 'Audit dossiers patients — correction', type: 'Corrective', responsable: 'Secrétariat', echeance: '25 août 2026', avancement: 20, statut: 'en_cours', priorite: 'normale', nc: 'nc4' },
  { id: 'ac5', ref: 'CAPA-2026-08-004', titre: 'Remplacement réfrigérateur vaccins', type: 'Corrective', responsable: 'Pharmacien Chef', echeance: '10 août 2026', avancement: 100, statut: 'clôturé', priorite: 'critique', nc: 'nc5' },
  { id: 'ac6', ref: 'CAPA-2026-09-001', titre: 'Protocole prévention chutes patients âgés', type: 'Préventive', responsable: 'Infirmière Chef', echeance: '15 sept. 2026', avancement: 10, statut: 'en_cours', priorite: 'haute', nc: 'inc1' },
];

const audits = [
  { id: 'aud1', titre: 'Audit hygiène des mains', type: 'Interne', date: '15 sept. 2026', auditeur: 'Équipe Qualité', statut: 'planifié', score: null, domaine: 'Hygiène' },
  { id: 'aud2', titre: 'Audit ISO 9001 — Surveillance', type: 'Externe', date: '01 oct. 2026', auditeur: 'Bureau Veritas', statut: 'planifié', score: null, domaine: 'Système qualité' },
  { id: 'aud3', titre: 'Audit circuit médicament', type: 'Interne', date: '10 juil. 2026', auditeur: 'Pharmacien Chef', statut: 'terminé', score: 82, domaine: 'Pharmacie' },
  { id: 'aud4', titre: 'Audit dossiers patients', type: 'Interne', date: '01 juin 2026', auditeur: 'Équipe Qualité', statut: 'terminé', score: 91, domaine: 'Dossiers' },
  { id: 'aud5', titre: 'Audit stérilisation', type: 'Interne', date: '15 mai 2026', auditeur: 'Infirmière Chef', statut: 'terminé', score: 76, domaine: 'Hygiène' },
];

const procedures = [
  { id: 'pr1', titre: 'Protocole prise en charge urgences vitales', version: 'v3.2', date: '01 juin 2026', statut: 'validé', service: 'Urgences', auteur: 'Dr. Ndiaye', revisionDate: '01 juin 2027' },
  { id: 'pr2', titre: 'Procédure double vérification médicaments', version: 'v2.1', date: '15 juil. 2026', statut: 'validé', service: 'Pharmacie', auteur: 'Pharmacien Chef', revisionDate: '15 juil. 2027' },
  { id: 'pr3', titre: 'Protocole hygiène des mains', version: 'v4.0', date: '01 mars 2026', statut: 'validé', service: 'Tous services', auteur: 'Équipe Qualité', revisionDate: '01 mars 2027' },
  { id: 'pr4', titre: 'Procédure identification patient', version: 'v2.0', date: '10 août 2026', statut: 'en_révision', service: 'Admissions', auteur: 'Secrétariat', revisionDate: '10 août 2027' },
  { id: 'pr5', titre: 'Protocole prévention infections nosocomiales', version: 'v5.1', date: '20 avr. 2026', statut: 'validé', service: 'Tous services', auteur: 'Équipe Qualité', revisionDate: '20 avr. 2027' },
  { id: 'pr6', titre: 'Procédure déclaration événements indésirables', version: 'v1.3', date: '05 mai 2026', statut: 'validé', service: 'Tous services', auteur: 'Responsable Qualité', revisionDate: '05 mai 2027' },
];

const certifications = [
  { id: 'cert1', nom: 'ISO 9001:2015 — Système de Management Qualité', organisme: 'Bureau Veritas', obtenu: 'mars 2022', expiration: 'mars 2027', statut: 'valide', scope: 'Ensemble de l\'établissement' },
  { id: 'cert2', nom: 'Accréditation HAS — Niveau B', organisme: 'Haute Autorité de Santé', obtenu: 'juin 2023', expiration: 'juin 2027', statut: 'valide', scope: 'Activités de soins' },
  { id: 'cert3', nom: 'Certification Laboratoire ISO 15189', organisme: 'COFRAC', obtenu: 'jan. 2024', expiration: 'jan. 2026', statut: 'expiré', scope: 'Laboratoire de biologie médicale' },
  { id: 'cert4', nom: 'Certification Pharmacie Hospitalière', organisme: 'Ordre des Pharmaciens', obtenu: 'sept. 2021', expiration: 'sept. 2026', statut: 'attention', scope: 'Pharmacie à usage intérieur' },
];

const graviteConfig: Record<string, { label: string; color: string; bg: string }> = {
  critique: { label: 'Critique', color: '#dc2626', bg: '#fee2e2' },
  majeure: { label: 'Majeure', color: '#d97706', bg: '#fef3c7' },
  grave: { label: 'Grave', color: '#dc2626', bg: '#fee2e2' },
  modéré: { label: 'Modéré', color: '#d97706', bg: '#fef3c7' },
  mineure: { label: 'Mineure', color: '#6b7280', bg: '#f3f4f6' },
  mineur: { label: 'Mineur', color: '#6b7280', bg: '#f3f4f6' },
};

const statutConfig: Record<string, { label: string; color: string; bg: string }> = {
  en_cours: { label: 'En cours', color: '#d97706', bg: '#fef3c7' },
  traité: { label: 'Traité', color: '#16a34a', bg: '#dcfce7' },
  clôturé: { label: 'Clôturé', color: '#6b7280', bg: '#f3f4f6' },
  planifié: { label: 'Planifié', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.1)' },
  terminé: { label: 'Terminé', color: '#16a34a', bg: '#dcfce7' },
  validé: { label: 'Validé', color: '#16a34a', bg: '#dcfce7' },
  en_révision: { label: 'En révision', color: '#d97706', bg: '#fef3c7' },
  valide: { label: 'Valide', color: '#16a34a', bg: '#dcfce7' },
  expiré: { label: 'Expiré', color: '#dc2626', bg: '#fee2e2' },
  attention: { label: 'Expire bientôt', color: '#d97706', bg: '#fef3c7' },
};

const indicStatut: Record<string, { label: string; color: string; bg: string }> = {
  conforme: { label: 'Conforme', color: '#16a34a', bg: '#dcfce7' },
  attention: { label: 'Attention', color: '#d97706', bg: '#fef3c7' },
  non_conforme: { label: 'Non conforme', color: '#dc2626', bg: '#fee2e2' },
};

const prioriteConfig: Record<string, { label: string; color: string; bg: string }> = {
  critique: { label: 'Critique', color: '#dc2626', bg: '#fee2e2' },
  haute: { label: 'Haute', color: '#d97706', bg: '#fef3c7' },
  normale: { label: 'Normale', color: '#6b7280', bg: '#f3f4f6' },
};

export default function OrgQualityContent() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Tableau de bord', icon: 'Squares2X2Icon' },
    { key: 'incidents', label: 'Incidents', icon: 'BoltIcon' },
    { key: 'adverse', label: 'Événements indésirables', icon: 'ExclamationCircleIcon' },
    { key: 'nonconformities', label: 'Non-conformités', icon: 'ExclamationTriangleIcon' },
    { key: 'capa', label: 'CAPA', icon: 'WrenchScrewdriverIcon' },
    { key: 'audits', label: 'Audits', icon: 'ClipboardDocumentCheckIcon' },
    { key: 'procedures', label: 'Procédures', icon: 'DocumentTextIcon' },
    { key: 'indicators', label: 'Indicateurs', icon: 'ChartBarIcon' },
    { key: 'certifications', label: 'Certifications', icon: 'ShieldCheckIcon' },
  ];

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)', fontFamily: 'DM Sans, sans-serif' }}>Qualité & Conformité</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Cycle qualité complet — ISO 9001 · HAS · Accréditation</p>
        </div>
        <button className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl text-white font-medium" style={{ backgroundColor: 'var(--shifa-blue)' }}>
          <Icon name="PlusIcon" className="w-4 h-4" />
          Déclarer un incident
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key as Tab)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all"
            style={{ background: activeTab === t.key ? 'var(--shifa-blue)' : 'var(--card)', color: activeTab === t.key ? '#fff' : 'var(--muted-foreground)', border: '1px solid var(--border)' }}>
            <Icon name={t.icon} className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {kpis.map(kpi => (
              <div key={kpi.label} className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: kpi.bg }}>
                  <Icon name={kpi.icon} className="w-5 h-5" style={{ color: kpi.color }} />
                </div>
                <div className="text-lg font-bold" style={{ color: 'var(--shifa-dark)' }}>{kpi.value}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</div>
                <div className="text-xs mt-0.5 font-medium" style={{ color: kpi.color }}>{kpi.sub}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--shifa-dark)' }}>Radar qualité par domaine</h3>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                  <Radar name="Score" dataKey="A" stroke="var(--shifa-blue)" fill="var(--shifa-blue)" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--shifa-dark)' }}>Évolution score qualité</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="mois" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[75, 95]} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="score" stroke="var(--shifa-blue)" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--shifa-blue)' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--shifa-dark)' }}>Alertes prioritaires</h3>
              <div className="space-y-2">
                {[...incidents.filter(i => i.gravite === 'grave'), ...nonconformities.filter(n => n.gravite === 'critique')].slice(0, 4).map(item => (
                  <div key={item.id} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: '#fff5f5' }}>
                    <Icon name="ExclamationTriangleIcon" className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#dc2626' }} />
                    <div>
                      <div className="text-xs font-medium" style={{ color: 'var(--shifa-dark)' }}>{item.titre}</div>
                      <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── INCIDENTS ── */}
      {activeTab === 'incidents' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold" style={{ color: 'var(--shifa-dark)' }}>Incidents déclarés ({incidents.length})</h2>
            <button className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl text-white font-medium" style={{ backgroundColor: 'var(--shifa-blue)' }}>
              <Icon name="PlusIcon" className="w-4 h-4" /> Déclarer
            </button>
          </div>
          {incidents.map(inc => {
            const g = graviteConfig[inc.gravite] ?? graviteConfig.mineur;
            const s = statutConfig[inc.statut] ?? statutConfig.en_cours;
            const isOpen = expandedItem === inc.id;
            return (
              <div key={inc.id} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="p-4 flex items-center gap-4 flex-wrap cursor-pointer" onClick={() => setExpandedItem(isOpen ? null : inc.id)}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: g.bg }}>
                    <Icon name="BoltIcon" className="w-5 h-5" style={{ color: g.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm" style={{ color: 'var(--shifa-dark)' }}>{inc.titre}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{inc.service} · {inc.date} · Déclaré par {inc.declarant}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: g.bg, color: g.color }}>{g.label}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                    <Icon name={isOpen ? 'ChevronUpIcon' : 'ChevronDownIcon'} className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                  </div>
                </div>
                {isOpen && (
                  <div className="px-4 pb-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-sm mt-3 mb-3" style={{ color: 'var(--foreground)' }}>{inc.description}</p>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>Créer CAPA</button>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Modifier</button>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Clôturer</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── ADVERSE EVENTS ── */}
      {activeTab === 'adverse' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-semibold" style={{ color: 'var(--shifa-dark)' }}>Événements indésirables ({adverseEvents.length})</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>EIG = Événement Indésirable Grave · EI = Événement Indésirable</p>
            </div>
            <button className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl text-white font-medium" style={{ backgroundColor: '#dc2626' }}>
              <Icon name="PlusIcon" className="w-4 h-4" /> Déclarer EIG
            </button>
          </div>
          {adverseEvents.map(ae => {
            const g = graviteConfig[ae.gravite] ?? graviteConfig.mineur;
            const s = statutConfig[ae.statut] ?? statutConfig.en_cours;
            return (
              <div key={ae.id} className="rounded-2xl border p-4 flex items-center gap-4 flex-wrap" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: g.bg }}>
                  <Icon name="ExclamationCircleIcon" className="w-5 h-5" style={{ color: g.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-medium text-sm" style={{ color: 'var(--shifa-dark)' }}>{ae.titre}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: ae.type === 'EIG' ? '#fee2e2' : '#fef3c7', color: ae.type === 'EIG' ? '#dc2626' : '#d97706' }}>{ae.type}</span>
                    {ae.notifie && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>✓ Notifié autorités</span>}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{ae.service} · {ae.date} · {ae.declarant}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: g.bg, color: g.color }}>{g.label}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── NON-CONFORMITIES ── */}
      {activeTab === 'nonconformities' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold" style={{ color: 'var(--shifa-dark)' }}>Non-conformités ({nonconformities.length})</h2>
            <button className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl text-white font-medium" style={{ backgroundColor: 'var(--shifa-blue)' }}>
              <Icon name="PlusIcon" className="w-4 h-4" /> Enregistrer
            </button>
          </div>
          {nonconformities.map(nc => {
            const g = graviteConfig[nc.gravite] ?? graviteConfig.mineur;
            const s = statutConfig[nc.statut] ?? statutConfig.en_cours;
            return (
              <div key={nc.id} className="rounded-2xl border p-4 flex items-center gap-4 flex-wrap" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: g.bg }}>
                  <Icon name="ExclamationTriangleIcon" className="w-5 h-5" style={{ color: g.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm" style={{ color: 'var(--shifa-dark)' }}>{nc.titre}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{nc.domaine} · {nc.date} · Responsable : {nc.responsable} · Source : {nc.source}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: g.bg, color: g.color }}>{g.label}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                  <button className="px-2 py-1 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>CAPA</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── CAPA ── */}
      {activeTab === 'capa' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-semibold" style={{ color: 'var(--shifa-dark)' }}>Actions Correctives & Préventives (CAPA)</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{capas.filter(c => c.statut === 'en_cours').length} en cours · {capas.filter(c => c.statut === 'clôturé').length} clôturées</p>
            </div>
            <button className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl text-white font-medium" style={{ backgroundColor: 'var(--shifa-blue)' }}>
              <Icon name="PlusIcon" className="w-4 h-4" /> Créer CAPA
            </button>
          </div>
          {capas.map(ac => {
            const p = prioriteConfig[ac.priorite] ?? prioriteConfig.normale;
            const s = statutConfig[ac.statut] ?? statutConfig.en_cours;
            return (
              <div key={ac.id} className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono text-xs font-bold" style={{ color: 'var(--shifa-blue)' }}>{ac.ref}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: ac.type === 'Corrective' ? '#fee2e2' : '#dcfce7', color: ac.type === 'Corrective' ? '#dc2626' : '#16a34a' }}>{ac.type}</span>
                    </div>
                    <div className="font-medium text-sm mb-0.5" style={{ color: 'var(--shifa-dark)' }}>{ac.titre}</div>
                    <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Responsable : {ac.responsable} · Échéance : {ac.echeance}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: p.bg, color: p.color }}>{p.label}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                    <div className="h-2 rounded-full transition-all" style={{ width: `${ac.avancement}%`, backgroundColor: ac.avancement === 100 ? '#16a34a' : ac.priorite === 'critique' ? '#dc2626' : 'var(--shifa-blue)' }} />
                  </div>
                  <span className="text-xs font-bold shrink-0" style={{ color: 'var(--foreground)' }}>{ac.avancement}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── AUDITS ── */}
      {activeTab === 'audits' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold" style={{ color: 'var(--shifa-dark)' }}>Programme d'audits</h2>
            <button className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl text-white font-medium" style={{ backgroundColor: 'var(--shifa-blue)' }}>
              <Icon name="PlusIcon" className="w-4 h-4" /> Planifier un audit
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audits.map(aud => {
              const s = statutConfig[aud.statut] ?? statutConfig.planifié;
              return (
                <div key={aud.id} className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-sm mb-0.5" style={{ color: 'var(--shifa-dark)' }}>{aud.titre}</h3>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{aud.domaine} · {aud.auditeur}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: aud.type === 'Externe' ? 'rgba(139,92,246,0.1)' : 'rgba(0,102,255,0.1)', color: aud.type === 'Externe' ? '#8b5cf6' : 'var(--shifa-blue)' }}>{aud.type}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{aud.date}</span>
                    {aud.score !== null ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Score :</span>
                        <span className="text-lg font-bold" style={{ color: aud.score >= 85 ? '#16a34a' : aud.score >= 70 ? '#d97706' : '#dc2626' }}>{aud.score}/100</span>
                      </div>
                    ) : (
                      <button className="text-xs px-3 py-1 rounded-lg text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>Préparer</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── PROCEDURES ── */}
      {activeTab === 'procedures' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold" style={{ color: 'var(--shifa-dark)' }}>Procédures & Protocoles ({procedures.length})</h2>
            <button className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl text-white font-medium" style={{ backgroundColor: 'var(--shifa-blue)' }}>
              <Icon name="PlusIcon" className="w-4 h-4" /> Nouvelle procédure
            </button>
          </div>
          {procedures.map(pr => {
            const s = statutConfig[pr.statut] ?? statutConfig.validé;
            return (
              <div key={pr.id} className="rounded-2xl border p-4 flex items-center gap-4 flex-wrap" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.08)' }}>
                  <Icon name="DocumentTextIcon" className="w-5 h-5" style={{ color: 'var(--shifa-blue)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm" style={{ color: 'var(--shifa-dark)' }}>{pr.titre}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{pr.service} · {pr.auteur} · Révision : {pr.revisionDate}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{pr.version}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                  <button className="p-1.5 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                    <Icon name="ArrowDownTrayIcon" className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── INDICATORS ── */}
      {activeTab === 'indicators' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold" style={{ color: 'var(--shifa-dark)' }}>Indicateurs qualité ({indicators.length})</h2>
            <button className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl text-white font-medium" style={{ backgroundColor: 'var(--shifa-blue)' }}>
              <Icon name="PlusIcon" className="w-4 h-4" /> Ajouter indicateur
            </button>
          </div>
          {indicators.map(ind => {
            const st = indicStatut[ind.statut];
            const pct = Math.min(100, Math.round((ind.valeur / ind.objectif) * 100));
            return (
              <div key={ind.id} className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div>
                    <div className="font-medium text-sm" style={{ color: 'var(--shifa-dark)' }}>{ind.nom}</div>
                    <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{ind.domaine} · {ind.frequence}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>{ind.valeur}{ind.unite}</span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>/ {ind.objectif}{ind.unite}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                  </div>
                </div>
                <div className="w-full rounded-full h-2" style={{ background: 'var(--border)' }}>
                  <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: ind.statut === 'conforme' ? '#16a34a' : ind.statut === 'attention' ? '#d97706' : '#dc2626' }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── CERTIFICATIONS ── */}
      {activeTab === 'certifications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold" style={{ color: 'var(--shifa-dark)' }}>Certifications & Accréditations</h2>
            <button className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl text-white font-medium" style={{ backgroundColor: 'var(--shifa-blue)' }}>
              <Icon name="PlusIcon" className="w-4 h-4" /> Ajouter
            </button>
          </div>
          {certifications.map(cert => {
            const s = statutConfig[cert.statut] ?? statutConfig.valide;
            return (
              <div key={cert.id} className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: s.bg }}>
                      <Icon name="ShieldCheckIcon" className="w-6 h-6" style={{ color: s.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-0.5" style={{ color: 'var(--shifa-dark)' }}>{cert.nom}</h3>
                      <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Organisme : {cert.organisme}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Obtenu : {cert.obtenu} · Expire : {cert.expiration}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Périmètre : {cert.scope}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                        <Icon name="ArrowDownTrayIcon" size={12} /> Certificat
                      </button>
                      <button className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                        Renouveler
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
