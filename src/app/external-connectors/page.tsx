'use client';
import AppLayout from '@/components/AppLayout';
import ExternalConnectorsContent from './components/ExternalConnectorsContent';

export default function ExternalConnectorsPage() {
  return (
    <AppLayout role="platform_admin" activeRoute="/external-connectors">
      <ExternalConnectorsContent />
    </AppLayout>
  );
}
