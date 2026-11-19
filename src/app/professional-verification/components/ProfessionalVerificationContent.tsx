'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type Credential = {
  id: string;
  credential_type: string;
  document_name: string;
  status: 'pending' | 'approved' | 'rejected';
  review_note?: string | null;
  created_at: string;
  expires_at?: string | null;
};

const credentialLabels: Record<string, string> = {
  professional_license: 'Licence professionnelle',
  professional_registration: 'Inscription à l’ordre / registre',
  diploma: 'Diplôme',
  identity: 'Pièce d’identité',
  other: 'Autre justificatif',
};

export default function ProfessionalVerificationContent() {
  const supabase = useMemo(() => createClient(), []);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [credentialType, setCredentialType] = useState('professional_license');
  const [issuingCountry, setIssuingCountry] = useState('FR');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadCredentials = async () => {
    const { data, error: queryError } = await supabase
      .from('professional_credentials')
      .select('id, credential_type, document_name, status, created_at, expires_at')
      .order('created_at', { ascending: false });
    if (queryError) setError('Impossible de charger vos justificatifs.');
    else setCredentials((data || []) as Credential[]);
    setLoading(false);
  };

  useEffect(() => {
    void loadCredentials();
    // Supabase client is memoized for this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError('Sélectionnez un fichier PDF, JPG ou PNG.');
      return;
    }
    if (file.size < 1 || file.size > 10 * 1024 * 1024) {
      setError('Le fichier doit peser au maximum 10 Mo.');
      return;
    }
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
      setError('Format refusé. Utilisez un PDF, JPG ou PNG.');
      return;
    }

    setBusy(true);
    setError('');
    setMessage('');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      setError('Connectez-vous pour déposer vos justificatifs.');
      setBusy(false);
      return;
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-120);
    const storagePath = user.id + '/' + crypto.randomUUID() + '/' + safeName;
    const { error: uploadError } = await supabase.storage
      .from('professional-credentials')
      .upload(storagePath, file, { contentType: file.type, upsert: false });

    if (uploadError) {
      setError('Le dépôt sécurisé a échoué. Réessayez avec un fichier PDF, JPG ou PNG de moins de 10 Mo.');
      setBusy(false);
      return;
    }

    const { error: submitError } = await supabase.rpc('submit_professional_credential', {
      p_credential_type: credentialType,
      p_document_name: file.name,
      p_storage_path: storagePath,
      p_mime_type: file.type,
      p_file_size: file.size,
      p_issuing_country: issuingCountry,
      p_license_number: licenseNumber.trim() || null,
      p_expires_at: expiresAt || null,
    });

    if (submitError) {
      await supabase.storage.from('professional-credentials').remove([storagePath]);
      setError(submitError.message.includes('ACTIVE_ORGANIZATION_MEMBERSHIP_REQUIRED')
        ? 'Votre rattachement à l’établissement doit être finalisé avant le dépôt.'
        : message.includes('PRIMARY_ORGANIZATION_SELECTION_REQUIRED')
          ? 'Sélectionnez votre établissement principal dans votre profil avant de déposer ce justificatif.'
          : 'Le justificatif n’a pas pu être enregistré. Vérifiez votre rattachement et réessayez.');
    } else {
      setMessage('Justificatif transmis. L’administrateur de votre établissement doit maintenant l’examiner.');
      setFile(null);
      setLicenseNumber('');
      setExpiresAt('');
      const input = document.getElementById('professional-credential-file') as HTMLInputElement | null;
      if (input) input.value = '';
      await loadCredentials();
    }
    setBusy(false);
  };

  const statusLabel = (status: Credential['status']) => status === 'approved' ? 'Validé' : status === 'rejected' ? 'Refusé' : 'En examen';

  return (
    <main className="min-h-screen px-5 py-10" style={{ background: 'var(--background)' }}>
      <div className="max-w-3xl mx-auto">
        <Link href="/workspace-professionnel" className="text-sm" style={{ color: 'var(--shifa-blue)' }}>← Retour à mon espace</Link>
        <section className="card-base p-6 sm:p-8 mt-5">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--shifa-blue)' }}>SHIFA Health OS</p>
          <h1 className="text-2xl font-bold mt-2" style={{ color: 'var(--foreground)' }}>Vérification de mon profil professionnel</h1>
          <p className="text-sm leading-6 mt-3" style={{ color: 'var(--muted-foreground)' }}>
            Déposez vos justificatifs officiels pour votre établissement principal SHIFA. Les autres rattachements restent indépendants. Les fichiers sont conservés dans un espace privé et accessibles uniquement à vous et aux administrateurs habilités de l’établissement concerné. Une invitation ne constitue pas une validation de vos qualifications.
          </p>

          <form onSubmit={submit} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="credential-type" className="block text-sm font-semibold mb-1">Type de justificatif</label>
              <select id="credential-type" value={credentialType} onChange={e => setCredentialType(e.target.value)} className="input-field w-full">
                {Object.entries(credentialLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="credential-country" className="block text-sm font-semibold mb-1">Pays émetteur</label>
              <input id="credential-country" value={issuingCountry} onChange={e => setIssuingCountry(e.target.value.toUpperCase().slice(0, 2))} maxLength={2} className="input-field w-full" />
            </div>
            <div>
              <label htmlFor="credential-license" className="block text-sm font-semibold mb-1">Numéro de licence / registre</label>
              <input id="credential-license" value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} maxLength={120} className="input-field w-full" />
            </div>
            <div>
              <label htmlFor="credential-expiry" className="block text-sm font-semibold mb-1">Date d’expiration (si applicable)</label>
              <input id="credential-expiry" type="date" min={new Date().toISOString().slice(0, 10)} value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className="input-field w-full" />
            </div>
            <div>
              <label htmlFor="professional-credential-file" className="block text-sm font-semibold mb-1">Document (PDF, JPG, PNG — 10 Mo max.)</label>
              <input id="professional-credential-file" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" onChange={e => setFile(e.target.files?.[0] || null)} className="input-field w-full text-sm" required />
            </div>
            {error && <p role="alert" className="sm:col-span-2 text-sm" style={{ color: 'var(--shifa-red)' }}>{error}</p>}
            {message && <p role="status" className="sm:col-span-2 text-sm" style={{ color: 'var(--shifa-green)' }}>{message}</p>}
            <div className="sm:col-span-2">
              <button type="submit" disabled={busy || !file} className="btn-primary px-5 py-3 text-sm disabled:opacity-50">
                {busy ? 'Transmission sécurisée…' : 'Transmettre le justificatif'}
              </button>
            </div>
          </form>
        </section>

        <section className="card-base p-6 mt-5">
          <h2 className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>Mes justificatifs transmis</h2>
          {loading ? <p className="text-sm mt-4">Chargement…</p> : credentials.length === 0 ? (
            <p className="text-sm mt-4" style={{ color: 'var(--muted-foreground)' }}>Aucun justificatif transmis pour le moment.</p>
          ) : (
            <ul className="mt-4 divide-y" style={{ borderColor: 'var(--border)' }}>
              {credentials.map(item => (
                <li key={item.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sm">{credentialLabels[item.credential_type] || item.credential_type}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{item.document_name} · Déposé le {new Date(item.created_at).toLocaleDateString('fr-FR')}{item.expires_at ? ` · Expire le ${new Date(item.expires_at).toLocaleDateString('fr-FR')}` : ''}</p>{item.expires_at && item.status === 'approved' && (() => { const days = Math.ceil((new Date(item.expires_at + 'T00:00:00').getTime() - new Date(new Date().toDateString()).getTime()) / 86400000); return days <= 30 ? <p className="text-xs mt-1 font-semibold" style={{ color: days <= 7 ? 'var(--shifa-red)' : 'var(--shifa-amber)' }}>{days < 0 ? 'Justificatif expiré — renouvellement requis' : days === 0 ? 'Expire aujourd’hui — renouvellement requis' : `Expire dans ${days} jour${days > 1 ? 's' : ''} — pensez à le renouveler`}</p> : null; })()}
                  </div>
                  <span className="text-xs font-semibold rounded-full px-3 py-1" style={{ background: item.status === 'approved' ? 'rgba(16,185,129,.12)' : item.status === 'rejected' ? 'rgba(239,68,68,.12)' : 'rgba(245,158,11,.12)', color: item.status === 'approved' ? 'var(--shifa-green)' : item.status === 'rejected' ? 'var(--shifa-red)' : 'var(--shifa-amber)' }}>{statusLabel(item.status)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
