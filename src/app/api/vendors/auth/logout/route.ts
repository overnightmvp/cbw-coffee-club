import { NextResponse } from 'next/server'
import { getVendorSession } from '@/lib/vendor-auth'

export async function POST() {
  try {
    const session = await getVendorSession()
    await session.destroy()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
