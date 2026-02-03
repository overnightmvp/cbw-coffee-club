import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { ownerEmail, ownerName, jobTitle, vendor, quote, event } = await request.json()

    if (!ownerEmail || !ownerName || !jobTitle || !vendor || !quote || !event) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Send notification to job owner
    const ownerHtml = `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #F5C842; padding: 24px; text-align: center;">
          <h1 style="margin: 0; color: #1A1A1A; font-size: 24px;">New Quote for Your Event</h1>
        </div>

        <div style="padding: 32px 24px; background-color: #ffffff;">
          <p style="font-size: 16px; color: #1A1A1A; margin-bottom: 24px;">
            Hi ${ownerName},
          </p>
          <p style="font-size: 16px; color: #1A1A1A; margin-bottom: 24px;">
            <strong>${vendor.name}</strong> has submitted a quote for your <strong>${jobTitle}</strong> event.
          </p>

          <div style="background-color: #FAF5F0; border-radius: 8px; padding: 20px; margin-bottom: 24px; text-align: center;">
            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6B4226; margin-bottom: 8px;">Quote</div>
            <div style="font-size: 32px; font-weight: bold; color: #3B2A1A;">$${quote.pricePerHour}/hr</div>
            <div style="font-size: 12px; color: #6B4226; margin-top: 4px;">
              Total estimate: $${quote.pricePerHour * event.duration} for ${event.duration} hour${event.duration > 1 ? 's' : ''}
            </div>
          </div>

          <div style="background-color: #FAFAF8; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #6B4226; margin: 0 0 16px 0;">Vendor Details</h2>
            <table style="width: 100%; font-size: 14px; color: #3B2A1A;">
              <tr><td style="padding: 4px 0;"><strong>Name:</strong></td><td style="padding: 4px 0;">${vendor.name}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Email:</strong></td><td style="padding: 4px 0;"><a href="mailto:${vendor.email}" style="color: #3B2A1A;">${vendor.email}</a></td></tr>
            </table>
          </div>

          ${quote.message ? `
          <div style="background-color: #FAFAF8; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #6B4226; margin: 0 0 12px 0;">Message from Vendor</h2>
            <p style="font-size: 14px; color: #3B2A1A; margin: 0;">${quote.message}</p>
          </div>
          ` : ''}

          <div style="background-color: #FAFAF8; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #6B4226; margin: 0 0 16px 0;">Your Event Details</h2>
            <table style="width: 100%; font-size: 14px; color: #3B2A1A;">
              <tr><td style="padding: 4px 0;"><strong>Event:</strong></td><td style="padding: 4px 0;">${jobTitle}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Type:</strong></td><td style="padding: 4px 0;">${event.type}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Date:</strong></td><td style="padding: 4px 0;">${event.date}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Duration:</strong></td><td style="padding: 4px 0;">${event.duration} hour${event.duration > 1 ? 's' : ''}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Guests:</strong></td><td style="padding: 4px 0;">${event.guests}</td></tr>
            </table>
          </div>

          <p style="font-size: 16px; color: #1A1A1A; margin-bottom: 24px;">
            <strong>Next step:</strong> Reach out to ${vendor.name} at ${vendor.email} to confirm the booking and discuss final details.
          </p>

          <div style="border-top: 1px solid #E5E5E5; padding-top: 20px; margin-top: 32px;">
            <p style="font-size: 12px; color: #6B7280; margin: 0;">
              This quote was submitted through Coffee Cart Marketplace.<br/>
              Questions? Contact us at support@coffeecartsmelbourne.com
            </p>
          </div>
        </div>
      </div>
    `

    await sendEmail(
      ownerEmail,
      `New quote from ${vendor.name} — ${jobTitle}`,
      ownerHtml
    )

    // Send confirmation to vendor
    const vendorHtml = `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #F5C842; padding: 24px; text-align: center;">
          <h1 style="margin: 0; color: #1A1A1A; font-size: 24px;">Quote Submitted Successfully</h1>
        </div>

        <div style="padding: 32px 24px; background-color: #ffffff;">
          <p style="font-size: 16px; color: #1A1A1A; margin-bottom: 24px;">
            Hi ${vendor.name},
          </p>
          <p style="font-size: 16px; color: #1A1A1A; margin-bottom: 24px;">
            Your quote has been sent to <strong>${ownerName}</strong> for their <strong>${jobTitle}</strong> event.
          </p>

          <div style="background-color: #FAF5F0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #6B4226; margin: 0 0 16px 0;">Your Quote</h2>
            <div style="text-align: center; margin-bottom: 16px;">
              <div style="font-size: 28px; font-weight: bold; color: #3B2A1A;">$${quote.pricePerHour}/hr</div>
              <div style="font-size: 12px; color: #6B4226; margin-top: 4px;">
                Total estimate: $${quote.pricePerHour * event.duration}
              </div>
            </div>
            ${quote.message ? `
            <div style="border-top: 1px solid #E8D4B8; padding-top: 12px; margin-top: 12px;">
              <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6B4226; margin: 0 0 8px 0;">Your Message</p>
              <p style="font-size: 14px; color: #3B2A1A; margin: 0;">${quote.message}</p>
            </div>
            ` : ''}
          </div>

          <div style="background-color: #FAFAF8; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #6B4226; margin: 0 0 16px 0;">Event Details</h2>
            <table style="width: 100%; font-size: 14px; color: #3B2A1A;">
              <tr><td style="padding: 4px 0;"><strong>Event:</strong></td><td style="padding: 4px 0;">${jobTitle}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Type:</strong></td><td style="padding: 4px 0;">${event.type}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Date:</strong></td><td style="padding: 4px 0;">${event.date}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Duration:</strong></td><td style="padding: 4px 0;">${event.duration} hour${event.duration > 1 ? 's' : ''}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Guests:</strong></td><td style="padding: 4px 0;">${event.guests}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Location:</strong></td><td style="padding: 4px 0;">${event.location}</td></tr>
            </table>
          </div>

          <div style="background-color: #FAFAF8; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #6B4226; margin: 0 0 16px 0;">Event Owner Contact</h2>
            <table style="width: 100%; font-size: 14px; color: #3B2A1A;">
              <tr><td style="padding: 4px 0;"><strong>Name:</strong></td><td style="padding: 4px 0;">${ownerName}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Email:</strong></td><td style="padding: 4px 0;"><a href="mailto:${ownerEmail}" style="color: #3B2A1A;">${ownerEmail}</a></td></tr>
            </table>
          </div>

          <p style="font-size: 16px; color: #1A1A1A; margin-bottom: 8px;">
            <strong>What happens next?</strong>
          </p>
          <ul style="font-size: 14px; color: #3B2A1A; margin: 0 0 24px 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">The event owner will review your quote</li>
            <li style="margin-bottom: 8px;">If interested, they'll contact you directly at ${vendor.email}</li>
            <li style="margin-bottom: 8px;">You can discuss final details and confirm the booking</li>
          </ul>

          <div style="border-top: 1px solid #E5E5E5; padding-top: 20px; margin-top: 32px;">
            <p style="font-size: 12px; color: #6B7280; margin: 0;">
              Questions about your quote? Reply to this email or contact us at support@coffeecartsmelbourne.com
            </p>
          </div>
        </div>
      </div>
    `

    await sendEmail(
      vendor.email,
      `Quote submitted — ${jobTitle}`,
      vendorHtml
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in quote notification:', error)
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }
}
