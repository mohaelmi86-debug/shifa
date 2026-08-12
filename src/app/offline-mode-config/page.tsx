'use client';
import AppLayout from '@/components/AppLayout';
import OfflineModeConfigContent from './components/OfflineModeConfigContent';

export default function OfflineModeConfigPage() {
  return (
    <AppLayout role="platform_admin" activeRoute="/offline-mode-config">
      <OfflineModeConfigContent />
    </AppLayout>
  );
}
