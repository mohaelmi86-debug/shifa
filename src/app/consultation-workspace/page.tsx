import React from 'react';
import AppLayout from '@/components/AppLayout';
import ConsultationWorkspaceContent from './components/ConsultationWorkspaceContent';

export default function ConsultationWorkspacePage() {
  return (
    <AppLayout role="professional" activeRoute="/consultation-workspace">
      <ConsultationWorkspaceContent />
    </AppLayout>
  );
}
