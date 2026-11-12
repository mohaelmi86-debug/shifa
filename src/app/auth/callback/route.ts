import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const requestedNext = searchParams.get('next') ?? '/patient-home';
  // Accept only same-origin relative paths, never protocol-relative or absolute URLs.
  const next =
    requestedNext.startsWith('/') &&
    !requestedNext.startsWith('//') &&
    !requestedNext.includes('\\')
      ? requestedNext
      : '/patient-home';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Fetch user profile to redirect to the correct dashboard
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        const role = profile?.role;
        let redirectPath = next;

        if (role === 'org_admin' || role === 'platform_admin') {
          redirectPath = '/administration-tablissement';
        } else if (role === 'professional') {
          redirectPath = '/workspace-professionnel';
        } else if (role === 'patient') {
          redirectPath = '/patient-home';
        }

        return NextResponse.redirect(`${origin}${redirectPath}`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth code error — redirect to login with error param
  return NextResponse.redirect(`${origin}/sign-up-login-screen?error=auth_callback_error`);
}
