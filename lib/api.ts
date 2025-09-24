import { supabase } from '@/lib/supabase'
import { getAuthenticatedUser, safeAuthOperation, retrySupabaseOperation } from '@/lib/auth-utils'

export interface Profile {
  id: string
  full_name: string
  avatar_url?: string
  title?: string
  email?: string
  phone?: string
  location?: string
  bio?: string
  education?: {
    id?: string
    school: string
    degree: string
    date: string
  }[]
  experience?: {
    id?: string
    title: string
    company: string
    location: string
    date: string
    description: string
  }[]
  projects?: {
    id?: string
    name: string
    description: string
    url: string
  }[]
  skills?: string[]
  languages?: string[]
  socials?: {
    linkedin?: string
    github?: string
    portfolio?: string
    website?: string
  }
  show_profile?: boolean
  resume_url?: string
  resume_filename?: string
  daily_goal?: number
  
  // NEW WORKDAY AUTOFILL FIELDS
  // Critical personal information
  first_name?: string
  last_name?: string
  
  // Detailed address fields
  address_line_1?: string
  address_line_2?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  county?: string
  
  // Enhanced phone information
  phone_device_type?: string
  country_phone_code?: string
  phone_extension?: string
  
  // Workday-specific application fields
  how_did_you_hear_about_us?: string
  previously_worked_for_workday?: boolean
  work_authorization_status?: string
  visa_sponsorship_required?: string
  
  // Voluntary disclosure fields (EEO compliance)
  gender?: string
  ethnicity?: string
  military_veteran?: string
  disability_status?: string
  
  // Additional document fields
  cover_letter_url?: string
  cover_letter_filename?: string
  portfolio_urls?: string[]
  
  // Additional profile questions for comprehensive autofill
  preferred_work_location?: string
  salary_expectation?: string
  available_start_date?: string
  willing_to_relocate?: boolean
  years_of_experience?: number
  highest_education_level?: string
  certifications?: string[]
  linkedin_url?: string
  github_url?: string
  personal_website?: string
  references_available?: boolean
  background_check_consent?: boolean
  drug_test_consent?: boolean
}

export interface Application {
  id: string
  position: string
  company: string
  location: string
  work_type: 'remote' | 'hybrid' | 'onsite'
  applied_date: string
  source: string
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'withdrawn'
  company_url?: string
  job_description?: string
  notes?: string
  custom_resume_url?: string
  custom_resume_generated_at?: string
  custom_resume_status?: 'not_generated' | 'generating' | 'completed' | 'failed'
  job_identifier?: string
}

export interface ApplicationWithCustomFiles extends Application {
  custom_resume_url?: string
  custom_resume_created_at?: string
  custom_cover_letter_url?: string
  custom_cover_letter_created_at?: string
}

export interface ApplicationStats {
  total_applications: number
  applications_this_week: number
  applications_today: number
  current_streak: number
  response_rate: number
  longest_streak: number
  last_application_date: string
  streak_start_date: string
}

// Profile functions
export async function getProfile() {
  return safeAuthOperation(async (user) => {
    return retrySupabaseOperation(async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data
    })
  })
}

export async function updateProfile(profile: Partial<Profile>) {
  return safeAuthOperation(async (user) => {
    return retrySupabaseOperation(async () => {
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
    })
  })
}

// Application functions
export async function getApplications() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', user.id)
    .order('applied_date', { ascending: false })
    .limit(5000) // Increase limit to handle large number of applications

  if (error) throw error
  return data
}


export async function addApplication(application: Omit<Application, 'id'>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('applications')
    .insert([{ ...application, user_id: user.id }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateApplication(id: string, application: Partial<Application>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('applications')
    .update(application)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteApplication(id: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error
}

// Statistics functions
export async function getApplicationStats(): Promise<ApplicationStats> {
  try {
    const now = new Date()
    const timezoneOffset = -now.getTimezoneOffset() // Convert to minutes ahead of UTC
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('Error getting user:', userError)
      throw new Error(`Authentication error: ${userError.message}`)
    }
    
    if (!user) {
      console.error('No user found in session')
      throw new Error('Not authenticated')
    }
    
    try {
      const { data, error } = await supabase
        .rpc('get_application_stats', { 
          user_id: user.id,
          timezone_offset: timezoneOffset
        })
        .single()

      if (error) {
        console.error('Supabase RPC error:', error)
        throw error
      }

      if (!data) {
        // Return default values if no data
        return {
          total_applications: 0,
          applications_this_week: 0,
          applications_today: 0,
          current_streak: 0,
          response_rate: 0,
          longest_streak: 0,
          last_application_date: '',
          streak_start_date: ''
        }
      }

      // Type assertion to handle the data properly
      const rawData = data as Record<string, any>
      
      // Ensure all expected properties exist
      const stats: ApplicationStats = {
        total_applications: typeof rawData.total_applications === 'number' ? rawData.total_applications : 0,
        applications_this_week: typeof rawData.applications_this_week === 'number' ? rawData.applications_this_week : 0,
        applications_today: typeof rawData.applications_today === 'number' ? rawData.applications_today : 0,
        current_streak: typeof rawData.current_streak === 'number' ? rawData.current_streak : 0,
        response_rate: typeof rawData.response_rate === 'number' ? rawData.response_rate : 0,
        longest_streak: typeof rawData.longest_streak === 'number' ? rawData.longest_streak : 0,
        last_application_date: typeof rawData.last_application_date === 'string' ? rawData.last_application_date : '',
        streak_start_date: typeof rawData.streak_start_date === 'string' ? rawData.streak_start_date : ''
      }
      
      return stats
    } catch (error) {
      console.error('Error in RPC call:', error)
      throw error
    }
  } catch (error) {
    console.error('Error in getApplicationStats:', error)
    throw error
  }
}

// Search and filter functions
export async function searchApplications(query: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', user.id)
    .or(`position.ilike.%${query}%,company.ilike.%${query}%,location.ilike.%${query}%`)
    .order('applied_date', { ascending: false })

  if (error) throw error
  return data
}

export async function filterApplications({
  status,
  workType,
  dateRange,
}: {
  status?: Application['status']
  workType?: Application['work_type']
  dateRange?: { start: string; end: string }
}) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  let query = supabase
    .from('applications')
    .select('*')
    .eq('user_id', user.id)

  if (status) {
    query = query.eq('status', status)
  }

  if (workType) {
    query = query.eq('work_type', workType)
  }

  if (dateRange) {
    query = query
      .gte('applied_date', dateRange.start)
      .lte('applied_date', dateRange.end)
  }

  const { data, error } = await query.order('applied_date', { ascending: false })

  if (error) throw error
  return data
}

export async function getApplicationWithCustomFiles(applicationId: string): Promise<ApplicationWithCustomFiles> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // First get the application to ensure it exists and belongs to the user
  const { data: application, error: appError } = await supabase
    .from('applications')
    .select('*')
    .eq('id', applicationId)
    .eq('user_id', user.id)
    .single()

  if (appError) {
    if (appError.code === 'PGRST116') {
      throw new Error('Application not found')
    }
    throw appError
  }

  if (!application) {
    throw new Error('Application not found')
  }

  // Get custom resume if job_identifier exists
  let customResume = null
  if (application.job_identifier) {
    const { data: resumeData } = await supabase
      .from('custom_resumes')
      .select('resume_url, created_at')
      .eq('job_identifier', application.job_identifier)
      .eq('user_id', user.id)
      .single()
    
    customResume = resumeData
  }

  // Get custom cover letter if job_identifier exists
  let customCoverLetter = null
  if (application.job_identifier) {
    const { data: coverLetterData } = await supabase
      .from('custom_cover_letters')
      .select('cover_letter_url, created_at')
      .eq('job_identifier', application.job_identifier)
      .eq('user_id', user.id)
      .single()
    
    customCoverLetter = coverLetterData
  }

  // Combine all data
  const applicationWithFiles: ApplicationWithCustomFiles = {
    ...application,
    custom_resume_url: customResume?.resume_url || undefined,
    custom_resume_created_at: customResume?.created_at || undefined,
    custom_cover_letter_url: customCoverLetter?.cover_letter_url || undefined,
    custom_cover_letter_created_at: customCoverLetter?.created_at || undefined,
  }

  return applicationWithFiles
}

export async function updateDailyGoal(goal: number) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('profiles')
    .update({ daily_goal: goal })
    .eq('id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

// AI Assistant API
export interface AIMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface AIResponse {
  id: string
  choices: {
    message: {
      role: string
      content: string
    }
    index: number
  }[]
}

export interface AIAssistantSession {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  title: string
  messages: AIMessage[]
  generated_content_path: string | null
}

export async function saveGeneratedContent(content: string, contentType: string): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    
    // Generate a filename
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '')
    const filename = `${contentType}_${timestamp}.md`
    
    // Save to storage
    const { data, error } = await supabase
      .storage
      .from('generated_content')
      .upload(`${user.id}/${filename}`, content, {
        contentType: 'text/markdown',
        upsert: false
      })
    
    if (error) throw error
    
    return data.path
  } catch (error) {
    console.error('Error saving generated content:', error)
    return null
  }
}

export async function saveAssistantSession(
  messages: AIMessage[], 
  title: string,
  generatedContentPath?: string
): Promise<AIAssistantSession | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    
    const { data, error } = await supabase
      .from('ai_assistant_sessions')
      .insert([
        {
          user_id: user.id,
          title,
          messages,
          generated_content_path: generatedContentPath || null
        }
      ])
      .select()
      .single()
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error saving assistant session:', error)
    return null
  }
}

export async function getAssistantSessions(): Promise<AIAssistantSession[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    
    const { data, error } = await supabase
      .from('ai_assistant_sessions')
      .select()
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
    
    if (error) throw error
    
    return data || []
  } catch (error) {
    console.error('Error getting assistant sessions:', error)
    return []
  }
}

export async function getAssistantSession(id: string): Promise<AIAssistantSession | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    
    const { data, error } = await supabase
      .from('ai_assistant_sessions')
      .select()
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error getting assistant session:', error)
    return null
  }
} 