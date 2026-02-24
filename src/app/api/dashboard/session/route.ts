import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/admin'

// Force dynamic rendering - this route uses cookies
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentAdmin()

    if (!session) {
      const response = NextResponse.json({ authenticated: false }, { status: 401 })
      // Proactively clear legacy cookies to force a clean state
      response.cookies.delete('admin_session')
      response.headers.set('Cache-Control', 'no-store, max-age=0')
      return response
    }

    const response = NextResponse.json({
      authenticated: true,
      email: session.email
    })
    response.headers.set('Cache-Control', 'no-store, max-age=0')
    return response
  } catch (error) {
    console.error('Error checking session:', error)
    return NextResponse.json({ error: 'Failed to check session' }, { status: 500 })
  }
}
