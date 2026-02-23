'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { type Vendor, type LegacyVendor, type VendorType, formatVendorPrice, isCoffeeShop, isMobileCart } from '@/lib/supabase'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import { Badge, Button } from '@/components/ui'
import { InquiryModal } from '@/components/booking/SimpleBookingModal'
import { OpenNowBadge } from '@/components/vendors/OpeningHoursDisplay'

export default function BrowseVendors() {
  const [allVendors, setAllVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVendor, setSelectedVendor] = useState<LegacyVendor | null>(null)
  const [showInquiryModal, setShowInquiryModal] = useState(false)
  const [filterVendorType, setFilterVendorType] = useState<VendorType | ''>('')
  const [filterSuburb, setFilterSuburb] = useState('')
  const [filterTag, setFilterTag] = useState('')
  const [filterMaxPrice, setFilterMaxPrice] = useState('')

  // Fetch vendors from Supabase
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const { supabase } = await import('@/lib/supabase')
        const { data, error } = await supabase
          .from('vendors')
          .select('*')
          .eq('verified', true)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching vendors:', error)
        } else {
          console.log('Fetched vendors:', data?.map(v => ({ id: v.id, name: v.business_name, type: v.vendor_type })))
          setAllVendors(data || [])
        }
      } catch (err) {
        console.error('Unexpected error fetching vendors:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchVendors()
  }, [])

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
              <span className="text-neutral-500"> • {mobileCartCount} mobile cart{mobileCartCount !== 1 ? 's' : ''}, {coffeeShopCount} coffee shop{coffeeShopCount !== 1 ? 's' : ''}</span>
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
                  <option value="150">Up to $150</option>
                  <option value="200">Up to $200</option>
                  <option value="250">Up to $250</option>
                  <option value="350">Up to $350</option>
                  <option value="500">Up to $500</option>
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
            {filtered.map((vendor) => {
              const isShop = isCoffeeShop(vendor)
              const isCart = isMobileCart(vendor)

              return (
                <div key={vendor.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Card Image */}
                  <div className="relative h-40" style={{ background: 'linear-gradient(135deg, #3B2A1A 0%, #6B4226 100%)' }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full border-2 border-[#A0785A] flex items-center justify-center">
                        {isShop ? (
                          <svg className="w-6 h-6" fill="none" stroke="#F5C842" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" fill="none" stroke="#F5C842" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      {isShop ? (
                        <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold px-2 py-1 rounded-full" style={{ color: '#3B2A1A' }}>
                          {vendor.price_range || '$$'}
                        </span>
                      ) : (
                        <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold px-2 py-1 rounded-full" style={{ color: '#3B2A1A' }}>
                          {formatVendorPrice(vendor)}
                        </span>
                      )}
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#F5C842] text-[#1A1A1A] text-xs font-semibold px-2 py-1 rounded-full">
                        {isShop ? 'Coffee Shop' : 'Mobile Cart'}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-lg font-bold" style={{ color: '#1A1A1A' }}>{vendor.business_name}</h3>
                      {isShop && vendor.opening_hours && <OpenNowBadge hours={vendor.opening_hours} />}
                    </div>
                    <p className="text-sm text-neutral-600 mb-3">{vendor.specialty}</p>

                    {/* Coffee Shop specific info */}
                    {isShop && (
                      <>
                        {vendor.physical_address && (
                          <div className="flex items-start gap-1.5 mb-2">
                            <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-xs text-neutral-500 line-clamp-1">{vendor.physical_address}</span>
                          </div>
                        )}
                        {vendor.average_rating && vendor.review_count > 0 && (
                          <div className="flex items-center gap-1 mb-3">
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-xs font-semibold">{vendor.average_rating.toFixed(1)}</span>
                            <span className="text-xs text-neutral-500">({vendor.review_count})</span>
                          </div>
                        )}
                      </>
                    )}

                    {/* Mobile Cart specific info */}
                    {isCart && (
                      <>
                        <p className="text-sm text-neutral-500 mb-3 line-clamp-2">{vendor.description}</p>
                        <div className="text-xs text-neutral-500 mb-3">
                          Serves {vendor.capacity_min}–{vendor.capacity_max} guests
                        </div>
                      </>
                    )}

                    {/* Suburbs */}
                    <div className="flex flex-wrap gap-1 mb-4">
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

                    {/* Actions */}
                    <div className="flex gap-2">
                      {isCart ? (
                        <Button
                          size="sm"
                          className="flex-1 bg-[#F5C842] text-[#1A1A1A] hover:bg-[#E8B430] font-semibold"
                          onClick={() => {
                            setSelectedVendor(convertToLegacyVendor(vendor))
                            setShowInquiryModal(true)
                          }}
                        >
                          Get a Quote
                        </Button>
                      ) : (
                        <Link href={`/vendors/${vendor.slug}`} className="flex-1">
                          <Button size="sm" className="w-full bg-[#F5C842] text-[#1A1A1A] hover:bg-[#E8B430] font-semibold">
                            View Details
                          </Button>
                        </Link>
                      )}
                      <Link href={`/vendors/${vendor.slug}`}>
                        <Button size="sm" variant="outline">
                          {isShop ? 'Full Info' : 'View'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
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
