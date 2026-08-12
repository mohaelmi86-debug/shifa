'use client';
import React, { useState } from 'react';
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
  const [facilitySearch, setFacilitySearch] = useState('');
  const [proSearch, setProSearch] = useState('');

  const filteredFacilities = facilities.filter(f =>
    f.nom.toLowerCase().includes(facilitySearch.toLowerCase()) ||
    f.region.toLowerCase().includes(facilitySearch.toLowerCase())
  );
  const filteredPros = professionals.filter(p =>
    p.nom.toLowerCase().includes(proSearch.toLowerCase()) ||
    p.specialite.toLowerCase().includes(proSearch.toLowerCase())
  );

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #0A1B3D, #0066FF)' }}>
            <Icon name="BuildingLibraryIcon" size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Supervision Nationale — Ministère de la Santé</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Registre des établissements, annuaire professionnel, programmes et alertes épidémiologiques</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary flex items-center gap-2 text-sm"><Icon name="ArrowDownTrayIcon" size={15} />Exporter</button>
          <button className="btn-primary flex items-center gap-2 text-sm"><Icon name="PlusIcon" size={15} />Nouveau programme</button>
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

      {/* OVERVIEW */}
      {activeTab === 'tab-overview' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="card-base flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: kpi.bg }}>
                  <Icon name={kpi.icon as any} size={20} style={{ color: kpi.color } as any} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
                  <p className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>{kpi.value}</p>
                  <p className="text-xs" style={{ color: kpi.color }}>{kpi.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2 card-base">
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Taux d'exécution budgétaire santé (%)</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={budgetTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="annee" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }} />
                    <Bar dataKey="execute" fill="var(--shifa-blue)" radius={[6, 6, 0, 0]} name="Exécuté %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card-base">
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Répartition des établissements</h3>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={facilityTypeData} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="count">
                      {facilityTypeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                {facilityTypeData.map((d) => (
                  <div key={d.type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} /><span className="text-xs" style={{ color: 'var(--foreground)' }}>{d.type}</span></div>
                    <span className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Programs summary */}
          <div className="card-base">
            <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Avancement des programmes nationaux prioritaires</h3>
            <div className="flex flex-col gap-3">
              {programs.slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold truncate" style={{ color: 'var(--foreground)' }}>{p.titre}</p>
                      <span className="text-xs font-bold ml-2 shrink-0" style={{ color: 'var(--foreground)' }}>{p.avancement}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className="h-1.5 rounded-full" style={{ width: `${p.avancement}%`, backgroundColor: p.avancement >= 70 ? 'var(--shifa-green)' : p.avancement >= 40 ? 'var(--shifa-blue)' : 'var(--shifa-amber)' }} />
                    </div>
                  </div>
                  <span className="badge-base status-active shrink-0">{p.axe}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FACILITIES */}
      {activeTab === 'tab-facilities' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <input type="text" placeholder="Rechercher un établissement ou une région..." className="input-field text-sm" style={{ width: '320px' }} value={facilitySearch} onChange={(e) => setFacilitySearch(e.target.value)} />
            <button className="btn-primary flex items-center gap-2 text-sm"><Icon name="PlusIcon" size={15} />Enregistrer établissement</button>
          </div>
          <div className="card-base overflow-hidden p-0">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                  {['Établissement', 'Type', 'Région', 'Lits', 'Accréditation', 'Dernière inspection', 'Statut'].map((h) => (
                    <th key={h} className="text-left text-xs font-bold px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredFacilities.map((f, i) => (
                  <tr key={f.id} className="hover:bg-muted/50 transition-colors cursor-pointer" style={{ borderBottom: i < filteredFacilities.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{f.nom}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{f.type}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--foreground)' }}>{f.region}</td>
                    <td className="px-4 py-3 text-sm font-bold" style={{ color: 'var(--shifa-blue)' }}>{f.lits}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{f.accreditation}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{f.derniere_inspection}</td>
                    <td className="px-4 py-3"><span className={`badge-base ${f.statut === 'actif' ? 'status-active' : 'status-pending'}`}>{f.statut}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PROFESSIONALS */}
      {activeTab === 'tab-professionals' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <input type="text" placeholder="Rechercher par nom ou spécialité..." className="input-field text-sm" style={{ width: '320px' }} value={proSearch} onChange={(e) => setProSearch(e.target.value)} />
            <button className="btn-primary flex items-center gap-2 text-sm"><Icon name="PlusIcon" size={15} />Enregistrer professionnel</button>
          </div>
          <div className="card-base overflow-hidden p-0">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                  {['Professionnel', 'Spécialité', 'Région', 'Établissement', 'N° Licence', 'Formation', 'Statut'].map((h) => (
                    <th key={h} className="text-left text-xs font-bold px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPros.map((p, i) => (
                  <tr key={p.id} className="hover:bg-muted/50 transition-colors cursor-pointer" style={{ borderBottom: i < filteredPros.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{p.nom}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--shifa-blue)' }}>{p.specialite}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.region}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.etablissement}</td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{p.licence}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.formation}</td>
                    <td className="px-4 py-3"><span className={`badge-base ${p.statut === 'actif' ? 'status-active' : 'status-critical'}`}>{p.statut}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PROGRAMS */}
      {activeTab === 'tab-programs' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{programs.length} programmes nationaux de santé</p>
            <button className="btn-primary flex items-center gap-2 text-sm"><Icon name="PlusIcon" size={15} />Nouveau programme</button>
          </div>
          {programs.map((p) => (
            <div key={p.id} className="card-base hover:shadow-shifa transition-all duration-150">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.08)' }}>
                    <Icon name="ClipboardDocumentListIcon" size={18} style={{ color: 'var(--shifa-blue)' } as any} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{p.titre}</p>
                      <span className="badge-base status-active">{p.statut}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{p.axe}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs flex-wrap" style={{ color: 'var(--muted-foreground)' }}>
                      <span>Responsable: <strong style={{ color: 'var(--foreground)' }}>{p.responsable}</strong></span>
                      <span>Budget: <strong style={{ color: 'var(--shifa-green)' }}>{p.budget}</strong></span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="p-2 rounded-xl border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)' }}><Icon name="PencilSquareIcon" size={14} className="text-muted-foreground" /></button>
                  <button className="p-2 rounded-xl border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)' }}><Icon name="ChartBarIcon" size={14} className="text-muted-foreground" /></button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div className="h-2 rounded-full" style={{ width: `${p.avancement}%`, backgroundColor: p.avancement >= 70 ? 'var(--shifa-green)' : p.avancement >= 40 ? 'var(--shifa-blue)' : 'var(--shifa-amber)' }} />
                </div>
                <span className="text-xs font-bold shrink-0" style={{ color: 'var(--foreground)' }}>{p.avancement}% réalisé</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ALERTS */}
      {activeTab === 'tab-alerts' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{epidemioAlerts.filter(a => a.statut === 'actif').length} alertes actives · {epidemioAlerts.filter(a => a.statut === 'résolu').length} résolue(s)</p>
            <button className="btn-primary flex items-center gap-2 text-sm" style={{ backgroundColor: 'var(--shifa-red)', borderColor: 'var(--shifa-red)' }}>
              <Icon name="ExclamationCircleIcon" size={15} />Déclarer alerte nationale
            </button>
          </div>
          {epidemioAlerts.map((a) => (
            <div key={a.id} className="card-base hover:shadow-shifa transition-all duration-150" style={a.statut === 'actif' && a.niveau === 'national' ? { borderColor: 'rgba(239,68,68,0.3)', backgroundColor: 'rgba(239,68,68,0.02)' } : {}}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: a.niveau === 'national' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)' }}>
                    <Icon name="ExclamationTriangleIcon" size={18} style={{ color: a.niveau === 'national' ? 'var(--shifa-red)' : 'var(--shifa-amber)' } as any} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{a.maladie}</p>
                      <span className={`badge-base ${a.niveau === 'national' ? 'status-critical' : 'status-pending'}`}>{a.niveau}</span>
                      <span className={`badge-base ${a.statut === 'actif' ? 'status-active' : 'status-completed'}`}>{a.statut}</span>
                    </div>
                    <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>{a.region} · Déclaré le {a.date}</p>
                    <div className="flex items-center gap-4 text-xs mb-2">
                      <span style={{ color: 'var(--shifa-red)' }}><strong>{a.cas}</strong> cas</span>
                      <span style={{ color: 'var(--muted-foreground)' }}><strong>{a.deces}</strong> décès</span>
                    </div>
                    <div className="flex items-start gap-2 p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                      <Icon name="CheckCircleIcon" size={13} style={{ color: 'var(--shifa-green)', flexShrink: 0, marginTop: '1px' } as any} />
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Réponse: {a.reponse}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="p-2 rounded-xl border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)' }}><Icon name="PencilSquareIcon" size={14} className="text-muted-foreground" /></button>
                  <button className="p-2 rounded-xl border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)' }}><Icon name="EyeIcon" size={14} className="text-muted-foreground" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EXPORTS */}
      {activeTab === 'tab-exports' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Exports de données autorisés — Accès contrôlé et journalisé</p>
            <button className="btn-primary flex items-center gap-2 text-sm"><Icon name="PlusIcon" size={15} />Générer export</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {exports.map((e) => (
              <div key={e.id} className="card-base hover:shadow-shifa transition-all duration-150">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: e.niveau_acces === 'confidentiel' ? 'rgba(239,68,68,0.08)' : e.niveau_acces === 'restreint' ? 'rgba(245,158,11,0.08)' : 'rgba(0,102,255,0.08)' }}>
                    <Icon name={e.niveau_acces === 'confidentiel' ? 'LockClosedIcon' : 'DocumentTextIcon'} size={18} style={{ color: e.niveau_acces === 'confidentiel' ? 'var(--shifa-red)' : e.niveau_acces === 'restreint' ? 'var(--shifa-amber)' : 'var(--shifa-blue)' } as any} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{e.titre}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{e.format} · {e.taille} · {e.date}</p>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--shifa-blue)' }}>→ {e.destinataire}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`badge-base ${e.niveau_acces === 'confidentiel' ? 'status-critical' : e.niveau_acces === 'restreint' ? 'status-pending' : 'status-active'}`}>{e.niveau_acces}</span>
                  <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors hover:bg-muted ${e.niveau_acces === 'confidentiel' ? 'opacity-50 cursor-not-allowed' : ''}`} style={{ borderColor: 'var(--border)', color: 'var(--shifa-blue)' }} disabled={e.niveau_acces === 'confidentiel'}>
                    <Icon name="ArrowDownTrayIcon" size={12} />Télécharger
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
