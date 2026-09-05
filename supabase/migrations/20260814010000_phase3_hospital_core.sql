-- ============================================================
-- SHIFA HEALTH OS — Phase 3C: Hospital Core Backend Tables
-- Creates missing tables for existing UIs
-- Migration: 20260814010000_phase3_hospital_core.sql
-- ============================================================

-- ============================================================
-- ENUMS
-- ============================================================

DO $$ BEGIN
  CREATE TYPE public.hospitalization_status AS ENUM (
    'admitted', 'in_care', 'transferred', 'discharged', 'deceased'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.blood_type AS ENUM (
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.blood_unit_status AS ENUM (
    'available', 'reserved', 'used', 'expired', 'discarded', 'quarantine'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.surgical_case_status AS ENUM (
    'scheduled', 'in_progress', 'completed', 'cancelled', 'postponed'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.sterilization_status AS ENUM (
    'pending', 'in_progress', 'completed', 'failed', 'quarantine'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.transport_status AS ENUM (
    'requested', 'assigned', 'in_transit', 'completed', 'cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.equipment_status AS ENUM (
    'operational', 'maintenance', 'out_of_service', 'retired', 'calibration'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.purchase_order_status AS ENUM (
    'draft', 'submitted', 'approved', 'ordered', 'received', 'cancelled', 'partial'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- HOSPITALIZATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.hospitalizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  admission_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  discharge_date TIMESTAMPTZ,
  ward TEXT,
  bed_number TEXT,
  room_number TEXT,
  admitting_professional_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
  attending_professional_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
  admission_reason TEXT,
  diagnosis_at_admission TEXT,
  diagnosis_at_discharge TEXT,
  status public.hospitalization_status NOT NULL DEFAULT 'admitted',
  discharge_notes TEXT,
  transfer_destination TEXT,
  emergency_admission BOOLEAN DEFAULT FALSE,
  insurance_claim_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE IF EXISTS public.hospitalizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "hospitalizations_select" ON public.hospitalizations;
DROP POLICY IF EXISTS "hospitalizations_insert" ON public.hospitalizations;
DROP POLICY IF EXISTS "hospitalizations_update" ON public.hospitalizations;
DROP POLICY IF EXISTS "hospitalizations_delete" ON public.hospitalizations;

CREATE POLICY "hospitalizations_select" ON public.hospitalizations
  FOR SELECT USING (
    (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1) = auth.uid()
    OR (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

CREATE POLICY "hospitalizations_insert" ON public.hospitalizations
  FOR INSERT WITH CHECK (
    public.belongs_to_org(organization_id)
    AND public.user_role() IN ('professional', 'org_admin', 'platform_admin')
  );

CREATE POLICY "hospitalizations_update" ON public.hospitalizations
  FOR UPDATE USING (
    (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

CREATE POLICY "hospitalizations_delete" ON public.hospitalizations
  FOR DELETE USING (public.is_platform_admin());

-- ============================================================
-- BLOOD UNITS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.blood_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  unit_code TEXT NOT NULL UNIQUE,
  blood_type public.blood_type NOT NULL DEFAULT 'unknown',
  volume_ml INTEGER NOT NULL DEFAULT 450,
  collection_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  donor_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  status public.blood_unit_status NOT NULL DEFAULT 'available',
  reserved_for_patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  used_in_hospitalization_id UUID REFERENCES public.hospitalizations(id) ON DELETE SET NULL,
  storage_location TEXT,
  tested BOOLEAN DEFAULT FALSE,
  test_results JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE IF EXISTS public.blood_units ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "blood_units_select" ON public.blood_units;
DROP POLICY IF EXISTS "blood_units_insert" ON public.blood_units;
DROP POLICY IF EXISTS "blood_units_update" ON public.blood_units;
DROP POLICY IF EXISTS "blood_units_delete" ON public.blood_units;

CREATE POLICY "blood_units_select" ON public.blood_units
  FOR SELECT USING (
    (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

CREATE POLICY "blood_units_insert" ON public.blood_units
  FOR INSERT WITH CHECK (
    public.belongs_to_org(organization_id)
    AND public.user_role() IN ('professional', 'org_admin', 'platform_admin')
  );

CREATE POLICY "blood_units_update" ON public.blood_units
  FOR UPDATE USING (
    (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

CREATE POLICY "blood_units_delete" ON public.blood_units
  FOR DELETE USING (public.is_platform_admin());

-- ============================================================
-- BLOOD REQUESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.blood_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  requesting_professional_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
  blood_type public.blood_type NOT NULL DEFAULT 'unknown',
  units_requested INTEGER NOT NULL DEFAULT 1,
  units_fulfilled INTEGER DEFAULT 0,
  urgency TEXT NOT NULL DEFAULT 'routine' CHECK (urgency IN ('routine', 'urgent', 'emergency')),
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'fulfilled', 'cancelled')),
  requested_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  fulfilled_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE IF EXISTS public.blood_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "blood_requests_select" ON public.blood_requests;
DROP POLICY IF EXISTS "blood_requests_insert" ON public.blood_requests;
DROP POLICY IF EXISTS "blood_requests_update" ON public.blood_requests;
DROP POLICY IF EXISTS "blood_requests_delete" ON public.blood_requests;

CREATE POLICY "blood_requests_select" ON public.blood_requests
  FOR SELECT USING (
    (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

CREATE POLICY "blood_requests_insert" ON public.blood_requests
  FOR INSERT WITH CHECK (
    public.belongs_to_org(organization_id)
    AND public.user_role() IN ('professional', 'org_admin', 'platform_admin')
  );

CREATE POLICY "blood_requests_update" ON public.blood_requests
  FOR UPDATE USING (
    (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

CREATE POLICY "blood_requests_delete" ON public.blood_requests
  FOR DELETE USING (public.is_platform_admin());

-- ============================================================
-- SURGICAL CASES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.surgical_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  hospitalization_id UUID REFERENCES public.hospitalizations(id) ON DELETE SET NULL,
  lead_surgeon_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
  anesthesiologist_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
  procedure_name TEXT NOT NULL,
  procedure_code TEXT,
  operating_room TEXT,
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  status public.surgical_case_status NOT NULL DEFAULT 'scheduled',
  anesthesia_type TEXT,
  pre_op_notes TEXT,
  intra_op_notes TEXT,
  post_op_notes TEXT,
  complications TEXT,
  implants_used JSONB DEFAULT '[]'::jsonb,
  team_members JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE IF EXISTS public.surgical_cases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "surgical_cases_select" ON public.surgical_cases;
DROP POLICY IF EXISTS "surgical_cases_insert" ON public.surgical_cases;
DROP POLICY IF EXISTS "surgical_cases_update" ON public.surgical_cases;
DROP POLICY IF EXISTS "surgical_cases_delete" ON public.surgical_cases;

CREATE POLICY "surgical_cases_select" ON public.surgical_cases
  FOR SELECT USING (
    (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

CREATE POLICY "surgical_cases_insert" ON public.surgical_cases
  FOR INSERT WITH CHECK (
    public.belongs_to_org(organization_id)
    AND public.user_role() IN ('professional', 'org_admin', 'platform_admin')
  );

CREATE POLICY "surgical_cases_update" ON public.surgical_cases
  FOR UPDATE USING (
    (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

CREATE POLICY "surgical_cases_delete" ON public.surgical_cases
  FOR DELETE USING (public.is_platform_admin());

-- ============================================================
-- STERILIZATION CYCLES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.sterilization_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  cycle_code TEXT NOT NULL,
  sterilizer_id TEXT,
  sterilization_method TEXT NOT NULL DEFAULT 'autoclave',
  temperature NUMERIC,
  pressure NUMERIC,
  duration_minutes INTEGER,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  status public.sterilization_status NOT NULL DEFAULT 'pending',
  operator_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  items JSONB DEFAULT '[]'::jsonb,
  test_results JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE IF EXISTS public.sterilization_cycles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sterilization_cycles_select" ON public.sterilization_cycles;
DROP POLICY IF EXISTS "sterilization_cycles_insert" ON public.sterilization_cycles;
DROP POLICY IF EXISTS "sterilization_cycles_update" ON public.sterilization_cycles;
DROP POLICY IF EXISTS "sterilization_cycles_delete" ON public.sterilization_cycles;

CREATE POLICY "sterilization_cycles_select" ON public.sterilization_cycles
  FOR SELECT USING (
    (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

CREATE POLICY "sterilization_cycles_insert" ON public.sterilization_cycles
  FOR INSERT WITH CHECK (
    public.belongs_to_org(organization_id)
    AND public.user_role() IN ('professional', 'org_admin', 'platform_admin')
  );

CREATE POLICY "sterilization_cycles_update" ON public.sterilization_cycles
  FOR UPDATE USING (
    (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

CREATE POLICY "sterilization_cycles_delete" ON public.sterilization_cycles
  FOR DELETE USING (public.is_platform_admin());

-- ============================================================
-- TRANSPORT REQUESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.transport_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  requesting_professional_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
  transport_type TEXT NOT NULL DEFAULT 'ambulance' CHECK (transport_type IN ('ambulance', 'wheelchair', 'stretcher', 'helicopter', 'other')),
  urgency TEXT NOT NULL DEFAULT 'routine' CHECK (urgency IN ('routine', 'urgent', 'emergency')),
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ,
  departed_at TIMESTAMPTZ,
  arrived_at TIMESTAMPTZ,
  status public.transport_status NOT NULL DEFAULT 'requested',
  driver_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  vehicle_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE IF EXISTS public.transport_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "transport_requests_select" ON public.transport_requests;
DROP POLICY IF EXISTS "transport_requests_insert" ON public.transport_requests;
DROP POLICY IF EXISTS "transport_requests_update" ON public.transport_requests;
DROP POLICY IF EXISTS "transport_requests_delete" ON public.transport_requests;

CREATE POLICY "transport_requests_select" ON public.transport_requests
  FOR SELECT USING (
    (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

CREATE POLICY "transport_requests_insert" ON public.transport_requests
  FOR INSERT WITH CHECK (
    public.belongs_to_org(organization_id)
    AND public.user_role() IN ('professional', 'org_admin', 'platform_admin')
  );

CREATE POLICY "transport_requests_update" ON public.transport_requests
  FOR UPDATE USING (
    (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

CREATE POLICY "transport_requests_delete" ON public.transport_requests
  FOR DELETE USING (public.is_platform_admin());

-- ============================================================
-- EQUIPMENT REGISTRY
-- ============================================================
CREATE TABLE IF NOT EXISTS public.equipment_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  asset_code TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  manufacturer TEXT,
  model TEXT,
  serial_number TEXT,
  purchase_date DATE,
  warranty_expiry DATE,
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  location TEXT,
  department TEXT,
  status public.equipment_status NOT NULL DEFAULT 'operational',
  assigned_to UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
  purchase_cost NUMERIC,
  current_value NUMERIC,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE IF EXISTS public.equipment_registry ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "equipment_registry_select" ON public.equipment_registry;
DROP POLICY IF EXISTS "equipment_registry_insert" ON public.equipment_registry;
DROP POLICY IF EXISTS "equipment_registry_update" ON public.equipment_registry;
DROP POLICY IF EXISTS "equipment_registry_delete" ON public.equipment_registry;

CREATE POLICY "equipment_registry_select" ON public.equipment_registry
  FOR SELECT USING (
    (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

CREATE POLICY "equipment_registry_insert" ON public.equipment_registry
  FOR INSERT WITH CHECK (
    public.belongs_to_org(organization_id)
    AND public.user_role() IN ('org_admin', 'platform_admin')
  );

CREATE POLICY "equipment_registry_update" ON public.equipment_registry
  FOR UPDATE USING (
    (public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

CREATE POLICY "equipment_registry_delete" ON public.equipment_registry
  FOR DELETE USING (public.is_platform_admin());

-- ============================================================
-- PURCHASE ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  po_number TEXT NOT NULL UNIQUE,
  supplier_name TEXT NOT NULL,
  supplier_contact JSONB DEFAULT '{}'::jsonb,
  requested_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  status public.purchase_order_status NOT NULL DEFAULT 'draft',
  order_date DATE,
  expected_delivery DATE,
  actual_delivery DATE,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  tax_amount NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'XOF',
  line_items JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE IF EXISTS public.purchase_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "purchase_orders_select" ON public.purchase_orders;
DROP POLICY IF EXISTS "purchase_orders_insert" ON public.purchase_orders;
DROP POLICY IF EXISTS "purchase_orders_update" ON public.purchase_orders;
DROP POLICY IF EXISTS "purchase_orders_delete" ON public.purchase_orders;

CREATE POLICY "purchase_orders_select" ON public.purchase_orders
  FOR SELECT USING (
    (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

CREATE POLICY "purchase_orders_insert" ON public.purchase_orders
  FOR INSERT WITH CHECK (
    public.belongs_to_org(organization_id)
    AND public.user_role() IN ('org_admin', 'platform_admin')
  );

CREATE POLICY "purchase_orders_update" ON public.purchase_orders
  FOR UPDATE USING (
    (public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

CREATE POLICY "purchase_orders_delete" ON public.purchase_orders
  FOR DELETE USING (public.is_platform_admin());

-- ============================================================
-- INVENTORY ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'unit',
  quantity_on_hand NUMERIC NOT NULL DEFAULT 0,
  quantity_reserved NUMERIC NOT NULL DEFAULT 0,
  reorder_point NUMERIC NOT NULL DEFAULT 0,
  reorder_quantity NUMERIC NOT NULL DEFAULT 0,
  unit_cost NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'XOF',
  storage_location TEXT,
  expiry_date DATE,
  batch_number TEXT,
  supplier_name TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(organization_id, sku)
);

ALTER TABLE IF EXISTS public.inventory_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "inventory_items_select" ON public.inventory_items;
DROP POLICY IF EXISTS "inventory_items_insert" ON public.inventory_items;
DROP POLICY IF EXISTS "inventory_items_update" ON public.inventory_items;
DROP POLICY IF EXISTS "inventory_items_delete" ON public.inventory_items;

CREATE POLICY "inventory_items_select" ON public.inventory_items
  FOR SELECT USING (
    (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

CREATE POLICY "inventory_items_insert" ON public.inventory_items
  FOR INSERT WITH CHECK (
    public.belongs_to_org(organization_id)
    AND public.user_role() IN ('org_admin', 'platform_admin')
  );

CREATE POLICY "inventory_items_update" ON public.inventory_items
  FOR UPDATE USING (
    (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

CREATE POLICY "inventory_items_delete" ON public.inventory_items
  FOR DELETE USING (
    (public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

-- ============================================================
-- POS TRANSACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pos_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  cashier_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  transaction_number TEXT NOT NULL UNIQUE,
  transaction_type TEXT NOT NULL DEFAULT 'sale' CHECK (transaction_type IN ('sale', 'refund', 'void', 'exchange')),
  subtotal NUMERIC NOT NULL DEFAULT 0,
  discount_amount NUMERIC NOT NULL DEFAULT 0,
  tax_amount NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  amount_paid NUMERIC NOT NULL DEFAULT 0,
  change_given NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'XOF',
  payment_method TEXT NOT NULL DEFAULT 'cash',
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'refunded', 'voided')),
  line_items JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE IF EXISTS public.pos_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pos_transactions_select" ON public.pos_transactions;
DROP POLICY IF EXISTS "pos_transactions_insert" ON public.pos_transactions;
DROP POLICY IF EXISTS "pos_transactions_update" ON public.pos_transactions;
DROP POLICY IF EXISTS "pos_transactions_delete" ON public.pos_transactions;

CREATE POLICY "pos_transactions_select" ON public.pos_transactions
  FOR SELECT USING (
    cashier_id = auth.uid()
    OR (public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

CREATE POLICY "pos_transactions_insert" ON public.pos_transactions
  FOR INSERT WITH CHECK (
    cashier_id = auth.uid()
    AND public.belongs_to_org(organization_id)
    AND public.user_role() IN ('professional', 'org_admin', 'platform_admin')
  );

CREATE POLICY "pos_transactions_update" ON public.pos_transactions
  FOR UPDATE USING (
    (public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

CREATE POLICY "pos_transactions_delete" ON public.pos_transactions
  FOR DELETE USING (public.is_platform_admin());

-- ============================================================
-- ACCOUNTING ENTRIES (LEDGER)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.accounting_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  entry_number TEXT NOT NULL,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  entry_type TEXT NOT NULL DEFAULT 'journal' CHECK (entry_type IN ('journal', 'payment', 'receipt', 'adjustment', 'closing')),
  description TEXT NOT NULL,
  reference TEXT,
  debit_account TEXT NOT NULL,
  credit_account TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'XOF',
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  is_reconciled BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(organization_id, entry_number)
);

ALTER TABLE IF EXISTS public.accounting_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "accounting_entries_select" ON public.accounting_entries;
DROP POLICY IF EXISTS "accounting_entries_insert" ON public.accounting_entries;
DROP POLICY IF EXISTS "accounting_entries_update" ON public.accounting_entries;
DROP POLICY IF EXISTS "accounting_entries_delete" ON public.accounting_entries;

CREATE POLICY "accounting_entries_select" ON public.accounting_entries
  FOR SELECT USING (
    (public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

CREATE POLICY "accounting_entries_insert" ON public.accounting_entries
  FOR INSERT WITH CHECK (
    public.belongs_to_org(organization_id)
    AND public.is_org_admin()
  );

CREATE POLICY "accounting_entries_update" ON public.accounting_entries
  FOR UPDATE USING (
    (public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

CREATE POLICY "accounting_entries_delete" ON public.accounting_entries
  FOR DELETE USING (public.is_platform_admin());

-- ============================================================
-- IMAGING STUDIES (DICOM)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.imaging_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  ordering_professional_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
  reporting_professional_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
  study_uid TEXT UNIQUE,
  modality TEXT NOT NULL DEFAULT 'XR' CHECK (modality IN ('XR', 'CT', 'MRI', 'US', 'PET', 'NM', 'MG', 'DX', 'CR', 'OT')),
  body_part TEXT,
  study_description TEXT,
  study_date DATE,
  accession_number TEXT,
  status TEXT NOT NULL DEFAULT 'ordered' CHECK (status IN ('ordered', 'in_progress', 'completed', 'reported', 'cancelled')),
  report TEXT,
  report_date TIMESTAMPTZ,
  dicom_url TEXT,
  thumbnail_url TEXT,
  series_count INTEGER DEFAULT 0,
  images_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE IF EXISTS public.imaging_studies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "imaging_studies_select" ON public.imaging_studies;
DROP POLICY IF EXISTS "imaging_studies_insert" ON public.imaging_studies;
DROP POLICY IF EXISTS "imaging_studies_update" ON public.imaging_studies;
DROP POLICY IF EXISTS "imaging_studies_delete" ON public.imaging_studies;

CREATE POLICY "imaging_studies_select" ON public.imaging_studies
  FOR SELECT USING (
    (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1) = auth.uid()
    OR (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

CREATE POLICY "imaging_studies_insert" ON public.imaging_studies
  FOR INSERT WITH CHECK (
    public.belongs_to_org(organization_id)
    AND public.user_role() IN ('professional', 'org_admin', 'platform_admin')
  );

CREATE POLICY "imaging_studies_update" ON public.imaging_studies
  FOR UPDATE USING (
    (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

CREATE POLICY "imaging_studies_delete" ON public.imaging_studies
  FOR DELETE USING (public.is_platform_admin());

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_hospitalizations_patient ON public.hospitalizations(patient_id);
CREATE INDEX IF NOT EXISTS idx_hospitalizations_org ON public.hospitalizations(organization_id);
CREATE INDEX IF NOT EXISTS idx_hospitalizations_status ON public.hospitalizations(status);
CREATE INDEX IF NOT EXISTS idx_blood_units_org ON public.blood_units(organization_id);
CREATE INDEX IF NOT EXISTS idx_blood_units_status ON public.blood_units(status);
CREATE INDEX IF NOT EXISTS idx_blood_units_type ON public.blood_units(blood_type);
CREATE INDEX IF NOT EXISTS idx_surgical_cases_patient ON public.surgical_cases(patient_id);
CREATE INDEX IF NOT EXISTS idx_surgical_cases_org ON public.surgical_cases(organization_id);
CREATE INDEX IF NOT EXISTS idx_surgical_cases_status ON public.surgical_cases(status);
CREATE INDEX IF NOT EXISTS idx_equipment_registry_org ON public.equipment_registry(organization_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_org ON public.inventory_items(organization_id);
CREATE INDEX IF NOT EXISTS idx_pos_transactions_org ON public.pos_transactions(organization_id);
CREATE INDEX IF NOT EXISTS idx_accounting_entries_org ON public.accounting_entries(organization_id);
CREATE INDEX IF NOT EXISTS idx_imaging_studies_patient ON public.imaging_studies(patient_id);
CREATE INDEX IF NOT EXISTS idx_imaging_studies_org ON public.imaging_studies(organization_id);
