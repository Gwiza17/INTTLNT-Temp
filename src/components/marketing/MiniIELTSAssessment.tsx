'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

type Answers = {
  englishLevel?: string
  previousIELTS?: string
  timeline?: string
}

function getResult(answers: Answers): { message: string; ready: boolean } {
  const { englishLevel, previousIELTS, timeline } = answers

  if (previousIELTS === 'yes_above') {
    return {
      ready: true,
      message:
        'You already have an IELTS score of 7.0 or above — you meet the language requirement. Complete the full assessment to confirm your eligibility.',
    }
  }

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

  if (englishLevel === 'intermediate') {
    return {
      ready: false,
      message:
        'You would benefit from structured IELTS preparation before sitting the test. Start the IELTS plan to build your score to 7.0+.',
    }
  }

  if (englishLevel === 'beginner') {
    return {
      ready: false,
      message:
        'We recommend focused English and IELTS preparation before booking your test. Start with our IELTS readiness plan.',
    }
  }

  return {
    ready: false,
    message:
      'Based on your answers, some preparation is recommended before sitting IELTS. Start the full assessment for a detailed plan.',
  }
}

const questions = [
  {
    key: 'englishLevel',
    question: 'How comfortable are you with English?',
    options: [
      {
        value: 'beginner',
        label: 'Beginner',
        description: 'I struggle with English',
      },
      {
        value: 'intermediate',
        label: 'Intermediate',
        description: 'I can communicate but make errors',
      },
      {
        value: 'advanced',
        label: 'Advanced',
        description: 'I am fluent and confident',
      },
    ],
  },
  {
    key: 'previousIELTS',
    question: 'Have you taken IELTS before?',
    options: [
      {
        value: 'no',
        label: 'Never taken IELTS',
        description: 'This will be my first time',
      },
      {
        value: 'yes',
        label: 'Yes, scored below 7.0',
        description: 'I scored under the threshold',
      },
      {
        value: 'yes_above',
        label: 'Yes, scored 7.0 or above',
        description: 'I already meet the requirement',
      },
    ],
  },
  {
    key: 'timeline',
    question: 'How soon do you plan to take IELTS?',
    options: [
      {
        value: '1month',
        label: 'Within 1 month',
        description: 'I want to book very soon',
      },
      {
        value: '3months',
        label: 'Within 3 months',
        description: 'I have a bit of time to prepare',
      },
      {
        value: '6months',
        label: 'Within 6 months',
        description: 'I have time to prepare well',
      },
      {
        value: 'unsure',
        label: 'Not sure yet',
        description: 'I need guidance on timing',
      },
    ],
  },
]

export default function MiniIELTSAssessment() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [result, setResult] = useState<{
    message: string
    ready: boolean
  } | null>(null)

  const handleAnswer = (value: string) => {
    const current = questions[step]
    const updated = { ...answers, [current.key]: value }
    setAnswers(updated)

    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      setResult(getResult(updated))
    }
  }

  if (result) {
    return (
      <div
        className={`p-8 rounded-2xl text-center ${result.ready ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}
      >
        <div className='text-4xl mb-4'>{result.ready ? '✅' : '📚'}</div>
        <p className='text-lg text-gray-800 font-medium mb-6 max-w-xl mx-auto'>
          {result.message}
        </p>
        <div className='flex justify-center gap-4 flex-wrap'>
          <Link href='/ielts'>
            <Button>Complete Full Assessment</Button>
          </Link>
          <Link href='/eoi'>
            <Button variant='outline'>Apply Now</Button>
          </Link>
        </div>
        <button
          className='mt-5 text-sm text-gray-400 underline hover:text-gray-600'
          onClick={() => {
            setStep(0)
            setAnswers({})
            setResult(null)
          }}
        >
          Start over
        </button>
      </div>
    )
  }

  const current = questions[step]

  return (
    <div className='bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-xl mx-auto'>
      {/* Progress bar */}
      <div className='flex gap-2 mb-8'>
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= step ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <h3 className='text-2xl font-bold text-gray-900 mb-1'>
        {current.question}
      </h3>
      <p className='text-sm text-gray-400 mb-6'>
        Question {step + 1} of {questions.length}
      </p>

      {/* Option Cards */}
      <div className='flex flex-col gap-3'>
        {current.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleAnswer(option.value)}
            className='w-full text-left px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-150 group'
          >
            <span className='font-semibold text-gray-900 group-hover:text-blue-700'>
              {option.label}
            </span>
            <span className='block text-sm text-gray-500 mt-0.5'>
              {option.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
