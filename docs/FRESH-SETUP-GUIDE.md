# Fresh Database Setup Guide

Complete reset and setup for The Bean Route database.

## Step 1: Drop All Existing Tables in Supabase

**Run this in Supabase SQL Editor:**

```sql
-- Drop all tables in correct order (respecting foreign keys)
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

-- Drop pgvector extension (will be re-added)
DROP EXTENSION IF EXISTS vector CASCADE;

-- Verify all tables are gone
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE';
```

**Expected output:** Empty result (0 rows)

---

## Step 2: Run Base Schema

**Copy and run this file in Supabase SQL Editor:**

```bash
cat supabase-schema.sql
```

This creates:
- `vendors` table (18 columns)
- `inquiries` table
- `vendor_applications` table
- `jobs` table
- `quotes` table
- `admin_sessions` table
- Basic RLS policies

**Expected output:** "Success. No rows returned"

**Verify it worked:**
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

**Expected:** 6 tables (admin_sessions, inquiries, jobs, quotes, vendor_applications, vendors)

---

## Step 3: Run Migration 000 - Vendor Types & Coffee Shop Fields

```bash
cat supabase-migrations/000-add-vendor-type-and-coffee-shop-fields.sql
```

Adds 23 columns to vendors table:
- vendor_type (mobile_cart, coffee_shop, barista)
- 18 coffee shop fields
- 4 AI fields

**Verify:**
```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'vendors'
  AND column_name IN ('vendor_type', 'opening_hours', 'ai_bio')
ORDER BY column_name;
```

**Expected:** 3 rows

---

## Step 4: Run Migration 001 - Enable pgvector

```bash
cat supabase-migrations/001-add-pgvector.sql
```

Enables vector extension for semantic search.

**Verify:**
```sql
SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';
```

**Expected:** 1 row showing vector extension

---

## Step 5: Run Migration 002 - Social Profiles Schema

```bash
cat supabase-migrations/002-social-profiles-schema.sql
```

Creates 7 new tables:
- work_history
- profile_sections
- badges
- vendor_badges
- quizzes
- quiz_attempts
- vendor_sessions

**Verify:**
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('work_history', 'badges', 'vendor_sessions')
ORDER BY table_name;
```

**Expected:** 3 rows

---

## Step 6: Run Migration 003 - LLM Profile Fields

```bash
cat supabase-migrations/003-vendors-llm-fields.sql
```

Adds to vendors table:
- profile_llm (JSONB)
- profile_embedding (vector[1536])
- embedding_updated_at (timestamp)
- profile_completion_percent (integer)

**Verify:**
```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'vendors'
  AND column_name IN ('profile_llm', 'profile_embedding', 'embedding_updated_at')
ORDER BY column_name;
```

**Expected:** 3 rows

---

## Step 7: Run Migration 004 - RLS Policies

```bash
cat supabase-migrations/004-rls-policies.sql
```

Adds Row-Level Security policies for all 7 social profile tables.

**Verify:**
```sql
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename IN ('work_history', 'badges', 'vendor_sessions')
ORDER BY tablename, policyname;
```

**Expected:** Multiple rows showing policies

---

## Step 8: Run Migration 005 - Seed Badges

```bash
cat supabase-migrations/005-seed-badges.sql
```

Inserts 7 initial badges.

**Verify:**
```sql
SELECT badge_type, name, tier FROM badges ORDER BY tier, name;
```

**Expected:** 7 rows

---

## Step 9: Verify Complete Schema

**Run this comprehensive check:**

```sql
-- Count columns in vendors table
SELECT COUNT(*) as vendor_columns
FROM information_schema.columns
WHERE table_name = 'vendors';

-- Expected: 41 columns

-- Count total tables
SELECT COUNT(*) as total_tables
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE';

-- Expected: 13 tables

-- Count badges
SELECT COUNT(*) as badge_count FROM badges;

-- Expected: 7 badges
```

**Expected results:**
- vendor_columns: **41**
- total_tables: **13**
- badge_count: **7**

---

## Step 10: Set Environment Variables

In your local `.env.local` file:

```bash
# Generate a secure password
openssl rand -base64 32

# Add to .env.local:
VENDOR_SESSION_PASSWORD=<paste_generated_password>
OPENAI_API_KEY=sk-your_openai_api_key_here
```

---

## Step 11: Restart Dev Server

```bash
# Stop dev server (Ctrl+C)
rm -rf .next
npm run dev
```

---

## Step 12: Test Vendor Login

Visit: `http://localhost:3000/vendors/login`

**Expected:**
- ✅ Page loads without errors
- ✅ No 406 errors in console
- ✅ No "Error fetching vendor by slug" messages
- ✅ Login form displays

Enter an email to test OTP generation:
- Code will be logged to terminal console (6 digits)
- Enter code to complete login flow

---

## Troubleshooting

### "Extension vector not available"
Contact Supabase support or use Supabase CLI:
```bash
supabase db extension enable vector
```

### "Still getting 406 errors"
Hard refresh browser:
- Chrome/Edge: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Firefox: Cmd+Shift+R (Mac) or Ctrl+F5 (Windows)

### "Constraint already exists"
A previous migration partially succeeded. Drop constraints first:
```sql
ALTER TABLE vendors DROP CONSTRAINT IF EXISTS valid_completion_percent;
ALTER TABLE vendors DROP CONSTRAINT IF EXISTS vendors_vendor_type_check;
```

Then re-run the migration.

---

## Success Criteria

✅ All 13 tables exist in Supabase
✅ `vendors` table has 41 columns
✅ 7 badges seeded
✅ `/vendors/login` loads without errors
✅ No 406 errors in browser console
✅ Environment variables set

**You're ready for Phase 2 development!**
