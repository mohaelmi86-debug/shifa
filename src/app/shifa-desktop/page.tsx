'use client';
import React from 'react';
import AppLayout from '@/components/AppLayout';
import ShifaDesktopContent from './components/ShifaDesktopContent';

export default function ShifaDesktopPage() {
  return (
    <AppLayout role="professional" activeRoute="/shifa-desktop">
      <ShifaDesktopContent />
    </AppLayout>
  );
}
