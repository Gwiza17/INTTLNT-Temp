import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/admin/populate-sample-data
// Admin endpoint to populate the database with sample candidate data
export async function POST(request: NextRequest) {
  const supabase = createClient()

  // Check if user is authenticated admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
  }

  // Verify admin role
  const { data: stakeholder } = await supabase
    .from('stakeholders')
    .select('roles')
    .eq('user_id', user.id)
    .eq('status', 'approved')
    .single()

  if (!stakeholder || !stakeholder.roles.includes('admin')) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    // Get existing cohorts from database
    const { data: cohorts } = await supabase
      .from('cohorts')
      .select('id, discipline, name')
      .eq('is_active', true)

    if (!cohorts || cohorts.length === 0) {
      return NextResponse.json({ error: 'No active cohorts found. Please run migrations first.' }, { status: 400 })
    }

    let totalCreated = 0
    const results = []

    for (const cohort of cohorts) {
      // Generate candidates for this cohort
      const candidateCount = Math.floor(Math.random() * 10) + 8 // 8-17 candidates per cohort
      const sampleCandidates = Array.from({ length: candidateCount }, (_, index) => {
        const countries = cohort.name.includes('Kenya') ? ['Kenya'] :
                         cohort.name.includes('Philippines') ? ['Philippines'] :
                         cohort.name.includes('Nigeria') ? ['Nigeria'] :
                         cohort.name.includes('India') ? ['India'] :
                         cohort.name.includes('Sri Lanka') ? ['Sri Lanka'] :
                         cohort.name.includes('Ghana') ? ['Ghana'] :
                         cohort.name.includes('Zimbabwe') ? ['Zimbabwe'] :
                         cohort.name.includes('South Africa') ? ['South Africa'] :
                         ['Kenya', 'Philippines', 'Nigeria'] // fallback

        const country = countries[Math.floor(Math.random() * countries.length)]

        // Generate realistic data based on cohort
        const educationLevels = ["Bachelor's", "Master's", "Diploma"]
        const ageRanges = ['22-24', '25-29', '30-34', '25-27', '28-32']
        const readinessTimelines = ['1-3 months', '3-6 months', '6-12 months', '2-3 months']

        const educationLevel = educationLevels[Math.floor(Math.random() * educationLevels.length)]
        const ageRange = ageRanges[Math.floor(Math.random() * ageRanges.length)]
        const readinessTimeline = readinessTimelines[Math.floor(Math.random() * readinessTimelines.length)]

        // Generate experience based on age and education
        const baseExperience = educationLevel.includes('Master') ? 3 : 1
        const yearsExperience = baseExperience + Math.floor(Math.random() * 6)

        // Generate IELTS score (realistic distribution)
        const ieltsBase = 5.5 + (Math.random() * 3) // 5.5 to 8.5
        const ieltsScore = Math.round(ieltsBase * 2) / 2 // Round to nearest 0.5

        // Generate opportunity score
        let opportunityScore = 50
        if (ieltsScore >= 7.0) opportunityScore += 20
        if (ieltsScore >= 8.0) opportunityScore += 10
        if (yearsExperience >= 5) opportunityScore += 15
        if (educationLevel.includes('Master')) opportunityScore += 10
        
        opportunityScore += Math.floor((Math.random() - 0.5) * 20)
        opportunityScore = Math.max(35, Math.min(95, opportunityScore))

        // Get pathway based on discipline
        const pathwaysByDiscipline: Record<string, string[]> = {
          'Engineering': ['Master of Engineering Practice', 'Graduate Diploma in Engineering'],
          'Computer Science': ['Master of Computer Science', 'Master of Information Technology'],
          'Nursing': ['Master of Nursing Practice', 'Bachelor of Nursing'],
          'Education': ['Bachelor of Teaching (STEM)', 'Master of Education']
        }

        const pathways = pathwaysByDiscipline[cohort.discipline] || ['General Program']
        const recommendedPathway = pathways[Math.floor(Math.random() * pathways.length)]

        const candidateRef = `CAND-${String(1000 + totalCreated + index + 1).padStart(4, '0')}`

        return {
          cohort_id: cohort.id,
          candidate_ref: candidateRef,
          country,
          age_range: ageRange,
          education_level: educationLevel,
          discipline: cohort.discipline,
          years_experience: yearsExperience,
          ielts_predicted_score: ieltsScore,
          opportunity_score: opportunityScore,
          readiness_timeline: readinessTimeline,
          recommended_pathway: recommendedPathway,
          is_visible: true
        }
      })

      // Insert candidate profiles
      const { data: createdProfiles, error } = await supabase
        .from('candidate_marketplace_profiles')
        .insert(sampleCandidates)
        .select('id, candidate_ref')

      if (error) {
        console.error('Error creating profiles for cohort', cohort.id, error)
        results.push({
          cohort: cohort.name,
          success: false,
          error: error.message,
          count: 0
        })
      } else {
        totalCreated += createdProfiles?.length || 0
        results.push({
          cohort: cohort.name,
          success: true,
          count: createdProfiles?.length || 0,
          profiles: createdProfiles?.map(p => p.candidate_ref) || []
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully populated ${totalCreated} candidate profiles`,
      totalCreated,
      results
    })

  } catch (error) {
    console.error('Error populating sample data:', error)
    return NextResponse.json({ 
      error: 'Failed to populate sample data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE /api/admin/populate-sample-data
// Remove all sample candidate profiles
export async function DELETE(request: NextRequest) {
  const supabase = createClient()

  // Check if user is authenticated admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
  }

  // Verify admin role
  const { data: stakeholder } = await supabase
    .from('stakeholders')
    .select('roles')
    .eq('user_id', user.id)
    .eq('status', 'approved')
    .single()

  if (!stakeholder || !stakeholder.roles.includes('admin')) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    // Delete all candidate profiles where candidate_ref starts with CAND-
    const { data: deleted, error } = await supabase
      .from('candidate_marketplace_profiles')
      .delete()
      .like('candidate_ref', 'CAND-%')
      .select('candidate_ref')

    if (error) {
      return NextResponse.json({ 
        error: 'Failed to delete sample data',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Deleted ${deleted?.length || 0} sample candidate profiles`,
      deletedCount: deleted?.length || 0,
      deletedRefs: deleted?.map(d => d.candidate_ref) || []
    })

  } catch (error) {
    console.error('Error deleting sample data:', error)
    return NextResponse.json({ 
      error: 'Failed to delete sample data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
