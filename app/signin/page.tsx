"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Github, Loader2, Mail, Lock, ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

export default function SignInPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('Attempting to sign in...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Sign-in error:', error)
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (data?.user) {
        console.log('Sign-in successful:', data.user)
        toast({
          title: "Success",
          description: "Successfully signed in!",
        })
        router.push("/dashboard")
      }
    } catch (error: any) {
      console.error('Caught error:', error)
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleGithubSignIn = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with GitHub",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - gradient background with logo/branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0A66C2] to-[#0A3163] p-12 flex-col justify-between">
        <div>
          <h1 className="text-white text-3xl font-bold">EazyApply</h1>
          <p className="text-blue-100 mt-2">Streamline your job search</p>
        </div>
        <div className="space-y-6">
          <h2 className="text-white text-4xl font-bold leading-tight">Welcome back to your job search journey</h2>
          <p className="text-blue-100 text-xl">
            Track, apply, and land your dream job with our powerful automation tools.
          </p>
          <div className="flex items-center space-x-2 text-blue-100">
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-white/20 border border-white/50"></div>
              ))}
            </div>
            <p>Join thousands of job seekers</p>
          </div>
        </div>
      </div>

      {/* Right side - sign in form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-gray-600">Sign in to continue your journey</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10 pr-4 py-2 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#0A66C2] rounded-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                  <Link href="/forgot-password" className="text-sm font-medium text-[#0A66C2] hover:text-[#084e96]">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="pl-10 pr-4 py-2 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#0A66C2] rounded-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <Checkbox id="remember-me" />
              <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me for 30 days
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full py-3 bg-[#0A66C2] hover:bg-[#084e96] text-white rounded-lg font-medium flex items-center justify-center group transition-all" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="py-2.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg" 
                onClick={handleGoogleSignIn} 
                disabled={isLoading}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
                  />
                  <path
                    fill="#34A853"
                    d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
                  />
                  <path
                    fill="#4A90E2"
                    d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5818182 23.1818182,9.90909091 L12,9.90909091 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
                  />
                </svg>
                Google
              </Button>
              <Button 
                variant="outline" 
                className="py-2.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg" 
                onClick={handleGithubSignIn} 
                disabled={isLoading}
              >
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </Button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-[#0A66C2] hover:text-[#084e96]">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

