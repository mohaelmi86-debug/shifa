import React from 'react';
import AppLayout from '@/components/AppLayout';
import EspaceUniversiteContent from './components/EspaceUniversiteContent';

export default function EspaceUniversitePage() {
  return (
    <AppLayout role="institution" activeRoute="/espace-universite">
      <EspaceUniversiteContent />
    </AppLayout>
  );
}
