import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { ForecastBadge } from '@/components/cases/ForecastBadge'

export default async function EducationProviderCaseDetail({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Verify assignment
  const { data: assignment } = await supabase
    .from('case_assignments')
    .select(
      `
      stakeholder_id,
      cases (
        *,
        applicants (*),
        documents (id, document_type, file_path)
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

const caseData = Array.isArray(assignment.cases)
  ? assignment.cases[0]
  : assignment.cases
const applicant = caseData.applicants



  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Applicant: {applicant.full_name}</h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='md:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <h2 className='text-lg font-semibold'>Application Details</h2>
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
                <span className='font-medium'>Current Stage:</span>{' '}
                {caseData.current_stage_id}
              </p>
              <p>
                <span className='font-medium'>Forecast:</span>{' '}
                <ForecastBadge status={caseData.forecast_status} />
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className='text-lg font-semibold'>Documents</h2>
            </CardHeader>
            <CardContent>
              {caseData.documents?.length > 0 ? (
                <ul className='space-y-2'>
                  {caseData.documents.map((doc: any) => (
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
                        {doc.document_type} - {doc.file_path.split('/').pop()}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='text-gray-500'>No documents uploaded yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <h2 className='text-lg font-semibold'>Applicant Info</h2>
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
                {applicant.gpa || 'N/A'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
