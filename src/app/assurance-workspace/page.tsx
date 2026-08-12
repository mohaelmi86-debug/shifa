import AssuranceWorkspaceContent from './components/AssuranceWorkspaceContent';
import AppLayout from '@/components/AppLayout';

export default function AssuranceWorkspacePage() {
  return (
    <AppLayout role="institution" activeRoute="/assurance-workspace">
      <AssuranceWorkspaceContent />
    </AppLayout>
  );
}
