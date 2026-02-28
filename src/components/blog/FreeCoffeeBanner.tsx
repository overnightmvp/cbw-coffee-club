/**
 * FreeCoffeeBanner Component
 *
 * Sticky header banner promoting free coffee tasting offer.
 * Features:
 * - Fixed position at top of viewport
 * - Dismissible with localStorage persistence
 * - Green accent color matching brand
 * - Responsive layout
 *
 * Usage:
 *   <FreeCoffeeBanner />
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Coffee, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function FreeCoffeeBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const isDismissed = localStorage.getItem('free-coffee-banner-dismissed')
    if (isDismissed === 'true') {
      setDismissed(true)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem('free-coffee-banner-dismissed', 'true')
    setDismissed(true)
  }

  // Don't render on server or if dismissed
  if (!mounted || dismissed) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-green-600 text-white py-3 shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Coffee className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm sm:text-base font-medium truncate">
            <strong>Limited Offer:</strong> Book your first cart & get free coffee tasting
          </p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <Link href="/free-coffee">
            <Button
              variant="outline"
              size="sm"
              className="bg-white text-green-600 hover:bg-green-50 border-white"
            >
              Claim Free Coffee →
            </Button>
          </Link>
          <button
            onClick={handleDismiss}
            className="hover:bg-green-700 rounded p-1 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
