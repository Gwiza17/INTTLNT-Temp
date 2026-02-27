import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default async function ApplicantDashboard() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch applicant record
  const { data: applicant, error } = await supabase
    .from('applicants')
    .select('*, cases(*)')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    console.error('Error fetching applicant:', error)
  }

  return (
    <div className='max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>Applicant Dashboard</h1>
        <form action='/auth/signout' method='post'>
          <Button type='submit' variant='outline'>
            Sign out
          </Button>
        </form>
      </div>

      {!applicant ? (
        <div className='bg-yellow-50 p-6 rounded-lg border border-yellow-200'>
          <p className='text-yellow-800'>You haven't submitted an EOI yet.</p>
          <Link href='/eoi' className='mt-4 inline-block'>
            <Button>Start Expression of Interest</Button>
          </Link>
        </div>
      ) : (
        <div className='space-y-6'>
          <div className='bg-white p-6 rounded-lg shadow'>
            <h2 className='text-xl font-semibold mb-4'>Your Profile</h2>
            <p>
              <span className='font-medium'>Name:</span> {applicant.full_name}
            </p>
            <p>
              <span className='font-medium'>Email:</span> {applicant.email}
            </p>
            <p>
              <span className='font-medium'>Country:</span> {applicant.country}
            </p>
          </div>

          {applicant.cases && applicant.cases.length > 0 ? (
            <div className='bg-white p-6 rounded-lg shadow'>
              <h2 className='text-xl font-semibold mb-4'>Your Case</h2>
              {applicant.cases.map((caseItem: any) => (
                <div
                  key={caseItem.id}
                  className='border-t pt-4 first:border-t-0 first:pt-0'
                >
                  <p>
                    <span className='font-medium'>Pathway:</span>{' '}
                    {caseItem.selected_pathway}
                  </p>
                  <p>
                    <span className='font-medium'>Intake:</span>{' '}
                    {caseItem.target_intake}
                  </p>
                  <p>
                    <span className='font-medium'>Current Stage:</span>{' '}
                    {caseItem.current_stage_id}
                  </p>
                  <p>
                    <span className='font-medium'>Status:</span>{' '}
                    {caseItem.forecast_status}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-gray-600'>
              No case found. Please contact support.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
