-- Epic 2: Schema Updates

-- 1. Add image_url and physical_address to vendor_applications
ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS physical_address TEXT;

-- 2. Add physical_address to vendors table (already exists in some versions but ensure it)
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS physical_address TEXT;

-- 3. Add management_token to jobs
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS management_token TEXT UNIQUE;

-- 3. Create Storage bucket for vendor images
-- Note: This usually requires Supabase dashboard or API, 
-- but we can document the expectation or use a script if available.
-- For now, we'll assume the policy for the bucket.
