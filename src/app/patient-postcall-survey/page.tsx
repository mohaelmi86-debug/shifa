'use client';
import AppLayout from '@/components/AppLayout';
import PatientPostcallSurveyContent from './components/PatientPostcallSurveyContent';

export default function PatientPostcallSurveyPage() {
  return (
    <AppLayout role="patient" activeRoute="/patient-postcall-survey">
      <PatientPostcallSurveyContent />
    </AppLayout>
  );
}
