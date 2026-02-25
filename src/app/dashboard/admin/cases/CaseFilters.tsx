'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

interface CaseFiltersProps {
  stages: { name: string }[]
}

export function CaseFilters({ stages }: CaseFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [stage, setStage] = useState(searchParams.get('stage') || '')
  const [intake, setIntake] = useState(searchParams.get('intake') || '')

  // Update URL when filters change
  const applyFilters = () => {
    const params = new URLSearchParams()
    if (stage) params.set('stage', stage)
    if (intake) params.set('intake', intake)
    router.push(`?${params.toString()}`)
  }

  // Reset filters
  const resetFilters = () => {
    setStage('')
    setIntake('')
    router.push('?')
  }

  // Debounce intake input to avoid too many URL updates
  useEffect(() => {
    const timer = setTimeout(() => {
      if (intake !== searchParams.get('intake')) {
        applyFilters()
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [intake])

  return (
    <div className='bg-white p-4 rounded-lg shadow mb-6'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Select
          label='Stage'
          options={[
            { value: '', label: 'All Stages' },
            ...stages.map((s) => ({ value: s.name, label: s.name })),
          ]}
          value={stage}
          onChange={(e) => {
            setStage(e.target.value)
            // Immediate apply for stage change
            const params = new URLSearchParams(searchParams)
            if (e.target.value) params.set('stage', e.target.value)
            else params.delete('stage')
            router.push(`?${params.toString()}`)
          }}
        />
        <Input
          label='Intake (contains)'
          placeholder='e.g., May 2026'
          value={intake}
          onChange={(e) => setIntake(e.target.value)}
        />
        <div className='flex items-end'>
          <Button variant='outline' onClick={resetFilters} className='w-full'>
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  )
}
