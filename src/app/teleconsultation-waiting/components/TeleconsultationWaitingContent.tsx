'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface WaitingPatient {
  id: string;
  patient: string;
  avatar: string;
  arrivalTime: string;
  waitMinutes: number;
  reason: string;
  type: 'video' | 'audio';
  priority: 'normal' | 'urgent';
  status: 'waiting' | 'ready' | 'connecting';
  age: number;
  shifaId: string;
}

const initialQueue: WaitingPatient[] = [
  { id: 'p1', patient: 'Aïcha Diallo', avatar: 'AD', arrivalTime: '08:52', waitMinutes: 12, reason: 'Suivi diabète type 2', type: 'video', priority: 'normal', status: 'ready', age: 33, shifaId: 'SH-2-SN-2025-7K4D' },
  { id: 'p2', patient: 'Kwame Asante', avatar: 'KA', arrivalTime: '09:01', waitMinutes: 3, reason: 'Renouvellement ordonnance HTA', type: 'video', priority: 'normal', status: 'waiting', age: 58, shifaId: 'SH-2-GH-2024-3M9X' },
  { id: 'p3', patient: 'Nadia Benali', avatar: 'NB', arrivalTime: '09:05', waitMinutes: 0, reason: 'Douleurs thoraciques — urgence', type: 'audio', priority: 'urgent', status: 'waiting', age: 45, shifaId: 'SH-2-DZ-2023-8P2Q' },
  { id: 'p4', patient: 'Pierre Dubois', avatar: 'PD', arrivalTime: '09:10', waitMinutes: 0, reason: 'Suivi post-opératoire', type: 'video', priority: 'normal', status: 'waiting', age: 62, shifaId: 'SH-2-FR-2025-1L5R' },
];

export default function TeleconsultationWaitingContent() {
  const [queue, setQueue] = useState<WaitingPatient[]>(initialQueue);
  const [selectedId, setSelectedId] = useState<string | null>('p1');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
      setQueue(prev => prev.map(p => ({ ...p, waitMinutes: p.waitMinutes + (1 / 60) })));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const selected = queue.find(p => p.id === selectedId);
  const urgent = queue.filter(p => p.priority === 'urgent');

  const formatWait = (min: number) => {
    const m = Math.floor(min);
    const s = Math.floor((min - m) * 60);
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Salle d'attente virtuelle</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
              {queue.length} patient{queue.length > 1 ? 's' : ''} en attente
            </span>
          </p>
        </div>
        <Link href="/teleconsultation-lobby" className="btn-secondary text-sm px-4 py-2.5 flex items-center gap-2">
          <Icon name="ArrowLeftIcon" size={16} />
          Retour au lobby
        </Link>
      </div>

      {/* Urgent alert */}
      {urgent.length > 0 && (
        <div className="rounded-xl p-4 mb-5 flex items-center gap-3 border" style={{ backgroundColor: 'rgba(239,68,68,0.07)', borderColor: 'rgba(239,68,68,0.3)' }}>
          <Icon name="ExclamationTriangleIcon" size={20} style={{ color: 'var(--shifa-red)' }} />
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: 'var(--shifa-red)' }}>
              {urgent.length} cas urgent{urgent.length > 1 ? 's' : ''} en attente
            </p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{urgent[0].patient} — {urgent[0].reason}</p>
          </div>
          <Link href="/teleconsultation-session"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white"
            style={{ backgroundColor: 'var(--shifa-red)' }}>
            <Icon name="PlayIcon" size={13} />
            Prendre en charge
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Queue list */}
        <div className="xl:col-span-1 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--muted-foreground)' }}>File d'attente</p>
          {queue.map((patient, idx) => (
            <button
              key={patient.id}
              onClick={() => setSelectedId(patient.id)}
              className={`w-full text-left card-base p-4 transition-all hover:shadow-md ${selectedId === patient.id ? 'ring-2' : ''}`}
              style={selectedId === patient.id ? { ringColor: 'var(--shifa-blue)', borderColor: 'var(--shifa-blue)' } : {}}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ background: patient.priority === 'urgent' ? 'linear-gradient(135deg,#ef4444,#f97316)' : 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                    {patient.avatar}
                  </div>
                  <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: 'var(--shifa-dark)', fontSize: '10px' }}>
                    {idx + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{patient.patient}</p>
                    {patient.priority === 'urgent' && (
                      <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--shifa-red)' }}>URGENT</span>
                    )}
                  </div>
                  <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{patient.reason}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-mono font-semibold" style={{ color: patient.waitMinutes > 10 ? 'var(--shifa-red)' : 'var(--shifa-amber)' }}>
                    {formatWait(patient.waitMinutes)}
                  </p>
                  <Icon name={patient.type === 'video' ? 'VideoCameraIcon' : 'PhoneIcon'} size={12} className="text-muted-foreground mt-0.5 ml-auto" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Patient detail */}
        <div className="xl:col-span-2">
          {selected ? (
            <div className="card-base p-6 h-full">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                    {selected.avatar}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{selected.patient}</h2>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{selected.age} ans · {selected.shifaId}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)' }}>
                        {selected.type === 'video' ? '📹 Vidéo' : '📞 Audio'}
                      </span>
                      {selected.priority === 'urgent' && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--shifa-red)' }}>🚨 URGENT</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Temps d'attente</p>
                  <p className="text-2xl font-bold font-mono" style={{ color: selected.waitMinutes > 10 ? 'var(--shifa-red)' : 'var(--shifa-amber)' }}>
                    {formatWait(selected.waitMinutes)}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Arrivée : {selected.arrivalTime}</p>
                </div>
              </div>

              {/* Reason */}
              <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: 'var(--muted)' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>MOTIF DE CONSULTATION</p>
                <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{selected.reason}</p>
              </div>

              {/* Pre-consultation info */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label: 'Groupe sanguin', value: 'O+', icon: 'HeartIcon' },
                  { label: 'Allergies', value: 'Pénicilline', icon: 'ExclamationTriangleIcon' },
                  { label: 'Dernière consultation', value: '15/07/2026', icon: 'CalendarDaysIcon' },
                  { label: 'Traitements actifs', value: '2 médicaments', icon: 'DocumentCheckIcon' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                    <Icon name={item.icon as any} size={16} className="text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Link href="/teleconsultation-session"
                  className="flex-1 btn-primary flex items-center justify-center gap-2 py-3 text-sm font-semibold">
                  <Icon name="VideoCameraIcon" size={18} />
                  Démarrer la consultation
                </Link>
                <button className="btn-secondary px-4 py-3 flex items-center gap-2 text-sm">
                  <Icon name="ChatBubbleLeftRightIcon" size={16} />
                  Message
                </button>
                <button className="btn-secondary px-4 py-3 flex items-center gap-2 text-sm">
                  <Icon name="ClockIcon" size={16} />
                  Reporter
                </button>
              </div>
            </div>
          ) : (
            <div className="card-base p-12 flex flex-col items-center justify-center text-center h-full">
              <Icon name="UsersIcon" size={48} className="text-muted-foreground mb-4" />
              <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Sélectionnez un patient</p>
              <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Cliquez sur un patient dans la file pour voir ses détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
