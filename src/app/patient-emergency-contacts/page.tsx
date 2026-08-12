'use client';
import React from 'react';
import AppLayout from '@/components/AppLayout';
import PatientEmergencyContactsContent from './components/PatientEmergencyContactsContent';

export default function PatientEmergencyContactsPage() {
  return (
    <AppLayout role="patient" activeRoute="/patient-emergency-contacts">
      <PatientEmergencyContactsContent />
    </AppLayout>
  );
}
