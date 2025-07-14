import { Profile } from './api'

// Critical fields required for Workday applications
export const CRITICAL_WORKDAY_FIELDS = [
  'email',
  'first_name', 
  'last_name',
  'address_line_1',
  'city',
  'state',
  'postal_code',
  'phone',
  'work_authorization_status',
  'visa_sponsorship_required'
] as const

// All Workday fields for comprehensive autofill
export const ALL_WORKDAY_FIELDS = [
  ...CRITICAL_WORKDAY_FIELDS,
  'address_line_2',
  'country',
  'county',
  'phone_device_type',
  'country_phone_code',
  'phone_extension',
  'how_did_you_hear_about_us',
  'previously_worked_for_workday',
  'gender',
  'ethnicity',
  'military_veteran',
  'disability_status',
  'cover_letter_url',
  'cover_letter_filename',
  'portfolio_urls',
  'preferred_work_location',
  'salary_expectation',
  'available_start_date',
  'willing_to_relocate',
  'years_of_experience',
  'highest_education_level',
  'certifications',
  'linkedin_url',
  'github_url',
  'personal_website',
  'references_available',
  'background_check_consent',
  'drug_test_consent'
] as const

export type WorkdayField = typeof ALL_WORKDAY_FIELDS[number]

/**
 * Calculate profile completion percentage for Workday autofill
 */
export function getWorkdayProfileCompletion(profile: Profile): {
  criticalCompletion: number
  overallCompletion: number
  missingCriticalFields: string[]
  missingOptionalFields: string[]
} {
  const criticalCompleted = CRITICAL_WORKDAY_FIELDS.filter(
    field => profile[field] !== null && profile[field] !== undefined && profile[field] !== ''
  )
  
  const allCompleted = ALL_WORKDAY_FIELDS.filter(
    field => profile[field] !== null && profile[field] !== undefined && profile[field] !== ''
  )

  const missingCriticalFields = CRITICAL_WORKDAY_FIELDS.filter(
    field => !profile[field] || profile[field] === ''
  )

  const missingOptionalFields = ALL_WORKDAY_FIELDS.filter(
    field => !CRITICAL_WORKDAY_FIELDS.includes(field as any) && 
    (!profile[field] || profile[field] === '')
  )

  return {
    criticalCompletion: Math.round((criticalCompleted.length / CRITICAL_WORKDAY_FIELDS.length) * 100),
    overallCompletion: Math.round((allCompleted.length / ALL_WORKDAY_FIELDS.length) * 100),
    missingCriticalFields,
    missingOptionalFields
  }
}

/**
 * Check if profile is ready for Workday autofill
 */
export function isWorkdayProfileReady(profile: Profile): boolean {
  const { criticalCompletion } = getWorkdayProfileCompletion(profile)
  return criticalCompletion === 100
}

/**
 * Get user-friendly field names for display
 */
export const FIELD_DISPLAY_NAMES: Record<string, string> = {
  email: 'Email Address',
  first_name: 'First Name',
  last_name: 'Last Name',
  address_line_1: 'Street Address',
  address_line_2: 'Apartment/Suite',
  city: 'City',
  state: 'State',
  postal_code: 'ZIP Code',
  country: 'Country',
  county: 'County',
  phone: 'Phone Number',
  phone_device_type: 'Phone Type',
  country_phone_code: 'Country Code',
  phone_extension: 'Phone Extension',
  work_authorization_status: 'Work Authorization',
  visa_sponsorship_required: 'Visa Sponsorship',
  how_did_you_hear_about_us: 'How did you hear about us?',
  previously_worked_for_workday: 'Previously worked for Workday',
  gender: 'Gender',
  ethnicity: 'Race/Ethnicity',
  military_veteran: 'Veteran Status',
  disability_status: 'Disability Status',
  preferred_work_location: 'Work Location Preference',
  salary_expectation: 'Salary Expectation',
  available_start_date: 'Available Start Date',
  willing_to_relocate: 'Willing to Relocate',
  years_of_experience: 'Years of Experience',
  highest_education_level: 'Education Level',
  certifications: 'Certifications',
  linkedin_url: 'LinkedIn Profile',
  github_url: 'GitHub Profile',
  personal_website: 'Personal Website',
  references_available: 'References Available',
  background_check_consent: 'Background Check Consent',
  drug_test_consent: 'Drug Test Consent',
  cover_letter_url: 'Cover Letter',
  portfolio_urls: 'Portfolio URLs'
}

/**
 * Generate autofill data for Workday applications
 */
export function generateWorkdayAutofillData(profile: Profile) {
  return {
    // Personal Information
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    email: profile.email || '',
    phone: profile.phone || '',
    phoneType: profile.phone_device_type || 'Mobile',
    countryCode: profile.country_phone_code || '+1',
    phoneExtension: profile.phone_extension || '',
    
    // Address Information
    addressLine1: profile.address_line_1 || '',
    addressLine2: profile.address_line_2 || '',
    city: profile.city || '',
    state: profile.state || '',
    postalCode: profile.postal_code || '',
    country: profile.country || 'United States of America',
    county: profile.county || '',
    
    // Work Authorization
    workAuthorization: profile.work_authorization_status || 'Yes',
    visaSponsorship: profile.visa_sponsorship_required || 'No',
    
    // Work Preferences
    preferredWorkLocation: profile.preferred_work_location || '',
    salaryExpectation: profile.salary_expectation || '',
    availableStartDate: profile.available_start_date || '',
    willingToRelocate: profile.willing_to_relocate || false,
    yearsOfExperience: profile.years_of_experience || 0,
    
    // Education & Certifications
    highestEducationLevel: profile.highest_education_level || '',
    certifications: profile.certifications || [],
    
    // Social Links
    linkedinUrl: profile.linkedin_url || '',
    githubUrl: profile.github_url || '',
    personalWebsite: profile.personal_website || '',
    
    // Application Details
    howDidYouHear: profile.how_did_you_hear_about_us || 'Website → Workday.com',
    previouslyWorkedForWorkday: profile.previously_worked_for_workday || false,
    
    // Consent & Background
    referencesAvailable: profile.references_available ?? true,
    backgroundCheckConsent: profile.background_check_consent ?? true,
    drugTestConsent: profile.drug_test_consent ?? true,
    
    // EEO Information (Voluntary)
    gender: profile.gender || '',
    ethnicity: profile.ethnicity || '',
    veteranStatus: profile.military_veteran || '',
    disabilityStatus: profile.disability_status || '',
    
    // Documents
    resumeUrl: profile.resume_url || '',
    coverLetterUrl: profile.cover_letter_url || '',
    portfolioUrls: profile.portfolio_urls || []
  }
}

/**
 * Validate required fields for Workday applications
 */
export function validateWorkdayProfile(profile: Profile): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  // Check critical fields
  CRITICAL_WORKDAY_FIELDS.forEach(field => {
    if (!profile[field] || profile[field] === '') {
      errors.push(`${FIELD_DISPLAY_NAMES[field] || field} is required`)
    }
  })
  
  // Additional validation
  if (profile.email && !isValidEmail(profile.email)) {
    errors.push('Please enter a valid email address')
  }
  
  if (profile.phone && !isValidPhone(profile.phone)) {
    errors.push('Please enter a valid phone number')
  }
  
  if (profile.postal_code && !isValidPostalCode(profile.postal_code)) {
    errors.push('Please enter a valid ZIP code')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Simple email validation
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Simple phone validation (US format)
 */
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
  return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10
}

/**
 * Simple postal code validation (US ZIP)
 */
function isValidPostalCode(postal: string): boolean {
  const zipRegex = /^\d{5}(-\d{4})?$/
  return zipRegex.test(postal)
}

/**
 * Get profile completion suggestions
 */
export function getProfileCompletionSuggestions(profile: Profile): string[] {
  const { missingCriticalFields, missingOptionalFields } = getWorkdayProfileCompletion(profile)
  const suggestions: string[] = []
  
  if (missingCriticalFields.length > 0) {
    suggestions.push(`Complete ${missingCriticalFields.length} required fields: ${missingCriticalFields.map(f => FIELD_DISPLAY_NAMES[f]).join(', ')}`)
  }
  
  if (missingOptionalFields.length > 0 && missingCriticalFields.length === 0) {
    const topOptional = missingOptionalFields.slice(0, 3)
    suggestions.push(`Consider adding: ${topOptional.map(f => FIELD_DISPLAY_NAMES[f]).join(', ')}`)
  }
  
  if (!profile.resume_url) {
    suggestions.push('Upload your resume for better autofill experience')
  }
  
  if (!profile.cover_letter_url) {
    suggestions.push('Upload a cover letter template for complete applications')
  }
  
  return suggestions
} 