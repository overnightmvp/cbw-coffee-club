import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getVendorSession } from '@/lib/vendor-auth'

const verifyCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, code } = verifyCodeSchema.parse(body)

    // Fetch session from database
    const { data: sessionData, error: sessionError } = await supabaseAdmin
      .from('vendor_sessions')
      .select('*')
      .eq('email', email)
      .single()

    if (sessionError || !sessionData) {
      return NextResponse.json(
        { error: 'Invalid or expired code' },
        { status: 401 }
      )
    }

    // Check if code matches
    if (sessionData.code !== code) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 401 })
    }

    // Check if expired
    if (new Date(sessionData.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Code expired' }, { status: 401 })
    }

    // Set iron-session cookie
    const session = await getVendorSession()
    session.email = email
    session.vendorId = sessionData.vendor_id || ''
    session.expires = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    await session.save()

    // Delete used session
    await supabaseAdmin
      .from('vendor_sessions')
      .delete()
      .eq('email', email)

    // Determine redirect
    const redirect = sessionData.vendor_id
      ? '/vendors/dashboard'
      : '/vendors/claim'

    return NextResponse.json({ success: true, vendor_id: sessionData.vendor_id, redirect })
  } catch (error) {
    console.error('Verify code error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
