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

type ApplicantType = 'individual' | 'organization' | 'other'

export default function PartnerApplyPage() {
  const [formData, setFormData] = useState<{
    applicantType: ApplicantType
    name: string
    email: string
    org: string
    roles: UserRole[]
    phone: string
    country: string
    city: string
    address: string
    preferredContactMethod: string
    passportNumber: string
    nationality: string
    dateOfBirth: string
    organizationName: string
    registrationNumber: string
    organizationCountry: string
    website: string
    contactPersonName: string
    contactPersonRole: string
    otherTypeDescription: string
  }>({
    applicantType: 'individual',
    name: '',
    email: '',
    org: '',
    roles: ['channel_partner'],
    phone: '',
    country: '',
    city: '',
    address: '',
    preferredContactMethod: 'email',
    passportNumber: '',
    nationality: '',
    dateOfBirth: '',
    organizationName: '',
    registrationNumber: '',
    organizationCountry: '',
    website: '',
    contactPersonName: '',
    contactPersonRole: '',
    otherTypeDescription: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const validateAge = (dob: string): boolean => {
    const birthDate = new Date(dob)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1 >= 18
    }
    return age >= 18
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Age validation for individuals
    if (formData.applicantType === 'individual' && formData.dateOfBirth) {
      if (!validateAge(formData.dateOfBirth)) {
        setError('You must be at least 18 years old to apply.')
        setLoading(false)
        return
      }
    }

    const partnerCode =
      'PARTNER_' + Math.random().toString(36).substring(2, 8).toUpperCase()

    const resolvedName =
      formData.applicantType === 'individual'
        ? formData.name
        : formData.contactPersonName || formData.name

    const resolvedOrg =
      formData.applicantType === 'organization'
        ? formData.organizationName
        : formData.org

    const { error: insertError } = await supabase.from('stakeholders').insert({
      name: resolvedName,
      email: formData.email,
      org: resolvedOrg,
      roles: formData.roles,
      status: 'pending',
      partner_code: partnerCode,
      applicant_type: formData.applicantType,
      phone: formData.phone,
      country: formData.country,
      city: formData.city,
      address: formData.address,
      preferred_contact_method: 'email',
      passport_number:
        formData.applicantType === 'individual'
          ? formData.passportNumber
          : null,
      nationality:
        formData.applicantType === 'individual' ? formData.nationality : null,
      date_of_birth:
        formData.applicantType === 'individual' ? formData.dateOfBirth : null,
      registration_number:
        formData.applicantType === 'organization'
          ? formData.registrationNumber
          : null,
      organization_country:
        formData.applicantType === 'organization'
          ? formData.organizationCountry
          : null,
      website:
        formData.applicantType === 'organization' ? formData.website : null,
      contact_person_name:
        formData.applicantType !== 'individual'
          ? formData.contactPersonName
          : null,
      contact_person_role:
        formData.applicantType !== 'individual'
          ? formData.contactPersonRole
          : null,
      other_type_description:
        formData.applicantType === 'other'
          ? formData.otherTypeDescription
          : null,
    })

    if (insertError) {
      console.error('insert error:', JSON.stringify(insertError))
      setError('Error submitting application: ' + insertError.message)
    } else {
      setShowSuccess(true)
    }
    setLoading(false)
  }

  return (
    <div className='max-w-2xl mx-auto py-12 px-4'>
      {/* Success Popup */}
      {showSuccess && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4 text-center'>
            <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-8 h-8 text-green-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>
              Application Received!
            </h2>
            <p className='text-gray-600 mb-6'>
              Thank you for applying. Your application is under review and you
              will receive an approval email once it has been processed.
            </p>
            <Button
              onClick={() => {
                setShowSuccess(false)
                router.push('/partner')
              }}
            >
              Back to Home
            </Button>
          </div>
        </div>
      )}

      <Card>
        <CardContent className='p-8'>
          <h1 className='text-3xl font-bold mb-6'>Apply to Become a Partner</h1>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Applicant Type
              </label>
              <select
                required
                value={formData.applicantType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    applicantType: e.target.value as ApplicantType,
                    name: '',
                    org: '',
                    passportNumber: '',
                    nationality: '',
                    dateOfBirth: '',
                    organizationName: '',
                    registrationNumber: '',
                    organizationCountry: '',
                    website: '',
                    contactPersonName: '',
                    contactPersonRole: '',
                    otherTypeDescription: '',
                  })
                }
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value='individual'>Individual</option>
                <option value='organization'>Organization</option>
                <option value='other'>Other</option>
              </select>
            </div>

            {formData.applicantType === 'individual' && (
              <>
                <Input
                  label='Full Name'
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <Input
                  label='Passport Number'
                  required
                  value={formData.passportNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, passportNumber: e.target.value })
                  }
                />
                <Input
                  label='Nationality'
                  required
                  value={formData.nationality}
                  onChange={(e) =>
                    setFormData({ ...formData, nationality: e.target.value })
                  }
                />
                <div>
                  <Input
                    label='Date of Birth'
                    type='date'
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                  />
                  <p className='text-xs text-gray-500 mt-1'>
                    You must be at least 18 years old to apply.
                  </p>
                </div>
                <Input
                  label='Organization (optional)'
                  value={formData.org}
                  onChange={(e) =>
                    setFormData({ ...formData, org: e.target.value })
                  }
                />
              </>
            )}

            {formData.applicantType === 'organization' && (
              <>
                <Input
                  label='Organization Name'
                  required
                  value={formData.organizationName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      organizationName: e.target.value,
                    })
                  }
                />
                <Input
                  label='Registration Number'
                  required
                  value={formData.registrationNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      registrationNumber: e.target.value,
                    })
                  }
                />
                <Input
                  label='Country of Registration'
                  required
                  value={formData.organizationCountry}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      organizationCountry: e.target.value,
                    })
                  }
                />
                <Input
                  label='Website'
                  type='url'
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                />
                <Input
                  label='Contact Person Full Name'
                  required
                  value={formData.contactPersonName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactPersonName: e.target.value,
                    })
                  }
                />
                <Input
                  label='Contact Person Role'
                  required
                  value={formData.contactPersonRole}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactPersonRole: e.target.value,
                    })
                  }
                />
              </>
            )}

            {formData.applicantType === 'other' && (
              <>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Please describe your applicant type
                  </label>
                  <textarea
                    required
                    value={formData.otherTypeDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        otherTypeDescription: e.target.value,
                      })
                    }
                    className='w-full rounded-md border border-gray-300 px-3 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Describe whether you are applying as a group, association, representative, or another type of entity.'
                  />
                </div>
                <Input
                  label='Full Name / Primary Contact Name'
                  required
                  value={formData.contactPersonName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactPersonName: e.target.value,
                    })
                  }
                />
                <Input
                  label='Role / Position'
                  required
                  value={formData.contactPersonRole}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactPersonRole: e.target.value,
                    })
                  }
                />
                <Input
                  label='Organization / Entity Name (optional)'
                  value={formData.org}
                  onChange={(e) =>
                    setFormData({ ...formData, org: e.target.value })
                  }
                />
              </>
            )}

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

            <Input
              label='Address'
              required
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />

            <Button type='submit' disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>

            {error && (
              <div className='mt-4 p-3 bg-red-50 text-red-800 rounded'>
                {error}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
