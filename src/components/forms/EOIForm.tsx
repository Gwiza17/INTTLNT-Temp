'use client'

import { useState } from 'react'
import { useForm, FormProvider, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { eoiSchema, type EOIFormData } from '@/lib/validators/eoi'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent } from '@/components/ui/Card'
import { FileInput } from '@/components/ui/FileInput'

interface EOIFormProps {
  initialPathway?: { discipline: string; destination: string }
  initialReferralCode?: string
}

const COUNTRIES = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Angola',
  'Argentina',
  'Australia',
  'Austria',
  'Bangladesh',
  'Belgium',
  'Bolivia',
  'Brazil',
  'Cameroon',
  'Canada',
  'Chile',
  'China',
  'Colombia',
  'Congo',
  'Croatia',
  'Cuba',
  'Czech Republic',
  'Denmark',
  'Ecuador',
  'Egypt',
  'Ethiopia',
  'Finland',
  'France',
  'Germany',
  'Ghana',
  'Greece',
  'Guatemala',
  'Honduras',
  'Hungary',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kuwait',
  'Lebanon',
  'Libya',
  'Malaysia',
  'Mali',
  'Mexico',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'Norway',
  'Pakistan',
  'Panama',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Romania',
  'Russia',
  'Rwanda',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Sierra Leone',
  'Singapore',
  'Somalia',
  'South Africa',
  'South Korea',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tanzania',
  'Thailand',
  'Tunisia',
  'Turkey',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
]

const DISCIPLINES = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'computer-science', label: 'Computer Science' },
  { value: 'teaching', label: 'Teaching' },
  { value: 'nursing', label: 'Nursing' },
  { value: 'ict', label: 'ICT' },
  { value: 'accounting', label: 'Accounting' },
  { value: 'other', label: 'Other' },
]

const DESTINATIONS = [
  { value: 'canada', label: 'Canada' },
  { value: 'australia', label: 'Australia' },
]

const INTAKES = ['September 2026', 'January 2027', 'May 2027', 'September 2027']

const FUNDING_TYPES = [
  { value: 'self', label: 'Self-funded' },
  { value: 'assisted', label: 'Finance-assisted' },
]

const IELTS_STATUSES = [
  { value: 'has_result', label: 'I have a result' },
  { value: 'booked', label: 'I have booked a test' },
  { value: 'needs_prep', label: 'I need IELTS prep' },
]

const EXPERIENCE_YEARS = Array.from({ length: 31 }, (_, i) => ({
  value: String(i),
  label: i === 0 ? 'Less than 1 year' : `${i} year${i === 1 ? '' : 's'}`,
}))

const GRADUATION_YEARS = Array.from({ length: 30 }, (_, i) => {
  const year = new Date().getFullYear() - i
  return { value: String(year), label: String(year) }
})

const getMaxDob = () => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 16)
  return d.toISOString().split('T')[0]
}

export default function EOIForm({
  initialPathway,
  initialReferralCode,
}: EOIFormProps) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Referral code: URL param takes priority, then prop, then empty
  const urlCode = searchParams.get('code') ?? ''
  const lockedCode = urlCode || initialReferralCode || ''
  const isCodeLocked = !!urlCode || !!initialReferralCode

  const methods = useForm<EOIFormData>({
    resolver: zodResolver(eoiSchema),
    defaultValues: {
      pathwayDiscipline: initialPathway?.discipline || '',
      pathwayDestination: initialPathway?.destination || '',
      applyingWithPartner: false,
      referralCode: lockedCode,
      graduationYear: '',
      yearsOfExperience: '',
    },
    mode: 'onBlur',
  })

  const {
    handleSubmit,
    trigger,
    watch,
    register,
    control,
    formState: { errors },
  } = methods

  const ieltsStatus = watch('ieltsStatus')
  const applyingWithPartner = watch('applyingWithPartner')

  const nextStep = async () => {
    let fieldsToValidate: (keyof EOIFormData)[] = []

    if (step === 1) {
      fieldsToValidate = [
        'fullName',
        'email',
        'whatsapp',
        'countryOfResidence',
        'dateOfBirth',
        'passportFile',
        'degreeFile',
        'transcriptsFile',
      ]
    }
    if (step === 2) {
      fieldsToValidate = [
        'degreeTitle',
        'institution',
        'graduationYear',
        'gpa',
        'yearsOfExperience',
        'currentOccupation',
      ]
    }
    if (step === 3) {
      fieldsToValidate = ['ieltsStatus']
      if (ieltsStatus === 'has_result') {
        fieldsToValidate.push(
          'ieltsOverall',
          'ieltsListening',
          'ieltsReading',
          'ieltsWriting',
          'ieltsSpeaking',
          'ieltsResultFile',
        )
      } else if (ieltsStatus === 'booked') {
        fieldsToValidate.push('ieltsBookingDate')
      }
    }
    if (step === 4) {
      fieldsToValidate = [
        'fundingType',
        'proofOfFundsFile',
        'applyingWithPartner',
        'pathwayDiscipline',
        'pathwayDestination',
        'intakePreference',
        'referralCode',
      ]
      if (applyingWithPartner) {
        fieldsToValidate.push(
          'partnerFullName',
          'partnerEmail',
          'partnerDocsFile',
        )
      }
    }

    const isValid = await trigger(fieldsToValidate)
    if (isValid) setStep((prev) => prev + 1)
  }

  const prevStep = () => setStep((prev) => prev - 1)

  const onSubmit = async (data: EOIFormData) => {
    setIsSubmitting(true)
    try {
      // Auth is guaranteed by server page — user is always logged in here
      // If session somehow expired mid-session, show a clear message instead of looping
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        throw new Error(
          'Your session expired. Please refresh the page and try again.',
        )
      }

      // Always use lockedCode when locked — never trust form value
      const resolvedReferralCode = isCodeLocked
        ? lockedCode
        : data.referralCode || null

      let partnerId = null
      if (resolvedReferralCode) {
        const { data: partner } = await supabase
          .from('stakeholders')
          .select('id')
          .eq('partner_code', resolvedReferralCode)
          .eq('status', 'approved')
          .maybeSingle()
        if (partner) partnerId = partner.id
      }

      const uploadFile = async (
        file: File | null,
        folder: string,
      ): Promise<string | null> => {
        if (!file) return null
        const fileExt = file.name.split('.').pop()
        const fileName = `applicants/${user.id}/${folder}/${Date.now()}.${fileExt}`
        const { data, error } = await supabase.storage
          .from('documents')
          .upload(fileName, file)
        if (error) throw new Error(`File upload failed: ${error.message}`)
        return data.path
      }

      const [
        passportPath,
        degreePath,
        transcriptsPath,
        ieltsResultPath,
        proofOfFundsPath,
        partnerDocsPath,
      ] = await Promise.all([
        uploadFile(data.passportFile || null, 'passport'),
        uploadFile(data.degreeFile || null, 'degree'),
        uploadFile(data.transcriptsFile || null, 'transcripts'),
        uploadFile(data.ieltsResultFile || null, 'ielts'),
        uploadFile(data.proofOfFundsFile || null, 'funds'),
        uploadFile(data.partnerDocsFile || null, 'partner'),
      ])

      const { data: applicant, error: applicantError } = await supabase
        .from('applicants')
        .upsert(
          {
            user_id: user.id,
            full_name: data.fullName,
            email: data.email,
            whatsapp: data.whatsapp || null,
            country: data.countryOfResidence,
            date_of_birth: data.dateOfBirth || null,
            passport_url: passportPath,
            degree_certificate_url: degreePath,
            transcripts_url: transcriptsPath,
            ielts_status: data.ieltsStatus || null,
            ielts_score: data.ieltsOverall || null,
            ielts_result_url: ieltsResultPath,
            gpa: data.gpa ? parseFloat(data.gpa) : null,
            work_experience_years: data.yearsOfExperience
              ? parseInt(data.yearsOfExperience, 10)
              : null,
            is_skilled_couple: data.applyingWithPartner,
            partner_docs: partnerDocsPath ? { url: partnerDocsPath } : null,
            proof_of_funds_url: proofOfFundsPath,
            proof_of_funds_type:
              data.fundingType === 'self'
                ? 'bank_statement'
                : 'conditional_offer',
            pathway_discipline: data.pathwayDiscipline,
            pathway_destination: data.pathwayDestination,
            intake_preference: data.intakePreference,
            referring_partner_code: resolvedReferralCode,
          },
          { onConflict: 'user_id' },
        )
        .select()
        .single()

      if (applicantError)
        throw new Error(`Applicant insert failed: ${applicantError.message}`)

      const { data: stage, error: stageError } = await supabase
        .from('stages')
        .select('id')
        .eq('name', 'EOI Submitted')
        .single()

      if (stageError)
        throw new Error(`Stage lookup failed: ${stageError.message}`)

      const { data: newCase, error: caseError } = await supabase
        .from('cases')
        .insert({
          applicant_id: applicant.id,
          selected_pathway: `${data.pathwayDiscipline} → ${data.pathwayDestination}`,
          target_intake: data.intakePreference,
          current_stage_id: stage.id,
          stage_entered_at: new Date().toISOString(),
        })
        .select('id')
        .single()

      if (caseError) throw new Error(`Case insert failed: ${caseError.message}`)

      if (partnerId) {
        const { error: assignError } = await supabase
          .from('case_assignments')
          .insert({ case_id: newCase.id, stakeholder_id: partnerId })
        if (assignError)
          console.warn('Failed to assign case to partner:', assignError.message)
      }

      const docInserts = []
      if (passportPath)
        docInserts.push({
          case_id: newCase.id,
          document_type: 'passport',
          file_path: passportPath,
          owner_type: 'applicant',
        })
      if (degreePath)
        docInserts.push({
          case_id: newCase.id,
          document_type: 'degree',
          file_path: degreePath,
          owner_type: 'applicant',
        })
      if (transcriptsPath)
        docInserts.push({
          case_id: newCase.id,
          document_type: 'transcripts',
          file_path: transcriptsPath,
          owner_type: 'applicant',
        })
      if (ieltsResultPath)
        docInserts.push({
          case_id: newCase.id,
          document_type: 'ielts',
          file_path: ieltsResultPath,
          owner_type: 'applicant',
        })
      if (proofOfFundsPath)
        docInserts.push({
          case_id: newCase.id,
          document_type: 'proof_of_funds',
          file_path: proofOfFundsPath,
          owner_type: 'applicant',
        })
      if (partnerDocsPath)
        docInserts.push({
          case_id: newCase.id,
          document_type: 'partner_docs',
          file_path: partnerDocsPath,
          owner_type: 'partner',
        })

      if (docInserts.length > 0) {
        const { error } = await supabase.from('documents').insert(docInserts)
        if (error) console.warn('Document records not created:', error.message)
      }

      router.push('/eoi/success')
    } catch (error: any) {
      console.error('EOI submission error:', error)
      alert(`Submission failed: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='bg-gray-50 p-6 rounded-lg'>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit, (errors) =>
            console.log('Validation errors:', errors),
          )}
          className='space-y-6'
        >
          {/* Progress indicator */}
          <div className='flex justify-between mb-8'>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-1/4 text-center pb-2 border-b-2 ${
                  step === i
                    ? 'border-blue-600 font-semibold'
                    : 'border-gray-200'
                }`}
              >
                Step {i}
              </div>
            ))}
          </div>

          {/* Step 1: Personal & Documents */}
          {step === 1 && (
            <Card>
              <CardContent className='p-6 space-y-4'>
                <h2 className='text-xl font-bold mb-4'>Personal Information</h2>
                <Input
                  label='Full Name'
                  {...register('fullName')}
                  error={errors.fullName?.message}
                />
                <Input
                  label='Email'
                  type='email'
                  {...register('email')}
                  error={errors.email?.message}
                />
                <Input
                  label='WhatsApp (optional)'
                  {...register('whatsapp')}
                  placeholder='+27123456789'
                />
                <Select
                  label='Country of Residence'
                  options={[
                    { value: '', label: 'Select country' },
                    ...COUNTRIES.map((c) => ({ value: c, label: c })),
                  ]}
                  {...register('countryOfResidence')}
                  error={errors.countryOfResidence?.message}
                />
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Date of Birth (must be 16 or older)
                  </label>
                  <input
                    type='date'
                    max={getMaxDob()}
                    {...register('dateOfBirth')}
                    className='block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm'
                  />
                  {errors.dateOfBirth && (
                    <p className='text-red-600 text-sm mt-1'>
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>
                <h3 className='text-lg font-semibold mt-6 mb-2'>
                  Required Documents
                </h3>
                <FileInput
                  name='passportFile'
                  label='Passport (bio page)'
                  accept='.pdf,.jpg,.jpeg,.png'
                  maxSize={5}
                  rules={{ required: 'Passport is required' }}
                />
                <FileInput
                  name='degreeFile'
                  label='Degree Certificate'
                  accept='.pdf,.jpg,.jpeg,.png'
                  maxSize={5}
                  rules={{ required: 'Degree certificate is required' }}
                />
                <FileInput
                  name='transcriptsFile'
                  label='Transcripts'
                  accept='.pdf,.jpg,.jpeg,.png'
                  maxSize={5}
                  rules={{ required: 'Transcripts are required' }}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 2: Education */}
          {step === 2 && (
            <Card>
              <CardContent className='p-6 space-y-4'>
                <h2 className='text-xl font-bold mb-4'>
                  Education & Professional Background
                </h2>
                <Input
                  label='Degree Title'
                  {...register('degreeTitle')}
                  error={errors.degreeTitle?.message}
                />
                <Input
                  label='Institution'
                  {...register('institution')}
                  error={errors.institution?.message}
                />
                <Select
                  label='Graduation Year'
                  options={[
                    { value: '', label: 'Select year' },
                    ...GRADUATION_YEARS,
                  ]}
                  {...register('graduationYear')}
                  error={errors.graduationYear?.message}
                />
                <Input
                  label='GPA (optional)'
                  {...register('gpa')}
                  placeholder='e.g. 4'
                />
                <Select
                  label='Years of Work Experience'
                  options={[
                    { value: '', label: 'Select years' },
                    ...EXPERIENCE_YEARS,
                  ]}
                  {...register('yearsOfExperience')}
                  error={errors.yearsOfExperience?.message}
                />
                <Input
                  label='Current Occupation'
                  {...register('currentOccupation')}
                  placeholder='e.g. Civil Engineer'
                />
              </CardContent>
            </Card>
          )}

          {/* Step 3: IELTS */}
          {step === 3 && (
            <Card>
              <CardContent className='p-6 space-y-4'>
                <h2 className='text-xl font-bold mb-4'>IELTS Status</h2>
                <Select
                  label='IELTS Status'
                  options={[
                    { value: '', label: 'Select status' },
                    ...IELTS_STATUSES,
                  ]}
                  {...register('ieltsStatus')}
                  error={errors.ieltsStatus?.message}
                />
                {ieltsStatus === 'has_result' && (
                  <>
                    <Input
                      label='Overall Score'
                      type='number'
                      step='0.5'
                      min='0'
                      max='9'
                      {...register('ieltsOverall', { valueAsNumber: true })}
                    />
                    <Input
                      label='Listening'
                      type='number'
                      step='0.5'
                      min='0'
                      max='9'
                      {...register('ieltsListening', { valueAsNumber: true })}
                    />
                    <Input
                      label='Reading'
                      type='number'
                      step='0.5'
                      min='0'
                      max='9'
                      {...register('ieltsReading', { valueAsNumber: true })}
                    />
                    <Input
                      label='Writing'
                      type='number'
                      step='0.5'
                      min='0'
                      max='9'
                      {...register('ieltsWriting', { valueAsNumber: true })}
                    />
                    <Input
                      label='Speaking'
                      type='number'
                      step='0.5'
                      min='0'
                      max='9'
                      {...register('ieltsSpeaking', { valueAsNumber: true })}
                    />
                    <FileInput
                      name='ieltsResultFile'
                      label='Upload IELTS Result'
                      accept='.pdf,.jpg,.jpeg,.png'
                      maxSize={5}
                      rules={{ required: 'IELTS result is required' }}
                    />
                  </>
                )}
                {ieltsStatus === 'booked' && (
                  <Input
                    label='Test Date'
                    type='date'
                    {...register('ieltsBookingDate')}
                  />
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 4: Funding & Pathway */}
          {step === 4 && (
            <Card>
              <CardContent className='p-6 space-y-4'>
                <h2 className='text-xl font-bold mb-4'>Funding & Pathway</h2>
                <Select
                  label='Funding Type'
                  options={[
                    { value: '', label: 'Select funding type' },
                    ...FUNDING_TYPES,
                  ]}
                  {...register('fundingType')}
                  error={errors.fundingType?.message}
                />
                <FileInput
                  name='proofOfFundsFile'
                  label='Proof of Funds (bank statement or loan offer)'
                  accept='.pdf,.jpg,.jpeg,.png'
                  maxSize={5}
                  rules={{ required: 'Proof of funds is required' }}
                />
                <div className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    {...register('applyingWithPartner')}
                    className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                  />
                  <label className='text-sm text-gray-700'>
                    I am applying with a skilled partner
                  </label>
                </div>
                {applyingWithPartner && (
                  <div className='space-y-4 border-t pt-4 mt-2'>
                    <h3 className='text-lg font-semibold'>Partner Details</h3>
                    <Input
                      label='Partner Full Name'
                      {...register('partnerFullName')}
                    />
                    <Input
                      label='Partner Email'
                      type='email'
                      {...register('partnerEmail')}
                    />
                    <FileInput
                      name='partnerDocsFile'
                      label='Partner Documents (CV, degree, etc.)'
                      accept='.pdf,.jpg,.jpeg,.png'
                      maxSize={10}
                    />
                  </div>
                )}

                <h3 className='text-lg font-semibold mt-4'>
                  Pathway Selection
                </h3>
                <Select
                  label='Discipline'
                  options={[
                    { value: '', label: 'Select discipline' },
                    ...DISCIPLINES,
                  ]}
                  {...register('pathwayDiscipline')}
                  error={errors.pathwayDiscipline?.message}
                />
                <Select
                  label='Destination'
                  options={[
                    { value: '', label: 'Select destination' },
                    ...DESTINATIONS,
                  ]}
                  {...register('pathwayDestination')}
                  error={errors.pathwayDestination?.message}
                />
                <Select
                  label='Intake Preference'
                  options={[
                    { value: '', label: 'Select intake' },
                    ...INTAKES.map((i) => ({ value: i, label: i })),
                  ]}
                  {...register('intakePreference')}
                  error={errors.intakePreference?.message}
                />

                {/* Referral Code — locked if came via partner invite link */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Referral Code{' '}
                    {!isCodeLocked && (
                      <span className='text-gray-400 font-normal'>
                        (optional)
                      </span>
                    )}
                  </label>
                  {isCodeLocked ? (
                    <div className='flex items-center gap-2'>
                      <input
                        type='text'
                        value={lockedCode}
                        readOnly
                        className='flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed font-mono tracking-widest'
                      />
                      <span className='text-xs text-green-600 whitespace-nowrap'>
                        ✓ Applied
                      </span>
                    </div>
                  ) : (
                    <Controller
                      name='referralCode'
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type='text'
                          placeholder='Enter code if you have one'
                          className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                      )}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className='flex justify-between'>
            <Button
              type='button'
              variant='outline'
              onClick={prevStep}
              disabled={step === 1}
            >
              Previous
            </Button>
            {step < 4 ? (
              <Button type='button' onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit EOI'}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
