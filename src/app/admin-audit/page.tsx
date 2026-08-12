import React from 'react';
import AppLayout from '@/components/AppLayout';
import AdminAuditContent from './components/AdminAuditContent';

export default function AdminAuditPage() {
  return (
    <AppLayout role="admin" activeRoute="/admin-audit">
      <AdminAuditContent />
    </AppLayout>
  );
}
