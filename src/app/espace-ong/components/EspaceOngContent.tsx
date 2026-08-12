'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const tabs = [
  { key: 'tab-dashboard', label: 'Tableau de bord', icon: 'Squares2X2Icon' },
  { key: 'tab-programmes', label: 'Programmes', icon: 'HeartIcon' },
  { key: 'tab-beneficiaires', label: 'Bénéficiaires', icon: 'UsersIcon' },
  { key: 'tab-terrain', label: 'Activités terrain', icon: 'MapPinIcon' },
  { key: 'tab-rapports', label: 'Rapports & Bailleurs', icon: 'DocumentTextIcon' },
];

const kpis = [
  { label: 'Bénéficiaires actifs', value: '28 450', sub: '+1 240 ce trimestre', icon: 'UsersIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Programmes actifs', value: '14', sub: '6 pays d\'intervention', icon: 'HeartIcon', color: 'var(--shifa-red)', bg: 'rgba(239,68,68,0.08)' },
  { label: 'Agents de santé formés', value: '1 820', sub: 'Communautaires & cliniques', icon: 'UserGroupIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
  { label: 'Budget mobilisé', value: '2.4 Mds FCFA', sub: 'Exercice 2026', icon: 'BanknotesIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)' },
];

const activiteData = [
  { mois: 'Mar', consultations: 4200, vaccinations: 1800, formations: 120 },
  { mois: 'Avr', consultations: 4800, vaccinations: 2100, formations: 140 },
  { mois: 'Mai', consultations: 5100, vaccinations: 2400, formations: 160 },
  { mois: 'Jun', consultations: 4900, vaccinations: 2200, formations: 150 },
  { mois: 'Jul', consultations: 5400, vaccinations: 2600, formations: 180 },
  { mois: 'Aoû', consultations: 5800, vaccinations: 2900, formations: 200 },
];

const programmes = [
  { id: 'prog-001', titre: 'Santé maternelle et infantile', zone: 'Régions rurales — Sénégal', beneficiaires: 8400, statut: 'actif', bailleur: 'UNICEF', budget: '480M FCFA' },
  { id: 'prog-002', titre: 'Lutte contre le paludisme', zone: 'Zones endémiques — Casamance', beneficiaires: 12000, statut: 'actif', bailleur: 'Fonds Mondial', budget: '720M FCFA' },
  { id: 'prog-003', titre: 'Nutrition et sécurité alimentaire', zone: 'Zones sahéliennes', beneficiaires: 5200, statut: 'actif', bailleur: 'PAM', budget: '320M FCFA' },
  { id: 'prog-004', titre: 'Formation agents de santé communautaires', zone: 'National', beneficiaires: 1820, statut: 'actif', bailleur: 'OMS', budget: '180M FCFA' },
  { id: 'prog-005', titre: 'Eau, assainissement et hygiène (WASH)', zone: 'Zones péri-urbaines', beneficiaires: 6800, statut: 'révision', bailleur: 'USAID', budget: '240M FCFA' },
];

const activitesTerrain = [
  { id: 'act-001', type: 'Campagne vaccination', lieu: 'District de Kolda', date: '10 août 2026', agents: 24, beneficiaires: 1840, statut: 'en_cours' },
  { id: 'act-002', type: 'Consultation mobile', lieu: 'Villages de Tambacounda', date: '08 août 2026', agents: 12, beneficiaires: 620, statut: 'terminé' },
  { id: 'act-003', type: 'Formation ASC', lieu: 'Centre de Ziguinchor', date: '05 août 2026', agents: 8, beneficiaires: 45, statut: 'terminé' },
  { id: 'act-004', type: 'Distribution moustiquaires', lieu: 'Région de Sédhiou', date: '12 août 2026', agents: 18, beneficiaires: 3200, statut: 'planifié' },
];

export default function EspaceOngContent() {
  const [activeTab, setActiveTab] = useState('tab-dashboard');

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #10B981, #0066FF)' }}>
            <Icon name="HeartIcon" size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>ONG / Organisation Humanitaire</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Gestion des programmes, bénéficiaires et activités terrain</p>
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

      {/* DASHBOARD */}
      {activeTab === 'tab-dashboard' && (
        <div className="flex flex-col gap-6">
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
          <div className="card-base">
            <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Activités terrain — 6 derniers mois</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activiteData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="mois" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="consultations" fill="var(--shifa-blue)" radius={[4, 4, 0, 0]} name="Consultations" />
                  <Bar dataKey="vaccinations" fill="var(--shifa-green)" radius={[4, 4, 0, 0]} name="Vaccinations" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* PROGRAMMES */}
      {activeTab === 'tab-programmes' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>14 programmes actifs</p>
            <button className="btn-primary flex items-center gap-2 text-sm"><Icon name="PlusIcon" size={15} />Nouveau programme</button>
          </div>
          {programmes.map((p) => (
            <div key={p.id} className="card-base hover:shadow-shifa transition-all duration-150">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}>
                    <Icon name="HeartIcon" size={18} style={{ color: 'var(--shifa-green)' } as any} className="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{p.titre}</p>
                      <span className={`badge-base ${p.statut === 'actif' ? 'status-active' : 'status-pending'}`}>{p.statut}</span>
                    </div>
                    <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>{p.zone}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span style={{ color: 'var(--shifa-blue)' }}><strong>{p.beneficiaires.toLocaleString()}</strong> bénéficiaires</span>
                      <span style={{ color: 'var(--muted-foreground)' }}>Bailleur: <strong>{p.bailleur}</strong></span>
                      <span style={{ color: 'var(--shifa-green)' }}>{p.budget}</span>
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

      {/* BÉNÉFICIAIRES */}
      {activeTab === 'tab-beneficiaires' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>28 450 bénéficiaires enregistrés</p>
            <div className="flex items-center gap-2">
              <input type="text" placeholder="Rechercher..." className="input-field text-sm" style={{ width: '220px' }} />
              <button className="btn-secondary flex items-center gap-2 text-sm"><Icon name="FunnelIcon" size={14} />Filtrer</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[
              { nom: 'Kadiatou Bah', programme: 'Santé maternelle', region: 'Kolda', age: '28 ans', statut: 'actif', dernierContact: '02 août 2026' },
              { nom: 'Moussa Camara', programme: 'Lutte paludisme', region: 'Casamance', age: '34 ans', statut: 'actif', dernierContact: '05 août 2026' },
              { nom: 'Hawa Diallo', programme: 'Nutrition', region: 'Tambacounda', age: '22 ans', statut: 'actif', dernierContact: '01 août 2026' },
              { nom: 'Seydou Koné', programme: 'WASH', region: 'Thiès', age: '45 ans', statut: 'inactif', dernierContact: '15 juil. 2026' },
              { nom: 'Mariama Sow', programme: 'Santé maternelle', region: 'Ziguinchor', age: '31 ans', statut: 'actif', dernierContact: '07 août 2026' },
              { nom: 'Ibrahima Diop', programme: 'Formation ASC', region: 'Dakar', age: '38 ans', statut: 'actif', dernierContact: '08 août 2026' },
            ].map((b) => (
              <div key={b.nom} className="card-base hover:shadow-shifa transition-all duration-150 cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                    {b.nom.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{b.nom}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{b.age} · {b.region}</p>
                  </div>
                  <span className={`badge-base ${b.statut === 'actif' ? 'status-active' : 'status-pending'}`}>{b.statut}</span>
                </div>
                <div className="text-xs space-y-1" style={{ color: 'var(--muted-foreground)' }}>
                  <p>Programme: <span style={{ color: 'var(--shifa-blue)' }}>{b.programme}</span></p>
                  <p>Dernier contact: {b.dernierContact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVITÉS TERRAIN */}
      {activeTab === 'tab-terrain' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Activités planifiées et en cours</p>
            <button className="btn-primary flex items-center gap-2 text-sm"><Icon name="PlusIcon" size={15} />Planifier activité</button>
          </div>
          {activitesTerrain.map((a) => (
            <div key={a.id} className="card-base hover:shadow-shifa transition-all duration-150">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.08)' }}>
                    <Icon name="MapPinIcon" size={18} style={{ color: 'var(--shifa-blue)' } as any} className="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{a.type}</p>
                      <span className={`badge-base ${a.statut === 'en_cours' ? 'status-active' : a.statut === 'terminé' ? 'status-completed' : 'status-pending'}`}>
                        {a.statut === 'en_cours' ? 'En cours' : a.statut === 'terminé' ? 'Terminé' : 'Planifié'}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{a.lieu} · {a.date} · {a.agents} agents</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-bold" style={{ color: 'var(--shifa-blue)' }}>{a.beneficiaires.toLocaleString()}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>bénéficiaires</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RAPPORTS */}
      {activeTab === 'tab-rapports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[
            { titre: 'Rapport trimestriel T2 2026 — UNICEF', type: 'PDF', taille: '3.2 MB', date: '15 juil. 2026', bailleur: 'UNICEF' },
            { titre: 'Rapport d\'activité semestriel — Fonds Mondial', type: 'PDF', taille: '4.8 MB', date: '01 août 2026', bailleur: 'Fonds Mondial' },
            { titre: 'Indicateurs de performance — PAM', type: 'XLSX', taille: '1.9 MB', date: '10 juil. 2026', bailleur: 'PAM' },
            { titre: 'Rapport narratif annuel 2025', type: 'PDF', taille: '6.1 MB', date: '15 jan. 2026', bailleur: 'Tous bailleurs' },
          ].map((r) => (
            <div key={r.titre} className="card-base hover:shadow-shifa transition-all duration-150">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}>
                  <Icon name="DocumentTextIcon" size={18} style={{ color: 'var(--shifa-green)' } as any} className="" />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{r.titre}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.type} · {r.taille} · {r.date}</p>
                  <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--shifa-green)' }}>{r.bailleur}</p>
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border text-xs font-semibold transition-colors hover:bg-muted" style={{ borderColor: 'var(--border)', color: 'var(--shifa-blue)' }}>
                <Icon name="ArrowDownTrayIcon" size={13} />Télécharger
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
