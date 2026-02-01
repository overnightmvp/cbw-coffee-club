import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3B2A1A 0%, #6B4226 100%)' }}>
                <span className="text-[#F5C842] font-bold text-sm">C</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-bold tracking-tight" style={{ color: '#3B2A1A' }}>TBR</span>
                <span className="text-xs font-medium tracking-widest uppercase" style={{ color: '#A0785A' }}>The Bean Route</span>
              </div>
            </Link>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
              Melbourne&apos;s mobile coffee cart marketplace. Find and book for your next event.
            </p>
          </div>

          {/* Browse */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#3B2A1A' }}>Browse</h4>
            <ul className="space-y-3">
              <li><Link href="/app" className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors">All Vendors</Link></li>
              <li><Link href="/jobs" className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors">Jobs</Link></li>
            </ul>
          </div>

          {/* Event Planners */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#3B2A1A' }}>For Event Planners</h4>
            <ul className="space-y-3">
              <li><Link href="/contractors" className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors">Hiring Guides</Link></li>
              <li><Link href="/contractors/how-to-hire" className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors">How to Hire</Link></li>
              <li><Link href="/contractors/coffee-cart-costs" className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors">Costs &amp; Pricing</Link></li>
            </ul>
          </div>

          {/* Vendors */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#3B2A1A' }}>For Vendors</h4>
            <ul className="space-y-3">
              <li><Link href="/vendors-guide" className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors">Vendor Guides</Link></li>
              <li><Link href="/vendors-guide/get-listed" className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors">Get Listed</Link></li>
              <li><Link href="/vendors-guide/grow-your-business" className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors">Grow Your Business</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-xs text-neutral-400">&copy; 2025 The Bean Route. Melbourne, Victoria, Australia.</p>
          <div className="flex items-center gap-6">
            <a href="mailto:hello@thebeanroute.com.au" className="text-xs text-neutral-500 hover:text-neutral-800 transition-colors">Contact</a>
            <Link href="/sitemap.xml" className="text-xs text-neutral-500 hover:text-neutral-800 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
