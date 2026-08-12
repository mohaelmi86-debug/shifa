import React from 'react';
import AppLayout from '@/components/AppLayout';
import AdminParametresContent from './components/AdminParametresContent';

export default function AdminParametresPage() {
  return (
    <AppLayout role="admin" activeRoute="/admin-parametres">
      <AdminParametresContent />
    </AppLayout>
  );
}
