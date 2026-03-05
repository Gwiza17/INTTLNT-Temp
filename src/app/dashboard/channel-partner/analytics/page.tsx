import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PartnerAnalyticsCharts } from '@/components/dashboard/channel-partner/PartnerAnalyticsCharts'

export default async function PartnerAnalytics() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get partner's stakeholder info
  const { data: stakeholder } = await supabase
    .from('stakeholders')
    .select('id, partner_code, name')
    .eq('user_id', user.id)
    .single()

  if (!stakeholder) {
    return <div>Not authorized</div>
  }

  // Fetch applicants referred by this partner (via partner_code)
  const { data: applicants } = await supabase
    .from('applicants')
    .select('id, created_at')
    .eq('referring_partner_code', stakeholder.partner_code)

  const applicantIds = applicants?.map((a) => a.id) || []

  // Fetch cases for those applicants, including stage information
  const { data: cases } = await supabase
    .from('cases')
    .select(
      `
      id,
      created_at,
      current_stage_id,
      stages!inner(name, "order"),
      forecast_status,
      target_intake
    `,
    )
    .in('applicant_id', applicantIds)

  type CaseWithStage = {
    id: string
    created_at: string
    current_stage_id: string
    forecast_status: string
    target_intake: string
    stages: { name: string; order: number }
  }

  const casesWithStages = (cases || []) as unknown as CaseWithStage[]

  // Group by stage name
  const stageCounts: Record<string, number> = {}
  casesWithStages.forEach((c) => {
    const stageName = c.stages?.name || 'Unknown'
    stageCounts[stageName] = (stageCounts[stageName] || 0) + 1
  })

  // Convert to chart data, sorted by stage order
  const stageOrder = casesWithStages.map((c) => c.stages?.order).filter(Boolean)
  const uniqueOrder = Array.from(new Set(stageOrder)).sort((a, b) => a - b)
  const stageData = uniqueOrder.map((order) => {
    const stageName =
      casesWithStages.find((c) => c.stages?.order === order)?.stages?.name ||
      'Unknown'
    return {
      name: stageName,
      count: stageCounts[stageName] || 0,
    }
  })

  // Forecast status breakdown
  const forecastCounts = casesWithStages.reduce(
    (acc: Record<string, number>, c) => {
      acc[c.forecast_status] = (acc[c.forecast_status] || 0) + 1
      return acc
    },
    {},
  )

  const forecastData = Object.entries(forecastCounts).map(
    ([status, count]) => ({
      name: status.replace('_', ' ').toUpperCase(),
      value: count,
    }),
  )

  // Referrals over time (last 6 months)
  const now = new Date()
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(now.getMonth() - 6)

  const monthlyCounts: Record<string, number> = {}
  applicants?.forEach((a) => {
    const date = new Date(a.created_at)
    if (date >= sixMonthsAgo) {
      const monthKey = date.toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      })
      monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1
    }
  })

  const timelineData = Object.entries(monthlyCounts)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Referral Analytics</h1>
      <p className='text-gray-600'>
        Performance metrics for {stakeholder.name || 'your referrals'}
      </p>

      <PartnerAnalyticsCharts
        stageData={stageData}
        forecastData={forecastData}
        timelineData={timelineData}
        stageCounts={stageCounts}
        forecastCounts={forecastCounts}
        totalReferrals={applicantIds.length}
        activeCases={casesWithStages.length}
      />
    </div>
  )
}
