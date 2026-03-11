import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ActivityCard } from '@/components/partner/ActivityCard'
import Link from 'next/link'

type CaseWithStage = {
  id: string
  current_stage_id: string
  stages: { name: string } | { name: string }[] | null
}

const getStageName = (stages: CaseWithStage['stages']): string => {
  if (!stages) return ''
  return Array.isArray(stages) ? (stages[0]?.name ?? '') : stages.name
}

export default async function PartnerOverview() {
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
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'approved')
    .single()

  if (!stakeholder) {
    return <div>Not authorized as channel partner</div>
  }

  // Count referrals via partner code
  const { count: referralsByCode } = await supabase
    .from('applicants')
    .select('*', { count: 'exact', head: true })
    .eq('referring_partner_code', stakeholder.partner_code)

  // Count assigned cases
  const { count: assignedCases } = await supabase
    .from('case_assignments')
    .select('*', { count: 'exact', head: true })
    .eq('stakeholder_id', stakeholder.id)

  // Fetch cases from referral code
  const { data: referredApplicants } = await supabase
    .from('applicants')
    .select('id')
    .eq('referring_partner_code', stakeholder.partner_code)

  const referredApplicantIds = referredApplicants?.map((a) => a.id) || []

  // Fetch cases from assignments
  const { data: assignedCaseIds } = await supabase
    .from('case_assignments')
    .select('case_id')
    .eq('stakeholder_id', stakeholder.id)

  const caseIds = assignedCaseIds?.map((a) => a.case_id) || []

  // Fetch cases by referred applicants
  const { data: referredCases } =
    referredApplicantIds.length > 0
      ? await supabase
          .from('cases')
          .select('id, current_stage_id, stages(name)')
          .in('applicant_id', referredApplicantIds)
      : { data: [] }

  // Fetch cases by assignment
  const { data: assignedCaseData } =
    caseIds.length > 0
      ? await supabase
          .from('cases')
          .select('id, current_stage_id, stages(name)')
          .in('id', caseIds)
      : { data: [] }

  // Merge and deduplicate
  const allCasesMap = new Map<string, CaseWithStage>()
  ;[...(referredCases || []), ...(assignedCaseData || [])].forEach((c: any) => {
    allCasesMap.set(c.id, c as CaseWithStage)
  })
  const cases = Array.from(allCasesMap.values())

  const ieltsDone = cases.filter((c) =>
    getStageName(c.stages).includes('IELTS'),
  ).length
  const funded = cases.filter((c) =>
    getStageName(c.stages).includes('Funding'),
  ).length
  const progressing = cases.length

  // Last invite activity
  const { data: lastInvite } = await supabase
    .from('partner_invites')
    .select('sent_at')
    .eq('stakeholder_id', stakeholder.id)
    .eq('status', 'sent')
    .order('sent_at', { ascending: false })
    .limit(1)
    .single()

  const lastSentAt = lastInvite?.sent_at ?? null
  const daysSinceLastInvite = lastSentAt
    ? Math.floor(
        (Date.now() - new Date(lastSentAt).getTime()) / (1000 * 60 * 60 * 24),
      )
    : null

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Welcome, {stakeholder.name}</h1>

      {/* Stats cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500'>Partner Code</p>
            <p className='text-2xl font-mono'>{stakeholder.partner_code}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500'>Referrals (by code)</p>
            <p className='text-3xl font-bold'>{referralsByCode || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500'>Assigned Cases</p>
            <p className='text-3xl font-bold'>{assignedCases || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500'>Progressing</p>
            <p className='text-3xl font-bold'>{progressing}</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity + Pipeline + Quick Actions */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Activity streak — spans full width on mobile, 1 col on md */}
        <ActivityCard daysSince={daysSinceLastInvite} lastSentAt={lastSentAt} />

        <Card>
          <CardContent className='p-6'>
            <h2 className='text-lg font-semibold mb-2'>Pipeline Snapshot</h2>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span>IELTS completed:</span>
                <span className='font-bold'>{ieltsDone}</span>
              </div>
              <div className='flex justify-between'>
                <span>Funding stage:</span>
                <span className='font-bold'>{funded}</span>
              </div>
              <div className='flex justify-between'>
                <span>Total referred:</span>
                <span className='font-bold'>{referralsByCode || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <h2 className='text-lg font-semibold mb-2'>Quick Actions</h2>
            <div className='space-y-2'>
              <Link href='/dashboard/channel-partner/invites'>
                <Button className='w-full'>Send Invites</Button>
              </Link>
              <Link href='/dashboard/channel-partner/links'>
                <Button variant='outline' className='w-full'>
                  Generate Referral Link
                </Button>
              </Link>
              <Link href='/dashboard/channel-partner/referrals'>
                <Button variant='outline' className='w-full'>
                  View Referrals
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
