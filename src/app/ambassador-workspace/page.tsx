import AmbassadorWorkspaceContent from './components/AmbassadorWorkspaceContent';
import AppLayout from '@/components/AppLayout';

export default function AmbassadorWorkspacePage() {
  return (
    <AppLayout role="ambassador">
      <AmbassadorWorkspaceContent />
    </AppLayout>
  );
}
