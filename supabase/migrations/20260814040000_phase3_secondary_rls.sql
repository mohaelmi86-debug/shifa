-- ─────────────────────────────────────────────────────────────────────────────
-- Phase 3 — Secondary Table RLS Audit & Policies
-- Migration: 20260814040000_phase3_secondary_rls.sql
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. lab_results ────────────────────────────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'lab_results'
  ) THEN
    CREATE TABLE public.lab_results (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      professional_id UUID REFERENCES auth.users(id),
      organization_id UUID,
      title TEXT NOT NULL,
      lab_name TEXT,
      result_date TIMESTAMPTZ DEFAULT now(),
      status TEXT DEFAULT 'En attente' CHECK (status IN ('Normal', 'À surveiller', 'Anomalie', 'En attente')),
      result_data JSONB,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
  END IF;
END $$;

ALTER TABLE public.lab_results ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lab_results' AND policyname = 'lab_results_patient_select') THEN
    CREATE POLICY lab_results_patient_select ON public.lab_results
      FOR SELECT USING (patient_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lab_results' AND policyname = 'lab_results_professional_select') THEN
    CREATE POLICY lab_results_professional_select ON public.lab_results
      FOR SELECT USING (professional_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lab_results' AND policyname = 'lab_results_professional_insert') THEN
    CREATE POLICY lab_results_professional_insert ON public.lab_results
      FOR INSERT WITH CHECK (professional_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lab_results' AND policyname = 'lab_results_professional_update') THEN
    CREATE POLICY lab_results_professional_update ON public.lab_results
      FOR UPDATE USING (professional_id = auth.uid());
  END IF;
END $$;

-- ── 2. patient_documents ──────────────────────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'patient_documents'
  ) THEN
    CREATE TABLE public.patient_documents (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      uploaded_by UUID REFERENCES auth.users(id),
      document_type TEXT DEFAULT 'document' CHECK (document_type IN ('prescription', 'lab_result', 'imaging', 'certificate', 'document', 'consent', 'other')),
      title TEXT NOT NULL,
      file_url TEXT,
      file_size INTEGER,
      mime_type TEXT,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
  END IF;
END $$;

ALTER TABLE public.patient_documents ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'patient_documents' AND policyname = 'patient_documents_owner_all') THEN
    CREATE POLICY patient_documents_owner_all ON public.patient_documents
      FOR ALL USING (patient_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'patient_documents' AND policyname = 'patient_documents_uploader_select') THEN
    CREATE POLICY patient_documents_uploader_select ON public.patient_documents
      FOR SELECT USING (uploaded_by = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'patient_documents' AND policyname = 'patient_documents_uploader_insert') THEN
    CREATE POLICY patient_documents_uploader_insert ON public.patient_documents
      FOR INSERT WITH CHECK (uploaded_by = auth.uid());
  END IF;
END $$;

-- ── 3. health_records ─────────────────────────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'health_records'
  ) THEN
    CREATE TABLE public.health_records (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      professional_id UUID REFERENCES auth.users(id),
      record_type TEXT NOT NULL CHECK (record_type IN ('medical_history', 'antecedent', 'allergy', 'vaccination', 'prescription', 'treatment', 'diagnosis', 'note', 'other')),
      title TEXT,
      content JSONB,
      date_recorded TIMESTAMPTZ DEFAULT now(),
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
  END IF;
END $$;

ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'health_records' AND policyname = 'health_records_patient_select') THEN
    CREATE POLICY health_records_patient_select ON public.health_records
      FOR SELECT USING (patient_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'health_records' AND policyname = 'health_records_professional_all') THEN
    CREATE POLICY health_records_professional_all ON public.health_records
      FOR ALL USING (professional_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'health_records' AND policyname = 'health_records_patient_insert') THEN
    CREATE POLICY health_records_patient_insert ON public.health_records
      FOR INSERT WITH CHECK (patient_id = auth.uid() AND professional_id IS NULL);
  END IF;
END $$;

-- ── 4. appointments (ensure RLS is enabled) ───────────────────────────────────
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'appointments') THEN
    ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'appointments') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'appointments_patient_all') THEN
      CREATE POLICY appointments_patient_all ON public.appointments
        FOR ALL USING (patient_id = auth.uid());
    END IF;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'appointments') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'appointments_professional_select') THEN
      CREATE POLICY appointments_professional_select ON public.appointments
        FOR SELECT USING (professional_id = auth.uid());
    END IF;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'appointments') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'appointments_professional_update') THEN
      CREATE POLICY appointments_professional_update ON public.appointments
        FOR UPDATE USING (professional_id = auth.uid());
    END IF;
  END IF;
END $$;

-- ── 5. notifications ──────────────────────────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'notifications'
  ) THEN
    CREATE TABLE public.notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      type TEXT NOT NULL DEFAULT 'info',
      title TEXT NOT NULL,
      body TEXT,
      read BOOLEAN DEFAULT false,
      action_url TEXT,
      metadata JSONB,
      created_at TIMESTAMPTZ DEFAULT now()
    );
  END IF;
END $$;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'notifications_owner_all') THEN
    CREATE POLICY notifications_owner_all ON public.notifications
      FOR ALL USING (user_id = auth.uid());
  END IF;
END $$;

-- ── 6. user_settings ─────────────────────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_settings') THEN
    ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_settings') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_settings' AND policyname = 'user_settings_owner_all') THEN
      CREATE POLICY user_settings_owner_all ON public.user_settings
        FOR ALL USING (user_id = auth.uid());
    END IF;
  END IF;
END $$;

-- ── 7. messages / conversations ───────────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'messages') THEN
    ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'messages_participant_select') THEN
      CREATE POLICY messages_participant_select ON public.messages
        FOR SELECT USING (sender_id = auth.uid() OR recipient_id = auth.uid());
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'messages_sender_insert') THEN
      CREATE POLICY messages_sender_insert ON public.messages
        FOR INSERT WITH CHECK (sender_id = auth.uid());
    END IF;
  END IF;
END $$;

-- ── 8. prescriptions ─────────────────────────────────────────────────────────
-- NOTE: prescriptions.patient_id → public.patients(id), prescriptions.prescriber_id → public.professionals(id)
-- Both reference their respective profile tables, not auth.users directly.
-- Policies already created in 20260812230000_critical_fixes.sql; this block is a no-op guard only.
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'prescriptions') THEN
    ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
    -- prescriptions_patient_select: patient can view their own prescriptions
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'prescriptions' AND policyname = 'prescriptions_patient_select') THEN
      CREATE POLICY prescriptions_patient_select ON public.prescriptions
        FOR SELECT USING (
          auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1)
        );
    END IF;
    -- prescriptions_professional_all: prescriber can manage their own prescriptions
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'prescriptions' AND policyname = 'prescriptions_professional_all') THEN
      CREATE POLICY prescriptions_professional_all ON public.prescriptions
        FOR ALL USING (
          auth.uid() = (SELECT user_id FROM public.professionals WHERE id = prescriber_id LIMIT 1)
        );
    END IF;
  END IF;
END $$;

-- ── 9. teleconsultation_sessions ─────────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'teleconsultation_sessions') THEN
    ALTER TABLE public.teleconsultation_sessions ENABLE ROW LEVEL SECURITY;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'teleconsultation_sessions' AND policyname = 'teleconsult_participant_all') THEN
      CREATE POLICY teleconsult_participant_all ON public.teleconsultation_sessions
        FOR ALL USING (patient_id = auth.uid() OR professional_id = auth.uid());
    END IF;
  END IF;
END $$;

-- ── 10. vaccinations ─────────────────────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'vaccinations') THEN
    ALTER TABLE public.vaccinations ENABLE ROW LEVEL SECURITY;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vaccinations' AND policyname = 'vaccinations_patient_all') THEN
      CREATE POLICY vaccinations_patient_all ON public.vaccinations
        FOR ALL USING (patient_id = auth.uid());
    END IF;
  END IF;
END $$;

-- ── 11. vital_signs ──────────────────────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'vital_signs') THEN
    ALTER TABLE public.vital_signs ENABLE ROW LEVEL SECURITY;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vital_signs' AND policyname = 'vital_signs_patient_all') THEN
      CREATE POLICY vital_signs_patient_all ON public.vital_signs
        FOR ALL USING (patient_id = auth.uid());
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vital_signs' AND policyname = 'vital_signs_professional_select') THEN
      CREATE POLICY vital_signs_professional_select ON public.vital_signs
        FOR SELECT USING (professional_id = auth.uid());
    END IF;
  END IF;
END $$;

-- ── 12. care_plans ───────────────────────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'care_plans') THEN
    ALTER TABLE public.care_plans ENABLE ROW LEVEL SECURITY;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'care_plans' AND policyname = 'care_plans_patient_select') THEN
      CREATE POLICY care_plans_patient_select ON public.care_plans
        FOR SELECT USING (patient_id = auth.uid());
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'care_plans' AND policyname = 'care_plans_professional_all') THEN
      CREATE POLICY care_plans_professional_all ON public.care_plans
        FOR ALL USING (professional_id = auth.uid());
    END IF;
  END IF;
END $$;

-- ── 13. referrals ────────────────────────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'referrals') THEN
    ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'referrals' AND policyname = 'referrals_patient_select') THEN
      CREATE POLICY referrals_patient_select ON public.referrals
        FOR SELECT USING (patient_id = auth.uid());
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'referrals' AND policyname = 'referrals_professional_all') THEN
      CREATE POLICY referrals_professional_all ON public.referrals
        FOR ALL USING (referring_professional_id = auth.uid() OR referred_professional_id = auth.uid());
    END IF;
  END IF;
END $$;

-- ── 14. consent_records ──────────────────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'consent_records') THEN
    ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'consent_records' AND policyname = 'consent_records_patient_all') THEN
      CREATE POLICY consent_records_patient_all ON public.consent_records
        FOR ALL USING (patient_id = auth.uid());
    END IF;
  END IF;
END $$;

-- ── 15. ambassador_invitations ───────────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ambassador_invitations') THEN
    ALTER TABLE public.ambassador_invitations ENABLE ROW LEVEL SECURITY;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ambassador_invitations' AND policyname = 'ambassador_invitations_owner_all') THEN
      CREATE POLICY ambassador_invitations_owner_all ON public.ambassador_invitations
        FOR ALL USING (ambassador_id = auth.uid());
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ambassador_invitations' AND policyname = 'ambassador_invitations_invitee_select') THEN
      CREATE POLICY ambassador_invitations_invitee_select ON public.ambassador_invitations
        FOR SELECT USING (invitee_email = (SELECT email FROM auth.users WHERE id = auth.uid()));
    END IF;
  END IF;
END $$;
