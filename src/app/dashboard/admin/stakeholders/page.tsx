import { createClient } from '@/lib/supabase/server'
import { StakeholderApprovalTable } from '@/components/stakeholders/StakeholderApprovalTable'

export default async function StakeholdersPage() {
  const supabase = createClient()

  // Fetch all stakeholders
  const { data: stakeholders, error } = await supabase
    .from('stakeholders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching stakeholders:', error)
    return <div>Error loading stakeholders</div>
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Stakeholder Management</h1>
      <StakeholderApprovalTable stakeholders={stakeholders || []} />
    </div>
  )
}
