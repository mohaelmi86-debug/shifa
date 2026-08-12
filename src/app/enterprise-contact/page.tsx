'use client';
import AppLayout from '@/components/AppLayout';
import EnterpriseContactContent from './components/EnterpriseContactContent';

export default function EnterpriseContactPage() {
  return (
    <AppLayout role="institution" activeRoute="/enterprise-contact">
      <EnterpriseContactContent />
    </AppLayout>
  );
}
