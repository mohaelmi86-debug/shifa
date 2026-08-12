import React from 'react';
import AppLayout from '@/components/AppLayout';
import PatientExplorerContent from './components/PatientExplorerContent';

export default function PatientExplorerPage() {
  return (
    <AppLayout role="patient" activeRoute="/patient-explorer">
      <PatientExplorerContent />
    </AppLayout>
  );
}
