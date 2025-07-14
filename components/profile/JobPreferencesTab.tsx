"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Briefcase, MapPin, Building2, TrendingUp, DollarSign, Settings } from "lucide-react"
import { toast } from "sonner"

interface JobPreferencesTabProps {
  profileData: any
  onProfileUpdate: () => void
}

export function JobPreferencesTab({ profileData, onProfileUpdate }: JobPreferencesTabProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    // What do you value in a new role?
    values_in_role: profileData?.job_preferences?.values_in_role || [],
    
    // What kinds of roles are you interested in?
    interested_roles: profileData?.job_preferences?.interested_roles || [],
    role_specializations: profileData?.job_preferences?.role_specializations || [],
    
    // Where would you like to work?
    preferred_locations: profileData?.job_preferences?.preferred_locations || [],
    
    // What level of roles are you looking for?
    role_level: profileData?.job_preferences?.role_level || '',
    
    // What is your ideal company size?
    company_size: profileData?.job_preferences?.company_size || '',
    
    // Industries
    exciting_industries: profileData?.job_preferences?.exciting_industries || [],
    avoid_industries: profileData?.job_preferences?.avoid_industries || [],
    
    // Skills
    preferred_skills: profileData?.job_preferences?.preferred_skills || [],
    avoid_skills: profileData?.job_preferences?.avoid_skills || [],
    
    // Compensation
    minimum_salary: profileData?.job_preferences?.minimum_salary || '',
    
    // Security clearance
    security_clearance_required: profileData?.job_preferences?.security_clearance_required || false,
    
    // Job search status
    job_search_status: profileData?.job_preferences?.job_search_status || 'actively_looking'
  })

  const supabase = createClientComponentClient()

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      const { error } = await supabase
        .from('job_preferences')
        .upsert({
          profile_id: profileData.user_id,
          ...formData
        })

      if (error) throw error

      toast.success('Job preferences saved successfully')
      onProfileUpdate()
    } catch (error) {
      console.error('Error saving job preferences:', error)
      toast.error('Failed to save job preferences')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item)
    } else {
      return [...array, item]
    }
  }

  const renderRoleValues = () => (
    <Card className="p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <TrendingUp className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">What do you value in a new role?</h3>
          <p className="text-sm text-gray-600">Select up to 3</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {[
          { id: 'innovative_product_tech', label: 'Innovative product & tech' },
          { id: 'progressive_leadership', label: 'Progressive leadership' },
          { id: 'transparency_communication', label: 'Transparency & communication' }
        ].map((option) => (
          <label 
            key={option.id}
            className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
              formData.values_in_role.includes(option.id) 
                ? 'border-teal-500 bg-teal-50' 
                : 'border-gray-200'
            }`}
          >
            <input
              type="checkbox"
              checked={formData.values_in_role.includes(option.id)}
              onChange={() => setFormData({
                ...formData,
                values_in_role: toggleArrayItem(formData.values_in_role, option.id)
              })}
              className="w-4 h-4 text-teal-600 mr-3"
            />
            <span className="text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </Card>
  )

  const renderRoleTypes = () => (
    <Card className="p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Briefcase className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">What kinds of roles are you interested in?</h3>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Role Categories</Label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { id: 'software_engineering', label: 'Software Engineering' }
            ].map((option) => (
              <label 
                key={option.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  formData.interested_roles.includes(option.id) 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.interested_roles.includes(option.id)}
                  onChange={() => setFormData({
                    ...formData,
                    interested_roles: toggleArrayItem(formData.interested_roles, option.id)
                  })}
                  className="w-4 h-4 text-teal-600 mr-3"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Select the most relevant specializations for you</Label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { id: 'full_stack_engineering', label: 'Full-Stack Engineering' }
            ].map((option) => (
              <label 
                key={option.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  formData.role_specializations.includes(option.id) 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.role_specializations.includes(option.id)}
                  onChange={() => setFormData({
                    ...formData,
                    role_specializations: toggleArrayItem(formData.role_specializations, option.id)
                  })}
                  className="w-4 h-4 text-teal-600 mr-3"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )

  const renderLocations = () => (
    <Card className="p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <MapPin className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Where would you like to work?</h3>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          'New York City', 'Seattle', 'San Francisco Bay Area', 'San Diego', 'Chicago', 'Denver',
          'Los Angeles', 'Austin', 'Philadelphia', 'Washington D.C.', 'Vancouver', 'London',
          'Miami', 'Boston', 'Atlanta', 'Dallas', 'Remote in USA'
        ].map((location) => (
          <label 
            key={location}
            className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 text-sm ${
              formData.preferred_locations.includes(location.toLowerCase().replace(/\s+/g, '_')) 
                ? 'border-teal-500 bg-teal-50' 
                : 'border-gray-200'
            }`}
          >
            <input
              type="checkbox"
              checked={formData.preferred_locations.includes(location.toLowerCase().replace(/\s+/g, '_'))}
              onChange={() => setFormData({
                ...formData,
                preferred_locations: toggleArrayItem(formData.preferred_locations, location.toLowerCase().replace(/\s+/g, '_'))
              })}
              className="w-4 h-4 text-teal-600 mr-2"
            />
            <span className="text-gray-700">{location}</span>
          </label>
        ))}
      </div>
    </Card>
  )

  const renderRoleLevel = () => (
    <Card className="p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-100 rounded-lg">
          <TrendingUp className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">What level of roles are you looking for?</h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { id: 'internship', label: 'Internship' },
          { id: 'entry_level_new_grad', label: 'Entry Level & New Grad' }
        ].map((option) => (
          <label 
            key={option.id}
            className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
              formData.role_level === option.id 
                ? 'border-teal-500 bg-teal-50' 
                : 'border-gray-200'
            }`}
          >
            <input
              type="radio"
              name="role_level"
              value={option.id}
              checked={formData.role_level === option.id}
              onChange={(e) => setFormData({ ...formData, role_level: e.target.value })}
              className="w-4 h-4 text-teal-600 mr-3"
            />
            <span className="text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </Card>
  )

  const renderCompanySize = () => (
    <Card className="p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Building2 className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">What is your ideal company size?</h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { id: '1_10', label: '1-10 employees' },
          { id: '11_50', label: '11-50 employees' },
          { id: '51_200', label: '51-200 employees' },
          { id: '201_500', label: '201-500 employees' },
          { id: '501_1000', label: '501-1,000 employees' },
          { id: '1001_5000', label: '1,001-5,000 employees' },
          { id: '5001_10000', label: '5,001-10,000 employees' },
          { id: '10000_plus', label: '10,000+ employees' }
        ].map((option) => (
          <label 
            key={option.id}
            className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
              formData.company_size === option.id 
                ? 'border-teal-500 bg-teal-50' 
                : 'border-gray-200'
            }`}
          >
            <input
              type="radio"
              name="company_size"
              value={option.id}
              checked={formData.company_size === option.id}
              onChange={(e) => setFormData({ ...formData, company_size: e.target.value })}
              className="w-4 h-4 text-teal-600 mr-3"
            />
            <span className="text-gray-700 text-sm">{option.label}</span>
          </label>
        ))}
      </div>
    </Card>
  )

  const renderIndustries = () => (
    <Card className="p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-pink-100 rounded-lg">
          <Building2 className="w-6 h-6 text-pink-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">What industries are exciting to you?</h3>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          'Real Estate', 'Consulting', 'Enterprise Software', 'AI & Machine Learning', 'Consumer Software', 'Fintech',
          'Entertainment', 'Robotics & Automation', 'Crypto & Web3', 'Education', 'Industrial & Manufacturing',
          'Government & Public Sector', 'Automotive & Transportation'
        ].map((industry) => (
          <label 
            key={industry}
            className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 text-sm ${
              formData.exciting_industries.includes(industry.toLowerCase().replace(/\s+/g, '_')) 
                ? 'border-teal-500 bg-teal-50' 
                : 'border-gray-200'
            }`}
          >
            <input
              type="checkbox"
              checked={formData.exciting_industries.includes(industry.toLowerCase().replace(/\s+/g, '_'))}
              onChange={() => setFormData({
                ...formData,
                exciting_industries: toggleArrayItem(formData.exciting_industries, industry.toLowerCase().replace(/\s+/g, '_'))
              })}
              className="w-4 h-4 text-teal-600 mr-2"
            />
            <span className="text-gray-700">{industry}</span>
          </label>
        ))}
      </div>
    </Card>
  )

  const renderSkills = () => (
    <Card className="p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-100 rounded-lg">
          <Settings className="w-6 h-6 text-yellow-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">What skills do you have or enjoy working with?</h3>
          <p className="text-sm text-gray-600">Skills that you'd prefer to utilize in roles are highlighted with a heart ❤️</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          'Adobe Illustrator', 'HTML/CSS', 'Git', 'Java', 'Python', 'SEO', 'Excel/Numbers/Sheets',
          'Business Analytics', 'MATLAB', 'Operations Research'
        ].map((skill) => (
          <label 
            key={skill}
            className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 text-sm ${
              formData.preferred_skills.includes(skill.toLowerCase().replace(/\s+/g, '_')) 
                ? 'border-teal-500 bg-teal-50' 
                : 'border-gray-200'
            }`}
          >
            <input
              type="checkbox"
              checked={formData.preferred_skills.includes(skill.toLowerCase().replace(/\s+/g, '_'))}
              onChange={() => setFormData({
                ...formData,
                preferred_skills: toggleArrayItem(formData.preferred_skills, skill.toLowerCase().replace(/\s+/g, '_'))
              })}
              className="w-4 h-4 text-teal-600 mr-2"
            />
            <span className="text-gray-700">{skill}</span>
          </label>
        ))}
      </div>
    </Card>
  )

  const renderSalary = () => (
    <Card className="p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <DollarSign className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">What is your minimum expected salary?</h3>
          <p className="text-sm text-gray-600">We'll only use this to match you with jobs and will not share this data</p>
        </div>
      </div>

      <div className="max-w-xs">
        <Label htmlFor="salary" className="text-sm font-medium text-gray-700 mb-2 block">At least $90k USD</Label>
        <Input
          id="salary"
          type="number"
          value={formData.minimum_salary}
          onChange={(e) => setFormData({ ...formData, minimum_salary: e.target.value })}
          placeholder="90000"
          className="text-lg"
        />
      </div>
    </Card>
  )

  const renderSecurityClearance = () => (
    <Card className="p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-100 rounded-lg">
          <Settings className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Would you like to see roles that require top security clearance?</h3>
          <p className="text-sm text-gray-600">Certain government and defense related positions may require security clearance.</p>
        </div>
      </div>

      <div className="flex gap-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="security_clearance"
            checked={formData.security_clearance_required === true}
            onChange={() => setFormData({ ...formData, security_clearance_required: true })}
            className="w-4 h-4 text-teal-600 mr-2"
          />
          Yes
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="security_clearance"
            checked={formData.security_clearance_required === false}
            onChange={() => setFormData({ ...formData, security_clearance_required: false })}
            className="w-4 h-4 text-teal-600 mr-2"
          />
          No
        </label>
      </div>
    </Card>
  )

  const renderJobSearchStatus = () => (
    <Card className="p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-teal-100 rounded-lg">
          <Briefcase className="w-6 h-6 text-teal-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">What's the status of your job search?</h3>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { id: 'actively_looking', label: 'Actively looking' }
        ].map((option) => (
          <label 
            key={option.id}
            className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
              formData.job_search_status === option.id 
                ? 'border-teal-500 bg-teal-50' 
                : 'border-gray-200'
            }`}
          >
            <input
              type="radio"
              name="job_search_status"
              value={option.id}
              checked={formData.job_search_status === option.id}
              onChange={(e) => setFormData({ ...formData, job_search_status: e.target.value })}
              className="w-4 h-4 text-teal-600 mr-3"
            />
            <span className="text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </Card>
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      {renderRoleValues()}
      {renderRoleTypes()}
      {renderLocations()}
      {renderRoleLevel()}
      {renderCompanySize()}
      {renderIndustries()}
      {renderSkills()}
      {renderSalary()}
      {renderSecurityClearance()}
      {renderJobSearchStatus()}

      <div className="sticky bottom-0 bg-white border-t p-4 mt-8">
        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-teal-600 hover:bg-teal-700 px-8"
          >
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </div>
    </div>
  )
}