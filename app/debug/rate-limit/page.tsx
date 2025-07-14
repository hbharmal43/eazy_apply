"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getProfile, updateProfile } from "@/lib/api"
import { getAuthenticatedUser } from "@/lib/auth-utils"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"

export default function RateLimitDebugPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const supabase = createClientComponentClient()

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }

  const testAuthUser = async () => {
    try {
      setIsLoading(true)
      addLog("Testing getAuthenticatedUser...")
      const user = await getAuthenticatedUser()
      addLog(`✅ Auth user: ${user?.email || 'null'}`)
    } catch (error: any) {
      addLog(`❌ Auth error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testDirectAuth = async () => {
    try {
      setIsLoading(true)
      addLog("Testing direct supabase.auth.getUser()...")
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      addLog(`✅ Direct auth: ${user?.email || 'null'}`)
    } catch (error: any) {
      addLog(`❌ Direct auth error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testGetProfile = async () => {
    try {
      setIsLoading(true)
      addLog("Testing getProfile...")
      const profileData = await getProfile()
      setProfile(profileData)
      addLog(`✅ Profile loaded: ${profileData.full_name || 'No name'}`)
    } catch (error: any) {
      addLog(`❌ Profile error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testUpdateProfile = async () => {
    try {
      setIsLoading(true)
      addLog("Testing updateProfile...")
      await updateProfile({ bio: `Test update ${Date.now()}` })
      addLog("✅ Profile updated successfully")
    } catch (error: any) {
      addLog(`❌ Update error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testRapidCalls = async () => {
    try {
      setIsLoading(true)
      addLog("Testing rapid API calls (5 calls in quick succession)...")
      
      for (let i = 0; i < 5; i++) {
        try {
          addLog(`Call ${i + 1}...`)
          await getProfile()
          addLog(`✅ Call ${i + 1} success`)
        } catch (error: any) {
          addLog(`❌ Call ${i + 1} failed: ${error.message}`)
        }
      }
    } catch (error: any) {
      addLog(`❌ Rapid calls error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const clearLogs = () => {
    setLogs([])
  }

  const checkSession = async () => {
    try {
      setIsLoading(true)
      addLog("Checking session...")
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      addLog(`✅ Session exists: ${!!session}`)
      if (session) {
        addLog(`   User: ${session.user.email}`)
        addLog(`   Expires: ${new Date(session.expires_at! * 1000).toLocaleString()}`)
      }
    } catch (error: any) {
      addLog(`❌ Session error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🔍 Rate Limit Debug Tool</CardTitle>
          <CardDescription>
            Test different API calls to identify rate limiting issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Button 
              onClick={checkSession} 
              disabled={isLoading}
              variant="outline"
            >
              Check Session
            </Button>
            <Button 
              onClick={testDirectAuth} 
              disabled={isLoading}
              variant="outline"
            >
              Test Direct Auth
            </Button>
            <Button 
              onClick={testAuthUser} 
              disabled={isLoading}
              variant="outline"
            >
              Test Auth Utils
            </Button>
            <Button 
              onClick={testGetProfile} 
              disabled={isLoading}
              variant="outline"
            >
              Test Get Profile
            </Button>
            <Button 
              onClick={testUpdateProfile} 
              disabled={isLoading}
              variant="outline"
            >
              Test Update Profile
            </Button>
            <Button 
              onClick={testRapidCalls} 
              disabled={isLoading}
              variant="destructive"
            >
              Test Rapid Calls
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={clearLogs} variant="secondary">
              Clear Logs
            </Button>
            <Button 
              onClick={() => {
                navigator.clipboard.writeText(logs.join('\n'))
                toast.success('Logs copied to clipboard')
              }}
              variant="secondary"
            >
              Copy Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📋 Debug Logs</CardTitle>
          <CardDescription>
            Real-time logs of API calls and responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">Click a test button to start debugging...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {profile && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>👤 Current Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 