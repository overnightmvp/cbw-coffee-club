import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// The Bean Route — Database Types

export type Vendor = {
  id: string
  slug: string
  business_name: string
  specialty: string
  suburbs: string[]
  price_min: number
  price_max: number
  capacity_min: number
  capacity_max: number
  description: string | null
  contact_email: string | null
  contact_phone: string | null
  website: string | null
  image_url: string | null
  tags: string[]
  verified: boolean
  created_at: string
}

// Helper function to format price range for Supabase vendors
export function formatVendorPrice(vendor: Vendor): string {
  return `$${vendor.price_min}–$${vendor.price_max}/hr`
}

// Legacy vendor type (camelCase) for backward compatibility with components
// TODO: Eventually migrate all components to use database Vendor type
export type LegacyVendor = {
  id: string
  slug: string
  businessName: string
  specialty: string
  suburbs: string[]
  priceMin: number
  priceMax: number
  capacityMin: number
  capacityMax: number
  description: string
  contactEmail: string | null
  contactPhone: string | null
  website: string | null
  imageUrl: string | null
  tags: string[]
}

// Helper function for legacy vendor price formatting
export function formatPriceRange(vendor: LegacyVendor): string {
  return `$${vendor.priceMin}–$${vendor.priceMax}/hr`
}

export type Inquiry = {
  id: string
  vendor_id: string
  event_type: string | null
  event_date: string | null
  event_duration_hours: number | null
  guest_count: number | null
  location: string | null
  contact_name: string
  contact_email: string
  contact_phone: string | null
  special_requests: string | null
  estimated_cost: number | null
  status: 'pending' | 'contacted' | 'converted'
  created_at: string
}

export type VendorApplication = {
  id: string
  business_name: string
  specialty: string
  description: string
  suburbs: string[]
  price_min: number
  price_max: number
  capacity_min: number
  capacity_max: number
  event_types: string[]
  contact_name: string
  contact_email: string
  contact_phone: string | null
  website: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export type Job = {
  id: string
  event_title: string
  event_type: string
  event_date: string
  duration_hours: number
  guest_count: number
  location: string
  budget_min: number | null
  budget_max: number
  special_requirements: string | null
  contact_name: string
  contact_email: string
  contact_phone: string | null
  status: 'open' | 'closed'
  created_at: string
}

export type Quote = {
  id: string
  job_id: string
  vendor_name: string
  price_per_hour: number
  message: string | null
  contact_email: string
  created_at: string
}

export type AdminUser = {
  id: string
  email: string
  name: string | null
  created_at: string
}