-- Create table for storing admin verification codes
-- This replaces the in-memory Map which doesn't work in serverless environments

CREATE TABLE IF NOT EXISTS admin_verification_codes (
  email TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for expiration cleanup if needed
CREATE INDEX IF NOT EXISTS idx_admin_verification_codes_expires_at ON admin_verification_codes(expires_at);

-- RLS Policies (Disable all public access, only accessible via service role)
ALTER TABLE admin_verification_codes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS admin_verification_codes_no_public_access ON admin_verification_codes;
CREATE POLICY admin_verification_codes_no_public_access ON admin_verification_codes
  FOR ALL USING (false);
