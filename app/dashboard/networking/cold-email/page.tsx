"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { generateEmail } from "@/lib/email-templates"
import { Copy } from "lucide-react"
import { toast } from "sonner"

interface EmailFormData {
  // Recipient Info
  recipientName: string
  recipientTitle: string
  companyName: string

  // Sender Info
  senderName: string
  senderTitle: string
  senderBackground: string

  // Purpose & Context
  emailPurpose: string
  foundVia: string
  mutualConnections: string
  
  // Customization
  tone: 'professional' | 'friendly' | 'formal'
  length: 'brief' | 'standard' | 'detailed'
  
  // Additional Context
  companyResearch: string
  specificPoints: string
  callToAction: string
}

export default function ColdEmailGenerator() {
  const [formData, setFormData] = useState<EmailFormData>({
    recipientName: '',
    recipientTitle: '',
    companyName: '',
    senderName: '',
    senderTitle: '',
    senderBackground: '',
    emailPurpose: '',
    foundVia: '',
    mutualConnections: '',
    tone: 'professional',
    length: 'standard',
    companyResearch: '',
    specificPoints: '',
    callToAction: ''
  })

  const [generatedEmail, setGeneratedEmail] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { subject, body } = generateEmail(
        formData,
        formData.emailPurpose,
        formData.tone
      )
      
      setGeneratedEmail(`Subject: ${subject}\n\n${body}`);
    } catch (error) {
      console.error('Error generating email:', error)
      // Add error handling UI here
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Cold Email Generator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle>Email Details</CardTitle>
            <CardDescription>
              Fill in the details to generate a personalized cold email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Recipient Information */}
              <div className="space-y-4">
                <h3 className="font-semibold">Recipient Information</h3>
                <div className="grid gap-2">
                  <Label htmlFor="recipientName">Recipient's Name</Label>
                  <Input
                    id="recipientName"
                    value={formData.recipientName}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      recipientName: e.target.value
                    }))}
                    placeholder="e.g., John Smith"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="recipientTitle">Recipient's Title</Label>
                  <Input
                    id="recipientTitle"
                    value={formData.recipientTitle}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      recipientTitle: e.target.value
                    }))}
                    placeholder="e.g., Engineering Manager"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      companyName: e.target.value
                    }))}
                    placeholder="e.g., Tech Corp"
                  />
                </div>
              </div>

              {/* Email Purpose & Context */}
              <div className="space-y-4">
                <h3 className="font-semibold">Purpose & Context</h3>
                <div className="grid gap-2">
                  <Label htmlFor="emailPurpose">Email Purpose</Label>
                  <Select
                    value={formData.emailPurpose}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      emailPurpose: value
                    }))}
                  >
                    <SelectTrigger className="w-full bg-white dark:bg-gray-950 border-input">
                      <SelectValue placeholder="Choose the purpose of your email" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-950 border-2">
                      <SelectItem value="job-inquiry" className="py-3 px-2 focus:bg-accent cursor-pointer">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">Job Inquiry</span>
                          <span className="text-xs text-muted-foreground">Express interest in job opportunities</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="informational" className="py-3 px-2 focus:bg-accent cursor-pointer">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">Informational Interview</span>
                          <span className="text-xs text-muted-foreground">Request to learn about their role/company</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="networking" className="py-3 px-2 focus:bg-accent cursor-pointer">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">Professional Networking</span>
                          <span className="text-xs text-muted-foreground">Connect for mutual professional growth</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="collaboration" className="py-3 px-2 focus:bg-accent cursor-pointer">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">Project Collaboration</span>
                          <span className="text-xs text-muted-foreground">Propose a business or project partnership</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="mentorship" className="py-3 px-2 focus:bg-accent cursor-pointer">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">Mentorship Request</span>
                          <span className="text-xs text-muted-foreground">Seek guidance and mentorship opportunities</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="introduction" className="py-3 px-2 focus:bg-accent cursor-pointer">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">Mutual Introduction</span>
                          <span className="text-xs text-muted-foreground">Connect through a shared contact</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="other" className="py-3 px-2 focus:bg-accent cursor-pointer">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">Other Purpose</span>
                          <span className="text-xs text-muted-foreground">Custom email purpose</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="foundVia">How did you find them?</Label>
                  <Input
                    id="foundVia"
                    value={formData.foundVia}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      foundVia: e.target.value
                    }))}
                    placeholder="e.g., LinkedIn, Company Website"
                  />
                </div>
              </div>

              {/* Customization */}
              <div className="space-y-4">
                <h3 className="font-semibold">Email Customization</h3>
                <div className="grid gap-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Select
                    value={formData.tone}
                    onValueChange={(value: 'professional' | 'friendly' | 'formal') => 
                      setFormData(prev => ({
                        ...prev,
                        tone: value
                      }))
                    }
                  >
                    <SelectTrigger className="w-full bg-white dark:bg-gray-950 border-input">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-950 border-2">
                      <SelectItem value="professional" className="py-3 px-2 focus:bg-accent cursor-pointer">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">Professional</span>
                          <span className="text-xs text-muted-foreground">Balanced and business-appropriate</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="friendly" className="py-3 px-2 focus:bg-accent cursor-pointer">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">Friendly</span>
                          <span className="text-xs text-muted-foreground">Warm and conversational</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="formal" className="py-3 px-2 focus:bg-accent cursor-pointer">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">Formal</span>
                          <span className="text-xs text-muted-foreground">Traditional and respectful</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="specificPoints">Specific Points to Include</Label>
                  <Textarea
                    id="specificPoints"
                    value={formData.specificPoints}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      specificPoints: e.target.value
                    }))}
                    placeholder="Any specific points you'd like to mention"
                    rows={3}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Generate Email
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Email</CardTitle>
            <CardDescription>
              Preview your generated email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedEmail && (
                <>
                  <div className="min-h-[300px] p-4 border rounded-lg bg-muted font-mono text-sm whitespace-pre-wrap">
                    {generatedEmail}
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedEmail)
                      toast.success("Email copied to clipboard")
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 