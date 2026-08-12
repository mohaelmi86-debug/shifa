import React from 'react';
import AppLayout from '@/components/AppLayout';
import PatientPreventionContent from './components/PatientPreventionContent';

export default function PatientPreventionPage() {
  return (
    <AppLayout role="patient" activeRoute="/patient-prevention">
      <PatientPreventionContent />
    </AppLayout>
  );
}
