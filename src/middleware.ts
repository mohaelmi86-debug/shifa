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

// Routes that require authentication
const PROTECTED_PREFIXES = [
  '/patient-home',
  '/patient-explorer',
  '/appointment-booking',
  '/dossier-de-sant',
  '/patient-messages',
  '/shifa-card',
  '/patient-settings',
  '/workspace-professionnel',
  '/consultation-workspace',
  '/pro-patients',
  '/pro-agenda',
  '/pro-prescriptions',
  '/pro-resultats',
  '/pro-messages',
  '/pro-parametres',
  '/administration-tablissement',
  '/admin-modules',
  '/admin-roles',
  '/admin-audit',
  '/admin-professionnels',
  '/admin-utilisateurs',
  '/admin-activite',
  '/admin-parametres',
  '/org-onboarding',
  '/espace-ministere',
  '/espace-assurance',
  '/espace-universite',
  '/espace-ong',
  '/espace-sante-publique',
];

// Public routes (no auth required)
const PUBLIC_PATHS = ['/', '/sign-up-login-screen', '/auth/callback'];

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

  // Check if the route requires authentication
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isProtected) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/sign-up-login-screen';
      url.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
