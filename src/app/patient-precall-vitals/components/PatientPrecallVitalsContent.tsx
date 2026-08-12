'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface VitalField {
  key: string;
  label: string;
  unit: string;
  placeholder: string;
  icon: string;
  color: string;
  normal: string;
}

const vitalsFields: VitalField[] = [
  { key: 'ta_sys', label: 'Tension systolique', unit: 'mmHg', placeholder: 'ex: 120', icon: 'HeartIcon', color: '#ef4444', normal: '90–140' },
  { key: 'ta_dia', label: 'Tension diastolique', unit: 'mmHg', placeholder: 'ex: 80', icon: 'HeartIcon', color: '#f97316', normal: '60–90' },
  { key: 'fc', label: 'Fréquence cardiaque', unit: 'bpm', placeholder: 'ex: 72', icon: 'BoltIcon', color: '#ec4899', normal: '60–100' },
  { key: 'temp', label: 'Température', unit: '°C', placeholder: 'ex: 37.0', icon: 'FireIcon', color: '#f59e0b', normal: '36.1–37.2' },
  { key: 'spo2', label: 'Saturation O₂', unit: '%', placeholder: 'ex: 98', icon: 'CloudIcon', color: '#06b6d4', normal: '95–100' },
  { key: 'poids', label: 'Poids', unit: 'kg', placeholder: 'ex: 65', icon: 'ScaleIcon', color: '#8b5cf6', normal: 'Variable' },
];

const deviceChecks = [
  { key: 'camera', label: 'Caméra', icon: 'VideoCameraIcon' },
  { key: 'micro', label: 'Microphone', icon: 'MicrophoneIcon' },
  { key: 'audio', label: 'Haut-parleurs', icon: 'SpeakerWaveIcon' },
  { key: 'connexion', label: 'Connexion internet', icon: 'WifiIcon' },
];

export default function PatientPrecallVitalsContent() {
  const [vitals, setVitals] = useState<Record<string, string>>({});
  const [deviceStatus, setDeviceStatus] = useState<Record<string, 'idle' | 'ok' | 'error'>>({
    camera: 'idle', micro: 'idle', audio: 'idle', connexion: 'idle',
  });
  const [testing, setTesting] = useState<string | null>(null);
  const [step, setStep] = useState<'vitals' | 'devices' | 'ready'>('vitals');
  const [symptoms, setSymptoms] = useState('');

  const handleVitalChange = (key: string, value: string) => {
    setVitals(prev => ({ ...prev, [key]: value }));
  };

  const testDevice = (key: string) => {
    setTesting(key);
    setTimeout(() => {
      setDeviceStatus(prev => ({ ...prev, [key]: 'ok' }));
      setTesting(null);
    }, 1500);
  };

  const testAll = () => {
    deviceChecks.forEach((d, i) => {
      setTimeout(() => {
        setDeviceStatus(prev => ({ ...prev, [d.key]: 'ok' }));
      }, (i + 1) * 600);
    });
  };

  const vitalsCompleted = vitalsFields.filter(f => vitals[f.key]).length;
  const devicesOk = Object.values(deviceStatus).filter(s => s === 'ok').length;

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-lg mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/patient-teleconsultation" className="flex items-center gap-2 text-sm mb-4 transition-colors hover:opacity-80" style={{ color: 'var(--muted-foreground)' }}>
          <Icon name="ChevronLeftIcon" size={16} />
          Retour aux téléconsultations
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
            <Icon name="HeartIcon" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Préparation à la consultation</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Vérifiez vos constantes et votre équipement avant de rejoindre</p>
          </div>
        </div>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-8">
        {[
          { key: 'vitals', label: 'Constantes vitales', icon: 'HeartIcon' },
          { key: 'devices', label: 'Test équipement', icon: 'VideoCameraIcon' },
          { key: 'ready', label: 'Prêt à rejoindre', icon: 'CheckCircleIcon' },
        ].map((s, i) => {
          const steps = ['vitals', 'devices', 'ready'];
          const currentIdx = steps.indexOf(step);
          const stepIdx = steps.indexOf(s.key);
          const isDone = stepIdx < currentIdx;
          const isActive = s.key === step;
          return (
            <React.Fragment key={s.key}>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive ? 'text-white' : isDone ? '' : ''}`}
                style={{
                  backgroundColor: isActive ? '#0066ff' : isDone ? 'rgba(16,185,129,0.12)' : 'var(--muted)',
                  color: isActive ? '#fff' : isDone ? '#10b981' : 'var(--muted-foreground)',
                }}>
                <Icon name={isDone ? 'CheckCircleIcon' : s.icon as any} size={16} />
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < 2 && <Icon name="ChevronRightIcon" size={16} style={{ color: 'var(--muted-foreground)' }} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Session info banner */}
      <div className="rounded-xl p-4 mb-6 flex items-center gap-4" style={{ background: 'linear-gradient(135deg,rgba(0,102,255,0.08),rgba(0,180,216,0.08))', border: '1px solid rgba(0,102,255,0.15)' }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
          style={{ background: 'linear-gradient(135deg,#0066ff,#00b4d8)' }}>MS</div>
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Dr. Mohamed Sy — Médecin généraliste</p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Suivi douleurs abdominales · Aujourd'hui à 14h30 · 30 min</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(245,158,11,0.12)' }}>
          <Icon name="ClockIcon" size={14} style={{ color: '#f59e0b' }} />
          <span className="text-xs font-semibold" style={{ color: '#f59e0b' }}>Dans 45 min</span>
        </div>
      </div>

      {/* Step: Vitals */}
      {step === 'vitals' && (
        <div className="space-y-6">
          <div className="card-base p-6">
            <h2 className="text-base font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Constantes vitales</h2>
            <p className="text-sm mb-5" style={{ color: 'var(--muted-foreground)' }}>Saisissez vos constantes actuelles. Ces données seront partagées avec votre médecin.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vitalsFields.map(field => (
                <div key={field.key} className="rounded-xl border p-4" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name={field.icon as any} size={16} style={{ color: field.color }} />
                    <label className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{field.label}</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={vitals[field.key] || ''}
                      onChange={e => handleVitalChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="flex-1 px-3 py-2 rounded-lg text-sm border outline-none focus:ring-1"
                      style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    />
                    <span className="text-xs font-medium shrink-0" style={{ color: 'var(--muted-foreground)' }}>{field.unit}</span>
                  </div>
                  <p className="text-xs mt-1.5" style={{ color: 'var(--muted-foreground)' }}>Normal : {field.normal}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card-base p-6">
            <h2 className="text-base font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Symptômes actuels</h2>
            <p className="text-sm mb-3" style={{ color: 'var(--muted-foreground)' }}>Décrivez brièvement vos symptômes pour préparer la consultation.</p>
            <textarea
              value={symptoms}
              onChange={e => setSymptoms(e.target.value)}
              rows={4}
              placeholder="Ex: Douleurs abdominales depuis 3 jours, surtout après les repas. Légère nausée le matin..."
              className="w-full px-4 py-3 rounded-xl text-sm border outline-none focus:ring-1 resize-none"
              style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              {vitalsCompleted}/{vitalsFields.length} constantes renseignées
            </p>
            <button
              onClick={() => setStep('devices')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#0066ff' }}>
              Continuer
              <Icon name="ChevronRightIcon" size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step: Devices */}
      {step === 'devices' && (
        <div className="space-y-6">
          <div className="card-base p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>Test de l'équipement</h2>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Vérifiez que votre caméra, micro et connexion fonctionnent correctement.</p>
              </div>
              <button
                onClick={testAll}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#0066ff' }}>
                <Icon name="PlayIcon" size={15} />
                Tout tester
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {deviceChecks.map(device => {
                const status = deviceStatus[device.key];
                return (
                  <div key={device.key} className="rounded-xl border p-4 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: status === 'ok' ? 'rgba(16,185,129,0.12)' : status === 'error' ? 'rgba(239,68,68,0.12)' : 'var(--muted)' }}>
                        <Icon name={device.icon as any} size={20}
                          style={{ color: status === 'ok' ? '#10b981' : status === 'error' ? '#ef4444' : 'var(--muted-foreground)' }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{device.label}</p>
                        <p className="text-xs" style={{ color: status === 'ok' ? '#10b981' : status === 'error' ? '#ef4444' : 'var(--muted-foreground)' }}>
                          {status === 'ok' ? 'Fonctionnel' : status === 'error' ? 'Problème détecté' : 'Non testé'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => testDevice(device.key)}
                      disabled={testing === device.key}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all hover:bg-muted"
                      style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                      {testing === device.key ? (
                        <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                      ) : status === 'ok' ? (
                        <Icon name="CheckIcon" size={14} style={{ color: '#10b981' }} />
                      ) : 'Tester'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Video preview placeholder */}
          <div className="card-base p-6">
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Aperçu caméra</h2>
            <div className="rounded-xl overflow-hidden flex items-center justify-center" style={{ height: '200px', background: 'linear-gradient(135deg,#1e3a5f,#0d2137)' }}>
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#0066ff,#00b4d8)' }}>AD</div>
                <p className="text-white text-sm font-medium">Aïcha Diallo</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Aperçu de votre caméra</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button onClick={() => setStep('vitals')} className="flex items-center gap-2 text-sm transition-colors hover:opacity-80" style={{ color: 'var(--muted-foreground)' }}>
              <Icon name="ChevronLeftIcon" size={16} />
              Retour
            </button>
            <button
              onClick={() => setStep('ready')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#0066ff' }}>
              Continuer
              <Icon name="ChevronRightIcon" size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step: Ready */}
      {step === 'ready' && (
        <div className="space-y-6">
          <div className="card-base p-8 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(5,150,105,0.15))', border: '2px solid rgba(16,185,129,0.3)' }}>
              <Icon name="CheckCircleIcon" size={40} style={{ color: '#10b981' }} />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Vous êtes prêt(e) !</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
              Vos constantes ont été enregistrées et votre équipement est vérifié. Vous pouvez rejoindre la consultation.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6 text-left">
              <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--muted)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Constantes</p>
                <p className="text-sm font-semibold" style={{ color: '#10b981' }}>{vitalsCompleted} renseignées</p>
              </div>
              <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--muted)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Équipement</p>
                <p className="text-sm font-semibold" style={{ color: '#10b981' }}>{devicesOk}/4 OK</p>
              </div>
              <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--muted)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Connexion</p>
                <p className="text-sm font-semibold" style={{ color: '#10b981' }}>Stable</p>
              </div>
            </div>

            <Link href="/patient-session-teleconsult"
              className="inline-flex items-center gap-3 px-8 py-3 rounded-xl text-base font-bold text-white transition-all hover:opacity-90 hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#0066ff,#00b4d8)' }}>
              <Icon name="VideoCameraIcon" size={20} />
              Rejoindre la consultation
            </Link>
          </div>

          <div className="flex justify-center">
            <button onClick={() => setStep('devices')} className="flex items-center gap-2 text-sm transition-colors hover:opacity-80" style={{ color: 'var(--muted-foreground)' }}>
              <Icon name="ChevronLeftIcon" size={16} />
              Retour au test équipement
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
