'use client';
import AppLayout from '@/components/AppLayout';
import InteroperabilityHubContent from './components/InteroperabilityHubContent';

export default function InteroperabilityHubPage() {
  return (
    <AppLayout role="admin" activeRoute="/interoperability-hub">
      <InteroperabilityHubContent />
    </AppLayout>
  );
}
