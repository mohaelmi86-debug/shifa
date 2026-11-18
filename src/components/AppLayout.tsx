import React from 'react';
import Sidebar from './Sidebar';
import SHIFAFooter, { type FooterContext } from './SHIFAFooter';
import MobileBottomNav from '@/components/MobileBottomNav';

type AppRole = 'patient' | 'professional' | 'admin' | 'org_admin' | 'institution' | 'ambassador' | 'platform_admin' | 'ministry' | 'public_health' | 'insurance' | 'university' | 'ngo' | 'researcher' | 'developer' | 'vendor';

interface AppLayoutProps {
  children: React.ReactNode;
  role?: AppRole;
  activeRoute?: string;
}

function roleToFooterContext(role: AppRole | undefined): FooterContext {
  switch (role) {
    case 'patient': return 'patient';
    case 'professional': return 'professional';
    case 'admin': case 'org_admin': return 'organization';
    case 'institution': case 'ministry': case 'public_health': case 'insurance': case 'university': case 'ngo': case 'researcher': case 'developer': case 'vendor': return 'institution';
    case 'ambassador': return 'ambassador';
    case 'platform_admin': return 'admin';
    default: return 'patient';
  }
}

// Roles that show the mobile bottom nav
const mobileNavRoles: AppRole[] = ['patient', 'professional'];

export default function AppLayout({ children, role = 'patient', activeRoute = '' }: AppLayoutProps) {
  const footerContext = roleToFooterContext(role);
  const showMobileNav = mobileNavRoles.includes(role);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--background)' }}
    >
      {/* Sidebar */}
      <Sidebar role={role} activeRoute={activeRoute} />

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto scrollbar-thin flex flex-col min-w-0">
        {/* Mobile top spacer for hamburger button */}
        <div className="lg:hidden h-14 shrink-0" aria-hidden="true" />

        {/* Page content */}
        <div className={`flex-1 ${showMobileNav ? 'pb-mobile-nav' : 'pb-0'} lg:pb-0`}>
          {children}
        </div>

        {/* Footer */}
        <SHIFAFooter context={footerContext} />
      </main>

      {/* Mobile bottom navigation */}
      {showMobileNav && <MobileBottomNav />}
    </div>
  );
}