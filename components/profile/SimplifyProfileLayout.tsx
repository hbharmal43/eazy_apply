"use client"

import { useState } from "react"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { 
  MapPin,
  Mail,
  Phone
} from "lucide-react"
import { ProfileTab } from "./ProfileTab"
import { PersonalInfoTab } from "./PersonalInfoTab"
import { JobPreferencesTab } from "./JobPreferencesTab"
import { WorkExperienceModal } from "./WorkExperienceModal"
import { EducationModal } from "./EducationModal"
import { ProjectModal } from "./ProjectModal"
import { SkillsManager } from "./SkillsManager"
import { PortfolioLinksModal } from "./PortfolioLinksModal"
import { LanguagesModal } from "./LanguagesModal"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2, Upload } from "lucide-react"

interface SimplifyProfileLayoutProps {
  profileData: any
  onProfileUpdate: () => void
}

export function SimplifyProfileLayout({ profileData, onProfileUpdate }: SimplifyProfileLayoutProps) {
  const [activeTab, setActiveTab] = useState("profile")
  const [editingExperience, setEditingExperience] = useState<any>(null)
  const [editingEducation, setEditingEducation] = useState<any>(null)
  const [editingProject, setEditingProject] = useState<any>(null)
  const [showSkillsManager, setShowSkillsManager] = useState(false)
  const [showPortfolioLinksModal, setShowPortfolioLinksModal] = useState(false)
  const [showLanguagesModal, setShowLanguagesModal] = useState(false)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const supabase = createClientComponentClient()

  if (!profileData) {
    return <div>Loading...</div>
  }

  const getProfileCompletion = () => {
    return profileData.profile_completion_percentage || 0
  }

  const getCompletionStatus = () => {
    const completion = getProfileCompletion()
    if (completion >= 90) return "All-Star Applicant"
    if (completion >= 70) return "Strong Profile"
    if (completion >= 50) return "Good Start"
    return "Just Getting Started"
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    setUploadError("")
    try {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setUploadError("Please upload a valid image file.")
        setIsUploading(false)
        return
      }
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setUploadError("Image must be less than 2MB.")
        setIsUploading(false)
        return
      }
      // Upload to Supabase Storage
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")
      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}/avatar.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })
      if (uploadError) throw uploadError
      // Get public URL
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath)
      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)
      if (updateError) throw updateError
      setShowAvatarModal(false)
      onProfileUpdate()
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload image.")
    } finally {
      setIsUploading(false)
    }
  }

  const renderAvatarUploadModal = () => (
    <Dialog open={showAvatarModal} onOpenChange={setShowAvatarModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={profileData.avatar_url} />
            <AvatarFallback className="text-2xl bg-teal-100 text-teal-700">
              {profileData.first_name?.[0] || profileData.full_name?.[0] || 'U'}
              {profileData.last_name?.[0] || ''}
            </AvatarFallback>
          </Avatar>
          <label className="w-full">
            <Input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={isUploading}
            />
          </label>
          {isUploading && <Loader2 className="animate-spin text-teal-600 w-6 h-6" />}
          {uploadError && <div className="text-red-600 text-sm">{uploadError}</div>}
        </div>
      </DialogContent>
    </Dialog>
  )

  const renderProfileHeader = () => (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center gap-6">
          <div
            className="group cursor-pointer"
            title="Edit profile picture"
            onClick={() => setShowAvatarModal(true)}
          >
            <Avatar className="w-20 h-20 group-hover:ring-2 group-hover:ring-teal-400 transition">
              <AvatarImage src={profileData.avatar_url} />
              <AvatarFallback className="text-xl bg-teal-100 text-teal-700">
                {profileData.first_name?.[0] || profileData.full_name?.[0] || 'U'}
                {profileData.last_name?.[0] || ''}
              </AvatarFallback>
            </Avatar>
            <div className="text-xs text-center text-teal-600 mt-1 opacity-0 group-hover:opacity-100 transition">Edit</div>
          </div>
          
          <div className="flex-1">
            <h1
              className="text-2xl font-bold text-gray-900 cursor-pointer hover:underline hover:text-teal-600 transition"
              title="Edit name in Personal Info"
              onClick={() => setActiveTab("personal-info")}
            >
              {profileData.first_name && profileData.last_name 
                ? `${profileData.first_name} ${profileData.last_name}`
                : (profileData.full_name || 'Your Name')}
            </h1>
            <p
              className="text-lg text-gray-600 mt-1 cursor-pointer hover:underline hover:text-teal-600 transition"
              title="Edit title in Personal Info"
              onClick={() => setActiveTab("personal-info")}
            >
              {profileData.title || 'Your Professional Title'}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              {(profileData.city || profileData.state) && (
                <div
                  className="flex items-center gap-1 cursor-pointer hover:underline hover:text-teal-600 transition"
                  title="Edit location in Personal Info"
                  onClick={() => setActiveTab("personal-info")}
                >
                  <MapPin className="w-4 h-4" />
                  {[profileData.city, profileData.state].filter(Boolean).join(', ')}
                </div>
              )}
              {profileData.email && (
                <div
                  className="flex items-center gap-1 cursor-pointer hover:underline hover:text-teal-600 transition"
                  title="Edit email in Personal Info"
                  onClick={() => setActiveTab("personal-info")}
                >
                  <Mail className="w-4 h-4" />
                  {profileData.email}
                </div>
              )}
              {profileData.phone && (
                <div
                  className="flex items-center gap-1 cursor-pointer hover:underline hover:text-teal-600 transition"
                  title="Edit phone in Personal Info"
                  onClick={() => setActiveTab("personal-info")}
                >
                  <Phone className="w-4 h-4" />
                  {profileData.phone}
                </div>
              )}
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">Job Search Status</p>
            <p className="font-medium text-teal-600 capitalize">
              {profileData.job_search_status?.replace('_', ' ') || 'Actively looking'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTabNavigation = () => (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "profile"
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("personal-info")}
            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "personal-info"
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Personal Info
          </button>
        </div>
      </div>
    </div>
  )



  return (
    <div className="min-h-screen bg-gray-50">
      {renderProfileHeader()}
      {renderAvatarUploadModal()}
      {renderTabNavigation()}
      
      <div className="max-w-6xl mx-auto px-6 py-6">
        {activeTab === "profile" && (
          <ProfileTab 
            profileData={profileData}
            onProfileUpdate={onProfileUpdate}
            onEditExperience={setEditingExperience}
            onEditEducation={setEditingEducation}
            onEditProject={setEditingProject}
            onManageSkills={() => setShowSkillsManager(true)}
            onEditPortfolioLinks={() => setShowPortfolioLinksModal(true)}
            onEditLanguages={() => setShowLanguagesModal(true)}
          />
        )}
        
        {activeTab === "personal-info" && (
          <PersonalInfoTab 
            profileData={profileData}
            onProfileUpdate={onProfileUpdate}
          />
        )}
        
        {/* Job Preferences tab is hidden for now */}
        {/* {activeTab === "job-preferences" && (
          <JobPreferencesTab 
            profileData={profileData}
            onProfileUpdate={onProfileUpdate}
          />
        )} */}
      </div>

      {/* Modals */}
      {editingExperience !== null && (
        <WorkExperienceModal
          experience={editingExperience}
          isOpen={true}
          onClose={() => setEditingExperience(null)}
          onSave={onProfileUpdate}
          profileId={profileData.user_id}
        />
      )}

      {editingEducation !== null && (
        <EducationModal
          education={editingEducation}
          isOpen={true}
          onClose={() => setEditingEducation(null)}
          onSave={onProfileUpdate}
          profileId={profileData.user_id}
        />
      )}

      {editingProject !== null && (
        <ProjectModal
          project={editingProject}
          isOpen={true}
          onClose={() => setEditingProject(null)}
          onSave={onProfileUpdate}
          profileId={profileData.user_id}
        />
      )}

      {showSkillsManager && (
        <SkillsManager
          skills={profileData.skills || []}
          isOpen={true}
          onClose={() => setShowSkillsManager(false)}
          onSave={onProfileUpdate}
          profileId={profileData.user_id}
        />
      )}

      {showPortfolioLinksModal && (
        <PortfolioLinksModal
          isOpen={true}
          onClose={() => setShowPortfolioLinksModal(false)}
          onSave={onProfileUpdate}
          profileId={profileData.user_id}
          portfolioLinks={profileData.portfolio_links || []}
        />
      )}

      {showLanguagesModal && (
        <LanguagesModal
          languages={profileData.languages || []}
          isOpen={true}
          onClose={() => setShowLanguagesModal(false)}
          onSave={onProfileUpdate}
          profileId={profileData.user_id}
        />
      )}
    </div>
  )
} 