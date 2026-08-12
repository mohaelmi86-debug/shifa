import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

function getProjectRef(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return url.match(/https:\/\/([^.]+)\./)?.[1] ?? '';
}

function injectTokenFromHeader(request: NextRequest): void {
  const token = request.headers.get('x-sb-token');
  if (!token) return;
  const hasCookie = request.cookies.getAll().some((c) => c.name.includes('auth-token'));
  if (hasCookie) return;
  request.cookies.set(`sb-${getProjectRef()}-auth-token`, token);
}

// ─── Explicit public routes — no auth required ────────────────────────────────
const PUBLIC_PATHS = [
  '/',
  '/sign-up-login-screen',
  '/auth/callback',
  '/pricing',
  '/pricing-plans',
  '/enterprise-contact',
  '/support-center',
  '/local-health-services',
];

// ─── Role-based route guards ──────────────────────────────────────────────────
// Maps route prefix → allowed roles (empty = any authenticated user)
const ROLE_GUARDS: Record<string, string[]> = {
  // Platform admin only
  '/platform-admin': ['platform_admin'],
  '/platform-monitoring': ['platform_admin'],
  '/platform-compliance': ['platform_admin'],
  '/platform-revenue': ['platform_admin'],
  '/admin-roles': ['platform_admin'],
  '/admin-utilisateurs': ['platform_admin'],
  '/admin-professionnels': ['platform_admin'],
  '/admin-activite': ['platform_admin'],
  '/admin-parametres': ['platform_admin'],
  '/admin-translations': ['platform_admin'],
  '/admin-financial-dashboard': ['platform_admin'],
  '/workforce-admin': ['platform_admin'],
  '/ministere-oversight': ['platform_admin', 'ministry'],
  '/epidemio-surveillance': ['platform_admin', 'ministry', 'public_health'],
  '/research-ethics-board': ['platform_admin', 'researcher'],
  '/api-monetization': ['platform_admin'],
  '/api-developer-dashboard': ['platform_admin', 'developer'],
  '/integration-layer': ['platform_admin'],
  '/external-connectors': ['platform_admin'],
  '/interoperability-hub': ['platform_admin', 'org_admin'],
  '/phase2-system-audit': ['platform_admin'],
  '/phase1-completion-audit': ['platform_admin'],
  '/phase2-roadmap': ['platform_admin'],

  // Org admin / institution
  '/administration-tablissement': ['org_admin', 'platform_admin'],
  '/admin-modules': ['org_admin', 'platform_admin'],
  '/admin-audit': ['org_admin', 'platform_admin'],
  '/org-onboarding': ['org_admin', 'platform_admin'],
  '/org-finance-dashboard': ['org_admin', 'platform_admin'],
  '/org-analytics': ['org_admin', 'platform_admin'],
  '/org-reporting': ['org_admin', 'platform_admin'],
  '/org-staff-directory': ['org_admin', 'platform_admin'],
  '/org-quality': ['org_admin', 'platform_admin'],
  '/org-hr-payroll': ['org_admin', 'platform_admin'],
  '/org-hr-planning': ['org_admin', 'platform_admin'],
  '/org-supply-chain': ['org_admin', 'platform_admin'],
  '/org-capacity-planning': ['org_admin', 'platform_admin'],
  '/org-patient-flow': ['org_admin', 'platform_admin'],
  '/org-patient-satisfaction': ['org_admin', 'platform_admin'],
  '/org-infection-control': ['org_admin', 'platform_admin'],
  '/org-sterilization-central': ['org_admin', 'platform_admin'],
  '/org-waste-management': ['org_admin', 'platform_admin'],
  '/org-biomedical-maintenance': ['org_admin', 'platform_admin'],
  '/org-nursing-management': ['org_admin', 'platform_admin'],
  '/org-documents': ['org_admin', 'platform_admin'],
  '/org-pricing': ['org_admin', 'platform_admin'],
  '/hopital-dashboard': ['org_admin', 'platform_admin'],
  '/hopital-configuration': ['org_admin', 'platform_admin'],
  '/hopital-dpi': ['org_admin', 'professional', 'platform_admin'],
  '/hopital-admissions': ['org_admin', 'professional', 'platform_admin'],

  // Professional routes
  '/workspace-professionnel': ['professional', 'org_admin', 'platform_admin'],
  '/workspace': ['professional', 'org_admin', 'platform_admin'],
  '/my-workspace': ['professional', 'org_admin', 'platform_admin'],
  '/consultation-workspace': ['professional', 'platform_admin'],
  '/pro-patients': ['professional', 'platform_admin'],
  '/pro-agenda': ['professional', 'platform_admin'],
  '/pro-prescriptions': ['professional', 'platform_admin'],
  '/pro-resultats': ['professional', 'platform_admin'],
  '/pro-messages': ['professional', 'platform_admin'],
  '/pro-parametres': ['professional', 'platform_admin'],
  '/pro-profile': ['professional', 'platform_admin'],
  '/pro-billing': ['professional', 'platform_admin'],
  '/pro-referrals': ['professional', 'platform_admin'],
  '/pro-referrals-network': ['professional', 'platform_admin'],
  '/pro-care-coordination': ['professional', 'platform_admin'],
  '/pro-care-plans': ['professional', 'platform_admin'],
  '/pro-clinical-protocols': ['professional', 'platform_admin'],
  '/pro-schedule-templates': ['professional', 'platform_admin'],
  '/pro-agenda-availability': ['professional', 'platform_admin'],
  '/pro-teleconsultation': ['professional', 'platform_admin'],
  '/pro-documents': ['professional', 'platform_admin'],
  '/pro-patient-monitoring': ['professional', 'platform_admin'],
  '/pro-verification': ['professional', 'platform_admin'],
  '/pro-pricing': ['professional', 'platform_admin'],
  '/pro-oncology': ['professional', 'platform_admin'],
  '/pro-anesthesia': ['professional', 'platform_admin'],
  '/pro-endoscopy': ['professional', 'platform_admin'],
  '/lab-dashboard': ['professional', 'org_admin', 'platform_admin'],
  '/pharmacy-dashboard': ['professional', 'org_admin', 'platform_admin'],
  '/pharmacy-pos': ['professional', 'org_admin', 'platform_admin'],
  '/imaging-dashboard': ['professional', 'org_admin', 'platform_admin'],
  '/imaging-lms': ['professional', 'org_admin', 'platform_admin'],
  '/laboratory-lms': ['professional', 'org_admin', 'platform_admin'],
  '/billing-dashboard': ['professional', 'org_admin', 'platform_admin'],
  '/emergency-dashboard': ['professional', 'org_admin', 'platform_admin'],
  '/emergency-workspace': ['professional', 'org_admin', 'platform_admin'],
  '/operating-room': ['professional', 'org_admin', 'platform_admin'],
  '/icu-workspace': ['professional', 'org_admin', 'platform_admin'],
  '/blood-bank': ['professional', 'org_admin', 'platform_admin'],
  '/sterilization': ['professional', 'org_admin', 'platform_admin'],
  '/ambulance-transport': ['professional', 'org_admin', 'platform_admin'],
  '/biomedical-maintenance': ['professional', 'org_admin', 'platform_admin'],
  '/biomedical-equipment': ['professional', 'org_admin', 'platform_admin'],
  '/referrals-interface': ['professional', 'org_admin', 'platform_admin'],
  '/teleconsultation-session': ['professional', 'platform_admin'],
  '/teleconsultation-lobby': ['professional', 'platform_admin'],
  '/teleconsultation-waiting': ['professional', 'platform_admin'],
  '/teleconsultation-history': ['professional', 'platform_admin'],
  '/teleconsultation-commercial': ['professional', 'platform_admin'],
  '/cardiology-workspace': ['professional', 'platform_admin'],
  '/nephrology-workspace': ['professional', 'platform_admin'],
  '/neurology-workspace': ['professional', 'platform_admin'],
  '/gynecology-workspace': ['professional', 'platform_admin'],
  '/pediatrics-workspace': ['professional', 'platform_admin'],
  '/maternity-workspace': ['professional', 'platform_admin'],
  '/psychiatry-workspace': ['professional', 'platform_admin'],
  '/endocrinology-workspace': ['professional', 'platform_admin'],
  '/gastroenterology-workspace': ['professional', 'platform_admin'],
  '/orthopedics-workspace': ['professional', 'platform_admin'],
  '/rheumatology-workspace': ['professional', 'platform_admin'],
  '/hematology-workspace': ['professional', 'platform_admin'],
  '/infectiology-workspace': ['professional', 'platform_admin'],
  '/pneumology-workspace': ['professional', 'platform_admin'],
  '/urology-workspace': ['professional', 'platform_admin'],
  '/geriatrics-workspace': ['professional', 'platform_admin'],
  '/palliative-care-workspace': ['professional', 'platform_admin'],
  '/ophthalmology': ['professional', 'platform_admin'],
  '/dermatology': ['professional', 'platform_admin'],
  '/dental-care': ['professional', 'platform_admin'],
  '/physiotherapy': ['professional', 'platform_admin'],
  '/speech-therapy': ['professional', 'platform_admin'],
  '/occupational-therapy': ['professional', 'platform_admin'],
  '/nutrition-dietetics': ['professional', 'platform_admin'],
  '/psychology-mental-health': ['professional', 'platform_admin'],
  '/social-work': ['professional', 'platform_admin'],
  '/palliative-care': ['professional', 'platform_admin'],
  '/medical-certificates': ['professional', 'platform_admin'],
  '/research-workspace': ['professional', 'researcher', 'platform_admin'],
  '/research-datasets': ['professional', 'researcher', 'platform_admin'],
  '/shifa-ai-pro': ['professional', 'platform_admin'],
  '/shifa-ai-org': ['org_admin', 'platform_admin'],
  '/shifa-ai-institution': ['org_admin', 'platform_admin'],
  '/shifa-ai-research': ['professional', 'researcher', 'platform_admin'],
  '/shifa-ai-workspace': ['professional', 'org_admin', 'platform_admin'],
  '/shifa-ai-pharmacy': ['professional', 'platform_admin'],
  '/hr-module': ['org_admin', 'platform_admin'],
  '/inventory-procurement': ['org_admin', 'platform_admin'],
  '/supply-chain': ['org_admin', 'platform_admin'],
  '/accounting-ledger': ['org_admin', 'platform_admin'],
  '/finance-dashboard': ['org_admin', 'platform_admin'],
  '/quality-accreditation': ['org_admin', 'platform_admin'],
  '/hospitalization': ['professional', 'org_admin', 'platform_admin'],
  '/maternity': ['professional', 'org_admin', 'platform_admin'],
  '/pediatrics': ['professional', 'org_admin', 'platform_admin'],
  '/emergency': ['professional', 'org_admin', 'platform_admin'],

  // Patient routes
  '/patient-home': ['patient', 'platform_admin'],
  '/patient-explorer': ['patient', 'platform_admin'],
  '/patient-messages': ['patient', 'platform_admin'],
  '/patient-settings': ['patient', 'platform_admin'],
  '/patient-consultations': ['patient', 'platform_admin'],
  '/patient-documents': ['patient', 'platform_admin'],
  '/patient-results': ['patient', 'platform_admin'],
  '/patient-prescriptions': ['patient', 'platform_admin'],
  '/patient-prescription-receipt': ['patient', 'platform_admin'],
  '/patient-vaccination': ['patient', 'platform_admin'],
  '/patient-prevention': ['patient', 'platform_admin'],
  '/patient-chronic-disease': ['patient', 'platform_admin'],
  '/patient-maternal-child': ['patient', 'platform_admin'],
  '/patient-rehabilitation': ['patient', 'platform_admin'],
  '/patient-follow-up': ['patient', 'platform_admin'],
  '/patient-family': ['patient', 'platform_admin'],
  '/patient-map': ['patient', 'platform_admin'],
  '/patient-emergency': ['patient', 'platform_admin'],
  '/patient-emergency-contacts': ['patient', 'platform_admin'],
  '/patient-notifications': ['patient', 'platform_admin'],
  '/patient-privacy': ['patient', 'platform_admin'],
  '/patient-consent': ['patient', 'platform_admin'],
  '/patient-health-programs': ['patient', 'platform_admin'],
  '/patient-devices-health': ['patient', 'platform_admin'],
  '/patient-connected-devices': ['patient', 'platform_admin'],
  '/patient-shifa-id': ['patient', 'platform_admin'],
  '/patient-subscriptions': ['patient', 'platform_admin'],
  '/patient-payments': ['patient', 'platform_admin'],
  '/patient-teleconsultation': ['patient', 'platform_admin'],
  '/patient-session-teleconsult': ['patient', 'platform_admin'],
  '/patient-precall-vitals': ['patient', 'platform_admin'],
  '/patient-postcall-survey': ['patient', 'platform_admin'],
  '/dossier-de-sant': ['patient', 'professional', 'org_admin', 'platform_admin'],

  // Shared authenticated routes (any role)
  '/appointment-booking': [],
  '/shifa-card': [],
  '/shifa-card-management': [],
  '/notifications-center': [],
  '/community-hub': [],
  '/shifa-share': [],
  '/subscription-management': [],
  '/checkout': [],
  '/wallet-interface': [],
  '/shifa-ai-patient': ['patient', 'platform_admin'],
  '/shifa-academy': [],
  '/academy-dashboard': [],
  '/academy-pricing': [],
  '/module-catalog': [],
  '/patient-transfer': ['professional', 'org_admin', 'platform_admin'],
  '/offline-mode-config': ['org_admin', 'platform_admin'],
  '/org-patient-flow': ['org_admin', 'platform_admin'],
  '/pro-care-coordination': ['professional', 'platform_admin'],

  // Institutional spaces
  '/espace-ministere': ['ministry', 'platform_admin'],
  '/espace-assurance': ['insurance', 'platform_admin'],
  '/espace-universite': ['university', 'org_admin', 'platform_admin'],
  '/espace-ong': ['ngo', 'platform_admin'],
  '/espace-sante-publique': ['public_health', 'ministry', 'platform_admin'],
  '/assurance-workspace': ['insurance', 'platform_admin'],
  '/ambassador-workspace': ['ambassador', 'platform_admin'],
  '/ambassador-commercial': ['ambassador', 'platform_admin'],
  '/insurance-commercial': ['insurance', 'platform_admin'],
  '/marketplace-vendor': ['vendor', 'platform_admin'],
  '/marketplace-buyer': [],
  '/marketplace-commercial': ['platform_admin'],
  '/health-marketplace': [],
  '/government-licensing': [],
  '/pro-parametres': ['professional', 'platform_admin'],
  '/settings': ['platform_admin'],
  '/tax-configuration': ['platform_admin'],
  '/pricing-engine': ['platform_admin'],
  '/ai-pricing': ['platform_admin'],
  '/card-economy': ['platform_admin'],
  '/shifa-display': ['org_admin', 'platform_admin'],
  '/shifa-kiosk': ['org_admin', 'platform_admin'],
  '/shifa-desktop': ['professional', 'org_admin', 'platform_admin'],
};

export async function middleware(request: NextRequest) {
  injectTokenFromHeader(request);

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;

  // Skip API routes and static files
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
    return supabaseResponse;
  }

  // Allow explicit public paths
  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );
  if (isPublic) {
    return supabaseResponse;
  }

  // ─── Session verification ─────────────────────────────────────────────────
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/sign-up-login-screen';
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  // ─── Role & org context lookup ────────────────────────────────────────────
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, organization_id, professional_id')
    .eq('id', user.id)
    .single();

  // Default to 'patient' if no profile found — never block an authenticated user
  const userRole: string = profile?.role ?? 'patient';
  const orgId: string | null = profile?.organization_id ?? null;

  // ─── Role-based access control ────────────────────────────────────────────
  const matchedGuard = Object.entries(ROLE_GUARDS).find(([prefix]) =>
    pathname.startsWith(prefix)
  );

  if (matchedGuard) {
    const [, allowedRoles] = matchedGuard;
    // Empty array = any authenticated user
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      // Redirect to the appropriate home for the user's actual role
      const url = request.nextUrl.clone();
      if (userRole === 'professional') {
        url.pathname = '/workspace-professionnel';
      } else if (userRole === 'org_admin') {
        url.pathname = '/administration-tablissement';
      } else if (userRole === 'platform_admin') {
        url.pathname = '/platform-admin';
      } else {
        url.pathname = '/patient-home';
      }
      url.searchParams.delete('error');
      return NextResponse.redirect(url);
    }
  }

  // ─── Inject org context into request headers ──────────────────────────────
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', user.id);
  requestHeaders.set('x-user-role', userRole);
  if (orgId) {
    requestHeaders.set('x-org-id', orgId);
  }

  supabaseResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Re-apply cookies to the new response
  request.cookies.getAll().forEach(({ name, value }) => {
    supabaseResponse.cookies.set(name, value);
  });

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
