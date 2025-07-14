"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SchoolSelect } from "@/components/ui/school-select"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"
import { GraduationCap, Info } from "lucide-react"

interface EducationModalProps {
  education: any
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  profileId: string
}

interface EducationData {
  school: string
  degree: string
  field: string
  startMonth: string
  startYear: string
  endMonth: string
  endYear: string
  gpa: string
  description: string
}

const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" }
]

const DEGREE_TYPES = [
  "High School Diploma",
  "Associate Degree",
  "Bachelor's Degree", 
  "Master's Degree",
  "Doctoral Degree",
  "Professional Degree",
  "Certificate",
  "Other"
]

// Generate years from 1960 to current year + 10
const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: currentYear - 1960 + 11 }, (_, i) => {
  const year = currentYear + 10 - i
  return { value: year.toString(), label: year.toString() }
})

export function EducationModal({ education, isOpen, onClose, onSave, profileId }: EducationModalProps) {
  const [formData, setFormData] = useState<EducationData>({
    school: "",
    degree: "",
    field: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    gpa: "",
    description: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClientComponentClient()

  // Populate form when editing existing education
  useEffect(() => {
    if (education && isOpen) {
      setFormData({
        school: education.institution_name || "",
        degree: education.degree_type || "",
        field: education.major || "",
        startMonth: education.start_month ? education.start_month.toString().padStart(2, '0') : "",
        startYear: education.start_year?.toString() || "",
        endMonth: education.end_month ? education.end_month.toString().padStart(2, '0') : "",
        endYear: education.end_year?.toString() || "",
        gpa: education.gpa?.toString() || "",
        description: education.description || ""
      })
    } else if (isOpen) {
      // Reset form for new education
      setFormData({
        school: "",
        degree: "",
        field: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        gpa: "",
        description: ""
      })
    }
    setErrors({})
  }, [education, isOpen])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.school.trim()) {
      newErrors.school = "School is required"
    }
    if (!formData.degree.trim()) {
      newErrors.degree = "Degree is required"
    }
    if (!formData.field.trim()) {
      newErrors.field = "Field of study is required"
    }
    if (!formData.startYear) {
      newErrors.startYear = "Start year is required"
    }
    if (!formData.endYear) {
      newErrors.endYear = "End year is required"
    }

    // Validate date logic
    if (formData.startYear && formData.endYear) {
      const startYear = parseInt(formData.startYear)
      const endYear = parseInt(formData.endYear)
      
      if (endYear <= startYear) {
        newErrors.endDate = "End year must be after start year"
      }
    }

    // Validate GPA if provided
    if (formData.gpa && (isNaN(parseFloat(formData.gpa)) || parseFloat(formData.gpa) < 0 || parseFloat(formData.gpa) > 4.0)) {
      newErrors.gpa = "GPA must be a number between 0.0 and 4.0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)

      if (!validateForm()) {
        return
      }

      const educationData = {
        profile_id: profileId,
        institution_name: formData.school.trim(),
        degree_type: formData.degree.trim(),
        major: formData.field.trim(),
        start_year: formData.startYear ? parseInt(formData.startYear) : null,
        start_month: formData.startMonth ? parseInt(formData.startMonth) : null,
        end_year: formData.endYear ? parseInt(formData.endYear) : null,
        end_month: formData.endMonth ? parseInt(formData.endMonth) : null,
        gpa: formData.gpa ? parseFloat(formData.gpa) : null,
        description: formData.description.trim()
      }

      let result
      if (education?.id) {
        // Update existing education
        result = await supabase
          .from('education')
          .update(educationData)
          .eq('id', education.id)
      } else {
        // Create new education
        result = await supabase
          .from('education')
          .insert([educationData])
      }

      if (result.error) throw result.error

      toast.success(education?.id ? 'Education updated successfully' : 'Education added successfully')
      onSave()
      onClose()

    } catch (error: any) {
      console.error('Error saving education:', error)
      toast.error(error.message || 'Failed to save education')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSave()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {education?.id ? 'Edit Education' : 'Add Education'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
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

          {/* School Selection */}
          <div className="space-y-2">
            <Label htmlFor="school" className="text-sm font-medium text-gray-700">
              School <span className="text-red-500">*</span>
            </Label>
            <SchoolSelect
              value={formData.school}
              onChange={(value) => setFormData(prev => ({ ...prev, school: value }))}
              placeholder="Search for your school..."
              className="w-full"
            />
            {errors.school && (
              <p className="text-sm text-red-600">{errors.school}</p>
            )}
          </div>

          {/* Degree and Field */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="degree" className="text-sm font-medium text-gray-700">
                Degree <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.degree} onValueChange={(value) => setFormData(prev => ({ ...prev, degree: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select degree type" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-auto">
                  {DEGREE_TYPES.map((degree) => (
                    <SelectItem key={degree} value={degree}>
                      {degree}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.degree && (
                <p className="text-sm text-red-600">{errors.degree}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="field" className="text-sm font-medium text-gray-700">
                Field of Study <span className="text-red-500">*</span>
              </Label>
              <Input
                id="field"
                value={formData.field}
                onChange={(e) => setFormData(prev => ({ ...prev, field: e.target.value }))}
                placeholder="e.g., Computer Science, Business Administration"
                className={errors.field ? "border-red-500" : ""}
              />
              {errors.field && (
                <p className="text-sm text-red-600">{errors.field}</p>
              )}
            </div>
          </div>

          {/* Start Date */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Start Date <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Select value={formData.startMonth} onValueChange={(value) => setFormData(prev => ({ ...prev, startMonth: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.startMonth && (
                  <p className="text-sm text-red-600">{errors.startMonth}</p>
                )}
              </div>
              <div className="space-y-2">
                <Select value={formData.startYear} onValueChange={(value) => setFormData(prev => ({ ...prev, startYear: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-auto">
                    {YEARS.map((year) => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.startYear && (
                  <p className="text-sm text-red-600">{errors.startYear}</p>
                )}
              </div>
            </div>
          </div>

          {/* End Date */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              End Date (expected end date) <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Select value={formData.endMonth} onValueChange={(value) => setFormData(prev => ({ ...prev, endMonth: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.endMonth && (
                  <p className="text-sm text-red-600">{errors.endMonth}</p>
                )}
              </div>
              <div className="space-y-2">
                <Select value={formData.endYear} onValueChange={(value) => setFormData(prev => ({ ...prev, endYear: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-auto">
                    {YEARS.map((year) => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.endYear && (
                  <p className="text-sm text-red-600">{errors.endYear}</p>
                )}
              </div>
            </div>
            {errors.endDate && (
              <p className="text-sm text-red-600">{errors.endDate}</p>
            )}
          </div>

          {/* GPA */}
          <div className="space-y-2">
            <Label htmlFor="gpa" className="text-sm font-medium text-gray-700">
              GPA (Optional)
            </Label>
            <Input
              id="gpa"
              type="number"
              step="0.01"
              min="0"
              max="4.0"
              value={formData.gpa}
              onChange={(e) => setFormData(prev => ({ ...prev, gpa: e.target.value }))}
              placeholder="e.g., 3.75"
              className={`w-32 ${errors.gpa ? "border-red-500" : ""}`}
            />
            {errors.gpa && (
              <p className="text-sm text-red-600">{errors.gpa}</p>
            )}
            <p className="text-xs text-gray-500">On a 4.0 scale</p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Relevant coursework, achievements, activities, etc."
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">Describe any relevant coursework, achievements, or activities</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
              className="px-6 py-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              {isSaving ? 'Saving...' : (education?.id ? 'Update Education' : 'Add Education')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 