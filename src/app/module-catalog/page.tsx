'use client';
import AppLayout from '@/components/AppLayout';
import ModuleCatalogContent from './components/ModuleCatalogContent';

export default function ModuleCatalogPage() {
  return (
    <AppLayout role="admin" activeRoute="/module-catalog">
      <ModuleCatalogContent />
    </AppLayout>
  );
}
