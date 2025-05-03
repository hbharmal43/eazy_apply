import { supabase } from '@/lib/supabase'

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
}

export interface Application {
  id: string
  position: string
  company: string
  location: string
  work_type: 'remote' | 'hybrid' | 'onsite'
  salary_min: number
  salary_max: number
  salary_currency: string
  applied_date: string
  apply_time: number
  source: string
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'withdrawn'
  company_url?: string
  job_description?: string
  notes?: string
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
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data
}

export async function updateProfile(profile: Partial<Profile>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
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

  if (error) throw error
  return data
}

export async function getRecentApplications(limit = 5) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('recent_applications')
    .select('*')
    .eq('user_id', user.id)
    .limit(limit)

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
    console.log('Starting getApplicationStats function')
    const now = new Date()
    console.log('Current local time:', now.toLocaleString())
    console.log('Current UTC time:', now.toUTCString())
    const timezoneOffset = -now.getTimezoneOffset() // Convert to minutes ahead of UTC
    console.log('Timezone offset (minutes):', timezoneOffset)
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('Error getting user:', userError)
      throw new Error(`Authentication error: ${userError.message}`)
    }
    
    if (!user) {
      console.error('No user found in session')
      throw new Error('Not authenticated')
    }
    
    console.log('User found, ID:', user.id)
    
    try {
      console.log('Calling RPC function get_application_stats with:', { user_id: user.id, timezone_offset: timezoneOffset })
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

      console.log('RPC call successful, raw data:', data)

      if (!data) {
        console.log('No data returned, using default values')
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
      
      console.log('Raw data from RPC:', rawData)
      console.log('Processed stats:', stats)
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