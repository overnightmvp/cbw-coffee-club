/**
 * Blog Layout
 *
 * Wraps all blog pages (/blog and /blog/[slug]) with:
 * - Free coffee sticky banner (dismissible)
 * - Consistent spacing for fixed header
 */

import { FreeCoffeeBanner } from '@/components/blog/FreeCoffeeBanner'

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Sticky banner at top of viewport */}
      <FreeCoffeeBanner />

      {/* Main content with top padding to account for banner */}
      <div className="pt-12">
        {children}
      </div>
    </>
  )
}
