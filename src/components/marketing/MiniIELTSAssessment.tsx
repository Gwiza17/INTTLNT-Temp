'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'

type Answers = {
  englishLevel?: string
  previousIELTS?: string
  timeline?: string
}

function getResult(answers: Answers): { message: string; ready: boolean } {
  const { englishLevel, previousIELTS, timeline } = answers

  // Already scored 7.0+ — ready now
  if (previousIELTS === 'yes_above') {
    return {
      ready: true,
      message:
        'You already have an IELTS score of 7.0 or above — you meet the language requirement. Complete the full assessment to confirm your eligibility.',
    }
  }

  // Advanced English + no previous test or below 7.0 + planning soon
  if (
    englishLevel === 'advanced' &&
    (timeline === '1month' || timeline === '3months')
  ) {
    return {
      ready: true,
      message:
        'You may be ready to sit IELTS soon. Your English level is strong and your timeline looks good. Complete the full assessment to confirm.',
    }
  }

  // Advanced but no urgency
  if (
    englishLevel === 'advanced' &&
    (timeline === '6months' || timeline === 'unsure')
  ) {
    return {
      ready: false,
      message:
        'Your English level is strong but you have time — use it to prepare thoroughly and aim for 7.0+ in all bands.',
    }
  }

  // Intermediate — needs prep
  if (englishLevel === 'intermediate') {
    return {
      ready: false,
      message:
        'You would benefit from structured IELTS preparation before sitting the test. Start the IELTS plan to build your score to 7.0+.',
    }
  }

  // Beginner — needs significant prep
  if (englishLevel === 'beginner') {
    return {
      ready: false,
      message:
        'We recommend focused English and IELTS preparation before booking your test. Start with our IELTS readiness plan.',
    }
  }

  // Fallback
  return {
    ready: false,
    message:
      'Based on your answers, some preparation is recommended before sitting IELTS. Start the full assessment for a detailed plan.',
  }
}

export default function MiniIELTSAssessment() {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Answers>({})
  const [result, setResult] = useState<{
    message: string
    ready: boolean
  } | null>(null)

  const handleAnswer = (data: Partial<Answers>) => {
    const updated = { ...answers, ...data }
    setAnswers(updated)

    if (step < 3) {
      setStep(step + 1)
    } else {
      setResult(getResult(updated))
    }
  }

  if (result) {
    return (
      <div
        className={`p-6 rounded-lg text-center ${result.ready ? 'bg-green-50' : 'bg-blue-50'}`}
      >
        <div className='text-3xl mb-3'>{result.ready ? '✅' : '📚'}</div>
        <p className='text-lg text-gray-800 mb-6'>{result.message}</p>
        <div className='flex justify-center gap-4 flex-wrap'>
          <Link href='/ielts'>
            <Button>Complete Full Assessment</Button>
          </Link>
          <Link href='/eoi'>
            <Button variant='outline'>Apply Now</Button>
          </Link>
        </div>
        <button
          className='mt-4 text-sm text-gray-500 underline'
          onClick={() => {
            setStep(1)
            setAnswers({})
            setResult(null)
          }}
        >
          Start over
        </button>
      </div>
    )
  }

  return (
    <div className='bg-gray-50 p-6 rounded-lg border'>
      <h3 className='text-xl font-semibold mb-4'>
        Quick IELTS Readiness Check
      </h3>
      <p className='text-gray-600 mb-6'>
        Answer 3 short questions to see whether you're ready to sit IELTS now.
      </p>

      {step === 1 && (
        <Select
          label='How comfortable are you with English?'
          options={[
            { value: '', label: 'Select an option' },
            { value: 'beginner', label: 'Beginner — I struggle with English' },
            {
              value: 'intermediate',
              label: 'Intermediate — I can communicate but make errors',
            },
            {
              value: 'advanced',
              label: 'Advanced — I am fluent and confident',
            },
          ]}
          onChange={(e) => {
            if (e.target.value) handleAnswer({ englishLevel: e.target.value })
          }}
        />
      )}

      {step === 2 && (
        <Select
          label='Have you taken IELTS before?'
          options={[
            { value: '', label: 'Select an option' },
            { value: 'no', label: 'No, never taken IELTS' },
            { value: 'yes', label: 'Yes, scored below 7.0' },
            { value: 'yes_above', label: 'Yes, scored 7.0 or above' },
          ]}
          onChange={(e) => {
            if (e.target.value) handleAnswer({ previousIELTS: e.target.value })
          }}
        />
      )}

      {step === 3 && (
        <Select
          label='How soon do you plan to take IELTS?'
          options={[
            { value: '', label: 'Select an option' },
            { value: '1month', label: 'Within 1 month' },
            { value: '3months', label: 'Within 3 months' },
            { value: '6months', label: 'Within 6 months' },
            { value: 'unsure', label: 'Not sure yet' },
          ]}
          onChange={(e) => {
            if (e.target.value) handleAnswer({ timeline: e.target.value })
          }}
        />
      )}

      <p className='text-sm text-gray-500 mt-4'>Question {step} of 3</p>
    </div>
  )
}
