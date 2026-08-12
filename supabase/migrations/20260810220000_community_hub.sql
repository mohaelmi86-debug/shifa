-- ============================================================
-- SHIFA HEALTH OS — Community Health Hub
-- NGO Partnerships, Marketplace, Services, Funding
-- ============================================================

-- ============================================================
-- 1. ENUMS
-- ============================================================

DROP TYPE IF EXISTS public.partnership_status CASCADE;
CREATE TYPE public.partnership_status AS ENUM ('active', 'pending', 'suspended', 'ended');

DROP TYPE IF EXISTS public.funding_status CASCADE;
CREATE TYPE public.funding_status AS ENUM ('open', 'funded', 'closed', 'cancelled');

DROP TYPE IF EXISTS public.marketplace_category CASCADE;
CREATE TYPE public.marketplace_category AS ENUM ('equipment', 'medication', 'supplies', 'diagnostics', 'digital', 'services', 'other');

DROP TYPE IF EXISTS public.service_type CASCADE;
CREATE TYPE public.service_type AS ENUM ('consultation', 'screening', 'vaccination', 'lab', 'imaging', 'mental_health', 'nutrition', 'rehabilitation', 'other');

-- ============================================================
-- 2. TABLES
-- ============================================================

-- NGO Partnerships
CREATE TABLE IF NOT EXISTS public.ngo_partnerships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  partner_name TEXT NOT NULL,
  partner_type TEXT NOT NULL DEFAULT 'ngo',
  country_code TEXT DEFAULT 'SN',
  focus_areas TEXT[] DEFAULT ARRAY[]::TEXT[],
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  status public.partnership_status DEFAULT 'pending'::public.partnership_status,
  start_date DATE,
  end_date DATE,
  description TEXT,
  budget_allocated NUMERIC(14,2) DEFAULT 0,
  beneficiaries_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Health Service Listings
CREATE TABLE IF NOT EXISTS public.health_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  service_type public.service_type DEFAULT 'consultation'::public.service_type,
  description TEXT,
  price NUMERIC(10,2),
  currency TEXT DEFAULT 'XOF',
  is_free BOOLEAN DEFAULT false,
  is_teleconsult BOOLEAN DEFAULT false,
  duration_minutes INTEGER DEFAULT 30,
  available_days TEXT[] DEFAULT ARRAY[]::TEXT[],
  location TEXT,
  is_active BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Health Product Marketplace
CREATE TABLE IF NOT EXISTS public.marketplace_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  category public.marketplace_category DEFAULT 'other'::public.marketplace_category,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'XOF',
  unit TEXT DEFAULT 'unité',
  stock_quantity INTEGER DEFAULT 0,
  min_order_quantity INTEGER DEFAULT 1,
  image_url TEXT,
  is_certified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Collaborative Funding Campaigns
CREATE TABLE IF NOT EXISTS public.funding_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  goal_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  raised_amount NUMERIC(14,2) DEFAULT 0,
  currency TEXT DEFAULT 'XOF',
  status public.funding_status DEFAULT 'open'::public.funding_status,
  start_date DATE,
  end_date DATE,
  beneficiary_type TEXT,
  region TEXT,
  image_url TEXT,
  donor_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Funding Contributions
CREATE TABLE IF NOT EXISTS public.funding_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.funding_campaigns(id) ON DELETE CASCADE,
  contributor_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  contributor_org_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  amount NUMERIC(14,2) NOT NULL,
  currency TEXT DEFAULT 'XOF',
  is_anonymous BOOLEAN DEFAULT false,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_ngo_partnerships_org ON public.ngo_partnerships(organization_id);
CREATE INDEX IF NOT EXISTS idx_ngo_partnerships_status ON public.ngo_partnerships(status);
CREATE INDEX IF NOT EXISTS idx_health_services_org ON public.health_services(organization_id);
CREATE INDEX IF NOT EXISTS idx_health_services_type ON public.health_services(service_type);
CREATE INDEX IF NOT EXISTS idx_marketplace_products_category ON public.marketplace_products(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_products_seller ON public.marketplace_products(seller_organization_id);
CREATE INDEX IF NOT EXISTS idx_funding_campaigns_status ON public.funding_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_funding_contributions_campaign ON public.funding_contributions(campaign_id);

-- ============================================================
-- 4. ENABLE RLS
-- ============================================================

ALTER TABLE public.ngo_partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funding_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funding_contributions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 5. RLS POLICIES
-- ============================================================

-- NGO Partnerships: public read, authenticated write
DROP POLICY IF EXISTS "public_read_ngo_partnerships" ON public.ngo_partnerships;
CREATE POLICY "public_read_ngo_partnerships" ON public.ngo_partnerships
FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "auth_manage_ngo_partnerships" ON public.ngo_partnerships;
CREATE POLICY "auth_manage_ngo_partnerships" ON public.ngo_partnerships
FOR ALL TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());

-- Health Services: public read, authenticated write
DROP POLICY IF EXISTS "public_read_health_services" ON public.health_services;
CREATE POLICY "public_read_health_services" ON public.health_services
FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "auth_manage_health_services" ON public.health_services;
CREATE POLICY "auth_manage_health_services" ON public.health_services
FOR ALL TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());

-- Marketplace Products: public read, authenticated write
DROP POLICY IF EXISTS "public_read_marketplace_products" ON public.marketplace_products;
CREATE POLICY "public_read_marketplace_products" ON public.marketplace_products
FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "auth_manage_marketplace_products" ON public.marketplace_products;
CREATE POLICY "auth_manage_marketplace_products" ON public.marketplace_products
FOR ALL TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());

-- Funding Campaigns: public read, authenticated write
DROP POLICY IF EXISTS "public_read_funding_campaigns" ON public.funding_campaigns;
CREATE POLICY "public_read_funding_campaigns" ON public.funding_campaigns
FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "auth_manage_funding_campaigns" ON public.funding_campaigns;
CREATE POLICY "auth_manage_funding_campaigns" ON public.funding_campaigns
FOR ALL TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());

-- Funding Contributions: public read, authenticated write
DROP POLICY IF EXISTS "public_read_funding_contributions" ON public.funding_contributions;
CREATE POLICY "public_read_funding_contributions" ON public.funding_contributions
FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "auth_manage_funding_contributions" ON public.funding_contributions;
CREATE POLICY "auth_manage_funding_contributions" ON public.funding_contributions
FOR ALL TO authenticated USING (contributor_id = auth.uid()) WITH CHECK (contributor_id = auth.uid());

-- ============================================================
-- 6. SAMPLE DATA
-- ============================================================

DO $$
DECLARE
  existing_org_id UUID;
  existing_user_id UUID;
  campaign1_id UUID := gen_random_uuid();
  campaign2_id UUID := gen_random_uuid();
  campaign3_id UUID := gen_random_uuid();
BEGIN
  SELECT id INTO existing_org_id FROM public.organizations LIMIT 1;
  SELECT id INTO existing_user_id FROM public.user_profiles LIMIT 1;

  -- NGO Partnerships
  INSERT INTO public.ngo_partnerships (id, organization_id, partner_name, partner_type, country_code, focus_areas, contact_name, contact_email, status, start_date, description, budget_allocated, beneficiaries_count, created_by)
  VALUES
    (gen_random_uuid(), existing_org_id, 'Médecins Sans Frontières', 'ngo', 'SN', ARRAY['urgences','chirurgie','nutrition'], 'Dr. Fatou Ndiaye', 'fndiaye@msf.org', 'active'::public.partnership_status, '2024-01-01', 'Partenariat pour les soins d''urgence et la chirurgie reconstructive dans les zones rurales.', 45000000, 1200, existing_user_id),
    (gen_random_uuid(), existing_org_id, 'UNICEF Sénégal', 'un_agency', 'SN', ARRAY['vaccination','nutrition','sante_maternelle'], 'Aminata Sow', 'asow@unicef.org', 'active'::public.partnership_status, '2024-03-15', 'Programme de vaccination et nutrition infantile couvrant 5 régions.', 120000000, 8500, existing_user_id),
    (gen_random_uuid(), existing_org_id, 'OMS Bureau Régional', 'un_agency', 'SN', ARRAY['epidemiologie','formation','politiques_sante'], 'Dr. Ibrahima Fall', 'ifall@who.int', 'active'::public.partnership_status, '2023-06-01', 'Renforcement des capacités épidémiologiques et formation du personnel de santé.', 75000000, 350, existing_user_id),
    (gen_random_uuid(), existing_org_id, 'Croix-Rouge Sénégalaise', 'ngo', 'SN', ARRAY['premiers_secours','sang','catastrophes'], 'Moussa Diallo', 'mdiallo@croixrouge.sn', 'active'::public.partnership_status, '2024-02-01', 'Collecte de sang et formation aux premiers secours communautaires.', 18000000, 2300, existing_user_id),
    (gen_random_uuid(), existing_org_id, 'Plan International', 'ngo', 'SN', ARRAY['sante_adolescents','education','genre'], 'Rokhaya Mbaye', 'rmbaye@plan.org', 'pending'::public.partnership_status, '2025-01-01', 'Santé reproductive des adolescentes et lutte contre les mariages précoces.', 32000000, 0, existing_user_id)
  ON CONFLICT (id) DO NOTHING;

  -- Health Services
  INSERT INTO public.health_services (id, organization_id, name, service_type, description, price, is_free, is_teleconsult, duration_minutes, available_days, location, is_active, created_by)
  VALUES
    (gen_random_uuid(), existing_org_id, 'Consultation générale', 'consultation'::public.service_type, 'Consultation médicale générale avec bilan de santé complet.', 5000, false, false, 30, ARRAY['lun','mar','mer','jeu','ven'], 'Dakar, Plateau', true, existing_user_id),
    (gen_random_uuid(), existing_org_id, 'Dépistage VIH gratuit', 'screening'::public.service_type, 'Test de dépistage rapide VIH, confidentiel et gratuit.', 0, true, false, 20, ARRAY['lun','mer','ven'], 'Dakar, Médina', true, existing_user_id),
    (gen_random_uuid(), existing_org_id, 'Vaccination enfants 0-5 ans', 'vaccination'::public.service_type, 'Programme EPI complet pour les enfants de 0 à 5 ans.', 0, true, false, 15, ARRAY['mar','jeu'], 'Thiès, Centre de santé', true, existing_user_id),
    (gen_random_uuid(), existing_org_id, 'Téléconsultation psychiatrique', 'mental_health'::public.service_type, 'Consultation psychiatrique en ligne avec spécialiste certifié.', 15000, false, true, 45, ARRAY['lun','mar','mer','jeu','ven','sam'], 'En ligne', true, existing_user_id),
    (gen_random_uuid(), existing_org_id, 'Bilan nutritionnel', 'nutrition'::public.service_type, 'Évaluation nutritionnelle complète avec plan alimentaire personnalisé.', 8000, false, false, 60, ARRAY['lun','mer','ven'], 'Saint-Louis', true, existing_user_id),
    (gen_random_uuid(), existing_org_id, 'Kinésithérapie', 'rehabilitation'::public.service_type, 'Séances de rééducation fonctionnelle et kinésithérapie.', 12000, false, false, 45, ARRAY['lun','mar','mer','jeu','ven'], 'Ziguinchor', true, existing_user_id)
  ON CONFLICT (id) DO NOTHING;

  -- Marketplace Products
  INSERT INTO public.marketplace_products (id, seller_organization_id, name, category, description, price, unit, stock_quantity, is_certified, is_active, created_by)
  VALUES
    (gen_random_uuid(), existing_org_id, 'Tensiomètre numérique', 'equipment'::public.marketplace_category, 'Tensiomètre bras certifié CE, mémoire 60 mesures, détection arythmie.', 45000, 'unité', 150, true, true, existing_user_id),
    (gen_random_uuid(), existing_org_id, 'Glucomètre + 50 bandelettes', 'diagnostics'::public.marketplace_category, 'Kit complet de surveillance glycémique, résultat en 5 secondes.', 28000, 'kit', 200, true, true, existing_user_id),
    (gen_random_uuid(), existing_org_id, 'Masques chirurgicaux (boîte 50)', 'supplies'::public.marketplace_category, 'Masques 3 plis certifiés Type II, filtration 98%.', 3500, 'boîte', 5000, true, true, existing_user_id),
    (gen_random_uuid(), existing_org_id, 'Stéthoscope Littmann Classic', 'equipment'::public.marketplace_category, 'Stéthoscope professionnel double pavillon, garantie 5 ans.', 85000, 'unité', 45, true, true, existing_user_id),
    (gen_random_uuid(), existing_org_id, 'Paracétamol 500mg (boîte 100)', 'medication'::public.marketplace_category, 'Paracétamol générique certifié, conditionnement hospitalier.', 4200, 'boîte', 2000, true, true, existing_user_id),
    (gen_random_uuid(), existing_org_id, 'Oxymètre de pouls', 'diagnostics'::public.marketplace_category, 'Oxymètre digital compact, mesure SpO2 et fréquence cardiaque.', 18000, 'unité', 300, true, true, existing_user_id),
    (gen_random_uuid(), existing_org_id, 'Logiciel dossier patient (licence)', 'digital'::public.marketplace_category, 'Licence annuelle logiciel DMP certifié HDS, support inclus.', 250000, 'licence/an', 999, true, true, existing_user_id),
    (gen_random_uuid(), existing_org_id, 'Gants latex (boîte 100)', 'supplies'::public.marketplace_category, 'Gants d''examen latex non poudrés, taille M.', 5500, 'boîte', 3000, true, true, existing_user_id)
  ON CONFLICT (id) DO NOTHING;

  -- Funding Campaigns
  INSERT INTO public.funding_campaigns (id, organization_id, title, description, goal_amount, raised_amount, status, start_date, end_date, beneficiary_type, region, donor_count, created_by)
  VALUES
    (campaign1_id, existing_org_id, 'Équipement maternité rurale — Kolda', 'Acquisition d''équipements obstétriques pour 3 maternités rurales de la région de Kolda : tables d''accouchement, incubateurs, moniteurs fœtaux.', 18000000, 12400000, 'open'::public.funding_status, '2025-01-01', '2025-06-30', 'Femmes enceintes', 'Kolda', 87, existing_user_id),
    (campaign2_id, existing_org_id, 'Caravane de dépistage — Casamance', 'Financement d''une caravane médicale mobile pour le dépistage du diabète, hypertension et VIH dans 20 villages de Casamance.', 8500000, 8500000, 'funded'::public.funding_status, '2024-09-01', '2024-12-31', 'Population générale', 'Ziguinchor', 134, existing_user_id),
    (campaign3_id, existing_org_id, 'Bourses formation infirmiers — Thiès', 'Programme de bourses pour 25 infirmiers issus de milieux défavorisés de la région de Thiès, formation de 2 ans.', 25000000, 9750000, 'open'::public.funding_status, '2025-02-01', '2025-12-31', 'Étudiants en soins infirmiers', 'Thiès', 52, existing_user_id),
    (gen_random_uuid(), existing_org_id, 'Ambulances communautaires — Louga', 'Acquisition de 2 ambulances médicalisées pour les communes rurales de Louga, avec formation des conducteurs.', 35000000, 4200000, 'open'::public.funding_status, '2025-03-01', '2025-09-30', 'Population rurale', 'Louga', 29, existing_user_id)
  ON CONFLICT (id) DO NOTHING;

  -- Sample contributions
  IF existing_user_id IS NOT NULL THEN
    INSERT INTO public.funding_contributions (campaign_id, contributor_id, amount, currency, message)
    VALUES
      (campaign1_id, existing_user_id, 500000, 'XOF', 'Excellent projet, bon courage à l''équipe !'),
      (campaign3_id, existing_user_id, 250000, 'XOF', 'Investir dans la formation, c''est investir dans l''avenir.')
    ON CONFLICT (id) DO NOTHING;
  END IF;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Community hub sample data error: %', SQLERRM;
END $$;
