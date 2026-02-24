-- Disable world-writable access for critical tables
-- and set up proper RLS policies.

-- 1. admin_verification_codes
ALTER TABLE admin_verification_codes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON admin_verification_codes;
CREATE POLICY "Admin only select/delete" ON admin_verification_codes
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 2. vendor_applications
ALTER TABLE vendor_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public insert" ON vendor_applications;
CREATE POLICY "Public insert vendor applications" ON vendor_applications
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Admin full access vendor applications" ON vendor_applications
    FOR ALL
    TO service_role
    USING (true);

-- 3. jobs
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read/insert" ON jobs;
CREATE POLICY "Public read jobs" ON jobs
    FOR SELECT
    TO anon
    USING (status = 'active');

CREATE POLICY "Public insert jobs" ON jobs
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Admin full access jobs" ON jobs
    FOR ALL
    TO service_role
    USING (true);

-- 4. quotes
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public insert" ON quotes;
CREATE POLICY "Public insert quotes" ON quotes
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Admin full access quotes" ON quotes
    FOR ALL
    TO service_role
    USING (true);

-- 5. inquiries
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public insert" ON inquiries;
CREATE POLICY "Public insert inquiries" ON inquiries
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Admin full access inquiries" ON inquiries
    FOR ALL
    TO service_role
    USING (true);
