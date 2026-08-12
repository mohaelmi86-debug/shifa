'use client';
import AppLayout from '@/components/AppLayout';
import QualityAccreditationContent from './components/QualityAccreditationContent';

export default function QualityAccreditationPage() {
  return (
    <AppLayout role="admin" activeRoute="/quality-accreditation">
      <QualityAccreditationContent />
    </AppLayout>
  );
}
