"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from '@/lib/supabase'
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { toast } = useToast()

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    // Validation logs
    console.log('Starting sign-up process...')
    console.log('Email:', email)
    console.log('Password length:', password.length)

    // Basic validation
    if (!email || !password) {
      console.log('Validation failed: Missing email or password')
      toast({
        title: "Error",
        description: "Please enter both email and password.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      console.log('Attempting to sign up with Supabase...')
      
      // Check if supabase client is properly initialized
      if (!supabase.auth) {
        console.error('Supabase client not properly initialized')
        throw new Error('Supabase client not properly initialized')
      }

      // Log Supabase URL (make sure to remove this in production)
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })

      console.log('Supabase response:', { data, error })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      if (data?.user) {
        console.log('Sign-up successful:', data.user)
        toast({
          title: "Success!",
          description: "Please check your email to verify your account.",
        })
      } else {
        console.log('No user data returned')
        throw new Error('No user data returned')
      }

    } catch (error: any) {
      console.error('Caught error:', error)
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      console.log('Sign-up process completed')
      setIsLoading(false)
    }
  }

  // Log when component renders
  console.log('SignUpForm rendered')

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={email}
              onChange={(e) => {
                console.log('Email input changed:', e.target.value)
                setEmail(e.target.value)
              }}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="********"
              type="password"
              autoComplete="new-password"
              disabled={isLoading}
              value={password}
              onChange={(e) => {
                console.log('Password input changed')
                setPassword(e.target.value)
              }}
            />
          </div>
          <Button 
            disabled={isLoading}
            onClick={() => console.log('Sign up button clicked')}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign up
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button 
        variant="outline" 
        type="button" 
        disabled={isLoading}
        onClick={() => console.log('Google sign-up clicked')}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
    </div>
  )
} 