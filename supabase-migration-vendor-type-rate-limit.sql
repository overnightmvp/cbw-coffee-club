-- Idempotent Migration: Add vendor_type and Rate Limiting
-- Target: Supabase SQL Editor

-- 1. Update vendor_applications table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vendor_applications' AND column_name='vendor_type') THEN
        ALTER TABLE vendor_applications ADD COLUMN vendor_type TEXT NOT NULL DEFAULT 'mobile_cart' CHECK (vendor_type IN ('mobile_cart', 'coffee_shop', 'barista'));
    END IF;
END $$;

-- 2. Update vendors table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vendors' AND column_name='vendor_type') THEN
        ALTER TABLE vendors ADD COLUMN vendor_type TEXT NOT NULL DEFAULT 'mobile_cart' CHECK (vendor_type IN ('mobile_cart', 'coffee_shop', 'barista'));
    END IF;
END $$;

-- 3. Rate Limiting Infra
CREATE TABLE IF NOT EXISTS rate_limit_tracking (
    identifier TEXT NOT NULL,
    action TEXT NOT NULL,
    request_count INTEGER DEFAULT 1,
    last_request TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (identifier, action)
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_last_request ON rate_limit_tracking(last_request);

-- 4. RPC for atomic rate limit checking
CREATE OR REPLACE FUNCTION check_rate_limit(
    p_identifier TEXT,
    p_action TEXT,
    p_max_requests INTEGER,
    p_interval TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    v_current_count INTEGER;
BEGIN
    -- Cleanup old records older than 24 hours
    DELETE FROM rate_limit_tracking WHERE last_request < NOW() - INTERVAL '24 hours';

    INSERT INTO rate_limit_tracking (identifier, action, request_count, last_request)
    VALUES (p_identifier, p_action, 1, NOW())
    ON CONFLICT (identifier, action) DO UPDATE
    SET 
        request_count = CASE 
            WHEN rate_limit_tracking.last_request < NOW() - p_interval::INTERVAL THEN 1
            ELSE rate_limit_tracking.request_count + 1
        END,
        last_request = NOW()
    RETURNING request_count INTO v_current_count;

    RETURN v_current_count <= p_max_requests;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
