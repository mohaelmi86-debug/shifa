'use client';
import AppLayout from '@/components/AppLayout';
import OrgAnalyticsContent from './components/OrgAnalyticsContent';

export default function OrgAnalyticsPage() {
  return (
    <AppLayout role="admin" activeRoute="/org-analytics">
      <OrgAnalyticsContent />
    </AppLayout>
  );
}
