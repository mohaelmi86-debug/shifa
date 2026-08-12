'use client';
import AppLayout from '@/components/AppLayout';
import ShifaAIWorkspaceContent from './components/ShifaAIWorkspaceContent';

export default function ShifaAIWorkspacePage() {
  return (
    <AppLayout role="professional" activeRoute="/shifa-ai-workspace">
      <ShifaAIWorkspaceContent />
    </AppLayout>
  );
}
