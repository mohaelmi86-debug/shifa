import React from 'react';
import AppLayout from '@/components/AppLayout';
import EspaceMinistereContent from './components/EspaceMinistereContent';

export default function EspaceMinisterePage() {
  return (
    <AppLayout role="institution" activeRoute="/espace-ministere">
      <EspaceMinistereContent />
    </AppLayout>
  );
}
