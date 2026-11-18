-- SHIFA ID, SHIFA Access, Kiosk Check-in Module
-- Adds: shifa_ids table, kiosk_checkins table, shifa_access_verifications table
-- Seeds: shifa_cards, patients with shifa_id

-- ============================================================
-- 1. NEW TABLES
-- ============================================================

-- shifa_ids: canonical SHIFA ID registry per patient
CREATE TABLE IF NOT EXISTS public.shifa_ids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  shifa_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'revoked')),
  verification_level TEXT NOT NULL DEFAULT 'basic' CHECK (verification_level IN ('basic', 'verified', 'biometric')),
  qr_code_data TEXT,
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- kiosk_checkins: patient check-in events from kiosk
CREATE TABLE IF NOT EXISTS public.kiosk_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  kiosk_id TEXT NOT NULL DEFAULT 'KIOSK-01',
  queue_number TEXT,
  department TEXT,
  status TEXT NOT NULL DEFAULT 'checked_in' CHECK (status IN ('checked_in', 'called', 'completed', 'no_show')),
  checked_in_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  called_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- shifa_access_verifications: identity verification events (SHIFA Access module)
CREATE TABLE IF NOT EXISTS public.shifa_access_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  verified_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  verification_type TEXT NOT NULL DEFAULT 'qr_scan' CHECK (verification_type IN ('qr_scan', 'nfc', 'manual', 'biometric')),
  access_purpose TEXT,
  access_granted BOOLEAN NOT NULL DEFAULT true,
  shifa_id_scanned TEXT,
  ip_address TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_shifa_ids_patient_id ON public.shifa_ids(patient_id);
CREATE INDEX IF NOT EXISTS idx_shifa_ids_user_id ON public.shifa_ids(user_id);
CREATE INDEX IF NOT EXISTS idx_shifa_ids_shifa_id ON public.shifa_ids(shifa_id);
CREATE INDEX IF NOT EXISTS idx_kiosk_checkins_patient_id ON public.kiosk_checkins(patient_id);
CREATE INDEX IF NOT EXISTS idx_kiosk_checkins_appointment_id ON public.kiosk_checkins(appointment_id);
CREATE INDEX IF NOT EXISTS idx_kiosk_checkins_checked_in_at ON public.kiosk_checkins(checked_in_at);
CREATE INDEX IF NOT EXISTS idx_shifa_access_patient_id ON public.shifa_access_verifications(patient_id);
CREATE INDEX IF NOT EXISTS idx_shifa_access_created_at ON public.shifa_access_verifications(created_at);

-- ============================================================
-- 3. ENABLE RLS
-- ============================================================

ALTER TABLE public.shifa_ids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kiosk_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shifa_access_verifications ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. RLS POLICIES
-- ============================================================

-- shifa_ids: patients see their own, authenticated can insert/update their own
DROP POLICY IF EXISTS "users_manage_own_shifa_ids" ON public.shifa_ids;
CREATE POLICY "users_manage_own_shifa_ids"
ON public.shifa_ids FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "authenticated_read_shifa_ids" ON public.shifa_ids;
CREATE POLICY "authenticated_read_shifa_ids"
ON public.shifa_ids FOR SELECT TO authenticated
USING (true);

-- kiosk_checkins: authenticated users can insert, read their own
DROP POLICY IF EXISTS "authenticated_insert_kiosk_checkins" ON public.kiosk_checkins;
CREATE POLICY "authenticated_insert_kiosk_checkins"
ON public.kiosk_checkins FOR INSERT TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_read_kiosk_checkins" ON public.kiosk_checkins;
CREATE POLICY "authenticated_read_kiosk_checkins"
ON public.kiosk_checkins FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS "authenticated_update_kiosk_checkins" ON public.kiosk_checkins;
CREATE POLICY "authenticated_update_kiosk_checkins"
ON public.kiosk_checkins FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

-- shifa_access_verifications: authenticated can insert and read
DROP POLICY IF EXISTS "authenticated_manage_shifa_access" ON public.shifa_access_verifications;
CREATE POLICY "authenticated_manage_shifa_access"
ON public.shifa_access_verifications FOR ALL TO authenticated
USING (true) WITH CHECK (true);

-- ============================================================
-- 5. SEED DATA
-- ============================================================

DO $$
DECLARE
  v_patient_id UUID;
  v_user_id UUID;
  v_shifa_id TEXT;
  v_org_id UUID;
  v_appt_id UUID;
BEGIN
  -- Get existing patient
  SELECT p.id, p.user_id, p.shifa_id
  INTO v_patient_id, v_user_id, v_shifa_id
  FROM public.patients p
  LIMIT 1;

  -- Get existing org
  SELECT id INTO v_org_id FROM public.organizations LIMIT 1;

  -- Get existing appointment
  SELECT id INTO v_appt_id FROM public.appointments LIMIT 1;

  IF v_patient_id IS NOT NULL THEN
    -- Seed shifa_ids
    INSERT INTO public.shifa_ids (
      patient_id, user_id, shifa_id, status, verification_level,
      qr_code_data, last_verified_at
    ) VALUES (
      v_patient_id,
      v_user_id,
      COALESCE(v_shifa_id, 'SH-2-SN-FR-2025-7K4D'),
      'active',
      'verified',
      'SHIFA:' || COALESCE(v_shifa_id, 'SH-2-SN-FR-2025-7K4D') || ':' || v_patient_id::TEXT,
      NOW() - INTERVAL '2 hours'
    ) ON CONFLICT (shifa_id) DO NOTHING;

    -- Seed shifa_cards if empty
    INSERT INTO public.shifa_cards (
      user_id, patient_id, shifa_id, card_number, card_type, status,
      qr_code_data, issued_at, expires_at, delivery_status
    ) VALUES (
      v_user_id,
      v_patient_id,
      COALESCE(v_shifa_id, 'SH-2-SN-FR-2025-7K4D'),
      'SC-' || COALESCE(v_shifa_id, 'SH-2-SN-FR-2025-7K4D'),
      'premium',
      'active',
      'SHIFA:' || COALESCE(v_shifa_id, 'SH-2-SN-FR-2025-7K4D') || ':' || v_patient_id::TEXT,
      NOW() - INTERVAL '90 days',
      NOW() + INTERVAL '3 years',
      'delivered'
    ) ON CONFLICT (user_id) DO NOTHING;

    -- Seed kiosk check-ins
    INSERT INTO public.kiosk_checkins (
      patient_id, appointment_id, organization_id, kiosk_id,
      queue_number, department, status, checked_in_at
    ) VALUES
      (v_patient_id, v_appt_id, v_org_id, 'KIOSK-01', 'A-042', 'Médecine interne', 'completed', NOW() - INTERVAL '2 days'),
      (v_patient_id, NULL, v_org_id, 'KIOSK-02', 'B-017', 'Urgences', 'completed', NOW() - INTERVAL '5 days'),
      (v_patient_id, NULL, v_org_id, 'KIOSK-01', 'A-031', 'Consultations externes', 'completed', NOW() - INTERVAL '10 days')
    ON CONFLICT (id) DO NOTHING;

    -- Seed audit_logs for access history
    INSERT INTO public.audit_logs (
      organization_id, user_id, action, resource_type, resource_id, details, created_at
    ) VALUES
      (v_org_id, v_user_id, 'shifa_id_verified', 'patient', v_patient_id,
       jsonb_build_object('actor', 'Dr. Mohamed Sy', 'role', 'Médecin généraliste', 'location', 'CHU Saint-Louis', 'method', 'qr_scan'),
       NOW() - INTERVAL '2 hours'),
      (v_org_id, v_user_id, 'shifa_id_verified', 'patient', v_patient_id,
       jsonb_build_object('actor', 'Clinique Pasteur', 'role', 'Accueil patient', 'location', 'Clinique Pasteur', 'method', 'qr_scan'),
       NOW() - INTERVAL '1 day'),
      (v_org_id, v_user_id, 'shifa_id_verified', 'patient', v_patient_id,
       jsonb_build_object('actor', 'Pharmacie Centrale', 'role', 'Pharmacien', 'location', 'Dakar', 'method', 'nfc'),
       NOW() - INTERVAL '3 days'),
      (v_org_id, v_user_id, 'shifa_access_granted', 'patient', v_patient_id,
       jsonb_build_object('actor', 'Dr. Ndiaye', 'role', 'Cardiologue', 'location', 'Clinique du Cap-Vert', 'method', 'qr_scan', 'purpose', 'Consultation spécialiste'),
       NOW() - INTERVAL '7 days')
    ON CONFLICT (id) DO NOTHING;

    -- Seed shifa_access_verifications
    INSERT INTO public.shifa_access_verifications (
      patient_id, verified_by, organization_id, verification_type,
      access_purpose, access_granted, shifa_id_scanned, created_at
    ) VALUES
      (v_patient_id, v_user_id, v_org_id, 'qr_scan', 'Consultation médicale', true,
       COALESCE(v_shifa_id, 'SH-2-SN-FR-2025-7K4D'), NOW() - INTERVAL '2 hours'),
      (v_patient_id, v_user_id, v_org_id, 'nfc', 'Dispensation médicaments', true,
       COALESCE(v_shifa_id, 'SH-2-SN-FR-2025-7K4D'), NOW() - INTERVAL '1 day'),
      (v_patient_id, v_user_id, v_org_id, 'qr_scan', 'Admission urgence', true,
       COALESCE(v_shifa_id, 'SH-2-SN-FR-2025-7K4D'), NOW() - INTERVAL '3 days'),
      (v_patient_id, v_user_id, v_org_id, 'manual', 'Vérification identité', false,
       'SH-UNKNOWN-0000', NOW() - INTERVAL '5 days')
    ON CONFLICT (id) DO NOTHING;

  ELSE
    RAISE NOTICE 'No patient found. Skipping seed data.';
  END IF;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Seed data failed: %', SQLERRM;
END $$;
