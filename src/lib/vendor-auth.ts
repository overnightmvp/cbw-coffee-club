import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { vendorSessionOptions, VendorSession } from './vendor-session-config'
import { NextResponse } from 'next/server'

/**
 * Get vendor iron-session (server-side only)
 * Returns the session object (may be empty if not authenticated)
 */
export async function getVendorSession() {
  const cookieStore = await cookies()
  return await getIronSession<VendorSession>(cookieStore, vendorSessionOptions)
}

/**
 * Get current authenticated vendor (server-side only)
 * Returns null if no valid session exists
 */
export async function getCurrentVendor(): Promise<VendorSession | null> {
  try {
    const session = await getVendorSession()

    if (!session.vendorId || !session.email) {
      return null
    }

    // Check expiration
    if (session.expires && session.expires < Date.now()) {
      return null
    }

    return session as VendorSession
  } catch (error) {
    console.error('[VENDOR_AUTH] Error getting vendor session:', error)
    return null
  }
}

/**
 * Require vendor authentication (for API routes)
 * Returns vendor session or throws 401 response
 */
export async function requireVendorAuth(): Promise<VendorSession> {
  const vendor = await getCurrentVendor()

  if (!vendor) {
    throw NextResponse.json(
      { error: 'Unauthorized - Please log in' },
      { status: 401 }
    )
  }

  return vendor
}
