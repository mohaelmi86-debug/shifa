import React from 'react';
import WorkspaceHeader from './WorkspaceHeader';
import WorkspaceKPIs from './WorkspaceKPIs';
import TodaySchedule from './TodaySchedule';
import PatientQueue from './PatientQueue';
import ConsultationWorkspace from './ConsultationWorkspace';

export default function WorkspaceContent() {
  return (
    <div className="px-6 lg:px-8 xl:px-10 2xl:px-12 py-6 max-w-screen-2xl mx-auto">
      <WorkspaceHeader />
      <WorkspaceKPIs />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <div className="xl:col-span-1">
          <TodaySchedule />
        </div>
        <div className="xl:col-span-2 flex flex-col gap-6">
          <PatientQueue />
          <ConsultationWorkspace />
        </div>
      </div>
    </div>
  );
}