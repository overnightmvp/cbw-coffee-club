import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendEmail } from '@/lib/email'

// Force dynamic rendering - admin API routes should never be static
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Check if email is in admin whitelist
    const { data: adminUser } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()

    if (!adminUser) {
      return NextResponse.json(
        { error: 'This email is not authorized for admin access.' },
        { status: 403 }
      )
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Store code in database with 10-minute expiration
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    const { error: upsertError } = await supabaseAdmin
      .from('admin_verification_codes')
      .upsert({
        email: email.toLowerCase(),
        code,
        expires_at: expiresAt
      })

    if (upsertError) {
      console.error('Error storing verification code:', upsertError)
      return NextResponse.json({ error: 'Failed to generate verification code' }, { status: 500 })
    }

    // Send verification code via email
    const subject = 'Your Admin Verification Code'
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAFAF8;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #E5E5E5;">
            <!-- Header -->
            <tr>
              <td style="padding: 40px 40px 32px; text-align: center; background: linear-gradient(135deg, #3B2A1A 0%, #6B4226 100%);">
                <div style="width: 48px; height: 48px; background-color: #F5C842; border-radius: 12px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: #3B2A1A; font-size: 24px; font-weight: bold;">C</span>
                </div>
                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Admin Verification Code</h1>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 40px;">
                <p style="margin: 0 0 24px; color: #1A1A1A; font-size: 16px; line-height: 1.5;">
                  Your verification code for admin portal access:
                </p>

                <!-- Code Display -->
                <div style="background-color: #FAF5F0; border: 2px solid #F5C842; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                  <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #3B2A1A; font-family: 'Courier New', monospace;">
                    ${code}
                  </div>
                </div>

                <p style="margin: 0 0 16px; color: #666666; font-size: 14px; line-height: 1.5;">
                  This code will expire in <strong>10 minutes</strong>.
                </p>

                <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.5;">
                  If you didn't request this code, please ignore this email.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 24px 40px; background-color: #FAFAF8; border-top: 1px solid #E5E5E5;">
                <p style="margin: 0; color: #999999; font-size: 12px; text-align: center;">
                  The Bean Route — Coffee Cart Marketplace<br>
                  Melbourne, Australia
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `

    await sendEmail(email, subject, html)

    // Also log to console as fallback
    console.log(`[ADMIN AUTH] Verification code for ${email}: ${code}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending code:', error)
    return NextResponse.json({ error: 'Failed to send code' }, { status: 500 })
  }
}
