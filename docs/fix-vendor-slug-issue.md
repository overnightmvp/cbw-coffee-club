# Fix: Vendor Links Redirect to /vendors/undefined

## Problem

Clicking "View" on vendor cards causes the app to redirect to `/vendors/undefined`, resulting in 500 errors.

**Error message when trying to seed data:**
```
ERROR: 42703: column "slug" of relation "vendors" does not exist
LINE 7: INSERT INTO vendors (id, slug, business_name, specialty, ...)
```

## Root Cause

The `slug` column doesn't exist in your Supabase `vendors` table. The schema file (`supabase-schema.sql`) defines it, but the actual database table was created without this column.

## Solution: Database Migration

You need to add the `slug` column to your existing `vendors` table before you can seed data or use vendor links.

### Step 1: Add Slug Column (Run in Supabase SQL Editor)

```sql
-- Migration: Add slug column to vendors table
-- Run this in Supabase SQL Editor BEFORE running seed-vendors.sql

-- Step 1: Add the slug column (initially nullable to allow existing records)
ALTER TABLE vendors
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Step 2: Check if there are any existing vendors and generate slugs
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
```

**Expected output:**
- If you have existing vendors: Shows them with newly generated slugs
- If no existing vendors: "No existing vendors found. Ready for seed data."

### Step 2: Run Seed Script (Optional - If No Existing Data)

If your vendors table is empty, run the seed script to populate it with 10 sample Melbourne coffee cart vendors:

```bash
# In Supabase SQL Editor, run the contents of:
scripts/seed-vendors.sql
```

This will insert:
1. Bean Machine Melbourne (`bean-machine-melbourne`)
2. Roast Riders (`roast-riders`)
3. Espresso Express (`espresso-express`)
4. Little Latte Cart (`little-latte-cart`)
5. Morning Buzz Mobile (`morning-buzz-mobile`)
6. Cart Noir (`cart-noir`)
7. Java Junction (`java-junction`)
8. The Grind Melbourne (`the-grind-melbourne`)
9. Café on Wheels (`cafe-wheels`)
10. Steam & Co. (`steam-and-co`)

### Step 3: Verify in Local App

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Visit http://localhost:3000 (or 3001)

3. Click "View" on any vendor card

4. Should now redirect correctly to `/vendors/[slug]` instead of `/vendors/undefined`

## Code Changes (Defensive Coding)

After fixing the database, you may also want to add defensive checks in the code to handle edge cases:

### File: `src/app/app/page.tsx` (line 233)

**Current:**
```tsx
<Link href={`/vendors/${vendor.slug}`}>
  <Button size="sm" variant="outline">View</Button>
</Link>
```

**Add null check:**
```tsx
{vendor.slug ? (
  <Link href={`/vendors/${vendor.slug}`}>
    <Button size="sm" variant="outline">View</Button>
  </Link>
) : (
  <Button size="sm" variant="outline" disabled>
    No Slug
  </Button>
)}
```

### File: `src/components/experiences/HorizontalExperiences.tsx` (line 207)

**Current:**
```tsx
<Link href={`/vendors/${vendor.slug}`}>
  <Button size="sm" variant="outline" className="min-h-[44px] touch-manipulation">
    View
  </Button>
</Link>
```

**Add null check:**
```tsx
{vendor.slug ? (
  <Link href={`/vendors/${vendor.slug}`}>
    <Button size="sm" variant="outline" className="min-h-[44px] touch-manipulation">
      View
    </Button>
  </Link>
) : (
  <Button size="sm" variant="outline" disabled className="min-h-[44px] touch-manipulation">
    No Slug
  </Button>
)}
```

### File: `src/app/vendors/[slug]/page.tsx`

Add validation at the top of both functions to handle "undefined" slug:

```tsx
export async function generateMetadata({ params }: { params: { slug: string } }) {
  if (!params.slug || params.slug === 'undefined') {
    return { title: 'Invalid Vendor | The Bean Route' }
  }
  // ... existing code
}

export default async function VendorPage({ params }: { params: { slug: string } }) {
  if (!params.slug || params.slug === 'undefined') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Invalid vendor URL</h1>
          <p className="text-neutral-600 mb-4">The vendor slug is missing or invalid.</p>
          <Link href="/app">
            <Button>Browse all vendors</Button>
          </Link>
        </div>
      </div>
    )
  }
  // ... existing code
}
```

## Verification Checklist

- [ ] Migration script executed successfully in Supabase
- [ ] All vendors have slug values (check with `SELECT id, business_name, slug FROM vendors`)
- [ ] Seed script ran successfully (if you had no existing data)
- [ ] Local dev server shows vendors correctly
- [ ] Clicking "View" redirects to proper vendor pages (not `/vendors/undefined`)
- [ ] No more 500 errors in browser console
- [ ] Individual vendor pages load correctly

## Troubleshooting

**Q: I still get "column does not exist" error**
A: Make sure you're running the migration in the correct Supabase project/database. Check the database connection in your `.env.local` file.

**Q: Slugs are duplicated**
A: The migration script handles this by appending a number (e.g., `vendor-name-2`). You can manually update them to unique values.

**Q: I have custom vendor data I want to keep**
A: The migration script preserves existing records and generates slugs from `business_name`. Your data will not be deleted.

**Q: Can I skip the seed script?**
A: Yes, if you have existing vendors or want to add them manually through the admin panel. The seed script is optional.
