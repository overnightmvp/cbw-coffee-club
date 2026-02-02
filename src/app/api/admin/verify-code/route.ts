import { NextRequest, NextResponse } from 'next/server'

// This should match the Map in send-code route
// In production, use shared Redis/database
declare global {
  var adminCodes: Map<string, { code: string, expires: number }> | undefined
}

if (!global.adminCodes) {
  global.adminCodes = new Map()
}

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ error: 'Missing email or code' }, { status: 400 })
    }

    const stored = global.adminCodes?.get(email.toLowerCase())

    if (!stored) {
      return NextResponse.json({ error: 'No code found for this email' }, { status: 401 })
    }

    // Check expiration
    if (stored.expires < Date.now()) {
      global.adminCodes?.delete(email.toLowerCase())
      return NextResponse.json({ error: 'Code expired' }, { status: 401 })
    }

    // Verify code
    if (stored.code !== code) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 401 })
    }

    // Clear the used code
    global.adminCodes?.delete(email.toLowerCase())

    // Create session cookie
    const session = {
      email,
      expires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    }

    const response = NextResponse.json({ success: true, email })
    response.cookies.set('admin_session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24 hours in seconds
    })

    return response
  } catch (error) {
    console.error('Error verifying code:', error)
    return NextResponse.json({ error: 'Failed to verify code' }, { status: 500 })
  }
}
