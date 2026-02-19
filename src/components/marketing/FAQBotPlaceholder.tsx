'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function FAQBotPlaceholder() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return
    // Placeholder response
    setAnswer(
      'Thank you for your question. Our team will get back to you soon. In the meantime, you can start your EOI or contact a partner.',
    )
    // In future, log unanswered questions to Supabase
  }

  return (
    <div className='bg-gray-50 p-6 rounded-lg border'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Input
          label='Ask a question'
          placeholder='e.g., What is the IELTS requirement?'
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Button type='submit'>Ask</Button>
      </form>
      {answer && (
        <div className='mt-4 p-4 bg-blue-50 rounded-md'>
          <p className='text-gray-800'>{answer}</p>
        </div>
      )}
      <p className='text-xs text-gray-500 mt-2'>
        Not finding answers?{' '}
        <a href='/eoi' className='text-blue-600'>
          Submit an EOI
        </a>{' '}
        or{' '}
        <a href='/partner' className='text-blue-600'>
          talk to a partner
        </a>
        .
      </p>
    </div>
  )
}