'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface DeleteAccountModalProps {
  onClose: () => void;
}

function DeleteAccountModal({ onClose }: DeleteAccountModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const { signOut } = useAuth();
  const router = useRouter();

  const handleDelete = async () => {
    if (confirmText !== 'SUPPRIMER') {
      setError('Veuillez saisir SUPPRIMER pour confirmer.');
      return;
    }
    setIsDeleting(true);
    setError('');
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Mark account for deletion (soft delete via profile update)
        await supabase
          .from('user_profiles')
          .update({ deletion_requested_at: new Date().toISOString() })
          .eq('id', user.id);
      }
      await signOut();
      router.push('/sign-up-login-screen?deleted=1');
    } catch (err: any) {
      setError(err?.message || 'Une erreur est survenue. Veuillez contacter le support.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ backgroundColor: 'rgba(26,43,74,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-md rounded-3xl overflow-hidden animate-slide-up" style={{ backgroundColor: 'var(--card)' }}>
        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}>
              <Icon name="TrashIcon" size={20} style={{ color: 'var(--shifa-red)' } as any} className="" />
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>Supprimer mon compte</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--shifa-gray)' }}>Étape {step} sur 3</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-muted transition-colors" aria-label="Fermer">
            <Icon name="XMarkIcon" size={18} className="text-muted-foreground" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm font-semibold" style={{ color: 'var(--shifa-dark)' }}>Avant de continuer, veuillez lire attentivement :</p>
              <div className="flex flex-col gap-3">
                {[
                  { icon: '🗑️', title: 'Données supprimées', desc: 'Votre profil, préférences et données de compte seront supprimés définitivement.' },
                  { icon: '📋', title: 'Données conservées', desc: 'Vos données médicales peuvent être conservées conformément aux obligations légales (RGPD, réglementations locales).' },
                  { icon: '📅', title: 'Délai de traitement', desc: 'La suppression effective peut prendre jusqu\'à 30 jours.' },
                  { icon: '🔒', title: 'Irréversible', desc: 'Cette action est définitive. Vous ne pourrez pas récupérer votre compte.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--background)' }}>
                    <span className="text-lg shrink-0" role="img" aria-hidden="true">{item.icon}</span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--shifa-dark)' }}>{item.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--shifa-gray)' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={onClose} className="btn-secondary flex-1 text-sm">Annuler</button>
                <button onClick={() => setStep(2)} className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all active:scale-95" style={{ backgroundColor: 'var(--shifa-red)' }}>
                  Je comprends, continuer
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm" style={{ color: 'var(--shifa-gray)' }}>
                Avant de supprimer votre compte, nous vous recommandons de :
              </p>
              <div className="flex flex-col gap-2">
                {[
                  'Télécharger votre dossier de santé',
                  'Exporter vos documents médicaux',
                  'Informer vos professionnels de santé',
                  'Annuler vos abonnements actifs',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--background)' }}>
                    <div className="w-5 h-5 rounded-full border-2 shrink-0" style={{ borderColor: 'var(--border)' }} />
                    <p className="text-sm" style={{ color: 'var(--foreground)' }}>{item}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1 text-sm">Retour</button>
                <button onClick={() => setStep(3)} className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all active:scale-95" style={{ backgroundColor: 'var(--shifa-red)' }}>
                  Continuer
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <p className="text-sm font-semibold" style={{ color: 'var(--shifa-red)' }}>⚠️ Confirmation finale requise</p>
                <p className="text-xs mt-1" style={{ color: 'var(--shifa-gray)' }}>Cette action est irréversible. Tapez <strong>SUPPRIMER</strong> pour confirmer.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--muted-foreground)' }}>
                  Saisissez SUPPRIMER pour confirmer
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="SUPPRIMER"
                  className="input-field"
                  autoComplete="off"
                />
              </div>
              {error && (
                <p className="text-xs font-medium" style={{ color: 'var(--shifa-red)' }}>{error}</p>
              )}
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-secondary flex-1 text-sm">Retour</button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting || confirmText !== 'SUPPRIMER'}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: 'var(--shifa-red)' }}
                >
                  {isDeleting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
                      Suppression...
                    </span>
                  ) : 'Supprimer définitivement'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Social media links component
const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    color: '#1877F2',
  },
  {
    name: 'X (Twitter)',
    href: 'https://x.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    color: '#000000',
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
    color: '#E4405F',
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    color: '#0A66C2',
  },
  {
    name: 'TikTok',
    href: 'https://tiktok.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z"/>
      </svg>
    ),
    color: '#000000',
  },
];

export { DeleteAccountModal, socialLinks };
