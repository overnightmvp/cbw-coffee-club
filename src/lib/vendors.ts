// CBW Coffee — Vendor Data
// Hardcoded seed data for Melbourne mobile coffee cart vendors.
// Replace with real vendor records once gathered from Facebook group.

export type Vendor = {
  id: string
  slug: string
  businessName: string
  specialty: string
  suburbs: string[]
  priceMin: number  // AUD per hour
  priceMax: number  // AUD per hour
  capacityMin: number
  capacityMax: number
  description: string
  contactEmail: string | null
  contactPhone: string | null
  website: string | null
  imageUrl: string | null
  tags: string[]
}

const vendors: Vendor[] = [
  {
    id: '1',
    slug: 'the-bean-cart',
    businessName: 'The Bean Cart',
    specialty: 'Classic Espresso & Pastries',
    suburbs: ['Camberwell', 'Glen Iris', 'Hawthorn', 'Malvern'],
    priceMin: 180,
    priceMax: 320,
    capacityMin: 30,
    capacityMax: 150,
    description: 'Camberwell\'s local favourite. Specialises in classic espresso and freshly baked pastries — the go-to cart for corporate morning teas and community events across Melbourne\'s inner east.',
    contactEmail: null,
    contactPhone: null,
    website: null,
    imageUrl: null,
    tags: ['corporate', 'morning-tea', 'pastries', 'inner-east'],
  },
  {
    id: '2',
    slug: 'muir-and-co',
    businessName: 'Muir & Co',
    specialty: 'Single Origin Espresso',
    suburbs: ['Fitzroy', 'Collingwood', 'Brunswick', 'Richmond'],
    priceMin: 220,
    priceMax: 380,
    capacityMin: 40,
    capacityMax: 200,
    description: 'Sourcing directly from Victorian and interstate farms. Muir & Co brings serious single-origin espresso to your event — the kind of coffee that starts conversations.',
    contactEmail: null,
    contactPhone: null,
    website: null,
    imageUrl: null,
    tags: ['corporate', 'festivals', 'single-origin', 'inner-north'],
  },
  {
    id: '3',
    slug: 'the-roaming-bean',
    businessName: 'The Roaming Bean',
    specialty: 'Cold Brew & Nitro Coffee',
    suburbs: ['South Yarra', 'Prahran', 'Windsor', 'St Kilda'],
    priceMin: 150,
    priceMax: 280,
    capacityMin: 25,
    capacityMax: 120,
    description: 'Melbourne\'s standout cold brew cart. Nitro on tap, house-made syrups, and a menu that works summer or winter. Popular with creative agencies and product launches.',
    contactEmail: null,
    contactPhone: null,
    website: null,
    imageUrl: null,
    tags: ['corporate', 'product-launches', 'cold-brew', 'inner-south'],
  },
  {
    id: '4',
    slug: 'campfire-coffee',
    businessName: 'Campfire Coffee',
    specialty: 'Filter & Pour-Over',
    suburbs: ['Carlton', 'Parkville', 'Fitzroy North', 'Northcote'],
    priceMin: 190,
    priceMax: 340,
    capacityMin: 20,
    capacityMax: 100,
    description: 'Slow, considered filter coffee in a mobile setup. Campfire specialises in pour-over and batch brew — ideal for smaller gatherings where quality matters more than speed.',
    contactEmail: null,
    contactPhone: null,
    website: null,
    imageUrl: null,
    tags: ['corporate', 'weddings', 'filter-coffee', 'inner-north'],
  },
  {
    id: '5',
    slug: 'black-lace-coffee',
    businessName: 'Black Lace Coffee',
    specialty: 'Premium Espresso & Latte Art',
    suburbs: ['CBD', 'Southbank', 'Docklands', 'North Melbourne'],
    priceMin: 250,
    priceMax: 420,
    capacityMin: 50,
    capacityMax: 250,
    description: 'The premium end of Melbourne\'s mobile coffee scene. Black Lace brings barista-level latte art and a sleek setup to CBD corporate events, conferences, and large-scale gatherings.',
    contactEmail: null,
    contactPhone: null,
    website: null,
    imageUrl: null,
    tags: ['corporate', 'conferences', 'premium', 'cbd'],
  },
  {
    id: '6',
    slug: 'nomad-coffee',
    businessName: 'Nomad Coffee',
    specialty: 'Adventurous Blends & Flat Whites',
    suburbs: ['Brunswick', 'Coburg', 'Pascoe Vale', 'Moreland'],
    priceMin: 160,
    priceMax: 290,
    capacityMin: 30,
    capacityMax: 140,
    description: 'Known for rotating seasonal blends and the best flat white in Brunswick. Nomad runs a tight, efficient cart — great for all-day events where the coffee keeps flowing.',
    contactEmail: null,
    contactPhone: null,
    website: null,
    imageUrl: null,
    tags: ['corporate', 'all-day-events', 'festivals', 'north'],
  },
  {
    id: '7',
    slug: 'copper-and-brass',
    businessName: 'Copper & Brass',
    specialty: 'Latte Art & Ceremonial Espresso',
    suburbs: ['Richmond', 'Swan Hill', 'Abbotsford', 'Cremorne'],
    priceMin: 200,
    priceMax: 360,
    capacityMin: 25,
    capacityMax: 130,
    description: 'Two skilled baristas, one beautifully designed cart. Copper & Brass turns coffee service into a spectacle — latte art on every cup, every time. A favourite at Richmond corporate events.',
    contactEmail: null,
    contactPhone: null,
    website: null,
    imageUrl: null,
    tags: ['corporate', 'weddings', 'latte-art', 'inner-east'],
  },
  {
    id: '8',
    slug: 'good-morning-coffee',
    businessName: 'Good Morning Coffee',
    specialty: 'Morning Events & Team Kick-offs',
    suburbs: ['Hawthorn', 'Kew', 'Glenferrie', 'Toorak'],
    priceMin: 170,
    priceMax: 300,
    capacityMin: 20,
    capacityMax: 110,
    description: 'Built around the morning rush. Good Morning specialises in fast, consistent espresso for breakfast events, team kick-offs, and early-start conferences across Melbourne\'s east.',
    contactEmail: null,
    contactPhone: null,
    website: null,
    imageUrl: null,
    tags: ['corporate', 'breakfast-events', 'team-events', 'east'],
  },
  {
    id: '9',
    slug: 'chalk-and-bean',
    businessName: 'Chalk & Bean',
    specialty: 'Sustainable & Eco-Conscious Coffee',
    suburbs: ['Fitzroy North', 'Northcote', 'Thornbury', 'Preston'],
    priceMin: 190,
    priceMax: 330,
    capacityMin: 25,
    capacityMax: 120,
    description: 'Zero-waste coffee service. Compostable cups, carbon-neutral beans, and a setup that looks as good as it tastes. The right choice for brands that care about more than just the bottom line.',
    contactEmail: null,
    contactPhone: null,
    website: null,
    imageUrl: null,
    tags: ['corporate', 'sustainability', 'eco', 'inner-north'],
  },
  {
    id: '10',
    slug: 'ritual-roasters-cart',
    businessName: 'Ritual Roasters Cart',
    specialty: 'Artisan Espresso & Education',
    suburbs: ['Carlton', 'Fitzroy', 'Parkville', 'Collingwood'],
    priceMin: 210,
    priceMax: 370,
    capacityMin: 30,
    capacityMax: 160,
    description: 'The cart arm of Melbourne\'s renowned Ritual Roasters. Brings their legendary roasts and barista expertise on the road — a premium pick for corporate events that want to impress.',
    contactEmail: null,
    contactPhone: null,
    website: null,
    imageUrl: null,
    tags: ['corporate', 'premium', 'artisan', 'inner-north'],
  },
]

export function getAllVendors(): Vendor[] {
  return vendors
}

export function getVendorBySlug(slug: string): Vendor | undefined {
  return vendors.find(v => v.slug === slug)
}

export function getVendorById(id: string): Vendor | undefined {
  return vendors.find(v => v.id === id)
}

export function formatPriceRange(vendor: Vendor): string {
  return `$${vendor.priceMin}–$${vendor.priceMax}/hr`
}
