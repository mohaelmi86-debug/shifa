import AppLayout from '@/components/AppLayout';
import AppointmentBookingContent from './components/AppointmentBookingContent';

export default function AppointmentBookingPage() {
  return (
    <AppLayout role="patient" activeRoute="/appointment-booking">
      <AppointmentBookingContent />
    </AppLayout>
  );
}
