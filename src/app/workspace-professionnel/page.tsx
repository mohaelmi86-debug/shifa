import React from 'react';
import AppLayout from '@/components/AppLayout';
import WorkspaceContent from './components/WorkspaceContent';

export default function WorkspaceProfessionnelPage() {
  return (
    <AppLayout role="professional" activeRoute="/workspace-professionnel">
      <WorkspaceContent />
    </AppLayout>
  );
}