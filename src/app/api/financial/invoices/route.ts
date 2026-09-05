import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const PATIENT_ROLES = ['patient'];
const ORG_ROLES = ['admin', 'org_admin', 'professional'];
const PLATFORM_ROLES = ['platform_admin'];
const VENDOR_ROLES = ['vendor'];
const AMBASSADOR_ROLES = ['ambassador'];
const ALL_ALLOWED = [...PATIENT_ROLES, ...ORG_ROLES, ...PLATFORM_ROLES, ...VENDOR_ROLES, ...AMBASSADOR_ROLES];

async function getAuthContext() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { user: null, role: null, orgId: null, supabase };

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, organization_id')
    .eq('id', user.id)
    .maybeSingle();

  return { user, role: profile?.role ?? null, orgId: profile?.organization_id ?? null, supabase };
}

export async function GET(req: NextRequest) {
  const { user, role, orgId, supabase } = await getAuthContext();

  if (!user || !role) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!ALL_ALLOWED.includes(role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '20'), 100);

  let query = supabase.from('invoices').select('*').order('created_at', { ascending: false }).limit(limit);

  if (PLATFORM_ROLES.includes(role)) {
    // platform_admin sees all
  } else if (ORG_ROLES.includes(role) && orgId) {
    query = query.eq('organization_id', orgId);
  } else {
    query = query.eq('user_id', user.id);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}
