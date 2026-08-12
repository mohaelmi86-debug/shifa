'use client';
import AppLayout from '@/components/AppLayout';
import BiomedicalEquipmentContent from './components/BiomedicalEquipmentContent';

export default function BiomedicalEquipmentPage() {
  return (
    <AppLayout role="admin" activeRoute="/biomedical-equipment">
      <BiomedicalEquipmentContent />
    </AppLayout>
  );
}
