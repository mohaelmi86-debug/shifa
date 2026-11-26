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

const ROUTE_ACCESS = [
  { prefix: '/patient-home', roles: ['patient'] },
  { prefix: '/patient-explorer', roles: ['patient'] },
  { prefix: '/appointment-booking', roles: ['patient'] },
  { prefix: '/dossier-de-sant', roles: ['patient'] },
  { prefix: '/patient-messages', roles: ['patient'] },
  { prefix: '/shifa-card', roles: ['patient'] },
  { prefix: '/patient-settings', roles: ['patient'] },
  { prefix: '/workspace-professionnel', roles: ['professional'], verifiedProfessional: true },
  { prefix: '/consultation-workspace', roles: ['professional'], verifiedProfessional: true },
  { prefix: '/pro-patients', roles: ['professional'], verifiedProfessional: true },
  { prefix: '/pro-agenda', roles: ['professional'], verifiedProfessional: true },
  { prefix: '/pro-prescriptions', roles: ['professional'], verifiedProfessional: true },
  { prefix: '/pro-resultats', roles: ['professional'], verifiedProfessional: true },
  { prefix: '/pro-messages', roles: ['professional'], verifiedProfessional: true },
  { prefix: '/pro-parametres', roles: ['professional'], verifiedProfessional: true },
  { prefix: '/administration-tablissement', roles: ['org_admin'], verifiedOrganization: true },
  { prefix: '/admin-modules', roles: ['org_admin'] },
  { prefix: '/admin-roles', roles: ['org_admin'] },
  { prefix: '/admin-audit', roles: ['org_admin'] },
  { prefix: '/admin-professionnels', roles: ['org_admin'] },
  { prefix: '/admin-utilisateurs', roles: ['org_admin'] },
  { prefix: '/admin-activite', roles: ['org_admin'] },
  { prefix: '/admin-parametres', roles: ['org_admin'] },
  { prefix: '/admin-inscriptions', roles: ['platform_admin'] },
  { prefix: '/org-onboarding', roles: ['org_admin'], verifiedOrganization: true },
  { prefix: '/espace-ministere', roles: ['ministry'] },
  { prefix: '/espace-assurance', roles: ['insurance'] },
  { prefix: '/espace-universite', roles: ['university'] },
  { prefix: '/espace-ong', roles: ['ngo'] },
  { prefix: '/espace-sante-publique', roles: ['public_health', 'ministry'] },
] as const;

function redirectTo(request: NextRequest, path: string) {
  const url = request.nextUrl.clone();
  url.pathname = path;
  url.search = '';
  return NextResponse.redirect(url);
}

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
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;
  const route = ROUTE_ACCESS.find(({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (!route) return supabaseResponse;

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/sign-up-login-screen';
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role,is_active,organization_id')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError || !profile || profile.is_active !== true) {
    return redirectTo(request, '/access-denied');
  }

  const role = String(profile.role || '');
  const isPlatformAdmin = role === 'platform_admin';
  const roleAllowed = isPlatformAdmin || (route.roles as readonly string[]).includes(role);
  if (!roleAllowed) return redirectTo(request, '/access-denied');

  if (!isPlatformAdmin && 'verifiedProfessional' in route && route.verifiedProfessional) {
    const { data: professional, error } = await supabase
      .from('professionals')
      .select('status,is_verified')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error || !professional || professional.status !== 'active' || professional.is_verified !== true) {
      return redirectTo(request, '/registration-pending');
    }
  }

  if (!isPlatformAdmin && 'verifiedOrganization' in route && route.verifiedOrganization) {
    if (!profile.organization_id) return redirectTo(request, '/registration-pending');

    const { data: organization, error } = await supabase
      .from('organizations')
      .select('is_active,is_verified')
      .eq('id', profile.organization_id)
      .maybeSingle();

    if (error || !organization || organization.is_active !== true || organization.is_verified !== true) {
      return redirectTo(request, '/registration-pending');
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
