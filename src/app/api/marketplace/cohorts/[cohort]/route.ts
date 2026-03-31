import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/marketplace/cohorts/[cohort]
// Returns cohort detail + anonymous candidate profiles within it
export async function GET(
  _request: NextRequest,
  { params }: { params: { cohort: string } },
) {
  const supabase = createClient()
  const cohortId = params.cohort

  const { data: cohort, error: cohortError } = await supabase
    .from('cohorts')
    .select('*')
    .eq('id', cohortId)
    .eq('is_active', true)
    .single()

  if (cohortError || !cohort) {
    return NextResponse.json({ error: 'Cohort not found' }, { status: 404 })
  }

  const { data: candidates, error: candidatesError } = await supabase
    .from('candidate_marketplace_profiles')
    .select('*')
    .eq('cohort_id', cohortId)
    .eq('is_visible', true)
    .order('opportunity_score', { ascending: false })

  if (candidatesError) {
    return NextResponse.json({ error: candidatesError.message }, { status: 500 })
  }

  return NextResponse.json({ cohort, candidates: candidates ?? [] })
}
