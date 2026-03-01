import { createClient } from '@/lib/supabase/server'
import { EducationProviderCharts } from '@/components/dashboard/education-provider/EducationProviderCharts'

export default async function EducationProviderAnalytics() {
  const supabase = createClient()

  // Cases by stage
  const { data: stageCounts } = await supabase
    .from('cases')
    .select('stages(name)')

  const stageMap: Record<string, number> = {}
  stageCounts?.forEach((c: any) => {
    const name = c.stages?.name || 'Unknown'
    stageMap[name] = (stageMap[name] || 0) + 1
  })
  const chartData = Object.entries(stageMap).map(([name, count]) => ({
    name,
    count,
  }))

  // IELTS stats
  const { data: ieltsScores } = await supabase
    .from('applicants')
    .select('ielts_score')

  const above7 =
    ieltsScores?.filter((a) => a.ielts_score && a.ielts_score >= 7).length || 0
  const totalApplicants = ieltsScores?.length || 0

  // Average GPA
  const { data: gpas } = await supabase.from('applicants').select('gpa')
  const avgGpa =
    gpas && gpas.length > 0
      ? (gpas.reduce((acc, a) => acc + (a.gpa || 0), 0) / gpas.length).toFixed(
          1,
        )
      : 'N/A'

  return (
    <EducationProviderCharts
      totalApplicants={totalApplicants}
      above7={above7}
      avgGpa={avgGpa}
      chartData={chartData}
    />
  )
}
