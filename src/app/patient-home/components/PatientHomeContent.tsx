import React from 'react';
import PatientHeader from './PatientHeader';
import QuickActions from './QuickActions';
import UpcomingAppointments from './UpcomingAppointments';
import HealthSummary from './HealthSummary';
import NearbyProfessionals from './NearbyProfessionals';
import RecentDocuments from './RecentDocuments';

export default function PatientHomeContent() {
  return (
    <div className="px-6 lg:px-8 xl:px-10 2xl:px-12 py-6 max-w-screen-2xl mx-auto">
      <PatientHeader />
      <QuickActions />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <div className="xl:col-span-2 flex flex-col gap-6">
          <UpcomingAppointments />
          <NearbyProfessionals />
        </div>
        <div className="flex flex-col gap-6">
          <HealthSummary />
          <RecentDocuments />
        </div>
      </div>
    </div>
  );
}