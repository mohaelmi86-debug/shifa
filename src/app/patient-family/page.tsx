'use client';
import React from 'react';
import AppLayout from '@/components/AppLayout';
import PatientFamilyContent from './components/PatientFamilyContent';

export default function PatientFamilyPage() {
  return (
    <AppLayout role="patient" activeRoute="/patient-family">
      <PatientFamilyContent />
    </AppLayout>
  );
}
