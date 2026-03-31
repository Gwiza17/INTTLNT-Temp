'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'

const DISCIPLINES  = ['Engineering', 'Computer Science', 'Nursing', 'Education']
const DESTINATIONS = ['Canada', 'Australia']

export default function CohortFilters() {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams],
  )

  const current = (key: string) => searchParams.get(key) ?? ''

  return (
    <div className='flex flex-wrap gap-3 items-center'>

      {/* Discipline */}
      <select
        value={current('discipline')}
        onChange={(e) => setParam('discipline', e.target.value)}
        className='text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0B1F3B]/20'
      >
        <option value=''>All Disciplines</option>
        {DISCIPLINES.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      {/* Destination */}
      <select
        value={current('destination')}
        onChange={(e) => setParam('destination', e.target.value)}
        className='text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0B1F3B]/20'
      >
        <option value=''>All Destinations</option>
        {DESTINATIONS.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      {/* Clear */}
      {(current('discipline') || current('destination')) && (
        <button
          onClick={() => {
            const params = new URLSearchParams()
            router.push(`${pathname}?${params.toString()}`)
          }}
          className='text-sm text-gray-400 hover:text-gray-600 underline'
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
