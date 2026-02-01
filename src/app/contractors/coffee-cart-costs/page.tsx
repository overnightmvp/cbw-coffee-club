import Link from 'next/link'
import { Header } from '@/components/navigation/Header'
import { Button } from '@/components/ui'

export default function CoffeeCartCosts() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      <Header variant="app" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumb */}
        <div className="text-xs text-neutral-500 mb-8">
          <Link href="/contractors" className="hover:text-neutral-800">Contractors</Link>
          <span className="mx-2">/</span>
          <span>Costs &amp; pricing</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#A0785A' }}>
            Pricing Guide
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{ color: '#1A1A1A' }}>
            How much does a mobile coffee cart cost?
          </h1>
          <p className="text-lg text-neutral-600 leading-relaxed">
            No surprises. Here's an honest breakdown of what mobile coffee carts cost in Melbourne, what's included, and what drives the price.
          </p>
        </div>

        {/* Price Tiers */}
        <div className="mb-14">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: '#3B2A1A' }}>Melbourne pricing ranges</h2>
          <div className="space-y-3">
            <div className="bg-white rounded-lg border border-neutral-200 p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>Basic espresso cart</div>
                <div className="text-xs text-neutral-500 mt-0.5">Single barista, standard menu, up to 100 guests</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold" style={{ color: '#3B2A1A' }}>$150–$200</div>
                <div className="text-xs text-neutral-500">per hour</div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>Premium espresso cart</div>
                <div className="text-xs text-neutral-500 mt-0.5">Specialty beans, latte art, extended menu, up to 150 guests</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold" style={{ color: '#3B2A1A' }}>$200–$300</div>
                <div className="text-xs text-neutral-500">per hour</div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>Cold brew &amp; nitro cart</div>
                <div className="text-xs text-neutral-500 mt-0.5">Cold brew, nitro, specialty menu, up to 200 guests</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold" style={{ color: '#3B2A1A' }}>$180–$280</div>
                <div className="text-xs text-neutral-500">per hour</div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>Full experience cart</div>
                <div className="text-xs text-neutral-500 mt-0.5">Two baristas, premium beans, full menu, branded setup, 200+ guests</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold" style={{ color: '#3B2A1A' }}>$300–$420</div>
                <div className="text-xs text-neutral-500">per hour</div>
              </div>
            </div>
          </div>
        </div>

        {/* What's included */}
        <div className="mb-14">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: '#3B2A1A' }}>What's typically included</h2>
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
              {[
                'Espresso machine and equipment',
                'Barista(s) for the duration',
                'Coffee beans (roasted locally)',
                'Milk and dairy',
                'Cups and lids',
                'Sugar, syrups, and extras',
                'Setup and pack-down',
                'Water supply (if self-contained)',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="#16A34A" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-neutral-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What affects price */}
        <div className="mb-14">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: '#3B2A1A' }}>What affects the price</h2>
          <div className="space-y-4">
            <div>
              <div className="font-semibold text-sm mb-1" style={{ color: '#1A1A1A' }}>Duration</div>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Most carts price by the hour. A 2-hour corporate morning tea will cost roughly half of a 4-hour wedding reception service. Minimum hire is usually 2 hours.
              </p>
            </div>
            <div>
              <div className="font-semibold text-sm mb-1" style={{ color: '#1A1A1A' }}>Guest count</div>
              <p className="text-sm text-neutral-600 leading-relaxed">
                More guests means more coffee, more milk, and sometimes an extra barista. Carts serving 150+ people often need a second operator to keep wait times down.
              </p>
            </div>
            <div>
              <div className="font-semibold text-sm mb-1" style={{ color: '#1A1A1A' }}>Location</div>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Inner Melbourne suburbs are standard. Events in outer suburbs or regional areas may attract a travel surcharge — usually $30–$80 depending on distance.
              </p>
            </div>
            <div>
              <div className="font-semibold text-sm mb-1" style={{ color: '#1A1A1A' }}>Menu complexity</div>
              <p className="text-sm text-neutral-600 leading-relaxed">
                A basic espresso and flat white menu is the baseline. Add nitro coffee, specialty pour-overs, or custom drinks and the price moves up accordingly.
              </p>
            </div>
            <div>
              <div className="font-semibold text-sm mb-1" style={{ color: '#1A1A1A' }}>Day of the week</div>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Saturday bookings are in higher demand. Some carts charge a weekend premium of 10–20%. Midweek corporate events tend to be the most affordable.
              </p>
            </div>
          </div>
        </div>

        {/* Example */}
        <div className="rounded-xl p-6 mb-14" style={{ backgroundColor: '#FAF5F0' }}>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: '#3B2A1A' }}>Example: Corporate morning tea</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Event</span>
              <span className="font-medium" style={{ color: '#1A1A1A' }}>Corporate morning tea, CBD office</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Guests</span>
              <span className="font-medium" style={{ color: '#1A1A1A' }}>60 people</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Duration</span>
              <span className="font-medium" style={{ color: '#1A1A1A' }}>2 hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Cart type</span>
              <span className="font-medium" style={{ color: '#1A1A1A' }}>Premium espresso</span>
            </div>
            <div className="border-t border-neutral-200 pt-2 mt-2 flex justify-between">
              <span className="font-semibold" style={{ color: '#1A1A1A' }}>Estimated total</span>
              <span className="font-bold text-lg" style={{ color: '#3B2A1A' }}>$400–$600</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mb-12">
          <h3 className="text-lg font-bold mb-2" style={{ color: '#1A1A1A' }}>Ready to get a quote?</h3>
          <p className="text-sm text-neutral-600 mb-4">Free to inquire. No commitment required.</p>
          <Link href="/app">
            <Button className="bg-[#F5C842] text-[#1A1A1A] hover:bg-[#E8B430] font-semibold">
              Browse vendors &amp; get a quote
            </Button>
          </Link>
        </div>

        {/* Back link */}
        <Link href="/contractors" className="text-sm text-neutral-500 hover:text-neutral-800">
          ← Back to contractor guides
        </Link>
      </div>
    </div>
  )
}
