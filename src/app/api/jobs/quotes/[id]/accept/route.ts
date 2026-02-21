import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendEmail } from '@/lib/email'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const quoteId = id

    // Fetch the quote to get job_id and vendor details
    const { data: quote, error: quoteError } = await supabaseAdmin
      .from('quotes')
      .select('job_id, vendor_name, contact_email, price_per_hour, message')
      .eq('id', quoteId)
      .single()

    if (quoteError || !quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    // Fetch the job details for the email
    const { data: job, error: jobError } = await supabaseAdmin
      .from('jobs')
      .select('*')
      .eq('id', quote.job_id)
      .single()

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Update the accepted quote status
    const { error: acceptError } = await supabaseAdmin
      .from('quotes')
      .update({ status: 'accepted' })
      .eq('id', quoteId)

    if (acceptError) {
      console.error('Error accepting quote:', acceptError)
      return NextResponse.json({ error: 'Failed to accept quote' }, { status: 500 })
    }

    // Mark all other quotes for this job as rejected
    const { error: rejectError } = await supabaseAdmin
      .from('quotes')
      .update({ status: 'rejected' })
      .eq('job_id', quote.job_id)
      .neq('id', quoteId)
      .eq('status', 'pending')

    if (rejectError) {
      console.error('Error rejecting other quotes:', rejectError)
      // Don't fail the request if this fails - the main quote was accepted
    }

    // Close the job
    const { error: closeError } = await supabaseAdmin
      .from('jobs')
      .update({ status: 'closed' })
      .eq('id', quote.job_id)

    if (closeError) {
      console.error('Error closing job:', closeError)
      // Don't fail the request if this fails - the quote was accepted
    }

    // Send acceptance email to vendor
    const totalEstimate = quote.price_per_hour * job.duration_hours
    const subject = `Your quote for "${job.event_title}" has been accepted!`
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
                <div style="width: 48px; height: 48px; background-color: #F5C842; border-radius: 12px; margin: 0 auto 16px;">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 28L16 24L17.4 22.6L20 25.2L26.6 18.6L28 20L20 28ZM24 40C21.8 40 19.7167 39.5833 17.75 38.75C15.7833 37.9167 14.075 36.825 12.625 35.475C11.175 34.025 10.0833 32.3167 9.35 30.35C8.51667 28.3833 8.1 26.3 8.1 24.2C8.1 21.1 9.6 18.4 11.6 16.6L24 4L36.4 16.6C38.4 18.4 39.9 21.1 39.9 24.2C39.9 26.3 39.4833 28.3833 38.65 30.35C37.9167 32.3167 36.825 34.025 35.375 35.475C33.925 36.825 32.2167 37.9167 30.25 38.75C28.2833 39.5833 26.2 40 24 40Z" fill="#3B2A1A"/>
                  </svg>
                </div>
                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Quote Accepted!</h1>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 40px;">
                <p style="margin: 0 0 24px; color: #1A1A1A; font-size: 16px; line-height: 1.5;">
                  Congratulations! Your quote for <strong>${job.event_title}</strong> has been accepted by the event organizer.
                </p>

                <!-- Booking Details Card -->
                <div style="background-color: #FAF5F0; border: 2px solid #F5C842; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                  <h2 style="margin: 0 0 16px; color: #3B2A1A; font-size: 18px; font-weight: 600;">Booking Details</h2>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
                    <tr>
                      <td style="padding: 8px 0; color: #666666; font-size: 14px;">Event:</td>
                      <td style="padding: 8px 0; color: #1A1A1A; font-size: 14px; font-weight: 600; text-align: right;">${job.event_title}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #666666; font-size: 14px;">Event Type:</td>
                      <td style="padding: 8px 0; color: #1A1A1A; font-size: 14px; font-weight: 600; text-align: right;">${job.event_type}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #666666; font-size: 14px;">Date:</td>
                      <td style="padding: 8px 0; color: #1A1A1A; font-size: 14px; font-weight: 600; text-align: right;">${job.event_date}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #666666; font-size: 14px;">Duration:</td>
                      <td style="padding: 8px 0; color: #1A1A1A; font-size: 14px; font-weight: 600; text-align: right;">${job.duration_hours} hours</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #666666; font-size: 14px;">Guests:</td>
                      <td style="padding: 8px 0; color: #1A1A1A; font-size: 14px; font-weight: 600; text-align: right;">${job.guest_count}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #666666; font-size: 14px;">Location:</td>
                      <td style="padding: 8px 0; color: #1A1A1A; font-size: 14px; font-weight: 600; text-align: right;">${job.location}</td>
                    </tr>
                    <tr style="border-top: 1px solid #E5E5E5;">
                      <td style="padding: 12px 0 0; color: #666666; font-size: 14px;">Your Rate:</td>
                      <td style="padding: 12px 0 0; color: #3B2A1A; font-size: 16px; font-weight: 700; text-align: right;">$${quote.price_per_hour}/hr</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #666666; font-size: 14px;">Estimated Total:</td>
                      <td style="padding: 8px 0; color: #3B2A1A; font-size: 18px; font-weight: 700; text-align: right;">$${totalEstimate}</td>
                    </tr>
                  </table>

                  ${job.special_requirements ? `
                  <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #E5E5E5;">
                    <p style="margin: 0 0 8px; color: #666666; font-size: 13px; font-weight: 600;">Special Requirements:</p>
                    <p style="margin: 0; color: #1A1A1A; font-size: 14px; line-height: 1.5;">${job.special_requirements}</p>
                  </div>
                  ` : ''}
                </div>

                <!-- Contact Details -->
                <div style="background-color: #F9FAFB; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                  <h3 style="margin: 0 0 12px; color: #3B2A1A; font-size: 16px; font-weight: 600;">Event Organizer Contact</h3>
                  <p style="margin: 0 0 4px; color: #1A1A1A; font-size: 14px; font-weight: 600;">${job.contact_name}</p>
                  <p style="margin: 0 0 4px; color: #666666; font-size: 14px;">${job.contact_email}</p>
                  ${job.contact_phone ? `<p style="margin: 0; color: #666666; font-size: 14px;">${job.contact_phone}</p>` : ''}
                </div>

                <!-- Next Steps -->
                <div style="background-color: #FEF3C7; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                  <h3 style="margin: 0 0 12px; color: #92400E; font-size: 16px; font-weight: 600;">Next Steps</h3>
                  <ol style="margin: 0; padding-left: 20px; color: #1A1A1A; font-size: 14px; line-height: 1.8;">
                    <li>The event organizer will contact you directly to confirm final details</li>
                    <li>Coordinate setup time, equipment needs, and any special requests</li>
                    <li>Confirm payment terms and deposit requirements</li>
                    <li>Mark your calendar for ${job.event_date}</li>
                  </ol>
                </div>

                <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.5;">
                  We recommend reaching out to ${job.contact_name} promptly to finalize the booking details. Good luck with the event!
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

    await sendEmail(quote.contact_email, subject, html)

    return NextResponse.json({
      success: true,
      quote: {
        id: quoteId,
        vendor_name: quote.vendor_name,
        contact_email: quote.contact_email,
        price_per_hour: quote.price_per_hour
      }
    })
  } catch (error) {
    console.error('Unexpected error accepting quote:', error)
    return NextResponse.json({ error: 'Failed to accept quote' }, { status: 500 })
  }
}
