import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import { Button } from '@/components/ui'
import JsonLd from '@/components/seo/JsonLd'

const baseUrl = 'https://thebeanroute.com.au'

export const metadata: Metadata = {
  title: 'How to Hire a Mobile Coffee Cart | The Bean Route',
  description: 'Step-by-step guide to booking a mobile coffee cart for your event in Melbourne. From first inquiry to great coffee.',
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to hire a mobile coffee cart',
  description: 'Step-by-step guide to booking a mobile coffee cart for your event in Melbourne.',
  url: `${baseUrl}/contractors/how-to-hire`,
  step: [
    { '@type': 'HowToStep', name: 'Know what you need', text: 'Define your guest count, event type, and venue before searching.' },
    { '@type': 'HowToStep', name: 'Find the right cart', text: 'Browse vendors by suburb, specialty, and price range on The Bean Route.' },
    { '@type': 'HowToStep', name: 'Submit an inquiry', text: 'Fill in your event details. Free to inquire, no commitment.' },
    { '@type': 'HowToStep', name: 'Confirm the details', text: 'Work out logistics and pricing directly with the vendor.' },
    { '@type': 'HowToStep', name: 'Enjoy the coffee', text: 'The vendor handles setup, service, and pack-down on the day.' },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
    { '@type': 'ListItem', position: 2, name: 'Contractors', item: `${baseUrl}/contractors` },
    { '@type': 'ListItem', position: 3, name: 'How to hire' },
  ],
}

export default function HowToHire() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      <JsonLd data={howToSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Header variant="app" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumb */}
        <div className="text-xs text-neutral-500 mb-8">
          <Link href="/contractors" className="hover:text-neutral-800">Contractors</Link>
          <span className="mx-2">/</span>
          <span>How to hire</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#A0785A' }}>
            Contractor Guide
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{ color: '#1A1A1A' }}>
            How to hire a mobile coffee cart
          </h1>
          <p className="text-lg text-neutral-600 leading-relaxed">
            Hiring a mobile coffee cart in Melbourne is straightforward. Here's exactly how the process works, from first thought to great coffee at your event.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-10 mb-16">
          {/* Step 1 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#F5C842', color: '#1A1A1A' }}>
                01
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2" style={{ color: '#1A1A1A' }}>Know what you need</h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                Before you start looking, nail down the basics. How many guests? What's the event — corporate morning tea, a wedding, a festival? Do you have a venue locked in, or are you still deciding?
              </p>
              <p className="text-neutral-600 leading-relaxed">
                These details matter because coffee carts vary in size and setup. A cart that works beautifully at a 50-person corporate breakfast might not suit a 200-person outdoor festival. Knowing your numbers upfront saves time for everyone.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#F5C842', color: '#1A1A1A' }}>
                02
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2" style={{ color: '#1A1A1A' }}>Find the right cart</h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                Not all coffee carts are the same. Some specialise in pour-over and single-origin beans. Others offer cold brew, nitro coffee, or full espresso setups with milk steaming. A few focus on the experience — latte art, premium beans, curated menus.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                Browse by suburb, event type, or price range to find carts that match your needs. Check their specialty and read the details — it tells you a lot about the quality and style of service.
              </p>
              <div className="mt-4">
                <Link href="/app">
                  <Button size="sm" className="bg-[#F5C842] text-[#1A1A1A] hover:bg-[#E8B430] font-semibold">
                    Browse vendors
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#F5C842', color: '#1A1A1A' }}>
                03
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2" style={{ color: '#1A1A1A' }}>Submit an inquiry</h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                Once you've found a cart you like, hit "Get a Quote." You'll fill in your event details — date, location, guest count, duration — and we'll connect you directly with the vendor.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                It's free to inquire. No commitment, no obligation. You're simply asking for a quote. Most vendors respond within 24 hours.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#F5C842', color: '#1A1A1A' }}>
                04
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2" style={{ color: '#1A1A1A' }}>Confirm the details</h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                The vendor will get back to you with pricing, availability, and any questions about your event. Most bookings involve a short back-and-forth to sort logistics — power access, parking, setup space, and menu preferences.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                Once you're both happy, you confirm directly with the vendor. Payment terms vary — some require a deposit, others invoice on the day. Sort that out with them directly.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#F5C842', color: '#1A1A1A' }}>
                05
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2" style={{ color: '#1A1A1A' }}>Enjoy the coffee</h2>
              <p className="text-neutral-600 leading-relaxed">
                The vendor handles everything on the day — setup, equipment, beans, baristas, and pack-down. Your only job is to enjoy it. Most carts arrive 30–60 minutes before your event starts to set up and get ready to serve.
              </p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-12">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: '#3B2A1A' }}>Things to keep in mind</h3>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-neutral-400 flex-shrink-0">—</span>
              <span className="text-sm text-neutral-600"><strong className="text-neutral-800">Book early for weekends and peak season.</strong> October through March is busy in Melbourne. If your event is on a Saturday, reach out at least 2–3 weeks ahead.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-neutral-400 flex-shrink-0">—</span>
              <span className="text-sm text-neutral-600"><strong className="text-neutral-800">Check power access.</strong> Most espresso carts need a 240V outlet or a generator. Ask your venue before you book.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-neutral-400 flex-shrink-0">—</span>
              <span className="text-sm text-neutral-600"><strong className="text-neutral-800">Water supply matters.</strong> Some carts carry their own water. Others need a tap nearby. Confirm with the vendor.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-neutral-400 flex-shrink-0">—</span>
              <span className="text-sm text-neutral-600"><strong className="text-neutral-800">Consider the weather.</strong> Most carts can handle light rain with a canopy, but a full downpour is a different story. Have a backup plan for outdoor events.</span>
            </li>
          </ul>
        </div>

        {/* Back link */}
        <Link href="/contractors" className="text-sm text-neutral-500 hover:text-neutral-800">
          ← Back to contractor guides
        </Link>
      </div>

      <Footer />
    </div>
  )
}
