'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { eoiSchema, type EOIFormData } from '@/lib/validators/eoi'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { FileInput } from '@/components/ui/FileInput'

interface EOIFormProps {
  initialPathway?: { discipline: string; destination: string }
}

export default function EOIForm({ initialPathway }: EOIFormProps) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const methods = useForm<EOIFormData>({
    resolver: zodResolver(eoiSchema),
    defaultValues: {
      pathwayDiscipline: initialPathway?.discipline || '',
      pathwayDestination: initialPathway?.destination || '',
      applyingWithPartner: false,
    },
    mode: 'onBlur',
  })

  const {
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = methods
  const ieltsStatus = watch('ieltsStatus')
  const applyingWithPartner = watch('applyingWithPartner')

  // Validate current step before proceeding
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

  // Main submission handler
  const onSubmit = async (data: EOIFormData) => {
    console.log('onSubmit called', data)
    setIsSubmitting(true)

    try {
      // 1. Check if user is authenticated
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()
      if (authError || !user) {
        const currentUrl = window.location.pathname + window.location.search
        router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`)
        return
      }

      // 2. Validate referral code if provided
      let partnerId = null
      if (data.referralCode) {
        const { data: partner, error: partnerError } = await supabase
          .from('stakeholders')
          .select('id')
          .eq('partner_code', data.referralCode)
          .eq('status', 'approved')
          .maybeSingle()

        if (partnerError) {
          console.warn('Partner lookup error:', partnerError.message)
        } else if (partner) {
          partnerId = partner.id
          console.log('Valid partner code:', data.referralCode)
        } else {
          console.log('Invalid or non‑approved partner code')
        }
      }

      // 3. Upload files
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

      // 4. Insert applicant
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
            work_experience_years: data.yearsOfExperience || null,
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
            referring_partner_code: data.referralCode || null,
          },
          { onConflict: 'user_id' },
        )
        .select()
        .single()

      if (applicantError)
        throw new Error(`Applicant insert failed: ${applicantError.message}`)

      // 5. Get "EOI Submitted" stage
      const { data: stage, error: stageError } = await supabase
        .from('stages')
        .select('id')
        .eq('name', 'EOI Submitted')
        .single()

      if (stageError)
        throw new Error(`Stage lookup failed: ${stageError.message}`)

      // 6. Insert case
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

      // 7. If partnerId exists, create case assignment
      if (partnerId) {
        const { error: assignError } = await supabase
          .from('case_assignments')
          .insert({
            case_id: newCase.id,
            stakeholder_id: partnerId,
          })
        if (assignError) {
          console.warn('Failed to assign case to partner:', assignError.message)
          // Non‑fatal; continue
        }
      }

      // 8. Insert document records (optional)
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
        await supabase
          .from('documents')
          .insert(docInserts)
          .then(({ error }) => {
            if (error)
              console.warn('Document records not created:', error.message)
          })
      }

      // 9. Redirect to success
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
          {/* Progress indicator (same as before) */}
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

          {/* Step 1: Personal & Documents (unchanged) */}
          {step === 1 && (
            <Card>
              <CardContent className='p-6 space-y-4'>
                <h2 className='text-xl font-bold mb-4'>Personal Information</h2>
                <Input
                  label='Full Name'
                  {...methods.register('fullName')}
                  error={errors.fullName?.message}
                />
                <Input
                  label='Email'
                  type='email'
                  {...methods.register('email')}
                  error={errors.email?.message}
                />
                <Input
                  label='WhatsApp (optional)'
                  {...methods.register('whatsapp')}
                />
                <Input
                  label='Country of Residence'
                  {...methods.register('countryOfResidence')}
                  error={errors.countryOfResidence?.message}
                />
                <Input
                  label='Date of Birth (optional)'
                  type='date'
                  {...methods.register('dateOfBirth')}
                />

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

          {/* Step 2: Education (unchanged) */}
          {step === 2 && (
            <Card>
              <CardContent className='p-6 space-y-4'>
                <h2 className='text-xl font-bold mb-4'>
                  Education & Professional Background
                </h2>
                <Input
                  label='Degree Title'
                  {...methods.register('degreeTitle')}
                  error={errors.degreeTitle?.message}
                />
                <Input
                  label='Institution'
                  {...methods.register('institution')}
                  error={errors.institution?.message}
                />
                <Input
                  label='Graduation Year'
                  {...methods.register('graduationYear')}
                />
                <Input label='GPA (optional)' {...methods.register('gpa')} />
                <Input
                  label='Years of Work Experience'
                  type='number'
                  {...methods.register('yearsOfExperience', {
                    valueAsNumber: true,
                  })}
                />
                <Input
                  label='Current Occupation'
                  {...methods.register('currentOccupation')}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 3: IELTS (unchanged) */}
          {step === 3 && (
            <Card>
              <CardContent className='p-6 space-y-4'>
                <h2 className='text-xl font-bold mb-4'>IELTS Status</h2>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    IELTS Status
                  </label>
                  <select
                    {...methods.register('ieltsStatus')}
                    className='block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm'
                  >
                    <option value=''>Select status</option>
                    <option value='has_result'>I have a result</option>
                    <option value='booked'>I have booked a test</option>
                    <option value='needs_prep'>I need IELTS prep</option>
                  </select>
                  {errors.ieltsStatus && (
                    <p className='text-red-600 text-sm mt-1'>
                      {errors.ieltsStatus.message}
                    </p>
                  )}
                </div>

                {ieltsStatus === 'has_result' && (
                  <>
                    <Input
                      label='Overall Score'
                      type='number'
                      step='0.5'
                      {...methods.register('ieltsOverall', {
                        valueAsNumber: true,
                      })}
                    />
                    <Input
                      label='Listening'
                      type='number'
                      step='0.5'
                      {...methods.register('ieltsListening', {
                        valueAsNumber: true,
                      })}
                    />
                    <Input
                      label='Reading'
                      type='number'
                      step='0.5'
                      {...methods.register('ieltsReading', {
                        valueAsNumber: true,
                      })}
                    />
                    <Input
                      label='Writing'
                      type='number'
                      step='0.5'
                      {...methods.register('ieltsWriting', {
                        valueAsNumber: true,
                      })}
                    />
                    <Input
                      label='Speaking'
                      type='number'
                      step='0.5'
                      {...methods.register('ieltsSpeaking', {
                        valueAsNumber: true,
                      })}
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
                    label='Test Date (if booked)'
                    type='date'
                    {...methods.register('ieltsBookingDate')}
                  />
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 4: Funding & Partner (unchanged) */}
          {step === 4 && (
            <Card>
              <CardContent className='p-6 space-y-4'>
                <h2 className='text-xl font-bold mb-4'>
                  Funding & Partner Information
                </h2>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Funding Type
                  </label>
                  <select
                    {...methods.register('fundingType')}
                    className='block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm'
                  >
                    <option value=''>Select funding type</option>
                    <option value='self'>Self-funded</option>
                    <option value='assisted'>Finance-assisted</option>
                  </select>
                </div>

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
                    {...methods.register('applyingWithPartner')}
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
                      {...methods.register('partnerFullName')}
                    />
                    <Input
                      label='Partner Email'
                      type='email'
                      {...methods.register('partnerEmail')}
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
                <Input
                  label='Discipline'
                  {...methods.register('pathwayDiscipline')}
                  readOnly
                  className='bg-gray-100'
                />
                <Input
                  label='Destination'
                  {...methods.register('pathwayDestination')}
                  readOnly
                  className='bg-gray-100'
                />
                <Input
                  label='Intake Preference'
                  {...methods.register('intakePreference')}
                  placeholder='e.g., May 2026'
                />
                <Input
                  label='Referral Code (optional)'
                  {...methods.register('referralCode')}
                />
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
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
