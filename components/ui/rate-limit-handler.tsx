"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"

interface RateLimitHandlerProps {
  children: React.ReactNode
  onRateLimit?: () => void
}

// Global rate limiting state
let lastApiCall = 0
const MIN_INTERVAL = 1000 // 1 second between API calls

export function RateLimitHandler({ children, onRateLimit }: RateLimitHandlerProps) {
  const [isWaiting, setIsWaiting] = useState(false)

  const checkRateLimit = useCallback(async (): Promise<boolean> => {
    const now = Date.now()
    const timeSinceLastCall = now - lastApiCall

    if (timeSinceLastCall < MIN_INTERVAL) {
      const waitTime = MIN_INTERVAL - timeSinceLastCall
      setIsWaiting(true)
      
      toast.info(`Please wait ${Math.ceil(waitTime / 1000)} seconds...`, {
        duration: waitTime
      })
      
      await new Promise(resolve => setTimeout(resolve, waitTime))
      setIsWaiting(false)
      onRateLimit?.()
      return false
    }

    lastApiCall = now
    return true
  }, [onRateLimit])

  return (
    <div className={isWaiting ? "opacity-50 pointer-events-none" : ""}>
      {children}
    </div>
  )
}

/**
 * Hook for handling rate-limited API calls
 */
export function useRateLimit() {
  const [isWaiting, setIsWaiting] = useState(false)

  const executeWithRateLimit = useCallback(async <T,>(
    operation: () => Promise<T>,
    minInterval = 1000
  ): Promise<T> => {
    const now = Date.now()
    const timeSinceLastCall = now - lastApiCall

    if (timeSinceLastCall < minInterval) {
      const waitTime = minInterval - timeSinceLastCall
      setIsWaiting(true)
      
      toast.info(`Rate limited. Waiting ${Math.ceil(waitTime / 1000)} seconds...`)
      
      await new Promise(resolve => setTimeout(resolve, waitTime))
      setIsWaiting(false)
    }

    lastApiCall = Date.now()
    
    try {
      return await operation()
    } catch (error: any) {
      if (error.message.includes('rate limit') || error.status === 429) {
        toast.error("Rate limit exceeded. Please wait a moment and try again.")
        throw new Error("Rate limit exceeded")
      }
      throw error
    }
  }, [])

  return { executeWithRateLimit, isWaiting }
} 