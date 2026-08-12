'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const tabs = [
  { key: 'dashboard', label: 'Tableau de bord', icon: 'Squares2X2Icon' },
  { key: 'profile', label: 'Mon Profil', icon: 'UserCircleIcon' },
  { key: 'referrals', label: 'Parrainage & Liens', icon: 'LinkIcon' },
  { key: 'commissions', label: 'Commissions', icon: 'BanknotesIcon' },
  { key: 'territory', label: 'Territoire & Objectifs', icon: 'MapPinIcon' },
  { key: 'marketing', label: 'Kit Marketing', icon: 'SparklesIcon' },
  { key: 'payments', label: 'Historique Paiements', icon: 'CreditCardIcon' },
];

const kpis = [
  { label: 'Parrainages actifs', value: '47', sub: '+8 ce mois', icon: 'UserPlusIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Professionnels invités', value: '23', sub: '18 activés', icon: 'BriefcaseIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
  { label: 'Organisations référées', value: '6', sub: '4 onboardées', icon: 'BuildingOffice2Icon', color: 'var(--shifa-cyan)', bg: 'rgba(6,182,212,0.08)' },
  { label: 'Commissions totales', value: '1 240 000 FCFA', sub: '+180 000 ce mois', icon: 'BanknotesIcon', color: '#d97706', bg: 'rgba(245,158,11,0.08)' },
];

const conversionData = [
  { mois: 'Mar', invites: 12, actives: 8 },
  { mois: 'Avr', invites: 18, actives: 13 },
  { mois: 'Mai', invites: 22, actives: 17 },
  { mois: 'Jun', invites: 15, actives: 11 },
  { mois: 'Jul', invites: 28, actives: 21 },
  { mois: 'Aoû', invites: 31, actives: 24 },
];

const commissionData = [
  { mois: 'Mar', montant: 85000 },
  { mois: 'Avr', montant: 120000 },
  { mois: 'Mai', montant: 145000 },
  { mois: 'Jun', montant: 98000 },
  { mois: 'Jul', montant: 162000 },
  { mois: 'Aoû', montant: 180000 },
];

const networkMembers = [
  { id: 'amb-001', name: 'Dr. Fatou Ndiaye', type: 'Professionnel', specialty: 'Médecin généraliste', status: 'actif', date: '12 juin 2026', conversions: 3, commission: 45000 },
  { id: 'amb-002', name: 'Clinique Al-Shifa Dakar', type: 'Organisation', specialty: 'Clinique privée', status: 'actif', date: '5 juil. 2026', conversions: 1, commission: 120000 },
  { id: 'amb-003', name: 'Dr. Moussa Coulibaly', type: 'Professionnel', specialty: 'Cardiologue', status: 'en_attente', date: '2 août 2026', conversions: 0, commission: 0 },
  { id: 'amb-004', name: 'Pharmacie Centrale Abidjan', type: 'Organisation', specialty: 'Pharmacie', status: 'actif', date: '18 juil. 2026', conversions: 2, commission: 80000 },
  { id: 'amb-005', name: 'Dr. Amina Hassan', type: 'Professionnel', specialty: 'Pédiatre', status: 'actif', date: '28 juil. 2026', conversions: 4, commission: 60000 },
];

const referralLinks = [
  { id: 'rl-001', label: 'Lien général', url: 'shifa.health/ref/AMB-7K4D', clicks: 284, conversions: 47, type: 'general' },
  { id: 'rl-002', label: 'Lien Professionnels', url: 'shifa.health/ref/AMB-7K4D/pro', clicks: 156, conversions: 23, type: 'pro' },
  { id: 'rl-003', label: 'Lien Organisations', url: 'shifa.health/ref/AMB-7K4D/org', clicks: 89, conversions: 6, type: 'org' },
  { id: 'rl-004', label: 'Lien Patients', url: 'shifa.health/ref/AMB-7K4D/patient', clicks: 412, conversions: 18, type: 'patient' },
];

const commissions = [
  { id: 'com-001', type: 'Professionnel activé', filleul: 'Dr. Fatou Ndiaye', date: '10 août 2026', montant: 15000, statut: 'payé', taux: '5%' },
  { id: 'com-002', type: 'Organisation onboardée', filleul: 'Clinique Al-Shifa', date: '8 août 2026', montant: 120000, statut: 'payé', taux: '8%' },
  { id: 'com-003', type: 'Renouvellement abonnement', filleul: 'Dr. Amina Hassan', date: '5 août 2026', montant: 8000, statut: 'en_attente', taux: '3%' },
  { id: 'com-004', type: 'Professionnel activé', filleul: 'Dr. Moussa Coulibaly', date: '2 août 2026', montant: 15000, statut: 'en_attente', taux: '5%' },
  { id: 'com-005', type: 'Organisation onboardée', filleul: 'Pharmacie Centrale', date: '18 juil. 2026', montant: 80000, statut: 'payé', taux: '8%' },
];

const territoryObjectives = [
  { region: 'Dakar', target: 30, achieved: 28, type: 'Professionnels', color: 'var(--shifa-blue)' },
  { region: 'Abidjan', target: 20, achieved: 12, type: 'Professionnels', color: '#8b5cf6' },
  { region: 'Comores', target: 10, achieved: 7, type: 'Professionnels', color: '#f59e0b' },
  { region: 'Dakar', target: 5, achieved: 4, type: 'Organisations', color: 'var(--shifa-cyan)' },
  { region: 'Abidjan', target: 3, achieved: 2, type: 'Organisations', color: '#ec4899' },
];

const marketingAssets = [
  { id: 'mk-001', name: 'Présentation SHIFA — Professionnels', type: 'PDF', size: '2.4 MB', lang: 'FR/EN', category: 'Présentation', color: '#ef4444' },
  { id: 'mk-002', name: 'Brochure patient SHIFA Card', type: 'PDF', size: '1.8 MB', lang: 'FR/AR', category: 'Brochure', color: '#ef4444' },
  { id: 'mk-003', name: 'Bannières réseaux sociaux (pack)', type: 'ZIP', size: '8.2 MB', lang: 'Multi', category: 'Visuel', color: '#0ea5e9' },
  { id: 'mk-004', name: 'Vidéo de présentation SHIFA 2min', type: 'MP4', size: '45 MB', lang: 'FR', category: 'Vidéo', color: '#8b5cf6' },
  { id: 'mk-005', name: 'Guide onboarding organisation', type: 'PDF', size: '3.1 MB', lang: 'FR/EN', category: 'Guide', color: '#ef4444' },
  { id: 'mk-006', name: 'Modèle email invitation professionnel', type: 'DOCX', size: '0.3 MB', lang: 'FR/EN/AR', category: 'Email', color: '#10b981' },
  { id: 'mk-007', name: 'Infographie SHIFA Health OS', type: 'PNG', size: '1.2 MB', lang: 'FR', category: 'Visuel', color: '#0ea5e9' },
  { id: 'mk-008', name: 'Script appel téléphonique', type: 'PDF', size: '0.5 MB', lang: 'FR', category: 'Script', color: '#f59e0b' },
];

const payments = [
  { id: 'pay-001', date: '01 août 2026', montant: 180000, methode: 'Virement bancaire', statut: 'versé', reference: 'VIR-2026-08-001', periode: 'Juillet 2026' },
  { id: 'pay-002', date: '01 juil. 2026', montant: 162000, methode: 'Virement bancaire', statut: 'versé', reference: 'VIR-2026-07-001', periode: 'Juin 2026' },
  { id: 'pay-003', date: '01 juin 2026', montant: 145000, methode: 'Mobile Money', statut: 'versé', reference: 'MM-2026-06-001', periode: 'Mai 2026' },
  { id: 'pay-004', date: '01 mai 2026', montant: 120000, methode: 'Virement bancaire', statut: 'versé', reference: 'VIR-2026-05-001', periode: 'Avril 2026' },
  { id: 'pay-005', date: '01 sept. 2026', montant: 195000, methode: 'Virement bancaire', statut: 'en_attente', reference: 'VIR-2026-09-001', periode: 'Août 2026' },
];

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  actif: { label: 'Actif', bg: '#dcfce7', text: '#16a34a' },
  en_attente: { label: 'En attente', bg: '#fef9c3', text: '#ca8a04' },
  payé: { label: 'Versé', bg: '#dcfce7', text: '#16a34a' },
  versé: { label: 'Versé', bg: '#dcfce7', text: '#16a34a' },
};

const pieData = [
  { name: 'Professionnels', value: 23, color: 'var(--shifa-blue)' },
  { name: 'Organisations', value: 6, color: 'var(--shifa-cyan)' },
  { name: 'Patients', value: 18, color: '#8b5cf6' },
];

export default function AmbassadorWorkspaceContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleCopy = (url: string) => {
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}>
            <Icon name="StarIcon" size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--shifa-dark)', fontFamily: 'DM Sans, sans-serif' }}>Espace Ambassadeur SHIFA</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Code : <span className="font-mono font-bold" style={{ color: 'var(--shifa-blue)' }}>AMB-7K4D</span> · Niveau Or · Sénégal / Côte d'Ivoire</p>
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(245,158,11,0.12)', color: '#D97706' }}>
          🏅 Niveau Or
        </div>
      </div>

      {/* Security notice */}
      <div className="mb-5 px-4 py-3 rounded-xl border flex items-start gap-3" style={{ backgroundColor: 'rgba(245,158,11,0.06)', borderColor: 'rgba(245,158,11,0.2)' }}>
        <Icon name="ShieldCheckIcon" size={18} style={{ color: '#D97706' }} className="shrink-0 mt-0.5" />
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          <strong style={{ color: 'var(--foreground)' }}>Espace sécurisé :</strong> Vous n'avez accès à aucune donnée médicale, dossier patient, prescription ou résultat clinique des personnes que vous parrainez. Votre espace est strictement limité aux informations de parrainage et d'adoption.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? 'text-white shadow-sm' : 'hover:bg-muted'}`}
            style={activeTab === tab.key ? { background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' } : { color: 'var(--muted-foreground)' }}
          >
            <Icon name={tab.icon as any} size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── DASHBOARD ── */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map(kpi => (
              <div key={kpi.label} className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: kpi.bg }}>
                  <Icon name={kpi.icon as any} size={18} style={{ color: kpi.color }} />
                </div>
                <p className="text-xl font-bold mb-0.5" style={{ color: 'var(--shifa-dark)' }}>{kpi.value}</p>
                <p className="text-xs font-medium mb-1" style={{ color: 'var(--foreground)' }}>{kpi.label}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.sub}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-2xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Invitations vs Activations (6 mois)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={conversionData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="mois" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="invites" name="Invitations" fill="rgba(0,102,255,0.3)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actives" name="Activations" fill="var(--shifa-blue)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-2xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Répartition parrainages</h3>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1 mt-2">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span style={{ color: 'var(--muted-foreground)' }}>{d.name}</span>
                    </div>
                    <span className="font-bold" style={{ color: 'var(--foreground)' }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-2xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Activité récente</h3>
            <div className="space-y-3">
              {[
                { icon: 'UserPlusIcon', text: 'Dr. Amina Hassan a activé son compte SHIFA', time: 'Il y a 2h', color: 'var(--shifa-green)' },
                { icon: 'BuildingOffice2Icon', text: 'Clinique Al-Shifa Dakar — onboarding complété', time: 'Il y a 1j', color: 'var(--shifa-blue)' },
                { icon: 'BanknotesIcon', text: '+120 000 FCFA de commission créditée', time: 'Il y a 1j', color: '#d97706' },
                { icon: 'EnvelopeIcon', text: 'Invitation envoyée à dr.ibrahim@example.com', time: 'Il y a 2j', color: 'var(--shifa-cyan)' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}18` }}>
                    <Icon name={item.icon as any} size={15} style={{ color: item.color }} />
                  </div>
                  <p className="text-sm flex-1" style={{ color: 'var(--foreground)' }}>{item.text}</p>
                  <span className="text-xs shrink-0" style={{ color: 'var(--muted-foreground)' }}>{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── PROFILE ── */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-2xl p-6 border text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-3" style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}>
                KD
              </div>
              <h3 className="font-bold text-base mb-0.5" style={{ color: 'var(--shifa-dark)' }}>Kofi Diallo</h3>
              <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>Ambassadeur SHIFA — Niveau Or</p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold" style={{ backgroundColor: 'rgba(245,158,11,0.12)', color: '#D97706' }}>
                <Icon name="StarIcon" size={13} /> Code : AMB-7K4D
              </div>
            </div>
            <div className="rounded-2xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Progression de niveau</h4>
              {[
                { level: 'Bronze', min: 0, max: 10, current: 10, done: true },
                { level: 'Argent', min: 10, max: 30, current: 30, done: true },
                { level: 'Or', min: 30, max: 60, current: 47, done: false },
                { level: 'Platine', min: 60, max: 100, current: 0, done: false },
              ].map(l => (
                <div key={l.level} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: l.done ? 'var(--shifa-green)' : l.level === 'Or' ? '#D97706' : 'var(--muted-foreground)' }}>{l.level}</span>
                    <span style={{ color: 'var(--muted-foreground)' }}>{l.level === 'Or' ? `${l.current}/${l.max}` : l.done ? '✓' : `0/${l.max}`}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${l.done ? 100 : l.level === 'Or' ? Math.round((l.current / l.max) * 100) : 0}%`, backgroundColor: l.done ? 'var(--shifa-green)' : '#D97706' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl p-6 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Informations personnelles</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Nom complet', value: 'Kofi Diallo' },
                  { label: 'Email', value: 'kofi.diallo@example.com' },
                  { label: 'Téléphone', value: '+221 77 123 4567' },
                  { label: 'Pays principal', value: 'Sénégal' },
                  { label: 'Territoire', value: 'Dakar, Abidjan, Comores' },
                  { label: 'Membre depuis', value: 'Janvier 2026' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>{f.label}</label>
                    <div className="px-3 py-2 rounded-xl text-sm border" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>{f.value}</div>
                  </div>
                ))}
              </div>
              <button className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                <Icon name="PencilIcon" size={14} /> Modifier le profil
              </button>
            </div>
            <div className="rounded-2xl p-6 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Informations bancaires (paiements)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Banque', value: 'CBAO Sénégal' },
                  { label: 'IBAN / Compte', value: 'SN••••••••••••4521' },
                  { label: 'Mobile Money', value: 'Orange Money +221 77 123 4567' },
                  { label: 'Devise préférée', value: 'FCFA (XOF)' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>{f.label}</label>
                    <div className="px-3 py-2 rounded-xl text-sm border" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>{f.value}</div>
                  </div>
                ))}
              </div>
              <button className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                <Icon name="PencilIcon" size={14} /> Modifier les coordonnées bancaires
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REFERRALS & LINKS ── */}
      {activeTab === 'referrals' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {referralLinks.map(link => (
              <div key={link.id} className="rounded-2xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{link.label}</h4>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' }}>{link.type}</span>
                </div>
                <div className="px-3 py-2 rounded-xl mb-3 font-mono text-xs break-all" style={{ backgroundColor: 'var(--muted)', color: 'var(--shifa-blue)' }}>
                  {link.url}
                </div>
                <div className="flex items-center justify-between text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
                  <span>{link.clicks} clics</span>
                  <span>{link.conversions} conversions</span>
                  <span className="font-bold" style={{ color: 'var(--shifa-green)' }}>{Math.round((link.conversions / link.clicks) * 100)}% taux</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleCopy(link.url)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium border transition-colors hover:bg-muted" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                    <Icon name={copiedLink === link.url ? 'CheckIcon' : 'ClipboardDocumentIcon'} size={13} />
                    {copiedLink === link.url ? 'Copié !' : 'Copier'}
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                    <Icon name="ShareIcon" size={13} /> Partager
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Réseau parrainé ({networkMembers.length} membres)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--muted)' }}>
                    {['Nom', 'Type', 'Spécialité', 'Statut', 'Date', 'Conversions', 'Commission générée'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {networkMembers.map(m => {
                    const s = statusConfig[m.status] || { label: m.status, bg: '#f1f5f9', text: '#64748b' };
                    return (
                      <tr key={m.id} className="border-t hover:bg-muted/40 transition-colors" style={{ borderColor: 'var(--border)' }}>
                        <td className="px-4 py-3 font-medium" style={{ color: 'var(--foreground)' }}>{m.name}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: m.type === 'Professionnel' ? 'rgba(0,102,255,0.1)' : 'rgba(6,182,212,0.1)', color: m.type === 'Professionnel' ? 'var(--shifa-blue)' : 'var(--shifa-cyan)' }}>{m.type}</span>
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.specialty}</td>
                        <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span></td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.date}</td>
                        <td className="px-4 py-3 text-center font-bold" style={{ color: m.conversions > 0 ? 'var(--shifa-green)' : 'var(--muted-foreground)' }}>{m.conversions}</td>
                        <td className="px-4 py-3 text-xs font-semibold" style={{ color: m.commission > 0 ? '#d97706' : 'var(--muted-foreground)' }}>{m.commission > 0 ? `${m.commission.toLocaleString()} FCFA` : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── COMMISSIONS ── */}
      {activeTab === 'commissions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Total commissions', value: '1 240 000 FCFA', icon: 'BanknotesIcon', color: '#d97706', bg: 'rgba(245,158,11,0.08)' },
              { label: 'En attente', value: '23 000 FCFA', icon: 'ClockIcon', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
              { label: 'Versé ce mois', value: '180 000 FCFA', icon: 'CheckCircleIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
            ].map(k => (
              <div key={k.label} className="rounded-2xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: k.bg }}>
                  <Icon name={k.icon as any} size={18} style={{ color: k.color }} />
                </div>
                <p className="text-xl font-bold mb-0.5" style={{ color: 'var(--shifa-dark)' }}>{k.value}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{k.label}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Évolution des commissions (6 mois)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={commissionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="mois" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} formatter={(v: any) => [`${v.toLocaleString()} FCFA`, 'Commission']} />
                <Line type="monotone" dataKey="montant" stroke="#d97706" strokeWidth={2.5} dot={{ fill: '#d97706', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Détail des commissions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--muted)' }}>
                    {['Type', 'Filleul', 'Date', 'Taux', 'Montant', 'Statut'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {commissions.map(c => {
                    const s = statusConfig[c.statut] || { label: c.statut, bg: '#f1f5f9', text: '#64748b' };
                    return (
                      <tr key={c.id} className="border-t hover:bg-muted/40" style={{ borderColor: 'var(--border)' }}>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--foreground)' }}>{c.type}</td>
                        <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--foreground)' }}>{c.filleul}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.date}</td>
                        <td className="px-4 py-3 text-xs font-bold" style={{ color: '#d97706' }}>{c.taux}</td>
                        <td className="px-4 py-3 text-xs font-bold" style={{ color: 'var(--shifa-dark)' }}>{c.montant.toLocaleString()} FCFA</td>
                        <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="rounded-2xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Barème des commissions</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { type: 'Professionnel activé', taux: '5%', base: '15 000 FCFA / activation', color: 'var(--shifa-blue)' },
                { type: 'Organisation onboardée', taux: '8%', base: 'Variable selon abonnement', color: 'var(--shifa-cyan)' },
                { type: 'Renouvellement abonnement', taux: '3%', base: 'Récurrent mensuel', color: 'var(--shifa-green)' },
              ].map(b => (
                <div key={b.type} className="p-4 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{b.type}</p>
                  <p className="text-2xl font-bold mb-1" style={{ color: b.color }}>{b.taux}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{b.base}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TERRITORY & OBJECTIVES ── */}
      {activeTab === 'territory' && (
        <div className="space-y-6">
          <div className="rounded-2xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Territoire assigné</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { pays: 'Sénégal', villes: 'Dakar, Thiès, Saint-Louis', statut: 'Principal', flag: '🇸🇳' },
                { pays: 'Côte d\'Ivoire', villes: 'Abidjan, Bouaké', statut: 'Secondaire', flag: '🇨🇮' },
                { pays: 'Comores', villes: 'Moroni, Mutsamudu', statut: 'Secondaire', flag: '🇰🇲' },
              ].map(t => (
                <div key={t.pays} className="p-4 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{t.flag}</span>
                    <div>
                      <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{t.pays}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: t.statut === 'Principal' ? 'rgba(0,102,255,0.1)' : 'rgba(6,182,212,0.1)', color: t.statut === 'Principal' ? 'var(--shifa-blue)' : 'var(--shifa-cyan)' }}>{t.statut}</span>
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{t.villes}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Objectifs T3 2026 (Juillet — Septembre)</h3>
            <div className="space-y-4">
              {territoryObjectives.map((obj, i) => {
                const pct = Math.min(100, Math.round((obj.achieved / obj.target) * 100));
                return (
                  <div key={i} className="p-4 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{obj.region} — {obj.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold" style={{ color: obj.color }}>{obj.achieved}/{obj.target}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: pct >= 100 ? '#dcfce7' : pct >= 70 ? '#fef9c3' : '#fee2e2', color: pct >= 100 ? '#16a34a' : pct >= 70 ? '#ca8a04' : '#dc2626' }}>{pct}%</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
                      <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: obj.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-2xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Campagnes actives</h3>
            <div className="space-y-3">
              {[
                { name: 'Campagne Médecins Généralistes Dakar', status: 'active', end: '31 août 2026', target: 15, done: 11 },
                { name: 'Campagne Cliniques Abidjan', status: 'active', end: '15 sept. 2026', target: 5, done: 2 },
                { name: 'Campagne Pharmacies Comores', status: 'planifiée', end: '01 oct. 2026', target: 8, done: 0 },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{c.name}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Fin : {c.end} · {c.done}/{c.target} objectif</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: c.status === 'active' ? '#dcfce7' : '#fef9c3', color: c.status === 'active' ? '#16a34a' : '#ca8a04' }}>{c.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MARKETING KIT ── */}
      {activeTab === 'marketing' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketingAssets.map(asset => (
              <div key={asset.id} className="rounded-2xl p-5 border hover:shadow-md transition-shadow" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${asset.color}18` }}>
                    <Icon name={asset.type === 'PDF' ? 'DocumentTextIcon' : asset.type === 'MP4' ? 'VideoCameraIcon' : asset.type === 'ZIP' ? 'ArchiveBoxIcon' : 'DocumentIcon'} size={20} style={{ color: asset.color }} />
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{asset.type}</span>
                </div>
                <p className="text-sm font-semibold mb-1 leading-snug" style={{ color: 'var(--foreground)' }}>{asset.name}</p>
                <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>{asset.size} · {asset.lang} · {asset.category}</p>
                <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium border transition-colors hover:bg-muted" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                  <Icon name="ArrowDownTrayIcon" size={13} /> Télécharger
                </button>
              </div>
            ))}
          </div>
          <div className="rounded-2xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Modèles de messages prêts à l'emploi</h3>
            <div className="space-y-3">
              {[
                { label: 'SMS invitation professionnel', text: 'Bonjour Dr. [Nom], je vous invite à rejoindre SHIFA Health OS, la plateforme de santé numérique. Inscrivez-vous via mon lien : shifa.health/ref/AMB-7K4D' },
                { label: 'WhatsApp organisation', text: 'Bonjour, je vous contacte pour vous présenter SHIFA Health OS, un système d\'information de santé complet pour votre établissement. Découvrez-le ici : shifa.health/ref/AMB-7K4D/org' },
              ].map((m, i) => (
                <div key={i} className="p-4 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--foreground)' }}>{m.label}</p>
                  <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>{m.text}</p>
                  <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                    <Icon name="ClipboardDocumentIcon" size={12} /> Copier
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── PAYMENT HISTORY ── */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Total versé', value: '607 000 FCFA', icon: 'BanknotesIcon', color: 'var(--shifa-green)' },
              { label: 'En attente de versement', value: '195 000 FCFA', icon: 'ClockIcon', color: '#d97706' },
              { label: 'Prochain versement', value: '01 sept. 2026', icon: 'CalendarDaysIcon', color: 'var(--shifa-blue)' },
            ].map(k => (
              <div key={k.label} className="rounded-2xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${k.color}18` }}>
                  <Icon name={k.icon as any} size={18} style={{ color: k.color }} />
                </div>
                <p className="text-xl font-bold mb-0.5" style={{ color: 'var(--shifa-dark)' }}>{k.value}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{k.label}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Historique des paiements</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--muted)' }}>
                    {['Référence', 'Période', 'Date', 'Méthode', 'Montant', 'Statut', 'Reçu'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => {
                    const s = p.statut === 'versé' ? { bg: '#dcfce7', text: '#16a34a', label: 'Versé' } : { bg: '#fef9c3', text: '#ca8a04', label: 'En attente' };
                    return (
                      <tr key={p.id} className="border-t hover:bg-muted/40" style={{ borderColor: 'var(--border)' }}>
                        <td className="px-4 py-3 font-mono text-xs font-bold" style={{ color: 'var(--shifa-blue)' }}>{p.reference}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--foreground)' }}>{p.periode}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.date}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.methode}</td>
                        <td className="px-4 py-3 text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>{p.montant.toLocaleString()} FCFA</td>
                        <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span></td>
                        <td className="px-4 py-3">
                          {p.statut === 'versé' && (
                            <button className="flex items-center gap-1 text-xs" style={{ color: 'var(--shifa-blue)' }}>
                              <Icon name="ArrowDownTrayIcon" size={12} /> PDF
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
