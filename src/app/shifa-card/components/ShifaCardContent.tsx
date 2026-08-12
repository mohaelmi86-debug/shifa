'use client';
import React, { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import ShifaBrand from '@/components/ui/ShifaBrand';

type CardTab = 'digital' | 'physical';

export default function ShifaCardContent() {
  const [activeTab, setActiveTab] = useState<CardTab>('digital');
  const [showQR, setShowQR] = useState(false);
  const [physicalStep, setPhysicalStep] = useState<'info' | 'order' | 'confirm'>('info');

  const patient = {
    name: 'Aïcha Diallo',
    firstName: 'Aïcha',
    lastName: 'DIALLO',
    shifaId: 'SH-2-225-FR-2025-7K4D',
    country: 'Sénégal',
    status: 'Actif',
    dob: '12/03/1992',
    bloodType: 'O+',
    avatar: 'AD',
    memberSince: '2025',
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Carte SHIFA</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Votre identité de santé numérique sécurisée</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-6 w-fit" style={{ backgroundColor: 'var(--muted)' }}>
        {[
          { key: 'digital', label: 'Carte numérique', icon: 'DevicePhoneMobileIcon' },
          { key: 'physical', label: 'Carte physique', icon: 'CreditCardIcon' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as CardTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.key ? 'shadow-sm' : ''}`}
            style={{
              backgroundColor: activeTab === tab.key ? 'var(--card)' : 'transparent',
              color: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
            }}
          >
            <Icon name={tab.icon as any} size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'digital' ? (
        <div className="flex flex-col gap-6">
          {/* Card Front */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--muted-foreground)' }}>Recto</p>
            <div
              className="relative rounded-3xl overflow-hidden p-6 sm:p-8"
              style={{
                background: 'linear-gradient(135deg, #0A1B3D 0%, #0A4B9A 55%, #0066FF 100%)',
                minHeight: '200px',
                boxShadow: '0 20px 60px rgba(0,102,255,0.3)',
              }}
            >
              {/* Background logo watermark */}
              <div className="absolute right-4 bottom-4 opacity-10 w-36 h-16">
                <AppImage
                  src="/assets/images/file_00000000594071f4b27d19b03582b884-1786375501710.png"
                  alt="SHIFA watermark"
                  width={144}
                  height={64}
                  className="object-contain w-full h-full"
                />
              </div>

              {/* Top row */}
              <div className="flex items-start justify-between mb-6">
                <ShifaBrand variant="card" theme="dark" symbolSize={32} />
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(0,242,195,0.15)', border: '1px solid rgba(0,242,195,0.3)' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--shifa-cyan)' }} />
                  <span className="text-xs font-semibold" style={{ color: 'var(--shifa-cyan)' }}>{patient.status}</span>
                </div>
              </div>

              {/* Patient info */}
              <div className="flex items-end justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white border-2"
                    style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)' }}
                  >
                    {patient.avatar}
                  </div>
                  <div>
                    <p className="text-white font-extrabold text-lg leading-tight">{patient.lastName}</p>
                    <p className="text-white/80 font-medium">{patient.firstName}</p>
                    <p className="text-xs mt-1 font-mono" style={{ color: 'rgba(0,242,195,0.9)' }}>{patient.shifaId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Pays</p>
                  <p className="text-sm font-semibold text-white">{patient.country}</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Depuis {patient.memberSince}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card Back */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--muted-foreground)' }}>Verso</p>
            <div
              className="relative rounded-3xl overflow-hidden p-6 sm:p-8"
              style={{
                background: 'linear-gradient(135deg, #0A1B3D 0%, #0A4B9A 55%, #0066FF 100%)',
                minHeight: '200px',
                boxShadow: '0 20px 60px rgba(0,102,255,0.3)',
              }}
            >
              <div className="absolute right-4 bottom-4 opacity-10 w-36 h-16">
                <AppImage
                  src="/assets/images/file_00000000594071f4b27d19b03582b884-1786375501710.png"
                  alt="SHIFA watermark"
                  width={144}
                  height={64}
                  className="object-contain w-full h-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>Code de vérification sécurisé</p>
                  {/* QR Code placeholder */}
                  <div
                    className="w-28 h-28 rounded-xl flex items-center justify-center cursor-pointer"
                    style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
                    onClick={() => setShowQR(!showQR)}
                  >
                    <div className="grid grid-cols-5 gap-0.5 p-2">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-sm"
                          style={{ backgroundColor: Math.random() > 0.4 ? '#0A1B3D' : 'transparent' }}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>Scanner pour vérifier</p>
                </div>
                <div className="text-right flex flex-col gap-2">
                  <ShifaBrand variant="card" theme="dark" symbolSize={28} />
                  <div className="mt-4">
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>SHIFA ID</p>
                    <p className="text-sm font-mono font-bold text-white">{patient.shifaId}</p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Groupe sanguin</p>
                    <p className="text-sm font-bold" style={{ color: 'var(--shifa-cyan)' }}>{patient.bloodType}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: 'EyeIcon', label: 'Afficher', color: 'var(--shifa-blue)' },
              { icon: 'ArrowDownTrayIcon', label: 'Télécharger', color: 'var(--shifa-blue)' },
              { icon: 'ShareIcon', label: 'Partager', color: 'var(--shifa-blue)' },
              { icon: 'QrCodeIcon', label: 'QR Code', color: 'var(--shifa-blue)' },
            ].map(action => (
              <button
                key={action.label}
                className="flex flex-col items-center gap-2 py-4 rounded-2xl border transition-all hover:shadow-shifa active:scale-95"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(0,102,255,0.1)' }}>
                  <Icon name={action.icon as any} size={20} style={{ color: action.color } as any} className="" />
                </div>
                <span className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{action.label}</span>
              </button>
            ))}
          </div>

          {/* Wallet integrations */}
          <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <p className="text-sm font-bold mb-4" style={{ color: 'var(--foreground)' }}>Ajouter à un portefeuille numérique</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Google Wallet', icon: 'WalletIcon', available: false },
                { label: 'Apple Wallet', icon: 'WalletIcon', available: false },
                { label: 'Samsung Pay', icon: 'WalletIcon', available: false },
              ].map(wallet => (
                <button
                  key={wallet.label}
                  disabled={!wallet.available}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                >
                  <Icon name={wallet.icon as any} size={16} />
                  {wallet.label}
                  {!wallet.available && <span className="text-xs px-1.5 py-0.5 rounded-full ml-1" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>Bientôt</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Physical Card */
        <div className="flex flex-col gap-6">
          {physicalStep === 'info' && (
            <>
              <div className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.1)' }}>
                    <Icon name="CreditCardIcon" size={24} style={{ color: 'var(--shifa-blue)' } as any} className="" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>Carte SHIFA physique</h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Recevez votre carte d'identité de santé officielle à domicile</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {[
                    { label: 'Frais de fabrication', value: '5 000 FCFA', icon: 'CurrencyDollarIcon' },
                    { label: 'Frais d\'activation', value: '2 500 FCFA', icon: 'ShieldCheckIcon' },
                    { label: 'Délai de livraison', value: '7–14 jours', icon: 'TruckIcon' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                      <Icon name={item.icon as any} size={18} style={{ color: 'var(--shifa-blue)' } as any} className="" />
                      <div>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                        <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2 mb-6">
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>La carte comprend :</p>
                  {[
                    'Recto : Photo, identité complète, SHIFA ID, logo officiel',
                    'Verso : QR Code de vérification sécurisé, logo SHIFA',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Icon name="CheckCircleIcon" size={16} style={{ color: 'var(--shifa-blue)', marginTop: '2px' }} className="flex-shrink-0" />
                      <p className="text-sm" style={{ color: 'var(--foreground)' }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {physicalStep === 'order' && (
            <div className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <button onClick={() => setPhysicalStep('info')} className="flex items-center gap-2 text-sm mb-5" style={{ color: 'var(--shifa-blue)' }}>
                <Icon name="ArrowLeftIcon" size={16} />
                Retour
              </button>
              <h3 className="font-bold text-base mb-5" style={{ color: 'var(--foreground)' }}>Adresse de livraison</h3>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Prénom</label>
                    <input type="text" className="input-field" defaultValue="Aïcha" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Nom</label>
                    <input type="text" className="input-field" defaultValue="Diallo" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Adresse</label>
                  <input type="text" className="input-field" placeholder="Rue, numéro..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Ville</label>
                    <input type="text" className="input-field" placeholder="Dakar" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Pays</label>
                    <input type="text" className="input-field" defaultValue="Sénégal" />
                  </div>
                </div>
                <div className="p-4 rounded-xl border" style={{ backgroundColor: 'rgba(0,102,255,0.04)', borderColor: 'rgba(0,102,255,0.15)' }}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span style={{ color: 'var(--muted-foreground)' }}>Fabrication</span>
                    <span className="font-semibold" style={{ color: 'var(--foreground)' }}>5 000 FCFA</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span style={{ color: 'var(--muted-foreground)' }}>Activation</span>
                    <span className="font-semibold" style={{ color: 'var(--foreground)' }}>2 500 FCFA</span>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                    <span className="font-bold" style={{ color: 'var(--foreground)' }}>Total</span>
                    <span className="font-bold" style={{ color: 'var(--shifa-blue)' }}>7 500 FCFA</span>
                  </div>
                </div>
                <button
                  onClick={() => setPhysicalStep('confirm')}
                  className="btn-primary w-full py-3 text-sm font-semibold"
                >
                  Confirmer la commande
                </button>
              </div>
            </div>
          )}

          {physicalStep === 'confirm' && (
            <div className="rounded-2xl border p-8 text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}>
                <Icon name="CheckCircleIcon" size={32} style={{ color: '#10B981' } as any} className="" />
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--foreground)' }}>Commande confirmée !</h3>
              <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>Votre carte SHIFA physique est en cours de fabrication. Vous recevrez un suivi par e-mail.</p>
              <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: 'var(--muted)' }}>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Numéro de commande</p>
                <p className="text-sm font-mono font-bold mt-1" style={{ color: 'var(--foreground)' }}>CMD-2025-{Math.floor(Math.random() * 90000) + 10000}</p>
              </div>
              <button onClick={() => setPhysicalStep('info')} className="btn-primary px-6 py-2.5 text-sm font-semibold">
                Retour à la carte
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
