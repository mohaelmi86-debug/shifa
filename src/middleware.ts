import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PATIENT_ROUTES = [
  '/patient-home', '/patient-explorer', '/appointment-booking',
  '/dossier-de-sant', '/patient-messages', '/shifa-card', '/patient-settings',
];
const PROFESSIONAL_ROUTES = [
  '/workspace-professionnel', '/professional-verification', '/consultation-workspace', '/pro-patients',
  '/pro-agenda', '/pro-prescriptions', '/pro-resultats', '/pro-messages', '/pro-parametres',
];
const ADMIN_ROUTES = [
  '/administration-tablissement', '/admin-modules', '/admin-roles', '/admin-audit',
  '/admin-professionnels', '/admin-utilisateurs', '/admin-activite', '/admin-parametres',
];
const ORGANIZATION_ROUTES = ['/org-onboarding'];
const PLATFORM_ADMIN_ROUTES = ['/platform-admin', '/registration-review'];
const NOTIFICATION_ROUTES = ['/notifications-center'];
const PARTNER_ROLE_ROUTES: Array<{ path: string; roles: string[] }> = [
  { path: '/espace-ministere', roles: ['ministry', 'platform_admin'] },
  { path: '/espace-assurance', roles: ['insurance', 'platform_admin'] },
  { path: '/espace-universite', roles: ['university', 'platform_admin'] },
  { path: '/espace-ong', roles: ['ngo', 'platform_admin'] },
  { path: '/espace-sante-publique', roles: ['public_health', 'platform_admin'] },
  { path: '/shifa-ai-institution', roles: ['ministry', 'insurance'] },
];

function matchesPath(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}/`);
}

function requiredRoles(pathname: string): string[] | null {
  if (PLATFORM_ADMIN_ROUTES.some((route) => matchesPath(pathname, route))) return ['platform_admin'];
  if (NOTIFICATION_ROUTES.some((route) => matchesPath(pathname, route))) return ['professional', 'org_admin', 'platform_admin'];
  if (PATIENT_ROUTES.some((route) => matchesPath(pathname, route))) return ['patient'];
  if (PROFESSIONAL_ROUTES.some((route) => matchesPath(pathname, route))) return ['professional'];
  if (ADMIN_ROUTES.some((route) => matchesPath(pathname, route))) return ['org_admin', 'platform_admin'];
  if (ORGANIZATION_ROUTES.some((route) => matchesPath(pathname, route))) return ['org_admin', 'platform_admin'];
  const partnerRoute = PARTNER_ROLE_ROUTES.find(({ path }) => matchesPath(pathname, path));
  if (partnerRoute) return partnerRoute.roles;
  return null;
}

function injectTokenFromHeader(request: NextRequest): void {
  const token = request.headers.get('x-sb-token');
  if (!token) return;
  const hasCookie = request.cookies.getAll().some((cookie) => cookie.name.includes('auth-token'));
  if (hasCookie) return;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const projectRef = supabaseUrl?.match(/https:\/\/([^.]+)\./)?.[1];
  if (projectRef) request.cookies.set(`sb-${projectRef}-auth-token`, token);
}

export async function middleware(request: NextRequest) {
  // Transitional compatibility: the legacy browser storage fallback still uses this header.
  // This must run before route filtering so authenticated API handlers can read the cookie too.
  // Remove only after a tested migration to first-party Supabase cookies.
  injectTokenFromHeader(request);

  const pathname = request.nextUrl.pathname;
  const roles = requiredRoles(pathname);
  if (!roles) return NextResponse.next();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) {
    console.error('Supabase middleware configuration missing');
    return NextResponse.redirect(new URL('/sign-up-login-screen?error=configuration', request.url));
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/sign-up-login-screen';
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  // Authorization is based on the server-side profile, never client metadata.
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError || !profile || profile.is_active !== true || !roles.includes(profile.role)) {
    const url = request.nextUrl.clone();
    url.pathname = '/unauthorized';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
