import React from 'react';
import AppLayout from '@/components/AppLayout';
import PatientEmergencyContent from './components/PatientEmergencyContent';

export default function PatientEmergencyPage() {
  return (
    <AppLayout role="patient" activeRoute="/patient-emergency">
      <PatientEmergencyContent />
    </AppLayout>
  );
}
