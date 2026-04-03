/**
 * Sample Data Generator for Sprint 3 Marketplace
 * Creates realistic candidate profiles for testing and demo purposes
 */

export interface SampleCandidate {
  candidate_ref: string
  country: string
  age_range: string
  education_level: string
  discipline: string
  years_experience: number
  ielts_predicted_score: number
  opportunity_score: number
  readiness_timeline: string
  recommended_pathway: string
  cohort_id: string
}

const COUNTRIES = [
  'Kenya', 'Philippines', 'Nigeria', 'India', 'Sri Lanka', 'Ghana', 
  'Zimbabwe', 'South Africa', 'Bangladesh', 'Pakistan', 'Uganda', 'Tanzania'
]

const DISCIPLINES = [
  'Engineering', 'Computer Science', 'Nursing', 'Education', 
  'Business Administration', 'Medicine', 'Architecture', 'Data Science'
]

const EDUCATION_LEVELS = [
  "Bachelor's", "Master's", "Diploma", "PhD", "Professional Certificate"
]

const AGE_RANGES = [
  '22-24', '25-29', '30-34', '35-39', '25-27', '28-32', '33-37'
]

const READINESS_TIMELINES = [
  '1-3 months', '3-6 months', '6-12 months', '12-18 months', '2-3 months', '4-8 months'
]

const PATHWAYS_BY_DISCIPLINE = {
  'Engineering': [
    'Master of Engineering Practice',
    'Master of Engineering Management', 
    'Bachelor of Engineering Technology',
    'Graduate Diploma in Engineering'
  ],
  'Computer Science': [
    'Master of Computer Science',
    'Master of Information Technology',
    'Bachelor of Computer Science (Honours)',
    'Graduate Certificate in Data Science'
  ],
  'Nursing': [
    'Master of Nursing Practice',
    'Bachelor of Nursing',
    'Graduate Diploma in Nursing',
    'Master of Advanced Nursing Practice'
  ],
  'Education': [
    'Bachelor of Teaching (STEM)',
    'Master of Education',
    'Graduate Diploma in Teaching',
    'Bachelor of Early Childhood Education'
  ],
  'Business Administration': [
    'Master of Business Administration',
    'Master of Management',
    'Graduate Diploma in Business',
    'Bachelor of Commerce'
  ],
  'Medicine': [
    'Doctor of Medicine',
    'Master of Public Health',
    'Graduate Diploma in Health Sciences',
    'Bachelor of Medical Sciences'
  ],
  'Architecture': [
    'Master of Architecture',
    'Bachelor of Architectural Studies',
    'Graduate Diploma in Architecture',
    'Master of Urban Planning'
  ],
  'Data Science': [
    'Master of Data Science',
    'Graduate Diploma in Analytics',
    'Master of Applied Statistics',
    'Bachelor of Data Science'
  ]
}

/**
 * Generate a single realistic candidate profile
 */
export function generateSampleCandidate(index: number, cohortId: string, discipline: string): SampleCandidate {
  const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)]
  const educationLevel = EDUCATION_LEVELS[Math.floor(Math.random() * EDUCATION_LEVELS.length)]
  const ageRange = AGE_RANGES[Math.floor(Math.random() * AGE_RANGES.length)]
  const readinessTimeline = READINESS_TIMELINES[Math.floor(Math.random() * READINESS_TIMELINES.length)]
  
  // Generate experience based on age and education
  const baseExperience = educationLevel.includes('PhD') ? 8 : 
                        educationLevel.includes('Master') ? 4 : 
                        educationLevel.includes('Bachelor') ? 2 : 1
  const yearsExperience = baseExperience + Math.floor(Math.random() * 6)
  
  // Generate IELTS score (realistic distribution)
  const ieltsBase = 5.5 + (Math.random() * 3) // 5.5 to 8.5
  const ieltsScore = Math.round(ieltsBase * 2) / 2 // Round to nearest 0.5
  
  // Generate opportunity score based on factors
  let opportunityScore = 50 // Base score
  if (ieltsScore >= 7.0) opportunityScore += 20
  if (ieltsScore >= 8.0) opportunityScore += 10
  if (yearsExperience >= 5) opportunityScore += 15
  if (yearsExperience >= 8) opportunityScore += 10
  if (educationLevel.includes('Master') || educationLevel.includes('PhD')) opportunityScore += 10
  
  // Add some randomness
  opportunityScore += Math.floor((Math.random() - 0.5) * 20)
  opportunityScore = Math.max(30, Math.min(95, opportunityScore)) // Clamp between 30-95
  
  const pathways = PATHWAYS_BY_DISCIPLINE[discipline as keyof typeof PATHWAYS_BY_DISCIPLINE] || 
                   PATHWAYS_BY_DISCIPLINE['Engineering']
  const recommendedPathway = pathways[Math.floor(Math.random() * pathways.length)]
  
  return {
    candidate_ref: `CAND-${String(1000 + index).padStart(4, '0')}`,
    country,
    age_range: ageRange,
    education_level: educationLevel,
    discipline,
    years_experience: yearsExperience,
    ielts_predicted_score: ieltsScore,
    opportunity_score: opportunityScore,
    readiness_timeline: readinessTimeline,
    recommended_pathway: recommendedPathway,
    cohort_id: cohortId
  }
}

/**
 * Generate multiple candidates for a cohort
 */
export function generateCohortCandidates(
  cohortId: string, 
  discipline: string, 
  count: number = 8
): SampleCandidate[] {
  return Array.from({ length: count }, (_, index) => 
    generateSampleCandidate(index, cohortId, discipline)
  )
}

/**
 * Generate candidates for all existing cohorts
 */
export function generateAllSampleData(): Record<string, SampleCandidate[]> {
  const cohorts = [
    { id: 'eng-kenya', discipline: 'Engineering', count: 12 },
    { id: 'eng-philippines', discipline: 'Engineering', count: 15 },
    { id: 'cs-nigeria', discipline: 'Computer Science', count: 18 },
    { id: 'cs-india', discipline: 'Computer Science', count: 22 },
    { id: 'nursing-srilanka', discipline: 'Nursing', count: 14 },
    { id: 'nursing-ghana', discipline: 'Nursing', count: 10 },
    { id: 'edu-zimbabwe', discipline: 'Education', count: 8 },
    { id: 'edu-southafrica', discipline: 'Education', count: 11 }
  ]
  
  const result: Record<string, SampleCandidate[]> = {}
  
  cohorts.forEach(cohort => {
    result[cohort.id] = generateCohortCandidates(cohort.id, cohort.discipline, cohort.count)
  })
  
  return result
}

/**
 * Generate sample applicant data to match candidate profiles
 */
export function generateSampleApplicant(candidate: SampleCandidate) {
  const firstNames = [
    'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
    'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
    'Thomas', 'Sarah', 'Christopher', 'Karen', 'Charles', 'Helen', 'Daniel', 'Nancy',
    'Matthew', 'Betty', 'Anthony', 'Dorothy', 'Mark', 'Lisa', 'Donald', 'Sandra',
    'Steven', 'Donna', 'Paul', 'Carol', 'Joshua', 'Ruth', 'Kenneth', 'Sharon',
    'Kevin', 'Michelle', 'Brian', 'Laura', 'George', 'Sarah', 'Edward', 'Kimberly'
  ]
  
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
    'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
    'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
    'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill'
  ]
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  const fullName = `${firstName} ${lastName}`
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`
  
  // Generate birth year from age range
  const currentYear = new Date().getFullYear()
  const ageRangeParts = candidate.age_range.split('-')
  const minAge = parseInt(ageRangeParts[0])
  const maxAge = parseInt(ageRangeParts[1])
  const age = minAge + Math.floor(Math.random() * (maxAge - minAge + 1))
  const birthYear = currentYear - age
  const dateOfBirth = `${birthYear}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
  
  // Generate GPA based on opportunity score
  let gpa = 2.5 + (candidate.opportunity_score / 100) * 1.5 // 2.5 to 4.0 scale
  gpa = Math.round(gpa * 100) / 100 // Round to 2 decimal places
  
  return {
    full_name: fullName,
    email,
    date_of_birth: dateOfBirth,
    country: candidate.country,
    whatsapp: `+${Math.floor(Math.random() * 900000000) + 100000000}`,
    ielts_status: candidate.ielts_predicted_score >= 6.5 ? 'has_result' : 
                 candidate.ielts_predicted_score >= 5.5 ? 'booked' : 'needs_prep',
    ielts_score: candidate.ielts_predicted_score >= 6.5 ? candidate.ielts_predicted_score : null,
    gpa,
    work_experience_years: candidate.years_experience,
    pathway_discipline: candidate.discipline,
    pathway_destination: Math.random() > 0.5 ? 'Canada' : 'Australia',
    intake_preference: ['Fall 2024', 'Spring 2025', 'Fall 2025'][Math.floor(Math.random() * 3)]
  }
}
