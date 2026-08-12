import React from 'react';
import AdminHeader from './AdminHeader';
import AdminKPIs from './AdminKPIs';
import UserManagement from './UserManagement';
import ModuleGrid from './ModuleGrid';
import AuditLog from './AuditLog';
import ProfessionalManagement from './ProfessionalManagement';

export default function AdminContent() {
  return (
    <div className="px-6 lg:px-8 xl:px-10 2xl:px-12 py-6 max-w-screen-2xl mx-auto">
      <AdminHeader />
      <AdminKPIs />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <div className="xl:col-span-2 flex flex-col gap-6">
          <ProfessionalManagement />
          <UserManagement />
          <ModuleGrid />
        </div>
        <div>
          <AuditLog />
        </div>
      </div>
    </div>
  );
}