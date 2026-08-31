'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import CurrencyDisplay from '@/components/ui/CurrencyDisplay';

const tabs = [
  { key: 'overview', label: 'Mes portefeuilles', icon: 'WalletIcon' },
  { key: 'google', label: 'Google Wallet', icon: 'DevicePhoneMobileIcon' },
  { key: 'apple', label: 'Apple Wallet', icon: 'DevicePhoneMobileIcon' },
  { key: 'other', label: 'Autres portefeuilles', icon: 'CreditCardIcon' },
  { key: 'transactions', label: 'Transactions', icon: 'BanknotesIcon' },
];

const wallets = [
  { id: 'w-001', type: 'google', nom: 'Google Wallet', icone: 'DevicePhoneMobileIcon', couleur: '#4285F4', bg: 'rgba(66,133,244,0.1)', solde: '48 500 FCFA', cartes: 3, statut: 'actif', derniere_utilisation: 'Aujourd\'hui, 14h32', appareil: 'Pixel 8 Pro' },
  { id: 'w-002', type: 'apple', nom: 'Apple Wallet', icone: 'DevicePhoneMobileIcon', couleur: '#000000', bg: 'rgba(0,0,0,0.06)', solde: '22 000 FCFA', cartes: 2, statut: 'actif', derniere_utilisation: 'Hier, 09h15', appareil: 'iPhone 15 Pro' },
  { id: 'w-003', type: 'orange', nom: 'Orange Money', icone: 'CurrencyDollarIcon', couleur: '#FF6600', bg: 'rgba(255,102,0,0.1)', solde: '125 000 FCFA', cartes: 1, statut: 'actif', derniere_utilisation: 'Aujourd\'hui, 11h48', appareil: 'Compte mobile' },
  { id: 'w-004', type: 'wave', nom: 'Wave', icone: 'BanknotesIcon', couleur: '#1BA8F1', bg: 'rgba(27,168,241,0.1)', solde: '67 200 FCFA', cartes: 1, statut: 'actif', derniere_utilisation: 'Il y a 2 jours', appareil: 'Compte mobile' },
];

const googleCards = [
  { id: 'gc-001', nom: 'Carte SHIFA Santé', numero: '**** **** **** 7K4D', type: 'Carte de santé numérique', couleur: 'linear-gradient(135deg, #0066FF, #00F2C3)', expire: '12/2028', statut: 'actif', passes: ['Carte patient', 'Assurance NSIA', 'Fidélité SHIFA'] },
  { id: 'gc-002', nom: 'Visa Santé Premium', numero: '**** **** **** 4821', type: 'Carte de paiement', couleur: 'linear-gradient(135deg, #1A1A2E, #16213E)', expire: '08/2027', statut: 'actif', passes: [] },
  { id: 'gc-003', nom: 'Pass Vaccination', numero: 'VAC-SN-2026-7K4D', type: 'Pass sanitaire', couleur: 'linear-gradient(135deg, #16a34a, #15803d)', expire: '31/12/2027', statut: 'actif', passes: [] },
];

const appleCards = [
  { id: 'ac-001', nom: 'Carte SHIFA Santé', numero: '**** **** **** 7K4D', type: 'Health Card', couleur: 'linear-gradient(135deg, #0066FF, #00F2C3)', expire: '12/2028', statut: 'actif' },
  { id: 'ac-002', nom: 'Assurance NSIA', numero: 'INS-2025-7K4D', type: 'Insurance Card', couleur: 'linear-gradient(135deg, #7B5EA7, #5B3FA7)', expire: '31/12/2026', statut: 'actif' },
];

const otherWallets = [
  { id: 'ow-001', nom: 'Orange Money', logo: '🟠', solde: '125 000 FCFA', telephone: '+221 77 123 45 67', statut: 'lié', derniere_recharge: '08 août 2026', limite_journaliere: '500 000 FCFA' },
  { id: 'ow-002', nom: 'Wave', logo: '🌊', solde: '67 200 FCFA', telephone: '+221 76 987 65 43', statut: 'lié', derniere_recharge: '06 août 2026', limite_journaliere: '1 000 000 FCFA' },
  { id: 'ow-003', nom: 'Free Money', logo: '💚', solde: '0 FCFA', telephone: 'Non lié', statut: 'non_lié', derniere_recharge: '—', limite_journaliere: '—' },
  { id: 'ow-004', nom: 'Expresso Cash', logo: '💛', solde: '0 FCFA', telephone: 'Non lié', statut: 'non_lié', derniere_recharge: '—', limite_journaliere: '—' },
];

const transactions = [
  { id: 'tx-001', date: '10 août 2026', heure: '14:32', description: 'Consultation Dr. Sy — Téléconsultation', montant: '-15 000 FCFA', type: 'paiement', wallet: 'Google Wallet', statut: 'success', ref: 'TXN-2026-08-4821' },
  { id: 'tx-002', date: '10 août 2026', heure: '11:48', description: 'Recharge Orange Money', montant: '+50 000 FCFA', type: 'recharge', wallet: 'Orange Money', statut: 'success', ref: 'TXN-2026-08-4820' },
  { id: 'tx-003', date: '09 août 2026', heure: '16:20', description: 'Pharmacie Centrale — Médicaments', montant: '-28 500 FCFA', type: 'paiement', wallet: 'Wave', statut: 'success', ref: 'TXN-2026-08-4819' },
  { id: 'tx-004', date: '08 août 2026', heure: '09:15', description: 'Remboursement assurance NSIA', montant: '+22 800 FCFA', type: 'remboursement', wallet: 'Apple Wallet', statut: 'success', ref: 'TXN-2026-08-4818' },
  { id: 'tx-005', date: '07 août 2026', heure: '13:45', description: 'Laboratoire BioSanté — Bilan', montant: '-42 000 FCFA', type: 'paiement', wallet: 'Orange Money', statut: 'success', ref: 'TXN-2026-08-4817' },
  { id: 'tx-006', date: '06 août 2026', heure: '10:30', description: 'Abonnement SHIFA Premium', montant: '-9 900 FCFA', type: 'abonnement', wallet: 'Google Wallet', statut: 'success', ref: 'TXN-2026-08-4816' },
  { id: 'tx-007', date: '05 août 2026', heure: '17:00', description: 'Tentative paiement — Solde insuffisant', montant: '-80 000 FCFA', type: 'paiement', wallet: 'Wave', statut: 'failed', ref: 'TXN-2026-08-4815' },
];

const txTypeConfig: Record<string, { label: string; color: string }> = {
  paiement: { label: 'Paiement', color: 'var(--shifa-red)' },
  recharge: { label: 'Recharge', color: 'var(--shifa-green)' },
  remboursement: { label: 'Remboursement', color: 'var(--shifa-blue)' },
  abonnement: { label: 'Abonnement', color: 'var(--shifa-purple)' },
};

const txStatusConfig: Record<string, { label: string; bg: string; text: string }> = {
  success: { label: 'Succès', bg: '#dcfce7', text: '#16a34a' },
  failed: { label: 'Échoué', bg: '#fee2e2', text: '#dc2626' },
  pending: { label: 'En cours', bg: '#fef9c3', text: '#ca8a04' },
};

export default function WalletInterfaceContent() {
  const [activeTab, setActiveTab] = useState('overview');

  const totalSolde = wallets.filter(w => w.statut === 'actif').reduce((acc, w) => {
    const val = parseInt(w.solde.replace(/[^0-9]/g, ''));
    return acc + val;
  }, 0);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0066FF, #00F2C3)' }}>
              <Icon name="CreditCardIcon" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'DM Sans, sans-serif' }}>Portefeuilles numériques</h1>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Google Wallet · Apple Wallet · Mobile Money</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Solde total consolidé</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'DM Sans, sans-serif' }}>{totalSolde.toLocaleString()} FCFA</p>
            <CurrencyDisplay amount={totalSolde} currency="XOF" showReference size="sm" className="mt-0.5" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {wallets.map(w => (
                <div key={w.id} className="rounded-xl border p-5 cursor-pointer hover:shadow-md transition-shadow" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                  onClick={() => setActiveTab(w.type === 'google' ? 'google' : w.type === 'apple' ? 'apple' : 'other')}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: w.bg }}>
                      <Icon name={w.icone as any} size={20} style={{ color: w.couleur }} />
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>Actif</span>
                  </div>
                  <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--foreground)' }}>{w.nom}</h3>
                  <p className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)', fontFamily: 'DM Sans, sans-serif' }}>{w.solde}</p>
                  <div className="text-xs space-y-0.5" style={{ color: 'var(--muted-foreground)' }}>
                    {w.cartes > 0 && <p>{w.cartes} carte{w.cartes > 1 ? 's' : ''} enregistrée{w.cartes > 1 ? 's' : ''}</p>}
                    <p>Appareil: {w.appareil}</p>
                    <p>Dernière utilisation: {w.derniere_utilisation}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Recharger', icon: 'PlusCircleIcon', color: 'var(--shifa-green)' },
                { label: 'Transférer', icon: 'ArrowsRightLeftIcon', color: 'var(--shifa-blue)' },
                { label: 'Payer', icon: 'QrCodeIcon', color: 'var(--shifa-purple)' },
                { label: 'Historique', icon: 'ClockIcon', color: 'var(--shifa-amber)' },
              ].map(action => (
                <button key={action.label} className="flex flex-col items-center gap-2 p-4 rounded-xl border hover:bg-muted transition-colors" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <Icon name={action.icon as any} size={24} style={{ color: action.color }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{action.label}</span>
                </button>
              ))}
            </div>

            {/* Recent transactions */}
            <div className="rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Transactions récentes</h3>
                <button onClick={() => setActiveTab('transactions')} className="text-xs font-medium" style={{ color: 'var(--shifa-blue)' }}>Voir tout →</button>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {transactions.slice(0, 4).map(tx => {
                  const typeConf = txTypeConfig[tx.type];
                  const statusConf = txStatusConfig[tx.statut];
                  const isPositive = tx.montant.startsWith('+');
                  return (
                    <div key={tx.id} className="px-5 py-3 flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: isPositive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }}>
                        <Icon name={isPositive ? 'ArrowDownIcon' : 'ArrowUpIcon'} size={14} style={{ color: isPositive ? 'var(--shifa-green)' : 'var(--shifa-red)' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>{tx.description}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{tx.date} · {tx.wallet}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold" style={{ color: isPositive ? 'var(--shifa-green)' : 'var(--foreground)' }}>{tx.montant}</p>
                        <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: statusConf.bg, color: statusConf.text }}>{statusConf.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Google Wallet */}
        {activeTab === 'google' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(66,133,244,0.1)' }}>
                <Icon name="DevicePhoneMobileIcon" size={24} style={{ color: '#4285F4' }} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Google Wallet — Pixel 8 Pro</h3>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>3 cartes · Solde: 48 500 FCFA · Dernière utilisation: Aujourd'hui 14h32</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: '#4285F4' }}>Gérer l'appareil</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {googleCards.map(card => (
                <div key={card.id} className="rounded-xl overflow-hidden shadow-md">
                  <div className="p-5 text-white" style={{ background: card.couleur, minHeight: '140px' }}>
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <p className="text-xs opacity-80">{card.type}</p>
                        <p className="text-sm font-bold mt-0.5">{card.nom}</p>
                      </div>
                      <Icon name="CreditCardIcon" size={24} className="opacity-80" />
                    </div>
                    <p className="text-sm font-mono opacity-90">{card.numero}</p>
                    <p className="text-xs opacity-70 mt-1">Expire: {card.expire}</p>
                  </div>
                  <div className="p-3 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    {card.passes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {card.passes.map(p => (
                          <span key={p} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)' }}>{p}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button className="flex-1 py-1.5 rounded-lg text-xs font-medium border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Détails</button>
                      <button className="flex-1 py-1.5 rounded-lg text-xs font-medium border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Partager</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Ajouter à Google Wallet</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Carte SHIFA', 'Pass vaccination', 'Ordonnance', 'Ticket RDV'].map(item => (
                  <button key={item} className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors text-sm" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                    <Icon name="PlusCircleIcon" size={16} style={{ color: '#4285F4' }} />
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Apple Wallet */}
        {activeTab === 'apple' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}>
                <Icon name="DevicePhoneMobileIcon" size={24} style={{ color: '#000' }} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Apple Wallet — iPhone 15 Pro</h3>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>2 cartes · Solde: 22 000 FCFA · Dernière utilisation: Hier 09h15</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: '#000' }}>Gérer l'appareil</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appleCards.map(card => (
                <div key={card.id} className="rounded-xl overflow-hidden shadow-md">
                  <div className="p-6 text-white" style={{ background: card.couleur, minHeight: '160px' }}>
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <p className="text-xs opacity-80">{card.type}</p>
                        <p className="text-base font-bold mt-0.5">{card.nom}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <Icon name="CreditCardIcon" size={16} className="text-white" />
                      </div>
                    </div>
                    <p className="text-sm font-mono opacity-90">{card.numero}</p>
                    <p className="text-xs opacity-70 mt-1">Expire: {card.expire}</p>
                  </div>
                  <div className="p-3 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="flex gap-2">
                      <button className="flex-1 py-1.5 rounded-lg text-xs font-medium border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Détails</button>
                      <button className="flex-1 py-1.5 rounded-lg text-xs font-medium border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>QR Code</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Ajouter à Apple Wallet</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Carte SHIFA', 'Pass vaccination', 'Ordonnance', 'Ticket RDV'].map(item => (
                  <button key={item} className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors text-sm" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                    <Icon name="PlusCircleIcon" size={16} style={{ color: '#000' }} />
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Other Wallets */}
        {activeTab === 'other' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otherWallets.map(w => (
                <div key={w.id} className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{w.logo}</span>
                      <div>
                        <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{w.nom}</h3>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{w.telephone}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={w.statut === 'lié' ? { backgroundColor: '#dcfce7', color: '#16a34a' } : { backgroundColor: '#f1f5f9', color: '#64748b' }}>
                      {w.statut === 'lié' ? 'Lié' : 'Non lié'}
                    </span>
                  </div>
                  {w.statut === 'lié' ? (
                    <>
                      <p className="text-xl font-bold mb-3" style={{ color: 'var(--foreground)', fontFamily: 'DM Sans, sans-serif' }}>{w.solde}</p>
                      <div className="text-xs space-y-1 mb-4" style={{ color: 'var(--muted-foreground)' }}>
                        <p>Dernière recharge: {w.derniere_recharge}</p>
                        <p>Limite journalière: {w.limite_journaliere}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>Recharger</button>
                        <button className="flex-1 py-1.5 rounded-lg text-xs font-medium border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Délier</button>
                      </div>
                    </>
                  ) : (
                    <button className="w-full py-2 rounded-lg text-sm font-medium border-2 border-dashed hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                      + Lier ce portefeuille
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transactions */}
        {activeTab === 'transactions' && (
          <div className="rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Historique des transactions</h3>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {transactions.map(tx => {
                const typeConf = txTypeConfig[tx.type];
                const statusConf = txStatusConfig[tx.statut];
                const isPositive = tx.montant.startsWith('+');
                return (
                  <div key={tx.id} className="px-5 py-4 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: isPositive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }}>
                      <Icon name={isPositive ? 'ArrowDownIcon' : 'ArrowUpIcon'} size={16} style={{ color: isPositive ? 'var(--shifa-green)' : 'var(--shifa-red)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>{tx.description}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{tx.date} {tx.heure} · {tx.wallet} · Réf: {tx.ref}</p>
                    </div>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)' }}>{typeConf.label}</span>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold" style={{ color: isPositive ? 'var(--shifa-green)' : tx.statut === 'failed' ? 'var(--shifa-red)' : 'var(--foreground)' }}>{tx.montant}</p>
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: statusConf.bg, color: statusConf.text }}>{statusConf.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
