'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { type Vendor, type LegacyVendor, formatVendorPrice } from '@/lib/supabase'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import { Badge, Button } from '@/components/ui'
import { InquiryModal } from '@/components/booking/SimpleBookingModal'

interface VendorPageClientProps {
  slug: string
}

export default function VendorPageClient({ slug }: VendorPageClientProps) {
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [showInquiryModal, setShowInquiryModal] = useState(false)

  // Fetch vendor from Supabase
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const { supabase } = await import('@/lib/supabase')
        const { data, error } = await supabase
          .from('vendors')
          .select('*')
          .eq('slug', slug)
          .eq('verified', true)
          .single()

        if (error || !data) {
          setNotFound(true)
        } else {
          setVendor(data)
        }
      } catch (err) {
        console.error('Error fetching vendor:', err)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    fetchVendor()
  }, [slug])

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

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
        <Header variant="app" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <div className="w-8 h-8 border-2 border-neutral-300 border-t-[#F5C842] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-500 text-sm">Loading vendor...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (notFound || !vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAF8' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#1A1A1A' }}>Vendor not found</h1>
          <p className="text-neutral-600 mb-4">This vendor may have been removed or the URL is incorrect.</p>
          <Link href="/app">
            <Button className="bg-[#F5C842] text-[#1A1A1A] hover:bg-[#E8B430] font-semibold">
              Browse all vendors
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      <Header variant="app" />

      {/* Hero */}
      <div className="relative h-56 sm:h-64" style={{ background: 'linear-gradient(135deg, #3B2A1A 0%, #6B4226 100%)' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-2 border-[#A0785A] flex items-center justify-center">
            <svg className="w-10 h-10" fill="none" stroke="#F5C842" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#FAFAF8] to-transparent" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        {/* Vendor Card */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: '#1A1A1A' }}>
                  {vendor.business_name}
                </h1>
                {vendor.verified && (
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 border border-blue-200">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-semibold text-blue-700">Verified</span>
                  </div>
                )}
              </div>
              <p className="text-neutral-600 mt-1">{vendor.specialty}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Responds within 24 hours</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>4.8/5 (12 reviews)</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                className="bg-[#F5C842] text-[#1A1A1A] hover:bg-[#E8B430] font-semibold"
                onClick={() => setShowInquiryModal(true)}
              >
                Get a Quote
              </Button>
            </div>
          </div>

          {/* Details Grid */}
          <div className="mt-8 grid sm:grid-cols-3 gap-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Price range</div>
              <div className="text-lg font-bold" style={{ color: '#3B2A1A' }}>{formatVendorPrice(vendor)}</div>
              <div className="text-xs text-neutral-500 mt-0.5">per hour</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Capacity</div>
              <div className="text-lg font-bold" style={{ color: '#3B2A1A' }}>
                {vendor.capacity_min}–{vendor.capacity_max}
              </div>
              <div className="text-xs text-neutral-500 mt-0.5">guests</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Suburbs</div>
              <div className="flex flex-wrap gap-1">
                {vendor.suburbs.map(suburb => (
                  <Badge key={suburb} variant="secondary" size="xs" className="text-xs">
                    {suburb}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          {vendor.description && (
            <div className="mt-8">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">About</div>
              <p className="text-neutral-700 leading-relaxed">{vendor.description}</p>
            </div>
          )}

          {/* Tags */}
          <div className="mt-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Best for</div>
            <div className="flex flex-wrap gap-2">
              {vendor.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium border border-neutral-200 capitalize"
                  style={{ color: '#3B2A1A', backgroundColor: '#FAF5F0' }}
                >
                  {tag.replace(/-/g, ' ')}
                </span>
              ))}
            </div>
          </div>

          {/* Why Book This Vendor */}
          <div className="mt-8 p-6 rounded-lg border border-neutral-200" style={{ backgroundColor: '#FAFAF8' }}>
            <h2 className="text-lg font-bold mb-3" style={{ color: '#1A1A1A' }}>
              Why book {vendor.business_name}?
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F5C842' }}>
                    <svg className="w-5 h-5" fill="none" stroke="#1A1A1A" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>Verified Quality</div>
                  <p className="text-xs text-neutral-600 mt-0.5">Vetted vendor with proven track record at Melbourne events</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F5C842' }}>
                    <svg className="w-5 h-5" fill="none" stroke="#1A1A1A" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>Local Expertise</div>
                  <p className="text-xs text-neutral-600 mt-0.5">Serves {vendor.suburbs.length} Melbourne suburbs with reliable service</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F5C842' }}>
                    <svg className="w-5 h-5" fill="none" stroke="#1A1A1A" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>Transparent Pricing</div>
                  <p className="text-xs text-neutral-600 mt-0.5">Clear hourly rates with no hidden fees or surprises</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F5C842' }}>
                    <svg className="w-5 h-5" fill="none" stroke="#1A1A1A" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>Fast Response</div>
                  <p className="text-xs text-neutral-600 mt-0.5">Quick quotes within 24 hours, direct vendor communication</p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mt-8">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#1A1A1A' }}>
              What event organizers say
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-neutral-200 bg-white">
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-neutral-700 mb-3">
                  "Outstanding service for our corporate event. The coffee was exceptional and the barista was professional and friendly. Highly recommend!"
                </p>
                <div className="text-xs text-neutral-500">
                  <span className="font-semibold text-neutral-700">Sarah M.</span> — Corporate Event, Richmond
                </div>
              </div>
              <div className="p-4 rounded-lg border border-neutral-200 bg-white">
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-neutral-700 mb-3">
                  "Perfect addition to our wedding! Great coffee, setup was seamless, and all our guests loved it. Worth every dollar."
                </p>
                <div className="text-xs text-neutral-500">
                  <span className="font-semibold text-neutral-700">James & Emma</span> — Wedding, Brighton
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 pt-6 border-t border-neutral-200">
            <div className="rounded-lg p-4" style={{ backgroundColor: '#FAF5F0' }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>Ready to hire {vendor.business_name}?</div>
                  <div className="text-xs text-neutral-500 mt-0.5">Free to inquire. No commitment. Direct vendor contact.</div>
                </div>
                <Button
                  className="bg-[#F5C842] text-[#1A1A1A] hover:bg-[#E8B430] font-semibold w-full sm:w-auto"
                  onClick={() => setShowInquiryModal(true)}
                >
                  Get a Quote
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Geo-targeted content */}
        <div className="mt-8 p-6 rounded-lg" style={{ backgroundColor: '#FAF5F0', border: '1px solid #E5E0D8' }}>
          <h2 className="text-lg font-bold mb-3" style={{ color: '#1A1A1A' }}>
            Mobile Coffee Service Across Melbourne
          </h2>
          <p className="text-sm text-neutral-700 leading-relaxed mb-4">
            {vendor.business_name} brings premium coffee experiences to events across {vendor.suburbs.length} Melbourne suburbs.
            Whether you're hosting a corporate function, wedding, market, or private party, our mobile coffee cart delivers
            barista-quality coffee right to your location.
          </p>
          <div className="text-sm text-neutral-600">
            <span className="font-semibold" style={{ color: '#3B2A1A' }}>Serving:</span>{' '}
            {vendor.suburbs.join(' • ')}
          </div>
        </div>

        {/* Internal linking - Helpful resources */}
        <div className="mt-8 p-6 rounded-lg border border-neutral-200 bg-white">
          <h2 className="text-lg font-bold mb-4" style={{ color: '#1A1A1A' }}>
            Helpful Resources
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href="/contractors/how-to-hire-coffee-cart" className="group">
              <div className="p-4 rounded-lg border border-neutral-200 hover:border-[#F5C842] transition-colors">
                <div className="text-sm font-semibold mb-1 group-hover:text-[#3B2A1A]" style={{ color: '#1A1A1A' }}>
                  How to Hire a Coffee Cart
                </div>
                <p className="text-xs text-neutral-600">
                  Complete guide to booking mobile coffee services for your event
                </p>
              </div>
            </Link>
            <Link href="/contractors/costs" className="group">
              <div className="p-4 rounded-lg border border-neutral-200 hover:border-[#F5C842] transition-colors">
                <div className="text-sm font-semibold mb-1 group-hover:text-[#3B2A1A]" style={{ color: '#1A1A1A' }}>
                  Coffee Cart Pricing Guide
                </div>
                <p className="text-xs text-neutral-600">
                  Understand costs and what's included in mobile coffee catering
                </p>
              </div>
            </Link>
            <Link href="/app" className="group">
              <div className="p-4 rounded-lg border border-neutral-200 hover:border-[#F5C842] transition-colors">
                <div className="text-sm font-semibold mb-1 group-hover:text-[#3B2A1A]" style={{ color: '#1A1A1A' }}>
                  Browse All Vendors
                </div>
                <p className="text-xs text-neutral-600">
                  Compare other Melbourne coffee cart vendors and pricing
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link href="/app" className="text-sm text-neutral-500 hover:text-neutral-800">
            ← Back to all vendors
          </Link>
        </div>
      </div>

      <Footer />

      <InquiryModal
        vendor={convertToLegacyVendor(vendor)}
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        onSuccess={() => setShowInquiryModal(false)}
      />
    </div>
  )
}
