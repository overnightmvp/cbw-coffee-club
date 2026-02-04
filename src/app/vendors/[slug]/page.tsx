import { supabaseAdmin } from '@/lib/supabase-admin'
import VendorPageClient from './VendorPageClient'
import JsonLd from '@/components/seo/JsonLd'

const baseUrl = 'https://thebeanroute.com.au'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data: vendor } = await supabaseAdmin
    .from('vendors')
    .select('*')
    .eq('slug', params.slug)
    .eq('verified', true)
    .single()

  if (!vendor) return { title: 'Vendor Not Found | The Bean Route' }

  const priceRange = `$${vendor.price_min}–$${vendor.price_max}/hr`

  return {
    title: `${vendor.business_name} — Mobile Coffee Cart | The Bean Route`,
    description: `${vendor.description} Serving ${vendor.suburbs.join(', ')}. ${priceRange} per hour.`,
    openGraph: {
      title: `${vendor.business_name} — Mobile Coffee Cart | The Bean Route`,
      description: vendor.description,
      type: 'website' as const,
    },
  }
}

export default async function VendorPage({ params }: { params: { slug: string } }) {
  const { data: vendor } = await supabaseAdmin
    .from('vendors')
    .select('*')
    .eq('slug', params.slug)
    .eq('verified', true)
    .single()

  const vendorSchema = vendor
    ? {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: vendor.business_name,
        description: vendor.description,
        url: `${baseUrl}/vendors/${vendor.slug}`,
        areaServed: vendor.suburbs.map((suburb: string) => ({
          '@type': 'Place',
          name: `${suburb}, Melbourne, Victoria, Australia`,
        })),
        priceRange: `$${vendor.price_min}–$${vendor.price_max} AUD/hr`,
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
      { '@type': 'ListItem', position: 3, name: vendor?.business_name || 'Vendor' },
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
