"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

export default function TestAuthPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setLoading(false)
    }
    getUser()
  }, [])

  const goToDashboard = () => {
    window.location.href = "/dashboard"
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Authentication Test Page</h1>
      
      {user ? (
        <div className="space-y-4">
          <div className="p-4 bg-green-100 rounded-md">
            <p className="text-green-800 font-medium">✅ You are authenticated!</p>
            <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto text-xs">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
          <Button onClick={goToDashboard}>Go to Dashboard</Button>
        </div>
      ) : (
        <div className="p-4 bg-red-100 rounded-md">
          <p className="text-red-800 font-medium">❌ You are not authenticated</p>
          <p className="mt-2">Please sign in to continue.</p>
          <Button className="mt-4" onClick={() => window.location.href = "/signin"}>
            Go to Sign In
          </Button>
        </div>
      )}
    </div>
  )
} 