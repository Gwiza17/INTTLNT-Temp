import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CandidateCard from '@/components/marketplace/CandidateCard'
import { ArrowLeft, MapPin, Users, GraduationCap, Info } from 'lucide-react'
import type { CandidateProfile } from '@/types/marketplace'

interface PageProps {
  params: { cohort: string }
}

export default async function CohortDetailPage({ params }: PageProps) {
  const supabase = createClient()

  // Load cohort
  const { data: cohort } = await supabase
    .from('cohorts')
    .select('*')
    .eq('id', params.cohort)
    .eq('is_active', true)
    .single()

  if (!cohort) notFound()

  // Load candidates
  const { data: candidates } = await supabase
    .from('candidate_marketplace_profiles')
    .select('*')
    .eq('cohort_id', cohort.id)
    .eq('is_visible', true)
    .order('opportunity_score', { ascending: false })

  // Check if viewer is an authenticated, approved stakeholder
  const { data: { user } } = await supabase.auth.getUser()

  let stakeholder: { id: string } | null = null
  let interestMap: Record<string, string> = {}

  if (user) {
    const { data: sh } = await supabase
      .from('stakeholders')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'approved')
      .single()

    stakeholder = sh ?? null

    if (stakeholder) {
      const profileIds = (candidates ?? []).map((c: CandidateProfile) => c.id)
      if (profileIds.length > 0) {
        const { data: interests } = await supabase
          .from('marketplace_interest')
          .select('candidate_profile_id, status')
          .eq('stakeholder_id', stakeholder.id)
          .in('candidate_profile_id', profileIds)

        for (const i of interests ?? []) {
          interestMap[i.candidate_profile_id] = i.status
        }
      }
    }
  }

  const destinationFlag = cohort.destination === 'Australia' ? '🇦🇺' : '🇨🇦'

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />

      {/* Back + cohort header */}
      <div className='bg-[#0B1F3B] px-6 lg:px-12 pt-10 pb-16'>
        <div className='max-w-7xl mx-auto'>
          <Link
            href='/marketplace'
            className='inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-6 transition-colors'
          >
            <ArrowLeft size={14} /> Back to Marketplace
          </Link>

          <h1 className='text-white font-black text-3xl lg:text-4xl mb-3'>{cohort.name}</h1>
          <p className='text-amber-300 text-sm font-semibold mb-5'>{cohort.pathway}</p>

          <div className='flex flex-wrap gap-6 text-sm text-gray-300'>
            <span className='flex items-center gap-1.5'>
              <MapPin size={14} className='text-amber-400' />
              {destinationFlag} {cohort.destination}
            </span>
            <span className='flex items-center gap-1.5'>
              <Users size={14} className='text-amber-400' />
              {cohort.candidate_count} candidates
            </span>
            <span className='flex items-center gap-1.5'>
              <GraduationCap size={14} className='text-amber-400' />
              {cohort.discipline}
            </span>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 lg:px-12 -mt-6 pb-20'>

        {/* Privacy notice */}
        <div className='bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex gap-3 mb-8 text-sm text-amber-800'>
          <Info size={16} className='flex-shrink-0 mt-0.5 text-amber-500' />
          <span>
            All profiles are anonymised. Clicking <strong>Express Interest</strong> sends a notification to the candidate.
            Contact details are only shared after the candidate approves.
          </span>
        </div>

        {/* Candidate grid */}
        {!candidates || candidates.length === 0 ? (
          <p className='text-center text-gray-400 py-16'>No visible candidates in this cohort yet.</p>
        ) : (
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
            {candidates.map((c: CandidateProfile) => (
              <CandidateCard
                key={c.id}
                candidate={c}
                canExpressInterest={!!stakeholder}
                interestStatus={(interestMap[c.id] as any) ?? null}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
