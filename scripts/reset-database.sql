-- ============================================================================
-- COMPLETE DATABASE RESET FOR THE BEAN ROUTE
-- ============================================================================
-- This script drops all tables and recreates the database from scratch
-- Run this in Supabase SQL Editor when you want a fresh start
-- ============================================================================

-- ============================================================================
-- STEP 1: DROP EVERYTHING
-- ============================================================================

DROP TABLE IF EXISTS quotes CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS vendor_applications CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS vendor_sessions CASCADE;
DROP TABLE IF EXISTS quiz_attempts CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS vendor_badges CASCADE;
DROP TABLE IF EXISTS badges CASCADE;
DROP TABLE IF EXISTS profile_sections CASCADE;
DROP TABLE IF EXISTS work_history CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;

DROP EXTENSION IF EXISTS vector CASCADE;

-- ============================================================================
-- STEP 2: BASE SCHEMA (from supabase-schema.sql)
-- ============================================================================

-- Vendors table (base schema)
CREATE TABLE vendors (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  business_name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  suburbs TEXT[] NOT NULL DEFAULT '{}',
  price_min INTEGER,
  price_max INTEGER,
  capacity_min INTEGER,
  capacity_max INTEGER,
  description TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  image_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  social_links JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inquiries table
CREATE TABLE inquiries (
  id TEXT PRIMARY KEY,
  vendor_id TEXT NOT NULL REFERENCES vendors(id),
  event_type TEXT,
  event_date TEXT,
  event_duration_hours INTEGER,
  guest_count INTEGER,
  location TEXT,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  special_requests TEXT,
  estimated_cost INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row-Level Security
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vendors_public_read" ON vendors FOR SELECT USING (TRUE);
CREATE POLICY "inquiries_public_insert" ON inquiries FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "inquiries_no_anon_read" ON inquiries FOR SELECT USING (FALSE);

-- Vendor applications
CREATE TABLE vendor_applications (
  id TEXT PRIMARY KEY,
  business_name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  description TEXT NOT NULL,
  suburbs TEXT[] NOT NULL,
  price_min INTEGER NOT NULL,
  price_max INTEGER NOT NULL,
  capacity_min INTEGER NOT NULL,
  capacity_max INTEGER NOT NULL,
  event_types TEXT[] NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  website TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Jobs table
CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  event_title TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date TEXT NOT NULL,
  duration_hours INTEGER NOT NULL,
  guest_count INTEGER NOT NULL,
  location TEXT NOT NULL,
  budget_min INTEGER,
  budget_max INTEGER NOT NULL,
  special_requirements TEXT,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Quotes table
CREATE TABLE quotes (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  vendor_name TEXT NOT NULL,
  price_per_hour INTEGER NOT NULL,
  message TEXT,
  contact_email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admin sessions
CREATE TABLE admin_sessions (
  email TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- STEP 3: MIGRATION 000 - Vendor Types & Coffee Shop Fields
-- ============================================================================

ALTER TABLE vendors
ADD COLUMN vendor_type TEXT DEFAULT 'mobile_cart' CHECK (vendor_type IN ('mobile_cart', 'coffee_shop', 'barista')),
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN physical_address TEXT,
ADD COLUMN google_maps_url TEXT,
ADD COLUMN latitude NUMERIC(10, 7),
ADD COLUMN longitude NUMERIC(10, 7),
ADD COLUMN opening_hours JSONB,
ADD COLUMN seating_capacity INTEGER,
ADD COLUMN wifi_available BOOLEAN DEFAULT FALSE,
ADD COLUMN parking_available BOOLEAN DEFAULT FALSE,
ADD COLUMN outdoor_seating BOOLEAN DEFAULT FALSE,
ADD COLUMN wheelchair_accessible BOOLEAN DEFAULT FALSE,
ADD COLUMN menu_url TEXT,
ADD COLUMN menu_items JSONB,
ADD COLUMN price_range TEXT CHECK (price_range IN ('$', '$$', '$$$', '$$$$')),
ADD COLUMN average_rating NUMERIC(2, 1),
ADD COLUMN review_count INTEGER DEFAULT 0,
ADD COLUMN instagram_handle TEXT,
ADD COLUMN facebook_url TEXT,
ADD COLUMN ai_bio TEXT,
ADD COLUMN ai_specialties TEXT[],
ADD COLUMN ai_target_events TEXT[],
ADD COLUMN ai_usp TEXT;

CREATE INDEX idx_vendors_type ON vendors(vendor_type);

-- ============================================================================
-- STEP 4: MIGRATION 001 - Enable pgvector
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================================
-- STEP 5: MIGRATION 002 - Social Profiles Schema
-- ============================================================================

-- Work history
CREATE TABLE work_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barista_id TEXT NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  shop_id TEXT NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'pending',
  metadata_llm JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (end_date IS NULL OR end_date >= start_date),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected'))
);

CREATE INDEX idx_work_history_barista ON work_history(barista_id);
CREATE INDEX idx_work_history_shop ON work_history(shop_id);
CREATE INDEX idx_work_history_status ON work_history(status);

-- Profile sections
CREATE TABLE profile_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id TEXT NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL,
  is_unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMPTZ,
  unlock_method TEXT,
  content_llm JSONB NOT NULL DEFAULT '{}',
  CONSTRAINT valid_section_type CHECK (
    section_type IN ('about', 'work_history', 'skills', 'certifications', 'portfolio', 'equipment', 'events')
  ),
  UNIQUE(vendor_id, section_type)
);

CREATE INDEX idx_profile_sections_vendor ON profile_sections(vendor_id);

-- Badges
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  badge_type TEXT NOT NULL,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon_url TEXT,
  tier INTEGER DEFAULT 1,
  criteria_llm JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_badge_type CHECK (badge_type IN ('verification', 'skill', 'achievement')),
  CONSTRAINT valid_tier CHECK (tier IN (1, 2, 3))
);

-- Vendor badges
CREATE TABLE vendor_badges (
  vendor_id TEXT NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  evidence_llm JSONB NOT NULL DEFAULT '{}',
  PRIMARY KEY (vendor_id, badge_id)
);

CREATE INDEX idx_vendor_badges_vendor ON vendor_badges(vendor_id);

-- Quizzes
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  pass_score INTEGER DEFAULT 80,
  unlocks_badge_id UUID REFERENCES badges(id) ON DELETE SET NULL,
  questions_llm JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz attempts
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id TEXT NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  answers_llm JSONB NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quiz_attempts_vendor ON quiz_attempts(vendor_id);
CREATE INDEX idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_vendor_quiz ON quiz_attempts(vendor_id, quiz_id);

-- Vendor sessions
CREATE TABLE vendor_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL,
  vendor_id TEXT REFERENCES vendors(id),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vendor_sessions_email ON vendor_sessions(email);
CREATE INDEX idx_vendor_sessions_expires ON vendor_sessions(expires_at);

-- ============================================================================
-- STEP 6: MIGRATION 003 - LLM Profile Fields
-- ============================================================================

ALTER TABLE vendors
ADD COLUMN profile_llm JSONB DEFAULT '{}',
ADD COLUMN profile_embedding vector(1536),
ADD COLUMN embedding_updated_at TIMESTAMPTZ,
ADD COLUMN profile_completion_percent INTEGER DEFAULT 0;

ALTER TABLE vendors
ADD CONSTRAINT valid_completion_percent CHECK (
  profile_completion_percent >= 0 AND profile_completion_percent <= 100
);

CREATE INDEX idx_vendors_embedding
ON vendors
USING ivfflat (profile_embedding vector_cosine_ops)
WITH (lists = 100);

-- ============================================================================
-- STEP 7: MIGRATION 004 - RLS Policies
-- ============================================================================

ALTER TABLE work_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_sessions ENABLE ROW LEVEL SECURITY;

-- Work history policies
CREATE POLICY "work_history_insert" ON work_history FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "work_history_select" ON work_history FOR SELECT USING (TRUE);

-- Profile sections policies
CREATE POLICY "profile_sections_public_read" ON profile_sections FOR SELECT USING (TRUE);
CREATE POLICY "profile_sections_vendor_insert" ON profile_sections FOR INSERT WITH CHECK (TRUE);

-- Badges policies
CREATE POLICY "badges_public_read" ON badges FOR SELECT USING (TRUE);

-- Vendor badges policies
CREATE POLICY "vendor_badges_public_read" ON vendor_badges FOR SELECT USING (TRUE);
CREATE POLICY "vendor_badges_insert" ON vendor_badges FOR INSERT WITH CHECK (TRUE);

-- Quizzes policies
CREATE POLICY "quizzes_public_read" ON quizzes FOR SELECT USING (TRUE);

-- Quiz attempts policies
CREATE POLICY "quiz_attempts_vendor_insert" ON quiz_attempts FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "quiz_attempts_vendor_select" ON quiz_attempts FOR SELECT USING (TRUE);

-- Vendor sessions policies (service role only)
CREATE POLICY "vendor_sessions_service_only" ON vendor_sessions FOR ALL USING (FALSE);

-- ============================================================================
-- STEP 8: MIGRATION 005 - Seed Badges
-- ============================================================================

INSERT INTO badges (badge_type, name, description, icon_url, tier, criteria_llm)
VALUES
  ('verification', 'Verified', 'Admin-approved vendor', '✓', 1, '{"type": "manual", "admin_only": true}'::jsonb),
  ('verification', 'Background Checked', 'Passed security clearance', '✓', 1, '{"type": "manual", "admin_only": true}'::jsonb),
  ('verification', 'Elite Barista', 'Top 10% rating', '✓', 1, '{"type": "achievement", "avg_rating": 4.8}'::jsonb),
  ('skill', 'Latte Art Master', 'Certified latte art expert', '⭐', 2, '{"type": "quiz", "quiz_id": "latte-art-101", "pass_score": 90}'::jsonb),
  ('skill', 'Espresso Expert', 'Certified espresso specialist', '⭐', 2, '{"type": "quiz", "quiz_id": "espresso-fundamentals", "pass_score": 85}'::jsonb),
  ('achievement', '50 Jobs Completed', 'Completed 50+ bookings', '🏆', 3, '{"type": "achievement", "jobs_completed": 50}'::jsonb),
  ('achievement', '5-Star Champion', 'Maintained 5.0 rating for 10+ jobs', '🏆', 3, '{"type": "achievement", "perfect_rating_streak": 10}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check table count (should be 13)
SELECT COUNT(*) as total_tables
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- Check vendor columns count (should be 41)
SELECT COUNT(*) as vendor_columns
FROM information_schema.columns
WHERE table_name = 'vendors';

-- Check badges count (should be 7)
SELECT COUNT(*) as badge_count FROM badges;

-- List all tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;
