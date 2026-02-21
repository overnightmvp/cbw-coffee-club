import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/admin'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendEmail } from '@/lib/email'

// Force dynamic rendering - admin routes require authentication via cookies
export const dynamic = 'force-dynamic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    // Check authentication
    const session = await getCurrentAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { status } = await request.json()

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Update application using service role
    const { data, error } = await supabaseAdmin
      .from('vendor_applications')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating application:', error)
      return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
    }

    // Create vendor record when application is approved
    if (data && status === 'approved') {
      try {
        // Generate slug from business name
        const slug = data.business_name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')

        // Map application fields to vendor fields
        const vendorId = `vnd_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

        const { error: vendorError } = await supabaseAdmin
          .from('vendors')
          .insert({
            id: vendorId,
            slug: slug,
            business_name: data.business_name,
            specialty: data.specialty,
            description: data.description,
            suburbs: data.suburbs,
            price_min: data.price_min,
            price_max: data.price_max,
            capacity_min: data.capacity_min,
            capacity_max: data.capacity_max,
            contact_email: data.contact_email,
            contact_phone: data.contact_phone,
            website: data.website,
            tags: data.event_types, // Map event_types to tags
            verified: true, // Approved applications are verified
          })

        if (vendorError) {
          console.error('Error creating vendor record:', vendorError)
          // Don't fail the approval if vendor creation fails - log and continue
          // Admin can manually create vendor or retry later
        } else {
          console.log(`[VENDOR CREATED] ${data.business_name} (${slug}) - ID: ${vendorId}`)
        }
      } catch (vendorCreationError) {
        console.error('Unexpected error creating vendor:', vendorCreationError)
        // Continue with approval flow even if vendor creation fails
      }
    }

    // Send decision email to applicant (only for approved/rejected, not pending)
    if (data && (status === 'approved' || status === 'rejected')) {
      try {
        const isApproved = status === 'approved'
        const subject = isApproved
          ? `Welcome to Coffee Cart Marketplace — Application Approved!`
          : `Coffee Cart Marketplace Application Update`

        const html = isApproved ? `
          <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #F5C842; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #1A1A1A; font-size: 24px;">Welcome to Coffee Cart Marketplace!</h1>
            </div>

            <div style="padding: 32px 24px; background-color: #ffffff;">
              <p style="font-size: 16px; color: #1A1A1A; margin-bottom: 24px;">
                Hi ${data.contact_name},
              </p>
              <p style="font-size: 16px; color: #1A1A1A; margin-bottom: 24px;">
                Great news! Your application for <strong>${data.business_name}</strong> has been approved.
              </p>

              <div style="background-color: #E8F5E9; border-left: 4px solid #16A34A; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <p style="font-size: 14px; color: #16A34A; font-weight: 600; margin: 0 0 8px 0;">✓ Application Approved</p>
                <p style="font-size: 14px; color: #1A1A1A; margin: 0;">Your coffee cart will appear on the marketplace within the next 24 hours.</p>
              </div>

              <div style="background-color: #FAFAF8; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #6B4226; margin: 0 0 16px 0;">What's Next?</h2>
                <ul style="font-size: 14px; color: #3B2A1A; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">Your profile will be live on thebeanroute.com.au within 24 hours</li>
                  <li style="margin-bottom: 8px;">Event planners will be able to submit inquiries directly to you</li>
                  <li style="margin-bottom: 8px;">You'll receive email notifications when inquiries come in</li>
                  <li style="margin-bottom: 8px;">Respond to inquiries quickly to secure bookings</li>
                </ul>
              </div>

              <div style="background-color: #FAF5F0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #6B4226; margin: 0 0 16px 0;">Your Listing Details</h2>
                <table style="width: 100%; font-size: 14px; color: #3B2A1A;">
                  <tr><td style="padding: 4px 0;"><strong>Business Name:</strong></td><td style="padding: 4px 0;">${data.business_name}</td></tr>
                  <tr><td style="padding: 4px 0;"><strong>Specialty:</strong></td><td style="padding: 4px 0;">${data.specialty}</td></tr>
                  <tr><td style="padding: 4px 0;"><strong>Price Range:</strong></td><td style="padding: 4px 0;">$${data.price_min}–$${data.price_max}/hr</td></tr>
                  <tr><td style="padding: 4px 0;"><strong>Service Areas:</strong></td><td style="padding: 4px 0;">${data.suburbs.join(', ')}</td></tr>
                </table>
              </div>

              <p style="font-size: 16px; color: #1A1A1A; margin-bottom: 8px;">
                <strong>Need to update your listing?</strong>
              </p>
              <p style="font-size: 14px; color: #3B2A1A; margin-bottom: 24px;">
                Reply to this email with any changes to your pricing, service areas, or contact details.
              </p>

              <div style="border-top: 1px solid #E5E5E5; padding-top: 20px; margin-top: 32px;">
                <p style="font-size: 12px; color: #6B7280; margin: 0;">
                  Questions? Contact us at support@coffeecartsmelbourne.com<br/>
                  Coffee Cart Marketplace — Connecting Melbourne's best mobile coffee carts with event planners
                </p>
              </div>
            </div>
          </div>
        ` : `
          <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #FAFAF8; padding: 24px; text-align: center; border-bottom: 1px solid #E5E5E5;">
              <h1 style="margin: 0; color: #1A1A1A; font-size: 24px;">Coffee Cart Marketplace Application</h1>
            </div>

            <div style="padding: 32px 24px; background-color: #ffffff;">
              <p style="font-size: 16px; color: #1A1A1A; margin-bottom: 24px;">
                Hi ${data.contact_name},
              </p>
              <p style="font-size: 16px; color: #1A1A1A; margin-bottom: 24px;">
                Thank you for your interest in joining Coffee Cart Marketplace with <strong>${data.business_name}</strong>.
              </p>

              <div style="background-color: #FEF3C7; border-left: 4px solid #D97706; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <p style="font-size: 14px; color: #92400E; font-weight: 600; margin: 0 0 8px 0;">Application Status</p>
                <p style="font-size: 14px; color: #1A1A1A; margin: 0;">After reviewing your application, we're unable to add your cart to the marketplace at this time.</p>
              </div>

              <div style="background-color: #FAFAF8; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #6B4226; margin: 0 0 16px 0;">Common Reasons for Rejection</h2>
                <ul style="font-size: 14px; color: #3B2A1A; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">Service area doesn't match our current coverage</li>
                  <li style="margin-bottom: 8px;">We have capacity limits for each suburb</li>
                  <li style="margin-bottom: 8px;">Business details need clarification</li>
                  <li style="margin-bottom: 8px;">Pricing outside typical market range</li>
                </ul>
              </div>

              <p style="font-size: 16px; color: #1A1A1A; margin-bottom: 8px;">
                <strong>Want to reapply?</strong>
              </p>
              <p style="font-size: 14px; color: #3B2A1A; margin-bottom: 24px;">
                You're welcome to submit a new application in the future. If you'd like specific feedback about your application, reply to this email and we'll be happy to help.
              </p>

              <div style="border-top: 1px solid #E5E5E5; padding-top: 20px; margin-top: 32px;">
                <p style="font-size: 12px; color: #6B7280; margin: 0;">
                  Questions? Contact us at support@coffeecartsmelbourne.com<br/>
                  Coffee Cart Marketplace — Connecting Melbourne's best mobile coffee carts with event planners
                </p>
              </div>
            </div>
          </div>
        `

        await sendEmail(data.contact_email, subject, html)
      } catch (emailError) {
        // Don't fail the status update if email fails
        console.error('Failed to send decision email:', emailError)
      }
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error in application update route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
