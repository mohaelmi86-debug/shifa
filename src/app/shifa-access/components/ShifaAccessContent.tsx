'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type AccessTab = 'verify' | 'logs' | 'permissions' | 'stats';

interface VerificationResult {
  found: boolean;
  patient?: {
    id: string;
    first_name: string;
    last_name: string;
    shifa_id: string;
    blood_type: string | null;
    country_code: string;
  };
  shifa_id_status?: string;
  verification_level?: string;
}

interface AccessLog {
  id: string;
  patient_id: string | null;
  verification_type: string;
  access_purpose: string | null;
  access_granted: boolean;
  shifa_id_scanned: string | null;
  created_at: string;
  metadata: Record<string, any>;
}

interface AccessStats {
  total: number;
  granted: number;
  denied: number;
  today: number;
}

export default function ShifaAccessContent() {
  const { user } = useAuth();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<AccessTab>('verify');
  const [loading, setLoading] = useState(false);
  const [logsLoading, setLogsLoading] = useState(true);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [scanInput, setScanInput] = useState('');
  const [accessPurpose, setAccessPurpose] = useState('consultation');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [stats, setStats] = useState<AccessStats>({ total: 0, granted: 0, denied: 0, today: 0 });

  const fetchLogs = useCallback(async () => {
    setLogsLoading(true);
    try {
      const { data: logs, error: logsErr } = await supabase
        .from('shifa_access_verifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (logsErr) throw logsErr;
      if (logs) {
        setAccessLogs(logs);

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayLogs = logs.filter(l => new Date(l.created_at) >= todayStart);
        setStats({
          total: logs.length,
          granted: logs.filter(l => l.access_granted).length,
          denied: logs.filter(l => !l.access_granted).length,
          today: todayLogs.length,
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLogsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleVerify = async () => {
    if (!scanInput.trim()) return;
    setVerifyLoading(true);
    setVerificationResult(null);
    setError(null);

    try {
      // Look up patient by shifa_id
      const { data: patient, error: pErr } = await supabase
        .from('patients')
        .select('id, first_name, last_name, shifa_id, blood_type, country_code')
        .eq('shifa_id', scanInput.trim())
        .maybeSingle();

      const found = !pErr && !!patient;

      // Check shifa_ids table for status
      let idStatus = 'active';
      let verificationLevel = 'basic';
      if (found && patient) {
        const { data: shifaId } = await supabase
          .from('shifa_ids')
          .select('status, verification_level')
          .eq('patient_id', patient.id)
          .maybeSingle();
        if (shifaId) {
          idStatus = shifaId.status;
          verificationLevel = shifaId.verification_level;
        }
      }

      const accessGranted = found && idStatus === 'active';

      // Log the verification
      await supabase.from('shifa_access_verifications').insert({
        patient_id: found ? patient!.id : null,
        verified_by: user?.id,
        verification_type: 'qr_scan',
        access_purpose: accessPurpose,
        access_granted: accessGranted,
        shifa_id_scanned: scanInput.trim(),
        metadata: {
          verification_level: verificationLevel,
          id_status: idStatus,
        },
      });

      // Also log to audit_logs
      if (found && patient) {
        await supabase.from('audit_logs').insert({
          user_id: user?.id,
          action: accessGranted ? 'shifa_access_granted' : 'shifa_access_denied',
          resource_type: 'patient',
          resource_id: patient.id,
          details: {
            purpose: accessPurpose,
            method: 'qr_scan',
            shifa_id: scanInput.trim(),
          },
        });
      }

      setVerificationResult({
        found,
        patient: found ? patient! : undefined,
        shifa_id_status: idStatus,
        verification_level: verificationLevel,
      });

      await fetchLogs();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setVerifyLoading(false);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR') + ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const purposeLabels: Record<string, string> = {
    consultation: 'Consultation médicale',
    emergency: 'Urgence',
    pharmacy: 'Dispensation médicaments',
    lab: 'Analyses biologiques',
    imaging: 'Imagerie médicale',
    admission: 'Admission hospitalière',
    insurance: 'Vérification assurance',
    other: 'Autre',
  };

  const verificationTypeLabels: Record<string, string> = {
    qr_scan: 'Scan QR',
    nfc: 'NFC',
    manual: 'Manuel',
    biometric: 'Biométrique',
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0066FF, #00F2C3)' }}>
              <Icon name="ShieldCheckIcon" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'DM Sans, sans-serif' }}>SHIFA Access</h1>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Vérification d'identité · Contrôle d'accès · Audit</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
              ● Système actif
            </span>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Total vérifications', value: stats.total, color: 'var(--shifa-blue)' },
            { label: "Aujourd'hui", value: stats.today, color: '#8b5cf6' },
            { label: 'Accès accordés', value: stats.granted, color: '#16a34a' },
            { label: 'Accès refusés', value: stats.denied, color: '#dc2626' },
          ].map(s => (
            <div key={s.label} className="text-center p-2 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
              <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-1 overflow-x-auto">
          {[
            { key: 'verify', label: 'Vérifier un SHIFA ID', icon: 'QrCodeIcon' },
            { key: 'logs', label: "Journal d'accès", icon: 'ClipboardDocumentListIcon' },
            { key: 'permissions', label: 'Permissions', icon: 'LockClosedIcon' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as AccessTab)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors`}
              style={activeTab === tab.key ? { backgroundColor: 'var(--shifa-blue)', color: 'white' } : { color: 'var(--muted-foreground)' }}
            >
              <Icon name={tab.icon as any} size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">

        {/* Verify Tab */}
        {activeTab === 'verify' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-base font-bold mb-4" style={{ color: 'var(--foreground)' }}>Vérifier un SHIFA ID</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--muted-foreground)' }}>SHIFA ID à vérifier</label>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 px-4 py-3 rounded-xl border text-sm font-mono"
                      style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                      placeholder="SH-2-SN-FR-2025-XXXX"
                      value={scanInput}
                      onChange={e => setScanInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleVerify()}
                    />
                    <button
                      onClick={() => setScanInput('')}
                      className="px-3 py-2 rounded-xl border text-sm"
                      style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                    >
                      <Icon name="XMarkIcon" size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Motif d'accès</label>
                  <select
                    className="w-full px-3 py-2.5 rounded-xl border text-sm"
                    style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    value={accessPurpose}
                    onChange={e => setAccessPurpose(e.target.value)}
                  >
                    {Object.entries(purposeLabels).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleVerify}
                  disabled={verifyLoading || !scanInput.trim()}
                  className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: 'var(--shifa-blue)' }}
                >
                  {verifyLoading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Vérification en cours...</>
                  ) : (
                    <><Icon name="ShieldCheckIcon" size={16} /> Vérifier l'identité</>
                  )}
                </button>
              </div>
            </div>

            {/* Verification Result */}
            {verificationResult && (
              <div
                className="rounded-2xl border p-6"
                style={{
                  backgroundColor: verificationResult.found && verificationResult.shifa_id_status === 'active' ?'rgba(22,163,74,0.04)' :'rgba(239,68,68,0.04)',
                  borderColor: verificationResult.found && verificationResult.shifa_id_status === 'active' ?'rgba(22,163,74,0.3)' :'rgba(239,68,68,0.3)',
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: verificationResult.found && verificationResult.shifa_id_status === 'active' ?'#dcfce7' : '#fee2e2'
                    }}
                  >
                    <Icon
                      name={verificationResult.found && verificationResult.shifa_id_status === 'active' ? 'CheckCircleIcon' : 'XCircleIcon'}
                      size={24}
                      style={{ color: verificationResult.found && verificationResult.shifa_id_status === 'active' ? '#16a34a' : '#dc2626' } as any}
                    />
                  </div>
                  <div>
                    <p className="font-bold text-base" style={{
                      color: verificationResult.found && verificationResult.shifa_id_status === 'active' ? '#16a34a' : '#dc2626'
                    }}>
                      {verificationResult.found && verificationResult.shifa_id_status === 'active' ?'Accès accordé — Identité vérifiée'
                        : verificationResult.found
                          ? 'Accès refusé — SHIFA ID suspendu' :'Accès refusé — SHIFA ID introuvable'}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      {new Date().toLocaleTimeString('fr-FR')} · {purposeLabels[accessPurpose]}
                    </p>
                  </div>
                </div>

                {verificationResult.found && verificationResult.patient && (
                  <div className="space-y-2">
                    {[
                      { label: 'Nom complet', value: `${verificationResult.patient.first_name} ${verificationResult.patient.last_name}` },
                      { label: 'SHIFA ID', value: verificationResult.patient.shifa_id, mono: true },
                      { label: 'Pays', value: verificationResult.patient.country_code },
                      { label: 'Groupe sanguin', value: verificationResult.patient.blood_type || '—' },
                      { label: 'Statut ID', value: verificationResult.shifa_id_status || 'active' },
                      { label: 'Niveau de vérification', value: verificationResult.verification_level || 'basic' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between py-1.5 border-b last:border-0" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</span>
                        <span className={`text-xs font-semibold ${(item as any).mono ? 'font-mono' : ''}`} style={{ color: 'var(--foreground)' }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.08)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Journal des vérifications d'accès</h3>
              <button onClick={fetchLogs} className="text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>
                <Icon name="ArrowPathIcon" size={12} />
                Actualiser
              </button>
            </div>

            {logsLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--shifa-blue)', borderTopColor: 'transparent' }} />
              </div>
            ) : accessLogs.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="ClipboardDocumentListIcon" size={40} className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Aucune vérification enregistrée</p>
              </div>
            ) : (
              <div className="space-y-2">
                {accessLogs.map(log => (
                  <div key={log.id} className="rounded-xl border p-4 flex items-start gap-3" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: log.access_granted ? '#dcfce7' : '#fee2e2' }}>
                      <Icon
                        name={log.access_granted ? 'CheckCircleIcon' : 'XCircleIcon'}
                        size={18}
                        style={{ color: log.access_granted ? '#16a34a' : '#dc2626' } as any}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{
                          backgroundColor: log.access_granted ? '#dcfce7' : '#fee2e2',
                          color: log.access_granted ? '#16a34a' : '#dc2626'
                        }}>
                          {log.access_granted ? 'Accordé' : 'Refusé'}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                          {verificationTypeLabels[log.verification_type] || log.verification_type}
                        </span>
                      </div>
                      <p className="text-sm mt-1 font-mono" style={{ color: 'var(--foreground)' }}>{log.shifa_id_scanned || '—'}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                        {purposeLabels[log.access_purpose || ''] || log.access_purpose || 'Non spécifié'}
                      </p>
                    </div>
                    <span className="text-xs shrink-0" style={{ color: 'var(--muted-foreground)' }}>{formatDate(log.created_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Permissions Tab */}
        {activeTab === 'permissions' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-base font-bold mb-4" style={{ color: 'var(--foreground)' }}>Niveaux d'accès SHIFA</h3>
              <div className="space-y-3">
                {[
                  { role: 'Médecin généraliste', access: ['Identité patient', 'Groupe sanguin', 'Allergies critiques'], level: 'Niveau 2', color: '#16a34a' },
                  { role: 'Spécialiste', access: ['Identité patient', 'Groupe sanguin', 'Allergies', 'Dossier médical partiel'], level: 'Niveau 3', color: 'var(--shifa-blue)' },
                  { role: 'Pharmacien', access: ['Identité patient', 'Ordonnances actives'], level: 'Niveau 1', color: '#ca8a04' },
                  { role: 'Urgentiste', access: ['Identité complète', 'Groupe sanguin', 'Allergies', 'Contacts urgence', 'Traitements en cours'], level: 'Niveau 4', color: '#dc2626' },
                  { role: 'Infirmier', access: ['Identité patient', 'Groupe sanguin'], level: 'Niveau 1', color: '#ca8a04' },
                  { role: 'Assureur', access: ['Identité patient', 'Numéro de police'], level: 'Niveau 1', color: '#6b7280' },
                ].map(item => (
                  <div key={item.role} className="p-4 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{item.role}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: `${item.color}15`, color: item.color }}>{item.level}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.access.map(a => (
                        <span key={a} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{a}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border p-5" style={{ backgroundColor: 'rgba(0,102,255,0.04)', borderColor: 'rgba(0,102,255,0.2)' }}>
              <div className="flex items-start gap-3">
                <Icon name="InformationCircleIcon" size={18} style={{ color: 'var(--shifa-blue)' } as any} className="shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Principe du moindre privilège</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    SHIFA Access applique le principe du moindre privilège : chaque professionnel n'accède qu'aux données strictement nécessaires à sa mission. Chaque accès est journalisé de manière immuable et peut être audité.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
