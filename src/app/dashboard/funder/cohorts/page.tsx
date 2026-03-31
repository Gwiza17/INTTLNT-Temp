import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import CohortCard from '@/components/marketplace/CohortCard'
import { Card, CardContent } from '@/components/ui/Card'
import { Globe2, TrendingUp, Banknote } from 'lucide-react'
import type { Cohort } from '@/types/marketplace'

export default async function FunderCohortsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: stakeholder } = await supabase
    .from('stakeholders')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'approved')
    .single()

  if (!stakeholder) return <div>Not authorized</div>

  // Cohorts with candidates relevant for funding assessment
  const { data: cohorts } = await supabase
    .from('cohorts')
    .select('*')
    .eq('is_active', true)
    .order('discipline')

  // Interests already expressed by this funder
  const { data: interests } = await supabase
    .from('marketplace_interest')
    .select('candidate_profile_id, status')
    .eq('stakeholder_id', stakeholder.id)

  const interestCount = interests?.length ?? 0

  return (
    <div>
      {/* Header */}
      <div className='flex items-start justify-between mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-[#0B1F3B] mb-1'>Candidate Cohort Marketplace</h1>
          <p className='text-gray-500 text-sm'>Browse anonymised candidate cohorts. Express interest to be connected after candidate approval.</p>
        </div>
        <Link
          href='/marketplace'
          className='inline-flex items-center gap-2 text-sm bg-[#0B1F3B] text-white font-semibold px-4 py-2 rounded-xl hover:bg-[#0B1F3B]/80 transition-colors'
        >
          <Globe2 size={15} /> Full Marketplace
        </Link>
      </div>

      {/* Quick stats */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>
        <StatCard Icon={Globe2}     label='Active Cohorts'      value={String(cohorts?.length ?? 0)} />
        <StatCard Icon={TrendingUp} label='Interests Expressed' value={String(interestCount)} />
        <StatCard Icon={Banknote}   label='Approved Reveals'    value={String(interests?.filter((i) => i.status === 'approved').length ?? 0)} />
      </div>

      {/* Cohorts */}
      {!cohorts || cohorts.length === 0 ? (
        <Card><CardContent className='p-6 text-center text-gray-500'>No active cohorts at this time.</CardContent></Card>
      ) : (
        <div className='grid sm:grid-cols-2 xl:grid-cols-3 gap-4'>
          {cohorts.map((cohort: Cohort) => (
            <CohortCard key={cohort.id} cohort={cohort} linkBase='/dashboard/funder/cohorts' />
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({ Icon, label, value }: { Icon: any; label: string; value: string }) {
  return (
    <Card>
      <CardContent className='p-5 flex items-center gap-4'>
        <div className='w-10 h-10 rounded-xl bg-[#0B1F3B]/8 flex items-center justify-center border border-[#0B1F3B]/10'>
          <Icon size={18} className='text-[#0B1F3B]' />
        </div>
        <div>
          <p className='text-xs text-gray-500'>{label}</p>
          <p className='text-2xl font-black text-[#0B1F3B]'>{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
