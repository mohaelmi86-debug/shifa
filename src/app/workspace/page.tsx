'use client';
import AppLayout from '@/components/AppLayout';
import WorkspaceEngineContent from './components/WorkspaceEngineContent';

export default function WorkspacePage() {
  return (
    <AppLayout activeRoute="/workspace">
      <WorkspaceEngineContent />
    </AppLayout>
  );
}
