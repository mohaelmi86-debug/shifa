import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PATIENT_ROUTES = [
  '/patient-home', '/patient-explorer', '/appointment-booking',
  '/dossier-de-sant', '/patient-messages', '/shifa-card', '/patient-settings',
];
const PROFESSIONAL_ROUTES = [
  '/workspace-professionnel', '/consultation-workspace', '/pro-patients',
  '/pro-agenda', '/pro-prescriptions', '/pro-resultats', '/pro-messages', '/pro-parametres',
];
const ADMIN_ROUTES = [
  '/administration-tablissement', '/admin-modules', '/admin-roles', '/admin-audit',
  '/admin-professionnels', '/admin-utilisateurs', '/admin-activite', '/admin-parametres',
];
const ORG_ROUTES = ['/org-onboarding'];
const PARTNER_ROUTES = [
  '/espace-ministere', '/espace-assurance', '/espace-universite',
  '/espace-ong', '/espace-sante-publique',
];

function matchesPath(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

function requiredRoles(pathname: string): string[] | null {
  if (PATIENT_ROUTES.some((route) => matchesPath(pathname, route))) return ['patient'];
  if (PROFESSIONAL_ROUTES.some((route) => matchesPath(pathname, route))) return ['professional'];
  if (ADMIN_ROUTES.some((route) => matchesPath(pathname, route))) return ['org_admin', 'platform_admin'];
  if (ORG_ROUTES.some((route) => matchesPath(pathname, route))) return ['org_admin', 'platform_admin'];
  if (PARTNER_ROUTES.some((route) => matchesPath(pathname, route))) {
    return ['ministry', 'insurer', 'university', 'ngo', 'public_health', 'platform_admin'];
  }
  return null;
}

export async function middleware(request: NextRequest) {
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
      setAll(cookiesToSet) {
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

  // Fail closed: do not trust client metadata for authorization.
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError || !profile?.role || !roles.includes(profile.role)) {
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
