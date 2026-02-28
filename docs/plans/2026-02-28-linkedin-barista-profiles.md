# LinkedIn-Style Barista Profiles Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform The Bean Route into a LinkedIn-style marketplace where baristas build professional portfolios, coffee shops verify work history, and clients discover talent through rich profiles with badges and LLM-powered semantic search.

**Architecture:** Extend existing OTP authentication pattern for vendors, add tabbed profile UI with progressive disclosure, implement work history verification workflow (barista claims → shop approves), store all data as structured JSONB + vector embeddings for future semantic search.

**Tech Stack:** Next.js 15, React 19, TypeScript, Supabase (PostgreSQL + pgvector), iron-session, OpenAI Embeddings API, Tailwind CSS, Zod validation

---

## Phase 1: Database Foundation

### Task 1: Enable pgvector Extension

**Files:**
- Create: `supabase-migrations/001-add-pgvector.sql`

**Step 1: Write pgvector migration**

Create `supabase-migrations/001-add-pgvector.sql`:

```sql
-- Enable pgvector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Verify extension is enabled
SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';
```

**Step 2: Apply migration in Supabase**

1. Go to Supabase Dashboard → SQL Editor
2. Copy content from `supabase-migrations/001-add-pgvector.sql`
3. Run query
4. Expected output: `CREATE EXTENSION` success, verify query returns `vector | 0.5.1`

**Step 3: Commit**

```bash
git add supabase-migrations/001-add-pgvector.sql
git commit -m "feat(db): enable pgvector extension for semantic search"
```

---

### Task 2: Create Core Tables Schema

**Files:**
- Create: `supabase-migrations/002-social-profiles-schema.sql`

**Step 1: Write work_history table migration**

Create `supabase-migrations/002-social-profiles-schema.sql`:

```sql
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
  metadata_llm JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_dates CHECK (end_date IS NULL OR end_date >= start_date),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected')),
  CONSTRAINT valid_barista_type CHECK (
    barista_id IN (SELECT id FROM vendors WHERE vendor_type = 'barista')
  ),
  CONSTRAINT valid_shop_type CHECK (
    shop_id IN (SELECT id FROM vendors WHERE vendor_type = 'coffee_shop')
  )
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
  content_llm JSONB DEFAULT '{}',

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
  criteria_llm JSONB DEFAULT '{}',
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
  evidence_llm JSONB DEFAULT '{}',

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
  unlocks_badge_id UUID REFERENCES badges(id),
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

COMMENT ON TABLE quiz_attempts IS 'Track user quiz attempts and scores (Phase 2)';

-- ============================================================================
-- VENDOR SESSIONS TABLE
-- ============================================================================
-- Vendor authentication sessions (mirrors admin_sessions)

CREATE TABLE vendor_sessions (
  email TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  vendor_id UUID REFERENCES vendors(id),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vendor_sessions_expires ON vendor_sessions(expires_at);

COMMENT ON TABLE vendor_sessions IS 'OTP-based authentication for vendors';
COMMENT ON COLUMN vendor_sessions.vendor_id IS 'NULL for new vendors, populated after profile claim';
```

**Step 2: Apply migration in Supabase**

1. Go to Supabase Dashboard → SQL Editor
2. Copy content from `supabase-migrations/002-social-profiles-schema.sql`
3. Run query
4. Expected output: All `CREATE TABLE` and `CREATE INDEX` succeed

**Step 3: Verify tables exist**

Run in SQL Editor:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('work_history', 'profile_sections', 'badges', 'vendor_badges', 'vendor_sessions', 'quizzes', 'quiz_attempts')
ORDER BY table_name;
```

Expected: 7 rows returned

**Step 4: Commit**

```bash
git add supabase-migrations/002-social-profiles-schema.sql
git commit -m "feat(db): add work history, badges, quizzes, sessions tables"
```

---

### Task 3: Alter Vendors Table for LLM Fields

**Files:**
- Create: `supabase-migrations/003-vendors-llm-fields.sql`

**Step 1: Write vendors table alterations**

Create `supabase-migrations/003-vendors-llm-fields.sql`:

```sql
-- Add LLM-ready fields to vendors table

ALTER TABLE vendors
ADD COLUMN IF NOT EXISTS profile_llm JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS profile_embedding vector(1536),
ADD COLUMN IF NOT EXISTS last_embedding_generated TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS profile_completion_percent INTEGER DEFAULT 0;

-- Add check constraint
ALTER TABLE vendors
ADD CONSTRAINT valid_completion_percent CHECK (
  profile_completion_percent >= 0 AND profile_completion_percent <= 100
);

-- Create pgvector index for semantic search
CREATE INDEX IF NOT EXISTS idx_vendors_embedding
ON vendors
USING ivfflat (profile_embedding vector_cosine_ops)
WITH (lists = 100);

-- Add comments
COMMENT ON COLUMN vendors.profile_llm IS 'Structured profile data: bio, specialties, certifications, availability, equipment_expertise, languages, service_style';
COMMENT ON COLUMN vendors.profile_embedding IS 'OpenAI embedding (1536 dims) for semantic search';
COMMENT ON COLUMN vendors.profile_completion_percent IS 'Profile completion percentage (0-100)';
```

**Step 2: Apply migration in Supabase**

1. Go to Supabase Dashboard → SQL Editor
2. Copy content from `supabase-migrations/003-vendors-llm-fields.sql`
3. Run query
4. Expected output: All `ALTER TABLE` and `CREATE INDEX` succeed

**Step 3: Verify columns exist**

Run in SQL Editor:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'vendors'
AND column_name IN ('profile_llm', 'profile_embedding', 'last_embedding_generated', 'profile_completion_percent')
ORDER BY column_name;
```

Expected: 4 rows returned

**Step 4: Commit**

```bash
git add supabase-migrations/003-vendors-llm-fields.sql
git commit -m "feat(db): add LLM fields to vendors table (JSONB + vector)"
```

---

### Task 4: Add Row-Level Security Policies

**Files:**
- Create: `supabase-migrations/004-rls-policies.sql`

**Step 1: Write RLS policies**

Create `supabase-migrations/004-rls-policies.sql`:

```sql
-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- ============================================================================
-- WORK HISTORY POLICIES
-- ============================================================================

ALTER TABLE work_history ENABLE ROW LEVEL SECURITY;

-- Anyone can add work history (baristas claiming employment)
CREATE POLICY "Anyone can insert work history" ON work_history
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Vendors can see their own work history + approved records
CREATE POLICY "Vendors see own and approved work history" ON work_history
  FOR SELECT
  TO anon
  USING (
    status = 'approved'
    OR barista_id::text = current_setting('request.jwt.claim.sub', true)
    OR shop_id::text = current_setting('request.jwt.claim.sub', true)
  );

-- Vendors can update their own pending work history
CREATE POLICY "Vendors update own pending work history" ON work_history
  FOR UPDATE
  TO anon
  USING (
    barista_id::text = current_setting('request.jwt.claim.sub', true)
    AND status = 'pending'
  );

-- Vendors can delete their own pending work history
CREATE POLICY "Vendors delete own pending work history" ON work_history
  FOR DELETE
  TO anon
  USING (
    barista_id::text = current_setting('request.jwt.claim.sub', true)
    AND status = 'pending'
  );

-- ============================================================================
-- VENDOR BADGES POLICIES
-- ============================================================================

ALTER TABLE vendor_badges ENABLE ROW LEVEL SECURITY;

-- Anyone can view badges
CREATE POLICY "Anyone can view vendor badges" ON vendor_badges
  FOR SELECT
  TO anon
  USING (true);

-- Only service role can insert/update/delete badges
-- (Admin manually assigns via Supabase dashboard or API with service role key)

-- ============================================================================
-- PROFILE SECTIONS POLICIES
-- ============================================================================

ALTER TABLE profile_sections ENABLE ROW LEVEL SECURITY;

-- Vendors can view their own sections
CREATE POLICY "Vendors see own profile sections" ON profile_sections
  FOR SELECT
  TO anon
  USING (
    vendor_id::text = current_setting('request.jwt.claim.sub', true)
  );

-- Vendors can insert their own sections
CREATE POLICY "Vendors insert own profile sections" ON profile_sections
  FOR INSERT
  TO anon
  WITH CHECK (
    vendor_id::text = current_setting('request.jwt.claim.sub', true)
  );

-- Vendors can update their own sections
CREATE POLICY "Vendors update own profile sections" ON profile_sections
  FOR UPDATE
  TO anon
  USING (
    vendor_id::text = current_setting('request.jwt.claim.sub', true)
  );

-- ============================================================================
-- BADGES POLICIES (READ-ONLY FOR ANON)
-- ============================================================================

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- Anyone can view badge definitions
CREATE POLICY "Anyone can view badges" ON badges
  FOR SELECT
  TO anon
  USING (true);

-- ============================================================================
-- VENDOR SESSIONS POLICIES (SERVICE ROLE ONLY)
-- ============================================================================

ALTER TABLE vendor_sessions ENABLE ROW LEVEL SECURITY;

-- No public access - all operations via API routes with service role
-- No policies needed (default deny all)

-- ============================================================================
-- QUIZZES POLICIES (READ-ONLY FOR ANON - Phase 2)
-- ============================================================================

ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

-- Anyone can view quizzes
CREATE POLICY "Anyone can view quizzes" ON quizzes
  FOR SELECT
  TO anon
  USING (true);

-- ============================================================================
-- QUIZ ATTEMPTS POLICIES (Phase 2)
-- ============================================================================

ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Vendors can view their own attempts
CREATE POLICY "Vendors see own quiz attempts" ON quiz_attempts
  FOR SELECT
  TO anon
  USING (
    vendor_id::text = current_setting('request.jwt.claim.sub', true)
  );

-- Vendors can insert their own attempts
CREATE POLICY "Vendors insert own quiz attempts" ON quiz_attempts
  FOR INSERT
  TO anon
  WITH CHECK (
    vendor_id::text = current_setting('request.jwt.claim.sub', true)
  );
```

**Step 2: Apply migration in Supabase**

1. Go to Supabase Dashboard → SQL Editor
2. Copy content from `supabase-migrations/004-rls-policies.sql`
3. Run query
4. Expected output: All `CREATE POLICY` succeed

**Step 3: Verify RLS enabled**

Run in SQL Editor:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('work_history', 'vendor_badges', 'profile_sections', 'badges', 'vendor_sessions')
ORDER BY tablename;
```

Expected: All rows show `rowsecurity = true`

**Step 4: Commit**

```bash
git add supabase-migrations/004-rls-policies.sql
git commit -m "feat(db): add RLS policies for social profile tables"
```

---

### Task 5: Seed Initial Badges

**Files:**
- Create: `supabase-migrations/005-seed-badges.sql`

**Step 1: Write badge seed data**

Create `supabase-migrations/005-seed-badges.sql`:

```sql
-- Seed initial verification badges

INSERT INTO badges (badge_type, name, description, icon_url, tier, criteria_llm)
VALUES
  (
    'verification',
    'Verified',
    'Admin-approved vendor',
    '✓',
    1,
    '{"type": "manual", "admin_only": true}'::jsonb
  ),
  (
    'verification',
    'Background Checked',
    'Passed security clearance',
    '✓',
    1,
    '{"type": "manual", "admin_only": true}'::jsonb
  ),
  (
    'verification',
    'Elite Barista',
    'Top 10% rating',
    '✓',
    1,
    '{"type": "achievement", "avg_rating": 4.8}'::jsonb
  ),
  (
    'skill',
    'Latte Art Master',
    'Certified latte art expert',
    '⭐',
    2,
    '{"type": "quiz", "quiz_id": "latte-art-101", "pass_score": 90}'::jsonb
  ),
  (
    'skill',
    'Espresso Expert',
    'Certified espresso specialist',
    '⭐',
    2,
    '{"type": "quiz", "quiz_id": "espresso-fundamentals", "pass_score": 85}'::jsonb
  ),
  (
    'achievement',
    '50 Jobs Completed',
    'Completed 50+ bookings',
    '🏆',
    3,
    '{"type": "achievement", "jobs_completed": 50}'::jsonb
  ),
  (
    'achievement',
    '5-Star Champion',
    'Maintained 5.0 rating for 10+ jobs',
    '🏆',
    3,
    '{"type": "achievement", "perfect_rating_streak": 10}'::jsonb
  )
ON CONFLICT (name) DO NOTHING;
```

**Step 2: Apply migration in Supabase**

1. Go to Supabase Dashboard → SQL Editor
2. Copy content from `supabase-migrations/005-seed-badges.sql`
3. Run query
4. Expected output: `INSERT 0 7` (or fewer if some already exist)

**Step 3: Verify badges created**

Run in SQL Editor:

```sql
SELECT name, badge_type, tier FROM badges ORDER BY tier, name;
```

Expected: 7 badges (3 verification, 2 skill, 2 achievement)

**Step 4: Commit**

```bash
git add supabase-migrations/005-seed-badges.sql
git commit -m "feat(db): seed initial badges (verification, skill, achievement)"
```

---

## Phase 2: TypeScript Types & Utilities

### Task 6: Update Supabase Types

**Files:**
- Modify: `src/lib/supabase.ts`

**Step 1: Add new table types to Database interface**

Update `src/lib/supabase.ts` (add after existing `vendors` table type):

```typescript
export interface Database {
  public: {
    Tables: {
      // ... existing tables (vendors, inquiries, etc.)

      work_history: {
        Row: {
          id: string
          barista_id: string
          shop_id: string
          role: string
          start_date: string // ISO date
          end_date: string | null
          status: 'pending' | 'approved' | 'rejected'
          metadata_llm: {
            responsibilities?: string[]
            achievements?: string[]
            skills_developed?: string[]
          }
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          barista_id: string
          shop_id: string
          role: string
          start_date: string
          end_date?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          metadata_llm?: {
            responsibilities?: string[]
            achievements?: string[]
            skills_developed?: string[]
          }
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          barista_id?: string
          shop_id?: string
          role?: string
          start_date?: string
          end_date?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          metadata_llm?: {
            responsibilities?: string[]
            achievements?: string[]
            skills_developed?: string[]
          }
          created_at?: string
          updated_at?: string
        }
      }

      badges: {
        Row: {
          id: string
          badge_type: 'verification' | 'skill' | 'achievement'
          name: string
          description: string
          icon_url: string | null
          tier: 1 | 2 | 3
          criteria_llm: {
            type: 'manual' | 'quiz' | 'achievement'
            admin_only?: boolean
            quiz_id?: string
            pass_score?: number
            jobs_completed?: number
            avg_rating?: number
            perfect_rating_streak?: number
          }
          created_at: string
        }
        Insert: {
          id?: string
          badge_type: 'verification' | 'skill' | 'achievement'
          name: string
          description: string
          icon_url?: string | null
          tier?: 1 | 2 | 3
          criteria_llm?: object
          created_at?: string
        }
        Update: {
          id?: string
          badge_type?: 'verification' | 'skill' | 'achievement'
          name?: string
          description?: string
          icon_url?: string | null
          tier?: 1 | 2 | 3
          criteria_llm?: object
          created_at?: string
        }
      }

      vendor_badges: {
        Row: {
          vendor_id: string
          badge_id: string
          earned_at: string
          evidence_llm: {
            quiz_score?: number
            jobs_completed?: number
            avg_rating?: number
          }
        }
        Insert: {
          vendor_id: string
          badge_id: string
          earned_at?: string
          evidence_llm?: object
        }
        Update: {
          vendor_id?: string
          badge_id?: string
          earned_at?: string
          evidence_llm?: object
        }
      }

      profile_sections: {
        Row: {
          id: string
          vendor_id: string
          section_type: 'about' | 'work_history' | 'skills' | 'certifications' | 'portfolio' | 'equipment' | 'events'
          is_unlocked: boolean
          unlocked_at: string | null
          unlock_method: string | null
          content_llm: object
        }
        Insert: {
          id?: string
          vendor_id: string
          section_type: 'about' | 'work_history' | 'skills' | 'certifications' | 'portfolio' | 'equipment' | 'events'
          is_unlocked?: boolean
          unlocked_at?: string | null
          unlock_method?: string | null
          content_llm?: object
        }
        Update: {
          id?: string
          vendor_id?: string
          section_type?: 'about' | 'work_history' | 'skills' | 'certifications' | 'portfolio' | 'equipment' | 'events'
          is_unlocked?: boolean
          unlocked_at?: string | null
          unlock_method?: string | null
          content_llm?: object
        }
      }

      vendor_sessions: {
        Row: {
          email: string
          code: string
          vendor_id: string | null
          expires_at: string
          created_at: string
        }
        Insert: {
          email: string
          code: string
          vendor_id?: string | null
          expires_at: string
          created_at?: string
        }
        Update: {
          email?: string
          code?: string
          vendor_id?: string | null
          expires_at?: string
          created_at?: string
        }
      }

      quizzes: {
        Row: {
          id: string
          title: string
          category: string
          pass_score: number
          unlocks_badge_id: string | null
          questions_llm: {
            q: string
            options: string[]
            correct: number
            explanation: string
          }[]
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          category: string
          pass_score?: number
          unlocks_badge_id?: string | null
          questions_llm: object
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          category?: string
          pass_score?: number
          unlocks_badge_id?: string | null
          questions_llm?: object
          created_at?: string
        }
      }

      quiz_attempts: {
        Row: {
          id: string
          vendor_id: string
          quiz_id: string
          score: number
          passed: boolean
          answers_llm: object
          completed_at: string
        }
        Insert: {
          id?: string
          vendor_id: string
          quiz_id: string
          score: number
          passed: boolean
          answers_llm: object
          completed_at?: string
        }
        Update: {
          id?: string
          vendor_id?: string
          quiz_id?: string
          score?: number
          passed?: boolean
          answers_llm?: object
          completed_at?: string
        }
      }
    }
  }
}

// Extend Vendor type with new fields
export type Vendor = Database['public']['Tables']['vendors']['Row'] & {
  profile_llm?: {
    bio?: string
    specialties?: string[]
    certifications?: string[]
    availability?: {
      days?: string[]
      hours?: string
    }
    equipment_expertise?: string[]
    languages?: string[]
    service_style?: string
  }
  profile_embedding?: number[] // vector(1536)
  last_embedding_generated?: string
  profile_completion_percent?: number
}

// New helper types
export type WorkHistory = Database['public']['Tables']['work_history']['Row']
export type Badge = Database['public']['Tables']['badges']['Row']
export type VendorBadge = Database['public']['Tables']['vendor_badges']['Row']
export type ProfileSection = Database['public']['Tables']['profile_sections']['Row']
export type VendorSession = Database['public']['Tables']['vendor_sessions']['Row']
export type Quiz = Database['public']['Tables']['quizzes']['Row']
export type QuizAttempt = Database['public']['Tables']['quiz_attempts']['Row']
```

**Step 2: Verify TypeScript compiles**

Run:

```bash
npm run typecheck
```

Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/supabase.ts
git commit -m "feat(types): add work history, badges, sessions types to Database"
```

---

### Task 7: Create Vendor Session Config

**Files:**
- Create: `src/lib/vendor-session-config.ts`

**Step 1: Write vendor session config**

Create `src/lib/vendor-session-config.ts`:

```typescript
import { SessionOptions } from 'iron-session'

export interface VendorSession {
  email: string
  vendor_id: string
  expires: number // timestamp in ms
}

export const vendorSessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'vendor_session_signed',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 86400, // 24 hours in seconds
  },
}
```

**Step 2: Verify TypeScript compiles**

Run:

```bash
npm run typecheck
```

Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/vendor-session-config.ts
git commit -m "feat(auth): add vendor session config (iron-session)"
```

---

### Task 8: Create Vendor Auth Helpers

**Files:**
- Create: `src/lib/vendor-auth.ts`

**Step 1: Write vendor auth helpers**

Create `src/lib/vendor-auth.ts`:

```typescript
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { vendorSessionOptions, VendorSession } from './vendor-session-config'

/**
 * Get vendor session from iron-session cookie
 */
export async function getVendorSession() {
  return getIronSession<VendorSession>(cookies(), vendorSessionOptions)
}

/**
 * Get current authenticated vendor
 * @returns VendorSession if valid, null if expired or not logged in
 */
export async function getCurrentVendor() {
  const session = await getVendorSession()

  // Check if session exists
  if (!session.vendor_id || !session.email) {
    return null
  }

  // Check if session expired
  if (session.expires < Date.now()) {
    await session.destroy()
    return null
  }

  return session
}

/**
 * Require vendor authentication
 * @throws Error if not authenticated
 */
export async function requireVendorAuth() {
  const vendor = await getCurrentVendor()
  if (!vendor) {
    throw new Error('Unauthorized: Vendor authentication required')
  }
  return vendor
}
```

**Step 2: Verify TypeScript compiles**

Run:

```bash
npm run typecheck
```

Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/vendor-auth.ts
git commit -m "feat(auth): add vendor auth helpers (getCurrentVendor, requireVendorAuth)"
```

---

### Task 9: Create Profile Completion Calculator

**Files:**
- Create: `src/lib/profile-completion.ts`

**Step 1: Write profile completion logic**

Create `src/lib/profile-completion.ts`:

```typescript
import { Vendor, WorkHistory } from './supabase'

export interface CompletionTask {
  id: string
  name: string
  completed: boolean
  points: number
}

export interface ProfileCompletion {
  percent: number
  tasks: CompletionTask[]
}

/**
 * Calculate profile completion percentage and task status
 */
export function calculateProfileCompletion(
  vendor: Vendor,
  workHistory: WorkHistory[]
): ProfileCompletion {
  const tasks: CompletionTask[] = [
    {
      id: 'photo',
      name: 'Add profile photo',
      completed: !!vendor.image_url,
      points: 10,
    },
    {
      id: 'bio',
      name: 'Write bio (50+ words)',
      completed: (vendor.profile_llm?.bio?.split(/\s+/).length || 0) >= 50,
      points: 10,
    },
    {
      id: 'first_work',
      name: 'Add 1 work experience',
      completed: workHistory.length >= 1,
      points: 15,
    },
    {
      id: 'three_work',
      name: 'Add 3 work experiences',
      completed: workHistory.length >= 3,
      points: 10,
    },
    {
      id: 'verified_work',
      name: 'Get first verified work history',
      completed: workHistory.some((w) => w.status === 'approved'),
      points: 15,
    },
    {
      id: 'skills',
      name: 'Add 5+ skills',
      completed: (vendor.tags?.length || 0) >= 5,
      points: 10,
    },
    {
      id: 'specialties',
      name: 'Add specialties',
      completed: (vendor.profile_llm?.specialties?.length || 0) >= 1,
      points: 10,
    },
    {
      id: 'availability',
      name: 'Set availability',
      completed: !!(vendor.profile_llm?.availability?.days?.length || 0),
      points: 10,
    },
    {
      id: 'contact',
      name: 'Add contact info',
      completed: !!(vendor.contact_email || vendor.contact_phone),
      points: 10,
    },
  ]

  const totalPoints = tasks.reduce((sum, task) => sum + task.points, 0)
  const earnedPoints = tasks
    .filter((t) => t.completed)
    .reduce((sum, task) => sum + task.points, 0)

  const percent = Math.round((earnedPoints / totalPoints) * 100)

  return {
    percent,
    tasks,
  }
}

/**
 * Determine unlock tier based on completion percentage
 */
export function getUnlockTier(percent: number): {
  tier: number
  description: string
} {
  if (percent >= 100) {
    return { tier: 4, description: 'Elite - Full profile unlocked' }
  } else if (percent >= 80) {
    return { tier: 3, description: 'Portfolio unlocked' }
  } else if (percent >= 60) {
    return { tier: 2, description: 'Featured in homepage carousel' }
  } else if (percent >= 30) {
    return { tier: 1, description: 'Appears in search results' }
  } else {
    return { tier: 0, description: 'Limited visibility' }
  }
}
```

**Step 2: Verify TypeScript compiles**

Run:

```bash
npm run typecheck
```

Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/profile-completion.ts
git commit -m "feat(gamification): add profile completion calculator"
```

---

### Task 10: Create Embedding Utilities

**Files:**
- Create: `src/lib/embedding.ts`

**Step 1: Write embedding utilities**

Create `src/lib/embedding.ts`:

```typescript
import OpenAI from 'openai'
import { Vendor, WorkHistory, Badge } from './supabase'
import { supabaseAdmin } from './supabase-admin'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Compile vendor profile into text for embedding
 */
export function compileProfileText(
  vendor: Vendor,
  workHistory: WorkHistory[] = [],
  badges: Badge[] = []
): string {
  const parts: string[] = [
    vendor.business_name,
    vendor.specialty || '',
    vendor.description || '',
    vendor.profile_llm?.bio || '',
    vendor.tags?.join(', ') || '',
    vendor.profile_llm?.specialties?.join(', ') || '',

    // Approved work history only
    workHistory
      .filter((w) => w.status === 'approved')
      .map((w) => `${w.role} at ${w.shop_id}`) // TODO: join with shop name
      .join(', '),

    // Badge names
    badges.map((b) => b.name).join(', '),
  ]

  return parts.filter(Boolean).join(' | ')
}

/**
 * Generate OpenAI embedding for text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OPENAI_API_KEY not set, skipping embedding generation')
    return []
  }

  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small', // 1536 dims, $0.02/1M tokens
      input: text,
    })

    return response.data[0].embedding
  } catch (error) {
    console.error('Failed to generate embedding:', error)
    throw error
  }
}

/**
 * Update vendor embedding in database
 */
export async function updateVendorEmbedding(vendorId: string): Promise<void> {
  // Fetch vendor data
  const { data: vendor, error: vendorError } = await supabaseAdmin
    .from('vendors')
    .select('*')
    .eq('id', vendorId)
    .single()

  if (vendorError || !vendor) {
    throw new Error(`Vendor not found: ${vendorId}`)
  }

  // Fetch work history
  const { data: workHistory } = await supabaseAdmin
    .from('work_history')
    .select('*')
    .eq('barista_id', vendorId)

  // Fetch badges
  const { data: vendorBadges } = await supabaseAdmin
    .from('vendor_badges')
    .select('badge_id, badges(*)')
    .eq('vendor_id', vendorId)

  const badges = vendorBadges?.map((vb: any) => vb.badges) || []

  // Compile profile text
  const profileText = compileProfileText(vendor, workHistory || [], badges)

  // Generate embedding
  const embedding = await generateEmbedding(profileText)

  // Update database
  const { error: updateError } = await supabaseAdmin
    .from('vendors')
    .update({
      profile_embedding: embedding as any, // pgvector type
      last_embedding_generated: new Date().toISOString(),
    })
    .eq('id', vendorId)

  if (updateError) {
    throw new Error(`Failed to update embedding: ${updateError.message}`)
  }

  console.log(`Updated embedding for vendor ${vendorId}`)
}

/**
 * Rate limiter: Check if embedding was generated recently
 */
export function canRegenerateEmbedding(vendor: Vendor): boolean {
  if (!vendor.last_embedding_generated) {
    return true
  }

  const lastGenerated = new Date(vendor.last_embedding_generated).getTime()
  const oneHourAgo = Date.now() - 60 * 60 * 1000

  return lastGenerated < oneHourAgo
}
```

**Step 2: Install OpenAI SDK**

Run:

```bash
npm install openai
```

**Step 3: Verify TypeScript compiles**

Run:

```bash
npm run typecheck
```

Expected: No errors

**Step 4: Add OPENAI_API_KEY to .env.local.example**

Update `.env.local.example`:

```bash
# OpenAI (for profile embeddings)
OPENAI_API_KEY=sk-...
```

**Step 5: Commit**

```bash
git add src/lib/embedding.ts package.json package-lock.json .env.local.example
git commit -m "feat(llm): add embedding generation utilities (OpenAI)"
```

---

## Phase 3: Vendor Authentication UI

### Task 11: Create Vendor Login Page

**Files:**
- Create: `src/app/(main)/vendors/login/page.tsx`
- Create: `src/components/vendors/auth/VendorLoginForm.tsx`

**Step 1: Write VendorLoginForm component**

Create `src/components/vendors/auth/VendorLoginForm.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function VendorLoginForm() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/vendors/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send code')
      }

      setStep('code')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/vendors/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Invalid code')
      }

      // Redirect based on response
      router.push(data.redirect || '/vendors/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      {step === 'email' ? (
        <form onSubmit={handleSendCode} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Sending...' : 'Send Code'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              We sent a 6-digit code to {email}
            </p>
            <label htmlFor="code" className="block text-sm font-medium mb-2">
              Verification Code
            </label>
            <Input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              maxLength={6}
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStep('email')
                setCode('')
                setError('')
              }}
              className="flex-1"
            >
              Back
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
```

**Step 2: Write login page**

Create `src/app/(main)/vendors/login/page.tsx`:

```typescript
import { Metadata } from 'next'
import { VendorLoginForm } from '@/components/vendors/auth/VendorLoginForm'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/shared/Footer'

export const metadata: Metadata = {
  title: 'Vendor Login - The Bean Route',
  description: 'Login to your vendor account',
}

export default function VendorLoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="app" />

      <main className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Vendor Login</h1>
            <p className="text-gray-600 mt-2">
              Enter your email to receive a verification code
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <VendorLoginForm />
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            New vendor?{' '}
            <a href="/vendors/register" className="text-blue-600 hover:underline">
              Register here
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
```

**Step 3: Verify TypeScript compiles**

Run:

```bash
npm run typecheck
```

Expected: No errors

**Step 4: Commit**

```bash
git add src/app/(main)/vendors/login/page.tsx src/components/vendors/auth/VendorLoginForm.tsx
git commit -m "feat(ui): add vendor login page with OTP form"
```

---

### Task 12: Create Send Code API Route

**Files:**
- Create: `src/app/api/vendors/auth/send-code/route.ts`

**Step 1: Write send-code API route**

Create `src/app/api/vendors/auth/send-code/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase-admin'

const sendCodeSchema = z.object({
  email: z.string().email(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = sendCodeSchema.parse(body)

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Set expiry (10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    // Check if vendor exists with this email
    const { data: vendor } = await supabaseAdmin
      .from('vendors')
      .select('id')
      .eq('contact_email', email)
      .single()

    // Upsert session
    const { error } = await supabaseAdmin
      .from('vendor_sessions')
      .upsert({
        email,
        code,
        vendor_id: vendor?.id || null,
        expires_at: expiresAt,
        created_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Failed to create session:', error)
      return NextResponse.json(
        { error: 'Failed to send code' },
        { status: 500 }
      )
    }

    // TODO: Send email via Brevo
    // For now, just log to console
    console.log(`[VENDOR OTP] Code for ${email}: ${code}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Send code error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Step 2: Verify TypeScript compiles**

Run:

```bash
npm run typecheck
```

Expected: No errors

**Step 3: Commit**

```bash
git add src/app/api/vendors/auth/send-code/route.ts
git commit -m "feat(api): add vendor send-code endpoint (OTP generation)"
```

---

### Task 13: Create Verify Code API Route

**Files:**
- Create: `src/app/api/vendors/auth/verify-code/route.ts`

**Step 1: Write verify-code API route**

Create `src/app/api/vendors/auth/verify-code/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getVendorSession } from '@/lib/vendor-auth'

const verifyCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, code } = verifyCodeSchema.parse(body)

    // Fetch session from database
    const { data: sessionData, error: sessionError } = await supabaseAdmin
      .from('vendor_sessions')
      .select('*')
      .eq('email', email)
      .single()

    if (sessionError || !sessionData) {
      return NextResponse.json(
        { error: 'Invalid or expired code' },
        { status: 401 }
      )
    }

    // Check if code matches
    if (sessionData.code !== code) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 401 })
    }

    // Check if expired
    if (new Date(sessionData.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Code expired' }, { status: 401 })
    }

    // Set iron-session cookie
    const session = await getVendorSession()
    session.email = email
    session.vendor_id = sessionData.vendor_id || ''
    session.expires = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    await session.save()

    // Delete used session
    await supabaseAdmin
      .from('vendor_sessions')
      .delete()
      .eq('email', email)

    // Determine redirect
    const redirect = sessionData.vendor_id
      ? '/vendors/dashboard'
      : '/vendors/claim'

    return NextResponse.json({ success: true, vendor_id: sessionData.vendor_id, redirect })
  } catch (error) {
    console.error('Verify code error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Step 2: Verify TypeScript compiles**

Run:

```bash
npm run typecheck
```

Expected: No errors

**Step 3: Commit**

```bash
git add src/app/api/vendors/auth/verify-code/route.ts
git commit -m "feat(api): add vendor verify-code endpoint (OTP validation)"
```

---

### Task 14: Create Logout API Route

**Files:**
- Create: `src/app/api/vendors/auth/logout/route.ts`

**Step 1: Write logout API route**

Create `src/app/api/vendors/auth/logout/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { getVendorSession } from '@/lib/vendor-auth'

export async function POST() {
  try {
    const session = await getVendorSession()
    await session.destroy()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Step 2: Verify TypeScript compiles**

Run:

```bash
npm run typecheck
```

Expected: No errors

**Step 3: Commit**

```bash
git add src/app/api/vendors/auth/logout/route.ts
git commit -m "feat(api): add vendor logout endpoint (session destroy)"
```

---

### Task 15: Create VendorAuthGate Component

**Files:**
- Create: `src/components/vendors/auth/VendorAuthGate.tsx`

**Step 1: Write VendorAuthGate component**

Create `src/components/vendors/auth/VendorAuthGate.tsx`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface VendorAuthGateProps {
  children: React.ReactNode
}

export function VendorAuthGate({ children }: VendorAuthGateProps) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/vendors/profile')

        if (res.ok) {
          setIsAuthenticated(true)
        } else {
          router.push('/vendors/login')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/vendors/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
```

**Step 2: Verify TypeScript compiles**

Run:

```bash
npm run typecheck
```

Expected: No errors

**Step 3: Commit**

```bash
git add src/components/vendors/auth/VendorAuthGate.tsx
git commit -m "feat(ui): add VendorAuthGate component (auth wrapper)"
```

---

## Phase 4: Vendor Dashboard & Profile Editor

### Task 16: Create Vendor Profile API Route

**Files:**
- Create: `src/app/api/vendors/profile/route.ts`

**Step 1: Write GET /api/vendors/profile**

Create `src/app/api/vendors/profile/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentVendor } from '@/lib/vendor-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { calculateProfileCompletion } from '@/lib/profile-completion'
import { updateVendorEmbedding, canRegenerateEmbedding } from '@/lib/embedding'

// GET /api/vendors/profile - Get current vendor profile
export async function GET() {
  try {
    const vendor = await getCurrentVendor()

    if (!vendor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch full vendor data
    const { data: vendorData, error: vendorError } = await supabaseAdmin
      .from('vendors')
      .select('*')
      .eq('id', vendor.vendor_id)
      .single()

    if (vendorError || !vendorData) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    // Fetch work history
    const { data: workHistory } = await supabaseAdmin
      .from('work_history')
      .select('*')
      .eq('barista_id', vendor.vendor_id)

    // Calculate completion
    const completion = calculateProfileCompletion(vendorData, workHistory || [])

    // Update completion percent if changed
    if (vendorData.profile_completion_percent !== completion.percent) {
      await supabaseAdmin
        .from('vendors')
        .update({ profile_completion_percent: completion.percent })
        .eq('id', vendor.vendor_id)
    }

    return NextResponse.json({
      vendor: vendorData,
      completion,
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/vendors/profile - Update vendor profile
const updateProfileSchema = z.object({
  profile_llm: z.object({
    bio: z.string().optional(),
    specialties: z.array(z.string()).optional(),
    certifications: z.array(z.string()).optional(),
    availability: z.object({
      days: z.array(z.string()).optional(),
      hours: z.string().optional(),
    }).optional(),
    equipment_expertise: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    service_style: z.string().optional(),
  }).optional(),
  tags: z.array(z.string()).optional(),
  description: z.string().optional(),
})

export async function PATCH(req: NextRequest) {
  try {
    const vendor = await getCurrentVendor()

    if (!vendor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const updates = updateProfileSchema.parse(body)

    // Fetch current vendor data
    const { data: currentVendor } = await supabaseAdmin
      .from('vendors')
      .select('*')
      .eq('id', vendor.vendor_id)
      .single()

    if (!currentVendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    // Merge profile_llm
    const updatedProfileLLM = {
      ...currentVendor.profile_llm,
      ...updates.profile_llm,
    }

    // Update vendor
    const { error: updateError } = await supabaseAdmin
      .from('vendors')
      .update({
        profile_llm: updatedProfileLLM,
        tags: updates.tags || currentVendor.tags,
        description: updates.description || currentVendor.description,
      })
      .eq('id', vendor.vendor_id)

    if (updateError) {
      console.error('Update profile error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    // Regenerate embedding if allowed
    if (canRegenerateEmbedding(currentVendor)) {
      try {
        await updateVendorEmbedding(vendor.vendor_id)
      } catch (embeddingError) {
        console.error('Failed to regenerate embedding:', embeddingError)
        // Don't fail the request if embedding fails
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update profile error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Step 2: Verify TypeScript compiles**

Run:

```bash
npm run typecheck
```

Expected: No errors

**Step 3: Commit**

```bash
git add src/app/api/vendors/profile/route.ts
git commit -m "feat(api): add vendor profile GET/PATCH endpoints"
```

---

*Due to length constraints, I'll now provide a summary of remaining tasks. The full plan would continue with the same bite-sized approach for:*

**Remaining Implementation Tasks:**

17. **Profile Completion API** (`/api/vendors/profile/completion`)
18. **Work History API Routes** (`/api/vendors/work-history`)
19. **Shop Claims API Routes** (`/api/shops/claims/*`)
20. **Vendor Dashboard Page** (`/vendors/dashboard`)
21. **Profile Header Component**
22. **Profile Tabs Component**
23. **Profile Completion Widget**
24. **About Tab Component**
25. **Work History Tab Component**
26. **Skills Tab Component**
27. **Badge Display Components**
28. **Work History Card Component**
29. **Shop Claims Dashboard**
30. **Update BaristaProfile with Tabs**
31. **Update VendorCard with Badges**
32. **LLM Semantic Search API** (`/api/llm/semantic-search`)
33. **Embedding Generation Trigger**
34. **E2E Tests for Auth Flow**
35. **E2E Tests for Work History**
36. **E2E Tests for Profile Completion**

Each task would follow the same pattern:
- Write failing test (if applicable)
- Run test to verify it fails
- Write minimal implementation
- Run test to verify it passes
- Commit with descriptive message

---

## Verification Checklist

After all tasks complete, verify:

```bash
# Database
✅ All tables exist in Supabase
✅ RLS policies enabled
✅ pgvector extension working
✅ Badge seed data present

# TypeScript
✅ npm run typecheck passes
✅ No type errors in IDE

# Authentication
✅ Vendor can login with OTP
✅ Session persists across page loads
✅ Logout clears session

# Profile Editor
✅ Vendor can update bio, skills, availability
✅ Profile completion % updates correctly
✅ Embedding regenerates on profile save

# Work History
✅ Barista can add work claim
✅ Shop owner receives notification
✅ Shop owner can approve/reject
✅ Approved work shows verified badge

# UI/UX
✅ Responsive design works on mobile
✅ Loading states show correctly
✅ Error messages are user-friendly
✅ Forms validate input properly
```

---

## Environment Setup

Required environment variables in `.env.local`:

```bash
# Existing
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
BREVO_API_KEY=...
SESSION_SECRET=...

# New
OPENAI_API_KEY=sk-...
```

---

**End of Implementation Plan**
