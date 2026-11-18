'use client';
import AppLayout from '@/components/AppLayout';
import EmergencyWorkspaceContent from './components/EmergencyWorkspaceContent';

export default function EmergencyWorkspacePage() {
  return (
    <AppLayout role="professional" activeRoute="/emergency-workspace">
      <EmergencyWorkspaceContent />
    </AppLayout>
  );
}
