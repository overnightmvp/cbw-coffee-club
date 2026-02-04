import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quoteId = params.id

    // Fetch the quote to get job_id
    const { data: quote, error: quoteError } = await supabaseAdmin
      .from('quotes')
      .select('job_id, vendor_name, contact_email, price_per_hour')
      .eq('id', quoteId)
      .single()

    if (quoteError || !quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    // Update the accepted quote status
    const { error: acceptError } = await supabaseAdmin
      .from('quotes')
      .update({ status: 'accepted' })
      .eq('id', quoteId)

    if (acceptError) {
      console.error('Error accepting quote:', acceptError)
      return NextResponse.json({ error: 'Failed to accept quote' }, { status: 500 })
    }

    // Mark all other quotes for this job as rejected
    const { error: rejectError } = await supabaseAdmin
      .from('quotes')
      .update({ status: 'rejected' })
      .eq('job_id', quote.job_id)
      .neq('id', quoteId)
      .eq('status', 'pending')

    if (rejectError) {
      console.error('Error rejecting other quotes:', rejectError)
      // Don't fail the request if this fails - the main quote was accepted
    }

    // Close the job
    const { error: closeError } = await supabaseAdmin
      .from('jobs')
      .update({ status: 'closed' })
      .eq('id', quote.job_id)

    if (closeError) {
      console.error('Error closing job:', closeError)
      // Don't fail the request if this fails - the quote was accepted
    }

    return NextResponse.json({
      success: true,
      quote: {
        id: quoteId,
        vendor_name: quote.vendor_name,
        contact_email: quote.contact_email,
        price_per_hour: quote.price_per_hour
      }
    })
  } catch (error) {
    console.error('Unexpected error accepting quote:', error)
    return NextResponse.json({ error: 'Failed to accept quote' }, { status: 500 })
  }
}
