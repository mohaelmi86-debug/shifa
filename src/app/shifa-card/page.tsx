import React from 'react';
import AppLayout from '@/components/AppLayout';
import ShifaCardContent from './components/ShifaCardContent';

export default function ShifaCardPage() {
  return (
    <AppLayout role="patient" activeRoute="/shifa-card">
      <ShifaCardContent />
    </AppLayout>
  );
}
