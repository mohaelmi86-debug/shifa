'use client';
import AppLayout from '@/components/AppLayout';
import GynecologyWorkspaceContent from './components/GynecologyWorkspaceContent';

export default function GynecologyWorkspacePage() {
  return (
    <AppLayout role="professional" activeRoute="/gynecology-workspace">
      <GynecologyWorkspaceContent />
    </AppLayout>
  );
}
