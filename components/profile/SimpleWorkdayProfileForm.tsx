"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, X, Save, AlertCircle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Profile } from "@/lib/api"
import { toast } from "sonner"

interface SimpleWorkdayProfileFormProps {
  profile: Profile
  onSave: (data: Partial<Profile>) => Promise<void>
  onClose?: () => void
}

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
]

const PHONE_DEVICE_TYPES = ["Mobile", "Home", "Work"]
const WORK_LOCATION_PREFERENCES = ["Remote", "On-site", "Hybrid", "No preference"]
const EDUCATION_LEVELS = [
  "High School", "Some College", "Associate Degree", "Bachelor's Degree", 
  "Master's Degree", "Doctoral Degree", "Professional Degree"
]

export function SimpleWorkdayProfileForm({ profile, onSave, onClose }: SimpleWorkdayProfileFormProps) {
  const [formData, setFormData] = useState<Partial<Profile>>(profile)
  const [newCertification, setNewCertification] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // Calculate profile completion percentage
  const getCompletionPercentage = () => {
    const criticalFields = [
      'email', 'first_name', 'last_name', 'address_line_1', 
      'city', 'state', 'postal_code', 'phone'
    ]
    const completed = criticalFields.filter(field => formData[field as keyof Profile]).length
    return Math.round((completed / criticalFields.length) * 100)
  }

  const handleInputChange = (field: keyof Profile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addCertification = () => {
    if (newCertification.trim()) {
      const certifications = [...(formData.certifications || []), newCertification.trim()]
      setFormData(prev => ({ ...prev, certifications }))
      setNewCertification("")
    }
  }

  const removeCertification = (index: number) => {
    const certifications = [...(formData.certifications || [])]
    certifications.splice(index, 1)
    setFormData(prev => ({ ...prev, certifications }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSave(formData)
      toast.success("Profile updated successfully!")
      onClose?.()
    } catch (error: any) {
      console.error('Profile update error:', error)
      
      if (error.message.includes('rate limit')) {
        toast.error("Too many requests. Please wait a moment and try again.")
      } else if (error.message.includes('refresh_token_not_found')) {
        toast.error("Session expired. Please sign in again.")
        window.location.href = '/signin'
      } else {
        toast.error(error.message || "Failed to update profile")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const completionPercentage = getCompletionPercentage()

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Complete Your Workday Profile</h1>
          <p className="text-gray-600">
            Fill out these details once to automatically apply to any Workday job posting
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-600">Profile Completion</div>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            completionPercentage === 100 
              ? "bg-blue-600 text-white" 
              : "bg-gray-200 text-gray-700"
          }`}>
            {completionPercentage}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Critical Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
              Critical Personal Information
            </CardTitle>
            <CardDescription>
              This information is required for all job applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name || ""}
                  onChange={(e) => handleInputChange("first_name", e.target.value)}
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name || ""}
                  onChange={(e) => handleInputChange("last_name", e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone_device_type">Phone Type</Label>
              <Select 
                value={formData.phone_device_type || "Mobile"} 
                onValueChange={(value) => handleInputChange("phone_device_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select phone type" />
                </SelectTrigger>
                <SelectContent>
                  {PHONE_DEVICE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
              Address Information
            </CardTitle>
            <CardDescription>Complete address required for job applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address_line_1">Street Address *</Label>
              <Input
                id="address_line_1"
                value={formData.address_line_1 || ""}
                onChange={(e) => handleInputChange("address_line_1", e.target.value)}
                placeholder="123 Main Street"
                required
              />
            </div>

            <div>
              <Label htmlFor="address_line_2">Apartment/Suite (Optional)</Label>
              <Input
                id="address_line_2"
                value={formData.address_line_2 || ""}
                onChange={(e) => handleInputChange("address_line_2", e.target.value)}
                placeholder="Apt 4B, Suite 100, etc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city || ""}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="San Francisco"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Select 
                  value={formData.state || ""} 
                  onValueChange={(value) => handleInputChange("state", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="postal_code">ZIP Code *</Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code || ""}
                  onChange={(e) => handleInputChange("postal_code", e.target.value)}
                  placeholder="94102"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Information */}
        <Card>
          <CardHeader>
            <CardTitle>Work Authorization & Preferences</CardTitle>
            <CardDescription>Information about your work eligibility and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="work_authorization_status">Work Authorization Status *</Label>
                <Select 
                  value={formData.work_authorization_status || "Yes"} 
                  onValueChange={(value) => handleInputChange("work_authorization_status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select authorization status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Authorized to work in the US</SelectItem>
                    <SelectItem value="No">Not authorized to work in the US</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="visa_sponsorship_required">Visa Sponsorship Required *</Label>
                <Select 
                  value={formData.visa_sponsorship_required || "No"} 
                  onValueChange={(value) => handleInputChange("visa_sponsorship_required", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sponsorship requirement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No">No sponsorship needed</SelectItem>
                    <SelectItem value="Yes">Sponsorship required</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="years_of_experience">Years of Experience</Label>
                <Input
                  id="years_of_experience"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.years_of_experience || ""}
                  onChange={(e) => handleInputChange("years_of_experience", parseInt(e.target.value) || 0)}
                  placeholder="5"
                />
              </div>
              <div>
                <Label htmlFor="preferred_work_location">Work Location Preference</Label>
                <Select 
                  value={formData.preferred_work_location || ""} 
                  onValueChange={(value) => handleInputChange("preferred_work_location", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select work preference" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORK_LOCATION_PREFERENCES.map((pref) => (
                      <SelectItem key={pref} value={pref}>{pref}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="available_start_date">Available Start Date</Label>
                <Input
                  id="available_start_date"
                  type="date"
                  value={formData.available_start_date || ""}
                  onChange={(e) => handleInputChange("available_start_date", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="highest_education_level">Highest Education Level</Label>
                <Select 
                  value={formData.highest_education_level || ""} 
                  onValueChange={(value) => handleInputChange("highest_education_level", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EDUCATION_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="willing_to_relocate"
                checked={formData.willing_to_relocate || false}
                onCheckedChange={(checked) => handleInputChange("willing_to_relocate", checked)}
              />
              <Label htmlFor="willing_to_relocate">Willing to relocate for the right opportunity</Label>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>Optional fields that can enhance your application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
                <Input
                  id="linkedin_url"
                  type="url"
                  value={formData.linkedin_url || ""}
                  onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <div>
                <Label htmlFor="github_url">GitHub Profile</Label>
                <Input
                  id="github_url"
                  type="url"
                  value={formData.github_url || ""}
                  onChange={(e) => handleInputChange("github_url", e.target.value)}
                  placeholder="https://github.com/yourusername"
                />
              </div>
            </div>

            <div>
              <Label>Professional Certifications</Label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    placeholder="Add a certification"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                  />
                  <Button type="button" onClick={addCertification} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.certifications || []).map((cert, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      {cert}
                      <button
                        type="button"
                        onClick={() => removeCertification(index)}
                        className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Consent & Background</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="references_available"
                    checked={formData.references_available ?? true}
                    onCheckedChange={(checked) => handleInputChange("references_available", checked)}
                  />
                  <Label htmlFor="references_available">References available upon request</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="background_check_consent"
                    checked={formData.background_check_consent ?? true}
                    onCheckedChange={(checked) => handleInputChange("background_check_consent", checked)}
                  />
                  <Label htmlFor="background_check_consent">Consent to background check</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t">
          <div className="flex items-center space-x-2">
            {completionPercentage === 100 ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-500" />
            )}
            <span className="text-sm text-gray-600">
              {completionPercentage === 100 
                ? "Profile is complete and ready for autofill!" 
                : `${8 - Math.floor((completionPercentage / 100) * 8)} required fields remaining`
              }
            </span>
          </div>
          <div className="flex space-x-3">
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
} 