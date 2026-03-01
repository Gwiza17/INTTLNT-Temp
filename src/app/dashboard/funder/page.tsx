import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default async function FunderDashboard() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get funder's stakeholder id
  const { data: stakeholder } = await supabase
    .from('stakeholders')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'approved')
    .single()

  if (!stakeholder) {
    return <div>Not authorized as funder</div>
  }

  // Fetch cases assigned to this funder
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
        applicants (full_name, email)
      )
    `,
    )
    .eq('stakeholder_id', stakeholder.id)

  const cases = assignments?.map((a) => a.cases) || []

  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>Assigned Cases</h1>
      {cases.length === 0 ? (
        <Card>
          <CardContent className='p-6 text-center text-gray-500'>
            No cases assigned yet.
          </CardContent>
        </Card>
      ) : (
        <div className='grid gap-4'>
          {cases.map((c: any) => (
            <Card key={c.id}>
              <CardContent className='p-6'>
                <div className='flex justify-between items-start'>
                  <div>
                    <h2 className='text-lg font-semibold'>
                      {c.applicants?.full_name}
                    </h2>
                    <p className='text-sm text-gray-600'>
                      {c.applicants?.email}
                    </p>
                    <p className='mt-2'>Pathway: {c.selected_pathway}</p>
                    <p>Intake: {c.target_intake}</p>
                    <p>Stage: {c.current_stage_id}</p>{' '}
                    {/* ideally join stage name */}
                    <p>Forecast: {c.forecast_status}</p>
                  </div>
                  <Link href={`/dashboard/funder/cases/${c.id}`}>
                    <Button variant='outline' size='sm'>
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
