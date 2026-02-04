'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { type Vendor as LegacyVendor } from '@/lib/vendors'
import { type Vendor, formatVendorPrice } from '@/lib/supabase'
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
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: '#1A1A1A' }}>
                {vendor.business_name}
              </h1>
              <p className="text-neutral-600 mt-1">{vendor.specialty}</p>
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
