'use client';
import AppLayout from '@/components/AppLayout';
import PsychiatryWorkspaceContent from './components/PsychiatryWorkspaceContent';

export default function PsychiatryWorkspacePage() {
  return (
    <AppLayout role="professional" activeRoute="/psychiatry-workspace">
      <PsychiatryWorkspaceContent />
    </AppLayout>
  );
}
