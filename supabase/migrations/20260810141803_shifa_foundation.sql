-- ============================================================
-- SHIFA HEALTH OS — Foundation Schema
-- Multi-tenant, RLS-secured, RBAC
-- ============================================================

-- ============================================================
-- 1. ENUMS
-- ============================================================

DROP TYPE IF EXISTS public.user_role CASCADE;
CREATE TYPE public.user_role AS ENUM ('platform_admin', 'org_admin', 'professional', 'patient', 'guest');

DROP TYPE IF EXISTS public.org_type CASCADE;
CREATE TYPE public.org_type AS ENUM ('hospital', 'clinic', 'health_center', 'laboratory', 'pharmacy', 'imaging_center', 'medical_office', 'university', 'insurance', 'ministry', 'ngo', 'other');

DROP TYPE IF EXISTS public.professional_status CASCADE;
CREATE TYPE public.professional_status AS ENUM ('active', 'pending', 'suspended', 'inactive');

DROP TYPE IF EXISTS public.appointment_status CASCADE;
CREATE TYPE public.appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');

DROP TYPE IF EXISTS public.invitation_status CASCADE;
CREATE TYPE public.invitation_status AS ENUM ('pending', 'accepted', 'rejected', 'expired');

DROP TYPE IF EXISTS public.gender_type CASCADE;
CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');

DROP TYPE IF EXISTS public.record_type CASCADE;
CREATE TYPE public.record_type AS ENUM ('consultation', 'prescription', 'lab_result', 'imaging', 'vaccination', 'hospitalization', 'document', 'note');

-- ============================================================
-- 2. CORE TABLES
-- ============================================================

-- User profiles (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  role public.user_role DEFAULT 'patient'::public.user_role,
  phone TEXT,
  country_code TEXT DEFAULT 'SN',
  preferred_language TEXT DEFAULT 'fr',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Organizations / Facilities
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  org_type public.org_type NOT NULL DEFAULT 'clinic'::public.org_type,
  country_code TEXT DEFAULT 'SN',
  city TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Departments within organizations
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  head_professional_id UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Patients
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  shifa_id TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  gender public.gender_type,
  country_code TEXT DEFAULT 'SN',
  phone TEXT,
  email TEXT,
  address TEXT,
  blood_type TEXT,
  photo_url TEXT,
  emergency_contact JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Professionals
CREATE TABLE IF NOT EXISTS public.professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  profession TEXT NOT NULL,
  specialty TEXT,
  license_number TEXT,
  country_code TEXT DEFAULT 'SN',
  phone TEXT,
  email TEXT,
  bio TEXT,
  photo_url TEXT,
  languages TEXT[] DEFAULT ARRAY['fr']::TEXT[],
  teleconsultation BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  status public.professional_status DEFAULT 'pending'::public.professional_status,
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Professional ↔ Organization relationships
CREATE TABLE IF NOT EXISTS public.professional_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  role_title TEXT,
  status public.professional_status DEFAULT 'pending'::public.professional_status,
  invitation_status public.invitation_status DEFAULT 'pending'::public.invitation_status,
  invited_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  invited_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ,
  permissions JSONB DEFAULT '{}'::jsonb,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Appointments
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  appointment_type TEXT DEFAULT 'consultation',
  status public.appointment_status DEFAULT 'scheduled'::public.appointment_status,
  reason TEXT,
  notes TEXT,
  teleconsultation BOOLEAN DEFAULT false,
  meeting_url TEXT,
  cancelled_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  cancelled_reason TEXT,
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Health Records
CREATE TABLE IF NOT EXISTS public.health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  professional_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  record_type public.record_type NOT NULL,
  title TEXT NOT NULL,
  content JSONB DEFAULT '{}'::jsonb,
  attachments JSONB DEFAULT '[]'::jsonb,
  is_signed BOOLEAN DEFAULT false,
  signed_at TIMESTAMPTZ,
  signed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  is_confidential BOOLEAN DEFAULT false,
  created_by UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Professional availability slots
CREATE TABLE IF NOT EXISTS public.availability_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  slot_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Modules catalog
CREATE TABLE IF NOT EXISTS public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  icon TEXT,
  color TEXT,
  applicable_org_types public.org_type[] DEFAULT ARRAY[]::public.org_type[],
  is_core BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Organization modules (activated modules per org)
CREATE TABLE IF NOT EXISTS public.organization_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  activated_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  activated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  settings JSONB DEFAULT '{}'::jsonb
);

-- Roles within organizations
CREATE TABLE IF NOT EXISTS public.org_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '{}'::jsonb,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Audit log
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_patients_shifa_id ON public.patients(shifa_id);
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON public.patients(user_id);
CREATE INDEX IF NOT EXISTS idx_professionals_user_id ON public.professionals(user_id);
CREATE INDEX IF NOT EXISTS idx_professionals_status ON public.professionals(status);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_professional_id ON public.appointments(professional_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_at ON public.appointments(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_health_records_patient_id ON public.health_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_health_records_type ON public.health_records(record_type);
CREATE INDEX IF NOT EXISTS idx_availability_slots_professional ON public.availability_slots(professional_id, slot_date);
CREATE INDEX IF NOT EXISTS idx_pro_orgs_professional ON public.professional_organizations(professional_id);
CREATE INDEX IF NOT EXISTS idx_pro_orgs_organization ON public.professional_organizations(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org ON public.audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);

-- ============================================================
-- 4. FUNCTIONS
-- ============================================================

-- Auto-create user_profiles on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient')::public.user_role
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- Generate SHIFA ID
CREATE OR REPLACE FUNCTION public.generate_shifa_id(p_gender public.gender_type, p_country TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  gender_code TEXT;
  year_code TEXT;
  random_key TEXT;
BEGIN
  gender_code := CASE p_gender WHEN 'male' THEN '1' WHEN 'female' THEN '2' ELSE '9' END;
  year_code := TO_CHAR(CURRENT_DATE, 'YYYY');
  random_key := UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 4));
  RETURN 'SH-' || gender_code || '-' || UPPER(COALESCE(p_country, 'XX')) || '-' || year_code || '-' || random_key;
END;
$$;

-- Check if user is org admin
CREATE OR REPLACE FUNCTION public.is_org_admin(p_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
  SELECT 1 FROM public.user_profiles up
  WHERE up.id = auth.uid()
  AND (up.role = 'platform_admin' OR up.role = 'org_admin')
)
$$;

-- Check if user is platform admin
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
  SELECT 1 FROM public.user_profiles up
  WHERE up.id = auth.uid()
  AND up.role = 'platform_admin'
)
$$;

-- ============================================================
-- 5. ENABLE RLS
-- ============================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 6. RLS POLICIES
-- ============================================================

-- user_profiles: own record only
DROP POLICY IF EXISTS "users_manage_own_profile" ON public.user_profiles;
CREATE POLICY "users_manage_own_profile" ON public.user_profiles
FOR ALL TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "platform_admin_all_profiles" ON public.user_profiles;
CREATE POLICY "platform_admin_all_profiles" ON public.user_profiles
FOR SELECT TO authenticated
USING (public.is_platform_admin());

-- organizations: public read, admin write
DROP POLICY IF EXISTS "orgs_public_read" ON public.organizations;
CREATE POLICY "orgs_public_read" ON public.organizations
FOR SELECT TO authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "orgs_admin_write" ON public.organizations;
CREATE POLICY "orgs_admin_write" ON public.organizations
FOR ALL TO authenticated
USING (created_by = auth.uid() OR public.is_platform_admin())
WITH CHECK (created_by = auth.uid() OR public.is_platform_admin());

-- departments: org members can read
DROP POLICY IF EXISTS "departments_org_read" ON public.departments;
CREATE POLICY "departments_org_read" ON public.departments
FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS "departments_admin_write" ON public.departments;
CREATE POLICY "departments_admin_write" ON public.departments
FOR ALL TO authenticated
USING (public.is_org_admin(organization_id))
WITH CHECK (public.is_org_admin(organization_id));

-- patients: own record or authorized professional
DROP POLICY IF EXISTS "patients_own_record" ON public.patients;
CREATE POLICY "patients_own_record" ON public.patients
FOR ALL TO authenticated
USING (user_id = auth.uid() OR created_by = auth.uid())
WITH CHECK (user_id = auth.uid() OR created_by = auth.uid());

DROP POLICY IF EXISTS "patients_platform_admin" ON public.patients;
CREATE POLICY "patients_platform_admin" ON public.patients
FOR SELECT TO authenticated
USING (public.is_platform_admin());

-- professionals: public read, own write
DROP POLICY IF EXISTS "professionals_public_read" ON public.professionals;
CREATE POLICY "professionals_public_read" ON public.professionals
FOR SELECT TO authenticated
USING (status = 'active');

DROP POLICY IF EXISTS "professionals_own_write" ON public.professionals;
CREATE POLICY "professionals_own_write" ON public.professionals
FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- professional_organizations: involved parties
DROP POLICY IF EXISTS "pro_orgs_read" ON public.professional_organizations;
CREATE POLICY "pro_orgs_read" ON public.professional_organizations
FOR SELECT TO authenticated
USING (
  invited_by = auth.uid()
  OR EXISTS (SELECT 1 FROM public.professionals p WHERE p.id = professional_id AND p.user_id = auth.uid())
  OR public.is_platform_admin()
);

DROP POLICY IF EXISTS "pro_orgs_admin_write" ON public.professional_organizations;
CREATE POLICY "pro_orgs_admin_write" ON public.professional_organizations
FOR ALL TO authenticated
USING (invited_by = auth.uid() OR public.is_org_admin(organization_id))
WITH CHECK (invited_by = auth.uid() OR public.is_org_admin(organization_id));

-- appointments: patient or professional
DROP POLICY IF EXISTS "appointments_involved_parties" ON public.appointments;
CREATE POLICY "appointments_involved_parties" ON public.appointments
FOR ALL TO authenticated
USING (
  created_by = auth.uid()
  OR EXISTS (SELECT 1 FROM public.patients pt WHERE pt.id = patient_id AND pt.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.professionals pr WHERE pr.id = professional_id AND pr.user_id = auth.uid())
)
WITH CHECK (
  created_by = auth.uid()
  OR EXISTS (SELECT 1 FROM public.patients pt WHERE pt.id = patient_id AND pt.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.professionals pr WHERE pr.id = professional_id AND pr.user_id = auth.uid())
);

-- health_records: patient or authorized professional
DROP POLICY IF EXISTS "health_records_access" ON public.health_records;
CREATE POLICY "health_records_access" ON public.health_records
FOR ALL TO authenticated
USING (
  created_by = auth.uid()
  OR EXISTS (SELECT 1 FROM public.patients pt WHERE pt.id = patient_id AND pt.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.professionals pr WHERE pr.id = professional_id AND pr.user_id = auth.uid())
)
WITH CHECK (created_by = auth.uid());

-- availability_slots: public read for active professionals
DROP POLICY IF EXISTS "slots_public_read" ON public.availability_slots;
CREATE POLICY "slots_public_read" ON public.availability_slots
FOR SELECT TO authenticated
USING (is_available = true);

DROP POLICY IF EXISTS "slots_professional_write" ON public.availability_slots;
CREATE POLICY "slots_professional_write" ON public.availability_slots
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.professionals pr WHERE pr.id = professional_id AND pr.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.professionals pr WHERE pr.id = professional_id AND pr.user_id = auth.uid()));

-- modules: public read
DROP POLICY IF EXISTS "modules_public_read" ON public.modules;
CREATE POLICY "modules_public_read" ON public.modules
FOR SELECT TO authenticated
USING (true);

-- organization_modules: org members read, admin write
DROP POLICY IF EXISTS "org_modules_read" ON public.organization_modules;
CREATE POLICY "org_modules_read" ON public.organization_modules
FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS "org_modules_admin_write" ON public.organization_modules;
CREATE POLICY "org_modules_admin_write" ON public.organization_modules
FOR ALL TO authenticated
USING (public.is_org_admin(organization_id))
WITH CHECK (public.is_org_admin(organization_id));

-- org_roles: org members read, admin write
DROP POLICY IF EXISTS "org_roles_read" ON public.org_roles;
CREATE POLICY "org_roles_read" ON public.org_roles
FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS "org_roles_admin_write" ON public.org_roles;
CREATE POLICY "org_roles_admin_write" ON public.org_roles
FOR ALL TO authenticated
USING (public.is_org_admin(organization_id))
WITH CHECK (public.is_org_admin(organization_id));

-- audit_logs: org admin read only
DROP POLICY IF EXISTS "audit_logs_admin_read" ON public.audit_logs;
CREATE POLICY "audit_logs_admin_read" ON public.audit_logs
FOR SELECT TO authenticated
USING (
  user_id = auth.uid()
  OR public.is_platform_admin()
  OR public.is_org_admin(organization_id)
);

DROP POLICY IF EXISTS "audit_logs_insert" ON public.audit_logs;
CREATE POLICY "audit_logs_insert" ON public.audit_logs
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- ============================================================
-- 7. TRIGGERS
-- ============================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS set_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER set_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_patients_updated_at ON public.patients;
CREATE TRIGGER set_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_professionals_updated_at ON public.professionals;
CREATE TRIGGER set_professionals_updated_at
  BEFORE UPDATE ON public.professionals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_appointments_updated_at ON public.appointments;
CREATE TRIGGER set_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_health_records_updated_at ON public.health_records;
CREATE TRIGGER set_health_records_updated_at
  BEFORE UPDATE ON public.health_records
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 8. SEED DATA — Modules catalog
-- ============================================================

INSERT INTO public.modules (id, code, name, description, category, icon, color, applicable_org_types, is_core) VALUES
  (gen_random_uuid(), 'consultations', 'Consultations', 'Gestion complète des consultations médicales', 'Clinique', 'ClipboardDocumentListIcon', '#0066FF', ARRAY['hospital','clinic','health_center','medical_office']::public.org_type[], true),
  (gen_random_uuid(), 'dossier_patient', 'Dossier Patient', 'Dossier de santé longitudinal unifié', 'Clinique', 'FolderOpenIcon', '#0066FF', ARRAY['hospital','clinic','health_center','medical_office']::public.org_type[], true),
  (gen_random_uuid(), 'prescriptions', 'Prescriptions', 'Ordonnances numériques et suivi des traitements', 'Clinique', 'DocumentTextIcon', '#10B981', ARRAY['hospital','clinic','health_center','medical_office']::public.org_type[], false),
  (gen_random_uuid(), 'lab_results', 'Résultats & Biologie', 'Intégration des résultats de laboratoire', 'Diagnostique', 'BeakerIcon', '#8B5CF6', ARRAY['hospital','clinic','laboratory']::public.org_type[], false),
  (gen_random_uuid(), 'imaging', 'Imagerie', 'Gestion des examens d''imagerie médicale (DICOM)', 'Diagnostique', 'PhotoIcon', '#8B5CF6', ARRAY['hospital','clinic','imaging_center']::public.org_type[], false),
  (gen_random_uuid(), 'urgences', 'Urgences', 'Prise en charge et triage aux urgences', 'Hospitalier', 'ExclamationTriangleIcon', '#EF4444', ARRAY['hospital','clinic','health_center']::public.org_type[], false),
  (gen_random_uuid(), 'hospitalisation', 'Hospitalisation', 'Gestion des admissions et des lits', 'Hospitalier', 'BuildingOffice2Icon', '#F59E0B', ARRAY['hospital','clinic']::public.org_type[], false),
  (gen_random_uuid(), 'bloc_operatoire', 'Bloc Opératoire', 'Planification et suivi des interventions chirurgicales', 'Hospitalier', 'ScissorsIcon', '#F59E0B', ARRAY['hospital','clinic']::public.org_type[], false),
  (gen_random_uuid(), 'messagerie', 'Messagerie Sécurisée', 'Messagerie chiffrée entre professionnels', 'Communication', 'ChatBubbleLeftRightIcon', '#00F2C3', ARRAY['hospital','clinic','health_center','laboratory','pharmacy','medical_office']::public.org_type[], false),
  (gen_random_uuid(), 'teleconsultation', 'Téléconsultation', 'Consultations à distance sécurisées', 'Communication', 'VideoCameraIcon', '#00F2C3', ARRAY['hospital','clinic','health_center','medical_office']::public.org_type[], false),
  (gen_random_uuid(), 'pharmacie', 'Pharmacie', 'Gestion des stocks et dispensation médicamenteuse', 'Pharmacie', 'BeakerIcon', '#10B981', ARRAY['hospital','pharmacy']::public.org_type[], false),
  (gen_random_uuid(), 'maternite', 'Maternité', 'Suivi grossesse, accouchement et néonatologie', 'Spécialité', 'HeartIcon', '#8B5CF6', ARRAY['hospital','clinic','health_center']::public.org_type[], false),
  (gen_random_uuid(), 'pediatrie', 'Pédiatrie', 'Suivi spécialisé pour les patients pédiatriques', 'Spécialité', 'UserIcon', '#10B981', ARRAY['hospital','clinic','health_center']::public.org_type[], false),
  (gen_random_uuid(), 'shifa_ai', 'SHIFA AI', 'Assistance IA pour les professionnels de santé', 'Intelligence', 'SparklesIcon', '#0066FF', ARRAY['hospital','clinic','health_center','laboratory','pharmacy','medical_office']::public.org_type[], false),
  (gen_random_uuid(), 'audit_conformite', 'Audit & Conformité', 'Traçabilité et conformité réglementaire', 'Administration', 'ClipboardDocumentCheckIcon', '#0A1B3D', ARRAY['hospital','clinic','health_center','laboratory','pharmacy','imaging_center','medical_office']::public.org_type[], false)
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- 9. DEMO DATA
-- ============================================================

DO $$
DECLARE
  admin_uuid UUID := gen_random_uuid();
  patient_uuid UUID := gen_random_uuid();
  pro_uuid UUID := gen_random_uuid();
  org_uuid UUID := gen_random_uuid();
  dept_uuid UUID := gen_random_uuid();
  patient_record_uuid UUID := gen_random_uuid();
  pro_record_uuid UUID := gen_random_uuid();
  appt_uuid UUID := gen_random_uuid();
BEGIN
  -- Auth users
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
    is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
    recovery_token, recovery_sent_at, email_change_token_new, email_change,
    email_change_sent_at, email_change_token_current, email_change_confirm_status,
    reauthentication_token, reauthentication_sent_at, phone, phone_change,
    phone_change_token, phone_change_sent_at
  ) VALUES
    (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'admin@chu-saintlouis.shifa.health', crypt('Shifa2026#A', gen_salt('bf', 10)), now(), now(), now(),
     jsonb_build_object('full_name', 'Admin CHU Saint-Louis', 'role', 'org_admin'),
     jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
     false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
    (patient_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'aicha.diallo@shifa.health', crypt('Shifa2026#P', gen_salt('bf', 10)), now(), now(), now(),
     jsonb_build_object('full_name', 'Aïcha Diallo', 'role', 'patient'),
     jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
     false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
    (pro_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'dr.sy@shifa.health', crypt('Shifa2026#D', gen_salt('bf', 10)), now(), now(), now(),
     jsonb_build_object('full_name', 'Dr. Mohamed Sy', 'role', 'professional'),
     jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
     false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null)
  ON CONFLICT (id) DO NOTHING;

  -- Organization
  INSERT INTO public.organizations (id, name, org_type, country_code, city, address, phone, email, is_verified, is_active, created_by)
  VALUES (org_uuid, 'CHU Saint-Louis', 'hospital'::public.org_type, 'SN', 'Saint-Louis', 'Avenue Blaise Diagne, Saint-Louis', '+221 33 961 10 10', 'contact@chu-saintlouis.sn', true, true, admin_uuid)
  ON CONFLICT (id) DO NOTHING;

  -- Department
  INSERT INTO public.departments (id, organization_id, name, description, is_active)
  VALUES (dept_uuid, org_uuid, 'Médecine Générale', 'Service de médecine générale et consultations externes', true)
  ON CONFLICT (id) DO NOTHING;

  -- Patient record
  INSERT INTO public.patients (id, user_id, shifa_id, first_name, last_name, date_of_birth, gender, country_code, phone, email, blood_type, is_active, created_by)
  VALUES (patient_record_uuid, patient_uuid, 'SH-2-SN-2025-7K4D', 'Aïcha', 'Diallo', '1992-03-12', 'female'::public.gender_type, 'SN', '+221 77 123 45 67', 'aicha.diallo@shifa.health', 'O+', true, patient_uuid)
  ON CONFLICT (id) DO NOTHING;

  -- Professional record
  INSERT INTO public.professionals (id, user_id, first_name, last_name, profession, specialty, country_code, phone, email, languages, teleconsultation, is_verified, status, rating, review_count)
  VALUES (pro_record_uuid, pro_uuid, 'Mohamed', 'Sy', 'Médecin généraliste', 'Médecine générale', 'SN', '+221 77 987 65 43', 'dr.sy@shifa.health', ARRAY['Français', 'Wolof']::TEXT[], true, true, 'active'::public.professional_status, 4.8, 124)
  ON CONFLICT (id) DO NOTHING;

  -- Professional ↔ Organization
  INSERT INTO public.professional_organizations (professional_id, organization_id, department_id, role_title, status, invitation_status, invited_by, joined_at, is_primary)
  VALUES (pro_record_uuid, org_uuid, dept_uuid, 'Médecin généraliste', 'active'::public.professional_status, 'accepted'::public.invitation_status, admin_uuid, now(), true)
  ON CONFLICT (id) DO NOTHING;

  -- Appointment
  INSERT INTO public.appointments (id, patient_id, professional_id, organization_id, department_id, scheduled_at, duration_minutes, appointment_type, status, reason, created_by)
  VALUES (appt_uuid, patient_record_uuid, pro_record_uuid, org_uuid, dept_uuid, now() + INTERVAL '2 days', 30, 'consultation', 'scheduled'::public.appointment_status, 'Consultation de suivi', patient_uuid)
  ON CONFLICT (id) DO NOTHING;

  -- Health record
  INSERT INTO public.health_records (patient_id, professional_id, organization_id, appointment_id, record_type, title, content, is_signed, created_by)
  VALUES (patient_record_uuid, pro_record_uuid, org_uuid, appt_uuid, 'consultation'::public.record_type, 'Consultation initiale', jsonb_build_object('motif', 'Bilan de santé annuel', 'diagnostic', 'Bonne santé générale', 'notes', 'Aucune anomalie détectée'), true, pro_uuid)
  ON CONFLICT (id) DO NOTHING;

  -- Availability slots (next 7 days)
  INSERT INTO public.availability_slots (professional_id, organization_id, slot_date, start_time, end_time, is_available)
  VALUES
    (pro_record_uuid, org_uuid, CURRENT_DATE + 1, '09:00', '09:30', true),
    (pro_record_uuid, org_uuid, CURRENT_DATE + 1, '09:30', '10:00', true),
    (pro_record_uuid, org_uuid, CURRENT_DATE + 1, '10:00', '10:30', true),
    (pro_record_uuid, org_uuid, CURRENT_DATE + 1, '14:00', '14:30', true),
    (pro_record_uuid, org_uuid, CURRENT_DATE + 1, '14:30', '15:00', true),
    (pro_record_uuid, org_uuid, CURRENT_DATE + 2, '09:00', '09:30', true),
    (pro_record_uuid, org_uuid, CURRENT_DATE + 2, '10:00', '10:30', true),
    (pro_record_uuid, org_uuid, CURRENT_DATE + 3, '11:00', '11:30', true),
    (pro_record_uuid, org_uuid, CURRENT_DATE + 3, '15:00', '15:30', true)
  ON CONFLICT (id) DO NOTHING;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Demo data insertion failed: %', SQLERRM;
END $$;
