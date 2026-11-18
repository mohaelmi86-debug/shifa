'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import WorkspaceHeader from './WorkspaceHeader';
import WorkspaceKPIs from './WorkspaceKPIs';
import TodaySchedule from './TodaySchedule';
import PatientQueue from './PatientQueue';
import ConsultationWorkspace from './ConsultationWorkspace';

type AccessState = 'checking' | 'verified' | 'pending' | 'unavailable';

export default function WorkspaceContent() {
  const supabase = useMemo(() => createClient(), []);
  const [accessState, setAccessState] = useState<AccessState>('checking');

  useEffect(() => {
    let active = true;

    const verifyProfessionalAccess = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          if (active) setAccessState('unavailable');
          return;
        }

        const { data, error } = await supabase
          .from('professionals')
          .select('is_verified, status')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!active) return;
        if (error || !data) {
          setAccessState('unavailable');
          return;
        }

        setAccessState(data.is_verified === true && data.status === 'active' ? 'verified' : 'pending');
      } catch {
        if (active) setAccessState('unavailable');
      }
    };

    void verifyProfessionalAccess();
    return () => {
      active = false;
    };
  }, [supabase]);

  if (accessState !== 'verified') {
    return (
      <div className="px-6 lg:px-8 xl:px-10 2xl:px-12 py-10 max-w-3xl mx-auto">
        <section className="card-base p-6 sm:p-8 text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)' }}>
            <span className="text-2xl" aria-hidden="true">⏳</span>
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--shifa-dark)' }}>
            {accessState === 'checking' ? 'Vérification de votre accès' :
              accessState === 'pending' ? 'Votre profil professionnel est en cours de validation' :
                'Accès professionnel non disponible'}
          </h1>
          <p className="text-sm leading-6 mb-5" style={{ color: 'var(--muted-foreground)' }}>
            {accessState === 'checking'
              ? 'Nous vérifions votre statut professionnel avant de charger les données de santé.'
              : accessState === 'pending'
                ? 'Votre rattachement à l’établissement est enregistré, mais vos justificatifs et habilitations doivent encore être validés. L’invitation ne vaut pas vérification des qualifications.'
                : 'Nous ne pouvons pas confirmer votre statut professionnel. Aucun dossier patient ni outil de consultation n’a été chargé. Réessayez ou contactez l’administrateur de votre établissement.'}
          </p>
          {accessState === 'pending' && (
            <Link href="/registration-pending" className="btn-primary inline-flex items-center justify-center px-4 py-2.5 text-sm">
              Suivre ma demande
            </Link>
          )}
          {accessState === 'unavailable' && (
            <button type="button" onClick={() => window.location.reload()} className="btn-secondary px-4 py-2.5 text-sm">
              Réessayer
            </button>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-8 xl:px-10 2xl:px-12 py-6 max-w-screen-2xl mx-auto">
      <WorkspaceHeader />
      <WorkspaceKPIs />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <div className="xl:col-span-1">
          <TodaySchedule />
        </div>
        <div className="xl:col-span-2 flex flex-col gap-6">
          <PatientQueue />
          <ConsultationWorkspace />
        </div>
      </div>
    </div>
  );
}
