import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentVendor } from '@/lib/vendor-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { calculateProfileCompletion } from '@/lib/profile-completion'
import { updateVendorEmbedding, canRegenerateEmbedding } from '@/lib/embedding'

// GET /api/vendors/profile - Get current vendor profile
export async function GET() {
  try {
    const vendor = await getCurrentVendor()

    if (!vendor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch full vendor data
    const { data: vendorData, error: vendorError } = await supabaseAdmin
      .from('vendors')
      .select('*')
      .eq('id', vendor.vendorId)
      .single()

    if (vendorError || !vendorData) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    // Calculate completion
    const completion = calculateProfileCompletion(vendorData)

    // Update completion percent if changed
    if (vendorData.profile_completion_percent !== completion.percentage) {
      await supabaseAdmin
        .from('vendors')
        .update({ profile_completion_percent: completion.percentage })
        .eq('id', vendor.vendorId)
    }

    return NextResponse.json({
      vendor: vendorData,
      completion,
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/vendors/profile - Update vendor profile
const updateProfileSchema = z.object({
  profile_llm: z.object({
    bio: z.string().optional(),
    specialties: z.array(z.string()).optional(),
    certifications: z.array(z.string()).optional(),
    availability: z.object({
      days: z.array(z.string()).optional(),
      hours: z.string().optional(),
    }).optional(),
    equipment_expertise: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    service_style: z.string().optional(),
  }).optional(),
  tags: z.array(z.string()).optional(),
  description: z.string().optional(),
})

export async function PATCH(req: NextRequest) {
  try {
    const vendor = await getCurrentVendor()

    if (!vendor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const updates = updateProfileSchema.parse(body)

    // Fetch current vendor data
    const { data: currentVendor } = await supabaseAdmin
      .from('vendors')
      .select('*')
      .eq('id', vendor.vendorId)
      .single()

    if (!currentVendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    // Merge profile_llm
    const updatedProfileLLM = {
      ...currentVendor.profile_llm,
      ...updates.profile_llm,
    }

    // Update vendor
    const { error: updateError } = await supabaseAdmin
      .from('vendors')
      .update({
        profile_llm: updatedProfileLLM,
        tags: updates.tags || currentVendor.tags,
        description: updates.description || currentVendor.description,
      })
      .eq('id', vendor.vendorId)

    if (updateError) {
      console.error('Update profile error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    // Regenerate embedding if allowed
    if (canRegenerateEmbedding(currentVendor)) {
      try {
        await updateVendorEmbedding(vendor.vendorId)
      } catch (embeddingError) {
        console.error('Failed to regenerate embedding:', embeddingError)
        // Don't fail the request if embedding fails
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update profile error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
