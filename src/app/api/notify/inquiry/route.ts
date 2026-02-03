import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { vendorEmail, vendorName, planner, event, estimatedCost } = await request.json()

    if (!vendorEmail || !vendorName || !planner || !event) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const html = `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #F5C842; padding: 24px; text-align: center;">
          <h1 style="margin: 0; color: #1A1A1A; font-size: 24px;">New Inquiry from Coffee Cart Marketplace</h1>
        </div>

        <div style="padding: 32px 24px; background-color: #ffffff;">
          <p style="font-size: 16px; color: #1A1A1A; margin-bottom: 24px;">
            Hi ${vendorName},
          </p>
          <p style="font-size: 16px; color: #1A1A1A; margin-bottom: 24px;">
            You have a new inquiry from a potential client through the Coffee Cart Marketplace.
          </p>

          <div style="background-color: #FAF5F0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #6B4226; margin: 0 0 16px 0;">Contact Details</h2>
            <table style="width: 100%; font-size: 14px; color: #3B2A1A;">
              <tr><td style="padding: 4px 0;"><strong>Name:</strong></td><td style="padding: 4px 0;">${planner.name}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Email:</strong></td><td style="padding: 4px 0;"><a href="mailto:${planner.email}" style="color: #3B2A1A;">${planner.email}</a></td></tr>
              <tr><td style="padding: 4px 0;"><strong>Phone:</strong></td><td style="padding: 4px 0;">${planner.phone}</td></tr>
            </table>
          </div>

          <div style="background-color: #FAFAF8; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #6B4226; margin: 0 0 16px 0;">Event Details</h2>
            <table style="width: 100%; font-size: 14px; color: #3B2A1A;">
              <tr><td style="padding: 4px 0;"><strong>Type:</strong></td><td style="padding: 4px 0;">${event.type}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Date:</strong></td><td style="padding: 4px 0;">${event.date}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Duration:</strong></td><td style="padding: 4px 0;">${event.duration} hour${event.duration > 1 ? 's' : ''}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Guests:</strong></td><td style="padding: 4px 0;">${event.guests}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Location:</strong></td><td style="padding: 4px 0;">${event.location}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Special requests:</strong></td><td style="padding: 4px 0;">${event.specialRequests}</td></tr>
            </table>
          </div>

          <div style="background-color: #F5C842; border-radius: 8px; padding: 20px; margin-bottom: 24px; text-align: center;">
            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #3B2A1A; margin-bottom: 8px;">Estimated Cost</div>
            <div style="font-size: 28px; font-weight: bold; color: #1A1A1A;">$${estimatedCost.toLocaleString('en-AU')}</div>
            <div style="font-size: 12px; color: #3B2A1A; margin-top: 4px;">Based on your average rate</div>
          </div>

          <p style="font-size: 16px; color: #1A1A1A; margin-bottom: 24px;">
            <strong>Next step:</strong> Reply directly to ${planner.email} to discuss availability and confirm pricing.
          </p>

          <div style="border-top: 1px solid #E5E5E5; padding-top: 20px; margin-top: 32px;">
            <p style="font-size: 12px; color: #6B7280; margin: 0;">
              This inquiry was submitted through Coffee Cart Marketplace.<br/>
              Questions? Contact us at support@coffeecartsmelbourne.com
            </p>
          </div>
        </div>
      </div>
    `

    await sendEmail(
      vendorEmail,
      `New inquiry from ${planner.name} — ${event.type}`,
      html
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in inquiry notification:', error)
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }
}
