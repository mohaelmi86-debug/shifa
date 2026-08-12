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
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #0A1B3D, #00F2C3)' }}>
            <Icon name="ShieldCheckIcon" size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Assurance Maladie / Mutuelle</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Gestion des adhérents, remboursements et conventions</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary flex items-center gap-2 text-sm"><Icon name="ArrowDownTrayIcon" size={15} />Exporter</button>
          <button className="btn-primary flex items-center gap-2 text-sm"><Icon name="UserPlusIcon" size={15} />Nouvel adhérent</button>
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
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2 card-base">
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Montant remboursé — 6 derniers mois (millions FCFA)</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={remboursementsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="mois" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }} />
                    <Bar dataKey="montant" fill="var(--shifa-blue)" radius={[6, 6, 0, 0]} name="Montant (M FCFA)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card-base">
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Répartition par type d'acte</h3>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={actesPieData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value">
                      {actesPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-1.5 mt-2">
                {actesPieData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} /><span className="text-xs" style={{ color: 'var(--foreground)' }}>{d.name}</span></div>
                    <span className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADHÉRENTS */}
      {activeTab === 'tab-adherents' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>142 380 adhérents actifs</p>
            <div className="flex items-center gap-2">
              <input type="text" placeholder="Rechercher un adhérent..." className="input-field text-sm" style={{ width: '240px' }} />
            </div>
          </div>
          <div className="card-base overflow-hidden p-0">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                  {['Adhérent', 'N° Police', 'Plan', 'Cotisation', 'Statut', 'Depuis'].map((h) => (
                    <th key={h} className="text-left text-xs font-bold px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {adherents.map((a, i) => (
                  <tr key={a.id} className="hover:bg-muted/50 transition-colors cursor-pointer" style={{ borderBottom: i < adherents.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{a.nom}</td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{a.numero}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--foreground)' }}>{a.plan}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: a.cotisation === 'À jour' ? 'var(--shifa-green)' : 'var(--shifa-red)' }}>{a.cotisation}</td>
                    <td className="px-4 py-3"><span className={`badge-base ${a.statut === 'actif' ? 'status-active' : 'status-pending'}`}>{a.statut}</span></td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{a.depuis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REMBOURSEMENTS */}
      {activeTab === 'tab-remboursements' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>1 847 demandes en attente</p>
            <button className="btn-primary flex items-center gap-2 text-sm"><Icon name="PlusIcon" size={15} />Nouvelle demande</button>
          </div>
          {remboursements.map((r) => (
            <div key={r.id} className="card-base hover:shadow-shifa transition-all duration-150">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.08)' }}>
                    <Icon name="BanknotesIcon" size={18} style={{ color: 'var(--shifa-blue)' } as any} className="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{r.adherent}</p>
                      <span className={`badge-base ${r.statut === 'traité' ? 'status-completed' : r.statut === 'en_cours' ? 'status-active' : r.statut === 'rejeté' ? 'status-critical' : 'status-pending'}`}>
                        {r.statut === 'traité' ? 'Traité' : r.statut === 'en_cours' ? 'En cours' : r.statut === 'rejeté' ? 'Rejeté' : 'En attente'}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.acte} · {r.date}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-sm" style={{ color: 'var(--shifa-dark)' }}>{r.montant}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <button className="p-1.5 rounded-lg border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)' }}><Icon name="EyeIcon" size={13} className="text-muted-foreground" /></button>
                    <button className="p-1.5 rounded-lg border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)' }}><Icon name="CheckIcon" size={13} className="text-muted-foreground" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONVENTIONS */}
      {activeTab === 'tab-conventions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[
            { nom: 'CHU de Dakar', type: 'Hôpital universitaire', taux: '80%', statut: 'actif', expire: '31 déc. 2026' },
            { nom: 'Clinique du Cap-Vert', type: 'Clinique privée', taux: '70%', statut: 'actif', expire: '30 juin 2027' },
            { nom: 'Laboratoire BioSanté', type: 'Laboratoire', taux: '85%', statut: 'actif', expire: '31 mars 2027' },
            { nom: 'Pharmacie Centrale', type: 'Pharmacie', taux: '60%', statut: 'révision', expire: '31 août 2026' },
            { nom: 'Centre Imagerie Dakar', type: 'Imagerie médicale', taux: '75%', statut: 'actif', expire: '31 jan. 2027' },
            { nom: 'CHR Saint-Louis', type: 'Hôpital régional', taux: '80%', statut: 'actif', expire: '31 déc. 2026' },
          ].map((conv) => (
            <div key={conv.nom} className="card-base hover:shadow-shifa transition-all duration-150">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.08)' }}>
                    <Icon name="BuildingOffice2Icon" size={16} style={{ color: 'var(--shifa-blue)' } as any} className="" />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{conv.nom}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{conv.type}</p>
                  </div>
                </div>
                <span className={`badge-base ${conv.statut === 'actif' ? 'status-active' : 'status-pending'}`}>{conv.statut}</span>
              </div>
              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--muted-foreground)' }}>
                <span>Taux remboursement: <strong style={{ color: 'var(--shifa-blue)' }}>{conv.taux}</strong></span>
                <span>Expire: {conv.expire}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RAPPORTS */}
      {activeTab === 'tab-rapports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[
            { titre: 'Rapport mensuel remboursements — Juillet 2026', type: 'PDF', taille: '2.1 MB', date: '05 août 2026' },
            { titre: 'Analyse sinistralité T2 2026', type: 'PDF', taille: '3.4 MB', date: '01 août 2026' },
            { titre: 'Statistiques adhérents — Bilan semestriel', type: 'XLSX', taille: '1.8 MB', date: '15 juil. 2026' },
            { titre: 'Rapport fraude et contrôle interne', type: 'PDF', taille: '2.7 MB', date: '10 juil. 2026' },
          ].map((r) => (
            <div key={r.titre} className="card-base hover:shadow-shifa transition-all duration-150">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.08)' }}>
                  <Icon name="DocumentTextIcon" size={18} style={{ color: 'var(--shifa-blue)' } as any} className="" />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{r.titre}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.type} · {r.taille} · {r.date}</p>
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
