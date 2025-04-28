"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Mail, CheckCircle, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isResending, setIsResending] = useState(false)
  const [email, setEmail] = useState("")
  
  // Extract email from URL params when page loads
  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])
  
  const handleResendEmail = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to resend the verification link.",
        variant: "destructive",
      })
      return
    }
    
    try {
      setIsResending(true)
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })
      
      if (error) throw error
      
      toast({
        title: "Email Sent",
        description: "A new verification link has been sent to your email.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend verification email.",
        variant: "destructive",
      })
    } finally {
      setIsResending(false)
    }
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F0F7FF] p-4">
      <div className="w-full max-w-md space-y-8 bg-white rounded-xl p-8 shadow-md">
        <div className="text-center">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-[#0A66C2]" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-[#0A66C2]">
            Check your email
          </h2>
          <p className="mt-4 text-base text-gray-600">
            We've sent a verification link to <span className="font-medium">{email || "your email address"}</span>. Please click the link to verify your account.
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-start">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="h-6 w-6 text-[#0A66C2]" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Important:</h3>
                <p className="text-sm text-blue-700 mt-1">
                  The verification link will expire in 24 hours. If you don't see the email, please check your spam folder.
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0A66C2] focus:border-[#0A66C2]"
                required
              />
            </div>
            
            <Button
              variant="outline"
              className="w-full border-[#0A66C2] text-[#0A66C2] hover:bg-blue-50"
              onClick={handleResendEmail}
              disabled={isResending || !email}
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resending...
                </>
              ) : (
                "Resend Verification Email"
              )}
            </Button>
            
            <Button
              variant="ghost"
              className="w-full text-gray-600 hover:text-gray-900"
              onClick={() => router.push("/signin")}
            >
              Back to Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading fallback component
function VerifyEmailLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F0F7FF] p-4">
      <div className="w-full max-w-md space-y-8 bg-white rounded-xl p-8 shadow-md flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#0A66C2]" />
        <p className="mt-4 text-gray-600">Loading verification page...</p>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailLoading />}>
      <VerifyEmailContent />
    </Suspense>
  )
} 