import React from 'react';
import AppLayout from '@/components/AppLayout';
import ProResultatsContent from './components/ProResultatsContent';

export default function ProResultatsPage() {
  return (
    <AppLayout role="professional" activeRoute="/pro-resultats">
      <ProResultatsContent />
    </AppLayout>
  );
}
