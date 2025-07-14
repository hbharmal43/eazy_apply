"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"
import { Briefcase, Info, Calendar, ExternalLink, Github } from "lucide-react"

interface ProjectModalProps {
  project: any
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  profileId: string
}

interface ProjectData {
  projectName: string
  description: string
  technologies: string[]
  githubUrl: string
  demoUrl: string
  startMonth: string
  startYear: string
  endMonth: string
  endYear: string
  isOngoing: boolean
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

// Generate years from 2000 to current year + 2
const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: currentYear - 2000 + 3 }, (_, i) => {
  const year = currentYear + 2 - i
  return { value: year.toString(), label: year.toString() }
})

const COMMON_TECHNOLOGIES = [
  "React", "Next.js", "TypeScript", "JavaScript", "Node.js", "Python", "Java", 
  "C++", "C#", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin", "Flutter", "Dart",
  "Vue.js", "Angular", "Svelte", "Express.js", "FastAPI", "Django", "Flask", "Spring Boot",
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "Firebase", "AWS", "Azure", "GCP",
  "Docker", "Kubernetes", "GraphQL", "REST API", "Git", "Linux", "Figma", "Tailwind CSS"
]

export function ProjectModal({ project, isOpen, onClose, onSave, profileId }: ProjectModalProps) {
  const [formData, setFormData] = useState<ProjectData>({
    projectName: "",
    description: "",
    technologies: [],
    githubUrl: "",
    demoUrl: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    isOngoing: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [techInput, setTechInput] = useState("")
  const [filteredTechs, setFilteredTechs] = useState<string[]>([])
  const supabase = createClientComponentClient()

  // Populate form when editing existing project
  useEffect(() => {
    if (project && isOpen) {
      const startDate = project.start_date ? new Date(project.start_date) : null
      const endDate = project.end_date ? new Date(project.end_date) : null
      
      setFormData({
        projectName: project.project_name || "",
        description: project.description || "",
        technologies: project.technologies || [],
        githubUrl: project.github_url || "",
        demoUrl: project.demo_url || "",
        startMonth: startDate ? String(startDate.getMonth() + 1).padStart(2, '0') : "",
        startYear: startDate ? startDate.getFullYear().toString() : "",
        endMonth: endDate ? String(endDate.getMonth() + 1).padStart(2, '0') : "",
        endYear: endDate ? endDate.getFullYear().toString() : "",
        isOngoing: project.is_ongoing || false
      })
    } else if (isOpen) {
      // Reset form for new project
      setFormData({
        projectName: "",
        description: "",
        technologies: [],
        githubUrl: "",
        demoUrl: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        isOngoing: false
      })
    }
    setErrors({})
    setTechInput("")
    setFilteredTechs([])
  }, [project, isOpen])

  // Filter technologies based on input
  useEffect(() => {
    if (techInput.trim()) {
      const filtered = COMMON_TECHNOLOGIES.filter(tech => 
        tech.toLowerCase().includes(techInput.toLowerCase()) &&
        !formData.technologies.includes(tech)
      )
      setFilteredTechs(filtered.slice(0, 10))
    } else {
      setFilteredTechs([])
    }
  }, [techInput, formData.technologies])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.projectName.trim()) {
      newErrors.projectName = "Project name is required"
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.isOngoing && formData.startYear && !formData.endYear) {
      newErrors.endYear = "End year is required when start year is provided"
    }

    // Validate date logic
    if (formData.startYear && formData.endYear && !formData.isOngoing) {
      const startDate = new Date(parseInt(formData.startYear), parseInt(formData.startMonth || "1") - 1)
      const endDate = new Date(parseInt(formData.endYear), parseInt(formData.endMonth || "12") - 1)
      
      if (endDate <= startDate) {
        newErrors.endDate = "End date must be after start date"
      }
    }

    // Validate URLs if provided
    if (formData.githubUrl && !isValidUrl(formData.githubUrl)) {
      newErrors.githubUrl = "Please enter a valid URL"
    }
    if (formData.demoUrl && !isValidUrl(formData.demoUrl)) {
      newErrors.demoUrl = "Please enter a valid URL"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)

      if (!validateForm()) {
        return
      }

      // Format dates for database
      const startDate = formData.startYear ? 
        `${formData.startYear}-${(formData.startMonth || "01").padStart(2, '0')}-01` : null
      
      const endDate = formData.isOngoing ? null : 
        (formData.endYear ? `${formData.endYear}-${(formData.endMonth || "12").padStart(2, '0')}-01` : null)

      const projectData = {
        profile_id: profileId,
        project_name: formData.projectName.trim(),
        description: formData.description.trim(),
        technologies: formData.technologies,
        github_url: formData.githubUrl.trim() || null,
        demo_url: formData.demoUrl.trim() || null,
        start_date: startDate,
        end_date: endDate,
        is_ongoing: formData.isOngoing
      }

      let result
      if (project?.id) {
        // Update existing project
        result = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', project.id)
      } else {
        // Create new project
        result = await supabase
          .from('projects')
          .insert([projectData])
      }

      if (result.error) throw result.error

      toast.success(project?.id ? 'Project updated successfully' : 'Project added successfully')
      onSave()
      onClose()

    } catch (error: any) {
      console.error('Error saving project:', error)
      toast.error(error.message || 'Failed to save project')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSave()
  }

  const handleOngoingChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isOngoing: checked,
      endMonth: checked ? "" : prev.endMonth,
      endYear: checked ? "" : prev.endYear
    }))
    if (checked) {
      setErrors(prev => ({
        ...prev,
        endMonth: "",
        endYear: "",
        endDate: ""
      }))
    }
  }

  const addTechnology = (tech: string) => {
    if (!formData.technologies.includes(tech)) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, tech]
      }))
    }
    setTechInput("")
  }

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }))
  }

  const handleTechInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
        addTechnology(techInput.trim())
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
            <Briefcase className="w-5 h-5 text-blue-600" />
            {project?.id ? 'Edit Project' : 'Add Project'}
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

          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="projectName" className="text-sm font-medium text-gray-700">
              Project Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="projectName"
              value={formData.projectName}
              onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
              placeholder="My Awesome Project"
              className={errors.projectName ? "border-red-500" : ""}
            />
            {errors.projectName && (
              <p className="text-sm text-red-600">{errors.projectName}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="A couple sentences about your project"
              rows={4}
              className={`resize-none ${errors.description ? "border-red-500" : ""}`}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Technologies */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Technologies Used</Label>
            
            {/* Technology Input */}
            <div className="relative">
              <Input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleTechInputKeyDown}
                placeholder="Type to add technologies (React, TypeScript, etc.)"
                className="w-full"
              />
              
              {/* Technology Suggestions */}
              {filteredTechs.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                  {filteredTechs.map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => addTechnology(tech)}
                      className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 text-sm"
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Technologies */}
            {formData.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="githubUrl" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Github className="w-4 h-4" />
                GitHub URL
              </Label>
              <Input
                id="githubUrl"
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                placeholder="https://github.com/username/repo"
                className={errors.githubUrl ? "border-red-500" : ""}
              />
              {errors.githubUrl && (
                <p className="text-sm text-red-600">{errors.githubUrl}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="demoUrl" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <ExternalLink className="w-4 h-4" />
                Demo URL
              </Label>
              <Input
                id="demoUrl"
                type="url"
                value={formData.demoUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, demoUrl: e.target.value }))}
                placeholder="https://myproject.com"
                className={errors.demoUrl ? "border-red-500" : ""}
              />
              {errors.demoUrl && (
                <p className="text-sm text-red-600">{errors.demoUrl}</p>
              )}
            </div>
          </div>

          {/* Start Date */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Start Date
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

          {/* Ongoing Project Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isOngoing"
              checked={formData.isOngoing}
              onChange={(e) => handleOngoingChange(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <Label htmlFor="isOngoing" className="text-sm font-medium text-gray-700">
              This is an ongoing project
            </Label>
          </div>

          {/* End Date */}
          {!formData.isOngoing && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                End Date
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
          )}

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
              {isSaving ? 'Saving...' : (project?.id ? 'Update Project' : 'Add Project')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 