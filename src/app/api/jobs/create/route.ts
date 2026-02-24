import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

import { z } from 'zod'

const JobSchema = z.object({
  id: z.string(),
  event_title: z.string().min(2, "Event title is required"),
  event_type: z.string().min(1, "Event type is required"),
  event_date: z.string().min(1, "Event date is required"),
  duration_hours: z.number().min(1, "Duration must be at least 1 hour"),
  guest_count: z.number().min(1, "Guest count must be at least 1"),
  location: z.string().min(1, "Location is required"),
  budget_min: z.number().optional().nullable(),
  budget_max: z.number().min(0, "Budget max is required"),
  special_requirements: z.string().optional().nullable(),
  contact_name: z.string().min(2, "Contact name is required"),
  contact_email: z.string().email("Valid email is required"),
  contact_phone: z.string().optional().nullable(),
})

import { isRateLimited, getClientIdentifier } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // 0. Rate limiting
    const identifier = getClientIdentifier(request)
    const limited = await isRateLimited({
      identifier,
      action: 'job_creation',
      maxRequests: 3,
      interval: '1 hour'
    })

    if (limited) {
      return NextResponse.json(
        { error: 'Too many job posts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()

    // Validate with Zod
    const result = JobSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: result.error.flatten().fieldErrors
      }, { status: 400 })
    }

    const {
      id,
      event_title,
      event_type,
      event_date,
      duration_hours,
      guest_count,
      location,
      budget_min,
      budget_max,
      special_requirements,
      contact_name,
      contact_email,
      contact_phone
    } = result.data

    // Generate management token
    const managementToken = crypto.randomUUID()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://thebeanroute.com.au'
    const managementUrl = `${baseUrl}/jobs/manage/${managementToken}`

    // 1. Insert into database
    const { error: insertError } = await supabaseAdmin
      .from('jobs')
      .insert({
        id,
        event_title,
        event_type,
        event_date,
        duration_hours,
        guest_count,
        location,
        budget_min,
        budget_max,
        special_requirements,
        contact_name,
        contact_email,
        contact_phone,
        management_token: managementToken
      })

    if (insertError) {
      console.error('Error inserting job:', insertError)
      return NextResponse.json({ error: 'Failed to post job' }, { status: 500 })
    }

    // 2. Send confirmation email to Customer
    const customerSubject = `Job Live — ${event_title}`
    const customerHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: sans-serif; line-height: 1.5; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #3B2A1A;">Hi ${contact_name},</h2>
            <p>Your job <strong>"${event_title}"</strong> is now live on <strong>The Bean Route</strong>!</p>
            <p>Melbourne's best coffee carts have been notified. We'll send you an email as soon as quotes start coming in.</p>
            
            <div style="margin: 25px 0; padding: 20px; background: #F5C842; border-radius: 12px; text-align: center;">
              <p style="margin: 0 0 15px 0; font-weight: bold; color: #1A1A1A;">Manage your job and view quotes here:</p>
              <a href="${managementUrl}" style="display: inline-block; padding: 12px 24px; background: #1A1A1A; color: #FFFFFF; text-decoration: none; border-radius: 8px; font-weight: bold;">View Job & Quotes</a>
              <p style="margin: 15px 0 0 0; font-size: 12px; color: #3B2A1A;">No login required. Keep this link private.</p>
            </div>

            <div style="margin: 20px 0; padding: 15px; background: #FAF5F0; border-radius: 8px;">
              <p style="margin: 0;"><strong>Event:</strong> ${event_title}</p>
              <p style="margin: 0;"><strong>Date:</strong> ${event_date}</p>
              <p style="margin: 0;"><strong>Location:</strong> ${location}</p>
            </div>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 14px; color: #666;">
              The Bean Route — Coffee Cart Marketplace<br>
              Melbourne, Australia
            </p>
          </div>
        </body>
      </html>
    `
    await sendEmail(contact_email, customerSubject, customerHtml)

    // 3. Send alert email to Admin
    const adminEmail = 'thebeanrouteau@gmail.com'
    const adminSubject = `NEW JOB POSTED: ${event_title}`
    const adminHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: sans-serif; line-height: 1.5; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #3B2A1A;">New Job Posted</h2>
            <p><strong>Event:</strong> ${event_title}</p>
            <p><strong>Customer:</strong> ${contact_name} (${contact_email})</p>
            <p><strong>Date:</strong> ${event_date}</p>
            <p><strong>Budget:</strong> ${budget_min ? `$${budget_min}-` : ''}$${budget_max}/hr</p>
            <a href="${baseUrl}/dashboard/jobs" style="display: inline-block; padding: 10px 20px; background-color: #F5C842; color: #1A1A1A; text-decoration: none; border-radius: 5px; font-weight: bold;">View in Dashboard</a>
          </div>
        </body>
      </html>
    `
    await sendEmail(adminEmail, adminSubject, adminHtml)

    return NextResponse.json({ success: true, management_token: managementToken })
  } catch (error) {
    console.error('Unexpected error in job creation route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
