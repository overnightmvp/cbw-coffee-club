-- Migration: Add slug column to vendors table
-- Run this in Supabase SQL Editor BEFORE running seed-vendors.sql

-- Step 1: Add the slug column (initially nullable to allow existing records)
ALTER TABLE vendors
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Step 2: Check if there are any existing vendors
DO $$
DECLARE
  vendor_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO vendor_count FROM vendors;

  IF vendor_count > 0 THEN
    RAISE NOTICE 'Found % existing vendor(s). Generating slugs...', vendor_count;

    -- Generate slugs for existing vendors (from business_name)
    UPDATE vendors
    SET slug = lower(regexp_replace(business_name, '[^a-zA-Z0-9]+', '-', 'g'))
    WHERE slug IS NULL;

    -- Remove leading/trailing hyphens
    UPDATE vendors
    SET slug = trim(both '-' from slug)
    WHERE slug LIKE '-%' OR slug LIKE '%-';

    -- Handle potential duplicates by appending row number
    WITH numbered_vendors AS (
      SELECT id, slug, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY created_at) as rn
      FROM vendors
    )
    UPDATE vendors v
    SET slug = nv.slug || '-' || nv.rn
    FROM numbered_vendors nv
    WHERE v.id = nv.id AND nv.rn > 1;

  ELSE
    RAISE NOTICE 'No existing vendors found. Ready for seed data.';
  END IF;
END $$;

-- Step 3: Make slug NOT NULL and UNIQUE
ALTER TABLE vendors
ALTER COLUMN slug SET NOT NULL;

ALTER TABLE vendors
ADD CONSTRAINT vendors_slug_unique UNIQUE (slug);

-- Step 4: Verify the migration
SELECT id, business_name, slug FROM vendors ORDER BY created_at DESC;

-- ✅ Migration complete!
-- Now you can run: scripts/seed-vendors.sql
