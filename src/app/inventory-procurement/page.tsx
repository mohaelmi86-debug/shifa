'use client';
import AppLayout from '@/components/AppLayout';
import InventoryProcurementContent from './components/InventoryProcurementContent';

export default function InventoryProcurementPage() {
  return (
    <AppLayout role="admin" activeRoute="/inventory-procurement">
      <InventoryProcurementContent />
    </AppLayout>
  );
}
