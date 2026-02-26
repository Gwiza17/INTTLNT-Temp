import { createClient } from '@/lib/supabase/server'
import { CaseTable } from '@/components/cases/CaseTable'
import { CaseFilters } from '@/components/cases/CaseFilters'

export default async function AdminCasesPage({
  searchParams,
}: {
  searchParams: { stage?: string; intake?: string }
}) {
  const supabase = createClient()

  // Fetch all stages for the filter dropdown
  const { data: stages } = await supabase
    .from('stages')
    .select('id, name')
    .order('order', { ascending: true })

  // Build query with filters
  let query = supabase
    .from('cases')
    .select(
      `
      *,
      applicants (full_name, email),
      stages (name, default_sla_days)
    `,
    )
    .order('created_at', { ascending: false })

  // Apply stage filter using stage id lookup
  if (searchParams.stage) {
    const matchedStage = stages?.find((s) => s.name === searchParams.stage)
    if (matchedStage) {
      query = query.eq('current_stage_id', matchedStage.id)
    }
  }

  // Apply intake filter if provided (partial match)
  if (searchParams.intake) {
    query = query.ilike('target_intake', `%${searchParams.intake}%`)
  }

  const { data: cases, error } = await query

  if (error) {
    console.error('Error fetching cases:', error.message)
    return (
      <div className='text-red-500 p-4'>
        Error loading cases: {error.message}
      </div>
    )
  }

  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>All Cases</h1>
      <CaseFilters stages={stages || []} />
      <CaseTable cases={cases || []} />
    </div>
  )
}
