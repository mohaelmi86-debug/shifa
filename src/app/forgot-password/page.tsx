'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Icon from '@/components/ui/AppIcon';
import ShifaBrand from '@/components/ui/ShifaBrand';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Veuillez saisir votre adresse e-mail.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback?next=/reset-password`,
      });
      if (resetError) throw resetError;
      setSent(true);
    } catch (err: any) {
      setError(err?.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#E8EEF8' }}>
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] xl:w-[480px] shrink-0 p-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0A1E4A 0%, #0878EF 65%, #38B6FF 100%)' }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
          <div className="absolute top-1/3 -left-24 w-64 h-64 rounded-full" style={{ background: 'rgba(255,255,255,0.03)' }} />
          <div className="absolute -bottom-24 right-8 w-96 h-96 rounded-full" style={{ background: 'rgba(255,255,255,0.03)' }} />
        </div>
        <div className="relative z-10">
          <ShifaBrand variant="full" theme="dark" />
        </div>
        <div className="relative z-10">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}
          >
            <Icon name="LockClosedIcon" size={28} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white leading-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
            Récupérez<br />votre accès.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
            Saisissez votre adresse e-mail et nous vous enverrons un lien sécurisé pour réinitialiser votre mot de passe.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {['Lien sécurisé', 'Valable 1h', 'Chiffré TLS', 'RGPD'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.88)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <p className="text-xs relative z-10" style={{ color: 'rgba(255,255,255,0.35)' }}>
          © 2026 SHIFA Health OS · Plateforme de santé numérique
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto px-5 py-10" style={{ backgroundColor: '#E8EEF8' }}>
        {/* Mobile logo */}
        <div className="lg:hidden w-full max-w-md mb-6">
          <div
            className="w-full rounded-2xl overflow-hidden relative flex flex-col items-center justify-center py-7"
            style={{ background: 'linear-gradient(145deg, #0878EF 0%, #0A1E4A 100%)', minHeight: '120px' }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.04)', transform: 'translate(30%, -30%)' }} />
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.95)', padding: '10px 18px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                <ShifaBrand variant="auth" />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md">
          {/* Card */}
          <div
            className="rounded-2xl border p-8"
            style={{
              backgroundColor: 'var(--shifa-surface-2)',
              borderColor: 'var(--border)',
              boxShadow: '0 4px 24px rgba(21,101,216,0.08), 0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            {sent ? (
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'linear-gradient(135deg, rgba(5,150,105,0.12), rgba(52,211,153,0.08))', border: '1.5px solid rgba(5,150,105,0.2)' }}
                >
                  <Icon name="CheckCircleIcon" size={32} style={{ color: '#059669' } as any} />
                </div>
                <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}>
                  E-mail envoyé !
                </h1>
                <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>
                  Un lien de réinitialisation a été envoyé à
                </p>
                <p className="text-sm font-semibold mb-6 px-3 py-2 rounded-xl" style={{ color: 'var(--shifa-blue)', backgroundColor: 'var(--shifa-light)' }}>
                  {email}
                </p>
                <p className="text-xs mb-6" style={{ color: 'var(--muted-foreground)' }}>
                  Vérifiez votre boîte de réception et vos spams. Le lien est valable 1 heure.
                </p>
                <Link
                  href="/sign-up-login-screen"
                  className="btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2"
                  style={{ minHeight: '44px' }}
                >
                  <Icon name="ArrowLeftIcon" size={16} />
                  Retour à la connexion
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-7">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: 'linear-gradient(135deg, rgba(21,101,216,0.1), rgba(33,150,243,0.06))', border: '1.5px solid rgba(21,101,216,0.15)' }}
                  >
                    <Icon name="LockClosedIcon" size={22} style={{ color: 'var(--shifa-blue)' } as any} />
                  </div>
                  <h1 className="text-2xl font-bold mb-1.5" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
                    Mot de passe oublié
                  </h1>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    Saisissez votre adresse e-mail pour recevoir un lien de réinitialisation sécurisé.
                  </p>
                </div>

                {error && (
                  <div
                    className="flex items-start gap-3 p-4 rounded-xl mb-5 border"
                    style={{ backgroundColor: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.18)' }}
                  >
                    <Icon name="ExclamationCircleIcon" size={18} style={{ color: 'var(--shifa-red)', flexShrink: 0 } as any} />
                    <p className="text-sm" style={{ color: 'var(--shifa-red)' }}>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>
                      Adresse e-mail
                    </label>
                    <input
                      type="email"
                      className="input-premium"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoFocus
                      aria-label="Adresse e-mail"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ minHeight: '44px' }}
                  >
                    {isLoading ? (
                      <Icon name="ArrowPathIcon" size={18} className="animate-spin" />
                    ) : (
                      <>
                        <Icon name="EnvelopeIcon" size={16} />
                        Envoyer le lien de réinitialisation
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-5 border-t text-center" style={{ borderColor: 'var(--border)' }}>
                  <Link
                    href="/sign-up-login-screen"
                    className="text-sm font-semibold transition-colors hover:underline inline-flex items-center gap-1.5"
                    style={{ color: 'var(--shifa-blue)' }}
                  >
                    <Icon name="ArrowLeftIcon" size={14} />
                    Retour à la connexion
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
