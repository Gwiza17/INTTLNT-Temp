import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CohortCard from '@/components/marketplace/CohortCard'
import CohortFilters from '@/components/marketplace/CohortFilters'
import type { Cohort } from '@/types/marketplace'
import { Globe2, Users2, Search } from 'lucide-react'

interface PageProps {
  searchParams: {
    discipline?: string
    destination?: string
    country?: string
  }
}

async function CohortsGrid({ searchParams }: PageProps) {
  const supabase = createClient()

  let query = supabase
    .from('cohorts')
    .select('*')
    .eq('is_active', true)
    .order('discipline')
    .order('country_of_origin')

  if (searchParams.discipline) query = query.eq('discipline', searchParams.discipline)
  if (searchParams.destination) query = query.eq('destination', searchParams.destination)
  if (searchParams.country)     query = query.eq('country_of_origin', searchParams.country)

  const { data: cohorts } = await query

  if (!cohorts || cohorts.length === 0) {
    return (
      <div className='col-span-full py-20 text-center'>
        <Search size={40} className='text-gray-300 mx-auto mb-4' />
        <p className='text-gray-500 font-semibold'>No cohorts match your filters.</p>
        <p className='text-gray-400 text-sm mt-1'>Try removing a filter to see more results.</p>
      </div>
    )
  }

  return (
    <>
      {cohorts.map((cohort: Cohort) => (
        <CohortCard key={cohort.id} cohort={cohort} />
      ))}
    </>
  )
}

export default function MarketplacePage({ searchParams }: PageProps) {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />

      {/* Hero banner */}
      <div className='bg-[#0B1F3B] py-20 px-6 lg:px-12'>
        <div className='max-w-7xl mx-auto'>
          <div className='inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-widest uppercase rounded-full px-4 py-1.5 mb-6'>
            <Globe2 size={12} /> Candidate Cohort Marketplace
          </div>
          <h1 className='text-white font-black text-4xl lg:text-5xl leading-tight mb-4'>
            Browse verified talent cohorts
          </h1>
          <p className='text-gray-300 text-base max-w-2xl'>
            Explore anonymised groups of pre-assessed candidates organised by discipline, origin country, and destination.
            Express interest in individuals and we'll notify them — they choose whether to connect with you.
          </p>

          {/* Stats */}
          <div className='flex flex-wrap gap-8 mt-8 text-sm'>
            <div className='flex items-center gap-2 text-gray-300'>
              <Users2 size={16} className='text-amber-400' />
              <span>Candidates anonymised until approved</span>
            </div>
            <div className='flex items-center gap-2 text-gray-300'>
              <Globe2 size={16} className='text-amber-400' />
              <span>Canada &amp; Australia pathways</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters + grid */}
      <div className='max-w-7xl mx-auto px-6 lg:px-12 py-12'>

        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8'>
          <h2 className='text-[#0B1F3B] font-bold text-xl'>Active Cohorts</h2>
          <Suspense>
            <CohortFilters />
          </Suspense>
        </div>

        <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
          <Suspense fallback={<p className='col-span-full text-center text-gray-400 py-12'>Loading cohorts…</p>}>
            <CohortsGrid searchParams={searchParams} />
          </Suspense>
        </div>
      </div>

      <Footer />
    </div>
  )
}
