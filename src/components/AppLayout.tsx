import React from 'react';
import Sidebar from './Sidebar';
import SHIFAFooter, { type FooterContext } from './SHIFAFooter';

type AppRole = 'patient' | 'professional' | 'admin' | 'org_admin' | 'institution' | 'ambassador' | 'platform_admin' | 'ministry' | 'public_health' | 'insurance' | 'university' | 'ngo' | 'researcher' | 'developer' | 'vendor';

interface AppLayoutProps {
  children: React.ReactNode;
  role?: AppRole;
  activeRoute?: string;
}

// Map AppLayout role to FooterContext
function roleToFooterContext(role: AppRole | undefined): FooterContext {
  switch (role) {
    case 'patient': return 'patient';
    case 'professional': return 'professional';
    case 'admin': case'org_admin': return 'organization';
    case 'institution': case'ministry': case'public_health': case'insurance': case'university': case'ngo': case'researcher': case'developer': case'vendor': return 'institution';
    case 'ambassador': return 'ambassador';
    case 'platform_admin': return 'admin';
    default: return 'patient';
  }
}

export default function AppLayout({ children, role = 'patient', activeRoute = '' }: AppLayoutProps) {
  const footerContext = roleToFooterContext(role);

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      <Sidebar role={role} activeRoute={activeRoute} />
      <main className="flex-1 overflow-y-auto scrollbar-thin pl-0 lg:pl-0 flex flex-col">
        {/* Mobile top padding to account for hamburger button */}
        <div className="lg:hidden h-14" />
        <div className="flex-1">
          {children}
        </div>
        <SHIFAFooter context={footerContext} />
      </main>
    </div>
  );
}