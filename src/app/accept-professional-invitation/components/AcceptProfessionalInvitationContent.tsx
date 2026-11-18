'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function AcceptProfessionalInvitationContent() {
  const supabase = useMemo(() => createClient(), []);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const params = new URLSearchParams(window.location.search);
      const invitationToken = params.get('token') || '';
      const { data: { user } } = await supabase.auth.getUser();
      if (!active) return;
      setToken(invitationToken);
      setEmail(user?.email || '');
      setSignedIn(Boolean(user));
      if (!invitationToken || invitationToken.length !== 64 || !/^[a-f0-9]+$/i.test(invitationToken)) {
        setError('Ce lien d’invitation est invalide ou incomplet.');
      }
      setLoading(false);
    };
    void load();
    return () => { active = false; };
  }, [supabase]);

  const accept = async () => {
    setBusy(true);
    setError('');
    const { error: acceptError } = await supabase.rpc('accept_professional_invitation', { p_token: token });
    if (acceptError) {
      const message = acceptError.message || '';
      setError(message.includes('INVITATION_EMAIL_MISMATCH')
        ? 'L’adresse e-mail de votre compte ne correspond pas à celle invitée. Connectez-vous avec la bonne adresse.'
        : message.includes('INVITATION_NOT_ACTIVE')
          ? 'Cette invitation a expiré ou a déjà été utilisée. Demandez un nouveau lien à votre établissement.'
          : message.includes('PROFESSIONAL_ALREADY_LINKED_TO_ANOTHER_ORGANIZATION')
            ? 'Votre compte professionnel est déjà rattaché à un autre établissement.'
            : 'Impossible d’accepter cette invitation. Vérifiez votre compte ou contactez votre établissement.');
    } else {
      setSuccess(true);
    }
    setBusy(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-5 py-12" style={{ background: 'var(--background)' }}>
      <section className="w-full max-w-xl rounded-2xl border p-6 sm:p-8 shadow-sm" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--shifa-blue)' }}>SHIFA Health OS</p>
        <h1 className="mt-2 text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Invitation professionnelle</h1>
        {loading ? <p className="mt-5 text-sm">Vérification du lien…</p> : success ? (
          <div className="mt-5 rounded-xl border p-5" style={{ borderColor: 'var(--border)' }}>
            <p className="font-semibold" style={{ color: 'var(--shifa-green)' }}>Invitation acceptée</p>
            <p className="mt-2 text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>Votre compte est maintenant rattaché à l’établissement. Votre profil professionnel reste en attente de vérification des justificatifs avant toute validation de vos qualifications.</p>
            <Link href="/workspace-professionnel" className="btn-primary inline-flex mt-4 px-5 py-3">Accéder à mon espace</Link>
          </div>
        ) : error && !token ? (
          <p role="alert" className="mt-5 text-sm" style={{ color: 'var(--shifa-red)' }}>{error}</p>
        ) : !signedIn ? (
          <div className="mt-5">
            <p className="text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>Connectez-vous avec l’adresse e-mail invitée ({email || 'celle de votre invitation'}) pour accepter ce rattachement. Si vous n’avez pas encore de compte, créez d’abord un compte patient avec cette même adresse.</p>
            <Link href={`/sign-up-login-screen?redirectTo=${encodeURIComponent(`/accept-professional-invitation?token=${token}`)}`} className="btn-primary inline-flex mt-4 px-5 py-3">Se connecter</Link>
          </div>
        ) : (
          <div className="mt-5">
            <p className="text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>Vous êtes connecté avec <strong>{email}</strong>. En acceptant, vous serez rattaché à l’établissement qui vous a invité. Vos qualifications ne seront pas automatiquement vérifiées.</p>
            {error && <p role="alert" className="mt-4 text-sm" style={{ color: 'var(--shifa-red)' }}>{error}</p>}
            <button type="button" disabled={busy || !token} onClick={() => void accept()} className="btn-primary mt-5 px-5 py-3 disabled:opacity-50">{busy ? 'Validation…' : 'Accepter l’invitation'}</button>
          </div>
        )}
        <Link href="/patient-home" className="block mt-6 text-sm" style={{ color: 'var(--muted-foreground)' }}>Retour à mon espace</Link>
      </section>
    </main>
  );
}
