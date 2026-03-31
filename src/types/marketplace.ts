// Sprint 3 — Candidate Cohort Portfolio Marketplace types

export interface Cohort {
  id: string
  name: string
  discipline: string
  country_of_origin: string
  destination: string
  pathway: string
  candidate_count: number
  is_active: boolean
  created_at: string
  updated_at: string
}

/** Anonymous candidate profile shown in the marketplace (no PII) */
export interface CandidateProfile {
  id: string
  applicant_id: string | null
  cohort_id: string
  candidate_ref: string           // e.g. "CAND-0042"
  country: string
  age_range: string               // e.g. "25–29"
  education_level: string
  discipline: string
  years_experience: number
  ielts_predicted_score: number | null
  opportunity_score: number | null
  readiness_timeline: string | null
  recommended_pathway: string | null
  is_visible: boolean
  created_at: string
  updated_at: string
  cohorts?: Cohort
}

export type InterestStatus = 'pending' | 'approved' | 'declined'

export interface MarketplaceInterest {
  id: string
  candidate_profile_id: string
  stakeholder_id: string
  status: InterestStatus
  stakeholder_note: string | null
  expressed_at: string
  resolved_at: string | null
  candidate_marketplace_profiles?: CandidateProfile
  stakeholders?: { name: string; org: string; roles: string[] }
}

/** Profile returned when a reveal is approved — includes PII from applicants table */
export interface RevealedCandidateProfile extends CandidateProfile {
  applicants: {
    full_name: string
    email: string
    whatsapp: string | null
    ielts_score: number | null
    ielts_status: string | null
    work_experience_years: number | null
    pathway_discipline: string | null
    pathway_destination: string | null
  }
}

/** Shape used in API response for GET /api/marketplace/cohorts */
export interface CohortListResponse {
  cohorts: Cohort[]
}

/** Shape used in API response for GET /api/marketplace/cohorts/[cohort] */
export interface CohortDetailResponse {
  cohort: Cohort
  candidates: CandidateProfile[]
}

/** Shape sent to POST /api/marketplace/interest */
export interface ExpressInterestPayload {
  candidate_profile_id: string
  stakeholder_note?: string
}

/** Shape sent to POST /api/marketplace/reveal */
export interface ResolveRevealPayload {
  interest_id: string
  action: 'approved' | 'declined'
}
