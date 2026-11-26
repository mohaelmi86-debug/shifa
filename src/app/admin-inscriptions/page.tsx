import React from 'react';
import AppLayout from '@/components/AppLayout';
import RegistrationRequestsContent from './components/RegistrationRequestsContent';

export default function AdminRegistrationsPage() {
  return (
    <AppLayout role="platform_admin" activeRoute="/admin-inscriptions">
      <RegistrationRequestsContent />
    </AppLayout>
  );
}
