import AppLayout from '@/components/AppLayout';
import Phase2SystemAuditContent from './components/Phase2SystemAuditContent';

export default function Phase2SystemAuditPage() {
  return (
    <AppLayout role="platform_admin" activeRoute="/phase2-system-audit">
      <Phase2SystemAuditContent />
    </AppLayout>
  );
}
