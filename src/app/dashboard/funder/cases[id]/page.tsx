import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default async function FunderCaseDetail({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // First verify the case is assigned to this funder
  const { data: assignment } = await supabase
    .from('case_assignments')
    .select(
      `
      stakeholder_id,
      cases (
        *,
        applicants (*),
        documents (*)
      )
    `,
    )
    .eq('case_id', params.id)
    .single()

  if (!assignment) {
    notFound()
  }

  // Check if current user is the assigned funder
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
  const documents = caseData.documents || []

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Funding Assessment</h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='md:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <h2 className='text-lg font-semibold'>Applicant Information</h2>
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
              <p>
                <span className='font-medium'>Work Experience:</span>{' '}
                {applicant.work_experience_years || 0} years
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className='text-lg font-semibold'>Funding Documents</h2>
            </CardHeader>
            <CardContent>
              {documents.filter((d) => d.document_type === 'proof_of_funds')
                .length > 0 ? (
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
                        {doc.file_path.split('/').pop()}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='text-gray-500'>
                  No funding documents uploaded yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <h2 className='text-lg font-semibold'>Funding Readiness</h2>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-gray-600'>
                This section will show an auto‑generated funding readiness
                summary based on applicant data.
              </p>
              {/* Placeholder for future */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className='text-lg font-semibold'>Actions</h2>
            </CardHeader>
            <CardContent className='space-y-2'>
              <Button className='w-full'>Request Additional Documents</Button>
              <Button variant='outline' className='w-full'>
                Add Internal Note
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
