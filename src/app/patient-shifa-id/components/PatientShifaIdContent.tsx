'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';


type IdTab = 'card' | 'history' | 'privacy' | 'qr';

export default function PatientShifaIdContent() {
  const [activeTab, setActiveTab] = useState<IdTab>('card');
  const [showFullId, setShowFullId] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);

  const patient = {
    name: 'Aïcha Diallo',
    firstName: 'Aïcha',
    lastName: 'DIALLO',
    shifaId: 'SH-2-SN-FR-2025-7K4D',
    country: 'Sénégal',
    countryCode: 'SN',
    yearCreated: '2025',
    status: 'Actif',
    statusColor: '#16a34a',
    verificationKey: '7K4D',
    sex: 'F',
    dob: '12/03/1992',
    bloodType: 'O+',
    avatar: 'AD',
    memberSince: 'Mars 2025',
    lastVerified: 'Aujourd\'hui 09:14',
    verificationLevel: 'Identité vérifiée',
  };

  const maskedId = showFullId ? patient.shifaId : 'SH-2-SN-FR-2025-****';

  const accessHistory = [
    { actor: 'Dr. Mohamed Sy', role: 'Médecin généraliste', action: 'Vérification SHIFA ID', date: 'Aujourd\'hui 09:14', location: 'CHU Saint-Louis', authorized: true },
    { actor: 'Clinique Pasteur', role: 'Accueil patient', action: 'Scan QR code', date: 'Hier 14:32', location: 'Clinique Pasteur', authorized: true },
    { actor: 'Pharmacie Centrale', role: 'Pharmacien', action: 'Vérification ordonnance', date: 'Il y a 3 jours', location: 'Dakar', authorized: true },
    { actor: 'Système SHIFA', role: 'Vérification automatique', action: 'Renouvellement session', date: 'Il y a 5 jours', location: 'Système', authorized: true },
  ];

  const idComponents = [
    { label: 'Préfixe', value: 'SH', desc: 'Identifiant SHIFA Health OS' },
    { label: 'Version', value: '2', desc: 'Version du schéma SHIFA ID' },
    { label: 'Pays', value: 'SN', desc: 'Code pays ISO 3166-1 alpha-2' },
    { label: 'Région', value: 'FR', desc: 'Code région / zone de création' },
    { label: 'Année', value: '2025', desc: 'Année de création du compte' },
    { label: 'Clé de vérification', value: '7K4D', desc: 'Clé unique générée par SHIFA' },
  ];

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-lg mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Mon SHIFA ID</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Identifiant de santé unique, permanent et sécurisé</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
            ● Actif
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' }}>
            Identité vérifiée
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
        {[
          { key: 'card', label: 'Mon SHIFA ID', icon: 'IdentificationIcon' },
          { key: 'qr', label: 'QR Code', icon: 'QrCodeIcon' },
          { key: 'history', label: 'Historique d\'accès', icon: 'ClockIcon' },
          { key: 'privacy', label: 'Confidentialité', icon: 'ShieldCheckIcon' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as IdTab)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all"
            style={{
              borderBottomColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'transparent',
              color: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
            }}
          >
            <Icon name={tab.icon as any} size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Card */}
      {activeTab === 'card' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SHIFA ID Visual */}
          <div>
            <div
              className="relative rounded-3xl overflow-hidden p-6"
              style={{
                background: 'linear-gradient(135deg, #0A1B3D 0%, #0A4B9A 55%, #0066FF 100%)',
                minHeight: '220px',
                boxShadow: '0 20px 60px rgba(0,102,255,0.3)',
              }}
            >
              {/* Watermark */}
              <div className="absolute right-4 bottom-4 opacity-10 w-28 h-12">
                <AppImage
                  src="/assets/images/file_00000000594071f4b27d19b03582b884-1786375501710.png"
                  alt="SHIFA watermark"
                  width={112}
                  height={48}
                  className="object-contain w-full h-full"
                />
              </div>

              {/* Top row */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-20 h-8">
                  <AppImage
                    src="/assets/images/file_00000000594071f4b27d19b03582b884-1786375501710.png"
                    alt="SHIFA logo"
                    width={80}
                    height={32}
                    className="object-contain w-full h-full brightness-0 invert"
                  />
                </div>
                <span className="text-xs font-bold text-white/70 tracking-widest uppercase">SHIFA ID</span>
              </div>

              {/* Avatar + Name */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white shrink-0" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
                  {patient.avatar}
                </div>
                <div>
                  <p className="text-white font-bold text-lg leading-tight">{patient.firstName}</p>
                  <p className="text-white font-bold text-lg leading-tight">{patient.lastName}</p>
                  <p className="text-white/60 text-xs mt-0.5">{patient.country} · Membre depuis {patient.memberSince}</p>
                </div>
              </div>

              {/* SHIFA ID */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-1">SHIFA ID</p>
                  <p className="text-white font-mono font-bold text-base tracking-wider">{maskedId}</p>
                </div>
                <button
                  onClick={() => setShowFullId(v => !v)}
                  className="p-2 rounded-lg transition-all"
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                >
                  <Icon name={showFullId ? 'EyeSlashIcon' : 'EyeIcon'} size={16} className="text-white" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => setActiveTab('qr')}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--shifa-blue)', color: 'white' }}
              >
                <Icon name="QrCodeIcon" size={16} />
                Afficher QR
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>
                <Icon name="ShareIcon" size={16} />
                Partager
              </button>
            </div>
          </div>

          {/* ID Details */}
          <div className="space-y-4">
            <div className="card-base p-5">
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--shifa-dark)' }}>Structure du SHIFA ID</h3>
              <div className="space-y-2">
                {idComponents.map(comp => (
                  <div key={comp.label} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{comp.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{comp.desc}</p>
                    </div>
                    <span className="font-mono font-bold text-sm px-2 py-1 rounded-lg" style={{ backgroundColor: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)' }}>{comp.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-base p-5">
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--shifa-dark)' }}>Informations de vérification</h3>
              <div className="space-y-2">
                {[
                  { label: 'Statut', value: patient.status, color: '#16a34a' },
                  { label: 'Niveau de vérification', value: patient.verificationLevel, color: 'var(--shifa-blue)' },
                  { label: 'Dernière vérification', value: patient.lastVerified, color: 'var(--foreground)' },
                  { label: 'Groupe sanguin', value: patient.bloodType, color: '#dc2626' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-1.5">
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{item.label}</span>
                    <span className="text-sm font-semibold" style={{ color: item.color }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(0,102,255,0.06)', border: '1px solid rgba(0,102,255,0.15)' }}>
              <div className="flex items-start gap-2">
                <Icon name="InformationCircleIcon" size={16} style={{ color: 'var(--shifa-blue)' } as any} className="shrink-0 mt-0.5" />
                <p className="text-xs" style={{ color: 'var(--foreground)' }}>
                  Le SHIFA ID est <strong>permanent</strong> et <strong>unique</strong>. Il ne contient aucune information médicale sensible. Il sert uniquement à vous identifier dans l'écosystème SHIFA.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: QR */}
      {activeTab === 'qr' && (
        <div className="max-w-md mx-auto">
          <div className="card-base p-8 flex flex-col items-center gap-6">
            <div>
              <h3 className="text-base font-bold text-center" style={{ color: 'var(--shifa-dark)' }}>QR Code de vérification</h3>
              <p className="text-sm text-center mt-1" style={{ color: 'var(--muted-foreground)' }}>Présentez ce code à un professionnel de santé ou à un établissement SHIFA</p>
            </div>

            {/* QR placeholder */}
            <div className="relative">
              <div
                className="w-56 h-56 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--muted)', border: '2px dashed var(--border)' }}
              >
                {qrVisible ? (
                  <div className="grid grid-cols-7 gap-1 p-4">
                    {Array.from({ length: 49 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded-sm"
                        style={{ backgroundColor: Math.random() > 0.5 ? 'var(--shifa-dark)' : 'transparent' }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Icon name="LockClosedIcon" size={32} className="text-muted-foreground" />
                    <p className="text-xs text-center" style={{ color: 'var(--muted-foreground)' }}>Appuyez pour afficher</p>
                  </div>
                )}
              </div>
              {qrVisible && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-lg">
                    <AppImage
                      src="/assets/images/file_00000000594071f4b27d19b03582b884-1786375501710.png"
                      alt="SHIFA"
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setQrVisible(v => !v)}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: 'var(--shifa-blue)' }}
            >
              {qrVisible ? 'Masquer le QR code' : 'Afficher le QR code'}
            </button>

            <div className="w-full p-3 rounded-xl" style={{ backgroundColor: '#fef3c7', border: '1px solid #fde68a' }}>
              <div className="flex items-start gap-2">
                <Icon name="ExclamationTriangleIcon" size={14} style={{ color: '#d97706' } as any} className="shrink-0 mt-0.5" />
                <p className="text-xs" style={{ color: '#92400e' }}>
                  Ce QR code ne donne accès qu'à votre identité SHIFA. Il ne contient pas vos données médicales. Chaque scan est journalisé.
                </p>
              </div>
            </div>

            <div className="w-full">
              <p className="text-xs text-center font-mono" style={{ color: 'var(--muted-foreground)' }}>{maskedId}</p>
              <p className="text-xs text-center mt-1" style={{ color: 'var(--muted-foreground)' }}>Expire dans 15 minutes · Renouvelable</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: History */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Chaque accès à votre SHIFA ID est journalisé de manière immuable</p>
            <button className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>
              Exporter
            </button>
          </div>
          {accessHistory.map((entry, i) => (
            <div key={i} className="card-base p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: entry.authorized ? '#dcfce7' : '#fee2e2' }}>
                <Icon name={entry.authorized ? 'CheckCircleIcon' : 'XCircleIcon'} size={20} style={{ color: entry.authorized ? '#16a34a' : '#dc2626' } as any} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{entry.actor}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{entry.role}</span>
                </div>
                <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{entry.action} · {entry.location}</p>
              </div>
              <span className="text-xs shrink-0" style={{ color: 'var(--muted-foreground)' }}>{entry.date}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Privacy */}
      {activeTab === 'privacy' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-base p-6">
            <h3 className="text-base font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Visibilité du SHIFA ID</h3>
            <div className="space-y-4">
              {[
                { label: 'Visible par les professionnels de santé', desc: 'Médecins, infirmiers, pharmaciens autorisés', checked: true },
                { label: 'Visible par les établissements', desc: 'Hôpitaux, cliniques, centres de santé', checked: true },
                { label: 'Visible par les assureurs', desc: 'Uniquement pour les remboursements autorisés', checked: false },
                { label: 'Visible dans les urgences', desc: 'Accès d\'urgence sans consentement préalable', checked: true },
              ].map(item => (
                <div key={item.label} className="flex items-start justify-between gap-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{item.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{item.desc}</p>
                  </div>
                  <div className="relative w-11 h-6 rounded-full shrink-0" style={{ backgroundColor: item.checked ? 'var(--shifa-blue)' : 'var(--border)' }}>
                    <span className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" style={{ left: item.checked ? '22px' : '4px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="card-base p-5">
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--shifa-dark)' }}>Ce que le SHIFA ID ne contient PAS</h3>
              <div className="space-y-2">
                {[
                  'Données médicales ou diagnostics',
                  'Résultats d\'analyses ou d\'imagerie',
                  'Prescriptions ou traitements',
                  'Informations financières',
                  'Données biométriques sensibles',
                  'Historique de consultations',
                ].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <Icon name="XMarkIcon" size={14} style={{ color: '#dc2626' } as any} className="shrink-0" />
                    <span className="text-sm" style={{ color: 'var(--foreground)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-base p-5">
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--shifa-dark)' }}>Ce que le SHIFA ID contient</h3>
              <div className="space-y-2">
                {[
                  'Identifiant unique SHIFA',
                  'Pays et région de création',
                  'Année de création',
                  'Clé de vérification cryptographique',
                  'Statut du compte (actif/inactif)',
                ].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <Icon name="CheckIcon" size={14} style={{ color: '#16a34a' } as any} className="shrink-0" />
                    <span className="text-sm" style={{ color: 'var(--foreground)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
