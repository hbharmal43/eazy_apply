"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { CitySelect } from "@/components/ui/city-select"
import { Briefcase, Info } from "lucide-react"
import { toast } from "sonner"
import { getAuthenticatedUser, retrySupabaseOperation } from "@/lib/auth-utils"

interface WorkExperienceModalProps {
  experience: any
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  profileId: string
}

export function WorkExperienceModal({
  experience,
  isOpen,
  onClose,
  onSave,
  profileId
}: WorkExperienceModalProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    position_title: '',
    company_name: '',
    location: '',
    experience_type: 'full-time',
    start_month: '',
    start_year: '',
    end_month: '',
    end_year: '',
    is_current: false,
    description: ''
  })

  const supabase = createClientComponentClient()

  useEffect(() => {
    if (experience && Object.keys(experience).length > 0) {
      setFormData({
        position_title: experience.position_title || '',
        company_name: experience.company_name || '',
        location: experience.location || '',
        experience_type: experience.experience_type || 'full-time',
        start_month: experience.start_month || '',
        start_year: experience.start_year?.toString() || '',
        end_month: experience.end_month || '',
        end_year: experience.end_year?.toString() || '',
        is_current: experience.is_current || false,
        description: experience.description || ''
      })
    } else {
      // Reset form for new experience
      setFormData({
        position_title: '',
        company_name: '',
        location: '',
        experience_type: 'full-time',
        start_month: '',
        start_year: '',
        end_month: '',
        end_year: '',
        is_current: false,
        description: ''
      })
    }
  }, [experience, isOpen])

  const handleSave = async () => {
    try {
      setIsSaving(true)

      // Validate required fields
      if (!formData.position_title.trim()) {
        toast.error('Position title is required')
        return
      }
      if (!formData.company_name.trim()) {
        toast.error('Company name is required')
        return
      }

      // Debug logging
      console.log('Profile ID:', profileId)
      console.log('Profile ID type:', typeof profileId)
      console.log('Profile ID length:', profileId?.length)
      console.log('Form data:', formData)

      const experienceData = {
        profile_id: profileId,
        position_title: formData.position_title.trim(),
        company_name: formData.company_name.trim(),
        location: formData.location.trim(),
        experience_type: formData.experience_type,
        start_month: formData.start_month,
        start_year: formData.start_year ? parseInt(formData.start_year) : null,
        end_month: formData.is_current ? null : formData.end_month,
        end_year: formData.is_current ? null : (formData.end_year ? parseInt(formData.end_year) : null),
        is_current: formData.is_current,
        description: formData.description.trim()
      }

      console.log('Experience data to save:', experienceData)

      // Get current user to verify auth
      const user = await getAuthenticatedUser()
      console.log('Auth error:', null)
      console.log('Current user:', user?.id)
      console.log('Current user type:', typeof user?.id)
      console.log('Current user length:', user?.id?.length)
      console.log('Profile ID matches user ID:', user?.id === profileId)
      
      if (!user) {
        throw new Error('Not authenticated')
      }
      
      // Let's also try using the actual authenticated user ID instead of profileId
      const correctedExperienceData = {
        ...experienceData,
        profile_id: user.id  // Use the actual authenticated user ID
      }
      
      console.log('Corrected experience data with auth user ID:', correctedExperienceData)

      let result: any
      if (experience?.id) {
        // Update existing experience
        console.log('Updating experience with ID:', experience.id)
        result = await retrySupabaseOperation(async () => {
          const res = await supabase
            .from('work_experiences')
            .update(correctedExperienceData)
            .eq('id', experience.id)
            .select()
          return res
        })
      } else {
        // Create new experience - simple insert
        console.log('Creating new experience')
        result = await retrySupabaseOperation(async () => {
          const res = await supabase
            .from('work_experiences')
            .insert([correctedExperienceData])
            .select()
          return res
        })
      }

      console.log('Database result:', result)

      if (result.error) throw result.error

      toast.success(experience?.id ? 'Experience updated successfully' : 'Experience added successfully')
      onSave()
      onClose()

    } catch (error: any) {
      console.error('Error saving experience:', error)
      console.error('Error details:', error.details)
      console.error('Error hint:', error.hint)
      console.error('Error message:', error.message)
      toast.error(error.message || 'Failed to save experience')
    } finally {
      setIsSaving(false)
    }
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const experienceTypes = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'freelance', label: 'Freelance' }
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 60 }, (_, i) => currentYear - i)
  
  // Debug: Log the years to see what's being generated
  console.log('Current year:', currentYear)
  console.log('First 5 years:', years.slice(0, 5))
  console.log('Last 5 years:', years.slice(-5))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Briefcase className="w-5 h-5 text-teal-600" />
            Add Experience
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Section Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-900">Profile Section</p>
                <p className="text-sm text-blue-700 mt-1">
                  Information added to this section is used to directly autofill your job applications!
                </p>
              </div>
            </div>
          </div>

          {/* Position Title */}
          <div className="space-y-2">
            <Label htmlFor="position_title" className="text-sm font-medium text-gray-700">
              Position Title
            </Label>
            <Input
              id="position_title"
              placeholder="Title"
              value={formData.position_title}
              onChange={(e) => setFormData({ ...formData, position_title: e.target.value })}
              className="w-full"
            />
          </div>

          {/* Company */}
          <div className="space-y-2">
            <Label htmlFor="company" className="text-sm font-medium text-gray-700 flex items-center gap-1">
              Company
              <Info className="w-4 h-4 text-gray-400" />
            </Label>
            <div className="relative">
              <Input
                id="company"
                placeholder="Search or add company"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full pr-10"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Location and Experience Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                Location
              </Label>
              <CitySelect
                value={formData.location}
                onChange={(value: string) => setFormData({ ...formData, location: value })}
                placeholder="Search city"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience_type" className="text-sm font-medium text-gray-700">
                Experience Type
              </Label>
              <Select
                value={formData.experience_type}
                onValueChange={(value) => setFormData({ ...formData, experience_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {experienceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Start Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_month" className="text-sm font-medium text-gray-700">
                Start Month
              </Label>
              <Select
                value={formData.start_month}
                onValueChange={(value) => setFormData({ ...formData, start_month: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_year" className="text-sm font-medium text-gray-700">
                Start Year
              </Label>
              <Select
                value={formData.start_year}
                onValueChange={(value) => setFormData({ ...formData, start_year: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-auto">
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* End Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="end_month" className="text-sm font-medium text-gray-700">
                End Month
              </Label>
              <Select
                value={formData.end_month}
                onValueChange={(value) => setFormData({ ...formData, end_month: value })}
                disabled={formData.is_current}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_year" className="text-sm font-medium text-gray-700">
                End Year
              </Label>
              <Select
                value={formData.end_year}
                onValueChange={(value) => setFormData({ ...formData, end_year: value })}
                disabled={formData.is_current}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-auto">
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Currently Work Here Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_current"
              checked={formData.is_current}
              onCheckedChange={(checked) => {
                setFormData({ 
                  ...formData, 
                  is_current: checked as boolean,
                  end_month: checked ? '' : formData.end_month,
                  end_year: checked ? '' : formData.end_year
                })
              }}
            />
            <Label htmlFor="is_current" className="text-sm font-medium text-gray-700">
              I currently work here
            </Label>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="A couple sentences about your role"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[120px] resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}