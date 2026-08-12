import React from 'react';
import AppLayout from '@/components/AppLayout';
import DossierContent from './components/DossierContent';

export default function DossierDeSantePage() {
  return (
    <AppLayout role="patient" activeRoute="/dossier-de-sant">
      <DossierContent />
    </AppLayout>
  );
}