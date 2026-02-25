import { createClient } from '@/lib/supabase/server'
import { CaseTable } from '@/components/cases/CaseTable'
import { CaseFilters } from '@/components/cases/CaseFilters'

export default async function AdminCasesPage({
  searchParams,
}: {
  searchParams: { stage?: string; intake?: string }
}) {
  const supabase = createClient()

  // Build query with filters
  let query = supabase
    .from('cases')
    .select(
      `
      *,
      applicants (full_name, email),
      stages!inner (name, default_sla_days)
    `,
    )
    .order('created_at', { ascending: false })

  // Apply stage filter if provided
  if (searchParams.stage) {
    query = query.eq('stages.name', searchParams.stage)
  }

  // Apply intake filter if provided (partial match)
  if (searchParams.intake) {
    query = query.ilike('target_intake', `%${searchParams.intake}%`)
  }

  const { data: cases, error } = await query

  // Fetch all stages for the filter dropdown
  const { data: stages } = await supabase
    .from('stages')
    .select('name')
    .order('order', { ascending: true })

  if (error) {
    console.error('Error fetching cases:', error)
    return <div>Error loading cases</div>
  }

  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>All Cases</h1>
      <CaseFilters stages={stages || []} />
      <CaseTable cases={cases || []} />
    </div>
  )
}
