'use client';
import AppLayout from '@/components/AppLayout';
import ResearchDatasetsContent from './components/ResearchDatasetsContent';

export default function ResearchDatasetsPage() {
  return (
    <AppLayout role="institution" activeRoute="/research-datasets">
      <ResearchDatasetsContent />
    </AppLayout>
  );
}
