import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ForecastBadge } from '@/components/cases/ForecastBadge'

export default async function EducationProviderDashboard() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get provider's stakeholder id
  const { data: stakeholder } = await supabase
    .from('stakeholders')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'approved')
    .single()

  if (!stakeholder) {
    return <div>Not authorized as education provider</div>
  }

  // Fetch cases assigned to this provider, grouped by intake maybe
  const { data: assignments } = await supabase
    .from('case_assignments')
    .select(
      `
      case_id,
      cases (
        id,
        selected_pathway,
        target_intake,
        current_stage_id,
        stage_entered_at,
        forecast_status,
        applicants (full_name, email, ielts_status, ielts_score, gpa)
      )
    `,
    )
    .eq('stakeholder_id', stakeholder.id)
    .order('cases(target_intake)', { ascending: true })

  const cases = assignments?.map((a) => a.cases) || []

  // Group by intake for better display
  const groupedByIntake = cases.reduce((acc: any, c: any) => {
    const intake = c.target_intake || 'Unknown'
    if (!acc[intake]) acc[intake] = []
    acc[intake].push(c)
    return acc
  }, {})

  return (
    <div className='space-y-8'>
      <h1 className='text-2xl font-bold'>My Cohorts</h1>
      {Object.keys(groupedByIntake).length === 0 ? (
        <Card>
          <CardContent className='p-6 text-center text-gray-500'>
            No cohorts assigned yet.
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedByIntake).map(
          ([intake, cohortCases]: [string, any[]]) => (
            <div key={intake}>
              <h2 className='text-xl font-semibold mb-4'>Intake: {intake}</h2>
              <div className='space-y-4'>
                {cohortCases.map((c: any) => (
                  <Card key={c.id}>
                    <CardContent className='p-6'>
                      <div className='flex justify-between items-start'>
                        <div>
                          <h3 className='text-lg font-semibold'>
                            {c.applicants?.full_name}
                          </h3>
                          <p className='text-sm text-gray-600'>
                            {c.applicants?.email}
                          </p>
                          <p className='mt-2'>Pathway: {c.selected_pathway}</p>
                          <p>Stage: {c.current_stage_id}</p>{' '}
                          {/* join stage name if needed */}
                          <div className='mt-2 flex gap-4 text-sm'>
                            <span>
                              IELTS: {c.applicants?.ielts_status}{' '}
                              {c.applicants?.ielts_score
                                ? `(${c.applicants?.ielts_score})`
                                : ''}
                            </span>
                            <span>GPA: {c.applicants?.gpa || 'N/A'}</span>
                          </div>
                          <div className='mt-2'>
                            <ForecastBadge status={c.forecast_status} />
                          </div>
                        </div>
                        <Link
                          href={`/dashboard/education-provider/cases/${c.id}`}
                        >
                          <Button variant='outline' size='sm'>
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ),
        )
      )}
    </div>
  )
}
