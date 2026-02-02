import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/admin'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Force dynamic rendering - admin routes require authentication via cookies
export const dynamic = 'force-dynamic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getCurrentAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { status } = await request.json()

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Update application using service role
    const { data, error } = await supabaseAdmin
      .from('vendor_applications')
      .update({ status })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating application:', error)
      return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error in application update route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
