import Link from 'next/link'
import { Header } from '@/components/navigation/Header'
import { Button } from '@/components/ui'

export default function VendorsGuideHub() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      <Header variant="app" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#A0785A' }}>
            For Coffee Cart Operators
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{ color: '#1A1A1A' }}>
            Grow your mobile coffee cart business
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl leading-relaxed">
            CBW connects Melbourne's best coffee cart operators with event planners, corporates, and venue managers. These guides show you how to get listed and make the most of it.
          </p>
        </div>

        {/* Guide Cards */}
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          <Link href="/vendors-guide/get-listed" className="group">
            <div className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-md transition-shadow h-full">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#FAF5F0' }}>
                <svg className="w-5 h-5" fill="none" stroke="#3B2A1A" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-lg font-bold mb-2 group-hover:underline" style={{ color: '#1A1A1A' }}>
                How to get listed
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Everything you need to know about getting your coffee cart on CBW. What information we need, how your listing looks, and what to expect once you're live.
              </p>
            </div>
          </Link>

          <Link href="/vendors-guide/grow-your-business" className="group">
            <div className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-md transition-shadow h-full">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#FAF5F0' }}>
                <svg className="w-5 h-5" fill="none" stroke="#3B2A1A" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8L13 15M5 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold mb-2 group-hover:underline" style={{ color: '#1A1A1A' }}>
                Grow your business
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                How to turn inquiries into bookings, build a reputation in Melbourne's event scene, and make the most of your CBW listing.
              </p>
            </div>
          </Link>
        </div>

        {/* Why CBW */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-8 mb-12">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-6" style={{ color: '#3B2A1A' }}>Why vendors list on CBW</h3>
          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <div className="text-lg font-bold mb-1" style={{ color: '#F5C842' }}>Free</div>
              <p className="text-sm text-neutral-600">Listing on CBW is completely free at launch. No fees, no subscriptions, no catch.</p>
            </div>
            <div>
              <div className="text-lg font-bold mb-1" style={{ color: '#F5C842' }}>Direct</div>
              <p className="text-sm text-neutral-600">Inquiries come straight to you. No middleman, no awkward phone tag. Just a direct connection with the contractor.</p>
            </div>
            <div>
              <div className="text-lg font-bold mb-1" style={{ color: '#F5C842' }}>Local</div>
              <p className="text-sm text-neutral-600">CBW is Melbourne-focused. Your listing is seen by event planners who are actively looking for coffee carts in your suburbs.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-xl p-8" style={{ background: 'linear-gradient(135deg, #3B2A1A 0%, #6B4226 100%)' }}>
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Want to get listed?
            </h2>
            <p className="text-sm mb-6" style={{ color: '#A0785A' }}>
              It takes less than 10 minutes. We'll have you live within 24 hours.
            </p>
            <Link href="/vendors-guide/get-listed">
              <Button className="bg-[#F5C842] text-[#1A1A1A] hover:bg-[#E8B430] font-semibold">
                Get listed on CBW
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
