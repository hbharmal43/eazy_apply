"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

interface ResumeUploadProps {
  profileData: any
  onProfileUpdate: () => void
}

export function ResumeUpload({ profileData, onProfileUpdate }: ResumeUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [resumeHistory, setResumeHistory] = useState<any[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClientComponentClient()

  const loadResumeHistory = async () => {
    try {
      setLoadingHistory(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // List files in the user's folder
      const { data, error } = await supabase.storage
        .from('resumes')
        .list(user.id, {
          limit: 10,
          sortBy: { column: 'created_at', order: 'desc' }
        })

      if (error) throw error
      setResumeHistory(data || [])
    } catch (error) {
      console.error('Error loading resume history:', error)
      toast.error('Failed to load resume history')
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    await uploadResume(file)
  }

  const uploadResume = async (file: File) => {
    try {
      setIsUploading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Use original filename with user folder organization
      const filePath = `${user.id}/${file.name}`

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true  // Allow overwriting if same filename exists
        })

      if (uploadError) throw uploadError

      // Create a signed URL with long expiration (10 years)
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('resumes')
        .createSignedUrl(filePath, 60 * 60 * 24 * 365 * 10); // 10 years

      if (signedUrlError) throw signedUrlError
      if (!signedUrlData?.signedUrl) throw new Error('Failed to create signed URL')

      // Update profile with new resume info
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          resume_url: signedUrlData.signedUrl,
          resume_filename: file.name
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      toast.success('Resume uploaded successfully!')
      onProfileUpdate()
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      // Refresh history if it's showing
      if (showHistory) {
        loadResumeHistory()
      }

    } catch (error: any) {
      console.error('Error uploading resume:', error)
      toast.error(error.message || 'Failed to upload resume')
    } finally {
      setIsUploading(false)
    }
  }

  const downloadCurrentResume = async () => {
    if (!profileData.resume_url) return

    try {
      // Extract file path from URL
      const url = new URL(profileData.resume_url)
      const pathParts = url.pathname.split('/')
      const filePath = pathParts.slice(-2).join('/') // user_id/filename

      const { data, error } = await supabase.storage
        .from('resumes')
        .download(filePath)

      if (error) throw error

      // Create download link
      const downloadUrl = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = profileData.resume_filename || 'resume.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(downloadUrl)

    } catch (error) {
      console.error('Error downloading resume:', error)
      toast.error('Failed to download resume')
    }
  }

  const deleteResumeFile = async (fileName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const filePath = `${user.id}/${fileName}`

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('resumes')
        .remove([filePath])

      if (storageError) throw storageError

      // If this was the current resume, clear it from profile
      if (profileData.resume_filename === fileName) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            resume_url: null,
            resume_filename: null
          })
          .eq('id', user.id)

        if (profileError) throw profileError
        onProfileUpdate()
      }

      toast.success('Resume deleted successfully')
      loadResumeHistory()

    } catch (error) {
      console.error('Error deleting resume:', error)
      toast.error('Failed to delete resume')
    }
  }

  const setAsCurrentResume = async (fileName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const filePath = `${user.id}/${fileName}`
      
      // Create a signed URL with long expiration (10 years)
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('resumes')
        .createSignedUrl(filePath, 60 * 60 * 24 * 365 * 10); // 10 years

      if (signedUrlError) throw signedUrlError
      if (!signedUrlData?.signedUrl) throw new Error('Failed to create signed URL')

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          resume_url: signedUrlData.signedUrl,
          resume_filename: fileName
        })
        .eq('id', user.id)

      if (error) throw error

      toast.success('Resume set as current')
      onProfileUpdate()

    } catch (error) {
      console.error('Error setting current resume:', error)
      toast.error('Failed to set current resume')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const renderCurrentResume = () => {
    if (!profileData.resume_url) {
      return (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Upload your resume to get started</p>
          <div className="space-y-3">
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Resume
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500">
              Supports PDF, DOC, DOCX (max 5MB)
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="p-2 bg-teal-100 rounded">
            <FileText className="w-6 h-6 text-teal-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">
              {profileData.resume_filename || 'Resume.pdf'}
            </p>
            <p className="text-sm text-gray-500">Current resume</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={downloadCurrentResume}
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowHistory(!showHistory)
              if (!showHistory) loadResumeHistory()
            }}
            className="text-teal-600 hover:text-teal-700"
          >
            <Clock className="w-4 h-4 mr-2" />
            {showHistory ? 'Hide' : 'View'} Resume History
          </Button>
        </div>
      </div>
    )
  }

  const renderResumeHistory = () => {
    if (!showHistory) return null

    return (
      <Card className="p-4 mt-4">
        <h4 className="font-medium text-gray-900 mb-4">Resume History</h4>
        
        {loadingHistory ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : resumeHistory.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No resume history found</p>
        ) : (
          <div className="space-y-3">
            {resumeHistory.map((file) => (
              <div 
                key={file.name} 
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  profileData.resume_filename === file.name ? 'border-teal-200 bg-teal-50' : 'border-gray-200'
                }`}
              >
                <div className="p-2 bg-gray-100 rounded">
                  <FileText className="w-4 h-4 text-gray-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    {profileData.resume_filename === file.name && (
                      <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{formatFileSize(file.metadata?.size || 0)}</span>
                    <span>{formatDistanceToNow(new Date(file.created_at), { addSuffix: true })}</span>
                  </div>
                </div>

                <div className="flex gap-1">
                  {profileData.resume_filename !== file.name && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAsCurrentResume(file.name)}
                      title="Set as current"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteResumeFile(file.name)}
                    title="Delete"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    )
  }

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Resume</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <AlertCircle className="w-4 h-4" />
          <span>PDF, DOC, DOCX (max 5MB)</span>
        </div>
      </div>

      {renderCurrentResume()}
      {renderResumeHistory()}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileSelect}
        className="hidden"
      />
    </Card>
  )
}