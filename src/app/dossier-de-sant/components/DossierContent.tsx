import React from 'react';
import PatientDossierHeader from './PatientDossierHeader';
import DossierTabs from './DossierTabs';

export default function DossierContent() {
  return (
    <div className="px-6 lg:px-8 xl:px-10 2xl:px-12 py-6 max-w-screen-2xl mx-auto">
      <PatientDossierHeader />
      <DossierTabs />
    </div>
  );
}