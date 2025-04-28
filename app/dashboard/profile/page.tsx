"use client"

import { useState, useEffect, useCallback } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { 
  Github, 
  Linkedin, 
  Link2, 
  Mail, 
  Phone, 
  MapPin, 
  Edit2, 
  Plus,
  ExternalLink,
  Loader2,
  Download,
  Clock,
  Trash2
} from "lucide-react"
import { ExperienceDialog } from "@/components/profile/ExperienceDialog"
import { EducationDialog } from "@/components/profile/EducationDialog"
import { ProjectDialog } from "@/components/profile/ProjectDialog"
import { AddItemDialog } from "@/components/profile/AddItemDialog"
import { toast } from "sonner"

interface ResumeHistoryItem {
  id: string
  filename: string
  file_path: string
  uploaded_at: string
  is_active: boolean
}

interface ProfileData {
  id: string
  fullName: string
  title: string
  email: string
  phone: string
  location: string
  bio: string
  education: {
    id?: string
    school: string
    degree: string
    date: string
  }[]
  experience: {
    id?: string
    title: string
    company: string
    location: string
    date: string
    description: string
  }[]
  projects: {
    id?: string
    name: string
    description: string
    url: string
  }[]
  skills: string[]
  languages: string[]
  socials: {
    linkedin?: string
    github?: string
    portfolio?: string
    website?: string
  }
  show_profile?: boolean
  resume_url?: string
  avatar_url?: string
  resume_filename?: string
  resume_history?: ResumeHistoryItem[]
}

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [editingSection, setEditingSection] = useState<string>("")
  const supabase = createClientComponentClient()

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    try {
      setIsLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select()
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
                title: '',
                phone: '',
                location: '',
                bio: '',
                education: [],
                experience: [],
                projects: [],
                skills: [],
                languages: [],
                socials: {},
                avatar_url: '',
                resume_url: '',
                show_profile: false
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

      // Load resume history
      const { data: resumeHistory, error: historyError } = await supabase
        .from('resume_history')
        .select('*')
        .eq('profile_id', user.id)
        .order('uploaded_at', { ascending: false })

      if (historyError) {
        console.error('Error loading resume history:', historyError)
      }

      console.log('Resume history loaded:', resumeHistory)
      console.log('Current resume URL:', profile?.resume_url)

      // Transform the data to match our interface
      setProfileData({
        id: user.id,
        fullName: profile?.full_name || '',
        title: profile?.title || '',
        email: user.email || '',
        phone: profile?.phone || '',
        location: profile?.location || '',
        bio: profile?.bio || '',
        education: profile?.education || [],
        experience: profile?.experience || [],
        projects: profile?.projects || [],
        skills: profile?.skills || [],
        languages: profile?.languages || [],
        socials: profile?.socials || {},
        avatar_url: profile?.avatar_url || '',
        resume_url: profile?.resume_url || '',
        show_profile: profile?.show_profile,
        resume_filename: profile?.resume_filename || '',
        resume_history: resumeHistory || []
      })
    } catch (error: any) {
      console.error('Error loading profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function loadResumeHistory(userId: string) {
    try {
      const { data: history, error } = await supabase
        .from('resume_history')
        .select('*')
        .eq('profile_id', userId)
        .order('uploaded_at', { ascending: false })

      if (error) throw error
      return history || []
    } catch (error) {
      console.error('Error loading resume history:', error)
      return []
    }
  }

  async function handleSave(section: string, data: any) {
    try {
      setIsSaving(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      let updateData: any = {}

      switch (section) {
        case 'profile':
          updateData = {
            full_name: data.fullName,
            title: data.title,
            phone: data.phone,
            location: data.location,
            bio: data.bio
          }
          break
        case 'education':
          const education = [...(profileData?.education || [])]
          if (data.id) {
            const index = education.findIndex(e => e.id === data.id)
            if (index !== -1) {
              education[index] = data
            }
          } else {
            education.push({ ...data, id: crypto.randomUUID() })
          }
          updateData = { education }
          break
        case 'experience':
          const experience = [...(profileData?.experience || [])]
          if (data.id) {
            const index = experience.findIndex(e => e.id === data.id)
            if (index !== -1) {
              experience[index] = data
            }
          } else {
            experience.push({ ...data, id: crypto.randomUUID() })
          }
          updateData = { experience }
          break
        case 'projects':
          const projects = [...(profileData?.projects || [])]
          if (data.id) {
            const index = projects.findIndex(p => p.id === data.id)
            if (index !== -1) {
              projects[index] = data
            }
          } else {
            projects.push({ ...data, id: crypto.randomUUID() })
          }
          updateData = { projects }
          break
        case 'skills':
          updateData = { skills: [...(profileData?.skills || []), data] }
          break
        case 'languages':
          updateData = { languages: [...(profileData?.languages || []), data] }
          break
        case 'socials':
          updateData = { socials: { ...(profileData?.socials || {}), ...data } }
          break
        case 'show_profile':
          updateData = { show_profile: data }
          break
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)

      if (error) throw error

      // Update local state with the correct property mapping
      if (section === 'profile') {
        setProfileData(prev => prev ? {
          ...prev,
          fullName: data.fullName,
          title: data.title,
          phone: data.phone,
          location: data.location,
          bio: data.bio
        } : null)
      } else {
      setProfileData(prev => prev ? { ...prev, ...updateData } : null)
      }
      
      setEditingItem(null)
      setEditingSection("")
      
      // Reload profile data to ensure consistency
      await loadProfile()
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddSkill = async (skill: string) => {
    if (!profileData?.skills.includes(skill)) {
      const updatedSkills = [...(profileData?.skills || []), skill]
      await handleSave('skills', skill)
    }
  }

  const handleAddLanguage = async (language: string) => {
    if (!profileData?.languages.includes(language)) {
      const updatedLanguages = [...(profileData?.languages || []), language]
      await handleSave('languages', language)
    }
  }

  const handleFileUpload = useCallback(async (file: File, type: 'resume' | 'avatar') => {
    try {
      setIsSaving(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create file path
      const fileExt = file.name.split('.').pop()
      const originalFileName = file.name
      const uniqueId = crypto.randomUUID()
      const fileName = type === 'resume' 
        ? `${user.id}/${originalFileName}` // Keep original filename for resume
        : `${user.id}/${uniqueId}.${fileExt}` // Use UUID for avatar
      const bucketName = type === 'resume' ? 'resumes' : 'avatars'
      const filePath = `${fileName}`

      // For avatar, show preview immediately before upload
      if (type === 'avatar') {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result
          if (typeof result === 'string') {
            setProfileData(prev => prev ? {
              ...prev,
              avatar_url: result
            } : null)
          }
        }
        reader.readAsDataURL(file)
      }

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          upsert: true // Overwrite if file exists
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath)

      const publicUrl = data.publicUrl

      // Update profile with new URL and filename for resume
      const updateData = type === 'resume' 
        ? {
            resume_url: filePath, // Store the path instead of URL
            resume_filename: originalFileName
          }
        : {
            avatar_url: publicUrl
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)

      if (updateError) throw updateError

      // Update local state
      setProfileData(prev => prev ? {
        ...prev,
        ...updateData
      } : null)
      
      toast.success(`${type === 'resume' ? 'Resume' : 'Profile picture'} uploaded successfully`)

      if (type === 'resume') {
        // Add to resume history
        const { error: historyError } = await supabase
          .from('resume_history')
          .insert([
            {
              profile_id: user.id,
              filename: originalFileName,
              file_path: filePath,
              is_active: true
            }
          ])

        if (historyError) throw historyError

        // Set previous active resume to inactive
        await supabase
          .from('resume_history')
          .update({ is_active: false })
          .eq('profile_id', user.id)
          .neq('file_path', filePath)

        // Reload resume history
        const history = await loadResumeHistory(user.id)
        setProfileData(prev => prev ? {
          ...prev,
          resume_history: history
        } : null)
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error)
      toast.error(`Failed to upload ${type}`)
      // Revert preview if upload fails for avatar
      if (type === 'avatar') {
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('avatar_url')
              .eq('id', user.id)
              .single()
            
            setProfileData(prev => prev ? {
              ...prev,
              avatar_url: profile?.avatar_url || ''
            } : null)
          }
        } catch (err) {
          console.error('Error reverting avatar:', err)
        }
      }
    } finally {
      setIsSaving(false)
    }
  }, [supabase])

  if (isLoading || !profileData) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Profile Header */}
      <Card className="p-8 mb-6 bg-gradient-to-br from-white to-gray-50">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="relative group">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                {profileData.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={profileData.avatar_url} 
                    alt={profileData.fullName}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    <span className="text-2xl">{profileData.fullName.charAt(0)}</span>
                  </div>
                )}
              </Avatar>
              <label 
                htmlFor="avatar-upload" 
                className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 cursor-pointer rounded-full transition-opacity"
              >
                <div className="flex flex-col items-center">
                  <Edit2 className="w-5 h-5 mb-1" />
                  <span className="text-sm">Change</span>
                </div>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    // Preview before upload
                    const reader = new FileReader()
                    reader.onload = (e) => {
                      setProfileData(prev => prev ? {
                        ...prev,
                        avatar_url: e.target?.result as string
                      } : null)
                    }
                    reader.readAsDataURL(file)
                    handleFileUpload(file, 'avatar')
                  }
                }}
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{profileData.fullName || 'Add Your Name'}</h1>
              <p className="text-xl text-gray-600 mb-3">{profileData.title || 'Add Your Title'}</p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{profileData.email}</span>
                </div>
                {profileData.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{profileData.phone}</span>
                  </div>
                )}
                {profileData.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{profileData.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full md:w-auto flex flex-col gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={editingItem?.fullName || profileData.fullName}
                      onChange={(e) => setEditingItem((prev: Partial<ProfileData> | null) => ({ ...prev, fullName: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={editingItem?.title || profileData.title}
                      onChange={(e) => setEditingItem((prev: Partial<ProfileData> | null) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editingItem?.phone || profileData.phone}
                      onChange={(e) => setEditingItem((prev: Partial<ProfileData> | null) => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editingItem?.location || profileData.location}
                      onChange={(e) => setEditingItem((prev: Partial<ProfileData> | null) => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editingItem?.bio || profileData.bio}
                      onChange={(e) => setEditingItem((prev: Partial<ProfileData> | null) => ({ ...prev, bio: e.target.value }))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={() => handleSave('profile', editingItem)}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div className="flex items-center gap-2">
              <Switch
                id="show-profile"
                checked={profileData.show_profile}
                onCheckedChange={(checked) => handleSave('show_profile', checked)}
              />
              <Label htmlFor="show-profile" className="text-sm">
                Show Profile to Recruiters
              </Label>
            </div>
          </div>
        </div>
        {profileData.bio && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
          </div>
        )}
      </Card>

      {/* Resume Section */}
      <Card className="p-8 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Resume</h2>
          <div className="flex items-center gap-2">
            <label 
              htmlFor="resume-upload"
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <Link2 className="w-4 h-4 mr-2" />
              {profileData.resume_url ? 'Update Resume' : 'Upload Resume'}
            </label>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setProfileData(prev => prev ? {
                    ...prev,
                    resume_filename: file.name
                  } : null)
                  handleFileUpload(file, 'resume')
                }
              }}
            />
          </div>
        </div>
        {profileData.resume_url ? (
          <div className="space-y-4">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Link2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h3 className="font-medium text-blue-900">{profileData.resume_filename || 'Your Resume'}</h3>
                  <p className="text-sm text-blue-600">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 transition-colors border border-blue-100"
                    onClick={async () => {
                      try {
                        if (!profileData.resume_url) {
                          throw new Error('No resume URL found')
                        }

                        // Extract just the filename part from the full path
                        const filePath = profileData.resume_url.split('/').slice(-2).join('/')

                        const { data, error } = await supabase.storage
                          .from('resumes')
                          .createSignedUrl(filePath, 31536000) // 1 year in seconds

                        if (error) throw error
                        if (!data?.signedUrl) throw new Error('No signed URL generated')

                        window.open(data.signedUrl, '_blank', 'noopener,noreferrer')
                      } catch (error) {
                        console.error('Error previewing resume:', error)
                        toast.error('Failed to preview resume')
                      }
                    }}
              >
                <ExternalLink className="w-4 h-4" />
                    Preview
                  </Button>
            </div>
              </div>
            </div>
            
            {profileData.resume_history && profileData.resume_history.length > 1 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Previous Versions</h3>
                <div className="space-y-2">
                  {profileData.resume_history
                    .filter(item => !item.is_active)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">{item.filename}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(item.uploaded_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600"
                            onClick={async () => {
                              try {
                                const { data, error } = await supabase.storage
                                  .from('resumes')
                                  .createSignedUrl(item.file_path, 31536000)

                                if (error) throw error
                                if (!data?.signedUrl) throw new Error('No signed URL generated')

                                window.open(data.signedUrl, '_blank', 'noopener,noreferrer')
                              } catch (error) {
                                console.error('Error previewing resume:', error)
                                toast.error('Failed to preview resume')
                              }
                            }}
                          >
                            <ExternalLink className="w-4 h-4" />
                            Preview
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={async () => {
                              try {
                                // Delete from storage
                                const { error: storageError } = await supabase.storage
                                  .from('resumes')
                                  .remove([item.file_path])

                                if (storageError) throw storageError

                                // Delete from resume_history
                                const { error: historyError } = await supabase
                                  .from('resume_history')
                                  .delete()
                                  .eq('id', item.id)

                                if (historyError) throw historyError

                                // Update local state
                                setProfileData(prev => prev ? {
                                  ...prev,
                                  resume_history: prev.resume_history?.filter(h => h.id !== item.id) || []
                                } : null)

                                toast.success('Resume version deleted successfully')
                              } catch (error) {
                                console.error('Error deleting resume:', error)
                                toast.error('Failed to delete resume version')
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <Link2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resume uploaded</h3>
            <p className="text-gray-500 mb-4">Upload your resume to share with potential employers</p>
          </div>
        )}
      </Card>

      {/* Work Experience */}
      <Card className="p-8 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Work Experience</h2>
          <ExperienceDialog
            trigger={
              <Button variant="outline" className="hover:bg-gray-100 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            }
            onSave={(data) => handleSave('experience', data)}
          />
        </div>
        <div className="space-y-6">
          {profileData.experience.map((exp, index) => (
            <div key={index} className="relative pl-8 pb-6 last:pb-0 border-l-2 border-gray-200 last:border-l-0">
              <div className="absolute left-0 top-0 w-8 h-8 -translate-x-1/2 rounded-full bg-white border-2 border-gray-200" />
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{exp.title}</h3>
                  <p className="text-gray-600 mb-1">{exp.company} • {exp.location}</p>
                  <p className="text-gray-500 text-sm mb-2">{exp.date}</p>
                  <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                </div>
                <ExperienceDialog
                  trigger={
                    <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  }
                  experience={exp}
                  onSave={(data) => handleSave('experience', { ...data, id: exp.id })}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Education */}
      <Card className="p-8 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Education</h2>
          <EducationDialog
            trigger={
              <Button variant="outline" className="hover:bg-gray-100 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            }
            onSave={(data) => handleSave('education', data)}
          />
        </div>
        <div className="space-y-6">
          {profileData.education.map((edu, index) => (
            <div key={index} className="flex justify-between items-start p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div>
                <h3 className="text-lg font-medium">{edu.school}</h3>
                <p className="text-gray-600 mb-1">{edu.degree}</p>
                <p className="text-gray-500 text-sm">{edu.date}</p>
              </div>
              <EducationDialog
                trigger={
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                }
                education={edu}
                onSave={(data) => handleSave('education', { ...data, id: edu.id })}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Projects */}
      <Card className="p-8 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Projects & Outside Experience</h2>
          <ProjectDialog
            trigger={
              <Button variant="outline" className="hover:bg-gray-100 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            }
            onSave={(data) => handleSave('projects', data)}
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {profileData.projects.map((project, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium mb-2">{project.name}</h3>
                  <p className="text-gray-700 mb-3">{project.description}</p>
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 flex items-center gap-1 group"
                  >
                    <Link2 className="w-4 h-4" />
                    <span className="group-hover:underline">View Project</span>
                  </a>
                </div>
                <ProjectDialog
                  trigger={
                    <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  }
                  project={project}
                  onSave={(data) => handleSave('projects', { ...data, id: project.id })}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Portfolio & Socials */}
      <Card className="p-8 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Portfolio & Socials</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="hover:bg-gray-100 transition-colors">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Links
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Portfolio & Socials</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={editingItem?.socials?.linkedin || profileData.socials.linkedin || ''}
                    onChange={(e) => setEditingItem((prev: any) => ({
                      ...prev,
                      socials: { ...(prev?.socials || {}), linkedin: e.target.value }
                    }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="github">GitHub URL</Label>
                  <Input
                    id="github"
                    type="url"
                    placeholder="https://github.com/username"
                    value={editingItem?.socials?.github || profileData.socials.github || ''}
                    onChange={(e) => setEditingItem((prev: any) => ({
                      ...prev,
                      socials: { ...(prev?.socials || {}), github: e.target.value }
                    }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="portfolio">Portfolio URL</Label>
                  <Input
                    id="portfolio"
                    type="url"
                    placeholder="https://your-portfolio.com"
                    value={editingItem?.socials?.portfolio || profileData.socials.portfolio || ''}
                    onChange={(e) => setEditingItem((prev: any) => ({
                      ...prev,
                      socials: { ...(prev?.socials || {}), portfolio: e.target.value }
                    }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => handleSave('socials', editingItem?.socials)}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid gap-4">
          <a 
            href={profileData.socials.linkedin} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`flex items-center gap-3 p-4 rounded-lg transition-colors ${
              profileData.socials.linkedin 
                ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
                : 'bg-gray-50 text-gray-500'
            }`}
          >
            <Linkedin className="w-5 h-5" />
            <span>{profileData.socials.linkedin ? 'LinkedIn Profile' : 'No LinkedIn profile added'}</span>
          </a>
          <a 
            href={profileData.socials.github}
            target="_blank" 
            rel="noopener noreferrer"
            className={`flex items-center gap-3 p-4 rounded-lg transition-colors ${
              profileData.socials.github 
                ? 'bg-gray-900 text-white hover:bg-gray-800' 
                : 'bg-gray-50 text-gray-500'
            }`}
          >
            <Github className="w-5 h-5" />
            <span>{profileData.socials.github ? 'GitHub Profile' : 'No GitHub profile added'}</span>
          </a>
          <a 
            href={profileData.socials.portfolio}
            target="_blank" 
            rel="noopener noreferrer"
            className={`flex items-center gap-3 p-4 rounded-lg transition-colors ${
              profileData.socials.portfolio 
                ? 'bg-purple-50 text-purple-600 hover:bg-purple-100' 
                : 'bg-gray-50 text-gray-500'
            }`}
          >
            <ExternalLink className="w-5 h-5" />
            <span>{profileData.socials.portfolio ? 'Portfolio Website' : 'No portfolio website added'}</span>
          </a>
        </div>
      </Card>

      {/* Skills */}
      <Card className="p-8 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Skills</h2>
          <AddItemDialog
            trigger={
              <Button variant="outline" className="hover:bg-gray-100 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            }
            title="Add Skill"
            label="Skill"
            placeholder="Enter a skill"
            onSave={handleAddSkill}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {profileData.skills.map((skill, index) => (
            <div
              key={index}
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              {skill}
            </div>
          ))}
        </div>
      </Card>

      {/* Languages */}
      <Card className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Languages</h2>
          <AddItemDialog
            trigger={
              <Button variant="outline" className="hover:bg-gray-100 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Add Language
              </Button>
            }
            title="Add Language"
            label="Language"
            placeholder="Enter a language"
            onSave={handleAddLanguage}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {profileData.languages.map((language, index) => (
            <div
              key={index}
              className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              {language}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
} 