import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { ForecastBadge } from '@/components/cases/ForecastBadge'
import { DocumentChecklist } from '@/components/dashboard/applicant/DocumentChecklist'
import { ContactPanel } from '@/components/dashboard/applicant/ContactPanel'
import { getNextActionMessage } from '@/lib/utils/nextAction'
import { calculateDaysInStage } from '@/lib/utils/sla'

export default async function ApplicantDashboard() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch applicant with their case and stage
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
      <div className='max-w-4xl mx-auto py-12 px-4'>
        <Card>
          <CardContent className='p-8 text-center'>
            <h1 className='text-2xl font-bold mb-4'>
              Welcome to your dashboard
            </h1>
            <p className='text-gray-600 mb-6'>
              You haven't submitted an Expression of Interest yet.
            </p>
            <Link href='/eoi'>
              <Button>Start EOI</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const caseData = applicant.cases?.[0]
  if (!caseData) {
    return (
      <div className='max-w-4xl mx-auto py-12 px-4'>
        <Card>
          <CardContent className='p-8 text-center'>
            <p className='text-gray-600'>
              No active case found. Please contact support.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Fetch owner info if stage_owner_user_id exists
  let ownerData = null
  if (caseData.stage_owner_user_id) {
    const { data: stakeholder } = await supabase
      .from('stakeholders')
      .select('name, email, whatsapp')
      .eq('user_id', caseData.stage_owner_user_id)
      .maybeSingle()
    ownerData = stakeholder
  }

  // Fetch documents for this case
  const { data: documents } = await supabase
    .from('documents')
    .select('document_type')
    .eq('case_id', caseData.id)

  const uploadedDocTypes = documents?.map((d) => d.document_type) || []

  // Get required artifacts from stage
  const requiredArtifacts: string[] = caseData.stages?.required_artifacts || []

  // Compute next action message
  const nextAction = getNextActionMessage(
    caseData.stages?.name || '',
    requiredArtifacts,
    uploadedDocTypes,
  )

  return (
    <div className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
      {/* Header */}
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>My Dashboard</h1>
        <form action='/auth/signout' method='post'>
          <Button type='submit' variant='outline'>
            Sign out
          </Button>
        </form>
      </div>

      {/* Profile Summary */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <Card>
          <CardContent className='p-6'>
            <p className='text-sm text-gray-500'>Name</p>
            <p className='text-lg font-medium'>{applicant.full_name}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-6'>
            <p className='text-sm text-gray-500'>Email</p>
            <p className='text-lg font-medium'>{applicant.email}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-6'>
            <p className='text-sm text-gray-500'>Country</p>
            <p className='text-lg font-medium'>{applicant.country}</p>
          </CardContent>
        </Card>
      </div>

      {/* Two-column layout for main content */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          {/* Next Action Banner */}
          <Card className='border-l-4 border-blue-500'>
            <CardContent className='p-6'>
              <h2 className='text-sm font-semibold text-blue-600 uppercase tracking-wide'>
                Next Required Action
              </h2>
              <p className='text-xl mt-1'>{nextAction}</p>
            </CardContent>
          </Card>

          {/* Case Summary */}
          <Card>
            <CardHeader>
              <h2 className='text-xl font-semibold'>Your Application</h2>
            </CardHeader>
            <CardContent className='p-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <p className='text-sm text-gray-500'>Pathway</p>
                  <p className='font-medium'>{caseData.selected_pathway}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Target Intake</p>
                  <p className='font-medium'>{caseData.target_intake}</p>
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

        {/* Right column – Contact Panel */}
        <div className='space-y-6'>
          <ContactPanel
            ownerName={ownerData?.name}
            ownerEmail={ownerData?.email}
            ownerWhatsapp={ownerData?.whatsapp}
            ownerRole={caseData.stage_owner_role}
          />
        </div>
      </div>

      {/* Document Checklist (full width) */}
      <div className='mt-8'>
        <h2 className='text-xl font-semibold mb-4'>Document Checklist</h2>
        <DocumentChecklist
          caseId={caseData.id}
          requiredArtifacts={requiredArtifacts}
          uploadedDocTypes={uploadedDocTypes}
        />
      </div>
    </div>
  )
}
