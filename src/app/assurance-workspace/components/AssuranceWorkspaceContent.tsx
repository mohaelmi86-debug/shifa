'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const tabs = [
  { key: 'tab-overview', label: 'Tableau de bord', icon: 'Squares2X2Icon' },
  { key: 'tab-eligibility', label: 'Éligibilité membres', icon: 'IdentificationIcon' },
  { key: 'tab-policies', label: 'Polices de couverture', icon: 'DocumentCheckIcon' },
  { key: 'tab-claims', label: 'Traitement sinistres', icon: 'ClipboardDocumentListIcon' },
  { key: 'tab-preauth', label: 'Pré-autorisations', icon: 'ShieldCheckIcon' },
  { key: 'tab-network', label: 'Réseau prestataires', icon: 'BuildingOffice2Icon' },
];

const kpis = [
  { label: 'Membres actifs', value: '284 720', sub: '+4 180 ce mois', icon: 'UsersIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Sinistres en cours', value: '3 847', sub: 'Valeur: 58.4M FCFA', icon: 'ClipboardDocumentListIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)' },
  { label: 'Pré-autorisations', value: '412', sub: '89 urgentes', icon: 'ShieldCheckIcon', color: 'var(--shifa-purple)', bg: 'rgba(123,94,167,0.08)' },
  { label: 'Taux de règlement', value: '96.8%', sub: '+2.1% vs mois dernier', icon: 'CheckCircleIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
  { label: 'Prestataires réseau', value: '648', sub: '124 hôpitaux, 524 autres', icon: 'BuildingOffice2Icon', color: '#0EA5E9', bg: 'rgba(14,165,233,0.08)' },
  { label: 'Ratio sinistres/primes', value: '72.4%', sub: 'Seuil: 80%', icon: 'ChartBarIcon', color: 'var(--shifa-red)', bg: 'rgba(239,68,68,0.08)' },
];

const members = [
  { id: 'mem-001', nom: 'Aïcha Diallo', numero: 'INS-2025-7K4D', plan: 'Famille Plus', statut: 'eligible', cotisation: 'À jour', expire: '31 déc. 2026', dependants: 3 },
  { id: 'mem-002', nom: 'Mamadou Ndiaye', numero: 'INS-2024-3R8F', plan: 'Individuel Standard', statut: 'eligible', cotisation: 'À jour', expire: '30 juin 2027', dependants: 0 },
  { id: 'mem-003', nom: 'Fatou Sarr', numero: 'INS-2023-9P2L', plan: 'Famille', statut: 'suspendu', cotisation: 'Retard 2 mois', expire: '31 mars 2027', dependants: 2 },
  { id: 'mem-004', nom: 'Ibrahima Koné', numero: 'INS-2025-1M6T', plan: 'Famille Plus', statut: 'eligible', cotisation: 'À jour', expire: '31 déc. 2026', dependants: 4 },
  { id: 'mem-005', nom: 'Mariama Balde', numero: 'INS-2022-5X0Q', plan: 'Individuel Premium', statut: 'eligible', cotisation: 'À jour', expire: '31 jan. 2027', dependants: 0 },
  { id: 'mem-006', nom: 'Cheikh Diop', numero: 'INS-2026-2B9R', plan: 'Famille', statut: 'en_attente', cotisation: 'Nouveau', expire: '31 août 2027', dependants: 1 },
];

const policies = [
  { id: 'pol-001', nom: 'Famille Plus', type: 'Famille', prime_mensuelle: '45 000 FCFA', plafond_annuel: '5M FCFA', taux_remboursement: '80%', membres: 48420, hospitalisation: true, dentaire: true, optique: true, maternite: true },
  { id: 'pol-002', nom: 'Individuel Standard', type: 'Individuel', prime_mensuelle: '18 000 FCFA', plafond_annuel: '2M FCFA', taux_remboursement: '70%', membres: 92840, hospitalisation: true, dentaire: false, optique: false, maternite: false },
  { id: 'pol-003', nom: 'Individuel Premium', type: 'Individuel', prime_mensuelle: '32 000 FCFA', plafond_annuel: '4M FCFA', taux_remboursement: '85%', membres: 38200, hospitalisation: true, dentaire: true, optique: true, maternite: false },
  { id: 'pol-004', nom: 'Famille', type: 'Famille', prime_mensuelle: '28 000 FCFA', plafond_annuel: '3M FCFA', taux_remboursement: '75%', membres: 62480, hospitalisation: true, dentaire: false, optique: false, maternite: true },
  { id: 'pol-005', nom: 'Entreprise Collective', type: 'Groupe', prime_mensuelle: '12 000 FCFA/pers', plafond_annuel: '2.5M FCFA', taux_remboursement: '80%', membres: 42780, hospitalisation: true, dentaire: true, optique: false, maternite: true },
];

const claims = [
  { id: 'clm-001', membre: 'Aïcha Diallo', numero: 'CLM-2026-08-4821', acte: 'Hospitalisation — Appendicite', montant_reclame: '380 000 FCFA', montant_approuve: '304 000 FCFA', date: '08 août 2026', statut: 'en_cours', prestataire: 'CHU de Dakar' },
  { id: 'clm-002', membre: 'Mamadou Ndiaye', numero: 'CLM-2026-08-4820', acte: 'Consultation spécialiste — Cardiologie', montant_reclame: '25 000 FCFA', montant_approuve: '17 500 FCFA', date: '07 août 2026', statut: 'approuvé', prestataire: 'Clinique du Cap-Vert' },
  { id: 'clm-003', membre: 'Ibrahima Koné', numero: 'CLM-2026-08-4819', acte: 'Bilan biologique complet', montant_reclame: '42 000 FCFA', montant_approuve: '31 500 FCFA', date: '06 août 2026', statut: 'payé', prestataire: 'Laboratoire BioSanté' },
  { id: 'clm-004', membre: 'Mariama Balde', numero: 'CLM-2026-08-4818', acte: 'Imagerie — IRM cérébrale', montant_reclame: '185 000 FCFA', montant_approuve: null, date: '05 août 2026', statut: 'en_attente', prestataire: 'Centre Imagerie Dakar' },
  { id: 'clm-005', membre: 'Fatou Sarr', numero: 'CLM-2026-07-4712', acte: 'Médicaments ordonnance chronique', montant_reclame: '28 500 FCFA', montant_approuve: null, date: '30 juil. 2026', statut: 'rejeté', prestataire: 'Pharmacie Centrale' },
  { id: 'clm-006', membre: 'Cheikh Diop', numero: 'CLM-2026-08-4822', acte: 'Chirurgie ambulatoire — Genou', montant_reclame: '620 000 FCFA', montant_approuve: null, date: '09 août 2026', statut: 'en_cours', prestataire: 'CHR Saint-Louis' },
];

const preauths = [
  { id: 'pa-001', membre: 'Aïcha Diallo', acte: 'Chirurgie cardiaque — Pontage', prestataire: 'CHU de Dakar', montant_estime: '2 400 000 FCFA', date_demande: '09 août 2026', urgence: true, statut: 'en_cours' },
  { id: 'pa-002', membre: 'Ibrahima Koné', acte: 'Hospitalisation — Diabète compliqué', prestataire: 'Clinique du Cap-Vert', montant_estime: '480 000 FCFA', date_demande: '08 août 2026', urgence: false, statut: 'approuvé' },
  { id: 'pa-003', membre: 'Mariama Balde', acte: 'IRM + Scanner thoracique', prestataire: 'Centre Imagerie Dakar', montant_estime: '320 000 FCFA', date_demande: '07 août 2026', urgence: false, statut: 'approuvé' },
  { id: 'pa-004', membre: 'Mamadou Ndiaye', acte: 'Chimiothérapie — Cycle 3', prestataire: 'CHU de Dakar', montant_estime: '1 800 000 FCFA', date_demande: '06 août 2026', urgence: true, statut: 'en_cours' },
  { id: 'pa-005', membre: 'Cheikh Diop', acte: 'Rééducation fonctionnelle — 20 séances', prestataire: 'Centre Kiné Dakar', montant_estime: '180 000 FCFA', date_demande: '05 août 2026', urgence: false, statut: 'refusé' },
];

const providers = [
  { id: 'prov-001', nom: 'CHU de Dakar', type: 'Hôpital universitaire', region: 'Dakar', taux_convention: '80%', statut: 'actif', sinistres_ytd: 1840, expire: '31 déc. 2026' },
  { id: 'prov-002', nom: 'Clinique du Cap-Vert', type: 'Clinique privée', region: 'Dakar', taux_convention: '70%', statut: 'actif', sinistres_ytd: 624, expire: '30 juin 2027' },
  { id: 'prov-003', nom: 'CHR Saint-Louis', type: 'Hôpital régional', region: 'Saint-Louis', taux_convention: '80%', statut: 'actif', sinistres_ytd: 412, expire: '31 déc. 2026' },
  { id: 'prov-004', nom: 'Laboratoire BioSanté', type: 'Laboratoire', region: 'Dakar', taux_convention: '85%', statut: 'actif', sinistres_ytd: 2840, expire: '31 mars 2027' },
  { id: 'prov-005', nom: 'Centre Imagerie Dakar', type: 'Imagerie médicale', region: 'Dakar', taux_convention: '75%', statut: 'actif', sinistres_ytd: 980, expire: '31 jan. 2027' },
  { id: 'prov-006', nom: 'Pharmacie Centrale', type: 'Pharmacie', region: 'Dakar', taux_convention: '60%', statut: 'révision', sinistres_ytd: 3240, expire: '31 août 2026' },
];

const claimsMonthly = [
  { mois: 'Mar', sinistres: 3240, regles: 3100 },
  { mois: 'Avr', sinistres: 3480, regles: 3380 },
  { mois: 'Mai', sinistres: 3820, regles: 3700 },
  { mois: 'Jun', sinistres: 3640, regles: 3520 },
  { mois: 'Jul', sinistres: 3920, regles: 3800 },
  { mois: 'Aoû', sinistres: 3847, regles: 3720 },
];

const coveragePieData = [
  { name: 'Famille Plus', value: 48420, color: '#0066FF' },
  { name: 'Individuel Std', value: 92840, color: '#00F2C3' },
  { name: 'Individuel Prem.', value: 38200, color: '#7B5EA7' },
  { name: 'Famille', value: 62480, color: '#F59E0B' },
  { name: 'Entreprise', value: 42780, color: '#0EA5E9' },
];

export default function AssuranceWorkspaceContent() {
  const [activeTab, setActiveTab] = useState('tab-overview');
  const [memberSearch, setMemberSearch] = useState('');

  const filteredMembers = members.filter(m =>
    m.nom.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.numero.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const claimStatusColor = (s: string) => {
    if (s === 'payé') return 'status-completed';
    if (s === 'approuvé') return 'status-active';
    if (s === 'en_cours') return 'status-pending';
    if (s === 'rejeté') return 'status-critical';
    return 'status-pending';
  };

  const claimStatusLabel = (s: string) => {
    if (s === 'payé') return 'Payé';
    if (s === 'approuvé') return 'Approuvé';
    if (s === 'en_cours') return 'En cours';
    if (s === 'en_attente') return 'En attente';
    if (s === 'rejeté') return 'Rejeté';
    return s;
  };

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #0066FF, #00F2C3)' }}>
            <Icon name="ShieldCheckIcon" size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Espace Assureur — Gestion des membres & sinistres</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Éligibilité, polices, sinistres, pré-autorisations et réseau prestataires</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary flex items-center gap-2 text-sm"><Icon name="ArrowDownTrayIcon" size={15} />Exporter</button>
          <button className="btn-primary flex items-center gap-2 text-sm"><Icon name="UserPlusIcon" size={15} />Nouveau membre</button>
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
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Sinistres déclarés vs réglés — 6 derniers mois</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={claimsMonthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="mois" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }} />
                    <Bar dataKey="sinistres" fill="rgba(0,102,255,0.3)" radius={[4, 4, 0, 0]} name="Déclarés" />
                    <Bar dataKey="regles" fill="var(--shifa-blue)" radius={[4, 4, 0, 0]} name="Réglés" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card-base">
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Membres par plan de couverture</h3>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={coveragePieData} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value">
                      {coveragePieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }} formatter={(v: any) => v.toLocaleString()} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                {coveragePieData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} /><span className="text-xs" style={{ color: 'var(--foreground)' }}>{d.name}</span></div>
                    <span className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>{d.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent claims */}
          <div className="card-base">
            <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Sinistres récents — Traitement en cours</h3>
            <div className="flex flex-col gap-2">
              {claims.filter(c => c.statut === 'en_cours' || c.statut === 'en_attente').map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{c.membre}</p>
                      <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{c.numero}</span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.acte} · {c.prestataire}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <p className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>{c.montant_reclame}</p>
                    <span className={`badge-base ${claimStatusColor(c.statut)}`}>{claimStatusLabel(c.statut)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ELIGIBILITY */}
      {activeTab === 'tab-eligibility' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <input type="text" placeholder="Rechercher par nom ou numéro de police..." className="input-field text-sm" style={{ width: '320px' }} value={memberSearch} onChange={(e) => setMemberSearch(e.target.value)} />
            <button className="btn-primary flex items-center gap-2 text-sm"><Icon name="UserPlusIcon" size={15} />Nouveau membre</button>
          </div>
          <div className="card-base overflow-hidden p-0">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                  {['Membre', 'N° Police', 'Plan', 'Dépendants', 'Cotisation', 'Expire le', 'Éligibilité'].map((h) => (
                    <th key={h} className="text-left text-xs font-bold px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((m, i) => (
                  <tr key={m.id} className="hover:bg-muted/50 transition-colors cursor-pointer" style={{ borderBottom: i < filteredMembers.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{m.nom}</td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{m.numero}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--foreground)' }}>{m.plan}</td>
                    <td className="px-4 py-3 text-sm text-center" style={{ color: 'var(--shifa-blue)' }}>{m.dependants}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: m.cotisation === 'À jour' ? 'var(--shifa-green)' : 'var(--shifa-red)' }}>{m.cotisation}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.expire}</td>
                    <td className="px-4 py-3">
                      <span className={`badge-base ${m.statut === 'eligible' ? 'status-active' : m.statut === 'suspendu' ? 'status-critical' : 'status-pending'}`}>
                        {m.statut === 'eligible' ? 'Éligible' : m.statut === 'suspendu' ? 'Suspendu' : 'En attente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* POLICIES */}
      {activeTab === 'tab-policies' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{policies.length} polices de couverture actives</p>
            <button className="btn-primary flex items-center gap-2 text-sm"><Icon name="PlusIcon" size={15} />Nouvelle police</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {policies.map((p) => (
              <div key={p.id} className="card-base hover:shadow-shifa transition-all duration-150">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-base font-bold" style={{ color: 'var(--foreground)' }}>{p.nom}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{p.type}</span>
                  </div>
                  <button className="p-1.5 rounded-lg border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)' }}><Icon name="PencilSquareIcon" size={13} className="text-muted-foreground" /></button>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                    <p style={{ color: 'var(--muted-foreground)' }}>Prime mensuelle</p>
                    <p className="font-bold" style={{ color: 'var(--shifa-blue)' }}>{p.prime_mensuelle}</p>
                  </div>
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                    <p style={{ color: 'var(--muted-foreground)' }}>Plafond annuel</p>
                    <p className="font-bold" style={{ color: 'var(--shifa-green)' }}>{p.plafond_annuel}</p>
                  </div>
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                    <p style={{ color: 'var(--muted-foreground)' }}>Taux remboursement</p>
                    <p className="font-bold" style={{ color: 'var(--foreground)' }}>{p.taux_remboursement}</p>
                  </div>
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                    <p style={{ color: 'var(--muted-foreground)' }}>Membres</p>
                    <p className="font-bold" style={{ color: 'var(--foreground)' }}>{p.membres.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Hospitalisation', active: p.hospitalisation },
                    { label: 'Dentaire', active: p.dentaire },
                    { label: 'Optique', active: p.optique },
                    { label: 'Maternité', active: p.maternite },
                  ].map((g) => (
                    <span key={g.label} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: g.active ? 'rgba(16,185,129,0.1)' : 'var(--muted)', color: g.active ? 'var(--shifa-green)' : 'var(--muted-foreground)' }}>
                      {g.active ? '✓' : '✗'} {g.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CLAIMS */}
      {activeTab === 'tab-claims' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>3 847 sinistres en cours de traitement</p>
            <button className="btn-primary flex items-center gap-2 text-sm"><Icon name="PlusIcon" size={15} />Nouveau sinistre</button>
          </div>
          {claims.map((c) => (
            <div key={c.id} className="card-base hover:shadow-shifa transition-all duration-150">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.08)' }}>
                    <Icon name="ClipboardDocumentListIcon" size={18} style={{ color: 'var(--shifa-blue)' } as any} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{c.membre}</p>
                      <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{c.numero}</span>
                      <span className={`badge-base ${claimStatusColor(c.statut)}`}>{claimStatusLabel(c.statut)}</span>
                    </div>
                    <p className="text-xs mb-0.5" style={{ color: 'var(--foreground)' }}>{c.acte}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.prestataire} · {c.date}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Réclamé</p>
                  <p className="font-bold text-sm" style={{ color: 'var(--shifa-dark)' }}>{c.montant_reclame}</p>
                  {c.montant_approuve && (
                    <>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Approuvé</p>
                      <p className="font-bold text-sm" style={{ color: 'var(--shifa-green)' }}>{c.montant_approuve}</p>
                    </>
                  )}
                  <div className="flex items-center gap-1 mt-1.5 justify-end">
                    <button className="p-1.5 rounded-lg border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)' }}><Icon name="EyeIcon" size={13} className="text-muted-foreground" /></button>
                    {(c.statut === 'en_cours' || c.statut === 'en_attente') && (
                      <button className="p-1.5 rounded-lg border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)' }}><Icon name="CheckIcon" size={13} className="text-muted-foreground" /></button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PRE-AUTHORIZATION */}
      {activeTab === 'tab-preauth' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>412 demandes de pré-autorisation · 89 urgentes</p>
            <button className="btn-primary flex items-center gap-2 text-sm"><Icon name="PlusIcon" size={15} />Nouvelle demande</button>
          </div>
          {preauths.map((pa) => (
            <div key={pa.id} className="card-base hover:shadow-shifa transition-all duration-150" style={pa.urgence ? { borderColor: 'rgba(239,68,68,0.3)', backgroundColor: 'rgba(239,68,68,0.02)' } : {}}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: pa.urgence ? 'rgba(239,68,68,0.1)' : 'rgba(123,94,167,0.1)' }}>
                    <Icon name="ShieldCheckIcon" size={18} style={{ color: pa.urgence ? 'var(--shifa-red)' : 'var(--shifa-purple)' } as any} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{pa.membre}</p>
                      {pa.urgence && <span className="badge-base status-critical">Urgent</span>}
                      <span className={`badge-base ${pa.statut === 'approuvé' ? 'status-active' : pa.statut === 'refusé' ? 'status-critical' : 'status-pending'}`}>
                        {pa.statut === 'approuvé' ? 'Approuvé' : pa.statut === 'refusé' ? 'Refusé' : 'En cours'}
                      </span>
                    </div>
                    <p className="text-xs mb-0.5" style={{ color: 'var(--foreground)' }}>{pa.acte}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{pa.prestataire} · Demandé le {pa.date_demande}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Montant estimé</p>
                  <p className="font-bold text-sm" style={{ color: 'var(--shifa-dark)' }}>{pa.montant_estime}</p>
                  {pa.statut === 'en_cours' && (
                    <div className="flex items-center gap-1 mt-2 justify-end">
                      <button className="px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors" style={{ borderColor: 'var(--shifa-green)', color: 'var(--shifa-green)' }}>Approuver</button>
                      <button className="px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors" style={{ borderColor: 'var(--shifa-red)', color: 'var(--shifa-red)' }}>Refuser</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PROVIDER NETWORK */}
      {activeTab === 'tab-network' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>648 prestataires dans le réseau conventionné</p>
            <button className="btn-primary flex items-center gap-2 text-sm"><Icon name="PlusIcon" size={15} />Ajouter prestataire</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {providers.map((p) => (
              <div key={p.id} className="card-base hover:shadow-shifa transition-all duration-150">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.08)' }}>
                      <Icon name="BuildingOffice2Icon" size={16} style={{ color: 'var(--shifa-blue)' } as any} />
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{p.nom}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.type} · {p.region}</p>
                    </div>
                  </div>
                  <span className={`badge-base ${p.statut === 'actif' ? 'status-active' : 'status-pending'}`}>{p.statut}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div>
                    <p style={{ color: 'var(--muted-foreground)' }}>Taux convention</p>
                    <p className="font-bold" style={{ color: 'var(--shifa-blue)' }}>{p.taux_convention}</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--muted-foreground)' }}>Sinistres YTD</p>
                    <p className="font-bold" style={{ color: 'var(--foreground)' }}>{p.sinistres_ytd.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  <span>Convention expire: <strong style={{ color: 'var(--foreground)' }}>{p.expire}</strong></span>
                  <button className="p-1.5 rounded-lg border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)' }}><Icon name="PencilSquareIcon" size={12} className="text-muted-foreground" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
