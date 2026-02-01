# CBW Coffee — Backlog & Workflow

## Current State

**Remote:** `https://github.com/overnightmvp/cbw-coffee-club.git`
**Branch:** `main` — all Sprints 0–3 shipped in a single commit.
**Lint:** clean. **Build:** passing.

| Sprint | Status | What shipped |
|---|---|---|
| Sprint 0 | ✅ Done | Rebrand (palette, tokens, header), deleted quiz + AI widget, docs |
| Sprint 1 | ✅ Done | Vendor data layer, landing page, inquiry modal, admin dashboard |
| Sprint 2 | ✅ Done | Vendor profile pages, contractor browsing page with filters |
| Sprint 3 | ✅ Done | 6 content pillar pages (contractors + vendors-guide) |
| S0-1 to S0-3 | ⏳ Pending | Fresh Supabase project + Vercel deploy (manual setup — see below) |
| S1-1 to S1-2 | ⏳ Pending | Real vendor data from Facebook group (10 placeholders in vendors.ts now) |
| S3-7 | ⏳ Pending | sitemap.xml generation |

---

## GitHub Worktrees Setup

CBW uses Git worktrees to allow parallel work on multiple features without context-switching costs.
All branches below are created from `main` and pushed to origin. Activate a worktree when you're ready to work on that stream.

### Repository

```
git clone https://github.com/overnightmvp/cbw-coffee-club.git cbw-coffee
cd cbw-coffee
```

### Branches (all created, all pushed)

| Branch | Purpose | Status |
|---|---|---|
| `main` | Production — deploys to Vercel | Active |
| `setup` | Supabase schema + env config | ⏳ Next up |
| `vendor-data` | Replace placeholder vendors with real FB data | ⏳ Next up |
| `sitemap` | sitemap.xml generation | ⏳ Backlog |
| `seo-meta` | Per-page meta tags (title, description, OG) | ⏳ Backlog |
| `vendor-photos` | Real vendor images replacing gradient placeholders | ⏳ Backlog |
| `lead-notifications` | Email vendor when inquiry submitted | ⏳ Backlog |

### Worktree Commands

```bash
# Activate a worktree when you need it
git worktree add ../setup setup
cd ../setup
# ... make changes ...
git add . && git commit -m "feat: add Supabase schema and env config"
git push origin setup

# Merge back to main (via PR or direct)
git checkout main
git merge setup --no-ff -m "merge: Supabase setup"
git push origin main

# Clean up
git worktree remove ../setup
```

### Branch Strategy

| Branch | Purpose | Merges Into | Deploy |
|---|---|---|---|
| `main` | Production | — | Vercel (auto) |
| `setup` | Supabase schema + env config | `main` | No |
| `vendor-data` | Real vendor records (from FB group) | `main` | Preview URL |
| `sitemap` | sitemap.xml generation | `main` | Preview URL |
| `seo-meta` | Per-page meta tags | `main` | Preview URL |
| `vendor-photos` | Real vendor images | `main` | Preview URL |
| `lead-notifications` | Vendor email on inquiry | `main` | No |

---

## Deployment

### Vercel Setup (one-time)

1. Go to vercel.com → Import Git repository
2. Framework: Next.js (auto-detected)
3. Root directory: `/` (default)
4. Build command: `npm run build` (default)
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` → from your fresh Supabase project
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → from your fresh Supabase project
6. Deploy. Production URL is live.

### Deploy Workflow

- Every merge to `main` auto-deploys to production
- Every branch push creates a Vercel Preview URL (shareable for review)
- No manual deploy steps after initial setup

---

## Agile Workflow

### Sprint Structure

Each sprint is **5 working days**. One person can run this solo. Sprints are small, focused, shippable.

---

### Sprint 0 — Foundation
**Goal:** Repo, Supabase, Vercel are live. Brand system is in place. Zero vendor data yet.

| ID | Task | Branch | Done When |
|---|---|---|---|
| S0-1 | Create fresh Supabase project, run vendors + inquiries schema | `setup` | Tables exist, RLS enabled |
| S0-2 | Update .env.local with new Supabase credentials | `setup` | App connects to new DB |
| S0-3 | Deploy to Vercel, confirm build passes | `setup` | Production URL works |
| S0-4 | Update Tailwind config with CBW brand palette | `rebrand` | Colors render correctly |
| S0-5 | Update design tokens (primary, neutrals, accents) | `rebrand` | All components use new palette |
| S0-6 | Update Header with CBW wordmark and nav links | `rebrand` | Header looks branded |
| S0-7 | Delete CompanyQuiz and AIChatWidget | `rebrand` | Components removed, no broken imports |
| S0-8 | Create docs/skills.md | `setup` | File exists at docs/skills.md |
| S0-9 | Create docs/backlog.md | `setup` | File exists at docs/backlog.md |

**Merge order:** `setup` → `main`, then `rebrand` → `main`

---

### Sprint 1 — Core Marketplace (Revenue Path)
**Goal:** Real vendors on the page. Contractors can submit inquiries. Leads land in admin.

| ID | Task | Branch | Done When |
|---|---|---|---|
| S1-1 | Gather raw vendor data from Facebook group (manual copy-paste) | — | 20–30 raw posts in a doc |
| S1-2 | Run Claude vendor structuring prompt → JSON vendor records | `vendors` | 10–20 valid vendor records |
| S1-3 | Create src/lib/vendors.ts with hardcoded vendor data | `vendors` | File exports getAllVendors(), getVendorBySlug() |
| S1-4 | Update Supabase types (replace Experience → Vendor, Booking → Inquiry) | `vendors` | Types compile, no errors |
| S1-5 | Rewrite landing page (hero, vendor carousel, how it works, CTA) | `landing` | Page renders with CBW content |
| S1-6 | Update HorizontalExperiences → VendorCarousel with vendor data | `landing` | Carousel shows real vendors |
| S1-7 | Rewrite SimpleBookingModal → InquiryModal (contractor fields) | `inquiry-flow` | Form submits to Supabase inquiries table |
| S1-8 | Update admin dashboard labels and fields for CBW | `admin` | Leads appear correctly in admin |
| S1-9 | Smoke test full flow: browse → inquire → check admin | `main` | End-to-end works |

**Merge order:** `vendors` → `main`, then `landing` + `inquiry-flow` → `main`, then `admin` → `main`

---

### Sprint 2 — Vendor Pages
**Goal:** Each vendor has a dedicated profile page. SEO foundation is in place.

| ID | Task | Branch | Done When |
|---|---|---|---|
| S2-1 | Create src/app/vendors/[slug]/page.tsx | `vendor-pages` | Dynamic route renders per vendor |
| S2-2 | Vendor page: full description, specialty, suburbs, price range, inquiry form | `vendor-pages` | All vendor info displayed |
| S2-3 | SEO meta tags per vendor page (title, description, OG) | `vendor-pages` | Each page has unique meta |
| S2-4 | Link vendor cards on landing page / carousel to their profile pages | `landing` | Click-through works |
| S2-5 | Rewrite src/app/app/page.tsx → contractor browsing page (filter by suburb/type/price) | `vendor-pages` | Filtering works |

**Merge order:** `vendor-pages` → `main`

---

### Sprint 3 — Content Pillars
**Goal:** Six content pages exist. SEO crawlability is solid.

| ID | Task | Branch | Done When |
|---|---|---|---|
| S3-1 | Create /contractors hub page | `content-pillars` | Page renders with links to guides |
| S3-2 | Create /contractors/how-to-hire guide | `content-pillars` | Full guide content, CTA to browse vendors |
| S3-3 | Create /contractors/coffee-cart-costs pricing guide | `content-pillars` | Realistic Melbourne pricing info |
| S3-4 | Create /vendors-guide hub page | `content-pillars` | Page renders with links to guides |
| S3-5 | Create /vendors-guide/get-listed onboarding guide | `content-pillars` | How to get on CBW |
| S3-6 | Create /vendors-guide/grow-your-business guide | `content-pillars` | Value prop for vendor listing |
| S3-7 | Add sitemap.xml generation | `content-pillars` | All pages indexed |

**Merge order:** `content-pillars` → `main`

---

### Post-Sprint: Revenue Activation

This is not a code task. It's a sales task.

1. Share the live site with 3–5 event planners / corporates in Melbourne
2. Share vendor listings with the vendors themselves (so they know they're listed)
3. Wait for first inquiry → manually connect vendor and contractor
4. When first inquiry converts to a booking → charge the vendor the lead fee
5. Iterate: add more vendors, improve listings based on what contractors actually search for

---

## Definition of Done (every task)

- [ ] Code compiles (`npm run build` passes)
- [ ] No lint errors (`npm run lint` passes)
- [ ] Feature works end-to-end (manual smoke test)
- [ ] Merged to `main` via PR (or direct merge for solo work)
- [ ] Vercel deploys successfully

---

## What We Are NOT Building (and why)

| Temptation | Why We're Skipping It |
|---|---|
| Search / filtering on landing page | Carousel + vendor pages handle discovery at this scale (10–20 vendors) |
| User accounts for contractors | Unnecessary friction. Anonymous inquiry is faster to revenue. |
| Payment processing | Lead fees invoiced manually. Stripe adds complexity we don't need yet. |
| AI recommendation engine | Manual curation of 10–20 vendors IS the recommendation at this scale. |
| Mobile app | Mobile-responsive web. No reason to build native for a marketplace MVP. |
| Automated vendor notifications | Email the vendor manually when an inquiry comes in. Automate in month 2. |
