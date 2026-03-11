'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'

export default function IELTSAssessmentPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    currentBand: '',
    targetBand: '',
    testTimeline: '',
    weakestArea: '',
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

    const { error } = await supabase.from('ielts_assessments' as any).insert({
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      current_band: formData.currentBand || null,
      target_band: formData.targetBand,
      test_timeline: formData.testTimeline,
      weakest_area: formData.weakestArea,
      notes: formData.notes || null,
      status: 'new',
    })

    if (error) {
      console.error('insert error:', JSON.stringify(error))
      setMessage('Error submitting assessment: ' + error.message)
    } else {
      setMessage(
        'Assessment submitted successfully. We will review your details and guide you on the next step.',
      )
      setTimeout(() => router.push('/ielts'), 2500)
    }

    setLoading(false)
  }

  return (
    <div className='max-w-6xl mx-auto py-12 px-4'>
      <div className='text-center max-w-3xl mx-auto mb-12'>
        <h1 className='text-4xl md:text-5xl font-bold tracking-tight text-gray-900'>
          Start IELTS Assessment
        </h1>
        <p className='mt-4 text-lg text-gray-600 leading-8'>
          Tell us where you are now, what score you need, and how soon you want
          to test. We use this to understand your readiness and guide you into
          the best next step.
        </p>
      </div>

      <div className='grid gap-8 lg:grid-cols-2'>
        <div className='space-y-6'>
          <Card>
            <CardContent className='p-8'>
              <h2 className='text-2xl font-bold mb-4 text-gray-900'>
                What this assessment helps with
              </h2>
              <div className='space-y-4 text-gray-600'>
                <p>Identify your current IELTS position</p>
                <p>Estimate the gap between your current and target score</p>
                <p>Highlight the skill area that needs the most attention</p>
                <p>Help you choose a realistic preparation timeline</p>
                <p>Prepare you for the right pathway after IELTS</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-8'>
              <h2 className='text-2xl font-bold mb-4 text-gray-900'>
                Best for students who
              </h2>
              <div className='space-y-4 text-gray-600'>
                <p>Need IELTS for study, migration, or work pathways</p>
                <p>Are unsure whether they are ready to book the exam</p>
                <p>Want a structured preparation route</p>
                <p>Need clarity before starting an application</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className='p-8'>
            <h2 className='text-2xl font-bold mb-6 text-gray-900'>
              Assessment form
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
                label='Current IELTS Band (optional)'
                value={formData.currentBand}
                onChange={(e) =>
                  setFormData({ ...formData, currentBand: e.target.value })
                }
              />

              <div>
                <label className='block text-sm font-medium mb-2'>
                  Target IELTS Band
                </label>
                <select
                  required
                  value={formData.targetBand}
                  onChange={(e) =>
                    setFormData({ ...formData, targetBand: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Select target band</option>
                  <option value='5.5'>5.5</option>
                  <option value='6.0'>6.0</option>
                  <option value='6.5'>6.5</option>
                  <option value='7.0'>7.0</option>
                  <option value='7.5'>7.5</option>
                  <option value='8.0+'>8.0+</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>
                  When do you want to take the test?
                </label>
                <select
                  required
                  value={formData.testTimeline}
                  onChange={(e) =>
                    setFormData({ ...formData, testTimeline: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Select timeline</option>
                  <option value='within_2_weeks'>Within 2 weeks</option>
                  <option value='within_1_month'>Within 1 month</option>
                  <option value='within_2_months'>Within 2 months</option>
                  <option value='within_3_months'>Within 3 months</option>
                  <option value='not_sure_yet'>Not sure yet</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>
                  Weakest area
                </label>
                <select
                  required
                  value={formData.weakestArea}
                  onChange={(e) =>
                    setFormData({ ...formData, weakestArea: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Select an area</option>
                  <option value='listening'>Listening</option>
                  <option value='reading'>Reading</option>
                  <option value='writing'>Writing</option>
                  <option value='speaking'>Speaking</option>
                  <option value='not_sure'>Not sure</option>
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
                  placeholder='Tell us anything useful about your IELTS situation, deadlines, or pathway goals.'
                />
              </div>

              <Button type='submit' disabled={loading} className='w-full'>
                {loading ? 'Submitting...' : 'Submit Assessment'}
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