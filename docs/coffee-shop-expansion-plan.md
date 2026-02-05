# Coffee Shop Platform Expansion Plan

**Date:** 2026-02-05
**Objective:** Expand The Bean Route marketplace to include coffee shops alongside mobile coffee carts, with optimized profiles for both vendor types.

---

## Executive Summary

**Current state:** Platform supports mobile coffee cart vendors only.

**Proposed expansion:** Add coffee shops (brick-and-mortar cafes) to create a dual marketplace:
1. **Mobile coffee carts** — Event-based bookings (existing)
2. **Coffee shops** — Physical locations with profiles, opening hours, menus

**Business rationale:**
- Expands total addressable market (TAM)
- Leverages existing infrastructure and SEO foundation
- Creates comprehensive Melbourne coffee directory
- Enables cross-promotion between carts and shops
- Strengthens local SEO with physical business locations

---

## 1. Architecture & Data Model

### Current Vendor Schema

```sql
vendors (
  id uuid PRIMARY KEY,
  slug text UNIQUE,
  business_name text,
  specialty text,
  description text,
  suburbs text[],
  price_min integer,
  price_max integer,
  capacity_min integer,
  capacity_max integer,
  tags text[],
  contact_email text,
  contact_phone text,
  website text,
  image_url text,
  verified boolean DEFAULT false,
  created_at timestamp,
  updated_at timestamp
)
```

### Proposed Schema Changes

**Option A: Single Table with Type Discrimination (Recommended)**

```sql
ALTER TABLE vendors ADD COLUMN vendor_type TEXT DEFAULT 'mobile_cart';
ALTER TABLE vendors ADD COLUMN physical_address TEXT;
ALTER TABLE vendors ADD COLUMN google_maps_url TEXT;
ALTER TABLE vendors ADD COLUMN opening_hours JSONB;
ALTER TABLE vendors ADD COLUMN seating_capacity INTEGER;
ALTER TABLE vendors ADD COLUMN wifi_available BOOLEAN DEFAULT false;
ALTER TABLE vendors ADD COLUMN parking_available BOOLEAN DEFAULT false;
ALTER TABLE vendors ADD COLUMN outdoor_seating BOOLEAN DEFAULT false;
ALTER TABLE vendors ADD COLUMN menu_url TEXT;
ALTER TABLE vendors ADD COLUMN menu_items JSONB;
ALTER TABLE vendors ADD COLUMN average_rating DECIMAL(2,1);
ALTER TABLE vendors ADD COLUMN review_count INTEGER DEFAULT 0;

-- Add check constraint
ALTER TABLE vendors ADD CONSTRAINT vendor_type_check
  CHECK (vendor_type IN ('mobile_cart', 'coffee_shop'));

-- Coffee shops must have physical address
ALTER TABLE vendors ADD CONSTRAINT coffee_shop_address_check
  CHECK (vendor_type != 'coffee_shop' OR physical_address IS NOT NULL);
```

**Option B: Separate Tables (More normalized, more complex)**

Not recommended for MVP. Can revisit if schemas diverge significantly.

### TypeScript Types Update

```typescript
// src/lib/supabase.ts

export type VendorType = 'mobile_cart' | 'coffee_shop'

export interface OpeningHours {
  monday?: { open: string; close: string }
  tuesday?: { open: string; close: string }
  wednesday?: { open: string; close: string }
  thursday?: { open: string; close: string }
  friday?: { open: string; close: string }
  saturday?: { open: string; close: string }
  sunday?: { open: string; close: string }
}

export interface MenuItem {
  name: string
  description?: string
  price?: number
  category?: string
}

export interface Vendor {
  id: string
  slug: string
  business_name: string
  vendor_type: VendorType
  specialty: string
  description: string | null
  suburbs: string[]

  // Mobile cart specific
  price_min: number
  price_max: number
  capacity_min: number
  capacity_max: number

  // Coffee shop specific
  physical_address: string | null
  google_maps_url: string | null
  opening_hours: OpeningHours | null
  seating_capacity: number | null
  wifi_available: boolean
  parking_available: boolean
  outdoor_seating: boolean
  menu_url: string | null
  menu_items: MenuItem[] | null
  average_rating: number | null
  review_count: number

  // Shared
  tags: string[]
  contact_email: string | null
  contact_phone: string | null
  website: string | null
  image_url: string | null
  verified: boolean
  created_at: string
  updated_at: string
}
```

---

## 2. UI/UX Changes

### Browse Page Updates

**Current:** Filter by suburb, event type, price (mobile carts)

**Proposed:**

1. **Add vendor type filter:**
```jsx
<select>
  <option value="all">All vendors</option>
  <option value="mobile_cart">Mobile coffee carts</option>
  <option value="coffee_shop">Coffee shops</option>
</select>
```

2. **Conditional card rendering:**
   - Mobile carts: Show price/hr, capacity, suburbs served
   - Coffee shops: Show address, opening hours, rating, amenities

3. **Different CTAs:**
   - Mobile carts: "Get a Quote" (inquiry form)
   - Coffee shops: "View Profile" (profile page with directions, menu)

### Vendor Profile Page Updates

**Mobile Cart Profile (existing):**
- Specialty, description
- Suburbs served
- Pricing, capacity
- Event types
- Inquiry form CTA

**Coffee Shop Profile (new):**
- Specialty, description
- Physical address with map embed
- Opening hours display
- Seating capacity
- Amenities (WiFi, parking, outdoor seating)
- Menu section (if available)
- Reviews/ratings (future)
- Directions CTA (Google Maps link)

### Vendor Registration Form Updates

**Add vendor type selection at start:**
```jsx
<fieldset>
  <legend>What type of business are you listing?</legend>
  <input type="radio" name="vendor_type" value="mobile_cart" />
  <label>Mobile coffee cart (event bookings)</label>

  <input type="radio" name="vendor_type" value="coffee_shop" />
  <label>Coffee shop (physical location)</label>
</fieldset>
```

**Conditional fields based on selection:**
- Mobile cart: Capacity, price range, suburbs served
- Coffee shop: Address, opening hours, amenities

---

## 3. SEO Strategy Updates

### New Landing Pages

**1. /coffee-shops**
- H1: "Melbourne Coffee Shops | The Bean Route"
- Description: "Discover the best coffee shops in Melbourne. Browse by suburb, specialty, and amenities."
- Grid of coffee shops with filters
- LocalBusiness schema for each

**2. /mobile-coffee-carts** (new, redirect from /app)
- H1: "Melbourne Mobile Coffee Carts | The Bean Route"
- Keep existing browse functionality
- Clarify positioning as mobile/event service

**3. /suburbs/[suburb]**
- H1: "Coffee Shops & Carts in [Suburb] | The Bean Route"
- List both types serving that suburb
- Local SEO goldmine
- Example: `/suburbs/carlton` shows all Carlton vendors

### Updated Homepage Structure

**Current:** "Melbourne's Coffee Cart Marketplace"

**Proposed:** "Melbourne's Coffee Marketplace"

Add dual value props:
```
Find Your Perfect Coffee Experience:
→ Mobile Coffee Carts for Events
→ Coffee Shops in Your Neighbourhood
```

### Schema Markup Updates

**Coffee Shop LocalBusiness Schema:**

```json
{
  "@context": "https://schema.org",
  "@type": "CoffeShop",
  "name": "Bean There Done That",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Lygon Street",
    "addressLocality": "Carlton",
    "addressRegion": "VIC",
    "postalCode": "3053",
    "addressCountry": "AU"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "-37.8000",
    "longitude": "144.9667"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "07:00",
      "closes": "17:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "16:00"
    }
  ],
  "telephone": "+61-3-1234-5678",
  "priceRange": "$$",
  "servesCuisine": "Coffee",
  "amenityFeature": [
    {
      "@type": "LocationFeatureSpecification",
      "name": "Free WiFi",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Outdoor Seating",
      "value": true
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "87"
  }
}
```

**Mobile Cart Schema (keep existing LocalBusiness):**
- Emphasize `areaServed` (suburbs)
- Add `makesOffer` for event services
- No physical address, use service area

---

## 4. Implementation Phases

### Phase 1: Database & Types (Week 1)

**Tasks:**
- [ ] Update Supabase vendors table schema (add new columns)
- [ ] Update TypeScript types in `src/lib/supabase.ts`
- [ ] Create database migration SQL file
- [ ] Update seed data with 3-5 coffee shop examples
- [ ] Test data integrity and constraints

**Files:**
- `docs/migrations/add-coffee-shop-support.sql`
- `src/lib/supabase.ts`

### Phase 2: UI Components (Week 1-2)

**Tasks:**
- [ ] Create `VendorTypeFilter` component
- [ ] Update `VendorCard` component (conditional rendering)
- [ ] Create `CoffeeShopProfile` component
- [ ] Create `MobileCartProfile` component (extract from existing)
- [ ] Update `VendorRegistrationForm` with type selection
- [ ] Add `OpeningHoursDisplay` component
- [ ] Add `AmenitiesDisplay` component

**Files:**
- `src/components/vendors/VendorTypeFilter.tsx`
- `src/components/vendors/VendorCard.tsx` (update)
- `src/components/vendors/CoffeeShopProfile.tsx`
- `src/components/vendors/MobileCartProfile.tsx`
- `src/components/vendors/OpeningHoursDisplay.tsx`
- `src/components/vendors/AmenitiesDisplay.tsx`

### Phase 3: Browse & Filter (Week 2)

**Tasks:**
- [ ] Update browse page with vendor type filter
- [ ] Add conditional card rendering
- [ ] Update filter logic to handle both types
- [ ] Test filtering combinations (type + suburb + price)
- [ ] Update metadata for browse pages

**Files:**
- `src/app/app/page.tsx` (rename to `/browse` or keep?)
- `src/app/coffee-shops/page.tsx` (new)
- `src/app/mobile-coffee-carts/page.tsx` (new, or alias?)

### Phase 4: Profile Pages (Week 2-3)

**Tasks:**
- [ ] Update vendor detail page with type detection
- [ ] Render appropriate profile template
- [ ] Add coffee shop-specific sections (hours, amenities, map)
- [ ] Keep mobile cart inquiry flow
- [ ] Add directions CTA for coffee shops
- [ ] Update schema markup (dual support)

**Files:**
- `src/app/vendors/[slug]/page.tsx` (update)
- `src/app/vendors/[slug]/VendorPageClient.tsx` (update)

### Phase 5: SEO Landing Pages (Week 3)

**Tasks:**
- [ ] Create `/coffee-shops` landing page
- [ ] Create `/mobile-coffee-carts` landing page
- [ ] Update homepage with dual positioning
- [ ] Add FAQ sections for coffee shops
- [ ] Update metadata across all pages
- [ ] Generate new sitemap with all pages

**Files:**
- `src/app/coffee-shops/page.tsx`
- `src/app/mobile-coffee-carts/page.tsx`
- `src/app/page.tsx` (homepage update)

### Phase 6: Suburb Pages (Week 4)

**Tasks:**
- [ ] Create dynamic `/suburbs/[slug]/page.tsx`
- [ ] Generate static pages for top 20 suburbs
- [ ] List both coffee shops and mobile carts
- [ ] Add local content (popular areas, parking tips)
- [ ] Breadcrumb schema
- [ ] Local SEO metadata

**Files:**
- `src/app/suburbs/[slug]/page.tsx`
- `src/lib/suburbs.ts` (suburb data)

### Phase 7: Admin & Management (Week 4-5)

**Tasks:**
- [ ] Update admin panel to show vendor type
- [ ] Add filters in admin (carts vs shops)
- [ ] Update approval flow (validate type-specific fields)
- [ ] Add bulk import for coffee shops (future)
- [ ] Analytics dashboard (carts vs shops metrics)

**Files:**
- `src/app/admin/page.tsx` (update)
- `src/app/admin/ApplicationsTab.tsx` (update)

---

## 5. Content Strategy

### Coffee Shop Content Needs

**For each coffee shop profile:**
1. **High-quality photos:**
   - Storefront exterior
   - Interior seating
   - Coffee/food closeups
   - Barista action shots (if permitted)

2. **Written content:**
   - Compelling specialty description
   - Neighborhood context ("heart of Carlton")
   - Signature drinks/menu items
   - Atmosphere description
   - Barista credentials (if relevant)

3. **Structured data:**
   - Accurate address (critical for local SEO)
   - Opening hours
   - Price range ($ to $$$$)
   - Amenities checklist

### Suburb Page Content Template

**Example: /suburbs/carlton**

```markdown
# Coffee Shops & Carts in Carlton, Melbourne

Carlton is the heart of Melbourne's coffee culture, home to dozens of
specialty roasters, Italian espresso bars, and specialty cafes along
Lygon Street. Whether you need a mobile coffee cart for your event or
want to discover your new local cafe, we've got you covered.

## Coffee Shops in Carlton
[Grid of coffee shops]

## Mobile Coffee Carts Serving Carlton
[Grid of mobile carts that serve Carlton]

## About Coffee in Carlton
[Local content: history, popular spots, tips]

## FAQs
- Best coffee shop in Carlton for studying?
- Which Carlton cafes have outdoor seating?
- Can I book a mobile coffee cart for Carlton events?
```

---

## 6. Google Business Profile Strategy

### For Coffee Shops

**Critical for local SEO:**

1. **Claim or create GBP listings:**
   - Encourage coffee shops to claim their GBP
   - Link to The Bean Route profile from GBP website field
   - Add categories: Coffee shop, Cafe, Espresso bar

2. **NAP consistency:**
   - Name, Address, Phone must match across:
     - The Bean Route profile
     - Google Business Profile
     - Website
     - Other directories

3. **Backlink from GBP:**
   - GBP → The Bean Route profile URL
   - High-authority backlink for local SEO

### For Mobile Carts

**Service area business (SAB):**

1. **List as service area business:**
   - No physical address shown
   - Service area: Melbourne + suburbs
   - Category: Mobile coffee service, Catering

2. **Website link:**
   - GBP → The Bean Route mobile cart profile
   - Highlight service area in description

---

## 7. Reviews & Ratings System (Future Phase)

**Not in MVP, but plan for:**

### Database Schema (Future)

```sql
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE,
  reviewer_name text,
  reviewer_email text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  created_at timestamp DEFAULT NOW(),
  verified boolean DEFAULT false,
  response_text text,
  response_at timestamp
);

CREATE INDEX idx_reviews_vendor ON reviews(vendor_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
```

### Review Schema Markup

```json
{
  "@type": "Review",
  "author": {
    "@type": "Person",
    "name": "Sarah L."
  },
  "datePublished": "2024-02-15",
  "reviewBody": "Best flat white in Carlton. Great atmosphere, friendly staff.",
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": 5,
    "bestRating": 5,
    "worstRating": 1
  }
}
```

### AggregateRating Display

```jsx
<div className="rating">
  <span className="stars">★★★★★</span>
  <span className="score">4.7</span>
  <span className="count">(142 reviews)</span>
</div>
```

---

## 8. Potential Challenges & Mitigations

### Challenge 1: Data Quality

**Issue:** Coffee shop data (hours, address, amenities) must be accurate.

**Mitigation:**
- Verification process during onboarding
- Allow shops to update their own profiles (future: vendor dashboard)
- User-generated corrections (flag incorrect info)
- Manual admin review for new listings

### Challenge 2: Dual Positioning Confusion

**Issue:** Users might not understand platform serves both types.

**Mitigation:**
- Clear homepage messaging: "Coffee Shops & Mobile Carts"
- Prominent vendor type filter on browse page
- Separate landing pages for each type
- Educational content: "What's the difference?"

### Challenge 3: Inquiry Flow Mismatch

**Issue:** Coffee shops don't need "Get a Quote" — they need foot traffic.

**Mitigation:**
- Different CTAs per type:
  - Mobile carts: "Get a Quote" → Inquiry form
  - Coffee shops: "View Profile" → Full profile with directions
- Consider adding "Contact" form for coffee shops (questions, feedback)

### Challenge 4: Mobile Cart Vendors Feel Diluted

**Issue:** Original mobile cart vendors might feel platform is shifting focus.

**Mitigation:**
- Launch messaging: "We're growing to serve you better"
- Separate dedicated pages for mobile carts
- Highlight mobile cart success stories
- Keep inquiry funnel optimized for events

### Challenge 5: SEO Cannibalization

**Issue:** Coffee shop pages might compete with mobile cart pages for same keywords.

**Mitigation:**
- Distinct keyword targeting:
  - Mobile carts: "coffee cart hire", "event coffee", "mobile barista"
  - Coffee shops: "coffee shop carlton", "best cafe fitzroy"
- Use structured data to help search engines understand difference
- Internal linking strategy to strengthen both

---

## 9. Success Metrics

### Platform Metrics

**Dual marketplace health:**
- Mobile cart listings: Target 20+ active carts (current baseline)
- Coffee shop listings: Target 50+ shops within 3 months
- Balanced traffic: 60/40 split (carts/shops) acceptable

### SEO Metrics

**Organic traffic:**
- "coffee shop [suburb]" rankings: Top 10 for 20+ suburbs (6 months)
- "mobile coffee cart melbourne": Maintain/improve current position
- Organic sessions: +100% within 6 months (from dual targeting)

### Conversion Metrics

**Mobile carts:**
- Inquiry submissions: Maintain current rate (don't let it drop)
- Quote-to-booking rate: Track after reviews feature

**Coffee shops:**
- Profile views: 500+ per week across all shops (3 months)
- Directions clicks: 20% of profile views
- Website clicks: 10% of profile views

### User Engagement

**Browse behavior:**
- Avg. vendors viewed per session: 5+ (up from current)
- Filter usage: 80% of sessions use filters
- Vendor type filter adoption: 50% use type filter

---

## 10. Technical Considerations

### Performance

**Concern:** Larger dataset (carts + shops) might slow browse page.

**Solutions:**
- Pagination (currently showing all, might need pages)
- Lazy loading for vendor cards
- Optimize Supabase queries (indexes on vendor_type, suburbs)
- Consider caching for coffee shops (less dynamic than carts)

### Mobile Responsiveness

**Ensure coffee shop profiles work on mobile:**
- Map embed responsive
- Opening hours readable on small screens
- Amenity icons clear and tappable

### Accessibility

**Coffee shop specific:**
- Opening hours in semantic HTML (not just JSON-LD)
- Map alternatives (text directions)
- Amenity icons with alt text

---

## 11. Rollout Strategy

### Soft Launch (Week 1-2)

1. **Update database schema**
2. **Add 5-10 coffee shops manually** (Carlton, Fitzroy, CBD)
3. **Test all functionality** (browse, profiles, filters)
4. **Internal QA** (check mobile, desktop, different browsers)

### Public Launch (Week 3)

1. **Announcement:**
   - Update homepage with new positioning
   - Blog post: "Introducing Coffee Shops on The Bean Route"
   - Email to existing mobile cart vendors (explain expansion)

2. **Outreach:**
   - Contact 50 top Melbourne coffee shops
   - Offer free profile setup
   - Target Carlton, Fitzroy, CBD, South Yarra (high-traffic suburbs)

3. **SEO push:**
   - Submit updated sitemap to Google Search Console
   - Create Google Business Profiles for platform
   - Start building suburb pages

### Growth Phase (Month 2-3)

1. **Content marketing:**
   - "Best Coffee Shops in Carlton" blog posts
   - "How to Choose Between Mobile Cart and Coffee Shop"
   - Vendor success stories

2. **Backlink building:**
   - Reach out to Melbourne food bloggers
   - Partner with event venues (cross-promote mobile carts)
   - Get featured on local coffee community sites

3. **Feature enhancements:**
   - Reviews system (Phase 2)
   - Vendor dashboard (self-service updates)
   - Advanced filters (price range for coffee shops, rating sort)

---

## 12. Open Questions

**Need to decide:**

1. **Separate apps or unified browse?**
   - Option A: Keep /app unified, filter by type
   - Option B: Create /coffee-shops and /mobile-coffee-carts as separate browse experiences
   - Recommendation: Option A for MVP (simpler), Option B later (better UX)

2. **How to handle pricing for coffee shops?**
   - Coffee shops don't have "per hour" pricing
   - Options:
     - Remove price fields for coffee shops
     - Use price_range: $ to $$$$ (like Google)
     - Add menu_price_range: "$3-$7 per coffee"
   - Recommendation: Use $ to $$$$ price range

3. **Should coffee shops have inquiry forms?**
   - Use case: Private events, catering inquiries
   - Recommendation: Add optional "Contact" form for coffee shops
   - Different from mobile cart "Get a Quote" (rename to "Inquire About Catering")

4. **How to onboard existing coffee shops?**
   - Manual data entry (admin)
   - Self-service registration (opens platform to spam)
   - Hybrid: Invite-only initially, then open with admin approval
   - Recommendation: Hybrid approach, same as mobile carts

5. **Competitor research needed:**
   - What do existing Melbourne coffee shop directories do well?
   - How are they monetizing?
   - What gaps can we fill?
   - Recommendation: Research Zomato, Google Maps, Broadsheet Melbourne

---

## Appendix A: SQL Migration Script

**File: `docs/migrations/001_add_coffee_shop_support.sql`**

```sql
-- Add vendor type discrimination
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS vendor_type TEXT DEFAULT 'mobile_cart';
ALTER TABLE vendors ADD CONSTRAINT vendor_type_check
  CHECK (vendor_type IN ('mobile_cart', 'coffee_shop'));

-- Coffee shop specific fields
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS physical_address TEXT;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS google_maps_url TEXT;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS opening_hours JSONB;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS seating_capacity INTEGER;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS wifi_available BOOLEAN DEFAULT false;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS parking_available BOOLEAN DEFAULT false;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS outdoor_seating BOOLEAN DEFAULT false;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS menu_url TEXT;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS menu_items JSONB;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS price_range TEXT CHECK (price_range IN ('$', '$$', '$$$', '$$$$'));

-- Constraints
ALTER TABLE vendors ADD CONSTRAINT coffee_shop_address_check
  CHECK (vendor_type != 'coffee_shop' OR physical_address IS NOT NULL);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_vendors_type ON vendors(vendor_type);
CREATE INDEX IF NOT EXISTS idx_vendors_suburbs_gin ON vendors USING GIN(suburbs);
CREATE INDEX IF NOT EXISTS idx_vendors_rating ON vendors(average_rating DESC) WHERE average_rating IS NOT NULL;

-- Update existing vendors to be mobile carts
UPDATE vendors SET vendor_type = 'mobile_cart' WHERE vendor_type IS NULL;

-- Comments
COMMENT ON COLUMN vendors.vendor_type IS 'mobile_cart for event-based services, coffee_shop for physical locations';
COMMENT ON COLUMN vendors.opening_hours IS 'JSON object with day keys and {open, close} values';
COMMENT ON COLUMN vendors.menu_items IS 'JSON array of menu items with name, description, price, category';
```

---

## Appendix B: Example Coffee Shop Data

```json
{
  "business_name": "Seven Seeds Coffee Roasters",
  "vendor_type": "coffee_shop",
  "slug": "seven-seeds-coffee-roasters",
  "specialty": "Specialty coffee roasting & cafe",
  "description": "Melbourne's pioneering specialty coffee roaster with a focus on direct trade, sustainability, and exceptional espresso. Our Carlton cafe features a full brew bar, retail counter, and training space.",
  "physical_address": "114 Berkeley Street, Carlton VIC 3053",
  "suburbs": ["Carlton", "Parkville", "North Melbourne"],
  "google_maps_url": "https://maps.google.com/?q=Seven+Seeds+Carlton",
  "opening_hours": {
    "monday": { "open": "07:00", "close": "16:00" },
    "tuesday": { "open": "07:00", "close": "16:00" },
    "wednesday": { "open": "07:00", "close": "16:00" },
    "thursday": { "open": "07:00", "close": "16:00" },
    "friday": { "open": "07:00", "close": "16:00" },
    "saturday": { "open": "08:00", "close": "17:00" },
    "sunday": { "open": "08:00", "close": "17:00" }
  },
  "seating_capacity": 40,
  "wifi_available": true,
  "parking_available": false,
  "outdoor_seating": true,
  "price_range": "$$",
  "tags": ["specialty-coffee", "espresso", "pour-over", "single-origin", "roastery"],
  "contact_email": "carlton@sevenseeds.com.au",
  "contact_phone": "(03) 9347 8664",
  "website": "https://sevenseeds.com.au",
  "verified": true,
  "average_rating": 4.6,
  "review_count": 0
}
```

---

**Next Steps:** Review this plan, prioritize tasks, and begin Phase 1 (Database & Types).
