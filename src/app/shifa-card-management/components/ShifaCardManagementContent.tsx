'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const tabs = [
  { key: 'digital', label: 'Carte numérique', icon: 'CreditCardIcon' },
  { key: 'physical', label: 'Carte physique', icon: 'TruckIcon' },
  { key: 'activation', label: 'Activation', icon: 'CheckCircleIcon' },
  { key: 'qr', label: 'Vérification QR', icon: 'QrCodeIcon' },
  { key: 'lost', label: 'Perdue / Volée', icon: 'ExclamationTriangleIcon' },
];

const cardData = {
  numero: 'SH-2-SN-2025-7K4D',
  nom: 'Aïcha Diallo',
  date_naissance: '15 mars 1990',
  groupe_sanguin: 'O+',
  expire: '12/2028',
  statut: 'actif',
  type: 'Premium',
  nfc: true,
  qr_code: 'QR-SH-2025-7K4D-ADIALLO',
  assurance: 'NSIA Assurances — Famille Plus',
  medecin_traitant: 'Dr. Mohamed Sy',
  allergies: ['Pénicilline', 'Aspirine'],
  urgence_contact: 'Mamadou Diallo — +221 77 123 45 67',
};

const physicalOrders = [
  { id: 'ord-001', type: 'Carte Premium', statut: 'livré', date_commande: '15 juin 2025', date_livraison: '22 juin 2025', adresse: '12 Rue Carnot, Dakar', tracking: 'SN-POST-2025-4821' },
  { id: 'ord-002', type: 'Carte de remplacement', statut: 'en_transit', date_commande: '08 août 2026', date_livraison: 'Estimé: 15 août 2026', adresse: '12 Rue Carnot, Dakar', tracking: 'SN-POST-2026-7K4D' },
];

const activationHistory = [
  { id: 'act-001', action: 'Activation initiale', date: '22 juin 2025', lieu: 'CHU de Dakar', agent: 'Système automatique', statut: 'success' },
  { id: 'act-002', action: 'Renouvellement NFC', date: '10 jan. 2026', lieu: 'Clinique du Cap-Vert', agent: 'Dr. Ndiaye', statut: 'success' },
  { id: 'act-003', action: 'Tentative activation — Carte invalide', date: '05 mars 2026', lieu: 'Pharmacie Centrale', agent: 'Système', statut: 'failed' },
  { id: 'act-004', action: 'Mise à jour données assurance', date: '01 juil. 2026', lieu: 'En ligne', agent: 'Patient', statut: 'success' },
];

const qrScans = [
  { id: 'qr-001', date: '10 août 2026', heure: '14:32', lieu: 'CHU de Dakar — Urgences', agent: 'Dr. Koné', motif: 'Admission urgence', statut: 'autorisé' },
  { id: 'qr-002', date: '09 août 2026', heure: '09:15', lieu: 'Pharmacie Centrale', agent: 'Pharmacien Diop', motif: 'Dispensation médicaments', statut: 'autorisé' },
  { id: 'qr-003', date: '07 août 2026', heure: '16:48', lieu: 'Clinique du Cap-Vert', agent: 'Infirmière Sarr', motif: 'Consultation spécialiste', statut: 'autorisé' },
  { id: 'qr-004', date: '05 août 2026', heure: '11:20', lieu: 'Inconnu', agent: 'Inconnu', motif: 'Non spécifié', statut: 'bloqué' },
  { id: 'qr-005', date: '03 août 2026', heure: '08:45', lieu: 'Labo BioSanté', agent: 'Technicien Balde', motif: 'Prélèvement biologique', statut: 'autorisé' },
];

const lostReports = [
  { id: 'lr-001', date: '05 août 2026', type: 'Signalement vol', description: 'Carte volée lors d\'un déplacement à Thiès', statut: 'traité', carte_bloquee: true, nouvelle_carte: 'En cours de livraison' },
];

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  actif: { label: 'Active', bg: '#dcfce7', text: '#16a34a' },
  livré: { label: 'Livré', bg: '#dcfce7', text: '#16a34a' },
  en_transit: { label: 'En transit', bg: '#fef9c3', text: '#ca8a04' },
  success: { label: 'Succès', bg: '#dcfce7', text: '#16a34a' },
  failed: { label: 'Échec', bg: '#fee2e2', text: '#dc2626' },
  autorisé: { label: 'Autorisé', bg: '#dcfce7', text: '#16a34a' },
  bloqué: { label: 'Bloqué', bg: '#fee2e2', text: '#dc2626' },
  traité: { label: 'Traité', bg: '#dcfce7', text: '#16a34a' },
};

export default function ShifaCardManagementContent() {
  const [activeTab, setActiveTab] = useState('digital');
  const [cardFlipped, setCardFlipped] = useState(false);
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
  const [showLostForm, setShowLostForm] = useState(false);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
              <Icon name="CreditCardIcon" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'DM Sans, sans-serif' }}>Gestion Carte SHIFA</h1>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Carte numérique · Physique · Activation · QR · Sécurité</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
              ● Carte active
            </span>
            <span className="text-xs font-mono px-2 py-1 rounded" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>{cardData.numero}</span>
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

        {/* Digital Card */}
        {activeTab === 'digital' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card visual */}
              <div>
                <div
                  className="rounded-2xl p-6 text-white cursor-pointer select-none shadow-xl"
                  style={{ background: 'linear-gradient(135deg, #0066FF 0%, #00A3FF 50%, #00F2C3 100%)', minHeight: '200px', position: 'relative', overflow: 'hidden' }}
                  onClick={() => setCardFlipped(!cardFlipped)}
                >
                  <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(30%, -30%)' }} />
                  <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(-30%, 30%)' }} />
                  {!cardFlipped ? (
                    <>
                      <div className="flex items-start justify-between mb-8">
                        <div>
                          <p className="text-xs opacity-80 font-medium">SHIFA SANTÉ</p>
                          <p className="text-lg font-bold mt-0.5">{cardData.type}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {cardData.nfc && <Icon name="WifiIcon" size={20} className="opacity-80" />}
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <Icon name="ShieldCheckIcon" size={16} className="text-white" />
                          </div>
                        </div>
                      </div>
                      <p className="text-base font-mono tracking-widest mb-3">{cardData.numero}</p>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs opacity-70">Titulaire</p>
                          <p className="text-sm font-bold">{cardData.nom}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs opacity-70">Expire</p>
                          <p className="text-sm font-bold">{cardData.expire}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-4">
                        <p className="text-xs opacity-70 mb-1">Groupe sanguin</p>
                        <p className="text-2xl font-bold">{cardData.groupe_sanguin}</p>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div><span className="opacity-70">Assurance: </span><span className="font-medium">{cardData.assurance}</span></div>
                        <div><span className="opacity-70">Médecin: </span><span className="font-medium">{cardData.medecin_traitant}</span></div>
                        <div><span className="opacity-70">Allergies: </span><span className="font-medium">{cardData.allergies.join(', ')}</span></div>
                        <div><span className="opacity-70">Urgence: </span><span className="font-medium">{cardData.urgence_contact}</span></div>
                      </div>
                    </>
                  )}
                  <p className="text-xs opacity-50 mt-3 text-center">Cliquer pour {cardFlipped ? 'recto' : 'verso'}</p>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                    <Icon name="ShareIcon" size={14} />
                    Partager
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                    <Icon name="ArrowDownTrayIcon" size={14} />
                    Télécharger
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                    <Icon name="PrinterIcon" size={14} />
                    Imprimer
                  </button>
                </div>
              </div>

              {/* Card details */}
              <div className="space-y-4">
                <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Informations de la carte</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Numéro SHIFA', value: cardData.numero, mono: true },
                      { label: 'Titulaire', value: cardData.nom },
                      { label: 'Date de naissance', value: cardData.date_naissance },
                      { label: 'Groupe sanguin', value: cardData.groupe_sanguin },
                      { label: 'Type de carte', value: cardData.type },
                      { label: 'Date d\'expiration', value: cardData.expire },
                      { label: 'Assurance', value: cardData.assurance },
                      { label: 'Médecin traitant', value: cardData.medecin_traitant },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between py-1.5 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</span>
                        <span className={`text-xs font-medium ${item.mono ? 'font-mono' : ''}`} style={{ color: 'var(--foreground)' }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border p-4" style={{ backgroundColor: 'rgba(239,68,68,0.04)', borderColor: 'rgba(239,68,68,0.2)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="ExclamationTriangleIcon" size={14} style={{ color: 'var(--shifa-red)' }} />
                    <span className="text-xs font-semibold" style={{ color: 'var(--shifa-red)' }}>Allergies connues</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {cardData.allergies.map(a => (
                      <span key={a} className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>{a}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Physical Card */}
        {activeTab === 'physical' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Commandes de carte physique</h3>
              <button
                onClick={() => setShowNewOrderForm(!showNewOrderForm)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: 'var(--shifa-blue)' }}
              >
                <Icon name="PlusIcon" size={14} />
                Nouvelle commande
              </button>
            </div>

            {showNewOrderForm && (
              <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Commander une nouvelle carte physique</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>Type de carte</label>
                    <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                      <option>Carte Standard</option>
                      <option>Carte Premium</option>
                      <option>Carte NFC+</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>Motif</label>
                    <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                      <option>Première émission</option>
                      <option>Remplacement (perte)</option>
                      <option>Remplacement (vol)</option>
                      <option>Renouvellement</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>Adresse de livraison</label>
                    <input type="text" defaultValue="12 Rue Carnot, Dakar, Sénégal" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>Confirmer la commande</button>
                  <button onClick={() => setShowNewOrderForm(false)} className="px-4 py-2 rounded-lg text-sm font-medium border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Annuler</button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {physicalOrders.map(order => {
                const s = statusConfig[order.statut];
                return (
                  <div key={order.id} className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{order.type}</h4>
                          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
                        </div>
                        <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--muted-foreground)' }}>Tracking: {order.tracking}</p>
                      </div>
                      <div className="text-right text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        <p>Commandé: {order.date_commande}</p>
                        <p>Livraison: {order.date_livraison}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      <Icon name="MapPinIcon" size={12} />
                      <span>{order.adresse}</span>
                    </div>
                    {order.statut === 'en_transit' && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
                          <span>Progression</span>
                          <span>En transit</span>
                        </div>
                        <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                          <div className="h-2 rounded-full" style={{ width: '60%', backgroundColor: 'var(--shifa-amber)' }} />
                        </div>
                        <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                          <span>Commande</span>
                          <span>Préparation</span>
                          <span>Transit</span>
                          <span>Livré</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Activation */}
        {activeTab === 'activation' && (
          <div className="space-y-6">
            <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Activer une nouvelle carte</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>Numéro de carte</label>
                  <input type="text" placeholder="SH-X-XX-XXXX-XXXX" className="w-full px-3 py-2 rounded-lg border text-sm font-mono" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>Code d'activation (4 chiffres)</label>
                  <input type="text" placeholder="••••" maxLength={4} className="w-full px-3 py-2 rounded-lg border text-sm font-mono" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                </div>
              </div>
              <button className="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>Activer la carte</button>
            </div>

            <div className="rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Historique d'activation</h3>
              </div>
              <div className="divide-y" style={{ divideColor: 'var(--border)' }}>
                {activationHistory.map(act => {
                  const s = statusConfig[act.statut];
                  return (
                    <div key={act.id} className="px-5 py-3 flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: act.statut === 'success' ? '#dcfce7' : '#fee2e2' }}>
                        <Icon name={act.statut === 'success' ? 'CheckIcon' : 'XMarkIcon'} size={14} style={{ color: act.statut === 'success' ? '#16a34a' : '#dc2626' }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{act.action}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{act.date} · {act.lieu} · {act.agent}</p>
                      </div>
                      <span className="text-xs px-1.5 py-0.5 rounded-full shrink-0" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* QR Verification */}
        {activeTab === 'qr' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-xl border p-5 flex flex-col items-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold mb-4 self-start" style={{ color: 'var(--foreground)' }}>Mon QR Code SHIFA</h3>
                <div className="w-48 h-48 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--muted)' }}>
                  <div className="grid grid-cols-5 gap-1">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div key={i} className="w-6 h-6 rounded-sm" style={{ backgroundColor: Math.random() > 0.5 ? 'var(--foreground)' : 'transparent' }} />
                    ))}
                  </div>
                </div>
                <p className="text-xs font-mono text-center mb-3" style={{ color: 'var(--muted-foreground)' }}>{cardData.qr_code}</p>
                <div className="flex gap-2 w-full">
                  <button className="flex-1 py-2 rounded-lg text-xs font-medium border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                    <Icon name="ArrowDownTrayIcon" size={12} className="inline mr-1" />
                    Télécharger
                  </button>
                  <button className="flex-1 py-2 rounded-lg text-xs font-medium border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                    <Icon name="ArrowPathIcon" size={12} className="inline mr-1" />
                    Régénérer
                  </button>
                </div>
              </div>

              <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Paramètres de vérification</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Accès aux informations de base', desc: 'Nom, numéro SHIFA, groupe sanguin', enabled: true },
                    { label: 'Accès aux informations d\'assurance', desc: 'Couverture, numéro de police', enabled: true },
                    { label: 'Accès aux allergies', desc: 'Liste des allergies médicamenteuses', enabled: true },
                    { label: 'Accès au dossier médical complet', desc: 'Historique, prescriptions, résultats', enabled: false },
                    { label: 'Accès aux données de paiement', desc: 'Solde, transactions', enabled: false },
                  ].map(perm => (
                    <div key={perm.label} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                      <div>
                        <p className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{perm.label}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{perm.desc}</p>
                      </div>
                      <div className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${perm.enabled ? '' : ''}`} style={{ backgroundColor: perm.enabled ? 'var(--shifa-blue)' : 'var(--muted)' }}>
                        <div className="w-4 h-4 rounded-full bg-white shadow mt-0.5 transition-transform" style={{ transform: perm.enabled ? 'translateX(22px)' : 'translateX(2px)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Historique des scans QR</h3>
              </div>
              <div className="divide-y" style={{ divideColor: 'var(--border)' }}>
                {qrScans.map(scan => {
                  const s = statusConfig[scan.statut];
                  return (
                    <div key={scan.id} className="px-5 py-3 flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: scan.statut === 'autorisé' ? '#dcfce7' : '#fee2e2' }}>
                        <Icon name={scan.statut === 'autorisé' ? 'QrCodeIcon' : 'ShieldExclamationIcon'} size={14} style={{ color: scan.statut === 'autorisé' ? '#16a34a' : '#dc2626' }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{scan.lieu}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{scan.date} {scan.heure} · {scan.agent} · {scan.motif}</p>
                      </div>
                      <span className="text-xs px-1.5 py-0.5 rounded-full shrink-0" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Lost/Stolen */}
        {activeTab === 'lost' && (
          <div className="space-y-6">
            <div className="rounded-xl border p-5" style={{ backgroundColor: 'rgba(239,68,68,0.04)', borderColor: 'rgba(239,68,68,0.2)' }}>
              <div className="flex items-center gap-3 mb-3">
                <Icon name="ExclamationTriangleIcon" size={20} style={{ color: 'var(--shifa-red)' }} />
                <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-red)' }}>Signaler une carte perdue ou volée</h3>
              </div>
              <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>
                En signalant votre carte, elle sera immédiatement bloquée et une nouvelle carte vous sera envoyée. Toutes les tentatives d'utilisation seront enregistrées.
              </p>
              {!showLostForm ? (
                <button
                  onClick={() => setShowLostForm(true)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ backgroundColor: 'var(--shifa-red)' }}
                >
                  Signaler ma carte
                </button>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>Type de signalement</label>
                    <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                      <option>Carte perdue</option>
                      <option>Carte volée</option>
                      <option>Carte endommagée</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>Description (optionnel)</label>
                    <textarea rows={3} placeholder="Décrivez les circonstances..." className="w-full px-3 py-2 rounded-lg border text-sm resize-none" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-red)' }}>Confirmer le signalement</button>
                    <button onClick={() => setShowLostForm(false)} className="px-4 py-2 rounded-lg text-sm font-medium border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Annuler</button>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Historique des signalements</h3>
              </div>
              {lostReports.map(report => (
                <div key={report.id} className="px-5 py-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{report.type}</h4>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{report.date}</p>
                    </div>
                    <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>{statusConfig[report.statut].label}</span>
                  </div>
                  <p className="text-xs mb-2" style={{ color: 'var(--foreground)' }}>{report.description}</p>
                  <div className="flex gap-4 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    <span>Carte bloquée: <span className="font-semibold" style={{ color: report.carte_bloquee ? 'var(--shifa-green)' : 'var(--shifa-red)' }}>{report.carte_bloquee ? 'Oui' : 'Non'}</span></span>
                    <span>Nouvelle carte: <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{report.nouvelle_carte}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
