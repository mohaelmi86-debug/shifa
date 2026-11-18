'use client';
import React from 'react';
import AppLayout from '@/components/AppLayout';
import SettingsContent from './components/SettingsContent';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
  const { role } = useAuth();
  const appRole = (role as any) || 'patient';
  return (
    <AppLayout role={appRole} activeRoute="/settings">
      <SettingsContent />
    </AppLayout>
  );
}
