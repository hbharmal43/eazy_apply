"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Edit2, Calendar, MapPin, Mail, Phone, User } from "lucide-react"
import { toast } from "sonner"

interface PersonalInfoTabProps {
  profileData: any
  onProfileUpdate: () => void
}

export function PersonalInfoTab({ profileData, onProfileUpdate }: PersonalInfoTabProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    first_name: profileData?.first_name || '',
    last_name: profileData?.last_name || '',
    email: profileData?.email || '',
    phone: profileData?.phone || '',
    country_phone_code: profileData?.country_phone_code || '+1',
    phone_device_type: profileData?.phone_device_type || 'mobile',
    birthday: profileData?.birthday || '',
    title: profileData?.title || '',
    willing_to_relocate: profileData?.willing_to_relocate ?? false,
    address_line_1: profileData?.address_line_1 || '',
    address_line_2: profileData?.address_line_2 || '',
    city: profileData?.city || '',
    state: profileData?.state || '',
    postal_code: profileData?.postal_code || '',
    country: profileData?.country || 'United States',
    
    // Work Authorization
    work_authorization_us: profileData?.work_authorization_us ?? true,
    work_authorization_canada: profileData?.work_authorization_canada ?? false,
    work_authorization_uk: profileData?.work_authorization_uk ?? false,
    visa_sponsorship_required: profileData?.visa_sponsorship_required ?? false,
    
    // EEO Compliance (Optional)
    ethnicity: profileData?.ethnicity || '',
    gender: profileData?.gender || '',
    lgbtq_status: profileData?.lgbtq_status || '',
    military_veteran: profileData?.military_veteran,
    disability_status: profileData?.disability_status
  })

  const supabase = createClientComponentClient()

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      // Convert empty string birthday to null
      const payload = {
        ...formData,
        birthday: formData.birthday === '' ? null : formData.birthday,
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', profileData.user_id)

      if (error) throw error

      toast.success('Personal information updated successfully')
      setIsEditing(false)
      onProfileUpdate()
    } catch (error) {
      console.error('Error updating personal info:', error)
      toast.error('Failed to update personal information')
    } finally {
      setIsSaving(false)
    }
  }

  const renderPersonalInfoSection = () => (
    <Card className="p-8 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-100 rounded-lg">
            <User className="w-6 h-6 text-teal-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Personal Info</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-teal-600 hover:text-teal-700"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit2 className="w-4 h-4 mr-2" />
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">First Name</Label>
          {isEditing ? (
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              className="mt-1"
            />
          ) : (
            <p className="mt-1 text-gray-900">{formData.first_name || 'Not provided'}</p>
          )}
        </div>

        <div>
          <Label htmlFor="last_name" className="text-sm font-medium text-gray-700">Last Name</Label>
          {isEditing ? (
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              className="mt-1"
            />
          ) : (
            <p className="mt-1 text-gray-900">{formData.last_name || 'Not provided'}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
          {isEditing ? (
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1"
            />
          ) : (
            <p className="mt-1 text-gray-900">{formData.email || 'Not provided'}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
          {isEditing ? (
            <div className="flex gap-2 mt-1">
              <select
                value={formData.country_phone_code}
                onChange={(e) => setFormData({ ...formData, country_phone_code: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+91">+91</option>
              </select>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="flex-1"
                placeholder="(555) 123-4567"
              />
            </div>
          ) : (
            <p className="mt-1 text-gray-900">
              {formData.phone ? `${formData.country_phone_code} ${formData.phone}` : 'Not provided'}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">Job Title</Label>
          {isEditing ? (
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1"
              placeholder="Software Engineer, Marketing Manager, etc."
            />
          ) : (
            <p className="mt-1 text-gray-900">{formData.title || 'Not provided'}</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700">Willing to Relocate?</Label>
          {isEditing ? (
            <div className="flex gap-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="willing_to_relocate"
                  checked={formData.willing_to_relocate === true}
                  onChange={() => setFormData({ ...formData, willing_to_relocate: true })}
                  className="w-4 h-4 text-teal-600 mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="willing_to_relocate"
                  checked={formData.willing_to_relocate === false}
                  onChange={() => setFormData({ ...formData, willing_to_relocate: false })}
                  className="w-4 h-4 text-teal-600 mr-2"
                />
                No
              </label>
            </div>
          ) : (
            <p className="mt-1 text-gray-900">{formData.willing_to_relocate ? 'Yes' : 'No'}</p>
          )}
        </div>

        <div>
          <Label htmlFor="address_line_1" className="text-sm font-medium text-gray-700">Address Line 1</Label>
          {isEditing ? (
            <Input
              id="address_line_1"
              value={formData.address_line_1}
              onChange={(e) => setFormData({ ...formData, address_line_1: e.target.value })}
              className="mt-1"
              placeholder="123 Main St"
            />
          ) : (
            <p className="mt-1 text-gray-900">{formData.address_line_1 || 'Not provided'}</p>
          )}
        </div>

        <div>
          <Label htmlFor="address_line_2" className="text-sm font-medium text-gray-700">Address Line 2</Label>
          {isEditing ? (
            <Input
              id="address_line_2"
              value={formData.address_line_2}
              onChange={(e) => setFormData({ ...formData, address_line_2: e.target.value })}
              className="mt-1"
              placeholder="Apt, Suite, etc. (optional)"
            />
          ) : (
            <p className="mt-1 text-gray-900">{formData.address_line_2 || 'Not provided'}</p>
          )}
        </div>

        <div>
          <Label htmlFor="city" className="text-sm font-medium text-gray-700">City</Label>
          {isEditing ? (
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="mt-1"
              placeholder="City"
            />
          ) : (
            <p className="mt-1 text-gray-900">{formData.city || 'Not provided'}</p>
          )}
        </div>

        <div>
          <Label htmlFor="state" className="text-sm font-medium text-gray-700">State</Label>
          {isEditing ? (
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="mt-1"
              placeholder="State"
            />
          ) : (
            <p className="mt-1 text-gray-900">{formData.state || 'Not provided'}</p>
          )}
        </div>

        <div>
          <Label htmlFor="postal_code" className="text-sm font-medium text-gray-700">Postal Code</Label>
          {isEditing ? (
            <Input
              id="postal_code"
              value={formData.postal_code}
              onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
              className="mt-1"
              placeholder="Postal Code"
            />
          ) : (
            <p className="mt-1 text-gray-900">{formData.postal_code || 'Not provided'}</p>
          )}
        </div>

        <div>
          <Label htmlFor="country" className="text-sm font-medium text-gray-700">Country</Label>
          {isEditing ? (
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="mt-1"
              placeholder="Country"
            />
          ) : (
            <p className="mt-1 text-gray-900">{formData.country || 'Not provided'}</p>
          )}
        </div>

        <div>
          <Label htmlFor="birthday" className="text-sm font-medium text-gray-700">Birthday</Label>
          {isEditing ? (
            <Input
              id="birthday"
              type="date"
              value={formData.birthday}
              onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
              className="mt-1"
            />
          ) : (
            <p className="mt-1 text-gray-900">
              {formData.birthday ? new Date(formData.birthday).toLocaleDateString() : 'Not provided'}
            </p>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-teal-600 hover:bg-teal-700"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      )}
    </Card>
  )

  const renderEmploymentInfoSection = () => (
    <Card className="p-8 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <MapPin className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Employment Information</h3>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">What is your ethnicity?</Label>
          <div className="grid grid-cols-2 gap-3">
            {['American Indian or Alaska Native', 'Asian', 'Black or African American', 'Hispanic or Latino', 'Native Hawaiian or Other Pacific Islander', 'South Asian', 'White', 'Two or More Races'].map((option) => (
              <label key={option} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="ethnicity"
                  value={option.toLowerCase().replace(/\s+/g, '_')}
                  checked={formData.ethnicity === option.toLowerCase().replace(/\s+/g, '_')}
                  onChange={(e) => setFormData({ ...formData, ethnicity: e.target.value })}
                  className="w-4 h-4 text-teal-600"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Are you authorized to work in the US?</Label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="work_auth_us"
                  checked={formData.work_authorization_us === true}
                  onChange={() => setFormData({ ...formData, work_authorization_us: true })}
                  className="w-4 h-4 text-teal-600 mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="work_auth_us"
                  checked={formData.work_authorization_us === false}
                  onChange={() => setFormData({ ...formData, work_authorization_us: false })}
                  className="w-4 h-4 text-teal-600 mr-2"
                />
                No
              </label>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Are you authorized to work in Canada?</Label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="work_auth_canada"
                  checked={formData.work_authorization_canada === true}
                  onChange={() => setFormData({ ...formData, work_authorization_canada: true })}
                  className="w-4 h-4 text-teal-600 mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="work_auth_canada"
                  checked={formData.work_authorization_canada === false}
                  onChange={() => setFormData({ ...formData, work_authorization_canada: false })}
                  className="w-4 h-4 text-teal-600 mr-2"
                />
                No
              </label>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Are you authorized to work in the United Kingdom?</Label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="work_auth_uk"
                  checked={formData.work_authorization_uk === true}
                  onChange={() => setFormData({ ...formData, work_authorization_uk: true })}
                  className="w-4 h-4 text-teal-600 mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="work_auth_uk"
                  checked={formData.work_authorization_uk === false}
                  onChange={() => setFormData({ ...formData, work_authorization_uk: false })}
                  className="w-4 h-4 text-teal-600 mr-2"
                />
                No
              </label>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Will you now or in the future require sponsorship for employment visa status?</Label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="visa_sponsorship"
                  checked={formData.visa_sponsorship_required === true}
                  onChange={() => setFormData({ ...formData, visa_sponsorship_required: true })}
                  className="w-4 h-4 text-teal-600 mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="visa_sponsorship"
                  checked={formData.visa_sponsorship_required === false}
                  onChange={() => setFormData({ ...formData, visa_sponsorship_required: false })}
                  className="w-4 h-4 text-teal-600 mr-2"
                />
                No
              </label>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Do you have a disability?</Label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="disability"
                  checked={formData.disability_status === true}
                  onChange={() => setFormData({ ...formData, disability_status: true })}
                  className="w-4 h-4 text-teal-600 mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="disability"
                  checked={formData.disability_status === false}
                  onChange={() => setFormData({ ...formData, disability_status: false })}
                  className="w-4 h-4 text-teal-600 mr-2"
                />
                No
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="disability"
                  checked={formData.disability_status === null}
                  onChange={() => setFormData({ ...formData, disability_status: null })}
                  className="w-4 h-4 text-teal-600 mr-2"
                />
                Decline to state
              </label>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Do you identify as LGBTQ+?</Label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="lgbtq"
                  value="yes"
                  checked={formData.lgbtq_status === 'yes'}
                  onChange={(e) => setFormData({ ...formData, lgbtq_status: e.target.value })}
                  className="w-4 h-4 text-teal-600 mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="lgbtq"
                  value="no"
                  checked={formData.lgbtq_status === 'no'}
                  onChange={(e) => setFormData({ ...formData, lgbtq_status: e.target.value })}
                  className="w-4 h-4 text-teal-600 mr-2"
                />
                No
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="lgbtq"
                  value="decline"
                  checked={formData.lgbtq_status === 'decline'}
                  onChange={(e) => setFormData({ ...formData, lgbtq_status: e.target.value })}
                  className="w-4 h-4 text-teal-600 mr-2"
                />
                Decline to state
              </label>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">What is your gender?</Label>
            <div className="grid grid-cols-2 gap-2">
              {['Male', 'Female', 'Non-Binary', 'Decline to state'].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value={option.toLowerCase().replace(/\s+/g, '_')}
                    checked={formData.gender === option.toLowerCase().replace(/\s+/g, '_')}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-4 h-4 text-teal-600 mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Are you a veteran?</Label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="veteran"
                  checked={formData.military_veteran === true}
                  onChange={() => setFormData({ ...formData, military_veteran: true })}
                  className="w-4 h-4 text-teal-600 mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="veteran"
                  checked={formData.military_veteran === false}
                  onChange={() => setFormData({ ...formData, military_veteran: false })}
                  className="w-4 h-4 text-teal-600 mr-2"
                />
                No
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="veteran"
                  checked={formData.military_veteran === null}
                  onChange={() => setFormData({ ...formData, military_veteran: null })}
                  className="w-4 h-4 text-teal-600 mr-2"
                />
                Decline to state
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-teal-600 hover:bg-teal-700"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      {renderPersonalInfoSection()}
      {renderEmploymentInfoSection()}
    </div>
  )
}