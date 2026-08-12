'use client';
import AppLayout from '@/components/AppLayout';
import HRModuleContent from './components/HRModuleContent';

export default function HRModulePage() {
  return (
    <AppLayout role="admin" activeRoute="/hr-module">
      <HRModuleContent />
    </AppLayout>
  );
}
