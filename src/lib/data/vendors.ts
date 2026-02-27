import { cache } from 'react'
import { supabaseAdmin } from '@/lib/supabase-admin'
import type { Vendor, VendorType } from '@/lib/supabase'

/**
 * Vendor data layer with React.cache() for server component deduplication
 * Prevents duplicate database queries when the same data is requested
 * multiple times in the same request (e.g., generateMetadata + page component)
 */

export type VendorFilters = {
  vendor_type?: VendorType
  suburbs?: string[]
  verified?: boolean
}

/**
 * Get vendor by slug - cached per request
 * Used in both generateMetadata() and VendorPage component
 */
export const getVendorBySlug = cache(async (slug: string): Promise<Vendor | null> => {
  const { data, error } = await supabaseAdmin
    .from('vendors')
    .select('*')
    .eq('slug', slug)
    .eq('verified', true)
    .single()

  if (error) {
    console.error('Error fetching vendor by slug:', error)
    return null
  }

  return data as Vendor
})

/**
 * Get all vendors with optional filtering - cached per request
 * Used in browse page, carousels, and other vendor listings
 */
export const getAllVendors = cache(async (filters?: VendorFilters): Promise<Vendor[]> => {
  let query = supabaseAdmin
    .from('vendors')
    .select('*')
    .order('business_name')

  // Apply verified filter (default: true)
  if (filters?.verified !== false) {
    query = query.eq('verified', true)
  }

  // Filter by vendor type
  if (filters?.vendor_type) {
    query = query.eq('vendor_type', filters.vendor_type)
  }

  // Filter by suburbs (overlaps operator for array columns)
  if (filters?.suburbs && filters.suburbs.length > 0) {
    query = query.overlaps('suburbs', filters.suburbs)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching vendors:', error)
    return []
  }

  return (data as Vendor[]) || []
})

/**
 * Get vendors by IDs - cached per request
 * Useful for fetching specific vendor sets
 */
export const getVendorsByIds = cache(async (ids: string[]): Promise<Vendor[]> => {
  const { data, error } = await supabaseAdmin
    .from('vendors')
    .select('*')
    .in('id', ids)
    .eq('verified', true)

  if (error) {
    console.error('Error fetching vendors by IDs:', error)
    return []
  }

  return (data as Vendor[]) || []
})
