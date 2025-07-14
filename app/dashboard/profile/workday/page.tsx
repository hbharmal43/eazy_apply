"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { SimpleWorkdayProfileForm } from "@/components/profile/SimpleWorkdayProfileForm"
import { getProfile, updateProfile, Profile } from "@/lib/api"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function WorkdayProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    try {
      setIsLoading(true)
      const profileData = await getProfile()
      setProfile(profileData)
    } catch (error) {
      console.error('Error loading profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSave(data: Partial<Profile>) {
    try {
      // Add a small delay to prevent rapid API calls
      await new Promise(resolve => setTimeout(resolve, 500))
      
      await updateProfile(data)
      
      // Add delay before reload to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
      await loadProfile() // Reload to get updated data
      
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      console.error('Error updating profile:', error)
      
      if (error.message.includes('rate limit')) {
        toast.error('Too many requests. Please wait a moment and try again.')
        // Wait before allowing next operation
        await new Promise(resolve => setTimeout(resolve, 3000))
      } else if (error.message.includes('refresh_token_not_found')) {
        toast.error('Session expired. Please sign in again.')
        window.location.href = '/signin'
        return
      }
      
      throw error
    }
  }

  if (isLoading || !profile) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return <SimpleWorkdayProfileForm profile={profile} onSave={handleSave} />
} 