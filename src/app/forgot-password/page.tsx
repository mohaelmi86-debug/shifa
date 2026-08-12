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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--background)' }}>
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border p-8 shadow-sm" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <ShifaBrand variant="full" />
          </div>

          {sent ? (
            /* Success state */
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
              >
                <Icon name="CheckCircleIcon" size={32} style={{ color: '#16a34a' } as any} className="" />
              </div>
              <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--shifa-dark)' }}>
                E-mail envoyé !
              </h1>
              <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
                Un lien de réinitialisation a été envoyé à <strong>{email}</strong>. Vérifiez votre boîte de réception (et vos spams).
              </p>
              <Link
                href="/sign-up-login-screen"
                className="btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Icon name="ArrowLeftIcon" size={16} />
                Retour à la connexion
              </Link>
            </div>
          ) : (
            /* Form state */
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-1.5" style={{ color: 'var(--shifa-dark)' }}>
                  Mot de passe oublié
                </h1>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Saisissez votre adresse e-mail pour recevoir un lien de réinitialisation.
                </p>
              </div>

              {error && (
                <div
                  className="flex items-start gap-3 p-4 rounded-xl mb-5 border"
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.06)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                >
                  <Icon name="ExclamationCircleIcon" size={18} style={{ color: 'var(--shifa-red)', flexShrink: 0 } as any} className="" />
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
                    className="input-field"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full py-3 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ minHeight: '44px' }}
                >
                  {isLoading ? (
                    <Icon name="ArrowPathIcon" size={18} className="animate-spin" />
                  ) : (
                    <>
                      <Icon name="EnvelopeIcon" size={16} />
                      Envoyer le lien
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/sign-up-login-screen"
                  className="text-sm font-medium transition-colors hover:underline flex items-center justify-center gap-1.5"
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
  );
}
