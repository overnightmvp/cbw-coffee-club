# Architecture Patterns: Vendor Platform Authentication & Dashboard

**Domain:** Two-sided marketplace (OAuth, vendor self-service, reviews)
**Researched:** 2026-02-26

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         The Bean Route Platform                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │   Event Org      │  │     Vendor       │  │    Admin         │  │
│  │   (Public)       │  │   (Vendor Auth)  │  │  (OTP Session)   │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
│           │                    │                      │             │
│  ┌────────▼────────────────────▼──────────────────────▼─────────┐  │
│  │               Next.js 15 App Router (TSX)                     │  │
│  │  /                /vendor/*              /dashboard/*          │  │
│  │  /jobs            /vendor/login          /dashboard/auth      │  │
│  │  /vendors         /vendor/dashboard      /dashboard/[tabs]    │  │
│  │  /app             /vendor/profile        /admin-cms           │  │
│  └────────┬────────────────────┬──────────────────────┬─────────┘  │
│           │                    │                      │             │
│  ┌────────▼────────┐  ┌────────▼────────┐  ┌────────▼────────┐   │
│  │  Public Auth    │  │  OAuth (Google, │  │  iron-session   │   │
│  │  (None - anon)  │  │   Facebook)     │  │  (OTP-based)    │   │
│  │                 │  │ @supabase/ssr   │  │  Supabase       │   │
│  │                 │  │ JWT in cookies  │  │  admin_sessions │   │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘   │
│           │                    │                      │             │
│  ┌────────▼────────────────────▼──────────────────────▼─────────┐  │
│  │          Supabase (PostgreSQL + Auth + RLS)                   │  │
│  │  ┌──────────────────────────────────────────────────────┐    │  │
│  │  │  Database (Public Schema)                            │    │  │
│  │  │  ├─ vendors (with avg_rating, review_count)          │    │  │
│  │  │  ├─ inquiries (vendor_id FK, RLS)                    │    │  │
│  │  │  ├─ reviews (vendor_id, organizer_id, RLS)           │    │  │
│  │  │  ├─ quotes (job_id, vendor_name)                     │    │  │
│  │  │  ├─ jobs (event postings)                            │    │  │
│  │  │  ├─ vendor_applications (self-reg, pending approval) │    │  │
│  │  │  └─ auth_vendors (user_id → vendor_id mapping)       │    │  │
│  │  └──────────────────────────────────────────────────────┘    │  │
│  │  ┌──────────────────────────────────────────────────────┐    │  │
│  │  │  Auth (Supabase Auth)                                │    │  │
│  │  │  ├─ Google OAuth provider                            │    │  │
│  │  │  ├─ Facebook OAuth provider                          │    │  │
│  │  │  └─ JWT tokens (httpOnly cookies via @supabase/ssr) │    │  │
│  │  └──────────────────────────────────────────────────────┘    │  │
│  │  ┌──────────────────────────────────────────────────────┐    │  │
│  │  │  RLS Policies (Data Access Control)                  │    │  │
│  │  │  ├─ vendors: PUBLIC SELECT                           │    │  │
│  │  │  ├─ inquiries: vendor sees own only                  │    │  │
│  │  │  ├─ reviews: PUBLIC SELECT, vendor INSERT by self    │    │  │
│  │  │  ├─ auth_vendors: SERVICE_ROLE only (RLS doesn't)    │    │  │
│  │  │  └─ admin_sessions: SERVICE_ROLE only                │    │  │
│  │  └──────────────────────────────────────────────────────┘    │  │
│  └─────────────────────────────────────────────────────────────┘   │
│           │                    │                      │             │
│  ┌────────▼─────┐   ┌──────────▼────────┐  ┌────────▼────────┐   │
│  │  External    │   │  TanStack Query   │  │  Brevo Email    │   │
│  │  ├─ Google   │   │  (Dashboard data) │  │  (Notifications)│   │
│  │  │  OAuth    │   │  ├─ inquiries     │  │  ├─ OTP codes  │   │
│  │  ├─ Facebook │   │  ├─ reviews       │  │  └─ inquiry    │   │
│  │  │  OAuth    │   │  └─ analytics     │  │    notifications│   │
│  │  └─ Payload  │   │                   │  └────────────────┘   │
│  │    CMS       │   │                   │                       │
│  └──────────────┘   └───────────────────┘                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Boundaries

| Component | Responsibility | Communicates With | Auth |
|-----------|---------------|-------------------|------|
| **Public Pages** | Landing, vendor browse, job board | Supabase (anon) | None |
| **Vendor Auth** | OAuth flow, login page | Supabase Auth, auth_vendors table | Google/Facebook OAuth |
| **Vendor Dashboard** | Inbox, analytics, profile editing | TanStack Query, Supabase | Supabase JWT (OAuth) |
| **Admin Portal** | Inquiries, applications, jobs | Supabase (service role), iron-session | iron-session OTP |
| **Review System** | Submit/display reviews | Supabase (reviews table) | OAuth (vendor to submit) |
| **Email Service** | OTP codes, notifications | Brevo API | N/A (backend only) |

---

## Data Flow

### 1. Vendor OAuth Flow (Phase 1)

```
User clicks "Sign in with Google"
    ↓
Frontend redirects to: https://accounts.google.com/...?redirect_uri=<app>/auth/callback
    ↓
User completes Google login
    ↓
Google redirects to: https://app/auth/callback?code=<auth_code>
    ↓
Backend exchanges code: supabase.auth.exchangeCodeForSession(code)
    ↓
Supabase creates auth.user record + JWT token
    ↓
Backend links to vendors: INSERT INTO auth_vendors (user_id, vendor_id) VALUES (...)
    ↓
@supabase/ssr stores JWT in httpOnly cookie
    ↓
Redirect to /vendor/dashboard
    ↓
Dashboard makes requests with JWT in cookie
    ↓
Supabase RLS policies check auth.uid() against auth_vendors.vendor_id
    ↓
Vendor sees only own data (inquiries, reviews, etc.)
```

### 2. Vendor Dashboard Query (Phase 3+)

```
User opens /vendor/dashboard
    ↓
React queries TanStack Query hook:
    useQuery({
      queryKey: ['inquiries', vendorId],
      queryFn: () => supabase.from('inquiries').select(...)
    })
    ↓
TanStack Query makes API call with JWT cookie
    ↓
Next.js API route verifies session: supabase.auth.getSession()
    ↓
RLS policy checks: vendor_id = (SELECT vendor_id FROM auth_vendors WHERE user_id = auth.uid())
    ↓
Returns only vendor's inquiries
    ↓
TanStack Query caches result (30s default)
    ↓
Frontend renders inquiry list
    ↓
If user refreshes page within 30s, uses cached data (no network call)
    ↓
If window regains focus (after 30s), background refetch triggered automatically
```

### 3. Review Submission (Phase 5)

```
Event organizer views vendor profile
    ↓
Clicks "Leave Review" (requires organizer to be logged in - future)
    ↓
Submits form: rating (1-5), comment, vendor_id
    ↓
Zod validates schema
    ↓
INSERT into reviews table with RLS check: auth.uid() = organizer_id
    ↓
Trigger fires: update_vendor_rating()
    ↓
Trigger recalculates: vendors.avg_rating = AVG(reviews.rating WHERE vendor_id = X)
    ↓
Trigger updates: vendors.review_count = COUNT(reviews WHERE vendor_id = X)
    ↓
Frontend shows "Review submitted!" toast
    ↓
Vendor profile updates to show new average rating
```

---

## Patterns to Follow

### Pattern 1: Server-Side Session Verification

**What:** Verify vendor is logged in before accessing dashboard data

**When:** Every protected route (Phase 2+)

**Example:**
```typescript
// src/app/vendor/dashboard/page.tsx
import { createServerClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'

export default async function VendorDashboard() {
  const supabase = createServerClient(...)
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/vendor/login')
  }
  
  const vendor = await supabase
    .from('auth_vendors')
    .select('vendor_id')
    .eq('user_id', user.id)
    .single()
  
  if (!vendor) {
    redirect('/vendor/register')  // User logged in but not linked to vendor
  }
  
  return <Dashboard vendorId={vendor.vendor_id} />
}
```

### Pattern 2: TanStack Query with Vendor Filtering

**What:** Fetch vendor-specific data with automatic caching + refetch

**When:** Dashboard inquiries, reviews, analytics (Phase 3+)

**Example:**
```typescript
// src/hooks/useVendorInquiries.ts
import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { supabase } from '@/lib/supabase-client'

export function useVendorInquiries(vendorId: string) {
  return useQuery({
    queryKey: ['inquiries', vendorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },
    staleTime: 30000,           // Cache for 30s
    refetchInterval: 60000,     // Auto-refresh every 60s
    refetchOnWindowFocus: true, // Refetch when user switches tabs
  })
}

// Usage in component
const { data: inquiries, isLoading } = useVendorInquiries(vendorId)
```

### Pattern 3: RLS-Protected Mutations

**What:** Update vendor data with automatic RLS validation

**When:** Profile edits, status changes (Phase 6+)

**Example:**
```typescript
// src/hooks/useUpdateInquiry.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase-client'

export function useUpdateInquiry() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      // Invalidate cache so next query refetches fresh data
      queryClient.invalidateQueries({ queryKey: ['inquiries'] })
    },
  })
}

// RLS policy ensures vendor can only update own inquiries:
// UPDATE inquiries SET status = ... WHERE vendor_id = (SELECT vendor_id FROM auth_vendors WHERE user_id = auth.uid())
```

### Pattern 4: Trigger-Based Denormalization

**What:** Keep vendor.avg_rating in sync with reviews table via database trigger

**When:** Review insert/delete (Phase 5)

**Example:**
```sql
-- src/migrations/add_review_aggregates.sql
CREATE OR REPLACE FUNCTION update_vendor_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE vendors
  SET avg_rating = (
    SELECT COALESCE(AVG(rating)::NUMERIC(3,2), NULL)
    FROM reviews
    WHERE vendor_id = COALESCE(NEW.vendor_id, OLD.vendor_id)
  ),
  review_count = (
    SELECT COUNT(*)
    FROM reviews
    WHERE vendor_id = COALESCE(NEW.vendor_id, OLD.vendor_id)
  )
  WHERE id = COALESCE(NEW.vendor_id, OLD.vendor_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reviews_update_aggregates
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_vendor_rating();
```

**Benefit:** Vendor profile queries are O(1) instead of expensive JOINs + aggregations.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Storing JWT in localStorage

**What:** Manually extract JWT, store in localStorage, use in API calls

**Why bad:**
- Tokens expire; localStorage doesn't auto-refresh
- XSS vulnerability: malicious script can steal token from localStorage
- Race condition: multiple tabs can have stale tokens

**Instead:** Use @supabase/ssr for automatic refresh via httpOnly cookies. Tokens never visible to JavaScript.

---

### Anti-Pattern 2: N+1 Queries in Dashboard

**What:** Fetch list of 10 inquiries, then loop to fetch vendor details for each

```typescript
// Bad
const inquiries = await supabase.from('inquiries').select('*')
for (const inquiry of inquiries) {
  const vendor = await supabase.from('vendors').select('*').eq('id', inquiry.vendor_id).single()
  inquiry.vendor = vendor  // 11 total queries (1 list + 10 details)
}
```

**Why bad:** 10x more queries than necessary. Dashboard loads slowly.

**Instead:** Use JOIN or denormalize vendor name on inquiries table

```typescript
// Good
const inquiries = await supabase.from('inquiries').select(`
  *,
  vendors(business_name, specialty)
`)
```

---

### Anti-Pattern 3: No RLS Policies

**What:** Leave tables in public schema with RLS disabled

**Why bad:** Any authenticated user can read/write all data. Vendors see competitors' inquiries.

**Instead:** Enable RLS on all tables, write specific policies for each role.

---

### Anti-Pattern 4: Mixing Session Systems

**What:** Use NextAuth.js for vendor auth AND iron-session for admin auth in same app

**Why bad:** Cookie conflicts, confusing session state, hard to debug

**Instead:** Use single session system or clearly separate them by route (admin/* vs vendor/*)

---

## Scalability Considerations

| Concern | At 100 Vendors | At 10K Vendors | At 100K Vendors |
|---------|---|---|---|
| **OAuth latency** | <100ms | <100ms (Supabase handles) | <100ms (Supabase handles) |
| **Inquiry queries** | O(1) with index | O(1) with index on (vendor_id, created_at) | O(1) with same index |
| **Review aggregates** | Trigger instant | Trigger <100ms | Trigger <500ms, consider async job |
| **Analytics time range** | 3 months | 6 months (may slow) | Consider windowed functions |
| **Concurrent vendors on dashboard** | No limit | No limit (Supabase auto-scales) | No limit |
| **Database connections** | < 10 | < 50 | 100+ (Supabase pools automatically) |

**Upgrade path:** At 100K vendors with millions of reviews, consider:
- Materialized views for analytics (weekly aggregates pre-calculated)
- Async review aggregation (trigger → job queue instead of synchronous update)
- Read replicas for analytics queries
- Data warehouse (Parquet export) for reporting

Supabase handles auto-scaling to 100K+ scale. No architectural changes needed for v1.0 → v2.0.

---

## Migration Path (If Changing Systems Later)

**Hypothetical scenario:** In v2.0, need to support native vendor sign-up (email/password) alongside OAuth

**Step 1:** Keep OAuth as-is (no changes)
**Step 2:** Extend Supabase Auth to support email/password:
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'vendor@example.com',
  password: 'secure_password_here',
})
```
**Step 3:** Same auth_vendors mapping applies (user_id → vendor_id)
**Step 4:** No schema changes needed; RLS policies already work for both auth methods

---

## Testing Strategy

### Phase 1: OAuth + Session Integration Tests

```typescript
// tests/auth.integration.test.ts
describe('Vendor OAuth Flow', () => {
  it('should exchange OAuth code for session', async () => {
    // Mock Google OAuth response
    // Call /auth/callback?code=...
    // Verify JWT in httpOnly cookie
    // Verify auth_vendors row created
  })
  
  it('should isolate vendor sessions', async () => {
    // Login as Vendor A
    // Query inquiries → should see only Vendor A's data
    // Login as Vendor B (new cookie)
    // Query inquiries → should see only Vendor B's data
    // Verify Vendor A cannot see Vendor B's data
  })
})
```

### Phase 3: RLS Policy Tests

```typescript
// tests/rls.test.ts
describe('RLS Policies - Vendor Isolation', () => {
  it('vendor cannot update other vendor inquiries', async () => {
    // Create inquiry for Vendor A
    // Login as Vendor B
    // Try to UPDATE inquiry (should fail)
    // Expect 403 or row not found
  })
})
```

### Phase 4: Dashboard Performance Tests

```typescript
// tests/performance.test.ts
describe('Analytics Queries Performance', () => {
  it('should fetch 10K inquiries in <500ms', async () => {
    // Insert 10K inquiries
    // Query dashboard analytics
    // Measure: should complete in <500ms with proper indexes
  })
})
```

---

## Deployment Considerations

### Environment Variables

```bash
# .env.local (dev)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# .env.production (Vercel)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### OAuth Redirect URLs (Phase 1)

Register both dev + prod:
- **Dev:** http://localhost:3000/auth/callback
- **Prod:** https://app.vercel.app/auth/callback
- **Staging:** https://staging-app.vercel.app/auth/callback

### Database Backups

Supabase handles daily backups automatically. No additional config needed.

### RLS Audit

Before launch (Phase 1):
```sql
-- Verify RLS is enabled on all public tables
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
AND NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = pg_tables.tablename);

-- Result should be empty (all tables have policies)
```

---

*Architecture researched 2026-02-26 based on Supabase official patterns, TanStack Query best practices, and RLS security guidelines.*

