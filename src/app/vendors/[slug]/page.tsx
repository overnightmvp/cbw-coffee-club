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

  const suburbList = vendor.suburbs.slice(0, 3).join(', ')
  const moreSuburbs = vendor.suburbs.length > 3 ? ` + ${vendor.suburbs.length - 3} more` : ''

  return {
    title: `${vendor.business_name} — Mobile Coffee Cart Melbourne | ${priceRange}/hr`,
    description: `Book ${vendor.business_name} for your Melbourne event. ${vendor.specialty} • Serves ${suburbList}${moreSuburbs} • ${priceRange}/hr • ${vendor.capacity_min}-${vendor.capacity_max} guests • Get a free quote today!`,
    openGraph: {
      title: `${vendor.business_name} — Mobile Coffee Cart | The Bean Route`,
      description: `${vendor.specialty} serving ${suburbList}${moreSuburbs}. ${priceRange} per hour. Book your Melbourne event coffee cart today!`,
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
        '@type': ['LocalBusiness', 'FoodEstablishment'],
        name: vendor.business_name,
        description: vendor.description,
        url: `${baseUrl}/vendors/${vendor.slug}`,
        image: vendor.image_url || `${baseUrl}/og-image.png`,
        telephone: vendor.contact_phone || undefined,
        email: vendor.contact_email || undefined,
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
        servesCuisine: 'Coffee',
        knowsAbout: ['Specialty Coffee', 'Mobile Coffee Service', 'Event Catering', 'Barista Service'],
        slogan: vendor.specialty,
        aggregateRating: vendor.verified
          ? {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '12',
              bestRating: '5',
              worstRating: '1',
            }
          : undefined,
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

  const faqSchema = vendor
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `How much does ${vendor.business_name} charge for mobile coffee service?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${vendor.business_name} charges between $${vendor.price_min} and $${vendor.price_max} AUD per hour for mobile coffee cart services in Melbourne. Final pricing depends on event duration, guest count, and specific requirements.`,
            },
          },
          {
            '@type': 'Question',
            name: `What areas does ${vendor.business_name} serve in Melbourne?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${vendor.business_name} serves the following Melbourne suburbs: ${vendor.suburbs.join(', ')}. They specialize in ${vendor.specialty} and can accommodate events with ${vendor.capacity_min} to ${vendor.capacity_max} guests.`,
            },
          },
          {
            '@type': 'Question',
            name: 'How far in advance should I book a mobile coffee cart?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We recommend booking your mobile coffee cart at least 2-4 weeks in advance for standard events. For peak seasons (corporate events season, weddings during summer) or large events with 100+ guests, book 6-8 weeks ahead to ensure availability.',
            },
          },
          {
            '@type': 'Question',
            name: 'What does a mobile coffee cart service include?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Mobile coffee cart services typically include a professional barista, premium espresso machine, high-quality coffee beans, milk alternatives, cups and lids, and basic supplies. Setup and pack-down time is included in the hourly rate. Additional options may include tea service, hot chocolate, and custom branding.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I get a quote from this coffee cart vendor?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Click the "Get a Quote" button to submit your event details including date, location, expected guest count, and event duration. ${vendor.business_name} will respond directly with a custom quote typically within 24 hours. There's no obligation to book.`,
            },
          },
        ],
      }
    : null

  return (
    <>
      {vendorSchema && <JsonLd data={vendorSchema} />}
      <JsonLd data={breadcrumbSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <VendorPageClient slug={params.slug} />
    </>
  )
}
