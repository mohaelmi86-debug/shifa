import React from 'react';
import AppLayout from '@/components/AppLayout';
import AdminUtilisateursContent from './components/AdminUtilisateursContent';

export default function AdminUtilisateursPage() {
  return (
    <AppLayout role="admin" activeRoute="/admin-utilisateurs">
      <AdminUtilisateursContent />
    </AppLayout>
  );
}
