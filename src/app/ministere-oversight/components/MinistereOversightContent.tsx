'use client';
import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';


const tabs = [
  { key: 'tab-overview', label: 'Vue nationale', icon: 'BuildingLibraryIcon' },
  { key: 'tab-facilities', label: 'Registre établissements', icon: 'BuildingOffice2Icon' },
  { key: 'tab-professionals', label: 'Annuaire professionnels', icon: 'UserGroupIcon' },
  { key: 'tab-programs', label: 'Programmes nationaux', icon: 'ClipboardDocumentListIcon' },
  { key: 'tab-alerts', label: 'Alertes épidémio.', icon: 'ExclamationTriangleIcon' },
  { key: 'tab-exports', label: 'Exports autorisés', icon: 'ArrowDownTrayIcon' },
];

const kpis = [
  { label: 'Établissements enregistrés', value: '2 847', sub: '+124 cette année', icon: 'BuildingOffice2Icon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Professionnels de santé', value: '48 320', sub: '12 spécialités', icon: 'UserGroupIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
  { label: 'Programmes actifs', value: '18', sub: '6 en phase critique', icon: 'ClipboardDocumentListIcon', color: 'var(--shifa-purple)', bg: 'rgba(123,94,167,0.08)' },
  { label: 'Alertes épidémio. actives', value: '5', sub: '2 niveau national', icon: 'ExclamationTriangleIcon', color: 'var(--shifa-red)', bg: 'rgba(239,68,68,0.08)' },
  { label: 'Couverture sanitaire', value: '74.3%', sub: 'Objectif: 90%', icon: 'MapPinIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)' },
  { label: 'Budget santé exécuté', value: '68.2%', sub: '4.8Mds FCFA / 7.1Mds', icon: 'BanknotesIcon', color: '#0EA5E9', bg: 'rgba(14,165,233,0.08)' },
];

const facilities = [
  { id: 'fac-001', nom: 'CHU de Dakar', type: 'Hôpital universitaire', region: 'Dakar', lits: 850, statut: 'actif', accreditation: 'ISO 9001', derniere_inspection: '15 mars 2026' },
  { id: 'fac-002', nom: 'CHR Saint-Louis', type: 'Hôpital régional', region: 'Saint-Louis', lits: 320, statut: 'actif', accreditation: 'Nationale', derniere_inspection: '02 fév. 2026' },
  { id: 'fac-003', nom: 'Clinique du Cap-Vert', type: 'Clinique privée', region: 'Dakar', lits: 120, statut: 'actif', accreditation: 'ISO 9001', derniere_inspection: '20 avr. 2026' },
  { id: 'fac-004', nom: 'Centre de Santé Thiès-Nord', type: 'Centre de santé', region: 'Thiès', lits: 45, statut: 'actif', accreditation: 'Nationale', derniere_inspection: '10 jan. 2026' },
  { id: 'fac-005', nom: 'Hôpital de Ziguinchor', type: 'Hôpital régional', region: 'Ziguinchor', lits: 180, statut: 'révision', accreditation: 'En cours', derniere_inspection: '05 nov. 2025' },
  { id: 'fac-006', nom: 'Poste de Santé Kaolack-Est', type: 'Poste de santé', region: 'Kaolack', lits: 8, statut: 'actif', accreditation: 'Nationale', derniere_inspection: '28 mai 2026' },
];

const professionals = [
  { id: 'pro-001', nom: 'Dr. Aminata Diallo', specialite: 'Cardiologie', region: 'Dakar', etablissement: 'CHU de Dakar', statut: 'actif', licence: 'SN-MED-2018-4821', formation: 'Université Cheikh Anta Diop' },
  { id: 'pro-002', nom: 'Dr. Ibrahima Ndiaye', specialite: 'Médecine générale', region: 'Saint-Louis', etablissement: 'CHR Saint-Louis', statut: 'actif', licence: 'SN-MED-2015-3204', formation: 'Université Gaston Berger' },
  { id: 'pro-003', nom: 'Dr. Fatou Sarr', specialite: 'Pédiatrie', region: 'Dakar', etablissement: 'Clinique du Cap-Vert', statut: 'actif', licence: 'SN-MED-2020-6712', formation: 'Université Paris VI' },
  { id: 'pro-004', nom: 'Dr. Moussa Koné', specialite: 'Chirurgie générale', region: 'Thiès', etablissement: 'CHR Thiès', statut: 'suspendu', licence: 'SN-MED-2012-1893', formation: 'Université Cheikh Anta Diop' },
  { id: 'pro-005', nom: 'Sage-femme Mariama Balde', specialite: 'Maïeutique', region: 'Kaolack', etablissement: 'CS Kaolack-Est', statut: 'actif', licence: 'SN-SF-2019-2847', formation: 'École Nationale de Sages-Femmes' },
  { id: 'pro-006', nom: 'Dr. Cheikh Diop', specialite: 'Épidémiologie', region: 'Dakar', etablissement: 'Agence Santé Publique', statut: 'actif', licence: 'SN-MED-2010-0924', formation: 'London School of Hygiene' },
];

const programs = [
  { id: 'prog-001', titre: 'Plan National de Développement Sanitaire (PNDS) 2024–2028', axe: 'Gouvernance', avancement: 42, budget: '12.4Mds FCFA', statut: 'actif', responsable: 'Direction Planification' },
  { id: 'prog-002', titre: 'Programme Élargi de Vaccination (PEV)', axe: 'Prévention', avancement: 78, budget: '680M FCFA', statut: 'actif', responsable: 'DPPD' },
  { id: 'prog-003', titre: 'Programme National de Lutte contre le Paludisme', axe: 'Maladies transmissibles', avancement: 65, budget: '1.2Mds FCFA', statut: 'actif', responsable: 'PNLP' },
  { id: 'prog-004', titre: 'Couverture Sanitaire Universelle (CSU)', axe: 'Accès aux soins', avancement: 38, budget: '3.8Mds FCFA', statut: 'actif', responsable: 'DGAS' },
  { id: 'prog-005', titre: 'Programme Santé de la Reproduction', axe: 'Santé maternelle', avancement: 71, budget: '380M FCFA', statut: 'actif', responsable: 'DSRSE' },
  { id: 'prog-006', titre: 'Digitalisation du Système de Santé (SHIFA)', axe: 'Innovation', avancement: 58, budget: '920M FCFA', statut: 'actif', responsable: 'DIEM' },
];

const epidemioAlerts = [
  { id: 'alrt-001', maladie: 'Méningite bactérienne', region: 'Saint-Louis', niveau: 'national', cas: 47, deces: 3, date: '08 août 2026', statut: 'actif', reponse: 'Vaccination d\'urgence déployée' },
  { id: 'alrt-002', maladie: 'Dengue', region: 'Thiès, Dakar', niveau: 'national', cas: 104, deces: 2, date: '05 août 2026', statut: 'actif', reponse: 'Surveillance renforcée, démoustication' },
  { id: 'alrt-003', maladie: 'Choléra', region: 'Zone côtière', niveau: 'régional', cas: 12, deces: 0, date: '01 août 2026', statut: 'actif', reponse: 'Chloration eau, sensibilisation' },
  { id: 'alrt-004', maladie: 'Rougeole', region: 'Région Est', niveau: 'régional', cas: 28, deces: 1, date: '28 juil. 2026', statut: 'actif', reponse: 'Campagne vaccination ciblée' },
  { id: 'alrt-005', maladie: 'Fièvre jaune', region: 'Région Sud', niveau: 'régional', cas: 3, deces: 0, date: '15 juil. 2026', statut: 'résolu', reponse: 'Cas isolés, vaccination préventive' },
];

const exports = [
  { id: 'exp-001', titre: 'Annuaire national des établissements de santé 2026', format: 'PDF + XLSX', taille: '4.2 MB', date: '01 août 2026', destinataire: 'OMS / CEDEAO', niveau_acces: 'public' },
  { id: 'exp-002', titre: 'Statistiques sanitaires nationales — S1 2026', format: 'PDF', taille: '8.7 MB', date: '15 juil. 2026', destinataire: 'Ministère / Partenaires', niveau_acces: 'restreint' },
  { id: 'exp-003', titre: 'Données épidémiologiques agrégées — DHIS2', format: 'CSV', taille: '12.4 MB', date: '10 août 2026', destinataire: 'OMS AFRO', niveau_acces: 'restreint' },
  { id: 'exp-004', titre: 'Rapport ressources humaines santé 2025', format: 'PDF', taille: '3.1 MB', date: '30 jan. 2026', destinataire: 'OMS / Banque Mondiale', niveau_acces: 'public' },
  { id: 'exp-005', titre: 'Indicateurs ODD Santé — Rapport annuel 2025', format: 'PDF', taille: '6.8 MB', date: '20 fév. 2026', destinataire: 'Nations Unies', niveau_acces: 'public' },
  { id: 'exp-006', titre: 'Données nominatives professionnels — Usage interne', format: 'XLSX', taille: '2.3 MB', date: '05 août 2026', destinataire: 'Usage interne uniquement', niveau_acces: 'confidentiel' },
];

const facilityTypeData = [
  { type: 'Hôpitaux', count: 48, color: '#0066FF' },
  { type: 'Centres santé', count: 420, color: '#00F2C3' },
  { type: 'Postes santé', count: 1840, color: '#7B5EA7' },
  { type: 'Cliniques privées', count: 312, color: '#F59E0B' },
  { type: 'Autres', count: 227, color: '#64748B' },
];

const budgetTrend = [
  { annee: '2022', execute: 58, alloue: 100 },
  { annee: '2023', execute: 63, alloue: 100 },
  { annee: '2024', execute: 71, alloue: 100 },
  { annee: '2025', execute: 74, alloue: 100 },
  { annee: '2026', execute: 68, alloue: 100 },
];

export default function MinistereOversightContent() {
  const [activeTab, setActiveTab] = useState('tab-overview');

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      {/* Premium Page Header — SHIFA design tokens */}
      <div
        className="relative rounded-2xl overflow-hidden mb-8 p-6 lg:p-8"
        style={{
          background: 'linear-gradient(135deg, #0A1E4A 0%, #0878EF 60%, #38B6FF 100%)',
          boxShadow: '0 8px 32px rgba(8,120,239,0.25)',
        }}
      >
        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.04)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.03)', transform: 'translateY(40%)' }} />

        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
            >
              <Icon name="BuildingLibraryIcon" size={26} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}>
                  Ministère de la Santé
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>
                Supervision Nationale
              </h1>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.72)' }}>
                Registre des établissements, professionnels, programmes et alertes épidémiologiques
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Icon name="ArrowDownTrayIcon" size={15} />
              Exporter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all" style={{ backgroundColor: 'rgba(255,255,255,0.95)', color: 'var(--shifa-blue)' }}>
              <Icon name="BellAlertIcon" size={15} />
              Alertes
            </button>
          </div>
        </div>

        {/* Quick stats bar */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { label: 'Établissements', value: '2 847', icon: 'BuildingOffice2Icon' },
            { label: 'Professionnels', value: '48 320', icon: 'UserGroupIcon' },
            { label: 'Programmes actifs', value: '18', icon: 'ClipboardDocumentListIcon' },
            { label: 'Alertes actives', value: '5', icon: 'ExclamationTriangleIcon' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div className="flex items-center gap-2 mb-1">
                <Icon name={stat.icon as any} size={14} className="text-white opacity-80" />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{stat.label}</span>
              </div>
              <p className="text-xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin mb-6 pb-1">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-150 ${activeTab === tab.key ? 'shadow-shifa' : ''}`}
            style={{ backgroundColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--card)', color: activeTab === tab.key ? 'white' : 'var(--muted-foreground)', borderColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--border)' }}>
            <Icon name={tab.icon as any} size={15} />{tab.label}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      {activeTab === 'tab-overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="rounded-2xl border p-5 transition-all hover:shadow-md" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: kpi.bg }}>
                    <Icon name={kpi.icon as any} size={18} style={{ color: kpi.color }} />
                  </div>
                </div>
                <p className="text-2xl font-bold mb-0.5" style={{ color: 'var(--shifa-dark)' }}>{kpi.value}</p>
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{kpi.label}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.sub}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Exécution budgétaire (%)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={budgetTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="annee" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="execute" fill="var(--shifa-blue)" radius={[4,4,0,0]} name="Exécuté %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Répartition des établissements</h3>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={180}>
                  <PieChart>
                    <Pie data={facilityTypeData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="count">
                      {facilityTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {facilityTypeData.map((item) => (
                    <div key={item.type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.type}</span>
                      </div>
                      <span className="text-xs font-bold" style={{ color: 'var(--shifa-dark)' }}>{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tab-facilities' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Registre des établissements</h3>
            <button className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"><Icon name="PlusIcon" size={13} />Ajouter</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--shifa-surface)' }}>
                  {['Établissement', 'Type', 'Région', 'Lits', 'Statut', 'Accréditation', 'Dernière inspection'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {facilities.map((f, i) => (
                  <tr key={f.id} className="border-t hover:bg-opacity-50 transition-colors" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--shifa-surface)' }}>
                    <td className="px-4 py-3 font-semibold text-sm" style={{ color: 'var(--shifa-dark)' }}>{f.nom}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{f.type}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{f.region}</td>
                    <td className="px-4 py-3 text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{f.lits}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: f.statut === 'actif' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', color: f.statut === 'actif' ? 'var(--shifa-green)' : 'var(--shifa-amber)' }}>
                        {f.statut}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{f.accreditation}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{f.derniere_inspection}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'tab-professionals' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Annuaire des professionnels de santé</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--shifa-surface)' }}>
                  {['Professionnel', 'Spécialité', 'Région', 'Établissement', 'Statut', 'Licence'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {professionals.map((p, i) => (
                  <tr key={p.id} className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--shifa-surface)' }}>
                    <td className="px-4 py-3 font-semibold text-sm" style={{ color: 'var(--shifa-dark)' }}>{p.nom}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.specialite}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.region}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.etablissement}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: p.statut === 'actif' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', color: p.statut === 'actif' ? 'var(--shifa-green)' : 'var(--shifa-red)' }}>
                        {p.statut}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{p.licence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'tab-programs' && (
        <div className="grid gap-4">
          {programs.map((prog) => (
            <div key={prog.id} className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--shifa-dark)' }}>{prog.titre}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)' }}>{prog.axe}</span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{prog.responsable}</span>
                  </div>
                </div>
                <span className="text-sm font-bold shrink-0" style={{ color: 'var(--shifa-blue)' }}>{prog.avancement}%</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--shifa-surface)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${prog.avancement}%`, background: 'linear-gradient(90deg, var(--shifa-blue), var(--shifa-cyan))' }} />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Budget: {prog.budget}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' }}>{prog.statut}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'tab-alerts' && (
        <div className="grid gap-4">
          {epidemioAlerts.map((alert) => (
            <div key={alert.id} className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: alert.niveau === 'national' ? 'rgba(239,68,68,0.3)' : 'var(--border)' }}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: alert.statut === 'actif' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)' }}>
                    <Icon name="ExclamationTriangleIcon" size={18} style={{ color: alert.statut === 'actif' ? 'var(--shifa-red)' : 'var(--shifa-green)' }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>{alert.maladie}</h3>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{alert.region} · {alert.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: alert.niveau === 'national' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)', color: alert.niveau === 'national' ? 'var(--shifa-red)' : 'var(--shifa-amber)' }}>
                    {alert.niveau}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: alert.statut === 'actif' ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)', color: alert.statut === 'actif' ? 'var(--shifa-red)' : 'var(--shifa-green)' }}>
                    {alert.statut}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'var(--shifa-surface)' }}>
                  <p className="text-lg font-bold" style={{ color: 'var(--shifa-dark)' }}>{alert.cas}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Cas</p>
                </div>
                <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'var(--shifa-surface)' }}>
                  <p className="text-lg font-bold" style={{ color: alert.deces > 0 ? 'var(--shifa-red)' : 'var(--shifa-green)' }}>{alert.deces}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Décès</p>
                </div>
                <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'var(--shifa-surface)' }}>
                  <p className="text-xs font-semibold" style={{ color: 'var(--shifa-blue)' }}>{alert.reponse}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'tab-exports' && (
        <div className="grid gap-4">
          {exports.map((exp) => (
            <div key={exp.id} className="rounded-2xl border p-5 flex items-center justify-between gap-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.08)' }}>
                  <Icon name="DocumentArrowDownIcon" size={18} style={{ color: 'var(--shifa-blue)' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--shifa-dark)' }}>{exp.titre}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{exp.format} · {exp.taille} · {exp.date}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Destinataire: {exp.destinataire}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: exp.niveau_acces === 'public' ? 'rgba(16,185,129,0.12)' : exp.niveau_acces === 'restreint' ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)', color: exp.niveau_acces === 'public' ? 'var(--shifa-green)' : exp.niveau_acces === 'restreint' ? 'var(--shifa-amber)' : 'var(--shifa-red)' }}>
                  {exp.niveau_acces}
                </span>
                <button className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5">
                  <Icon name="ArrowDownTrayIcon" size={13} />
                  Télécharger
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
