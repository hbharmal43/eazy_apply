"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"
import { Briefcase, Linkedin, Github, Globe, Link2 } from "lucide-react"

interface PortfolioLinksModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  profileId: string
  portfolioLinks: any[]
}

interface LinkData {
  linkedinUrl: string
  githubUrl: string
  portfolioUrl: string
  otherUrl: string
}

export function PortfolioLinksModal({ isOpen, onClose, onSave, profileId, portfolioLinks }: PortfolioLinksModalProps) {
  const [formData, setFormData] = useState<LinkData>({
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    otherUrl: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClientComponentClient()

  // Populate form with existing links
  useEffect(() => {
    if (isOpen && portfolioLinks) {
      const linkedin = portfolioLinks.find(link => link.platform === 'linkedin')
      const github = portfolioLinks.find(link => link.platform === 'github')
      const portfolio = portfolioLinks.find(link => link.platform === 'portfolio')
      const other = portfolioLinks.find(link => link.platform === 'other')

      setFormData({
        linkedinUrl: linkedin?.url || "",
        githubUrl: github?.url || "",
        portfolioUrl: portfolio?.url || "",
        otherUrl: other?.url || ""
      })
    } else if (isOpen) {
      // Reset form
      setFormData({
        linkedinUrl: "",
        githubUrl: "",
        portfolioUrl: "",
        otherUrl: ""
      })
    }
    setErrors({})
  }, [isOpen, portfolioLinks])

  const isValidUrl = (url: string): boolean => {
    if (!url.trim()) return true // Empty URLs are allowed
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validate URLs if provided
    if (formData.linkedinUrl && !isValidUrl(formData.linkedinUrl)) {
      newErrors.linkedinUrl = "Please enter a valid URL"
    }
    if (formData.githubUrl && !isValidUrl(formData.githubUrl)) {
      newErrors.githubUrl = "Please enter a valid URL"
    }
    if (formData.portfolioUrl && !isValidUrl(formData.portfolioUrl)) {
      newErrors.portfolioUrl = "Please enter a valid URL"
    }
    if (formData.otherUrl && !isValidUrl(formData.otherUrl)) {
      newErrors.otherUrl = "Please enter a valid URL"
    }

    // Validate LinkedIn URL format if provided
    if (formData.linkedinUrl && !formData.linkedinUrl.includes('linkedin.com')) {
      newErrors.linkedinUrl = "Please enter a valid LinkedIn URL"
    }

    // Validate GitHub URL format if provided
    if (formData.githubUrl && !formData.githubUrl.includes('github.com')) {
      newErrors.githubUrl = "Please enter a valid GitHub URL"
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

      // Prepare links data - only include non-empty URLs
      const linksToSave = []
      
      if (formData.linkedinUrl.trim()) {
        linksToSave.push({
          platform: 'linkedin',
          url: formData.linkedinUrl.trim()
        })
      }
      
      if (formData.githubUrl.trim()) {
        linksToSave.push({
          platform: 'github',
          url: formData.githubUrl.trim()
        })
      }
      
      if (formData.portfolioUrl.trim()) {
        linksToSave.push({
          platform: 'portfolio',
          url: formData.portfolioUrl.trim()
        })
      }
      
      if (formData.otherUrl.trim()) {
        linksToSave.push({
          platform: 'other',
          url: formData.otherUrl.trim()
        })
      }

      // Delete all existing links for this profile
      const deleteResult = await supabase
        .from('portfolio_links')
        .delete()
        .eq('profile_id', profileId)

      if (deleteResult.error) throw deleteResult.error

      // Insert new links if any
      if (linksToSave.length > 0) {
        const linksWithProfile = linksToSave.map(link => ({
          ...link,
          profile_id: profileId
        }))

        const insertResult = await supabase
          .from('portfolio_links')
          .insert(linksWithProfile)

        if (insertResult.error) throw insertResult.error
      }

      toast.success('Portfolio links updated successfully')
      onSave()
      onClose()

    } catch (error: any) {
      console.error('Error saving portfolio links:', error)
      toast.error(error.message || 'Failed to save portfolio links')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSave()
  }

  const addProtocolIfMissing = (url: string): string => {
    if (!url.trim()) return url
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`
    }
    return url
  }

  const handleUrlChange = (field: keyof LinkData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleUrlBlur = (field: keyof LinkData) => {
    const value = formData[field]
    if (value.trim()) {
      const urlWithProtocol = addProtocolIfMissing(value)
      setFormData(prev => ({
        ...prev,
        [field]: urlWithProtocol
      }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
            <Briefcase className="w-5 h-5 text-teal-600" />
            Edit Portfolio
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* LinkedIn URL */}
          <div className="space-y-2">
            <Label htmlFor="linkedinUrl" className="text-sm font-medium text-gray-700">
              LinkedIn URL
            </Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                https://www.linkedin.com/in/
              </span>
              <Input
                id="linkedinUrl"
                value={formData.linkedinUrl.replace('https://www.linkedin.com/in/', '')}
                onChange={(e) => {
                  const username = e.target.value
                  const fullUrl = username ? `https://www.linkedin.com/in/${username}` : ""
                  handleUrlChange('linkedinUrl', fullUrl)
                }}
                placeholder="username"
                className={`rounded-l-none ${errors.linkedinUrl ? "border-red-500" : ""}`}
              />
            </div>
            {errors.linkedinUrl && (
              <p className="text-sm text-red-600">{errors.linkedinUrl}</p>
            )}
          </div>

          {/* GitHub URL */}
          <div className="space-y-2">
            <Label htmlFor="githubUrl" className="text-sm font-medium text-gray-700">
              GitHub URL
            </Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                https://github.com/
              </span>
              <Input
                id="githubUrl"
                value={formData.githubUrl.replace('https://github.com/', '')}
                onChange={(e) => {
                  const username = e.target.value
                  const fullUrl = username ? `https://github.com/${username}` : ""
                  handleUrlChange('githubUrl', fullUrl)
                }}
                placeholder="username"
                className={`rounded-l-none ${errors.githubUrl ? "border-red-500" : ""}`}
              />
            </div>
            {errors.githubUrl && (
              <p className="text-sm text-red-600">{errors.githubUrl}</p>
            )}
          </div>

          {/* Portfolio URL */}
          <div className="space-y-2">
            <Label htmlFor="portfolioUrl" className="text-sm font-medium text-gray-700">
              Portfolio URL
            </Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                https://
              </span>
              <Input
                id="portfolioUrl"
                value={formData.portfolioUrl.replace('https://', '')}
                onChange={(e) => {
                  const domain = e.target.value
                  const fullUrl = domain ? `https://${domain}` : ""
                  handleUrlChange('portfolioUrl', fullUrl)
                }}
                placeholder="..."
                className={`rounded-l-none ${errors.portfolioUrl ? "border-red-500" : ""}`}
              />
            </div>
            {errors.portfolioUrl && (
              <p className="text-sm text-red-600">{errors.portfolioUrl}</p>
            )}
          </div>

          {/* Other URL */}
          <div className="space-y-2">
            <Label htmlFor="otherUrl" className="text-sm font-medium text-gray-700">
              Other URL
            </Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                https://
              </span>
              <Input
                id="otherUrl"
                value={formData.otherUrl.replace('https://', '')}
                onChange={(e) => {
                  const domain = e.target.value
                  const fullUrl = domain ? `https://${domain}` : ""
                  handleUrlChange('otherUrl', fullUrl)
                }}
                placeholder="..."
                className={`rounded-l-none ${errors.otherUrl ? "border-red-500" : ""}`}
              />
            </div>
            {errors.otherUrl && (
              <p className="text-sm text-red-600">{errors.otherUrl}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
              className="px-6 py-2 border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-teal-600 text-white hover:bg-teal-700"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 