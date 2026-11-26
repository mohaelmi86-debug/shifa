'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Icon from '@/components/ui/AppIcon';

type RegistrationRequest = {
  id: string;
  user_id: string;
  request_type: 'professional' | 'institution';
  payload: Record<string, unknown>;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'cancelled';
  created_at: string;
  decision_note: string | null;
};

const labels: Record<string, string> = {
  first_name: 'Prénom',
  last_name: 'Nom',
  profession: 'Profession',
  specialty: 'Spécialité',
  license_number: 'Numéro professionnel',
  professional_type: 'Mode d’exercice',
  country: 'Pays',
  phone: 'Téléphone',
  email: 'E-mail professionnel',
  organization_name: 'Établissement',
  organization_type: 'Type d’établissement',
  city: 'Ville',
  address: 'Adresse',
  organization_email: 'E-mail établissement',
  registration_number: 'N° d’enregistrement',
  admin_first_name: 'Prénom administrateur',
  admin_last_name: 'Nom administrateur',
  admin_email: 'E-mail administrateur',
};

const statusLabels: Record<RegistrationRequest['status'], string> = {
  pending: 'À examiner',
  under_review: 'En cours de vérification',
  approved: 'Validée',
  rejected: 'Refusée',
  cancelled: 'Annulée',
};

export default function RegistrationRequestsContent() {
  const supabase = useMemo(() => createClient(), []);
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [notes, setNotes] = useState<Record<string, string>>({});

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError('');
    const { data, error: queryError } = await supabase
      .from('registration_requests')
      .select('id,user_id,request_type,payload,status,created_at,decision_note')
      .order('created_at', { ascending: false })
      .limit(100);

    if (queryError) {
      setError(queryError.message);
      setRequests([]);
    } else {
      setRequests((data || []) as RegistrationRequest[]);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const reviewRequest = async (request: RegistrationRequest, decision: 'approved' | 'rejected' | 'under_review') => {
    const actionLabels = {
      approved: 'valider cette demande',
      rejected: 'refuser cette demande',
      under_review: 'placer cette demande en vérification',
    };
    if (!window.confirm(`Confirmer : ${actionLabels[decision]} ?`)) return;

    setBusyId(request.id);
    setError('');
    setNotice('');
    const { error: reviewError } = await supabase.rpc('review_registration_request', {
      p_request_id: request.id,
      p_decision: decision,
      p_decision_note: notes[request.id] || null,
    });

    if (reviewError) {
      setError(reviewError.message);
    } else {
      setNotice('La demande a été mise à jour.');
      await loadRequests();
    }
    setBusyId(null);
  };

  const pendingCount = requests.filter((request) => request.status === 'pending' || request.status === 'under_review').length;

  return (
    <div className="mx-auto max-w-screen-2xl px-6 py-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Administration plateforme</p>
          <h1 className="mt-1 text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Demandes d’inscription</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Vérifiez les professionnels et les établissements avant de leur attribuer un accès privilégié.
          </p>
        </div>
        <button type="button" onClick={() => void loadRequests()} className="btn-secondary flex items-center gap-2 text-sm" disabled={loading}>
          <Icon name="ArrowPathIcon" size={15} />
          Actualiser
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="card-base">
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Demandes chargées</p>
          <p className="mt-1 text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{requests.length}</p>
        </div>
        <div className="card-base">
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>À traiter</p>
          <p className="mt-1 text-2xl font-bold" style={{ color: 'var(--shifa-amber)' }}>{pendingCount}</p>
        </div>
        <div className="card-base">
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Validées</p>
          <p className="mt-1 text-2xl font-bold" style={{ color: 'var(--shifa-green)' }}>{requests.filter((r) => r.status === 'approved').length}</p>
        </div>
      </div>

      {error && <div role="alert" className="mb-4 rounded-xl border p-4 text-sm" style={{ borderColor: 'rgba(239,68,68,.3)', color: 'var(--shifa-red)' }}>{error}</div>}
      {notice && <div role="status" className="mb-4 rounded-xl border p-4 text-sm" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>{notice}</div>}

      {loading ? (
        <div className="card-base flex items-center gap-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>
          <Icon name="ArrowPathIcon" size={17} className="animate-spin" />
          Chargement des demandes…
        </div>
      ) : requests.length === 0 ? (
        <div className="card-base py-12 text-center">
          <Icon name="ClipboardDocumentCheckIcon" size={30} className="mx-auto mb-3" style={{ color: 'var(--muted-foreground)' }} />
          <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Aucune demande enregistrée</p>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>Les nouvelles demandes professionnelles et institutionnelles apparaîtront ici.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {requests.map((request) => {
            const isOpen = request.status === 'pending' || request.status === 'under_review';
            const entries = Object.entries(request.payload || {}).filter(([, value]) => value !== null && value !== '');
            return (
              <article key={request.id} className="card-base">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>
                        {request.request_type === 'professional' ? 'Demande professionnelle' : 'Demande établissement'}
                      </h2>
                      <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ backgroundColor: request.status === 'approved' ? 'rgba(16,185,129,.1)' : request.status === 'rejected' ? 'rgba(239,68,68,.1)' : 'rgba(245,158,11,.1)', color: request.status === 'approved' ? 'var(--shifa-green)' : request.status === 'rejected' ? 'var(--shifa-red)' : 'var(--shifa-amber)' }}>
                        {statusLabels[request.status]}
                      </span>
                    </div>
                    <p className="mt-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      Reçue le {new Date(request.created_at).toLocaleString('fr-FR')} · Compte {request.user_id}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {entries.map(([key, value]) => (
                    <div key={key} className="min-w-0 rounded-lg p-3" style={{ backgroundColor: 'var(--background)' }}>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{labels[key] || key}</p>
                      <p className="mt-1 break-words text-sm font-medium" style={{ color: 'var(--foreground)' }}>{String(value)}</p>
                    </div>
                  ))}
                </div>

                {isOpen && (
                  <div className="mt-4 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                    <label className="mb-2 block text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>Note de vérification (facultative)</label>
                    <textarea
                      rows={2}
                      value={notes[request.id] || ''}
                      onChange={(event) => setNotes((current) => ({ ...current, [request.id]: event.target.value }))}
                      className="input-field w-full"
                      placeholder="Ex. numéro d’ordre vérifié auprès de l’autorité compétente…"
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" disabled={busyId === request.id} onClick={() => void reviewRequest(request, 'under_review')} className="btn-secondary text-sm">
                        Mettre en vérification
                      </button>
                      <button type="button" disabled={busyId === request.id} onClick={() => void reviewRequest(request, 'rejected')} className="btn-secondary text-sm">
                        Refuser
                      </button>
                      <button type="button" disabled={busyId === request.id} onClick={() => void reviewRequest(request, 'approved')} className="btn-primary text-sm">
                        {busyId === request.id ? 'Traitement…' : 'Valider et activer'}
                      </button>
                    </div>
                    {request.request_type === 'professional' && request.payload.professional_type === 'salarie' && (
                      <p className="mt-2 text-xs" style={{ color: 'var(--shifa-amber)' }}>
                        Ce profil salarié doit d’abord être rattaché à un établissement par invitation ; l’activation directe est bloquée.
                      </p>
                    )}
                  </div>
                )}
                {request.decision_note && (
                  <p className="mt-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>Note : {request.decision_note}</p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
