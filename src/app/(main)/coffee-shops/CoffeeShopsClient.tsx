'use client'

import { useState } from 'react'
import Link from 'next/link'
import { type Vendor } from '@/lib/supabase'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import { Badge, Button } from '@/components/ui'
import { OpenNowBadge } from '@/components/vendors/OpeningHoursDisplay'

interface CoffeeShopsClientProps {
  initialCoffeeShops: Vendor[]
  suburbs: string[]
}

export default function CoffeeShopsClient({ initialCoffeeShops, suburbs }: CoffeeShopsClientProps) {
  const [filterSuburb, setFilterSuburb] = useState('')
  const [filterPriceRange, setFilterPriceRange] = useState('')
  const [filterRating, setFilterRating] = useState('')
  const [filterAmenity, setFilterAmenity] = useState('')

  // Collect unique tags
  const allTags = Array.from(new Set(initialCoffeeShops.flatMap(s => s.tags))).sort()

  const filtered = initialCoffeeShops.filter(shop => {
    if (filterSuburb && !shop.suburbs.includes(filterSuburb)) return false
    if (filterPriceRange && shop.price_range !== filterPriceRange) return false
    if (filterRating && shop.average_rating) {
      const minRating = parseFloat(filterRating)
      if (shop.average_rating < minRating) return false
    }
    if (filterAmenity) {
      if (filterAmenity === 'wifi' && !shop.wifi_available) return false
      if (filterAmenity === 'parking' && !shop.parking_available) return false
      if (filterAmenity === 'outdoor' && !shop.outdoor_seating) return false
      if (filterAmenity === 'wheelchair' && !shop.wheelchair_accessible) return false
    }
    return true
  })

  const clearFilters = () => {
    setFilterSuburb('')
    setFilterPriceRange('')
    setFilterRating('')
    setFilterAmenity('')
  }

  const hasActiveFilters = filterSuburb || filterPriceRange || filterRating || filterAmenity

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      <Header variant="app" />

      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #3B2A1A 0%, #6B4226 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
              Melbourne's Best Coffee Shops
            </h1>
            <p className="text-lg sm:text-xl text-neutral-200 max-w-2xl mx-auto mb-6">
              Discover specialty cafes and roasters across {suburbs.length}+ Melbourne suburbs.
              Filter by location, rating, and amenities.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-neutral-300">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#F5C842]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>Verified Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#F5C842]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Live Opening Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#F5C842]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Directions & Maps</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#FAFAF8] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-neutral-600">
            {filtered.length} coffee shop{filtered.length !== 1 ? 's' : ''} in Melbourne
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wider">Suburb</label>
              <select
                value={filterSuburb}
                onChange={(e) => setFilterSuburb(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F5C842] focus:border-[#F5C842]"
              >
                <option value="">All suburbs</option>
                {suburbs.map(suburb => (
                  <option key={suburb} value={suburb}>{suburb}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wider">Price Range</label>
              <select
                value={filterPriceRange}
                onChange={(e) => setFilterPriceRange(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F5C842] focus:border-[#F5C842]"
              >
                <option value="">Any price</option>
                <option value="$">$ Budget</option>
                <option value="$$">$$ Moderate</option>
                <option value="$$$">$$$ Premium</option>
                <option value="$$$$">$$$$ Luxury</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wider">Min Rating</label>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F5C842] focus:border-[#F5C842]"
              >
                <option value="">Any rating</option>
                <option value="4.5">4.5+ stars</option>
                <option value="4.0">4.0+ stars</option>
                <option value="3.5">3.5+ stars</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wider">Amenities</label>
              <select
                value={filterAmenity}
                onChange={(e) => setFilterAmenity(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F5C842] focus:border-[#F5C842]"
              >
                <option value="">All amenities</option>
                <option value="wifi">WiFi Available</option>
                <option value="parking">Parking Available</option>
                <option value="outdoor">Outdoor Seating</option>
                <option value="wheelchair">Wheelchair Accessible</option>
              </select>
            </div>

            {hasActiveFilters && (
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Coffee Shop Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg border border-neutral-200 p-12 text-center">
            <p className="text-neutral-500">No coffee shops match your filters.</p>
            <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline mt-2">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((shop) => (
              <Link
                key={shop.id}
                href={`/vendors/${shop.slug}`}
                className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Card Image */}
                <div className="relative h-40" style={{ background: 'linear-gradient(135deg, #3B2A1A 0%, #6B4226 100%)' }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full border-2 border-[#A0785A] flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="#F5C842" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold px-2 py-1 rounded-full" style={{ color: '#3B2A1A' }}>
                      {shop.price_range || '$$'}
                    </span>
                  </div>
                  {shop.opening_hours && (
                    <div className="absolute top-3 left-3">
                      <OpenNowBadge hours={shop.opening_hours} />
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-1" style={{ color: '#1A1A1A' }}>{shop.business_name}</h3>
                  <p className="text-sm text-neutral-600 mb-3">{shop.specialty}</p>

                  {/* Address */}
                  {shop.physical_address && (
                    <div className="flex items-start gap-1.5 mb-3">
                      <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-xs text-neutral-500 line-clamp-2">{shop.physical_address}</span>
                    </div>
                  )}

                  {/* Rating */}
                  {shop.average_rating && shop.review_count > 0 && (
                    <div className="flex items-center gap-1 mb-3">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-semibold">{shop.average_rating.toFixed(1)}</span>
                      <span className="text-xs text-neutral-500">({shop.review_count} reviews)</span>
                    </div>
                  )}

                  {/* Amenities Icons */}
                  <div className="flex items-center gap-3 mb-3 text-neutral-400">
                    {shop.wifi_available && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                      </svg>
                    )}
                    {shop.parking_available && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                    {shop.outdoor_seating && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {shop.wheelchair_accessible && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>

                  {/* Suburbs */}
                  <div className="flex flex-wrap gap-1">
                    {shop.suburbs.slice(0, 2).map(suburb => (
                      <Badge key={suburb} variant="secondary" className="text-xs">
                        {suburb}
                      </Badge>
                    ))}
                    {shop.suburbs.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{shop.suburbs.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* SEO Content Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#1A1A1A' }}>
              Melbourne's Specialty Coffee Scene
            </h2>
            <div className="prose prose-neutral max-w-none">
              <p className="text-neutral-700 leading-relaxed mb-4">
                Melbourne is renowned worldwide for its exceptional coffee culture and specialty cafe scene.
                Our directory features {initialCoffeeShops.length} verified coffee shops across {suburbs.length} Melbourne suburbs,
                from iconic CBD roasters to hidden neighborhood gems.
              </p>
              <p className="text-neutral-700 leading-relaxed mb-4">
                Each listing includes detailed information to help you find your perfect cafe: live opening hours,
                customer ratings and reviews, exact locations with directions, price ranges, and amenities like WiFi,
                parking, and outdoor seating. Whether you're looking for a quick espresso or a place to work remotely,
                we've got you covered.
              </p>
              <h3 className="text-lg font-bold mt-6 mb-3" style={{ color: '#1A1A1A' }}>
                Popular Melbourne Coffee Suburbs
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                {suburbs.slice(0, 12).map(suburb => (
                  <Link
                    key={suburb}
                    href={`/suburbs/${suburb.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-neutral-600 hover:text-[#3B2A1A] hover:underline"
                  >
                    {suburb}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-8 p-8 rounded-xl text-center" style={{ backgroundColor: '#FAF5F0', border: '1px solid #E5E0D8' }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#1A1A1A' }}>
            Looking for mobile coffee catering?
          </h2>
          <p className="text-neutral-600 mb-4">
            Need a coffee cart for your event? Check out our mobile coffee vendors serving Melbourne events.
          </p>
          <Link href="/app">
            <Button className="bg-[#F5C842] text-[#1A1A1A] hover:bg-[#E8B430] font-semibold">
              Browse Mobile Coffee Cart
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
