'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type KioskStep = 'welcome' | 'scan' | 'confirm' | 'ticket';

export default function ShifaKioskContent() {
  const [step, setStep] = useState<KioskStep>('welcome');
  const [adminView, setAdminView] = useState(true);

  if (adminView) {
    return (
      <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                <Icon name="ComputerDesktopIcon" size={16} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>SHIFA Kiosk</h1>
            </div>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Borne d'accueil patient — enregistrement, QR, tickets de file d'attente</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAdminView(false)}
              className="btn-primary text-sm px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <Icon name="ComputerDesktopIcon" size={16} />
              Aperçu borne patient
            </button>
          </div>
        </div>

        {/* Admin config */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card p-5">
              <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>État des bornes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'KIOSK-01', location: 'Entrée principale', status: 'online', queue: 12 },
                  { id: 'KIOSK-02', location: 'Urgences', status: 'online', queue: 4 },
                  { id: 'KIOSK-03', location: 'Consultations externes', status: 'offline', queue: 0 },
                  { id: 'KIOSK-04', location: 'Maternité', status: 'online', queue: 3 },
                ].map(kiosk => (
                  <div key={kiosk.id} className="p-3 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{kiosk.id}</p>
                      <span className="flex items-center gap-1 text-xs font-medium" style={{ color: kiosk.status === 'online' ? '#16a34a' : '#dc2626' }}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: kiosk.status === 'online' ? '#16a34a' : '#dc2626' }} />
                        {kiosk.status === 'online' ? 'En ligne' : 'Hors ligne'}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kiosk.location}</p>
                    {kiosk.status === 'online' && (
                      <p className="text-xs mt-1 font-medium" style={{ color: 'var(--shifa-blue)' }}>{kiosk.queue} patients en file</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Statistiques du jour</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Enregistrements', value: '87', color: 'var(--shifa-blue)' },
                  { label: 'Tickets émis', value: '87', color: '#8b5cf6' },
                  { label: 'Temps moyen', value: '1m 42s', color: '#16a34a' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Config panel */}
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Configuration</h3>
              <div className="space-y-3">
                {[
                  { label: 'Scan QR SHIFA', enabled: true },
                  { label: 'Recherche par nom', enabled: true },
                  { label: 'Impression ticket', enabled: true },
                  { label: 'Orientation automatique', enabled: false },
                  { label: 'Mode accessibilité', enabled: false },
                ].map(opt => (
                  <div key={opt.label} className="flex items-center justify-between">
                    <p className="text-sm" style={{ color: 'var(--foreground)' }}>{opt.label}</p>
                    <div className={`w-10 h-5 rounded-full transition-colors ${opt.enabled ? 'bg-blue-500' : 'bg-gray-300'}`} />
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Message d'accueil</h3>
              <textarea
                className="w-full px-3 py-2 rounded-xl border text-sm resize-none"
                rows={3}
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
                defaultValue="Bienvenue au CHU Saint-Louis. Veuillez scanner votre carte SHIFA ou saisir votre nom."
              />
              <button className="mt-2 w-full text-sm py-2 rounded-xl text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>Enregistrer</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Patient-facing kiosk simulation
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f0f7ff' }}>
      <div className="w-full max-w-md">
        {/* Back to admin */}
        <button
          onClick={() => { setAdminView(true); setStep('welcome'); }}
          className="mb-4 flex items-center gap-2 text-sm"
          style={{ color: 'var(--muted-foreground)' }}
        >
          <Icon name="ArrowLeftIcon" size={16} /> Retour à l'administration
        </button>

        <div className="rounded-3xl shadow-2xl overflow-hidden" style={{ backgroundColor: 'white' }}>
          {/* Kiosk header */}
          <div className="p-6 text-center text-white" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
              <Icon name="ComputerDesktopIcon" size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-bold">SHIFA Kiosk</h2>
            <p className="text-sm opacity-80 mt-1">CHU Saint-Louis — Entrée principale</p>
          </div>

          <div className="p-6">
            {step === 'welcome' && (
              <div className="text-center space-y-4">
                <p className="text-lg font-semibold" style={{ color: 'var(--shifa-dark)' }}>Bienvenue</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Veuillez scanner votre carte SHIFA ou saisir votre nom pour vous enregistrer</p>
                <div className="space-y-3 mt-6">
                  <button
                    onClick={() => setStep('scan')}
                    className="w-full py-4 rounded-2xl text-white font-semibold text-lg flex items-center justify-center gap-3"
                    style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
                  >
                    <Icon name="QrCodeIcon" size={24} />
                    Scanner ma carte SHIFA
                  </button>
                  <button
                    onClick={() => setStep('confirm')}
                    className="w-full py-4 rounded-2xl font-semibold text-lg border-2 flex items-center justify-center gap-3"
                    style={{ borderColor: 'var(--shifa-blue)', color: 'var(--shifa-blue)' }}
                  >
                    <Icon name="MagnifyingGlassIcon" size={24} />
                    Rechercher par nom
                  </button>
                </div>
              </div>
            )}

            {step === 'scan' && (
              <div className="text-center space-y-4">
                <p className="text-lg font-semibold" style={{ color: 'var(--shifa-dark)' }}>Scan QR Code</p>
                <div className="w-48 h-48 mx-auto rounded-2xl border-4 flex items-center justify-center" style={{ borderColor: 'var(--shifa-blue)', backgroundColor: '#f0f7ff' }}>
                  <div className="text-center">
                    <Icon name="QrCodeIcon" size={64} style={{ color: 'var(--shifa-blue)' } as any} />
                    <p className="text-xs mt-2" style={{ color: 'var(--muted-foreground)' }}>Zone de scan</p>
                  </div>
                </div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Présentez le QR code de votre carte SHIFA devant la caméra</p>
                <button onClick={() => setStep('confirm')} className="w-full py-3 rounded-2xl text-white font-semibold" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                  Simuler un scan réussi
                </button>
                <button onClick={() => setStep('welcome')} className="w-full py-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>Retour</button>
              </div>
            )}

            {step === 'confirm' && (
              <div className="space-y-4">
                <p className="text-lg font-semibold text-center" style={{ color: 'var(--shifa-dark)' }}>Confirmation</p>
                <div className="p-4 rounded-2xl" style={{ backgroundColor: '#f0f7ff' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>AD</div>
                    <div>
                      <p className="font-bold" style={{ color: 'var(--shifa-dark)' }}>Aïcha Diallo</p>
                      <p className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>SH-2-SN-2025-7K4D</p>
                    </div>
                  </div>
                  <div className="text-sm space-y-1" style={{ color: 'var(--muted-foreground)' }}>
                    <p>Rendez-vous : <span style={{ color: 'var(--foreground)' }}>Dr. Diallo — 09:30</span></p>
                    <p>Service : <span style={{ color: 'var(--foreground)' }}>Médecine interne — Salle 3</span></p>
                  </div>
                </div>
                <button onClick={() => setStep('ticket')} className="w-full py-4 rounded-2xl text-white font-semibold text-lg" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                  Confirmer et obtenir mon ticket
                </button>
                <button onClick={() => setStep('welcome')} className="w-full py-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>Retour</button>
              </div>
            )}

            {step === 'ticket' && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: '#dcfce7' }}>
                  <Icon name="CheckCircleIcon" size={32} style={{ color: '#16a34a' } as any} />
                </div>
                <p className="text-lg font-bold" style={{ color: '#16a34a' }}>Enregistrement confirmé</p>
                <div className="p-4 rounded-2xl border-2 border-dashed" style={{ borderColor: 'var(--shifa-blue)' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>VOTRE NUMÉRO DE FILE</p>
                  <p className="text-5xl font-bold" style={{ color: 'var(--shifa-blue)' }}>A-042</p>
                  <p className="text-sm mt-2" style={{ color: 'var(--muted-foreground)' }}>Médecine interne — Salle 3</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Temps d'attente estimé : ~15 min</p>
                </div>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Votre ticket a été envoyé sur votre application SHIFA</p>
                <button onClick={() => setStep('welcome')} className="w-full py-3 rounded-2xl text-white font-semibold" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                  Terminer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
