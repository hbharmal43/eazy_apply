"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Select from 'react-select/creatable'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"
import { Briefcase, Info, Heart, Code } from "lucide-react"

interface SkillsManagerProps {
  skills: any[]
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  profileId: string
}

interface SkillOption {
  value: string
  label: string
}

interface SelectedSkill {
  skill_name: string
  is_preferred: boolean
  id?: string
}

const COMMON_SKILLS = [
  // Programming Languages
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust", "PHP", "Ruby", 
  "Swift", "Kotlin", "Dart", "Scala", "R", "MATLAB", "SQL", "HTML", "CSS",
  
  // Frontend Frameworks & Libraries
  "React", "Next.js", "Vue.js", "Angular", "Svelte", "React Native", "Flutter", "Tailwind CSS",
  "Bootstrap", "Material-UI", "Styled Components", "SASS", "LESS",
  
  // Backend Frameworks & Libraries
  "Node.js", "Express.js", "Django", "Flask", "FastAPI", "Spring Boot", "ASP.NET", "Laravel",
  "Ruby on Rails", "GraphQL", "REST API",
  
  // Databases
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "Firebase", "SQLite", "MariaDB", "Oracle",
  "Elasticsearch", "DynamoDB",
  
  // Cloud & DevOps
  "AWS", "Azure", "Google Cloud Platform", "Docker", "Kubernetes", "Jenkins", "GitLab CI",
  "GitHub Actions", "Terraform", "Ansible", "Linux", "Ubuntu", "CentOS",
  
  // Tools & Software
  "Git", "GitHub", "GitLab", "Jira", "Confluence", "Slack", "Discord", "Figma", "Adobe Photoshop",
  "Adobe Illustrator", "Sketch", "InVision", "Postman", "VS Code", "IntelliJ IDEA",
  
  // Data & Analytics
  "Excel", "Power BI", "Tableau", "Google Analytics", "Machine Learning", "Data Analysis",
  "Data Science", "Pandas", "NumPy", "TensorFlow", "PyTorch", "Jupyter",
  
  // Methodologies & Concepts
  "Agile", "Scrum", "Kanban", "DevOps", "CI/CD", "Test-Driven Development", "Microservices",
  "API Design", "Database Design", "System Design", "Project Management", "Team Leadership",
  
  // Soft Skills
  "Communication", "Problem Solving", "Critical Thinking", "Teamwork", "Leadership",
  "Time Management", "Adaptability", "Creativity", "Attention to Detail", "Public Speaking"
]

export function SkillsManager({ skills, isOpen, onClose, onSave, profileId }: SkillsManagerProps) {
  const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClientComponentClient()

  // Initialize with existing skills
  useEffect(() => {
    if (isOpen && skills) {
      setSelectedSkills(skills.map(skill => ({
        skill_name: skill.skill_name || skill.name,
        is_preferred: skill.is_preferred || false,
        id: skill.id
      })))
    } else if (isOpen) {
      setSelectedSkills([])
    }
  }, [isOpen, skills])

  // Convert skills to options format
  const skillOptions: SkillOption[] = COMMON_SKILLS.map(skill => ({
    value: skill,
    label: skill
  }))

  const handleSkillSelect = (selectedOption: any) => {
    if (selectedOption && selectedOption.value) {
      const skillName = selectedOption.value
      
      // Check if skill already exists
      if (!selectedSkills.find(skill => skill.skill_name === skillName)) {
        setSelectedSkills(prev => [...prev, {
          skill_name: skillName,
          is_preferred: false
        }])
      }
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSelectedSkills(prev => prev.filter(skill => skill.skill_name !== skillToRemove))
  }

  const togglePreferred = (skillName: string) => {
    setSelectedSkills(prev => prev.map(skill => 
      skill.skill_name === skillName 
        ? { ...skill, is_preferred: !skill.is_preferred }
        : skill
    ))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)

      // Delete all existing skills for this profile
      const deleteResult = await supabase
        .from('profile_skills')
        .delete()
        .eq('profile_id', profileId)

      if (deleteResult.error) throw deleteResult.error

      // Insert new skills if any
      if (selectedSkills.length > 0) {
        const skillsWithProfile = selectedSkills.map(skill => ({
          profile_id: profileId,
          skill_name: skill.skill_name,
          is_preferred: skill.is_preferred,
          proficiency_level: 3 // Default proficiency
        }))

        const insertResult = await supabase
          .from('profile_skills')
          .insert(skillsWithProfile)

        if (insertResult.error) throw insertResult.error
      }

      toast.success('Skills updated successfully')
      onSave()
      onClose()

    } catch (error: any) {
      console.error('Error saving skills:', error)
      toast.error(error.message || 'Failed to save skills')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSave()
  }

  // Custom styles for React Select
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      height: '40px',
      minHeight: '40px',
      border: state.isFocused ? '2px solid hsl(217 91% 60%)' : '1px solid hsl(214.3 31.8% 91.4%)',
      borderRadius: '6px',
      boxShadow: state.isFocused ? '0 0 0 2px hsl(217 91% 60% / 0.2)' : 'none',
      backgroundColor: 'hsl(0 0% 100%)',
      fontSize: '14px',
      cursor: 'pointer',
      '&:hover': {
        borderColor: state.isFocused ? 'hsl(217 91% 60%)' : 'hsl(214.3 31.8% 91.4%)'
      }
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '0 12px',
      height: '38px'
    }),
    input: (provided: any) => ({
      ...provided,
      margin: '0',
      padding: '0',
      color: 'hsl(222.2 84% 4.9%)'
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: 'hsl(215.4 16.3% 46.9%)',
      fontSize: '14px'
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: 'hsl(0 0% 100%)',
      border: '1px solid hsl(214.3 31.8% 91.4%)',
      borderRadius: '6px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999
    }),
    menuList: (provided: any) => ({
      ...provided,
      padding: '4px',
      maxHeight: '300px'
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? 'hsl(217 91% 60%)' : 'transparent',
      color: state.isFocused ? 'white' : 'hsl(222.2 84% 4.9%)',
      padding: '8px 12px',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'hsl(217 91% 60%)',
        color: 'white'
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
            <Briefcase className="w-5 h-5 text-teal-600" />
            Edit Skills
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Info Banner */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-teal-900">Skills that you'd prefer to utilize in roles are highlighted with a heart 💙</p>
              </div>
            </div>
          </div>

          {/* Skill Search */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Search all skills...
            </Label>
            <Select
              options={skillOptions}
              onChange={handleSkillSelect}
              placeholder="Search all skills..."
              isClearable
              isSearchable
              value={null} // Always reset after selection
              styles={customStyles}
              menuPortalTarget={document.body}
              menuPosition="fixed"
            />
          </div>

          {/* Selected Skills */}
          {selectedSkills.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Your Skills
              </Label>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <div
                    key={skill.skill_name}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border ${
                      skill.is_preferred
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => togglePreferred(skill.skill_name)}
                      className={`w-4 h-4 flex items-center justify-center ${
                        skill.is_preferred ? 'text-red-600' : 'text-gray-400 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`w-3 h-3 ${skill.is_preferred ? 'fill-current' : ''}`} />
                    </button>
                    <span>{skill.skill_name}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill.skill_name)}
                      className="text-gray-500 hover:text-gray-700 ml-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {selectedSkills.length === 0 && (
            <div className="text-center py-8">
              <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No skills added yet</p>
              <p className="text-sm text-gray-500">Use the search above to add your skills</p>
            </div>
          )}

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