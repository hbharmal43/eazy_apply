import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { User } from "@supabase/auth-helpers-nextjs"

const supabase = createClientComponentClient()

// Cache for user data to prevent excessive API calls
let userCache: { user: User | null; timestamp: number } | null = null
const CACHE_DURATION = 30000 // 30 seconds

// Rate limiting
let lastApiCall = 0
const MIN_API_INTERVAL = 1000 // 1 second between calls

/**
 * Get authenticated user with caching and rate limiting protection
 */
export async function getAuthenticatedUser(): Promise<User | null> {
  const now = Date.now()
  
  // Check cache first
  if (userCache && (now - userCache.timestamp) < CACHE_DURATION) {
    return userCache.user
  }
  
  // Rate limiting check
  if (now - lastApiCall < MIN_API_INTERVAL) {
    // Return cached user if available, or wait
    if (userCache) {
      return userCache.user
    }
    // Wait to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, MIN_API_INTERVAL - (now - lastApiCall)))
  }
  
  try {
    lastApiCall = Date.now()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      // Handle specific auth errors
      if (error.message.includes('rate limit') || error.message.includes('Rate limit')) {
        console.warn('Rate limit reached, using cached user if available')
        return userCache?.user || null
      }
      
      if (error.message.includes('refresh_token_not_found')) {
        // Clear cache and return null for invalid tokens
        userCache = null
        return null
      }
      
      throw error
    }
    
    // Update cache
    userCache = { user, timestamp: Date.now() }
    return user
    
  } catch (error: any) {
    console.error('Auth error:', error.message)
    
    // Return cached user if available during errors
    if (userCache) {
      return userCache.user
    }
    
    return null
  }
}

/**
 * Clear the user cache (useful after sign out)
 */
export function clearUserCache() {
  userCache = null
}

/**
 * Retry wrapper for Supabase operations with exponential backoff
 */
export async function retrySupabaseOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      lastError = error
      
      // Don't retry for certain errors
      if (
        error.message.includes('Not authenticated') ||
        error.message.includes('refresh_token_not_found') ||
        error.status === 401
      ) {
        throw error
      }
      
      // Check if it's a rate limit error
      if (error.message.includes('rate limit') || error.status === 429) {
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000
        console.warn(`Rate limit hit, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
      
      // For other errors, wait before retrying
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError!
}

/**
 * Safe auth wrapper that handles rate limiting gracefully
 */
export async function safeAuthOperation<T>(
  operation: (user: User) => Promise<T>
): Promise<T> {
  const user = await getAuthenticatedUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }
  
  return retrySupabaseOperation(() => operation(user))
} 