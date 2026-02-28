import { supabaseAdmin } from '@/lib/supabase-admin'
import VendorPageClient from './VendorPageClient'
import JsonLd from '@/components/seo/JsonLd'

const baseUrl = 'https://thebeanroute.com.au'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: vendor, error } = await supabaseAdmin
    .from('vendors')
    .select('*')
    .eq('slug', slug)
    .eq('verified', true)
    .maybeSingle()

  if (error || !vendor) return { title: 'Vendor Not Found | The Bean Route' }

  const isCoffeeShop = vendor.vendor_type === 'coffee_shop'
  const suburbList = vendor.suburbs.slice(0, 3).join(', ')
  const moreSuburbs = vendor.suburbs.length > 3 ? ` + ${vendor.suburbs.length - 3} more` : ''

  if (isCoffeeShop) {
    // Coffee shop metadata
    const rating = vendor.average_rating ? ` ⭐ ${vendor.average_rating.toFixed(1)}` : ''
    const priceRange = vendor.price_range || '$$'

    return {
      title: `${vendor.business_name} — Coffee Shop in ${vendor.suburbs[0]} Melbourne${rating}`,
      description: `${vendor.business_name}: ${vendor.specialty} located in ${vendor.physical_address || vendor.suburbs[0]}. ${priceRange} • Open now • ${vendor.review_count || 0} reviews • ${suburbList}${moreSuburbs}`,
      openGraph: {
        title: `${vendor.business_name} — Coffee Shop in ${vendor.suburbs[0]}`,
        description: `${vendor.specialty} • ${vendor.physical_address || vendor.suburbs[0]} • ${priceRange}`,
        type: 'website' as const,
      },
    }
  } else if (vendor.vendor_type === 'barista') {
    // Barista metadata
    const rate = `$${vendor.price_min}–$${vendor.price_max}/hr`
    return {
      title: `${vendor.business_name} — Professional Barista for Hire Melbourne | ${rate}`,
      description: `Hire ${vendor.business_name} for your Melbourne event or staff cover. ${vendor.specialty} • ${rate}/hr • Skilled in ${suburbList}${moreSuburbs}. Book a professional coffee barista today!`,
      openGraph: {
        title: `${vendor.business_name} — Professional Barista | The Bean Route`,
        description: `${vendor.specialty} barista available in ${suburbList}${moreSuburbs}. ${rate} per hour. Professional service for events or cafes.`,
        type: 'website' as const,
      },
    }
  } else {
    // Mobile cart metadata
    const priceRange = `$${vendor.price_min}–$${vendor.price_max}/hr`

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
}

export default async function VendorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: vendor, error } = await supabaseAdmin
    .from('vendors')
    .select('*')
    .eq('slug', slug)
    .eq('verified', true)
    .maybeSingle()

  const isCoffeeShop = vendor?.vendor_type === 'coffee_shop'

  const vendorSchema = vendor
    ? isCoffeeShop
      ? {
        // Coffee shop schema with physical location
        '@context': 'https://schema.org',
        '@type': ['LocalBusiness', 'CafeOrCoffeeShop'],
        name: vendor.business_name,
        description: vendor.description,
        url: `${baseUrl}/vendors/${vendor.slug}`,
        image: vendor.image_url || `${baseUrl}/og-image.png`,
        telephone: vendor.contact_phone || undefined,
        email: vendor.contact_email || undefined,
        address: vendor.physical_address
          ? {
            '@type': 'PostalAddress',
            streetAddress: vendor.physical_address,
            addressLocality: vendor.suburbs[0] || 'Melbourne',
            addressRegion: 'Victoria',
            addressCountry: 'Australia',
          }
          : {
            '@type': 'PostalAddress',
            addressLocality: 'Melbourne',
            addressRegion: 'Victoria',
            addressCountry: 'Australia',
          },
        geo: vendor.latitude && vendor.longitude
          ? {
            '@type': 'GeoCoordinates',
            latitude: vendor.latitude,
            longitude: vendor.longitude,
          }
          : undefined,
        openingHoursSpecification: vendor.opening_hours
          ? Object.entries(vendor.opening_hours).map(([day, hours]: [string, any]) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
            opens: hours.open,
            closes: hours.close,
          }))
          : undefined,
        priceRange: vendor.price_range || '$$',
        servesCuisine: 'Coffee',
        amenityFeature: [
          vendor.wifi_available && { '@type': 'LocationFeatureSpecification', name: 'Free WiFi', value: true },
          vendor.parking_available && { '@type': 'LocationFeatureSpecification', name: 'Parking', value: true },
          vendor.outdoor_seating && { '@type': 'LocationFeatureSpecification', name: 'Outdoor Seating', value: true },
          vendor.wheelchair_accessible && { '@type': 'LocationFeatureSpecification', name: 'Wheelchair Accessible', value: true },
        ].filter(Boolean),
        aggregateRating: vendor.average_rating && vendor.review_count > 0
          ? {
            '@type': 'AggregateRating',
            ratingValue: vendor.average_rating.toString(),
            ratingCount: vendor.review_count.toString(),
            bestRating: '5',
            worstRating: '1',
          }
          : undefined,
        menu: vendor.menu_url || undefined,
        sameAs: [
          vendor.instagram_handle && `https://instagram.com/${vendor.instagram_handle}`,
          vendor.facebook_url,
          vendor.website,
          ...(vendor.social_links ? Object.values(vendor.social_links) : []),
        ].filter(Boolean),
      }
      : vendor.vendor_type === 'barista'
        ? {
          // Barista schema (Individual/Service)
          '@context': 'https://schema.org',
          '@type': ['Person', 'Service'],
          name: vendor.business_name,
          description: vendor.description,
          jobTitle: 'Professional Barista',
          url: `${baseUrl}/vendors/${vendor.slug}`,
          image: vendor.image_url || `${baseUrl}/og-image.png`,
          telephone: vendor.contact_phone || undefined,
          email: vendor.contact_email || undefined,
          areaServed: vendor.suburbs.map((suburb: string) => ({
            '@type': 'Place',
            name: `${suburb}, Melbourne, Victoria, Australia`,
          })),
          offers: {
            '@type': 'Offer',
            priceCurrency: 'AUD',
            price: vendor.price_min.toString(),
            description: `Hourly barista service starting from $${vendor.price_min} per hour`,
          },
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Melbourne',
            addressRegion: 'Victoria',
            addressCountry: 'Australia',
          },
          knowsAbout: ['Espresso Extraction', 'Latte Art', 'Coffee Grinding', 'Customer Service', 'Event Catering'],
          sameAs: [
            vendor.facebook_url,
            vendor.instagram_handle && `https://instagram.com/${vendor.instagram_handle}`,
            vendor.website,
            ...(vendor.social_links ? Object.values(vendor.social_links) : []),
          ].filter(Boolean),
        }
        : {
          // Mobile cart schema (service-based)
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
          sameAs: [
            vendor.facebook_url,
            vendor.instagram_handle && `https://instagram.com/${vendor.instagram_handle}`,
            vendor.website,
            ...(vendor.social_links ? Object.values(vendor.social_links) : []),
          ].filter(Boolean),
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
    ? isCoffeeShop
      ? {
        // Coffee shop FAQs
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `What are the opening hours of ${vendor.business_name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: vendor.opening_hours
                ? `${vendor.business_name} opening hours vary by day. Check our hours section for daily schedules including weekends and public holidays.`
                : `Contact ${vendor.business_name} directly for current opening hours.`,
            },
          },
          {
            '@type': 'Question',
            name: `Where is ${vendor.business_name} located?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: vendor.physical_address
                ? `${vendor.business_name} is located at ${vendor.physical_address} in ${vendor.suburbs[0]}, Melbourne. We serve specialty coffee in a welcoming cafe environment.`
                : `${vendor.business_name} is located in ${vendor.suburbs[0]}, Melbourne.`,
            },
          },
          {
            '@type': 'Question',
            name: `Does ${vendor.business_name} have WiFi?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: vendor.wifi_available
                ? `Yes, ${vendor.business_name} offers free WiFi for customers. Perfect for remote work or catching up with friends.`
                : `Contact ${vendor.business_name} for information about WiFi availability.`,
            },
          },
          {
            '@type': 'Question',
            name: 'Is parking available nearby?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: vendor.parking_available
                ? 'Yes, parking is available near the cafe. Check local parking signs for time limits and fees.'
                : 'Street parking and public transport options are available in the area.',
            },
          },
        ],
      }
      : vendor.vendor_type === 'barista'
        ? {
          // Barista FAQs
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: `How much does it cost to hire ${vendor.business_name} as a barista?`,
              acceptedAnswer: {
                '@type': 'Answer',
                text: `${vendor.business_name} charges between $${vendor.price_min} and $${vendor.price_max} per hour for professional barista services in Melbourne. Rates may vary based on event type, duration, and if equipment is provided.`,
              },
            },
            {
              '@type': 'Question',
              name: `What barista skills does ${vendor.business_name} have?`,
              acceptedAnswer: {
                '@type': 'Answer',
                text: `${vendor.business_name} specializes in ${vendor.specialty}. Their skills include ${vendor.tags.join(', ') || 'expert espresso preparation, latte art, and high-volume event service'}.`,
              },
            },
            {
              '@type': 'Question',
              name: 'Can I book a barista for a private home event?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, many of our independent baristas are available for private home events, birthday parties, and small gatherings. They can operate your home espresso machine or provide professional service on-site.',
              },
            },
          ],
        }
        : {
          // Mobile cart FAQs
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
      <VendorPageClient slug={slug} />
    </>
  )
}
