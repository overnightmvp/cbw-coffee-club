'use client'

import { useState } from 'react'
import Link from 'next/link'
import { type Vendor, isCoffeeShop, isMobileCart, formatVendorPrice } from '@/lib/supabase'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import { Badge, Button } from '@/components/ui'
import { OpenNowBadge } from '@/components/vendors/OpeningHoursDisplay'

interface SuburbPageClientProps {
  suburbName: string
  suburbSlug: string
  coffeeShops: Vendor[]
  mobileCarts: Vendor[]
  nearbySuburbs: string[]
}

export default function SuburbPageClient({
  suburbName,
  suburbSlug,
  coffeeShops,
  mobileCarts,
  nearbySuburbs,
}: SuburbPageClientProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'shops' | 'carts'>('all')

  const allVendors = [...coffeeShops, ...mobileCarts].sort((a, b) => {
    // Sort by rating, with unrated items last
    const ratingA = a.average_rating || 0
    const ratingB = b.average_rating || 0
    return ratingB - ratingA
  })

  const displayVendors =
    activeTab === 'shops' ? coffeeShops :
      activeTab === 'carts' ? mobileCarts :
        allVendors

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      <Header variant="app" />

      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #3B2A1A 0%, #6B4226 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            {/* Breadcrumbs */}
            <div className="flex items-center justify-center gap-2 text-sm text-neutral-300 mb-4">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>→</span>
              <Link href="/suburbs" className="hover:text-white">Suburbs</Link>
              <span>→</span>
              <span className="text-white font-semibold">{suburbName}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3">
              Coffee in {suburbName}
            </h1>
            <p className="text-lg sm:text-xl text-neutral-200 max-w-2xl mx-auto mb-6">
              {coffeeShops.length > 0 && mobileCarts.length > 0 && (
                `${coffeeShops.length} coffee shop${coffeeShops.length !== 1 ? 's' : ''} and ${mobileCarts.length} mobile cart${mobileCarts.length !== 1 ? 's' : ''} serving ${suburbName}, Melbourne`
              )}
              {coffeeShops.length > 0 && mobileCarts.length === 0 && (
                `${coffeeShops.length} specialty coffee shop${coffeeShops.length !== 1 ? 's' : ''} in ${suburbName}, Melbourne`
              )}
              {coffeeShops.length === 0 && mobileCarts.length > 0 && (
                `${mobileCarts.length} mobile coffee cart${mobileCarts.length !== 1 ? 's' : ''} serving ${suburbName}, Melbourne`
              )}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-neutral-300">
              {coffeeShops.length > 0 && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#F5C842]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Local Cafes</span>
                </div>
              )}
              {mobileCarts.length > 0 && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#F5C842]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Event Catering</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#F5C842]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>Verified Reviews</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#FAFAF8] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap ${activeTab === 'all'
                ? 'bg-[#F5C842] text-[#1A1A1A]'
                : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200'
              }`}
          >
            All ({allVendors.length})
          </button>
          {coffeeShops.length > 0 && (
            <button
              onClick={() => setActiveTab('shops')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap ${activeTab === 'shops'
                  ? 'bg-[#F5C842] text-[#1A1A1A]'
                  : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200'
                }`}
            >
              Coffee Shop ({coffeeShops.length})
            </button>
          )}
          {mobileCarts.length > 0 && (
            <button
              onClick={() => setActiveTab('carts')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap ${activeTab === 'carts'
                  ? 'bg-[#F5C842] text-[#1A1A1A]'
                  : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200'
                }`}
            >
              Mobile Cart ({mobileCarts.length})
            </button>
          )}
        </div>

        {/* Vendor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayVendors.map((vendor) => {
            const isShop = isCoffeeShop(vendor)

            return (
              <Link
                key={vendor.id}
                href={`/vendors/${vendor.slug}`}
                className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow"
              >
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
                  {isShop && vendor.opening_hours && (
                    <div className="absolute top-3 left-3">
                      <OpenNowBadge hours={vendor.opening_hours} />
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-[#F5C842] text-[#1A1A1A] text-xs font-semibold px-2 py-1 rounded-full">
                      {isShop ? 'Coffee Shop' : 'Mobile Cart'}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-1" style={{ color: '#1A1A1A' }}>{vendor.business_name}</h3>
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
                  {!isShop && (
                    <div className="text-xs text-neutral-500 mb-3">
                      Serves {vendor.capacity_min}–{vendor.capacity_max} guests
                    </div>
                  )}

                  {/* Tags */}
                  {vendor.tags && vendor.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {vendor.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" size="xs" className="text-xs">
                          {tag.replace(/-/g, ' ')}
                        </Badge>
                      ))}
                      {vendor.tags.length > 2 && (
                        <Badge variant="outline" size="xs" className="text-xs">
                          +{vendor.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {/* About Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-xl border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#1A1A1A' }}>
              About Coffee in {suburbName}
            </h2>
            <div className="prose prose-neutral max-w-none">
              <p className="text-neutral-700 leading-relaxed mb-4">
                {suburbName} is part of Melbourne's vibrant coffee scene, with {allVendors.length} verified vendor{allVendors.length !== 1 ? 's' : ''} listed on The Bean Route.
                {coffeeShops.length > 0 && ` Discover ${coffeeShops.length} local coffee shop${coffeeShops.length !== 1 ? 's' : ''} with specialty beans, comfortable seating, and Melbourne's signature cafe culture.`}
                {mobileCarts.length > 0 && ` Need mobile coffee catering? ${mobileCarts.length} professional cart${mobileCarts.length !== 1 ? 's' : ''} serve ${suburbName} for weddings, corporate events, and private functions.`}
              </p>
              {coffeeShops.length > 0 && (
                <p className="text-neutral-700 leading-relaxed mb-4">
                  Each coffee shop listing includes detailed information: opening hours with live "Open Now" status,
                  customer ratings and reviews, exact address with directions, price ranges, and amenities like WiFi
                  and parking. Find the perfect local cafe for your morning coffee, remote work, or catch-up with friends.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Nearby Suburbs */}
        {nearbySuburbs.length > 0 && (
          <div className="p-6 rounded-xl border border-neutral-200 bg-white mb-12">
            <h2 className="text-xl font-bold mb-4" style={{ color: '#1A1A1A' }}>
              Coffee in Nearby Melbourne Suburbs
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {nearbySuburbs.map(suburb => (
                <Link
                  key={suburb}
                  href={`/suburbs/${suburb.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm text-neutral-600 hover:text-[#3B2A1A] hover:underline p-2 rounded hover:bg-neutral-50 transition-colors"
                >
                  {suburb}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA Sections */}
        <div className="grid sm:grid-cols-2 gap-6">
          {coffeeShops.length === 0 && (
            <div className="p-6 rounded-xl text-center" style={{ backgroundColor: '#FAF5F0', border: '1px solid #E5E0D8' }}>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#1A1A1A' }}>
                Browse All Coffee Shops
              </h3>
              <p className="text-sm text-neutral-600 mb-4">
                Explore specialty cafes across Melbourne
              </p>
              <Link href="/coffee-shops">
                <Button className="bg-[#F5C842] text-[#1A1A1A] hover:bg-[#E8B430] font-semibold">
                  View Coffee Shop
                </Button>
              </Link>
            </div>
          )}
          {mobileCarts.length === 0 && (
            <div className="p-6 rounded-xl text-center" style={{ backgroundColor: '#FAF5F0', border: '1px solid #E5E0D8' }}>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#1A1A1A' }}>
                Book Mobile Coffee Carts
              </h3>
              <p className="text-sm text-neutral-600 mb-4">
                Find mobile baristas for your Melbourne event
              </p>
              <Link href="/app">
                <Button className="bg-[#F5C842] text-[#1A1A1A] hover:bg-[#E8B430] font-semibold">
                  Browse Mobile Cart
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
