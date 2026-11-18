'use client';
import AppLayout from '@/components/AppLayout';
import OrthopedicsWorkspaceContent from './components/OrthopedicsWorkspaceContent';

export default function OrthopedicsWorkspacePage() {
  return (
    <AppLayout role="professional" activeRoute="/orthopedics-workspace">
      <OrthopedicsWorkspaceContent />
    </AppLayout>
  );
}
