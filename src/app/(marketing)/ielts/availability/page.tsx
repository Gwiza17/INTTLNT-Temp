'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'

export default function IELTSAvailabilityPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    examType: '',
    preferredMonth: '',
    urgency: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

   const { error } = await supabase
     .from('ielts_availability_requests' as any)
     .insert({
       full_name: formData.fullName,
       email: formData.email,
       phone: formData.phone,
       country: formData.country,
       city: formData.city,
       exam_type: formData.examType,
       preferred_month: formData.preferredMonth,
       urgency: formData.urgency,
       notes: formData.notes || null,
       status: 'new',
     })

    if (error) {
      console.error('insert error:', JSON.stringify(error))
      setMessage('Error submitting availability request: ' + error.message)
    } else {
      setMessage(
        'Availability request submitted successfully. We will help you identify suitable IELTS test options.',
      )
      setTimeout(() => router.push('/ielts'), 2500)
    }

    setLoading(false)
  }

  return (
    <div className='max-w-6xl mx-auto py-12 px-4'>
      <div className='text-center max-w-3xl mx-auto mb-12'>
        <h1 className='text-4xl md:text-5xl font-bold tracking-tight text-gray-900'>
          Check Exam Availability
        </h1>
        <p className='mt-4 text-lg text-gray-600 leading-8'>
          Tell us your preferred location and timing. We use this to help you
          identify the earliest and most suitable IELTS exam options for your
          goals.
        </p>
      </div>

      <div className='grid gap-8 lg:grid-cols-2'>
        <div className='space-y-6'>
          <Card>
            <CardContent className='p-8'>
              <h2 className='text-2xl font-bold mb-4 text-gray-900'>
                What this helps you do
              </h2>
              <div className='space-y-4 text-gray-600'>
                <p>Check suitable IELTS booking timing</p>
                <p>Plan around your application or pathway deadlines</p>
                <p>Choose the exam format that fits you best</p>
                <p>Move faster when timing matters</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-8'>
              <h2 className='text-2xl font-bold mb-4 text-gray-900'>
                Good for students who
              </h2>
              <div className='space-y-4 text-gray-600'>
                <p>Already know they need IELTS soon</p>
                <p>Are trying to line up a pathway application</p>
                <p>Need the earliest feasible test window</p>
                <p>Want clarity before booking</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className='p-8'>
            <h2 className='text-2xl font-bold mb-6 text-gray-900'>
              Availability request form
            </h2>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <Input
                label='Full Name'
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />

              <Input
                label='Email'
                type='email'
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <Input
                label='Phone Number'
                type='tel'
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />

              <Input
                label='Country'
                required
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
              />

              <Input
                label='City'
                required
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />

              <div>
                <label className='block text-sm font-medium mb-2'>
                  Exam type
                </label>
                <select
                  required
                  value={formData.examType}
                  onChange={(e) =>
                    setFormData({ ...formData, examType: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Select exam type</option>
                  <option value='ielts_academic'>IELTS Academic</option>
                  <option value='ielts_general'>IELTS General Training</option>
                  <option value='not_sure'>Not sure yet</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>
                  Preferred month / timing
                </label>
                <select
                  required
                  value={formData.preferredMonth}
                  onChange={(e) =>
                    setFormData({ ...formData, preferredMonth: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Select timing</option>
                  <option value='asap'>As soon as possible</option>
                  <option value='this_month'>This month</option>
                  <option value='next_month'>Next month</option>
                  <option value='within_2_months'>Within 2 months</option>
                  <option value='within_3_months'>Within 3 months</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>
                  Urgency
                </label>
                <select
                  required
                  value={formData.urgency}
                  onChange={(e) =>
                    setFormData({ ...formData, urgency: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Select urgency</option>
                  <option value='low'>Low</option>
                  <option value='medium'>Medium</option>
                  <option value='high'>High</option>
                  <option value='very_high'>Very high</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>
                  Notes (optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Add anything helpful such as deadlines, pathway goals, or preferred exam center details.'
                />
              </div>

              <Button type='submit' disabled={loading} className='w-full'>
                {loading ? 'Submitting...' : 'Check Availability'}
              </Button>

              {message && (
                <div className='mt-4 p-3 bg-blue-50 text-blue-800 rounded'>
                  {message}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}