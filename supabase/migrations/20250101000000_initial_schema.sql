-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Roles enum (for user metadata)
CREATE TYPE user_role AS ENUM ('admin', 'applicant', 'channel_partner', 'funder', 'migration_agent', 'education_provider', 'employer');

-- Stakeholder status
CREATE TYPE stakeholder_status AS ENUM ('pending', 'approved', 'suspended');

-- Case stage (will be populated from stages table)
-- Forecast status
CREATE TYPE forecast_status AS ENUM ('on_track', 'at_risk', 'missed');

-- Applicants table
CREATE TABLE applicants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  country TEXT,
  email TEXT NOT NULL,
  whatsapp TEXT,
  passport_url TEXT,
  degree_certificate_url TEXT,
  transcripts_url TEXT,
  ielts_status TEXT CHECK (ielts_status IN ('has_result', 'booked', 'needs_prep')),
  ielts_score NUMERIC(3,1),
  ielts_result_url TEXT,
  gpa NUMERIC(4,2),
  work_experience_years INTEGER,
  is_skilled_couple BOOLEAN DEFAULT false,
  partner_docs JSONB, -- store partner document URLs as JSON
  proof_of_funds_url TEXT,
  proof_of_funds_type TEXT CHECK (proof_of_funds_type IN ('bank_statement', 'conditional_offer')),
  pathway_discipline TEXT,
  pathway_destination TEXT,
  intake_preference TEXT,
  referring_partner_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stages (admin-configurable)
CREATE TABLE stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  default_sla_days INTEGER NOT NULL DEFAULT 7,
  required_artifacts JSONB, -- e.g., ["passport", "ielts"]
  default_owner_role user_role,
  "order" INTEGER NOT NULL, -- for sorting
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default stages (ordered)
INSERT INTO stages (name, description, default_sla_days, default_owner_role, "order") VALUES
  ('EOI Submitted', 'Expression of Interest received', 2, 'admin', 1),
  ('Internal Screening', 'Initial eligibility check', 5, 'admin', 2),
  ('IELTS Prep / IELTS Pending', 'Candidate preparing for IELTS', 30, 'applicant', 3),
  ('Conditional Funding Assessment', 'Funding application under review', 10, 'funder', 4),
  ('Application Fee Paid', 'Fee payment confirmed', 2, 'admin', 5),
  ('University Application Submitted', 'Application sent to university', 7, 'migration_agent', 6),
  ('University Offer Received', 'Offer letter received', 5, 'applicant', 7),
  ('Unconditional Funding', 'Funding fully approved', 3, 'funder', 8),
  ('Migration Agent Engaged', 'Agent assigned for visa', 2, 'migration_agent', 9),
  ('Visa Lodged', 'Visa application submitted', 10, 'migration_agent', 10),
  ('Visa Granted', 'Visa approved', 2, 'applicant', 11),
  ('Travel & Arrival', 'Candidate arrived', 5, 'applicant', 12),
  ('Enrolment Confirmed', 'Enrolled at institution', 2, 'education_provider', 13),
  ('Post-Enrolment Support Active', 'Support ongoing', 1, 'employer', 14);

-- Cases table
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  applicant_id UUID NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
  selected_pathway TEXT NOT NULL,
  target_intake TEXT NOT NULL,
  current_stage_id UUID NOT NULL REFERENCES stages(id),
  stage_entered_at TIMESTAMPTZ DEFAULT NOW(),
  stage_owner_role user_role,
  stage_owner_user_id UUID REFERENCES auth.users(id),
  sla_due_at TIMESTAMPTZ,
  forecast_status forecast_status DEFAULT 'on_track',
  notes TEXT,
  documents_status TEXT CHECK (documents_status IN ('complete', 'missing')) DEFAULT 'missing',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stakeholders (users with roles beyond applicant)
CREATE TABLE stakeholders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name TEXT NOT NULL,
  org TEXT,
  email TEXT NOT NULL,
  whatsapp TEXT,
  roles user_role[] NOT NULL DEFAULT '{}',
  status stakeholder_status DEFAULT 'pending',
  partner_code TEXT UNIQUE, -- for channel partners
  permissions JSONB, -- custom flags (e.g., can_view_aggregate_only)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Case assignments (many-to-many between cases and stakeholders)
CREATE TABLE case_assignments (
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  stakeholder_id UUID REFERENCES stakeholders(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (case_id, stakeholder_id)
);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  owner_type TEXT CHECK (owner_type IN ('applicant', 'partner')),
  document_type TEXT NOT NULL, -- 'passport', 'degree', etc.
  file_path TEXT NOT NULL,
  verified_status BOOLEAN DEFAULT false,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- IELTS Availability (scraped/seeded)
CREATE TABLE ielts_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  test_type TEXT CHECK (test_type IN ('Academic', 'General')),
  provider TEXT,
  exam_date DATE NOT NULL,
  seats_status TEXT CHECK (seats_status IN ('available', 'limited', 'full', 'unknown')),
  last_checked_at TIMESTAMPTZ DEFAULT NOW(),
  source_url TEXT,
  UNIQUE(country, city, exam_date, test_type)
);

-- Alert subscriptions for IELTS seats
CREATE TABLE ielts_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  whatsapp TEXT,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  date_range_start DATE,
  date_range_end DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log for stage changes
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'stage_changed', 'document_uploaded', etc.
  old_value JSONB,
  new_value JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ielts_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE ielts_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (simplified examples – expand as needed)

-- Applicants: users can view/edit their own record; admins can view all
CREATE POLICY "Users can view own applicant" ON applicants
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own applicant" ON applicants
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all applicants" ON applicants
  FOR SELECT USING (EXISTS (SELECT 1 FROM stakeholders WHERE user_id = auth.uid() AND 'admin' = ANY(roles) AND status = 'approved'));

-- Cases: admins see all; assigned stakeholders see assigned cases; applicants see their own
CREATE POLICY "Admins can do everything on cases" ON cases
  FOR ALL USING (EXISTS (SELECT 1 FROM stakeholders WHERE user_id = auth.uid() AND 'admin' = ANY(roles) AND status = 'approved'));
CREATE POLICY "Assigned stakeholders can view cases" ON cases
  FOR SELECT USING (EXISTS (SELECT 1 FROM case_assignments ca JOIN stakeholders s ON ca.stakeholder_id = s.id WHERE ca.case_id = cases.id AND s.user_id = auth.uid()));
CREATE POLICY "Applicants can view their own case" ON cases
  FOR SELECT USING (applicant_id IN (SELECT id FROM applicants WHERE user_id = auth.uid()));

-- Similar policies for other tables...

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_applicants_updated_at BEFORE UPDATE ON applicants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Add for other tables as needed


--**Storage policy for the documents bucket:**

CREATE POLICY "Users can upload their own documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents' AND (storage.foldername(name))[1] = 'applicants' AND (storage.foldername(name))[2] = auth.uid()::text);



CREATE POLICY "Users can insert their own case"
ON cases
FOR INSERT
TO authenticated
WITH CHECK (
  applicant_id IN (
    SELECT id FROM applicants WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can view their own case"
ON cases
FOR SELECT
TO authenticated
USING (
  applicant_id IN (
    SELECT id FROM applicants WHERE user_id = auth.uid()
  )
);


--**Documents table policies:**

CREATE POLICY "Users can insert their own documents"
ON documents
FOR INSERT
TO authenticated
WITH CHECK (
  case_id IN (
    SELECT c.id FROM cases c
    JOIN applicants a ON c.applicant_id = a.id
    WHERE a.user_id = auth.uid()
  )
);
