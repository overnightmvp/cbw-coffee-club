# Infrastructure Setup Guide

**Goal:** Configure Supabase and Brevo so the application works end-to-end
**Time:** ~20 minutes
**Status:** Use this checklist to verify each step

---

## Prerequisites

- [x] `.env.local` file exists (found at project root)
- [x] `supabase-schema.sql` exists (found at project root)
- [ ] Supabase account (create at https://supabase.com if needed)
- [ ] Brevo account (create at https://brevo.com if needed)

---

## Step 1: Supabase Setup

### 1.1 Create/Access Supabase Project

1. Go to https://supabase.com/dashboard
2. Sign in or create account
3. Either:
   - Click "New Project" if first time
   - Or select existing project if you already have one

**Project Settings:**
- Name: "Coffee Cart Marketplace" (or whatever you prefer)
- Database Password: (save this securely - you'll need it for direct DB access)
- Region: Choose closest to your users (e.g., US West, Sydney, etc.)
- Wait 2-3 minutes for project to provision

### 1.2 Get API Keys

1. In your Supabase project, go to **Settings → API**
2. Copy these values to your `.env.local` file:

```bash
# Open .env.local and update these:
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:**
- `URL`: Found under "Project URL"
- `anon key`: Found under "Project API keys" → "anon" → "public"
- `service_role`: Found under "Project API keys" → "service_role" → **⚠️ SECRET - never commit!**

### 1.3 Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy the entire contents of `supabase-schema.sql` from your project root
4. Paste into the SQL editor
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. Verify success: Should see "Success. No rows returned"

**Tables created:**
- `inquiries` — booking inquiries from event planners
- `vendor_applications` — vendor registration submissions
- `jobs` — event owner job postings
- `quotes` — vendor quotes against jobs

### 1.4 Verify Tables

1. In Supabase dashboard, go to **Table Editor**
2. You should see all 4 tables in the left sidebar
3. Click each table to verify columns match the schema
4. All tables should have 0 rows (empty for now)

**Expected columns per table:**

**inquiries:**
- id, vendor_id, event_type, event_date, event_duration_hours, guest_count
- location, contact_name, contact_email, contact_phone, special_requests
- estimated_cost, status, created_at

**vendor_applications:**
- id, business_name, specialty, description, suburbs (array)
- price_min, price_max, capacity_min, capacity_max, event_types (array)
- contact_name, contact_email, contact_phone, website, status, created_at

**jobs:**
- id, event_title, event_type, event_date, duration_hours, guest_count
- location, budget_min, budget_max, special_requirements
- contact_name, contact_email, contact_phone, status, created_at

**quotes:**
- id, job_id, vendor_name, price_per_hour, message, contact_email, created_at

---

## Step 2: Brevo (Email) Setup

### 2.1 Create Brevo Account

1. Go to https://brevo.com
2. Click "Sign up free"
3. Complete registration (you get 300 free emails/day)
4. Verify your email address

### 2.2 Get API Key

1. Once logged in, go to **Settings** (top right) → **SMTP & API**
2. Click **API Keys** tab
3. Click **Generate a new API key**
4. Name it: "Coffee Cart Marketplace"
5. Copy the key immediately (you won't see it again!)
6. Add to `.env.local`:

```bash
BREVO_API_KEY=xkeysib-your-api-key-here
```

### 2.3 Configure Sender Email (Optional for MVP)

For production, you'll want to verify a sender domain. For testing:

1. Go to **Senders** in Brevo dashboard
2. Your account email is already a verified sender
3. Emails will come from "noreply@coffeecartsmelbourne.com" but via Brevo's servers
4. For production: Add and verify your actual domain

**Note:** Without domain verification, emails may land in spam. For MVP testing, this is fine.

---

## Step 3: Verify Configuration

### 3.1 Check Environment Variables

Run this from your project root:

```bash
# Verify .env.local exists and has all keys
cat .env.local
```

You should see (with your actual values, not placeholders):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJ...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJ...
BREVO_API_KEY=xkeysib-...
NEXT_PUBLIC_BASE_URL=https://thebeanroute.com.au
```

**⚠️ Security Check:**
- [ ] `.env.local` is in `.gitignore` (never commit secrets!)
- [ ] Service role key is only in `.env.local`, not in code

### 3.2 Build Test

```bash
npm run build
```

**Expected output:**
- ✅ Build completes successfully
- ✅ No "Missing Supabase environment variables" errors
- ⚠️ May still see "BREVO_API_KEY not configured" during build (this is OK - it's checked at runtime)

---

## Step 4: End-to-End Test

### 4.1 Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

### 4.2 Test Inquiry Submission

1. **Browse Vendors:**
   - Go to http://localhost:3000/app
   - You should see 6 hardcoded vendors
   - Click "Get Quote" on any vendor

2. **Submit Inquiry:**
   - Fill out the inquiry form:
     - Name: "Test User"
     - Email: YOUR_EMAIL (use a real email you can check!)
     - Event type, date, location, etc.
   - Click "Send Inquiry"

3. **Verify Database:**
   - Go to Supabase → Table Editor → `inquiries`
   - You should see 1 new row with your test inquiry
   - Status should be "pending"

4. **Check Email Logs:**
   - Look at your terminal where `npm run dev` is running
   - You should see email logs:
     ```
     [EMAIL SENT] To vendor@example.com: New inquiry from Test User — Corporate event
     [EMAIL SENT] To your@email.com: Inquiry confirmed — [Vendor] will be in touch soon
     ```
   - **Note:** Actual emails won't send because vendors have null contactEmail in hardcoded data
   - But planner confirmation email SHOULD send to YOUR_EMAIL

5. **Check Your Inbox:**
   - Wait 1-2 minutes
   - Check your email (and spam folder)
   - You should receive "Inquiry confirmed — [Vendor] will be in touch soon"
   - If you got the email: ✅ Email system works!

### 4.3 Test Admin Portal

1. **Access Admin:**
   - Go to http://localhost:3000/admin
   - You should see login screen

2. **Get Verification Code:**
   - Enter your email
   - Click "Send Code"
   - Look at terminal logs - you should see:
     ```
     [ADMIN AUTH] Verification code for your@email.com: 123456
     ```

3. **Login:**
   - Enter the 6-digit code
   - Click "Verify"
   - You should be redirected to admin dashboard

4. **View Inquiry:**
   - Click "Inquiries" tab (should be active)
   - You should see your test inquiry from step 4.2
   - Click "View" to see details
   - Try changing status to "contacted"
   - Verify it updates

---

## Step 5: Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution:**
- Verify `.env.local` exists in project root (not in /src or /public)
- Restart dev server after editing `.env.local`
- Check variable names match exactly (they're case-sensitive)

### Issue: Build succeeds but no data appears

**Solution:**
- Check browser console for errors (F12 → Console tab)
- Common issue: CORS or RLS (Row Level Security) blocking access
- Verify RLS policies in Supabase → Authentication → Policies
- Schema should have disabled RLS for `inquiries` or set to allow all

### Issue: Emails not sending

**Solution:**
- Check terminal logs for email attempts
- If you see `[EMAIL SKIPPED] No BREVO_API_KEY configured`: API key not set
- If you see `[EMAIL SENT]` but no email arrives:
  - Check spam folder
  - Verify API key is correct (go to Brevo dashboard)
  - Check Brevo dashboard → Statistics → Logs for delivery status

### Issue: Admin code not appearing

**Solution:**
- Verification codes are logged to server console (terminal running `npm run dev`)
- Scroll up to find `[ADMIN AUTH] Verification code for...`
- Code expires after 10 minutes - request a new one if needed

### Issue: Can't see inquiries in admin

**Solution:**
- Admin uses service role key to bypass RLS
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
- Check browser Network tab for API errors
- API route: `/api/admin/inquiries` should return 200 status

---

## Step 6: Optional - Seed Test Data

If you want to test with multiple inquiries, applications, or jobs:

### Quick SQL Seed (Supabase SQL Editor)

```sql
-- Add a test vendor application
INSERT INTO vendor_applications (
  id, business_name, specialty, description, suburbs,
  price_min, price_max, capacity_min, capacity_max, event_types,
  contact_name, contact_email, status
) VALUES (
  'app_test_001',
  'Test Coffee Cart',
  'Premium Espresso',
  'A test vendor for development',
  ARRAY['CBD', 'Fitzroy'],
  200, 350, 30, 150,
  ARRAY['Corporate event', 'Wedding'],
  'Test Vendor',
  'vendor@test.com',
  'pending'
);

-- Add a test job
INSERT INTO jobs (
  id, event_title, event_type, event_date, duration_hours,
  guest_count, location, budget_max, contact_name, contact_email, status
) VALUES (
  'job_test_001',
  'Team Breakfast',
  'Corporate event',
  '2026-03-15',
  3,
  75,
  'Melbourne CBD',
  300,
  'Test Event Owner',
  'owner@test.com',
  'open'
);

-- Add a quote for the test job
INSERT INTO quotes (
  id, job_id, vendor_name, price_per_hour, contact_email
) VALUES (
  'qte_test_001',
  'job_test_001',
  'The Bean Cart',
  250,
  'beancart@test.com'
);
```

Run this in SQL Editor, then:
- Admin → Applications tab should show 1 pending application
- Jobs page should show 1 open job
- Job detail should show 1 quote

---

## Checklist Summary

Use this to confirm everything is working:

### Configuration
- [ ] `.env.local` exists with all 4 required variables
- [ ] Supabase project created
- [ ] All 4 tables created in Supabase (inquiries, vendor_applications, jobs, quotes)
- [ ] Brevo account created and API key obtained

### Functionality Tests
- [ ] `npm run build` completes successfully
- [ ] Can browse vendors at /app
- [ ] Can submit inquiry (creates row in inquiries table)
- [ ] Receive confirmation email at your email address
- [ ] Can access /admin with email + code
- [ ] Admin dashboard shows inquiries
- [ ] Can change inquiry status

### Production Readiness (not required for development)
- [ ] Verify Brevo sender domain (to avoid spam folder)
- [ ] Set up Supabase backups
- [ ] Configure Supabase auth (for real user accounts)
- [ ] Add environment variables to Vercel/hosting platform

---

## Next Steps

Once all tests pass, you're ready to:
1. **Complete E1-2** (planner email confirmation) - already coded, just merge
2. **Continue Phase 2** (E1-3, E1-4, E1-5) - remaining email notifications
3. **Or start Phase 3** (E2 - Real vendor data from database)

Return to `docs/audit-and-backlog.md` for the full roadmap.

---

## Need Help?

**Common Questions:**

**Q: Do I need a credit card for Supabase/Brevo?**
A: No, both have free tiers. Supabase free: 500MB database, 2GB bandwidth. Brevo free: 300 emails/day.

**Q: Can I test without email configured?**
A: Yes! Emails will log to console with full content. You can verify functionality without sending real emails.

**Q: What if I already have a Supabase project?**
A: You can use an existing project. Just run the schema SQL to add the 4 new tables alongside your existing ones.

**Q: Should I commit .env.local?**
A: NO! Never commit files with secrets. `.env.local` is already in `.gitignore`.

**Q: Where do I get the service role key?**
A: Supabase Dashboard → Settings → API → "service_role" section → Click eye icon to reveal → Copy
