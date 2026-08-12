'use client';
import React from 'react';
import AppLayout from '@/components/AppLayout';
import PatientMapContent from './components/PatientMapContent';

export default function PatientMapPage() {
  return (
    <AppLayout role="patient" activeRoute="/patient-map">
      <PatientMapContent />
    </AppLayout>
  );
}
