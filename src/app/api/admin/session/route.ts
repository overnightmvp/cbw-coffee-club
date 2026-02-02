import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Force dynamic rendering - this route uses cookies
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('admin_session')

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    try {
      const session = JSON.parse(sessionCookie.value)

      // Check expiration
      if (session.expires < Date.now()) {
        // Clear expired cookie
        const response = NextResponse.json({ authenticated: false }, { status: 401 })
        response.cookies.set('admin_session', '', { maxAge: 0 })
        return response
      }

      return NextResponse.json({
        authenticated: true,
        email: session.email
      })
    } catch (e) {
      // Invalid cookie format
      const response = NextResponse.json({ authenticated: false }, { status: 401 })
      response.cookies.set('admin_session', '', { maxAge: 0 })
      return response
    }
  } catch (error) {
    console.error('Error checking session:', error)
    return NextResponse.json({ error: 'Failed to check session' }, { status: 500 })
  }
}
