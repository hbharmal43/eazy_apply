"use client"

import { useState, useEffect } from 'react'
import { 
  X, 
  Mail, 
  Users, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Edit3,
  ExternalLink,
  Zap,
  MapPin,
  Building,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import type { ApplicationWithCustomFiles } from '@/lib/api'
import { snovFindContacts, resolveContactEmail, type FoundContact, type SnovUsageStats } from '@/lib/snov-api'
import type { EmailDraft, UserProfile } from '@/lib/openrouter-api'
import { buildGmailComposeUrl, openEmailCompose, EMAIL_PROVIDERS, type EmailProvider } from '@/lib/gmail-utils'

interface ColdEmailModalProps {
  isOpen: boolean
  onClose: () => void
  application: ApplicationWithCustomFiles
  userProfile: UserProfile
  snovToken: string
}

interface ColdEmailState {
  step: 'finding-contacts' | 'contact-selection' | 'generating-email' | 'email-preview' | 'sending' | 'completed' | 'error'
  contacts: FoundContact[]
  emailDraft: EmailDraft | null
  usage: SnovUsageStats | null
  error: string | null
  selectedContacts: Set<string>
  editedSubject: string
  editedBody: string
  selectedProvider: EmailProvider
}

export function ColdEmailModal({ 
  isOpen, 
  onClose, 
  application, 
  userProfile, 
  snovToken
}: ColdEmailModalProps) {
  const [state, setState] = useState<ColdEmailState>({
    step: 'finding-contacts',
    contacts: [],
    emailDraft: null,
    usage: null,
    error: null,
    selectedContacts: new Set(),
    editedSubject: '',
    editedBody: '',
    selectedProvider: EMAIL_PROVIDERS[0], // Gmail by default
  })

  // Extract domain from company URL (only for non-job-board URLs)
  const extractDomain = (url?: string, companyName?: string): string | null => {
    // Check if URL is a job board (greenhouse, lever, workday, etc.)
    const jobBoardDomains = [
      'greenhouse.io',
      'lever.co', 
      'workday.com',
      'smartrecruiters.com',
      'jobvite.com',
      'breezy.hr',
      'bamboohr.com',
      'indeed.com',
      'linkedin.com'
    ]
    
    if (url) {
      try {
        const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace('www.', '')
        
        // If it's a job board domain, ignore the URL and let Snov handle domain resolution
        const isJobBoard = jobBoardDomains.some(jobBoard => domain.includes(jobBoard))
        if (isJobBoard) {
          console.log(`🔍 Detected job board URL (${domain}), letting Snov resolve domain from company name`)
          return null // Let Snov handle domain resolution
        } else {
          console.log(`🔍 Using company domain: ${domain}`)
          return domain
        }
      } catch {
        console.log(`🔍 Invalid URL format, letting Snov resolve domain from company name`)
        return null // Let Snov handle domain resolution
      }
    }
    
    // No URL provided, let Snov handle domain resolution from company name
    console.log(`🔍 No URL provided, letting Snov resolve domain from company name: ${companyName}`)
    return null
  }

  // Start cold email process
  useEffect(() => {
    if (isOpen) {
      startColdEmailProcess()
    }
  }, [isOpen])

  const startColdEmailProcess = async () => {
    setState(prev => ({ ...prev, step: 'finding-contacts', error: null }))
    
    try {
      const domain = extractDomain(application.company_url, application.company)
      
      // Only find contacts first - don't generate email yet
      const contactsResult = await snovFindContacts({
        domain,
        company: application.company,
        jobLocation: application.location,
        positions: [], // Remove position filters as requested
        accessToken: snovToken,
      })

      setState(prev => ({
        ...prev,
        step: 'contact-selection',
        contacts: contactsResult.contacts,
        usage: contactsResult.usage,
        selectedContacts: new Set(), // Don't auto-select any contacts
      }))

    } catch (error) {
      console.error('Contact finding failed:', error)
      setState(prev => ({
        ...prev,
        step: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }))
    }
  }

  // Generate email after contact selection
  const generateEmailForSelectedContacts = async () => {
    if (state.selectedContacts.size === 0) return

    setState(prev => ({ ...prev, step: 'generating-email', error: null }))
    
    try {
      // Get the selected contact
      const selectedEmail = Array.from(state.selectedContacts)[0];
      console.log('🔍 Selected contact identifier:', selectedEmail);
      console.log('🔍 Available contacts:', state.contacts.map(c => ({ 
        name: c.fullName, 
        email: c.email, 
        hasSearchUrl: !!c.searchEmailsUrl 
      })));
      
      const selectedContact = state.contacts.find(c => 
        (c.email === selectedEmail) || (c.email === '' && c.fullName === selectedEmail)
      );
      
      console.log('🔍 Found selected contact:', selectedContact);
      console.log('🔍 Selected contact details:', {
        fullName: selectedContact.fullName,
        email: selectedContact.email,
        hasSearchUrl: !!selectedContact.searchEmailsUrl,
        searchEmailsUrl: selectedContact.searchEmailsUrl,
        position: selectedContact.position,
        linkedinUrl: selectedContact.linkedinUrl
      });
      
      if (!selectedContact) {
        throw new Error('Selected contact not found');
      }

      // Resolve email if needed (costs 1 credit)
      let contactWithEmail = selectedContact;
      console.log('🔍 Contact email status:', {
        hasEmail: !!selectedContact.email,
        email: selectedContact.email,
        hasSearchUrl: !!selectedContact.searchEmailsUrl,
        searchUrl: selectedContact.searchEmailsUrl
      });
      
      if (!selectedContact.email && selectedContact.searchEmailsUrl) {
        console.log('🔍 Resolving email for selected contact...');
        contactWithEmail = await resolveContactEmail(selectedContact, snovToken);
        console.log('🔍 Email resolution result:', {
          name: contactWithEmail.fullName,
          email: contactWithEmail.email,
          confidence: contactWithEmail.confidence
        });
      } else if (!selectedContact.email) {
        console.log('⚠️ No email and no search URL - using placeholder');
        contactWithEmail = {
          ...selectedContact,
          email: `contact@${selectedContact.fullName.toLowerCase().replace(/\s+/g, '')}.com`,
          confidence: 0.5
        };
      }

      console.log('🔍 Final contact with email:', contactWithEmail);

      // Update the contact in our state with resolved email
      setState(prev => ({
        ...prev,
        contacts: prev.contacts.map(c => 
          c === selectedContact ? contactWithEmail : c
        ),
        selectedContacts: new Set([contactWithEmail.email])
      }));

      console.log('🔍 Generating email with:', {
        jobTitle: application.position,
        company: application.company,
        user: userProfile?.full_name || 'Unknown User',
        userProfile: userProfile,
        selectedContact: selectedContact
      });
      
      // Debug: Log the actual user profile structure
      console.log('🔍 User profile structure:', {
        keys: Object.keys(userProfile || {}),
        full_name: userProfile?.full_name,
        title: userProfile?.title,
        email: userProfile?.email,
        phone: userProfile?.phone,
        first_name: userProfile?.first_name,
        last_name: userProfile?.last_name
      });

      // Generate email via backend API
      const response = await fetch('/api/cold-email/generate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle: application.position,
          company: application.company,
          companyUrl: application.company_url,
          jobLocation: application.location,
          user: userProfile || {
            full_name: 'Job Applicant',
            title: 'Software Developer',
            email: 'your.email@example.com',
            phone: 'your phone number',
            skills: [],
            projects: []
          },
          selectedContact: selectedContact,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate email');
      }

      const emailDraft = await response.json();

      console.log('🔍 Generated email draft:', {
        subject: emailDraft.subject,
        bodyLength: emailDraft.body.length,
        metadata: emailDraft.metadata
      });

      setState(prev => ({
        ...prev,
        step: 'email-preview',
        emailDraft,
        editedSubject: emailDraft.subject,
        editedBody: emailDraft.body,
      }))

    } catch (error) {
      console.error('Email generation failed:', error)
      setState(prev => ({
        ...prev,
        step: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }))
    }
  }

  const handleContactToggle = (contactIdentifier: string) => {
    setState(prev => {
      // Only allow single contact selection
      const newSelected = new Set<string>()
      if (!prev.selectedContacts.has(contactIdentifier)) {
        newSelected.add(contactIdentifier)
      }
      return { ...prev, selectedContacts: newSelected }
    })
  }

  const handleSendEmail = async () => {
    if (state.selectedContacts.size === 0) {
      alert('Please select at least one contact')
      return
    }

    setState(prev => ({ ...prev, step: 'sending' }))

    try {
      // Get the actual email addresses from selected contacts
      const selectedContactId = Array.from(state.selectedContacts)[0];
      const selectedContact = state.contacts.find(c => 
        (c.email === selectedContactId) || (c.email === '' && c.fullName === selectedContactId)
      );
      
      if (!selectedContact || !selectedContact.email) {
        throw new Error('Selected contact has no email address');
      }

      const selectedContactEmails = [selectedContact.email];
      
      console.log('🔍 Opening Gmail with:', {
        to: selectedContactEmails,
        subject: state.editedSubject,
        body: state.editedBody.substring(0, 100) + '...'
      });

      const gmailUrl = state.selectedProvider.buildUrl({
        to: selectedContactEmails,
        subject: state.editedSubject,
        body: state.editedBody,
      })

      console.log('🔗 Generated Gmail URL:', gmailUrl);

      // Open Gmail compose
      openEmailCompose(gmailUrl)

      // Log the attempt (you can implement this later)
      console.log('Cold email attempt:', {
        application: application.id,
        contacts: selectedContactEmails,
        subject: state.editedSubject,
        usage: state.usage,
      })

      setState(prev => ({ ...prev, step: 'completed' }))

    } catch (error) {
      console.error('Failed to open email compose:', error)
      setState(prev => ({
        ...prev,
        step: 'error',
        error: `Failed to open email composer: ${error instanceof Error ? error.message : 'Unknown error'}`
      }))
    }
  }

  const handleClose = () => {
    setState({
      step: 'finding-contacts',
      contacts: [],
      emailDraft: null,
      usage: null,
      error: null,
      selectedContacts: new Set(),
      editedSubject: '',
      editedBody: '',
      selectedProvider: EMAIL_PROVIDERS[0],
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-3">
            <Mail className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Cold Email</h2>
              <p className="text-sm text-gray-600">
                {application.position} at {application.company}
              </p>
            </div>
          </div>
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
        <div className="flex h-[calc(90vh-88px)]">
          {/* Finding Contacts State */}
          {state.step === 'finding-contacts' && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Finding Contacts
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>Searching for contacts via Snov.io...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Generating Email State */}
          {state.step === 'generating-email' && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Generating Email
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <Edit3 className="h-4 w-4" />
                    <span>Creating personalized email with AI...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {state.step === 'error' && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Error Preparing Cold Email
                </h3>
                <p className="text-gray-600 mb-4">{state.error}</p>
                <div className="space-x-3">
                  <Button onClick={generateEmailForSelectedContacts} variant="outline">
                    Try Again
                  </Button>
                  <Button onClick={handleClose}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Contact Selection State */}
          {state.step === 'contact-selection' && (
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Select Contact
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Choose one contact to send your personalized cold email to:
                </p>
                {state.usage && (
                  <div className="text-sm text-gray-600 space-y-1 mb-4">
                    <div>Total found: {state.usage.totalFound}</div>
                    <div>Location filtered: {state.usage.locationFiltered}</div>
                    <div className="font-medium text-blue-600">
                      Credits used: {state.usage.creditsUsed}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-6">
                {state.contacts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-8 w-8 mx-auto mb-2" />
                    <p>No contacts found</p>
                    <p className="text-xs">Try a different company or check domain</p>
                  </div>
                ) : (
                  state.contacts.map((contact) => {
                    const contactId = contact.email || contact.fullName || 'unknown';
                    return (
                    <div
                      key={contactId}
                      className={`bg-white rounded-lg p-4 border cursor-pointer transition-all ${
                        state.selectedContacts.has(contactId) 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => handleContactToggle(contactId)}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          checked={state.selectedContacts.has(contactId)}
                          onChange={() => handleContactToggle(contactId)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="h-4 w-4 text-gray-400" />
                            <p className="font-medium text-gray-900 truncate">
                              {contact.fullName || 'Unknown'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <Building className="h-4 w-4 text-gray-400" />
                            <p className="text-sm text-gray-600 truncate">
                              {contact.position || 'Unknown Position'}
                            </p>
                          </div>
                          {contact.location && (
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <p className="text-sm text-gray-500 truncate">
                                {contact.location}
                              </p>
                            </div>
                          )}
                          <p className="text-sm text-blue-600 truncate mb-2">
                            {contact.email || '📧 Email will be resolved after selection'}
                          </p>
                          <div className="flex items-center gap-2">
                            {contact.linkedinUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  window.open(contact.linkedinUrl, '_blank')
                                }}
                                className="h-6 text-xs"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                LinkedIn
                              </Button>
                            )}
                            {contact.confidence && (
                              <span className="text-xs text-gray-500">
                                {Math.round(contact.confidence * 100)}% confidence
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                  })
                )}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={generateEmailForSelectedContacts}
                  disabled={state.selectedContacts.size === 0}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Generate Email ({state.selectedContacts.size} selected)
                </Button>
              </div>
            </div>
          )}

          {/* Email Preview State */}
          {state.step === 'email-preview' && (
            <div className="flex-1 flex flex-col">
              {/* Selected Contact Info */}
              <div className="p-6 border-b bg-gradient-to-r from-green-50 to-white">
                {(() => {
                  const selectedContactId = Array.from(state.selectedContacts)[0];
                  const selectedContact = state.contacts.find(c => 
                    (c.email === selectedContactId) || (c.email === '' && c.fullName === selectedContactId)
                  );
                  
                  return selectedContact ? (
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 p-3 rounded-full">
                        <User className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {selectedContact.fullName}
                        </h3>
                        <p className="text-sm text-gray-600">{selectedContact.position}</p>
                        <p className="text-sm text-blue-600">{selectedContact.email || 'Email resolved'}</p>
                        {selectedContact.linkedinUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(selectedContact.linkedinUrl, '_blank')}
                            className="mt-2 h-6 text-xs"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            LinkedIn
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>

              {/* Email Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    📧 Email Preview & Edit
                  </h3>

                  <div className="space-y-4">
                    {/* Email Provider Selection */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Email Provider
                      </Label>
                      <div className="flex gap-2">
                        {EMAIL_PROVIDERS.map((provider) => (
                          <Button
                            key={provider.name}
                            variant={state.selectedProvider.name === provider.name ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setState(prev => ({ ...prev, selectedProvider: provider }))}
                          >
                            {provider.icon} {provider.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Subject Line */}
                    <div>
                      <Label htmlFor="subject" className="text-sm font-medium text-gray-700 mb-2 block">
                        Subject Line ({state.editedSubject.length}/60)
                      </Label>
                      <Input
                        id="subject"
                        value={state.editedSubject}
                        onChange={(e) => setState(prev => ({ ...prev, editedSubject: e.target.value }))}
                        placeholder="Email subject"
                        maxLength={60}
                        className={state.editedSubject.length > 60 ? 'border-red-300' : ''}
                      />
                    </div>

                    {/* Email Body */}
                    <div>
                      <Label htmlFor="body" className="text-sm font-medium text-gray-700 mb-2 block">
                        Email Body ({state.editedBody.length}/1400)
                      </Label>
                      <Textarea
                        id="body"
                        value={state.editedBody}
                        onChange={(e) => setState(prev => ({ ...prev, editedBody: e.target.value }))}
                        placeholder="Email content"
                        rows={12}
                        className={`resize-none ${state.editedBody.length > 1400 ? 'border-red-300' : ''}`}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        {state.selectedContacts.size} contact(s) selected
                      </div>
                      <div className="space-x-3">
                        <Button variant="outline" onClick={handleClose}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleSendEmail}
                          disabled={state.selectedContacts.size === 0}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open in {state.selectedProvider.name}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sending State */}
          {state.step === 'sending' && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Opening Email Composer
                </h3>
                <p className="text-gray-600">
                  Preparing your email in {state.selectedProvider.name}...
                </p>
              </div>
            </div>
          )}

          {/* Completed State */}
          {state.step === 'completed' && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Email Composer Opened
                </h3>
                <p className="text-gray-600 mb-4">
                  Your cold email has been prepared in {state.selectedProvider.name}. 
                  Review and send when ready!
                </p>
                <Button onClick={handleClose}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
