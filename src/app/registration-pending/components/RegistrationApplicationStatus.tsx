'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';

type Application = {
  id: string;
  application_type: 'professional' | 'organization';
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'withdrawn';
  submitted_at: string;
  reviewed_at: string | null;
};

const STATUS: Record<Application['status'], { label: string; detail: string }> = {
  pending: { label: 'En attente', detail: 'Votre dossier a bien été reçu. Notre équipe doit encore commencer son examen.' },
  in_review: { label: 'En cours de vérification', detail: 'Votre dossier est en cours d’examen par l’équipe SHIFA.' },
  approved: { label: 'Demande approuvée', detail: 'Votre dossier a été approuvé. Vos accès correspondants sont maintenant activés.' },
  rejected: { label: 'Demande non approuvée', detail: 'Votre dossier n’a pas été approuvé. Contactez le support SHIFA pour connaître les prochaines étapes.' },
  withdrawn: { label: 'Demande retirée', detail: 'Cette demande a été retirée.' },
};

export default function RegistrationApplicationStatus() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (!active) return;
      if (authError || !user) {
        setSignedIn(false);
        setLoading(false);
        return;
      }
      setSignedIn(true);
      const { data, error } = await supabase
        .from('registration_applications')
        .select('id, application_type, status, submitted_at, reviewed_at')
        .eq('applicant_id', user.id)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!active) return;
      if (error) {
        setLoadError('Le suivi des candidatures sera disponible dès que le service sera activé. Réessayez un peu plus tard.');
      } else {
        setApplication(data as Application | null);
      }
      setLoading(false);
    };
    void load();
    return () => { active = false; };
  }, [supabase]);

  const openWorkspace = () => {
    if (!application || application.status !== 'approved') return;
    router.push(application.application_type === 'professional'
      ? '/workspace-professionnel'
      : '/administration-tablissement');
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-5 py-12" style={{ background: 'var(--background)' }}>
      <section className="w-full max-w-2xl rounded-2xl border p-6 sm:p-8 shadow-sm" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: 'rgba(13, 148, 136, 0.12)', color: 'var(--shifa-green)' }}>
            <Icon name="ClipboardDocumentCheckIcon" size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--shifa-blue)' }}>SHIFA Health OS</p>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Suivi de mon inscription</h1>
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl border p-6 text-center text-sm" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>Chargement de votre dossier…</div>
        ) : !signedIn ? (
          <div className="rounded-xl border p-5" style={{ borderColor: 'var(--border)' }}>
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Connectez-vous pour consulter votre dossier</h2>
            <p className="mt-2 text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>Si vous venez de créer votre compte, confirmez d’abord votre adresse e-mail depuis le message envoyé par SHIFA, puis connectez-vous.</p>
            <Link href="/sign-up-login-screen" className="mt-5 inline-flex rounded-xl px-5 py-3 text-sm font-semibold text-white" style={{ background: 'var(--shifa-blue)' }}>Accéder à la connexion</Link>
          </div>
        ) : loadError ? (
          <div role="alert" className="rounded-xl border p-5 text-sm leading-6" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>{loadError}</div>
        ) : !application ? (
          <div className="rounded-xl border p-5" style={{ borderColor: 'var(--border)' }}>
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Aucune candidature professionnelle ou établissement trouvée</h2>
            <p className="mt-2 text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>Si vous avez soumis une demande, vérifiez que vous utilisez le compte associé à cette inscription. Les comptes patients ordinaires n’ont pas de dossier de validation à suivre.</p>
            <Link href="/patient-home" className="mt-5 inline-flex rounded-xl border px-5 py-3 text-sm font-semibold" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Retour à mon espace</Link>
          </div>
        ) : (
          <div className="rounded-xl border p-5" style={{ borderColor: 'var(--border)' }}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Type de demande</p>
                <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{application.application_type === 'professional' ? 'Professionnel de santé' : 'Établissement de santé'}</p>
              </div>
              <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: application.status === 'approved' ? 'rgba(16,185,129,.12)' : application.status === 'rejected' ? 'rgba(239,68,68,.1)' : 'rgba(245,158,11,.12)', color: application.status === 'approved' ? 'var(--shifa-green)' : application.status === 'rejected' ? 'var(--shifa-red)' : 'var(--shifa-amber)' }}>
                {STATUS[application.status].label}
              </span>
            </div>
            <div className="my-4 h-px" style={{ background: 'var(--border)' }} />
            <p className="text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>{STATUS[application.status].detail}</p>
            <p className="mt-4 text-xs" style={{ color: 'var(--muted-foreground)' }}>Demande déposée le {new Date(application.submitted_at).toLocaleString('fr-FR')}</p>
            {application.reviewed_at && <p className="mt-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>Dernière décision le {new Date(application.reviewed_at).toLocaleString('fr-FR')}</p>}
            {application.status === 'approved' && (
              <button type="button" onClick={openWorkspace} className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white" style={{ background: 'var(--shifa-blue)' }}>
                Accéder à mon espace <Icon name="ArrowRightIcon" size={16} />
              </button>
            )}
            {application.status === 'rejected' && <p className="mt-4 text-xs leading-5" style={{ color: 'var(--muted-foreground)' }}>Pour protéger les échanges internes, les notes de vérification ne sont pas affichées dans cet espace.</p>}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {signedIn && <Link href="/patient-home" className="text-sm font-medium" style={{ color: 'var(--shifa-blue)' }}>Mon espace patient</Link>}
          <Link href="/sign-up-login-screen" className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Retour à la connexion</Link>
        </div>
      </section>
    </main>
  );
}
