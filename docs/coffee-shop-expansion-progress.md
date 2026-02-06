# Coffee Shop Expansion - Implementation Progress

**Started:** 2026-02-05
**Status:** Phase 1 Complete ✅

---

## Overview

Expanding The Bean Route marketplace to support both mobile coffee carts and coffee shops (brick-and-mortar cafes). This creates a dual marketplace with comprehensive Melbourne coffee coverage.

---

## ✅ Phase 1: Database & Types (COMPLETE)

### Database Schema

**Files Created:**
- `docs/migrations/001_add_coffee_shop_support.sql` - Full migration script
- `docs/migrations/002_example_coffee_shop_data.sql` - 5 example Melbourne coffee shops

**Schema Changes:**
- ✅ Added `vendor_type` column ('mobile_cart' | 'coffee_shop')
- ✅ Coffee shop fields: `physical_address`, `latitude`, `longitude`
- ✅ Operating hours: `opening_hours` (JSONB with day-based structure)
- ✅ Amenities: `wifi_available`, `parking_available`, `outdoor_seating`, `wheelchair_accessible`
- ✅ Menu: `menu_url`, `menu_items` (JSONB), `price_range` ($ to $$$$)
- ✅ Reviews: `average_rating`, `review_count`
- ✅ Social media: `instagram_handle`, `facebook_url`
- ✅ Indexes created for performance (type, rating, location)
- ✅ Constraints: Coffee shops must have physical address

**Example Coffee Shops Added:**
1. Seven Seeds Coffee Roasters (Carlton)
2. Market Lane Coffee (Prahran)
3. Brother Baba Budan (CBD)
4. Padre Coffee (Brunswick)
5. ST. ALi Coffee Roasters (South Melbourne)

### TypeScript Types

**File Updated:** `src/lib/supabase.ts`

**New Types:**
- ✅ `VendorType = 'mobile_cart' | 'coffee_shop'`
- ✅ `PriceRange = '$' | '$$' | '$$$' | '$$$$'`
- ✅ `OpeningHours` interface (day-based structure)
- ✅ `MenuItem` interface (name, description, price, category)
- ✅ Extended `Vendor` type with all coffee shop fields

**Helper Functions:**
- ✅ `formatVendorPrice()` - Handles both mobile carts and coffee shops
- ✅ `isCoffeeShop()` - Type guard for coffee shops
- ✅ `isMobileCart()` - Type guard for mobile carts
- ✅ `getVendorAddress()` - Returns physical address or service area
- ✅ `isVendorOpen()` - Checks if coffee shop is currently open

### UI Components

**Files Created:**
- ✅ `src/components/vendors/OpeningHoursDisplay.tsx`
  - Compact view (today's hours or next available)
  - Full view (all days, grouped by consecutive same hours)
  - `OpenNowBadge` component
  - Highlights current day
  - 12-hour time formatting

- ✅ `src/components/vendors/AmenitiesDisplay.tsx`
  - Icon-based amenity display
  - Compact and full views
  - `AmenitiesBadges` variant
  - WiFi, parking, outdoor seating, wheelchair accessibility

---

## 🚧 Phase 2: UI Integration (IN PROGRESS)

### Pending Tasks

**Profile Templates:**
- [ ] Create `CoffeeShopProfile` component
- [ ] Create `MobileCartProfile` component (extract from existing)
- [ ] Update `VendorPageClient.tsx` to detect type and render appropriately
- [ ] Add coffee shop-specific sections (map, hours, amenities, menu)
- [ ] Add LocalBusiness schema for coffee shops

**Browse Page Updates:**
- [ ] Add vendor type filter to browse page
- [ ] Conditional card rendering (mobile cart vs coffee shop)
- [ ] Different CTAs per type ("Get a Quote" vs "View Profile")
- [ ] Update filter logic to handle both types

**Vendor Cards:**
- [ ] Update `VendorCard` component with conditional rendering
- [ ] Mobile cart cards: Show price/hr, capacity, suburbs
- [ ] Coffee shop cards: Show address, opening hours, rating, amenities
- [ ] Different actions per type

---

## 📋 Phase 3: SEO Landing Pages (PLANNED)

### Landing Pages to Create

- [ ] `/coffee-shops` - Coffee shop directory with filters
- [ ] `/mobile-coffee-carts` - Mobile cart directory (current `/app`)
- [ ] Update homepage with dual positioning
- [ ] Add FAQ sections for coffee shops
- [ ] Generate new sitemap with all pages

---

## 📍 Phase 4: Suburb Pages (PLANNED)

### Dynamic Suburb Pages

- [ ] Create `/suburbs/[slug]/page.tsx`
- [ ] Generate static pages for top 20 Melbourne suburbs
- [ ] List both coffee shops and mobile carts per suburb
- [ ] Local content (popular areas, parking tips)
- [ ] Breadcrumb schema
- [ ] Local SEO metadata

---

## ⚙️ Phase 5: Admin & Management (PLANNED)

### Admin Panel Updates

- [ ] Show vendor type in admin panel
- [ ] Filter by vendor type (carts vs shops)
- [ ] Validate type-specific fields during approval
- [ ] Add bulk import for coffee shops (future)
- [ ] Analytics dashboard (separate metrics for carts vs shops)

---

## 📊 Implementation Decisions Made

### Architecture

**Single Table Approach:**
- ✅ Using one `vendors` table with `vendor_type` discrimination
- Simpler queries, easier to implement
- Coffee shop fields are nullable for mobile carts
- Can revisit if schemas diverge significantly

**JSONB for Structured Data:**
- ✅ `opening_hours` as JSONB (flexible, queryable)
- ✅ `menu_items` as JSONB (future expansion)
- Allows rich data without additional tables

**Type Safety:**
- ✅ TypeScript types match database schema exactly
- ✅ Helper functions provide type guards
- ✅ Null safety with optional fields

### UI/UX

**Conditional Rendering:**
- Mobile carts: Event-focused (price/hr, capacity, inquiry form)
- Coffee shops: Location-focused (address, hours, amenities)
- Different CTAs per type

**Backward Compatibility:**
- Existing mobile cart functionality unchanged
- `LegacyVendor` type maintained for gradual migration
- All existing components continue to work

---

## 🎯 Success Metrics (To Track)

### Platform Health
- Mobile cart listings: Baseline ~10, target 20+ (maintain/grow)
- Coffee shop listings: Target 50+ within 3 months
- Balanced traffic: 60/40 split (carts/shops) acceptable

### SEO Performance
- "coffee shop [suburb]" rankings: Top 10 for 20+ suburbs (6 months)
- "mobile coffee cart melbourne": Maintain current position
- Organic sessions: +100% within 6 months

### User Engagement
- Avg vendors viewed per session: Target 5+
- Filter usage: 80% of sessions use filters
- Vendor type filter adoption: 50% use type filter

---

## 📝 Next Steps

**Immediate (This Week):**
1. Create coffee shop profile template
2. Update vendor detail page to support both types
3. Add vendor type filter to browse page
4. Test with example coffee shop data

**Short-term (Next 2 Weeks):**
5. Create `/coffee-shops` landing page
6. Update homepage messaging for dual marketplace
7. Build 10 suburb landing pages (Carlton, Fitzroy, CBD, etc.)
8. Update metadata across all pages

**Medium-term (Next Month):**
9. Outreach to 50 Melbourne coffee shops
10. Create Google Business Profile for platform
11. Start building local citations
12. Launch publicly with announcement

---

## 🔗 Related Documents

- [Coffee Shop Expansion Plan](./coffee-shop-expansion-plan.md) - Full planning document
- [Public Pages SEO Audit](./public-pages-audit.md) - SEO strategy
- [Migrations](./migrations/) - Database migration scripts

---

**Last Updated:** 2026-02-05 (Phase 1 Complete)
