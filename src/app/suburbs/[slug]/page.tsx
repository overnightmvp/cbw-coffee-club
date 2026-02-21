import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import SuburbPageClient from './SuburbPageClient'
import JsonLd from '@/components/seo/JsonLd'

const baseUrl = 'https://thebeanroute.com.au'

interface SuburbPageProps {
  params: Promise<{ slug: string }>
}

// Helper to convert slug to display name
function slugToSuburbName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Helper to convert suburb name to slug
function suburbNameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-')
}

export async function generateMetadata({ params }: SuburbPageProps): Promise<Metadata> {
  const { slug } = await params
  const suburbName = slugToSuburbName(slug)

  // Fetch vendors for this suburb
  const { data: vendors } = await supabaseAdmin
    .from('vendors')
    .select('*')
    .eq('verified', true)
    .contains('suburbs', [suburbName])

  if (!vendors || vendors.length === 0) {
    return {
      title: `${suburbName} Coffee | The Bean Route`,
      description: `Find coffee shops and mobile coffee carts in ${suburbName}, Melbourne.`,
    }
  }

  const coffeeShops = vendors.filter(v => v.vendor_type === 'coffee_shop')
  const mobileCarts = vendors.filter(v => v.vendor_type === 'mobile_cart')

  const parts: string[] = []
  if (coffeeShops.length > 0) parts.push(`${coffeeShops.length} coffee shop${coffeeShops.length !== 1 ? 's' : ''}`)
  if (mobileCarts.length > 0) parts.push(`${mobileCarts.length} mobile cart${mobileCarts.length !== 1 ? 's' : ''}`)

  return {
    title: `${suburbName} Coffee Shops & Mobile Carts | Melbourne | The Bean Route`,
    description: `Discover ${parts.join(' and ')} in ${suburbName}, Melbourne. Find local cafes, specialty roasters, and mobile coffee catering for events. Verified vendors with reviews, hours, and directions.`,
    openGraph: {
      title: `${suburbName} Coffee | The Bean Route`,
      description: `${vendors.length} coffee vendors in ${suburbName}, Melbourne`,
      type: 'website',
      url: `${baseUrl}/suburbs/${slug}`,
    },
  }
}

export default async function SuburbPage({ params }: SuburbPageProps) {
  const { slug } = await params
  const suburbName = slugToSuburbName(slug)

  // Fetch all vendors serving this suburb
  const { data: vendors } = await supabaseAdmin
    .from('vendors')
    .select('*')
    .eq('verified', true)
    .contains('suburbs', [suburbName])
    .order('average_rating', { ascending: false, nullsFirst: false })

  if (!vendors || vendors.length === 0) {
    notFound()
  }

  const coffeeShops = vendors.filter(v => v.vendor_type === 'coffee_shop')
  const mobileCarts = vendors.filter(v => v.vendor_type === 'mobile_cart')

  // Get nearby suburbs (suburbs that vendors also serve)
  const nearbySuburbsSet = new Set<string>()
  vendors.forEach(vendor => {
    vendor.suburbs.forEach((suburb: string) => {
      if (suburb !== suburbName) {
        nearbySuburbsSet.add(suburb)
      }
    })
  })
  const nearbySuburbs = Array.from(nearbySuburbsSet).sort().slice(0, 12)

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Suburbs', item: `${baseUrl}/suburbs` },
      { '@type': 'ListItem', position: 3, name: suburbName },
    ],
  }

  // Collection page schema
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${suburbName} Coffee Shops and Mobile Carts`,
    description: `Complete guide to coffee in ${suburbName}, Melbourne`,
    url: `${baseUrl}/suburbs/${slug}`,
    about: {
      '@type': 'Place',
      name: `${suburbName}, Melbourne`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: suburbName,
        addressRegion: 'Victoria',
        addressCountry: 'Australia',
      },
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: vendors.length,
      itemListElement: vendors.slice(0, 10).map((vendor, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': vendor.vendor_type === 'coffee_shop' ? 'CafeOrCoffeeShop' : 'LocalBusiness',
          name: vendor.business_name,
          url: `${baseUrl}/vendors/${vendor.slug}`,
          description: vendor.specialty,
        },
      })),
    },
  }

  // FAQ schema for suburb page
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How many coffee shops are in ${suburbName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: coffeeShops.length > 0
            ? `${suburbName} has ${coffeeShops.length} verified specialty coffee shop${coffeeShops.length !== 1 ? 's' : ''} on The Bean Route. Browse cafes with opening hours, ratings, and directions.`
            : `The Bean Route currently lists ${mobileCarts.length} mobile coffee cart${mobileCarts.length !== 1 ? 's' : ''} serving ${suburbName}. Check back regularly as we add new coffee shops to the directory.`,
        },
      },
      {
        '@type': 'Question',
        name: `Can I book mobile coffee carts in ${suburbName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: mobileCarts.length > 0
            ? `Yes! ${mobileCarts.length} mobile coffee cart${mobileCarts.length !== 1 ? 's' : ''} serve ${suburbName} for events, weddings, and corporate functions. Get instant quotes and book directly through our platform.`
            : `We're expanding our mobile coffee cart network. Browse nearby suburbs or check back soon for ${suburbName} coverage.`,
        },
      },
      {
        '@type': 'Question',
        name: `What areas near ${suburbName} have coffee options?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Coffee lovers near ${suburbName} can also explore nearby Melbourne suburbs including ${nearbySuburbs.slice(0, 5).join(', ')}, and more. Each suburb page lists local cafes and mobile coffee carts.`,
        },
      },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={collectionSchema} />
      <JsonLd data={faqSchema} />
      <SuburbPageClient
        suburbName={suburbName}
        suburbSlug={slug}
        coffeeShops={coffeeShops}
        mobileCarts={mobileCarts}
        nearbySuburbs={nearbySuburbs}
      />
    </>
  )
}

// Generate static params for top Melbourne suburbs
export async function generateStaticParams() {
  // Fetch all unique suburbs from vendors
  const { data: vendors } = await supabaseAdmin
    .from('vendors')
    .select('suburbs')
    .eq('verified', true)

  if (!vendors) return []

  // Collect all unique suburbs
  const suburbsSet = new Set<string>()
  vendors.forEach(vendor => {
    vendor.suburbs.forEach((suburb: string) => {
      suburbsSet.add(suburb)
    })
  })

  // Convert to slugs
  const suburbs = Array.from(suburbsSet)
    .sort()
    .map(suburb => ({
      slug: suburbNameToSlug(suburb),
    }))

  return suburbs
}
