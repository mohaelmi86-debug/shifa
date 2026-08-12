import EpidemioSurveillanceContent from './components/EpidemioSurveillanceContent';
import AppLayout from '@/components/AppLayout';

export default function EpidemioSurveillancePage() {
  return (
    <AppLayout role="institution" activeRoute="/epidemio-surveillance">
      <EpidemioSurveillanceContent />
    </AppLayout>
  );
}
