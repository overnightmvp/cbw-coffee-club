import Link from 'next/link'
import { Header } from '@/components/navigation/Header'
import { Button } from '@/components/ui'

export default function GetListed() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      <Header variant="app" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumb */}
        <div className="text-xs text-neutral-500 mb-8">
          <Link href="/vendors-guide" className="hover:text-neutral-800">Vendor Guide</Link>
          <span className="mx-2">/</span>
          <span>Get listed</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#A0785A' }}>
            Vendor Guide
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{ color: '#1A1A1A' }}>
            How to get your coffee cart listed on CBW
          </h1>
          <p className="text-lg text-neutral-600 leading-relaxed">
            Getting listed is free and takes less than 10 minutes. Here's exactly what you need and what happens next.
          </p>
        </div>

        {/* What you need */}
        <div className="mb-14">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: '#3B2A1A' }}>What you'll need</h2>
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FAF5F0' }}>
                  <svg className="w-4 h-4" fill="none" stroke="#3B2A1A" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>Your business name</div>
                  <div className="text-sm text-neutral-600">The trading name customers will see on your listing.</div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FAF5F0' }}>
                  <svg className="w-4 h-4" fill="none" stroke="#3B2A1A" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>Your specialty</div>
                  <div className="text-sm text-neutral-600">What makes your coffee stand out. Espresso, cold brew, pour-over, nitro — or a combination.</div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FAF5F0' }}>
                  <svg className="w-4 h-4" fill="none" stroke="#3B2A1A" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>Suburbs you serve</div>
                  <div className="text-sm text-neutral-600">The Melbourne suburbs where you're happy to set up. Most carts cover 3–8 suburbs.</div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FAF5F0' }}>
                  <svg className="w-4 h-4" fill="none" stroke="#3B2A1A" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>Your pricing</div>
                  <div className="text-sm text-neutral-600">A per-hour price range. This doesn't lock you in — it just helps contractors filter and find you.</div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FAF5F0' }}>
                  <svg className="w-4 h-4" fill="none" stroke="#3B2A1A" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>Contact details</div>
                  <div className="text-sm text-neutral-600">An email address (and phone number if you're comfortable). This is how contractors will reach you.</div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FAF5F0' }}>
                  <svg className="w-4 h-4" fill="none" stroke="#3B2A1A" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>Event types you cover</div>
                  <div className="text-sm text-neutral-600">Corporate, weddings, festivals, private events — or all of the above. This helps us match you with the right inquiries.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-14">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: '#3B2A1A' }}>What happens after you submit</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#F5C842', color: '#1A1A1A' }}>
                  1
                </div>
              </div>
              <div>
                <div className="font-semibold text-sm mb-1" style={{ color: '#1A1A1A' }}>We review your submission</div>
                <p className="text-sm text-neutral-600">We check that the details are complete and accurate. This usually takes less than 24 hours.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#F5C842', color: '#1A1A1A' }}>
                  2
                </div>
              </div>
              <div>
                <div className="font-semibold text-sm mb-1" style={{ color: '#1A1A1A' }}>Your listing goes live</div>
                <p className="text-sm text-neutral-600">You'll get a dedicated vendor page at cbw.com.au/vendors/your-business-name. Event planners can find you by suburb, event type, or price.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#F5C842', color: '#1A1A1A' }}>
                  3
                </div>
              </div>
              <div>
                <div className="font-semibold text-sm mb-1" style={{ color: '#1A1A1A' }}>Inquiries start coming in</div>
                <p className="text-sm text-neutral-600">When a contractor submits an inquiry for your cart, we connect you directly. You handle the conversation and booking from there.</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-14">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: '#3B2A1A' }}>Common questions</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-neutral-200 p-4">
              <div className="font-semibold text-sm mb-1" style={{ color: '#1A1A1A' }}>Is it really free?</div>
              <p className="text-sm text-neutral-600">Yes. Listing on CBW is free at launch. No fees, no monthly charges, no commission on bookings. We'll be transparent if that ever changes.</p>
            </div>
            <div className="bg-white rounded-lg border border-neutral-200 p-4">
              <div className="font-semibold text-sm mb-1" style={{ color: '#1A1A1A' }}>Can I update my listing later?</div>
              <p className="text-sm text-neutral-600">Yes. Let us know if your pricing changes, you want to add suburbs, or anything else needs updating. We'll sort it.</p>
            </div>
            <div className="bg-white rounded-lg border border-neutral-200 p-4">
              <div className="font-semibold text-sm mb-1" style={{ color: '#1A1A1A' }}>Do I need to accept every inquiry?</div>
              <p className="text-sm text-neutral-600">No. You're under no obligation to accept any booking. If a date doesn't work or the event isn't right for your cart, just let the contractor know.</p>
            </div>
            <div className="bg-white rounded-lg border border-neutral-200 p-4">
              <div className="font-semibold text-sm mb-1" style={{ color: '#1A1A1A' }}>How do I get listed right now?</div>
              <p className="text-sm text-neutral-600">Email us at hello@cbw.com.au with your details, or reach out through the contact form. We'll get you set up.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-xl p-8 text-center" style={{ background: 'linear-gradient(135deg, #3B2A1A 0%, #6B4226 100%)' }}>
          <h2 className="text-xl font-bold text-white mb-2">Ready to get listed?</h2>
          <p className="text-sm mb-6" style={{ color: '#A0785A' }}>Email us with your details and we'll have you live within 24 hours.</p>
          <a href="mailto:hello@cbw.com.au">
            <Button className="bg-[#F5C842] text-[#1A1A1A] hover:bg-[#E8B430] font-semibold">
              Email to get listed
            </Button>
          </a>
        </div>

        {/* Back link */}
        <div className="mt-12">
          <Link href="/vendors-guide" className="text-sm text-neutral-500 hover:text-neutral-800">
            ← Back to vendor guides
          </Link>
        </div>
      </div>
    </div>
  )
}
