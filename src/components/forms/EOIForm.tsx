'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { eoiSchema, type EOIFormData } from '@/lib/validators/eoi'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'

interface EOIFormProps {
  initialPathway?: { discipline: string; destination: string }
}

export default function EOIForm({ initialPathway }: EOIFormProps) {
  const [step, setStep] = useState(1)

  const methods = useForm<EOIFormData>({
    resolver: zodResolver(eoiSchema),
    shouldUnregister: true,
    mode: 'onBlur',
    defaultValues: {
      pathwayDiscipline: initialPathway?.discipline ?? '',
      pathwayDestination: initialPathway?.destination ?? '',
      applyingWithPartner: false,
    },
  })

  const {
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = methods

  const stepFields: Record<number, (keyof EOIFormData)[]> = {
    1: [
      'fullName',
      'email',
      'whatsapp',
      'countryOfResidence',
      'dateOfBirth',
    ],
    2: [
      'degreeTitle',
      'institution',
      'graduationYear',
      'gpa',
      'yearsOfExperience',
      'currentOccupation',
    ],
    3: [], // Add IELTS fields later
    4: [], // Add funding/partner fields later
  }

  const nextStep = async () => {
    const isValid = await trigger(stepFields[step])
    if (isValid) {
      setStep((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    setStep((prev) => prev - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onSubmit = async (data: EOIFormData) => {
    console.log('Form data:', data)
    alert('Form submitted (demo)')
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Progress Indicator */}
        <div className="flex justify-between mb-8">
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

        {/* Step 1 */}
        {step === 1 && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold mb-4">
                Personal Information
              </h2>

              <Input
                label="Full Name"
                {...methods.register('fullName')}
                error={errors.fullName?.message}
              />

              <Input
                label="Email"
                type="email"
                {...methods.register('email')}
                error={errors.email?.message}
              />

              <Input
                label="WhatsApp (optional)"
                {...methods.register('whatsapp')}
              />

              <Input
                label="Country of Residence"
                {...methods.register('countryOfResidence')}
                error={errors.countryOfResidence?.message}
              />

              <Input
                label="Date of Birth (optional)"
                type="date"
                {...methods.register('dateOfBirth')}
              />
            </CardContent>
          </Card>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold mb-4">
                Education & Professional Background
              </h2>

              <Input
                label="Degree Title"
                {...methods.register('degreeTitle')}
                error={errors.degreeTitle?.message}
              />

              <Input
                label="Institution"
                {...methods.register('institution')}
                error={errors.institution?.message}
              />

              <Input
                label="Graduation Year"
                type="number"
                {...methods.register('graduationYear', {
                  valueAsNumber: true,
                })}
                error={errors.graduationYear?.message}
              />

              <Input
                label="GPA (optional)"
                {...methods.register('gpa')}
              />

              <Input
                label="Years of Work Experience"
                type="number"
                {...methods.register('yearsOfExperience', {
                  valueAsNumber: true,
                })}
                error={errors.yearsOfExperience?.message}
              />

              <Input
                label="Current Occupation"
                {...methods.register('currentOccupation')}
                error={errors.currentOccupation?.message}
              />
            </CardContent>
          </Card>
        )}

        {/* Step 3 Placeholder */}
        {step === 3 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">
                IELTS Status
              </h2>
              <p className="text-gray-600">
                IELTS fields will be added here.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Step 4 Placeholder */}
        {step === 4 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">
                Funding & Partner Information
              </h2>
              <p className="text-gray-600">
                Funding and partner fields will be added here.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
          >
            Previous
          </Button>

          {step < 4 ? (
            <Button type="button" onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit EOI'}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  )
}