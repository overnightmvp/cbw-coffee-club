import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase-admin'

const sendCodeSchema = z.object({
  email: z.string().email(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = sendCodeSchema.parse(body)

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Set expiry (10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    // Check if vendor exists with this email
    const { data: vendor } = await supabaseAdmin
      .from('vendors')
      .select('id')
      .eq('contact_email', email)
      .single()

    // Upsert session
    const { error } = await supabaseAdmin
      .from('vendor_sessions')
      .upsert({
        email,
        code,
        vendor_id: vendor?.id || null,
        expires_at: expiresAt,
        created_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Failed to create session:', error)
      return NextResponse.json(
        { error: 'Failed to send code' },
        { status: 500 }
      )
    }

    // TODO: Send email via Brevo
    // For now, just log to console
    console.log(`[VENDOR OTP] Code for ${email}: ${code}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Send code error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
