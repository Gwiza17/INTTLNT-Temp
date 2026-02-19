'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'

const disciplines = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'nursing', label: 'Nursing' },
  { value: 'ict', label: 'ICT' },
  { value: 'teaching', label: 'Teaching' },
  { value: 'accounting', label: 'Accounting' },
]

const destinations = [
  { value: 'canada', label: 'Canada' },
  { value: 'australia', label: 'Australia' },
  { value: 'usa', label: 'USA' },
]

export default function PathwayMatrix() {
  const [discipline, setDiscipline] = useState('')
  const [destination, setDestination] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!discipline || !destination) return

    // Routing logic per spec
    if (discipline === 'engineering' && destination === 'canada') {
      router.push('/engineering')
    } else if (discipline === 'nursing' && destination === 'australia') {
      router.push('/nursing')
    } else {
      // All other combos go to EOI form with query params
      router.push(`/eoi?discipline=${discipline}&destination=${destination}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Select
          label='Discipline'
          options={disciplines}
          value={discipline}
          onChange={(e) => setDiscipline(e.target.value)}
          required
        />
        <Select
          label='Destination'
          options={destinations}
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />
      </div>
      <div className='text-center'>
        <Button type='submit' disabled={!discipline || !destination}>
          Proceed
        </Button>
      </div>
    </form>
  )
}
