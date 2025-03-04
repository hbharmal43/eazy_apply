import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  try {
    // Create a response object
    const res = NextResponse.next()
    
    // Create a Supabase client
    const supabase = createMiddlewareClient({ req, res })
    
    // Get the user's session
    const { data: { session }, error } = await supabase.auth.getSession()

    // Log session status (remove in production)
    console.log('Middleware - Session status:', {
      path: req.nextUrl.pathname,
      hasSession: !!session,
      error: error?.message
    })
    
    // If accessing dashboard without a session, redirect to signin
    if (req.nextUrl.pathname.startsWith('/dashboard') && !session) {
      console.log('Middleware - Redirecting to signin: No session found')
      return NextResponse.redirect(new URL('/signin', req.url))
    }

    // If accessing auth pages with a session, redirect to dashboard
    if ((req.nextUrl.pathname === '/signin' || req.nextUrl.pathname === '/signup') && session) {
      console.log('Middleware - Redirecting to dashboard: Session found')
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    
    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // On error, allow the request to continue
    return NextResponse.next()
  }
}

// Run middleware on auth-related routes
export const config = {
  matcher: ['/dashboard/:path*', '/signin', '/signup', '/auth/callback']
} 