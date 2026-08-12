import React from 'react';
import AppLayout from '@/components/AppLayout';
import OrgOnboardingContent from './components/OrgOnboardingContent';

export default function OrgOnboardingPage() {
  return (
    <AppLayout role="admin" activeRoute="/org-onboarding">
      <OrgOnboardingContent />
    </AppLayout>
  );
}
