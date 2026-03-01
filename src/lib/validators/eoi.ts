import { z } from 'zod'

export const eoiSchema = z.object({
  // Step 1: Personal & Contact
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  whatsapp: z.string().optional(),
  countryOfResidence: z.string().min(1, 'Country is required'),
  dateOfBirth: z.string().optional(),

  // Step 1 Files
  passportFile: z.instanceof(File).optional(),
  degreeFile: z.instanceof(File).optional(),
  transcriptsFile: z.instanceof(File).optional(),

  // Step 2: Education & Profession
  degreeTitle: z.string().min(1, 'Degree title is required'),
  institution: z.string().min(1, 'Institution is required'),
  graduationYear: z.string().optional(),
  gpa: z.string().optional(),
  // FIX: was z.number() but the <Select> returns a string — changed to string
  yearsOfExperience: z.string().optional(),
  currentOccupation: z.string().optional(),

  // Step 3: IELTS Status
  ieltsStatus: z.enum(['has_result', 'booked', 'needs_prep']).optional(),
  ieltsOverall: z.number().optional(),
  ieltsListening: z.number().optional(),
  ieltsReading: z.number().optional(),
  ieltsWriting: z.number().optional(),
  ieltsSpeaking: z.number().optional(),
  ieltsTestDate: z.string().optional(),
  ieltsBookingDate: z.string().optional(),
  ieltsResultFile: z.instanceof(File).optional(),

  // Step 4: Financial & Partner
  fundingType: z.enum(['self', 'assisted']).optional(),
  proofOfFundsFile: z.instanceof(File).optional(),
  applyingWithPartner: z.boolean(),
  partnerFullName: z.string().optional(),
  partnerEmail: z.string().email().optional().or(z.literal('')),
  partnerDocsFile: z.instanceof(File).optional(),

  // Pathway & Referral
  pathwayDiscipline: z.string(),
  pathwayDestination: z.string(),
  intakePreference: z.string(),
  referralCode: z.string().optional(),
})

export type EOIFormData = z.infer<typeof eoiSchema>
