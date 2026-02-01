import { getVendorBySlug, formatPriceRange } from '@/lib/vendors'
import VendorPageClient from './VendorPageClient'
import JsonLd from '@/components/seo/JsonLd'

const baseUrl = 'https://thebeanroute.com.au'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const vendor = getVendorBySlug(params.slug)
  if (!vendor) return { title: 'Vendor Not Found | The Bean Route' }
  return {
    title: `${vendor.businessName} — Mobile Coffee Cart | The Bean Route`,
    description: `${vendor.description} Serving ${vendor.suburbs.join(', ')}. ${formatPriceRange(vendor)} per hour.`,
    openGraph: {
      title: `${vendor.businessName} — Mobile Coffee Cart | The Bean Route`,
      description: vendor.description,
      type: 'website' as const,
    },
  }
}

export default function VendorPage({ params }: { params: { slug: string } }) {
  const vendor = getVendorBySlug(params.slug)

  const vendorSchema = vendor
    ? {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: vendor.businessName,
        description: vendor.description,
        url: `${baseUrl}/vendors/${vendor.slug}`,
        areaServed: vendor.suburbs.map((suburb: string) => ({
          '@type': 'Place',
          name: `${suburb}, Melbourne, Victoria, Australia`,
        })),
        priceRange: `$${vendor.priceMin}–$${vendor.priceMax} AUD/hr`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Melbourne',
          addressRegion: 'Victoria',
          addressCountry: 'Australia',
        },
      }
    : null

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Browse Vendors', item: `${baseUrl}/app` },
      { '@type': 'ListItem', position: 3, name: vendor?.businessName || 'Vendor' },
    ],
  }

  return (
    <>
      {vendorSchema && <JsonLd data={vendorSchema} />}
      <JsonLd data={breadcrumbSchema} />
      <VendorPageClient slug={params.slug} />
    </>
  )
}
