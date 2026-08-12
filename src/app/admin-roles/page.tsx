import React from 'react';
import AppLayout from '@/components/AppLayout';
import AdminRolesContent from './components/AdminRolesContent';

export default function AdminRolesPage() {
  return (
    <AppLayout role="admin" activeRoute="/admin-roles">
      <AdminRolesContent />
    </AppLayout>
  );
}
