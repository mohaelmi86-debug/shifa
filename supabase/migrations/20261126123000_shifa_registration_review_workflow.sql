-- SHIFA: controlled approval of professional and institution registration requests.
create or replace function public.review_registration_request(
  p_request_id uuid,
  p_decision text,
  p_decision_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $function$
declare
  v_request public.registration_requests%rowtype;
  v_payload jsonb;
  v_user_id uuid;
  v_org_id uuid;
  v_org_type public.org_type;
  v_professional_type text;
begin
  if not private.is_platform_admin() then
    raise exception 'Only a platform administrator may review registration requests'
      using errcode = '42501';
  end if;

  if p_decision not in ('approved', 'rejected', 'under_review') then
    raise exception 'Unsupported registration decision';
  end if;

  select * into v_request
    from public.registration_requests
   where id = p_request_id
   for update;

  if not found then
    raise exception 'Registration request not found';
  end if;

  if v_request.status not in ('pending', 'under_review') then
    raise exception 'This registration request has already been closed';
  end if;

  v_user_id := v_request.user_id;
  v_payload := v_request.payload;

  if p_decision = 'under_review' then
    update public.registration_requests
       set status = 'under_review',
           reviewed_by = auth.uid(),
           updated_at = now(),
           decision_note = nullif(left(coalesce(p_decision_note, ''), 2000), '')
     where id = p_request_id;
    return jsonb_build_object('request_id', p_request_id, 'status', 'under_review');

  elsif p_decision = 'rejected' then
    update public.registration_requests
       set status = 'rejected',
           reviewed_by = auth.uid(),
           reviewed_at = now(),
           updated_at = now(),
           decision_note = nullif(left(coalesce(p_decision_note, ''), 2000), '')
     where id = p_request_id;
    return jsonb_build_object('request_id', p_request_id, 'status', 'rejected');
  end if;

  if v_request.request_type = 'professional' then
    v_professional_type := coalesce(v_payload->>'professional_type', 'liberal');
    if v_professional_type = 'salarie' then
      raise exception 'A salaried professional must first be linked to an organization through its invitation workflow';
    end if;

    if coalesce(v_payload->>'first_name', '') = ''
       or coalesce(v_payload->>'last_name', '') = ''
       or coalesce(v_payload->>'profession', '') = ''
       or coalesce(v_payload->>'license_number', '') = '' then
      raise exception 'The professional request is incomplete';
    end if;

    insert into public.professionals (
      user_id, first_name, last_name, profession, specialty, license_number,
      country_code, phone, email, is_verified, status
    ) values (
      v_user_id,
      v_payload->>'first_name',
      v_payload->>'last_name',
      v_payload->>'profession',
      nullif(v_payload->>'specialty', ''),
      v_payload->>'license_number',
      coalesce(nullif(upper(v_payload->>'country'), ''), 'KM'),
      nullif(v_payload->>'phone', ''),
      v_payload->>'email',
      true,
      'active'::public.professional_status
    )
    on conflict (user_id) do update set
      first_name = excluded.first_name,
      last_name = excluded.last_name,
      profession = excluded.profession,
      specialty = excluded.specialty,
      license_number = excluded.license_number,
      country_code = excluded.country_code,
      phone = excluded.phone,
      email = excluded.email,
      is_verified = true,
      status = 'active'::public.professional_status,
      updated_at = now();

    update public.user_profiles
       set role = 'professional'::public.user_role,
           updated_at = now()
     where id = v_user_id
       and is_active is true;

    if not found then
      raise exception 'The applicant profile is missing or inactive';
    end if;

  elsif v_request.request_type = 'institution' then
    v_org_type := case v_payload->>'organization_type'
      when 'hopital' then 'hospital'::public.org_type
      when 'clinique' then 'clinic'::public.org_type
      when 'centre-sante' then 'health_center'::public.org_type
      when 'cabinet' then 'medical_office'::public.org_type
      when 'laboratoire' then 'laboratory'::public.org_type
      when 'pharmacie' then 'pharmacy'::public.org_type
      when 'imagerie' then 'imaging_center'::public.org_type
      when 'universite' then 'university'::public.org_type
      when 'ministere' then 'ministry'::public.org_type
      when 'assurance' then 'insurance'::public.org_type
      when 'ong' then 'ngo'::public.org_type
      else 'other'::public.org_type
    end;

    if coalesce(v_payload->>'organization_name', '') = ''
       or coalesce(v_payload->>'country', '') = ''
       or coalesce(v_payload->>'city', '') = '' then
      raise exception 'The institution request is incomplete';
    end if;

    insert into public.organizations (
      name, org_type, country_code, city, address, phone, email,
      is_verified, is_active, created_by
    ) values (
      v_payload->>'organization_name',
      v_org_type,
      upper(v_payload->>'country'),
      v_payload->>'city',
      nullif(v_payload->>'address', ''),
      nullif(v_payload->>'phone', ''),
      nullif(v_payload->>'organization_email', ''),
      true,
      true,
      v_user_id
    )
    returning id into v_org_id;

    update public.user_profiles
       set role = 'org_admin'::public.user_role,
           organization_id = v_org_id,
           country = upper(v_payload->>'country'),
           updated_at = now()
     where id = v_user_id
       and is_active is true;

    if not found then
      raise exception 'The applicant profile is missing or inactive';
    end if;

  else
    raise exception 'Unsupported registration request type';
  end if;

  update public.registration_requests
     set status = 'approved',
         reviewed_by = auth.uid(),
         reviewed_at = now(),
         updated_at = now(),
         decision_note = nullif(left(coalesce(p_decision_note, ''), 2000), '')
   where id = p_request_id;

  return jsonb_build_object(
    'request_id', p_request_id,
    'status', 'approved',
    'request_type', v_request.request_type,
    'organization_id', v_org_id
  );
end;
$function$;

revoke all on function public.review_registration_request(uuid, text, text) from public, anon;
grant execute on function public.review_registration_request(uuid, text, text) to authenticated;
