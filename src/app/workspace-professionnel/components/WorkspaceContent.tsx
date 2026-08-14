import React from 'react';
import WorkspaceHeader from './WorkspaceHeader';
import WorkspaceKPIs from './WorkspaceKPIs';
import TodaySchedule from './TodaySchedule';
import PatientQueue from './PatientQueue';
import ConsultationWorkspace from './ConsultationWorkspace';

export default function WorkspaceContent() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className="px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-6 max-w-screen-2xl mx-auto">
        {/* Premium page header strip */}
        <div
          className="rounded-2xl px-5 py-4 mb-6 flex items-center gap-3"
          style={{
            background: 'linear-gradient(90deg, rgba(21,101,216,0.06) 0%, rgba(14,165,233,0.03) 100%)',
            border: '1px solid rgba(21,101,216,0.1)',
          }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--shifa-blue)', letterSpacing: '0.08em' }}>
              Espace Professionnel
            </p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Tableau de bord clinique · Données en temps réel
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium" style={{ color: '#059669' }}>Connecté</span>
          </div>
        </div>

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
    </div>
  );
}