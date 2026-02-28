import OpenAI from 'openai'
import { Vendor } from './supabase'
import { supabaseAdmin } from './supabase-admin'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

const EMBEDDING_MODEL = 'text-embedding-3-small'
const RATE_LIMIT_HOURS = 24 // Can only regenerate embedding once per 24 hours

/**
 * Compile vendor profile into searchable text for embedding
 */
export function compileProfileText(vendor: Vendor): string {
  const parts: string[] = []

  // Business basics
  parts.push(`Business: ${vendor.business_name}`)
  parts.push(`Type: ${vendor.vendor_type}`)
  parts.push(`Specialty: ${vendor.specialty}`)

  // Description (use AI-generated if available, fallback to manual)
  if (vendor.ai_bio) {
    parts.push(`About: ${vendor.ai_bio}`)
  } else if (vendor.description) {
    parts.push(`About: ${vendor.description}`)
  }

  // Service areas
  if (vendor.suburbs && vendor.suburbs.length > 0) {
    parts.push(`Serves: ${vendor.suburbs.join(', ')}`)
  }

  // Tags and specialties
  if (vendor.tags && vendor.tags.length > 0) {
    parts.push(`Features: ${vendor.tags.join(', ')}`)
  }

  // AI-generated fields (if available)
  if (vendor.ai_specialties && vendor.ai_specialties.length > 0) {
    parts.push(`Specialties: ${vendor.ai_specialties.join(', ')}`)
  }

  if (vendor.ai_target_events && vendor.ai_target_events.length > 0) {
    parts.push(`Ideal for: ${vendor.ai_target_events.join(', ')}`)
  }

  if (vendor.ai_usp) {
    parts.push(`Unique selling point: ${vendor.ai_usp}`)
  }

  // Pricing info
  if (vendor.vendor_type === 'mobile_cart') {
    parts.push(`Price range: $${vendor.price_min}-$${vendor.price_max}/hr`)
    parts.push(`Capacity: ${vendor.capacity_min}-${vendor.capacity_max} guests`)
  }

  return parts.join('. ')
}

/**
 * Generate embedding vector using OpenAI API
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
    })

    return response.data[0].embedding
  } catch (error) {
    console.error('[EMBEDDING] Error generating embedding:', error)
    throw new Error('Failed to generate embedding')
  }
}

/**
 * Update vendor profile embedding in database
 */
export async function updateVendorEmbedding(vendorId: string): Promise<void> {
  try {
    // Fetch vendor data
    const { data: vendor, error: fetchError } = await supabaseAdmin
      .from('vendors')
      .select('*')
      .eq('id', vendorId)
      .single()

    if (fetchError || !vendor) {
      throw new Error(`Vendor not found: ${vendorId}`)
    }

    // Check rate limit
    if (!canRegenerateEmbedding(vendor)) {
      throw new Error(
        `Embedding was updated recently. Please wait ${RATE_LIMIT_HOURS} hours between updates.`
      )
    }

    // Compile text and generate embedding
    const profileText = compileProfileText(vendor as Vendor)
    const embedding = await generateEmbedding(profileText)

    // Update database
    const { error: updateError } = await supabaseAdmin
      .from('vendors')
      .update({
        profile_embedding: embedding,
        embedding_updated_at: new Date().toISOString(),
      })
      .eq('id', vendorId)

    if (updateError) {
      throw updateError
    }

    console.log(`[EMBEDDING] Successfully updated embedding for vendor ${vendorId}`)
  } catch (error) {
    console.error('[EMBEDDING] Error updating vendor embedding:', error)
    throw error
  }
}

/**
 * Check if vendor can regenerate embedding (rate limit)
 */
export function canRegenerateEmbedding(vendor: Vendor): boolean {
  if (!vendor.embedding_updated_at) {
    return true // Never generated, allow
  }

  const lastUpdate = new Date(vendor.embedding_updated_at)
  const now = new Date()
  const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60)

  return hoursSinceUpdate >= RATE_LIMIT_HOURS
}
