'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AuthLayout from './components/AuthLayout';
import LoginForm from './components/LoginForm';
import PatientRegisterForm from './components/PatientRegisterForm';
import ProfessionalRegisterForm from './components/ProfessionalRegisterForm';
import InstitutionRegisterForm from './components/InstitutionRegisterForm';
import EmailVerificationModal from './components/EmailVerificationModal';

type AuthView = 'login' | 'patient' | 'professional' | 'institution';

function SignUpLoginContent() {
  const [view, setView] = useState<AuthView>('login');
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // If middleware redirected an unconfirmed user here, show OTP modal
    const unconfirmed = searchParams.get('unconfirmed');
    const email = searchParams.get('email');
    if (unconfirmed === '1' && email) {
      setUnconfirmedEmail(email);
    }
  }, [searchParams]);

  const handleSwitchToRegister = (role: 'patient' | 'professional' | 'institution') => {
    setView(role);
  };

  const handleSwitchToLogin = () => {
    setView('login');
  };

  const handleUnconfirmedVerified = () => {
    setUnconfirmedEmail(null);
    // Reload to trigger fresh login
    window.location.href = '/sign-up-login-screen';
  };

  return (
    <AuthLayout>
      {unconfirmedEmail && (
        <EmailVerificationModal
          email={unconfirmedEmail}
          onVerified={handleUnconfirmedVerified}
          onCancel={() => setUnconfirmedEmail(null)}
        />
      )}
      {view === 'login' && (
        <LoginForm onSwitchToRegister={handleSwitchToRegister} />
      )}
      {view === 'patient' && (
        <PatientRegisterForm onSwitchToLogin={handleSwitchToLogin} />
      )}
      {view === 'professional' && (
        <ProfessionalRegisterForm onSwitchToLogin={handleSwitchToLogin} />
      )}
      {view === 'institution' && (
        <InstitutionRegisterForm onSwitchToLogin={handleSwitchToLogin} />
      )}
    </AuthLayout>
  );
}

export default function SignUpLoginPage() {
  return (
    <Suspense fallback={null}>
      <SignUpLoginContent />
    </Suspense>
  );
}