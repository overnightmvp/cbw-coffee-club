import Link from 'next/link'
import { Header } from '@/components/navigation/Header'

export default function GrowYourBusiness() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      <Header variant="app" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumb */}
        <div className="text-xs text-neutral-500 mb-8">
          <Link href="/vendors-guide" className="hover:text-neutral-800">Vendor Guide</Link>
          <span className="mx-2">/</span>
          <span>Grow your business</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#A0785A' }}>
            Vendor Guide
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{ color: '#1A1A1A' }}>
            How to grow your mobile coffee cart business
          </h1>
          <p className="text-lg text-neutral-600 leading-relaxed">
            Melbourne's mobile coffee scene is competitive. Here's how to stand out, turn inquiries into bookings, and build a business that grows on reputation.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-14">
          {/* Section 1 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#F5C842', color: '#1A1A1A' }}>
                01
              </div>
              <h2 className="text-xl font-bold" style={{ color: '#1A1A1A' }}>Know your niche</h2>
            </div>
            <p className="text-neutral-600 leading-relaxed mb-3">
              The operators who grow fastest aren't trying to be everything to everyone. They pick a lane and own it. Maybe you do the best nitro coffee in Melbourne. Maybe you're the go-to for corporate mornings. Maybe your latte art is so good it becomes an event highlight.
            </p>
            <p className="text-neutral-600 leading-relaxed">
              A clear specialty makes you memorable. It also makes it easier for event planners to choose you — they're not comparing 20 identical carts, they're picking the one that fits their vibe.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#F5C842', color: '#1A1A1A' }}>
                02
              </div>
              <h2 className="text-xl font-bold" style={{ color: '#1A1A1A' }}>Respond to inquiries fast</h2>
            </div>
            <p className="text-neutral-600 leading-relaxed mb-3">
              When someone submits an inquiry through CBW, they're actively looking. They might have 2–3 carts in mind. The vendor who responds first and sounds professional gets the edge.
            </p>
            <p className="text-neutral-600 leading-relaxed">
              Aim to reply within a few hours. A quick, helpful response — even if it's just "Thanks, I can confirm availability and pricing by end of day" — signals that you're reliable. That matters more than you think.
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#F5C842', color: '#1A1A1A' }}>
                03
              </div>
              <h2 className="text-xl font-bold" style={{ color: '#1A1A1A' }}>Price with confidence</h2>
            </div>
            <p className="text-neutral-600 leading-relaxed mb-3">
              A common mistake is underpricing to win bookings. It leads to burnout and thin margins. Melbourne's event market respects quality — and quality has a price.
            </p>
            <p className="text-neutral-600 leading-relaxed mb-3">
              Know your costs: beans, milk, cups, fuel, your time, equipment wear. Then price so you're covering costs and earning a fair wage for your skill. If you're using single-origin beans and a skilled barista, that's worth more than a budget setup.
            </p>
            <div className="bg-white rounded-lg border border-neutral-200 p-4">
              <p className="text-sm text-neutral-600">
                <strong className="text-neutral-800">Quick pricing check:</strong> If you're earning less than $50/hr after costs, you're undercharging. Melbourne coffee carts typically run at $150–$400/hr depending on setup and specialty.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#F5C842', color: '#1A1A1A' }}>
                04
              </div>
              <h2 className="text-xl font-bold" style={{ color: '#1A1A1A' }}>Build on repeat business</h2>
            </div>
            <p className="text-neutral-600 leading-relaxed mb-3">
              Corporate clients book coffee carts repeatedly. If you nail a quarterly team event at a CBD office, that's 4 bookings a year from one client. Focus on being easy to work with.
            </p>
            <p className="text-neutral-600 leading-relaxed">
              Arrive on time. Be professional. Clean up perfectly. Follow up the next day to check they were happy. Word of mouth in Melbourne's corporate events scene is fast. One great experience leads to introductions.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#F5C842', color: '#1A1A1A' }}>
                05
              </div>
              <h2 className="text-xl font-bold" style={{ color: '#1A1A1A' }}>Expand your suburbs strategically</h2>
            </div>
            <p className="text-neutral-600 leading-relaxed mb-3">
              It's tempting to list every suburb in Melbourne on your profile. Don't. Travel time is unpaid time. Pick the suburbs where you can realistically serve events without burning yourself out.
            </p>
            <p className="text-neutral-600 leading-relaxed">
              Start with 3–5 suburbs close to your base. As you build demand and revenue, expand outward. Each new suburb is a new market — treat it that way.
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#F5C842', color: '#1A1A1A' }}>
                06
              </div>
              <h2 className="text-xl font-bold" style={{ color: '#1A1A1A' }}>Keep your listing current</h2>
            </div>
            <p className="text-neutral-600 leading-relaxed">
              Your CBW listing is your first impression. If your pricing has changed, update it. If you've added a new menu item or a second barista, let us know. A stale listing means missed inquiries and contractors who move on to someone else.
            </p>
          </div>
        </div>

        {/* Reality check box */}
        <div className="mt-14 rounded-xl p-6" style={{ backgroundColor: '#FAF5F0' }}>
          <h3 className="text-sm font-bold mb-3" style={{ color: '#3B2A1A' }}>The honest truth about growing a coffee cart business</h3>
          <p className="text-sm text-neutral-600 leading-relaxed mb-3">
            It's not overnight. The first few bookings come from hustle — direct outreach, showing up at local events, building a name. CBW helps with the long game: being discoverable when someone's planning an event and searching for a cart.
          </p>
          <p className="text-sm text-neutral-600 leading-relaxed">
            The operators who make it work treat it like a business, not just a side gig. Good coffee is the minimum. The business around it — pricing, communication, reliability — is what separates the ones who grow.
          </p>
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
