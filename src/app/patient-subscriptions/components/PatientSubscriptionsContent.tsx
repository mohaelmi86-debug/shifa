'use client';
import React from 'react';
import Icon from '@/components/ui/AppIcon';

const freeFeatures = [
  'Dossier médical personnel complet',
  'Rendez-vous en ligne illimités',
  'Résultats et documents médicaux',
  'Messagerie sécurisée avec vos professionnels',
  'Carte SHIFA numérique',
  'Téléconsultation (selon disponibilité)',
  'Suivi de santé et prévention',
  'Vaccination et rappels',
  'Ordonnances numériques',
  'Appareils connectés (jusqu\'à 3)',
  'Notifications et alertes santé',
  'Consentements et confidentialité',
  'Accès famille / dépendants (selon législation)',
  'Support SHIFA',
];

export default function PatientSubscriptionsContent() {
  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Mon espace SHIFA</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>L'accès patient SHIFA est entièrement gratuit</p>
      </div>

      {/* Free plan banner */}
      <div className="card-base p-6 mb-6 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
          <Icon name="ShieldCheckIcon" size={24} className="text-white" />
        </div>
        <div className="text-white">
          <p className="text-xs font-medium opacity-80">Votre accès</p>
          <p className="text-xl font-bold mt-0.5">SHIFA Patient — Gratuit</p>
          <p className="text-sm opacity-80 mt-0.5">Toutes les fonctionnalités incluses, sans abonnement</p>
        </div>
        <div className="ml-auto shrink-0">
          <span className="text-2xl font-black text-white">0 €</span>
          <p className="text-xs text-white opacity-70 text-right">pour toujours</p>
        </div>
      </div>

      {/* What's included */}
      <div className="card p-6 mb-6">
        <h2 className="font-bold text-lg mb-4" style={{ color: 'var(--foreground)' }}>Ce qui est inclus</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {freeFeatures.map(feature => (
            <div key={feature} className="flex items-start gap-2">
              <Icon name="CheckCircleIcon" size={16} style={{ color: 'var(--shifa-blue)', marginTop: 2, flexShrink: 0 } as any} />
              <span className="text-sm" style={{ color: 'var(--foreground)' }}>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SHIFA commitment */}
      <div className="card p-5" style={{ backgroundColor: '#f0f7ff', borderColor: 'rgba(0,102,255,0.15)' }}>
        <div className="flex items-start gap-3">
          <Icon name="HeartIcon" size={20} style={{ color: 'var(--shifa-blue)', flexShrink: 0, marginTop: 2 } as any} />
          <div>
            <p className="font-semibold text-sm mb-1" style={{ color: 'var(--shifa-dark)' }}>L'engagement SHIFA</p>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              L'accès patient à SHIFA Health OS est et restera gratuit. Notre mission est de rendre les soins de santé accessibles à tous.
              Les professionnels de santé et les organisations de santé disposent de leurs propres plans adaptés à leurs besoins professionnels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
