# Domain Pitfalls: Vendor Platform Authentication & Dashboard

**Domain:** Two-sided marketplace (OAuth + vendor self-service features)
**Researched:** 2026-02-26

---

## Critical Pitfalls

### Pitfall 1: RLS Policy Misconfiguration → Data Exposure

**What goes wrong:**
Vendor A logs in via OAuth, but RLS policies are loose or missing. Vendor A can see inquiries/reviews for Vendor B. Critical: 83% of exposed Supabase instances have RLS misconfigurations per research.

**Why it happens:**
- Forgot to enable RLS on `inquiries` table
- RLS policy uses generic condition like `status = 'open'` instead of `vendor_id = auth.uid()`
- Mapping between Supabase auth.user.id and vendor_id is incomplete (e.g., auth user created but never linked to vendors table)
- Copy-pasted policy from tutorial, didn't adapt to app's schema

**Consequences:**
- Data breach: vendors see competitors' inquiries, pricing, customer list
- Trust destruction: event organizers worry their booking data is exposed
- Regulatory: if any GDPR/privacy compliance, this is violation
- Reputational: "Platform leaked vendor data" becomes story

**Prevention:**
1. **Enable RLS on all vendor-related tables:** inquiries, vendor_applications, reviews, admin_sessions
2. **Write specific policies:** Policy must check vendor_id matches current user's vendor
3. **Create auth_vendors mapping table early** (Phase 1):
   ```sql
   CREATE TABLE auth_vendors (
     user_id UUID NOT NULL REFERENCES auth.users(id),
     vendor_id UUID NOT NULL REFERENCES vendors(id),
     PRIMARY KEY (user_id)
   );
   ```
4. **Policy template for inquiries:**
   ```sql
   CREATE POLICY "Vendors can view own inquiries"
   ON inquiries
   FOR SELECT
   USING (
     vendor_id = (SELECT vendor_id FROM auth_vendors WHERE user_id = auth.uid())
   );
   ```
5. **Test in Phase 1 spike:** Log in as Vendor A, query inquiries—verify only own inquiries appear. Log in as Vendor B, verify Vendor A's inquiries are invisible.
6. **Audit script (Phase 2):**
   ```sql
   -- Verify RLS is enabled on all tables
   SELECT tablename FROM pg_tables 
   WHERE schemaname = 'public' 
   AND NOT EXISTS (SELECT 1 FROM pg_policies WHERE pg_policies.tablename = pg_tables.tablename);
   ```

**Detection:**
- Admin complaints: "Why can I see vendor B's inquiries in database?"
- Vendor complaint: "I see inquiries I didn't submit to!"
- Query audit: log shows `SELECT inquiries` returns wrong vendor's data
- Supabase dashboard RLS policies tab is empty/missing

---

### Pitfall 2: Session Token Expiry → Vendor Suddenly Logged Out

**What goes wrong:**
Vendor logs in via Google OAuth. Supabase JWT expires after 1 hour (default). Vendor is mid-task updating their profile, form submit fails with 401. Poor UX: "Your session expired, please refresh the page."

**Why it happens:**
- Didn't implement token refresh logic
- Didn't configure @supabase/ssr's session refresh behavior
- Supabase JWT lifetime is 1 hour by default; wasn't aware or didn't change it
- Vendor is on slow network; by time form submits, token is expired

**Consequences:**
- Vendor loses work (form data unsaved)
- Vendor frustration: "Platform logged me out!" (actually normal, but UX is bad)
- Support burden: "Why am I logged out?"
- Low vendor engagement: if dashboard feels unreliable, vendors stop using it

**Prevention:**
1. **Use @supabase/ssr for automatic refresh:** It handles token refresh via cookies. Don't manually manage JWTs.
   ```typescript
   // Good (automatic)
   const supabase = createServerClient(...)  // @supabase/ssr handles refresh
   
   // Bad (manual, prone to errors)
   const token = localStorage.getItem('access_token')  // Token may be stale
   ```
2. **Extend token lifetime (optional):** Go to Supabase console → Authentication → Policies → Session duration. Can set to 24 hours if appropriate for use case.
3. **Implement refresh handler (Phase 2):** If token expires during form submission, catch error and silently refresh:
   ```typescript
   const handleFormSubmit = async () => {
     try {
       // Form submission
     } catch (error) {
       if (error.status === 401) {
         await supabase.auth.refreshSession()
         // Retry form submission
       }
     }
   }
   ```
4. **Use optimistic updates:** Save form to local state first, then sync to server. If network fails, data isn't lost.

**Detection:**
- Vendor reports: "Form said I'm not logged in"
- Error logs show 401 errors from auth endpoint
- Session cookies are present but JWT is expired (browser dev tools → Cookies → check token timestamp)

---

### Pitfall 3: Iron-Session + Supabase Auth Cookie Conflict

**What goes wrong:**
Admin logs in via iron-session (OTP). Then admin tries to view vendor dashboard. Supabase JWT cookie is present, but iron-session cookie overrides it. Vendor page fails to load because auth context is confused.

OR: Vendor logs in via OAuth. Admin dashboard breaks because Supabase JWT interferes with iron-session cookie handling.

**Why it happens:**
- Middleware ordering is wrong (iron-session middleware runs before Supabase @supabase/ssr middleware)
- Both systems try to manage `sb-*` and `admin-session` cookies without explicit rules
- Cookie domain/path overlap causes browser to send wrong cookie
- No clear routing separation (admin routes use iron-session, vendor routes use Supabase)

**Consequences:**
- Broken admin portal (vendor JWT interferes)
- Broken vendor dashboard (iron-session interferes)
- Vendor needs to log out and log back in to see dashboard
- Admin needs to clear cookies to log in
- Poor UX, low trust in platform

**Prevention:**
1. **Separate routes explicitly (Phase 1):**
   - Admin routes: `/dashboard/*` → requires iron-session auth only
   - Vendor routes: `/vendor/*` → requires Supabase OAuth only
   - Public routes: `/` → no auth required
2. **Middleware ordering (critical in Phase 1 spike):**
   ```typescript
   // src/middleware.ts
   import { updateSession } from '@supabase/ssr'  // Supabase must run FIRST
   import { withIronSessionApiRoute } from 'iron-session/next'  // Iron-session in API routes
   
   // Supabase SSR middleware (handles JWT refresh for vendor routes)
   export async function middleware(request: NextRequest) {
     let response = NextResponse.next()
     const supabase = createServerClient(...)
     await supabase.auth.getSession()  // Refresh token if needed
     return response
   }
   ```
3. **Cookie naming convention:**
   - Iron-session: `admin-session-*` (explicit prefix)
   - Supabase: `sb-*` (default, use as-is)
   - Never overlap
4. **Test in Phase 1 (mandatory):**
   ```
   Step 1: Admin logs in via OTP → verify iron-session cookie is set
   Step 2: Same browser, go to /vendor/login → OAuth login → verify Supabase JWT is set
   Step 3: Admin session still works (go to /dashboard) → verify iron-session auth still valid
   Step 4: Vendor session still works (go to /vendor/dashboard) → verify Supabase auth still valid
   ```

**Detection:**
- User can't stay logged in to both admin + vendor in same session
- Browser dev tools → Cookies shows duplicate `sb-*` cookies with different values
- Supabase error: "User not found" after successful OAuth
- Admin portal returns 401 after vendor logs in

---

## Moderate Pitfalls

### Pitfall 4: Missing auth_vendors Mapping → Vendor Can't Access Dashboard

**What goes wrong:**
Vendor A registers via OAuth (creates Supabase auth.user). But app never links this user to the vendors table entry. Vendor tries to access dashboard, RLS policy queries `auth_vendors` table, finds nothing, denies access.

**Why it happens:**
- OAuth flow ends at token creation, forgot to create auth_vendors row
- Assumed Supabase email would automatically match vendors table email—it doesn't
- auth_vendors mapping is optional per docs, but actually critical for this app

**Consequences:**
- Vendor logs in successfully (OAuth works) but gets "Access denied" on dashboard
- Confusing UX: "I just logged in, why can't I see my dashboard?"
- Vendor gives up, never uses platform

**Prevention:**
1. **Create mapping immediately after OAuth (Phase 1):**
   ```typescript
   // src/app/auth/callback/route.ts
   const { data, error } = await supabase.auth.exchangeCodeForSession(code)
   if (data.user) {
     // Link to vendors table
     const vendor = await supabaseAdmin
       .from('auth_vendors')
       .insert({ user_id: data.user.id, vendor_id: ... })  // Get vendor_id somehow
   }
   ```
2. **Design vendor signup flow (Phase 1 planning):**
   - Option A: Existing vendor logs in via OAuth → check if email matches vendors table → auto-link
   - Option B: New vendor signs up via public form, then logs in via OAuth → manual approval → admin links in dashboard
   - Option C: Vendor logs in via OAuth first → redirected to "complete profile" form → creates vendors entry, creates auth_vendors mapping

3. **Validation in Phase 1:**
   - After OAuth flow, verify auth_vendors row exists before redirecting to dashboard

**Detection:**
- Vendor logs in (OAuth succeeds) but 403 on /vendor/dashboard
- Supabase logs show: `auth.uid() = X, but no row in auth_vendors where user_id = X`

---

### Pitfall 5: Analytics Queries Timeout → Dashboard Slow to Load

**What goes wrong:**
Vendor dashboard loads analytics: "views per week for last 3 months." App queries inquiries table without proper indexes. 10K+ inquiries, no index on (vendor_id, created_at). Query scans entire table, takes 5+ seconds. Dashboard feels slow.

**Why it happens:**
- Didn't add indexes during schema design (Phase 1)
- Assumed Supabase query optimizer would handle it
- Tested with 10 inquiries, never tested at scale

**Consequences:**
- Vendor waits 5+ seconds for dashboard to load (unacceptable)
- Vendor leaves page, doesn't use analytics
- Server resources spike during dashboard queries
- Eventually, query times out (500 error) when at scale

**Prevention:**
1. **Add indexes in Phase 4 schema migration:**
   ```sql
   CREATE INDEX inquiries_vendor_id_created_at 
   ON inquiries(vendor_id, created_at DESC);
   
   CREATE INDEX inquiries_vendor_id_status 
   ON inquiries(vendor_id, status);
   ```
2. **Benchmark queries before Phase 4 launch:**
   ```sql
   EXPLAIN ANALYZE
   SELECT DATE_TRUNC('week', created_at), COUNT(*) 
   FROM inquiries 
   WHERE vendor_id = '<test-uuid>' 
   GROUP BY DATE_TRUNC('week', created_at)
   LIMIT 12;
   ```
   Should execute in <100ms.

3. **Use pagination / limits:** Don't fetch 10K rows to dashboard. Fetch last 90 days only.
4. **Consider materialized view (Phase 5+):** If queries remain slow:
   ```sql
   CREATE MATERIALIZED VIEW vendor_weekly_inquiries AS
   SELECT vendor_id, DATE_TRUNC('week', created_at) as week, COUNT(*) as count
   FROM inquiries
   GROUP BY vendor_id, DATE_TRUNC('week', created_at);
   ```

**Detection:**
- Dashboard slow to load
- Browser Network tab shows /api/analytics taking 5+ seconds
- Supabase dashboard shows high query duration in logs

---

### Pitfall 6: Review Trigger Breaks on Edge Case

**What goes wrong:**
Vendor has 2 reviews (rating: 5, 5). Average is 5.0. Event organizer deletes their review. Trigger fires, recalculates avg_rating. Rounding error or NULL handling breaks: avg_rating becomes NULL or NaN. Vendor profile displays broken rating.

**Why it happens:**
- Trigger doesn't handle edge case: no reviews exist (AVG returns NULL)
- Trigger has wrong data type: NUMERIC(2,1) not enough for large rating sums
- Trigger doesn't validate calculated value

**Consequences:**
- Vendor profile broken (rating shows NULL or "NaN")
- Event organizers see broken UI
- Low trust in data accuracy

**Prevention:**
1. **Handle NULL in trigger:**
   ```sql
   UPDATE vendors
   SET avg_rating = COALESCE((SELECT AVG(rating)::NUMERIC(3,2) FROM reviews WHERE vendor_id = NEW.vendor_id), NULL),
       review_count = (SELECT COUNT(*) FROM reviews WHERE vendor_id = NEW.vendor_id)
   WHERE id = NEW.vendor_id;
   ```
2. **Set default:** If no reviews, explicitly set avg_rating = NULL, not 0
3. **Add CHECK constraint:** Ensure avg_rating is between 1 and 5 (or NULL)
4. **Test trigger (Phase 5):**
   - Insert review → verify avg_rating updates
   - Delete last review → verify avg_rating = NULL (not 0)
   - Add review → avg_rating is not NULL again

**Detection:**
- Vendor profile shows "rating: NaN" or "rating: null"
- Review table has rows but vendors.avg_rating is NULL
- Error logs from trigger execution

---

## Minor Pitfalls

### Pitfall 7: OAuth Redirect URL Not Registered

**What goes wrong:**
Developer tests OAuth locally (localhost:3000/auth/callback). Works. Deploys to Vercel (vercel.app/auth/callback). OAuth fails: "Redirect URI not registered with provider."

**Prevention:**
- Register both localhost AND production URLs in Google/Facebook OAuth settings
- Use env var for callback URL:
  ```typescript
  const redirectUrl = process.env.NODE_ENV === 'production' 
    ? 'https://app.vercel.app/auth/callback'
    : 'http://localhost:3000/auth/callback'
  ```

---

### Pitfall 8: Zod Validation Doesn't Catch Edge Cases

**What goes wrong:**
Form validation uses Zod schema that allows "price: 0" or "price: 999999". Vendor submits bad data. Dashboard shows broken prices.

**Prevention:**
- Add refinements to Zod schema:
  ```typescript
  const vendorSchema = z.object({
    price_min: z.number().min(10).max(500),
    price_max: z.number().min(10).max(500),
  }).refine(data => data.price_min <= data.price_max, {
    message: "Min price must be <= max price"
  })
  ```

---

### Pitfall 9: Form Submission Race Condition

**What goes wrong:**
Vendor clicks "Save Profile" twice quickly. Two API calls sent. First wins, second overwrites with stale data.

**Prevention:**
- Disable button during submission:
  ```typescript
  <button disabled={isSubmitting}>Save</button>
  ```
- Use TanStack Query mutation: handles request deduplication automatically

---

## Phase-Specific Warnings

| Phase | Topic | Pitfall | Mitigation |
|-------|-------|---------|-----------|
| Phase 1 | OAuth setup | Missing auth_vendors table | Create table + link during callback. Test mapping. |
| Phase 1 | Session auth | Cookie conflicts (iron-session + Supabase) | Test middleware order. Separate routes. Verify both systems work. |
| Phase 1 | RLS policies | Incomplete policies enable data exposure | Audit all tables. Write tight policies. Test as different vendors. |
| Phase 2 | Dashboard layout | No responsive design | Use shadcn/ui + Tailwind (already have these). Mobile-first. |
| Phase 3 | Inquiry fetch | Missing indexes on vendor_id | Add indexes. Benchmark queries. Test at 10K+ scale. |
| Phase 4 | Analytics queries | N+1 queries (fetch inquiries, then loop fetch details) | Use JOIN or GraphQL batching. Load all data in one query. |
| Phase 5 | Review trigger | Edge cases (no reviews, NULL handling) | Handle NULL explicitly. Test empty → 1 review → 0 reviews. |
| Phase 5 | Review visibility | Reviews for other vendors visible | Add RLS policy. Only show reviews for current vendor. |
| Phase 6 | Profile editing | Stale data conflicts (vendor edits while inquiry active) | Denormalize vendor name on inquiries. Use timestamps. |

---

## Security Checklist (Phase 1 Acceptance Criteria)

- [ ] All vendor tables have RLS enabled (inquiries, vendor_applications, reviews, quotes)
- [ ] RLS policies tested: vendor A cannot see vendor B's data
- [ ] auth_vendors mapping table created and populated on OAuth
- [ ] Iron-session + Supabase JWT cookies don't conflict (tested in browser)
- [ ] Middleware ordering verified (Supabase @supabase/ssr runs first)
- [ ] OAuth redirect URL registered in Google + Facebook consoles
- [ ] Token refresh tested (login, wait 1hr+, form submission still works)
- [ ] 401/403 errors handled gracefully (not silent failures)
- [ ] Sensitive columns (email, user_id) not exposed in admin views

---

*Pitfalls researched 2026-02-26 based on official Supabase docs, RLS security patterns, and standard OAuth/session management gotchas.*

