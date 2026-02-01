import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// CBW Coffee — Database Types

export type Vendor = {
  id: string
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