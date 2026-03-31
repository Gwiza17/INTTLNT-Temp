import Link from 'next/link'
import { ArrowRight, Users, MapPin } from 'lucide-react'
import type { Cohort } from '@/types/marketplace'

const DISCIPLINE_COLOURS: Record<string, string> = {
  'Engineering':      'bg-blue-50 text-blue-700 border-blue-200',
  'Computer Science': 'bg-violet-50 text-violet-700 border-violet-200',
  'Nursing':          'bg-teal-50 text-teal-700 border-teal-200',
  'Education':        'bg-amber-50 text-amber-700 border-amber-200',
}

const DESTINATION_FLAGS: Record<string, string> = {
  Canada:    '🇨🇦',
  Australia: '🇦🇺',
}

interface CohortCardProps {
  cohort: Cohort
  linkBase?: string   // defaults to /marketplace
}

export default function CohortCard({ cohort, linkBase = '/marketplace' }: CohortCardProps) {
  const colourClass = DISCIPLINE_COLOURS[cohort.discipline] ?? 'bg-gray-50 text-gray-700 border-gray-200'
  const flag = DESTINATION_FLAGS[cohort.destination] ?? '🌏'

  return (
    <Link
      href={`${linkBase}/${cohort.id}`}
      className='group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-[#0B1F3B]/30 transition-all duration-200'
    >
      {/* Header */}
      <div className='mb-4'>
        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${colourClass} mb-3`}>
          {cohort.discipline}
        </span>
        <h3 className='text-[#0B1F3B] font-bold text-lg leading-snug group-hover:text-amber-600 transition-colors'>
          {cohort.name}
        </h3>
        <p className='text-gray-500 text-sm mt-1'>{cohort.pathway}</p>
      </div>

      {/* Meta */}
      <div className='flex items-center justify-between text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100'>
        <div className='flex items-center gap-3'>
          <span className='flex items-center gap-1'>
            <MapPin size={13} /> {flag} {cohort.destination}
          </span>
          <span className='flex items-center gap-1'>
            <Users size={13} /> {cohort.candidate_count} candidates
          </span>
        </div>
        <ArrowRight
          size={16}
          className='text-gray-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all'
        />
      </div>
    </Link>
  )
}
