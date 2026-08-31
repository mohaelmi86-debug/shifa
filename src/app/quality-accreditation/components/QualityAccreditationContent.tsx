'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const tabs = [
  { key: 'overview', label: 'Tableau de bord', icon: 'Squares2X2Icon' },
  { key: 'indicators', label: 'Indicateurs qualité', icon: 'ChartBarIcon' },
  { key: 'procedures', label: 'Procédures', icon: 'DocumentTextIcon' },
  { key: 'nonconformities', label: 'Non-conformités', icon: 'ExclamationTriangleIcon' },
  { key: 'actions', label: 'Actions correctives', icon: 'WrenchScrewdriverIcon' },
  { key: 'audits', label: 'Audits', icon: 'ClipboardDocumentCheckIcon' },
];

const kpis = [
  { label: 'Score qualité global', value: '87.4%', sub: 'Objectif: 90%', icon: 'StarIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Indicateurs verts', value: '42/58', sub: '72% conformes', icon: 'CheckCircleIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
  { label: 'Non-conformités ouvertes', value: '18', sub: '4 critiques', icon: 'ExclamationTriangleIcon', color: 'var(--shifa-red)', bg: 'rgba(239,68,68,0.08)' },
  { label: 'Actions correctives', value: '24', sub: '8 en retard', icon: 'WrenchScrewdriverIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)' },
  { label: 'Audits planifiés', value: '6', sub: '2 ce trimestre', icon: 'ClipboardDocumentCheckIcon', color: 'var(--shifa-purple)', bg: 'rgba(123,94,167,0.08)' },
  { label: 'Accréditation', value: 'ISO 9001', sub: 'Valide jusqu\'en 2027', icon: 'ShieldCheckIcon', color: 'var(--shifa-cyan)', bg: 'rgba(0,242,195,0.08)' },
];

const indicators = [
  { id: 'ind-001', nom: 'Taux de satisfaction patient', domaine: 'Expérience patient', valeur: 88.4, objectif: 90, unite: '%', tendance: 'hausse', statut: 'attention' },
  { id: 'ind-002', nom: 'Délai moyen d\'attente urgences', domaine: 'Urgences', valeur: 28, objectif: 20, unite: 'min', tendance: 'stable', statut: 'non_conforme' },
  { id: 'ind-003', nom: 'Taux d\'infections nosocomiales', domaine: 'Hygiène', valeur: 1.2, objectif: 2, unite: '%', tendance: 'baisse', statut: 'conforme' },
  { id: 'ind-004', nom: 'Taux de réadmission 30 jours', domaine: 'Clinique', valeur: 4.8, objectif: 5, unite: '%', tendance: 'stable', statut: 'conforme' },
  { id: 'ind-005', nom: 'Conformité prescription électronique', domaine: 'Pharmacie', valeur: 94.2, objectif: 95, unite: '%', tendance: 'hausse', statut: 'attention' },
  { id: 'ind-006', nom: 'Délai résultats biologiques critiques', domaine: 'Laboratoire', valeur: 42, objectif: 60, unite: 'min', tendance: 'baisse', statut: 'conforme' },
  { id: 'ind-007', nom: 'Taux de chutes en hospitalisation', domaine: 'Sécurité', valeur: 0.8, objectif: 1, unite: '%', tendance: 'stable', statut: 'conforme' },
  { id: 'ind-008', nom: 'Taux d\'erreurs médicamenteuses', domaine: 'Pharmacie', valeur: 0.12, objectif: 0.1, unite: '%', tendance: 'hausse', statut: 'non_conforme' },
];

const procedures = [
  { id: 'proc-001', titre: 'Prise en charge des urgences vitales', domaine: 'Urgences', version: 'v3.2', date_revision: '15 jan. 2026', prochain_revision: '15 jan. 2027', statut: 'approuvé', responsable: 'Dr. Koné', acces: 'Tous services' },
  { id: 'proc-002', titre: 'Protocole hygiène des mains', domaine: 'Hygiène', version: 'v2.1', date_revision: '01 mars 2026', prochain_revision: '01 mars 2027', statut: 'approuvé', responsable: 'Infirmière Chef', acces: 'Tous services' },
  { id: 'proc-003', titre: 'Gestion des médicaments à risque', domaine: 'Pharmacie', version: 'v4.0', date_revision: '20 avr. 2026', prochain_revision: '20 avr. 2027', statut: 'approuvé', responsable: 'Pharmacien Chef', acces: 'Pharmacie, Soins' },
  { id: 'proc-004', titre: 'Identification du patient', domaine: 'Sécurité', version: 'v2.5', date_revision: '10 juin 2026', prochain_revision: '10 juin 2027', statut: 'approuvé', responsable: 'Qualité', acces: 'Tous services' },
  { id: 'proc-005', titre: 'Gestion des déchets médicaux', domaine: 'Environnement', version: 'v1.8', date_revision: '05 juil. 2026', prochain_revision: '05 juil. 2027', statut: 'en_revision', responsable: 'Hygiéniste', acces: 'Tous services' },
  { id: 'proc-006', titre: 'Transfusion sanguine', domaine: 'Clinique', version: 'v3.1', date_revision: '01 août 2026', prochain_revision: '01 août 2027', statut: 'approuvé', responsable: 'Dr. Sarr', acces: 'Médecins, Infirmiers' },
];

const nonconformities = [
  { id: 'nc-001', titre: 'Délai d\'attente urgences > objectif', domaine: 'Urgences', gravite: 'majeure', date_detection: '08 août 2026', statut: 'en_cours', responsable: 'Dr. Ndiaye', action_corrective: 'AC-2026-08-001' },
  { id: 'nc-002', titre: 'Erreur médicamenteuse — Salle 12', domaine: 'Pharmacie', gravite: 'critique', date_detection: '07 août 2026', statut: 'en_cours', responsable: 'Pharmacien Chef', action_corrective: 'AC-2026-08-002' },
  { id: 'nc-003', titre: 'Non-conformité stérilisation instruments', domaine: 'Hygiène', gravite: 'majeure', date_detection: '05 août 2026', statut: 'traité', responsable: 'Infirmière Chef', action_corrective: 'AC-2026-07-018' },
  { id: 'nc-004', titre: 'Dossier patient incomplet — 3 cas', domaine: 'Dossier médical', gravite: 'mineure', date_detection: '03 août 2026', statut: 'en_cours', responsable: 'Secrétariat médical', action_corrective: 'AC-2026-08-003' },
  { id: 'nc-005', titre: 'Température réfrigérateur vaccins hors plage', domaine: 'Pharmacie', gravite: 'critique', date_detection: '01 août 2026', statut: 'traité', responsable: 'Pharmacien Chef', action_corrective: 'AC-2026-07-020' },
  { id: 'nc-006', titre: 'Absence signature consentement éclairé', domaine: 'Éthique', gravite: 'majeure', date_detection: '28 juil. 2026', statut: 'en_cours', responsable: 'Dr. Balde', action_corrective: 'AC-2026-08-004' },
];

const correctiveActions = [
  { id: 'ac-001', ref: 'AC-2026-08-001', titre: 'Réorganisation flux urgences', nc_liee: 'NC-001', responsable: 'Dr. Ndiaye', date_echeance: '31 août 2026', avancement: 40, statut: 'en_cours', priorite: 'haute' },
  { id: 'ac-002', ref: 'AC-2026-08-002', titre: 'Formation double vérification médicaments', nc_liee: 'NC-002', responsable: 'Pharmacien Chef', date_echeance: '20 août 2026', avancement: 60, statut: 'en_cours', priorite: 'critique' },
  { id: 'ac-003', ref: 'AC-2026-07-018', titre: 'Révision protocole stérilisation', nc_liee: 'NC-003', responsable: 'Infirmière Chef', date_echeance: '15 août 2026', avancement: 100, statut: 'clôturé', priorite: 'haute' },
  { id: 'ac-004', ref: 'AC-2026-08-003', titre: 'Audit dossiers patients — correction', nc_liee: 'NC-004', responsable: 'Secrétariat', date_echeance: '25 août 2026', avancement: 20, statut: 'en_cours', priorite: 'normale' },
  { id: 'ac-005', ref: 'AC-2026-07-020', titre: 'Remplacement réfrigérateur + alarme temp.', nc_liee: 'NC-005', responsable: 'Pharmacien Chef', date_echeance: '10 août 2026', avancement: 100, statut: 'clôturé', priorite: 'critique' },
];

const audits = [
  { id: 'aud-001', titre: 'Audit interne qualité — Urgences', type: 'Interne', auditeur: 'Équipe Qualité', date_debut: '15 sept. 2026', date_fin: '17 sept. 2026', statut: 'planifié', score: null, ecarts: null },
  { id: 'aud-002', titre: 'Audit ISO 9001:2015 — Surveillance', type: 'Externe', auditeur: 'Bureau Veritas', date_debut: '10 oct. 2026', date_fin: '12 oct. 2026', statut: 'planifié', score: null, ecarts: null },
  { id: 'aud-003', titre: 'Audit hygiène et prévention infections', type: 'Interne', auditeur: 'Comité CLIN', date_debut: '20 juil. 2026', date_fin: '22 juil. 2026', statut: 'terminé', score: 84.2, ecarts: 6 },
  { id: 'aud-004', titre: 'Audit pharmacie — Traçabilité médicaments', type: 'Interne', auditeur: 'Équipe Qualité', date_debut: '15 juin 2026', date_fin: '16 juin 2026', statut: 'terminé', score: 91.8, ecarts: 3 },
  { id: 'aud-005', titre: 'Audit accréditation HAS', type: 'Externe', auditeur: 'HAS / Experts visiteurs', date_debut: '01 mars 2026', date_fin: '05 mars 2026', statut: 'terminé', score: 87.4, ecarts: 12 },
];

const radarData = [
  { domaine: 'Urgences', score: 72 },
  { domaine: 'Pharmacie', score: 85 },
  { domaine: 'Hygiène', score: 94 },
  { domaine: 'Clinique', score: 88 },
  { domaine: 'Labo', score: 91 },
  { domaine: 'Imagerie', score: 89 },
];

const indicatorTrend = [
  { mois: 'Mar', score: 84.2 },
  { mois: 'Avr', score: 85.8 },
  { mois: 'Mai', score: 86.4 },
  { mois: 'Jun', score: 85.9 },
  { mois: 'Jul', score: 87.1 },
  { mois: 'Aoû', score: 87.4 },
];

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  conforme: { label: 'Conforme', bg: '#dcfce7', text: '#16a34a' },
  attention: { label: 'Attention', bg: '#fef9c3', text: '#ca8a04' },
  non_conforme: { label: 'Non conforme', bg: '#fee2e2', text: '#dc2626' },
  approuvé: { label: 'Approuvé', bg: '#dcfce7', text: '#16a34a' },
  en_revision: { label: 'En révision', bg: '#fef9c3', text: '#ca8a04' },
  en_cours: { label: 'En cours', bg: '#fef9c3', text: '#ca8a04' },
  traité: { label: 'Traité', bg: '#dcfce7', text: '#16a34a' },
  clôturé: { label: 'Clôturé', bg: '#dcfce7', text: '#16a34a' },
  planifié: { label: 'Planifié', bg: '#dbeafe', text: '#1d4ed8' },
  terminé: { label: 'Terminé', bg: '#dcfce7', text: '#16a34a' },
};

const graviteConfig: Record<string, { label: string; bg: string; text: string }> = {
  critique: { label: 'Critique', bg: '#fee2e2', text: '#dc2626' },
  majeure: { label: 'Majeure', bg: '#fef9c3', text: '#ca8a04' },
  mineure: { label: 'Mineure', bg: '#dbeafe', text: '#1d4ed8' },
};

const priorityConfig: Record<string, { label: string; bg: string; text: string }> = {
  critique: { label: 'Critique', bg: '#fee2e2', text: '#dc2626' },
  haute: { label: 'Haute', bg: '#fef9c3', text: '#ca8a04' },
  normale: { label: 'Normale', bg: '#dbeafe', text: '#1d4ed8' },
};

export default function QualityAccreditationContent() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--shifa-green), var(--shifa-cyan))' }}>
              <Icon name="ShieldCheckIcon" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'DM Sans, sans-serif' }}>Qualité & Accréditation</h1>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Indicateurs · Procédures · Non-conformités · Actions correctives · Audits</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <Icon name="ShieldCheckIcon" size={14} style={{ color: 'var(--shifa-green)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>ISO 9001:2015 · Valide 2027</span>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
              <Icon name="DocumentArrowDownIcon" size={14} />
              Rapport qualité
            </button>
          </div>
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.key ? 'text-white' : 'hover:bg-muted'}`}
              style={activeTab === tab.key ? { backgroundColor: 'var(--shifa-blue)', color: 'white' } : { color: 'var(--muted-foreground)' }}
            >
              <Icon name={tab.icon as any} size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {kpis.map(kpi => (
                <div key={kpi.label} className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: kpi.bg }}>
                    <Icon name={kpi.icon as any} size={16} style={{ color: kpi.color }} />
                  </div>
                  <p className="text-lg font-bold" style={{ color: 'var(--foreground)', fontFamily: 'DM Sans, sans-serif' }}>{kpi.value}</p>
                  <p className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{kpi.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{kpi.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Score qualité par domaine</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="domaine" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                    <Radar name="Score" dataKey="score" stroke="var(--shifa-blue)" fill="var(--shifa-blue)" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Évolution score qualité global (%)</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={indicatorTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="mois" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                    <YAxis domain={[80, 95]} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="score" name="Score qualité" fill="var(--shifa-green)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent non-conformities */}
            <div className="rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Non-conformités récentes</h3>
                <button onClick={() => setActiveTab('nonconformities')} className="text-xs font-medium" style={{ color: 'var(--shifa-blue)' }}>Voir toutes →</button>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {nonconformities.slice(0, 4).map(nc => {
                  const g = graviteConfig[nc.gravite];
                  const s = statusConfig[nc.statut];
                  return (
                    <div key={nc.id} className="px-5 py-3 flex items-center gap-4">
                      <span className="text-xs px-1.5 py-0.5 rounded-full shrink-0" style={{ backgroundColor: g.bg, color: g.text }}>{g.label}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>{nc.titre}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{nc.domaine} · {nc.date_detection}</p>
                      </div>
                      <span className="text-xs px-1.5 py-0.5 rounded-full shrink-0" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Indicators */}
        {activeTab === 'indicators' && (
          <div className="space-y-3">
            {indicators.map(ind => {
              const s = statusConfig[ind.statut];
              const isGood = ind.statut === 'conforme';
              const pct = ind.unite === '%' ? ind.valeur : Math.min(100, (ind.valeur / ind.objectif) * 100);
              return (
                <div key={ind.id} className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{ind.nom}</h3>
                        <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{ind.domaine}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold" style={{ color: isGood ? 'var(--shifa-green)' : 'var(--shifa-red)', fontFamily: 'DM Sans, sans-serif' }}>{ind.valeur}{ind.unite}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Objectif: {ind.objectif}{ind.unite}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                      <div className="h-2 rounded-full transition-all" style={{ width: `${Math.min(100, pct)}%`, backgroundColor: isGood ? 'var(--shifa-green)' : ind.statut === 'attention' ? 'var(--shifa-amber)' : 'var(--shifa-red)' }} />
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Icon name={ind.tendance === 'hausse' ? 'ArrowTrendingUpIcon' : ind.tendance === 'baisse' ? 'ArrowTrendingDownIcon' : 'MinusIcon'} size={14} style={{ color: ind.tendance === 'hausse' ? 'var(--shifa-green)' : ind.tendance === 'baisse' ? 'var(--shifa-red)' : 'var(--muted-foreground)' }} />
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{ind.tendance}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Procedures */}
        {activeTab === 'procedures' && (
          <div className="rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Procédures & Protocoles ({procedures.length})</h3>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                <Icon name="PlusIcon" size={12} />
                Nouvelle procédure
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ backgroundColor: 'var(--muted)' }}>
                    {['Titre', 'Domaine', 'Version', 'Dernière révision', 'Prochaine révision', 'Responsable', 'Accès', 'Statut'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {procedures.map(proc => {
                    const s = statusConfig[proc.statut];
                    return (
                      <tr key={proc.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <td className="px-4 py-3 font-medium" style={{ color: 'var(--foreground)' }}>{proc.titre}</td>
                        <td className="px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{proc.domaine}</td>
                        <td className="px-4 py-3 font-mono" style={{ color: 'var(--shifa-blue)' }}>{proc.version}</td>
                        <td className="px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{proc.date_revision}</td>
                        <td className="px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{proc.prochain_revision}</td>
                        <td className="px-4 py-3" style={{ color: 'var(--foreground)' }}>{proc.responsable}</td>
                        <td className="px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{proc.acces}</td>
                        <td className="px-4 py-3"><span className="px-1.5 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Non-conformities */}
        {activeTab === 'nonconformities' && (
          <div className="space-y-3">
            {nonconformities.map(nc => {
              const g = graviteConfig[nc.gravite];
              const s = statusConfig[nc.statut];
              return (
                <div key={nc.id} className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{nc.titre}</h3>
                        <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: g.bg, color: g.text }}>{g.label}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{nc.domaine} · Détecté: {nc.date_detection} · Responsable: {nc.responsable}</p>
                    </div>
                    <span className="text-xs font-mono shrink-0" style={{ color: 'var(--muted-foreground)' }}>{nc.action_corrective}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg text-xs font-medium border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Voir détails</button>
                    {nc.statut === 'en_cours' && (
                      <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>Voir action corrective</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Corrective Actions */}
        {activeTab === 'actions' && (
          <div className="space-y-3">
            {correctiveActions.map(ac => {
              const s = statusConfig[ac.statut];
              const p = priorityConfig[ac.priorite];
              return (
                <div key={ac.id} className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono" style={{ color: 'var(--shifa-blue)' }}>{ac.ref}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: p.bg, color: p.text }}>{p.label}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
                      </div>
                      <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{ac.titre}</h3>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>NC liée: {ac.nc_liee} · Responsable: {ac.responsable} · Échéance: {ac.date_echeance}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-bold" style={{ color: ac.avancement === 100 ? 'var(--shifa-green)' : 'var(--foreground)', fontFamily: 'DM Sans, sans-serif' }}>{ac.avancement}%</p>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                    <div className="h-2 rounded-full transition-all" style={{ width: `${ac.avancement}%`, backgroundColor: ac.avancement === 100 ? 'var(--shifa-green)' : ac.avancement >= 50 ? 'var(--shifa-blue)' : 'var(--shifa-amber)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Audits */}
        {activeTab === 'audits' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Programme d'audits</h3>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                <Icon name="PlusIcon" size={14} />
                Planifier un audit
              </button>
            </div>
            {audits.map(aud => {
              const s = statusConfig[aud.statut];
              return (
                <div key={aud.id} className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{aud.titre}</h3>
                        <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: aud.type === 'Externe' ? 'rgba(123,94,167,0.1)' : 'rgba(0,102,255,0.08)', color: aud.type === 'Externe' ? 'var(--shifa-purple)' : 'var(--shifa-blue)' }}>{aud.type}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Auditeur: {aud.auditeur} · Du {aud.date_debut} au {aud.date_fin}</p>
                    </div>
                    {aud.score !== null && (
                      <div className="text-right">
                        <p className="text-xl font-bold" style={{ color: aud.score >= 90 ? 'var(--shifa-green)' : aud.score >= 80 ? 'var(--shifa-amber)' : 'var(--shifa-red)', fontFamily: 'DM Sans, sans-serif' }}>{aud.score}%</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{aud.ecarts} écarts</p>
                      </div>
                    )}
                  </div>
                  {aud.statut === 'terminé' && aud.score !== null && (
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                      <div className="h-2 rounded-full" style={{ width: `${aud.score}%`, backgroundColor: aud.score >= 90 ? 'var(--shifa-green)' : aud.score >= 80 ? 'var(--shifa-amber)' : 'var(--shifa-red)' }} />
                    </div>
                  )}
                  <div className="flex gap-2 mt-3">
                    <button className="px-3 py-1.5 rounded-lg text-xs font-medium border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                      {aud.statut === 'terminé' ? 'Voir rapport' : 'Voir détails'}
                    </button>
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
