import React from 'react';
import AppLayout from '@/components/AppLayout';
import AdminActiviteContent from './components/AdminActiviteContent';

export default function AdminActivitePage() {
  return (
    <AppLayout role="admin" activeRoute="/admin-activite">
      <AdminActiviteContent />
    </AppLayout>
  );
}
