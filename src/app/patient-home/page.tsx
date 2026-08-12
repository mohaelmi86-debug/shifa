import React from 'react';
import AppLayout from '@/components/AppLayout';
import PatientHomeContent from './components/PatientHomeContent';

export default function PatientHomePage() {
  return (
    <AppLayout role="patient" activeRoute="/patient-home">
      <PatientHomeContent />
    </AppLayout>
  );
}