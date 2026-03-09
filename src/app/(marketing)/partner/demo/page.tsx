'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'

export default function PartnerDemoPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    country: '',
    businessType: '',
    monthlyLeads: '',
    preferredContactMethod: 'email',
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

    const { error } = await supabase.from('partner_demo_requests').insert({
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      organization: formData.organization || null,
      country: formData.country,
      business_type: formData.businessType,
      monthly_leads: formData.monthlyLeads || null,
      preferred_contact_method: formData.preferredContactMethod,
      notes: formData.notes || null,
      status: 'pending',
    })

    if (error) {
      console.error('insert error:', JSON.stringify(error))
      setMessage('Error submitting demo request: ' + error.message)
    } else {
      setMessage(
        'Demo request submitted successfully. Our team will contact you shortly.',
      )
      setTimeout(() => router.push('/partner'), 2500)
    }

    setLoading(false)
  }

  return (
    <div className='max-w-6xl mx-auto py-12 px-4'>
      <div className='text-center max-w-3xl mx-auto mb-12'>
        <h1 className='text-4xl md:text-5xl font-bold tracking-tight text-gray-900'>
          Request a Channel Partner Demo
        </h1>
        <p className='mt-4 text-lg text-gray-600 leading-8'>
          See how Inttlnt helps trusted partners identify eligible candidates,
          manage referrals, track pipeline activity, and deliver real outcomes
          to their communities.
        </p>
      </div>

      <div className='grid gap-8 lg:grid-cols-2'>
        <div className='space-y-6'>
          <Card>
            <CardContent className='p-8'>
              <h2 className='text-2xl font-bold mb-4 text-gray-900'>
                What the demo covers
              </h2>
              <div className='space-y-4 text-gray-600'>
                <div>
                  <h3 className='font-semibold text-gray-900 mb-1'>
                    Partner workflow overview
                  </h3>
                  <p>
                    Understand how your organization can refer qualified
                    candidates into verified migration, education, and workforce
                    pathways.
                  </p>
                </div>

                <div>
                  <h3 className='font-semibold text-gray-900 mb-1'>
                    Dashboard and pipeline visibility
                  </h3>
                  <p>
                    See how partners monitor referrals, progress, status
                    updates, and reporting from one place.
                  </p>
                </div>

                <div>
                  <h3 className='font-semibold text-gray-900 mb-1'>
                    Partner value and use cases
                  </h3>
                  <p>
                    Learn how associations, alumni networks, community groups,
                    education agents, and operators can create value for their
                    members.
                  </p>
                </div>

                <div>
                  <h3 className='font-semibold text-gray-900 mb-1'>
                    Next steps to join
                  </h3>
                  <p>
                    We will explain the qualification process, partner fit, and
                    what happens after the demo if you choose to apply.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-8'>
              <h2 className='text-2xl font-bold mb-4 text-gray-900'>
                Who should request a demo
              </h2>
              <div className='space-y-3 text-gray-600'>
                <p>Associations and professional bodies</p>
                <p>Community organizations and operators</p>
                <p>Alumni networks and educational partners</p>
                <p>Migration, recruitment, and advisory groups</p>
                <p>Organizations exploring referral partnerships</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className='p-8'>
            <h2 className='text-2xl font-bold mb-6 text-gray-900'>
              Book your demo
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
                label='Organization / Company'
                value={formData.organization}
                onChange={(e) =>
                  setFormData({ ...formData, organization: e.target.value })
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

              <div>
                <label className='block text-sm font-medium mb-2'>
                  Type of Business
                </label>
                <select
                  required
                  value={formData.businessType}
                  onChange={(e) =>
                    setFormData({ ...formData, businessType: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Select an option</option>
                  <option value='association'>Association</option>
                  <option value='community_organization'>
                    Community Organization
                  </option>
                  <option value='education_agent'>Education Agent</option>
                  <option value='migration_advisory'>
                    Migration Advisory
                  </option>
                  <option value='recruitment_partner'>
                    Recruitment Partner
                  </option>
                  <option value='alumni_network'>Alumni Network</option>
                  <option value='other'>Other</option>
                </select>
              </div>

              <Input
                label='Estimated Leads / Referrals Per Month'
                value={formData.monthlyLeads}
                onChange={(e) =>
                  setFormData({ ...formData, monthlyLeads: e.target.value })
                }
              />

              <div>
                <label className='block text-sm font-medium mb-2'>
                  Preferred Contact Method
                </label>
                <select
                  required
                  value={formData.preferredContactMethod}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferredContactMethod: e.target.value,
                    })
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value='email'>Email</option>
                  <option value='phone'>Phone</option>
                  <option value='whatsapp'>WhatsApp</option>
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
                  placeholder='Tell us about your organization, audience, or what you want to see in the demo.'
                />
              </div>

              <Button type='submit' disabled={loading} className='w-full'>
                {loading ? 'Submitting...' : 'Request Demo'}
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