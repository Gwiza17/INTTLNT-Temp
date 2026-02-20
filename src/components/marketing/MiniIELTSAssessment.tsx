'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

export default function MiniIELTSAssessment() {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState('')

  const handleNext = (data: any) => {
    setAnswers({ ...answers, ...data })
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Mock result
      const mockResults = [
        "You may be close—complete the full assessment to confirm your band range.",
        "You'll benefit from preparation—start the IELTS plan and book your earliest test window."
      ]
      setResult(mockResults[Math.floor(Math.random() * mockResults.length)])
    }
  }

  if (result) {
    return (
      <div className="bg-blue-50 p-6 rounded-lg text-center">
        <p className="text-lg text-gray-800">{result}</p>
        <div className="mt-4 flex justify-center gap-4">
          <link href="/ielts/assessment">
            <Button>Complete Full Assessment</Button>
          </link>
          <link href="/ielts/availability">
            <Button variant="outline">Check Exam Availability</Button>
          </link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg border">
      <h3 className="text-xl font-semibold mb-4">Quick IELTS Readiness</h3>
      <p className="text-gray-600 mb-4">Answer a few short questions to see whether you're likely ready to sit IELTS now.</p>
      {step === 1 && (
        <div className="space-y-4">
          <Select
            label="How comfortable are you with English?"
            options={[
              { value: 'beginner', label: 'Beginner' },
              { value: 'intermediate', label: 'Intermediate' },
              { value: 'advanced', label: 'Advanced' },
            ]}
            onChange={(e) => handleNext({ englishLevel: e.target.value })}
          />
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <Select
            label="Have you taken IELTS before?"
            options={[
              { value: 'no', label: 'No' },
              { value: 'yes', label: 'Yes, below 7.0' },
              { value: 'yes_above', label: 'Yes, 7.0 or above' },
            ]}
            onChange={(e) => handleNext({ previousIELTS: e.target.value })}
          />
        </div>
      )}
      {step === 3 && (
        <div className="space-y-4">
          <Select
            label="How soon do you plan to take IELTS?"
            options={[
              { value: '1month', label: 'Within 1 month' },
              { value: '3months', label: 'Within 3 months' },
              { value: '6months', label: 'Within 6 months' },
              { value: 'unsure', label: 'Not sure' },
            ]}
            onChange={(e) => handleNext({ timeline: e.target.value })}
          />
        </div>
      )}
      {step < 3 && (
        <p className="text-sm text-gray-500 mt-2">Question {step} of 3</p>
      )}
    </div>
  )
}