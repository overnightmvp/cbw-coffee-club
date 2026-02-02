import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering - admin API routes should never be static
export const dynamic = 'force-dynamic'

// Simple in-memory store for verification codes (MVP only)
// In production, use Redis or database
declare global {
  var adminCodes: Map<string, { code: string, expires: number }> | undefined
}

if (!global.adminCodes) {
  global.adminCodes = new Map()
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Store code with 10-minute expiration
    global.adminCodes?.set(email.toLowerCase(), {
      code,
      expires: Date.now() + 10 * 60 * 1000
    })

    // For MVP: Log the code (in production, send via email)
    console.log(`[ADMIN AUTH] Verification code for ${email}: ${code}`)

    // TODO: Send email via Resend when E1 is implemented
    // For now, return success (code is logged to console)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending code:', error)
    return NextResponse.json({ error: 'Failed to send code' }, { status: 500 })
  }
}
