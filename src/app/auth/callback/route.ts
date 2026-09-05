import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

function getRoleRedirect(role: string | null | undefined): string {
  switch (role) {
    case 'platform_admin': return '/platform-admin';
    case 'org_admin': return '/administration-tablissement';
    case 'professional': return '/workspace-professionnel';
    case 'ambassador': return '/ambassador-workspace';
    case 'ministry': return '/espace-ministere';
    case 'public_health': return '/espace-sante-publique';
    case 'insurance': return '/espace-assurance';
    case 'university': return '/espace-universite';
    case 'ngo': return '/espace-ong';
    case 'researcher': return '/research-workspace';
    case 'developer': return '/api-developer-dashboard';
    case 'vendor': return '/marketplace-vendor';
    case 'patient':
    default:
      return '/patient-home';
  }
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '';
  const redirectTo = searchParams.get('redirectTo') ?? '';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Use metadata role first (always reliable), fallback to DB
        const metaRole = user.user_metadata?.role || user.app_metadata?.role;
        let roleBasedPath = '/patient-home';

        if (metaRole) {
          roleBasedPath = getRoleRedirect(metaRole);
        } else {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();
          roleBasedPath = getRoleRedirect(profile?.role);
        }

        // Respect original destination if provided
        const finalPath = (redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('/sign-up-login-screen'))
          ? redirectTo
          : (next && next.startsWith('/') ? next : roleBasedPath);

        return NextResponse.redirect(`${origin}${finalPath}`);
      }

      return NextResponse.redirect(`${origin}/patient-home`);
    }
  }

  // Auth code error — redirect to login with error param
  return NextResponse.redirect(`${origin}/sign-up-login-screen?error=auth_callback_error`);
}
