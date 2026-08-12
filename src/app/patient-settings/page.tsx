import React from 'react';
import AppLayout from '@/components/AppLayout';
import PatientSettingsContent from './components/PatientSettingsContent';

export default function PatientSettingsPage() {
  return (
    <AppLayout role="patient" activeRoute="/patient-settings">
      <PatientSettingsContent />
    </AppLayout>
  );
}
