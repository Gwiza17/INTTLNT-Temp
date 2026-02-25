import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/Card'

export default async function AdminOverview() {
  const supabase = createClient()

  // Fetch some counts for the overview
  const { count: totalCases } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })

  const { count: pendingStakeholders } = await supabase
    .from('stakeholders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: totalApplicants } = await supabase
    .from('applicants')
    .select('*', { count: 'exact', head: true })

  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>Dashboard Overview</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card>
          <CardContent className='p-6'>
            <p className='text-sm text-gray-500'>Total Cases</p>
            <p className='text-3xl font-bold'>{totalCases || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-6'>
            <p className='text-sm text-gray-500'>Pending Stakeholders</p>
            <p className='text-3xl font-bold'>{pendingStakeholders || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-6'>
            <p className='text-sm text-gray-500'>Total Applicants</p>
            <p className='text-3xl font-bold'>{totalApplicants || 0}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
