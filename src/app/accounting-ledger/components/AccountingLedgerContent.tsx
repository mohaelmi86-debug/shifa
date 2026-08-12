'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Tab = 'dashboard' | 'plan-comptable' | 'journaux' | 'ecritures' | 'grand-livre' | 'balance' | 'bilan' | 'resultat' | 'cloture';

const revenueData = [
  { month: 'Jan', recettes: 485000, depenses: 312000 },
  { month: 'Fév', recettes: 520000, depenses: 298000 },
  { month: 'Mar', recettes: 610000, depenses: 345000 },
  { month: 'Avr', recettes: 578000, depenses: 321000 },
  { month: 'Mai', recettes: 695000, depenses: 378000 },
  { month: 'Jun', recettes: 742000, depenses: 401000 },
  { month: 'Jul', recettes: 688000, depenses: 389000 },
  { month: 'Aoû', recettes: 715000, depenses: 412000 },
];

const planComptable = [
  { classe: '1', libelle: 'Comptes de capitaux', comptes: [
    { numero: '101', libelle: 'Capital social', solde: 5000000, type: 'passif' },
    { numero: '106', libelle: 'Réserves', solde: 1200000, type: 'passif' },
    { numero: '120', libelle: 'Résultat de l\'exercice', solde: 342000, type: 'passif' },
  ]},
  { classe: '2', libelle: 'Comptes d\'immobilisations', comptes: [
    { numero: '211', libelle: 'Terrains', solde: 800000, type: 'actif' },
    { numero: '213', libelle: 'Constructions', solde: 2400000, type: 'actif' },
    { numero: '215', libelle: 'Matériel médical', solde: 1850000, type: 'actif' },
    { numero: '218', libelle: 'Matériel informatique', solde: 320000, type: 'actif' },
  ]},
  { classe: '4', libelle: 'Comptes de tiers', comptes: [
    { numero: '401', libelle: 'Fournisseurs', solde: 245000, type: 'passif' },
    { numero: '411', libelle: 'Clients / Patients', solde: 189000, type: 'actif' },
    { numero: '421', libelle: 'Personnel — Rémunérations', solde: 98000, type: 'passif' },
    { numero: '431', libelle: 'Sécurité sociale', solde: 34000, type: 'passif' },
    { numero: '445', libelle: 'TVA collectée', solde: 28000, type: 'passif' },
  ]},
  { classe: '5', libelle: 'Comptes financiers', comptes: [
    { numero: '512', libelle: 'Banque principale', solde: 1240000, type: 'actif' },
    { numero: '514', libelle: 'Banque secondaire', solde: 380000, type: 'actif' },
    { numero: '530', libelle: 'Caisse', solde: 45000, type: 'actif' },
  ]},
  { classe: '6', libelle: 'Comptes de charges', comptes: [
    { numero: '601', libelle: 'Achats médicaments & consommables', solde: 412000, type: 'charge' },
    { numero: '621', libelle: 'Personnel intérimaire', solde: 78000, type: 'charge' },
    { numero: '641', libelle: 'Rémunérations du personnel', solde: 1890000, type: 'charge' },
    { numero: '681', libelle: 'Dotations aux amortissements', solde: 124000, type: 'charge' },
  ]},
  { classe: '7', libelle: 'Comptes de produits', comptes: [
    { numero: '706', libelle: 'Prestations de soins', solde: 3240000, type: 'produit' },
    { numero: '707', libelle: 'Ventes médicaments', solde: 890000, type: 'produit' },
    { numero: '708', libelle: 'Téléconsultations', solde: 245000, type: 'produit' },
    { numero: '764', libelle: 'Produits financiers', solde: 12000, type: 'produit' },
  ]},
];

const journaux = [
  { code: 'AC', libelle: 'Journal des achats', ecritures: 234, dernierMvt: '2025-08-12' },
  { code: 'VT', libelle: 'Journal des ventes', ecritures: 1847, dernierMvt: '2025-08-12' },
  { code: 'BQ', libelle: 'Journal de banque', ecritures: 412, dernierMvt: '2025-08-12' },
  { code: 'CA', libelle: 'Journal de caisse', ecritures: 89, dernierMvt: '2025-08-11' },
  { code: 'OD', libelle: 'Journal des opérations diverses', ecritures: 67, dernierMvt: '2025-08-10' },
  { code: 'AN', libelle: 'Journal des à-nouveaux', ecritures: 12, dernierMvt: '2025-01-01' },
  { code: 'CL', libelle: 'Journal de clôture', ecritures: 8, dernierMvt: '2024-12-31' },
];

const ecritures = [
  { id: 'ECR-001', date: '2025-08-12', journal: 'VT', compte: '411', libelle: 'Facture patient F-2025-0812-001', debit: 450, credit: 0, piece: 'F-2025-0812-001' },
  { id: 'ECR-002', date: '2025-08-12', journal: 'VT', compte: '706', libelle: 'Consultation Dr. Sy', debit: 0, credit: 450, piece: 'F-2025-0812-001' },
  { id: 'ECR-003', date: '2025-08-12', journal: 'BQ', compte: '512', libelle: 'Règlement patient — virement', debit: 1200, credit: 0, piece: 'VIR-2025-0812' },
  { id: 'ECR-004', date: '2025-08-12', journal: 'BQ', compte: '411', libelle: 'Règlement patient — virement', debit: 0, credit: 1200, piece: 'VIR-2025-0812' },
  { id: 'ECR-005', date: '2025-08-11', journal: 'AC', compte: '601', libelle: 'Achat médicaments — Fournisseur Pharma+', debit: 8500, credit: 0, piece: 'FA-2025-0811-042' },
  { id: 'ECR-006', date: '2025-08-11', journal: 'AC', compte: '401', libelle: 'Achat médicaments — Fournisseur Pharma+', debit: 0, credit: 8500, piece: 'FA-2025-0811-042' },
];

const bilanActif = [
  { poste: 'Immobilisations corporelles nettes', montant: 5370000, variation: '+2.1%' },
  { poste: 'Immobilisations incorporelles', montant: 180000, variation: '-5.0%' },
  { poste: 'Stocks médicaments & consommables', montant: 342000, variation: '+8.3%' },
  { poste: 'Créances clients / patients', montant: 189000, variation: '-12.4%' },
  { poste: 'Disponibilités (banque + caisse)', montant: 1665000, variation: '+15.2%' },
];

const bilanPassif = [
  { poste: 'Capital social', montant: 5000000, variation: '0.0%' },
  { poste: 'Réserves', montant: 1200000, variation: '+4.5%' },
  { poste: 'Résultat de l\'exercice', montant: 342000, variation: '+18.7%' },
  { poste: 'Dettes fournisseurs', montant: 245000, variation: '-8.2%' },
  { poste: 'Dettes sociales & fiscales', montant: 160000, variation: '+2.1%' },
  { poste: 'Emprunts & dettes financières', montant: 799000, variation: '-6.3%' },
];

const compteResultat = [
  { categorie: 'Produits d\'exploitation', items: [
    { libelle: 'Prestations de soins', montant: 3240000 },
    { libelle: 'Ventes médicaments', montant: 890000 },
    { libelle: 'Téléconsultations', montant: 245000 },
    { libelle: 'Autres produits', montant: 12000 },
  ]},
  { categorie: 'Charges d\'exploitation', items: [
    { libelle: 'Achats médicaments & consommables', montant: -412000 },
    { libelle: 'Rémunérations du personnel', montant: -1890000 },
    { libelle: 'Personnel intérimaire', montant: -78000 },
    { libelle: 'Amortissements', montant: -124000 },
    { libelle: 'Autres charges', montant: -541000 },
  ]},
];

export default function AccountingLedgerContent() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [expandedClasse, setExpandedClasse] = useState<string | null>('7');
  const [selectedJournal, setSelectedJournal] = useState<string | null>(null);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: 'Squares2X2Icon' },
    { id: 'plan-comptable', label: 'Plan comptable', icon: 'ListBulletIcon' },
    { id: 'journaux', label: 'Journaux', icon: 'BookOpenIcon' },
    { id: 'ecritures', label: 'Écritures', icon: 'PencilSquareIcon' },
    { id: 'grand-livre', label: 'Grand livre', icon: 'TableCellsIcon' },
    { id: 'balance', label: 'Balance', icon: 'ScaleIcon' },
    { id: 'bilan', label: 'Bilan', icon: 'ChartBarSquareIcon' },
    { id: 'resultat', label: 'Compte de résultat', icon: 'ChartBarIcon' },
    { id: 'cloture', label: 'Clôtures', icon: 'LockClosedIcon' },
  ];

  const totalActif = bilanActif.reduce((s, i) => s + i.montant, 0);
  const totalPassif = bilanPassif.reduce((s, i) => s + i.montant, 0);
  const totalProduits = compteResultat[0].items.reduce((s, i) => s + i.montant, 0);
  const totalCharges = compteResultat[1].items.reduce((s, i) => s + i.montant, 0);
  const resultatNet = totalProduits + totalCharges;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Comptabilité Générale</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Plan comptable · Journaux · Écritures · Grand livre · Balance · Bilan · Compte de résultat
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
            <Icon name="ArrowDownTrayIcon" size={16} />
            Exporter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
            <Icon name="PlusIcon" size={16} />
            Nouvelle écriture
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl border overflow-x-auto" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'shadow-sm' : ''}`}
            style={{
              backgroundColor: activeTab === tab.id ? 'var(--card)' : 'transparent',
              color: activeTab === tab.id ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
            }}
          >
            <Icon name={tab.icon as any} size={14} />
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab: Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Chiffre d\'affaires (YTD)', value: '4 387 000 €', icon: 'BanknotesIcon', color: '#16a34a', bg: '#dcfce7', sub: '+12.4% vs N-1' },
              { label: 'Charges totales (YTD)', value: '3 045 000 €', icon: 'ArrowTrendingDownIcon', color: '#dc2626', bg: '#fee2e2', sub: '+8.1% vs N-1' },
              { label: 'Résultat net', value: '342 000 €', icon: 'ChartBarIcon', color: '#2563eb', bg: '#dbeafe', sub: '+18.7% vs N-1' },
              { label: 'Trésorerie disponible', value: '1 665 000 €', icon: 'BuildingLibraryIcon', color: '#7c3aed', bg: '#ede9fe', sub: 'Banque + Caisse' },
            ].map(kpi => (
              <div key={kpi.label} className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: kpi.bg }}>
                    <Icon name={kpi.icon as any} size={20} style={{ color: kpi.color }} />
                  </div>
                  <div>
                    <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>{kpi.value}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
                  </div>
                </div>
                <p className="text-xs font-medium" style={{ color: kpi.color }}>{kpi.sub}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Recettes vs Dépenses (8 mois)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => `${v.toLocaleString()} €`} />
                <Bar dataKey="recettes" fill="#2563eb" radius={[4, 4, 0, 0]} name="Recettes" />
                <Bar dataKey="depenses" fill="#dc2626" radius={[4, 4, 0, 0]} name="Dépenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tab: Plan comptable */}
      {activeTab === 'plan-comptable' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Plan comptable général</h2>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
              <Icon name="PlusIcon" size={16} />
              Nouveau compte
            </button>
          </div>
          {planComptable.map(classe => (
            <div key={classe.classe} className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={() => setExpandedClasse(expandedClasse === classe.classe ? null : classe.classe)}
                className="w-full flex items-center justify-between px-4 py-3"
                style={{ backgroundColor: 'var(--muted)' }}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>{classe.classe}</span>
                  <span className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{classe.libelle}</span>
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{classe.comptes.length} comptes</span>
                </div>
                <Icon name={expandedClasse === classe.classe ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={16} className="text-muted-foreground" />
              </button>
              {expandedClasse === classe.classe && (
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--background)' }}>
                      {['N° Compte', 'Libellé', 'Solde', 'Type'].map(h => (
                        <th key={h} className="text-left px-4 py-2 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {classe.comptes.map((compte, i) => (
                      <tr key={compte.numero} className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                        <td className="px-4 py-2.5 text-sm font-mono font-semibold" style={{ color: 'var(--shifa-blue)' }}>{compte.numero}</td>
                        <td className="px-4 py-2.5 text-sm" style={{ color: 'var(--foreground)' }}>{compte.libelle}</td>
                        <td className="px-4 py-2.5 text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{compte.solde.toLocaleString()} €</td>
                        <td className="px-4 py-2.5">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{
                            backgroundColor: compte.type === 'actif' ? '#dbeafe' : compte.type === 'passif' ? '#ede9fe' : compte.type === 'charge' ? '#fee2e2' : '#dcfce7',
                            color: compte.type === 'actif' ? '#1d4ed8' : compte.type === 'passif' ? '#7c3aed' : compte.type === 'charge' ? '#dc2626' : '#16a34a',
                          }}>
                            {compte.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab: Journaux */}
      {activeTab === 'journaux' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Journaux comptables</h2>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
              <Icon name="PlusIcon" size={16} />
              Nouveau journal
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {journaux.map(j => (
              <div
                key={j.code}
                onClick={() => setSelectedJournal(j.code)}
                className="rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md"
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: selectedJournal === j.code ? 'var(--shifa-blue)' : 'var(--border)',
                  borderWidth: selectedJournal === j.code ? '2px' : '1px',
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>{j.code}</span>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{j.libelle}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{j.ecritures} écritures</p>
                  </div>
                </div>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Dernier mouvement: {j.dernierMvt}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Écritures */}
      {activeTab === 'ecritures' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Saisie des écritures comptables</h2>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
              <Icon name="PlusIcon" size={16} />
              Nouvelle écriture
            </button>
          </div>
          <div className="rounded-xl border overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
            <table className="w-full min-w-[700px]">
              <thead>
                <tr style={{ backgroundColor: 'var(--muted)' }}>
                  {['ID', 'Date', 'Journal', 'Compte', 'Libellé', 'Débit', 'Crédit', 'Pièce'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ecritures.map((e, i) => (
                  <tr key={e.id} className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                    <td className="px-4 py-2.5 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{e.id}</td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--foreground)' }}>{e.date}</td>
                    <td className="px-4 py-2.5"><span className="text-xs px-2 py-0.5 rounded font-mono font-bold" style={{ backgroundColor: 'var(--muted)', color: 'var(--shifa-blue)' }}>{e.journal}</span></td>
                    <td className="px-4 py-2.5 text-xs font-mono font-semibold" style={{ color: 'var(--shifa-blue)' }}>{e.compte}</td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--foreground)' }}>{e.libelle}</td>
                    <td className="px-4 py-2.5 text-xs font-semibold text-right" style={{ color: e.debit > 0 ? '#16a34a' : 'var(--muted-foreground)' }}>{e.debit > 0 ? `${e.debit.toLocaleString()} €` : '—'}</td>
                    <td className="px-4 py-2.5 text-xs font-semibold text-right" style={{ color: e.credit > 0 ? '#dc2626' : 'var(--muted-foreground)' }}>{e.credit > 0 ? `${e.credit.toLocaleString()} €` : '—'}</td>
                    <td className="px-4 py-2.5 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{e.piece}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Grand livre */}
      {activeTab === 'grand-livre' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Grand livre</h2>
            <input type="text" placeholder="Rechercher un compte..." className="px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
            <input type="date" className="px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
          </div>
          <div className="space-y-4">
            {[
              { compte: '512', libelle: 'Banque principale', soldeOuverture: 1100000, mouvements: [
                { date: '2025-08-01', libelle: 'Règlement patient VIR-001', debit: 1200, credit: 0 },
                { date: '2025-08-05', libelle: 'Paiement fournisseur Pharma+', debit: 0, credit: 8500 },
                { date: '2025-08-12', libelle: 'Règlement patient VIR-2025-0812', debit: 1200, credit: 0 },
              ]},
              { compte: '706', libelle: 'Prestations de soins', soldeOuverture: 3200000, mouvements: [
                { date: '2025-08-12', libelle: 'Consultation Dr. Sy — F-2025-0812-001', debit: 0, credit: 450 },
                { date: '2025-08-11', libelle: 'Consultation Dr. Traoré — F-2025-0811-089', debit: 0, credit: 380 },
              ]},
            ].map(compte => {
              let solde = compte.soldeOuverture;
              return (
                <div key={compte.compte} className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                  <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: 'var(--muted)' }}>
                    <span className="font-mono font-bold text-sm" style={{ color: 'var(--shifa-blue)' }}>{compte.compte}</span>
                    <span className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{compte.libelle}</span>
                    <span className="ml-auto text-sm font-bold" style={{ color: 'var(--foreground)' }}>Solde: {compte.soldeOuverture.toLocaleString()} €</span>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr style={{ backgroundColor: 'var(--background)' }}>
                        {['Date', 'Libellé', 'Débit', 'Crédit', 'Solde cumulé'].map(h => (
                          <th key={h} className="text-left px-4 py-2 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                        <td className="px-4 py-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>01/01/2025</td>
                        <td className="px-4 py-2 text-xs font-medium" style={{ color: 'var(--foreground)' }}>Solde d'ouverture</td>
                        <td className="px-4 py-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>—</td>
                        <td className="px-4 py-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>—</td>
                        <td className="px-4 py-2 text-xs font-bold" style={{ color: 'var(--foreground)' }}>{solde.toLocaleString()} €</td>
                      </tr>
                      {compte.mouvements.map((mvt, i) => {
                        solde = solde + mvt.debit - mvt.credit;
                        return (
                          <tr key={i} className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 0 ? 'var(--background)' : 'var(--card)' }}>
                            <td className="px-4 py-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>{mvt.date}</td>
                            <td className="px-4 py-2 text-xs" style={{ color: 'var(--foreground)' }}>{mvt.libelle}</td>
                            <td className="px-4 py-2 text-xs font-semibold" style={{ color: mvt.debit > 0 ? '#16a34a' : 'var(--muted-foreground)' }}>{mvt.debit > 0 ? `${mvt.debit.toLocaleString()} €` : '—'}</td>
                            <td className="px-4 py-2 text-xs font-semibold" style={{ color: mvt.credit > 0 ? '#dc2626' : 'var(--muted-foreground)' }}>{mvt.credit > 0 ? `${mvt.credit.toLocaleString()} €` : '—'}</td>
                            <td className="px-4 py-2 text-xs font-bold" style={{ color: 'var(--foreground)' }}>{solde.toLocaleString()} €</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Balance */}
      {activeTab === 'balance' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Balance générale des comptes</h2>
            <div className="flex gap-2">
              <select className="px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                <option>Exercice 2025</option><option>Exercice 2024</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                <Icon name="ArrowDownTrayIcon" size={16} />
                Exporter
              </button>
            </div>
          </div>
          <div className="rounded-xl border overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
            <table className="w-full min-w-[600px]">
              <thead>
                <tr style={{ backgroundColor: 'var(--muted)' }}>
                  {['Compte', 'Libellé', 'Débit cumulé', 'Crédit cumulé', 'Solde débiteur', 'Solde créditeur'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {planComptable.flatMap(c => c.comptes).map((compte, i) => {
                  const isDebiteur = ['actif', 'charge'].includes(compte.type);
                  return (
                    <tr key={compte.numero} className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                      <td className="px-4 py-2.5 text-xs font-mono font-semibold" style={{ color: 'var(--shifa-blue)' }}>{compte.numero}</td>
                      <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--foreground)' }}>{compte.libelle}</td>
                      <td className="px-4 py-2.5 text-xs text-right" style={{ color: 'var(--foreground)' }}>{isDebiteur ? `${compte.solde.toLocaleString()} €` : '—'}</td>
                      <td className="px-4 py-2.5 text-xs text-right" style={{ color: 'var(--foreground)' }}>{!isDebiteur ? `${compte.solde.toLocaleString()} €` : '—'}</td>
                      <td className="px-4 py-2.5 text-xs font-semibold text-right" style={{ color: isDebiteur ? '#16a34a' : 'var(--muted-foreground)' }}>{isDebiteur ? `${compte.solde.toLocaleString()} €` : '—'}</td>
                      <td className="px-4 py-2.5 text-xs font-semibold text-right" style={{ color: !isDebiteur ? '#dc2626' : 'var(--muted-foreground)' }}>{!isDebiteur ? `${compte.solde.toLocaleString()} €` : '—'}</td>
                    </tr>
                  );
                })}
                <tr className="border-t-2 font-bold" style={{ borderColor: 'var(--shifa-blue)', backgroundColor: 'var(--muted)' }}>
                  <td className="px-4 py-3 text-xs" colSpan={2} style={{ color: 'var(--foreground)' }}>TOTAUX</td>
                  <td className="px-4 py-3 text-xs text-right" style={{ color: '#16a34a' }}>12 847 000 €</td>
                  <td className="px-4 py-3 text-xs text-right" style={{ color: '#dc2626' }}>12 847 000 €</td>
                  <td className="px-4 py-3 text-xs text-right" style={{ color: '#16a34a' }}>8 302 000 €</td>
                  <td className="px-4 py-3 text-xs text-right" style={{ color: '#dc2626' }}>8 302 000 €</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ backgroundColor: '#dcfce7', border: '1px solid #16a34a' }}>
            <Icon name="CheckCircleIcon" size={18} style={{ color: '#16a34a' }} />
            <span className="text-sm font-semibold" style={{ color: '#166534' }}>Balance équilibrée — Totaux débit = Totaux crédit</span>
          </div>
        </div>
      )}

      {/* Tab: Bilan */}
      {activeTab === 'bilan' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Bilan comptable — Exercice 2025</h2>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
              <Icon name="ArrowDownTrayIcon" size={16} />
              Exporter PDF
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Actif */}
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div className="px-4 py-3 font-bold text-sm text-white" style={{ backgroundColor: '#2563eb' }}>ACTIF</div>
              <table className="w-full">
                <tbody>
                  {bilanActif.map((item, i) => (
                    <tr key={item.poste} className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                      <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--foreground)' }}>{item.poste}</td>
                      <td className="px-4 py-2.5 text-xs font-semibold text-right" style={{ color: 'var(--foreground)' }}>{item.montant.toLocaleString()} €</td>
                      <td className="px-4 py-2.5 text-xs text-right" style={{ color: item.variation.startsWith('+') ? '#16a34a' : '#dc2626' }}>{item.variation}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 font-bold" style={{ borderColor: '#2563eb', backgroundColor: '#dbeafe' }}>
                    <td className="px-4 py-3 text-sm font-bold" style={{ color: '#1d4ed8' }}>TOTAL ACTIF</td>
                    <td className="px-4 py-3 text-sm font-bold text-right" style={{ color: '#1d4ed8' }}>{totalActif.toLocaleString()} €</td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Passif */}
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div className="px-4 py-3 font-bold text-sm text-white" style={{ backgroundColor: '#7c3aed' }}>PASSIF</div>
              <table className="w-full">
                <tbody>
                  {bilanPassif.map((item, i) => (
                    <tr key={item.poste} className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                      <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--foreground)' }}>{item.poste}</td>
                      <td className="px-4 py-2.5 text-xs font-semibold text-right" style={{ color: 'var(--foreground)' }}>{item.montant.toLocaleString()} €</td>
                      <td className="px-4 py-2.5 text-xs text-right" style={{ color: item.variation.startsWith('+') ? '#16a34a' : '#dc2626' }}>{item.variation}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 font-bold" style={{ borderColor: '#7c3aed', backgroundColor: '#ede9fe' }}>
                    <td className="px-4 py-3 text-sm font-bold" style={{ color: '#6d28d9' }}>TOTAL PASSIF</td>
                    <td className="px-4 py-3 text-sm font-bold text-right" style={{ color: '#6d28d9' }}>{totalPassif.toLocaleString()} €</td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {totalActif === totalPassif && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ backgroundColor: '#dcfce7', border: '1px solid #16a34a' }}>
              <Icon name="CheckCircleIcon" size={18} style={{ color: '#16a34a' }} />
              <span className="text-sm font-semibold" style={{ color: '#166534' }}>Bilan équilibré — Actif = Passif = {totalActif.toLocaleString()} €</span>
            </div>
          )}
        </div>
      )}

      {/* Tab: Compte de résultat */}
      {activeTab === 'resultat' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Compte de résultat — Exercice 2025</h2>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
              <Icon name="ArrowDownTrayIcon" size={16} />
              Exporter PDF
            </button>
          </div>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            {compteResultat.map(section => (
              <div key={section.categorie}>
                <div className="px-4 py-3 font-bold text-sm text-white" style={{ backgroundColor: section.categorie.includes('Produits') ? '#16a34a' : '#dc2626' }}>
                  {section.categorie}
                </div>
                <table className="w-full">
                  <tbody>
                    {section.items.map((item, i) => (
                      <tr key={item.libelle} className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                        <td className="px-4 py-2.5 text-sm" style={{ color: 'var(--foreground)' }}>{item.libelle}</td>
                        <td className="px-4 py-2.5 text-sm font-semibold text-right" style={{ color: item.montant > 0 ? '#16a34a' : '#dc2626' }}>
                          {item.montant > 0 ? `+ ${item.montant.toLocaleString()} €` : `${item.montant.toLocaleString()} €`}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t-2 font-bold" style={{ borderColor: section.categorie.includes('Produits') ? '#16a34a' : '#dc2626', backgroundColor: section.categorie.includes('Produits') ? '#dcfce7' : '#fee2e2' }}>
                      <td className="px-4 py-3 text-sm font-bold" style={{ color: section.categorie.includes('Produits') ? '#166534' : '#991b1b' }}>
                        Total {section.categorie}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-right" style={{ color: section.categorie.includes('Produits') ? '#166534' : '#991b1b' }}>
                        {section.items.reduce((s, i) => s + i.montant, 0).toLocaleString()} €
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
            <div className="px-4 py-4 flex items-center justify-between" style={{ backgroundColor: resultatNet > 0 ? '#dcfce7' : '#fee2e2' }}>
              <span className="text-base font-bold" style={{ color: resultatNet > 0 ? '#166534' : '#991b1b' }}>RÉSULTAT NET DE L'EXERCICE</span>
              <span className="text-xl font-bold" style={{ color: resultatNet > 0 ? '#16a34a' : '#dc2626' }}>
                {resultatNet > 0 ? '+' : ''}{resultatNet.toLocaleString()} €
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Clôtures */}
      {activeTab === 'cloture' && (
        <div className="space-y-5">
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Clôtures comptables</h2>
            <div className="space-y-3">
              {[
                { periode: 'Janvier 2025', statut: 'clôturé', date: '2025-02-05', par: 'Comptable Diallo' },
                { periode: 'Février 2025', statut: 'clôturé', date: '2025-03-04', par: 'Comptable Diallo' },
                { periode: 'Mars 2025', statut: 'clôturé', date: '2025-04-03', par: 'Comptable Diallo' },
                { periode: 'Avril 2025', statut: 'clôturé', date: '2025-05-06', par: 'Comptable Diallo' },
                { periode: 'Mai 2025', statut: 'clôturé', date: '2025-06-04', par: 'Comptable Diallo' },
                { periode: 'Juin 2025', statut: 'clôturé', date: '2025-07-03', par: 'Comptable Diallo' },
                { periode: 'Juillet 2025', statut: 'clôturé', date: '2025-08-05', par: 'Comptable Diallo' },
                { periode: 'Août 2025', statut: 'en cours', date: '—', par: '—' },
              ].map((c, i) => (
                <div key={c.periode} className="flex items-center justify-between px-4 py-3 rounded-xl border" style={{ backgroundColor: i % 2 === 0 ? 'var(--background)' : 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-3">
                    <Icon name={c.statut === 'clôturé' ? 'LockClosedIcon' : 'LockOpenIcon'} size={18} style={{ color: c.statut === 'clôturé' ? '#16a34a' : '#d97706' }} />
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{c.periode}</p>
                      {c.par !== '—' && <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Clôturé par {c.par} le {c.date}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: c.statut === 'clôturé' ? '#dcfce7' : '#fef3c7', color: c.statut === 'clôturé' ? '#16a34a' : '#d97706' }}>
                      {c.statut === 'clôturé' ? 'Clôturé' : 'En cours'}
                    </span>
                    {c.statut === 'en cours' && (
                      <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                        Clôturer
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border p-4" style={{ backgroundColor: '#fef3c7', borderColor: '#fbbf24' }}>
            <div className="flex items-center gap-2 mb-2">
              <Icon name="ExclamationTriangleIcon" size={16} style={{ color: '#d97706' }} />
              <h3 className="font-semibold text-sm" style={{ color: '#92400e' }}>Clôture annuelle 2025</h3>
            </div>
            <p className="text-xs" style={{ color: '#92400e' }}>
              La clôture annuelle sera disponible après la clôture de tous les mois de l'exercice. Elle génère automatiquement les à-nouveaux, le bilan définitif et le compte de résultat annuel.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
