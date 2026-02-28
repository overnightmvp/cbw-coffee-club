/**
 * InlineFreeCoffeeCTA Component
 *
 * Eye-catching inline CTA promoting free coffee tasting.
 * Designed to be inserted within blog post content.
 *
 * Features:
 * - Gradient background for visual distinction
 * - Icon-based design
 * - Mobile-responsive layout
 *
 * Usage:
 *   <InlineFreeCoffeeCTA />
 *
 * Placement strategy:
 * - After 30% of content
 * - Between H2 sections
 * - Manual insertion in markdown via custom component
 */

import Link from 'next/link'
import { Coffee, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function InlineFreeCoffeeCTA() {
  return (
    <div className="my-12 bg-gradient-to-r from-green-50 to-primary-50 rounded-xl p-8 border-l-4 border-green-500">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="bg-green-500 p-3 rounded-lg flex-shrink-0">
          <Coffee className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-2">Get Free Expert Coffee Advice</h3>
          <p className="text-neutral-600 mb-4">
            Book your first coffee cart and receive a complimentary tasting session
            with a specialty barista (valued at $150).
          </p>
          <Link href="/free-coffee">
            <Button variant="default" size="lg" className="gap-2 bg-green-600 hover:bg-green-700">
              <Gift className="h-5 w-5" />
              Claim Your Free Tasting →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
