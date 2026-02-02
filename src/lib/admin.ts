import { cookies } from 'next/headers'

export type AdminSession = {
  email: string
  expires: number
}

/**
 * Get current admin session (server-side only)
 * Returns null if no valid session exists
 */
export async function getCurrentAdmin(): Promise<AdminSession | null> {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('admin_session')

    if (!sessionCookie) {
      return null
    }

    const session: AdminSession = JSON.parse(sessionCookie.value)

    // Check expiration
    if (session.expires < Date.now()) {
      return null
    }

    return session
  } catch (error) {
    console.error('Error getting admin session:', error)
    return null
  }
}
