'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const tabs = [
  { key: 'tab-dashboard', label: 'Tableau de bord', icon: 'Squares2X2Icon' },
  { key: 'tab-surveillance', label: 'Surveillance épidémio.', icon: 'EyeIcon' },
  { key: 'tab-alertes', label: 'Alertes & Crises', icon: 'ExclamationTriangleIcon' },
  { key: 'tab-programmes', label: 'Programmes nationaux', icon: 'ClipboardDocumentListIcon' },
  { key: 'tab-rapports', label: 'Rapports OMS', icon: 'DocumentTextIcon' },
];

const kpis = [
  { label: 'Maladies sous surveillance', value: '42', sub: '8 à risque épidémique', icon: 'EyeIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Alertes actives', value: '3', sub: '1 critique, 2 modérées', icon: 'ExclamationTriangleIcon', color: 'var(--shifa-red)', bg: 'rgba(239,68,68,0.08)' },
  { label: 'Taux de notification', value: '78.4%', sub: '+5.2% vs 2025', icon: 'ChartBarIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
  { label: 'Laboratoires sentinelles', value: '24', sub: '8 régions couvertes', icon: 'BeakerIcon', color: 'var(--shifa-purple)', bg: 'rgba(123,94,167,0.08)' },
];

const incidenceData = [
  { semaine: 'S28', paludisme: 1240, diarrhee: 820, ira: 640, meningite: 12 },
  { semaine: 'S29', paludisme: 1380, diarrhee: 790, ira: 680, meningite: 18 },
  { semaine: 'S30', paludisme: 1520, diarrhee: 850, ira: 720, meningite: 47 },
  { semaine: 'S31', paludisme: 1460, diarrhee: 810, ira: 700, meningite: 38 },
  { semaine: 'S32', paludisme: 1380, diarrhee: 780, ira: 660, meningite: 29 },
];

const alertes = [
  { id: 'alrt-001', maladie: 'Méningite bactérienne', region: 'Région Nord', cas: 47, deces: 3, niveau: 'critique', date: '08 août 2026', statut: 'actif' },
  { id: 'alrt-002', maladie: 'Choléra', region: 'Zone côtière — Dakar', cas: 12, deces: 0, niveau: 'modéré', date: '05 août 2026', statut: 'actif' },
  { id: 'alrt-003', maladie: 'Rougeole', region: 'Région Est', cas: 28, deces: 1, niveau: 'modéré', date: '01 août 2026', statut: 'actif' },
  { id: 'alrt-004', maladie: 'Fièvre jaune', region: 'Région Sud', cas: 3, deces: 0, niveau: 'faible', date: '25 juil. 2026', statut: 'résolu' },
];

const programmes = [
  { id: 'prog-001', titre: 'Programme National de Lutte contre le Paludisme (PNLP)', responsable: 'Dr. Kofi Mensah', couverture: '100%', statut: 'actif', budget: '1.2 Mds FCFA' },
  { id: 'prog-002', titre: 'Programme Élargi de Vaccination (PEV)', responsable: 'Dr. Aïssatou Balde', couverture: '87.3%', statut: 'actif', budget: '680M FCFA' },
  { id: 'prog-003', titre: 'Programme National de Lutte contre la Tuberculose (PNLT)', responsable: 'Dr. Ibrahima Ndiaye', couverture: '100%', statut: 'actif', budget: '420M FCFA' },
  { id: 'prog-004', titre: 'Programme National de Santé de la Reproduction', responsable: 'Dr. Fatou Diop', couverture: '100%', statut: 'actif', budget: '380M FCFA' },
];

export default function EspaceSantePubliqueContent() {
  const [activeTab, setActiveTab] = useState('tab-dashboard');

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #EF4444, #0066FF)' }}>
            <Icon name="ChartBarIcon" size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Agence de Santé Publique</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Surveillance épidémiologique, alertes et programmes nationaux</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary flex items-center gap-2 text-sm"><Icon name="ArrowDownTrayIcon" size={15} />Exporter</button>
          <button className="btn-primary flex items-center gap-2 text-sm" style={{ backgroundColor: 'var(--shifa-red)', borderColor: 'var(--shifa-red)' }}>
            <Icon name="ExclamationCircleIcon" size={15} />
            Déclarer alerte
          </button>
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

          {/* Alertes actives */}
          <div className="card-base">
            <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Alertes sanitaires actives</h3>
            <div className="flex flex-col gap-2">
              {alertes.filter(a => a.statut === 'actif').map((a) => (
                <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl border" style={{
                  backgroundColor: a.niveau === 'critique' ? 'rgba(239,68,68,0.06)' : a.niveau === 'modéré' ? 'rgba(245,158,11,0.06)' : 'rgba(0,102,255,0.06)',
                  borderColor: a.niveau === 'critique' ? 'rgba(239,68,68,0.2)' : a.niveau === 'modéré' ? 'rgba(245,158,11,0.2)' : 'rgba(0,102,255,0.2)',
                }}>
                  <Icon name={a.niveau === 'critique' ? 'ExclamationCircleIcon' : 'ExclamationTriangleIcon'} size={16}
                    style={{ color: a.niveau === 'critique' ? 'var(--shifa-red)' : 'var(--shifa-amber)', flexShrink: 0 } as any} className="mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{a.maladie}</p>
                      <span className={`badge-base ${a.niveau === 'critique' ? 'status-critical' : 'status-pending'}`}>{a.niveau}</span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{a.region} · {a.cas} cas confirmés · {a.deces} décès · {a.date}</p>
                  </div>
                  <button className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors hover:bg-muted" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                    Gérer
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Incidence chart */}
          <div className="card-base">
            <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Incidence hebdomadaire — Maladies prioritaires (cas notifiés)</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={incidenceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="semaine" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="paludisme" stroke="var(--shifa-blue)" strokeWidth={2} dot={false} name="Paludisme" />
                  <Line type="monotone" dataKey="diarrhee" stroke="var(--shifa-amber)" strokeWidth={2} dot={false} name="Diarrhée" />
                  <Line type="monotone" dataKey="ira" stroke="var(--shifa-green)" strokeWidth={2} dot={false} name="IRA" />
                  <Line type="monotone" dataKey="meningite" stroke="var(--shifa-red)" strokeWidth={2.5} dot={false} name="Méningite" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* SURVEILLANCE */}
      {activeTab === 'tab-surveillance' && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[
              { maladie: 'Paludisme', cas_semaine: 1380, tendance: 'hausse', seuil: 1500, alerte: false },
              { maladie: 'Diarrhée aiguë', cas_semaine: 780, tendance: 'stable', seuil: 1000, alerte: false },
              { maladie: 'IRA', cas_semaine: 660, tendance: 'stable', seuil: 800, alerte: false },
              { maladie: 'Méningite', cas_semaine: 29, tendance: 'baisse', seuil: 20, alerte: true },
              { maladie: 'Choléra', cas_semaine: 12, tendance: 'hausse', seuil: 5, alerte: true },
              { maladie: 'Rougeole', cas_semaine: 28, tendance: 'hausse', seuil: 10, alerte: true },
            ].map((m) => (
              <div key={m.maladie} className="card-base" style={m.alerte ? { borderColor: 'rgba(239,68,68,0.3)', backgroundColor: 'rgba(239,68,68,0.03)' } : {}}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{m.maladie}</p>
                  {m.alerte && <span className="badge-base status-critical">Alerte</span>}
                </div>
                <p className="text-2xl font-bold mb-1" style={{ color: m.alerte ? 'var(--shifa-red)' : 'var(--shifa-dark)' }}>{m.cas_semaine}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>cas cette semaine · Seuil: {m.seuil}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Icon name={m.tendance === 'hausse' ? 'ArrowTrendingUpIcon' : m.tendance === 'baisse' ? 'ArrowTrendingDownIcon' : 'MinusIcon'} size={14}
                    style={{ color: m.tendance === 'hausse' ? 'var(--shifa-red)' : m.tendance === 'baisse' ? 'var(--shifa-green)' : 'var(--muted-foreground)' } as any} className="" />
                  <span className="text-xs" style={{ color: m.tendance === 'hausse' ? 'var(--shifa-red)' : m.tendance === 'baisse' ? 'var(--shifa-green)' : 'var(--muted-foreground)' }}>
                    Tendance: {m.tendance}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ALERTES */}
      {activeTab === 'tab-alertes' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>3 alertes actives · 1 résolue</p>
            <button className="btn-primary flex items-center gap-2 text-sm" style={{ backgroundColor: 'var(--shifa-red)', borderColor: 'var(--shifa-red)' }}>
              <Icon name="PlusIcon" size={15} />Déclarer alerte
            </button>
          </div>
          {alertes.map((a) => (
            <div key={a.id} className="card-base hover:shadow-shifa transition-all duration-150">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: a.niveau === 'critique' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)' }}>
                    <Icon name="ExclamationTriangleIcon" size={18} style={{ color: a.niveau === 'critique' ? 'var(--shifa-red)' : 'var(--shifa-amber)' } as any} className="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{a.maladie}</p>
                      <span className={`badge-base ${a.niveau === 'critique' ? 'status-critical' : a.niveau === 'modéré' ? 'status-pending' : 'status-active'}`}>{a.niveau}</span>
                      <span className={`badge-base ${a.statut === 'actif' ? 'status-active' : 'status-completed'}`}>{a.statut}</span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{a.region} · Déclaré le {a.date}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs">
                      <span style={{ color: 'var(--shifa-red)' }}><strong>{a.cas}</strong> cas confirmés</span>
                      <span style={{ color: 'var(--muted-foreground)' }}><strong>{a.deces}</strong> décès</span>
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

      {/* PROGRAMMES */}
      {activeTab === 'tab-programmes' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Programmes nationaux de santé publique</p>
            <button className="btn-primary flex items-center gap-2 text-sm"><Icon name="PlusIcon" size={15} />Nouveau programme</button>
          </div>
          {programmes.map((p) => (
            <div key={p.id} className="card-base hover:shadow-shifa transition-all duration-150">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.08)' }}>
                    <Icon name="ClipboardDocumentListIcon" size={18} style={{ color: 'var(--shifa-blue)' } as any} className="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{p.titre}</p>
                      <span className="badge-base status-active">{p.statut}</span>
                    </div>
                    <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Responsable: {p.responsable}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span style={{ color: 'var(--shifa-blue)' }}>Couverture: <strong>{p.couverture}</strong></span>
                      <span style={{ color: 'var(--shifa-green)' }}>Budget: <strong>{p.budget}</strong></span>
                    </div>
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

      {/* RAPPORTS OMS */}
      {activeTab === 'tab-rapports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[
            { titre: 'Rapport hebdomadaire épidémiologique — S32 2026', type: 'PDF', taille: '1.4 MB', date: '10 août 2026', dest: 'OMS / Ministère' },
            { titre: 'Bulletin mensuel de surveillance — Juillet 2026', type: 'PDF', taille: '2.8 MB', date: '05 août 2026', dest: 'OMS / CEDEAO' },
            { titre: 'Rapport annuel santé publique 2025', type: 'PDF', taille: '8.2 MB', date: '15 jan. 2026', dest: 'OMS / Ministère' },
            { titre: 'Données de surveillance — Export DHIS2', type: 'CSV', taille: '4.1 MB', date: '01 août 2026', dest: 'OMS / AFRO' },
          ].map((r) => (
            <div key={r.titre} className="card-base hover:shadow-shifa transition-all duration-150">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.08)' }}>
                  <Icon name="DocumentTextIcon" size={18} style={{ color: 'var(--shifa-blue)' } as any} className="" />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{r.titre}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.type} · {r.taille} · {r.date}</p>
                  <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--shifa-blue)' }}>→ {r.dest}</p>
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
