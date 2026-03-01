import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/Card'
import { ForecastBadge } from '@/components/cases/ForecastBadge'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default async function PartnerReferrals() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: stakeholder } = await supabase
    .from('stakeholders')
    .select('partner_code, id')
    .eq('user_id', user?.id)
    .single()

  // Fetch cases linked via partner code or assignments
  let cases: any[] = []

  if (stakeholder) {
    // Cases where applicant's referring partner code matches
    const { data: codeCases } = await supabase
      .from('cases')
      .select(
        `
        *,
        applicants!inner(full_name, email, referring_partner_code),
        stages(name)
      `,
      )
      .eq('applicants.referring_partner_code', stakeholder.partner_code)

    // Cases assigned directly
    const { data: assignedCases } = await supabase
      .from('case_assignments')
      .select(
        `
        case_id,
        cases(*, applicants(full_name, email), stages(name))
      `,
      )
      .eq('stakeholder_id', stakeholder.id)

    cases = [
      ...(codeCases || []),
      ...(assignedCases?.map((a) => a.cases) || []),
    ]
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>My Referrals</h1>
      {cases.length === 0 ? (
        <Card>
          <CardContent className='p-6 text-center text-gray-500'>
            No referrals yet. Start sharing your link!
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-4'>
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
                    <p>Stage: {c.stages?.name}</p>
                    <div className='mt-2'>
                      <ForecastBadge status={c.forecast_status} />
                    </div>
                    <p className='text-sm mt-1'>
                      Days in stage:{' '}
                      {Math.floor(
                        (Date.now() - new Date(c.stage_entered_at).getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}
                    </p>
                  </div>
                  <Link href={`/dashboard/channel-partner/referrals/${c.id}`}>
                    <Button variant='outline' size='sm'>
                      View
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
