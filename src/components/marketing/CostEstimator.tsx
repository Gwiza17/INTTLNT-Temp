'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'

interface CostEstimatorProps {
  pathway?: string
}

export default function CostEstimator({
  pathway = 'engineering',
}: CostEstimatorProps) {
  const [household, setHousehold] = useState('single')
  const [ieltsStatus, setIeltsStatus] = useState('')
  const [fundingApproach, setFundingApproach] = useState('self')
  const [showEstimate, setShowEstimate] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowEstimate(true)
  }

  // Dummy estimates – replace with real logic later
  const upfront = fundingApproach === 'self' ? 5000 : 2000
  const ongoing = fundingApproach === 'self' ? '15,000–20,000' : '10,000–15,000'

  return (
    <div className='bg-gray-50 p-6 rounded-lg border'>
      <p className='text-gray-600 mb-4'>
        Estimate your upfront mobilisation costs and ongoing study + settlement
        costs.
      </p>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Select
          label='Household'
          options={[
            { value: 'single', label: 'Single' },
            { value: 'couple', label: 'Couple' },
          ]}
          value={household}
          onChange={(e) => setHousehold(e.target.value)}
        />
        <Select
          label='IELTS Status'
          options={[
            { value: 'not_taken', label: 'Not taken' },
            { value: 'preparing', label: 'Preparing' },
            { value: 'ready', label: 'Ready (≥7.0)' },
          ]}
          value={ieltsStatus}
          onChange={(e) => setIeltsStatus(e.target.value)}
        />
        <Select
          label='Funding Approach'
          options={[
            { value: 'self', label: 'Self-funded' },
            { value: 'assisted', label: 'Finance-assisted' },
          ]}
          value={fundingApproach}
          onChange={(e) => setFundingApproach(e.target.value)}
        />
        <Button type='submit'>Estimate</Button>
      </form>
      {showEstimate && (
        <div className='mt-6 p-4 bg-blue-50 rounded-md'>
          <p className='font-semibold'>Estimated Upfront: ${upfront}</p>
          <p className='font-semibold'>
            Estimated Ongoing (annual): ${ongoing}
          </p>
          <p className='text-xs text-gray-500 mt-2'>
            These are rough estimates. Actual costs vary.
          </p>
        </div>
      )}
    </div>
  )
}
