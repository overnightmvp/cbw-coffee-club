'use client'

import { useState, useEffect } from 'react'

type AuthGateProps = {
  children: React.ReactNode
}

export function AuthGate({ children }: AuthGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Check for existing session
    const session = localStorage.getItem('admin_session')
    if (session) {
      try {
        const parsed = JSON.parse(session)
        // Check if session is still valid (24 hours)
        if (parsed.expires > Date.now()) {
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem('admin_session')
        }
      } catch (e) {
        localStorage.removeItem('admin_session')
      }
    }
    setIsLoading(false)
  }, [])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    // Simple email validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      setIsSubmitting(false)
      return
    }

    try {
      // Call API route to send verification code
      const response = await fetch('/api/admin/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (!response.ok) {
        throw new Error('Failed to send verification code')
      }

      setStep('code')
    } catch (err) {
      setError('Failed to send verification code. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    if (!code || code.length !== 6) {
      setError('Please enter the 6-digit code')
      setIsSubmitting(false)
      return
    }

    try {
      // Verify code via API route
      const response = await fetch('/api/admin/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      })

      if (!response.ok) {
        throw new Error('Invalid code')
      }

      const data = await response.json()

      // Store session in localStorage
      const session = {
        email,
        expires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      }
      localStorage.setItem('admin_session', JSON.stringify(session))
      setIsAuthenticated(true)
    } catch (err) {
      setError('Invalid verification code. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAF8' }}>
        <div className="text-neutral-500">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAF8' }}>
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg border border-neutral-200 p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3B2A1A 0%, #6B4226 100%)' }}>
                <span className="text-[#F5C842] font-bold text-xl">C</span>
              </div>
              <h1 className="text-2xl font-bold mb-2" style={{ color: '#1A1A1A' }}>Admin Portal</h1>
              <p className="text-sm text-neutral-600">
                {step === 'email' ? 'Enter your email to continue' : 'Enter the verification code sent to your email'}
              </p>
            </div>

            {step === 'email' ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@thebeanroute.com.au"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#F5C842] focus:border-[#F5C842] outline-none"
                    disabled={isSubmitting}
                  />
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                  style={{ backgroundColor: '#F5C842', color: '#1A1A1A' }}
                >
                  {isSubmitting ? 'Sending...' : 'Send verification code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleCodeSubmit} className="space-y-4">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>
                    Verification code
                  </label>
                  <input
                    id="code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full px-3 py-2 border rounded-lg text-sm text-center tracking-widest font-mono text-lg focus:ring-2 focus:ring-[#F5C842] focus:border-[#F5C842] outline-none"
                    disabled={isSubmitting}
                    maxLength={6}
                  />
                  <p className="text-xs text-neutral-500 mt-2">
                    Sent to {email}
                  </p>
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                  style={{ backgroundColor: '#F5C842', color: '#1A1A1A' }}
                >
                  {isSubmitting ? 'Verifying...' : 'Verify code'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('email')
                    setCode('')
                    setError('')
                  }}
                  className="w-full text-sm text-neutral-600 hover:text-neutral-800"
                >
                  ← Back to email
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
