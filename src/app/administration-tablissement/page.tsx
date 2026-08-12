import React from 'react';
import AppLayout from '@/components/AppLayout';
import AdminContent from './components/AdminContent';

export default function AdministrationEtablissementPage() {
  return (
    <AppLayout role="admin" activeRoute="/administration-tablissement">
      <AdminContent />
    </AppLayout>
  );
}