import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { ResolveRevealPayload } from '@/types/marketplace'
import { sendRevealNotification } from '@/lib/utils/notifications'

// POST /api/marketplace/reveal
// Candidate approves or declines a stakeholder's reveal request
export async function POST(request: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
  }

  const body: ResolveRevealPayload = await request.json()
  const { interest_id, action } = body

  if (!interest_id || !['approved', 'declined'].includes(action)) {
    return NextResponse.json({ error: 'interest_id and valid action are required' }, { status: 400 })
  }

  // Verify the caller owns the candidate profile linked to this interest record
  const { data: interest } = await supabase
    .from('marketplace_interest')
    .select(`
      id, status,
      candidate_marketplace_profiles (
        id, applicant_id,
        applicants ( user_id )
      )
    `)
    .eq('id', interest_id)
    .single()

  if (!interest) {
    return NextResponse.json({ error: 'Interest record not found' }, { status: 404 })
  }

  const profile = interest.candidate_marketplace_profiles as any
  const candidateUserId = profile?.applicants?.user_id

  if (candidateUserId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (interest.status !== 'pending') {
    return NextResponse.json({ error: 'Interest already resolved' }, { status: 409 })
  }

  const { data: updated, error } = await supabase
    .from('marketplace_interest')
    .update({ status: action, resolved_at: new Date().toISOString() })
    .eq('id', interest_id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Send email notification to stakeholder (async, don't wait)
  try {
    // Get full data for notification
    const { data: notificationData } = await supabase
      .from('marketplace_interest')
      .select(`
        stakeholder_id,
        candidate_marketplace_profiles (
          candidate_ref, discipline,
          cohorts (name),
          applicants (full_name, email, whatsapp)
        ),
        stakeholders (
          name, org, email,
          user_id,
          users:user_id (email)
        )
      `)
      .eq('id', interest_id)
      .single()

    if (notificationData) {
      const candidate = notificationData.candidate_marketplace_profiles as any
      const stakeholder = notificationData.stakeholders as any
      const applicant = candidate?.applicants
      const cohort = candidate?.cohorts
      
      // Get stakeholder email (either from stakeholder table or auth.users)
      const stakeholderEmail = stakeholder?.email || stakeholder?.users?.email

      if (stakeholderEmail && applicant && cohort) {
        // Send notification asynchronously
        sendRevealNotification({
          stakeholderEmail,
          stakeholderName: stakeholder.name,
          candidateRef: candidate.candidate_ref,
          cohortName: cohort.name,
          status: action as 'approved' | 'declined',
          // Only include contact info if approved
          ...(action === 'approved' ? {
            candidateName: applicant.full_name,
            candidateEmail: applicant.email,
            candidatePhone: applicant.whatsapp,
          } : {}),
        }).catch(emailError => {
          console.error('Failed to send reveal notification email:', emailError)
          // Don't fail the API call if email fails
        })
      }
    }
  } catch (notificationError) {
    console.error('Error preparing reveal notification:', notificationError)
    // Don't fail the API call if notification preparation fails
  }

  return NextResponse.json({ interest: updated })
}
