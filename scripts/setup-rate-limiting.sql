-- Rate Limiting Table
CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier TEXT NOT NULL, -- IP, Email, or composite
    action TEXT NOT NULL,     -- e.g., 'inquiry', 'registration'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_action ON rate_limits(identifier, action, created_at);

-- RLS: Service role only
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON rate_limits FOR ALL TO service_role USING (true);

-- Utility function to check and increment
CREATE OR REPLACE FUNCTION check_rate_limit(
    p_identifier TEXT,
    p_action TEXT,
    p_max_requests INTEGER,
    p_interval INTERVAL
) RETURNS BOOLEAN AS $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT count(*) INTO v_count
    FROM rate_limits
    WHERE identifier = p_identifier
      AND action = p_action
      AND created_at > now() - p_interval;

    IF v_count >= p_max_requests THEN
        RETURN FALSE;
    END IF;

    INSERT INTO rate_limits (identifier, action)
    VALUES (p_identifier, p_action);

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
