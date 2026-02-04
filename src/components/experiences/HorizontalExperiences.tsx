'use client'

import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, Button, Badge } from '@/components/ui'
import { type Vendor, type LegacyVendor, formatVendorPrice } from '@/lib/supabase'
import { InquiryModal } from '@/components/booking/SimpleBookingModal'

export function VendorCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [selectedVendor, setSelectedVendor] = useState<LegacyVendor | null>(null)
  const [showInquiryModal, setShowInquiryModal] = useState(false)
  const [vendors, setVendors] = useState<Vendor[]>([])

  // Fetch vendors from Supabase
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const { supabase } = await import('@/lib/supabase')
        const { data } = await supabase
          .from('vendors')
          .select('*')
          .eq('verified', true)
          .order('created_at', { ascending: false })
          .limit(10)

        setVendors(data || [])
      } catch (err) {
        console.error('Error fetching vendors:', err)
      }
    }

    fetchVendors()
  }, [])

  // Convert database vendor to legacy format for InquiryModal
  const convertToLegacyVendor = (v: Vendor): LegacyVendor => ({
    id: v.id,
    slug: v.slug,
    businessName: v.business_name,
    specialty: v.specialty,
    suburbs: v.suburbs,
    priceMin: v.price_min,
    priceMax: v.price_max,
    capacityMin: v.capacity_min,
    capacityMax: v.capacity_max,
    description: v.description || '',
    contactEmail: v.contact_email,
    contactPhone: v.contact_phone,
    website: v.website,
    imageUrl: v.image_url,
    tags: v.tags
  })

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScrollability()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollability)
      return () => container.removeEventListener('scroll', checkScrollability)
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320
      const newScrollLeft = direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: '#1A1A1A' }}>
            Featured vendors
          </h3>
          <p className="text-neutral-600 mt-1">
            Melbourne's best mobile coffee carts, ready to serve your event
          </p>
        </div>
        <Link href="/app">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            View all {vendors.length} vendors
          </Button>
        </Link>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors touch-manipulation"
            aria-label="Scroll left"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors touch-manipulation"
            aria-label="Scroll right"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth pb-4 px-1 relative"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {vendors.map((vendor) => (
            <Card
              key={vendor.id}
              className="flex-shrink-0 w-72 sm:w-80 overflow-hidden hover:shadow-lg transition-shadow duration-300 relative z-10"
              padding="none"
            >
              {/* Card Image / Placeholder */}
              <div className="relative h-44" style={{ background: 'linear-gradient(135deg, #3B2A1A 0%, #6B4226 100%)' }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-[#A0785A] flex items-center justify-center">
                    <svg className="w-7 h-7" fill="none" stroke="#F5C842" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="outline" className="bg-white/90 backdrop-blur-sm text-xs font-semibold" style={{ color: '#3B2A1A' }}>
                    {formatVendorPrice(vendor)}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-lg" style={{ color: '#1A1A1A' }}>
                      {vendor.business_name}
                    </h4>
                    <p className="text-sm text-neutral-600">{vendor.specialty}</p>
                  </div>

                  <p className="text-sm text-neutral-500 line-clamp-2">
                    {vendor.description}
                  </p>

                  {/* Suburbs */}
                  <div className="flex flex-wrap gap-1">
                    {vendor.suburbs.slice(0, 3).map((suburb) => (
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

                  {/* Capacity */}
                  <div className="text-xs text-neutral-500">
                    Serves {vendor.capacity_min}–{vendor.capacity_max} guests
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      className="flex-1 min-h-[44px] bg-[#F5C842] text-[#1A1A1A] hover:bg-[#E8B430] font-semibold touch-manipulation"
                      onClick={() => {
                        setSelectedVendor(convertToLegacyVendor(vendor))
                        setShowInquiryModal(true)
                      }}
                    >
                      Get a Quote
                    </Button>
                    <Link href={`/vendors/${vendor.slug}`}>
                      <Button size="sm" variant="outline" className="min-h-[44px] touch-manipulation">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>

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

// Keep the old export name as an alias for backwards compatibility with any storybook imports
export const HorizontalExperiences = VendorCarousel
