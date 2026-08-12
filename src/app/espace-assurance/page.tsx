import React from 'react';
import AppLayout from '@/components/AppLayout';
import EspaceAssuranceContent from './components/EspaceAssuranceContent';

export default function EspaceAssurancePage() {
  return (
    <AppLayout role="institution" activeRoute="/espace-assurance">
      <EspaceAssuranceContent />
    </AppLayout>
  );
}
