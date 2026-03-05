import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/Card'
import { ForecastBadge } from '@/components/cases/ForecastBadge'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

type StageRow = { name: string }
type ApplicantRow = { full_name: string; email: string }

type CaseRow = {
  id: string
  selected_pathway: string
  target_intake: string
  forecast_status: 'on_track' | 'at_risk' | 'missed' | null
  stage_entered_at: string | null
  applicants: ApplicantRow | ApplicantRow[] | null
  stages: StageRow | StageRow[] | null
}

const getStageName = (val: StageRow | StageRow[] | null): string => {
  if (!val) return '—'
  return Array.isArray(val) ? (val[0]?.name ?? '—') : val.name
}

const getApplicant = (
  val: ApplicantRow | ApplicantRow[] | null,
): ApplicantRow | null => {
  if (!val) return null
  return Array.isArray(val) ? (val[0] ?? null) : val
}

const CASE_SELECT = `
  id,
  selected_pathway,
  target_intake,
  forecast_status,
  stage_entered_at,
  applicants(full_name, email),
  stages(name)
`

export default async function PartnerReferrals() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: stakeholder } = await supabase
    .from('stakeholders')
    .select('partner_code, id')
    .eq('user_id', user?.id ?? '')
    .single()

  const casesMap = new Map<string, CaseRow>()

  if (stakeholder) {
    // Step 1: get applicant IDs referred by this partner's code
    const { data: referredApplicants } = await supabase
      .from('applicants')
      .select('id')
      .eq('referring_partner_code', stakeholder.partner_code)

    const referredIds = (referredApplicants ?? []).map((a) => a.id)

    // Step 2: fetch cases for those applicants
    if (referredIds.length > 0) {
      const { data: codeCases } = await supabase
        .from('cases')
        .select(CASE_SELECT)
        .in('applicant_id', referredIds)

      for (const c of codeCases ?? []) {
        casesMap.set(c.id, c as unknown as CaseRow)
      }
    }

    // Step 3: get directly assigned case IDs
    const { data: assignments } = await supabase
      .from('case_assignments')
      .select('case_id')
      .eq('stakeholder_id', stakeholder.id)

    const assignedIds = (assignments ?? [])
      .map((a) => a.case_id)
      .filter(Boolean)

    // Step 4: fetch those cases (skip ones already in map)
    if (assignedIds.length > 0) {
      const { data: assignedCases } = await supabase
        .from('cases')
        .select(CASE_SELECT)
        .in('id', assignedIds)

      for (const c of assignedCases ?? []) {
        if (!casesMap.has(c.id)) {
          casesMap.set(c.id, c as unknown as CaseRow)
        }
      }
    }
  }

  const cases = Array.from(casesMap.values())

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>My Referrals</h1>
      {cases.length === 0 ? (
        <Card>
          <CardContent className='p-6 text-center text-gray-500'>
            No referrals yet. Start sharing your link!
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-4'>
          {cases.map((c) => {
            const applicant = getApplicant(c.applicants)
            const stageName = getStageName(c.stages)
            const daysInStage = c.stage_entered_at
              ? Math.floor(
                  (Date.now() - new Date(c.stage_entered_at).getTime()) /
                    (1000 * 60 * 60 * 24),
                )
              : null

            return (
              <Card key={c.id}>
                <CardContent className='p-6'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <h2 className='text-lg font-semibold'>
                        {applicant?.full_name ?? '—'}
                      </h2>
                      <p className='text-sm text-gray-600'>
                        {applicant?.email ?? '—'}
                      </p>
                      <p className='mt-2'>Pathway: {c.selected_pathway}</p>
                      <p>Intake: {c.target_intake}</p>
                      <p>Stage: {stageName}</p>
                      <div className='mt-2'>
                        <ForecastBadge
                          status={c.forecast_status ?? 'on_track'}
                        />
                      </div>
                      {daysInStage !== null && (
                        <p className='text-sm mt-1'>
                          Days in stage: {daysInStage}
                        </p>
                      )}
                    </div>
                    <Link href={`/dashboard/channel-partner/referrals/${c.id}`}>
                      <Button variant='outline' size='sm'>
                        View
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
