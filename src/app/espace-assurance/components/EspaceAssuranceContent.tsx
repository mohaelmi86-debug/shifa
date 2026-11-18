'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const tabs = [
  { key: 'tab-dashboard', label: 'Tableau de bord', icon: 'Squares2X2Icon' },
  { key: 'tab-adherents', label: 'Adhérents', icon: 'UsersIcon' },
  { key: 'tab-remboursements', label: 'Remboursements', icon: 'BanknotesIcon' },
  { key: 'tab-conventions', label: 'Conventions', icon: 'DocumentCheckIcon' },
  { key: 'tab-rapports', label: 'Rapports', icon: 'ChartBarIcon' },
];

const kpis = [
  { label: 'Adhérents actifs', value: '142 380', sub: '+3 240 ce mois', icon: 'UsersIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Remboursements en attente', value: '1 847', sub: 'Valeur: 28.4M FCFA', icon: 'ClockIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)' },
  { label: 'Taux de remboursement', value: '94.2%', sub: '+1.8% vs mois dernier', icon: 'CheckCircleIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
  { label: 'Établissements conventionnés', value: '312', sub: '48 hôpitaux, 264 centres', icon: 'BuildingOffice2Icon', color: 'var(--shifa-purple)', bg: 'rgba(123,94,167,0.08)' },
];

const remboursementsData = [
  { mois: 'Mar', montant: 42 }, { mois: 'Avr', montant: 48 }, { mois: 'Mai', montant: 45 },
  { mois: 'Jun', montant: 52 }, { mois: 'Jul', montant: 58 }, { mois: 'Aoû', montant: 61 },
];

const actesPieData = [
  { name: 'Consultations', value: 38, color: '#0066FF' },
  { name: 'Hospitalisations', value: 22, color: '#00F2C3' },
  { name: 'Médicaments', value: 28, color: '#7B5EA7' },
  { name: 'Biologie', value: 12, color: '#F59E0B' },
];

const adherents = [
  { id: 'adh-001', nom: 'Aïcha Diallo', numero: 'ASS-2025-7K4D', statut: 'actif', plan: 'Famille Plus', cotisation: 'À jour', depuis: 'Jan. 2022' },
  { id: 'adh-002', nom: 'Mamadou Ndiaye', numero: 'ASS-2024-3R8F', statut: 'actif', plan: 'Individuel', cotisation: 'À jour', depuis: 'Mar. 2024' },
  { id: 'adh-003', nom: 'Fatou Sarr', numero: 'ASS-2023-9P2L', statut: 'suspendu', plan: 'Famille', cotisation: 'Retard 2 mois', depuis: 'Juin 2023' },
  { id: 'adh-004', nom: 'Ibrahima Koné', numero: 'ASS-2025-1M6T', statut: 'actif', plan: 'Famille Plus', cotisation: 'À jour', depuis: 'Fév. 2025' },
  { id: 'adh-005', nom: 'Mariama Balde', numero: 'ASS-2022-5X0Q', statut: 'actif', plan: 'Individuel', cotisation: 'À jour', depuis: 'Oct. 2022' },
];

const remboursements = [
  { id: 'rem-001', adherent: 'Aïcha Diallo', acte: 'Consultation spécialiste', montant: '15 000 FCFA', date: '05 août 2026', statut: 'traité' },
  { id: 'rem-002', adherent: 'Mamadou Ndiaye', acte: 'Hospitalisation 3 jours', montant: '180 000 FCFA', date: '02 août 2026', statut: 'en_cours' },
  { id: 'rem-003', adherent: 'Ibrahima Koné', acte: 'Bilan biologique complet', montant: '42 000 FCFA', date: '01 août 2026', statut: 'traité' },
  { id: 'rem-004', adherent: 'Mariama Balde', acte: 'Médicaments ordonnance', montant: '28 500 FCFA', date: '30 juil. 2026', statut: 'en_attente' },
  { id: 'rem-005', adherent: 'Fatou Sarr', acte: 'Imagerie médicale', montant: '65 000 FCFA', date: '28 juil. 2026', statut: 'rejeté' },
];

export default function EspaceAssuranceContent() {
  const [activeTab, setActiveTab] = useState('tab-dashboard');

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      {/* Premium Page Header — SHIFA design tokens */}
      <div
        className="relative rounded-2xl overflow-hidden mb-8 p-6 lg:p-8"
        style={{
          background: 'linear-gradient(135deg, #0A1B3D 0%, #00B89A 60%, #00F2C3 100%)',
          boxShadow: '0 8px 32px rgba(0,184,154,0.25)',
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.04)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.03)', transform: 'translateY(40%)' }} />

        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
            >
              <Icon name="ShieldCheckIcon" size={26} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}>
                  Assurance Maladie / Mutuelle
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>
                Espace Assurance
              </h1>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.72)' }}>
                Gestion des adhérents, remboursements et conventions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Icon name="ArrowDownTrayIcon" size={15} />
              Exporter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'rgba(255,255,255,0.95)', color: '#0A1B3D' }}>
              <Icon name="UserPlusIcon" size={15} />
              Nouvel adhérent
            </button>
          </div>
        </div>

        {/* Quick stats bar */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { label: 'Adhérents actifs', value: '142 380', icon: 'UsersIcon' },
            { label: 'En attente', value: '1 847', icon: 'ClockIcon' },
            { label: 'Taux remboursement', value: '94.2%', icon: 'CheckCircleIcon' },
            { label: 'Établissements', value: '312', icon: 'BuildingOffice2Icon' },
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

      {/* Dashboard Tab */}
      {activeTab === 'tab-dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Remboursements mensuels (M FCFA)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={remboursementsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="mois" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="montant" fill="var(--shifa-cyan)" radius={[4,4,0,0]} name="Montant (M)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Répartition des actes</h3>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={180}>
                  <PieChart>
                    <Pie data={actesPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value">
                      {actesPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {actesPieData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.name}</span>
                      </div>
                      <span className="text-xs font-bold" style={{ color: 'var(--shifa-dark)' }}>{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tab-adherents' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Liste des adhérents</h3>
            <button className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"><Icon name="UserPlusIcon" size={13} />Ajouter</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--shifa-surface)' }}>
                  {['Adhérent', 'N° Adhérent', 'Statut', 'Plan', 'Cotisation', 'Depuis'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {adherents.map((a, i) => (
                  <tr key={a.id} className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--shifa-surface)' }}>
                    <td className="px-4 py-3 font-semibold text-sm" style={{ color: 'var(--shifa-dark)' }}>{a.nom}</td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{a.numero}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: a.statut === 'actif' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', color: a.statut === 'actif' ? 'var(--shifa-green)' : 'var(--shifa-red)' }}>
                        {a.statut}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{a.plan}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: a.cotisation === 'À jour' ? 'var(--shifa-green)' : 'var(--shifa-red)' }}>{a.cotisation}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{a.depuis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'tab-remboursements' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Demandes de remboursement</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--shifa-surface)' }}>
                  {['Adhérent', 'Acte médical', 'Montant', 'Date', 'Statut'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {remboursements.map((r, i) => (
                  <tr key={r.id} className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--shifa-surface)' }}>
                    <td className="px-4 py-3 font-semibold text-sm" style={{ color: 'var(--shifa-dark)' }}>{r.adherent}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.acte}</td>
                    <td className="px-4 py-3 text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{r.montant}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.date}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: r.statut === 'traité' ? 'rgba(16,185,129,0.12)' : r.statut === 'en_cours' ? 'rgba(0,102,255,0.10)' : r.statut === 'rejeté' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)', color: r.statut === 'traité' ? 'var(--shifa-green)' : r.statut === 'en_cours' ? 'var(--shifa-blue)' : r.statut === 'rejeté' ? 'var(--shifa-red)' : 'var(--shifa-amber)' }}>
                        {r.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(activeTab === 'tab-conventions' || activeTab === 'tab-rapports') && (
        <div className="rounded-2xl border p-12 flex flex-col items-center justify-center text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(0,102,255,0.08)' }}>
            <Icon name="ClipboardDocumentListIcon" size={24} style={{ color: 'var(--shifa-blue)' }} />
          </div>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--shifa-dark)' }}>Section en cours de développement</p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Cette section sera disponible prochainement.</p>
        </div>
      )}
    </div>
  );
}
