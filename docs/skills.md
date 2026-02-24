# The Bean Route — Development Skills & Workflow

**Last Updated:** 2026-02-04
**Status:** Production system with ongoing feature development

---

## Current Architecture

**Stack:**
- Next.js 14.2.5 (App Router, TypeScript, Tailwind CSS)
- Supabase (PostgreSQL + Auth + RLS policies)
- Brevo (transactional emails)
- Vercel (hosting + deployments)

**Database Tables:**
- `vendors` - Coffee cart, coffee shop, and barista listings
- `inquiries` - Event organizer booking requests
- `vendor_applications` - New vendor registration submissions
- `jobs` - Job board postings from event organizers
- `quotes` - Vendor quote submissions for jobs
- `messages` - In-app chat messages between vendors and organizers
- `push_subscriptions` - Web push notification subscriptions

---

## Completed Features (Production-Ready)

### Phase 1: E3 — Admin Authentication ✅
- Email-based verification with 6-digit codes
- HTTP-only cookie sessions (24hr expiration)
- Email whitelist protection (hardcoded in `send-code/route.ts`)
- Admin portal at `/admin` with 3 tabs (Inquiries, Applications, Jobs)

### Phase 2: E1 — Email Notifications ✅
All transactional emails via Brevo:
1. Vendor inquiry notification (vendor receives inquiry details)
2. Planner inquiry confirmation (event owner gets confirmation)
3. Owner quote notification (job owner notified of new quote)
4. Vendor quote confirmation (vendor confirms quote submitted)
5. Applicant decision emails (approval/rejection notifications)
6. Admin verification codes (email-based admin login)

### Phase 4: E5 — Barista Directory & Coffee Shop Expansion ✅
- Support for multiple vendor types: `mobile_cart`, `coffee_shop`, `barista`.
- Conditional profile templates (BaristaProfile, CoffeeShopProfile).
- Specialized filters for each category (amenities for shops, hourly rates for baristas).
- Dynamic SEO metadata and JSON-LD schemas for all vendor types.

### Phase 5: Dashboard & Messaging ✅
- Vendor Dashboard at `/vendor/dashboard`.
- Real-time in-app messaging between vendors and inquiries.
- Web Push Notifications for new messages and inquiries.
- Profile management for vendors.

---

## Development Workflow

### Branch Strategy

**Rule: One branch per story**

```bash
# Start new story
git checkout main && git pull origin main
git checkout -b {epic}-{story}-{slug}

# Examples:
# e6-1-rate-limiting
# e7-2-vendor-dashboard
# docs-update-readme

# Do the work (target: < 1 hour per story)

# MUST pass build before pushing
npm run build

# If build fails, fix it before pushing
# If tests fail, fix them before pushing

# Push and create PR
git push origin {branch-name}

# Merge to main via PR
# Delete branch after merge
```

### Commit Message Format

```
{type}({scope}): {short description}

Longer explanation if needed (optional).
- Key change 1
- Key change 2

Closes #{issue-number}

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation update
- `refactor`: Code refactoring (no behavior change)
- `test`: Add/update tests
- `chore`: Tooling, config, dependencies

**Examples:**
```
feat(jobs): Add quote acceptance UI
fix(admin): Prevent unauthenticated access
docs(readme): Update deployment instructions
refactor(api): Extract email template logic
```

---

## Model Selection Framework

### Overview

Before executing any development task, select the optimal Claude model based on task complexity, scope, and token requirements. This framework ensures cost efficiency without compromising quality.

**Available Models:**
- **Haiku** (200K context) - Fast, cost-effective for simple tasks
- **Sonnet 4.5** (200K context) - Balanced default for moderate complexity
- **Opus 4.5** (200K context) - Advanced reasoning for complex architecture

---

### Decision Tree

```
Task Complexity Assessment:

├─ Simple (Haiku - 200K context)
│  ├─ Single file edits < 100 lines
│  ├─ Bug fixes with clear reproduction steps
│  ├─ Simple refactoring (rename, extract function)
│  ├─ Documentation updates
│  ├─ Typo fixes
│  └─ Estimated tokens: 2K-10K

├─ Moderate (Sonnet 4.5 - 200K context) ✅ Default
│  ├─ Multi-file features (2-5 files)
│  ├─ API route creation with tests
│  ├─ Component development
│  ├─ Database schema changes
│  ├─ Test writing for existing code
│  ├─ Debugging complex issues
│  └─ Estimated tokens: 10K-50K

└─ Complex (Opus 4.5 - 200K context)
   ├─ Architecture design and planning
   ├─ Large refactoring (6+ files)
   ├─ System integration
   ├─ Performance optimization with profiling
   ├─ Complex algorithm design
   ├─ Security implementation (auth, rate limiting)
   └─ Estimated tokens: 50K-150K
```

---

### Token Prediction System

Use this formula to estimate token usage before starting work:

```typescript
// Token estimation components
const inputTokens = (
  (fileCount × averageLOC × 0.3) +  // Code context (1 token ≈ 3.3 chars)
  (conversationHistory × 100) +      // Chat history
  (documentationPages × 500)         // Reference docs/search results
)

const outputTokens = (
  taskComplexity === 'simple' ? 500 :
  taskComplexity === 'moderate' ? 2000 :
  5000  // complex
)

const totalEstimate = inputTokens + outputTokens
const withBuffer = totalEstimate × 1.25  // 25% safety margin
```

**Example Calculation:**
```typescript
// Task: Add new admin tab with CRUD operations (3 files, 200 LOC each)
const inputTokens = (3 × 200 × 0.3) + (10 × 100) + (1 × 500) = 180 + 1000 + 500 = 1,680
const outputTokens = 2000  // moderate complexity
const total = 1,680 + 2,000 = 3,680 tokens
const withBuffer = 3,680 × 1.25 = 4,600 tokens

// Result: Use Sonnet 4.5 (well within 50K moderate range)
```

---

### Decision Matrix

| Task Type | Model | Est. Tokens | Cost ($/1M) | Speed | Use When |
|-----------|-------|-------------|-------------|-------|----------|
| Typo fix | Haiku | 2K-5K | $0.80 | Fastest | Clear, isolated change |
| Bug fix (single file) | Haiku | 5K-10K | $0.80 | Fastest | Repro steps provided |
| New component | Sonnet 4.5 | 15K-30K | $3.00 | Fast | Standard patterns |
| Multi-file feature | Sonnet 4.5 | 30K-50K | $3.00 | Fast | 2-5 files affected |
| API + tests | Sonnet 4.5 | 20K-40K | $3.00 | Fast | CRUD operations |
| Architecture design | Opus 4.5 | 50K-100K | $15.00 | Balanced | System-wide decisions |
| Large refactor (6+ files) | Opus 4.5 | 80K-150K | $15.00 | Balanced | Cross-cutting changes |
| System integration | Opus 4.5 | 60K-120K | $15.00 | Balanced | Third-party services |

---

### Practical Examples (TBR-Specific)

#### Example 1: Fix TypeScript Error ✅ Haiku
```
Task: Fix "Property 'slug' does not exist on type 'Vendor'"
Files: 1 (lib/vendors.ts)
Complexity: Simple - add missing property

Token Estimation:
- Input: 80 LOC × 0.3 + 5 messages × 100 = 524 tokens
- Output: 500 tokens
- Total: 1,024 tokens (~$0.001)

Model: Haiku
Reasoning: Single file, clear error, straightforward fix
```

#### Example 2: Add New Email Notification ✅ Sonnet 4.5
```
Task: Create Brevo email template for quote acceptance
Files: 2 (api/accept-quote/route.ts, lib/email.ts)
Complexity: Moderate - follow established email patterns

Token Estimation:
- Input: 2 files × 150 LOC × 0.3 + 10 messages × 100 + 1 doc × 500 = 1,590 tokens
- Output: 2,000 tokens
- Total: 3,590 tokens (~$0.06)

Model: Sonnet 4.5
Reasoning: Established email pattern, 2 files, moderate complexity
```

#### Example 3: Build New Admin Tab ✅ Sonnet 4.5
```
Task: Create JobsTab component with quote management
Files: 3 (admin/JobsTab.tsx, admin/page.tsx, types)
Complexity: Moderate - follow ApplicationsTab/InquiriesTab patterns

Token Estimation:
- Input: 3 files × 250 LOC × 0.3 + 15 messages × 100 + 1 doc × 500 = 2,225 tokens
- Output: 2,500 tokens
- Total: 4,725 tokens (~$0.08)

Model: Sonnet 4.5
Reasoning: Established tab pattern, 3 files, moderate complexity
```

#### Example 4: Implement Rate Limiting (E6-1) ✅ Opus 4.5
```
Task: Add rate limiting across all API routes
Files: 8+ (middleware, all route files, config, tests)
Complexity: Complex - security feature, architectural decisions

Token Estimation:
- Input: 8 files × 200 LOC × 0.3 + 20 messages × 100 + 3 docs × 500 = 6,980 tokens
- Output: 5,000 tokens
- Total: 11,980 tokens (~$0.36)

Model: Opus 4.5
Reasoning: Security-critical feature affecting all API routes
```

#### Example 5: Refactor Database Schema ✅ Opus 4.5
```
Task: Normalize vendors table and update all queries
Files: 12+ (schema, API routes, components, types, lib)
Complexity: Complex - system-wide database changes

Token Estimation:
- Input: 12 files × 220 LOC × 0.3 + 30 messages × 100 + 2 docs × 500 = 5,792 tokens
- Output: 6,000 tokens
- Total: 11,792 tokens (~$0.48)

Model: Opus 4.5
Reasoning: Database changes affect entire application
```

#### Example 6: Debug Production Email Issue ✅ Sonnet 4.5 → Opus 4.5
```
Task: Investigate why vendor notification emails not sending
Files: Unknown scope initially
Complexity: Unknown - start moderate, escalate if needed

Token Estimation (initial):
- Input: 3 files × 150 LOC × 0.3 + 10 messages × 100 = 1,135 tokens
- Output: 2,000 tokens
- Total: 3,135 tokens (~$0.05 with Sonnet)

Model: Start with Sonnet 4.5, escalate to Opus if Brevo integration issues
Reasoning: Unknown scope, investigate first with Sonnet, escalate if complex
```

#### Example 7: Add Zod Validation (E6-5) ✅ Sonnet 4.5
```
Task: Add Zod schemas to inquiry, application, and job forms
Files: 3 (vendors/[slug]/page.tsx, vendors/register/page.tsx, jobs/create/page.tsx)
Complexity: Moderate - repetitive validation pattern

Token Estimation:
- Input: 3 files × 180 LOC × 0.3 + 10 messages × 100 + 1 doc × 500 = 1,662 tokens
- Output: 2,000 tokens
- Total: 3,662 tokens (~$0.06)

Model: Sonnet 4.5
Reasoning: Established Zod pattern, 3 forms, moderate complexity
```

---

### Integration Guidelines

#### When to Apply Model Selection

✅ **Always apply before:**
- Starting any story/epic task
- Spawning Task agents (specify model: `model: "haiku"`)
- Complex debugging sessions
- Reviewing PRs before merge
- Planning E6+ features

❌ **Skip for:**
- Quick documentation reads
- Exploratory codebase research
- Conversational questions

#### How to Document Model Choice

**In Commit Messages:**
```bash
feat(admin): Add jobs tab with quote management [Model: Sonnet 4.5]

- Created JobsTab component following InquiriesTab pattern
- Added quote display and status management
- Updated admin page navigation

Reasoning: Moderate complexity, 3 files, established patterns
Est. tokens: 4.7K | Cost: ~$0.08

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**In Branch Planning:**
```markdown
## E6-1: Rate Limiting

### Model Selection
- **Model:** Opus 4.5
- **Reasoning:** Security-critical, affects all 8 API routes, architectural decisions
- **Files:** middleware, routes, config, tests (8+ files)
- **Est. tokens:** 12K | **Cost:** ~$0.36
```

#### Override Mechanisms

**Budget Constraints:**
- Prioritize Haiku for simple E6 tasks (documentation, small fixes)
- Use Sonnet for most feature development
- Reserve Opus for E6 architecture (rate limiting, error logging, audit log)

**Time-Sensitive:**
- Use Opus for critical production bugs needing fast resolution
- Accept higher cost for faster feature delivery when needed
- Parallel Sonnet agents for independent stories

**Learning Tasks:**
- First implementation of pattern → Sonnet or Opus
- Repetitions of pattern → Haiku
- Example: First Brevo email → Sonnet, subsequent emails → Haiku

#### Automatic Decision Triggers

**TBR-Specific Triggers:**
- New admin tab → Sonnet 4.5 (established pattern)
- New email template → Haiku (if following existing) or Sonnet (if new pattern)
- Database table changes → Opus 4.5 (affects many files)
- New public page → Sonnet 4.5 (moderate complexity)
- Bug fix in single file → Haiku
- E6 epic planning → Opus 4.5 (architecture decisions)

---

### TBR Cost Optimization

**Current Development Phase: E6 (Production Hardening)**

Expected model distribution for E6:
- **Haiku (30%)**: Documentation updates, simple bug fixes, repetitive tasks
- **Sonnet 4.5 (60%)**: Most feature development, API routes, components
- **Opus 4.5 (10%)**: Architecture decisions (rate limiting, error logging, audit log)

**Estimated E6 Costs:**
- Average task: 20K tokens × $3.00/1M = $0.06 (Sonnet)
- E6 total (20 stories): ~$1.20-$2.00 with optimal model selection
- Without optimization: ~$3.00-$5.00 (60% cost savings)

---

## Code Quality Standards

### Before Every Commit

```bash
# 1. Type check
npm run build

# 2. Lint
npm run lint

# 3. Manual smoke test (if UI change)
npm run dev
# Test the changed feature manually
```

### Code Style

- **Max file length:** 500 lines (split into smaller files if exceeded)
- **Component size:** Keep React components < 300 lines
- **Function complexity:** Max 50 lines per function
- **Naming:** Descriptive names (no abbreviations unless obvious)
- **Comments:** Only for non-obvious logic (code should be self-documenting)

### TypeScript Standards

```typescript
// ✅ Do: Use strict types
interface VendorFormData {
  businessName: string
  specialty: string
  priceMin: number
  priceMax: number
}

// ❌ Don't: Use any
function handleSubmit(data: any) { ... }

// ✅ Do: Use Zod for runtime validation (coming in E6)
const vendorSchema = z.object({
  businessName: z.string().min(3).max(100),
  specialty: z.string().min(10),
  priceMin: z.number().positive(),
  priceMax: z.number().positive()
})

// ✅ Do: Use discriminated unions for status
type QuoteStatus = 'pending' | 'accepted' | 'rejected'

// ❌ Don't: Use magic strings
if (quote.status === 'accepted') { ... }  // OK
if (quote.status === 'approve') { ... }   // Typo, won't be caught
```

---

## Testing Strategy

### Current State (Manual Testing)

No automated tests yet. All testing is manual:

1. **Smoke tests** - Critical paths in `docs/backlog.md`
2. **Form validation** - Submit empty forms, check errors appear
3. **Email delivery** - Check Brevo dashboard or console logs
4. **Admin access** - Verify auth works, whitelist enforced

### Future (Post-E6)

- Integration tests for API routes (Vitest + Supertest)
- E2E tests for critical flows (Playwright)
- Unit tests for complex logic (Vitest)

**Don't write tests yet** — wait until product-market fit is validated.

---

## Database Operations

### Adding New Tables

1. Update `supabase-schema.sql` with new table DDL
2. Add TypeScript type to `src/lib/supabase.ts`
3. Run SQL in Supabase SQL editor (no migrations yet)
4. Update README with new table documentation

### Modifying Existing Tables

```sql
-- Example: Add new column
ALTER TABLE vendors ADD COLUMN photo_url TEXT;

-- Update TypeScript type
export interface Vendor {
  // ... existing fields
  photo_url?: string | null  // Optional, might be null
}
```

### RLS Policies

Current policies are permissive (world-readable/writable for MVP).

**Future (E6):** Tighten RLS policies:
- Vendors: only vendor owner can update
- Inquiries: only admin can read
- Jobs: only job owner can update

---

## API Route Patterns

### Standard API Route Structure

```typescript
// src/app/api/{resource}/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Force dynamic rendering (never static)
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // 1. Parse request body
    const body = await request.json()

    // 2. Validate input (add Zod in E6)
    if (!body.required_field) {
      return NextResponse.json(
        { error: 'Missing required_field' },
        { status: 400 }
      )
    }

    // 3. Database operation
    const { data, error } = await supabaseAdmin
      .from('table_name')
      .insert({ ...body })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Operation failed' },
        { status: 500 }
      )
    }

    // 4. Side effects (emails, logging, etc.)
    await sendEmail(...)

    // 5. Return success
    return NextResponse.json({ success: true, data })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Admin Routes (Protected)

```typescript
import { getCurrentAdmin } from '@/lib/admin'

export async function POST(request: NextRequest) {
  // 1. Verify admin session
  const admin = await getCurrentAdmin(request)
  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // 2. Log admin action (E6 will add audit log)
  console.log(`[ADMIN ACTION] ${admin.email} performed action`)

  // ... rest of route logic
}
```

---

## Email Template Guidelines

### Email Design Principles

1. **Mobile-first** - 90% of emails opened on mobile
2. **Inline styles** - Email clients strip `<style>` tags
3. **Brand colors** - Use `#F5C842` (yellow), `#3B2A1A` (brown)
4. **Clear CTAs** - One primary action per email
5. **Plain text fallback** - Always include (Brevo handles this)

### Email Template Structure

```typescript
const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: sans-serif; background-color: #FAFAF8;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
        <!-- Header -->
        <tr>
          <td style="padding: 40px; background: linear-gradient(135deg, #3B2A1A 0%, #6B4226 100%);">
            <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Email Title</h1>
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding: 40px; background-color: #ffffff;">
            <p style="margin: 0 0 16px; color: #1A1A1A; font-size: 16px;">
              Email content here...
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding: 24px 40px; background-color: #FAFAF8; border-top: 1px solid #E5E5E5;">
            <p style="margin: 0; color: #999999; font-size: 12px; text-align: center;">
              The Bean Route — Coffee Cart Marketplace<br>
              Melbourne, Australia
            </p>
          </td>
        </tr>
      </table>
    </body>
  </html>
`

await sendEmail(recipient, subject, html)
```

---

## Environment Variables

### Required for Development

```bash
# .env.local (never commit)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Server-only
BREVO_API_KEY=xkeysib-...              # Server-only
```

### Required for Vercel

Same variables as above, set in:
- Vercel Dashboard → Settings → Environment Variables
- Check **ALL** environments (Production + Preview + Development)

**Security Rules:**
- ✅ `NEXT_PUBLIC_*` = embedded in client bundle (safe for public)
- ❌ `SUPABASE_SERVICE_ROLE_KEY` = bypasses RLS (server-only, never NEXT_PUBLIC_)
- ❌ `BREVO_API_KEY` = sends emails (server-only, never NEXT_PUBLIC_)

---

## Common Tasks

### Add a New Email Notification

1. Create email template in API route
2. Call `sendEmail()` from `@/lib/email`
3. Test locally (check console logs if no BREVO_API_KEY)
4. Verify in Brevo dashboard after deploy

### Add a New Admin Tab

1. Create `{TabName}Tab.tsx` in `src/app/admin/`
2. Import in `src/app/admin/page.tsx`
3. Add tab to navigation array
4. Add tab content to conditional render
5. Test with authenticated admin session

### Add a New Database Table

1. Add SQL to `supabase-schema.sql`
2. Run SQL in Supabase SQL editor
3. Add TypeScript type to `src/lib/supabase.ts`
4. Create API route for CRUD operations
5. Update `docs/backlog.md` and `README.md`

### Debug Production Issues

1. Check Vercel logs (Runtime tab)
2. Verify env vars are set (Settings → Environment Variables)
3. Check Brevo dashboard for email delivery status
4. Check Supabase logs for query errors
5. Test locally with production env vars

---

## Deployment Checklist

### Before Pushing to Main

- [ ] `npm run build` passes
- [ ] `npm run lint` passes (or only warnings, no errors)
- [ ] Manual smoke test of changed feature
- [ ] Git commit message follows format
- [ ] No secrets committed (check `.env.local` in `.gitignore`)

### After Merging to Main

- [ ] Vercel build succeeds (check dashboard)
- [ ] Smoke test on production URL
- [ ] Check Sentry for new errors (once E6 complete)
- [ ] Update documentation if API changed

---

## Next Features to Build (Priority Order)

1. **E6-1: Google Auth Hardening** - Move sessions to database.
2. **E6-2: Database RLS** - Secure all tables with specific policies.
3. **E6-3: Rate Limiting** - Protect from registration/inquiry spam.

See `docs/AGILE_BACKLOG.md` for full epic breakdown.

---

## Getting Help

1. **"How do I...?"** → Check this file first
2. **"Build failing?"** → Read error message, check type errors
3. **"Deployment broken?"** → `docs/VERCEL-TROUBLESHOOTING.md`
4. **"Email not sending?"** → Check Brevo dashboard, verify API key
5. **"What's next?"** → `docs/backlog.md` for roadmap

---

## Common Pitfalls to Avoid

❌ **Don't** push directly to main (use branches)
❌ **Don't** skip the build before pushing
❌ **Don't** hardcode secrets in code
❌ **Don't** use `any` type in TypeScript
❌ **Don't** create files over 500 lines
❌ **Don't** add features without user validation first

✅ **Do** one story per branch
✅ **Do** run `npm run build` before every push
✅ **Do** use environment variables for secrets
✅ **Do** use strict TypeScript types
✅ **Do** split large files into smaller modules
✅ **Do** validate features with real users before building more

---

## Resources

- **Supabase Dashboard:** https://supabase.com/dashboard
- **Brevo Dashboard:** https://app.brevo.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Design System:** http://localhost:3000/design-system
- **Admin Portal:** http://localhost:3000/admin
