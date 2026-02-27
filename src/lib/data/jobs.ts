import { cache } from 'react'
import { supabaseAdmin } from '@/lib/supabase-admin'

/**
 * Jobs data layer with React.cache() for server component deduplication
 * Prevents duplicate database queries in server components
 */

export type Job = {
  id: string
  event_title: string
  event_type: string
  event_date: string
  duration_hours: number
  guest_count: number
  budget_min: number
  budget_max: number
  location: string
  special_requirements: string | null
  contact_name: string
  contact_email: string
  contact_phone: string
  status: 'open' | 'closed'
  created_at: string
}

export type Quote = {
  id: string
  job_id: string
  vendor_name: string
  price_per_hour: number
  message: string
  contact_email: string
  created_at: string
}

/**
 * Get job by ID - cached per request
 * Used in job detail pages and metadata generation
 */
export const getJobById = cache(async (id: string): Promise<Job | null> => {
  const { data, error } = await supabaseAdmin
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching job by ID:', error)
    return null
  }

  return data as Job
})

/**
 * Get all open jobs - cached per request
 * Used in jobs listing page
 */
export const getAllJobs = cache(async (): Promise<Job[]> => {
  const { data, error } = await supabaseAdmin
    .from('jobs')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching jobs:', error)
    return []
  }

  return (data as Job[]) || []
})

/**
 * Get quotes for a job - cached per request
 * Used in job detail pages
 */
export const getQuotesForJob = cache(async (jobId: string): Promise<Quote[]> => {
  const { data, error } = await supabaseAdmin
    .from('quotes')
    .select('*')
    .eq('job_id', jobId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching quotes for job:', error)
    return []
  }

  return (data as Quote[]) || []
})

/**
 * Get all quotes (for admin dashboard) - cached per request
 */
export const getAllQuotes = cache(async (): Promise<Quote[]> => {
  const { data, error } = await supabaseAdmin
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all quotes:', error)
    return []
  }

  return (data as Quote[]) || []
})

/**
 * Fetch jobs and quotes in parallel
 * Used in jobs page to eliminate waterfall
 */
export const getJobsWithQuotes = cache(async (): Promise<{ jobs: Job[]; quotes: Quote[] }> => {
  const [jobsResult, quotesResult] = await Promise.all([
    supabaseAdmin.from('jobs').select('*').eq('status', 'open').order('created_at', { ascending: false }),
    supabaseAdmin.from('quotes').select('*').order('created_at', { ascending: false }),
  ])

  return {
    jobs: (jobsResult.data as Job[]) || [],
    quotes: (quotesResult.data as Quote[]) || [],
  }
})
