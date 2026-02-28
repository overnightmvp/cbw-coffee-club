import { SessionOptions } from 'iron-session'

export interface VendorSession {
  vendorId: string
  email: string
  businessName: string
  expires: number
}

export const vendorSessionOptions: SessionOptions = {
  password: process.env.VENDOR_SESSION_PASSWORD || 'vendor_complex_password_at_least_32_characters_long',
  cookieName: 'vendor_session_signed',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
}
