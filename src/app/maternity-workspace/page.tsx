'use client';
import AppLayout from '@/components/AppLayout';
import MaternityWorkspaceContent from './components/MaternityWorkspaceContent';

export default function MaternityWorkspacePage() {
  return (
    <AppLayout role="professional" activeRoute="/maternity-workspace">
      <MaternityWorkspaceContent />
    </AppLayout>
  );
}
