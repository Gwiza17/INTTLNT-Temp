import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { ForecastBadge } from '@/components/cases/ForecastBadge'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default async function ReferralDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Verify the viewer is an approved partner
  const { data: stakeholder } = await supabase
    .from('stakeholders')
    .select('id, partner_code')
    .eq('user_id', user?.id ?? '')
    .single()

  if (!stakeholder) notFound()

  // Fetch the case with related data
  const { data: caseData } = await supabase
    .from('cases')
    .select(
      `
      id,
      selected_pathway,
      target_intake,
      forecast_status,
      stage_entered_at,
      documents_status,
      notes,
      created_at,
      applicants(full_name, email, whatsapp, country, ielts_score, ielts_status),
      stages(name, description)
    `,
    )
    .eq('id', params.id)
    .single()

  if (!caseData) notFound()

  // Resolve applicant and stage (Supabase may return array or object)
  const applicant = Array.isArray(caseData.applicants)
    ? caseData.applicants[0]
    : caseData.applicants

  const stage = Array.isArray(caseData.stages)
    ? caseData.stages[0]
    : caseData.stages

  const daysInStage = caseData.stage_entered_at
    ? Math.floor(
        (Date.now() - new Date(caseData.stage_entered_at).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : null

  const forecastStatus = (caseData.forecast_status ?? 'on_track') as
    | 'on_track'
    | 'at_risk'
    | 'missed'

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Link href='/dashboard/channel-partner/referrals'>
          <Button variant='outline' size='sm'>
            ← Back
          </Button>
        </Link>
        <h1 className='text-2xl font-bold'>
          {applicant?.full_name ?? 'Referral Detail'}
        </h1>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Applicant Info */}
        <Card>
          <CardHeader>
            <h2 className='text-lg font-semibold'>Applicant</h2>
          </CardHeader>
          <CardContent className='space-y-2 text-sm'>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Name</span>
              <span className='font-medium'>{applicant?.full_name ?? '—'}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Email</span>
              <span className='font-medium'>{applicant?.email ?? '—'}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-500'>WhatsApp</span>
              <span className='font-medium'>{applicant?.whatsapp ?? '—'}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Country</span>
              <span className='font-medium'>{applicant?.country ?? '—'}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-500'>IELTS Status</span>
              <span className='font-medium'>
                {applicant?.ielts_status ?? '—'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-500'>IELTS Score</span>
              <span className='font-medium'>
                {applicant?.ielts_score != null ? applicant.ielts_score : '—'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Case Info */}
        <Card>
          <CardHeader>
            <h2 className='text-lg font-semibold'>Case</h2>
          </CardHeader>
          <CardContent className='space-y-2 text-sm'>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Pathway</span>
              <span className='font-medium'>{caseData.selected_pathway}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Target Intake</span>
              <span className='font-medium'>{caseData.target_intake}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Current Stage</span>
              <span className='font-medium'>{stage?.name ?? '—'}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Days in Stage</span>
              <span className='font-medium'>
                {daysInStage !== null ? daysInStage : '—'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Documents</span>
              <span className='font-medium capitalize'>
                {caseData.documents_status ?? '—'}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-gray-500'>Forecast</span>
              <ForecastBadge status={forecastStatus} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stage Description */}
      {stage?.description && (
        <Card>
          <CardHeader>
            <h2 className='text-lg font-semibold'>Stage Notes</h2>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-gray-600'>{stage.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Case Notes */}
      {caseData.notes && (
        <Card>
          <CardHeader>
            <h2 className='text-lg font-semibold'>Notes</h2>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-gray-600'>{caseData.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
