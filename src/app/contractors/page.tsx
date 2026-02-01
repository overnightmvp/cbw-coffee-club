import Link from 'next/link'
import { Header } from '@/components/navigation/Header'
import { Button } from '@/components/ui'

export default function ContractorsHub() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      <Header variant="app" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#A0785A' }}>
            For Event Planners
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{ color: '#1A1A1A' }}>
            Everything you need to know about hiring a coffee cart
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl leading-relaxed">
            From understanding costs to finding the right cart for your event, these guides cover the process end to end.
          </p>
        </div>

        {/* Guide Cards */}
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          <Link href="/contractors/how-to-hire" className="group">
            <div className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-md transition-shadow h-full">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#FAF5F0' }}>
                <svg className="w-5 h-5" fill="none" stroke="#3B2A1A" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-lg font-bold mb-2 group-hover:underline" style={{ color: '#1A1A1A' }}>
                How to hire a mobile coffee cart
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                A step-by-step guide to booking a coffee cart for your event. From first inquiry to the day of — everything you need to know.
              </p>
            </div>
          </Link>

          <Link href="/contractors/coffee-cart-costs" className="group">
            <div className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-md transition-shadow h-full">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#FAF5F0' }}>
                <svg className="w-5 h-5" fill="none" stroke="#3B2A1A" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold mb-2 group-hover:underline" style={{ color: '#1A1A1A' }}>
                Coffee cart costs &amp; pricing
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Honest pricing information for mobile coffee carts in Melbourne. What affects cost, what's included, and how to get the best value.
              </p>
            </div>
          </Link>
        </div>

        {/* CTA */}
        <div className="rounded-xl p-8" style={{ background: 'linear-gradient(135deg, #3B2A1A 0%, #6B4226 100%)' }}>
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Ready to find a coffee cart?
            </h2>
            <p className="text-sm mb-6" style={{ color: '#A0785A' }}>
              Browse Melbourne's best mobile coffee carts and get a free quote in minutes.
            </p>
            <Link href="/app">
              <Button className="bg-[#F5C842] text-[#1A1A1A] hover:bg-[#E8B430] font-semibold">
                Browse all vendors
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
