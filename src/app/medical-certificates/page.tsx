'use client';
import AppLayout from '@/components/AppLayout';
import MedicalCertificatesContent from './components/MedicalCertificatesContent';

export default function MedicalCertificatesPage() {
  return (
    <AppLayout role="professional" activeRoute="/medical-certificates">
      <MedicalCertificatesContent />
    </AppLayout>
  );
}
