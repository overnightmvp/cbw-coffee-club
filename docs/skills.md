# CBW Coffee — Project Skills

## What This Project Requires

CBW Coffee is a Melbourne mobile coffee cart marketplace. Two audiences: **Vendors** (coffee cart operators) and **Contractors** (event planners, corporates, venue managers who hire carts). The tech is a repurposed Next.js marketplace. The revenue is lead fees.

This document defines every skill needed to build, launch, and grow it.

---

## Core Skills (must have before launch)

| # | Skill | Why It's Needed |
|---|---|---|
| 1 | Next.js 14 / React 18 | Core framework. App Router, server components, dynamic routes for vendor pages. |
| 2 | TypeScript (strict) | Every file is typed. No JS. Enforced in tsconfig. |
| 3 | Tailwind CSS | All styling. Design tokens (colors, spacing, typography) drive the visual system. |
| 4 | Supabase | Fresh project. Tables: vendors, inquiries. RLS policies. Client SDK for form submissions. |
| 5 | Brand / Visual Design | Palette: White, Brown, Black, Yellow (#F5C842) accent. High fashion, modern casual. Editorial typography. Generous whitespace. |
| 6 | Melbourne Coffee Market Knowledge | Vendor vetting. Realistic pricing ($80–$350/hr range). Local terminology. Which suburbs actually have mobile cart demand. |

## Iterate-After-Launch Skills

| # | Skill | Why It's Needed |
|---|---|---|
| 7 | Content Copywriting | Landing page, vendor descriptions, 6 content pillar pages. Tone: warm, local, no fluff. Melbourne-proud. |
| 8 | SEO / Content Strategy | Pillar page structure targets: "mobile coffee cart Melbourne", "coffee cart hire Camberwell", "coffee cart for events". Month 2+ play. |
| 9 | Lead Gen / Sales | The revenue play. Outreach to first 3–5 contractors. Vendor onboarding and relationship. |
| 10 | Digital Asset Production | Wordmark, favicon, OG image, vendor placeholder image. All derivable from the brand palette — no illustrator needed. |

## One-Time Skills

| # | Skill | Why It's Needed |
|---|---|---|
| 11 | Prompt Engineering | Claude prompts to convert raw Facebook group posts → structured vendor JSON records. Used once during data seeding. |

---

## Critical Path

**Launch blocker:** Skills 1–6. Nothing ships without these.
**Week 2 priorities:** Skills 7, 8 (content makes the site findable).
**Revenue activation:** Skill 9 (someone has to actually talk to contractors).

## What This Project Does NOT Need

- Backend engineers (Supabase handles all data)
- DevOps (Vercel auto-deploys)
- Mobile app developers (mobile-responsive web is the strategy)
- Payment processing (lead fees are invoiced manually at MVP stage)
- AI/ML engineers (no recommendation engine at launch — manual curation)
