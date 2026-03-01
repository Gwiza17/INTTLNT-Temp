import { createClient } from '@/lib/supabase/server'
import { EmployerCharts } from '@/components/dashboard/employer/EmployerCharts'

export default async function EmployerDashboard() {
  const supabase = createClient()

  // 1. Total candidates
  const { count: totalCandidates } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })

  // 2. Candidates by discipline
  const { data: pathways } = await supabase
    .from('cases')
    .select('selected_pathway')

  const disciplineCounts: Record<string, number> = {}
  pathways?.forEach((p: any) => {
    const parts = p.selected_pathway?.split(' → ') || []
    const discipline = parts[0] || 'Other'
    disciplineCounts[discipline] = (disciplineCounts[discipline] || 0) + 1
  })
  const disciplineData = Object.entries(disciplineCounts).map(
    ([name, value]) => ({ name, value }),
  )

  // 3. Candidates by intake year
  const { data: intakes } = await supabase.from('cases').select('target_intake')
  const intakeCounts: Record<string, number> = {}
  intakes?.forEach((c: any) => {
    const year = c.target_intake?.match(/\d{4}/)?.[0] || 'Unknown'
    intakeCounts[year] = (intakeCounts[year] || 0) + 1
  })
  const intakeData = Object.entries(intakeCounts).map(([year, count]) => ({
    year,
    count,
  }))

  // 4. Partner skill distribution
  const { data: couples } = await supabase
    .from('applicants')
    .select('is_skilled_couple')

  const coupleCount = couples?.filter((a) => a.is_skilled_couple).length || 0
  const singleCount = (couples?.length || 0) - coupleCount
  const partnershipData = [
    { name: 'Single Applicants', value: singleCount },
    { name: 'Skilled Couples', value: coupleCount },
  ]

  // 5. IELTS readiness
  const { data: ieltsScores } = await supabase
    .from('applicants')
    .select('ielts_score')

  const ieltsReady =
    ieltsScores?.filter((a) => a.ielts_score && a.ielts_score >= 7).length || 0

  // 6. Funding type
  const { data: funding } = await supabase
    .from('applicants')
    .select('proof_of_funds_type')

  const selfFunded =
    funding?.filter((a) => a.proof_of_funds_type === 'bank_statement').length ||
    0
  const assisted =
    funding?.filter((a) => a.proof_of_funds_type === 'conditional_offer')
      .length || 0
  const fundingData = [
    { name: 'Self‑funded', value: selfFunded },
    { name: 'Finance‑assisted', value: assisted },
  ]

  return (
    <EmployerCharts
      totalCandidates={totalCandidates || 0}
      ieltsReady={ieltsReady}
      coupleCount={coupleCount}
      selfFunded={selfFunded}
      disciplineData={disciplineData}
      intakeData={intakeData}
      partnershipData={partnershipData}
      fundingData={fundingData}
    />
  )
}
