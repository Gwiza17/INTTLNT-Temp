import { createClient } from '@/lib/supabase/server'
import { CaseTable } from '@/components/cases/CaseTable'

export default async function AdminCasesPage() {
  const supabase = createClient()

  // Fetch all cases with related data
  const { data: cases, error } = await supabase
    .from('cases')
    .select(
      `
      *,
      applicants (full_name, email),
      stages (name, default_sla_days)
    `,
    )
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching cases:', error)
    return <div>Error loading cases</div>
  }

  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>All Cases</h1>
      <CaseTable cases={cases || []} />
    </div>
  )
}
