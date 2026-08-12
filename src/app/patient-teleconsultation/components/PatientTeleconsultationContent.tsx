'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface TeleconsultInvite {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  duration: string;
  type: 'video' | 'audio';
  status: 'pending' | 'confirmed' | 'upcoming';
  motif: string;
  avatar: string;
}

const invites: TeleconsultInvite[] = [
  {
    id: 'tc1',
    doctorName: 'Dr. Mohamed Sy',
    specialty: 'Médecin généraliste',
    date: "Aujourd'hui",
    time: '14h30',
    duration: '30 min',
    type: 'video',
    status: 'pending',
    motif: 'Suivi douleurs abdominales',
    avatar: 'MS',
  },
  {
    id: 'tc2',
    doctorName: 'Dr. Fatou Ndiaye',
    specialty: 'Cardiologue',
    date: 'Demain',
    time: '10h00',
    duration: '20 min',
    type: 'video',
    status: 'confirmed',
    motif: 'Contrôle tension artérielle',
    avatar: 'FN',
  },
  {
    id: 'tc3',
    doctorName: 'Dr. Ibrahima Diop',
    specialty: 'Dermatologue',
    date: '15 août 2026',
    time: '16h15',
    duration: '15 min',
    type: 'audio',
    status: 'upcoming',
    motif: 'Consultation dermatologique',
    avatar: 'ID',
  },
];

const pastSessions = [
  { id: 'p1', doctorName: 'Dr. Mohamed Sy', specialty: 'Médecin généraliste', date: '3 août 2026', duration: '28 min', status: 'completed', hasPrescription: true },
  { id: 'p2', doctorName: 'Dr. Aminata Bah', specialty: 'Gynécologue', date: '22 juil. 2026', duration: '22 min', status: 'completed', hasPrescription: false },
];

const statusConfig = {
  pending: { label: 'En attente', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  confirmed: { label: 'Confirmé', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  upcoming: { label: 'Planifié', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
};

export default function PatientTeleconsultationContent() {
  const [acceptedId, setAcceptedId] = useState<string | null>(null);

  const handleAccept = (id: string) => {
    setAcceptedId(id);
  };

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#0066ff,#00b4d8)' }}>
            <Icon name="VideoCameraIcon" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Téléconsultations</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Vos consultations vidéo avec vos professionnels de santé</p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Invitations reçues', value: '1', icon: 'EnvelopeIcon', color: '#f59e0b' },
          { label: 'Sessions confirmées', value: '2', icon: 'CalendarDaysIcon', color: '#10b981' },
          { label: 'Sessions passées', value: '8', icon: 'ClockIcon', color: '#60a5fa' },
          { label: 'Ordonnances reçues', value: '5', icon: 'DocumentCheckIcon', color: '#a78bfa' },
        ].map(kpi => (
          <div key={kpi.label} className="card-base p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${kpi.color}18` }}>
              <Icon name={kpi.icon as any} size={20} style={{ color: kpi.color }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{kpi.value}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Invitations & Sessions à venir */}
        <div className="xl:col-span-2 space-y-6">
          <div className="card-base p-6">
            <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Invitations & Sessions à venir</h2>
            <div className="space-y-4">
              {invites.map(invite => {
                const sc = statusConfig[invite.status];
                const isAccepted = acceptedId === invite.id;
                return (
                  <div key={invite.id} className="rounded-xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                          style={{ background: 'linear-gradient(135deg,#0066ff,#00b4d8)' }}>
                          {invite.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{invite.doctorName}</p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{invite.specialty}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{invite.motif}</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold shrink-0" style={{ color: sc.color, backgroundColor: sc.bg }}>
                        {sc.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        <Icon name="CalendarDaysIcon" size={14} />
                        {invite.date} à {invite.time}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        <Icon name="ClockIcon" size={14} />
                        {invite.duration}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        <Icon name={invite.type === 'video' ? 'VideoCameraIcon' : 'PhoneIcon'} size={14} />
                        {invite.type === 'video' ? 'Vidéo' : 'Audio'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      {invite.status === 'pending' && !isAccepted && (
                        <>
                          <button
                            onClick={() => handleAccept(invite.id)}
                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                            style={{ backgroundColor: '#0066ff' }}>
                            <Icon name="CheckIcon" size={15} />
                            Accepter
                          </button>
                          <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium border transition-all hover:bg-muted"
                            style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                            <Icon name="XMarkIcon" size={15} />
                            Décliner
                          </button>
                        </>
                      )}
                      {(invite.status === 'confirmed' || isAccepted) && (
                        <Link href="/patient-precall-vitals"
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                          style={{ backgroundColor: '#10b981' }}>
                          <Icon name="PlayIcon" size={15} />
                          Préparer la consultation
                        </Link>
                      )}
                      {invite.status === 'upcoming' && !isAccepted && (
                        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium border transition-all hover:bg-muted"
                          style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                          <Icon name="CalendarDaysIcon" size={15} />
                          Ajouter au calendrier
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Historique */}
          <div className="card-base p-6">
            <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Sessions passées</h2>
            <div className="space-y-3">
              {pastSessions.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                      {s.doctorName.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{s.doctorName}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.date} · {s.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {s.hasPrescription && (
                      <Link href="/patient-prescription-receipt"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all hover:bg-muted"
                        style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                        <Icon name="DocumentCheckIcon" size={13} />
                        Ordonnance
                      </Link>
                    )}
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ color: '#10b981', backgroundColor: 'rgba(16,185,129,0.12)' }}>
                      Terminée
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Info card */}
          <div className="card-base p-5">
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Comment ça marche ?</h3>
            <div className="space-y-3">
              {[
                { step: '1', label: 'Recevez l\'invitation', desc: 'Votre médecin vous envoie une invitation de téléconsultation' },
                { step: '2', label: 'Acceptez & préparez', desc: 'Acceptez l\'invitation et vérifiez vos constantes vitales' },
                { step: '3', label: 'Rejoignez la session', desc: 'Connectez-vous à l\'heure prévue pour la consultation vidéo' },
                { step: '4', label: 'Recevez l\'ordonnance', desc: 'Votre ordonnance numérique est disponible immédiatement' },
              ].map(item => (
                <div key={item.step} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                    style={{ background: 'linear-gradient(135deg,#0066ff,#00b4d8)' }}>
                    {item.step}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{item.label}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="card-base p-5">
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Actions rapides</h3>
            <div className="space-y-2">
              <Link href="/patient-precall-vitals"
                className="w-full flex items-center gap-3 p-3 rounded-xl border transition-all hover:bg-muted"
                style={{ borderColor: 'var(--border)' }}>
                <Icon name="HeartIcon" size={18} style={{ color: '#ef4444' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Vérifier mes constantes</span>
              </Link>
              <Link href="/patient-session-teleconsult"
                className="w-full flex items-center gap-3 p-3 rounded-xl border transition-all hover:bg-muted"
                style={{ borderColor: 'var(--border)' }}>
                <Icon name="VideoCameraIcon" size={18} style={{ color: '#0066ff' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Rejoindre une session</span>
              </Link>
              <Link href="/patient-prescription-receipt"
                className="w-full flex items-center gap-3 p-3 rounded-xl border transition-all hover:bg-muted"
                style={{ borderColor: 'var(--border)' }}>
                <Icon name="DocumentCheckIcon" size={18} style={{ color: '#10b981' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Mes ordonnances</span>
              </Link>
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-xl p-4" style={{ background: 'linear-gradient(135deg,rgba(0,102,255,0.08),rgba(0,180,216,0.08))', border: '1px solid rgba(0,102,255,0.15)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Icon name="LightBulbIcon" size={16} style={{ color: '#60a5fa' }} />
              <p className="text-sm font-semibold" style={{ color: '#60a5fa' }}>Conseil</p>
            </div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Assurez-vous d'être dans un endroit calme et bien éclairé avant votre téléconsultation. Testez votre caméra et microphone à l'avance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
