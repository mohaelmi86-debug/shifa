import React from 'react';
import AppLayout from '@/components/AppLayout';
import PatientPaymentsContent from './components/PatientPaymentsContent';

export default function PatientPaymentsPage() {
  return (
    <AppLayout role="patient" activeRoute="/patient-payments">
      <PatientPaymentsContent />
    </AppLayout>
  );
}
