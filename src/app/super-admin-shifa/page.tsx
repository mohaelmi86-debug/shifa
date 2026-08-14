'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import SuperAdminShifaContent from './components/SuperAdminShifaContent';
import { useAuth } from '@/contexts/AuthContext';

export default function SuperAdminShifaPage() {
  const { role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role !== 'platform_admin') {
      router?.replace('/sign-up-login-screen');
    }
  }, [role, loading, router]);

  if (loading || role !== 'platform_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: 'var(--shifa-blue)', borderTopColor: 'transparent' }} />
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Vérification des accès...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <SuperAdminShifaContent />
    </AppLayout>
  );
}
