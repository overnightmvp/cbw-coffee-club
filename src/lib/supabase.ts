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

  // LLM-enhanced fields (Epic 5: Vendor Onboarding Portal)
  ai_bio: string | null
  ai_specialties: string[] | null
  ai_target_events: string[] | null
  ai_usp: string | null
  profile_embedding: number[] | null
  embedding_updated_at: string | null
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

// Epic 5: Vendor Onboarding Portal - New Database Types

export type WorkHistory = {
  id: string
  vendor_id: string
  role_title: string
  company_name: string | null
  start_date: string
  end_date: string | null
  description: string | null
  skills_used: string[]
  created_at: string
}

export type Badge = {
  id: string
  slug: string
  name: string
  description: string
  icon_url: string | null
  category: 'compliance' | 'skill' | 'experience' | 'achievement'
  created_at: string
}

export type VendorBadge = {
  id: string
  vendor_id: string
  badge_id: string
  earned_at: string
  verified: boolean
  verification_notes: string | null
}

export type ProfileSection = {
  id: string
  slug: string
  name: string
  description: string
  required: boolean
  unlock_tier: 'basic' | 'standard' | 'premium'
  created_at: string
}

export type VendorSession = {
  id: string
  vendor_id: string
  session_token: string
  email: string
  ip_address: string | null
  user_agent: string | null
  expires_at: string
  created_at: string
  last_activity_at: string
}

export type Quiz = {
  id: string
  slug: string
  title: string
  description: string
  category: 'safety' | 'service' | 'product_knowledge' | 'business'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  questions: QuizQuestion[]
  passing_score: number
  time_limit_minutes: number | null
  badge_id: string | null
  created_at: string
}

export type QuizQuestion = {
  id: string
  question: string
  options: string[]
  correct_answer: number
  explanation: string | null
}

export type QuizAttempt = {
  id: string
  vendor_id: string
  quiz_id: string
  score: number
  passed: boolean
  answers: Record<string, number>
  started_at: string
  completed_at: string | null
  created_at: string
}

// Database type for all tables (used by Supabase client)
export type Database = {
  public: {
    Tables: {
      vendors: {
        Row: Vendor
        Insert: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Vendor, 'id' | 'created_at'>>
      }
      inquiries: {
        Row: Inquiry
        Insert: Omit<Inquiry, 'id' | 'created_at'>
        Update: Partial<Omit<Inquiry, 'id' | 'created_at'>>
      }
      vendor_applications: {
        Row: VendorApplication
        Insert: Omit<VendorApplication, 'id' | 'created_at'>
        Update: Partial<Omit<VendorApplication, 'id' | 'created_at'>>
      }
      jobs: {
        Row: Job
        Insert: Omit<Job, 'id' | 'created_at'>
        Update: Partial<Omit<Job, 'id' | 'created_at'>>
      }
      quotes: {
        Row: Quote
        Insert: Omit<Quote, 'id' | 'created_at'>
        Update: Partial<Omit<Quote, 'id' | 'created_at'>>
      }
      admin_users: {
        Row: AdminUser
        Insert: Omit<AdminUser, 'id' | 'created_at'>
        Update: Partial<Omit<AdminUser, 'id' | 'created_at'>>
      }
      messages: {
        Row: Message
        Insert: Omit<Message, 'id' | 'created_at'>
        Update: Partial<Omit<Message, 'id' | 'created_at'>>
      }
      push_subscriptions: {
        Row: PushSubscription
        Insert: Omit<PushSubscription, 'id' | 'created_at'>
        Update: Partial<Omit<PushSubscription, 'id' | 'created_at'>>
      }
      work_history: {
        Row: WorkHistory
        Insert: Omit<WorkHistory, 'id' | 'created_at'>
        Update: Partial<Omit<WorkHistory, 'id' | 'created_at'>>
      }
      badges: {
        Row: Badge
        Insert: Omit<Badge, 'id' | 'created_at'>
        Update: Partial<Omit<Badge, 'id' | 'created_at'>>
      }
      vendor_badges: {
        Row: VendorBadge
        Insert: Omit<VendorBadge, 'id'>
        Update: Partial<Omit<VendorBadge, 'id'>>
      }
      profile_sections: {
        Row: ProfileSection
        Insert: Omit<ProfileSection, 'id' | 'created_at'>
        Update: Partial<Omit<ProfileSection, 'id' | 'created_at'>>
      }
      vendor_sessions: {
        Row: VendorSession
        Insert: Omit<VendorSession, 'id' | 'created_at' | 'last_activity_at'>
        Update: Partial<Omit<VendorSession, 'id' | 'created_at'>>
      }
      quizzes: {
        Row: Quiz
        Insert: Omit<Quiz, 'id' | 'created_at'>
        Update: Partial<Omit<Quiz, 'id' | 'created_at'>>
      }
      quiz_attempts: {
        Row: QuizAttempt
        Insert: Omit<QuizAttempt, 'id' | 'created_at'>
        Update: Partial<Omit<QuizAttempt, 'id' | 'created_at'>>
      }
    }
  }
}

// Helper type exports for convenience
export type VendorRow = Database['public']['Tables']['vendors']['Row']
export type VendorInsert = Database['public']['Tables']['vendors']['Insert']
export type VendorUpdate = Database['public']['Tables']['vendors']['Update']

export type WorkHistoryRow = Database['public']['Tables']['work_history']['Row']
export type WorkHistoryInsert = Database['public']['Tables']['work_history']['Insert']

export type BadgeRow = Database['public']['Tables']['badges']['Row']
export type VendorBadgeRow = Database['public']['Tables']['vendor_badges']['Row']

export type QuizRow = Database['public']['Tables']['quizzes']['Row']
export type QuizAttemptRow = Database['public']['Tables']['quiz_attempts']['Row']