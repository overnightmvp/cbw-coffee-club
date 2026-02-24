import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// The Bean Route — Database Types

// Vendor type discrimination
export type VendorType = 'mobile_cart' | 'coffee_shop' | 'barista'

// Price range for coffee shops ($ to $$$$)
export type PriceRange = '$' | '$$' | '$$$' | '$$$$'

// Opening hours structure for coffee shops
export interface OpeningHours {
  monday?: { open: string; close: string }
  tuesday?: { open: string; close: string }
  wednesday?: { open: string; close: string }
  thursday?: { open: string; close: string }
  friday?: { open: string; close: string }
  saturday?: { open: string; close: string }
  sunday?: { open: string; close: string }
}

// Menu item structure for coffee shops
export interface MenuItem {
  name: string
  description?: string
  price?: number
  category?: string // e.g., "Espresso", "Filter", "Food"
}

// Main Vendor type (supports both mobile carts and coffee shops)
export type Vendor = {
  id: string
  slug: string
  business_name: string
  vendor_type: VendorType
  specialty: string
  suburbs: string[]
  description: string | null
  tags: string[]
  verified: boolean
  created_at: string
  updated_at?: string

  // Contact information (both types)
  contact_email: string | null
  contact_phone: string | null
  website: string | null
  image_url: string | null

  // Mobile cart specific fields
  price_min: number
  price_max: number
  capacity_min: number
  capacity_max: number

  // Coffee shop specific fields
  physical_address: string | null
  google_maps_url: string | null
  latitude: number | null
  longitude: number | null
  opening_hours: OpeningHours | null
  seating_capacity: number | null
  wifi_available: boolean
  parking_available: boolean
  outdoor_seating: boolean
  wheelchair_accessible: boolean
  menu_url: string | null
  menu_items: MenuItem[] | null
  price_range: PriceRange | null
  average_rating: number | null
  review_count: number
  instagram_handle: string | null
  facebook_url: string | null
  social_links: Record<string, string> | null
}

// Helper function to format price range for vendors
export function formatVendorPrice(vendor: Vendor): string {
  if (vendor.vendor_type === 'coffee_shop') {
    return vendor.price_range || '$$' // Default to $$ if not set
  }
  return `$${vendor.price_min}–$${vendor.price_max}/hr`
}

// Type guard to check if vendor is a coffee shop
export function isCoffeeShop(vendor: Vendor): boolean {
  return vendor.vendor_type === 'coffee_shop'
}

// Type guard to check if vendor is a mobile cart
export function isMobileCart(vendor: Vendor): boolean {
  return vendor.vendor_type === 'mobile_cart'
}

// Type guard to check if vendor is a barista
export function isBarista(vendor: Vendor): boolean {
  return vendor.vendor_type === 'barista'
}

// Helper to get vendor display address
export function getVendorAddress(vendor: Vendor): string | null {
  if (vendor.vendor_type === 'coffee_shop') {
    return vendor.physical_address
  }
  // Mobile carts don't have physical address, show service area
  return vendor.suburbs.length > 0 ? `Serves ${vendor.suburbs.slice(0, 3).join(', ')}` : null
}

// Helper to check if vendor is currently open (coffee shops only)
export function isVendorOpen(vendor: Vendor): boolean | null {
  if (vendor.vendor_type !== 'coffee_shop' || !vendor.opening_hours) {
    return null // Not applicable or no hours data
  }

  const now = new Date()
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  const currentTime = now.toTimeString().slice(0, 5) // "HH:MM"

  const hours = vendor.opening_hours[dayName as keyof OpeningHours]
  if (!hours) {
    return false // Closed today
  }

  return currentTime >= hours.open && currentTime <= hours.close
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
  vendor_type: VendorType
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
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
}

export type AdminUser = {
  id: string
  email: string
  name: string | null
  created_at: string
}

export type Message = {
  id: string
  inquiry_id: string
  sender_id: string
  sender_type: 'vendor' | 'client' | 'admin'
  content: string
  read: boolean
  created_at: string
}

export type PushSubscription = {
  id: string
  user_id: string
  endpoint: string
  auth_key: string
  p256dh_key: string
  created_at: string
}