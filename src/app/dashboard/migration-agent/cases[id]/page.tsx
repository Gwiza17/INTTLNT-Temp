import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ForecastBadge } from '@/components/cases/ForecastBadge'

// Mock task checklist – in production, store in a database table
const visaTasks = [
  { id: '1', name: 'Biometrics appointment', completed: false },
  { id: '2', name: 'Medical examination', completed: false },
  { id: '3', name: 'Form 1000 submission', completed: false },
  { id: '4', name: 'Police clearance', completed: false },
]

export default async function MigrationAgentCaseDetail({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Verify the case is assigned to this agent
  const { data: assignment } = await supabase
    .from('case_assignments')
    .select(
      `
      stakeholder_id,
      cases (
        *,
        applicants (*),
        documents (*),
        stages (name, default_sla_days)
      )
    `,
    )
    .eq('case_id', params.id)
    .single()

  if (!assignment) {
    notFound()
  }

  const { data: stakeholder } = await supabase
    .from('stakeholders')
    .select('id')
    .eq('user_id', user?.id)
    .single()

  if (!stakeholder || stakeholder.id !== assignment.stakeholder_id) {
    return <div>Not authorized</div>
  }

const caseData = (
  Array.isArray(assignment.cases) ? assignment.cases[0] : assignment.cases
) as any
  const applicant = caseData.applicants
  const documents = caseData.documents || []
  const stageName = caseData.stages?.name || 'Unknown'

  // Calculate SLA remaining
  const now = new Date()
  const slaDue = caseData.sla_due_at ? new Date(caseData.sla_due_at) : null
  const remainingDays = slaDue
    ? Math.ceil((slaDue.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null

  // Prepare document download bundle (simulate zip – just list docs for now)
  const handleDownloadAll = async () => {
    // In a real app, you'd call an API to generate a zip.
    alert('Download all documents (feature coming soon)')
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Visa Case: {applicant.full_name}</h1>

      {/* SLA Alert */}
      {remainingDays !== null && remainingDays < 5 && (
        <div className='bg-red-50 border border-red-200 text-red-800 p-4 rounded'>
          <strong>⚠️ Urgent:</strong> SLA due in {remainingDays} days. Take
          action.
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='md:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <h2 className='text-lg font-semibold'>Case Information</h2>
            </CardHeader>
            <CardContent className='space-y-2'>
              <p>
                <span className='font-medium'>Pathway:</span>{' '}
                {caseData.selected_pathway}
              </p>
              <p>
                <span className='font-medium'>Intake:</span>{' '}
                {caseData.target_intake}
              </p>
              <p>
                <span className='font-medium'>Current Stage:</span> {stageName}
              </p>
              <p>
                <span className='font-medium'>Forecast:</span>{' '}
                <ForecastBadge status={caseData.forecast_status} />
              </p>
              {slaDue && (
                <p>
                  <span className='font-medium'>SLA Due:</span>{' '}
                  {slaDue.toLocaleDateString()} ({remainingDays} days left)
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className='text-lg font-semibold'>Applicant Details</h2>
            </CardHeader>
            <CardContent className='space-y-2'>
              <p>
                <span className='font-medium'>Name:</span> {applicant.full_name}
              </p>
              <p>
                <span className='font-medium'>Email:</span> {applicant.email}
              </p>
              <p>
                <span className='font-medium'>Country:</span>{' '}
                {applicant.country}
              </p>
              <p>
                <span className='font-medium'>IELTS:</span>{' '}
                {applicant.ielts_status}{' '}
                {applicant.ielts_score ? `(${applicant.ielts_score})` : ''}
              </p>
              <p>
                <span className='font-medium'>GPA:</span>{' '}
                {applicant.gpa || 'Not provided'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className='text-lg font-semibold'>Documents</h2>
            </CardHeader>
            <CardContent>
              {documents.length > 0 ? (
                <ul className='space-y-2'>
                  {documents.map((doc: any) => (
                    <li key={doc.id}>
                      <a
                        href={
                          supabase.storage
                            .from('documents')
                            .getPublicUrl(doc.file_path).data.publicUrl
                        }
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 hover:underline'
                      >
                        {doc.file_path.split('/').pop()} ({doc.document_type})
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='text-gray-500'>No documents uploaded yet.</p>
              )}
              <div className='mt-4'>
                <Button onClick={handleDownloadAll} variant='outline' size='sm'>
                  Download All Documents (ZIP)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <h2 className='text-lg font-semibold'>Visa Task Checklist</h2>
            </CardHeader>
            <CardContent>
              <ul className='space-y-2'>
                {visaTasks.map((task) => (
                  <li key={task.id} className='flex items-center space-x-2'>
                    <input
                      type='checkbox'
                      defaultChecked={task.completed}
                      className='h-4 w-4 rounded border-gray-300 text-blue-600'
                    />
                    <span className='text-sm'>{task.name}</span>
                  </li>
                ))}
              </ul>
              <p className='text-xs text-gray-500 mt-4'>
                Task completion is not yet saved (mock only).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className='text-lg font-semibold'>Quick Actions</h2>
            </CardHeader>
            <CardContent className='space-y-2'>
              <Button className='w-full'>Add Internal Note</Button>
              <Button variant='outline' className='w-full'>
                Request Additional Documents
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
