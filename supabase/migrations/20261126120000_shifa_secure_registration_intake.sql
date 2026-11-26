-- SHIFA: secure signup intake and patient demographic capture.
-- Signup metadata is untrusted and can only create a review request; it never grants a role.

create table if not exists public.registration_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  request_type text not null check (request_type in ('professional', 'institution')),
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'under_review', 'approved', 'rejected', 'cancelled')),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  decision_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint registration_requests_user_type_unique unique (user_id, request_type)
);

create index if not exists registration_requests_status_created_idx
  on public.registration_requests (status, created_at desc);

alter table public.registration_requests enable row level security;
revoke all on table public.registration_requests from public, anon;
revoke insert, delete on table public.registration_requests from authenticated;
grant select, update on table public.registration_requests to authenticated;

drop policy if exists registration_requests_read_own_or_platform on public.registration_requests;
create policy registration_requests_read_own_or_platform
  on public.registration_requests
  for select
  to authenticated
  using (user_id = (select auth.uid()) or private.is_platform_admin());

drop policy if exists registration_requests_platform_update on public.registration_requests;
create policy registration_requests_platform_update
  on public.registration_requests
  for update
  to authenticated
  using (private.is_platform_admin())
  with check (private.is_platform_admin());

create or replace function public.capture_signup_extras()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $function$
declare
  v_type text;
  v_payload jsonb;
  v_birth_date date;
  v_gender public.gender_type;
  v_gender_value text;
begin
  -- Never promote a role based on user-editable auth metadata.
  v_type := nullif(trim(new.raw_user_meta_data->>'registration_type'), '');

  if v_type = 'professional' then
    v_payload := jsonb_build_object(
      'first_name', left(coalesce(new.raw_user_meta_data->'registration_payload'->>'firstName', ''), 100),
      'last_name', left(coalesce(new.raw_user_meta_data->'registration_payload'->>'lastName', ''), 100),
      'profession', left(coalesce(new.raw_user_meta_data->'registration_payload'->>'profession', ''), 100),
      'specialty', left(coalesce(new.raw_user_meta_data->'registration_payload'->>'specialty', ''), 150),
      'license_number', left(coalesce(new.raw_user_meta_data->'registration_payload'->>'licenseNumber', ''), 100),
      'professional_type', left(coalesce(new.raw_user_meta_data->'registration_payload'->>'professionalType', ''), 30),
      'country', left(coalesce(new.raw_user_meta_data->'registration_payload'->>'country', ''), 2),
      'phone', left(coalesce(new.raw_user_meta_data->'registration_payload'->>'phone', ''), 30),
      'email', new.email
    );

    insert into public.registration_requests (user_id, request_type, payload)
    values (new.id, 'professional', v_payload)
    on conflict (user_id, request_type) do nothing;

  elsif v_type = 'institution' then
    v_payload := jsonb_build_object(
      'organization_name', left(coalesce(new.raw_user_meta_data->'registration_payload'->>'orgName', ''), 180),
      'organization_type', left(coalesce(new.raw_user_meta_data->'registration_payload'->>'orgType', ''), 60),
      'country', left(coalesce(new.raw_user_meta_data->'registration_payload'->>'country', ''), 2),
      'city', left(coalesce(new.raw_user_meta_data->'registration_payload'->>'city', ''), 100),
      'address', left(coalesce(new.raw_user_meta_data->'registration_payload'->>'address', ''), 250),
      'phone', left(coalesce(new.raw_user_meta_data->'registration_payload'->>'phone', ''), 30),
      'organization_email', left(coalesce(new.raw_user_meta_data->'registration_payload'->>'email', ''), 254),
      'registration_number', left(coalesce(new.raw_user_meta_data->'registration_payload'->>'registrationNumber', ''), 100),
      'admin_first_name', left(coalesce(new.raw_user_meta_data->'registration_payload'->>'adminFirstName', ''), 100),
      'admin_last_name', left(coalesce(new.raw_user_meta_data->'registration_payload'->>'adminLastName', ''), 100),
      'admin_email', new.email
    );

    insert into public.registration_requests (user_id, request_type, payload)
    values (new.id, 'institution', v_payload)
    on conflict (user_id, request_type) do nothing;

  else
    -- handle_new_user() is installed on the same auth.users event and creates the patient first.
    if coalesce(new.raw_user_meta_data->>'date_of_birth', '') ~ '^\d{4}-\d{2}-\d{2}$' then
      begin
        v_birth_date := (new.raw_user_meta_data->>'date_of_birth')::date;
      exception when others then
        v_birth_date := null;
      end;
    end if;

    v_gender_value := new.raw_user_meta_data->>'gender';
    v_gender := case v_gender_value
      when 'F' then 'female'::public.gender_type
      when 'M' then 'male'::public.gender_type
      when 'O' then 'other'::public.gender_type
      else null
    end;

    update public.patients
       set date_of_birth = coalesce(v_birth_date, date_of_birth),
           gender = coalesce(v_gender, gender),
           updated_at = now()
     where user_id = new.id;
  end if;

  return new;
end;
$function$;

revoke all on function public.capture_signup_extras() from public, anon, authenticated;

drop trigger if exists zz_capture_signup_extras on auth.users;
create trigger zz_capture_signup_extras
  after insert on auth.users
  for each row execute function public.capture_signup_extras();
