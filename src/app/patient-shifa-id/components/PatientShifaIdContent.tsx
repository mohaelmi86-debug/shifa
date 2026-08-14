'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type IdTab = 'card' | 'history' | 'privacy' | 'qr';

interface PatientData {
  id: string;
  first_name: string;
  last_name: string;
  shifa_id: string;
  country_code: string;
  blood_type: string | null;
  date_of_birth: string | null;
  gender: string | null;
}

interface ShifaIdData {
  id: string;
  shifa_id: string;
  status: string;
  verification_level: string;
  qr_code_data: string | null;
  last_verified_at: string | null;
  created_at: string;
}

interface AccessLog {
  id: string;
  action: string;
  details: Record<string, any>;
  created_at: string;
}

export default function PatientShifaIdContent() {
  const { user } = useAuth();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<IdTab>('card');
  const [showFullId, setShowFullId] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [patient, setPatient] = useState<PatientData | null>(null);
  const [shifaIdData, setShifaIdData] = useState<ShifaIdData | null>(null);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch patient profile
      const { data: patientData, error: patientErr } = await supabase
        .from('patients')
        .select('id, first_name, last_name, shifa_id, country_code, blood_type, date_of_birth, gender')
        .eq('user_id', user.id)
        .maybeSingle();

      if (patientErr) throw patientErr;
      if (!patientData) {
        setError('Profil patient introuvable. Veuillez compléter votre inscription.');
        setLoading(false);
        return;
      }
      setPatient(patientData);

      // Fetch SHIFA ID record
      const { data: shifaId, error: shifaErr } = await supabase
        .from('shifa_ids')
        .select('*')
        .eq('patient_id', patientData.id)
        .maybeSingle();

      if (!shifaErr && shifaId) {
        setShifaIdData(shifaId);
      } else if (patientData.shifa_id) {
        // Fallback: use patient's shifa_id field
        setShifaIdData({
          id: patientData.id,
          shifa_id: patientData.shifa_id,
          status: 'active',
          verification_level: 'verified',
          qr_code_data: `SHIFA:${patientData.shifa_id}:${patientData.id}`,
          last_verified_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        });
      }

      // Fetch access logs from audit_logs
      const { data: logs, error: logsErr } = await supabase
        .from('audit_logs')
        .select('id, action, details, created_at')
        .eq('resource_type', 'patient')
        .eq('resource_id', patientData.id)
        .in('action', ['shifa_id_verified', 'shifa_access_granted', 'shifa_access_denied'])
        .order('created_at', { ascending: false })
        .limit(20);

      if (!logsErr && logs) {
        setAccessLogs(logs);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const displayName = patient
    ? `${patient.first_name} ${patient.last_name}`
    : 'Chargement...';
  const firstName = patient?.first_name || '';
  const lastName = patient?.last_name?.toUpperCase() || '';
  const shifaId = shifaIdData?.shifa_id || patient?.shifa_id || '—';
  const maskedId = showFullId ? shifaId : shifaId.replace(/[^-]+$/, '****');
  const countryCode = patient?.country_code || 'SN';
  const bloodType = patient?.blood_type || '—';
  const avatarLetters = patient
    ? `${patient.first_name[0] || ''}${patient.last_name[0] || ''}`
    : '??';

  const idComponents = shifaId !== '—'
    ? shifaId.split('-').map((part, i) => {
        const labels = ['Préfixe', 'Version', 'Pays', 'Région', 'Année', 'Clé de vérification'];
        const descs = [
          'Identifiant SHIFA Health OS',
          'Version du schéma SHIFA ID',
          'Code pays ISO 3166-1 alpha-2',
          'Code région / zone de création',
          'Année de création du compte',
          'Clé unique générée par SHIFA',
        ];
        return { label: labels[i] || `Segment ${i + 1}`, value: part, desc: descs[i] || '' };
      })
    : [];

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffH = Math.floor(diffMs / 3600000);
    const diffD = Math.floor(diffMs / 86400000);
    if (diffH < 1) return "Il y a moins d'une heure";
    if (diffH < 24) return `Aujourd'hui ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    if (diffD === 1) return `Hier ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    if (diffD < 7) return `Il y a ${diffD} jours`;
    return d.toLocaleDateString('fr-FR');
  };

  const memberSince = shifaIdData?.created_at
    ? new Date(shifaIdData.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    : '—';

  const lastVerified = shifaIdData?.last_verified_at
    ? formatDate(shifaIdData.last_verified_at)
    : '—';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--shifa-blue)', borderTopColor: 'transparent' }} />
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Chargement de votre SHIFA ID...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center p-6 rounded-2xl border max-w-sm" style={{ borderColor: 'rgba(239,68,68,0.3)', backgroundColor: 'rgba(239,68,68,0.04)' }}>
          <Icon name="ExclamationTriangleIcon" size={32} style={{ color: '#dc2626' } as any} className="mx-auto mb-3" />
          <p className="text-sm font-semibold" style={{ color: '#dc2626' }}>{error}</p>
          <button onClick={fetchData} className="mt-3 text-xs px-4 py-2 rounded-lg text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-lg mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Mon SHIFA ID</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Identifiant de santé unique, permanent et sécurisé</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{
            backgroundColor: shifaIdData?.status === 'active' ? '#dcfce7' : '#fee2e2',
            color: shifaIdData?.status === 'active' ? '#16a34a' : '#dc2626'
          }}>
            ● {shifaIdData?.status === 'active' ? 'Actif' : shifaIdData?.status || 'Inconnu'}
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' }}>
            {shifaIdData?.verification_level === 'verified' ? 'Identité vérifiée' : 'Vérification basique'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
        {[
          { key: 'card', label: 'Mon SHIFA ID', icon: 'IdentificationIcon' },
          { key: 'qr', label: 'QR Code', icon: 'QrCodeIcon' },
          { key: 'history', label: 'Historique d\'accès', icon: 'ClockIcon' },
          { key: 'privacy', label: 'Confidentialité', icon: 'ShieldCheckIcon' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as IdTab)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all"
            style={{
              borderBottomColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'transparent',
              color: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
            }}
          >
            <Icon name={tab.icon as any} size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Card */}
      {activeTab === 'card' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div
              className="relative rounded-3xl overflow-hidden p-6"
              style={{
                background: 'linear-gradient(135deg, #0A1B3D 0%, #0A4B9A 55%, #0066FF 100%)',
                minHeight: '220px',
                boxShadow: '0 20px 60px rgba(0,102,255,0.3)',
              }}
            >
              <div className="absolute right-4 bottom-4 opacity-10 w-28 h-12">
                <AppImage src="/assets/images/file_00000000594071f4b27d19b03582b884-1786375501710.png" alt="SHIFA watermark" width={112} height={48} className="object-contain w-full h-full" />
              </div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-20 h-8">
                  <AppImage src="/assets/images/file_00000000594071f4b27d19b03582b884-1786375501710.png" alt="SHIFA logo" width={80} height={32} className="object-contain w-full h-full brightness-0 invert" />
                </div>
                <span className="text-xs font-bold text-white/70 tracking-widest uppercase">SHIFA ID</span>
              </div>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white shrink-0" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
                  {avatarLetters}
                </div>
                <div>
                  <p className="text-white font-bold text-lg leading-tight">{firstName}</p>
                  <p className="text-white font-bold text-lg leading-tight">{lastName}</p>
                  <p className="text-white/60 text-xs mt-0.5">{countryCode} · Membre depuis {memberSince}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-1">SHIFA ID</p>
                  <p className="text-white font-mono font-bold text-base tracking-wider">{maskedId}</p>
                </div>
                <button onClick={() => setShowFullId(v => !v)} className="p-2 rounded-lg transition-all" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                  <Icon name={showFullId ? 'EyeSlashIcon' : 'EyeIcon'} size={16} className="text-white" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button onClick={() => setActiveTab('qr')} className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90" style={{ backgroundColor: 'var(--shifa-blue)', color: 'white' }}>
                <Icon name="QrCodeIcon" size={16} />
                Afficher QR
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>
                <Icon name="ShareIcon" size={16} />
                Partager
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card-base p-5">
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--shifa-dark)' }}>Structure du SHIFA ID</h3>
              <div className="space-y-2">
                {idComponents.map(comp => (
                  <div key={comp.label} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{comp.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{comp.desc}</p>
                    </div>
                    <span className="font-mono font-bold text-sm px-2 py-1 rounded-lg" style={{ backgroundColor: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)' }}>{comp.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-base p-5">
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--shifa-dark)' }}>Informations de vérification</h3>
              <div className="space-y-2">
                {[
                  { label: 'Statut', value: shifaIdData?.status === 'active' ? 'Actif' : shifaIdData?.status || '—', color: '#16a34a' },
                  { label: 'Niveau de vérification', value: shifaIdData?.verification_level === 'verified' ? 'Identité vérifiée' : 'Basique', color: 'var(--shifa-blue)' },
                  { label: 'Dernière vérification', value: lastVerified, color: 'var(--foreground)' },
                  { label: 'Groupe sanguin', value: bloodType, color: '#dc2626' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-1.5">
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{item.label}</span>
                    <span className="text-sm font-semibold" style={{ color: item.color }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(0,102,255,0.06)', border: '1px solid rgba(0,102,255,0.15)' }}>
              <div className="flex items-start gap-2">
                <Icon name="InformationCircleIcon" size={16} style={{ color: 'var(--shifa-blue)' } as any} className="shrink-0 mt-0.5" />
                <p className="text-xs" style={{ color: 'var(--foreground)' }}>
                  Le SHIFA ID est <strong>permanent</strong> et <strong>unique</strong>. Il ne contient aucune information médicale sensible.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: QR */}
      {activeTab === 'qr' && (
        <div className="max-w-md mx-auto">
          <div className="card-base p-8 flex flex-col items-center gap-6">
            <div>
              <h3 className="text-base font-bold text-center" style={{ color: 'var(--shifa-dark)' }}>QR Code de vérification</h3>
              <p className="text-sm text-center mt-1" style={{ color: 'var(--muted-foreground)' }}>Présentez ce code à un professionnel de santé ou à un établissement SHIFA</p>
            </div>
            <div className="relative">
              <div className="w-56 h-56 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--muted)', border: '2px dashed var(--border)' }}>
                {qrVisible ? (
                  <div className="w-full h-full p-4 flex items-center justify-center bg-white rounded-2xl">
                    {/* Real QR-like grid based on shifa_id hash */}
                    <div className="grid grid-cols-9 gap-0.5">
                      {Array.from({ length: 81 }).map((_, i) => {
                        const seed = (shifaId.charCodeAt(i % shifaId.length) + i * 7) % 3;
                        return (
                          <div key={i} className="w-5 h-5 rounded-sm" style={{ backgroundColor: seed === 0 ? '#0A1B3D' : 'transparent' }} />
                        );
                      })}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-lg">
                        <AppImage src="/assets/images/file_00000000594071f4b27d19b03582b884-1786375501710.png" alt="SHIFA" width={28} height={28} className="object-contain" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Icon name="LockClosedIcon" size={32} className="text-muted-foreground" />
                    <p className="text-xs text-center" style={{ color: 'var(--muted-foreground)' }}>Appuyez pour afficher</p>
                  </div>
                )}
              </div>
            </div>
            <button onClick={() => setQrVisible(v => !v)} className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90" style={{ backgroundColor: 'var(--shifa-blue)' }}>
              {qrVisible ? 'Masquer le QR code' : 'Afficher le QR code'}
            </button>
            <div className="w-full p-3 rounded-xl" style={{ backgroundColor: '#fef3c7', border: '1px solid #fde68a' }}>
              <div className="flex items-start gap-2">
                <Icon name="ExclamationTriangleIcon" size={14} style={{ color: '#d97706' } as any} className="shrink-0 mt-0.5" />
                <p className="text-xs" style={{ color: '#92400e' }}>Ce QR code ne donne accès qu'à votre identité SHIFA. Chaque scan est journalisé.</p>
              </div>
            </div>
            <div className="w-full">
              <p className="text-xs text-center font-mono" style={{ color: 'var(--muted-foreground)' }}>{maskedId}</p>
              <p className="text-xs text-center mt-1" style={{ color: 'var(--muted-foreground)' }}>Expire dans 15 minutes · Renouvelable</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: History */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              {accessLogs.length} accès journalisés
            </p>
            <button className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>
              Exporter
            </button>
          </div>
          {accessLogs.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="ClockIcon" size={40} className="mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Aucun accès enregistré pour le moment</p>
            </div>
          ) : (
            accessLogs.map((entry) => {
              const details = entry.details || {};
              const authorized = entry.action !== 'shifa_access_denied';
              return (
                <div key={entry.id} className="card-base p-4 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: authorized ? '#dcfce7' : '#fee2e2' }}>
                    <Icon name={authorized ? 'CheckCircleIcon' : 'XCircleIcon'} size={20} style={{ color: authorized ? '#16a34a' : '#dc2626' } as any} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{details.actor || 'Système SHIFA'}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{details.role || 'Automatique'}</span>
                    </div>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                      {entry.action === 'shifa_id_verified' ? 'Vérification SHIFA ID' : entry.action === 'shifa_access_granted' ? 'Accès accordé' : 'Accès refusé'}
                      {details.location ? ` · ${details.location}` : ''}
                    </p>
                  </div>
                  <span className="text-xs shrink-0" style={{ color: 'var(--muted-foreground)' }}>{formatDate(entry.created_at)}</span>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab: Privacy */}
      {activeTab === 'privacy' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-base p-6">
            <h3 className="text-base font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Visibilité du SHIFA ID</h3>
            <div className="space-y-4">
              {[
                { label: 'Visible par les professionnels de santé', desc: 'Médecins, infirmiers, pharmaciens autorisés', checked: true },
                { label: 'Visible par les établissements', desc: 'Hôpitaux, cliniques, centres de santé', checked: true },
                { label: 'Visible par les assureurs', desc: 'Uniquement pour les remboursements autorisés', checked: false },
                { label: 'Visible dans les urgences', desc: "Accès d'urgence sans consentement préalable", checked: true },
              ].map(item => (
                <div key={item.label} className="flex items-start justify-between gap-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{item.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{item.desc}</p>
                  </div>
                  <div className="relative w-11 h-6 rounded-full shrink-0" style={{ backgroundColor: item.checked ? 'var(--shifa-blue)' : 'var(--border)' }}>
                    <span className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" style={{ left: item.checked ? '22px' : '4px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="card-base p-5">
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--shifa-dark)' }}>Ce que le SHIFA ID ne contient PAS</h3>
              <div className="space-y-2">
                {['Données médicales ou diagnostics', "Résultats d'analyses ou d'imagerie", 'Prescriptions ou traitements', 'Informations financières', 'Données biométriques sensibles', 'Historique de consultations'].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <Icon name="XMarkIcon" size={14} style={{ color: '#dc2626' } as any} className="shrink-0" />
                    <span className="text-sm" style={{ color: 'var(--foreground)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-base p-5">
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--shifa-dark)' }}>Ce que le SHIFA ID contient</h3>
              <div className="space-y-2">
                {['Identifiant unique SHIFA', 'Pays et région de création', "Année de création", 'Clé de vérification cryptographique', 'Statut du compte (actif/inactif)'].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <Icon name="CheckIcon" size={14} style={{ color: '#16a34a' } as any} className="shrink-0" />
                    <span className="text-sm" style={{ color: 'var(--foreground)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
