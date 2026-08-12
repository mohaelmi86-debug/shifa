import React from 'react';
import AppLayout from '@/components/AppLayout';
import ProAgendaContent from './components/ProAgendaContent';

export default function ProAgendaPage() {
  return (
    <AppLayout role="professional" activeRoute="/pro-agenda">
      <ProAgendaContent />
    </AppLayout>
  );
}
