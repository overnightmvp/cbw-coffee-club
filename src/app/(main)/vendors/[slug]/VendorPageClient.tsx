'use client'

import { useState, useEffect } from 'react'
import { type Vendor, type LegacyVendor, isCoffeeShop, isBarista } from '@/lib/supabase'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import { Button } from '@/components/ui'
import { InquiryModal } from '@/components/booking/SimpleBookingModal'
import { CoffeeShopProfile } from '@/components/vendors/CoffeeShopProfile'
import { MobileCartProfile } from '@/components/vendors/MobileCartProfile'
import { BaristaProfile } from '@/components/vendors/BaristaProfile'
import Link from 'next/link'

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

  // Coffee shop gets its own profile component
  if (isCoffeeShop(vendor)) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
        <Header variant="app" />
        <CoffeeShopProfile vendor={vendor} />
        <Footer />
      </div>
    )
  }

  // Barista profile
  if (isBarista(vendor)) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
        <Header variant="app" />
        <BaristaProfile vendor={vendor} onGetQuoteClick={() => setShowInquiryModal(true)} />
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

  // Mobile cart profile (use extracted component)
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      <Header variant="app" />
      <MobileCartProfile vendor={vendor} onGetQuoteClick={() => setShowInquiryModal(true)} />
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
