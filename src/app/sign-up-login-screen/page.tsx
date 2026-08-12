'use client';
import React, { useState } from 'react';
import AuthLayout from './components/AuthLayout';
import LoginForm from './components/LoginForm';
import PatientRegisterForm from './components/PatientRegisterForm';
import ProfessionalRegisterForm from './components/ProfessionalRegisterForm';
import InstitutionRegisterForm from './components/InstitutionRegisterForm';

type AuthView = 'login' | 'patient' | 'professional' | 'institution';

export default function SignUpLoginPage() {
  const [view, setView] = useState<AuthView>('login');

  const handleSwitchToRegister = (role: 'patient' | 'professional' | 'institution') => {
    setView(role);
  };

  const handleSwitchToLogin = () => {
    setView('login');
  };

  return (
    <AuthLayout>
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