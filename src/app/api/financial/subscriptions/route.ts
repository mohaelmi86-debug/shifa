import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const ALLOWED_ROLES = ['patient', 'professional', 'admin', 'org_admin', 'platform_admin', 'vendor', 'ambassador'];
const PLATFORM_ONLY_ROLES = ['platform_admin'];

async function getAuthContext() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { user: null, role: null, supabase };

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, organization_id')
    .eq('id', user.id)
    .maybeSingle();

  return { user, role: profile?.role ?? null, orgId: profile?.organization_id ?? null, supabase };
}

export async function GET(req: NextRequest) {
  const { user, role, supabase } = await getAuthContext();

  if (!user || !role) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!ALLOWED_ROLES.includes(role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '20'), 100);

  let query = supabase.from('subscriptions').select('*').order('created_at', { ascending: false }).limit(limit);

  if (!PLATFORM_ONLY_ROLES.includes(role)) {
    query = query.eq('user_id', user.id);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const { user, role, supabase } = await getAuthContext();

  if (!user || !role) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!ALLOWED_ROLES.includes(role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const payload = { ...body, user_id: user.id };

  const { data, error } = await supabase.from('subscriptions').insert(payload).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data }, { status: 201 });
}
