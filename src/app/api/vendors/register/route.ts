import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

import { z } from 'zod'
import { isRateLimited, getClientIdentifier } from '@/lib/rate-limit'

const RegistrationSchema = z.object({
  id: z.string(),
  vendor_type: z.enum(['mobile_cart', 'coffee_shop', 'barista']).default('mobile_cart'),
  business_name: z.string().min(2, "Business name is too short"),
  specialty: z.string().min(2, "Specialty is required"),
  description: z.string().min(10, "Description is too short"),
  suburbs: z.array(z.string()).min(1, "Select at least one suburb"),
  price_min: z.number().min(0),
  price_max: z.number().min(0),
  capacity_min: z.number().min(0),
  capacity_max: z.number().min(0),
  event_types: z.array(z.string()).min(1, "Select at least one event type"),
  contact_name: z.string().min(2, "Name is required"),
  contact_email: z.string().email("Invalid email address"),
  contact_phone: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  image_url: z.string().url().optional().nullable(),
  physical_address: z.string().optional().nullable(),
})

export async function POST(request: NextRequest) {
  try {
    // 0. Rate limiting
    const identifier = getClientIdentifier(request)
    const limited = await isRateLimited({
      identifier,
      action: 'vendor_registration',
      maxRequests: 3,
      interval: '1 hour'
    })

    if (limited) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()

    // Validate with Zod
    const result = RegistrationSchema.safeParse(body)
    if (!result.success) {
      console.error('Validation failed for vendor registration:', result.error.format())
      return NextResponse.json({
        error: 'Validation failed',
        details: result.error.flatten().fieldErrors
      }, { status: 400 })
    }

    const {
      id,
      vendor_type,
      business_name,
      specialty,
      description,
      suburbs,
      price_min,
      price_max,
      capacity_min,
      capacity_max,
      event_types,
      contact_name,
      contact_email,
      contact_phone,
      website,
      image_url,
      physical_address
    } = result.data

    // 1. Insert into database
    const { error: insertError } = await supabaseAdmin
      .from('vendor_applications')
      .insert({
        id,
        vendor_type,
        business_name,
        specialty,
        description,
        suburbs,
        price_min,
        price_max,
        capacity_min,
        capacity_max,
        event_types,
        contact_name,
        contact_email,
        contact_phone,
        website,
        image_url,
        physical_address
      })

    if (insertError) {
      console.error('Error inserting vendor application:', insertError)
      return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
    }

    // 2. Send confirmation email to Vendor
    const vendorSubject = `Application Received — ${business_name}`
    const vendorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: sans-serif; line-height: 1.5; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #3B2A1A;">Hi ${contact_name},</h2>
            <p>Thanks for applying to join <strong>The Bean Route</strong>! We've received your application for <strong>${business_name}</strong> (${vendor_type.replace('_', ' ')}).</p>
            <p>Our team will review your details and get back to you within 24 hours.</p>
            ${image_url ? `<p><img src="${image_url}" alt="Hero Image Preview" style="max-width: 100%; height: auto; border-radius: 8px; margin-top: 10px;"></p>` : ''}
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 14px; color: #666;">
              The Bean Route — Melbourne's Specialty Coffee Marketplace<br>
              Melbourne, Australia
            </p>
          </div>
        </body>
      </html>
    `
    await sendEmail(contact_email, vendorSubject, vendorHtml)

    // 3. Send alert email to Admin
    const adminEmail = 'thebeanrouteau@gmail.com'
    const adminSubject = `NEW VENDOR APPLICATION: ${business_name}`
    const adminHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: sans-serif; line-height: 1.5; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #3B2A1A;">New Vendor Application</h2>
            <p><strong>Type:</strong> ${vendor_type}</p>
            <p><strong>Business:</strong> ${business_name}</p>
            <p><strong>Contact:</strong> ${contact_name} (${contact_email})</p>
            <p><strong>Specialty:</strong> ${specialty}</p>
            <p><strong>Description:</strong> ${description}</p>
            ${image_url ? `<p><img src="${image_url}" alt="Hero Image" style="max-width: 100%; height: auto; border-radius: 8px;"></p>` : ''}
            <a href="https://thebeanroute.com.au/dashboard/applications" style="display: inline-block; padding: 10px 20px; background-color: #F5C842; color: #1A1A1A; text-decoration: none; border-radius: 5px; font-weight: bold;">Review in Dashboard</a>
          </div>
        </body>
      </html>
    `
    await sendEmail(adminEmail, adminSubject, adminHtml)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error in vendor registration route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
