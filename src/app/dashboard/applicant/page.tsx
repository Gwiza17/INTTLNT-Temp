import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { ForecastBadge } from '@/components/cases/ForecastBadge'
import { DocumentChecklist } from '@/components/dashboard/applicant/DocumentChecklist'
import { ContactPanel } from '@/components/dashboard/applicant/ContactPanel'
import { IELTSAvailabilityWidget } from '@/components/dashboard/applicant/IELTSAvailabilityWidget'
import { getNextActionMessage } from '@/lib/utils/nextAction'
import { calculateDaysInStage } from '@/lib/utils/sla'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

export default async function ApplicantDashboard() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: applicant, error } = await supabase
    .from('applicants')
    .select(
      `
      *,
      cases (
        *,
        stages (name, default_sla_days, required_artifacts)
      )
    `,
    )
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    console.error('Error fetching applicant:', error)
  }

  if (!applicant) {
    return (
      <div className='max-w-2xl mx-auto py-8 px-4'>
        <Card>
          <CardContent className='p-6 sm:p-8 text-center'>
            <h1 className='text-xl sm:text-2xl font-bold mb-4'>
              Welcome to your dashboard
            </h1>
            <p className='text-gray-600 mb-6'>
              You haven't submitted an Expression of Interest yet.
            </p>
            <Link href='/eoi'>
              <Button className='w-full sm:w-auto'>Start EOI</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const caseData = applicant.cases?.[0]

  if (!caseData) {
    return (
      <div className='max-w-2xl mx-auto py-8 px-4'>
        <Card>
          <CardContent className='p-6 text-center'>
            <p className='text-gray-600'>
              No active case found. Please contact support.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  let ownerData = null
  if (caseData.stage_owner_user_id) {
    const { data: stakeholder } = await supabase
      .from('stakeholders')
      .select('name, email, whatsapp')
      .eq('user_id', caseData.stage_owner_user_id)
      .maybeSingle()
    ownerData = stakeholder
  }

  const { data: documents } = await supabase
    .from('documents')
    .select('document_type')
    .eq('case_id', caseData.id)

  const uploadedDocTypes = documents?.map((d) => d.document_type) || []
  const requiredArtifacts: string[] = caseData.stages?.required_artifacts || []

  const nextAction = getNextActionMessage(
    caseData.stages?.name || '',
    requiredArtifacts,
    uploadedDocTypes,
  )

  return (
    <div className='max-w-7xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8'>
      <ErrorBoundary>
        {/* Header */}
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl sm:text-3xl font-bold'>My Dashboard</h1>
        </div>

        {/* Profile Summary */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-6'>
          <Card>
            <CardContent className='p-4 sm:p-6'>
              <p className='text-sm text-gray-500'>Name</p>
              <p className='text-base sm:text-lg font-medium truncate'>
                {applicant.full_name}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-4 sm:p-6'>
              <p className='text-sm text-gray-500'>Email</p>
              <p className='text-base sm:text-lg font-medium truncate'>
                {applicant.email}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-4 sm:p-6'>
              <p className='text-sm text-gray-500'>Country</p>
              <p className='text-base sm:text-lg font-medium'>
                {applicant.country}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Two-column layout — stacks on mobile */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6'>
          <div className='lg:col-span-2 space-y-4 sm:space-y-6'>
            {/* Next Action Banner */}
            <Card className='border-l-4 border-blue-500'>
              <CardContent className='p-4 sm:p-6'>
                <h2 className='text-xs sm:text-sm font-semibold text-blue-600 uppercase tracking-wide'>
                  Next Required Action
                </h2>
                <p className='text-lg sm:text-xl mt-1'>{nextAction}</p>
              </CardContent>
            </Card>

            {/* Case Summary */}
            <Card>
              <CardHeader>
                <h2 className='text-lg sm:text-xl font-semibold'>
                  Your Application
                </h2>
              </CardHeader>
              <CardContent className='p-4 sm:p-6'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                  <div>
                    <p className='text-sm text-gray-500'>Pathway</p>
                    <p className='font-medium'>{caseData.selected_pathway}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Target Intake</p>
                    <p className='font-medium'>
                      {caseData.target_intake || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Current Stage</p>
                    <p className='font-medium'>{caseData.stages?.name}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Days in Stage</p>
                    <p className='font-medium'>
                      {calculateDaysInStage(caseData.stage_entered_at)}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Forecast</p>
                    <ForecastBadge status={caseData.forecast_status} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Panel — full width on mobile */}
          <div className='space-y-4 sm:space-y-6'>
            <ContactPanel
              ownerName={ownerData?.name}
              ownerEmail={ownerData?.email}
              ownerWhatsapp={ownerData?.whatsapp}
              ownerRole={caseData.stage_owner_role}
            />
          </div>
        </div>

        {/* Document Checklist */}
        <div className='mt-6 sm:mt-8'>
          <h2 className='text-lg sm:text-xl font-semibold mb-4'>
            Document Checklist
          </h2>
          <DocumentChecklist
            caseId={caseData.id}
            requiredArtifacts={requiredArtifacts}
            uploadedDocTypes={uploadedDocTypes}
          />
        </div>

        {/* IELTS Availability Widget */}
        <div className='mt-6 sm:mt-8'>
          <IELTSAvailabilityWidget />
        </div>
      </ErrorBoundary>
    </div>
  )
}
