"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
// Using simple styled divs instead of complex components
import { Plus, X, Save, AlertCircle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Profile } from "@/lib/api"
import { toast } from "sonner"

interface WorkdayProfileFormProps {
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
const WORK_AUTHORIZATION_OPTIONS = ["Yes", "No"]
const VISA_SPONSORSHIP_OPTIONS = ["No", "Yes"]
const GENDER_OPTIONS = ["", "Male", "Female", "Non-binary", "Prefer not to answer"]
const ETHNICITY_OPTIONS = [
  "", "Hispanic or Latino", "White", "Black or African American", 
  "Native American or Alaska Native", "Asian", "Native Hawaiian or Pacific Islander", 
  "Two or more races", "Prefer not to answer"
]
const VETERAN_STATUS_OPTIONS = ["", "Yes", "No", "Prefer not to answer"]
const DISABILITY_STATUS_OPTIONS = [
  "", "Yes, I have a disability", "No, I do not have a disability", "Prefer not to answer"
]

export function WorkdayProfileForm({ profile, onSave, onClose }: WorkdayProfileFormProps) {
  const [formData, setFormData] = useState<Partial<Profile>>(profile)
  const [newCertification, setNewCertification] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeSection, setActiveSection] = useState("personal")
  
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

  const handleDateChange = (dateString: string) => {
    setFormData(prev => ({ ...prev, available_start_date: dateString }))
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
      
      // Handle specific error messages
      if (error.message.includes('rate limit')) {
        toast.error("Too many requests. Please wait a moment and try again.")
      } else if (error.message.includes('refresh_token_not_found')) {
        toast.error("Session expired. Please sign in again.")
        // Redirect to sign in
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

      {/* Section Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: "personal", label: "Personal Info" },
          { id: "address", label: "Address" },
          { id: "work", label: "Work Info" },
          { id: "optional", label: "Optional" },
          { id: "eeo", label: "EEO (Voluntary)" }
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={cn(
              "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors",
              activeSection === section.id
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            {section.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information Section */}
        {activeSection === "personal" && (
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
                  <Label htmlFor="email" className="flex items-center">
                    Email Address <span className="text-red-500 ml-1">*</span>
                  </Label>
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
                  <Label htmlFor="phone">
                    Phone Number <span className="text-red-500 ml-1">*</span>
                  </Label>
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
                  <Label htmlFor="first_name">
                    First Name <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="first_name"
                    value={formData.first_name || ""}
                    onChange={(e) => handleInputChange("first_name", e.target.value)}
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">
                    Last Name <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="last_name"
                    value={formData.last_name || ""}
                    onChange={(e) => handleInputChange("last_name", e.target.value)}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <div>
                  <Label htmlFor="country_phone_code">Country Code</Label>
                  <Input
                    id="country_phone_code"
                    value={formData.country_phone_code || "+1"}
                    onChange={(e) => handleInputChange("country_phone_code", e.target.value)}
                    placeholder="+1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone_extension">Extension (Optional)</Label>
                  <Input
                    id="phone_extension"
                    value={formData.phone_extension || ""}
                    onChange={(e) => handleInputChange("phone_extension", e.target.value)}
                    placeholder="1234"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Address Section */}
        {activeSection === "address" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                Address Information
              </CardTitle>
              <CardDescription>
                Complete address required for job applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address_line_1">
                  Street Address <span className="text-red-500 ml-1">*</span>
                </Label>
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
                  <Label htmlFor="city">
                    City <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="city"
                    value={formData.city || ""}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="San Francisco"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">
                    State <span className="text-red-500 ml-1">*</span>
                  </Label>
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
                  <Label htmlFor="postal_code">
                    ZIP Code <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code || ""}
                    onChange={(e) => handleInputChange("postal_code", e.target.value)}
                    placeholder="94102"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country || "United States of America"}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    placeholder="United States of America"
                  />
                </div>
                <div>
                  <Label htmlFor="county">County (Optional)</Label>
                  <Input
                    id="county"
                    value={formData.county || ""}
                    onChange={(e) => handleInputChange("county", e.target.value)}
                    placeholder="San Francisco County"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Work Information Section */}
        {activeSection === "work" && (
          <Card>
            <CardHeader>
              <CardTitle>Work Authorization & Preferences</CardTitle>
              <CardDescription>
                Information about your work eligibility and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="work_authorization_status">
                    Work Authorization Status <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select 
                    value={formData.work_authorization_status || "Yes"} 
                    onValueChange={(value) => handleInputChange("work_authorization_status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select authorization status" />
                    </SelectTrigger>
                    <SelectContent>
                      {WORK_AUTHORIZATION_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option === "Yes" ? "Authorized to work in the US" : "Not authorized to work in the US"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="visa_sponsorship_required">
                    Visa Sponsorship Required <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select 
                    value={formData.visa_sponsorship_required || "No"} 
                    onValueChange={(value) => handleInputChange("visa_sponsorship_required", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sponsorship requirement" />
                    </SelectTrigger>
                    <SelectContent>
                      {VISA_SPONSORSHIP_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option === "No" ? "No sponsorship needed" : "Sponsorship required"}
                        </SelectItem>
                      ))}
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
                  <Label htmlFor="salary_expectation">Salary Expectation</Label>
                  <Input
                    id="salary_expectation"
                    value={formData.salary_expectation || ""}
                    onChange={(e) => handleInputChange("salary_expectation", e.target.value)}
                    placeholder="$80,000 - $100,000"
                  />
                </div>
                <div>
                  <Label htmlFor="available_start_date">Available Start Date</Label>
                  <Input
                    id="available_start_date"
                    type="date"
                    value={formData.available_start_date || ""}
                    onChange={(e) => handleDateChange(e.target.value)}
                    placeholder="Select date"
                  />
                </div>
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
        )}

        {/* Optional Section */}
        {activeSection === "optional" && (
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>
                Optional fields that can enhance your application
              </CardDescription>
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
                <Label htmlFor="personal_website">Personal Website/Portfolio</Label>
                <Input
                  id="personal_website"
                  type="url"
                  value={formData.personal_website || ""}
                  onChange={(e) => handleInputChange("personal_website", e.target.value)}
                  placeholder="https://yourportfolio.com"
                />
              </div>

              <div>
                <Label htmlFor="how_did_you_hear_about_us">How did you hear about this opportunity?</Label>
                <Input
                  id="how_did_you_hear_about_us"
                  value={formData.how_did_you_hear_about_us || "Website → Workday.com"}
                  onChange={(e) => handleInputChange("how_did_you_hear_about_us", e.target.value)}
                  placeholder="LinkedIn, Company Website, Referral, etc."
                />
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
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {cert}
                        <button
                          type="button"
                          onClick={() => removeCertification(index)}
                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

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
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="drug_test_consent"
                      checked={formData.drug_test_consent ?? true}
                      onCheckedChange={(checked) => handleInputChange("drug_test_consent", checked)}
                    />
                    <Label htmlFor="drug_test_consent">Consent to drug testing if required</Label>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="previously_worked_for_workday"
                  checked={formData.previously_worked_for_workday || false}
                  onCheckedChange={(checked) => handleInputChange("previously_worked_for_workday", checked)}
                />
                <Label htmlFor="previously_worked_for_workday">I have previously worked for a company using Workday</Label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* EEO Section */}
        {activeSection === "eeo" && (
          <Card>
            <CardHeader>
              <CardTitle>Voluntary Self-Identification</CardTitle>
              <CardDescription>
                This information is voluntary and will be used only for EEO compliance reporting. 
                It will not be used in hiring decisions and can be skipped entirely.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    value={formData.gender || ""} 
                    onValueChange={(value) => handleInputChange("gender", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select or skip" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDER_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option || "Prefer not to answer"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ethnicity">Race/Ethnicity</Label>
                  <Select 
                    value={formData.ethnicity || ""} 
                    onValueChange={(value) => handleInputChange("ethnicity", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select or skip" />
                    </SelectTrigger>
                    <SelectContent>
                      {ETHNICITY_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option || "Prefer not to answer"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="military_veteran">Military Veteran Status</Label>
                  <Select 
                    value={formData.military_veteran || ""} 
                    onValueChange={(value) => handleInputChange("military_veteran", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select or skip" />
                    </SelectTrigger>
                    <SelectContent>
                      {VETERAN_STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option || "Prefer not to answer"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="disability_status">Disability Status</Label>
                  <Select 
                    value={formData.disability_status || ""} 
                    onValueChange={(value) => handleInputChange("disability_status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select or skip" />
                    </SelectTrigger>
                    <SelectContent>
                      {DISABILITY_STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option || "Prefer not to answer"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Why do we ask for this information?</h4>
                <p className="text-sm text-blue-800">
                  This information is collected for federal EEO compliance and reporting purposes only. 
                  It is kept separate from your application and is not used in hiring decisions. 
                  Providing this information is completely voluntary.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

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