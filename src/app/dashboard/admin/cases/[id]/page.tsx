import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { DocumentVault } from '@/components/cases/DocumentVault'
import { StageChanger } from '@/components/cases/StageChanger'
import { NotesPanel } from '@/components/cases/NotesPanel'
import { ForecastBadge } from '@/components/cases/ForecastBadge'
import { calculateDaysInStage } from '@/lib/utils/sla'
import { daysUntilIntake, calculateForecast } from '@/lib/utils/forecast'

interface CaseDetailPageProps {
  params: {
    id: string
  }
}

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const supabase = createClient()

  const { data: caseData, error } = await supabase
    .from('cases')
    .select(
      `
      *,
      applicants (*),
      stages (*),
      case_assignments (
        stakeholder:stakeholders (*)
      )
    `,
    )
    .eq('id', params.id)
    .single()

  if (error || !caseData) {
    notFound()
  }
  const daysRemaining = daysUntilIntake(caseData.target_intake)
  const now = new Date()
  const slaDue = caseData.sla_due_at ? new Date(caseData.sla_due_at) : null
  const remainingSlaDays = slaDue
    ? Math.ceil((slaDue.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : 0
  const computedForecast = calculateForecast(daysRemaining, remainingSlaDays)

  const { data: allStages } = await supabase
    .from('stages')
    .select('*')
    .order('order', { ascending: true })

  const daysInStage = calculateDaysInStage(caseData.stage_entered_at)

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>
          Case: {caseData.applicants?.full_name || 'Unknown'}
        </h1>
        <span className='text-sm text-gray-500'>Case ID: {caseData.id}</span>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left column – case details */}
        <div className='lg:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <h2 className='text-lg font-semibold'>Current Stage</h2>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-500'>Stage</p>
                    <p className='font-medium'>{caseData.stages?.name}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Days in Stage</p>
                    <p className='font-medium'>{daysInStage}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Forecast</p>
                    <ForecastBadge status={caseData.forecast_status} />
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>SLA Due</p>
                    <p className='font-medium'>
                      {caseData.sla_due_at
                        ? new Date(caseData.sla_due_at).toLocaleDateString()
                        : 'Not set'}
                    </p>
                  </div>
                </div>
                <StageChanger
                  caseId={caseData.id}
                  currentStageId={caseData.current_stage_id}
                  stages={allStages || []}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className='text-lg font-semibold'>Documents</h2>
            </CardHeader>
            <CardContent>
              <DocumentVault caseId={caseData.id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className='text-lg font-semibold'>Internal Notes</h2>
            </CardHeader>
            <CardContent>
              <NotesPanel caseId={caseData.id} />
            </CardContent>
          </Card>
        </div>

        {/* Right column – applicant info & assignments */}
        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <h2 className='text-lg font-semibold'>Applicant Information</h2>
            </CardHeader>
            <CardContent className='space-y-2'>
              <p>
                <span className='font-medium'>Name:</span>{' '}
                {caseData.applicants?.full_name}
              </p>
              <p>
                <span className='font-medium'>Email:</span>{' '}
                {caseData.applicants?.email}
              </p>
              <p>
                <span className='font-medium'>Country:</span>{' '}
                {caseData.applicants?.country}
              </p>
              <p>
                <span className='font-medium'>IELTS Status:</span>{' '}
                {caseData.applicants?.ielts_status}
              </p>
              <p>
                <span className='font-medium'>GPA:</span>{' '}
                {caseData.applicants?.gpa || 'Not provided'}
              </p>
              <p>
                <span className='font-medium'>Work Experience:</span>{' '}
                {caseData.applicants?.work_experience_years || 0} years
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className='text-lg font-semibold'>Case Assignments</h2>
            </CardHeader>
            <CardContent>
              {caseData.case_assignments &&
              caseData.case_assignments.length > 0 ? (
                <ul className='space-y-2'>
                  {caseData.case_assignments.map((assignment: any) => (
                    <li key={assignment.stakeholder?.id} className='text-sm'>
                      {assignment.stakeholder?.name} (
                      {assignment.stakeholder?.roles.join(', ')})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='text-sm text-gray-500'>No assignments yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className='text-lg font-semibold'>Pathway Details</h2>
            </CardHeader>
            <CardContent className='space-y-2'>
              <p>
                <span className='font-medium'>Pathway:</span>{' '}
                {caseData.selected_pathway}
              </p>
              <p>
                <span className='font-medium'>Target Intake:</span>{' '}
                {caseData.target_intake}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
