import React from 'react';
import AppLayout from '@/components/AppLayout';
import ProParametresContent from './components/ProParametresContent';

export default function ProParametresPage() {
  return (
    <AppLayout role="professional" activeRoute="/pro-parametres">
      <ProParametresContent />
    </AppLayout>
  );
}
