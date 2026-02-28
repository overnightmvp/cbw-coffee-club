-- ============================================================================
-- Migration: 002-social-profiles-schema.sql
-- Description: LinkedIn-style barista profiles with work history, badges, and quizzes
-- Created: 2026-02-28
-- ============================================================================
--
-- MANUAL APPLICATION REQUIRED:
-- This migration must be run manually in Supabase SQL Editor:
-- 1. Go to https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new
-- 2. Copy and paste this entire file
-- 3. Click "Run" to execute
--
-- This creates 7 tables for the social profiles feature:
-- - work_history: Barista employment records with verification
-- - profile_sections: Progressive profile unlocking for gamification
-- - badges: Master table of all available badges
-- - vendor_badges: Many-to-many relationship for earned badges
-- - quizzes: Quiz master table (Phase 2, schema only)
-- - quiz_attempts: Track quiz attempts (Phase 2, schema only)
-- - vendor_sessions: Vendor authentication sessions
-- ============================================================================

-- ============================================================================
-- WORK HISTORY TABLE
-- ============================================================================
-- Track barista employment at coffee shops with verification status

CREATE TABLE work_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barista_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  shop_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
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

COMMENT ON TABLE work_history IS 'Barista employment records with shop verification';
COMMENT ON COLUMN work_history.status IS 'pending: awaiting shop approval, approved: verified by shop, rejected: denied by shop';
COMMENT ON COLUMN work_history.metadata_llm IS 'Structured data for LLM: responsibilities, achievements, skills_developed';

-- ============================================================================
-- PROFILE SECTIONS TABLE
-- ============================================================================
-- Track unlocked profile sections for progressive gamification

CREATE TABLE profile_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
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

COMMENT ON TABLE profile_sections IS 'Progressive profile unlocking for gamification';
COMMENT ON COLUMN profile_sections.unlock_method IS 'Examples: quiz:latte-art-101, task:add-3-work-experiences, admin:manual';

-- ============================================================================
-- BADGES TABLE
-- ============================================================================
-- Master table of all available badges

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

COMMENT ON TABLE badges IS 'Master list of all badges (verification, skill, achievement)';
COMMENT ON COLUMN badges.tier IS '1=verification (blue), 2=skill (gold), 3=achievement (purple)';
COMMENT ON COLUMN badges.criteria_llm IS 'Earning criteria: {type: manual|quiz|achievement, ...}';

-- ============================================================================
-- VENDOR BADGES TABLE
-- ============================================================================
-- Many-to-many: vendors to earned badges

CREATE TABLE vendor_badges (
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  evidence_llm JSONB NOT NULL DEFAULT '{}',

  PRIMARY KEY (vendor_id, badge_id)
);

CREATE INDEX idx_vendor_badges_vendor ON vendor_badges(vendor_id);

COMMENT ON TABLE vendor_badges IS 'Tracks which badges each vendor has earned';
COMMENT ON COLUMN vendor_badges.evidence_llm IS 'Evidence for earning: quiz_score, jobs_completed, avg_rating, etc.';

-- ============================================================================
-- QUIZZES TABLE (Phase 2 - schema only)
-- ============================================================================

CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  pass_score INTEGER DEFAULT 80,
  unlocks_badge_id UUID REFERENCES badges(id) ON DELETE SET NULL,
  questions_llm JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE quizzes IS 'Quiz master table for skill certifications (Phase 2)';
COMMENT ON COLUMN quizzes.questions_llm IS 'Array of {q, options[], correct, explanation}';

-- ============================================================================
-- QUIZ ATTEMPTS TABLE (Phase 2 - schema only)
-- ============================================================================

CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  answers_llm JSONB NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quiz_attempts_vendor ON quiz_attempts(vendor_id);
CREATE INDEX idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_vendor_quiz ON quiz_attempts(vendor_id, quiz_id);

COMMENT ON TABLE quiz_attempts IS 'Track user quiz attempts and scores (Phase 2)';

-- ============================================================================
-- VENDOR SESSIONS TABLE
-- ============================================================================
-- Vendor authentication sessions (mirrors admin_sessions)

CREATE TABLE vendor_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL,
  vendor_id UUID REFERENCES vendors(id),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vendor_sessions_email ON vendor_sessions(email);
CREATE INDEX idx_vendor_sessions_expires ON vendor_sessions(expires_at);

COMMENT ON TABLE vendor_sessions IS 'OTP-based authentication for vendors';
COMMENT ON COLUMN vendor_sessions.vendor_id IS 'NULL for new vendors, populated after profile claim';
