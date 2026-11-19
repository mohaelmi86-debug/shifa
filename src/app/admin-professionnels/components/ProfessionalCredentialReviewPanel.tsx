'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type CredentialRow = {
  id: string;
  professional_id: string;
  credential_type: string;
  document_name: string;
  storage_path: string;
  mime_type: string;
  file_size: number;
  license_number: string | null;
  expires_at: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  professionals?: { first_name: string; last_name: string; profession: string } | null;
};

const labels: Record<string, string> = {
  professional_license: 'Licence professionnelle',
  professional_registration: 'Inscription à l’ordre / registre',
  diploma: 'Diplôme',
  identity: 'Pièce d’identité',
  other: 'Autre justificatif',
};

export default function ProfessionalCredentialReviewPanel() {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<CredentialRow[]>([]);
  const [expiringRows, setExpiringRows] = useState<CredentialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const horizon = new Date();
    horizon.setDate(horizon.getDate() + 30);
    const horizonDate = [
      horizon.getFullYear(),
      String(horizon.getMonth() + 1).padStart(2, '0'),
      String(horizon.getDate()).padStart(2, '0'),
    ].join('-');
    const selectFields = 'id, professional_id, credential_type, document_name, storage_path, mime_type, file_size, license_number, expires_at, status, created_at, professionals(first_name,last_name,profession)';
    const [pendingResult, expiryResult] = await Promise.all([
      supabase
        .from('professional_credentials')
        .select(selectFields)
        .eq('status', 'pending')
        .order('created_at', { ascending: true }),
      supabase
        .from('professional_credentials')
        .select(selectFields)
        .eq('status', 'approved')
        .not('expires_at', 'is', null)
        .lte('expires_at', horizonDate)
        .order('expires_at', { ascending: true })
        .limit(50),
    ]);
    if (pendingResult.error) {
      setError('Impossible de charger les justificatifs en attente. Vérifiez les droits de votre établissement.');
      setRows([]);
    } else {
      setRows((pendingResult.data || []) as unknown as CredentialRow[]);
    }
    if (expiryResult.error) {
      setError('Impossible de charger les échéances des justificatifs.');
      setExpiringRows([]);
    } else {
      setExpiringRows((expiryResult.data || []) as unknown as CredentialRow[]);
    }
    if (!pendingResult.error && !expiryResult.error) setError('');
    setLoading(false);
  }, [supabase]);

  useEffect(() => { void load(); }, [load]);

  const openDocument = async (row: CredentialRow) => {
    setError('');
    const previewWindow = window.open('about:blank', '_blank');
    const { data, error: signedError } = await supabase.storage
      .from('professional-credentials')
      .createSignedUrl(row.storage_path, 60);
    if (signedError || !data?.signedUrl) {
      previewWindow?.close();
      setError('Impossible de générer un accès temporaire au document.');
      return;
    }
    if (previewWindow) {
      previewWindow.opener = null;
      previewWindow.location.href = data.signedUrl;
    } else {
      setError('Autorisez les fenêtres contextuelles pour consulter ce justificatif.');
    }
  };

  const review = async (row: CredentialRow, decision: 'approve' | 'reject') => {
    const note = notes[row.id]?.trim() || '';
    if (decision === 'reject' && !note) {
      setError('Un motif est obligatoire pour refuser un justificatif.');
      return;
    }
    setBusyId(row.id);
    setError('');
    setNotice('');
    const { error: reviewError } = await supabase.rpc('review_professional_credential', {
      p_credential_id: row.id,
      p_decision: decision,
      p_review_note: note || null,
    });
    if (reviewError) {
      setError(reviewError.message.includes('CREDENTIAL_EXPIRED')
        ? 'Ce justificatif est expiré. Il ne peut pas être validé.'
        : reviewError.message.includes('ORGANIZATION_ADMIN_REQUIRED')
          ? 'Vous ne pouvez pas examiner un professionnel hors de votre établissement.'
          : 'La décision n’a pas pu être enregistrée. Actualisez la page et réessayez.');
    } else {
      setNotice(decision === 'approve'
        ? 'Justificatif validé. Une licence ou inscription professionnelle valide active le profil clinique.'
        : 'Justificatif refusé. Le motif est conservé dans le journal de contrôle.');
      await load();
    }
    setBusyId('');
  };

  return (
    <section className="card-base p-5 sm:p-6 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold" style={{ color: 'var(--shifa-dark)' }}>Validation des justificatifs</h2>
          <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Examen réservé aux administrateurs de l’établissement concerné.</p>
        </div>
        <button type="button" onClick={() => void load()} className="btn-secondary text-xs px-3 py-2">Actualiser</button>
      </div>
      {error && <p role="alert" className="text-sm mt-4" style={{ color: 'var(--shifa-red)' }}>{error}</p>}
      {notice && <p role="status" className="text-sm mt-4" style={{ color: 'var(--shifa-green)' }}>{notice}</p>}
      {loading ? <p className="text-sm mt-5">Chargement des dossiers…</p> : (
        <>
          {expiringRows.length > 0 && (
            <section className="mt-5 rounded-xl border p-4" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Échéances à surveiller</h3>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Justificatifs approuvés expirés ou arrivant à échéance dans les 30 jours</p>
                </div>
                <span className="text-xs font-bold rounded-full px-2 py-1" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>{expiringRows.length}</span>
              </div>
              <div className="space-y-2">
                {expiringRows.map(row => {
                  const person = row.professionals;
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const expired = Boolean(row.expires_at && new Date(row.expires_at + 'T00:00:00') < today);
                  return (
                    <div key={row.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg p-3" style={{ backgroundColor: 'var(--background)' }}>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{person ? person.first_name + ' ' + person.last_name : 'Professionnel'}</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{labels[row.credential_type] || row.credential_type} · {row.document_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold" style={{ color: expired ? 'var(--shifa-red)' : 'var(--shifa-amber)' }}>{expired ? 'Expiré' : 'Expire le'}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{row.expires_at ? new Date(row.expires_at + 'T00:00:00').toLocaleDateString('fr-FR') : 'Date inconnue'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
          {rows.length === 0 ? (
            <p className="text-sm mt-5" style={{ color: 'var(--muted-foreground)' }}>Aucun justificatif en attente pour votre établissement.</p>
          ) : (
            <div className="mt-5 space-y-4">
              {rows.map(row => {
                const person = row.professionals;
                return (
                  <article key={row.id} className="rounded-xl border p-4" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{person ? person.first_name + ' ' + person.last_name : 'Professionnel'}</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{person?.profession || 'Profession non renseignée'} · {labels[row.credential_type] || row.credential_type}</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{row.document_name} · {(row.file_size / 1024 / 1024).toFixed(2)} Mo · Déposé le {new Date(row.created_at).toLocaleDateString('fr-FR')}</p>
                        {row.license_number && <p className="text-xs mt-1">N° de licence : {row.license_number}</p>}
                        {row.expires_at && <p className="text-xs mt-1">Expiration : {new Date(row.expires_at + 'T00:00:00').toLocaleDateString('fr-FR')}</p>}
                      </div>
                      <button type="button" onClick={() => void openDocument(row)} className="btn-secondary text-xs px-3 py-2">Ouvrir le document</button>
                    </div>
                    <label className="block text-xs font-semibold mt-4 mb-1" htmlFor={'review-note-' + row.id}>Note de contrôle / motif de refus</label>
                    <textarea id={'review-note-' + row.id} value={notes[row.id] || ''} onChange={e => setNotes(current => ({ ...current, [row.id]: e.target.value.slice(0, 2000) }))} maxLength={2000} rows={2} className="input-field w-full text-sm" placeholder="Observations, référence du registre, motif de refus…" />
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button type="button" disabled={busyId === row.id} onClick={() => void review(row, 'approve')} className="btn-primary text-xs px-4 py-2 disabled:opacity-50">{busyId === row.id ? 'Enregistrement…' : 'Valider le justificatif'}</button>
                      <button type="button" disabled={busyId === row.id} onClick={() => void review(row, 'reject')} className="btn-secondary text-xs px-4 py-2 disabled:opacity-50">Refuser</button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}
    </section>
          )}
          {rows.length === 0 ? (
            <p className="text-sm mt-5" style={{ color: 'var(--muted-foreground)' }}>Aucun justificatif en attente pour votre établissement.</p>
          ) : (
            <div className="mt-5 space-y-4">
        <p className="text-sm mt-5" style={{ color: 'var(--muted-foreground)' }}>Aucun justificatif en attente pour votre établissement.</p>
      ) : (
        <div className="mt-5 space-y-4">
          {rows.map(row => {
            const person = row.professionals;
            return (
              <article key={row.id} className="rounded-xl border p-4" style={{ borderColor: 'var(--border)' }}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{person ? person.first_name + ' ' + person.last_name : 'Professionnel'}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{person?.profession || 'Profession non renseignée'} · {labels[row.credential_type] || row.credential_type}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{row.document_name} · {(row.file_size / 1024 / 1024).toFixed(2)} Mo · Déposé le {new Date(row.created_at).toLocaleDateString('fr-FR')}</p>
                    {row.license_number && <p className="text-xs mt-1">N° de licence : {row.license_number}</p>}
                    {row.expires_at && <p className="text-xs mt-1">Expiration : {new Date(row.expires_at).toLocaleDateString('fr-FR')}</p>}
                  </div>
                  <button type="button" onClick={() => void openDocument(row)} className="btn-secondary text-xs px-3 py-2">Ouvrir le document</button>
                </div>
                <label className="block text-xs font-semibold mt-4 mb-1" htmlFor={'review-note-' + row.id}>Note de contrôle / motif de refus</label>
                <textarea id={'review-note-' + row.id} value={notes[row.id] || ''} onChange={e => setNotes(current => ({ ...current, [row.id]: e.target.value.slice(0, 2000) }))} maxLength={2000} rows={2} className="input-field w-full text-sm" placeholder="Observations, référence du registre, motif de refus…" />
                <div className="flex flex-wrap gap-2 mt-3">
                  <button type="button" disabled={busyId === row.id} onClick={() => void review(row, 'approve')} className="btn-primary text-xs px-4 py-2 disabled:opacity-50">{busyId === row.id ? 'Enregistrement…' : 'Valider le justificatif'}</button>
                  <button type="button" disabled={busyId === row.id} onClick={() => void review(row, 'reject')} className="btn-secondary text-xs px-4 py-2 disabled:opacity-50">Refuser</button>
                </div>
              </article>
            );
          })}
            </div>
          )}
        </>
      )}
    </section>
  );
}
