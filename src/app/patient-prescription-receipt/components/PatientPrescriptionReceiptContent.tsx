'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

const prescription = {
  id: 'RX-2026-08-10-0042',
  date: '10 août 2026',
  time: '15h04',
  doctor: {
    name: 'Dr. Mohamed Sy',
    specialty: 'Médecin généraliste',
    rpps: 'RPPS-10012345',
    address: 'Cabinet médical SHIFA, Dakar, Sénégal',
    phone: '+221 33 820 00 00',
  },
  patient: {
    name: 'Aïcha Diallo',
    dob: '12/03/1993',
    shifaId: 'SH-2-SN-2025-7K4D',
    weight: '62 kg',
  },
  diagnosis: 'Gastrite fonctionnelle — douleurs épigastriques post-prandiales',
  medications: [
    {
      name: 'Oméprazole 20 mg',
      dosage: '1 comprimé',
      frequency: '1 fois par jour, le matin à jeun',
      duration: '4 semaines',
      instructions: 'Avaler entier avec un verre d\'eau',
    },
    {
      name: 'Spasfon (Phloroglucinol) 80 mg',
      dosage: '2 comprimés',
      frequency: '3 fois par jour',
      duration: '10 jours',
      instructions: 'En cas de douleurs abdominales',
    },
    {
      name: 'Smecta (Diosmectite) 3 g',
      dosage: '1 sachet',
      frequency: '3 fois par jour',
      duration: '5 jours',
      instructions: 'Diluer dans un verre d\'eau, prendre entre les repas',
    },
  ] as Medication[],
  advice: [
    'Éviter les aliments épicés, acides et les boissons gazeuses',
    'Manger lentement et en petites quantités',
    'Éviter de s\'allonger immédiatement après les repas',
    'Consulter en urgence si aggravation des douleurs ou vomissements',
  ],
  followUp: 'Consultation de contrôle dans 4 semaines si persistance des symptômes',
  validity: '3 mois',
  signature: 'Signé électroniquement — Dr. Mohamed Sy — 10/08/2026 15:04',
};

export default function PatientPrescriptionReceiptContent() {
  const [downloaded, setDownloaded] = useState(false);
  const [shared, setShared] = useState(false);

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handleShare = () => {
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link href="/patient-teleconsultation" className="flex items-center gap-2 text-sm mb-4 transition-colors hover:opacity-80" style={{ color: 'var(--muted-foreground)' }}>
          <Icon name="ChevronLeftIcon" size={16} />
          Retour aux téléconsultations
        </Link>

        {/* Success banner */}
        <div className="rounded-2xl p-5 mb-6 flex items-center gap-4" style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.1),rgba(5,150,105,0.08))', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(16,185,129,0.15)' }}>
            <Icon name="CheckCircleIcon" size={28} style={{ color: '#10b981' }} />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>Consultation terminée — Ordonnance disponible</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Votre ordonnance numérique a été générée et signée électroniquement par {prescription.doctor.name}.
            </p>
          </div>
          <Link href="/patient-postcall-survey"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 shrink-0"
            style={{ backgroundColor: '#0066ff' }}>
            <Icon name="StarIcon" size={15} />
            Évaluer
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Prescription document */}
        <div className="xl:col-span-2">
          <div className="card-base overflow-hidden">
            {/* Prescription header */}
            <div className="p-6 border-b" style={{ borderColor: 'var(--border)', background: 'linear-gradient(135deg,rgba(0,102,255,0.05),rgba(0,180,216,0.03))' }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#0066ff,#00b4d8)' }}>
                      <Icon name="DocumentCheckIcon" size={16} className="text-white" />
                    </div>
                    <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--muted-foreground)' }}>Ordonnance Médicale</span>
                  </div>
                  <p className="text-xs font-mono mt-1" style={{ color: 'var(--muted-foreground)' }}>{prescription.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{prescription.date}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{prescription.time}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Validité : {prescription.validity}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Doctor & Patient */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--muted)' }}>
                  <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>Prescripteur</p>
                  <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{prescription.doctor.name}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{prescription.doctor.specialty}</p>
                  <p className="text-xs mt-1 font-mono" style={{ color: 'var(--muted-foreground)' }}>{prescription.doctor.rpps}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{prescription.doctor.address}</p>
                </div>
                <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--muted)' }}>
                  <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>Patient</p>
                  <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{prescription.patient.name}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Né(e) le {prescription.patient.dob}</p>
                  <p className="text-xs mt-1 font-mono" style={{ color: 'var(--muted-foreground)' }}>{prescription.patient.shifaId}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Poids : {prescription.patient.weight}</p>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="rounded-xl p-4 border-l-4" style={{ backgroundColor: 'rgba(245,158,11,0.06)', borderLeftColor: '#f59e0b' }}>
                <p className="text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#f59e0b' }}>Diagnostic</p>
                <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{prescription.diagnosis}</p>
              </div>

              {/* Medications */}
              <div>
                <p className="text-xs font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>Médicaments prescrits</p>
                <div className="space-y-3">
                  {prescription.medications.map((med, i) => (
                    <div key={i} className="rounded-xl border p-4" style={{ borderColor: 'var(--border)' }}>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0"
                          style={{ background: 'linear-gradient(135deg,#0066ff,#00b4d8)' }}>
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{med.name}</p>
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            <div>
                              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Posologie</p>
                              <p className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{med.dosage}</p>
                            </div>
                            <div>
                              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Fréquence</p>
                              <p className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{med.frequency}</p>
                            </div>
                            <div>
                              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Durée</p>
                              <p className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{med.duration}</p>
                            </div>
                          </div>
                          <p className="text-xs mt-2 italic" style={{ color: 'var(--muted-foreground)' }}>{med.instructions}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advice */}
              <div>
                <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>Conseils hygiéno-diététiques</p>
                <ul className="space-y-1.5">
                  {prescription.advice.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--foreground)' }}>
                      <Icon name="CheckCircleIcon" size={15} className="shrink-0 mt-0.5" style={{ color: '#10b981' }} />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Follow-up */}
              <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.15)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="CalendarDaysIcon" size={15} style={{ color: '#60a5fa' }} />
                  <p className="text-xs font-semibold" style={{ color: '#60a5fa' }}>Suivi recommandé</p>
                </div>
                <p className="text-sm" style={{ color: 'var(--foreground)' }}>{prescription.followUp}</p>
              </div>

              {/* Signature */}
              <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2">
                  <Icon name="ShieldCheckIcon" size={16} style={{ color: '#10b981' }} />
                  <p className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{prescription.signature}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Actions */}
          <div className="card-base p-5">
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Actions</h3>
            <div className="space-y-2">
              <button
                onClick={handleDownload}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#0066ff' }}>
                <Icon name={downloaded ? 'CheckIcon' : 'ArrowDownTrayIcon'} size={16} />
                {downloaded ? 'Téléchargé !' : 'Télécharger PDF'}
              </button>
              <button
                onClick={handleShare}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium border transition-all hover:bg-muted"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                <Icon name={shared ? 'CheckIcon' : 'ShareIcon'} size={16} />
                {shared ? 'Partagé !' : 'Partager à une pharmacie'}
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium border transition-all hover:bg-muted"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                <Icon name="PrinterIcon" size={16} />
                Imprimer
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium border transition-all hover:bg-muted"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                <Icon name="FolderArrowDownIcon" size={16} />
                Ajouter au dossier
              </button>
            </div>
          </div>

          {/* Pharmacy locator */}
          <div className="card-base p-5">
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Pharmacies proches</h3>
            <div className="space-y-2">
              {[
                { name: 'Pharmacie Centrale', distance: '0.3 km', open: true },
                { name: 'Pharmacie du Marché', distance: '0.8 km', open: true },
                { name: 'Pharmacie Ndiaye', distance: '1.2 km', open: false },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <p className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.distance}</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ color: p.open ? '#10b981' : '#ef4444', backgroundColor: p.open ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }}>
                    {p.open ? 'Ouvert' : 'Fermé'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Survey CTA */}
          <div className="rounded-xl p-4" style={{ background: 'linear-gradient(135deg,rgba(0,102,255,0.08),rgba(0,180,216,0.08))', border: '1px solid rgba(0,102,255,0.15)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Icon name="StarIcon" size={16} style={{ color: '#f59e0b' }} />
              <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Évaluez votre consultation</p>
            </div>
            <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>Votre avis nous aide à améliorer l'expérience SHIFA.</p>
            <Link href="/patient-postcall-survey"
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#0066ff' }}>
              Donner mon avis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
