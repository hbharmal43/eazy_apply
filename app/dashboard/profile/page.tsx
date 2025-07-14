"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { SimplifyProfileLayout } from "@/components/profile/SimplifyProfileLayout"
import { toast } from "sonner"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [profileData, setProfileData] = useState<any>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    try {
      setIsLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Load main profile
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          // Profile doesn't exist, create one
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert([
              { 
                id: user.id,
                full_name: '',
                first_name: '',
                last_name: '',
                title: '',
                email: user.email || '',
                phone: '',
                location: '',
                bio: '',
                education: [],
                experience: [],
                projects: [],
                skills: [],
                languages: [],
                socials: {},
                show_profile: false,
                profile_completion_percentage: 0
              }
            ])
            .select()
            .single()

          if (insertError) {
            console.error('Error creating profile:', insertError)
            throw insertError
          }
          profile = newProfile
        } else {
          throw profileError
        }
      }

      // Load related data in parallel
      const [
        workExperiencesRes,
        educationRes,
        projectsRes,
        skillsRes,
        languagesRes,
        portfolioLinksRes,
        certificationsRes
      ] = await Promise.all([
        supabase.from('work_experiences').select('*').eq('profile_id', user.id).order('start_year', { ascending: false }),
        supabase.from('education').select('*').eq('profile_id', user.id).order('start_year', { ascending: false }),
        supabase.from('projects').select('*').eq('profile_id', user.id).order('created_at', { ascending: false }),
        supabase.from('profile_skills').select('*').eq('profile_id', user.id).order('skill_name'),
        supabase.from('profile_languages').select('*').eq('profile_id', user.id).order('language_name'),
        supabase.from('portfolio_links').select('*').eq('profile_id', user.id),
        supabase.from('certifications').select('*').eq('profile_id', user.id).order('issue_date', { ascending: false })
      ])

      setProfileData({
        ...profile,
        user_id: user.id,
        work_experiences: workExperiencesRes.data || [],
        education: educationRes.data || [],
        projects: projectsRes.data || [],
        skills: skillsRes.data || [],
        languages: languagesRes.data || [],
        portfolio_links: portfolioLinksRes.data || [],
        certifications: certificationsRes.data || []
      })
    } catch (error: any) {
      console.error('Error loading profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  return (
    <SimplifyProfileLayout 
      profileData={profileData} 
      onProfileUpdate={loadProfile}
    />
  )
} 