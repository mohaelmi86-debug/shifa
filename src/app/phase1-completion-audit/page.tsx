'use client';
import AppLayout from '@/components/AppLayout';
import Phase1CompletionAuditContent from './components/Phase1CompletionAuditContent';

export default function Phase1CompletionAuditPage() {
  return (
    <AppLayout role="platform_admin" activeRoute="/phase1-completion-audit">
      <Phase1CompletionAuditContent />
    </AppLayout>
  );
}
