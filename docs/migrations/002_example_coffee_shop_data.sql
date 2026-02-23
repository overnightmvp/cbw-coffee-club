-- Example Coffee Shop Data for Testing
-- Run this AFTER 001_add_coffee_shop_support.sql has been applied
-- This provides sample data for development and testing

-- ============================================================
-- COFFEE SHOP EXAMPLES (Melbourne)
-- ============================================================

-- 1. Seven Seeds Coffee Roasters (Carlton)
INSERT INTO vendors (
  id,
  vendor_type,
  business_name,
  slug,
  specialty,
  description,
  physical_address,
  latitude,
  longitude,
  suburbs,
  opening_hours,
  seating_capacity,
  wifi_available,
  parking_available,
  outdoor_seating,
  wheelchair_accessible,
  price_range,
  tags,
  contact_email,
  contact_phone,
  website,
  instagram_handle,
  verified,
  price_min,
  price_max,
  capacity_min,
  capacity_max
) VALUES (
  'vnd_coffee_7seeds_001',
  'coffee_shop',
  'Seven Seeds Coffee Roasters',
  'seven-seeds-coffee-roasters',
  'Specialty coffee roasting & cafe',
  'Melbourne''s pioneering specialty coffee roaster with a focus on direct trade, sustainability, and exceptional espresso. Our Carlton cafe features a full brew bar, retail counter, and training space.',
  '114 Berkeley Street, Carlton VIC 3053',
  -37.7994,
  144.9667,
  ARRAY['Carlton', 'Parkville', 'North Melbourne'],
  '{
    "monday": {"open": "07:00", "close": "16:00"},
    "tuesday": {"open": "07:00", "close": "16:00"},
    "wednesday": {"open": "07:00", "close": "16:00"},
    "thursday": {"open": "07:00", "close": "16:00"},
    "friday": {"open": "07:00", "close": "16:00"},
    "saturday": {"open": "08:00", "close": "17:00"},
    "sunday": {"open": "08:00", "close": "17:00"}
  }'::jsonb,
  40,
  true,
  false,
  true,
  true,
  '$$',
  ARRAY['specialty-coffee', 'espresso', 'pour-over', 'single-origin', 'roastery'],
  'carlton@sevenseeds.com.au',
  '(03) 9347 8664',
  'https://sevenseeds.com.au',
  'sevenseeds',
  true,
  0, 0, 0, 0 -- Not used for coffee shops, but required by schema
) ON CONFLICT (slug) DO NOTHING;

-- 2. Market Lane Coffee (Prahran)
INSERT INTO vendors (
  id,
  vendor_type,
  business_name,
  slug,
  specialty,
  description,
  physical_address,
  latitude,
  longitude,
  suburbs,
  opening_hours,
  seating_capacity,
  wifi_available,
  parking_available,
  outdoor_seating,
  wheelchair_accessible,
  price_range,
  tags,
  contact_email,
  contact_phone,
  website,
  instagram_handle,
  verified,
  price_min,
  price_max,
  capacity_min,
  capacity_max
) VALUES (
  'vnd_coffee_marketlane_002',
  'coffee_shop',
  'Market Lane Coffee',
  'market-lane-coffee-prahran',
  'Specialty coffee & roastery',
  'Award-winning Melbourne coffee roaster and cafe. We source exceptional green coffee from around the world and roast it to highlight the unique characteristics of each origin.',
  '60 Chapel Street, Prahran VIC 3181',
  -37.8514,
  144.9900,
  ARRAY['Prahran', 'South Yarra', 'Windsor'],
  '{
    "monday": {"open": "07:00", "close": "17:00"},
    "tuesday": {"open": "07:00", "close": "17:00"},
    "wednesday": {"open": "07:00", "close": "17:00"},
    "thursday": {"open": "07:00", "close": "17:00"},
    "friday": {"open": "07:00", "close": "17:00"},
    "saturday": {"open": "08:00", "close": "16:00"},
    "sunday": {"open": "08:00", "close": "16:00"}
  }'::jsonb,
  30,
  true,
  true,
  false,
  true,
  '$$',
  ARRAY['specialty-coffee', 'espresso', 'filter', 'roastery'],
  'info@marketlane.com.au',
  '(03) 9510 5016',
  'https://marketlane.com.au',
  'marketlanecoffee',
  true,
  0, 0, 0, 0
) ON CONFLICT (slug) DO NOTHING;

-- 3. Brother Baba Budan (CBD)
INSERT INTO vendors (
  id,
  vendor_type,
  business_name,
  slug,
  specialty,
  description,
  physical_address,
  latitude,
  longitude,
  suburbs,
  opening_hours,
  seating_capacity,
  wifi_available,
  parking_available,
  outdoor_seating,
  wheelchair_accessible,
  price_range,
  tags,
  contact_email,
  contact_phone,
  website,
  verified,
  price_min,
  price_max,
  capacity_min,
  capacity_max
) VALUES (
  'vnd_coffee_bbb_003',
  'coffee_shop',
  'Brother Baba Budan',
  'brother-baba-budan',
  'Laneway specialty cafe',
  'Hidden gem in Melbourne''s famous laneways. Serving exceptional coffee in an intimate, character-filled space. No laptops policy ensures a cafe focused on coffee and conversation.',
  '359 Little Bourke Street, Melbourne VIC 3000',
  -37.8117,
  144.9614,
  ARRAY['CBD', 'Melbourne City'],
  '{
    "monday": {"open": "07:30", "close": "17:00"},
    "tuesday": {"open": "07:30", "close": "17:00"},
    "wednesday": {"open": "07:30", "close": "17:00"},
    "thursday": {"open": "07:30", "close": "17:00"},
    "friday": {"open": "07:30", "close": "17:00"},
    "saturday": {"open": "08:00", "close": "17:00"},
    "sunday": {"open": "09:00", "close": "16:00"}
  }'::jsonb,
  20,
  false, -- Famous for no WiFi/laptops policy
  false,
  false,
  false,
  '$$',
  ARRAY['specialty-coffee', 'espresso', 'laneway', 'no-wifi'],
  null, -- No public email
  null, -- No public phone
  null, -- No website
  true,
  0, 0, 0, 0
) ON CONFLICT (slug) DO NOTHING;

-- 4. Padre Coffee (Brunswick)
INSERT INTO vendors (
  id,
  vendor_type,
  business_name,
  slug,
  specialty,
  description,
  physical_address,
  latitude,
  longitude,
  suburbs,
  opening_hours,
  seating_capacity,
  wifi_available,
  parking_available,
  outdoor_seating,
  wheelchair_accessible,
  price_range,
  tags,
  contact_email,
  contact_phone,
  website,
  instagram_handle,
  verified,
  price_min,
  price_max,
  capacity_min,
  capacity_max
) VALUES (
  'vnd_coffee_padre_004',
  'coffee_shop',
  'Padre Coffee',
  'padre-coffee-brunswick',
  'Specialty roaster & training hub',
  'Award-winning Melbourne coffee roaster with a passion for education. Our Brunswick cafe is also home to our coffee school and cupping lab.',
  '438 City Road, South Melbourne VIC 3205',
  -37.8294,
  144.9631,
  ARRAY['Brunswick', 'Fitzroy North', 'Northcote'],
  '{
    "monday": {"open": "07:00", "close": "16:00"},
    "tuesday": {"open": "07:00", "close": "16:00"},
    "wednesday": {"open": "07:00", "close": "16:00"},
    "thursday": {"open": "07:00", "close": "16:00"},
    "friday": {"open": "07:00", "close": "16:00"},
    "saturday": {"open": "08:00", "close": "15:00"},
    "sunday": {"open": "08:00", "close": "15:00"}
  }'::jsonb,
  35,
  true,
  true,
  true,
  true,
  '$$',
  ARRAY['specialty-coffee', 'roastery', 'training', 'education'],
  'info@padrecoffee.com.au',
  '(03) 9686 6957',
  'https://padrecoffee.com.au',
  'padrecoffee',
  true,
  0, 0, 0, 0
) ON CONFLICT (slug) DO NOTHING;

-- 5. ST. ALi Coffee Roasters (South Melbourne)
INSERT INTO vendors (
  id,
  vendor_type,
  business_name,
  slug,
  specialty,
  description,
  physical_address,
  latitude,
  longitude,
  suburbs,
  opening_hours,
  seating_capacity,
  wifi_available,
  parking_available,
  outdoor_seating,
  wheelchair_accessible,
  price_range,
  tags,
  contact_email,
  contact_phone,
  website,
  instagram_handle,
  menu_url,
  verified,
  price_min,
  price_max,
  capacity_min,
  capacity_max
) VALUES (
  'vnd_coffee_stali_005',
  'coffee_shop',
  'ST. ALi Coffee Roasters',
  'st-ali-coffee-roasters',
  'Specialty coffee pioneer & roastery',
  'One of Melbourne''s original specialty coffee pioneers. ST. ALi is a full-service cafe, roastery, and training facility in the heart of South Melbourne''s industrial precinct.',
  '12-18 Yarra Place, South Melbourne VIC 3205',
  -37.8303,
  144.9528,
  ARRAY['South Melbourne', 'Southbank', 'Port Melbourne'],
  '{
    "monday": {"open": "07:00", "close": "17:00"},
    "tuesday": {"open": "07:00", "close": "17:00"},
    "wednesday": {"open": "07:00", "close": "17:00"},
    "thursday": {"open": "07:00", "close": "17:00"},
    "friday": {"open": "07:00", "close": "17:00"},
    "saturday": {"open": "08:00", "close": "17:00"},
    "sunday": {"open": "08:00", "close": "17:00"}
  }'::jsonb,
  50,
  true,
  true,
  true,
  true,
  '$$',
  ARRAY['specialty-coffee', 'roastery', 'training', 'brunch'],
  'cafe@st-ali.com.au',
  '(03) 9686 2990',
  'https://st-ali.com.au',
  'stali',
  'https://st-ali.com.au/menu',
  true,
  0, 0, 0, 0
) ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Count coffee shops vs mobile carts
-- SELECT vendor_type, COUNT(*) FROM vendors GROUP BY vendor_type;

-- List all coffee shops with addresses
-- SELECT business_name, physical_address, suburbs FROM vendors WHERE vendor_type = 'coffee_shop';

-- Check opening hours are valid JSON
-- SELECT business_name, opening_hours FROM vendors WHERE vendor_type = 'coffee_shop';

-- Find coffee shops by suburb
-- SELECT business_name, suburbs FROM vendors WHERE vendor_type = 'coffee_shop' AND 'Carlton' = ANY(suburbs);
