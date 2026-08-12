import MinistereOversightContent from './components/MinistereOversightContent';
import AppLayout from '@/components/AppLayout';

export default function MinistereOversightPage() {
  return (
    <AppLayout role="institution" activeRoute="/ministere-oversight">
      <MinistereOversightContent />
    </AppLayout>
  );
}
