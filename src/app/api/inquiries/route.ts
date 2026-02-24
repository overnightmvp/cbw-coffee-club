import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendEmail } from '@/lib/email'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const InquirySchema = z.object({
  id: z.string(),
  vendor_id: z.string(),
  event_type: z.string().min(1, 'Event type is required'),
  event_date: z.string().min(1, 'Event date is required'),
  event_duration_hours: z.number().min(1),
  guest_count: z.number().min(1),
  location: z.string().min(1, 'Location is required'),
  contact_name: z.string().min(1, 'Name is required'),
  contact_email: z.string().email('Valid email is required'),
  contact_phone: z.string().optional().nullable(),
  special_requests: z.string().optional().nullable(),
  estimated_cost: z.number(),
  // For emails
  vendorEmail: z.string().email().optional().nullable(),
  vendorName: z.string().min(1)
})

import { isRateLimited, getClientIdentifier } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // 0. Rate limiting
    const identifier = getClientIdentifier(request)
    const limited = await isRateLimited({
      identifier,
      action: 'inquiry',
      maxRequests: 5,
      interval: '1 hour'
    })

    if (limited) {
      return NextResponse.json(
        { error: 'Too many inquiry attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const result = InquirySchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: result.error.flatten().fieldErrors
      }, { status: 400 })
    }

    const {
      id, vendor_id, event_type, event_date, event_duration_hours,
      guest_count, location, contact_name, contact_email,
      contact_phone, special_requests, estimated_cost,
      vendorEmail, vendorName
    } = result.data

    // 1. Insert into database using admin rights (public insert is now protected/restricted if we choose, though currently public insert is allowed in DB)
    const { error: insertError } = await supabaseAdmin
      .from('inquiries')
      .insert({
        id,
        vendor_id,
        event_type,
        event_date,
        event_duration_hours,
        guest_count,
        location,
        contact_name,
        contact_email,
        contact_phone,
        special_requests,
        estimated_cost,
        status: 'pending'
      })

    if (insertError) {
      console.error('Error inserting inquiry:', insertError)
      return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 })
    }

    // 2. Send email to Vendor (if provided)
    if (vendorEmail) {
      const vendorHtml = `
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
              <tr><td style="padding: 4px 0;"><strong>Name:</strong></td><td style="padding: 4px 0;">${contact_name}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Email:</strong></td><td style="padding: 4px 0;"><a href="mailto:${contact_email}" style="color: #3B2A1A;">${contact_email}</a></td></tr>
              <tr><td style="padding: 4px 0;"><strong>Phone:</strong></td><td style="padding: 4px 0;">${contact_phone || 'Not provided'}</td></tr>
            </table>
          </div>

          <div style="background-color: #FAFAF8; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #6B4226; margin: 0 0 16px 0;">Event Details</h2>
            <table style="width: 100%; font-size: 14px; color: #3B2A1A;">
              <tr><td style="padding: 4px 0;"><strong>Type:</strong></td><td style="padding: 4px 0;">${event_type}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Date:</strong></td><td style="padding: 4px 0;">${event_date}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Duration:</strong></td><td style="padding: 4px 0;">${event_duration_hours} hour${event_duration_hours > 1 ? 's' : ''}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Guests:</strong></td><td style="padding: 4px 0;">${guest_count}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Location:</strong></td><td style="padding: 4px 0;">${location}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Special requests:</strong></td><td style="padding: 4px 0;">${special_requests || 'None'}</td></tr>
            </table>
          </div>

          <div style="background-color: #F5C842; border-radius: 8px; padding: 20px; margin-bottom: 24px; text-align: center;">
            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #3B2A1A; margin-bottom: 8px;">Estimated Cost</div>
            <div style="font-size: 28px; font-weight: bold; color: #1A1A1A;">$${estimated_cost.toLocaleString('en-AU')}</div>
            <div style="font-size: 12px; color: #3B2A1A; margin-top: 4px;">Based on your average rate</div>
          </div>

          <p style="font-size: 16px; color: #1A1A1A; margin-bottom: 24px;">
            <strong>Next step:</strong> Reply directly to ${contact_email} to discuss availability and confirm pricing.
          </p>

          <div style="border-top: 1px solid #E5E5E5; padding-top: 20px; margin-top: 32px;">
            <p style="font-size: 12px; color: #6B7280; margin: 0;">
              This inquiry was submitted through Coffee Cart Marketplace.<br/>
              Questions? Contact us at thebeanrouteau@gmail.com
            </p>
          </div>
        </div>
      </div>
      `
      try {
        await sendEmail(
          vendorEmail,
          `New inquiry from ${contact_name} — ${event_type}`,
          vendorHtml
        )
      } catch (err) {
        console.error('Failed to send vendor email:', err)
      }
    }

    // 3. Send email to Planner
    const plannerHtml = `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #F5C842; padding: 24px; text-align: center;">
          <h1 style="margin: 0; color: #1A1A1A; font-size: 24px;">Your inquiry has been sent</h1>
        </div>

        <div style="padding: 32px 24px; background-color: #ffffff;">
          <p style="font-size: 16px; color: #1A1A1A; margin-bottom: 24px;">
            Hi ${contact_name},
          </p>
          <p style="font-size: 16px; color: #1A1A1A; margin-bottom: 24px;">
            Thanks for your inquiry! We've forwarded your request to <strong>${vendorName}</strong> and they'll be in touch shortly to discuss availability and finalize pricing.
          </p>

          <div style="background-color: #FAFAF8; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #6B4226; margin: 0 0 16px 0;">Your Event Details</h2>
            <table style="width: 100%; font-size: 14px; color: #3B2A1A;">
              <tr><td style="padding: 4px 0;"><strong>Vendor:</strong></td><td style="padding: 4px 0;">${vendorName}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Event type:</strong></td><td style="padding: 4px 0;">${event_type}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Date:</strong></td><td style="padding: 4px 0;">${event_date}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Duration:</strong></td><td style="padding: 4px 0;">${event_duration_hours} hour${event_duration_hours > 1 ? 's' : ''}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Guests:</strong></td><td style="padding: 4px 0;">${guest_count}</td></tr>
              <tr><td style="padding: 4px 0;"><strong>Location:</strong></td><td style="padding: 4px 0;">${location}</td></tr>
            </table>
          </div>

          <div style="background-color: #FAF5F0; border-radius: 8px; padding: 20px; margin-bottom: 24px; text-align: center;">
            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6B4226; margin-bottom: 8px;">Estimated Cost</div>
            <div style="font-size: 24px; font-weight: bold; color: #3B2A1A;">$${estimated_cost.toLocaleString('en-AU')}</div>
            <div style="font-size: 12px; color: #6B4226; margin-top: 4px;">The vendor will confirm final pricing</div>
          </div>

          <p style="font-size: 16px; color: #1A1A1A; margin-bottom: 8px;">
            <strong>What happens next?</strong>
          </p>
          <ul style="font-size: 14px; color: #3B2A1A; margin: 0 0 24px 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">The vendor will review your details and reach out within 24 hours</li>
            <li style="margin-bottom: 8px;">You'll discuss availability and finalize the quote together</li>
            <li style="margin-bottom: 8px;">Once confirmed, the vendor handles everything on the day</li>
          </ul>

          <div style="border-top: 1px solid #E5E5E5; padding-top: 20px; margin-top: 32px;">
            <p style="font-size: 12px; color: #6B7280; margin: 0;">
              Questions about your inquiry? Reply to this email or contact us at thebeanrouteau@gmail.com
            </p>
          </div>
        </div>
      </div>
    `
    try {
      await sendEmail(
        contact_email,
        `Inquiry confirmed — ${vendorName} will be in touch soon`,
        plannerHtml
      )
    } catch (err) {
      console.error('Failed to send planner email:', err)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in inquiry submission:', error)
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 })
  }
}
