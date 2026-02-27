'use client'

import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { type Vendor, type LegacyVendor } from '@/lib/supabase'
import { InquiryModal } from '@/components/booking/SimpleBookingModal'
import { VendorCard } from '@/components/vendors/VendorCard'

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
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
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
          className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth pb-4 px-1 relative [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {vendors.map((vendor) => (
            <div key={vendor.id} className="flex-shrink-0 w-72 sm:w-80">
              <VendorCard
                vendor={vendor}
                onActionClick={(v) => {
                  setSelectedVendor(convertToLegacyVendor(v as Vendor))
                  setShowInquiryModal(true)
                }}
                actionLabel="Get a Quote"
              />
            </div>
          ))}
        </div>
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
