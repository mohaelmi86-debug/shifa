'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const tabs = [
  { key: 'overview', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
  { key: 'equipment', label: 'Équipements', icon: 'CpuChipIcon' },
  { key: 'maintenance', label: 'Maintenance', icon: 'WrenchScrewdriverIcon' },
  { key: 'interventions', label: 'Interventions', icon: 'ClipboardDocumentListIcon' },
  { key: 'contracts', label: 'Contrats', icon: 'DocumentTextIcon' },
  { key: 'alerts', label: 'Alertes', icon: 'BellAlertIcon' },
];

const kpis = [
  { label: 'Équipements total', value: '284', sub: '248 opérationnels', icon: 'CpuChipIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Taux de disponibilité', value: '94.2%', sub: 'Objectif: 95%', icon: 'CheckCircleIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
  { label: 'Maintenances prévues', value: '18', sub: '5 cette semaine', icon: 'WrenchScrewdriverIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)' },
  { label: 'Interventions en cours', value: '7', sub: '2 urgentes', icon: 'ExclamationTriangleIcon', color: 'var(--shifa-red)', bg: 'rgba(239,68,68,0.08)' },
  { label: 'Contrats actifs', value: '42', sub: '8 expirent bientôt', icon: 'DocumentTextIcon', color: 'var(--shifa-purple)', bg: 'rgba(123,94,167,0.08)' },
  { label: 'Coût maintenance YTD', value: '28.4M FCFA', sub: 'Budget: 35M FCFA', icon: 'BanknotesIcon', color: '#0EA5E9', bg: 'rgba(14,165,233,0.08)' },
];

const equipment = [
  { id: 'eq-001', nom: 'IRM 3 Tesla — Salle A', categorie: 'Imagerie', marque: 'Siemens', modele: 'MAGNETOM Vida', serie: 'SN-2021-IRM-001', service: 'Radiologie', statut: 'operationnel', derniere_maintenance: '15 juil. 2026', prochaine_maintenance: '15 oct. 2026', uptime: 98.4, age: '5 ans', valeur: '850M FCFA' },
  { id: 'eq-002', nom: 'Scanner CT 128 coupes', categorie: 'Imagerie', marque: 'GE Healthcare', modele: 'Revolution CT', serie: 'SN-2022-CT-001', service: 'Radiologie', statut: 'operationnel', derniere_maintenance: '20 juil. 2026', prochaine_maintenance: '20 oct. 2026', uptime: 96.8, age: '4 ans', valeur: '420M FCFA' },
  { id: 'eq-003', nom: 'Échographe cardiaque', categorie: 'Imagerie', marque: 'Philips', modele: 'EPIQ Elite', serie: 'SN-2023-ECH-001', service: 'Cardiologie', statut: 'maintenance', derniere_maintenance: '10 août 2026', prochaine_maintenance: '—', uptime: 91.2, age: '3 ans', valeur: '85M FCFA' },
  { id: 'eq-004', nom: 'Ventilateur réanimation', categorie: 'Réanimation', marque: 'Dräger', modele: 'Evita Infinity V500', serie: 'SN-2020-VENT-004', service: 'Réanimation', statut: 'operationnel', derniere_maintenance: '01 août 2026', prochaine_maintenance: '01 nov. 2026', uptime: 99.1, age: '6 ans', valeur: '18M FCFA' },
  { id: 'eq-005', nom: 'Analyseur biochimie', categorie: 'Laboratoire', marque: 'Roche', modele: 'cobas c 702', serie: 'SN-2021-LAB-002', service: 'Laboratoire', statut: 'operationnel', derniere_maintenance: '25 juil. 2026', prochaine_maintenance: '25 oct. 2026', uptime: 97.6, age: '5 ans', valeur: '45M FCFA' },
  { id: 'eq-006', nom: 'Table opératoire motorisée', categorie: 'Chirurgie', marque: 'Maquet', modele: 'Alphastar', serie: 'SN-2019-CHIR-001', service: 'Bloc opératoire', statut: 'hors_service', derniere_maintenance: '05 août 2026', prochaine_maintenance: '—', uptime: 78.4, age: '7 ans', valeur: '22M FCFA' },
  { id: 'eq-007', nom: 'Moniteur multiparamétrique', categorie: 'Surveillance', marque: 'Mindray', modele: 'BeneVision N22', serie: 'SN-2022-MON-007', service: 'Urgences', statut: 'operationnel', derniere_maintenance: '12 juil. 2026', prochaine_maintenance: '12 oct. 2026', uptime: 99.8, age: '4 ans', valeur: '8M FCFA' },
  { id: 'eq-008', nom: 'Défibrillateur DAE', categorie: 'Urgences', marque: 'Zoll', modele: 'AED 3', serie: 'SN-2023-DAE-012', service: 'Urgences', statut: 'operationnel', derniere_maintenance: '30 juil. 2026', prochaine_maintenance: '30 oct. 2026', uptime: 100, age: '3 ans', valeur: '3.5M FCFA' },
];

const maintenances = [
  { id: 'mnt-001', equipement: 'IRM 3 Tesla — Salle A', type: 'Préventive', technicien: 'Équipe Siemens', date_prevue: '15 oct. 2026', duree_estimee: '4h', statut: 'planifié', priorite: 'normale' },
  { id: 'mnt-002', equipement: 'Échographe cardiaque', type: 'Corrective', technicien: 'Philips Healthcare SN', date_prevue: '12 août 2026', duree_estimee: '2h', statut: 'en_cours', priorite: 'haute' },
  { id: 'mnt-003', equipement: 'Table opératoire motorisée', type: 'Corrective urgente', technicien: 'Maquet Service', date_prevue: '11 août 2026', duree_estimee: '6h', statut: 'en_cours', priorite: 'urgente' },
  { id: 'mnt-004', equipement: 'Scanner CT 128 coupes', type: 'Préventive', technicien: 'GE Healthcare', date_prevue: '20 oct. 2026', duree_estimee: '3h', statut: 'planifié', priorite: 'normale' },
  { id: 'mnt-005', equipement: 'Analyseur biochimie', type: 'Calibration', technicien: 'Roche Diagnostics', date_prevue: '25 oct. 2026', duree_estimee: '1h', statut: 'planifié', priorite: 'normale' },
];

const interventions = [
  { id: 'int-001', equipement: 'Table opératoire motorisée', type: 'Panne moteur', technicien: 'Maquet Service', date_debut: '10 août 2026', date_fin: null, statut: 'en_cours', cout_estime: '2 400 000 FCFA', description: 'Défaillance moteur de positionnement — pièce commandée' },
  { id: 'int-002', equipement: 'Échographe cardiaque', type: 'Sonde défectueuse', technicien: 'Philips Healthcare', date_debut: '10 août 2026', date_fin: null, statut: 'en_cours', cout_estime: '850 000 FCFA', description: 'Remplacement sonde cardiaque 3.5 MHz' },
  { id: 'int-003', equipement: 'Ventilateur réanimation', type: 'Alarme capteur O2', technicien: 'Dräger Medical', date_debut: '08 août 2026', date_fin: '09 août 2026', statut: 'résolu', cout_estime: '120 000 FCFA', description: 'Remplacement capteur O2 — résolu en 4h' },
  { id: 'int-004', equipement: 'Moniteur multiparamétrique', type: 'Écran défaillant', technicien: 'Mindray France', date_debut: '05 août 2026', date_fin: '06 août 2026', statut: 'résolu', cout_estime: '280 000 FCFA', description: 'Remplacement écran tactile' },
];

const contracts = [
  { id: 'cnt-001', fournisseur: 'Siemens Healthineers', type: 'Maintenance préventive + corrective', equipements: 3, debut: '01 jan. 2025', fin: '31 déc. 2027', valeur: '12 400 000 FCFA/an', statut: 'actif', sla: '4h intervention' },
  { id: 'cnt-002', fournisseur: 'GE Healthcare', type: 'Maintenance préventive', equipements: 2, debut: '01 mars 2024', fin: '28 fév. 2027', valeur: '6 800 000 FCFA/an', statut: 'actif', sla: '8h intervention' },
  { id: 'cnt-003', fournisseur: 'Philips Healthcare', type: 'Full service', equipements: 4, debut: '01 juil. 2023', fin: '30 juin 2026', valeur: '8 200 000 FCFA/an', statut: 'expire_bientot', sla: '4h intervention' },
  { id: 'cnt-004', fournisseur: 'Dräger Medical', type: 'Maintenance préventive', equipements: 8, debut: '01 jan. 2026', fin: '31 déc. 2028', valeur: '4 200 000 FCFA/an', statut: 'actif', sla: '12h intervention' },
  { id: 'cnt-005', fournisseur: 'Roche Diagnostics', type: 'Contrat réactifs + maintenance', equipements: 3, debut: '01 avr. 2025', fin: '31 mars 2028', valeur: '18 600 000 FCFA/an', statut: 'actif', sla: '24h intervention' },
];

const alerts = [
  { id: 'alt-001', equipement: 'Table opératoire motorisée', type: 'Panne critique', message: 'Équipement hors service — intervention urgente requise', date: '10 août 2026 08:15', priorite: 'critique', acquitte: false },
  { id: 'alt-002', equipement: 'Contrat Philips Healthcare', type: 'Expiration contrat', message: 'Contrat expire dans 51 jours — renouvellement requis', date: '10 août 2026 09:00', priorite: 'haute', acquitte: false },
  { id: 'alt-003', equipement: 'IRM 3 Tesla', type: 'Maintenance préventive', message: 'Maintenance préventive prévue dans 66 jours', date: '10 août 2026 07:00', priorite: 'normale', acquitte: true },
  { id: 'alt-004', equipement: 'Défibrillateur DAE #08', type: 'Batterie faible', message: 'Niveau batterie: 15% — remplacement recommandé', date: '09 août 2026 14:30', priorite: 'haute', acquitte: false },
  { id: 'alt-005', equipement: 'Analyseur biochimie', type: 'Calibration requise', message: 'Calibration mensuelle due dans 5 jours', date: '09 août 2026 08:00', priorite: 'normale', acquitte: true },
];

const uptimeData = [
  { mois: 'Mar', irmr: 98.2, scanner: 97.1, echo: 94.8 },
  { mois: 'Avr', irmr: 99.1, scanner: 96.4, echo: 95.2 },
  { mois: 'Mai', irmr: 97.8, scanner: 98.2, echo: 93.1 },
  { mois: 'Jun', irmr: 98.9, scanner: 97.8, echo: 96.4 },
  { mois: 'Jul', irmr: 99.2, scanner: 96.9, echo: 91.8 },
  { mois: 'Aoû', irmr: 98.4, scanner: 96.8, echo: 91.2 },
];

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  operationnel: { label: 'Opérationnel', bg: '#dcfce7', text: '#16a34a' },
  maintenance: { label: 'En maintenance', bg: '#fef9c3', text: '#ca8a04' },
  hors_service: { label: 'Hors service', bg: '#fee2e2', text: '#dc2626' },
  planifié: { label: 'Planifié', bg: '#dbeafe', text: '#1d4ed8' },
  en_cours: { label: 'En cours', bg: '#fef9c3', text: '#ca8a04' },
  résolu: { label: 'Résolu', bg: '#dcfce7', text: '#16a34a' },
  actif: { label: 'Actif', bg: '#dcfce7', text: '#16a34a' },
  expire_bientot: { label: 'Expire bientôt', bg: '#fef9c3', text: '#ca8a04' },
  expiré: { label: 'Expiré', bg: '#fee2e2', text: '#dc2626' },
};

const priorityConfig: Record<string, { label: string; bg: string; text: string }> = {
  critique: { label: 'Critique', bg: '#fee2e2', text: '#dc2626' },
  haute: { label: 'Haute', bg: '#fef9c3', text: '#ca8a04' },
  normale: { label: 'Normale', bg: '#dbeafe', text: '#1d4ed8' },
  urgente: { label: 'Urgente', bg: '#fee2e2', text: '#dc2626' },
};

export default function BiomedicalEquipmentContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');

  const filteredEquipment = equipment.filter(eq =>
    eq.nom.toLowerCase().includes(search.toLowerCase()) ||
    eq.service.toLowerCase().includes(search.toLowerCase()) ||
    eq.categorie.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-purple))' }}>
              <Icon name="CpuChipIcon" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'DM Sans, sans-serif' }}>Équipements Biomédicaux</h1>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Inventaire · Maintenance · Interventions · Contrats · Alertes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}>
              <Icon name="ExclamationTriangleIcon" size={14} style={{ color: 'var(--shifa-red)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--shifa-red)' }}>2 alertes critiques</span>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
              <Icon name="PlusIcon" size={14} />
              Ajouter équipement
            </button>
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
              {tab.key === 'alerts' && <span className="ml-1 px-1.5 py-0.5 rounded-full text-white text-xs" style={{ backgroundColor: 'var(--shifa-red)', fontSize: '10px' }}>2</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {kpis.map(kpi => (
                <div key={kpi.label} className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: kpi.bg }}>
                    <Icon name={kpi.icon as any} size={16} style={{ color: kpi.color }} />
                  </div>
                  <p className="text-lg font-bold" style={{ color: 'var(--foreground)', fontFamily: 'DM Sans, sans-serif' }}>{kpi.value}</p>
                  <p className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{kpi.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{kpi.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Taux de disponibilité — équipements clés (%)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={uptimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="mois" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                    <YAxis domain={[85, 100]} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="irmr" name="IRM" fill="var(--shifa-blue)" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="scanner" name="Scanner" fill="var(--shifa-cyan)" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="echo" name="Échographe" fill="var(--shifa-purple)" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Statut du parc équipements</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Opérationnels', count: 248, total: 284, color: 'var(--shifa-green)' },
                    { label: 'En maintenance', count: 24, total: 284, color: 'var(--shifa-amber)' },
                    { label: 'Hors service', count: 12, total: 284, color: 'var(--shifa-red)' },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span style={{ color: 'var(--foreground)' }}>{item.label}</span>
                        <span style={{ color: 'var(--muted-foreground)' }}>{item.count}/{item.total}</span>
                      </div>
                      <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                        <div className="h-2 rounded-full" style={{ width: `${(item.count / item.total) * 100}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <h4 className="text-xs font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Alertes actives</h4>
                  {alerts.filter(a => !a.acquitte).slice(0, 3).map(alert => {
                    const p = priorityConfig[alert.priorite];
                    return (
                      <div key={alert.id} className="flex items-center gap-2 py-1.5">
                        <span className="text-xs px-1.5 py-0.5 rounded-full shrink-0" style={{ backgroundColor: p.bg, color: p.text }}>{p.label}</span>
                        <span className="text-xs truncate" style={{ color: 'var(--foreground)' }}>{alert.equipement}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Equipment List */}
        {activeTab === 'equipment' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Icon name="MagnifyingGlassIcon" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher équipement, service..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-lg border text-sm"
                  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
              </div>
            </div>
            <div className="rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--muted)' }}>
                      {['Équipement', 'Catégorie', 'Marque/Modèle', 'Service', 'Uptime', 'Prochaine maintenance', 'Valeur', 'Statut'].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ divideColor: 'var(--border)' }}>
                    {filteredEquipment.map(eq => {
                      const s = statusConfig[eq.statut];
                      return (
                        <tr key={eq.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-medium" style={{ color: 'var(--foreground)' }}>{eq.nom}</p>
                            <p className="font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>{eq.serie}</p>
                          </td>
                          <td className="px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{eq.categorie}</td>
                          <td className="px-4 py-3">
                            <p style={{ color: 'var(--foreground)' }}>{eq.marque}</p>
                            <p style={{ color: 'var(--muted-foreground)' }}>{eq.modele}</p>
                          </td>
                          <td className="px-4 py-3" style={{ color: 'var(--foreground)' }}>{eq.service}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                                <div className="h-1.5 rounded-full" style={{ width: `${eq.uptime}%`, backgroundColor: eq.uptime >= 95 ? 'var(--shifa-green)' : eq.uptime >= 85 ? 'var(--shifa-amber)' : 'var(--shifa-red)' }} />
                              </div>
                              <span style={{ color: 'var(--foreground)' }}>{eq.uptime}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{eq.prochaine_maintenance}</td>
                          <td className="px-4 py-3 font-medium" style={{ color: 'var(--foreground)' }}>{eq.valeur}</td>
                          <td className="px-4 py-3"><span className="px-1.5 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Maintenance */}
        {activeTab === 'maintenance' && (
          <div className="space-y-4">
            {maintenances.map(mnt => {
              const s = statusConfig[mnt.statut];
              const p = priorityConfig[mnt.priorite];
              return (
                <div key={mnt.id} className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{mnt.equipement}</h3>
                        <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: p.bg, color: p.text }}>{p.label}</span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{mnt.type} · Technicien: {mnt.technicien}</p>
                    </div>
                    <div className="text-right text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      <p>Date prévue: <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{mnt.date_prevue}</span></p>
                      <p>Durée estimée: {mnt.duree_estimee}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg text-xs font-medium border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Voir détails</button>
                    {mnt.statut === 'planifié' && (
                      <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>Démarrer</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Interventions */}
        {activeTab === 'interventions' && (
          <div className="space-y-4">
            {interventions.map(int => {
              const s = statusConfig[int.statut];
              return (
                <div key={int.id} className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{int.equipement}</h3>
                        <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{int.type} · {int.technicien}</p>
                    </div>
                    <div className="text-right text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      <p>Début: {int.date_debut}</p>
                      <p>Fin: {int.date_fin || 'En cours'}</p>
                    </div>
                  </div>
                  <p className="text-xs mb-3" style={{ color: 'var(--foreground)' }}>{int.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold" style={{ color: 'var(--shifa-amber)' }}>Coût estimé: {int.cout_estime}</span>
                    {int.statut === 'en_cours' && (
                      <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: 'var(--shifa-green)' }}>Marquer résolu</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Contracts */}
        {activeTab === 'contracts' && (
          <div className="rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ backgroundColor: 'var(--muted)' }}>
                    {['Fournisseur', 'Type', 'Équipements', 'Début', 'Fin', 'Valeur annuelle', 'SLA', 'Statut', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ divideColor: 'var(--border)' }}>
                  {contracts.map(cnt => {
                    const s = statusConfig[cnt.statut];
                    return (
                      <tr key={cnt.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 font-medium" style={{ color: 'var(--foreground)' }}>{cnt.fournisseur}</td>
                        <td className="px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{cnt.type}</td>
                        <td className="px-4 py-3 text-center" style={{ color: 'var(--foreground)' }}>{cnt.equipements}</td>
                        <td className="px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{cnt.debut}</td>
                        <td className="px-4 py-3" style={{ color: cnt.statut === 'expire_bientot' ? 'var(--shifa-amber)' : 'var(--muted-foreground)' }}>{cnt.fin}</td>
                        <td className="px-4 py-3 font-medium" style={{ color: 'var(--foreground)' }}>{cnt.valeur}</td>
                        <td className="px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{cnt.sla}</td>
                        <td className="px-4 py-3"><span className="px-1.5 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span></td>
                        <td className="px-4 py-3">
                          <button className="px-2 py-1 rounded text-xs font-medium border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Voir</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Alerts */}
        {activeTab === 'alerts' && (
          <div className="space-y-3">
            {alerts.map(alert => {
              const p = priorityConfig[alert.priorite];
              return (
                <div key={alert.id} className={`rounded-xl border p-4 ${alert.acquitte ? 'opacity-60' : ''}`} style={{ backgroundColor: 'var(--card)', borderColor: alert.acquitte ? 'var(--border)' : (alert.priorite === 'critique' ? 'rgba(239,68,68,0.3)' : 'var(--border)') }}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: p.bg }}>
                        <Icon name="BellAlertIcon" size={14} style={{ color: p.text }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{alert.equipement}</h3>
                          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: p.bg, color: p.text }}>{p.label}</span>
                          {alert.acquitte && <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>Acquitté</span>}
                        </div>
                        <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--foreground)' }}>{alert.type}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{alert.message}</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{alert.date}</p>
                      </div>
                    </div>
                    {!alert.acquitte && (
                      <div className="flex gap-2 shrink-0">
                        <button className="px-3 py-1.5 rounded-lg text-xs font-medium border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Acquitter</button>
                        <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>Traiter</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
