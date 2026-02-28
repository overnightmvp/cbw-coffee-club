/**
 * FreeCoffeeSidebar Component
 *
 * Sticky sidebar widget promoting free coffee tasting.
 * Desktop-only component for blog post layout.
 *
 * Features:
 * - Sticky positioning (follows scroll)
 * - Hidden on mobile/tablet
 * - Card-based design with benefits list
 *
 * Usage:
 *   <FreeCoffeeSidebar />
 *
 * Layout integration:
 * - Place in right sidebar column
 * - Use `sticky top-24` for fixed scroll behavior
 * - Requires parent grid/flex layout with sidebar column
 */

import Link from 'next/link'
import { Coffee, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function FreeCoffeeSidebar() {
  return (
    <div className="sticky top-24 hidden lg:block">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-green-200">
        {/* Icon Header */}
        <div className="text-center mb-4">
          <div className="bg-green-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3">
            <Coffee className="h-8 w-8 text-green-600" />
          </div>
          <h4 className="text-lg font-bold">Free Coffee Tasting</h4>
          <p className="text-sm text-neutral-600 mt-1">
            Exclusive offer for new bookings
          </p>
        </div>

        {/* Benefits List */}
        <ul className="space-y-2 mb-6 text-sm">
          <li className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
            <span>$150 value included</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
            <span>Expert barista session</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
            <span>Perfect for events</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
            <span>No hidden costs</span>
          </li>
        </ul>

        {/* CTA Button */}
        <Link href="/free-coffee" className="block">
          <Button
            variant="default"
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Get Free Tasting
          </Button>
        </Link>

        {/* Trust Signal */}
        <p className="text-xs text-neutral-500 text-center mt-4">
          Join 100+ Melbourne events
        </p>
      </div>
    </div>
  )
}
