# TBR Operator Hub — System Manual & Operations

**Last Updated:** 2026-02-23
**Status:** Production Ready ✅

---

## 1. System Health & Infrastructure

### Current Environment
- **Framework:** Next.js 15+ (App Router)
- **Database:** Supabase (Real-time enabled for vendors, jobs, inquiries)
- **Email:** Brevo (Production key active, sender: `thebeanrouteau@gmail.com`)
- **CMS:** Payload CMS (Integration pending/active)

### Core Components
| Component | Status | Purpose |
|---|---|---|
| **Agile Backlog** | 🔴 View in Tab | Prioritized roadmap and brutal audit fixes |
| **User CJMs** | 🗺️ View in Tab | End-to-end maps for Vendor, Customer, Admin |
| **Design Guide**| 🎨 View in Tab | Style tokens, components, and visual rules |
| **Content Strategy**| 📈 View in Tab | SEO, blog topics, and conversion tactics |

---

## 2. Core Workflows (Owner manual)

### A. Vendor Registration
1. **Submit:** Vendor fills 3-step form at `/vendors/register`.
2. **Notification:** Vendor receives "Application Received" email; Admin receives "New Vendor Application" alert.
3. **Approval:** Admin reviews in `/dashboard` → clicks **Approve**.
4. **Result:** New vendor record created; Slug generated; Application status updated to `approved`.
5. **Final Touch:** Vendor receives "Welcome to TBR" email.

### B. Job Postings
1. **Post:** Customer posts job at `/jobs/create`.
2. **Notification:** Customer receives "Job Live" confirmation; Admin receives "New Job Posted" alert.
3. **Quotes:** Vendors browse `/jobs` and submit quotes.
4. **Interaction:** Customer receives email alert for every new quote.

### C. Market Inquiries
1. **Browse:** Planner finds vendor at `/app` or `/vendors/[slug]`.
2. **Submit:** Direct inquiry via "Get a Quote" modal.
3. **Notification:** Dual email sent (Vendor get inquiry details; Planner gets confirmation).

---

## 3. Communication Hub (Notifications)

| Trigger | Recipient | Subject | Status |
|---|---|---|---|
| New Application | Vendor | Application Received — [Business] | ✅ ACTIVE |
| New Application | Admin | NEW VENDOR APPLICATION: [Business] | ✅ ACTIVE |
| App Approved | Vendor | Application Approved — Welcome to TBR | ✅ ACTIVE |
| New Job | Customer | Job Live — [Title] | ✅ ACTIVE |
| New Job | Admin | NEW JOB POSTED: [Title] | ✅ ACTIVE |
| New Inquiry | Vendor | New Inquiry via Coffee Cart Marketplace | ✅ ACTIVE |
| New Inquiry | Customer | Inquiry confirmed — [Vendor] will be in touch | ✅ ACTIVE |
| New Quote | Customer | New quote from [Vendor] — [Title] | ✅ ACTIVE |

---

---

## 4. Security & Stability Guardrails

To protect against spam and unauthorized access, the following guardrails are active:

### A. Admin Authentication
- **Mechanism:** Passwordless OTP (One-Time Password) sent via email.
- **Persistence:** Codes are stored in the database (`admin_verification_codes`) with a 10-minute expiry.
- **Session:** Uses `iron-session` for **signed and encrypted cookies**. The session is tamper-proof and expires in 24 hours.
- **Logout:** Use `/api/dashboard/logout` to clear all session state.

### B. Rate Limiting
- **Global Protection:** A database-backed rate limiter (`check_rate_limit`) is applied to all public forms.
- **Limits:**
  - Vendor Registration: 3 per hour per IP.
  - Inquiries: 5 per hour per IP.
  - Job Creation: 3 per hour per IP.
  - Admin OTP requests: 5 per hour per IP.

### C. Database Lockdown (RLS)
- **Row Level Security:** Enabled on all core tables.
- **Access Control:** Public users can only `INSERT` (submit). `SELECT`, `UPDATE`, and `DELETE` are reserved for authenticated admins using the `service_role`.

---

## 5. Operational Checklist (Pre-Push)

Run these before every deployment to ensure stability.

1. **Build Check:** `npm run build` should pass with zero errors.
2. **Auth Verification:** Ensure `/admin` login sends the code successfully.
3. **Filter Test:** Home page `/app` should show both "Mobile Cart", "Coffee Shop", and "Independent Barista" entries.
4. **Workflow Test:** Submit a test inquiry on a demo vendor profile (Cart/Shop) or review a Barista profile.
5. **Mobile Responsive:** Check `/app` and `/vendors/register` on mobile-size screens.

---

## 5. Future Roadmap

### Phase 4: Quote Acceptance (Priority 1)
- [ ] Allow job owners to click "Accept Quote" in `/jobs/[id]`.
- [ ] Email vendor upon acceptance.
- [ ] Mark job as closed/booked.

### Phase 5: Regional Expansion
- [ ] Launch state-specific hubs for WA, SA, and NSW.
- [ ] Implement geography-aware SEO landing pages.

### Phase 6: Automated Operations
- [ ] Integration with Payload CMS for automated blog publishing.
- [ ] Weekly performance reports for the operator.
