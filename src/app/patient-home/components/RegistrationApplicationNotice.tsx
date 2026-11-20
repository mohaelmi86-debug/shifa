'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function RegistrationApplicationNotice() {
  const supabase = useMemo(() => createClient(), []);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !active) return;
      const { data, error } = await supabase
        .from('registration_applications')
        .select('status')
        .eq('applicant_id', user.id)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!active || error || !data) return;
      setStatus(data.status);
      setVisible(data.status !== 'approved');
    };
    void load();
    return () => { active = false; };
  }, [supabase]);

  if (!visible) return null;
  const label = status === 'in_review' ? 'Votre dossier est en cours de vérification.' : status === 'rejected' ? 'Votre candidature nécessite une nouvelle étape.' : 'Votre demande d’inscription est en attente de validation.';
  return (
    <section className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4" style={{ borderColor: 'rgba(245,158,11,.3)', background: 'rgba(245,158,11,.06)' }}>
      <div>
        <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{label}</p>
        <p className="mt-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>Vos accès professionnels ou établissement seront activés après validation.</p>
      </div>
      <Link href="/registration-pending" className="rounded-xl border px-4 py-2 text-sm font-semibold" style={{ borderColor: 'var(--border)', color: 'var(--shifa-blue)' }}>Suivre mon dossier</Link>
    </section>
  );
}
