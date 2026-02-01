'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getAllVendors, type Vendor, formatPriceRange } from '@/lib/vendors'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import { Badge, Button } from '@/components/ui'
import { InquiryModal } from '@/components/booking/SimpleBookingModal'

export default function BrowseVendors() {
  const allVendors = getAllVendors()
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [showInquiryModal, setShowInquiryModal] = useState(false)
  const [filterSuburb, setFilterSuburb] = useState('')
  const [filterTag, setFilterTag] = useState('')
  const [filterMaxPrice, setFilterMaxPrice] = useState('')

  // Collect unique suburbs and tags for filters
  const allSuburbs = [...new Set(allVendors.flatMap(v => v.suburbs))].sort()
  const allTags = [...new Set(allVendors.flatMap(v => v.tags))].sort()

  const filtered = allVendors.filter(vendor => {
    if (filterSuburb && !vendor.suburbs.includes(filterSuburb)) return false
    if (filterTag && !vendor.tags.includes(filterTag)) return false
    if (filterMaxPrice && vendor.priceMin > parseInt(filterMaxPrice)) return false
    return true
  })

  const clearFilters = () => {
    setFilterSuburb('')
    setFilterTag('')
    setFilterMaxPrice('')
  }

  const hasActiveFilters = filterSuburb || filterTag || filterMaxPrice

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      <Header variant="app" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: '#1A1A1A' }}>
            Browse all vendors
          </h1>
          <p className="text-neutral-600 mt-1">
            {filtered.length} coffee cart{filtered.length !== 1 ? 's' : ''} available in Melbourne
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-6">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wider">Suburb</label>
              <select
                value={filterSuburb}
                onChange={(e) => setFilterSuburb(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F5C842] focus:border-[#F5C842]"
              >
                <option value="">All suburbs</option>
                {allSuburbs.map(suburb => (
                  <option key={suburb} value={suburb}>{suburb}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wider">Event type</label>
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F5C842] focus:border-[#F5C842]"
              >
                <option value="">All types</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag.replace(/-/g, ' ')}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wider">Max price/hr</label>
              <select
                value={filterMaxPrice}
                onChange={(e) => setFilterMaxPrice(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F5C842] focus:border-[#F5C842]"
              >
                <option value="">Any price</option>
                <option value="150">Up to $150</option>
                <option value="200">Up to $200</option>
                <option value="250">Up to $250</option>
                <option value="350">Up to $350</option>
                <option value="500">Up to $500</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-sm text-neutral-500 hover:text-neutral-800 underline">
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Vendor Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg border border-neutral-200 p-12 text-center">
            <p className="text-neutral-500">No vendors match your filters.</p>
            <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline mt-2">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((vendor) => (
              <div key={vendor.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Card Image */}
                <div className="relative h-40" style={{ background: 'linear-gradient(135deg, #3B2A1A 0%, #6B4226 100%)' }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full border-2 border-[#A0785A] flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="#F5C842" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold px-2 py-1 rounded-full" style={{ color: '#3B2A1A' }}>
                      {formatPriceRange(vendor)}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-1" style={{ color: '#1A1A1A' }}>{vendor.businessName}</h3>
                  <p className="text-sm text-neutral-600 mb-3">{vendor.specialty}</p>
                  <p className="text-sm text-neutral-500 mb-3 line-clamp-2">{vendor.description}</p>

                  {/* Suburbs */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {vendor.suburbs.slice(0, 3).map(suburb => (
                      <Badge key={suburb} variant="secondary" size="xs" className="text-xs">
                        {suburb}
                      </Badge>
                    ))}
                    {vendor.suburbs.length > 3 && (
                      <Badge variant="outline" size="xs" className="text-xs">
                        +{vendor.suburbs.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="text-xs text-neutral-500 mb-4">
                    Serves {vendor.capacityMin}–{vendor.capacityMax} guests
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-[#F5C842] text-[#1A1A1A] hover:bg-[#E8B430] font-semibold"
                      onClick={() => {
                        setSelectedVendor(vendor)
                        setShowInquiryModal(true)
                      }}
                    >
                      Get a Quote
                    </Button>
                    <Link href={`/vendors/${vendor.slug}`}>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* Inquiry Modal */}
      <InquiryModal
        vendor={selectedVendor}
        isOpen={showInquiryModal}
        onClose={() => {
          setShowInquiryModal(false)
          setSelectedVendor(null)
        }}
        onSuccess={() => {
          setShowInquiryModal(false)
          setSelectedVendor(null)
        }}
      />
    </div>
  )
}
