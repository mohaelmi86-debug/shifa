'use client';
import AppLayout from '@/components/AppLayout';
import PediatricsWorkspaceContent from './components/PediatricsWorkspaceContent';

export default function PediatricsWorkspacePage() {
  return (
    <AppLayout role="professional" activeRoute="/pediatrics-workspace">
      <PediatricsWorkspaceContent />
    </AppLayout>
  );
}
