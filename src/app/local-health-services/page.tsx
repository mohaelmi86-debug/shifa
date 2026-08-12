'use client';
import AppLayout from '@/components/AppLayout';
import LocalHealthServicesContent from './components/LocalHealthServicesContent';

export default function LocalHealthServicesPage() {
  return (
    <AppLayout role="platform_admin" activeRoute="/local-health-services">
      <LocalHealthServicesContent />
    </AppLayout>
  );
}
