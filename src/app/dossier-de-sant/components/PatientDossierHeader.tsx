'use client';
import React, { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppLogo from '@/components/ui/AppLogo';
import { createClient } from '@/lib/supabase/client';

interface PatientProfile {
  fullName: string;
  initials: string;
  dateOfBirth: string;
  age: number;
  country: string;
  shifaId: string;
}

export default function PatientDossierHeader() {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: patient } = await supabase
          .from('patients')
          .select('first_name, last_name, date_of_birth, country_code, shifa_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (patient) {
          const dob = patient.date_of_birth ? new Date(patient.date_of_birth) : null;
          const age = dob ? Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 3600 * 1000)) : 0;
          const dobStr = dob ? dob.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
          const fn = patient.first_name || '';
          const ln = patient.last_name || '';
          setProfile({
            fullName: `${fn} ${ln}`.trim() || user.email || 'Patient',
            initials: `${fn[0] || ''}${ln[0] || ''}`.toUpperCase() || 'P',
            dateOfBirth: dobStr,
            age,
            country: patient.country_code || 'SN',
            shifaId: patient.shifa_id || '—',
          });
        } else {
          // Fallback to user profile
          const { data: up } = await supabase
            .from('user_profiles')
            .select('full_name, country_code')
            .eq('id', user.id)
            .maybeSingle();
          const name = up?.full_name || user.email || 'Patient';
          const parts = name.split(' ');
          setProfile({
            fullName: name,
            initials: parts.map((p: string) => p[0]).join('').substring(0, 2).toUpperCase(),
            dateOfBirth: '—',
            age: 0,
            country: up?.country_code || 'SN',
            shifaId: '—',
          });
        }
      } catch {
        // Keep default state
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const countryLabel: Record<string, string> = {
    SN: 'Sénégal', CI: "Côte d'Ivoire", ML: 'Mali', BF: 'Burkina Faso', GN: 'Guinée', FR: 'France',
  };

  return (
    <div className="border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Dossier de santé</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Votre historique médical complet et sécurisé</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border transition-colors hover:bg-muted" style={{ borderColor: 'var(--border)' }} title="Paramètres">
              <Icon name="Cog6ToothIcon" size={18} className="text-muted-foreground" />
            </button>
            <button className="p-2 rounded-lg border transition-colors hover:bg-muted" style={{ borderColor: 'var(--border)' }} title="Télécharger">
              <Icon name="ArrowDownTrayIcon" size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Patient info */}
        {loading ? (
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl animate-pulse" style={{ backgroundColor: 'var(--muted)' }} />
            <div className="space-y-2">
              <div className="h-5 w-40 rounded animate-pulse" style={{ backgroundColor: 'var(--muted)' }} />
              <div className="h-4 w-64 rounded animate-pulse" style={{ backgroundColor: 'var(--muted)' }} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
            >
              {profile?.initials || 'P'}
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>{profile?.fullName || '—'}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {profile?.dateOfBirth && profile.dateOfBirth !== '—' && (
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    {profile.dateOfBirth}{profile.age > 0 ? ` · ${profile.age} ans` : ''}
                  </span>
                )}
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  {countryLabel[profile?.country || ''] || profile?.country || '—'}
                </span>
                {profile?.shifaId && profile.shifaId !== '—' && (
                  <div
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg border"
                    style={{ backgroundColor: 'var(--shifa-dark)', borderColor: 'rgba(0, 242, 195, 0.3)' }}
                  >
                    <AppLogo size={14} />
                    <span className="font-mono text-xs font-bold" style={{ color: 'var(--shifa-cyan)' }}>{profile.shifaId}</span>
                  </div>
                )}
                <button className="p-1 rounded-lg hover:bg-muted transition-colors" title="Copier le SHIFA ID">
                  <Icon name="DocumentDuplicateIcon" size={16} className="text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}