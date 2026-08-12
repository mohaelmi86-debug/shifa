'use client';
import AppLayout from '@/components/AppLayout';
import PatientConnectedDevicesContent from './components/PatientConnectedDevicesContent';

export default function PatientConnectedDevicesPage() {
  return (
    <AppLayout role="patient" activeRoute="/patient-connected-devices">
      <PatientConnectedDevicesContent />
    </AppLayout>
  );
}
