import React from 'react';
import AppLayout from '@/components/AppLayout';
import ProPatientsContent from './components/ProPatientsContent';

export default function ProPatientsPage() {
  return (
    <AppLayout role="professional" activeRoute="/pro-patients">
      <ProPatientsContent />
    </AppLayout>
  );
}
