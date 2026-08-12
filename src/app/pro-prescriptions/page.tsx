import React from 'react';
import AppLayout from '@/components/AppLayout';
import ProPrescriptionsContent from './components/ProPrescriptionsContent';

export default function ProPrescriptionsPage() {
  return (
    <AppLayout role="professional" activeRoute="/pro-prescriptions">
      <ProPrescriptionsContent />
    </AppLayout>
  );
}
