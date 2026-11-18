-- ============================================================
-- SHIFA HEALTH OS — P2 Backlog: Module Tables + Missing Policies
-- Migration: 20260813000000_p2_backlog_modules_policies_rtl.sql
-- ============================================================

-- ============================================================
-- PART 1: MISSING RLS POLICIES ON EXISTING TABLES
-- ============================================================

-- patients: add missing DELETE policy
DROP POLICY IF EXISTS "patients_delete" ON public.patients;
CREATE POLICY "patients_delete" ON public.patients
  FOR DELETE USING (
    auth.uid() = user_id
    OR public.is_platform_admin()
  );

-- professionals: add missing DELETE policy
DROP POLICY IF EXISTS "professionals_delete" ON public.professionals;
CREATE POLICY "professionals_delete" ON public.professionals
  FOR DELETE USING (
    auth.uid() = user_id
    OR public.is_platform_admin()
  );

-- availability_slots: add missing DELETE policy
DROP POLICY IF EXISTS "availability_slots_delete" ON public.availability_slots;
CREATE POLICY "availability_slots_delete" ON public.availability_slots
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.professionals p
      WHERE p.id = professional_id AND p.user_id = auth.uid()
    )
    OR public.is_platform_admin()
  );

-- organizations: add missing SELECT, UPDATE, DELETE policies
DROP POLICY IF EXISTS "organizations_select" ON public.organizations;
CREATE POLICY "organizations_select" ON public.organizations
  FOR SELECT USING (
    is_active = true
    OR public.belongs_to_org(id)
    OR public.is_platform_admin()
  );

DROP POLICY IF EXISTS "organizations_update" ON public.organizations;
CREATE POLICY "organizations_update" ON public.organizations
  FOR UPDATE USING (
    public.belongs_to_org(id) AND public.is_org_admin()
    OR public.is_platform_admin()
  )
  WITH CHECK (
    public.belongs_to_org(id) AND public.is_org_admin()
    OR public.is_platform_admin()
  );

DROP POLICY IF EXISTS "organizations_delete" ON public.organizations;
CREATE POLICY "organizations_delete" ON public.organizations
  FOR DELETE USING (
    public.is_platform_admin()
  );

-- ============================================================
-- PART 2: MODULE TABLES — IMAGERIE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.imaging_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  professional_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
  study_type TEXT NOT NULL DEFAULT 'xray',
  modality TEXT NOT NULL DEFAULT 'CR',
  body_part TEXT,
  description TEXT,
  dicom_url TEXT,
  report_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'routine',
  requested_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  performed_at TIMESTAMPTZ,
  reported_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_imaging_studies_patient_id ON public.imaging_studies(patient_id);
CREATE INDEX IF NOT EXISTS idx_imaging_studies_organization_id ON public.imaging_studies(organization_id);
CREATE INDEX IF NOT EXISTS idx_imaging_studies_status ON public.imaging_studies(status);

ALTER TABLE public.imaging_studies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "imaging_studies_select" ON public.imaging_studies;
CREATE POLICY "imaging_studies_select" ON public.imaging_studies
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1)
    OR (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

DROP POLICY IF EXISTS "imaging_studies_insert" ON public.imaging_studies;
CREATE POLICY "imaging_studies_insert" ON public.imaging_studies
  FOR INSERT WITH CHECK (
    public.belongs_to_org(organization_id)
    AND public.user_role() IN ('professional', 'org_admin', 'platform_admin')
  );

DROP POLICY IF EXISTS "imaging_studies_update" ON public.imaging_studies;
CREATE POLICY "imaging_studies_update" ON public.imaging_studies
  FOR UPDATE USING (
    public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin')
    OR public.is_platform_admin()
  )
  WITH CHECK (
    public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin')
    OR public.is_platform_admin()
  );

DROP POLICY IF EXISTS "imaging_studies_delete" ON public.imaging_studies;
CREATE POLICY "imaging_studies_delete" ON public.imaging_studies
  FOR DELETE USING (
    public.belongs_to_org(organization_id) AND public.is_org_admin()
    OR public.is_platform_admin()
  );

-- ============================================================
-- PART 3: MODULE TABLES — HOSPITALISATION
-- ============================================================

CREATE TABLE IF NOT EXISTS public.hospitalizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  admitting_professional_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
  admission_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  discharge_date TIMESTAMPTZ,
  bed_number TEXT,
  room_number TEXT,
  ward TEXT,
  admission_reason TEXT,
  discharge_summary TEXT,
  diagnosis_codes TEXT[],
  status TEXT NOT NULL DEFAULT 'admitted',
  is_emergency BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_hospitalizations_patient_id ON public.hospitalizations(patient_id);
CREATE INDEX IF NOT EXISTS idx_hospitalizations_organization_id ON public.hospitalizations(organization_id);
CREATE INDEX IF NOT EXISTS idx_hospitalizations_status ON public.hospitalizations(status);

ALTER TABLE public.hospitalizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "hospitalizations_select" ON public.hospitalizations;
CREATE POLICY "hospitalizations_select" ON public.hospitalizations
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1)
    OR (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

DROP POLICY IF EXISTS "hospitalizations_insert" ON public.hospitalizations;
CREATE POLICY "hospitalizations_insert" ON public.hospitalizations
  FOR INSERT WITH CHECK (
    public.belongs_to_org(organization_id)
    AND public.user_role() IN ('professional', 'org_admin', 'platform_admin')
  );

DROP POLICY IF EXISTS "hospitalizations_update" ON public.hospitalizations;
CREATE POLICY "hospitalizations_update" ON public.hospitalizations
  FOR UPDATE USING (
    public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin')
    OR public.is_platform_admin()
  )
  WITH CHECK (
    public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin')
    OR public.is_platform_admin()
  );

DROP POLICY IF EXISTS "hospitalizations_delete" ON public.hospitalizations;
CREATE POLICY "hospitalizations_delete" ON public.hospitalizations
  FOR DELETE USING (
    public.belongs_to_org(organization_id) AND public.is_org_admin()
    OR public.is_platform_admin()
  );

-- ============================================================
-- PART 4: MODULE TABLES — COMPTABILITÉ
-- ============================================================

CREATE TABLE IF NOT EXISTS public.accounting_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  entry_type TEXT NOT NULL DEFAULT 'debit',
  account_code TEXT NOT NULL,
  account_label TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'XOF',
  description TEXT,
  reference_id UUID,
  reference_type TEXT,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  fiscal_year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
  is_reconciled BOOLEAN DEFAULT false,
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_accounting_entries_organization_id ON public.accounting_entries(organization_id);
CREATE INDEX IF NOT EXISTS idx_accounting_entries_entry_date ON public.accounting_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_accounting_entries_fiscal_year ON public.accounting_entries(fiscal_year);

ALTER TABLE public.accounting_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "accounting_entries_select" ON public.accounting_entries;
CREATE POLICY "accounting_entries_select" ON public.accounting_entries
  FOR SELECT USING (
    public.belongs_to_org(organization_id) AND public.is_org_admin()
    OR public.is_platform_admin()
  );

DROP POLICY IF EXISTS "accounting_entries_insert" ON public.accounting_entries;
CREATE POLICY "accounting_entries_insert" ON public.accounting_entries
  FOR INSERT WITH CHECK (
    public.belongs_to_org(organization_id) AND public.is_org_admin()
    OR public.is_platform_admin()
  );

DROP POLICY IF EXISTS "accounting_entries_update" ON public.accounting_entries;
CREATE POLICY "accounting_entries_update" ON public.accounting_entries
  FOR UPDATE USING (
    public.belongs_to_org(organization_id) AND public.is_org_admin()
    OR public.is_platform_admin()
  )
  WITH CHECK (
    public.belongs_to_org(organization_id) AND public.is_org_admin()
    OR public.is_platform_admin()
  );

DROP POLICY IF EXISTS "accounting_entries_delete" ON public.accounting_entries;
CREATE POLICY "accounting_entries_delete" ON public.accounting_entries
  FOR DELETE USING (
    public.belongs_to_org(organization_id) AND public.is_org_admin()
    OR public.is_platform_admin()
  );

-- ============================================================
-- PART 5: MODULE TABLES — INVENTAIRE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  item_code TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'consumable',
  unit TEXT NOT NULL DEFAULT 'unit',
  quantity_in_stock DECIMAL(15,3) NOT NULL DEFAULT 0,
  minimum_stock DECIMAL(15,3) NOT NULL DEFAULT 0,
  reorder_point DECIMAL(15,3) NOT NULL DEFAULT 0,
  unit_cost DECIMAL(15,2) DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'XOF',
  supplier TEXT,
  location TEXT,
  expiry_date DATE,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inventory_items_organization_id ON public.inventory_items(organization_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_category ON public.inventory_items(category);

CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  movement_type TEXT NOT NULL DEFAULT 'in',
  quantity DECIMAL(15,3) NOT NULL,
  unit_cost DECIMAL(15,2),
  reference_id UUID,
  reference_type TEXT,
  notes TEXT,
  performed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  performed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_item_id ON public.inventory_movements(item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_organization_id ON public.inventory_movements(organization_id);

ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "inventory_items_all" ON public.inventory_items;
CREATE POLICY "inventory_items_all" ON public.inventory_items
  FOR ALL USING (
    public.belongs_to_org(organization_id)
    OR public.is_platform_admin()
  )
  WITH CHECK (
    public.belongs_to_org(organization_id)
    OR public.is_platform_admin()
  );

DROP POLICY IF EXISTS "inventory_movements_all" ON public.inventory_movements;
CREATE POLICY "inventory_movements_all" ON public.inventory_movements
  FOR ALL USING (
    public.belongs_to_org(organization_id)
    OR public.is_platform_admin()
  )
  WITH CHECK (
    public.belongs_to_org(organization_id)
    OR public.is_platform_admin()
  );

-- ============================================================
-- PART 6: MODULE TABLES — BANQUE DE SANG
-- ============================================================

CREATE TABLE IF NOT EXISTS public.blood_bank_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  blood_type TEXT NOT NULL,
  component TEXT NOT NULL DEFAULT 'whole_blood',
  units_available INTEGER NOT NULL DEFAULT 0,
  units_reserved INTEGER NOT NULL DEFAULT 0,
  expiry_date DATE,
  collection_date DATE,
  donor_id UUID,
  status TEXT NOT NULL DEFAULT 'available',
  storage_location TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_blood_bank_inventory_organization_id ON public.blood_bank_inventory(organization_id);
CREATE INDEX IF NOT EXISTS idx_blood_bank_inventory_blood_type ON public.blood_bank_inventory(blood_type);

CREATE TABLE IF NOT EXISTS public.blood_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  blood_type TEXT NOT NULL,
  component TEXT NOT NULL DEFAULT 'whole_blood',
  units_requested INTEGER NOT NULL DEFAULT 1,
  units_fulfilled INTEGER DEFAULT 0,
  urgency TEXT NOT NULL DEFAULT 'routine',
  status TEXT NOT NULL DEFAULT 'pending',
  requested_by UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
  requested_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  fulfilled_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_blood_requests_patient_id ON public.blood_requests(patient_id);
CREATE INDEX IF NOT EXISTS idx_blood_requests_organization_id ON public.blood_requests(organization_id);

ALTER TABLE public.blood_bank_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "blood_bank_inventory_all" ON public.blood_bank_inventory;
CREATE POLICY "blood_bank_inventory_all" ON public.blood_bank_inventory
  FOR ALL USING (
    public.belongs_to_org(organization_id)
    OR public.is_platform_admin()
  )
  WITH CHECK (
    public.belongs_to_org(organization_id)
    OR public.is_platform_admin()
  );

DROP POLICY IF EXISTS "blood_requests_select" ON public.blood_requests;
CREATE POLICY "blood_requests_select" ON public.blood_requests
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1)
    OR (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

DROP POLICY IF EXISTS "blood_requests_insert" ON public.blood_requests;
CREATE POLICY "blood_requests_insert" ON public.blood_requests
  FOR INSERT WITH CHECK (
    public.belongs_to_org(organization_id)
    AND public.user_role() IN ('professional', 'org_admin', 'platform_admin')
  );

DROP POLICY IF EXISTS "blood_requests_update" ON public.blood_requests;
CREATE POLICY "blood_requests_update" ON public.blood_requests
  FOR UPDATE USING (
    public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin')
    OR public.is_platform_admin()
  )
  WITH CHECK (
    public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin')
    OR public.is_platform_admin()
  );

DROP POLICY IF EXISTS "blood_requests_delete" ON public.blood_requests;
CREATE POLICY "blood_requests_delete" ON public.blood_requests
  FOR DELETE USING (
    public.belongs_to_org(organization_id) AND public.is_org_admin()
    OR public.is_platform_admin()
  );

-- ============================================================
-- PART 7: MODULE TABLES — BLOC OPÉRATOIRE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.operating_room_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  surgeon_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
  anesthesiologist_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
  room_number TEXT NOT NULL,
  procedure_name TEXT NOT NULL,
  procedure_code TEXT,
  scheduled_start TIMESTAMPTZ NOT NULL,
  scheduled_duration_minutes INTEGER NOT NULL DEFAULT 60,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'scheduled',
  priority TEXT NOT NULL DEFAULT 'elective',
  pre_op_notes TEXT,
  post_op_notes TEXT,
  complications TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_or_schedules_organization_id ON public.operating_room_schedules(organization_id);
CREATE INDEX IF NOT EXISTS idx_or_schedules_patient_id ON public.operating_room_schedules(patient_id);
CREATE INDEX IF NOT EXISTS idx_or_schedules_scheduled_start ON public.operating_room_schedules(scheduled_start);

ALTER TABLE public.operating_room_schedules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "or_schedules_select" ON public.operating_room_schedules;
CREATE POLICY "or_schedules_select" ON public.operating_room_schedules
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1)
    OR (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

DROP POLICY IF EXISTS "or_schedules_insert" ON public.operating_room_schedules;
CREATE POLICY "or_schedules_insert" ON public.operating_room_schedules
  FOR INSERT WITH CHECK (
    public.belongs_to_org(organization_id)
    AND public.user_role() IN ('professional', 'org_admin', 'platform_admin')
  );

DROP POLICY IF EXISTS "or_schedules_update" ON public.operating_room_schedules;
CREATE POLICY "or_schedules_update" ON public.operating_room_schedules
  FOR UPDATE USING (
    public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin')
    OR public.is_platform_admin()
  )
  WITH CHECK (
    public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin')
    OR public.is_platform_admin()
  );

DROP POLICY IF EXISTS "or_schedules_delete" ON public.operating_room_schedules;
CREATE POLICY "or_schedules_delete" ON public.operating_room_schedules
  FOR DELETE USING (
    public.belongs_to_org(organization_id) AND public.is_org_admin()
    OR public.is_platform_admin()
  );

-- ============================================================
-- PART 8: MODULE TABLES — STÉRILISATION
-- ============================================================

CREATE TABLE IF NOT EXISTS public.sterilization_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  cycle_number TEXT NOT NULL,
  sterilizer_id TEXT,
  method TEXT NOT NULL DEFAULT 'autoclave',
  temperature DECIMAL(5,1),
  pressure DECIMAL(5,2),
  duration_minutes INTEGER,
  load_description TEXT,
  items_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  performed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  validated_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  pass_fail TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sterilization_cycles_organization_id ON public.sterilization_cycles(organization_id);
CREATE INDEX IF NOT EXISTS idx_sterilization_cycles_status ON public.sterilization_cycles(status);

ALTER TABLE public.sterilization_cycles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sterilization_cycles_all" ON public.sterilization_cycles;
CREATE POLICY "sterilization_cycles_all" ON public.sterilization_cycles
  FOR ALL USING (
    public.belongs_to_org(organization_id)
    OR public.is_platform_admin()
  )
  WITH CHECK (
    public.belongs_to_org(organization_id)
    OR public.is_platform_admin()
  );

-- ============================================================
-- PART 9: MODULE TABLES — AMBULANCE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.ambulance_fleet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  vehicle_number TEXT NOT NULL,
  vehicle_type TEXT NOT NULL DEFAULT 'basic_life_support',
  license_plate TEXT,
  status TEXT NOT NULL DEFAULT 'available',
  current_location JSONB,
  driver_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  paramedic_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
  equipment_checklist JSONB DEFAULT '{}'::jsonb,
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.ambulance_dispatches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ambulance_id UUID REFERENCES public.ambulance_fleet(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  call_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dispatch_time TIMESTAMPTZ,
  arrival_time TIMESTAMPTZ,
  transport_time TIMESTAMPTZ,
  destination TEXT,
  pickup_location TEXT,
  chief_complaint TEXT,
  priority TEXT NOT NULL DEFAULT 'urgent',
  status TEXT NOT NULL DEFAULT 'dispatched',
  crew_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ambulance_fleet_organization_id ON public.ambulance_fleet(organization_id);
CREATE INDEX IF NOT EXISTS idx_ambulance_dispatches_organization_id ON public.ambulance_dispatches(organization_id);

ALTER TABLE public.ambulance_fleet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambulance_dispatches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ambulance_fleet_all" ON public.ambulance_fleet;
CREATE POLICY "ambulance_fleet_all" ON public.ambulance_fleet
  FOR ALL USING (
    public.belongs_to_org(organization_id)
    OR public.is_platform_admin()
  )
  WITH CHECK (
    public.belongs_to_org(organization_id)
    OR public.is_platform_admin()
  );

DROP POLICY IF EXISTS "ambulance_dispatches_all" ON public.ambulance_dispatches;
CREATE POLICY "ambulance_dispatches_all" ON public.ambulance_dispatches
  FOR ALL USING (
    public.belongs_to_org(organization_id)
    OR public.is_platform_admin()
  )
  WITH CHECK (
    public.belongs_to_org(organization_id)
    OR public.is_platform_admin()
  );

-- ============================================================
-- PART 10: MODULE TABLES — BIOMÉDICAL
-- ============================================================

CREATE TABLE IF NOT EXISTS public.biomedical_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  equipment_code TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'diagnostic',
  manufacturer TEXT,
  model TEXT,
  serial_number TEXT,
  purchase_date DATE,
  warranty_expiry DATE,
  location TEXT,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'operational',
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  maintenance_frequency_days INTEGER DEFAULT 365,
  calibration_date DATE,
  next_calibration_date DATE,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.biomedical_maintenance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID REFERENCES public.biomedical_equipment(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  maintenance_type TEXT NOT NULL DEFAULT 'preventive',
  performed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  performed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  description TEXT,
  parts_replaced TEXT[],
  cost DECIMAL(15,2),
  currency TEXT DEFAULT 'XOF',
  next_maintenance_date DATE,
  status TEXT NOT NULL DEFAULT 'completed',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_biomedical_equipment_organization_id ON public.biomedical_equipment(organization_id);
CREATE INDEX IF NOT EXISTS idx_biomedical_maintenance_logs_equipment_id ON public.biomedical_maintenance_logs(equipment_id);

ALTER TABLE public.biomedical_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biomedical_maintenance_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "biomedical_equipment_all" ON public.biomedical_equipment;
CREATE POLICY "biomedical_equipment_all" ON public.biomedical_equipment
  FOR ALL USING (
    public.belongs_to_org(organization_id)
    OR public.is_platform_admin()
  )
  WITH CHECK (
    public.belongs_to_org(organization_id)
    OR public.is_platform_admin()
  );

DROP POLICY IF EXISTS "biomedical_maintenance_logs_all" ON public.biomedical_maintenance_logs;
CREATE POLICY "biomedical_maintenance_logs_all" ON public.biomedical_maintenance_logs
  FOR ALL USING (
    public.belongs_to_org(organization_id)
    OR public.is_platform_admin()
  )
  WITH CHECK (
    public.belongs_to_org(organization_id)
    OR public.is_platform_admin()
  );

-- ============================================================
-- PART 11: MODULE TABLES — PHARMACIE POS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.pharmacy_pos_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE SET NULL,
  cashier_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  transaction_number TEXT NOT NULL,
  transaction_type TEXT NOT NULL DEFAULT 'sale',
  subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(15,2) DEFAULT 0,
  tax_amount DECIMAL(15,2) DEFAULT 0,
  total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'XOF',
  payment_method TEXT NOT NULL DEFAULT 'cash',
  payment_status TEXT NOT NULL DEFAULT 'paid',
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.pharmacy_pos_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES public.pharmacy_pos_transactions(id) ON DELETE CASCADE,
  item_id UUID REFERENCES public.inventory_items(id) ON DELETE SET NULL,
  medication_name TEXT NOT NULL,
  quantity DECIMAL(10,3) NOT NULL,
  unit_price DECIMAL(15,2) NOT NULL,
  discount_percent DECIMAL(5,2) DEFAULT 0,
  total_price DECIMAL(15,2) NOT NULL,
  batch_number TEXT,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pharmacy_pos_transactions_organization_id ON public.pharmacy_pos_transactions(organization_id);
CREATE INDEX IF NOT EXISTS idx_pharmacy_pos_transactions_patient_id ON public.pharmacy_pos_transactions(patient_id);
CREATE INDEX IF NOT EXISTS idx_pharmacy_pos_items_transaction_id ON public.pharmacy_pos_items(transaction_id);

ALTER TABLE public.pharmacy_pos_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacy_pos_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pharmacy_pos_transactions_select" ON public.pharmacy_pos_transactions;
CREATE POLICY "pharmacy_pos_transactions_select" ON public.pharmacy_pos_transactions
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1)
    OR (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

DROP POLICY IF EXISTS "pharmacy_pos_transactions_insert" ON public.pharmacy_pos_transactions;
CREATE POLICY "pharmacy_pos_transactions_insert" ON public.pharmacy_pos_transactions
  FOR INSERT WITH CHECK (
    public.belongs_to_org(organization_id)
    AND public.user_role() IN ('professional', 'org_admin', 'platform_admin')
  );

DROP POLICY IF EXISTS "pharmacy_pos_transactions_update" ON public.pharmacy_pos_transactions;
CREATE POLICY "pharmacy_pos_transactions_update" ON public.pharmacy_pos_transactions
  FOR UPDATE USING (
    public.belongs_to_org(organization_id) AND public.is_org_admin()
    OR public.is_platform_admin()
  )
  WITH CHECK (
    public.belongs_to_org(organization_id) AND public.is_org_admin()
    OR public.is_platform_admin()
  );

DROP POLICY IF EXISTS "pharmacy_pos_transactions_delete" ON public.pharmacy_pos_transactions;
CREATE POLICY "pharmacy_pos_transactions_delete" ON public.pharmacy_pos_transactions
  FOR DELETE USING (
    public.belongs_to_org(organization_id) AND public.is_org_admin()
    OR public.is_platform_admin()
  );

DROP POLICY IF EXISTS "pharmacy_pos_items_all" ON public.pharmacy_pos_items;
CREATE POLICY "pharmacy_pos_items_all" ON public.pharmacy_pos_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.pharmacy_pos_transactions t
      WHERE t.id = transaction_id AND public.belongs_to_org(t.organization_id)
    )
    OR public.is_platform_admin()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.pharmacy_pos_transactions t
      WHERE t.id = transaction_id AND public.belongs_to_org(t.organization_id)
    )
    OR public.is_platform_admin()
  );
