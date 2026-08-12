import React from 'react';
import AppLayout from '@/components/AppLayout';
import AdminProfessionnelsContent from './components/AdminProfessionnelsContent';

export default function AdminProfessionnelsPage() {
  return (
    <AppLayout role="admin" activeRoute="/admin-professionnels">
      <AdminProfessionnelsContent />
    </AppLayout>
  );
}
