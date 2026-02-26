'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'

type UserRole =
  | 'channel_partner'
  | 'admin'
  | 'applicant'
  | 'funder'
  | 'migration_agent'
  | 'education_provider'
  | 'employer'

export default function PartnerApplyPage() {
  const [formData, setFormData] = useState<{
    name: string
    email: string
    org: string
    roles: UserRole[]
  }>({
    name: '',
    email: '',
    org: '',
    roles: ['channel_partner'],
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const partnerCode =
      'PARTNER_' + Math.random().toString(36).substring(2, 8).toUpperCase()

    const { error } = await supabase.from('stakeholders').insert({
      name: formData.name,
      email: formData.email,
      org: formData.org,
      roles: formData.roles,
      status: 'pending',
      partner_code: partnerCode,
    })

    if (error) {
      console.error('insert error:', JSON.stringify(error))
      setMessage('Error submitting application: ' + error.message)
    } else {
      setMessage(
        'Application submitted! You will receive an email once approved.',
      )
      setTimeout(() => router.push('/partner'), 3000)
    }
    setLoading(false)
  }

  return (
    <div className='max-w-2xl mx-auto py-12 px-4'>
      <Card>
        <CardContent className='p-8'>
          <h1 className='text-3xl font-bold mb-6'>Apply to Become a Partner</h1>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <Input
              label='Full Name'
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
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
              label='Organization (optional)'
              value={formData.org}
              onChange={(e) =>
                setFormData({ ...formData, org: e.target.value })
              }
            />
            <Button type='submit' disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
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
  )
}
