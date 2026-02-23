import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Force dynamic rendering - this route sets cookies
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ error: 'Missing email or code' }, { status: 400 })
    }

    // Verify code against database
    const { data: stored, error: fetchError } = await supabaseAdmin
      .from('admin_verification_codes')
      .select('code, expires_at')
      .eq('email', email.toLowerCase())
      .single()

    if (fetchError || !stored) {
      return NextResponse.json({ error: 'No code found for this email' }, { status: 401 })
    }

    // Check expiration
    if (new Date(stored.expires_at).getTime() < Date.now()) {
      await supabaseAdmin.from('admin_verification_codes').delete().eq('email', email.toLowerCase())
      return NextResponse.json({ error: 'Code expired' }, { status: 401 })
    }

    // Verify code
    if (stored.code !== code) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 401 })
    }

    // Clear the used code
    await supabaseAdmin.from('admin_verification_codes').delete().eq('email', email.toLowerCase())

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
