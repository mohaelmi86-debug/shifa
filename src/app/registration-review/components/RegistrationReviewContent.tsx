'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';

type ApplicationType = 'professional' | 'organization';
type RegistrationApplication = {
  id: string;
  application_type: ApplicationType;
  payload: Record<string, string | null>;
  status: 'pending' | 'in_review';
  submitted_at: string;
};

const FIELD_LABELS: Record<string, string> = {
  firstName: 'Prénom',
  lastName: 'Nom',
  profession: 'Profession',
  specialty: 'Spécialité',
  licenseNumber: 'N° de licence / ordre',
  country: 'Pays',
  phone: 'Téléphone',
  email: 'E-mail professionnel',
  professionalType: 'Mode d’exercice',
  organizationName: 'Établissement',
  organizationType: 'Type',
  city: 'Ville',
  address: 'Adresse',
  contactEmail: 'E-mail de contact',
  registrationNumber: 'N° d’enregistrement',
  adminFirstName: 'Prénom du responsable',
  adminLastName: 'Nom du responsable',
  adminEmail: 'E-mail du responsable',
};

export default function RegistrationReviewContent() {
  const supabase = useMemo(() => createClient(), []);
  const [applications, setApplications] = useState<RegistrationApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError('');
    const { data, error: queryError } = await supabase
      .from('registration_applications')
      .select('id, application_type, payload, status, submitted_at')
      .in('status', ['pending', 'in_review'])
      .order('submitted_at', { ascending: true });

    if (queryError) {
      setError('Impossible de charger les candidatures. Vérifiez les droits administrateur et la migration Supabase.');
      setApplications([]);
    } else {
      setApplications((data || []) as RegistrationApplication[]);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void loadApplications();
  }, [loadApplications]);

  const review = async (application: RegistrationApplication, decision: 'approve' | 'reject') => {
    const confirmation = decision === 'approve'
      ? 'Approuver ce dossier et activer les droits correspondants ?'
      : 'Rejeter cette candidature ?';
    if (!window.confirm(confirmation)) return;

    setBusyId(application.id);
    setError('');
    setNotice('');
    const { error: reviewError } = await supabase.rpc('review_registration_application', {
      p_application_id: application.id,
      p_decision: decision,
      p_review_note: reviewNote.trim() || null,
    });

    if (reviewError) {
      setError('La décision n’a pas été enregistrée. Le dossier reste inchangé.');
    } else {
      setNotice(decision === 'approve'
        ? 'Dossier approuvé. Les droits ont été attribués.'
        : 'Candidature rejetée.');
      setReviewNote('');
      await loadApplications();
    }
    setBusyId(null);
  };

  return (
    <div className="mx-auto max-w-screen-xl px-5 py-7 lg:px-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--shifa-blue)' }}>Administration plateforme</p>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Validation des inscriptions</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>Examinez les justificatifs déclarés avant toute activation de droits professionnels ou établissement.</p>
        </div>
        <button type="button" onClick={() => void loadApplications()} disabled={loading} className="btn-secondary inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm" style={{ borderColor: 'var(--border)' }}>
          <Icon name="ArrowPathIcon" size={16} className={loading ? 'animate-spin' : ''} />
          Actualiser
        </button>
      </div>

      {error && <div role="alert" className="mb-4 rounded-xl border p-3 text-sm" style={{ borderColor: 'rgba(239,68,68,.3)', color: 'var(--shifa-red)' }}>{error}</div>}
      {notice && <div role="status" className="mb-4 rounded-xl border p-3 text-sm" style={{ borderColor: 'rgba(16,185,129,.3)', color: 'var(--shifa-green)' }}>{notice}</div>}

      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
          <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{applications.length}</p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Dossiers à examiner</p>
        </div>
        <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
          <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{applications.filter(item => item.application_type === 'organization').length}</p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Demandes établissement</p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border p-8 text-center text-sm" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>Chargement des candidatures…</div>
      ) : applications.length === 0 ? (
        <div className="rounded-xl border p-10 text-center" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
          <Icon name="ClipboardDocumentCheckIcon" size={30} className="mx-auto mb-3" />
          <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Aucun dossier en attente</p>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>Les nouvelles candidatures apparaîtront ici après activation de la migration.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map(application => (
            <article key={application.id} className="rounded-2xl border p-5" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: 'rgba(0,102,255,.09)', color: 'var(--shifa-blue)' }}>
                    {application.application_type === 'professional' ? 'Professionnel de santé' : 'Établissement de santé'}
                  </span>
                  <p className="mt-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    Déposé le {new Date(application.submitted_at).toLocaleString('fr-FR')}
                  </p>
                </div>
                <span className="text-xs font-semibold" style={{ color: 'var(--shifa-amber)' }}>
                  {application.status === 'in_review' ? 'En cours d’examen' : 'En attente'}
                </span>
              </div>

              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(application.payload || {}).filter(([, value]) => value !== null && value !== '').map(([key, value]) => (
                  <div key={key} className="min-w-0">
                    <dt className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{FIELD_LABELS[key] || key}</dt>
                    <dd className="break-words text-sm font-medium" style={{ color: 'var(--foreground)' }}>{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                <label className="mb-1.5 block text-xs font-semibold" htmlFor={`review-note-${application.id}`}>Note interne (facultative)</label>
                <textarea
                  id={`review-note-${application.id}`}
                  className="input-field min-h-20 w-full"
                  maxLength={2000}
                  value={reviewNote}
                  onChange={event => setReviewNote(event.target.value)}
                  placeholder="Motif, vérifications effectuées, références de contrôle…"
                />
                <div className="mt-3 flex flex-wrap justify-end gap-2">
                  <button type="button" disabled={busyId !== null} onClick={() => void review(application, 'reject')} className="rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-50" style={{ borderColor: 'var(--border)', color: 'var(--shifa-red)' }}>
                    Rejeter
                  </button>
                  <button type="button" disabled={busyId !== null} onClick={() => void review(application, 'approve')} className="btn-primary rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-50">
                    {busyId === application.id ? 'Traitement…' : 'Approuver et activer'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
