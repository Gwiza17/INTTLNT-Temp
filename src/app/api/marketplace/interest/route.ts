import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { ExpressInterestPayload } from '@/types/marketplace'

// POST /api/marketplace/interest
// Authenticated stakeholder expresses interest in an anonymous candidate
export async function POST(request: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
  }

  // Confirm caller is an approved stakeholder
  const { data: stakeholder } = await supabase
    .from('stakeholders')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'approved')
    .single()

  if (!stakeholder) {
    return NextResponse.json({ error: 'Not an approved stakeholder' }, { status: 403 })
  }

  const body: ExpressInterestPayload = await request.json()
  const { candidate_profile_id, stakeholder_note } = body

  if (!candidate_profile_id) {
    return NextResponse.json({ error: 'candidate_profile_id is required' }, { status: 400 })
  }

  // Confirm candidate profile exists and is visible
  const { data: profile } = await supabase
    .from('candidate_marketplace_profiles')
    .select('id')
    .eq('id', candidate_profile_id)
    .eq('is_visible', true)
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'Candidate profile not found' }, { status: 404 })
  }

  const { data: interest, error } = await supabase
    .from('marketplace_interest')
    .upsert(
      {
        candidate_profile_id,
        stakeholder_id: stakeholder.id,
        stakeholder_note: stakeholder_note ?? null,
        status: 'pending',
      },
      { onConflict: 'candidate_profile_id,stakeholder_id', ignoreDuplicates: false },
    )
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ interest }, { status: 201 })
}

// GET /api/marketplace/interest
// Returns all interest records for the authenticated stakeholder
export async function GET(_request: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
  }

  const { data: stakeholder } = await supabase
    .from('stakeholders')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'approved')
    .single()

  if (!stakeholder) {
    return NextResponse.json({ error: 'Not an approved stakeholder' }, { status: 403 })
  }

  const { data: interests, error } = await supabase
    .from('marketplace_interest')
    .select(`
      *,
      candidate_marketplace_profiles (
        candidate_ref, country, discipline, years_experience,
        ielts_predicted_score, opportunity_score, readiness_timeline,
        recommended_pathway,
        cohorts ( name, destination, pathway )
      )
    `)
    .eq('stakeholder_id', stakeholder.id)
    .order('expressed_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ interests: interests ?? [] })
}
