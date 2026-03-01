import { createClient } from '@/lib/supabase/server'
import { AnalyticsCharts } from '@/components/dashboard/funder/AnalyticsCharts'

export default async function FunderAnalyticsPage() {
  const supabase = createClient()

  // 1. Total cases
  const { count: totalCases } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })

  // 2. Cases by stage
  const { data: allCases } = await supabase
    .from('cases')
    .select('current_stage_id, stages(name)')

  const stageCounts = (allCases || []).reduce((acc: any, c: any) => {
    const name = c.stages?.name || 'Unknown'
    acc[name] = (acc[name] || 0) + 1
    return acc
  }, {})

  const casesByStage = Object.entries(stageCounts).map(([name, count]) => ({
    name,
    count,
  }))

  // 3. IELTS distribution
  const { data: ieltsScores } = await supabase
    .from('applicants')
    .select('ielts_score')
    .not('ielts_score', 'is', null)

  const ieltsBands = (ieltsScores || []).reduce((acc: any, a: any) => {
    const band = Math.floor(a.ielts_score)
    const key = `${band}.0-${band}.5`
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  const ieltsData = Object.entries(ieltsBands).map(([name, value]) => ({
    name,
    value,
  }))

  // 4. GPA distribution
  const { data: gpas } = await supabase
    .from('applicants')
    .select('gpa')
    .not('gpa', 'is', null)

  const gpaBuckets = (gpas || []).reduce((acc: any, a: any) => {
    let bucket = 'Unknown'
    if (a.gpa >= 80) bucket = '80-100'
    else if (a.gpa >= 70) bucket = '70-79'
    else if (a.gpa >= 60) bucket = '60-69'
    else bucket = '<60'
    acc[bucket] = (acc[bucket] || 0) + 1
    return acc
  }, {})

  const gpaData = Object.entries(gpaBuckets).map(([name, value]) => ({
    name,
    value,
  }))

  // 5. Partner vs single
  const { data: couples } = await supabase
    .from('applicants')
    .select('is_skilled_couple')

  const coupleCount = couples?.filter((a) => a.is_skilled_couple).length || 0
  const singleCount = (couples?.length || 0) - coupleCount
  const coupleData = [
    { name: 'Single', value: singleCount },
    { name: 'Skilled Couple', value: coupleCount },
  ]

  // 6. Funding approval rate
  const { data: stageIds } = await supabase
    .from('stages')
    .select('id')
    .in('name', ['Conditional Funding Assessment', 'Unconditional Funding'])

  const { data: fundingCases } = await supabase
    .from('cases')
    .select('forecast_status')
    .in('current_stage_id', stageIds?.map((s) => s.id) || [])

  const approved =
    fundingCases?.filter((c) => c.forecast_status === 'on_track').length || 0
  const totalFunding = fundingCases?.length || 0
  const approvalRate =
    totalFunding > 0 ? Math.round((approved / totalFunding) * 100) : 0

  const ieltsAbove7 =
    ieltsScores?.filter((s: any) => s.ielts_score >= 7).length || 0

  return (
    <AnalyticsCharts
      totalCases={totalCases || 0}
      approvalRate={approvalRate}
      ieltsAbove7={ieltsAbove7}
      coupleCount={coupleCount}
      casesByStage={casesByStage}
      ieltsData={ieltsData}
      gpaData={gpaData}
      coupleData={coupleData}
    />
  )
}
