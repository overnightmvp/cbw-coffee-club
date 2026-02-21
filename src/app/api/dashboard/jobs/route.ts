import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/admin'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Force dynamic rendering - admin routes require authentication via cookies
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getCurrentAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch jobs and quotes using service role
    const [jobsResult, quotesResult] = await Promise.all([
      supabaseAdmin
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false }),
      supabaseAdmin
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false })
    ])

    if (jobsResult.error) {
      console.error('Error fetching jobs:', jobsResult.error)
      return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
    }

    if (quotesResult.error) {
      console.error('Error fetching quotes:', quotesResult.error)
      return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 })
    }

    return NextResponse.json({
      jobs: jobsResult.data,
      quotes: quotesResult.data
    })
  } catch (error) {
    console.error('Error in jobs route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
