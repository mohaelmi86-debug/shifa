'use client';
import AppLayout from '@/components/AppLayout';
import PalliativeCareWorkspaceContent from './components/PalliativeCareWorkspaceContent';

export default function PalliativeCareWorkspacePage() {
  return (
    <AppLayout role="professional" activeRoute="/palliative-care-workspace">
      <PalliativeCareWorkspaceContent />
    </AppLayout>
  );
}
