-- =============================================================
-- Sprint 3: Candidate Cohort Portfolio Marketplace
-- =============================================================

-- Cohorts table (groups of candidates by discipline + origin)
CREATE TABLE IF NOT EXISTS public.cohorts (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT        NOT NULL,               -- e.g. "Engineering – Kenya"
  discipline        TEXT        NOT NULL,               -- Engineering | Computer Science | Nursing | Education
  country_of_origin TEXT        NOT NULL,               -- Kenya, Philippines, Nigeria…
  destination       TEXT        NOT NULL,               -- Canada | Australia
  pathway           TEXT        NOT NULL,               -- full degree title
  candidate_count   INTEGER     NOT NULL DEFAULT 0,
  is_active         BOOLEAN     NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Anonymised candidate marketplace profiles
CREATE TABLE IF NOT EXISTS public.candidate_marketplace_profiles (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id         UUID        REFERENCES public.applicants(id) ON DELETE CASCADE,
  cohort_id            UUID        NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
  candidate_ref        TEXT        UNIQUE NOT NULL,   -- e.g. "CAND-0042" — shown in marketplace
  country              TEXT        NOT NULL,
  age_range            TEXT        NOT NULL,           -- "25–29"
  education_level      TEXT        NOT NULL,           -- "Bachelor's" | "Master's" | "Diploma"
  discipline           TEXT        NOT NULL,
  years_experience     INTEGER     NOT NULL,
  ielts_predicted_score NUMERIC(3,1),
  opportunity_score    INTEGER     CHECK (opportunity_score BETWEEN 0 AND 100),
  readiness_timeline   TEXT,                           -- "3–6 months"
  recommended_pathway  TEXT,
  is_visible           BOOLEAN     NOT NULL DEFAULT true,   -- show in public marketplace
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Marketplace interest + controlled reveal requests
CREATE TABLE IF NOT EXISTS public.marketplace_interest (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_profile_id UUID        NOT NULL REFERENCES public.candidate_marketplace_profiles(id) ON DELETE CASCADE,
  stakeholder_id       UUID        NOT NULL REFERENCES public.stakeholders(id) ON DELETE CASCADE,
  status               TEXT        NOT NULL DEFAULT 'pending'
                                   CHECK (status IN ('pending', 'approved', 'declined')),
  stakeholder_note     TEXT,                           -- reason for interest
  expressed_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at          TIMESTAMPTZ,
  UNIQUE (candidate_profile_id, stakeholder_id)
);

-- ── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_cohorts_discipline       ON public.cohorts(discipline);
CREATE INDEX IF NOT EXISTS idx_cohorts_destination      ON public.cohorts(destination);
CREATE INDEX IF NOT EXISTS idx_cohorts_origin           ON public.cohorts(country_of_origin);
CREATE INDEX IF NOT EXISTS idx_profiles_cohort          ON public.candidate_marketplace_profiles(cohort_id);
CREATE INDEX IF NOT EXISTS idx_profiles_visible         ON public.candidate_marketplace_profiles(is_visible);
CREATE INDEX IF NOT EXISTS idx_interest_profile         ON public.marketplace_interest(candidate_profile_id);
CREATE INDEX IF NOT EXISTS idx_interest_stakeholder     ON public.marketplace_interest(stakeholder_id);
CREATE INDEX IF NOT EXISTS idx_interest_status          ON public.marketplace_interest(status);

-- ── Auto-update cohort candidate_count ──────────────────────────────────────
CREATE OR REPLACE FUNCTION sync_cohort_candidate_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.cohorts SET candidate_count = candidate_count + 1,
           updated_at = NOW() WHERE id = NEW.cohort_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.cohorts SET candidate_count = GREATEST(candidate_count - 1, 0),
           updated_at = NOW() WHERE id = OLD.cohort_id;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_cohort_count ON public.candidate_marketplace_profiles;
CREATE TRIGGER trg_sync_cohort_count
AFTER INSERT OR DELETE ON public.candidate_marketplace_profiles
FOR EACH ROW EXECUTE FUNCTION sync_cohort_candidate_count();

-- ── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE public.cohorts                         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_marketplace_profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_interest            ENABLE ROW LEVEL SECURITY;

-- Cohorts: public read (active only)
CREATE POLICY cohorts_public_read ON public.cohorts
  FOR SELECT USING (is_active = true);

-- Cohorts: admin full access
CREATE POLICY cohorts_admin_all ON public.cohorts
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Profiles: public read (visible only — anonymous data, no PII)
CREATE POLICY profiles_public_read ON public.candidate_marketplace_profiles
  FOR SELECT USING (is_visible = true);

-- Profiles: admin full access
CREATE POLICY profiles_admin_all ON public.candidate_marketplace_profiles
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Interest: approved stakeholders can insert their own records
CREATE POLICY interest_stakeholder_insert ON public.marketplace_interest
  FOR INSERT WITH CHECK (
    stakeholder_id IN (
      SELECT id FROM public.stakeholders
      WHERE user_id = auth.uid() AND status = 'approved'
    )
  );

-- Interest: stakeholders read their own, admins read all
CREATE POLICY interest_stakeholder_read ON public.marketplace_interest
  FOR SELECT USING (
    stakeholder_id IN (
      SELECT id FROM public.stakeholders WHERE user_id = auth.uid()
    )
    OR is_admin(auth.uid())
  );

-- Interest: candidates read and update interest in their own profile
CREATE POLICY interest_candidate_read ON public.marketplace_interest
  FOR SELECT USING (
    candidate_profile_id IN (
      SELECT p.id
      FROM public.candidate_marketplace_profiles p
      JOIN public.applicants a ON p.applicant_id = a.id
      WHERE a.user_id = auth.uid()
    )
  );

CREATE POLICY interest_candidate_update ON public.marketplace_interest
  FOR UPDATE USING (
    candidate_profile_id IN (
      SELECT p.id
      FROM public.candidate_marketplace_profiles p
      JOIN public.applicants a ON p.applicant_id = a.id
      WHERE a.user_id = auth.uid()
    )
  );

-- Interest: admin full access
CREATE POLICY interest_admin_all ON public.marketplace_interest
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- ── Seed cohorts ─────────────────────────────────────────────────────────────
INSERT INTO public.cohorts (name, discipline, country_of_origin, destination, pathway)
VALUES
  ('Engineering – Kenya',         'Engineering',      'Kenya',        'Canada',    'Master of Engineering Practice'),
  ('Engineering – Philippines',   'Engineering',      'Philippines',  'Canada',    'Master of Engineering Practice'),
  ('Computer Science – Nigeria',  'Computer Science', 'Nigeria',      'Canada',    'Master of Computer Science'),
  ('Computer Science – India',    'Computer Science', 'India',        'Canada',    'Master of Computer Science'),
  ('Nursing – Sri Lanka',         'Nursing',          'Sri Lanka',    'Australia', 'Master of Nursing Practice'),
  ('Nursing – Ghana',             'Nursing',          'Ghana',        'Australia', 'Master of Nursing Practice'),
  ('Teaching – Zimbabwe',         'Education',        'Zimbabwe',     'Canada',    'Bachelor of Teaching (STEM)'),
  ('Teaching – South Africa',     'Education',        'South Africa', 'Canada',    'Bachelor of Teaching (STEM)')
ON CONFLICT DO NOTHING;
