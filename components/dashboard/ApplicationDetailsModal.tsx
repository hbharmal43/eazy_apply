"use client"

import { useEffect, useState } from 'react'
import { getApplicationWithCustomFiles } from '@/lib/api'
import type { ApplicationWithCustomFiles } from '@/lib/api'
import { format } from 'date-fns'
import { 
  X,
  Building, 
  MapPin, 
  Calendar, 
  Clock,
  FileText,
  Download,
  ExternalLink,
  Loader2,
  AlertCircle,
  Mail,
  Users,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ColdEmailModal } from './ColdEmailModal'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'

interface ApplicationDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  applicationId: string
}

export function ApplicationDetailsModal({ isOpen, onClose, applicationId }: ApplicationDetailsModalProps) {
  const [application, setApplication] = useState<ApplicationWithCustomFiles | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [coldEmailLoading, setColdEmailLoading] = useState(false)
  const [showColdEmailModal, setShowColdEmailModal] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [snovToken, setSnovToken] = useState<string | null>(null)

  const supabase = createClientComponentClient()

  useEffect(() => {
    if (isOpen && applicationId) {
      loadApplicationDetails()
    }
  }, [isOpen, applicationId])

  const loadApplicationDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getApplicationWithCustomFiles(applicationId)
      setApplication(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load application details')
      console.error('Error loading application details:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setApplication(null)
    setError(null)
    setColdEmailLoading(false)
    onClose()
  }

  const handleColdEmail = async () => {
    if (!application) return
    
    setColdEmailLoading(true)
    try {
      // 1. Get user authentication
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Please log in to use cold email feature')
        return
      }

      // 2. Get user profile data using your existing RPC function
      console.log('🔍 Fetching user profile for:', user.id);
      
      const { data: profileData, error: profileError } = await supabase
        .rpc('get_complete_profile_with_projects', { p_profile_id: user.id });

      if (profileError) {
        console.error('❌ Error calling get_complete_profile RPC:', profileError);
        toast.error('Failed to load profile. Please try again.')
        return
      }

      console.log('🔍 Raw RPC response data:', JSON.stringify(profileData, null, 2));
      
      if (!profileData) {
        toast.error('Please complete your profile before using cold email')
        return
      }

      // The RPC returns the data directly, so use it as-is
      setUserProfile(profileData)

      // 3. Get Snov access token via backend
      try {
        const response = await fetch('/api/snov-proxy?endpoint=/v1/oauth/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'client_credentials',
            // Credentials are now handled server-side
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to authenticate with Snov.io');
        }

        const data = await response.json();
        const token = data.access_token;
        
        if (!token) {
          throw new Error('No access token received from Snov.io');
        }
        
        setSnovToken(token)
        console.log('Snov token obtained successfully via backend')
      } catch (tokenError) {
        console.error('Failed to get Snov token:', tokenError)
        toast.error('Failed to authenticate with Snov.io. Please check your API credentials.')
        return
      }

      // 4. Open the cold email modal
      setShowColdEmailModal(true)
      
    } catch (error) {
      console.error('Cold email error:', error)
      toast.error('Failed to prepare cold email. Please try again.')
    } finally {
      setColdEmailLoading(false)
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return 'bg-blue-100 text-blue-800'
      case 'screening':
        return 'bg-yellow-100 text-yellow-800'
      case 'interview':
        return 'bg-purple-100 text-purple-800'
      case 'offer':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatWorkType = (workType: string) => {
    return workType.charAt(0).toUpperCase() + workType.slice(1)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blur Background */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-[80vw] h-[80vh] max-w-7xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex h-[calc(100%-88px)]">
          {loading ? (
            <div className="flex items-center justify-center w-full">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-gray-600">Loading application details...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center w-full">
              <div className="flex flex-col items-center gap-4 text-center">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Application</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button onClick={loadApplicationDetails} variant="outline">
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          ) : application ? (
            <>
              {/* Left Column - Job Details */}
              <div className="flex-1 p-6 overflow-y-auto border-r">
                <div className="space-y-6">
                  {/* Job Title & Company */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{application.position}</h3>
                    <div className="flex items-center gap-2 text-lg text-gray-600 mb-4">
                      <Building className="h-5 w-5" />
                      <span>{application.company}</span>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{application.location || 'Location not specified'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{formatWorkType(application.work_type)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Applied {format(new Date(application.applied_date), 'MMM d, yyyy')}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(application.status)}`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Source */}
                  {application.source && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Source</h4>
                      <p className="text-gray-600">{application.source}</p>
                    </div>
                  )}

                  {/* Job Description */}
                  {application.job_description && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Job Description</h4>
                      <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                        <p className="text-gray-700 whitespace-pre-wrap">{application.job_description}</p>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {application.notes && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 whitespace-pre-wrap">{application.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Company URL */}
                  {application.company_url && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Company Website</h4>
                      <a 
                        href={application.company_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Visit Company Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Custom Files */}
              <div className="w-96 p-6 bg-gray-50 overflow-y-auto">
                <h4 className="text-xl font-semibold text-gray-900 mb-6">Custom Documents</h4>
                
                <div className="space-y-6">
                  {/* Custom Resume */}
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <h5 className="font-medium text-gray-900">Custom Resume</h5>
                    </div>
                    
                    {application.custom_resume_url ? (
                      <div className="space-y-2">
                        <a
                          href={application.custom_resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          Download Resume
                        </a>
                        {application.custom_resume_created_at && (
                          <p className="text-sm text-gray-500">
                            Generated {format(new Date(application.custom_resume_created_at), 'MMM d, yyyy \'at\' h:mm a')}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Not Used</p>
                    )}
                  </div>

                  {/* Custom Cover Letter */}
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-5 w-5 text-green-600" />
                      <h5 className="font-medium text-gray-900">Custom Cover Letter</h5>
                    </div>
                    
                    {application.custom_cover_letter_url ? (
                      <div className="space-y-2">
                        <a
                          href={application.custom_cover_letter_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          Download Cover Letter
                        </a>
                        {application.custom_cover_letter_created_at && (
                          <p className="text-sm text-gray-500">
                            Generated {format(new Date(application.custom_cover_letter_created_at), 'MMM d, yyyy \'at\' h:mm a')}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Not Used</p>
                    )}
                  </div>

                  {/* Cold Email Action */}
                  <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-blue-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <h5 className="font-medium text-gray-900">Cold Email</h5>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      Find recruiter contacts and send personalized outreach emails
                    </p>
                    
                    <Button
                      onClick={handleColdEmail}
                      disabled={coldEmailLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {coldEmailLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Finding Contacts...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Start Cold Email
                        </>
                      )}
                    </Button>
                    
                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>2-3 contacts</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        <span>AI personalized</span>
                      </div>
                    </div>
                  </div>

                  {/* Application Metadata */}
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h5 className="font-medium text-gray-900 mb-3">Application Info</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Applied Date:</span>
                        <span className="text-gray-900">{format(new Date(application.applied_date), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(application.status)}`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </div>
                      {application.source && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Source:</span>
                          <span className="text-gray-900">{application.source}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Cold Email Modal */}
      {showColdEmailModal && application && userProfile && snovToken && (
        <ColdEmailModal
          isOpen={showColdEmailModal}
          onClose={() => setShowColdEmailModal(false)}
          application={application}
          userProfile={userProfile}
          snovToken={snovToken}
        />
      )}
    </div>
  )
}
