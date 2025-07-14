"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Edit2, 
  Download, 
  ExternalLink, 
  MapPin, 
  Calendar,
  Building2,
  Heart,
  Plus,
  Github,
  Linkedin,
  Link2,
  Globe,
  Briefcase,
  GraduationCap,
  Code,
  Languages as LanguagesIcon,
  Award,
  FileText
} from "lucide-react"
import { ResumeUpload } from "./ResumeUpload"

interface ProfileTabProps {
  profileData: any
  onProfileUpdate: () => void
  onEditExperience: (experience: any) => void
  onEditEducation: (education: any) => void
  onEditProject: (project: any) => void
  onManageSkills: () => void
  onEditPortfolioLinks: () => void
  onEditLanguages: () => void
}

export function ProfileTab({ 
  profileData, 
  onProfileUpdate, 
  onEditExperience, 
  onEditEducation, 
  onEditProject,
  onManageSkills,
  onEditPortfolioLinks,
  onEditLanguages
}: ProfileTabProps) {



  const renderWorkExperience = () => (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-teal-600 hover:text-teal-700"
          onClick={() => onEditExperience({})}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {profileData.work_experiences?.length > 0 ? (
        <div className="space-y-6">
          {profileData.work_experiences.map((exp: any, index: number) => (
            <div key={exp.id || index} className="flex gap-4 group">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{exp.position_title}</h4>
                    <p className="text-teal-600 font-medium">{exp.company_name}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>{exp.location}</span>
                      <span>
                        {exp.start_month} {exp.start_year} - {exp.is_current ? 'Present' : `${exp.end_month} ${exp.end_year}`}
                      </span>
                      <span className="capitalize">{exp.experience_type}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEditExperience(exp)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {exp.description && (
                  <p className="text-gray-600 mt-3 leading-relaxed">{exp.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No work experience added yet</p>
          <Button 
            variant="outline" 
            onClick={() => onEditExperience({})}
            className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
          >
            Add Your First Experience
          </Button>
        </div>
      )}
    </Card>
  )

  const renderEducation = () => (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Education</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-teal-600 hover:text-teal-700"
          onClick={() => onEditEducation({})}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>

      {profileData.education?.length > 0 ? (
        <div className="space-y-6">
          {profileData.education.map((edu: any, index: number) => (
            <div key={edu.id || index} className="flex gap-4 group">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{edu.institution_name}</h4>
                    <p className="text-gray-600">{edu.degree_type} in {edu.major}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>{edu.start_year} - {edu.is_current ? 'Present' : edu.end_year}</span>
                      {edu.gpa && <span>GPA: {edu.gpa}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEditEducation(edu)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {edu.description && (
                  <p className="text-gray-600 mt-3 leading-relaxed">{edu.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No education added yet</p>
          <Button 
            variant="outline" 
            onClick={() => onEditEducation({})}
            className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
          >
            Add Your Education
          </Button>
        </div>
      )}
    </Card>
  )

  const renderProjects = () => (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Projects & Outside Experience</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-teal-600 hover:text-teal-700"
          onClick={() => onEditProject({})}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {profileData.projects?.length > 0 ? (
        <div className="space-y-6">
          {profileData.projects.map((project: any, index: number) => (
            <div key={project.id || index} className="flex gap-4 group">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Code className="w-6 h-6 text-green-600" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{project.project_name}</h4>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.technologies.map((tech: string, techIndex: number) => (
                          <span 
                            key={techIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {project.github_url && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {project.demo_url && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEditProject(project)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {project.description && (
                  <p className="text-gray-600 mt-3 leading-relaxed">{project.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No projects added yet</p>
          <Button 
            variant="outline" 
            onClick={() => onEditProject({})}
            className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
          >
            Add Your First Project
          </Button>
        </div>
      )}
    </Card>
  )

  const renderPortfolioLinks = () => (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Portfolio & Links</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-teal-600 hover:text-teal-700"
          onClick={onEditPortfolioLinks}
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {profileData.portfolio_links?.map((link: any) => (
          <div key={link.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
              {link.platform === 'linkedin' && <Linkedin className="w-4 h-4 text-blue-600" />}
              {link.platform === 'github' && <Github className="w-4 h-4 text-gray-800" />}
              {link.platform === 'portfolio' && <Globe className="w-4 h-4 text-purple-600" />}
              {link.platform === 'other' && <Link2 className="w-4 h-4 text-gray-600" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 capitalize">{link.platform}</p>
              <p className="text-sm text-gray-500 truncate">{link.url}</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        ))}

        {(!profileData.portfolio_links || profileData.portfolio_links.length === 0) && (
          <div className="col-span-2 text-center py-8">
            <Link2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No links added yet</p>
            <Button 
              variant="outline" 
              onClick={onEditPortfolioLinks}
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
            >
              Add Portfolio Links
            </Button>
          </div>
        )}
      </div>
    </Card>
  )

  const renderSkills = () => (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-teal-600 hover:text-teal-700"
          onClick={onManageSkills}
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      {profileData.skills?.length > 0 ? (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Skills that you'd prefer to utilize in roles are highlighted with a heart ❤️
          </p>
          <div className="flex flex-wrap gap-2">
            {profileData.skills.map((skill: any, index: number) => (
              <div 
                key={skill.id || index}
                className={`px-3 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
                  skill.is_preferred
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {skill.is_preferred && <Heart className="w-3 h-3 fill-current" />}
                {skill.skill_name}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No skills added yet</p>
          <Button variant="outline" onClick={onManageSkills}>
            Add Your Skills
          </Button>
        </div>
      )}
    </Card>
  )

  const renderLanguages = () => (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Languages</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-teal-600 hover:text-teal-700"
          onClick={onEditLanguages}
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      {profileData.languages?.length > 0 ? (
        <div className="space-y-3">
          {profileData.languages.map((lang: any, index: number) => (
            <div key={lang.id || index} className="flex justify-between items-center">
              <span className="font-medium text-gray-900">{lang.language_name}</span>
              <span className="text-sm text-gray-500 capitalize">{lang.proficiency_level}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <LanguagesIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No languages added yet</p>
          <Button 
            variant="outline" 
            onClick={onEditLanguages}
            className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
          >
            Add Languages
          </Button>
        </div>
      )}
    </Card>
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ResumeUpload profileData={profileData} onProfileUpdate={onProfileUpdate} />
      {renderWorkExperience()}
      {renderEducation()}
      {renderProjects()}
      {renderPortfolioLinks()}
      {renderSkills()}
      {renderLanguages()}
    </div>
  )
}