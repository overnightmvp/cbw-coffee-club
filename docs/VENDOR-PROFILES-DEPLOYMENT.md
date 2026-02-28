# Vendor Profiles Deployment Guide

Phase 1 deployment checklist for LinkedIn-style barista profiles feature.

## Prerequisites

- Supabase project with existing vendors table
- OpenAI API account for embeddings
- Environment variables configured in `.env.local`

## Step 1: Configure Environment Variables

Copy `.env.local.example` to `.env.local` and add:

```bash
# Vendor Session (new)
VENDOR_SESSION_PASSWORD=generate_32_char_password_here

# OpenAI API (new)
OPENAI_API_KEY=sk-your_openai_api_key_here
```

**Generate secure password:**
```bash
openssl rand -base64 32
```

## Step 2: Apply Database Migrations

Run these SQL scripts in **Supabase Dashboard → SQL Editor** in order:

### 1. Enable pgvector Extension
```bash
cat supabase-migrations/001-add-pgvector.sql
```
Copy and run in SQL Editor. Expected output: `CREATE EXTENSION`

### 2. Create Core Tables
```bash
cat supabase-migrations/002-social-profiles-schema.sql
```
Creates: work_history, profile_sections, badges, vendor_badges, quizzes, quiz_attempts, vendor_sessions

### 3. Add LLM Fields to Vendors
```bash
cat supabase-migrations/003-vendors-llm-fields.sql
```
Adds: profile_llm, profile_embedding, last_embedding_generated, profile_completion_percent

### 4. Enable Row-Level Security
```bash
cat supabase-migrations/004-rls-policies.sql
```
Applies RLS policies to all 7 new tables

### 5. Seed Initial Badges
```bash
cat supabase-migrations/005-seed-badges.sql
```
Inserts 7 badges (3 verification, 2 skill, 2 achievement)

## Step 3: Verify Database Setup

Run in SQL Editor:

```sql
-- Check pgvector extension
SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';

-- Verify tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'work_history', 'profile_sections', 'badges',
  'vendor_badges', 'quizzes', 'quiz_attempts', 'vendor_sessions'
);

-- Check vendors table has new columns
SELECT column_name FROM information_schema.columns
WHERE table_name = 'vendors'
AND column_name IN (
  'profile_llm', 'profile_embedding',
  'last_embedding_generated', 'profile_completion_percent'
);

-- Verify badge seed data
SELECT badge_type, name, tier FROM badges ORDER BY tier, name;
```

Expected output:
- pgvector version 0.5.1 or higher
- All 7 tables exist
- All 4 vendor columns exist
- 7 badges seeded

## Step 4: Update Supabase Types

Generate TypeScript types from new schema:

```bash
npx supabase gen types typescript --local > src/lib/supabase-types.ts
```

**Note:** Already done in implementation. Skip if types are up to date.

## Step 5: Test Authentication Flow

### Test OTP Generation
```bash
curl -X POST http://localhost:3000/api/vendors/auth/send-code \
  -H "Content-Type: application/json" \
  -d '{"email":"test@barista.com"}'
```

Expected: `{"success":true}` + OTP logged to console

### Verify Session Record
```sql
SELECT email, code, expires_at FROM vendor_sessions
WHERE email = 'test@barista.com';
```

### Test OTP Verification
```bash
curl -X POST http://localhost:3000/api/vendors/auth/verify-code \
  -H "Content-Type: application/json" \
  -d '{"email":"test@barista.com","code":"123456"}'
```

Expected: `{"success":true,"redirect":"/vendors/claim"}` (if no vendor exists)

## Step 6: Test Profile Completion

### Create Test Vendor
```sql
INSERT INTO vendors (
  business_name, vendor_type, contact_email,
  description, suburbs, verified
) VALUES (
  'Test Barista', 'barista', 'test@barista.com',
  'Experienced barista with 5 years of specialty coffee experience',
  ARRAY['Carlton', 'Fitzroy'],
  true
);
```

### Link Vendor to Session
```sql
UPDATE vendor_sessions
SET vendor_id = (SELECT id FROM vendors WHERE contact_email = 'test@barista.com')
WHERE email = 'test@barista.com';
```

### Test Profile API
```bash
# Login first to get session cookie, then:
curl http://localhost:3000/api/vendors/profile \
  -H "Cookie: vendor_session_signed=..."
```

Expected: `{"vendor":{...},"completion":{"percent":45,"tasks":[...]}}`

## Step 7: Test Embedding Generation

### Trigger Embedding Update
```bash
curl -X PATCH http://localhost:3000/api/vendors/profile \
  -H "Content-Type: application/json" \
  -H "Cookie: vendor_session_signed=..." \
  -d '{"profile_llm":{"bio":"Passionate barista specializing in latte art"}}'
```

Expected: Profile updated + embedding generated in background

### Verify Embedding in Database
```sql
SELECT
  business_name,
  profile_embedding IS NOT NULL as has_embedding,
  last_embedding_generated,
  profile_completion_percent
FROM vendors
WHERE contact_email = 'test@barista.com';
```

Expected: `has_embedding = true`, recent timestamp

## Step 8: Production Deployment

### Vercel Environment Variables
Add to Vercel project settings:
- `VENDOR_SESSION_PASSWORD`
- `OPENAI_API_KEY`

### Supabase Production
Repeat Step 2 (migrations) in production Supabase instance.

### Deploy
```bash
git push origin main
# Vercel auto-deploys
```

## Troubleshooting

### Migration Errors

**"pgvector extension not available"**
- Contact Supabase support to enable pgvector on your instance
- Or use Supabase CLI: `supabase db extension enable vector`

**"relation vendors does not exist"**
- Ensure base schema from `supabase-schema.sql` is applied first
- Run migrations in order (001 → 002 → 003 → 004 → 005)

### Authentication Issues

**OTP not appearing in console**
- Check `VENDOR_SESSION_PASSWORD` is set in `.env.local`
- Verify iron-session cookie is being created (check browser DevTools)

**"Unauthorized" on profile API**
- Session expired (default 30 days)
- Cookie not being sent (check SameSite/Secure settings)

### Embedding Errors

**"OpenAI API key invalid"**
- Verify `OPENAI_API_KEY` starts with `sk-`
- Check OpenAI account has active billing

**Embeddings not generating**
- Check rate limit: max 1 regeneration per 24 hours per vendor
- Verify profile has sufficient text (min 50 characters)

## Phase 2 Preview

Next features to implement:
- Vendor dashboard landing page (`/vendors/dashboard`)
- Profile editor with tabs (About, Work History, Skills)
- Work history management (add/edit claims)
- Shop approval dashboard for verifying claims
- Badge display components
- Profile completion widget UI

See `docs/plans/2026-02-28-linkedin-barista-profiles.md` for full roadmap.
