'use client'

import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { type Vendor, type LegacyVendor, type VendorType, formatVendorPrice, isCoffeeShop, isMobileCart } from '@/lib/supabase'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import { Badge, Button } from '@/components/ui'
import { OpenNowBadge } from '@/components/vendors/OpeningHoursDisplay'
import { VendorCard } from '@/components/vendors/VendorCard'

// Lazy load inquiry modal - only loads when needed
const InquiryModal = dynamic(() => import('@/components/booking/SimpleBookingModal').then(mod => ({ default: mod.InquiryModal })), {
  ssr: false,
})

export default function BrowseVendors() {
  const [selectedVendor, setSelectedVendor] = useState<LegacyVendor | null>(null)
  const [showInquiryModal, setShowInquiryModal] = useState(false)
  const [filterVendorType, setFilterVendorType] = useState<VendorType | ''>('')
  const [filterSuburb, setFilterSuburb] = useState('')
  const [filterTag, setFilterTag] = useState('')
  const [filterMaxPrice, setFilterMaxPrice] = useState('')

  // Fetch vendors with React Query - automatic caching and deduplication
  const { data: allVendors = [], isLoading: loading } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('verified', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching vendors:', error)
        throw error
      }

      console.log('Fetched vendors:', data?.map(v => ({ id: v.id, name: v.business_name, type: v.vendor_type })))
      return data as Vendor[]
    },
  })

  // Collect unique suburbs and tags for filters
  const allSuburbs = Array.from(new Set(allVendors.flatMap(v => v.suburbs))).sort()
  const allTags = Array.from(new Set(allVendors.flatMap(v => v.tags))).sort()

  const filtered = allVendors.filter(vendor => {
    // 1. Vendor Type Filter
    if (filterVendorType && vendor.vendor_type !== filterVendorType) return false

    // 2. Suburb Filter
    if (filterSuburb && !vendor.suburbs.includes(filterSuburb)) return false

    // 3. Tag Filter
    if (filterTag && !vendor.tags.includes(filterTag)) return false

    // 4. Price Filter (Logic differs per type)
    if (filterMaxPrice) {
      if (isMobileCart(vendor)) {
        // Mobile cart price_min vs numeric limit
        const maxPrice = parseInt(filterMaxPrice)
        if (!isNaN(maxPrice) && vendor.price_min > maxPrice) return false
      } else if (isCoffeeShop(vendor)) {
        // Coffee shop price_range exact match (e.g., "$$")
        if (vendor.price_range !== filterMaxPrice) return false
      }
    }

    return true
  })

  const clearFilters = () => {
    setFilterVendorType('')
    setFilterSuburb('')
    setFilterTag('')
    setFilterMaxPrice('')
  }

  const hasActiveFilters = filterVendorType || filterSuburb || filterTag || filterMaxPrice

  // Count by type
  const mobileCartCount = filtered.filter(isMobileCart).length
  const coffeeShopCount = filtered.filter(isCoffeeShop).length
  const baristaCount = filtered.filter(v => v.vendor_type === 'barista').length

  // Convert database vendor to legacy format for InquiryModal
  const convertToLegacyVendor = (vendor: Vendor): LegacyVendor => ({
    id: vendor.id,
    slug: vendor.slug,
    businessName: vendor.business_name,
    specialty: vendor.specialty,
    suburbs: vendor.suburbs,
    priceMin: vendor.price_min,
    priceMax: vendor.price_max,
    capacityMin: vendor.capacity_min,
    capacityMax: vendor.capacity_max,
    description: vendor.description || '',
    contactEmail: vendor.contact_email,
    contactPhone: vendor.contact_phone,
    website: vendor.website,
    imageUrl: vendor.image_url,
    tags: vendor.tags
  })

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
        <Header variant="app" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <div className="w-8 h-8 border-2 border-neutral-300 border-t-[#F5C842] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-500 text-sm">Loading vendors...</p>
        </div>
        <Footer />
      </div>
    )
  }

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
            {filtered.length} vendor{filtered.length !== 1 ? 's' : ''} available in Melbourne
            {mobileCartCount > 0 && coffeeShopCount > 0 && (
              <span className="text-neutral-500"> • {mobileCartCount} mobile cart{mobileCartCount !== 1 ? 's' : ''}, {coffeeShopCount} coffee shop{coffeeShopCount !== 1 ? 's' : ''}{baristaCount > 0 ? `, ${baristaCount} barista${baristaCount !== 1 ? 's' : ''}` : ''}</span>
            )}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wider">Vendor type</label>
              <select
                value={filterVendorType}
                onChange={(e) => setFilterVendorType(e.target.value as VendorType | '')}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F5C842] focus:border-[#F5C842]"
              >
                <option value="">All vendors</option>
                <option value="mobile_cart">Mobile Cart</option>
                <option value="coffee_shop">Coffee Shop</option>
                <option value="barista">Independent Barista</option>
              </select>
            </div>

            <div>
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

            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wider">
                {filterVendorType === 'mobile_cart' ? 'Event type' : 'Specialty'}
              </label>
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

            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wider">
                {filterVendorType === 'mobile_cart' ? 'Max price/hr' : 'Price range'}
              </label>
              {filterVendorType === 'coffee_shop' ? (
                <select
                  value={filterMaxPrice}
                  onChange={(e) => setFilterMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F5C842] focus:border-[#F5C842]"
                >
                  <option value="">Any price</option>
                  <option value="$">$ Budget</option>
                  <option value="$$">$$ Moderate</option>
                  <option value="$$$">$$$ Premium</option>
                  <option value="$$$$">$$$$ Luxury</option>
                </select>
              ) : (
                <select
                  value={filterMaxPrice}
                  onChange={(e) => setFilterMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F5C842] focus:border-[#F5C842]"
                >
                  <option value="">Any price</option>
                  <option value="50">Up to $50/hr</option>
                  <option value="80">Up to $80/hr</option>
                  <option value="120">Up to $120/hr</option>
                  <option value="150">Up to $150/hr</option>
                  <option value="250">Up to $250/hr</option>
                </select>
              )}
            </div>

            {hasActiveFilters && (
              <div className="flex items-end">
                <button onClick={clearFilters} className="w-full px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
                  Clear filters
                </button>
              </div>
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
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                onActionClick={(v) => {
                  if (isMobileCart(v as Vendor)) {
                    setSelectedVendor(convertToLegacyVendor(v as Vendor))
                    setShowInquiryModal(true)
                  } else {
                    window.location.href = `/vendors/${v.slug}`
                  }
                }}
              />
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
