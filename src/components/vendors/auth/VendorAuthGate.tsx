'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface VendorAuthGateProps {
  children: React.ReactNode
}

export function VendorAuthGate({ children }: VendorAuthGateProps) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/vendors/profile')

        if (res.ok) {
          setIsAuthenticated(true)
        } else {
          router.push('/vendors/login')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/vendors/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
