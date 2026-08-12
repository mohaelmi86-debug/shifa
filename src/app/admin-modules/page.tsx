import React from 'react';
import AppLayout from '@/components/AppLayout';
import AdminModulesContent from './components/AdminModulesContent';

export default function AdminModulesPage() {
  return (
    <AppLayout role="admin" activeRoute="/admin-modules">
      <AdminModulesContent />
    </AppLayout>
  );
}
