import { z } from 'zod'

// Reusable file validation (optional, we'll handle file size/type in component)
const fileSchema = z.any().optional()

export const eoiSchema = z.object({
  // Step 1: Personal & Contact
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  whatsapp: z.string().optional(),
  countryOfResidence: z.string().min(1, 'Country is required'),
  dateOfBirth: z.string().optional(), // could be date string

  // Step 2: Education & Profession
  degreeTitle: z.string().min(1, 'Degree title is required'),
  institution: z.string().min(1, 'Institution is required'),
  graduationYear: z.string().optional(),
  gpa: z.string().optional(),
  yearsOfExperience: z.number().optional(),
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

  // Step 4: Financial & Partner
  fundingType: z.enum(['self', 'assisted']).optional(),
  proofOfFunds: fileSchema,
  applyingWithPartner: z.boolean().default(false),
  partnerFullName: z.string().optional(),
  partnerEmail: z.string().email().optional().or(z.literal('')),
  // partner docs will be separate step later

  // Pathway & Referral
  pathwayDiscipline: z.string(),
  pathwayDestination: z.string(),
  intakePreference: z.string(),
  referralCode: z.string().optional(),
})

export type EOIFormData = z.infer<typeof eoiSchema>
