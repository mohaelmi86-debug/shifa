import React from 'react';
import AppLayout from '@/components/AppLayout';
import PatientVaccinationContent from './components/PatientVaccinationContent';

export default function PatientVaccinationPage() {
  return (
    <AppLayout role="patient" activeRoute="/patient-vaccination">
      <PatientVaccinationContent />
    </AppLayout>
  );
}
