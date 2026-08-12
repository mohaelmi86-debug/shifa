'use client';
import React, { useState } from 'react';

import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const tabs = [
  { key: 'tab-dashboard', label: 'Tableau de bord', icon: 'Squares2X2Icon' },
  { key: 'tab-indicateurs', label: 'Indicateurs nationaux', icon: 'ChartBarIcon' },
  { key: 'tab-politiques', label: 'Politiques de santé', icon: 'DocumentTextIcon' },
  { key: 'tab-etablissements', label: 'Établissements', icon: 'BuildingOffice2Icon' },
  { key: 'tab-rapports', label: 'Rapports & Exports', icon: 'ClipboardDocumentCheckIcon' },
];

const kpis = [
  { label: 'Population couverte', value: '18.4M', sub: '+2.1% vs 2025', icon: 'UsersIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Établissements actifs', value: '2 847', sub: '312 hôpitaux, 2535 centres', icon: 'BuildingOffice2Icon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
  { label: 'Professionnels enregistrés', value: '34 210', sub: 'Médecins, infirmiers, sages-femmes', icon: 'UserGroupIcon', color: 'var(--shifa-purple)', bg: 'rgba(123,94,167,0.08)' },
  { label: 'Taux de couverture vaccinale', value: '87.3%', sub: 'Objectif OMS: 90%', icon: 'ShieldCheckIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)' },
];

const mortaliteData = [
  { mois: 'Jan', maternelle: 42, infantile: 28, generale: 65 },
  { mois: 'Fév', maternelle: 38, infantile: 25, generale: 61 },
  { mois: 'Mar', maternelle: 35, infantile: 22, generale: 58 },
  { mois: 'Avr', maternelle: 40, infantile: 26, generale: 63 },
  { mois: 'Mai', maternelle: 33, infantile: 20, generale: 55 },
  { mois: 'Jun', maternelle: 30, infantile: 18, generale: 52 },
];

const maladiesData = [
  { name: 'Paludisme', value: 34, color: '#0066FF' },
  { name: 'Tuberculose', value: 18, color: '#00F2C3' },
  { name: 'VIH/SIDA', value: 12, color: '#7B5EA7' },
  { name: 'Diabète', value: 22, color: '#F59E0B' },
  { name: 'Hypertension', value: 14, color: '#EF4444' },
];

const politiques = [
  { id: 'pol-001', titre: 'Plan National de Développement Sanitaire 2024–2028', statut: 'actif', priorite: 'haute', date: '01 jan. 2024', domaine: 'Stratégie nationale' },
  { id: 'pol-002', titre: 'Programme Élargi de Vaccination — Révision 2026', statut: 'actif', priorite: 'haute', date: '15 mars 2026', domaine: 'Vaccination' },
  { id: 'pol-003', titre: 'Politique de Santé Maternelle et Infantile', statut: 'actif', priorite: 'haute', date: '10 juin 2025', domaine: 'Santé maternelle' },
  { id: 'pol-004', titre: 'Stratégie Nationale de Lutte contre le Paludisme', statut: 'révision', priorite: 'moyenne', date: '20 fév. 2026', domaine: 'Maladies infectieuses' },
  { id: 'pol-005', titre: 'Plan de Digitalisation du Système de Santé', statut: 'actif', priorite: 'haute', date: '01 sept. 2025', domaine: 'Numérique' },
];

const etablissements = [
  { id: 'etab-001', nom: 'CHU de Dakar', type: 'Hôpital universitaire', region: 'Dakar', lits: 850, statut: 'opérationnel' },
  { id: 'etab-002', nom: 'Hôpital Principal de Dakar', type: 'Hôpital général', region: 'Dakar', lits: 600, statut: 'opérationnel' },
  { id: 'etab-003', nom: 'CHR de Saint-Louis', type: 'Centre hospitalier régional', region: 'Saint-Louis', lits: 320, statut: 'opérationnel' },
  { id: 'etab-004', nom: 'CHR de Ziguinchor', type: 'Centre hospitalier régional', region: 'Ziguinchor', lits: 280, statut: 'travaux' },
  { id: 'etab-005', nom: 'Centre de Santé de Thiès', type: 'Centre de santé', region: 'Thiès', lits: 120, statut: 'opérationnel' },
];

export default function EspaceMinistereContent() {
  const [activeTab, setActiveTab] = useState('tab-dashboard');

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #0A1B3D, #0066FF)' }}>
            <Icon name="BuildingLibraryIcon" size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Ministère de la Santé</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Espace de pilotage national — Système de santé</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary flex items-center gap-2 text-sm">
            <Icon name="ArrowDownTrayIcon" size={15} />
            Exporter
          </button>
          <button className="btn-primary flex items-center gap-2 text-sm">
            <Icon name="DocumentPlusIcon" size={15} />
            Nouveau rapport
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin mb-6 pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-150 ${activeTab === tab.key ? 'shadow-shifa' : ''}`}
            style={{
              backgroundColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--card)',
              color: activeTab === tab.key ? 'white' : 'var(--muted-foreground)',
              borderColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--border)',
            }}
          >
            <Icon name={tab.icon as any} size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* DASHBOARD */}
      {activeTab === 'tab-dashboard' && (
        <div className="flex flex-col gap-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="card-base flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: kpi.bg }}>
                  <Icon name={kpi.icon as any} size={20} style={{ color: kpi.color } as any} className="" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
                  <p className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>{kpi.value}</p>
                  <p className="text-xs" style={{ color: kpi.color }}>{kpi.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2 card-base">
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Évolution de la mortalité — 6 mois (pour 100 000 hab.)</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mortaliteData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="mois" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="maternelle" stroke="var(--shifa-red)" strokeWidth={2} dot={false} name="Mortalité maternelle" />
                    <Line type="monotone" dataKey="infantile" stroke="var(--shifa-amber)" strokeWidth={2} dot={false} name="Mortalité infantile" />
                    <Line type="monotone" dataKey="generale" stroke="var(--shifa-blue)" strokeWidth={2} dot={false} name="Mortalité générale" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card-base">
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Charge de morbidité par pathologie</h3>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={maladiesData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value">
                      {maladiesData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-1.5 mt-2">
                {maladiesData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-xs" style={{ color: 'var(--foreground)' }}>{d.name}</span>
                    </div>
                    <span className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alertes nationales */}
          <div className="card-base">
            <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Alertes sanitaires nationales</h3>
            <div className="flex flex-col gap-2">
              {[
                { level: 'critique', msg: 'Épidémie de méningite — Région Nord : 47 cas confirmés, 3 décès', date: 'Aujourd\'hui 09:14' },
                { level: 'warning', msg: 'Rupture de stock vaccin DTP — 12 districts sanitaires concernés', date: 'Hier 16:30' },
                { level: 'info', msg: 'Campagne de vaccination polio — Phase 2 lancée dans 5 régions', date: '08 août 2026' },
              ].map((alert, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border" style={{
                  backgroundColor: alert.level === 'critique' ? 'rgba(239,68,68,0.06)' : alert.level === 'warning' ? 'rgba(245,158,11,0.06)' : 'rgba(0,102,255,0.06)',
                  borderColor: alert.level === 'critique' ? 'rgba(239,68,68,0.2)' : alert.level === 'warning' ? 'rgba(245,158,11,0.2)' : 'rgba(0,102,255,0.2)',
                }}>
                  <Icon name={alert.level === 'critique' ? 'ExclamationCircleIcon' : alert.level === 'warning' ? 'ExclamationTriangleIcon' : 'InformationCircleIcon'} size={16}
                    style={{ color: alert.level === 'critique' ? 'var(--shifa-red)' : alert.level === 'warning' ? 'var(--shifa-amber)' : 'var(--shifa-blue)', flexShrink: 0 } as any} className="mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{alert.msg}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{alert.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* INDICATEURS */}
      {activeTab === 'tab-indicateurs' && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[
              { titre: 'Espérance de vie', valeur: '68.4 ans', evolution: '+0.8 ans', icon: 'HeartIcon', color: 'var(--shifa-red)' },
              { titre: 'Mortalité maternelle', valeur: '315 / 100k', evolution: '-12% vs 2025', icon: 'UserIcon', color: 'var(--shifa-purple)' },
              { titre: 'Mortalité infantile (< 5 ans)', valeur: '42 / 1000', evolution: '-8% vs 2025', icon: 'HeartIcon', color: 'var(--shifa-amber)' },
              { titre: 'Couverture santé universelle', valeur: '62.1%', evolution: '+4.3% vs 2025', icon: 'ShieldCheckIcon', color: 'var(--shifa-green)' },
              { titre: 'Ratio médecin / habitant', valeur: '1 / 5 400', evolution: 'Objectif: 1/1000', icon: 'UserGroupIcon', color: 'var(--shifa-blue)' },
              { titre: 'Dépenses de santé / PIB', valeur: '4.8%', evolution: 'OMS recommande ≥ 5%', icon: 'BanknotesIcon', color: 'var(--shifa-cyan)' },
            ].map((ind) => (
              <div key={ind.titre} className="card-base">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name={ind.icon as any} size={16} style={{ color: ind.color } as any} className="" />
                  <p className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{ind.titre}</p>
                </div>
                <p className="text-2xl font-bold mb-1" style={{ color: 'var(--shifa-dark)' }}>{ind.valeur}</p>
                <p className="text-xs" style={{ color: ind.color }}>{ind.evolution}</p>
              </div>
            ))}
          </div>
          <div className="card-base">
            <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Couverture vaccinale par région (%)</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { region: 'Dakar', val: 92 }, { region: 'Thiès', val: 88 }, { region: 'Saint-Louis', val: 85 },
                  { region: 'Ziguinchor', val: 79 }, { region: 'Tambacounda', val: 74 }, { region: 'Kolda', val: 71 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="region" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="val" fill="var(--shifa-blue)" radius={[6, 6, 0, 0]} name="Couverture (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* POLITIQUES */}
      {activeTab === 'tab-politiques' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{politiques.length} politiques enregistrées</p>
            <button className="btn-primary flex items-center gap-2 text-sm">
              <Icon name="PlusIcon" size={15} />
              Nouvelle politique
            </button>
          </div>
          {politiques.map((pol) => (
            <div key={pol.id} className="card-base hover:shadow-shifa transition-all duration-150 cursor-pointer">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.08)' }}>
                    <Icon name="DocumentTextIcon" size={18} style={{ color: 'var(--shifa-blue)' } as any} className="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{pol.titre}</p>
                      <span className={`badge-base ${pol.statut === 'actif' ? 'status-active' : 'status-pending'}`}>{pol.statut === 'actif' ? 'Actif' : 'En révision'}</span>
                      <span className={`badge-base ${pol.priorite === 'haute' ? 'status-critical' : 'status-pending'}`}>{pol.priorite === 'haute' ? 'Priorité haute' : 'Priorité moyenne'}</span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{pol.domaine} · Publié le {pol.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="p-2 rounded-xl border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)' }}><Icon name="PencilSquareIcon" size={14} className="text-muted-foreground" /></button>
                  <button className="p-2 rounded-xl border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)' }}><Icon name="ArrowDownTrayIcon" size={14} className="text-muted-foreground" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ÉTABLISSEMENTS */}
      {activeTab === 'tab-etablissements' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>2 847 établissements enregistrés</p>
            <div className="flex items-center gap-2">
              <input type="text" placeholder="Rechercher..." className="input-field text-sm" style={{ width: '220px' }} />
              <button className="btn-secondary flex items-center gap-2 text-sm"><Icon name="FunnelIcon" size={14} />Filtrer</button>
            </div>
          </div>
          <div className="card-base overflow-hidden p-0">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                  {['Établissement', 'Type', 'Région', 'Lits', 'Statut'].map((h) => (
                    <th key={h} className="text-left text-xs font-bold px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {etablissements.map((e, i) => (
                  <tr key={e.id} className="hover:bg-muted/50 transition-colors cursor-pointer" style={{ borderBottom: i < etablissements.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{e.nom}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{e.type}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{e.region}</td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--foreground)' }}>{e.lits}</td>
                    <td className="px-4 py-3">
                      <span className={`badge-base ${e.statut === 'opérationnel' ? 'status-active' : 'status-pending'}`}>{e.statut}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RAPPORTS */}
      {activeTab === 'tab-rapports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[
            { titre: 'Rapport annuel de santé 2025', type: 'PDF', taille: '4.2 MB', date: '15 jan. 2026', icon: 'DocumentTextIcon' },
            { titre: 'Bulletin épidémiologique — Juillet 2026', type: 'PDF', taille: '1.8 MB', date: '05 août 2026', icon: 'ChartBarIcon' },
            { titre: 'Statistiques hospitalières T2 2026', type: 'XLSX', taille: '2.1 MB', date: '01 août 2026', icon: 'TableCellsIcon' },
            { titre: 'Rapport couverture vaccinale 2026', type: 'PDF', taille: '3.4 MB', date: '20 juil. 2026', icon: 'ShieldCheckIcon' },
            { titre: 'Analyse ressources humaines santé', type: 'PDF', taille: '2.9 MB', date: '10 juil. 2026', icon: 'UserGroupIcon' },
            { titre: 'Cartographie des établissements', type: 'GeoJSON', taille: '8.7 MB', date: '01 juil. 2026', icon: 'MapPinIcon' },
          ].map((r) => (
            <div key={r.titre} className="card-base hover:shadow-shifa transition-all duration-150 cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.08)' }}>
                  <Icon name={r.icon as any} size={18} style={{ color: 'var(--shifa-blue)' } as any} className="" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{r.titre}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.type} · {r.taille} · {r.date}</p>
                </div>
              </div>
              <button className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl border text-xs font-semibold transition-colors hover:bg-muted" style={{ borderColor: 'var(--border)', color: 'var(--shifa-blue)' }}>
                <Icon name="ArrowDownTrayIcon" size={13} />
                Télécharger
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
