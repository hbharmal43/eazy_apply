import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Create a browser client that handles cookies properly
export const supabase = createClientComponentClient()

// Log initialization
console.log('Supabase client initialized') 