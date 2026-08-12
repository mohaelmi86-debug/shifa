import React from 'react';
import AppLayout from '@/components/AppLayout';
import EspaceOngContent from './components/EspaceOngContent';

export default function EspaceOngPage() {
  return (
    <AppLayout role="institution" activeRoute="/espace-ong">
      <EspaceOngContent />
    </AppLayout>
  );
}
